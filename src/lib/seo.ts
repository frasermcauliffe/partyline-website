import { cleanBlogText, type BlogEntry } from '@/lib/blog';
import { SITE, SITE_URL } from '@/data/site';

export type PageSeo = {
	title: string;
	description: string;
	canonicalPath: string;
	ogImage?: string;
};

export type ArticleSeo = PageSeo & {
	publishedAt?: Date;
	updatedAt?: Date;
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

export function buildBlogPostSeo(input: {
	title: string;
	description: string;
	slug: string;
	featuredImage?: string;
}): PageSeo {
	return buildPageSeo({
		title: input.title,
		description: cleanBlogText(input.description),
		canonicalPath: `/blog/${input.slug}`,
		ogImage: input.featuredImage ?? DEFAULT_OG_IMAGE
	});
}

export function blogPostingJsonLd(input: { post: BlogEntry; slug: string }): string {
	const { post, slug } = input;
	const image = post.data.featuredImage
		? absoluteUrl(post.data.featuredImage)
		: absoluteUrl(DEFAULT_OG_IMAGE);

	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.data.title,
		description: cleanBlogText(post.data.description),
		datePublished: post.data.publishedAt.toISOString(),
		dateModified: (post.data.updatedAt ?? post.data.publishedAt).toISOString(),
		author: {
			'@type': 'Organization',
			name: post.data.author
		},
		publisher: {
			'@type': 'Organization',
			name: SITE.name,
			url: SITE_URL
		},
		mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
		image,
		url: absoluteUrl(`/blog/${slug}`)
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
			'Create your Artist or DJ profile on PartyLine. Get discovered, show your sound, apply to opportunities, and receive booking enquiries.',
		canonicalPath: '/artists-djs'
	}),
	organisers: buildPageSeo({
		title: 'Organisers',
		description:
			'Submit events, post DJ opportunities, review applicants, and build organiser presence with PartyLine — scene infrastructure for promoters and crews.',
		canonicalPath: '/organisers'
	}),
	venues: buildPageSeo({
		title: 'Venues',
		description:
			'List your club, warehouse or event space on PartyLine. Connect with organisers, receive enquiries, and link events at your venue.',
		canonicalPath: '/venues'
	}),
	opportunities: buildPageSeo({
		title: 'DJ Opportunities',
		description:
			'DJs wanted, open decks, warm-up slots, guest mixes and residencies — browse and apply on PartyLine with your published profile.',
		canonicalPath: '/opportunities'
	}),
	howItWorks: buildPageSeo({
		title: 'How It Works',
		description:
			'How PartyLine works — discover events, create profiles, submit nights, apply for opportunities, and manage your scene activity in one place.',
		canonicalPath: '/how-it-works'
	}),
	platform: buildPageSeo({
		title: 'PartyLine Platform | How Australia\u2019s Underground Music Scene Connects',
		description:
			'See how PartyLine connects events, artists, DJs, venues, organisers, suppliers and fans through public discovery, profiles, opportunities, dashboards and future scene insights.',
		canonicalPath: '/platform'
	}),
	about: buildPageSeo({
		title: 'About',
		description:
			'Why PartyLine Collective exists — practical, community-first infrastructure for Australia\u2019s underground music and events scene.',
		canonicalPath: '/about'
	}),
	partners: buildPageSeo({
		title: 'Ticket Partnerships',
		description:
			'Request a tracked PartyLine ticket link or affiliate setup for your events. Partner support for underground organisers and ticket platforms.',
		canonicalPath: '/partners'
	}),
	contact: buildPageSeo({
		title: 'Contact',
		description:
			'Contact PartyLine Collective — general enquiries, ticket partnerships, profile corrections, and app feedback during closed alpha.',
		canonicalPath: '/contact'
	}),
	privacy: buildPageSeo({
		title: 'Privacy Policy',
		description:
			'How PartyLine Collective handles your information during closed alpha — what we collect, why, and how to contact us.',
		canonicalPath: '/privacy'
	}),
	terms: buildPageSeo({
		title: 'Terms of Use',
		description:
			'Terms for using PartyLine Collective and the PartyLine app — accounts, listings, opportunities, and platform limitations.',
		canonicalPath: '/terms'
	}),
	communityGuidelines: buildPageSeo({
		title: 'Community Guidelines',
		description:
			'Community standards for PartyLine — respectful participation, accurate listings, and underground scene conduct.',
		canonicalPath: '/community-guidelines'
	}),
	blog: buildPageSeo({
		title: 'Blog',
		description:
			'Articles from PartyLine Collective — Track of the Week, Industry Insiiide features, and underground music stories across Australia.',
		canonicalPath: '/blog'
	})
} as const;
