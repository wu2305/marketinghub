# Phase 3 guide — for implementing agents

Status: **active** (2026-09-29). Audience: an implementing agent (any model) working on one work
package at a time, and the reviewer who checks its PR. Phase 3 continues Phase 2 (`phase2-guide.md`,
complete, closed by #65/#66): it removes the duplication Phase 2 left behind and closes out the
baseline. Every Phase 2 rule that this guide does not change still applies; §2 lists which.

This guide is prescriptive in the same way as Phase 2: the decisions are made in the documents below,
you carry them out, prove it with the gates, and **stop and ask** when the documents do not answer
your question.

## 0. Read before any work (in this order)

1. `AGENTS.md` — repository rules (§3 interfaces and styles, §6 branches and PRs, §7 handover).
2. `handover/design-intent/phase2-guide.md` §2 (regulations), §3 (gate), §5 (report template), §6
   (stop and ask). They are not repeated here; §2 below lists the changes.
3. `handover/design-intent/occam-baseline.md` (the numbers Phase 3 reports against) and
   `handover/README.md` §4 (known gaps; the Phase 3 candidates are item ①–⑩ of the 2026-09-29 entry).
4. `handover/design-intent/foundations.md` §3 and §5 if you touch CSS; `dispositions.md` (template and
   the SFM / SF sections) if you remove or change behaviour.
5. The code of every file your work package lists, plus its stories, tests and visual-check scenarios.

## 1. Work packages

One row = one branch = one PR, off the latest `main`. No stacked PRs: the operator merges on GitHub
without retargeting, so a PR whose base is another PR's branch never reaches `main` by itself.

| WP | title | parallel with | depends on | owner thread |
|---|---|---|---|---|
| 1 | Shared components | 2 | Phase 2 merged | "Phase 3 skill form merge" |
| 2 | Assistant wiring | 1 | Phase 2 merged | the Phase 3 guide thread |
| 3 | Responsive cleanup | — | 1 and 2 merged | — |
| 4 | Demo size and close-out | — | 3 and 5 merged | — |
| 5 | Pages composed by a consumer | 3 | #74, #75 merged | "Codex workflow gaps check" |

A WP may use several PRs when its items are independent (WP7 did); each PR still carries one item.
"Merged" means merged to `main`. Claude does not merge Phase 3 PRs unless the operator says so for
that PR; open them and ask.

### WP1 — Shared components (item ②③⑦, config)

Concept: one implementation per shared piece, not one per page.

Done so far: #67 merged the two skill forms into `components/SkillForm` and extracted
`components/AutoFillTextarea`.

Remaining:

1. Personal Memory's create drawer uses `AutoFillTextarea` instead of its own copy (candidate ③).
2. `ScenarioPreview` is folded into `ExamplePreview` (candidate ②).
3. Knowledge View and Metric Dictionary use `SearchField` instead of their hand-written search boxes
   (candidate ⑦).
4. `.design-sync/config.json` lists every new public export from #67 and this WP (`SkillForm`,
   `SkillFormCard`, `SkillFormFillCard`, `skillFormTones`, `AutoFillTextarea`, `ExamplePreview`, …).

Files this WP owns: `components/{SkillForm,AutoFillTextarea,ExamplePreview}`, `features/personal-memory`,
`features/scenario-*`, the search areas of `pages/{KnowledgeViewPage,MetricDictionaryPage}`.

### WP2 — Assistant wiring (candidate ④, ⑤ in part)

Concept: the assistant (launcher, panel, model-flow dialog, focus return) is one piece, not thirteen.
The 13 consumers are AiInterpreter, Campaign, FeedbackQuality, Home, MarketingCockpit,
MediaTrackingDetail, MetricDictionary, PersonalMemory, ReviewCenter, ScenarioDetail, ScenarioEdit,
ScenarioLibrary and SelfService.

