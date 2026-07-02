/**
 * Links into the PartyLine SvelteKit app.
 *
 * Set PUBLIC_APP_URL in Vercel for production (e.g. https://app.partylinecollective.com).
 * When unset, falls back to the hosted preview app.
 */
const PREVIEW_APP_URL = 'https://partyline-webapp.vercel.app';

export const APP_URL = (
	import.meta.env.PUBLIC_APP_URL?.trim() || PREVIEW_APP_URL
).replace(/\/$/, '');

export const APP_LINKS = {
	/** Neutral / sign-in-first app entry (`/join` defaults to sign in). */
	join: `${APP_URL}/join`,
	/** Marketing sign-up intent — opens create-account mode on `/join`. */
	joinSignup: `${APP_URL}/join?mode=signup`,
	events: `${APP_URL}/events`,
	/** Live searchable profiles directory in the PartyLine app. */
	profiles: `${APP_URL}/profiles`,
	/** @deprecated Use APP_LINKS.profiles — app /the-scene redirects to /profiles. */
	theScene: `${APP_URL}/profiles`,
	opportunities: `${APP_URL}/opportunities`,
	submitEvent: `${APP_URL}/submit-event`,
	createListing: `${APP_URL}/create-listing`,
	dashboard: `${APP_URL}/dashboard`,
	feedback: `${APP_URL}/feedback`,
	postOpportunity: `${APP_URL}/dashboard/opportunities/new`,
	artists: `${APP_URL}/artists`,
	organisers: `${APP_URL}/organisers`,
	venues: `${APP_URL}/venues`,
	production: `${APP_URL}/production`,
	media: `${APP_URL}/media`,
	performers: `${APP_URL}/performers`
} as const;

export type AppLinkKey = keyof typeof APP_LINKS;

export function eventUrl(slug: string): string {
	return `${APP_URL}/events/${slug}`;
}

export function profileUrl(slug: string): string {
	return `${APP_URL}/profiles/${slug}`;
}

export function opportunityUrl(slug: string): string {
	return `${APP_URL}/opportunities/${slug}`;
}

export function profilesFilterUrl(type: string): string {
	return `${APP_URL}/profiles?type=${encodeURIComponent(type)}`;
}
