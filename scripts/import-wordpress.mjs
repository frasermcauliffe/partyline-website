#!/usr/bin/env node
/**
 * Import published WordPress posts from a WXR export into Astro content collection Markdown.
 *
 * Usage: node scripts/import-wordpress.mjs [path-to-export.xml]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DEFAULT_XML = path.join(ROOT, 'imports/partylinecollective.WordPress.2026-06-22.xml');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const MEDIA_ROOT = path.join(ROOT, 'public/blog/media');
const REDIRECTS_PATH = path.join(ROOT, 'redirects.wordpress.json');
const VERCEL_PATH = path.join(ROOT, 'vercel.json');
const REPORT_PATH = path.join(ROOT, 'imports/import-report.json');

const DEFAULT_AUTHOR = 'PartyLine Collective';
const AUTHOR_MAP = {
	partylinecollective: DEFAULT_AUTHOR
};

const stats = {
	postsImported: 0,
	imagesDownloaded: 0,
	imagesFailed: 0,
	redirectsGenerated: 0,
	postsNeedingCleanup: [],
	failedImages: []
};

const nhm = new NodeHtmlMarkdown({
	ignore: ['script', 'style'],
	textReplace: [[/\u00a0/g, ' ']]
});

function htmlToMarkdown(html) {
	const cleaned = preprocessHtml(html);
	if (!cleaned.trim()) return '';
	return nhm.translate(cleaned).replace(/\n{3,}/g, '\n\n').trim();
}

function text(value) {
	if (value == null) return '';
	if (Array.isArray(value)) return text(value[0]);
	if (typeof value === 'string') return value.trim();
	if (typeof value === 'number') return String(value);
	if (typeof value === 'object' && '#text' in value) return text(value['#text']);
	return String(value).trim();
}

function asArray(value) {
	if (value == null) return [];
	return Array.isArray(value) ? value : [value];
}

function decodeSlug(raw) {
	try {
		return decodeURIComponent(raw);
	} catch {
		return raw;
	}
}

function stripHtml(html) {
	return html
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
}

function truncate(textValue, max = 160) {
	if (textValue.length <= max) return textValue;
	const trimmed = textValue.slice(0, max - 1);
	const lastSpace = trimmed.lastIndexOf(' ');
	return `${(lastSpace > 80 ? trimmed.slice(0, lastSpace) : trimmed).trim()}…`;
}

function cleanBlogText(value) {
	let cleaned = value;
	const entities = {
		'&amp;': '&',
		'&quot;': '"',
		'&#039;': "'",
		'&apos;': "'",
		'&lt;': '<',
		'&gt;': '>',
		'&nbsp;': ' '
	};
	for (const [entity, char] of Object.entries(entities)) {
		cleaned = cleaned.split(entity).join(char);
	}
	return cleaned
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/\*([^*]+)\*/g, '$1')
		.replace(/_([^_]+)_/g, '$1')
		.replace(/\*\*/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function shouldIncludeUpdatedAt(publishedAt, updatedAt) {
	if (!updatedAt || updatedAt === publishedAt) return false;
	const diffMs = new Date(updatedAt).getTime() - new Date(publishedAt).getTime();
	return diffMs >= 24 * 60 * 60 * 1000;
}

function preprocessHtml(html) {
	return html
		.replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '')
		.replace(/<hr[^>]*>/gi, '<hr />')
		.replace(/\u00a0/g, ' ');
}

function getMetaValue(postmeta, key) {
	for (const meta of asArray(postmeta)) {
		if (text(meta['wp:meta_key']) === key) {
			return text(meta['wp:meta_value']);
		}
	}
	return '';
}

function getCategories(item) {
	return asArray(item.category).map((cat) => ({
		domain: cat['@_domain'] ?? cat.domain ?? '',
		name: cleanBlogText(text(cat)),
		nicename: cat['@_nicename'] ?? cat.nicename ?? ''
	}));
}

function resolveAuthor(item) {
	const fromMeta = getMetaValue(item['wp:postmeta'], 'ppma_authors_name');
	if (fromMeta) return fromMeta;

	const creator = text(item['dc:creator']);
	return AUTHOR_MAP[creator.toLowerCase()] ?? (creator || DEFAULT_AUTHOR);
}

