import type { PublicEventPreview, PublicEventsFetchResult } from '@/lib/app-preview-types';
import {
	formatSceneIndexGeneratedAt,
	resolveCitySceneCounts,
	resolveGenreSceneCounts,
	type PublicSceneIndexFetchResult,
	type PublicSceneIndexStats
} from '@/lib/public-scene-index';
import {
	SCENE_SNAPSHOT_HEADING,
	SCENE_SNAPSHOT_LEDE,
	SCENE_SNAPSHOT_PREVIEW_NOTE
} from '@/lib/event-landing-data';

export function normalizeCity(city: string): string {
	return city.trim().toLowerCase();
}

export function countEventsMatchingCity(
	events: PublicEventPreview[],
	matcher: (normalized: string) => boolean
): number {
	return events.filter((event) => matcher(normalizeCity(event.city))).length;
}

export function countUniqueCities(events: PublicEventPreview[]): number {
	return new Set(events.map((event) => normalizeCity(event.city)).filter(Boolean)).size;
}

export function countUniqueGenres(events: PublicEventPreview[]): number {
	return new Set(
		events
			.flatMap((event) => event.genres.map((genre) => genre.trim().toLowerCase()))
			.filter(Boolean)
	).size;
}

export function topCity(events: PublicEventPreview[]): { city: string; count: number } | null {
	if (events.length === 0) {
		return null;
	}

	const counts = new Map<string, { label: string; count: number }>();

	for (const event of events) {
		const key = normalizeCity(event.city);
		if (!key) {
			continue;
		}

		const existing = counts.get(key);
		if (existing) {
			existing.count += 1;
		} else {
			counts.set(key, { label: event.city.trim(), count: 1 });
		}
	}

	let best: { city: string; count: number } | null = null;

	for (const entry of counts.values()) {
		if (!best || entry.count > best.count) {
			best = { city: entry.label, count: entry.count };
		}
	}

	return best;
}

export function topGenres(
	events: PublicEventPreview[],
	limit = 3
): { genre: string; count: number }[] {
	const counts = new Map<string, { label: string; count: number }>();

	for (const event of events) {
		for (const genre of event.genres) {
			const key = genre.trim().toLowerCase();
			if (!key) {
				continue;
			}

			const existing = counts.get(key);
			if (existing) {
				existing.count += 1;
			} else {
				counts.set(key, { label: genre.trim(), count: 1 });
			}
		}
	}

	return [...counts.values()]
		.sort((a, b) => b.count - a.count)
		.slice(0, limit)
		.map((entry) => ({ genre: entry.label, count: entry.count }));
}

export function countEventsMatchingGenres(
	events: PublicEventPreview[],
	matchers: string[]
): number {
	return filterEventsByGenres(events, matchers).length;
}

export function filterEventsByCity(
	events: PublicEventPreview[],
	matcher: (normalizedCity: string) => boolean
): PublicEventPreview[] {
	return events.filter((event) => matcher(normalizeCity(event.city)));
}

export function filterEventsByGenres(
	events: PublicEventPreview[],
	matchers: string[]
): PublicEventPreview[] {
	return events.filter((event) =>
		event.genres.some((genre) => {
			const normalized = genre.toLowerCase();
			return matchers.some((matcher) => normalized.includes(matcher));
		})
	);
}

export function filterEventsByGenreConfig(
	events: PublicEventPreview[],
	matchGenres: string[],
	matchEventType?: (eventType: string | undefined) => boolean
): PublicEventPreview[] {
	return events.filter((event) => {
		const genreMatch = event.genres.some((genre) => {
			const normalized = genre.toLowerCase();
			return matchGenres.some((matcher) => normalized.includes(matcher));
		});

		const typeMatch = matchEventType?.(event.eventType) ?? false;

		return genreMatch || typeMatch;
	});
}

export type DirectoryStatItem = {
	label: string;
	value?: string;
};

export type DirectoryStats = {
	mode: 'computed' | 'soft' | 'snapshot';
	items: DirectoryStatItem[];
	note?: string;
};

