import { APP_LINKS } from '@/data/app-links';
import { appEventsFilterUrl, DIRECTORY_FILTER_LINKS } from '@/lib/app-event-links';

export type LandingFaqItem = {
	question: string;
	answer: string;
};

export type LandingCoverage = 'active' | 'opening';

export type RelatedLinkItem = {
	label: string;
	href: string;
	external?: boolean;
};

interface BaseLandingConfig {
	slug: string;
	seoTitle: string;
	seoDescription: string;
	h1: string;
	heroLede: string;
	primaryCtaLabel: string;
	primaryCtaHref: string;
	contextTitle: string;
	contextBody: string;
	previewTitle: string;
	emptyMessage: string;
	faq: LandingFaqItem[];
	relatedCitySlugs: string[];
	relatedGenreSlugs: string[];
}

export interface CityLandingConfig extends BaseLandingConfig {
	kind: 'city';
	coverage: LandingCoverage;
	matchCity: (normalizedCity: string) => boolean;
}

export interface DateLandingConfig extends BaseLandingConfig {
	kind: 'date';
}

export interface GenreLandingConfig extends BaseLandingConfig {
	kind: 'genre';
	matchGenres: string[];
	matchEventType?: (eventType: string | undefined) => boolean;
}

export type EventLandingConfig = CityLandingConfig | DateLandingConfig | GenreLandingConfig;

const OTHER_CITY_SLUGS = ['perth', 'melbourne', 'sydney', 'brisbane'] as const;

function otherCities(current: string): string[] {
	return OTHER_CITY_SLUGS.filter((slug) => slug !== current);
}

function cityFaq(cityName: string): LandingFaqItem[] {
	return [
		{
			question: `How do I submit a ${cityName} event?`,
			answer:
				'Signed-in organisers can submit events in the PartyLine app with lineups, venues, tags, posters and ticket links. PartyLine is Perth-first and building across Australia as more cities join.'
		},
		{
			question: 'Can I list a venue or organiser profile?',
			answer:
				'Yes. Create a public profile in the app and link it to your events so artists, venues, organisers and suppliers stay connected around each night.'
		},
		{
			question: `Are all ${cityName} events on PartyLine?`,
			answer:
				'No. This page shows a public listings preview only — not every underground event in the city. Open the PartyLine app for the full calendar and latest listings.'
		},
		{
			question: 'Can PartyLine help promote my event?',
			answer:
				'Organisers can flag promotion interest when submitting or editing an event. PartyLine reviews these manually — there is no guaranteed placement in the current alpha.'
		}
	];
}

function genreFaq(genreLabel: string): LandingFaqItem[] {
	return [
		{
			question: 'How are genre tags chosen?',
			answer:
				'Organisers tag events when submitting or editing listings in the app. Tags help discovery in PartyLine and on marketing pages like this one — they reflect submitted metadata, not an editorial chart.'
		},
		{
			question: `Can I submit a ${genreLabel.toLowerCase()} event?`,
			answer:
				'Yes. Submit your event in the PartyLine app with the right genres, venue, lineup and linked profiles. Listings appear in the app first; this page shows a public preview at build time.'
		},
		{
			question: 'Can artists and venues be linked?',
			answer:
				'Yes. Event listings can link artist, venue, organiser and supplier profiles so discovery stays connected to the people behind each night.'
		},
		{
			question: 'Can PartyLine help promote genre-specific events?',
			answer:
				'Organisers can flag promotion interest on submit or edit. PartyLine reviews manually — there is no guaranteed genre placement or paid ranking in alpha.'
		}
	];
}

