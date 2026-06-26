import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

const HTML_ENTITIES: Record<string, string> = {
	'&amp;': '&',
	'&quot;': '"',
	'&#039;': "'",
	'&apos;': "'",
	'&lt;': '<',
	'&gt;': '>',
	'&nbsp;': ' '
};

/** Strip markdown emphasis and decode common HTML entities for display/SEO. */
export function cleanBlogText(text: string): string {
	let cleaned = text;

	for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
		cleaned = cleaned.split(entity).join(char);
	}

	cleaned = cleaned
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/\*([^*]+)\*/g, '$1')
		.replace(/_([^_]+)_/g, '$1')
		.replace(/\*\*/g, '')
		.replace(/\s+/g, ' ')
		.trim();

	return cleaned;
}

export function getPostSlug(post: BlogEntry): string {
	return post.data.slug ?? post.id;
}

export function getPublishedPosts(posts: BlogEntry[]): BlogEntry[] {
	return posts
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export function formatBlogDate(date: Date): string {
	return new Intl.DateTimeFormat('en-AU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(date);
}

const WORDS_PER_MINUTE = 200;

/**
 * Derive an approximate reading time from raw markdown body text.
 *
 * Computed metadata (word count / ~200 wpm), not invented. Returns at least
 * "1 min read". Returns undefined when no body text is available.
 */
export function readingTimeLabel(body?: string): string | undefined {
	if (!body) return undefined;

	const words = body
		.replace(/`{1,3}[^`]*`{1,3}/g, ' ')
		.replace(/[#>*_~\-]+/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;

	if (words === 0) return undefined;

	const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
	return `${minutes} min read`;
}

export function postHref(post: BlogEntry): string {
	return `/blog/${getPostSlug(post)}`;
}

export const UPDATED_THRESHOLD_MS = 24 * 60 * 60 * 1000;

export function shouldShowUpdatedDate(publishedAt: Date, updatedAt?: Date): boolean {
	if (!updatedAt) return false;
	return updatedAt.getTime() - publishedAt.getTime() >= UPDATED_THRESHOLD_MS;
}
