/**
 * Marketing site origin — canonical URLs and sitemap.
 *
 * Production: https://partylinecollective.com
 * Until DNS is live, deploy preview may differ — keep astro.config.mjs in sync.
 */
export const SITE_URL = 'https://partylinecollective.com';

export const SITE = {
	name: 'PartyLine Collective',
	tagline: 'Find your line into Australia\u2019s underground scene.',
	description:
		'Underground music and events platform for Australia — discovery, scene profiles, opportunities, and connection.',
	locale: 'en-AU',
	contactEmail: 'hello@partylinecollective.com'
} as const;