export const CITY_LANDING_PAGES: CityLandingConfig[] = [
	{
		kind: 'city',
		slug: 'perth',
		coverage: 'active',
		seoTitle: 'Perth Underground Events',
		seoDescription:
			'Browse upcoming underground club nights, warehouse parties, day parties and community events in Perth on PartyLine. Perth-first listings, building across Australia.',
		h1: 'Perth Underground Events',
		heroLede:
			'Browse upcoming underground club nights, warehouse parties, day parties and community-led events in Perth on PartyLine.',
		primaryCtaLabel: 'Explore Perth Events in App',
		primaryCtaHref: DIRECTORY_FILTER_LINKS.perth,
		contextTitle: 'Perth-first on PartyLine',
		contextBody:
			'PartyLine is Perth-first today — many public listings in the current preview are here. Fremantle and wider WA listings may also appear. Submit your night, link profiles, and help build the directory as the network grows across Australia.',
		previewTitle: 'Perth events preview',
		emptyMessage:
			'No matching Perth events are showing in the public preview right now. Open the app for the full calendar or submit an event.',
		matchCity: (city) => city.includes('perth') || city.includes('fremantle'),
		faq: cityFaq('Perth'),
		relatedCitySlugs: otherCities('perth'),
		relatedGenreSlugs: ['techno', 'house', 'drum-and-bass']
	},
	{
		kind: 'city',
		slug: 'melbourne',
		coverage: 'opening',
		seoTitle: 'Melbourne Underground Events',
		seoDescription:
			'Discover underground club nights and events in Melbourne on PartyLine. Opening as organisers join — Perth-first platform building across Australia.',
		h1: 'Melbourne Underground Events',
		heroLede:
			'Discover upcoming underground club nights, warehouse parties and community-led events in Melbourne through PartyLine.',
		primaryCtaLabel: 'Explore Melbourne Events in App',
		primaryCtaHref: appEventsFilterUrl({ city: 'melbourne' }),
		contextTitle: 'Opening in Melbourne',
		contextBody:
			'Melbourne is opening on PartyLine as organisers, venues and profiles join. This page may show few or no preview listings today — that does not mean the city is fully active yet. PartyLine is Perth-first, building across Australia without overclaiming coverage.',
		previewTitle: 'Melbourne events preview',
		emptyMessage:
			'No matching Melbourne events are showing in the public preview right now. Open the app for the latest listings or submit an event as the city opens.',
		matchCity: (city) => city.includes('melbourne'),
		faq: cityFaq('Melbourne'),
		relatedCitySlugs: otherCities('melbourne'),
		relatedGenreSlugs: ['techno', 'house', 'day-parties']
	},
	{
		kind: 'city',
		slug: 'sydney',
		coverage: 'opening',
		seoTitle: 'Sydney Underground Events',
		seoDescription:
			'Discover underground club nights and events in Sydney on PartyLine. Opening as organisers join — Perth-first platform building across Australia.',
		h1: 'Sydney Underground Events',
		heroLede:
			'Discover upcoming underground club nights, warehouse parties and community-led events in Sydney through PartyLine.',
		primaryCtaLabel: 'Explore Sydney Events in App',
		primaryCtaHref: appEventsFilterUrl({ city: 'sydney' }),
		contextTitle: 'Opening in Sydney',
		contextBody:
			'Sydney listings are growing as organisers and venues join PartyLine. Preview counts here reflect the current public sample only — open the app for the full calendar. PartyLine is Perth-first, building across Australia.',
		previewTitle: 'Sydney events preview',
		emptyMessage:
			'No matching Sydney events are showing in the public preview right now. Open the app for the latest listings or submit an event as the city opens.',
		matchCity: (city) => city.includes('sydney'),
		faq: cityFaq('Sydney'),
		relatedCitySlugs: otherCities('sydney'),
		relatedGenreSlugs: ['techno', 'house', 'drum-and-bass']
	},
	{
		kind: 'city',
		slug: 'brisbane',
		coverage: 'opening',
		seoTitle: 'Brisbane Underground Events',
		seoDescription:
			'Discover underground club nights and events in Brisbane on PartyLine. Opening as organisers join — Perth-first platform building across Australia.',
		h1: 'Brisbane Underground Events',
		heroLede:
			'Discover upcoming underground club nights, warehouse parties and community-led events in Brisbane through PartyLine.',
		primaryCtaLabel: 'Explore Brisbane Events in App',
		primaryCtaHref: appEventsFilterUrl({ city: 'brisbane' }),
		contextTitle: 'Opening in Brisbane',
		contextBody:
			'Brisbane is opening on PartyLine as more organisers submit events and link profiles. Few or no preview listings here is expected early on. PartyLine is Perth-first, building across Australia as the underground network grows.',
		previewTitle: 'Brisbane events preview',
		emptyMessage:
			'No matching Brisbane events are showing in the public preview right now. Open the app for the latest listings or submit an event as the city opens.',
		matchCity: (city) => city.includes('brisbane'),
		faq: cityFaq('Brisbane'),
		relatedCitySlugs: otherCities('brisbane'),
		relatedGenreSlugs: ['house', 'techno', 'day-parties']
	}
];

