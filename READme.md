# UrbanShield AI

UrbanShield AI is an explainable urban flood intelligence prototype that helps citizens and city operators explore localized risk, submit observations, and prioritize response.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/urban-shield` — React/Vite web app, routes, theme, and Leaflet risk map
- `artifacts/api-server/src/routes/flood-intelligence.ts` — demo prediction engine and flood intelligence endpoints
- `lib/api-spec/openapi.yaml` — source-of-truth API contract
- `lib/api-client-react` and `lib/api-zod` — generated client hooks and schemas

## Architecture decisions

- Keep the first build demo-safe and deterministic: the flood model is an explicit Demo Prediction Engine, not a claimed trained model.
- Use in-memory reports for hackathon reliability; the API contract is structured so reports and zones can move to PostgreSQL/PostGIS later.
- Use approximate point coordinates plus Leaflet/OpenStreetMap instead of implying official ward boundaries.
- Keep `/api` as the shared Express backend path and generate frontend hooks from OpenAPI.

## Product

- Command center with live-looking risk statistics and alerts
- Rainfall simulation that recalculates risk levels, affected roads, and alerts
- Leaflet/OpenStreetMap map with selectable risk zones and citizen report markers
- Explainable zone factor breakdowns
- Citizen waterlogging reports
- Authority priority monitoring and decision-support guidance
- Methodology page with demo-data limitations and future integration notes

## User preferences

No additional preferences recorded.

## Gotchas

- Restart the managed API workflow after backend changes and the web workflow after frontend or dependency changes.
- The demo report list resets when the API restarts.
- `pnpm --filter @workspace/api-spec run codegen` regenerates both typed client packages after API contract changes.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
