# Occam baseline — concept counts now, and targets

Status: **Phase 1 baseline** (2026-09-27, measured on `main` @ cbf5cc6). The **Phase 2 result** column was measured on `main` @ 1ececf4 (2026-09-29, after WP7k) with `node scripts/concept-count.mjs` where it prints the row, and by the greps named in the row otherwise. The **Phase 3 result** column was measured on `main` @ 1db9e43 plus the WP4 change (2026-09-30), the same way; rows marked "not re-measured" have no script or grep that was rerun. Phase 3 WP3 (#90, responsive cleanup) merged just before WP4, so the `@media` row shows its result.

Rule (user decision, 2026-09-27): Occam's Razor is measured in **concepts** — patterns, variants, tokens,
states, props — not in files or component count. A variation earns its own variant, token, prop or story
only when it serves a different purpose. The existing AGENTS §3.4 rules ("no pass-through wrapper, promote
on second use, no unused export") are local checks; they let the same concept be rebuilt in many places, as
long as each copy is small. This file measures the global picture that Phase 2 is judged against.

Targets are orders of magnitude, not quotas. Each Phase 2 PR reports before/after for the rows it touches,
measured with `node scripts/concept-count.mjs [--props <file>]` so every PR counts the same way. Rows the
script prints use its definitions (distinct raw values exclude `var()`, `inherit`, `0`, `none`, and for
radius `50%`/`999px`).

**These counts are proxies.** Fewer props, stubs, tokens or lines do not by themselves show that the
components are reusable. The gate that says so is the composability one: **pages a consumer builds only
from the public exports look and operate like the demo** (Phase 3 WP5: `examples/consumer` rebuilds
Business Term, with its create/edit form and confirm flow, and the Marketing Cockpit with two independent
assistants; a jsdom test clicks through each and `visual-check` pairs it with the original page). The
counts below say where duplication was removed; the consumer pages say whether the result still composes.
Not covered by a consumer page: the assistants' model-creation dialog and the City Invest embedded chart
(it needs `cityInvest.getScenario`, which only a demo helper provides).

## 1. Visual concepts

| concept | now | target | Phase 2 result | Phase 3 result | how measured |
| --- | ---: | ---: | --- | --- | --- |
| design tokens | 445 | ~65 | **67** (63 roles + 4 status washes) | **67**, unchanged | `:root` declarations in `src/design/tokens.css`; target in `foundations.md` §3 |
| … unused tokens | 10 | 0 | **3** (`--mh-text-inverse-muted`, `--mh-data-teal`, `--mh-font-weight-light`: §3 roles with no CSS consumer, shown in the Foundations story; kept by Wu's decision, 2026-09-29) | **3**, unchanged (kept, see Phase 2 result); not re-measured | no `var()` reference anywhere in `src/design` |
| … tokens with one owner directory | 160 | ≈0 | **5** (`--mh-line-inverse`, `--mh-font-mono`, `--mh-space-8`, `--mh-space-9`, `--mh-z-launcher`; scale and layer vocabulary) | not re-measured | a token is shared vocabulary; a one-owner value belongs in that component or merges into a role |
| … legacy component/page-named tokens | 162 | 0 | **0** | **0** | `css-budget.json` `legacyPrefixExemptions` |
| raw `font-size` values outside tokens.css | 32 | 0 (8 tokens) | **0** | **0** | script |
| raw `font-weight` values | 13 | 0 (3 tokens) | **0** | **0** | only 300/400/700 font files exist; 500 renders as 400, 600–900 as 700 |
| raw `border-radius` values | 24 | 0 (4 tokens) | **0** | **0** | script |
| raw `box-shadow` values | 34 | 0 (3 tokens + focus ring) | **0** | **0** | script; 67 distinct if `var()`-based shadows are included |
| raw colour literals outside tokens (hex + `rgb[a]()`) | 56 | 0 | **0** | **0** | script; hex alone is already 0 by budget, these are `rgba()` |
| `@media` width values | ~20 | 3 | 19 distinct (not a Phase 2 package; Phase 3 candidate) | **3** (1180 / 900 / 760; Phase 3 WP3 #90, `css-budget.json` `maxMediaWidths`) | 1180 / 900 / 760 |

## 2. Structural concepts

| concept | now | target | Phase 2 result | Phase 3 result | evidence / note |
| --- | ---: | ---: | --- | --- | --- |
| implementations of the governed-library pattern | **9** for 12 views | 1 pattern + per-view config | **1** pattern (`LibraryToolbar`, `LibraryList`, `LibraryItem`, `LibraryEmpty`, `ItemActions`) composed by all 12 views | **1** pattern, unchanged; `useGovernedFlow` (WP5 #81, #82) now holds the blocked-reason → confirm → change sequence the three demo hooks and the consumer each wrote by hand | BusinessTermView (295 JSX / 364 CSS lines), FieldLibraryView (631/1,054, serves 4 types), ScenarioReportsView (259/474), PrinciplesView (215/195), DataModelView (391/836), plus Review Center, Feedback & Quality, Personal Memory and Skill Library lists built in their pages |
| search boxes built by hand beside `SearchField` | 2 governance pages | 0 | **0** in governance pages; 2 remain in Knowledge View and Metric Dictionary pages (out of Phase 2 scope) | **0** (WP1 #72: Knowledge View and Metric Dictionary use `SearchField`; the only `type="search"` in `components/features/pages` is inside `SearchField`) | Review Center and Feedback & Quality use a raw `<input>` search; interpreter views use `SearchField` |
| facet filters built by hand beside `CheckboxFilter`/`Select` | 5 raw `<select>` in governance pages; 21 in features/pages overall | 0 | **0** in governance pages; 15 raw `<select>` in features/pages overall, all in create/edit forms and out-of-scope pages | 13 raw `<select>` in features/pages (from 15), all in create/edit forms |  |
| raw `<button>` in features/pages | 141 | only where no `Button` variant fits, each justified | **111** (from 141) | **102** (from 111) | `Button` exists with variants and sizes |
| assistant wiring (launcher + panel + model flow) copied per page | 13 pages | 1 (shell-level) | 13 (out of Phase 2 scope; Phase 3 candidate); **1** after Phase 3 WP2 (`components/AssistantDock`, 13 consumers) | **1** (`components/AssistantDock`, 13 page consumers; WP2 #70) | `AssistantLauncher` and `AssistantPanel` each have the same 13 page consumers |
| action-gating rule (R1 × R2 in `domain-model.md`) | 1 function, in `demo/knowledge-actions.js` | 1 function in `lib/` | **1** function, `lib/governance.js` | **1**, unchanged | a domain rule lives in the demo layer, so a host app cannot reuse it |
| variants that encode source accidents | `KnowledgeActions` × 3 variants | 0 | **0** (`KnowledgeActions` deleted) | **0**, unchanged | the variants differ only in `disabled` vs `aria-disabled` and label wording (`KnowledgeActions/index.jsx:5–15`) — domain Ask A3 |
| shared components with exactly one consumer | 6 | 0 | **4** (`ColumnChart`, `FileDropzone`, `FilterPills`, `ProgressList`); `DataTable` has 2, `Toast` 9 | **4**, unchanged (`ColumnChart`, `FileDropzone`, `FilterPills`, `ProgressList`); `DataTable` 2, `Toast` 9 | `ColumnChart`, `DataTable`, `FileDropzone`, `FilterPills`, `ProgressList`, `Toast` — all in `components/`, each used by one page; contradicts "promote on second use" |
| shared components with two consumers from one feature pair | 3 | review | 3, unchanged (`ScenarioGovernance`, `ScenarioPreview`, `ScenarioStructure`), plus `ExamplePreview` (WP7j) with the same 2; merging `ScenarioPreview` into `ExamplePreview` is a Phase 3 candidate | **2** (`ScenarioGovernance`, `ScenarioStructure`); `ScenarioPreview` is folded into `ExamplePreview` (WP1 #71), which now has 3 importers | `ScenarioGovernance`, `ScenarioPreview`, `ScenarioStructure`: used only by Skill Detail drawer and Scenario Detail page |
| exported enum constants | 48 | only enums a caller can choose | not re-measured (the baseline count rule was not recorded; ≈22 `*Variants/Sizes/Tones/Kinds/Layouts/Densities` in `index.jsx`) | not re-measured | many enumerate source layouts rather than caller choices |
| public exports (`index.js`) | 83 lines of `export` | — | 87 (`index.js`) | 92 lines of `export` (from 87: `useGovernedFlow`, `AssistantDock`, `SkillForm` and `AutoFillTextarea` are new) | measure after Phase 2 |

## 3. Interface concepts

| concept | now | target | Phase 2 result | Phase 3 result | evidence / note |
| --- | ---: | ---: | --- | --- | --- |
| page props, max | 49 (`CampaignPage`) | ≤ ~12 | 49 (`CampaignPage`, out of scope); migrated views: Review Center, Feedback, Skill Library, Personal Memory now compose the pattern | **42** (`CampaignPage`, from 49); next: Cockpit 29, Self-Service 23, Knowledge Create 23, Data Upload 18. Left as is: what remains is section data and copy, not a redundant prop group (the assistant props went into `assistant` in WP2) | `--props`; next are Cockpit, Media Tracking, Home, Self-Service, Knowledge Create. Out of Phase 2 scope except migrated views |
| callback props that exist only to model a no-op source control | 4 (6 no-op actions) | 0 | **0** stub callbacks (`concept-count.mjs`) | **0**, unchanged | `SkillDetail onClick({action:"delete"})` ("Visible source no-op Delete action", `SkillDetail/index.jsx:18`); `SkillInlineForm onClick` for auto-fill / run-preview / save-draft (`:19`); `ScenarioEditForm onAutoFill`, `onSaveDraft` ("Source button has no resulting behavior", `:28,30`) |
| filters that store a value and filter nothing | 1 | 0 | **0** (Review Center *Submitted* now filters, R7) | **0**, unchanged | Review Center *Submitted* (`domain-model.md` R7) |
| success feedback defined but never shown | 3 call sites | 1 toast | **1** toast (`Toast` + `demo/use-toast.js`, R6) | **1** toast, unchanged; `use-toast.js` is now also used by the Business Term, Field Library, Review Center and Scenario hooks (WP4) instead of four private copies | `domain-model.md` R6 |
| vocabularies for "availability" | 5 spellings | 1 | not re-measured (vocabulary in `domain-model.md` §3.1) | not re-measured | `domain-model.md` §3.1 |
| permission-denied messages | 2 wordings | 1 | **1** (`lib/governance.js`, R1) | **1**, unchanged | `domain-model.md` R1 |

## 4. Documentation concepts

| concept | now | target | Phase 2 result | Phase 3 result | note |
| --- | ---: | ---: | --- | --- | --- |
| stories, total | 461 | — | **478** | **486** stories + 94 docs (`storybook-budget.json` floor) |  |
| page stories | 360 (17 pages, 4–45 each) | ≤ ~6 per page | **346**, largest: Knowledge Create 45, AI Interpreter 26, Cockpit 26 (every original state kept; only duplicates and stub states dropped) | **346**, unchanged (Knowledge Create 45, Interpreter 26, Cockpit 26, Metric Dictionary 25, Personal Memory 24, Review Center 24, Campaign 23, Scenario Detail 22, Scenario Edit 20, Knowledge View 18, Self-Service 18, Feedback 17, Scenario Library 16, Home 15, Media Tracking 15, Data Model 8, Data Upload 4) | a page story shows a composition; states belong to the pattern/component that owns them |
| … stories per page | Knowledge Create 45, Review Center 28, Cockpit 26, Interpreter 25, Metric Dictionary 25, Personal Memory 24, Campaign 23, Feedback 23, Scenario Detail 22, Skill Library 21, Scenario Edit 20, Knowledge View 18, Self-Service 18, Home 15, Media Tracking 15, Data Model 8, Data Upload 4 |  | Knowledge Create 45, Interpreter 26, Cockpit 26, Metric Dictionary 25, Personal Memory 24, Review Center 24, Campaign 23, Scenario Detail 22, Scenario Edit 20, Knowledge View 18, Self-Service 18, Feedback 17, Scenario Library 16, Home 15, Media Tracking 15, Data Model 8, Data Upload 4 | unchanged | one per reachable *original* state — they document the demo's state machine, not the design system |
| stories that exist to document a stub | to be listed per view in Phase 2 (`dispositions.md`) | 0 | **0** | **0** |  |

## 5. Code volume (context, not a target)

| layer | lines (JS/JSX, excluding stories and tests) | Phase 2 result | Phase 3 result |
| --- | ---: | ---: | ---: |
| `components/` | 1,986 | 2,357 | 2,554 |
| `features/` | 5,202 | 4,678 | 4,675 |
| `pages/` | 1,982 | 2,123 | 1,951 |
| `lib/` | 722 | 818 | 908 |
| **UI total** | **9,892** | **9,976** | **10,088** |
| `demo/` | 9,668 | 9,936 | **9,619** |
| `content.js` | 1,949 | 1,959 | 1,959 |
| component CSS (excluding tokens) | ~12,600 | 11,444 | 11,431 |

The simulation layer is as large as the UI it simulates. Part of that is legitimate (deterministic
fixtures, report data); part exists to reproduce source quirks and no-op controls. Phase 2 does not target
a number here, but every dropped stub should shrink it. Result: the UI layer is flat (+84 lines) while `features/` shrank 524 lines into `components/` and `lib/`; `demo/` grew by 268 lines (governed-library flows, `use-toast`, submit and auto-fill behaviour), so the simulation layer did not shrink.

Phase 3 result: `demo/` is 317 lines below the Phase 2 result (net reduction, the WP4 target). WP5 took it
to 9,785 (`useGovernedFlow` replaced three private copies); WP4 took it to 9,619 with one shared
`useModelFlowState` (the model-creation dialog's state was written four times: Home, Cockpit twice and the
shared workspace hook), Home built on `useWorkspaceAssistantDemo`, one `useSynced` (five copies) and
`useToast` (four copies), plus three unused exports removed. The UI layer grew 112 lines
(`AssistantDock`, `SkillForm`, `AutoFillTextarea`, `useGovernedFlow`; `pages/` fell 172 as the assistant
blocks moved into the dock). Measure with
`find src/design/demo -name '*.js*' -not -name '*.test.*' | xargs wc -l`. What is left in `demo/` is mostly
fixtures (`report-fixtures.js` 2,348, `data-model-domains.js` 891, `content/*` 2,168) that stories, tests and
hosts read; every named export in `demo/` is referenced outside its own file.

## 6. Why the current rules produced this

- **Fidelity was the acceptance test.** Paired visual checks against the original reward reproducing each
  page's drift, so drift became tokens (§1) and variants (`KnowledgeActions`).
- **Work was sliced by page.** Each agent saw one page and minimised *that page's* new components. Nobody
  owned the question "is this the same concept as on the page next door?", so the library pattern was
  built nine times and assistant wiring thirteen times.
- **Stubs were treated as reachable states.** AGENTS §5 standard 1 (every reachable state rebuilt) had no
  exception for controls that do nothing, so no-ops became public callbacks and stories.

The 2026-09-27 decisions address all three: the original is evidence, not spec; concepts are counted
globally; stubs get a disposition (Intent / Normalize / Fix / Drop-stub / Ask) instead of an API.