export const DATE_LANDING_PAGES: DateLandingConfig[] = [
	{
		kind: 'date',
		slug: 'this-weekend',
		seoTitle: 'Underground Events This Weekend',
		seoDescription:
			'Find underground events this weekend on PartyLine. Browse the public preview, then open the app for accurate weekend date filters — Perth-first, building across Australia.',
		h1: 'Underground Events This Weekend',
		heroLede:
			'Find upcoming weekend club nights, warehouse parties and community events in the PartyLine app.',
		primaryCtaLabel: 'Explore This Weekend in App',
		primaryCtaHref: DIRECTORY_FILTER_LINKS.thisWeekend,
		contextTitle: 'Weekend filtering lives in the app',
		contextBody:
			'The public website preview does not include reliable ISO event dates yet, so this page cannot filter exactly to this weekend. Use the app date filter for the most accurate weekend calendar. The preview below shows general upcoming listings from the current public sample.',
		previewTitle: 'Upcoming events preview',
		emptyMessage:
			'No upcoming events are in the public preview right now. Open the app for this-weekend filters and the full calendar.',
		faq: [
			{
				question: 'Why don\u2019t I see only weekend events here?',
				answer:
					'The public listings API used by this marketing site returns display dates, not ISO timestamps. Weekend filtering runs accurately inside the PartyLine app — use the Explore This Weekend link above.'
			},
			{
				question: 'How do I submit a weekend event?',
				answer:
					'Submit your event in the PartyLine app with the correct date, venue, lineup and tags. Published listings appear in app filters and may surface in future website previews.'
			},
			{
				question: 'Is this every weekend event in Australia?',
				answer:
					'No. This page shows a general upcoming preview (up to 24 listings at build time), not a complete national weekend calendar.'
			},
			{
				question: 'Can PartyLine help promote my event?',
				answer:
					'Organisers can flag promotion interest when submitting or editing an event. PartyLine reviews these manually during alpha.'
			}
		],
		relatedCitySlugs: [...OTHER_CITY_SLUGS],
		relatedGenreSlugs: ['techno', 'house', 'day-parties']
	}
];

