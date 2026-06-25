export type NavItem = {
	label: string;
	href: string;
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

export const footerPlatformLinks: NavItem[] = [
	{ label: 'Events', href: '/events' },
	{ label: 'Blog', href: '/blog' },
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
