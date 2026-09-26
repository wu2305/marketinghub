# Pattern: Governed library

Status: **spec for Phase 2** (2026-09-27). Written by the Phase 1 author so that implementers do not have
to make design decisions. If something here is ambiguous, stop and ask (`phase2-guide.md` §6) — do not
invent.

Depends on: `../foundations.md` (tokens), `../domain-model.md` (rules R1–R8, decisions A1–A5).

## 1. What it is

A **governed library** is a page region that lets a person find items in a collection they share with
others, look at one, and — if they own it — change its availability or remove it. Twelve views in the
product are this one idea:

| # | view | today | items | layout |
|---|---|---|---|---|
| 1 | Business Terms | `features/interpreter/BusinessTermView` | knowledge | cards |
| 2 | Report Context | `features/interpreter/FieldLibraryView` (type) | knowledge | cards |
| 3 | Metric Dictionary | same | knowledge | table |
| 4 | Analytical Models | same | knowledge | table |
| 5 | Email Reports | same | knowledge | table |
| 6 | Scenario Reports | `features/interpreter/ScenarioReportsView` | knowledge | table |
| 7 | Principles | `features/interpreter/PrinciplesView` | knowledge | cards |
| 8 | Data Models (domain list only) | `features/interpreter/DataModelView` | knowledge | cards |
| 9 | Review Center queue | `features/review-center/ReviewQueue` + `pages/ReviewCenterPage` | review items | table |
| 10 | Feedback & Quality | `features/feedback-quality/FeedbackList` + page | feedback | table |
| 11 | Skill Library | `features/scenario-library/SkillLibrary` | skills | table |
| 12 | Personal Memory list | `features/personal-memory/MemoryWorkspace` (left column) | memories | cards |

"Layout" is today's layout; §5 says which differences are purposeful.

## 2. Anatomy

```
┌ LibraryToolbar ─────────────────────────────────────────────────────────────┐
│ [SearchField]  [facet] [facet] …          {count}            [Create ▸]     │
│ (optional) Tabs: Pending 6 · Approved 21 · Rejected 3                        │
└──────────────────────────────────────────────────────────────────────────────┘
┌ LibraryList (cards | table) ────────────────────────────────────────────────┐
│ LibraryItem × n                                                              │
│   title  [Draft]                         [StatusBadge]  [ItemActions ⋯]     │
│   description (2-line clamp)                                                 │
│   meta: label value · label value · chips (+N)                               │
└──────────────────────────────────────────────────────────────────────────────┘
  LibraryEmpty      (no results / nothing yet)
  Pagination        (when total > pageSize)
  Detail            (Modal variant="drawer")      ConfirmDialog      Toast
```

| part | component | exists? | notes |
|---|---|---|---|
| toolbar | **`LibraryToolbar`** (new, `components/`) | no | composition slot for SearchField + facets + count + create action; optional `Tabs` row above the list |
| search | `SearchField` | yes | the only search input. Raw `<input>` search boxes are removed |
| facet (multi) | `CheckboxFilter` | yes | for multi-select facets (status, domain, creator, category) |
| facet (single) | `Select` | yes | for single-choice facets (type, time) |
| count | part of `LibraryToolbar` | — | always visible: "{shown} of {total} {unit}" or "{n} items" (R7) |
| create | `Button` variant primary | yes, **needs `href`** | only when the collection allows creation. Creation navigates, so `Button` gains an optional `href` that renders `<a href>` with the same styling (AGENTS §3.1: navigation is a link) |
| list | **`LibraryList`** (new) | no | one component, `layout: "cards" \| "table"`. `cards` renders a `<ul>` grid of `LibraryItem` (1 column below 760 px); `table` renders `DataTable` with the caller's `columns`. Both render `LibraryEmpty` when there are no items and call `onOpen({ id })`. Views never render `DataTable` or the grid directly |
| list, table | `DataTable` | yes, **needs extension** | today it only takes `columns`, `rows`, `caption` (1 consumer: Campaign). Add: `onOpen({id})` for row activation (click/Enter/Space on the row, B5), `emptyState` slot, and a 760 px breakpoint where each row stacks as a labelled card. Campaign keeps working unchanged |
| item (card) | **`LibraryItem`** (new) | no | props: `title`, `draft`, `description`, `meta` (`[{ label, value }]`), `status` (StatusBadge props), `actions` (ItemActions props). `children` is the one slot for view-specific content marked **keep** in §5 (e.g. synonym chips). Whole card opens detail |
| status | `StatusBadge` | yes | availability uses tone success/neutral; workflow uses the badge's workflow tones |
| actions | **`ItemActions`** (new, replaces `features/interpreter/KnowledgeActions`) | partly | icon buttons; gating comes from `lib/governance.js`, never computed in the view |
| empty | **`LibraryEmpty`** (new) | no | two messages: "no matches" (with a clear-filters action) vs "nothing here yet" |
| paging | `Pagination` | yes | pass `pageSizes={[5, 10, 20]}` (component default is 10/20/50) |
| detail | `Modal variant="drawer"` | yes | content is per view (§5); the drawer header repeats status and actions |
| confirm | `ConfirmDialog` | yes | purposes: `warning` (disable), `danger` (delete), `info` (explain a block) |
| feedback | `Toast` | yes (1 consumer today) | success after disable/delete/approve/reject/save (R6) |

