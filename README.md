# SMART SHOPINT

Mobile-first supermarket shopping simulation: a single-page web app where a
user registers, picks a supermarket, scans (or simulates scanning) product QR
codes, fills a cart, and completes a simulated checkout that produces a
printable receipt stored in purchase history.

Everything runs in the browser. There is no backend, no database, and no real
payment provider. Mock data lives in `localStorage`.

> Full product documentation (demo flow, the localStorage model, and the
> simulated-payment limits) is added at the end of the build. This file
> currently documents the project foundations.

## Requirements

- Node.js 24 or newer
- npm 11 or newer

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Type-check (`tsc -b`) and build the production bundle. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run lint` | Run oxlint. |

## Stack

- React 19 + TypeScript, bundled by Vite.
- Tailwind CSS v4 through the `@tailwindcss/vite` plugin.
- Vitest + Testing Library on jsdom for tests.

## Project layout

```
src/
  data/        types.ts (mock domain model), catalog.ts (mock seed)
  lib/         storage.ts (typed localStorage wrapper)
  styles/      index.css
  test/        setup.ts (Vitest setup)
  App.tsx      slice 1 placeholder shell
  main.tsx     application entry point
```

Feature folders (`app/`, `features/`, `components/`) and `lib/resolveSku.ts` are
added by later delivery slices. See the SDD change `smart-shopint-mvp`.
