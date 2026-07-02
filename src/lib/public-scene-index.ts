export const PUBLIC_SCENE_INDEX_FORBIDDEN_KEYS = [
	'source_type',
	'import_source',
	'verification_notes',
	'verification_status',
	'review_queue',
	'maintenance',
	'event_imports',
	'confidence',
	'raw_text',
	'admin_notes',
	'parsed_payload',
	'duplicate_candidates',
	'submitter_user_id',
	'event_id',
	'slug',
	'title'
] as const;

export type PublicSceneIndexCityStat = {
	city: string;
	upcoming_count: number;
	this_week_count: number;
};

export type PublicSceneIndexGenreStat = {
	tag: string;
	upcoming_count: number;
};

export type PublicSceneIndexEventTypeStat = {
	event_type: string;
	upcoming_count: number;
};

export type PublicSceneIndexStats = {
	generated_at: string;
	upcoming_event_count: number;
	live_now_event_count: number;
	active_event_count: number;
	events_this_week: number;
	events_this_month: number;
	verified_upcoming_event_count: number;
	by_city: PublicSceneIndexCityStat[];
	by_genre: PublicSceneIndexGenreStat[];
	by_event_type: PublicSceneIndexEventTypeStat[];
};

export type PublicSceneIndexFetchResult = {
	sceneIndex: PublicSceneIndexStats | null;
	unavailable: boolean;
};

export type CitySceneCounts = {
	upcomingCount: number;
	thisWeekCount: number;
};

export type GenreSceneCounts = {
	upcomingCount: number;
};

function readNonNegativeCount(value: unknown): number {
	if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
		return 0;
	}

	return Math.floor(value);
}

function readCityStat(value: unknown): PublicSceneIndexCityStat | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	const source = value as Record<string, unknown>;
	const city = source.city;

	if (typeof city !== 'string' || !city.trim()) {
		return null;
	}

	return {
		city: city.trim(),
		upcoming_count: readNonNegativeCount(source.upcoming_count),
		this_week_count: readNonNegativeCount(source.this_week_count)
	};
}

function readGenreStat(value: unknown): PublicSceneIndexGenreStat | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	const source = value as Record<string, unknown>;
	const tag = source.tag;

	if (typeof tag !== 'string' || !tag.trim()) {
		return null;
	}

	return {
		tag: tag.trim(),
		upcoming_count: readNonNegativeCount(source.upcoming_count)
	};
}

function readEventTypeStat(value: unknown): PublicSceneIndexEventTypeStat | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	const source = value as Record<string, unknown>;
	const eventType = source.event_type;

	if (typeof eventType !== 'string' || !eventType.trim()) {
		return null;
	}

	return {
		event_type: eventType.trim(),
		upcoming_count: readNonNegativeCount(source.upcoming_count)
	};
}

function readStatArray<T>(value: unknown, reader: (entry: unknown) => T | null): T[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value.map(reader).filter((entry): entry is T => entry !== null);
}

export function containsForbiddenPublicSceneIndexKeys(value: unknown): string | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	for (const key of Object.keys(value)) {
		if ((PUBLIC_SCENE_INDEX_FORBIDDEN_KEYS as readonly string[]).includes(key)) {
			return key;
		}
	}

	return null;
}

export function normalizeSceneIndexCity(city: string): string {
	return city.trim().toLowerCase();
}

export function normalizeSceneIndexTag(tag: string): string {
	return tag.trim().toLowerCase();
}

export function genreTagMatchesMatcher(tag: string, matcher: string): boolean {
	const normalizedTag = normalizeSceneIndexTag(tag);
	const normalizedMatcher = matcher.trim().toLowerCase();

	if (!normalizedTag || !normalizedMatcher) {
		return false;
	}

	return normalizedTag.includes(normalizedMatcher) || normalizedMatcher.includes(normalizedTag);
}

export function resolveCitySceneCounts(
	byCity: PublicSceneIndexCityStat[],
	matchCity: (normalizedCity: string) => boolean
): CitySceneCounts {
	let upcomingCount = 0;
	let thisWeekCount = 0;

	for (const row of byCity) {
		if (!matchCity(normalizeSceneIndexCity(row.city))) {
			continue;
		}

		upcomingCount += row.upcoming_count;
		thisWeekCount += row.this_week_count;
	}

	return { upcomingCount, thisWeekCount };
}

export function resolveGenreSceneCounts(
	byGenre: PublicSceneIndexGenreStat[],
	matchers: string[]
): GenreSceneCounts {
	let upcomingCount = 0;

	for (const row of byGenre) {
		const matches = matchers.some((matcher) => genreTagMatchesMatcher(row.tag, matcher));
		if (!matches) {
			continue;
		}

		upcomingCount += row.upcoming_count;
	}

	return { upcomingCount };
}

export function formatSceneIndexGeneratedAt(value: string | null | undefined): string | null {
	if (!value?.trim()) {
		return null;
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date.toLocaleString('en-AU', {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone: 'UTC'
	});
}

export function parsePublicSceneIndexStats(value: unknown): PublicSceneIndexStats | null {
	const forbiddenKey = containsForbiddenPublicSceneIndexKeys(value);
	if (forbiddenKey) {
		return null;
	}

	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	const source = value as Record<string, unknown>;
	const generatedAt = source.generated_at;

	if (typeof generatedAt !== 'string' || !generatedAt.trim()) {
		return null;
	}

	const upcomingEventCount = readNonNegativeCount(source.upcoming_event_count);
	const liveNowEventCount = readNonNegativeCount(source.live_now_event_count);
	const activeEventCount = readNonNegativeCount(source.active_event_count);

	return {
		generated_at: generatedAt,
		upcoming_event_count: upcomingEventCount,
		live_now_event_count: liveNowEventCount,
		active_event_count:
			activeEventCount > 0 ? activeEventCount : upcomingEventCount + liveNowEventCount,
		events_this_week: readNonNegativeCount(source.events_this_week),
		events_this_month: readNonNegativeCount(source.events_this_month),
		verified_upcoming_event_count: readNonNegativeCount(source.verified_upcoming_event_count),
		by_city: readStatArray(source.by_city, readCityStat),
		by_genre: readStatArray(source.by_genre, readGenreStat),
		by_event_type: readStatArray(source.by_event_type, readEventTypeStat)
	};
}
