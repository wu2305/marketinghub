# Dispositions — what happens to each original behaviour

Status: **seeded 2026-09-27**; each Phase 2 migration PR appends the rows for the view it migrates.

Every behaviour of a migrated view gets exactly one disposition. Decision rules (apply in order, stop at
the first that fits):

| disposition | use when | what the React code does |
|---|---|---|
| **Intent** | the source behaves as designed, *or* a control is visibly designed (copy, icon, placement) but unwired **and** `domain-model.md` or a sibling page shows what it should do | implement the intended behaviour; AI/back-end effects are simulated deterministically in `demo/` |
| **Normalize** | the same concept is done differently in different places | implement it once, the pattern's way (`patterns/library.md`) |
| **Fix** | the source's own code states an intent that it fails to carry out (missing function, value stored but never read, literal where a computed value is obviously meant) | implement what the code states |
| **Drop-stub** | a control has no behaviour and nothing in the product says what it should do | remove the control, its props, callbacks, stories and scenarios |
| **Ask** | two readings are both plausible and choosing changes what users can do | do **not** implement either; add the row with both readings and stop that item (guide §6) |

Evidence is mandatory: original `file:line` for the behaviour, and for Intent/Fix the line or document that
shows the intent. "It seemed obvious" is not evidence.

## Seeds (decided)

D-numbers are cited from PR descriptions. A1–A5 are the user decisions in `domain-model.md` §7.

| # | view / component | original behaviour | evidence | disposition | React behaviour |
|---|---|---|---|---|---|
| D01 | Review Center filters | *Submitted* select stores a value, filters nothing | `governance/review.js:78–83,95–104` | **Fix** | filters by submission age exactly like Feedback (`governance/feedback.js:101–107`); scenario `p12-time-noop` becomes `p12-time` asserting a changed count |
| D02 | Review Center stats | Rejected count is literal `3`; rejected items leave every tab | `review.js:46,95–96` | **Fix** + A5 | Rejected tab lists rejected items; all counts computed |
| D03 | Business Term / Field Library / Scenario Reports | success toast called, never defined | `field-library.js:618`, `business-term-library.js:155`, `scenario-reports.js:214` | **Fix** | `Toast` "Disabled successfully" / "Deleted successfully" after confirm |
| D04 | Knowledge row actions | blocked buttons: native `disabled` in AM/Scenario, `aria-disabled` in BT; "disable first" dialog unreachable in AM | `field-library.js:106,657–668`, `business-term-library.js:124` | **Normalize** + A3 | one `ItemActions`; blocked = `aria-disabled`, click explains/offers the fix (pattern B7). `KnowledgeActions` and its 3 variants are deleted |
| D05 | Permission copy | two wordings | `field-library.js:104`, `business-term-library.js:116` | **Normalize** | "Knowledge created by others cannot be operated." |
| D06 | Availability label | Enable/Disable, Open/Close, booleans, lowercase | `domain-model.md` §3.1 | **Normalize** | `enabled`/`disabled`, labelled Enabled/Disabled |
| D07 | Business Term synonym chips | JS measures chips each frame and hides overflow behind "…" | `business-term-library.js:282–307` | **Normalize** | CSS-only: show chips that fit in one line via `flex-wrap` + `max-height` + `overflow:hidden`, plus a "+N" chip computed from data (first 3 shown, rest counted). No rAF, no layout measuring |
| D08 | Field Library type pages | count line rendered but `hidden` | `src/design/features/interpreter/FieldLibraryView/index.jsx:471–474` | **Normalize** (R7) | count visible in `LibraryToolbar` on every library |
| D09 | Skill Library status | click advances Under Review → In Development → Published | `governance/skills.js:145–166` | **Drop-stub** (A4) | status read-only; `onAdvance` prop, stories and scenarios removed |
| D10 | Skill Detail drawer | Delete button, no handler | `SkillDetail/index.jsx:18` ("Visible source no-op"); no handler in `governance/skill-detail.js` | **Intent** | same as every governed delete (R6): confirm (`danger`) → remove from list → Toast. Simulated in `useSkillLibraryDemo` |
| D11 | Skill inline form / Scenario Edit | "AI Auto-fill" buttons (5 + 2), no handler | `scenario-library.html:331–438`, `scenario-edit.html:285,312`; `ScenarioEditForm/index.jsx:28` | **Intent** | fills the field with deterministic demo text from `content.js` (the product simulates all AI output the same way, AGENTS §1). One `onAutoFill({field})` callback; demo hook supplies the text |
| D12 | Personal Memory create | "AI Auto-fill" button, CSS only, no JS | `personal-memory.html:297`, `governance/memory.css:1294` (no JS reference) | **Intent** | same as D11 |
| D13 | Skill inline form | "Run Preview", no handler | `scenario-library.html:451–465` | **Intent** | reuse Scenario Edit's preview behaviour (`governance/skill-editor.js:61–71`, React `ScenarioEditForm onRunPreview`) |
| D14 | Skill inline form / Scenario Edit | "Save Draft", no handler | `scenario-library.html:495`, `scenario-edit.html:414` | **Intent** (R4) | saves as Draft + Disabled, Toast "Draft saved" |
| D15 | Governed forms Submit | Analytical Model submit publishes directly | `analytical-model-form.js:291` vs `editor-runtime.js:188` | **Normalize** + A1 | Submit → Under Review; Toast "Submitted for review" |
| D16 | Scenario Reports workflow filter | options Queued / In Development / Live vs data Draft/Queued/Building/Published | `types.js:515–521`, `scenario-reports.js:78–80` | **Normalize** | filter options = data values |
| D17 | Business Term / Principles / checkbox filter | warm-grey ink ramp | `foundations.md` §2.1 item 3 | **Normalize** (D4) | cool slate role tokens |

