# Phase 2 guide — for implementing agents

Status: **active** (2026-09-27, revised after review). Audience: an implementing agent (any model)
working on one work package at a time, and the reviewer who checks its PR.

This guide is deliberately prescriptive. You are not asked to make design decisions: they are made in
the documents below. Your job is to carry them out exactly, prove it with the gates, and **stop and ask**
whenever the documents do not answer your question.

## 0. Read before any work (in this order)

1. `AGENTS.md` — repository rules. Where it conflicts with this guide, this guide wins for Phase 2 work
   (user decision 2026-09-27), except the branch/PR/handover rules in AGENTS §6–§7, which always apply.
2. `handover/design-intent/foundations.md` §3 (tokens) and §5 (decisions). Skim Appendix A; read the rows
   for the tokens you touch.
3. `handover/design-intent/domain-model.md` §3–§5 and §7 (rules and decisions).
4. `handover/design-intent/patterns/library.md` (the whole file).
5. `handover/design-intent/dispositions.md` (the seed table and the template).
6. `handover/design-intent/occam-baseline.md` §1–§4 (the numbers your PR must report).
7. The code of every file your work package lists, plus its stories, tests and visual-check scenarios.

Do not start editing until you have read all seven. If the PR shows you skipped one, it is rejected.

## 1. Work packages

Do them **in this order**. One row = one branch = one PR. Do not combine rows. Do not start a row until the
rows it depends on are merged, except where the "parallel with" column allows it.

| WP | title | parallel with | depends on | review stop |
|---|---|---|---|---|
| 1 | Add foundation tokens | — | Phase 1 merged | |
| 2a, 2b, 2c, 2d | Re-point legacy tokens to roles (one PR each, in order) | 4 | 1 (2b needs 2a, …) | |
| 3a, 3b, 3c, 3d | Raw type/weight/radius/shadow/colour values → tokens (in order) | — | 2d | |
| 4 | `lib/governance.js` rules | 2a–3d | Phase 1 merged | |
| 5 | Extend `Button` (href) and `DataTable` (open, empty, narrow) | 3b–3d | 3a | |
| 6 | Pattern components | — | 3d, 4, 5 | |
| 7a | Migrate Business Terms — **pilot, cards layout** | — | 6 | **yes** |
| 7f | Migrate Review Center — **pilot, table layout** | 7b–7e, 7g, 7i | 7a reviewed | **yes** |
| 7b–7k (other) | Migrate the remaining views (table below); 7b–7e in order (shared interpreter files); 7g, 7i may run beside them | as stated | 7a reviewed; 7h after 7f reviewed | |
| 8 | Close out: delete unused tokens, tighten budgets, update AGENTS §2.4 | — | 7k | |

