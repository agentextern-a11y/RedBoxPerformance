# NeuronDrive by Red Box Performance

## Overview

NeuronDrive is an AI-powered vehicle intelligence cockpit built for Red Box Performance. It connects directly to your car via Web Bluetooth (VLinker BM+ OBD adapter), reads live OBD data, and uses AI to diagnose faults, predict component failures, and coach performance.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/neurodrive) at path `/`
- **API framework**: Express 5 (artifacts/api-server) at path `/api`
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle for API server)

## Key Features

- **Live OBD Dashboard**: Web Bluetooth connection to VLinker BM+ — click "Connect" in the Dashboard page. No app install needed.
- **AI Diagnostics**: Enter any DTC fault code (e.g. P0300) for AI-powered root cause analysis, repair steps, and cost estimates.
- **Predictive Maintenance**: Per-component health predictions with km-until-service timelines.
- **Vehicle Garage**: Register and track multiple vehicles with health scores.
- **ECU Map Vault**: Browse and manage stock ECU calibration maps.

## Routes

- `/` — Marketing landing page
- `/dashboard` — Live OBD cockpit with Web Bluetooth
- `/diagnostics` — DTC fault analysis
- `/vehicles` — Vehicle registry
- `/predict` — Predictive maintenance timeline
- `/maps` — ECU Map Vault

## Database Tables

- `vehicles` — registered vehicles (VIN, make, model, year, health score)
- `sessions` — OBD driving sessions (RPM, speed, health, anomaly flag)
- `diagnostics` — DTC code analysis results
- `predictions` — component failure predictions per vehicle
- `ecu_maps` — stock ECU calibration map registry

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Branding

- **Brand**: Red Box Performance
- **Software name**: NeuronDrive
- **Logo**: `attached_assets/849CDD77-50D6-4560-A5BC-E2C410A6B50C_1777942566176.png`
- **Theme**: Light, sporty — red (#DC2626) primary, Rajdhani headings, Inter body

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
