# Occam baseline — concept counts now, and targets

Status: **Phase 1 baseline, awaiting user review** (2026-09-27, measured on `main` @ cbf5cc6).

Rule (user decision, 2026-09-27): Occam's Razor is measured in **concepts** — patterns, variants, tokens,
states, props — not in files or component count. A variation earns its own variant, token, prop or story
only when it serves a different purpose. The existing AGENTS §3.4 rules ("no pass-through wrapper, promote
on second use, no unused export") are local checks; they let the same concept be rebuilt in many places, as
long as each copy is small. This file measures the global picture that Phase 2 is judged against.

Targets are orders of magnitude, not quotas. Each Phase 2 PR reports before/after for the rows it touches,
measured with `node scripts/concept-count.mjs [--props <file>]` so every PR counts the same way. Rows the
script prints use its definitions (distinct raw values exclude `var()`, `inherit`, `0`, `none`, and for
radius `50%`/`999px`).

## 1. Visual concepts

| concept | now | target | how measured |
|---|---:|---:|---|
| design tokens | 445 | ~65 | `:root` declarations in `src/design/tokens.css`; target in `foundations.md` §3 |
| … unused tokens | 10 | 0 | no `var()` reference anywhere in `src/design` |
| … tokens with one owner directory | 160 | ≈0 | a token is shared vocabulary; a one-owner value belongs in that component or merges into a role |
| … legacy component/page-named tokens | 162 | 0 | `css-budget.json` `legacyPrefixExemptions` |
| raw `font-size` values outside tokens.css | 32 | 0 (8 tokens) | script |
| raw `font-weight` values | 13 | 0 (3 tokens) | only 300/400/700 font files exist; 500 renders as 400, 600–900 as 700 |
| raw `border-radius` values | 24 | 0 (4 tokens) | script |
| raw `box-shadow` values | 34 | 0 (3 tokens + focus ring) | script; 67 distinct if `var()`-based shadows are included |
| raw colour literals outside tokens (hex + `rgb[a]()`) | 56 | 0 | script; hex alone is already 0 by budget, these are `rgba()` |
| `@media` width values | ~20 | 3 | 1180 / 900 / 760 |

## 2. Structural concepts

| concept | now | target | evidence / note |
|---|---:|---:|---|
| implementations of the governed-library pattern | **9** for 12 views | 1 pattern + per-view config | BusinessTermView (295 JSX / 364 CSS lines), FieldLibraryView (631/1,054, serves 4 types), ScenarioReportsView (259/474), PrinciplesView (215/195), DataModelView (391/836), plus Review Center, Feedback & Quality, Personal Memory and Skill Library lists built in their pages |
| search boxes built by hand beside `SearchField` | 2 governance pages | 0 | Review Center and Feedback & Quality use a raw `<input>` search; interpreter views use `SearchField` |
| facet filters built by hand beside `CheckboxFilter`/`Select` | 5 raw `<select>` in governance pages; 21 in features/pages overall | 0 | |
| raw `<button>` in features/pages | 141 | only where no `Button` variant fits, each justified | `Button` exists with variants and sizes |
| assistant wiring (launcher + panel + model flow) copied per page | 13 pages | 1 (shell-level) | `AssistantLauncher` and `AssistantPanel` each have the same 13 page consumers |
| action-gating rule (R1 × R2 in `domain-model.md`) | 1 function, in `demo/knowledge-actions.js` | 1 function in `lib/` | a domain rule lives in the demo layer, so a host app cannot reuse it |
| variants that encode source accidents | `KnowledgeActions` × 3 variants | 0 | the variants differ only in `disabled` vs `aria-disabled` and label wording (`KnowledgeActions/index.jsx:5–15`) — domain Ask A3 |
| shared components with exactly one consumer | 6 | 0 | `ColumnChart`, `DataTable`, `FileDropzone`, `FilterPills`, `ProgressList`, `Toast` — all in `components/`, each used by one page; contradicts "promote on second use" |
| shared components with two consumers from one feature pair | 3 | review | `ScenarioGovernance`, `ScenarioPreview`, `ScenarioStructure`: used only by Skill Detail drawer and Scenario Detail page |
| exported enum constants | 48 | only enums a caller can choose | many enumerate source layouts rather than caller choices |
| public exports (`index.js`) | 83 lines of `export` | — | measure after Phase 2 |

## 3. Interface concepts

| concept | now | target | evidence / note |
|---|---:|---:|---|
| page props, max | 49 (`CampaignPage`) | ≤ ~12 | `--props`; next are Cockpit, Media Tracking, Home, Self-Service, Knowledge Create. Out of Phase 2 scope except migrated views |
| callback props that exist only to model a no-op source control | 4 (6 no-op actions) | 0 | `SkillDetail onClick({action:"delete"})` ("Visible source no-op Delete action", `SkillDetail/index.jsx:18`); `SkillInlineForm onClick` for auto-fill / run-preview / save-draft (`:19`); `ScenarioEditForm onAutoFill`, `onSaveDraft` ("Source button has no resulting behavior", `:28,30`) |
| filters that store a value and filter nothing | 1 | 0 | Review Center *Submitted* (`domain-model.md` R7) |
| success feedback defined but never shown | 3 call sites | 1 toast | `domain-model.md` R6 |
| vocabularies for "availability" | 5 spellings | 1 | `domain-model.md` §3.1 |
| permission-denied messages | 2 wordings | 1 | `domain-model.md` R1 |

## 4. Documentation concepts

| concept | now | target | note |
|---|---:|---:|---|
| stories, total | 461 | — | |
| page stories | 360 (17 pages, 4–45 each) | ≤ ~6 per page | a page story shows a composition; states belong to the pattern/component that owns them |
| … stories per page | Knowledge Create 45, Review Center 28, Cockpit 26, Interpreter 25, Metric Dictionary 25, Personal Memory 24, Campaign 23, Feedback 23, Scenario Detail 22, Skill Library 21, Scenario Edit 20, Knowledge View 18, Self-Service 18, Home 15, Media Tracking 15, Data Model 8, Data Upload 4 | | one per reachable *original* state — they document the demo's state machine, not the design system |
| stories that exist to document a stub | to be listed per view in Phase 2 (`dispositions.md`) | 0 | |

## 5. Code volume (context, not a target)

| layer | lines (JS/JSX, excluding stories and tests) |
|---|---:|
| `components/` | 1,986 |
| `features/` | 5,202 |
| `pages/` | 1,982 |
| `lib/` | 722 |
| **UI total** | **9,892** |
| `demo/` | 9,668 |
| `content.js` | 1,949 |
| component CSS (excluding tokens) | ~12,600 |

The simulation layer is as large as the UI it simulates. Part of that is legitimate (deterministic
fixtures, report data); part exists to reproduce source quirks and no-op controls. Phase 2 does not target
a number here, but every dropped stub should shrink it.

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
