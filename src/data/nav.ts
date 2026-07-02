import { APP_LINKS } from '@/data/app-links';

export type NavItem = {
	label: string;
	href: string;
	external?: boolean;
};

/** Website profiles explainer — live directory is in the app. */
export const browseProfilesNavItem: NavItem = {
	label: 'Profiles',
	href: '/profiles'
};

/** Desktop header inline navigation (7 items). */
export const desktopNav: NavItem[] = [
	{ label: 'Events', href: '/events' },
	browseProfilesNavItem,
	{ label: 'Artists & DJs', href: '/artists-djs' },
	{ label: 'Organisers', href: '/organisers' },
	{ label: 'Venues', href: '/venues' },
	{ label: 'Blog', href: '/blog' },
	{ label: 'About', href: '/about' }
];

/** Mobile menu Main group — includes Opportunities, not shown on desktop. */
export const mobileMainNav: NavItem[] = [
	{ label: 'Events', href: '/events' },
	browseProfilesNavItem,
	{ label: 'Artists & DJs', href: '/artists-djs' },
	{ label: 'Organisers', href: '/organisers' },
	{ label: 'Venues', href: '/venues' },
	{ label: 'Blog', href: '/blog' },
	{ label: 'Opportunities', href: '/opportunities' },
	{ label: 'About', href: '/about' }
];

/** @deprecated Use desktopNav for desktop header. */
export const marketingNav: NavItem[] = desktopNav;

export type NavGroup = {
	label: string;
	items: NavItem[];
};

export const mobileNavJoinItem: NavItem = {
	label: 'Join PartyLine',
	href: APP_LINKS.joinSignup,
	external: true
};

/**
 * Grouped navigation for the mobile disclosure menu only.
 * Desktop nav uses desktopNav directly.
 */
export const mobileNavGroups: NavGroup[] = [
	{
		label: 'Main',
		items: [...mobileMainNav]
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
	{ label: 'Profiles', href: '/profiles' },
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
