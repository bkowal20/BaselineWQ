'use client';

import { useEffect, useRef } from 'react';

export default function MapView({ studies, height = '450px' }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return; // already initialized
    if (typeof window === 'undefined') return;

    const L = require('leaflet');

    // Fix default marker icons (Leaflet + webpack issue)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current).setView([46.8, -92.5], 7);
    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Custom marker style
    const markerIcon = L.divIcon({
      className: '',
      html: `<div style="
        width: 14px; height: 14px;
        background: #1a5c5a;
        border: 2.5px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10],
    });

    studies.forEach(study => {
      if (study.lat && study.lng) {
        L.marker([study.lat, study.lng], { icon: markerIcon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 200px;">
              <strong style="font-size: 13px;">${study.title}</strong><br/>
              <span style="font-size: 12px; color: #666;">${study.author} &middot; ${study.sites} sites</span><br/>
              <a href="/study/${study.id}" style="font-size: 12px; color: #1a5c5a; font-weight: 600;">View study &rarr;</a>
            </div>
          `);
      }
    });

    // Fit bounds if we have markers
    if (studies.length > 0) {
      const bounds = studies
        .filter(s => s.lat && s.lng)
        .map(s => [s.lat, s.lng]);
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [studies]);

  return <div ref={mapRef} className="map-container" style={{ height }} />;
}
