import type { PublicEventPreview } from '@/lib/app-preview-types';

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
	return events.filter((event) =>
		event.genres.some((genre) => {
			const normalized = genre.toLowerCase();
			return matchers.some((matcher) => normalized.includes(matcher));
		})
	).length;
}

export type DirectoryStatItem = {
	label: string;
	value?: string;
};

export type DirectoryStats = {
	mode: 'computed' | 'soft';
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
				title: 'Most active city',
				value: 'Perth-first',
				description: 'Perth listings lead today as the network grows across Australia.'
			},
			{
				title: 'This weekend',
				value: 'Browse in app',
				description: 'Open PartyLine for date filters including this weekend and next 7 days.'
			},
			{
				title: 'Genres on the line',
				value: 'Growing',
				description: 'Underground genres appear as organisers submit and tag their events.'
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
			? genres.map((entry) => entry.genre).join(', ')
			: 'Tagging expands as listings grow';

	return [
		{
			title: 'Most active city (preview)',
			value: activeCity?.city ?? 'Perth',
			description: activeCity
				? `${activeCity.count} upcoming event${activeCity.count === 1 ? '' : 's'} in the current public preview.`
				: 'Perth-first listings lead as more cities join.'
		},
		{
			title: 'This weekend',
			value: 'Browse in app',
			description: 'Use date filters in the app for this weekend, tonight and the next 7 days.'
		},
		{
			title: 'Top genres (preview)',
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
