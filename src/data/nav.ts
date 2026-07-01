import { APP_LINKS } from '@/data/app-links';

export type NavItem = {
	label: string;
	href: string;
	external?: boolean;
};

/** App directory link — clearer public label than in-app "The Scene". */
export const browseProfilesNavItem: NavItem = {
	label: 'Browse Profiles',
	href: APP_LINKS.theScene,
	external: true
};

export const marketingNav: NavItem[] = [
	{ label: 'Events', href: '/events' },
	{ label: 'Blog', href: '/blog' },
	{ label: 'Artists & DJs', href: '/artists-djs' },
	{ label: 'Organisers', href: '/organisers' },
	{ label: 'Venues', href: '/venues' },
	{ label: 'Opportunities', href: '/opportunities' },
	{ label: 'About', href: '/about' }
];

export type NavGroup = {
	label: string;
	items: NavItem[];
};

/**
 * Grouped navigation for the mobile disclosure menu only. Desktop nav output
 * (marketingNav) is unchanged; this surfaces footer-only destinations
 * (Guides / Platform / Releases / How It Works) on small screens.
 */
export const mobileNavGroups: NavGroup[] = [
	{
		label: 'Main',
		items: [marketingNav[0], browseProfilesNavItem, ...marketingNav.slice(1)]
	},
	{
		label: 'More',
		items: [
			{ label: 'Guides', href: '/guides' },
			{ label: 'Platform', href: '/platform' },
			{ label: 'Releases', href: '/releases' },
			{ label: 'How It Works', href: '/how-it-works' }
		]
	}
];

export const footerPlatformLinks: NavItem[] = [
	{ label: 'Events', href: '/events' },
	{ label: 'Blog', href: '/blog' },
	{ label: 'Guides', href: '/guides' },
	{ label: 'How It Works', href: '/how-it-works' },
	{ label: 'Platform', href: '/platform' },
	{ label: 'Release Notes', href: '/releases' },
	{ label: 'About', href: '/about' },
	{ label: 'Partners', href: '/partners' },
	{ label: 'Contact', href: '/contact' }
];

export const footerForYouLinks: NavItem[] = [
	{ label: 'Artists & DJs', href: '/artists-djs' },
	{ label: 'Organisers', href: '/organisers' },
	{ label: 'Venues', href: '/venues' },
	{ label: 'Opportunities', href: '/opportunities' }
];

export const footerLegalLinks: NavItem[] = [
	{ label: 'Privacy Policy', href: '/privacy' },
	{ label: 'Terms of Use', href: '/terms' },
	{ label: 'Community Guidelines', href: '/community-guidelines' }
];

/** @deprecated Use footerPlatformLinks / footerForYouLinks instead */
export const footerMarketingLinks: NavItem[] = [
	...footerPlatformLinks.filter((item) => item.href !== '/contact'),
	...footerForYouLinks
];
