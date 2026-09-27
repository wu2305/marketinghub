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
- [GENERAL] Stories now live beside their components (`src/design/components/<Name>/<Name>.stories.jsx`, `src/design/features/<page>/<Name>/<Name>.stories.jsx`), no longer under `src/design/stories/`. Owned previews import `@ds-stories/<that path>`; when stories move, fix the import path in every `.design-sync/previews/*.tsx` (symptom: `! preview build failed: ... @ds-stories path not found`).
- [GENERAL] `src/design/features/cockpit/lib/report-logic.js` must NOT be in `storyImports.shim`: its helpers (`pluralize`, `resolveReportAssets`, `buildReportModelDraft`) are not public exports, so shimming resolves them to undefined (`[RENDER] root empty` on ProjectDirectory/ReportCopilot). Left unshimmed, the pure helpers bundle into the preview.
- `.storybook/preview.jsx` decorator (DemoLinkGuard: swallows demo-link clicks) fails to bundle (`.woff2` loader via tokens.css import). It is visual no-op; previews run without it.

## Previews
- [GENERAL] Owned previews for every `position:fixed` component — AssistantPanel, UploadHistory, ModelFlowDialog, ReportDetailsDrawer, Toast, AssistantLauncher — wrap each story in a `height:100vh` frame. The single-card wrapper is a transform containing block with zero height, so fixed overlays collapsed to the top / off-screen. Any new overlay component needs the same owned preview.
- BusinessTermForm has an owned preview that mirrors the story's args + render inline: the story module calls `enumProp(businessTermKinds, ...)` at module scope, and `businessTermKinds` is not exported from `src/design/index.js`, so the shimmed import is undefined and the module throws on load. Once `businessTermKinds` becomes a public export, delete `.design-sync/previews/BusinessTermForm.tsx` to return to the generated preview.
- FeedbackList captures at `viewport: "1280x900"`: its column header (first root child) is `display:none` below ~1000px, and compare waits for the first root child to be visible → false `sb-error` at the 900px default.
- Known validate warn: `[RENDER_THIN] Icon` — the story is one 24px glyph; graded match. Not a regression.
- Serif text inside some previews is faithful: 19 stories render text in the browser default serif in Storybook too (components don't set `font-family` on every text node). Tracked in handover/design-system-cleanup.md, not a sync defect.
- Overlay components use `cardMode: "single"` (plus Header — default `position="fixed"` escapes grid cells — and SkillDetail, whose drawer is fixed); wide ones (ReportRow, ProjectDirectory, CityInvestDashboard, FeedbackList, PrinciplesView, SkillLibrary) use `cardMode: "column"`.
- `runtimeFontPrefixes`: "PingFang SC"/"Microsoft YaHei" are a CJK system-font stack in organisms.css, never shipped.

## Re-sync risks
- Grading was done on the 57 non-page components (1 story each, AssistantPanel 2). Page components (HomePage, ...) are exported in the bundle but have no card — the `Pages` story title is excluded.
- Overlay grades judged the preview on its own where the reference crops fixed content (Toast, AssistantLauncher); CityInvestDashboard's reference is a full-page capture, preview verified on the visible 700px.
- When the source fixes in handover/design-system-cleanup.md land (fonts, TypeGrid, LiveReportView, token cleanup), previews change on both sides — expect recaptures/re-grades, not carry-forward.
- Bundled images are explicit module imports in `src/design/assets`; adding a new source image requires copying it there and importing it from the component or demo fixture that owns it.
- 2026-09-27 re-sync: all 57 components re-graded from fresh sheets (46 changed, 11 new: FeedbackList, GovernanceNav, KnowledgeCreateFields, KnowledgeDetail, MemoryWorkspace, ReviewQueue, ScenarioDetailWorkspace, ScenarioEditForm, SkillDetail, SkillInlineForm, SkillLibrary; 11 removed upstream). Tall organisms were judged on the visible 700px of the preview against the full-height reference.
- Each `_preview/<Name>.js` is ~2.8 MB (86 MB total): story modules pull shared demo content/helpers with inlined image and font assets into every preview. Under the 12 MB per-file cap, but upload `_preview/**` in batches of ≤5 files — a 7-file batch hit the 60 s write timeout.
- Fonts are inlined as data URIs in `_ds_bundle.css`; the build no longer emits `fonts/`. The project's remote `fonts/*` files are leftovers from an earlier sync (not in the anchor) and are unused.
- conventions.md names Header `density`/`position` and deliberately avoids `demoContent` (lives in the `./demo` entry, not the synced root bundle). Re-validate these names on every re-sync.
- Owned previews (AssistantPanel, UploadHistory, and the other overlay wrappers) mirror the generated wrapper; if their stories change shape, update the owned copy.