New components go straight to `components/`: each has ≥ 4 consumers from day one, so "promote on second use"
is satisfied.

## 3. Behaviour rules

Numbers refer to `../domain-model.md`.

B1. **Search** filters over the fields each view declares (§5 column "search"), case-insensitive, substring.
    It resets `page` to 1.
B2. **Facets** combine with AND across facets, OR within one multi-select facet. Empty selection = all.
    Changing a facet resets `page` to 1.
B3. **Count** always reflects the filtered total, never the page size (R7).
B4. **Every control changes the result or is not rendered.** A filter that filters nothing is a defect
    (Review Center *Submitted* → implement it the way Feedback does, R7).
B5. **Open**: activating an item (click, Enter, Space) opens its detail. Action buttons inside the item do
    not open it (stop propagation).
B6. **Governed actions** (edit, delete, disable) are shown only when the view's capability `manage` is on
    (§5). Their state comes from `governedActions(record, { currentUser })` in `lib/governance.js`:
    - not creator → blocked, reason `permission` (R1);
    - edit/delete while enabled → blocked, reason `disable-first` (R2);
    - disable while disabled or draft → blocked, reason `already-disabled` (R2, R3).
    Report Context's description edit is **not** governed: the source lets anyone edit it at any time
    (`field-library.js:676–679`; the owner/offline checks at `:648–668` apply to Analytical Model only). It
    stays an ungated single action in the drawer (A2 default = current behaviour). Personal Memory items are
    always the viewer's own and have no availability: edit and delete are never blocked
    (`governance/memory.js:279–283`), so Memory does not call `governedActions`.
B7. **Blocked actions stay focusable and clickable** (`aria-disabled="true"`, never native `disabled`)
    — decision A3. Clicking one opens `ConfirmDialog`:
    - `permission` → purpose `info`, one "OK" button;
    - `disable-first` → purpose `warning`, "Disable" confirms and disables, then the original action
      continues (edit navigates; delete asks its own confirmation);
    - `already-disabled` → purpose `info`.
    Tooltip (`title`) carries the same one-line reason.
B8. **Destructive and availability changes confirm first**, then show a success `Toast` (R6): "Disabled
    successfully", "Deleted successfully".
B9. **Drafts** show a "Draft" marker next to the title, are visible only to their creator, and count as
    disabled (R3).
B10. **Availability vocabulary** is `enabled | disabled`, labelled "Enabled"/"Disabled" everywhere,
     including Report Context (no Open/Close) — §3.1.
B11. **Permission copy** is one sentence everywhere: "Knowledge created by others cannot be operated."
     (R1; `lib/governance.js` owns it, content can override).
B12. **Paging**: page sizes 5 / 10 / 20, default 10. Pagination hidden when total ≤ smallest size.
B13. **Detail drawer** header = title + status + the same `ItemActions` as the list (source keeps them
     aligned: `scenario-reports.js:370`).
B14. **Review items** (view 9): tabs Pending / Approved / **Rejected** (A5). Approve on AI `Pass` is
     immediate; on `Warning`/`Reviewing` opens the risk `ConfirmDialog` (R5). Reject asks for a reason.
     Both end with a Toast. Counts in tabs and stats are computed, never literals.
B15. **Skills** (view 11): status is read-only (A4) — no click-to-advance.
B16. **Submit** anywhere in governed forms moves an item to *Under Review*; only Review Center approval
     publishes (A1). (Forms are outside this pattern; listed so list states stay consistent.)

## 4. Required states (story + test per state, on the pattern — not per page)

Stories live on the pattern components (`Organisms/Library/*`). A page keeps **at most 6** stories:
default, one filtered, one empty, one drawer open, one dialog, narrow. Everything else is a pattern story.