export function buildDirectoryStats(
	events: PublicEventPreview[],
	unavailable: boolean
): DirectoryStats {
	if (events.length === 0) {
		return {
			mode: 'soft',
			items: [
				{ label: 'Perth-first' },
				{ label: 'Updated from PartyLine listings' },
				{ label: 'Event submissions open' },
				{ label: 'Profiles and events connected' }
			],
			note: unavailable
				? 'Live previews could not be loaded during the last site build. The app may still have current listings.'
				: 'Public listings preview — open the app for the full calendar.'
		};
	}

	const upcomingValue = events.length >= 24 ? '24+' : String(events.length);

	return {
		mode: 'computed',
		items: [
			{ label: 'Upcoming in preview', value: upcomingValue },
			{ label: 'Cities in preview', value: String(countUniqueCities(events)) },
			{ label: 'Genres tagged', value: String(countUniqueGenres(events)) },
			{ label: 'Listing source', value: 'PartyLine app' }
		],
		note: 'From current public listings preview — not a full platform total. Open the app for filters and the full calendar.'
	};
}

export type SceneSnapshotCard = {
	title: string;
	value: string;
	description: string;
};

export function buildSceneSnapshot(
	events: PublicEventPreview[],
	unavailable: boolean
): SceneSnapshotCard[] {
	if (events.length === 0 || unavailable) {
		return [
			{
				title: 'City focus (preview)',
				value: 'Perth-first',
				description:
					'In the current public preview sample, Perth-first listings appear as the network grows across Australia.'
			},
			{
				title: 'This weekend',
				value: 'Browse in app',
				description: 'Open PartyLine for date filters including this weekend and next 7 days.'
			},
			{
				title: 'Genres in preview',
				value: 'Growing',
				description:
					'In the current public preview sample, underground genres appear as organisers submit and tag their events.'
			},
			{
				title: 'Submissions',
				value: 'Open',
				description: 'Organisers can submit events in the app — reviewed and published on PartyLine.'
			}
		];
	}

	const activeCity = topCity(events);
	const genres = topGenres(events, 3);
	const genreSummary =
		genres.length > 0
			? `In the current public preview sample: ${genres.map((entry) => entry.genre).join(', ')}.`
			: 'In the current public preview sample, tagging expands as listings grow.';

	return [
		{
			title: 'City focus (preview)',
			value: activeCity?.city ?? 'Perth',
			description: activeCity
				? `In the current public preview sample, ${activeCity.count} upcoming event${activeCity.count === 1 ? '' : 's'} in ${activeCity.city}.`
				: 'In the current public preview sample, Perth-first listings appear as more cities join.'
		},
		{
			title: 'This weekend',
			value: 'Browse in app',
			description: 'Use date filters in the app for this weekend, tonight and the next 7 days.'
		},
		{
			title: 'Genres in preview',
			value: genres[0]?.genre ?? 'Mixed',
			description: genreSummary
		},
		{
			title: 'Submissions',
			value: 'Open',
			description: 'Organiser submissions, admin-added listings and partner events feed the directory.'
		}
	];
}

function buildSnapshotNote(sceneIndex: PublicSceneIndexStats): string {
	const updated = formatSceneIndexGeneratedAt(sceneIndex.generated_at);
	const updatedCopy = updated ? ` Updated ${updated}.` : '';

	return `${SCENE_SNAPSHOT_HEADING}.${updatedCopy} ${SCENE_SNAPSHOT_LEDE} ${SCENE_SNAPSHOT_PREVIEW_NOTE} — sample of upcoming listings.`;
}

