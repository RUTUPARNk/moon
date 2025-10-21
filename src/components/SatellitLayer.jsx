// SatelliteLayer.jsx
import React, { useEffect, useRef } from 'react';
import { positionFromTLE, computeOrbitTrack } from '../services/orbitService';

export default function SatelliteLayer({
  globe,                 // Globe instance returned via onReady
  satellites,            // array { name, line1, line2, country? }
  timeMillis,            // simulation time (ms)
  timeScale = 1,         // multiplier
  onSelectSatellite,
  followId,              // id or null to follow camera
}) {
  const markerDataRef = useRef([]);

  // update marker positions periodically
  useEffect(() => {
    if (!globe || !satellites) return;
    // compute positions for visible sats
    const data = satellites.map((s, idx) => {
      const pos = positionFromTLE(s.line1, s.line2, new Date(timeMillis));
      if (!pos) return null;
      return {
        id: idx,
        name: s.name,
        lat: pos.latitude,
        lng: pos.longitude,
        alt: pos.altitudeKm * 1000, // meters (Globe expects meters for altitude if using 'pointAltitude')
        raw: s
      };
    }).filter(Boolean);

    markerDataRef.current = data;
    globe.pointsData(data)
      .pointLat(d => d.lat)
      .pointLng(d => d.lng)
      .pointAltitude(d => (d.alt / 6371000)) // Globe.gl expects fraction of earth radius for altitude
      .pointColor(() => 'rgba(255,200,0,0.9)')
      .pointRadius(0.3)
      .pointLabel(d => `<b>${d.name}</b>`);
  }, [globe, satellites, timeMillis, timeScale]);

  // camera follow
  useEffect(() => {
    if (!globe || followId == null) return;
    const data = markerDataRef.current.find(d => d.id === followId);
    if (!data) return;
    const lat = data.lat, lng = data.lng;
    globe.pointOfView({ lat, lng, altitude: 0.5 }, 1000);
  }, [globe, followId, timeMillis]);

  // click handler
  useEffect(() => {
    if (!globe) return;
    globe.onPointClick(p => {
      if (onSelectSatellite) onSelectSatellite(p);
    });
  }, [globe, onSelectSatellite]);

  return null;
}
