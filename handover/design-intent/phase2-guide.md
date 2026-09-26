# Phase 2 guide — for implementing agents

Status: **active** (2026-09-27). Audience: an implementing agent (any model) working on one work package
at a time, and the reviewer who checks its PR.

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
7. The code of every file your work package lists, plus its stories and tests.

Do not start editing until you have read all seven. If you skipped something and the PR shows it, the PR is
rejected.

## 1. Work packages

Do them **in this order**. One work package (or one sub-item marked a/b/c) = one branch = one PR. Do not
combine. Do not start a package until the previous one is merged, except where the "may run in parallel
with" column allows it.

| WP | title | may run in parallel with | depends on |
|---|---|---|---|
| 1 | Add foundation tokens | — | Phase 1 merged |
| 2a–2d | Re-point legacy tokens to roles | 4 | 1 |
| 3a–3d | Type, weight, radius, shadow values → tokens | — | 2d |
| 4 | `lib/governance.js` rules | 2a–2d | Phase 1 merged |
| 5 | Extend `Button` (href) and `DataTable` (open, empty, narrow) | — | 3d |
| 6 | Pattern components | — | 4, 5 |
| 7a | Migrate Business Terms (**pilot — stop for review after this**) | — | 6 |
| 7b–7i | Migrate the other views | — | 7a reviewed |
| 8 | Delete unused legacy tokens, tighten budgets, update AGENTS §2.4 | — | 7i |

### WP1 — Add foundation tokens

- Files: `src/design/tokens.css`, `src/design/foundations.stories.jsx`, `src/design/css-budget.json`
  (raise `maxTokenDefinitions` by exactly the number added), `css-budget.test.js` `SEMANTIC_FAMILIES`: add exactly the new roots
  `text accent success warning data space layout` (all others already exist).
- Add every token in `foundations.md` §3 with the listed value, in a new block at the top of `:root`
  titled `/* Foundations (handover/design-intent/foundations.md §3) */`. Where a name already exists
  (`--mh-surface`, `--mh-line`, `--mh-line-strong`, `--mh-danger`, `--mh-info`, `--mh-focus-ring`, …),
  **change its value to the §3 value** and delete the duplicate definition lower in the file.
  Breakpoints are documented in a comment, not as custom properties.
- `foundations.stories.jsx`: show the foundation groups (colour swatches per role, type scale, radius,
  shadow, space). Existing foundations stories keep their ids.
- Visual change expected: only where an existing name's value changed. List those names in the PR.
- Done when: gates pass; the PR lists added tokens and changed values.

### WP2 — Re-point legacy tokens to role tokens

Four PRs, by Appendix A group:

| sub | Appendix A targets |
|---|---|
| 2a | `--mh-text-*` |
| 2b | `--mh-surface-*`, `--mh-scrim`, `--mh-line-*` |
| 2c | `--mh-accent-*`, status (`success/warning/danger/info`), `--mh-data-*`, and every `color-mix(...)` row |
| 2d | shadows, `--mh-focus-ring`, radius rename, `(component-local)` rows, unused (`remove`) rows |

- For each **merge** row: redefine the legacy token as `var(<target>)` in `tokens.css`. Do not touch
  component CSS in WP2.
- For each **derive** row: redefine as `color-mix(in srgb, var(<target>) <N>%, var(--mh-surface))` with the
  N that brings the result closest to the old value (state old value, new value and N in the PR).
- For each **remove (unused)** row: delete the token. For the `(component-local)` row: move the value into
  its one component's CSS as a local custom property on the component root.
- If a row looks wrong (e.g. a text colour mapped to a surface role), **do not guess**: change it to the
  role you believe is right *only if* the token's name and every use site agree, and add a line to
  Appendix A: `corrected in WP2x: <token> <old target> → <new target> because <use sites>`. Otherwise stop
  (§6).
- Visual change expected: small, broad. That is the intent. Review asks "does it still look like the
  original product?" (§4 step 6), not "is it identical?".