## Per-view rows (append below, one section per migration PR)

Template — copy, fill every column, keep one row per behaviour:

```markdown
### <view> — PR #<n>

| # | behaviour | evidence (source file:line) | disposition | React behaviour | story / scenario change |
|---|---|---|---|---|---|
| <view-code>-01 | … | … | Intent/Normalize/Fix/Drop-stub/Ask | … | added / changed / removed: <id> |
```

### Business Terms — WP7a

Source: `assets/js/knowledge/business-term-library.js`; React before: `features/interpreter/BusinessTermView`, `demo/business-term-demo.js`.

| # | behaviour | evidence (source file:line) | disposition | React behaviour | story / scenario change |
|---|---|---|---|---|---|
| BT-01 | search over title, description, synonyms, scope, creator | `business-term-library.js:320-335` | Intent | `LibraryToolbar` search, same fields; resets page (B1) | scenario `p07-business-term-search` selectors updated |
| BT-02 | Status and Creator multi-select facets, "N selected" summary, disclosure stays open | `:309-318,345-356` | Intent | `LibraryToolbar` multi facets (CheckboxFilter) | `p07-business-term-status-empty`, `-creator-filter` selectors updated |
| BT-03 | status facet offers Enabled/Disabled only; the filter code also accepts "Draft" but no option offers it | `:320-325,349-350` | Normalize | options Enabled/Disabled; a draft counts as Disabled (R3), so "Disabled" includes drafts | — |
| BT-04 | draft visibility checked on the raw draft before its stage is derived, so another user's stage-less draft is shown | `:85-89` | Fix (R3) | normalise first, then hide every draft not created by the viewer | test "hides every other user's draft" |
| BT-05 | a draft stored as Enable: edit blocked "disable first", disable blocked "already disabled" — a dead end | `:108-123` | Fix (R3) | drafts are disabled: edit/delete allowed, disable explains it is already disabled | test "marks blocked actions" |
| BT-06 | card: title + Draft superscript, description, creator, synonyms, status pill, three icon actions; card opens drawer | `:127-150` | Intent + Normalize | `LibraryItem` (title button, draft marker, 2-line description, creator meta, status, `ItemActions`) | — |
| BT-07 | synonym chips clamped by measuring layout every frame, "…" marker (D07) | `:282-307` | Normalize | three chips, the rest in a "+N" chip, no layout measuring | six `…` assertions in `p07-interpreter-business-term` → chip assertions; `-narrow` asserts 14 chips |
| BT-08 | data-model scope tags rendered on cards but hidden by CSS | `:103-105`; `ai-interpreter-overview.css` | Drop-stub | scope shown only in the drawer, where it is visible in the source | — |
| BT-09 | count line rendered but hidden (D08) | `ai-interpreter-overview.css` `fm-overview-countline` | Normalize (R7) | visible toolbar count "Showing X of Y terms" | `p07-interpreter-business-term` asserts it |
| BT-10 | Add Business Term opens the create page in a new tab (`target="_blank"`) | `:358` | Normalize | an ordinary link to the same page (`Button href`); the host navigates in place through `onCreate`, and a modifier-click still opens a new tab | selector updated |
| BT-11 | permission denied: info dialog "You do not have permission to {action} knowledge created by another user." | `:199-205` | Normalize (D05) | info dialog, "Knowledge created by others cannot be operated." | `p07-business-term-permission` story text updated |
| BT-12 | edit/delete on an enabled term: "Please take the knowledge offline first" → "Go Offline" disables and stops | `:207-217,166` | Intent (A3, B7) | same dialog; after going offline the requested edit/delete continues | new story `OfflineFirst`; tests |
| BT-13 | disable: "Confirm Operation / Please confirm whether to offline this knowledge." → Confirm Offline | `:237-246,166` | Intent | warning dialog, same copy | `.mh-confirm--confirm` → `--warning` in scenarios and host check |
| BT-14 | delete: confirm "Deletion cannot be undone", removes the term, closes its drawer | `:223-231` | Intent | same | tests |
| BT-15 | success feedback called but undefined (D03) | `:155` | Fix | Toast "Disabled successfully" / "Deleted successfully", 3 s | tests |
| BT-16 | disabling a disabled term: info "This knowledge is already disabled." | `:233-235` | Intent | info dialog | tests |
| BT-17 | compact pagination, 5/10/20 per page, clamps after delete | `:337-339` | Intent | `Pagination` compact | `p07-business-term-pagination` selectors updated |
| BT-18 | detail drawer: eyebrow, title, status, term type, description, synonyms, data model, creator, footer actions | `:188-197` | Intent (B13) | `Modal` drawer, `StatusBadge` + `ItemActions` footer | geometry pairs on drawer internals dropped |
| BT-19 | warm-grey palette (D17), variant `KnowledgeActions business-term` (D04) | `foundations.md` §2.1 | Normalize | foundation tokens; `ItemActions` | view CSS 364 → 82 lines |
| BT-20 | React prop `strings.tooltips.permission(action)` and `dialogs.permissionDenied(action)` functions | content.js | Normalize (D05) | one string per reason (`tooltips.permission`, `"disable-first"`, `"already-disabled"`) | — |
| BT-21 | React `SynonymClamp` component, `ResizeObserver` shim in tests | view `:20-66` | Drop (D07) | removed | — |
| BT-22 | geometry pairs (`layout:`) comparing BT internals with the original | `p07.mjs` | Drop | not a design-intent check; shell pairs kept | 16 pairs removed (list, drawer and dialog internals) |
