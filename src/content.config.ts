import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		slug: z.string().optional(),
		publishedAt: z.coerce.date(),
		updatedAt: z.coerce.date().optional(),
		author: z.string().default('PartyLine Collective'),
		category: z.string().optional(),
		tags: z.array(z.string()).default([]),
		featuredImage: z.string().optional(),
		featuredImageAlt: z.string().optional(),
		draft: z.boolean().default(false),
		originalSlug: z.string().optional(),
		wordpressId: z.number().optional(),
		oldUrl: z.string().optional()
	})
});

const guideAudience = z.enum(['fans', 'organisers', 'artists', 'venues', 'all']);

const guides = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		slug: z.string().optional(),
		publishedAt: z.coerce.date(),
		updatedAt: z.coerce.date().optional(),
		category: z.string(),
		audience: guideAudience,
		relatedLinks: z
			.array(
				z.object({
					label: z.string(),
					href: z.string()
				})
			)
			.optional(),
		draft: z.boolean().default(false),
		seoTitle: z.string().optional(),
		seoDescription: z.string().optional()
	})
});

export const collections = { blog, guides };
