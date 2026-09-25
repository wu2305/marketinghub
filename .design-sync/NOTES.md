# design-sync notes — Marketing Hub

Target: claude.ai/design project "Marketing Hub" (`projectId` in config.json).

## Build
- [GENERAL] The repo ships no compiled package. `node .design-sync/build-dist.mjs` (cfg.buildCmd) builds `dist/index.js` + `dist/index.css` + `dist/types/*.d.ts` from `src/design/index.js`, using esbuild + typescript@5 from `.ds-sync/node_modules` (the repo lockfile is untouched). Install them there first: `(cd .ds-sync && npm i esbuild ts-morph @types/react playwright typescript@5)`. typescript@7 has no JS compiler API — keep it pinned to 5.
- [GENERAL] `package.json` carries `module: dist/index.js` + `types: dist/types/index.d.ts`; the converter finds component exports through `types`. Without it: `exported PascalCase symbols: 0`.
- [GENERAL] `tokens.css` is not imported by `index.js` (Storybook loads it from `.storybook/preview.jsx`), so the dist build imports it explicitly — otherwise tokens/fonts are missing from `dist/index.css`.
- [GENERAL] Components load images through `assetUrl("assets/images/...")` → `/assets/...`, which claude.ai/design does not serve. The dist build swaps `asset-url.js` for a module that embeds every image referenced under `src/design` as a data URL (images >300 KB are downscaled with macOS `sips` to 800px JPEG in `.design-sync/.cache/img`). Symptom without it: TypeCard art / Header logo / WorkspaceCard images blank.
- Command sequence: `node .design-sync/build-dist.mjs` → `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./dist/index.js --out ./ds-bundle` → `node .ds-sync/package-validate.mjs ./ds-bundle`.
- Reference storybook: `npx storybook build -c .storybook -o "$(pwd)/.design-sync/sb-reference"`.

## Story → component mapping
- [GENERAL] Story titles are sentence case ("Atoms/Status badge"); `cfg.titleMap` maps the whitespace-stripped last segment to the export. Special cases: "Six-city invest analysis" → CityInvestDashboard, "Principles library" → PrinciplesView, "Report Copilot workspace" → ReportCopilot. `Foundations` (token swatches) and `Pages` (seven full-page stories under one title) are excluded (`null`).
- [GENERAL] Many components share one file (atoms/molecules/organisms/pages.jsx), so the converter cannot find a component's module by its name. `cfg.componentSrcMap` pins each component to its file and `cfg.storyImports.shim` forces those modules (plus asset-url/cx/report-logic/report-routes/demo hooks) to the shipped `window.MarketingHub`. Without the shim, previews compile a second source copy that uses the original `assetUrl` (broken images).
- `.storybook/preview.jsx` decorator (DemoLinkGuard: swallows demo-link clicks) fails to bundle (`.woff2` loader via tokens.css import). It is visual no-op; previews run without it.

## Previews
- [GENERAL] Owned previews for every `position:fixed` component — AssistantPanel, UploadHistory, ModelFlowDialog, ReportDetailsDrawer, Toast, AssistantLauncher — wrap each story in a `height:100vh` frame. The single-card wrapper is a transform containing block with zero height, so fixed overlays collapsed to the top / off-screen. Any new overlay component needs the same owned preview.
- Known validate warn: `[RENDER_THIN] Icon` — the story is one 24px glyph; graded match. Not a regression.
- Serif text inside some previews is faithful: 19 stories render text in the browser default serif in Storybook too (components don't set `font-family` on every text node). Tracked in handover/design-system-cleanup.md, not a sync defect.
- Overlay components use `cardMode: "single"`; wide ones (Header, ReportRow, ProjectDirectory, CityInvestDashboard) use `cardMode: "column"`.
- `runtimeFontPrefixes`: "PingFang SC"/"Microsoft YaHei" are a CJK system-font stack in organisms.css, never shipped.

## Re-sync risks
- Grading was done on the 57 non-page components (1 story each, AssistantPanel 2). Page components (HomePage, ...) are exported in the bundle but have no card — the `Pages` story title is excluded.
- Overlay grades judged the preview on its own where the reference crops fixed content (Toast, AssistantLauncher); CityInvestDashboard's reference is a full-page capture, preview verified on the visible 700px.
- When the source fixes in handover/design-system-cleanup.md land (fonts, TypeGrid, LiveReportView, token cleanup), previews change on both sides — expect recaptures/re-grades, not carry-forward.
- Embedded images are a snapshot of `assets/images` at build time; new image paths are picked up only if written literally (`assets/images/...png`) or as a `${}` series in src/design.
- Owned previews (AssistantPanel, UploadHistory) mirror the generated wrapper; if their stories change shape, update the owned copy.