**Review stop** means: after that PR is opened, stop. A reviewer (the user or a stronger model) checks it
with §7, including the pilot-only items. The next package starts only after the reviewer says so. The
pilots (7a cards, 7f table) prove the pattern API on one card view and one table view before it is
copied. Correction 2026-09-27: 7b is a card view (the original's field-library table is dead code), so the
table pilot is 7f.

"Merged" means merged to `main` by the user. You never merge.

### Where each decided seed is applied

| seed (`dispositions.md`) | applied in | seed | applied in |
|---|---|---|---|
| D01, D02 | 7f | D10 | 7h |
| D03 | every WP7 view with `manage` or delete | D11, D13, D14 | 7j |
| D04 | 6 (`ItemActions`), 7a/7b/7d (views); `KnowledgeActions` deleted in 7d | D12 | 7i |
| D05, D06 | 4 (rules), then every WP7 view | D15 | 7k |
| D07 | 7a | D16 | 7d |
| D08 | 7b, 7c | D17 | 2a–3d (tokens), 7a/7e (views) |
| D09 | 7h | | |

### WP1 — Add foundation tokens

Files: `src/design/tokens.css`, `src/design/foundations.stories.jsx`, `src/design/css-budget.json`,
`src/design/css-budget.test.js`, and the one CSS line named below.

1. Add every token in `foundations.md` §3 with the listed value, in a new block at the top of `:root`
   titled `/* Foundations (handover/design-intent/foundations.md §3) */`. Breakpoints go in that block as a
   comment, not as custom properties.
2. **Names that already exist** — delete the old definition lower in the file, keep the §3 value:

   | token | old value | new value | effect |
   |---|---|---|---|
   | `--mh-surface`, `--mh-line`, `--mh-line-strong`, `--mh-scrim` | same | same | none |
   | `--mh-danger` | `#d8222a` | `#9b1230` | ModelFlowDialog error text/border become the declared red |
   | `--mh-info` | `#2f6ea6` | `#3f73a6` | ~1 ΔE, invisible |
   | `--mh-focus-ring` | `rgba(63,115,166,.1)` | `rgba(63,115,166,.55)` | its one use is a 3 px box-shadow halo (`pages/CampaignPage/CampaignPage.css:200`); change that rule to `outline: 2px solid var(--mh-focus-ring); outline-offset: 2px;` and remove the `box-shadow` — the only component-CSS edit allowed in WP1 |

3. **Values that already exist under a legacy name** — the budget test counts two tokens with the same
   value as a duplicate group (`maxDuplicateValues`). For each pair below, redefine the legacy token as
   `var(<new>)` in the same PR, so no new duplicate group appears:
   `--mh-ink`→`--mh-text-strong`, `--mh-copy`→`--mh-text`, `--mh-muted`→`--mh-text-muted`,
   `--mh-faint`→`--mh-text-faint`, `--mh-ink-inverse`→`--mh-text-inverse`, `--mh-bg`→`--mh-surface-page`,
   `--mh-bg-soft`→`--mh-surface-subtle`, `--mh-line-faintest` and `--mh-surface-control-muted`→`--mh-surface-muted`,
   `--mh-surface-dark` and `--mh-ink-dark-control`→`--mh-surface-inverse`,
   `--mh-line-panel-subtle`→`--mh-line-subtle`, `--mh-gold-light`→`--mh-accent-soft`,
   `--mh-gold-medium`→`--mh-accent`, `--mh-gold-text`→`--mh-accent-ink`,
   `--mh-surface-gold-pale`→`--mh-accent-wash`, `--mh-reports-gold-btn`→`--mh-accent-fill`,
   `--mh-green`→`--mh-success`, `--mh-ink-warning-icon`→`--mh-warning`, `--mh-red`→`--mh-danger`,
   `--mh-blue`→`--mh-info`, `--mh-indicator-teal`→`--mh-data-teal`, `--mh-ink-draft`→`--mh-data-violet`,
   `--mh-ink-rose`→`--mh-data-rose`, `--mh-focus-strong`→`--mh-focus-ring`,
   `--mh-popover-shadow`→`--mh-shadow-overlay`, `--mh-modal-shadow`→`--mh-shadow-modal`.
   (`--mh-surface` and `--mh-text-inverse` are both `#ffffff` by design; if the test counts them as a
   group, raise `maxDuplicateValues` by exactly 1 and say why in the PR.)
4. `css-budget.test.js` `SEMANTIC_FAMILIES`: add exactly `text accent success warning data space layout`.
   `css-budget.json`: set `maxTokenDefinitions` to the new count.
5. `foundations.stories.jsx`: add stories for the foundation groups (colour swatches per role, type scale,
   weights, radius, shadow, space). Existing foundations stories keep their ids.

Done when: gates pass; the PR lists added tokens, the changed values above, and the legacy tokens
redefined in step 3.

### WP2 — Re-point legacy tokens to role tokens

One PR per group, in order:

| sub | Appendix A targets |
|---|---|
| 2a | `--mh-text-*` |
| 2b | `--mh-surface-*`, `--mh-scrim`, `--mh-line-*` |
| 2c | `--mh-accent-*`, status (`success/warning/danger/info`), `--mh-data-*`, and every `color-mix(...)` row |
| 2d | shadows, `--mh-focus-ring`, the radius rename, the `(component-local)` row, unused (`remove`) rows |

- **merge** row: redefine the legacy token as `var(<target>)` in `tokens.css`. Component CSS is not
  touched in WP2 (only exception: the `(component-local)` row below).
- **derive** row: redefine as `color-mix(in srgb, var(<target>) <N>%, var(--mh-surface))` with the N (whole
  number) that brings the result closest to the old value; list old value, new value and N in the PR.
- **remove (unused)** row: delete the token and its `legacyPrefixExemptions` entry if it has one.
- **`(component-local)`** row (`--mh-reports-filter`): move the value into its consumers' CSS as a local
  custom property on each component root, delete the token.
- **Duplicate-value budget**: pointing many legacy tokens at one role creates duplicate-value groups (all
  `var(--mh-text)` tokens form one group). Raise `maxDuplicateValues` in `css-budget.json` to the new
  measured count and state it in the PR; WP8 brings it back down.
- **A row looks wrong** (e.g. a text colour mapped to a surface role): change the target *only if* the
  token's name and every use site agree on the role, and append to Appendix A:
  `corrected in WP2x: <token> <old target> → <new target> because <use sites>`. If use sites disagree,
  stop (§6).
- Visual change expected: small and broad. That is the intent. The review question is "does it still look
  like the original product?" (§4 screenshots item), not "is it identical?".

### WP3 — Raw values → tokens in component CSS

One PR per directory, in order: 3a `components/`, 3b `features/interpreter/`, 3c other `features/*`,
3d `pages/` and `lib/`.

**Skip the files WP7 will replace.** Do not edit the CSS of: `features/interpreter/{BusinessTermView,
FieldLibraryView,ScenarioReportsView,PrinciplesView,KnowledgeActions}`, `features/review-center/ReviewQueue`,
`features/feedback-quality/FeedbackList`, `features/scenario-library/SkillLibrary`, and the list parts of
`pages/{ReviewCenterPage,FeedbackQualityPage}`. List them in `css-budget.json` as
`"pendingMigration": [<paths>]`; the new budget checks ignore those files, and each WP7 PR removes its
entries.

Mapping rules (from `foundations.md` §2):

| property | rule |
|---|---|
| `font-size` | ≤ 11.5 px → `xs`; 12–12.5 → `sm`; 13–13.5 → `md`; 14 → `lg`; 15–17 → `xl`; 18–21 → `2xl`; 22–34 → `3xl`; ≥ 36 and `clamp()` headlines → `display`. rem: ×16 first |
| `font-weight` | 300 → light; 400–500 → regular; 560–900 → bold |
| `border-radius` | 1–5 px → `sm`; 6–10 → `md`; 11–26 → `lg`; ≥ 99 px or `50%` → `pill`; per-corner values map each corner the same way |
| `box-shadow` (elevation) | largest blur > 40 px → `modal`; otherwise a *resting* element (selector has no hover/focus/active/open state and is not a popover, menu, tooltip, toast, panel, drawer or dialog) → `raised`; a lifted state or floating layer → `raised` if blur ≤ 12, else `overlay` |
| `box-shadow: 0 0 0 Npx …` on `:focus`/`:focus-visible` | replace with `outline: 2px solid var(--mh-focus-ring); outline-offset: 2px` |
| `box-shadow: 0 0 0 Npx …` on a selected/active/invalid state | keep the shape; map its colour like any colour literal (an invalid-field ring stays danger, a selection ring stays accent) |
| focus style mixing a ring with a drop shadow | outline as above; the drop shadow follows the elevation rule. Remove any `outline: 0` in the same rule |
| colour inside `outline` | `var(--mh-focus-ring)` (D2) |
| raw `rgba()` / `rgb()` / hex | nearest role token, or `color-mix()` of one (same rule as WP2 derive) |
| formulas / code | keep `var(--mh-font-mono)` |

- In 3a, first add budget checks to `css-budget.test.js` for distinct raw `font-size`, `font-weight`,
  radius, `box-shadow` and colour-literal values outside `tokens.css` (same definitions as
  `scripts/concept-count.mjs`), excluding `pendingMigration` files, with limits in `css-budget.json` set
  to today's counts. Every later sub-PR lowers them to its new count. After 3d they are 0. A composite value
  counts only while it still holds a literal: a shadow counts if it contains a colour literal, a radius if
  it contains a non-zero number outside `var()`.
- Spacing is **not** in scope (too many values to move safely). New code uses the space scale.

### WP4 — `lib/governance.js`

Create `src/design/lib/governance.js` exporting:

- `availabilityOf(record) → "enabled" | "disabled"`: accepts all spellings in `domain-model.md` §3.1
  (`status: "Enable"/"Disable"/"enable"`, `ai_interpretation_enabled`, `ai_interpreter_enabled`,
  `isDisabled`, `availability`); a record with `stage === "Draft"` is always `"disabled"`.
- `governedActions(record, { currentUser }) → Array<{ action: "edit"|"delete"|"disable", blocked: boolean,
  reason: null|"permission"|"disable-first"|"already-disabled" }>` in the order edit, delete, disable.
  Creator is `record.created_by ?? record.creator` (never `owner`, `domain-model.md` §1); the demo hooks
  already fill `creator` from the source's fallback (`demo/scenario-demo.js:71`), keep it that way. Reason
  precedence: `permission` first, then the availability rule (pattern B6).
- `governanceMessages`: default copy for the three reasons and their dialogs (pattern B7, B11). Pages and
  demo hooks pass overrides from `content.js`; the lib never imports `content.js`.

Tests `lib/governance.test.js`:
- the full table, **18 rows**: creator yes/no × enabled / disabled / draft × 3 actions (expected values
  follow pattern B6; a draft gives exactly the same result as disabled — assert its 6 rows explicitly);
- `availabilityOf` for every spelling above.

`demo/knowledge-actions.js` is **not** changed in WP4. Its draft rule differs on purpose: it keeps the
source's dead end (a Draft stored as Enable blocks both edit, "disable first", and disable, "already
disabled"), which R3 resolves by treating drafts as disabled. Making it delegate would change view
behaviour before the views migrate. Each WP7 package switches its view to `lib/governance.js`; the last
one (7d) deletes `demo/knowledge-actions.js`. `boundaries.test.js` must pass (lib must not import demo).

### WP5 — Extend `Button` and `DataTable`

Depends on 3a because 3a rewrites these components' CSS first.

- `Button`: optional `href`. With `href` it renders `<a href>` with identical classes; `onClick` still
  fires with `{ label }`; never `preventDefault`. With `href` + `disabled`: render `<a>` without `href`
  and with `aria-disabled="true"`. Story: "As link".
- `DataTable`:
  - optional `onOpen({ id })`: the first cell of each row renders its content inside a `<button
    type="button">` styled as the row title; clicking the row or pressing Enter/Space on that button calls
    `onOpen`. The table keeps table semantics (no `role` on `<tr>`). Action buttons in other cells stop
    propagation.
  - optional `emptyState` node, rendered in place of the body when `rows` is empty;
  - below 760 px each row renders as a stacked block; each cell shows its column header as a label
    (`data-label` + `::before`, no duplicated DOM text).
  - Campaign's existing usage, stories and scenarios must not change.
- A story for each new prop; Controls for all props.

### WP6 — Pattern components

Build exactly the components `patterns/library.md` §2 marks **new** — `LibraryToolbar`, `LibraryList`,
`LibraryItem`, `ItemActions`, `LibraryEmpty` — in `src/design/components/<Name>/`, with the props that
table specifies.

- Props follow AGENTS §3.1 (content/state props, `children`, named-object callbacks, exported enum
  constants such as `libraryLayouts = ["cards", "table"]`). No page names and no per-view variants —
  variation comes from content and the pattern §5 configuration (`layout`, `manage`, `create`, facets).
- `LibraryList` owns both layouts: `cards` → `<ul>` grid of `LibraryItem`; `table` → `DataTable`. Views
  never render `DataTable` or the grid directly.
- `ItemActions` renders what `governedActions` returns; it never computes permissions. It does **not**
  open dialogs: every click calls `onAction({ action, id, blocked, reason })`; the caller (demo hook)
  decides which `ConfirmDialog` to open. Blocked buttons: `aria-disabled="true"`, focusable, clickable,
  `title` = reason message.
- `LibraryToolbar` always renders the count (B3). Data (`search`, `facets`, `count`, `create`, `tabs`)
  comes in as props; there are no slots.
- Visuals: pattern §6, foundation tokens only (the WP3 budgets apply).
- Stories: title `Organisms/Library/<Name>`, `tags: ["autodocs"]`, one story per state in pattern §4.
  Tests: one render test per component; `ItemActions` asserts `aria-disabled` and that a blocked click
  still calls `onAction` with the reason.
- Export from `src/design/index.js`. No page uses them yet.

### WP7 — Migrate views (one PR each)

| sub | view(s) | files replaced | seeds |
|---|---|---|---|
| 7a | Business Terms (**pilot: cards**) | `features/interpreter/BusinessTermView` | D03 D04 D05 D06 D07 D17 |
| 7b | Analytical Models, Metric Dictionary, Email Reports | card views of `features/interpreter/FieldLibraryView` except Report Context | D03 D04 D05 D06 D08 |
| 7c | Report Context; delete `FieldLibraryView` when empty | Report Context cards of `FieldLibraryView` | D06 D08 |
| 7d | Scenario Reports; delete `KnowledgeActions` (last consumer) | `features/interpreter/ScenarioReportsView` | D03 D04 D05 D06 D16 |
| 7e | Principles + Data Model domain cards (browser untouched) | `features/interpreter/PrinciplesView`, domain cards in `DataModelView` | D17 |
| 7f | Review Center (**pilot: table**) | `features/review-center/ReviewQueue`, list parts of `pages/ReviewCenterPage` | D01 D02, B14, A5 |
| 7g | Feedback & Quality | `features/feedback-quality/FeedbackList`, list parts of `pages/FeedbackQualityPage` | — |
| 7h | Skill Library list + Skill Detail drawer | `features/scenario-library/{SkillLibrary,SkillDetail}` | D09 D10 |
| 7i | Personal Memory list column, delete confirm, toast; create form auto-fill | list column of `features/personal-memory/MemoryWorkspace` | D12 |
| 7j | Skill inline form + Scenario Edit form stubs (not a library view) | `features/scenario-library/SkillInlineForm`, `features/scenario-edit/ScenarioEditForm` | D11 D13 D14 |
| 7k | Submit → Under Review in governed forms (not a library view) | `KnowledgeCreatePage` submit handling in `demo/knowledge-create-demo.js`, `BusinessTermForm`, `ModelFlowDialog` submit result | D15 |

For every WP7 package:

1. **Inventory first.** Before changing code, add the package's section to `dispositions.md` using its
   template: every behaviour of the original view (read its `assets/js` and `assets/pages` files, cite
   lines) and every prop, callback and story of the current React view, one disposition each. Seeds are
   referenced by D-number, not repeated.
2. If any row is **Ask**: commit only the inventory, report the Ask (§6), stop.
3. Rebuild the view by composing the pattern components with the pattern §5 configuration. The view keeps
   only what §5 marks **keep**, passed through `LibraryItem` `children` or the drawer content.
4. View state lives in its `useXxxDemo` hook (move it there if it is still in the view or story); the hook
   uses `lib/governance.js` and decides dialogs and toasts.
5. Delete what became unused: old view files and CSS, private helpers, props, stories, the view's
   `pendingMigration` entries, tokens whose last reference went (shared ones wait for WP8).
6. **Stories.** Remove only page stories whose *only* purpose was a list state now shown by a pattern
   story (filtered, empty, paged, blocked action, confirm, toast …). Keep every page story for states
   outside the list (assistant, model flow, forms, drawers with view-specific content). Target: no more
   than 6 list-state stories per page. List each removed story id with the story that now shows the state.
7. **Scenarios** (`scripts/visual-check/scenarios/pNN.mjs`):
   - Story-side selectors: update to the new markup.
   - A scenario whose story was removed in step 6: point it at a remaining page story and reach the state
     with `actions` (click/fill/select), so the pairing with the original page survives. Delete it only if
     it asserted a dropped stub; list it.
   - Original side: unchanged, unless it asserts a defect we now fix. Then the original side asserts that
     the control exists, and the story side asserts the correct result (AGENTS §3.5). Rename the scenario
     id if its name described the defect (e.g. `p12-time-noop` → `p12-time`).
   - `--negative` must still fail every mutated scenario.
   - A blocked action is `aria-disabled` but operable (B7). Playwright's `click` refuses such elements, so
     click them with `{ eval: "document.querySelector('…').click()" }`.
8. Record before/after counts (§5 report).

### WP8 — Close out

- Delete tokens with zero references; set `maxTokenDefinitions` to the new count; remove deleted names from
  `legacyPrefixExemptions` (target: empty); set `maxDuplicateValues` back to ≤ 9; `pendingMigration` must
  be empty.
- Add a "Phase 2 result" column to `occam-baseline.md` from `scripts/concept-count.mjs`.
- Rewrite the AGENTS §2.4 facts that changed (tokens, list pattern, `KnowledgeActions` gone) — rewrite,
  do not append.

### Out of scope for Phase 2

Do not touch these; propose them as Phase 3 in your report if relevant: assistant wiring
de-duplication; page prop reduction outside the migrated views; Cockpit, Self-Service, Campaign, Home,
Media Tracking, Data Upload, Knowledge View and Metric Dictionary detail pages; Knowledge Create except its
submit result (7k); spacing normalisation; `demo/` size beyond what migrations orphan; `index.html` and
`assets/**` (never edited).

## 2. Regulations

**MUST**

- M1. One package per branch, created from the latest `main` of the GitHub remote in its own worktree:
  ```sh
  git fetch github
  git worktree add ../mh-wp<id> -b di/wp<id>-<slug> github/main
  cd ../mh-wp<id> && npm ci && npx playwright install chromium
  ```
  (In the main checkout the GitHub remote is named `github`; `origin` is a mirror. Check with
  `git remote -v` and use whichever points to github.com.)
- M2. Use only tokens from `foundations.md` §3 in new or edited CSS.
- M3. Cite the source (`file:line`) for every behaviour you implement, change or remove, in
  `dispositions.md` or the PR.
- M4. Keep every **Intent** behaviour reachable. Removing a *working* capability is never a disposition.
- M5. Run the full gate (§3) on the final commit and paste the summary lines into the PR.
- M6. Update `handover/README.md` in the same PR: the "DI Phase 2" row in §2.1 (which package is done),
  §3 only for a visible difference not already explained by `foundations.md`/`dispositions.md`, and one
  §5 log line. If `main` moved, rebase and re-resolve `handover/README.md`; never drop another log line.
- M7. End commits with a `Co-Authored-By:` line for your model and PR bodies with the attribution line the
  repository's instructions give you.
- M8. Keep the PR reviewable: if the diff exceeds ~1,500 changed lines (not counting deletions), stop and
  ask how to split it.
- M9. Push your branch and open the PR only when the operator approves those steps; open it as a draft
  when it ends in a question.

**MUST NOT**

- N1. Do not make design decisions the design-intent documents do not contain: no new tokens, variants,
  props, states, copy or colours. If you need one, stop (§6).
- N2. Do not edit `index.html`, `assets/**`, `foundations.md` (except Appendix A corrections in WP2),
  `domain-model.md` or `patterns/library.md`. These three documents change only with the user.
- N3. Do not reproduce a defect or stub "for fidelity". Do not add props, variants or branches whose only
  reason is that the original did it.
- N4. Do not add raw `<button>`, `<select>` or search `<input>` where `Button`, `Select`, `SearchField` or
  `CheckboxFilter` fit.
- N5. Do not add a component to `components/` with fewer than two real consumers (the five pattern
  components are pre-approved).
- N6. Do not weaken, skip or delete a test or scenario to make the gate pass. Deleting a scenario is only
  allowed under WP7 step 7, and must be listed.
- N7. Do not push to `main`, merge any PR, force-push, delete branches (local shared or remote), or run a
  command that changes `package-lock.json`.
- N8. Do not touch files outside your package, and do not tidy unrelated code.
- N9. Do not record a manual visual verdict (`visual-check --review`). You produce screenshots and a note;
  the verdict is the reviewer's.

## 3. Gate

Run in the package's worktree, in this order; all must pass on the final commit.

```sh
node scripts/concept-count.mjs > /tmp/mh-wp<id>-count-before.txt   # once, before your first edit
npm run lint                                   # 0 errors, 0 warnings
npm test                                       # every file passes
npm run build-storybook                        # also writes the stamp visual-check needs
npm run build:host && node scripts/host-check.mjs --out /tmp/mh-wp<id>-host
node scripts/visual-check.mjs --out /tmp/mh-wp<id>-visual           # full run; --only pNN is for quick loops only
node scripts/visual-check.mjs --negative --out /tmp/mh-wp<id>-neg  # every mutation must fail
npm run build:lib
(cd storybook-static && python3 -m http.server 6107 >/dev/null 2>&1 & echo $! > /tmp/mh-wp<id>-probe.pid)
node scripts/font-probe.mjs http://127.0.0.1:6107; kill "$(cat /tmp/mh-wp<id>-probe.pid)"
node scripts/concept-count.mjs > /tmp/mh-wp<id>-count-after.txt
```

- Font probe: only the existing intentional monospace lines (formulas/code) may appear. Any other line
  fails the gate.
- Story count: `storybook-static/index.json` may drop only by the story ids you list as removed (WP7
  step 6).
- A gate failure you cannot trace to your change: see §6.

## 4. Per-PR checklist (copy into the PR body and tick)

Before coding
- [ ] Read the §0 list; noted which D-/A-/R-/B- rules apply to this package
- [ ] Worktree from latest `github/main`; `npm ci` and Playwright install done; "before" count saved
- [ ] (WP7) Inventory section added to `dispositions.md`; no **Ask** rows (otherwise stop)

While coding
- [ ] Only foundation tokens; no raw colours, sizes, weights, radii or shadows added
- [ ] No new props, variants, states or copy beyond the design-intent documents
- [ ] (actions) Blocked actions are `aria-disabled`, clickable and explained (pattern B7)
- [ ] Every control changes something (B4); no stub kept
- [ ] Code, CSS, stories, scenarios and budget entries made unused by this change are removed

Before the PR
- [ ] Full gate (§3) passes on the final commit; summary lines pasted below
- [ ] Screenshots of every affected story at 1440 px and 390 px, next to the original page at 1440 px,
      under `/tmp/mh-wp<id>-shots/` with an `index.html`; per view one line: "recognisably the original?
      — regions / copy / badges / accent: same | differences: …"
- [ ] Concept counts before → after (§5 table, from the two count files)
- [ ] `handover/README.md` and `dispositions.md` updated
- [ ] Removed story ids and scenario ids listed, each with where the state is now shown

## 5. PR report template

```markdown
## WP<id> — <title>

### What changed
- components added / changed / removed: …
- dispositions applied: D01, D03, <view>-04 … (link to the dispositions.md section)

### Concept counts (scripts/concept-count.mjs)
| concept | before | after |
|---|---:|---:|
| tokens | | |
| legacy-named tokens | | |
| raw font-size / weight / radius / shadow / colour values | / / / / | / / / / |
| raw button / select / input uses | / / | / / |
| stub callbacks | | |
| stories total / page stories | / | / |
| props on the migrated view(s) (`--props`) | | |

### Removed
- stories: `<id>` → state now in `<id>`
- scenarios: `<id>` (reason)
- props / callbacks / tokens / files: …

### Gate
lint … · test … files / … tests · storybook … stories / … docs · host …/… · visual …/… · negative …/… · build:lib ok · font-probe: no new lines

### Visual note (the reviewer gives the verdict)
<view>: recognisably the original? … differences: … screenshots: /tmp/mh-wp<id>-shots/index.html

### Open questions
none | <question, evidence file:line, the readings, which you would pick and why>
```

## 6. Stop and ask — do not proceed when

- a behaviour fits no disposition rule, or fits two (→ **Ask** row, then stop);
- `patterns/library.md` §5 does not say whether a variation is keep or drop;
- a needed token, prop, variant, state or string is not in the design-intent documents;
- an Appendix A row is wrong and its use sites disagree with each other;
- a gate fails for a reason you cannot trace to your change — report the exact output; retry at most
  twice; never disable the check;
- your change would alter a page outside your package;
- the diff grows past M8.

How to ask: stop editing, commit what you have on your branch, and report: the question, the evidence
(`file:line`), the readings you see, which one you would pick and why. Then wait.

## 7. Reviewer checklist

For the person or stronger model reviewing each PR.

- [ ] Exactly one package; nothing from §1 "Out of scope"
- [ ] Every disposition row has evidence; Intent/Fix rows cite the source of the intent
- [ ] No invented design decision (compare new tokens, props, variants and copy against the documents)
- [ ] Blocked-action, confirm and toast behaviour match pattern B6–B8 (if touched)
- [ ] Each removed story/scenario maps to a dropped stub or to a story that still shows the state
- [ ] Gate output belongs to the PR's head commit (build stamp hash matches) and is complete
- [ ] Screenshots: recognisably the original, uses the foundation, nothing broken at 390 px; record the
      verdict with `node scripts/visual-check.mjs --review <out> <scenarioId> pass|fail "note"`
- [ ] Concept counts went down, or the PR explains why not
- [ ] **Pilots (7a cards, 7f table) only**: the pattern components serve this view without view-specific props or
      workarounds, and nothing in the remaining packages (7c–7k and pattern §5) would need a new prop. If
      that fails, the pattern components are fixed in a separate PR before the next package starts.

## 8. Kickoff prompt (paste to the implementing agent; fill `<id>` and `<path>`)

```text
You are implementing Phase 2 work package WP<id> of the Marketing Hub design-intent project.
Repository: <path>. Read, in order: AGENTS.md; handover/design-intent/phase2-guide.md (your rules — it
overrides AGENTS.md where they conflict); then the documents its §0 lists. Do only WP<id> as described in
phase2-guide.md §1. Follow §2 MUST/MUST NOT, run the §3 gate, tick the §4 checklist and fill the §5
report. If anything in §6 happens, stop and report instead of guessing. Ask before pushing or opening a
PR. Never merge, push to main, or delete branches. When done, report the branch name, the filled §5
report, and any open questions.
```