### WP3 — Raw values → tokens in component CSS

Four PRs by directory: 3a `components/`, 3b `features/interpreter/`, 3c other `features/*`, 3d `pages/` and
`lib/`.

- `font-size`: map to the 8-step scale using `foundations.md` §2.2 buckets (9–11.5 px → `xs`, …).
- `font-weight`: 300 stays light; 400–500 → regular; 560–900 → bold. (Only these three render anyway.)
- `border-radius`: `foundations.md` §2.3 buckets; per-corner radii use the same steps per corner.
- `box-shadow`: blur ≤ 12 → raised, 13–40 → overlay, > 40 → modal; `0 0 0 Npx …` rings → `outline:
  2px solid var(--mh-focus-ring); outline-offset: 2px` on `:focus-visible`.
- raw `rgba()` / hex: map to a role or a `color-mix()` of one.
- Monospace for formulas/code stays (`--mh-font-mono`).
- In 3a, first extend `css-budget.test.js` with budgets for distinct raw font-size, font-weight, radius,
  box-shadow and rgba values outside `tokens.css`, set to the current counts; each later sub-PR lowers
  them. After 3d they must be 0 (except `inherit`, `0`, `50%`, `999px`).
- Spacing is **not** in scope for WP3 (too many values to move safely at once). New code uses the space
  scale.

### WP4 — `lib/governance.js`

- Create `src/design/lib/governance.js` exporting:
  - `availabilityOf(record) → "enabled" | "disabled"` (all five spellings, `domain-model.md` §3.1; drafts
    are disabled);
  - `governedActions(record, { currentUser }) → Array<{ action: "edit"|"delete"|"disable", blocked:
    boolean, reason: null|"permission"|"disable-first"|"already-disabled" }>` (pattern B6);
  - `governanceMessages` — default copy for the three reasons and the dialogs (B7, B11), overridable via
    content.
- Tests: `lib/governance.test.js`, the full 24-row truth table (creator yes/no × enabled/disabled/draft ×
  3 actions, where draft implies disabled — assert the draft rows explicitly), plus each spelling in
  `availabilityOf`.
- `demo/knowledge-actions.js` becomes a thin adapter that calls `lib/governance.js` (do not change its
  outputs in WP4 — the views still consume the old shape until WP7). `boundaries.test.js` must still pass
  (lib must not import demo).

### WP5 — Extend `Button` and `DataTable`

- `Button`: optional `href`. With `href` it renders `<a href>` with identical classes; `onClick` still
  fires with `{ label }`; no `preventDefault`. Story: "As link". `disabled` with `href` renders
  `aria-disabled` and no `href`.
- `DataTable`: optional `onOpen({ id })` (row click, Enter, Space; the row gets `tabIndex=0` and
  `role="button"`-equivalent semantics without breaking table semantics — use a row-header link/button
  cell if needed, and document which), optional `emptyState` node, a 760 px breakpoint that stacks each row
  as a labelled block (header text becomes the label). Campaign's usage and its stories must not change.
- Stories for each new prop; Controls for all.

### WP6 — Pattern components

Build exactly the components `patterns/library.md` §2 marks **new**: `LibraryToolbar`, `LibraryList`,
`LibraryItem`, `ItemActions`, `LibraryEmpty`, in `src/design/components/<Name>/`.

- Props follow AGENTS §3.1 (content/state props, children, named-object callbacks, exported enum
  constants for `layout` etc.). No page names, no `variant="business-term"` style variants — variation is
  by content and by the §5 configuration (e.g. `manage`, `layout`).
- `ItemActions` consumes `governedActions` output; it never computes permissions itself. It does **not**
  open dialogs: it calls `onAction({ action, id, blocked, reason })`; the caller (demo hook) decides which
  `ConfirmDialog` to show. One story per state in pattern §4.
