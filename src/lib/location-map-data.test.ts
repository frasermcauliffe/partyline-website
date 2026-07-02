import { describe, expect, it } from 'vitest';
import {
	AU_MAP_BOUNDS,
	buildLocationMapMarkers,
	buildMarkerBounds,
	clusterDiameterForCount,
	displayStatusFor,
	LOCATION_MAP_CITIES,
	markerShortLabel,
	resolveMapViewBounds
} from '@/lib/location-map-data';
import type { PublicSceneIndexFetchResult } from '@/lib/public-scene-index';

const sceneWithPerth: PublicSceneIndexFetchResult = {
	unavailable: false,
	sceneIndex: {
		generated_at: '2026-06-01T00:00:00.000Z',
		upcoming_event_count: 12,
		live_now_event_count: 1,
		active_event_count: 12,
		events_this_week: 4,
		events_this_month: 10,
		verified_upcoming_event_count: 0,
		by_city: [
			{ city: 'Perth', upcoming_count: 8, this_week_count: 3 },
			{ city: 'Fremantle', upcoming_count: 2, this_week_count: 1 }
		],
		by_genre: [],
		by_event_type: []
	}
};

describe('location map data', () => {
	it('includes Australian city markers with website landing hrefs where available', () => {
		const markers = buildLocationMapMarkers(sceneWithPerth, []);
		const perth = markers.find((marker) => marker.id === 'perth');
		const melbourne = markers.find((marker) => marker.id === 'melbourne');

		expect(perth?.href).toBe('/events/perth');
		expect(perth?.external).toBe(false);
		expect(melbourne?.href).toBe('/events/melbourne');
	});

	it('aggregates Perth metro counts from scene index rows', () => {
		const markers = buildLocationMapMarkers(sceneWithPerth, []);
		const perth = markers.find((marker) => marker.id === 'perth');

		expect(perth?.upcomingCount).toBe(10);
		expect(perth?.shortLabel).toBe('10');
	});

	it('does not invent counts when scene index is unavailable', () => {
		const markers = buildLocationMapMarkers({ unavailable: true, sceneIndex: null }, []);
		expect(markers.every((marker) => marker.upcomingCount === null)).toBe(true);
	});

	it('uses short marker labels only', () => {
		expect(markerShortLabel('coming', null)).toBe('SOON');
		expect(markerShortLabel('opening', null)).toBe('OPEN');
		expect(markerShortLabel('active', 8)).toBe('8');

		const markers = buildLocationMapMarkers({ unavailable: true, sceneIndex: null }, []);
		const joined = markers.map((marker) => marker.shortLabel).join(' ');

		expect(joined).not.toContain('Coming next');
		expect(joined).not.toContain('Active now');
	});

	it('uses full status text in displayStatus for popups and cards', () => {
		expect(displayStatusFor('coming', null)).toBe('Coming next');
		expect(displayStatusFor('opening', null)).toBe('Opening');
		expect(displayStatusFor('active', 3)).toBe('3 upcoming');
	});

	it('scales cluster diameter with count', () => {
		expect(clusterDiameterForCount(null, 'SOON')).toBeLessThan(clusterDiameterForCount(50, '50'));
		expect(clusterDiameterForCount(5, '5')).toBeLessThan(clusterDiameterForCount(200, '200'));
	});

	it('covers core Australian cities with coordinates', () => {
		expect(LOCATION_MAP_CITIES.length).toBeGreaterThanOrEqual(4);
		expect(LOCATION_MAP_CITIES.some((city) => city.slug === 'perth')).toBe(true);
	});

	it('resolveMapViewBounds includes west and east marker extremes', () => {
		const markers = buildLocationMapMarkers(sceneWithPerth, []);
		const bounds = resolveMapViewBounds(markers);

		expect(bounds.southWest.lng).toBeLessThanOrEqual(AU_MAP_BOUNDS.southWest.lng);
		expect(bounds.northEast.lng).toBeGreaterThanOrEqual(
			Math.max(...markers.map((marker) => marker.lng))
		);
		expect(bounds.southWest.lng).toBeLessThanOrEqual(
			Math.min(...markers.map((marker) => marker.lng))
		);
	});

	it('falls back to Australia bounds when no markers exist', () => {
		expect(buildMarkerBounds([])).toBeNull();
		expect(resolveMapViewBounds([])).toEqual(AU_MAP_BOUNDS);
	});
});
