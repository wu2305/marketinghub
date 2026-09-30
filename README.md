# Marketing Hub — React design system

A React + Storybook extraction of the Marketing Hub static HTML/CSS/JS demo.
Components under `src/design` take semantic props and children; every page,
view, dialog and reachable state of the original demo is being rebuilt as
composable components with operable stories.

## Quick start

```bash
npm ci
npm run storybook        # Storybook on http://127.0.0.1:6006
```

Stories are grouped as Foundations, Atoms, Molecules, Organisms, Features and
Pages. `src/design/index.js` is the single public entry point — components,
per-page feature modules (`features/<page>/`), page components (`pages/`), and
deterministic demo containers (`demo/useXxxDemo`) for hosts and tests.

## Verify

```bash
npm run lint             # ESLint: unused vars + react-hooks rules on src/design
npm test                 # Vitest unit tests incl. the import-boundary guard
npm run build-storybook  # static build into storybook-static/ (stamped)
npm run build:host       # standalone host app into examples/host/dist
node scripts/host-check.mjs   # host smoke checks (serves + asserts)
```

`scripts/visual-check.mjs` runs the paired visual comparison between original
pages and their stories. It serves the repo root and `storybook-static`
locally and drives a real browser, so it stays a local tool and is not part of
CI — run `node scripts/visual-check.mjs [--only SUBSTR] [--negative]` and keep
output under `/tmp`.

## Project layout

- `src/design` — tokens, components, features, pages, demo state, `index.js`
- `.storybook` — Storybook 8 config (`@storybook/react-vite`)
- `examples/host` — standalone host consuming the public entry (base `/mh-host/`)
- `scripts/` — build stamps, host-check, visual-check (+ per-page scenarios)
- `handover/` — `README.md` status source of truth, `structural-review.md` work items
- `AGENTS.md` — binding working rules (read first; wins any conflict)

## CI

`.github/workflows/ci.yml` runs `npm ci`, lint, tests, and the Storybook, host
and library builds on pull requests to `main`, pushes to `main` and `v*` tags. It skips
docs-only changes and cancels superseded runs. The heavy browser gate
(host-check, visual check, `--negative`, font probe) runs in full when a `v*`
tag is pushed, and can be started by hand (Actions > ci > Run workflow, choose
the branch), where it is limited to what changed against `main`.

## Storybook on Cloudflare Workers

Storybook is deployed to the existing `marketinghub` Worker at
https://marketinghub.gdindex.workers.dev. `wrangler.jsonc` serves the
`storybook-static` output as static assets.

- Merges/pushes to `main`: the connected Cloudflare Workers Build runs
  `npm ci && npm run lint && npm test && npm run build-storybook`, then
  `npx wrangler deploy`.
- Tag pushes and manual runs: `.github/workflows/storybook-worker.yml` runs
  the same checks and deploys to the same Worker through GitHub Actions.
  A tag on an older commit deliberately publishes that version.
- Branch previews use Cloudflare's preview build configuration. They do not
  update the production URL.

For tag/manual deployments, add the GitHub Actions repository secret
`CLOUDFLARE_API_TOKEN` with Account → Workers Scripts → Edit permission,
scoped to the account in `wrangler.jsonc`. The account ID is public configuration.
The workflow compares the deployed `index.json` with the local build.
Cloudflare builds and GitHub Actions have separate queues; when releasing a
main commit, wait for its Cloudflare build to finish before pushing its tag.

Local validation: `npm run build-storybook && npx wrangler deploy --dry-run`.
Deployment status and evidence live in `handover/README.md`.

## The static demo (reference)

`index.html` and `assets/` are the original static demo — the visual and
interaction reference for this extraction. It is reference material, not the
component runtime: React components never import `assets/js`, and page stories
never embed the original markup. Preview it with `npm run preview:html`
(http://127.0.0.1:4173).

`docs/cleanup-manifest.json` records the provenance of an earlier
source-to-cleaned-baseline pass over the reference files (file mapping and
hashes; machine-local paths removed under A4). Per `AGENTS.md` §6 the
reference is not modified except for documented fixes.
