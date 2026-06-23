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