1. New `components/AssistantDock`: renders `AssistantLauncher`, `AssistantPanel` and, when
   `skillFlow.step` is set, `ModelFlowDialog`. It owns the launcher ref and the "launcher hidden while
   the panel is open" rule. Its content comes from one `assistant` object (state, copy, callbacks) plus
   `skillFlow`; the page chooses only `variant`, `tone`, launcher label and, where a page really has a
   second overlay (Cockpit's live Report Copilot), an extra "hidden" condition and launcher `onOpen`.
2. Every one of the 13 pages replaces its launcher + panel + dialog block, and its ~20 destructured
   assistant props, with one `AssistantDock`. Pages that took assistant state as separate props
   (`assistantOpen`, `onOpenAssistant`, `prompt`, `onPromptChange`, `scope`, …) take the same
   `assistant` object as the rest; their demo hooks stop mirroring state onto top-level props.
3. Behaviour does not change: same panel variants, same launcher rules, same callbacks and payloads.
   Renames of page props are listed in the PR (stories, host and scenarios move with them).
4. Not in this WP: the demo-side answer builders, and `useHomeDemo` / `useCockpitDemo` state that is
   not assistant wiring.

Files this WP owns: `components/AssistantDock`, the assistant block of the 13 pages, the assistant
props of their stories, hosts and demo hooks.

### WP3 — Responsive cleanup (candidate ⑥)

Runs alone, after WP1 and WP2, because it touches CSS almost everywhere.

1. Every width `@media` in `src/design/**/*.css` uses one of three breakpoints: **1180 · 900 · 760**
   (`foundations.md` §3). Map by cluster: 1080–1280 → 1180, 820–980 → 900, ≤ 800 → 760. A rule whose
   real breakpoint is not in a cluster (e.g. 480, 600 for a specific control) becomes a container-
   or content-based rule, or joins the nearest cluster; each such case is listed in the PR with the
   before/after screenshot at both sides of the old and new width.
2. Height media queries and `prefers-reduced-motion` stay.
3. A budget: `scripts/css-metrics.mjs` (shared by the budget test and `concept-count.mjs`) counts distinct
   `@media` width values; `css-budget.json` gets `maxMediaWidths: 3`.
4. Visual gate is the full unfiltered run (the change is global), including all 390 px scenarios.

### WP4 — Demo size and close-out (candidates ⑤ rest, ⑧)

1. Trim `demo/`: remove state and branches that only existed to mirror page props (WP2 leaves some),
   dead exports, and fixtures no story or test reads. Report `demo/` line count before → after
   (`find src/design/demo -name '*.js*' -not -name '*.test.*' | xargs wc -l`, tests excluded); the
   Phase 2 result was +268, the target is a net reduction.
2. Delete the `pendingMigration` mechanism (`css-budget.json` key, its test and its metrics support;
   the list is empty).
3. Page props: report the largest page prop count (`--props`) before → after; reduce only where a
   prop group is now redundant. No new grouping objects for their own sake.
4. Add a "Phase 3 result" column to `occam-baseline.md`; rewrite the AGENTS §2.4 facts that changed;
   update `handover/README.md` §1 and §4; full unfiltered gate once.

### WP5 — Pages composed by a consumer (operator decision 2026-09-29)

Concept: the goal is that the components **stack into pages and logic**. A page a consumer builds from
them must **look the same and operate the same** as the demo (same screens, controls, dialogs, toasts,
visible result of each action). How the data rules work underneath does not matter; the demo's storage,
permission and availability logic is not reproduced for its own sake.

A consumer app lives in `examples/consumer/`. It imports only from the package entries
(`marketing-hub`; from `marketing-hub/demo` only upper-case **content** constants such as `INTERPRETER`,
never `use*Demo` hooks or `build*` helpers) and keeps its own state. It is:
- type-checked strictly against `dist/types` and run against `dist/` by `build:lib`;
- driven by a jsdom test (`npm test`) that clicks through the demo's visible behaviour;
- shown as `Examples/*` stories and paired with the original page in `visual-check` (manual/tag runs
  only; CI stays light).

Whatever the consumer can only do by copying demo code or importing an internal path is a **contract
gap**; list it below and fix it in its own PR.

1. Business Term library + create/edit form, rebuilt by a consumer. Behaviour checked: search and
   filters, detail drawer, blocked action explains itself, disable/delete confirm then toast, Add →
   Save shows the new card with its Draft badge, Edit → Save updates that card without duplicating,
   Cancel changes nothing, two app instances stay independent.
2. Contract fixes, one PR per gap found by item 1 (and 3).
3. Skill Library (table pattern) with `AssistantDock`, rebuilt the same way.
4. Close-out folds into WP4: "consumer-built pages look and operate like the demo" is the composability
   gate; the prop and stub counts in `occam-baseline.md` are labelled proxies.

Not in this WP: carrying records between host routes, restore requests into Review Center, unifying the
demo hooks' own availability rules, growing the reachable-state inventory.

Contract gaps found (item 2 works this list):

| id | gap | found by | evidence |
|---|---|---|---|
| G1 | Route params are typed `object`: `hrefFor(id, params)` and `onNavigate({ params })` on `AiInterpreterPage` / `KnowledgeCreatePage`. A TypeScript consumer cannot read `params.type` or pass a typed resolver without a cast. | item 1 | strict build:lib check reported TS2322 ×2 and TS2339 before the casts in `BusinessTermApp.tsx` |
| G2 | `KnowledgeCreatePage` documents `onSave`/`onSubmit`/`onCancel` as `() => void`, but the Business Term form calls them with `{ values }`. The payload exists but cannot be used from TypeScript. | item 1 | `pages/KnowledgeCreatePage/index.jsx` JSDoc vs `features/interpreter/BusinessTermForm` |
| G3 | The same term has two shapes: the form takes `synonyms` as one comma string, the library view takes `synonyms: string[]`. Every consumer writes both conversions. | item 1 | `openForm` and `persist` in `BusinessTermApp.tsx` |
| G4 | `AiInterpreterPage`'s `view` and `assistant` props are typed `object`, so the Business Term view props and the assistant answer shape (`variant: "workspace"`, `banner`, `findings`, `sources`) are not checked or documented at the page boundary. The consumer copied the answer shape from demo code. | item 1 | `view={…}` and `answers` in `BusinessTermApp.tsx` compile with any keys |
| G5 | The governed confirm flow (blocked reason → dialog content from copy → confirm → state change → toast) is caller-side. It now exists four times: three demo hooks and the consumer (~40 lines each). Decide in item 2 whether a small public helper earns its place, or whether this stays the caller's job by design. | item 1 | `act`/`confirm`/`dialog` in `BusinessTermApp.tsx` vs `demo/business-term-demo.js:129-222` |
| G6 | Required fields are marked by the form (`required`), but validation is the caller's, so the consumer repeats which fields are required. Minor. | item 1 | `persist` in `BusinessTermApp.tsx` |

Not gaps: filtering, paging and the facet option lists are the caller's by design (the views are controlled), and the consumer did them in a few lines each.

### Out of scope for Phase 3

Personal Memory's Share button (inert; the designer decides its behaviour), the three unused
foundation tokens (kept by the operator's decision), manual visual reviews (postponed by the operator:
list the affected stories in the PR, do not ask for a review by eye), Cockpit / Campaign / Home
redesign, new features, `index.html` and `assets/**` (never edited).

## 2. Regulations

Phase 2 §2 applies unchanged, except:

- M1 (worktree): a fresh checkout of the current `main` is enough; use a worktree only when two of your
  branches are open at once. Branch names follow the session's instruction.
- M6: update `handover/README.md` (§1 numbers you changed, §4 if a candidate is done, one §5 log row).
  Keep the edit small: WP1 and WP2 run in parallel and both touch the README log. If `main` moved,
  merge it and resolve **keeping both sides**; never `-X theirs`.
- N1: a new component needs two real consumers on day one (`AssistantDock` has thirteen). Every new
  prop, variant or token is listed in the PR with the concept it serves; foundation tokens are still
  the only tokens.
- N7: "never merge" stays the default; the operator may authorise merging a specific PR.
- N9 is replaced: no manual visual verdicts are recorded and none is requested (operator decision
  2026-09-29). The PR lists the affected stories and states what changed visually, or that nothing did.

Also: the concept counts must not go up. If a count rises (e.g. `demo/` lines in WP2), the PR says
why and which WP takes it back.

## 3. Gate

Phase 2 §3 verbatim (`concept-count` before and after; lint; test; `build-storybook`; `build:host` and
`host-check`; `visual-check --affected` and `--negative`; `build:lib`; font probe). Differences:

- Story count may drop only by ids you list, each with where the state is still shown.
- WP3 and WP4 run the full, unfiltered visual check once on the final commit.
- CI runs the same steps and uploads `gate-evidence`; link the run in the PR.
- If Playwright's Chromium is not installed in your environment, use a preinstalled Chromium through
  `PLAYWRIGHT_BROWSERS_PATH` and say so; do not change the scripts for it.

## 4. Per-PR checklist

Before coding
- [ ] Read the §0 list; checked open PRs for overlap (WP1 and WP2 share `README.md` and a few page files)
- [ ] Fresh `main`; `npm ci`; "before" count saved

While coding
- [ ] No behaviour change unless the WP says so; any change is listed with its `file:line` evidence
- [ ] Only foundation tokens; no raw values added
- [ ] Code, CSS, stories, scenarios and props made unused by this change are removed

Before the PR
- [ ] Full gate passes on the final commit; summary lines in the PR
- [ ] Concept counts before → after
- [ ] Affected story ids listed; visual note says what changed or that nothing did
- [ ] `handover/README.md` updated; removed story and scenario ids listed

## 5. PR report template

Same as Phase 2 §5. Replace its "Visual note (the reviewer gives the verdict)" section with
"Affected stories" (ids) and "Visual change" (what differs, or "none").

## 6. Stop and ask

As Phase 2 §6. Additionally: a page needs an assistant behaviour `AssistantDock` cannot express without
a page-specific prop (WP2), a breakpoint change alters a layout the original clearly designed
(WP3), or two WPs need the same file region (report which; the second to merge resolves it).
