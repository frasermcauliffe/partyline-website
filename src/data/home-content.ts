import { APP_LINKS } from '@/data/app-links';

export const HOME_PROOF_CHIPS = [
	'Perth-first',
	'Built for underground music',
	'Events, profiles and bookings in one place'
] as const;

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
			'Build a profile, link your events, share your sound, and receive booking enquiries from organisers and venues.',
		ctaLabel: 'Create profile',
		ctaHref: APP_LINKS.createListing,
		external: true,
		learnMoreLabel: 'For Artists & DJs',
		learnMoreHref: '/artists-djs'
	},
	{
		title: 'Venues & Spaces',
		description:
			'Show capacity, location, setup, restrictions, photos and the context people need before they enquire.',
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
		ctaLabel: 'Browse profiles',
		ctaHref: APP_LINKS.profiles,
		external: true,
		learnMoreLabel: 'Platform overview',
		learnMoreHref: '/platform'
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
		learnMoreLabel: 'Browse profiles',
		learnMoreHref: '/profiles'
	},
	{
		title: 'Fans & Guests',
		description:
			'Discover what\u2019s on, save events, follow profiles and stay close to the scene as it grows.',
		ctaLabel: 'Explore events',
		ctaHref: APP_LINKS.events,
		external: true,
		learnMoreLabel: 'Events on PartyLine',
		learnMoreHref: '/events'
	}
];

export const HOME_HOW_IT_WORKS = [
	{
		title: 'Create your scene profile',
		description:
			'Join for free, then create a listing, submit an event, or start exploring depending on your path.'
	},
	{
		title: 'Discover and connect',
		description:
			'Browse events and profiles in the PartyLine app, follow what matters, and find the people behind each night.'
	},
	{
		title: 'Enquire, book and build',
		description:
			'Send booking enquiries, apply to opportunities, and use secure deposits when a booking is ready to get serious.'
	}
] as const;

export type HomeFeature = {
	title: string;
	description: string;
};

export const HOME_FEATURES: HomeFeature[] = [
	{
		title: 'Discover underground events',
		description: 'Club nights, warehouses, day parties and community-led listings — Perth-first, building across Australia.'
	},
	{
		title: 'Browse scene profiles',
		description: 'Artists, venues, organisers, production crews, media and performers in one connected directory.'
	},
	{
		title: 'Submit events',
		description: 'Add your night to the radar with lineups, venues, tags and linked profiles where available.'
	},
	{
		title: 'Send booking enquiries',
		description: 'Structured requests through public profiles — clearer context than a cold DM.'
	},
	{
		title: 'Post or find opportunities',
		description: 'DJs wanted, open decks, residencies and other open calls from organisers and venues.'
	},
	{
		title: 'Request promotion support',
		description: 'Organisers can flag promotion interest when submitting or editing events — reviewed manually by PartyLine.'
	},
	{
		title: 'Link events to the scene',
		description: 'Connect artists, venues, organisers and suppliers around each listing.'
	},
	{
		title: 'Profiles built for socials',
		description: 'Share a public PartyLine profile link in bios, posts and promo without rebuilding the same info everywhere.'
	}
];

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
		label: 'Public profile',
		title: 'Profile page',
		description: 'Bio, media, linked events, socials and enquiry actions.'
	},
	{
		label: 'Submit event',
		title: 'Event submission',
		description: 'Add listings with lineups, venues and linked profiles.'
	},
	{
		label: 'Booking enquiry',
		title: 'Structured enquiries',
		description: 'Send booking context through a profile, not a scattered inbox thread.'
	},
	{
		label: 'Secure deposit',
		title: 'Deposit confirmation',
		description: 'Paid deposits and booking confirmation recorded in PartyLine.'
	},
	{
		label: 'Promotion interest',
		title: 'Organiser support',
		description: 'Flag promotion interest on submit or edit — reviewed manually.'
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
		description: 'Public profile with linked events, media embeds and booking enquiries.'
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
		description: 'Services, coverage area and past work visible to organisers booking production.'
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

export const HOME_ORGANISER_BULLETS = [
	'Submit events with lineups, venues and tags',
	'Link artists, venues and suppliers around each show',
	'Post DJ opportunities and review applicants',
	'Receive booking interest through public profiles',
	'Request promotion support when submitting or editing events',
	'Ask about affiliate and ticket tracking support as the platform grows'
] as const;

export const HOME_FAQ = [
	{
		question: 'What is PartyLine?',
		answer:
			'PartyLine Collective is scene infrastructure for underground music and events — discovery, public profiles, opportunities, enquiries and booking tools in one place. It is Perth-first and building across Australia.'
	},
	{
		question: 'Who is it for?',
		answer:
			'Artists, DJs, venues, organisers, production crews, media, performers and fans who want a clearer way to find each other around real events.'
	},
	{
		question: 'Is it free to join?',
		answer:
			'Yes. Creating an account and building a public profile is free during closed alpha. Some booking and payment flows may involve standard processing where deposits are used.'
	},
	{
		question: 'How do bookings work?',
		answer:
			'Booking enquiries and structured requests run through public profiles in the app. When both sides are ready, deposits and confirmation can be handled inside PartyLine.'
	},
	{
		question: 'How do secure deposits work?',
		answer:
			'Secure deposits can be paid through PartyLine and held before release, giving both sides a clearer booking record. Recipient payout is released through PartyLine\u2019s admin release process after eligibility checks — not instant at payment time for held-release bookings.'
	},
	{
		question: 'Can I submit an event?',
		answer:
			'Yes. Signed-in users can submit events in the app with lineups, venues, tags and linked profiles where available.'
	},
	{
		question: 'Can PartyLine help promote my event?',
		answer:
			'Organisers can flag promotion interest when submitting or editing an event. PartyLine reviews these manually — there is no guaranteed placement or paid ranking in the current alpha.'
	},
	{
		question: 'Is PartyLine only for Perth?',
		answer:
			'PartyLine is Perth-first today, with public listings and profiles building across Australia as more organisers, venues and artists join.'
	}
] as const;
