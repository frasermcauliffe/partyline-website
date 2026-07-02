import { APP_LINKS, profilesFilterUrl } from '@/data/app-links';

export type ProfilesRoleCard = {
	title: string;
	description: string;
	websiteHref?: string;
	appHref: string;
	appLabel: string;
};

export const PROFILES_ROLE_CARDS: ProfilesRoleCard[] = [
	{
		title: 'Artists / DJs',
		description:
			'DJs, selectors and live acts — show your sound, link events, and receive enquiries from organisers and venues.',
		websiteHref: '/artists-djs',
		appHref: profilesFilterUrl('artist_dj'),
		appLabel: 'Browse artists in the app'
	},
	{
		title: 'Venues & spaces',
		description:
			'Clubs, warehouses, bars and alternative event spaces — capacity, location context and linked nights.',
		websiteHref: '/venues',
		appHref: profilesFilterUrl('venue'),
		appLabel: 'Browse venues in the app'
	},
	{
		title: 'Organisers & crews',
		description:
			'Promoters, collectives and event crews building nights — link events, opportunities and lineups.',
		websiteHref: '/organisers',
		appHref: profilesFilterUrl('organiser'),
		appLabel: 'Browse organisers in the app'
	},
	{
		title: 'Production / AV',
		description:
			'Sound, lighting, AV, staging and event support — services, coverage area and the nights you work.',
		appHref: profilesFilterUrl('production'),
		appLabel: 'Browse production in the app'
	},
	{
		title: 'Media creators',
		description:
			'Photographers, videographers and content creators documenting club nights, festivals and underground events.',
		appHref: profilesFilterUrl('media'),
		appLabel: 'Browse media in the app'
	},
	{
		title: 'Performers',
		description:
			'Dancers, hosts, MCs and specialty acts — performance style and availability for organisers building lineups.',
		appHref: profilesFilterUrl('performer'),
		appLabel: 'Browse performers in the app'
	}
];

export const PROFILES_HOW_IT_WORKS = [
	{
		title: 'Create a profile',
		description:
			'Sign in to PartyLine and create a listing for your role — artist, venue, organiser, production, media or performer.'
	},
	{
		title: 'Add the details that matter',
		description:
			'Role, location, images, links, tags and key context so people understand your fit before they reach out.'
	},
	{
		title: 'Get listed in the profiles directory',
		description:
			'Published profiles appear in the live PartyLine profiles directory — searchable by type, city and keywords in the app.'
	},
	{
		title: 'Connect through PartyLine',
		description:
			'Discover events, send enquiries, apply to opportunities, and link profiles around each night on the platform.'
	}
] as const;

export const PROFILES_WHY_IT_MATTERS = [
	'One place to find the people, spaces and suppliers behind underground events',
	'Helps organisers discover artists, venues and production without chasing scattered social threads',
	'Helps scene members build a listed presence on PartyLine — not only on social media',
	'Profiles link to events and opportunities so discovery stays connected to what is actually happening'
] as const;

export const PROFILES_DIRECTORY_NOTE =
	'The live searchable profiles directory runs in the PartyLine app. This page explains profile types — open the app to browse, filter and view public listings.';

export const PROFILES_APP_CTA = {
	browseLive: APP_LINKS.profiles,
	createProfile: APP_LINKS.createListing
} as const;