function buildDescription(item, markdown) {
	const excerpt = stripHtml(text(item['excerpt:encoded']));
	if (excerpt) return truncate(cleanBlogText(excerpt));

	const firstParagraph = markdown
		.split('\n\n')
		.map((block) => block.trim())
		.find((block) => block && !block.startsWith('#') && !block.startsWith('![') && block !== '---');

	if (firstParagraph) {
		const plain = stripHtml(firstParagraph.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
		return truncate(cleanBlogText(plain));
	}

	return truncate(cleanBlogText(stripHtml(text(item.title))));
}

function sanitizeFilename(slug) {
	return slug.replace(/[\\/:*?"<>|]/g, '-');
}

function basenameFromUrl(url) {
	try {
		const parsed = new URL(url);
		return path.basename(parsed.pathname);
	} catch {
		return path.basename(url);
	}
}

async function downloadImage(url, destPath) {
	try {
		const response = await fetch(url, { redirect: 'follow' });
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}
		const buffer = Buffer.from(await response.arrayBuffer());
		await fs.mkdir(path.dirname(destPath), { recursive: true });
		await fs.writeFile(destPath, buffer);
		stats.imagesDownloaded += 1;
		return true;
	} catch (error) {
		stats.imagesFailed += 1;
		stats.failedImages.push({ url, destPath, error: error.message });
		console.warn(`  ⚠ Image download failed: ${url} (${error.message})`);
		return false;
	}
}

async function localizeImage(url, slug, cache) {
	if (!url || cache.has(url)) return cache.get(url);

	const filename = basenameFromUrl(url);
	const localRelative = `/blog/media/${slug}/${filename}`;
	const localAbsolute = path.join(MEDIA_ROOT, slug, filename);

	const ok = await downloadImage(url, localAbsolute);
	const result = ok ? localRelative : url;
	cache.set(url, result);
	return result;
}

async function rewriteImagesInMarkdown(markdown, slug, cache) {
	const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
	let result = markdown;
	const matches = [...markdown.matchAll(imgRegex)];

	for (const match of matches) {
		const [full, alt, src] = match;
		if (!src.startsWith('http')) continue;
		const local = await localizeImage(src, slug, cache);
		result = result.replace(full, `![${alt}](${local})`);
	}

	return result;
}

function addRedirect(redirects, source, destination) {
	if (!source || source === destination) return;

	const variants = new Set([
		source,
		source.endsWith('/') ? source.slice(0, -1) : `${source}/`
	]);

	for (const variant of variants) {
		const key = `${variant}->${destination}`;
		if (redirects.has(key)) continue;
		redirects.set(key, { source: variant, destination, permanent: true });
	}
}

function pathnameFromLink(link) {
	try {
		const parsed = new URL(link);
		return parsed.pathname;
	} catch {
		return '';
	}
}

async function main() {
	const xmlPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_XML;
	console.log(`Reading ${xmlPath}`);

	const xml = await fs.readFile(xmlPath, 'utf8');
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: '@_',
		cdataPropName: '#text',
		trimValues: true
	});
	const parsed = parser.parse(xml);
	const items = asArray(parsed?.rss?.channel?.item);

	const attachments = new Map();
	const attachmentAlts = new Map();

	for (const item of items) {
		if (text(item['wp:post_type']) !== 'attachment') continue;
		const id = text(item['wp:post_id']);
		const url = text(item['wp:attachment_url']) || text(item.guid?.['#text'] ?? item.guid);
		if (id && url) attachments.set(id, url);
		const alt = getMetaValue(item['wp:postmeta'], '_wp_attachment_image_alt');
		if (id && alt) attachmentAlts.set(id, alt);
	}

	await fs.mkdir(BLOG_DIR, { recursive: true });
	await fs.rm(BLOG_DIR, { recursive: true, force: true });
	await fs.mkdir(BLOG_DIR, { recursive: true });
	await fs.mkdir(MEDIA_ROOT, { recursive: true });

	const redirects = new Map();
	addRedirect(redirects, '/bpm-blogs', '/blog');
	addRedirect(redirects, '/bpm-blogs/', '/blog');

	const posts = items.filter(
		(item) =>
			text(item['wp:post_type']) === 'post' && text(item['wp:status']) === 'publish'
	);

	console.log(`Found ${posts.length} published posts`);

	for (const item of posts) {
		const rawSlug = text(item['wp:post_name']);
		const slug = decodeSlug(rawSlug);
		const safeFilename = sanitizeFilename(slug);
		const title = stripHtml(text(item.title));
		const wordpressId = Number(text(item['wp:post_id'])) || undefined;
		const oldUrl = text(item.link);
		const publishedAt = text(item['wp:post_date']);
		const updatedAt = text(item['wp:post_modified']);
		const categories = getCategories(item);
		const category = categories.find((c) => c.domain === 'category')?.name;
		const tags = categories
			.filter((c) => c.domain === 'post_tag')
			.map((c) => cleanBlogText(c.name));
		const author = resolveAuthor(item);

		let html = text(item['content:encoded']);
		let markdown = htmlToMarkdown(html);

		const imageCache = new Map();
		markdown = await rewriteImagesInMarkdown(markdown, safeFilename, imageCache);

		let featuredImage;
		let featuredImageAlt;
		const thumbnailId = getMetaValue(item['wp:postmeta'], '_thumbnail_id');
		if (thumbnailId && attachments.has(thumbnailId)) {
			const sourceUrl = attachments.get(thumbnailId);
			featuredImage = await localizeImage(sourceUrl, safeFilename, imageCache);
			featuredImageAlt = attachmentAlts.get(thumbnailId) || title;
		}

		const description = buildDescription(item, markdown);

		const frontmatter = {
			title: cleanBlogText(title),
			description,
			slug,
			publishedAt,
			...(shouldIncludeUpdatedAt(publishedAt, updatedAt) ? { updatedAt } : {}),
			author: cleanBlogText(author),
			...(category ? { category } : {}),
			...(tags.length ? { tags } : {}),
			...(featuredImage ? { featuredImage, featuredImageAlt: cleanBlogText(featuredImageAlt || title) } : {}),
			draft: false,
			originalSlug: rawSlug,
			wordpressId,
			oldUrl
		};

		const body = `---\n${yaml.dump(frontmatter, { lineWidth: -1 })}---\n\n${markdown}\n`;
		const filePath = path.join(BLOG_DIR, `${safeFilename}.md`);
		await fs.writeFile(filePath, body, 'utf8');
		stats.postsImported += 1;

		const oldPath = pathnameFromLink(oldUrl);
		if (oldPath && oldPath !== `/blog/${slug}` && oldPath !== `/blog/${slug}/`) {
			addRedirect(redirects, oldPath, `/blog/${slug}`);
		}

		const cleanupFlags = [];
		if (/\[.*?\]\(https?:\/\/partylinecollective\.com\/wp-content/.test(markdown)) {
			cleanupFlags.push('wp-content links remain');
		}
		if (/\[.*?\]\(https?:\/\/partylinecollective\.com\/(?!wp-content)/.test(markdown)) {
			cleanupFlags.push('internal WordPress links remain');
		}
		if (markdown.includes('wp:')) {
			cleanupFlags.push('wordpress block markers');
		}
		if (stats.failedImages.some((f) => f.url && markdown.includes(f.url))) {
			cleanupFlags.push('failed image downloads');
		}
		if (cleanupFlags.length) {
			stats.postsNeedingCleanup.push({ slug, title, flags: cleanupFlags });
		}

		console.log(`  ✓ ${slug}`);
	}

	const redirectList = [...redirects.values()].sort((a, b) => a.source.localeCompare(b.source));
	stats.redirectsGenerated = redirectList.length;

	await fs.writeFile(REDIRECTS_PATH, JSON.stringify(redirectList, null, 2));
	await fs.writeFile(
		VERCEL_PATH,
		JSON.stringify({ redirects: redirectList }, null, 2) + '\n'
	);
	await fs.writeFile(REPORT_PATH, JSON.stringify(stats, null, 2));

	console.log('\nImport complete');
	console.log(`  Posts imported:      ${stats.postsImported}`);
	console.log(`  Images downloaded:   ${stats.imagesDownloaded}`);
	console.log(`  Images failed:       ${stats.imagesFailed}`);
	console.log(`  Redirects generated: ${stats.redirectsGenerated}`);
	console.log(`  Posts needing cleanup: ${stats.postsNeedingCleanup.length}`);
	console.log(`\nWrote ${REDIRECTS_PATH}`);
	console.log(`Wrote ${VERCEL_PATH}`);
	console.log(`Wrote ${REPORT_PATH}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
