# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Node is installed at `C:\Program Files\nodejs` and is **not** in the default PATH. Prefix every npm/npx call:

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
npm run dev        # dev server → http://localhost:5173
npm run build      # production build to dist/
npm run lint       # ESLint check
npm run preview    # serve the dist/ build locally
```

To start the dev server as a background process use `node node_modules\vite\bin\vite.js` directly (the `.bin\vite` shim is a bash script and won't work in PowerShell without execution policy changes).

## Architecture

**CampoNet** is a fully client-side React demo (no backend, no auth). All state lives in memory and is seeded from `src/data/seed.js` on first load; `trips` are persisted to `localStorage` so refreshing preserves them. The `role` is never persisted — the app always opens at the Login screen after a hard reload.

### State management

`src/context/AppContext.jsx` — single React Context + `useReducer`. Key actions:

| Action | Effect |
|---|---|
| `SET_ROLE` | Sets current role and userId, drives routing |
| `CREATE_TRIP` | Appends a new trip in `pendiente` status |
| `ASSIGN_TRANSPORTER` | Sets `transporterId`, moves trip to `asignado` |
| `ADVANCE_STATUS` | Cycles status: `pendiente → asignado → en_camino → entregado` |
| `TRANSPORTER_ACCEPT` | Transporter self-assigns a pending trip |
| `RESET_DEMO` | Clears localStorage and resets to seed data |
| `ADD_TOAST / REMOVE_TOAST` | Global notification toasts |

All trip mutations flow through this reducer. Never mutate state directly in pages.

### Routing

`src/App.jsx` renders `<RoleRouter>` which conditionally mounts route trees based on `state.role`. There is no URL-based auth guard — the role in Context is the only gatekeeper. Changing role via the topbar `RoleSwitcher` calls `SET_ROLE` + `navigate()` together.

### Role → entry path

| Role | Entry path | Seed identity |
|---|---|---|
| `producer` | `/productor` | Estancia La Esperanza (id `p1`) |
| `transporter` | `/transportista` | Juan Pérez, Scania R450 (id `t1`) |
| `admin` | `/admin` | Full access, no entity |

### Data layer

`src/data/seed.js` exports `PRODUCERS`, `TRANSPORTERS`, `SEED_TRIPS`, `ROUTES`, `CITIES_CORDOBA`, `CARGO_TYPES`. All static — import directly, never fetch. Fuel constants (35 L/100 km, $2 000/L) are hardcoded in `src/pages/transporter/Dashboard.jsx`.

Cost formula: `distanceKm × weightTons × transporter.pricePerKm / 30`

### Key helpers

- `src/lib/format.js` — `formatARS()`, `formatDate()`, `formatRelative()`, `etaText()`
- `src/lib/status.js` — `STATUS_ORDER`, `STATUS_META`, `nextStatus()`, `tripProgress()`

### Shared UI components

All in `src/components/`. The `StatTile` component (solid gradient button tiles) is defined inline in both `pages/admin/Dashboard.jsx` and `pages/transporter/Dashboard.jsx` — it is not a shared component. `MetricCard` (flat card style) is still used in `pages/producer/Dashboard.jsx`.

### Map

`src/components/SimulatedMap.jsx` is a hand-coded SVG of Córdoba province. City coordinates are approximate and stored in the `CITIES` constant inside that file. The truck animates via JS state interpolation based on `trip.status`.

### Styling

Tailwind CSS v3. Custom colors `campo-*` (green) and `night-*` (dark blue) are defined in `tailwind.config.js`. Reusable class combos (`btn-primary`, `card`, `input`, etc.) are defined as `@layer components` in `src/index.css`. Prefer these over repeating utility strings.

### Logo

`/LOGO.jpeg` is served from `camponet/public/LOGO.jpeg`. Both `AppShell` and `Login` render it with an `onError` fallback to the Wheat lucide icon.
