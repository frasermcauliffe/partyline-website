import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
	browseProfilesNavItem,
	desktopNav,
	mobileMainNav,
	mobileNavGroups
} from '@/data/nav';

describe('header navigation', () => {
	it('desktopNav has seven items in approved order without Opportunities', () => {
		expect(desktopNav).toHaveLength(7);
		expect(desktopNav.map((item) => item.label)).toEqual([
			'Events',
			'Profiles',
			'Artists & DJs',
			'Organisers',
			'Venues',
			'Blog',
			'About'
		]);
		expect(desktopNav.some((item) => item.label === 'Opportunities')).toBe(false);
	});

	it('mobileMainNav includes Opportunities once and Profiles once', () => {
		expect(mobileMainNav).toHaveLength(8);
		expect(mobileMainNav.filter((item) => item.label === 'Profiles')).toHaveLength(1);
		expect(mobileMainNav.some((item) => item.label === 'Opportunities')).toBe(true);
	});

	it('Profiles nav item links to website /profiles', () => {
		expect(browseProfilesNavItem.href).toBe('/profiles');
		expect(desktopNav.find((item) => item.label === 'Profiles')?.href).toBe('/profiles');
	});

	it('mobile Main group uses mobileMainNav', () => {
		const mainGroup = mobileNavGroups.find((group) => group.label === 'Main');
		expect(mainGroup?.items).toEqual(mobileMainNav);
	});

	it('SiteHeader has no ghost Explore Events or duplicate Profiles CTA', () => {
		const headerSource = readFileSync(
			resolve(process.cwd(), 'src/components/site/SiteHeader.astro'),
			'utf8'
		);
		expect(headerSource).not.toContain('Explore Events');
		expect(headerSource).not.toContain('browseProfilesNavItem');
		expect(headerSource).not.toContain('site-header__ghost-cta');
		expect(headerSource).toContain('desktopNav');
		expect(headerSource).toContain('mobileNavJoinItem');
	});
});
