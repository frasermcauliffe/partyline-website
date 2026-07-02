import { describe, expect, it } from 'vitest';
import { directoryPageJsonLd } from '@/lib/seo';
import { getCityLandingPage, getLandingBreadcrumbs } from '@/data/event-landing-pages';

describe('seo', () => {
	it('directoryPageJsonLd uses /events as the collection URL', () => {
		const json = JSON.parse(
			directoryPageJsonLd({
				description: 'Test directory description',
				events: [{ title: 'Test Night', appUrl: 'https://app.example/events/test' }]
			})
		);

		expect(json.url).toContain('/events');
		expect(json.url).not.toContain('/events/directory');
	});
});

describe('event landing breadcrumbs', () => {
	it('links back to /events for city landing pages', () => {
		const perth = getCityLandingPage('perth');
		expect(perth).toBeDefined();

		const crumbs = getLandingBreadcrumbs(perth!);
		const directoryCrumb = crumbs.find((crumb) => crumb.name === 'Event directory');

		expect(directoryCrumb?.path).toBe('/events');
	});
});
