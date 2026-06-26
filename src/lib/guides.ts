import type { CollectionEntry } from 'astro:content';

export type GuideEntry = CollectionEntry<'guides'>;

export type GuideAudience = GuideEntry['data']['audience'];

const AUDIENCE_LABELS: Record<GuideAudience, string> = {
	fans: 'Fans & guests',
	organisers: 'Organisers',
	artists: 'Artists & DJs',
	venues: 'Venues',
	all: 'All audiences'
};

export function getGuideSlug(guide: GuideEntry): string {
	return guide.data.slug ?? guide.id;
}

export function getPublishedGuides(guides: GuideEntry[]): GuideEntry[] {
	return guides
		.filter((guide) => !guide.data.draft)
		.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export function guideHref(guide: GuideEntry): string {
	return `/guides/${getGuideSlug(guide)}`;
}

export function formatGuideAudience(audience: GuideAudience): string {
	return AUDIENCE_LABELS[audience];
}
