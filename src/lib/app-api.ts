import { APP_URL } from '@/data/app-links';
import type {
	PublicEventPreview,
	PublicEventsFetchResult,
	PublicListingPreview,
	PublicListingsFetchResult,
	PublicListingType
} from '@/lib/app-preview-types';

const FETCH_TIMEOUT_MS = 10_000;

function getAppApiBaseUrl(): string {
	const configured = import.meta.env.PUBLIC_APP_API_URL?.trim();
	return (configured || APP_URL).replace(/\/$/, '');
}

function isPublicEventPreview(value: unknown): value is PublicEventPreview {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const row = value as Record<string, unknown>;

	return (
		typeof row.id === 'string' &&
		typeof row.slug === 'string' &&
		typeof row.title === 'string' &&
		typeof row.date === 'string' &&
		typeof row.time === 'string' &&
		typeof row.city === 'string' &&
		typeof row.venue === 'string' &&
		Array.isArray(row.genres) &&
		typeof row.appUrl === 'string' &&
		(row.heroImageUrl === null || typeof row.heroImageUrl === 'string')
	);
}

export async function fetchPublicEvents(limit: number): Promise<PublicEventsFetchResult> {
	const baseUrl = getAppApiBaseUrl();
	const url = `${baseUrl}/api/public/events?limit=${encodeURIComponent(String(limit))}`;

	try {
		const response = await fetch(url, {
			headers: { Accept: 'application/json' },
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
		});

		if (!response.ok) {
			return { events: [], unavailable: true };
		}

		const payload: unknown = await response.json();

		if (!payload || typeof payload !== 'object' || !Array.isArray((payload as { events?: unknown }).events)) {
			return { events: [], unavailable: true };
		}

		const events = (payload as { events: unknown[] }).events.filter(isPublicEventPreview);

		return { events, unavailable: false };
	} catch {
		return { events: [], unavailable: true };
	}
}

function isPublicListingPreview(value: unknown): value is PublicListingPreview {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const row = value as Record<string, unknown>;

	return (
		typeof row.id === 'string' &&
		typeof row.slug === 'string' &&
		typeof row.name === 'string' &&
		typeof row.city === 'string' &&
		typeof row.profileType === 'string' &&
		Array.isArray(row.tags) &&
		typeof row.shortDescription === 'string' &&
		typeof row.appUrl === 'string' &&
		(row.imageUrl === null || typeof row.imageUrl === 'string')
	);
}

export async function fetchPublicListings(
	type: PublicListingType,
	limit: number
): Promise<PublicListingsFetchResult> {
	const baseUrl = getAppApiBaseUrl();
	const url = `${baseUrl}/api/public/listings?type=${encodeURIComponent(type)}&limit=${encodeURIComponent(String(limit))}`;

	try {
		const response = await fetch(url, {
			headers: { Accept: 'application/json' },
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
		});

		if (!response.ok) {
			return { listings: [], unavailable: true };
		}

		const payload: unknown = await response.json();

		if (
			!payload ||
			typeof payload !== 'object' ||
			!Array.isArray((payload as { listings?: unknown }).listings)
		) {
			return { listings: [], unavailable: true };
		}

		const listings = (payload as { listings: unknown[] }).listings.filter(isPublicListingPreview);

		return { listings, unavailable: false };
	} catch {
		return { listings: [], unavailable: true };
	}
}
