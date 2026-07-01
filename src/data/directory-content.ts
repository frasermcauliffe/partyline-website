import { APP_LINKS } from '@/data/app-links';
import { appEventsFilterUrl, DIRECTORY_FILTER_LINKS } from '@/lib/app-event-links';

export type DirectoryFilterChip = {
	label: string;
	href: string;
};

export const DIRECTORY_FILTER_CHIPS: DirectoryFilterChip[] = [
	{ label: 'All events', href: DIRECTORY_FILTER_LINKS.all },
	{ label: 'This weekend', href: DIRECTORY_FILTER_LINKS.thisWeekend },
	{ label: 'Perth', href: DIRECTORY_FILTER_LINKS.perth },
	{ label: 'House', href: DIRECTORY_FILTER_LINKS.house },
	{ label: 'Techno', href: DIRECTORY_FILTER_LINKS.techno },
	{ label: 'Drum & bass', href: DIRECTORY_FILTER_LINKS.drumAndBass },
	{ label: 'Day parties', href: DIRECTORY_FILTER_LINKS.dayParties },
	{ label: 'Free / RSVP', href: DIRECTORY_FILTER_LINKS.free }
];

export type DirectoryCityEntry = {
	name: string;
	status: 'active' | 'opening' | 'coming';
	href: string;
	external?: boolean;
	match?: (normalizedCity: string) => boolean;
};

export const DIRECTORY_CITIES: DirectoryCityEntry[] = [
	{
		name: 'Perth',
		status: 'active',
		href: appEventsFilterUrl({ city: 'perth' }),
		external: true,
		match: (city) => city.includes('perth')
	},
	{
		name: 'Fremantle',
		status: 'active',
		href: appEventsFilterUrl({ city: 'perth' }),
		external: true,
		match: (city) => city.includes('fremantle')
	},
	{
		name: 'Melbourne',
		status: 'opening',
		href: appEventsFilterUrl({ city: 'melbourne' }),
		external: true,
		match: (city) => city.includes('melbourne')
	},
	{
		name: 'Sydney',
		status: 'opening',
		href: appEventsFilterUrl({ city: 'sydney' }),
		external: true,
		match: (city) => city.includes('sydney')
	},
	{
		name: 'Brisbane',
		status: 'opening',
		href: appEventsFilterUrl({ city: 'brisbane' }),
		external: true,
		match: (city) => city.includes('brisbane')
	},
	{
		name: 'Adelaide',
		status: 'coming',
		href: APP_LINKS.events,
		external: true
	},
	{
		name: 'Gold Coast',
		status: 'coming',
		href: APP_LINKS.events,
		external: true
	},
	{
		name: 'Byron Bay',
		status: 'coming',
		href: APP_LINKS.events,
		external: true
	}
];

export type DirectoryGenreEntry = {
	name: string;
	href: string;
	external?: boolean;
	matchers?: string[];
};

export const DIRECTORY_GENRES: DirectoryGenreEntry[] = [
	{
		name: 'House',
		href: appEventsFilterUrl({ tag: 'house-tech' }),
		external: true,
		matchers: ['house']
	},
	{
		name: 'Techno',
		href: appEventsFilterUrl({ tag: 'techno' }),
		external: true,
		matchers: ['techno']
	},
	{
		name: 'Drum & bass',
		href: appEventsFilterUrl({ tag: 'bass-dnb' }),
		external: true,
		matchers: ['drum', 'dnb', 'jungle', 'bass']
	},
	{
		name: 'Bass',
		href: appEventsFilterUrl({ tag: 'bass-dnb' }),
		external: true,
		matchers: ['bass']
	},
	{
		name: 'Garage',
		href: APP_LINKS.events,
		external: true,
		matchers: ['garage', 'ukg']
	},
	{
		name: 'Trance',
		href: APP_LINKS.events,
		external: true,
		matchers: ['trance']
	},
	{
		name: 'Live electronic',
		href: APP_LINKS.events,
		external: true,
		matchers: ['live']
	},
	{
		name: 'Experimental',
		href: APP_LINKS.events,
		external: true,
		matchers: ['experimental', 'ambient', 'industrial']
	},
	{
		name: 'Day parties',
		href: appEventsFilterUrl({ type: 'day-party' }),
		external: true,
		matchers: ['day party']
	},
	{
		name: 'Community events',
		href: appEventsFilterUrl({ type: 'community' }),
		external: true,
		matchers: ['community']
	}
];

export const DIRECTORY_SOURCING = [
	{
		title: 'Organiser submissions',
		description:
			'Signed-in organisers submit events in the PartyLine app with lineups, venues, tags and linked profiles where available.'
	},
	{
		title: 'PartyLine admin listings',
		description:
			'PartyLine may add or help publish selected public listings during alpha to keep discovery useful while the network grows.'
	},
	{
		title: 'Partner and promoter events',
		description:
			'Partner nights and promoter submissions can appear when organisers share public event details and ticket links through PartyLine.'
	},
	{
		title: 'Public links from organisers',
		description:
			'Where provided, external ticket or info links stay with the organiser — PartyLine focuses on discovery and scene connection.'
	},
	{
		title: 'Roadmap: structured imports',
		description:
			'City and genre directory expansion, structured imports and richer filters are planned — not automated ticketing API imports or scraping today.'
	},
	{
		title: 'Profiles linked to events',
		description:
			'Artists, venues, organisers and suppliers can be linked around each listing so the directory connects people, not just dates.'
	}
] as const;

export const DIRECTORY_FAQ = [
	{
		question: 'What is the PartyLine Event Directory?',
		answer:
			'The PartyLine Event Directory is a public marketing view of upcoming underground events listed in the PartyLine app — club nights, warehouse parties, day parties and community-led shows. It is Perth-first and building across Australia as more organisers join.'
	},
	{
		question: 'How are events added?',
		answer:
			'Events come from organiser submissions in the app, PartyLine admin-added listings where helpful, and partner or promoter submissions with public event details. The directory reflects published public listings — not scraped or imported ticket feeds.'
	},
	{
		question: 'Can I submit an event?',
		answer:
			'Yes. Signed-in users can submit events in the PartyLine app with lineups, venues, tags, posters and ticket links where available.'
	},
	{
		question: 'Is PartyLine only for Perth?',
		answer:
			'PartyLine is Perth-first today. Melbourne, Sydney, Brisbane and more cities open as organisers, venues and profiles join — without claiming full national coverage before the listings exist.'
	},
	{
		question: 'Can organisers request promotion support?',
		answer:
			'Organisers can flag promotion interest when submitting or editing an event. PartyLine reviews these manually — there is no guaranteed placement or paid ranking in the current alpha.'
	},
	{
		question: 'Can artists, venues and organisers be linked to events?',
		answer:
			'Yes. Event listings can link artist, venue, organiser and supplier profiles so discovery stays connected to the people behind each night.'
	},
	{
		question: 'Are events verified?',
		answer:
			'Listings are published public events inside PartyLine, but PartyLine does not guarantee every detail, ticket availability or third-party link. Always confirm with the organiser or venue before you travel.'
	},
	{
		question: 'How often is the directory updated?',
		answer:
			'This page is rebuilt from live public listings when the marketing site deploys. Open the PartyLine app for the latest calendar, filters and full event details.'
	}
] as const;