export function buildDirectoryStatsFromSceneIndex(
	sceneResult: PublicSceneIndexFetchResult,
	eventsResult: PublicEventsFetchResult
): DirectoryStats {
	if (sceneResult.sceneIndex && !sceneResult.unavailable) {
		const sceneIndex = sceneResult.sceneIndex;

		return {
			mode: 'snapshot',
			items: [
				{ label: 'Active listings', value: String(sceneIndex.active_event_count) },
				{ label: 'Live now', value: String(sceneIndex.live_now_event_count) },
				{ label: 'This week', value: String(sceneIndex.events_this_week) },
				{
					label: 'Verified listings',
					value: String(sceneIndex.verified_upcoming_event_count)
				}
			],
			note: buildSnapshotNote(sceneIndex)
		};
	}

	return buildDirectoryStats(eventsResult.events, eventsResult.unavailable || sceneResult.unavailable);
}

export function buildSceneSnapshotFromSceneIndex(
	sceneResult: PublicSceneIndexFetchResult,
	eventsResult: PublicEventsFetchResult
): SceneSnapshotCard[] {
	if (sceneResult.sceneIndex && !sceneResult.unavailable) {
		const sceneIndex = sceneResult.sceneIndex;
		const updated = formatSceneIndexGeneratedAt(sceneIndex.generated_at);
		const updatedSuffix = updated ? ` Updated ${updated}.` : '';

		return [
			{
				title: 'Active listings',
				value: String(sceneIndex.active_event_count),
				description: `${SCENE_SNAPSHOT_HEADING}.${updatedSuffix} Upcoming and live listings currently tracked by PartyLine.`
			},
			{
				title: 'This week',
				value: String(sceneIndex.events_this_week),
				description:
					'Published listings with a start time in the current UTC week window.'
			},
			{
				title: 'This month',
				value: String(sceneIndex.events_this_month),
				description:
					'Published listings with a start time in the current UTC month window.'
			},
			{
				title: 'Verified listings',
				value: String(sceneIndex.verified_upcoming_event_count),
				description:
					'Active listings verified by PartyLine. Verification is editorial — not a popularity ranking.'
			}
		];
	}

	return buildSceneSnapshot(eventsResult.events, eventsResult.unavailable || sceneResult.unavailable);
}

export type TrackedEventFormat = {
	eventType: string;
	listingCount: number;
};

export type TrackedEventFormatsResult = {
	formats: TrackedEventFormat[];
	generatedAt: string | null;
};

const TRACKED_EVENT_FORMATS_LIMIT = 5;

export function buildTrackedEventFormats(
	sceneResult: PublicSceneIndexFetchResult
): TrackedEventFormatsResult | null {
	if (sceneResult.unavailable || !sceneResult.sceneIndex) {
		return null;
	}

	const formats = sceneResult.sceneIndex.by_event_type
		.filter((entry) => entry.event_type.trim() && entry.upcoming_count > 0)
		.sort((a, b) => b.upcoming_count - a.upcoming_count)
		.slice(0, TRACKED_EVENT_FORMATS_LIMIT)
		.map((entry) => ({
			eventType: entry.event_type.trim(),
			listingCount: entry.upcoming_count
		}));

	if (formats.length === 0) {
		return null;
	}

	return {
		formats,
		generatedAt: sceneResult.sceneIndex.generated_at
	};
}

export type HomeSceneIndexTeaserResult = {
	stats: DirectoryStats | null;
	showUnavailableCallout: boolean;
};

export function buildHomeSceneIndexTeaser(
	sceneResult: PublicSceneIndexFetchResult
): HomeSceneIndexTeaserResult {
	if (sceneResult.sceneIndex && !sceneResult.unavailable) {
		const sceneIndex = sceneResult.sceneIndex;
		const updated = formatSceneIndexGeneratedAt(sceneIndex.generated_at);
		const updatedCopy = updated ? ` Updated ${updated}.` : '';

		return {
			stats: {
				mode: 'snapshot',
				items: [
					{ label: 'Active listings', value: String(sceneIndex.active_event_count) },
					{ label: 'This week', value: String(sceneIndex.events_this_week) },
					{ label: 'Live now', value: String(sceneIndex.live_now_event_count) },
					{
						label: 'Verified listings',
						value: String(sceneIndex.verified_upcoming_event_count)
					}
				],
				note: `${SCENE_SNAPSHOT_HEADING}.${updatedCopy} Currently tracked by PartyLine. Open the app for the full calendar. ${SCENE_SNAPSHOT_PREVIEW_NOTE}.`
			},
			showUnavailableCallout: false
		};
	}

	return {
		stats: null,
		showUnavailableCallout: sceneResult.unavailable
	};
}