export const GENRE_LANDING_PAGES: GenreLandingConfig[] = [
	{
		kind: 'genre',
		slug: 'techno',
		seoTitle: 'Techno Events on PartyLine',
		seoDescription:
			'Find upcoming techno events, club nights and underground shows listed through PartyLine. Public preview — open the app for the full calendar.',
		h1: 'Techno Events on PartyLine',
		heroLede:
			'Find upcoming techno events, club nights and underground shows listed through PartyLine.',
		primaryCtaLabel: 'Explore Techno Events in App',
		primaryCtaHref: DIRECTORY_FILTER_LINKS.techno,
		contextTitle: 'Techno on the line',
		contextBody:
			'DJs, organisers, venues and profiles connect around techno nights on PartyLine. Tags come from organiser submissions — this page shows matching events from the current public preview only.',
		previewTitle: 'Techno events preview',
		emptyMessage:
			'No matching techno events are showing in the public preview right now. Open the app for the full calendar or submit an event.',
		matchGenres: ['techno'],
		faq: genreFaq('Techno'),
		relatedCitySlugs: ['perth', 'melbourne', 'sydney'],
		relatedGenreSlugs: ['house', 'drum-and-bass', 'bass']
	},
	{
		kind: 'genre',
		slug: 'house',
		seoTitle: 'House Events on PartyLine',
		seoDescription:
			'Find upcoming house music events, club nights and underground parties on PartyLine. Public preview — open the app for the full calendar.',
		h1: 'House Events on PartyLine',
		heroLede:
			'Find upcoming house music events, club nights and underground parties listed through PartyLine.',
		primaryCtaLabel: 'Explore House Events in App',
		primaryCtaHref: DIRECTORY_FILTER_LINKS.house,
		contextTitle: 'House and club culture',
		contextBody:
			'From deep and minimal to peak-time club house, organisers tag events in the app. App filters group some house and tech tags together today — this preview matches house-tagged listings where available.',
		previewTitle: 'House events preview',
		emptyMessage:
			'No matching house events are showing in the public preview right now. Open the app for the full calendar or submit an event.',
		matchGenres: ['house'],
		faq: genreFaq('House'),
		relatedCitySlugs: ['perth', 'melbourne', 'brisbane'],
		relatedGenreSlugs: ['techno', 'garage', 'day-parties']
	},
	{
		kind: 'genre',
		slug: 'drum-and-bass',
		seoTitle: 'Drum & Bass Events on PartyLine',
		seoDescription:
			'Find upcoming drum & bass and jungle events on PartyLine. Public preview — open the app for the full calendar.',
		h1: 'Drum & Bass Events on PartyLine',
		heroLede:
			'Find upcoming drum & bass, jungle and bass-heavy club nights listed through PartyLine.',
		primaryCtaLabel: 'Explore Drum & Bass Events in App',
		primaryCtaHref: DIRECTORY_FILTER_LINKS.drumAndBass,
		contextTitle: 'DNB and bass culture',
		contextBody:
			'Organisers tag DNB, jungle and related sounds when submitting events. Preview matches are drawn from genre strings in the current public listings sample — not every DNB night nationally.',
		previewTitle: 'Drum & bass events preview',
		emptyMessage:
			'No matching drum & bass events are showing in the public preview right now. Open the app for the full calendar or submit an event.',
		matchGenres: ['drum', 'dnb', 'jungle', 'drum and bass'],
		faq: genreFaq('Drum & bass'),
		relatedCitySlugs: ['perth', 'melbourne', 'sydney'],
		relatedGenreSlugs: ['bass', 'techno', 'experimental']
	},
	{
		kind: 'genre',
		slug: 'bass',
		seoTitle: 'Bass Events on PartyLine',
		seoDescription:
			'Find upcoming bass music events and club nights on PartyLine. Public preview — open the app for the full calendar.',
		h1: 'Bass Events on PartyLine',
		heroLede:
			'Find upcoming bass music events, club nights and underground shows listed through PartyLine.',
		primaryCtaLabel: 'Explore Bass Events in App',
		primaryCtaHref: DIRECTORY_FILTER_LINKS.drumAndBass,
		contextTitle: 'Bass across the underground',
		contextBody:
			'Bass tags span DNB, bassline, 140 and more. App filters may group some bass tags together. This preview matches bass-related genre strings in the current public sample.',
		previewTitle: 'Bass events preview',
		emptyMessage:
			'No matching bass events are showing in the public preview right now. Open the app for the full calendar or submit an event.',
		matchGenres: ['bass'],
		faq: genreFaq('Bass'),
		relatedCitySlugs: ['perth', 'melbourne'],
		relatedGenreSlugs: ['drum-and-bass', 'techno', 'experimental']
	},
	{
		kind: 'genre',
		slug: 'day-parties',
		seoTitle: 'Day Party Events on PartyLine',
		seoDescription:
			'Find upcoming day parties and open-air events on PartyLine. Public preview — open the app for the full calendar.',
		h1: 'Day Party Events on PartyLine',
		heroLede:
			'Find upcoming day parties, open-air sessions and daytime underground events listed through PartyLine.',
		primaryCtaLabel: 'Explore Day Parties in App',
		primaryCtaHref: DIRECTORY_FILTER_LINKS.dayParties,
		contextTitle: 'Daytime and open-air',
		contextBody:
			'Day parties and open-air events appear as organisers submit them with the right tags and event types. DJs, crews and venues can link profiles around each listing.',
		previewTitle: 'Day party events preview',
		emptyMessage:
			'No matching day party events are showing in the public preview right now. Open the app for the full calendar or submit an event.',
		matchGenres: ['day party'],
		matchEventType: (eventType) => Boolean(eventType?.toLowerCase().includes('day party')),
		faq: genreFaq('Day party'),
		relatedCitySlugs: ['perth', 'sydney', 'brisbane'],
		relatedGenreSlugs: ['house', 'techno', 'garage']
	},
	{
		kind: 'genre',
		slug: 'garage',
		seoTitle: 'Garage & UKG Events on PartyLine',
		seoDescription:
			'Find upcoming garage and UKG events on PartyLine. Public preview — open the app for the full calendar.',
		h1: 'Garage Events on PartyLine',
		heroLede:
			'Find upcoming garage, UKG and bass-forward club nights listed through PartyLine.',
		primaryCtaLabel: 'Explore Garage Events in App',
		primaryCtaHref: APP_LINKS.events,
		contextTitle: 'Garage and UKG',
		contextBody:
			'Garage and UKG tags appear as organisers submit events. App genre filters are still expanding — open the app for the closest match while the directory grows Perth-first across Australia.',
		previewTitle: 'Garage events preview',
		emptyMessage:
			'No matching garage events are showing in the public preview right now. Open the app for the full calendar or submit an event.',
		matchGenres: ['garage', 'ukg'],
		faq: genreFaq('Garage'),
		relatedCitySlugs: ['perth', 'melbourne'],
		relatedGenreSlugs: ['house', 'bass', 'drum-and-bass']
	},
	{
		kind: 'genre',
		slug: 'trance',
		seoTitle: 'Trance Events on PartyLine',
		seoDescription:
			'Find upcoming trance events and club nights on PartyLine. Public preview — open the app for the full calendar.',
		h1: 'Trance Events on PartyLine',
		heroLede:
			'Find upcoming trance events, club nights and underground shows listed through PartyLine.',
		primaryCtaLabel: 'Explore Trance Events in App',
		primaryCtaHref: APP_LINKS.events,
		contextTitle: 'Trance on PartyLine',
		contextBody:
			'Trance-tagged listings come from organiser submissions. Dedicated app genre filters may expand over time — this preview matches trance genre strings in the current public sample.',
		previewTitle: 'Trance events preview',
		emptyMessage:
			'No matching trance events are showing in the public preview right now. Open the app for the full calendar or submit an event.',
		matchGenres: ['trance'],
		faq: genreFaq('Trance'),
		relatedCitySlugs: ['perth', 'melbourne', 'sydney'],
		relatedGenreSlugs: ['techno', 'house', 'experimental']
	},
	{
		kind: 'genre',
		slug: 'experimental',
		seoTitle: 'Experimental Events on PartyLine',
		seoDescription:
			'Find upcoming experimental, ambient and leftfield electronic events on PartyLine. Public preview — open the app for the full calendar.',
		h1: 'Experimental Events on PartyLine',
		heroLede:
			'Find upcoming experimental, ambient and leftfield electronic events listed through PartyLine.',
		primaryCtaLabel: 'Explore Experimental Events in App',
		primaryCtaHref: APP_LINKS.events,
		contextTitle: 'Leftfield and experimental',
		contextBody:
			'Experimental tags reflect organiser submissions across ambient, industrial and leftfield electronic nights. Preview matches are from the current public listings sample only.',
		previewTitle: 'Experimental events preview',
		emptyMessage:
			'No matching experimental events are showing in the public preview right now. Open the app for the full calendar or submit an event.',
		matchGenres: ['experimental', 'ambient', 'industrial'],
		faq: genreFaq('Experimental'),
		relatedCitySlugs: ['perth', 'melbourne'],
		relatedGenreSlugs: ['techno', 'drum-and-bass', 'trance']
	}
];

