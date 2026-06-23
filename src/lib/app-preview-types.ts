export type PublicEventPreview = {
	id: string;
	slug: string;
	title: string;
	heroImageUrl: string | null;
	date: string;
	time: string;
	city: string;
	venue: string;
	genres: string[];
	eventType?: string;
	price?: string | null;
	appUrl: string;
};

export type PublicEventsFetchResult = {
	events: PublicEventPreview[];
	unavailable: boolean;
};

export type PublicListingPreview = {
	id: string;
	slug: string;
	name: string;
	imageUrl: string | null;
	city: string;
	profileType: string;
	tags: string[];
	shortDescription: string;
	appUrl: string;
	venueType?: string;
	capacity?: string;
};

export type PublicListingType = 'artist_dj' | 'venue' | 'organiser';

export type PublicListingsFetchResult = {
	listings: PublicListingPreview[];
	unavailable: boolean;
};

export type PublicOpportunityPreview = {
	id: string;
	slug: string;
	title: string;
	opportunityType: string;
	city: string;
	dateLabel: string;
	deadlineLabel?: string;
	genres: string[];
	paymentLabel?: string | null;
	organiserName?: string | null;
	linkedEventTitle?: string | null;
	imageUrl?: string | null;
	appUrl: string;
};

export type PublicOpportunitiesFetchResult = {
	opportunities: PublicOpportunityPreview[];
	unavailable: boolean;
};
