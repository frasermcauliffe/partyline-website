#!/usr/bin/env node
/**
 * One-off polish for blog post frontmatter — descriptions and tags.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../src/content/blog');

const SUB_BASS_SLUG =
	'sub-bass-a-storm-at-raindance-and-the-art-of-the-label-hack';
const SUB_BASS_DESCRIPTION =
	"If you've been paying attention to the Perth underground music circuit lately, you know that the local Drum & Bass scene isn't just surviving, it's thriving. And right at the centre of that low-end frequency is Mooch (Marc Chadwick).";

function cleanBlogText(text) {
	let cleaned = String(text ?? '');
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

function parseFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) throw new Error('Invalid frontmatter');
	return { frontmatter: yaml.load(match[1]), body: match[2] };
}

async function main() {
	const files = (await fs.readdir(BLOG_DIR)).filter((f) => f.endsWith('.md'));
	let descriptionsCleaned = 0;
	let tagsFixed = 0;

	for (const file of files) {
		const filePath = path.join(BLOG_DIR, file);
		const raw = await fs.readFile(filePath, 'utf8');
		const { frontmatter, body } = parseFrontmatter(raw);
		let changed = false;

		const slug = frontmatter.slug ?? file.replace(/\.md$/, '');
		const originalDescription = frontmatter.description ?? '';

		if (slug === SUB_BASS_SLUG) {
			if (frontmatter.description !== SUB_BASS_DESCRIPTION) {
				frontmatter.description = SUB_BASS_DESCRIPTION;
				descriptionsCleaned += 1;
				changed = true;
			}
		} else {
			const cleaned = cleanBlogText(originalDescription);
			if (cleaned !== originalDescription) {
				frontmatter.description = cleaned;
				descriptionsCleaned += 1;
				changed = true;
			}
		}

		if (Array.isArray(frontmatter.tags)) {
			const cleanedTags = frontmatter.tags.map((tag) => cleanBlogText(tag));
			if (JSON.stringify(cleanedTags) !== JSON.stringify(frontmatter.tags)) {
				frontmatter.tags = cleanedTags;
				tagsFixed += 1;
				changed = true;
			}
		}

		if (frontmatter.category) {
			const cleanedCategory = cleanBlogText(frontmatter.category);
			if (cleanedCategory !== frontmatter.category) {
				frontmatter.category = cleanedCategory;
				changed = true;
			}
		}

		if (changed) {
			const output = `---\n${yaml.dump(frontmatter, { lineWidth: -1 })}---\n${body}`;
			await fs.writeFile(filePath, output, 'utf8');
			console.log(`  ✓ ${file}`);
		}
	}

	console.log(`\nDescriptions cleaned: ${descriptionsCleaned}`);
	console.log(`Files with tags fixed: ${tagsFixed}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
