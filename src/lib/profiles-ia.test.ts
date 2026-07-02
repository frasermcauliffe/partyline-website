import { describe, expect, it } from 'vitest';
import { APP_LINKS, profilesFilterUrl } from '@/data/app-links';
import { browseProfilesNavItem, marketingNav } from '@/data/nav';
import { PAGE_SEO } from '@/lib/seo';

describe('profiles IA', () => {
	it('APP_LINKS.profiles points to app /profiles', () => {
		expect(APP_LINKS.profiles).toMatch(/\/profiles$/);
	});

	it('marketing nav Profiles links to website /profiles', () => {
		const profilesNav = marketingNav.find((item) => item.label === 'Profiles');
		expect(profilesNav?.href).toBe('/profiles');
		expect(browseProfilesNavItem.href).toBe('/profiles');
	});

	it('PAGE_SEO.profiles uses website canonical /profiles', () => {
		expect(PAGE_SEO.profiles.canonicalPath).toBe('/profiles');
	});

	it('profilesFilterUrl builds app type filters', () => {
		expect(profilesFilterUrl('artist_dj')).toContain('/profiles?type=artist_dj');
	});
});
