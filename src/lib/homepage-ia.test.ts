import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
	HOME_APP_PREVIEWS,
	HOME_FAQ,
	HOME_HOW_IT_WORKS,
	HOME_PROOF_CHIPS,
	HOME_ROLE_CARDS
} from '@/data/home-content';
import { PAGE_SEO } from '@/lib/seo';

describe('homepage conversion IA', () => {
	it('proof chips avoid bookings-first positioning', () => {
		const joined = HOME_PROOF_CHIPS.join(' ').toLowerCase();
		expect(joined).not.toContain('bookings in one place');
		expect(joined).toContain('discovery tools');
	});

	it('how-it-works steps are discovery-first', () => {
		const joined = HOME_HOW_IT_WORKS.map((step) => `${step.title} ${step.description}`).join(' ');
		expect(joined.toLowerCase()).not.toContain('secure deposit');
		expect(joined.toLowerCase()).not.toContain('enquire, book and build');
		expect(HOME_HOW_IT_WORKS).toHaveLength(3);
	});

	it('role cards include six core profile-side roles only', () => {
		expect(HOME_ROLE_CARDS).toHaveLength(6);
		expect(HOME_ROLE_CARDS.some((card) => card.title.includes('Fans'))).toBe(false);
	});

	it('app preview has three core tiles only', () => {
		expect(HOME_APP_PREVIEWS).toHaveLength(3);
		const labels = HOME_APP_PREVIEWS.map((item) => item.title).join(' ').toLowerCase();
		expect(labels).not.toContain('deposit');
		expect(labels).not.toContain('booking enquiry');
	});

	it('homepage FAQ is trimmed and avoids deposit-heavy answers', () => {
		expect(HOME_FAQ.length).toBeLessThanOrEqual(6);
		const joined = HOME_FAQ.map((item) => `${item.question} ${item.answer}`).join(' ').toLowerCase();
		expect(joined).not.toContain('how do secure deposits work');
		expect(joined).not.toContain('how do bookings work');
	});

	it('homepage meta is discovery-first', () => {
		expect(PAGE_SEO.home.description.toLowerCase()).toContain('discovery tools');
		expect(PAGE_SEO.home.description.toLowerCase()).not.toContain('secure deposit');
	});

	it('homepage source routes browse events to /events', () => {
		const indexSource = readFileSync(resolve(process.cwd(), 'src/pages/index.astro'), 'utf8');
		expect(indexSource).toContain('href="/events" label="Browse events"');
		expect(indexSource).toContain('href="/profiles" label="Browse profiles"');
		expect(indexSource).not.toContain('/events/directory');
		expect(indexSource).not.toContain('/the-scene');
	});

	it('homepage source removes bookings section', () => {
		const indexSource = readFileSync(resolve(process.cwd(), 'src/pages/index.astro'), 'utf8');
		expect(indexSource.toLowerCase()).not.toContain('secure deposits');
		expect(indexSource).not.toContain('FeatureGrid');
		expect(indexSource).not.toContain('HOME_FEATURES');
	});
});