export type GlobalSceneStats = {
	activeCount: number;
	thisWeekCount: number;
	generatedAt: string | null;
	unavailable: boolean;
};

export function buildGlobalSceneStats(
	sceneResult: PublicSceneIndexFetchResult
): GlobalSceneStats | null {
	if (sceneResult.unavailable || !sceneResult.sceneIndex) {
		return null;
	}

	const sceneIndex = sceneResult.sceneIndex;

	return {
		activeCount: sceneIndex.active_event_count,
		thisWeekCount: sceneIndex.events_this_week,
		generatedAt: sceneIndex.generated_at,
		unavailable: false
	};
}

export type LandingSceneStats = {
	kind: 'city' | 'genre';
	label: string;
	upcomingCount: number;
	thisWeekCount: number | null;
	generatedAt: string | null;
	unavailable: boolean;
};

export function buildLandingSceneStats(input: {
	kind: 'city' | 'genre';
	label: string;
	sceneResult: PublicSceneIndexFetchResult;
	matchCity?: (normalizedCity: string) => boolean;
	matchGenres?: string[];
}): LandingSceneStats | null {
	if (input.sceneResult.unavailable || !input.sceneResult.sceneIndex) {
		return null;
	}

	const sceneIndex = input.sceneResult.sceneIndex;

	if (input.kind === 'city' && input.matchCity) {
		const counts = resolveCitySceneCounts(sceneIndex.by_city, input.matchCity);

		return {
			kind: 'city',
			label: input.label,
			upcomingCount: counts.upcomingCount,
			thisWeekCount: counts.thisWeekCount,
			generatedAt: sceneIndex.generated_at,
			unavailable: false
		};
	}

	if (input.kind === 'genre' && input.matchGenres) {
		const counts = resolveGenreSceneCounts(sceneIndex.by_genre, input.matchGenres);

		return {
			kind: 'genre',
			label: input.label,
			upcomingCount: counts.upcomingCount,
			thisWeekCount: null,
			generatedAt: sceneIndex.generated_at,
			unavailable: false
		};
	}

	return null;
}

export function formatDirectoryCityBadge(
	entry: {
		match?: (normalizedCity: string) => boolean;
		status: 'active' | 'opening' | 'coming';
	},
	previewEvents: PublicEventPreview[],
	sceneResult: PublicSceneIndexFetchResult
): string {
	if (entry.match && sceneResult.sceneIndex && !sceneResult.unavailable) {
		const counts = resolveCitySceneCounts(sceneResult.sceneIndex.by_city, entry.match);
		if (counts.upcomingCount > 0) {
			return `${counts.upcomingCount} upcoming`;
		}
	}

	if (entry.match) {
		const previewCount = countEventsMatchingCity(previewEvents, entry.match);
		if (previewCount > 0) {
			return `${previewCount} in preview`;
		}
	}

	if (entry.status === 'active') {
		return 'Active now';
	}

	if (entry.status === 'opening') {
		return 'Opening';
	}

	return 'Coming next';
}

export function formatDirectoryGenreBadge(
	entry: { matchers?: string[] },
	previewEvents: PublicEventPreview[],
	sceneResult: PublicSceneIndexFetchResult
): string | undefined {
	if (entry.matchers?.length && sceneResult.sceneIndex && !sceneResult.unavailable) {
		const counts = resolveGenreSceneCounts(sceneResult.sceneIndex.by_genre, entry.matchers);
		if (counts.upcomingCount > 0) {
			return `${counts.upcomingCount} upcoming`;
		}
	}

	if (!entry.matchers?.length) {
		return undefined;
	}

	const previewCount = countEventsMatchingGenres(previewEvents, entry.matchers);
	return previewCount > 0 ? `${previewCount} in preview` : undefined;
}
