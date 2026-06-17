# moon

Real-time satellite tracker. Fetches live TLE (two-line element) orbital data,
propagates each satellite's position, and renders them moving over an
interactive 3D globe.

## Stack

- **Frontend**: React + [globe.gl](https://github.com/vasturiano/globe.gl)
  (Three.js) for the 3D earth, [satellite.js](https://github.com/shashwatak/satellite-js)
  for orbit propagation from TLE.
- **Backend**: FastAPI service that pulls TLE data from
  [CelesTrak](https://celestrak.org/) (NORAD station elements), caches it, and
  serves it at `/satellites`.

## Structure

- `src/components/` — `GlobeView` (3D globe), `SatellitLayer` (plots satellites),
  `ControlPanel` (UI controls).
- `src/services/` — `tleService` (fetch TLE), `orbitService` (propagate orbits to
  lat/lon/alt).
- `backend/server.py` — FastAPI TLE proxy + cache.

## Run

Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

Frontend:
```bash
npm install
npm run dev
```