- `LibraryToolbar` renders the count (B3). It takes `search`, `facets`, `count`, `create` and optional
  `tabs` as props or slots — choose props for data, slots only for nodes callers really vary.
- Visuals: pattern §6, tokens only. No raw values (the WP3 budget applies).
- Stories: title `Organisms/Library/<Name>`, autodocs, every state in pattern §4. Tests: one render test
  each; `ItemActions` asserts `aria-disabled` + click-through for blocked actions.
- Export from `src/design/index.js`. Do not use them in any page yet.

### WP7 — Migrate views (one PR each)

| sub | view(s) | notes |
|---|---|---|
| 7a | Business Terms | **pilot**. After the PR, stop; a reviewer checks it against §4 before 7b starts |
| 7b | Analytical Models, Metric Dictionary, Email Reports (table views of `FieldLibraryView`) | |
| 7c | Report Context (card view of `FieldLibraryView`) + delete `FieldLibraryView` if now empty | |
| 7d | Scenario Reports | D16 |
| 7e | Principles + Data Model domain cards | Data Model browser untouched |
| 7f | Review Center | D01, D02, B14, A5 |
| 7g | Feedback & Quality | |
| 7h | Skill Library + Skill Detail + inline form + Scenario Edit form | D09, D10, D11, D13, D14 |
| 7i | Personal Memory (list column, delete confirm, toast, D12) | split workspace stays |

For every migration:

1. **Inventory first.** Before changing code, add the view's section to `dispositions.md`: every
   behaviour the original view has (read its `assets/js` and `assets/pages` file, cite lines) and every
   prop/callback/story the current React view has. One disposition each. Seeds that apply are referenced
   by D-number, not repeated.
2. If any row is **Ask**: commit only the inventory, open the PR as draft, report the Ask (§6), stop.
3. Rebuild the view by composing pattern components with the §5 configuration. The view's own code keeps
   only what §5 marks **keep** (e.g. Business Term synonym chips, Report Context description dialog).
4. Move view state to its `useXxxDemo` hook where it is not already there; the hook uses
   `lib/governance.js`.
5. Delete what became unused: old view CSS, private helpers, `KnowledgeActions` (in the PR where its last
   consumer goes), tokens whose last reference went (leave deletion of shared ones to WP8), props,
   stories.
6. Page stories: keep at most 6 (pattern §4). Every removed story id is listed in the PR and in handover
   §5 log, with the pattern story that now shows that state.
7. Scenarios (`scripts/visual-check/scenarios/pNN.mjs`): update story-side selectors to the new markup.
   The original side is not edited unless its assertion was about a defect we now fix; then the original
   side asserts the control exists and the story side asserts the correct result (AGENTS §3.5). Delete
   scenarios that only asserted a dropped stub; list them.
8. Record before/after counts (§5 report).

### WP8 — Close out

- Delete legacy tokens with zero references; lower `maxTokenDefinitions` to the new count; shrink
  `legacyPrefixExemptions` to what is still used (target: empty).
- Update `occam-baseline.md` with a "Phase 2 result" column.
- Rewrite AGENTS §2.4 facts that changed (tokens, components, KnowledgeActions, list views) — rewrite, do
  not append.

### Out of scope for Phase 2 (do not touch; propose as Phase 3 in your report if relevant)

Assistant wiring de-duplication; page prop reduction outside the migrated views; Cockpit / Self-Service /
Campaign / Home / Media Tracking / Data Upload / Knowledge Create / Knowledge View / Metric Dictionary
detail pages; spacing normalization; `demo/` size reduction beyond deleting what migrations orphan;
`index.html` and `assets/**` (never edited).

## 2. Regulations

**MUST**

- M1. One work package per branch/PR, branched from the latest `main`
  (`git fetch && git switch -c di/<wp>-<slug> origin/main`), in its own worktree
  (`git worktree add ../mh-<wp> -b di/<wp>-<slug> origin/main`), with its own `npm ci`.
