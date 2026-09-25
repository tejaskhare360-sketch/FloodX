# UrbanShield AI

UrbanShield AI is a hackathon-ready flood intelligence prototype for Indore, Madhya Pradesh. It combines simulated rainfall, terrain, drainage, land-use, historical flood, and citizen-report inputs into an explainable risk surface and authority decision-support view.

## Run locally

From the repository root:

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/urban-shield run dev
```

The frontend is served by the managed web workflow. The API is available under `/api`.

## Demo flow

1. Open the command center at `/`.
2. Open **Rainfall simulation** and start at 20 mm/hr.
3. Increase rainfall to 75 mm/hr and run the simulation.
4. Open the flood map, select a red zone, and inspect the factor breakdown.
5. Submit a waterlogging report with a selected demo zone.
6. Open **Authority view** and switch to citizen reports to see the new report and decision-support guidance.

## Architecture

- `artifacts/urban-shield` — React + Vite frontend with Wouter routing, TanStack Query, Lucide icons, and Leaflet/OpenStreetMap.
- `artifacts/api-server` — Express API serving the demo prediction engine, zone data, alerts, statistics, and in-memory citizen reports.
- `lib/api-spec/openapi.yaml` — source-of-truth API contract.
- `lib/api-client-react` and `lib/api-zod` — generated typed client and validation schemas.

## Data assumptions and limitations

- All zone attributes, rainfall readings, drainage capacity, historical events, IoT language, and predictions are simulated demo data.
- Coordinates are approximate points for visual demonstration and are not official ward boundaries.
- The prediction is a deterministic weighted demo engine, not a trained or validated real-world model.
- Reports are kept in memory for MVP reliability and reset when the API restarts.
- OpenStreetMap tiles require network access in the browser; the core demo data and simulation do not require a paid map key.

This hackathon prototype is intended for demonstration and decision-support purposes. It is not a replacement for official emergency warnings, hydrological modelling, or government emergency systems.

## Future improvements

- Replace demo zones with verified municipal boundaries and PostGIS geometry.
- Connect rainfall, water-level, and weather feeds with freshness metadata.
- Add verified sensor ingestion and report moderation workflows.
- Train and validate a city-specific model against historical events.
- Add authentication and role-based access for citizen and authority workflows.