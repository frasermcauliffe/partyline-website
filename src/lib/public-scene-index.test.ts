import { describe, expect, it } from 'vitest';
import {
	buildDirectoryStats,
	buildDirectoryStatsFromSceneIndex,
	buildSceneSnapshotFromSceneIndex
} from '@/lib/event-directory-stats';
import {
	containsForbiddenPublicSceneIndexKeys,
	formatSceneIndexGeneratedAt,
	parsePublicSceneIndexStats,
	PUBLIC_SCENE_INDEX_FORBIDDEN_KEYS,
	resolveCitySceneCounts,
	resolveGenreSceneCounts
} from '@/lib/public-scene-index';

function validSceneIndexPayload(overrides: Record<string, unknown> = {}) {
	return {
		generated_at: '2026-06-15T12:00:00.000Z',
		upcoming_event_count: 10,
		live_now_event_count: 2,
		active_event_count: 12,
		events_this_week: 5,
		events_this_month: 18,
		verified_upcoming_event_count: 3,
		by_city: [
			{ city: 'Perth', upcoming_count: 8, this_week_count: 3 },
			{ city: 'Fremantle', upcoming_count: 2, this_week_count: 1 }
		],
		by_genre: [
			{ tag: 'techno', upcoming_count: 4 },
			{ tag: 'drum and bass', upcoming_count: 2 },
			{ tag: 'dnb', upcoming_count: 1 }
		],
		by_event_type: [{ event_type: 'Club Night', upcoming_count: 6 }],
		...overrides
	};
}

describe('parsePublicSceneIndexStats', () => {
	it('accepts a valid payload', () => {
		const parsed = parsePublicSceneIndexStats(validSceneIndexPayload());

		expect(parsed?.active_event_count).toBe(12);
		expect(parsed?.by_city).toHaveLength(2);
	});

	it('rejects payloads with forbidden keys', () => {
		for (const key of PUBLIC_SCENE_INDEX_FORBIDDEN_KEYS) {
			expect(parsePublicSceneIndexStats(validSceneIndexPayload({ [key]: 'leak' }))).toBeNull();
		}
	});

	it('normalizes missing and invalid fields safely', () => {
		const parsed = parsePublicSceneIndexStats({
			generated_at: '2026-06-15T12:00:00.000Z',
			upcoming_event_count: -1,
			live_now_event_count: 'bad',
			active_event_count: 0,
			events_this_week: undefined,
			verified_upcoming_event_count: 2.8
		});

		expect(parsed).toMatchObject({
			upcoming_event_count: 0,
			live_now_event_count: 0,
			active_event_count: 0,
			events_this_week: 0,
			verified_upcoming_event_count: 2
		});
	});

	it('derives active_event_count from upcoming and live_now when active is zero', () => {
		const parsed = parsePublicSceneIndexStats(
			validSceneIndexPayload({
				upcoming_event_count: 7,
				live_now_event_count: 3,
				active_event_count: 0
			})
		);

		expect(parsed?.active_event_count).toBe(10);
	});
});

describe('resolveCitySceneCounts', () => {
	it('sums Perth and Fremantle for a Perth metro matcher', () => {
		const parsed = parsePublicSceneIndexStats(validSceneIndexPayload());
		expect(parsed).not.toBeNull();

		const counts = resolveCitySceneCounts(
			parsed!.by_city,
			(city) => city.includes('perth') || city.includes('fremantle')
		);

		expect(counts).toEqual({ upcomingCount: 10, thisWeekCount: 4 });
	});
});

describe('resolveGenreSceneCounts', () => {
	it('sums matching tags across matchers', () => {
		const parsed = parsePublicSceneIndexStats(validSceneIndexPayload());
		expect(parsed).not.toBeNull();

		const counts = resolveGenreSceneCounts(parsed!.by_genre, ['drum', 'dnb', 'jungle']);

		expect(counts.upcomingCount).toBe(3);
	});
});

describe('formatSceneIndexGeneratedAt', () => {
	it('formats valid timestamps without crashing', () => {
		expect(formatSceneIndexGeneratedAt('2026-06-15T12:00:00.000Z')).toBeTruthy();
		expect(formatSceneIndexGeneratedAt('not-a-date')).toBeNull();
		expect(formatSceneIndexGeneratedAt(null)).toBeNull();
	});
});

describe('buildDirectoryStatsFromSceneIndex', () => {
	it('uses snapshot mode when scene index is available', () => {
		const stats = buildDirectoryStatsFromSceneIndex(
			{
				sceneIndex: parsePublicSceneIndexStats(validSceneIndexPayload()),
				unavailable: false
			},
			{ events: [], unavailable: false }
		);

		expect(stats.mode).toBe('snapshot');
		expect(stats.items.map((item) => item.label)).toEqual([
			'Active listings',
			'Live now',
			'This week',
			'Verified listings'
		]);
		expect(stats.note).toContain('PartyLine listings snapshot');
		expect(stats.note).not.toMatch(/top DJs|most popular|market share|ranked/i);
	});

	it('falls back when scene index is unavailable', () => {
		const stats = buildDirectoryStatsFromSceneIndex(
			{ sceneIndex: null, unavailable: true },
			{ events: [], unavailable: true }
		);

		expect(stats.mode).toBe('soft');
	});

	it('builds neutral scene snapshot cards without ranking copy', () => {
		const cards = buildSceneSnapshotFromSceneIndex(
			{
				sceneIndex: parsePublicSceneIndexStats(validSceneIndexPayload()),
				unavailable: false
			},
			{ events: [], unavailable: false }
		);

		expect(cards.map((card) => card.title)).toEqual([
			'Active listings',
			'This week',
			'This month',
			'Verified listings'
		]);

		const joined = cards.map((card) => `${card.title} ${card.description}`).join(' ');
		expect(joined).not.toMatch(/top DJs|most popular|market share|#1 city|ranked/i);
	});
});

describe('containsForbiddenPublicSceneIndexKeys', () => {
	it('flags sensitive keys', () => {
		expect(containsForbiddenPublicSceneIndexKeys({ verification_status: { stale: 1 } })).toBe(
			'verification_status'
		);
	});
});

describe('preview fallback stats', () => {
	it('keeps computed preview mode when scene index unavailable but events exist', () => {
		const stats = buildDirectoryStatsFromSceneIndex(
			{ sceneIndex: null, unavailable: true },
			{
				events: [
					{
						id: '1',
						slug: 'event',
						title: 'Event',
						heroImageUrl: null,
						date: 'Sat',
						time: '8pm',
						city: 'Perth',
						venue: 'Venue',
						genres: ['techno'],
						appUrl: 'https://example.com/events/event'
					}
				],
				unavailable: false
			}
		);

		expect(stats.mode).toBe('computed');
		expect(stats.items[0]?.label).toBe('Upcoming in preview');
	});
});
