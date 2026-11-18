# Promotions section and automatic GitHub Pages deploy

## Objective

Add an in-app "Promociones para vos" section that recommends discounted products, and replace the manual GitHub Pages publish with a GitHub Actions workflow that validates and deploys on every push to `main`.

## Problem and why

The catalog has no discovery surface beyond aisles, and purchase history is stored but never used. The live demo is published by hand, so pushing to `main` does not update the site and the published build can silently drift from the source.

## Scope

- New promotion data keyed by SKU, with a discount percentage and a short Spanish label.
- Pure recommendation logic that ranks promotions for the selected store using category affinity from `state.orders` and `state.cart`, with a deterministic fallback when there is no affinity signal.
- A promotions section in the catalog, above the aisle groups, reusing existing product image, card, pill, and button primitives. Adding a promoted product creates a cart line whose `unitPrice` is the discounted price.
- Unit and component tests for the new logic and UI.
- `.github/workflows/deploy.yml` triggered on push to `main`: install, lint, test, typecheck/build with the Pages base path, then publish `dist/` to the existing `gh-pages` branch.

## Constraints

- No backend, no network calls at runtime; discounts and ranking are local and deterministic.
- Spanish user-facing strings; English code, comments, tests, and commit messages.
- Only existing Tailwind design tokens; red (`primary`) is the sole action colour.
- Keep the existing Pages URL and the `gh-pages` source; do not change repository settings.
- Do not touch the untracked root files `vscode-setup-agent.md` or `vscode-setup-manual.md`.
- No SDD artifacts or native review; organic direct route with one delegated writer.
- TDD mode: off (no project or session config found). Ordinary functional checks apply.

## Route evidence

- Mapping trigger fired: understanding required 8+ files across routing, data, cart, UI, and tests → one read-only `explore` delegation.
- Writer trigger fired: implementation touches 6+ non-trivial files → one `general` writer.
- Per-action checks run by the parent after the writer returns.

## Checklist

- [x] P1 Add SKU-keyed promotion data and pure pricing helpers with tests
- [x] P2 Add ranking logic based on order/cart category affinity with tests
- [x] P3 Add `PromotionsSection` UI and wire it into `CatalogPage` with a component test
- [x] P4 Add the GitHub Actions deploy workflow and verify the command sequence locally
- [x] P5 Run the full check suite and commit as reviewable work units

## Acceptance criteria

- Every store shows a promotions section with up to three relevant offers; stores with no promoted SKUs show no section.
- Recommendations prefer categories present in purchase history or the current cart, and are stable when no signal exists.
- Adding a promoted product puts the discounted unit price in the cart.
- A push to `main` runs lint, tests, and a Pages-correct build before publishing; a failing check prevents publication.
- `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build -- --base=/smart-shopint/` all pass.

## Checks

- `npm test -- src/lib/recommendations.test.ts`
- `npm test -- src/features/catalog/PromotionsSection.test.tsx`
- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build -- --base=/smart-shopint/`

## Progress

- Branch `feat/promotions-autodeploy` created from `main`.
- Mapping delegated to one `explore` agent; implementation delegated to one `general` writer.
- Verified in the parent: `npm test` 26 files / 153 tests passed; `npm run lint` exit 0; `npx tsc --noEmit` exit 0; `npm run build -- --base=/smart-shopint/` succeeded with `/smart-shopint/assets/...` paths in `dist/index.html`.
- The Actions workflow itself cannot run locally; its exact command sequence was verified instead.
- Work units: `feat(catalog)` for the promotions feature; `ci` for the deploy workflow.

## Next step

Push and merge are human decisions under ordinary repository policy. Merging to `main` is what triggers the first automated deploy.
