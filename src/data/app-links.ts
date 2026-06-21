/**
 * Links into the PartyLine SvelteKit app.
 *
 * Currently points at the hosted preview. Before launch, update APP_URL to the
 * production app origin (e.g. https://app.partylinecollective.com).
 */
export const APP_URL = 'https://partyline-webapp.vercel.app';

export const APP_LINKS = {
	join: `${APP_URL}/join`,
	events: `${APP_URL}/events`,
	theScene: `${APP_URL}/the-scene`,
	opportunities: `${APP_URL}/opportunities`,
	submitEvent: `${APP_URL}/submit-event`,
	createListing: `${APP_URL}/create-listing`,
	dashboard: `${APP_URL}/dashboard`,
	feedback: `${APP_URL}/feedback`,
	postOpportunity: `${APP_URL}/dashboard/opportunities/new`
} as const;

export type AppLinkKey = keyof typeof APP_LINKS;
