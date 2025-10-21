// orbitService.js
import * as satellite from 'satellite.js';

// Given satrec and JS Date (or timestamp), compute lat/lon/alt
export function positionFromTLE(line1, line2, when = new Date()) {
  const satrec = satellite.twoline2satrec(line1, line2);
  // propagate returns ECI position & velocity at given date
  const posVel = satellite.propagate(satrec, when);
  const positionEci = posVel.position;
  if (!positionEci) return null;
  // gmst for converting eci -> geodetic
  const gmst = satellite.gstime(when);
  const geodetic = satellite.eciToGeodetic(positionEci, gmst);
  const latitude = satellite.degreesLat(geodetic.latitude);
  const longitude = satellite.degreesLong(geodetic.longitude);
  const altitudeKm = geodetic.height; // km
  return { latitude, longitude, altitudeKm };
}

// Utility: compute orbit track (array of lat/lon/alt) for one orbit
export function computeOrbitTrack(line1, line2, startTime = new Date(), minutes = 90, stepSec = 60) {
  const samples = [];
  for (let t = 0; t <= minutes*60; t += stepSec) {
    const when = new Date(startTime.getTime() + t*1000);
    const pos = positionFromTLE(line1, line2, when);
    if (pos) samples.push({ ...pos, timestamp: when.getTime() });
  }
  return samples;
}
