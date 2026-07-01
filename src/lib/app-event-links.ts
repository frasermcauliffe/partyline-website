import { APP_LINKS } from '@/data/app-links';

/** Build a deep-link into the PartyLine app events discovery page. */
export function appEventsFilterUrl(params: Record<string, string>): string {
	const url = new URL(APP_LINKS.events);

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}

	return url.toString();
}

export const DIRECTORY_FILTER_LINKS = {
	all: APP_LINKS.events,
	thisWeekend: appEventsFilterUrl({ date: 'this-weekend' }),
	perth: appEventsFilterUrl({ city: 'perth' }),
	house: appEventsFilterUrl({ tag: 'house-tech' }),
	techno: appEventsFilterUrl({ tag: 'techno' }),
	drumAndBass: appEventsFilterUrl({ tag: 'bass-dnb' }),
	dayParties: appEventsFilterUrl({ type: 'day-party' }),
	free: appEventsFilterUrl({ price: 'free' })
} as const;