| state | where the story lives |
|---|---|
| default (cards / table) | `LibraryList` |
| search with results · no results · nothing yet | `LibraryToolbar` + `LibraryEmpty` |
| facet selected · multiple facets | `LibraryToolbar` |
| paged (page 2) · page size change | `Pagination` (existing) |
| item: enabled · disabled · draft · other creator | `LibraryItem` |
| actions: allowed · blocked ×3 reasons | `ItemActions` |
| blocked-action dialog ×3 · confirm disable · confirm delete · success toast | `ItemActions` + `ConfirmDialog` stories |
| detail drawer | page story (content is per view) |
| narrow (390 px) | `LibraryList` both layouts |

Unit tests (vitest): `lib/governance.js` truth table (creator × availability × draft × action = 24 rows),
filter/count function, and one render test per new component.

## 5. Per-view configuration: purposeful variation vs accident

**Keep** = purposeful, becomes a prop/config. **Drop** = accident, normalised by the pattern.

| view | layout | search over | facets | manage (B6) | create | status shown | detail content | keep (purpose) | drop (accident) |
|---|---|---|---|---|---|---|---|---|---|
| Business Terms | cards | title, description, synonyms | status (incl. Draft), domain, creator | yes | yes → create page | availability | definition, synonyms table, scope | synonym chips (content-specific meta) | warm-grey palette; rAF "…" synonym clamp → CSS clamp + "+N" chip; `aria-disabled`-only variant |
| Report Context | cards | report name, description | project, status, AI summary | edit description only | no | availability | description (editable), project, AI switches | description edit dialog (only editable field) | Open/Close label; hidden count line |
| Metric Dictionary | table | name, definition, keywords | domain, type, status | no (A2 default) | no | availability | definition, formula, references | formula as monospace | hover-title-only definitions → visible 2-line clamp |
| Analytical Models | table | name, scenarios | status (incl. Draft), creator | yes | yes | availability | steps, constraints | — | native-`disabled` variant; dead "disable first" dialog |
| Email Reports | table | name, related report | status, recipients | no (A2 default) | no | availability | recipients, schedule | recipient chips | `paused` class name for Disabled |
| Scenario Reports | table | title, description | workflow, availability, creator | yes | yes | availability + workflow | outline, linked reports | two axes shown together | filter vocabulary (In Development/Live) → Building/Published |
| Principles | cards | category, title, description | category | no (A2 default) | no | — | none (expand in place) | expand/collapse long description | — |
| Data Models (domains) | cards | domain name | — | no | no | availability | opens Data Model browser | — | — |
| Review Center | table + tabs | title, summary, submitter | type, submitted (time) | review actions instead (B14) | no | workflow + AI check | review detail, AI suggestions | approve/reject; risk dialog | literal Rejected count; no-op time filter; Rejected items vanish |
| Feedback & Quality | table + tabs | question, answer, person | type, time | no | no | feedback type | question/answer detail | thumbs up/down tabs | — |
| Skill Library | table | name, description | status | no | yes → edit page | workflow (read-only) | Skill detail drawer | — | click-to-advance status (A4) |
| Personal Memory | cards (list + detail split) | title, description | category tabs | own items: edit, delete (no availability) | yes | — | inline detail/editor | split layout (personal workspace, not a shared library) | — |

Personal Memory keeps its split workspace; only its list column, empty state, delete confirm and toast use
the pattern parts. Data Model uses only `LibraryItem` for its domain cards; its browser/graph stays as is.

## 6. Visual language (from foundations)

- Page `--mh-surface-page`; list surfaces `--mh-surface` with `--mh-line` border, radius `--mh-radius-md`,
  resting `--mh-shadow-raised`, hover border `--mh-line-strong` + `--mh-shadow-overlay`.
- Selected/active: border `--mh-accent`, background `--mh-accent-wash`.
- Title `--mh-font-size-xl` `--mh-font-weight-bold` `--mh-text-strong`; description `--mh-font-size-md` `--mh-text`; meta
  `--mh-font-size-sm` `--mh-text-muted`; labels/eyebrows `--mh-font-size-xs` uppercase `--mh-text-faint`.
- Draft marker: `StatusBadge` workflow tone, size small, superscript position as in the original.
- Danger action icon `--mh-danger`; others `--mh-text-muted`, hover `--mh-text-strong`.
- Focus: `--mh-focus-ring` everywhere.

"Recognisably the original" check per view: same regions in the same order, same copy, same kinds of chips
and badges, gold accent where the original uses gold. Exact spacing, greys and font sizes may differ.
