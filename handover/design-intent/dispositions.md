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
| BT-11 | permission denied: info dialog "You do not have permission to {action} knowledge created by another user." | `:208-214` | Normalize (D05) | info dialog, "Knowledge created by others cannot be operated." | `p07-business-term-permission` story text updated |
| BT-12 | edit/delete on an enabled term opens the confirm dialog. The source wrote dedicated copy for this case ("Please take the knowledge offline first" / "Go Offline", `:166`) but selects it with `/offline first/i` (`:159`) while its caller passes "Disable knowledge first" (`:217`), so the original actually shows "Confirm Operation / Please confirm whether to offline this knowledge. / Confirm Offline". Field Library has the same mismatch (`field-library.js:622,663`); Scenario Reports matches its own title (`scenario-reports.js:218,1021`) and shows "Please disable the knowledge first / Disable" | `:159,166,217` | Fix (A3, B7) — the code states the dedicated copy and fails to select it; Scenario Reports shows the working version (corrected 2026-09-29: previously cited as the original's visible behaviour) | same dialog; after going offline the requested edit/delete continues | new story `OfflineFirst`; tests |
| BT-13 | disable: "Confirm Operation / Please confirm whether to offline this knowledge." → Confirm Offline | `:237-246,166` | Intent | warning dialog, same copy | `.mh-confirm--confirm` → `--warning` in scenarios and host check |
| BT-14 | delete: confirm "Deletion cannot be undone", removes the term, closes its drawer | `:223-231` | Intent | same | tests |
| BT-15 | success feedback called but undefined (D03) | `:155` | Fix | Toast "Disabled successfully" / "Deleted successfully", 3 s | tests |
| BT-16 | disabling a disabled term: info "This knowledge is already disabled." | `:233-235` | Intent | info dialog | tests |
| BT-17 | compact pagination, 5/10/20 per page, clamps after delete | `:342-343,358` | Intent | `Pagination` compact | `p07-business-term-pagination` selectors updated |
| BT-18 | detail drawer: eyebrow, title, status, term type, description, synonyms, data model, creator, footer actions | `:188-197` | Intent (B13) | `Modal` drawer, `StatusBadge` + `ItemActions` footer | geometry pairs on drawer internals dropped |
| BT-19 | warm-grey palette (D17), variant `KnowledgeActions business-term` (D04) | `foundations.md` §2.1 | Normalize | foundation tokens; `ItemActions` | view CSS 364 → 82 lines |
| BT-20 | React prop `strings.tooltips.permission(action)` and `dialogs.permissionDenied(action)` functions | content.js | Normalize (D05) | one string per reason (`tooltips.permission`, `"disable-first"`, `"already-disabled"`) | — |
| BT-21 | React `SynonymClamp` component, `ResizeObserver` shim in tests | view `:20-66` | Drop (D07) | removed | — |
| BT-22 | geometry pairs (`layout:`) comparing BT internals with the original | `p07.mjs` | Drop | not a design-intent check; shell pairs kept | 16 pairs removed (list, drawer and dialog internals) |

### Field Library (Report Context, Metric Dictionary, Analytical Model, Email Reports) — WP7b + WP7c

Source: `assets/js/knowledge/field-library.js`, `knowledge-fields.js`. One PR covers 7b and 7c because all four types share one view file (`features/interpreter/FieldLibraryView`).

| # | behaviour | evidence (source file:line) | disposition | React behaviour | story / scenario change |
|---|---|---|---|---|---|
| FL-01 | every type renders cards; a table is built but always hidden | `field-library.js:234-262,320-323` | Drop (dead code) | `LibraryList` cards for all four types | pattern/guide layout corrected |
| FL-02 | per-type facets: RC Project; MD Data Model + Type; AM Status + Data Model + Creator; ER Status + Data Model | `:306-313,320` | Intent | `LibraryToolbar` multi facets, same sets | scenario selectors updated |
| FL-03 | search: substring over the whole record | `:139-150` | Intent | same (hook unchanged) | — |
| FL-04 | count line rendered but hidden (D08) | `:320` `fm-overview-countline` | Normalize (R7) | visible count line between toolbar and list, the place the source reserved | — |
| FL-05 | card fields per type (RC title/status/description/Project; MD definition/Unit/Type/Data model/synonyms; AM description/Data Model/Referenced Metrics/Creator/actions; ER Send time/Recipients/Data Model) | `:110-216` | Intent + Normalize | `LibraryItem` (title, status, description, meta, `ChipList`) | — |
| FL-06 | MD synonyms: first alias if ≤24 chars, then a "…" marker; AM referenced metrics: first + "…" (D07) | `:204-216,190-199` | Normalize | `ChipList`: three values + "+N" with the rest in its accessible name | `…` assertion → `.mh-chip-list__more` |
| FL-07 | ER cards show no availability; disabled ones only carry `is-disabled` | `:172-181` | Normalize (pattern §5) | Enabled/Disabled `StatusBadge` on ER cards | scenario asserts the neutral badge |
| FL-08 | AM stored as Draft + Enable is shown enabled; edit/delete blocked "disable first" | `field-library.js:94-107`, `knowledge-fields.js` normalize | Fix (R3) | drafts are offline: Disabled status, Draft marker, edit/delete allowed, disable explains | `p07-field-library-analytical-model`, `-am-disable`, `-am-delete-blocked` story sides; stories `AnalyticalModelDisabled`, `…DisableConfirm` use a published copy |
| FL-09 | AM blocked buttons natively `disabled`; the "Disable knowledge first" dialog is unreachable (D04) | `:106,657-668` | Normalize (A3) | `ItemActions`: operable, explains; going offline continues the edit/delete | tests |
| FL-10 | AM delete of a referenced model blocked with its references listed | `:702-710` | Intent | info dialog "Deletion blocked" | `-am-delete-blocked` kept |
| FL-11 | success toast called but undefined (D03) | `:618` | Fix | Toast after disable/delete | tests |
| FL-12 | permission message | `:104` | Intent (D05) | "Knowledge created by others cannot be operated." | — |
| FL-13 | RC description edit from the drawer, confirm enabled once changed, history kept | `:409,502-535` (`:511` confirm disabled until changed)`,676-679` | Intent (ungated, pattern B6) | same; buttons are `Button` | `.mh-flview__edit-btn--primary` → `.mh-button--gold` |
| FL-14 | RC drawer footer: Close + Open Dashboard (new tab) | `:456-464` | Intent | `Button` secondary + `Button href` | selector updated |
| FL-15 | MD drawer footer rendered empty; ER footer hidden | `field-library.js:456-460` | Drop | no footer for MD and ER | — |
| FL-16 | Open/Close labels for RC AI status | `:57` | Intent | kept in the drawer body only (they describe two switches, AI interpretation and AI summary); cards use Enabled/Disabled (D06) | — |
| FL-17 | card geometry pairs in scenarios | `p07.mjs` | Drop | view-internal pairs removed; shell pairs kept | 13 pairs removed |
| FL-18 | 54 view-named tokens (`--mh-ink-dialog-*`, `--mh-*-card-*` …) | `tokens.css` | Remove (unused after the rewrite) | deleted | — |

### Scenario Reports — WP7d

Source: `assets/js/knowledge/scenario-reports.js`; React before: `features/interpreter/ScenarioReportsView`, `demo/scenario-demo.js`.

| # | behaviour | evidence (file:line) | disposition | React behaviour | story / scenario change |
|---|---|---|---|---|---|
| SR-01 | normalize report, creator, workflow, availability, guidance and attachments from each scenario record | `scenario-reports.js:84-123` | Intent | `normalizeScenarioRecord` keeps the source fields and derives stable report links and `enabled`/`disabled` availability | normalization test retained |
| SR-02 | search over title, description, report, creator, workflow, guidance and attachments; filters reset the page | `scenario-reports.js:397-429,982-997` | Intent | `useScenarioDemo` applies the same case-insensitive search and Status/Process filters through `LibraryToolbar` | scenario tests cover search/status; visual selectors updated |
| SR-03 | scenario-report cards carry title, description, report, creator, process, availability and actions | `scenario-reports.js:431-500` | Intent + Normalize | `LibraryList` cards preserve both axes and all source fields; view CSS keeps only report-link and drawer rules | `p07-interpreter-scenario` checks library cards and count |
| SR-04 | drafts are hidden from other creators | `scenario-reports.js:405-407` | Intent (R3) | drafts are normalized offline and filtered unless `creator === currentUser` | draft visibility test retained |
| SR-05 | Status filters Enabled/Disabled and Process filters Draft/Queued/Building/Published | `scenario-reports.js:419-449,982-990` | Normalize (D06, D16) | one `enabled`/`disabled` vocabulary and workflow options from `WORKFLOW_STATES` | scenario controls and visual assertions updated |
| SR-06 | result count is rendered in the toolbar and pagination uses 5/10/20 rows | `scenario-reports.js:458-499` | Normalize (D08) | visible `LibraryToolbar` count plus compact `Pagination` | `p07-interpreter-scenario` asserts the visible count |
| SR-07 | edit/delete/disable are gated by creator and availability; blocked controls carry permission or state explanations | `scenario-reports.js:191-210,1005-1031` | Normalize (D04, D05, A3) | `governedActions` + `ItemActions`; blocked actions remain clickable with `aria-disabled` and open guidance | 12 unit tests in `demo/scenario-demo.test.jsx` cover permission and disable-first (p07 has 2 SR visual scenarios) |
| SR-08 | edit navigates to the edit form; delete and disable confirm before mutating records | `scenario-reports.js:1033-1080` | Intent | demo hook owns deterministic navigation, confirmation, deletion/offline mutation and drawer updates | tests retained; table action selectors updated |
| SR-09 | successful delete/offline actions call a toast that the source leaves undefined | `scenario-reports.js:212-215,1053-1079` | Fix (D03) | `Toast` displays "Deleted successfully" or "Disabled successfully" | scenario tests assert both messages |
| SR-10 | opening a scenario shows availability/workflow in the header, related report, description, guidance, files, note and creator/date metadata | `scenario-reports.js:263-305,307-378` | Intent (B13) | `Modal` drawer retains both axes and the source detail sections; `ItemActions` is reused in the footer | `p07-scenario-report-drawer` selectors updated |
| SR-11 | card/action click handling keeps links and action buttons from opening the detail drawer | `scenario-reports.js:998-1017,1084-1089` | Normalize (B5) | `DataTable` opens only the title/row surface; report links and `ItemActions` stop propagation | drawer test opens the title button |
| SR-12 | `KnowledgeActions` variants and the old knowledge action/dialog adapters become unused after migration | `src/design/features/interpreter/KnowledgeActions/index.jsx:5-38`; `src/design/demo/knowledge-dialog.js:9-46` | Drop-stub (D04) | deleted `KnowledgeActions`, `knowledge-actions`, `knowledge-actions.test`, and `knowledge-dialog`; `ItemActions` and `lib/governance.js` are the sole implementation | removed story `features-interpreter-knowledgeactions--default` |
| SR-13 | view-internal drawer geometry pair depended on the original 56px shell offset and custom header height | `scripts/visual-check/scenarios/p07.mjs` (previous `p07-scenario-report-drawer` layout pairs) | Drop | retain content/state assertions; use the shared `Modal` drawer lifecycle without an accidental page-shell offset | removed seven internal geometry pairs (corrected 2026-09-29 from "two"; `git diff` of the WP7d merge); drawer scenario remains |
| SR-14 | current React interface carries content, filtered records, pagination, drawer/dialog/toast state, and named callbacks | `ScenarioReportsView/index.jsx:23-49,51-79` | Normalize | keep the controlled pattern interface; callbacks use named event objects and the hook owns state/mutations | story Controls document the interface; scenario tests exercise the callbacks |
| SR-15 | page-level stories cover default, drawer open, owned disable confirmation, owned delete confirmation and filtered empty states | `ScenarioReportsView.stories.jsx:62-113` | Intent | retain one story per reachable Scenario Reports state; action stories seed deterministic owned records | `Default`, `DetailOpen`, `OwnRecordDisableConfirm`, `OwnRecordDeleteConfirm`, `FilteredEmpty` retained |

### Review Center — WP7f (pilot: table)

Source: `assets/js/governance/review.js`, `assets/js/data/reviews.js`, `assets/pages/review-center.html`. React before: `features/review-center/ReviewQueue`, the tabs/toolbar/queue of `pages/ReviewCenterPage`, `demo/review-center-demo.js`.

| # | behaviour | evidence (source file:line) | disposition | React behaviour | story / scenario change |
|---|---|---|---|---|---|
| RC-01 | tabs Pending Review / Approved with counts; rejected items leave every tab | `review.js:55-61,95-96`; `review-center.html:151-172` | Fix (D02, A5) | `LibraryToolbar` tabs Pending Review / Approved / Rejected, each with its computed count; the Rejected tab lists rejected items | `p12-reject-empty-confirm` story asserts the Rejected tab count |
| RC-02 | hero "Rejected this week" is the literal `3` | `review.js:46`; `review-center.html:66` | Fix (D02) | computed from records (0 until something is rejected) | `p12-default` and `-reject-empty-confirm`: original side asserts the stat exists, story side asserts the computed value |
| RC-03 | search over title, summary, submitter | `review.js:63-68,98-101` | Intent | `LibraryToolbar` search, same fields | `p12-search` reaches the state with `fill` on the default story |
| RC-04 | Type select (six knowledge types) | `review.js:70-75,97`; `review-center.html:204-210` | Intent | `LibraryToolbar` single facet (Select), same options | `p12-type` reaches it with `select` on the default story |
| RC-05 | Submitted select stores a value and filters nothing | `review.js:77-82,95-104` | Fix (D01) | filters like Feedback (`feedback.js:101-107`: within 1 / 7 / 30 days). Review items carry relative text only, so the hook reads the day count from it ("N hours ago"/"Today" = 0, "Yesterday" = 1, "N days ago" = N) | `p12-time-noop` → `p12-time`: original side asserts the control exists; story side asserts the changed count |
| RC-06 | result count "N item(s)" | `review.js:108-110` | Intent (R7) | `LibraryToolbar` count, same copy | selectors updated |
| RC-07 | seven-column queue: title + summary (+ Restore badge), type, submitter, submitted, status, AI check, actions | `review.js:112-167`; `review-center.html:226-238` | Normalize (pattern §2 table) | `LibraryList layout="table"` (DataTable) with the same columns; status and AI check as `StatusBadge`; Restore as a badge | `.mh-review-queue__row` → `.mh-review-page .mh-table tbody tr` |
| RC-08 | row click opens the detail; action buttons do not | `review.js:170-186` | Intent (B5) | `DataTable onOpen`: first cell is the open button; action buttons stop propagation | — |
| RC-09 | Approve on Pass is immediate; on Warning/Reviewing opens the risk modal | `review.js:467-477,315-340` | Intent (R5, B14) | same; risk `ConfirmDialog` kept | `p12-pass-direct` uses the default story with a seeded Pass restoration |
| RC-10 | Reject opens the reason panel; confirm sets `rejected` even with an empty reason | `review.js:272-313` | Intent | same; the reason is kept on the record | `p12-reject*` selectors updated |
| RC-11 | the rejection reason is collected and never read | `review.js:283-313` (value cleared on close, never stored) | Fix | the Rejected item's detail shows its reason under "Rejection Reason" (existing copy) when one was given | test |
| RC-12 | no feedback after approve / reject | `review.js:300-313,342-352,467-477` | Fix (R6, B14) | `Toast` "Approved" / "Rejected" (wording chosen by the user 2026-09-28); 3 s | tests; `p12-risk-approve`, `-reject-empty-confirm` assert it |
| RC-13 | Restore badge from an id prefix; restorations merged once from localStorage | `review.js:21-33,125-126` | Intent | unchanged in the hook (`restored`, `restorations` prop) | — |
| RC-14 | detail drawer: type, source, title, summary, submitter, submitted, status, AI check, warning, AI suggestions, actions | `review.js:385-465` | Intent | `Modal` drawer kept (view-specific content); action buttons become `Button`; status label covers Rejected | `p12-*-detail` selectors updated |
| RC-15 | "View in Knowledge Base" in an approved item's detail re-opens the same detail | `review.js:432-436,482-483` | Intent kept as is (no knowledge-page mapping exists for review ids) | unchanged; not offered for rejected items, which are not in the knowledge base | `p12-view-same-detail` unchanged |
| RC-16 | empty state "No matching items / Change the tab, filter, or search." | `review-center.html:241-245` | Normalize | `LibraryEmpty` no-results, same copy, with "Clear filters" (search, type, time) | `p12-empty` reaches it with `fill` on the default story |
| RC-17 | raw `<input type=search>`, two raw `<select>`, raw tab and action `<button>`s | React `ReviewCenterPage/index.jsx`, `ReviewQueue/index.jsx` | Normalize (N4) | `LibraryToolbar` (SearchField, Select, Tabs) and `Button` | — |
| RC-18 | React `ReviewQueue` feature (7-column CSS grid, own badges, own empty state) and its story | `features/review-center/ReviewQueue` | Drop (replaced by the pattern) | deleted | removed `features-review-center-review-queue--pending` → state in `pages--review-center` |
| RC-19 | page stories whose only purpose was a list state: Search hit, Type filtered, Submitted Today, Empty-reason rejection result | `ReviewCenterPage.stories.jsx:69-81` | Drop (WP7 step 6) | states reached from the default story in scenarios; kept stories: default, Approved, No matching items + every drawer/dialog/assistant story | see PR |

### Principles + Data Model domain cards — WP7e

Sources: `assets/js/knowledge/types.js` (Principles card view), `assets/js/knowledge/principles-library.js`, `assets/js/knowledge/data-model-browser.js` (domain sidebar only; the browser, graph and table dialog are unchanged). React before: `features/interpreter/PrinciplesView`, the domain sidebar of `features/interpreter/DataModelView`, principles state in `demo/interpreter-demo.js`, domain state in `demo/data-model-demo.js`.

| # | behaviour | evidence (source file:line) | disposition | React behaviour | story / scenario change |
|---|---|---|---|---|---|
| PR-01 | search over category, title and description; resets the page | `types.js:374-381`, `:596-600` (shared search input) | Intent | `LibraryToolbar` search, same fields (`filterPrinciples` unchanged); "/" still focuses it through `searchRef` | `p07-principles-search`, `-slash` story selectors → `.mh-library-toolbar input` |
| PR-02 | Category multi-select with "N selected" / "All categories" summary | `types.js:351-373` | Intent | `LibraryToolbar` multi facet (CheckboxFilter), same options and summary | `p07-principles-category-open`, `-category-filter` unchanged on the story side (CheckboxFilter markup unchanged) |
| PR-03 | count line "Showing X of Y principles" rendered but hidden by CSS (D08) | `types.js:727`; `ai-interpreter-overview.css:1653` | Normalize (R7) | visible toolbar count, same copy | `p07-interpreter-principles` asserts it |
| PR-04 | single-column list of cards: two-digit ordinal, grey category badge, title, clamped description | `types.js:729-752` (`principles-list-shell`) | Normalize (pattern §2, §5) + user decision 2026-09-28 | `LibraryList layout="list"` (one `LibraryItem` per row, as the original's single column); title, category as meta, description in the item's slot. The ordinal is position-only decoration not marked **keep** in pattern §5 and is not rebuilt. The pattern's grid was tried first and rejected in review: an expanded card stretched its row neighbours, and a full-row or masonry workaround either left gaps or changed reading order | — |
| PR-05 | description clamped to two lines by a binary search over `scrollHeight`, re-run in rAF; the toggle is shown only when the text overflows or is expanded | `types.js:689-717,760-770` | Normalize (as D07) | CSS two-line clamp; one overflow check decides whether the toggle is shown (no truncation search) | — |
| PR-06 | expand/collapse a long description in place; state kept across re-renders | `types.js:287,839-854` | Intent (pattern §5 **keep**) | toggle button in the item slot (`aria-expanded`, `aria-controls`, same labels); activating the card title does the same, since "expand in place" is the Principles detail (pattern §5). | `p07-principles-expand` story selectors → `.mh-principles__toggle`, `.mh-principles__text.is-expanded` |
| PR-07 | empty: "No matching principles. Change the category or search." | `types.js:758` | Normalize | `LibraryEmpty` no-results, same copy split into title + message, with "Clear filters" (pattern §2) clearing search and category | `p07-principles-empty` story selector → `.mh-library-empty` |
| PR-08 | pagination 10/20/50, numbered | `types.js:676-688` | Normalize (B12) | `Pagination` compact, 5/10/20, default 10, like the other libraries | `-category-filter`, `-search`, `-slash`, `-long`, `-narrow` count assertions follow the compact label |
| PR-09 | no status, no actions, no create, no detail drawer | `types.js:737-752`; `domain-model.md` §6 Principles row | Intent (pattern §5: manage no, create no, status —) | none rendered | — |
| PR-10 | version drawer listens for `principles:versions`, dispatched from `[data-principle-versions]`, which no markup renders | `principles-library.js:8-60`, `types.js:867-874` | Drop (dead code; never rebuilt) | none (Knowledge View keeps its own version panel) | — |
| PR-11 | warm-grey ramp and `--mh-principle-*` tokens (D17) | `PrinciplesView.css`; `foundations.md` §2.1 | Normalize | pattern visuals, foundation tokens; view-named tokens deleted when unreferenced | — |
| PR-12 | React: private `PrincipleDescription` measuring component, `total`, `expanded`, `strings.pageSizes` props | `PrinciplesView/index.jsx:18-100` | Normalize | replaced by the item slot above; hook passes the filtered count and the empty/clear strings | Controls updated |
| DM-01 | domain search over name, description, business description and synonyms; first match auto-selected | `data-model-browser.js:922-931,1077-1080` | Intent | `SearchField` (was a raw `<input>`, N4); hook unchanged | `p07`/`p11` search scenarios: story selectors → `.mh-dmview__search input` (unchanged class on the wrapper) |
| DM-02 | domain card: dot, name, 3-line description, "N tables" count; the active card is highlighted; clicking selects it and the browser shows it | `data-model-browser.js:1081-1095`; `data-model-browser.css:71-142` | Normalize (pattern §5: Data Models use `LibraryItem` for their domain cards) | `LibraryItem` per domain: title opens (selects), description, meta "Tables N", selected state from pattern §6 ("Selected/active: border accent, background accent-wash") via `LibraryItem selected`; the dot is decoration and is dropped | `.mh-dmview__domain(.is-active)` → `.mh-dmview__domains .mh-library-item(--selected)` in p07, p11 and host-check |
| DM-03 | domain cards show no availability; the Basic information panel does | `data-model-browser.js:1085-1093,1121` | Normalize (pattern §5 "status shown: availability") | Enabled/Disabled `StatusBadge` on each domain card | p11 default asserts the badge |
| DM-04 | `role="listbox"` on the list and `aria-selected` on the card buttons (no `role="option"`) | `data-model-browser.js:1015,1085,1233` | Normalize | list of cards; the selected card's title button carries `aria-current="true"` (a listbox of buttons with nested content is not a valid listbox) | — |
| DM-05 | empty: "No matching data models." | `data-model-browser.js:1096` | Normalize | `LibraryEmpty` kind `no-results`, same copy, no clear button (the search field clears itself) | `.mh-dmview__empty` → `.mh-library-empty` in p11 and host-check |
| DM-06 | domain-card geometry pair (x, y, width against `.dm-domain-card`) | `scripts/visual-check/scenarios/p07.mjs:1116` | Changed | story selector → the new card; the pair is kept and passes (search spacing below the field tightened so the first card starts within 8 px of the original) | `p07-data-model-basic` layout pair updated, not removed |
