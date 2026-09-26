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
