import L from 'leaflet';
import type { LocationMapMarker, MapBounds } from '@/lib/location-map-data';
import { AU_MAP_BOUNDS, clusterDiameterForCount, resolveMapViewBounds } from '@/lib/location-map-data';

import 'leaflet/dist/leaflet.css';

const MAP_FIT_OPTIONS: L.FitBoundsOptions = {
	padding: [40, 40],
	maxZoom: 5
};

function toLeafletBounds(bounds: MapBounds): L.LatLngBoundsExpression {
	return [
		[bounds.southWest.lat, bounds.southWest.lng],
		[bounds.northEast.lat, bounds.northEast.lng]
	];
}

function createClusterIcon(marker: LocationMapMarker): L.DivIcon {
	const diameter = clusterDiameterForCount(marker.upcomingCount, marker.shortLabel);
	const modifier =
		marker.upcomingCount !== null && marker.upcomingCount > 0
			? 'location-map-cluster--count'
			: marker.shortLabel === 'SOON' || marker.shortLabel === 'OPEN'
				? 'location-map-cluster--status'
				: 'location-map-cluster--dot';

	const labelHtml =
		modifier === 'location-map-cluster--dot'
			? ''
			: `<span class="location-map-cluster__label">${marker.shortLabel}</span>`;

	return L.divIcon({
		className: 'location-map-cluster-wrap',
		html: `<span class="location-map-cluster ${modifier}" style="--cluster-size: ${diameter}px" role="img" aria-label="${marker.name}: ${marker.displayStatus}">${labelHtml}</span>`,
		iconSize: [diameter, diameter],
		iconAnchor: [diameter / 2, diameter / 2]
	});
}

function popupHtml(marker: LocationMapMarker): string {
	const browseLabel = marker.external ? 'Browse in app' : 'Browse events';
	const targetAttrs = marker.external ? ' target="_blank" rel="noopener noreferrer"' : '';

	return `
		<div class="location-map-popup">
			<p class="location-map-popup__city">${marker.name}</p>
			<p class="location-map-popup__status">${marker.displayStatus}</p>
			<a class="location-map-popup__link" href="${marker.href}"${targetAttrs}>${browseLabel} &rarr;</a>
		</div>
	`;
}

function bindMarkerPopup(marker: L.Marker, data: LocationMapMarker): void {
	marker.bindPopup(popupHtml(data), {
		className: 'location-map-popup-wrap',
		closeButton: true,
		autoPan: true,
		maxWidth: 240
	});

	marker.on('click', () => {
		marker.openPopup();
	});
}

function prepareMapCanvas(mapCanvas: HTMLElement): void {
	mapCanvas.hidden = false;
	mapCanvas.style.visibility = 'hidden';
}

function revealMapCanvas(mapCanvas: HTMLElement): void {
	mapCanvas.style.visibility = 'visible';
}

export function initEventLocationMap(root: HTMLElement): void {
	const mapCanvas = root.querySelector<HTMLElement>('[data-location-map-canvas]');
	const failureNote = root.querySelector<HTMLElement>('[data-location-map-failure]');

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
		prepareMapCanvas(mapCanvas);

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

		const viewBounds = markers.length > 0 ? resolveMapViewBounds(markers) : AU_MAP_BOUNDS;
		map.fitBounds(toLeafletBounds(viewBounds), MAP_FIT_OPTIONS);

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

			bindMarkerPopup(marker, markerData);
			marker.addTo(map);
		}

		map.invalidateSize();
		map.fitBounds(toLeafletBounds(viewBounds), MAP_FIT_OPTIONS);

		revealMapCanvas(mapCanvas);
		root.classList.add('location-map--ready');

		if (failureNote) {
			failureNote.hidden = true;
		}
	} catch {
		mapCanvas.hidden = true;
		mapCanvas.style.visibility = 'visible';
		root.classList.add('location-map--failed');

		if (failureNote) {
			failureNote.hidden = false;
		}
	}
}
