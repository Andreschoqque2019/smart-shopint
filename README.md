# SMART SHOPINT

Mobile-first shopping simulation: a single-page web app where a user
registers, picks a shopping mall and then a store inside it, scans (or
simulates scanning) product QR codes, fills a cart, completes a simulated
checkout, and gets a printable receipt that stays available in purchase
history.

Everything runs in the browser. There is no backend, no database, and no real
payment provider. Mock data lives in `localStorage`.

## Requirements

- Node.js 24 or newer
- npm 11 or newer

## Running it locally

```bash
npm install
npm run dev   # http://localhost:5173
```

Nothing else is required: there is no backend to start and no environment
variable to configure. This project is not published to any hosting provider
yet.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Type-check (`tsc -b`) and build the production bundle. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run lint` | Run oxlint. |

## Demo flow

1. **Registrarse / Ingresar** — register an account (or log in with one you
   already created on this device).
2. **Elegí tu centro comercial** — pick a mall (Mall del Sur, Jockey Plaza or
   Plaza Norte).
3. **Elegí tu tienda** — pick a store inside that mall. Only grocery-type
   stores (Tottus, Plaza Vea, Metro, Makro) carry a catalog.
4. **Catálogo / Escanear producto** — browse the catalog or scan a product QR
   (or use the mandatory "Simular escaneo" fallback). Products can be added to
   the cart from both screens.
5. **Carrito** — review the lines and the live total.
6. **Pago (simulado)** — choose Yape, Plin or Efectivo and confirm.
7. **Comprobante** — the app lands on a printable receipt with the order id,
   items, total, method and a QR code. "Imprimir comprobante" opens the browser
   print dialog.
8. **Mis compras** — the purchase history, most recent first, with each
   receipt's QR. Every entry reopens its original receipt.

## Storage model (`localStorage`)

All state lives under the `shopint:v2:*` namespace:

| Key | Contents |
| --- | --- |
| `shopint:v2:auth` | Registered accounts and the active session. |
| `shopint:v2:mall` | The selected mall. |
| `shopint:v2:store` | The selected store. |
| `shopint:v2:cart` | The cart lines (never the total, which is always derived). |
| `shopint:v2:orders` | The confirmed orders shown in the history. |

Notes and limits:

- Everything is per-browser and per-device. Clearing site data removes it.
- Old `shopint:v1:*` keys are never read or migrated.
- **"Borrar datos de demo"** in the history wipes every `shopint:v2:*` key and
  leaves the app exactly as if it had just been installed (it asks for
  confirmation first).

## Simulated payment

The checkout is a **simulation**. Yape and Plin have no public third-party API,
so no payment provider is ever contacted and no money is charged. The order is
built locally from the cart snapshot and persisted to `localStorage`; the
receipt QR encodes the order id so a reader can reopen the order.

## Stack

- React 19 + TypeScript, bundled by Vite.
- Tailwind CSS v4 through the `@tailwindcss/vite` plugin.
- `@zxing/browser` for the camera QR scan; `qrcode.react` for the receipt QR.
- Vitest + Testing Library on jsdom for tests.

## Project layout

```
src/
  app/         store.ts + AppStore.tsx (Context + reducer), guards.tsx, routes.tsx
  data/        types.ts (mock domain model), catalog.ts (mock seed)
  features/    auth/, malls/, stores/, catalog/, scan/, cart/, checkout/, receipt/, history/
  lib/         storage.ts, auth.ts, sku.ts, cart.ts, order.ts, payment.ts, checkout.ts, receipt.ts, history.ts, format.ts
  styles/      index.css, print.css
  test/        setup.ts (Vitest setup), renderApp.tsx (route test helper)
  App.tsx      application shell (store + router)
  main.tsx     application entry point
```

## User interface language

All user-visible copy is in Spanish. Code, identifiers, comments and commit
messages stay in English.