- M2. Use only tokens from `foundations.md` §3 in new or edited CSS.
- M3. Cite the source (`file:line`) for every behaviour you implement, change or remove, in
  `dispositions.md` or the PR.
- M4. Keep every `Intent` behaviour reachable. Removing a *working* capability is never a disposition.
- M5. Run the full gate (§3) before opening the PR and paste the summary lines into the PR.
- M6. Update `handover/README.md` in the same PR: §2.1 row status, §3 intentional differences if any
  visible difference is not already covered by `foundations.md`/`dispositions.md`, §5 log line.
- M7. End commits with `Co-Authored-By: <your model name> <noreply@anthropic.com>` (or your vendor's
  equivalent) and PR bodies with the attribution line required by the repo.
- M8. Keep the PR small enough to review: if a diff exceeds ~1,500 changed lines excluding deletions and
  generated files, split along the sub-items above and say so.

**MUST NOT**

- N1. Do not make design decisions not written in the design-intent documents: no new tokens, variants,
  props, states, copy, or colours beyond them. If you need one, stop (§6).
- N2. Do not edit `index.html`, `assets/**`, `handover/design-intent/{foundations,domain-model}.md`
  (except Appendix A corrections in WP2), or `patterns/library.md`. The last three change only with the
  user.
- N3. Do not reproduce a defect or stub "for fidelity". Do not add props, variants or branches whose only
  reason is that the original did it.
- N4. Do not use raw `<button>`, `<select>`, `<input type="search">` where `Button`, `Select`,
  `SearchField`, `CheckboxFilter` fit.
- N5. Do not add a component to `components/` with fewer than two real consumers (the five pattern
  components are pre-approved).
- N6. Do not weaken, skip or delete a test or scenario to make the gate pass. A deleted scenario must be
  one that asserted a dropped stub, listed in the PR.
- N7. Do not push to `main`, merge your own PR, force-push shared branches, delete remote branches, or
  run `npm install` that changes `package-lock.json`.
- N8. Do not touch another work package's files, and do not "tidy up" unrelated code.
- N9. Do not claim a manual visual pass. You produce screenshots and a note; the verdict is the
  reviewer's.

## 3. Gate (run in this order; all must pass)

```sh
npm ci                                        # once per worktree
npm run lint                                  # 0 errors, 0 warnings
npm test                                      # all files pass
npm run build-storybook                       # writes the stamp visual-check needs
npm run build:host && node scripts/host-check.mjs --out /tmp/mh-<wp>-host
node scripts/visual-check.mjs --out /tmp/mh-<wp>-visual            # or --only pNN for a quick loop, but the PR needs the full run
node scripts/visual-check.mjs --negative --out /tmp/mh-<wp>-neg   # every negative must fail as expected
npm run build:lib                             # needs the locked typescript (npm ci)
(cd storybook-static && python3 -m http.server 6007) &  node scripts/font-probe.mjs http://127.0.0.1:6007
```

Font probe: only the known intentional monospace lines may appear (formulas/code). Any new line is a
failure.

Story count: `storybook-static/index.json` may drop only by story ids you list as removed under §1 WP7
step 6.

## 4. Per-PR checklist (copy into the PR body and tick)

Before coding
- [ ] Read §0 list; noted the D-/A-/R-/B- rules that apply to this package
- [ ] Branch + worktree from latest `origin/main`; `npm ci` done
- [ ] (WP7) Inventory section added to `dispositions.md`; no **Ask** rows (else stop)

While coding
- [ ] Only foundation tokens used; no raw colours/sizes/radii/shadows added
- [ ] No new props/variants/states beyond the design-intent documents
- [ ] Blocked actions: `aria-disabled`, clickable, reason dialog (B7) — if the package touches actions
- [ ] Every control changes something (B4); no stub kept
- [ ] Removed code, CSS, stories and scenarios made unused by this change

