# design-sync notes — Marketing Hub

Target: claude.ai/design project "Marketing Hub" (`projectId` in config.json).

## Build
- [GENERAL] `npm run build:lib` (cfg.buildCmd) builds the installable Vite ESM package: `dist/index.js`, `dist/demo.js`, `dist/index.css`, and JSDoc-generated `dist/types/*.d.ts`. The repository lockfile owns Vite and TypeScript 5; `.ds-sync` only needs the converter's own dependencies.
- [GENERAL] `package.json` exports `.` for components and `./demo` for deterministic stories/fixtures; `types` points to the component declaration entry. `src/design/index.js` imports `tokens.css`, so the package CSS includes scoped reset, tokens and font faces.
- [GENERAL] Header, TypeCard and demo content use imported assets copied under `src/design/assets/`; the package no longer resolves `/assets` or uses an asset-url shim. Large opaque source PNGs are shipped as quality-90 WebP assets. Image URLs remain replaceable through component content props.
- Command sequence: `npm run build:lib` → `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./dist/index.js --out ./ds-bundle` → `node .ds-sync/package-validate.mjs ./ds-bundle`.
- Reference storybook: `npx storybook build -c .storybook -o "$(pwd)/.design-sync/sb-reference"`.

## Story → component mapping
- [GENERAL] Story titles are sentence case ("Atoms/Status badge"); `cfg.titleMap` maps the whitespace-stripped last segment to the export. Special cases: "Six-city invest analysis" → CityInvestDashboard, "Principles library" → PrinciplesView, "Report Copilot workspace" → ReportCopilot. `Foundations` (token swatches) and `Pages` (seven full-page stories under one title) are excluded (`null`).
- [GENERAL] `cfg.componentSrcMap` pins component story imports to their source modules. The story import shim lists component modules and their private component helpers; deterministic demo flows are now separate from the root component bundle.
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
- Bundled images are explicit module imports in `src/design/assets`; adding a new source image requires copying it there and importing it from the component or demo fixture that owns it.
- Owned previews (AssistantPanel, UploadHistory) mirror the generated wrapper; if their stories change shape, update the owned copy.
