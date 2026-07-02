import { APP_LINKS } from '@/data/app-links';
import { cityLandingPath } from '@/data/event-landing-pages';
import { appEventsFilterUrl } from '@/lib/app-event-links';
import { countEventsMatchingCity } from '@/lib/event-directory-stats';
import type { PublicEventPreview } from '@/lib/app-preview-types';
import {
	resolveCitySceneCounts,
	type PublicSceneIndexFetchResult
} from '@/lib/public-scene-index';

export type LocationMapCityConfig = {
	id: string;
	name: string;
	lat: number;
	lng: number;
	status: 'active' | 'opening' | 'coming';
	/** Website city landing slug when available. */
	slug?: string;
	matchCity?: (normalizedCity: string) => boolean;
};

export const LOCATION_MAP_CITIES: LocationMapCityConfig[] = [
	{
		id: 'perth',
		name: 'Perth',
		lat: -31.9505,
		lng: 115.8605,
		status: 'active',
		slug: 'perth',
		matchCity: (city) => city.includes('perth') || city.includes('fremantle')
	},
	{
		id: 'melbourne',
		name: 'Melbourne',
		lat: -37.8136,
		lng: 144.9631,
		status: 'opening',
		slug: 'melbourne',
		matchCity: (city) => city.includes('melbourne')
	},
	{
		id: 'sydney',
		name: 'Sydney',
		lat: -33.8688,
		lng: 151.2093,
		status: 'opening',
		slug: 'sydney',
		matchCity: (city) => city.includes('sydney')
	},
	{
		id: 'brisbane',
		name: 'Brisbane',
		lat: -27.4698,
		lng: 153.0251,
		status: 'opening',
		slug: 'brisbane',
		matchCity: (city) => city.includes('brisbane')
	},
	{
		id: 'adelaide',
		name: 'Adelaide',
		lat: -34.9285,
		lng: 138.6007,
		status: 'coming',
		matchCity: (city) => city.includes('adelaide')
	},
	{
		id: 'gold-coast',
		name: 'Gold Coast',
		lat: -28.0167,
		lng: 153.4,
		status: 'coming',
		matchCity: (city) => city.includes('gold coast')
	},
	{
		id: 'byron-bay',
		name: 'Byron Bay',
		lat: -28.6474,
		lng: 153.602,
		status: 'coming',
		matchCity: (city) => city.includes('byron')
	}
];

export type LocationMapMarker = {
	id: string;
	name: string;
	lat: number;
	lng: number;
	href: string;
	external: boolean;
	upcomingCount: number | null;
	statusLabel: string;
};

function cityHref(city: LocationMapCityConfig): { href: string; external: boolean } {
	if (city.slug) {
		return { href: cityLandingPath(city.slug), external: false };
	}

	if (city.matchCity) {
		const filterKey = city.id.replace(/-/g, ' ');
		return { href: appEventsFilterUrl({ city: filterKey }), external: true };
	}

	return { href: APP_LINKS.events, external: true };
}

function statusLabelFor(status: LocationMapCityConfig['status']): string {
	if (status === 'active') {
		return 'Active now';
	}
	if (status === 'opening') {
		return 'Opening';
	}
	return 'Coming next';
}

export function buildLocationMapMarkers(
	sceneResult: PublicSceneIndexFetchResult,
	previewEvents: PublicEventPreview[]
): LocationMapMarker[] {
	return LOCATION_MAP_CITIES.map((city) => {
		const { href, external } = cityHref(city);
		let upcomingCount: number | null = null;

		if (city.matchCity && sceneResult.sceneIndex && !sceneResult.unavailable) {
			const counts = resolveCitySceneCounts(sceneResult.sceneIndex.by_city, city.matchCity);
			if (counts.upcomingCount > 0) {
				upcomingCount = counts.upcomingCount;
			}
		}

		if (upcomingCount === null && city.matchCity) {
			const previewCount = countEventsMatchingCity(previewEvents, city.matchCity);
			if (previewCount > 0) {
				upcomingCount = previewCount;
			}
		}

		return {
			id: city.id,
			name: city.name,
			lat: city.lat,
			lng: city.lng,
			href,
			external,
			upcomingCount,
			statusLabel: statusLabelFor(city.status)
		};
	});
}

export function clusterDiameterForCount(count: number | null): number {
	if (count === null || count <= 0) {
		return 36;
	}
	if (count < 10) {
		return 40;
	}
	if (count < 50) {
		return 48;
	}
	if (count < 200) {
		return 56;
	}
	return 64;
}
