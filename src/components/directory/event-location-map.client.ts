import L from 'leaflet';
import type { LocationMapMarker } from '@/lib/location-map-data';
import { clusterDiameterForCount } from '@/lib/location-map-data';

import 'leaflet/dist/leaflet.css';

const AU_BOUNDS: L.LatLngBoundsExpression = [
	[-44.5, 112.5],
	[-9.5, 154.5]
];

function createClusterIcon(marker: LocationMapMarker): L.DivIcon {
	const diameter = clusterDiameterForCount(marker.upcomingCount);
	const label =
		marker.upcomingCount !== null && marker.upcomingCount > 0
			? String(marker.upcomingCount)
			: marker.statusLabel;

	return L.divIcon({
		className: 'location-map-cluster-wrap',
		html: `<span class="location-map-cluster" style="--cluster-size: ${diameter}px" role="img" aria-label="${marker.name}: ${label}"><span class="location-map-cluster__label">${label}</span></span>`,
		iconSize: [diameter, diameter],
		iconAnchor: [diameter / 2, diameter / 2]
	});
}

function bindMarkerNavigation(marker: L.Marker, data: LocationMapMarker): void {
	const openTarget = () => {
		if (data.external) {
			window.open(data.href, '_blank', 'noopener,noreferrer');
			return;
		}
		window.location.assign(data.href);
	};

	marker.on('click', openTarget);
	marker.on('keypress', (event) => {
		const keyboardEvent = event.originalEvent as KeyboardEvent;
		if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
			keyboardEvent.preventDefault();
			openTarget();
		}
	});
}

export function initEventLocationMap(root: HTMLElement): void {
	const mapCanvas = root.querySelector<HTMLElement>('[data-location-map-canvas]');
	const fallback = root.querySelector<HTMLElement>('[data-location-map-fallback]');

	if (!mapCanvas) {
		return;
	}

	let markers: LocationMapMarker[] = [];

	try {
		markers = JSON.parse(root.dataset.markers ?? '[]') as LocationMapMarker[];
	} catch {
		return;
	}

	try {
		const map = L.map(mapCanvas, {
			zoomControl: true,
			scrollWheelZoom: false,
			minZoom: 3,
			maxZoom: 10
		});

		L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 19
		}).addTo(map);

		map.fitBounds(AU_BOUNDS, { padding: [24, 24] });

		const leafletMarkers: L.Marker[] = [];

		for (const markerData of markers) {
			const icon = createClusterIcon(markerData);
			const marker = L.marker([markerData.lat, markerData.lng], {
				icon,
				title: markerData.name,
				alt: markerData.name,
				keyboard: true,
				riseOnHover: true
			});

			marker.bindTooltip(markerData.name, {
				direction: 'top',
				offset: [0, -8],
				opacity: 0.95
			});

			bindMarkerNavigation(marker, markerData);
			marker.addTo(map);
			leafletMarkers.push(marker);
		}

		if (leafletMarkers.length > 0) {
			const group = L.featureGroup(leafletMarkers);
			map.fitBounds(group.getBounds().pad(0.35), { maxZoom: 6, padding: [32, 32] });
		}

		root.classList.add('location-map--ready');
		if (fallback) {
			fallback.hidden = true;
		}

		mapCanvas.removeAttribute('hidden');

		window.setTimeout(() => map.invalidateSize(), 0);
	} catch {
		root.classList.add('location-map--failed');
		if (fallback) {
			fallback.hidden = false;
		}
	}
}
