import { APP_URL } from '@/data/app-links';
import { parsePublicSceneIndexStats } from '@/lib/public-scene-index';
import type {
	PublicEventPreview,
	PublicEventsFetchResult,
	PublicListingPreview,
	PublicListingsFetchResult,
	PublicListingType,
	PublicOpportunityPreview,
	PublicOpportunitiesFetchResult,
	PublicSceneIndexFetchResult
} from '@/lib/app-preview-types';

const FETCH_TIMEOUT_MS = 10_000;

function getAppApiBaseUrl(): string {
	const configured = import.meta.env.PUBLIC_APP_API_URL?.trim();
	// PUBLIC_APP_API_URL → env-resolved APP_URL → preview fallback (see app-links.ts)
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

function isPublicOpportunityPreview(value: unknown): value is PublicOpportunityPreview {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const row = value as Record<string, unknown>;

	return (
		typeof row.id === 'string' &&
		typeof row.slug === 'string' &&
		typeof row.title === 'string' &&
		typeof row.opportunityType === 'string' &&
		typeof row.city === 'string' &&
		typeof row.dateLabel === 'string' &&
		Array.isArray(row.genres) &&
		typeof row.appUrl === 'string' &&
		(row.imageUrl === null ||
			row.imageUrl === undefined ||
			typeof row.imageUrl === 'string') &&
		(row.deadlineLabel === undefined || typeof row.deadlineLabel === 'string') &&
		(row.paymentLabel === null ||
			row.paymentLabel === undefined ||
			typeof row.paymentLabel === 'string') &&
		(row.organiserName === null ||
			row.organiserName === undefined ||
			typeof row.organiserName === 'string') &&
		(row.linkedEventTitle === null ||
			row.linkedEventTitle === undefined ||
			typeof row.linkedEventTitle === 'string')
	);
}

export async function fetchPublicOpportunities(
	limit: number
): Promise<PublicOpportunitiesFetchResult> {
	const baseUrl = getAppApiBaseUrl();
	const url = `${baseUrl}/api/public/opportunities?limit=${encodeURIComponent(String(limit))}`;

	try {
		const response = await fetch(url, {
			headers: { Accept: 'application/json' },
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
		});

		if (!response.ok) {
			return { opportunities: [], unavailable: true };
		}

		const payload: unknown = await response.json();

		if (
			!payload ||
			typeof payload !== 'object' ||
			!Array.isArray((payload as { opportunities?: unknown }).opportunities)
		) {
			return { opportunities: [], unavailable: true };
		}

		const opportunities = (payload as { opportunities: unknown[] }).opportunities.filter(
			isPublicOpportunityPreview
		);

		return { opportunities, unavailable: false };
	} catch {
		return { opportunities: [], unavailable: true };
	}
}

export async function fetchPublicSceneIndex(): Promise<PublicSceneIndexFetchResult> {
	const baseUrl = getAppApiBaseUrl();
	const url = `${baseUrl}/api/public/scene-index`;

	try {
		const response = await fetch(url, {
			headers: { Accept: 'application/json' },
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
		});

		if (!response.ok) {
			return { sceneIndex: null, unavailable: true };
		}

		const payload: unknown = await response.json();

		if (!payload || typeof payload !== 'object') {
			return { sceneIndex: null, unavailable: true };
		}

		const sceneIndexValue = (payload as { sceneIndex?: unknown }).sceneIndex;
		const parsed = parsePublicSceneIndexStats(sceneIndexValue);

		if (!parsed) {
			return { sceneIndex: null, unavailable: true };
		}

		return { sceneIndex: parsed, unavailable: false };
	} catch {
		return { sceneIndex: null, unavailable: true };
	}
}
