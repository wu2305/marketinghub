# Marketing Hub AI · v20.11

This is a cleaned, behavior-preserving baseline generated from `marketing-hub-ai-v20.10.05` before the AI Interpreter visual refresh.

## Start here

- Open `index.html` for the portal home.
- Open `assets/pages/knowledge.html` for AI Interpreter.
- Each page remains a standalone static HTML entry point; no build or package-install step is required to view the Demo.

## Structure

- `assets/css/base/` contains shared fonts, tokens, workspace foundations, and scrolling.
- `assets/css/components/` contains shared assistant components.
- `assets/css/home/`, `reports/`, `self-service/`, `campaign/`, `knowledge/`, and `governance/` contain module styles.
- `assets/css/pages/` contains styles extracted from page markup.
- `assets/js/data/` contains demo records.
- `assets/js/shared/` contains common portal behavior.
- `assets/js/knowledge/` and `assets/js/governance/` contain module behavior.
- `docs/cleanup-manifest.json` records the source-to-output mapping and removal rationale.

## Baseline notes

- The original duplicate ` (2)` resources, desktop metadata, debug screenshots, and unreferenced files were omitted.
- Query-string cache suffixes were removed from local CSS and JavaScript references.
- CSS was formatted and declarations proven overwritten by a later rule in the same cascade context were removed.
- Malformed source HTML was normalized through the browser parser before formatting, preserving browser-rendered output.
- The common assistant script now skips pages that do not contain the assistant UI. This fixes the original console errors on Feedback & Quality and Media Tracking Detail without changing their visible UI.

## Validation

The cleaned baseline was rendered at 1440px width across all canonical pages, all eight AI Interpreter types, and the supported knowledge creation states. The original and cleaned page screenshots were compared pixel by pixel. See the validation artifacts outside this deliverable when working in the Codex task workspace.
## v20.11.01 AI Interpreter refresh

This version is copied from `marketing-hub-ai-v20.11` and adds a scoped AI Interpreter visual refresh in `assets/css/knowledge/ai-interpreter-refresh.css`. The refresh aligns the module with the shared DIN typography, grey-white workspace, black/gold action language, compact cards, restrained table styling, and consistent 6-8px control radius used by the rest of the demo.

