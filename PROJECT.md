# moon — portfolio notes

See [README.md](README.md) for stack/run details.

## What it is

A real-time **satellite tracker**: live TLE orbital data → orbit propagation →
satellites rendered moving across an interactive 3D globe. React + globe.gl
(Three.js) + satellite.js on the frontend, a FastAPI TLE proxy/cache (CelesTrak
source) on the backend. Built Oct 2025.

## What I built

- 3D globe view (`GlobeView`) with a satellite plotting layer (`SatellitLayer`)
  and a control panel.
- `tleService` (fetch TLE sets) and `orbitService` (propagate TLE → positions
  over time) on the client.
- A FastAPI backend that fetches NORAD station TLEs from CelesTrak, caches them,
  and exposes `/satellites` so the frontend isn't hammering CelesTrak directly.

## Cleanup done in this pass (2026)

- Removed a committed **`node_modules/`** (3566 files): **3577 → 11 tracked files.**
- Added a `.gitignore` (node_modules / venv / build / env).
- Added `backend/requirements.txt` (fastapi, httpx, uvicorn) — the deps weren't
  recorded anywhere.
- Wrote the missing `README.md`.

## Note

Small, focused project (3 commits, ~11 source files). The orbit math is handled
by satellite.js; the work here is the globe rendering, the TLE plumbing, and the
caching backend.
