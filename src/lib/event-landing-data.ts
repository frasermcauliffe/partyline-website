import { fetchPublicEvents, fetchPublicSceneIndex } from '@/lib/app-api';
import type { PublicEventsFetchResult } from '@/lib/app-preview-types';
import type { PublicSceneIndexFetchResult } from '@/lib/public-scene-index';

let cachedEventsFetch: Promise<PublicEventsFetchResult> | null = null;
let cachedSceneIndexFetch: Promise<PublicSceneIndexFetchResult> | null = null;

/** Single shared fetch per build — avoids redundant API calls across landing pages. */
export function getSharedPublicEvents(): Promise<PublicEventsFetchResult> {
	cachedEventsFetch ??= fetchPublicEvents(24);
	return cachedEventsFetch;
}

/** Single shared scene index fetch per build. */
export function getSharedPublicSceneIndex(): Promise<PublicSceneIndexFetchResult> {
	cachedSceneIndexFetch ??= fetchPublicSceneIndex();
	return cachedSceneIndexFetch;
}

export const PREVIEW_NOTE =
	'Public preview below — sample of upcoming listings. Open the app for the full calendar.';

export const WEEKEND_PREVIEW_NOTE =
	'General upcoming preview only — the public API does not include ISO dates yet. For an accurate this-weekend filter, open the PartyLine app.';

export const SCENE_SNAPSHOT_HEADING = 'PartyLine listings snapshot';

export const SCENE_SNAPSHOT_LEDE =
	'Upcoming and live listings currently tracked by PartyLine. Open the app for the full calendar.';
