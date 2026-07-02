import { APP_LINKS } from '@/data/app-links';

export const HOME_PROOF_CHIPS = [
	'Perth-first, building across Australia',
	'Events, profiles and discovery tools',
	'Built for artists, organisers, venues and scene suppliers'
] as const;

export const HOME_EVENTS_LEDE =
	'Browse upcoming club nights, warehouses and community listings on PartyLine — Perth-first, building across Australia.';

export const HOME_PROFILES_LEDE =
	'Artists, venues, organisers, production/AV, media and performers — listed on PartyLine and searchable in the app.';

export type HomeRoleCard = {
	title: string;
	description: string;
	ctaLabel?: string;
	ctaHref?: string;
	external?: boolean;
	learnMoreLabel?: string;
	learnMoreHref?: string;
};

export const HOME_ROLE_CARDS: HomeRoleCard[] = [
	{
		title: 'Artists & DJs',
		description:
			'Build a profile, link your events, share your sound, and connect with organisers and venues across the scene.',
		ctaLabel: 'Create profile',
		ctaHref: APP_LINKS.createListing,
		external: true,
		learnMoreLabel: 'For Artists & DJs',
		learnMoreHref: '/artists-djs'
	},
	{
		title: 'Venues & Spaces',
		description:
			'Show capacity, location, setup, restrictions, photos and the context people need before they reach out.',
		ctaLabel: 'Add your venue',
		ctaHref: APP_LINKS.createListing,
		external: true,
		learnMoreLabel: 'For Venues',
		learnMoreHref: '/venues'
	},
	{
		title: 'Organisers & Crews',
		description:
			'List events, build your organiser profile, find DJs, post opportunities, and request promotion support.',
		ctaLabel: 'Submit event',
		ctaHref: APP_LINKS.submitEvent,
		external: true,
		learnMoreLabel: 'For Organisers',
		learnMoreHref: '/organisers'
	},
	{
		title: 'Production & AV',
		description:
			'Show your services, gear, packages, coverage area and the kind of nights you support.',
		ctaLabel: 'Browse live profiles',
		ctaHref: APP_LINKS.profiles,
		external: true,
		learnMoreLabel: 'About profiles',
		learnMoreHref: '/profiles'
	},
	{
		title: 'Media Creators',
		description:
			'Get found for photography, video, recap content and event coverage across the underground.',
		ctaLabel: 'Create profile',
		ctaHref: APP_LINKS.createListing,
		external: true,
		learnMoreLabel: 'Opportunities',
		learnMoreHref: '/opportunities'
	},
	{
		title: 'Performers',
		description:
			'List dancers, MCs, hosts and performance talent so organisers can find the right fit for each night.',
		ctaLabel: 'Create profile',
		ctaHref: APP_LINKS.createListing,
		external: true,
		learnMoreLabel: 'About profiles',
		learnMoreHref: '/profiles'
	}
];

export const HOME_HOW_IT_WORKS = [
	{
		title: 'Discover events',
		description:
			'Browse underground listings on the PartyLine website and open the app for the full calendar when you need more.'
	},
	{
		title: 'Browse profiles',
		description:
			'Find artists, venues, organisers, production crews, media and performers listed on PartyLine — searchable in the app.'
	},
	{
		title: 'Create or submit when you are part of the scene',
		description:
			'Create a profile, submit an event, or post opportunities when you are ready to contribute to the network.'
	}
] as const;

export type HomeAppPreview = {
	title: string;
	description: string;
	label: string;
};

export const HOME_APP_PREVIEWS: HomeAppPreview[] = [
	{
		label: 'Explore events',
		title: 'Event discovery',
		description: 'Browse nights by city, date and genre in the app.'
	},
	{
		label: 'Browse profiles',
		title: 'Profiles directory',
		description: 'Public profiles for artists, venues, organisers and suppliers.'
	},
	{
		label: 'Submit event',
		title: 'Event submission',
		description: 'Add listings with lineups, venues and linked profiles.'
	}
];

export type HomeSceneProfileCard = {
	name: string;
	type: string;
	city: string;
	tags: string;
	description: string;
};

export const HOME_SCENE_PROFILES: HomeSceneProfileCard[] = [
	{
		name: 'Example: Warehouse selector',
		type: 'Artist / DJ',
		city: 'Perth',
		tags: 'Techno · Hard groove · Live',
		description: 'Public profile with linked events, media embeds and connect-through-PartyLine actions.'
	},
	{
		name: 'Example: Inner-city room',
		type: 'Venue',
		city: 'Perth',
		tags: 'Club · 300 cap · Late licence',
		description: 'Capacity, location context, photos and events linked to the venue profile.'
	},
	{
		name: 'Example: Night series crew',
		type: 'Organiser',
		city: 'Perth',
		tags: 'Collective · Club · Warehouse',
		description: 'Organiser presence with submitted events, opportunities and linked lineups.'
	},
	{
		name: 'Example: AV & lighting crew',
		type: 'Production',
		city: 'Perth',
		tags: 'Lighting · Rigging · Event production',
		description: 'Services, coverage area and past work visible to organisers looking for production.'
	},
	{
		name: 'Example: Event photographer',
		type: 'Media',
		city: 'Perth',
		tags: 'Photo · Recap · Nightlife',
		description: 'Portfolio-led profile for organisers looking for coverage and recap content.'
	},
	{
		name: 'Example: Host & performer',
		type: 'Performer',
		city: 'Perth',
		tags: 'MC · Host · Live performance',
		description: 'Performance talent listed for organisers building fuller lineups.'
	}
];

export const HOME_FAQ = [
	{
		question: 'What is PartyLine?',
		answer:
			'PartyLine Collective is scene infrastructure for underground music culture — events, profiles and discovery tools in one place. It is Perth-first and building across Australia.'
	},
	{
		question: 'What can I browse?',
		answer:
			'Browse underground events on the website event directory, read about scene profiles on the profiles page, and open the PartyLine app for live profile search and the full event calendar.'
	},
	{
		question: 'Who can create a profile?',
		answer:
			'Artists, DJs, venues, organisers, production crews, media and performers can create a public listing on PartyLine. Fans can join to save events and follow profiles without publishing a listing.'
	},
	{
		question: 'Can I submit an event?',
		answer:
			'Yes. Signed-in users can submit events in the app with lineups, venues, tags and linked profiles where available.'
	},
	{
		question: 'Is PartyLine live yet?',
		answer:
			'PartyLine is in closed alpha. Discovery, profiles, event submission and related workflows are live and evolving — see release notes for what is shipped today. Full booking, deposit and payment workflows are not the focus of this website preview.'
	}
] as const;
