import { SITE, SITE_URL } from '@/data/site';

export type PageSeo = {
	title: string;
	description: string;
	canonicalPath: string;
	ogImage?: string;
};

const DEFAULT_OG_IMAGE = '/og-default.svg';
const TITLE_SUFFIX = SITE.name;

export function buildPageSeo(input: {
	title: string;
	description: string;
	canonicalPath: string;
	ogImage?: string;
}): PageSeo {
	return {
		title: input.title.includes(TITLE_SUFFIX) ? input.title : `${input.title} · ${TITLE_SUFFIX}`,
		description: input.description.trim(),
		canonicalPath: input.canonicalPath.startsWith('/')
			? input.canonicalPath
			: `/${input.canonicalPath}`,
		ogImage: input.ogImage ?? DEFAULT_OG_IMAGE
	};
}

export function absoluteUrl(path: string): string {
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return `${SITE_URL.replace(/\/$/, '')}${normalized}`;
}

export function organizationJsonLd(): string {
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE.name,
		url: SITE_URL,
		description: SITE.description,
		email: SITE.contactEmail
	});
}

export function websiteJsonLd(): string {
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE.name,
		url: SITE_URL,
		description: SITE.description
	});
}

export const PAGE_SEO = {
	home: buildPageSeo({
		title: SITE.name,
		description:
			'PartyLine Collective — underground events, DJs, venues, organisers and opportunities across Australia. Scene infrastructure for connection.',
		canonicalPath: '/'
	}),
	events: buildPageSeo({
		title: 'Underground Events',
		description:
			'Discover club nights, warehouse parties and underground events across Australia. Browse live listings in the PartyLine Collective app.',
		canonicalPath: '/events'
	}),
	artistsDjs: buildPageSeo({
		title: 'Artists & DJs',
		description:
			'Build your Artist or DJ profile on PartyLine Collective. Get discovered, apply to opportunities, and connect with organisers and venues.',
		canonicalPath: '/artists-djs'
	}),
	organisers: buildPageSeo({
		title: 'Organisers',
		description:
			'Submit underground events, post DJ opportunities, and build organiser presence with PartyLine Collective.',
		canonicalPath: '/organisers'
	}),
	venues: buildPageSeo({
		title: 'Venues',
		description:
			'Create venue profiles on PartyLine Collective. Connect with organisers, artists and underground events across Australia.',
		canonicalPath: '/venues'
	}),
	opportunities: buildPageSeo({
		title: 'DJ Opportunities',
		description:
			'DJs wanted, open decks, warm-up slots, guest mixes and residencies on PartyLine Collective — browse and apply in the app.',
		canonicalPath: '/opportunities'
	}),
	about: buildPageSeo({
		title: 'About',
		description:
			'Why PartyLine Collective exists — practical scene infrastructure for Australia\u2019s underground music and events community.',
		canonicalPath: '/about'
	}),
	contact: buildPageSeo({
		title: 'Contact',
		description:
			'Contact PartyLine Collective — partnerships, venue and organiser enquiries, and feedback during closed alpha.',
		canonicalPath: '/contact'
	})
} as const;