const CITY_BY_SLUG = new Map(CITY_LANDING_PAGES.map((page) => [page.slug, page]));
const GENRE_BY_SLUG = new Map(GENRE_LANDING_PAGES.map((page) => [page.slug, page]));
const DATE_BY_SLUG = new Map(DATE_LANDING_PAGES.map((page) => [page.slug, page]));

export function getCityLandingPage(slug: string): CityLandingConfig | undefined {
	return CITY_BY_SLUG.get(slug);
}

export function getGenreLandingPage(slug: string): GenreLandingConfig | undefined {
	return GENRE_BY_SLUG.get(slug);
}

export function getDateLandingPage(slug: string): DateLandingConfig | undefined {
	return DATE_BY_SLUG.get(slug);
}

export function cityLandingPath(slug: string): string {
	return `/events/${slug}`;
}

export function genreLandingPath(slug: string): string {
	return `/events/genre/${slug}`;
}

export function buildLandingRelatedLinks(config: EventLandingConfig): RelatedLinkItem[] {
	const links: RelatedLinkItem[] = [];

	for (const slug of config.relatedCitySlugs) {
		const city = getCityLandingPage(slug);
		if (city) {
			links.push({ label: city.h1.replace(' Underground Events', ''), href: cityLandingPath(slug) });
		}
	}

	for (const slug of config.relatedGenreSlugs) {
		const genre = getGenreLandingPage(slug);
		if (genre) {
			links.push({
				label: genre.h1.replace(' Events on PartyLine', ''),
				href: genreLandingPath(slug)
			});
		}
	}

	links.push({ label: 'Event directory', href: '/events/directory' });
	links.push({
		label: 'Submit guide',
		href: '/guides/how-to-submit-your-event-to-partyline'
	});

	return links;
}

export function getLandingCanonicalPath(config: EventLandingConfig): string {
	return config.kind === 'genre' ? genreLandingPath(config.slug) : `/events/${config.slug}`;
}

export function getLandingBreadcrumbs(config: EventLandingConfig): { name: string; path: string }[] {
	const crumbs = [
		{ name: 'Home', path: '/' },
		{ name: 'Event directory', path: '/events/directory' }
	];

	if (config.kind === 'genre') {
		crumbs.push({ name: config.h1.replace(' Events on PartyLine', ''), path: getLandingCanonicalPath(config) });
	} else {
		crumbs.push({ name: config.h1, path: getLandingCanonicalPath(config) });
	}

	return crumbs;
}