Before the PR
- [ ] Full gate (§3) passes; summary lines pasted below
- [ ] Screenshots of every affected story at 1440 px and 390 px, next to the original page at 1440 px,
      saved under `/tmp/mh-<wp>-shots/` with an index; one line per view: "recognisably the original? —
      regions/copy/badges/accent same; differences: …"
- [ ] Concept counts before → after (§5 table)
- [ ] `handover/README.md` §2.1, (§3), §5 updated; `dispositions.md` updated
- [ ] Removed story ids and scenario ids listed with where the state is now shown

## 5. PR report template

```markdown
## <WP id> — <title>

### What changed
- components added / changed / removed: …
- dispositions applied: D01, D03, <view>-04 … (link to dispositions.md section)

### Concept counts (occam-baseline.md)
| concept | before | after |
|---|---:|---:|
| tokens | | |
| raw font-size / weight / radius / shadow / rgba values | | |
| implementations of the library pattern | | |
| props on the migrated view(s) | | |
| stories on affected pages | | |
| stub callbacks | | |

### Removed
- stories: `<id>` → state now in `<id>`
- scenarios: `<id>` (asserted stub Dxx)
- props / callbacks / tokens: …

### Gate
lint … · test … · storybook … stories / … docs · host …/… · visual …/… · negative …/… · build:lib ok · font-probe: no new lines

### Visual note (reviewer to verdict)
<view>: recognisably the original? … differences: … screenshots: /tmp/mh-<wp>-shots/index.html

### Open questions
none | <what, why, both readings>
```

## 6. Stop and ask — do not proceed when

- a behaviour fits no disposition rule, or fits two (→ **Ask** row, draft PR, report);
- `patterns/library.md` §5 does not say whether a variation is keep or drop;
- a needed token, prop, variant, state or string is not in the design-intent documents;
- an Appendix A row is wrong and the use sites disagree with each other;
- a gate fails for a reason you cannot trace to your change (e.g. a flaky or pre-existing failure) —
  report the exact output; do not retry more than twice, do not disable the check;
- your change would alter a page outside your package;
- the diff grows past M8.

How to ask: stop work, leave the branch pushed with a draft PR (if you have permission) or the local
branch, and report: the question, the evidence (file:line), the readings you see, which one you would pick
and why. Then wait.

## 7. Reviewer checklist (for the person or stronger model reviewing each PR)

- [ ] Scope is exactly one work package; nothing from §1 "out of scope"
- [ ] Every disposition row has evidence; Intent/Fix rows cite the intent source
- [ ] No design decision was invented (compare new tokens/props/variants/copy against the documents)
- [ ] Blocked-action, confirm and toast behaviour match B6–B8 (if touched)
- [ ] Removed stories/scenarios each map to a stub or to a pattern story that shows the state
- [ ] Gate output is from the PR's head commit (stamp hashes match) and complete
- [ ] Screenshots: recognisably the original, uses the foundation, nothing broken at 390 px — record the
      verdict with `node scripts/visual-check.mjs --review <out> <scenarioId> pass|fail "note"` where
      applicable
- [ ] Concept counts went down (or the PR explains why not)
- [ ] 7a only: the pattern API is good enough for the other ten views; if not, fix the pattern before 7b

## 8. Kickoff prompt (paste to the implementing agent, fill `<WP>`)

```text
You are implementing Phase 2 work package <WP> of the Marketing Hub design-intent project.
Repository: <path>. Read, in order: AGENTS.md; handover/design-intent/phase2-guide.md (your rules — it
overrides AGENTS where they conflict); then the documents its §0 lists. Do only work package <WP> as
described in phase2-guide.md §1. Follow §2 MUST/MUST NOT, run the §3 gate, fill the §4 checklist and the
§5 report. If anything in §6 happens, stop and report instead of guessing. Do not merge, push to main,
or delete branches. When done, report the branch name, the PR body (the §5 template, filled), and any
open questions.
```
