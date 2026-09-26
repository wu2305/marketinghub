# Domain model — what the original is *about*

Status: **Phase 1 proposal, awaiting user review** (2026-09-27).

Purpose: name the objects, lifecycles and rules the demo is trying to express, so components are built
around them rather than around each page's markup. Every rule cites the original source
(`assets/js/**`, `assets/pages/**`). Statements marked **Inference** are my reading of intent where the
source is silent or contradicts itself; statements marked **Ask** need a user decision before Phase 2
builds on them.

Scope: the governed-knowledge half of the product (AI Interpreter, review, feedback, memory, skills),
because that is where the Phase 2 library pattern lives. Cockpit/Self-Service/Campaign objects are listed
briefly in §6 for completeness.

## 1. Actors

| actor | evidence | notes |
|---|---|---|
| **Current user** — creator of their own knowledge | `knowledge/field-library.js:32–33`, `business-term-library.js:106`, `scenario-reports.js:191` | identity is the constant string `"Current User"`; every permission check compares a record's creator to it |
| **Other creators** — named people (`Emily Wang`, `Marco Li`, `Sophie Chen`) | `knowledge/types.js:215`, `scenario-reports.js:134,150,166` | their records are visible but not operable |
| **Owning team** — `Marketing Analytics`, `Data Governance`, … | `knowledge/types.js:118,134,150,166,183,199` | a display attribute, not a permission subject |
| **Reviewer** — whoever uses Review Center | `governance/review.js:467–481` | no identity check: anyone on the page may approve/reject |
| **AI checker** — produces `aiCheck` Reviewing / Warning / Pass | `data/reviews.js:14`, `knowledge/workspace.js:36–40` | a status source, not a person |

**Inference.** `owner` and `creator` are two different concepts that the source mixes:
`scenario-reports.js:110–111` falls back `creator ← owner ← "Current User"` and back again. The intent is:
*creator* (a person) governs permission; *owning team* (a group) is information. Phase 2 keeps them as two
fields and never derives one from the other.

There is no admin, no role table and no override path anywhere in the source. The demo's
`AI Interpreter Demo 变更说明 v22.docx` §6 declares real permissions out of scope (AGENTS §2.1).

## 2. Governed objects

| object | where | kinds / categories |
|---|---|---|
| **Knowledge item** | AI Interpreter (`knowledge.html`) | 8 types, `knowledge/types.js:45–101` (`typeMeta`): Principles, Report Context, Data Models, Metric Dictionary, Business Terms, Analytical Models, Scenario Reports, Email Reports. Business Terms has sub-kinds Business Term / Global Synonym (`business-term-library.js:104–105`) |
| **Review item** | Review Center | a knowledge item submitted for approval, plus *restore* items created from a version restore (`review.js` `restore-` ids; `knowledge/workspace.js:1902`) |
| **Feedback** | Feedback & Quality | thumbs-up / thumbs-down on an AI answer (`data/feedback.js`: 10 up, 5 down) |
| **Memory** | Personal Memory | analysis / findings / meeting / reference (`data/memories.js`) |
| **Skill** (named "scenario" in the source) | Skill Library / Detail / Edit | `data/skills.js`; statuses §3.3 |

## 3. Lifecycles

Knowledge items carry **two independent axes**. Most confusion in the source (and in the current React
props) comes from treating them as one "status".

### 3.1 Availability — can the AI use it right now?

`Enabled` ⇄ `Disabled`.

| evidence | spelling in source |
|---|---|
| `field-library.js:57–62,98,170` | `status: "Enable" / "Disable"`, displayed Enabled/Disabled |
| `business-term-library.js:75,88` | same |
| `field-library.js:55` (Report Context) | boolean `ai_interpretation_enabled`, displayed **Open / Close** |
| `scenario-reports.js:91,1024` | boolean `ai_interpreter_enabled` |
| `data-model-browser.js:1115` | lowercase `"enable"` on a domain |
| `email-view.js:68` | `Enable / Disable` |

**Normalize.** One concept, five spellings. The component vocabulary is `availability: "enabled" |
"disabled"`, labelled Enabled / Disabled. The Report Context "Open / Close" label is the same axis
(**Inference**: nothing in the page gives Open/Close a different meaning).

### 3.2 Workflow — how far along is its governance?

`Draft` → `Under Review` → `Published`, from the stage map `co-build / solidify / calibrate`
(`knowledge/workspace.js:30–34`, stage labels `:1672`).

Scenario Reports add a build pipeline instead: `Draft`, `Queued`, `Building`, `Published`
(`scenario-reports.js:78–80`), while the filter menu for the same type offers `Queued`, `In Development`, `Live`
(`knowledge/types.js:515–521`). **Inference:** Building ≈ In Development and Live ≈ Published; the filter
list was written against an older vocabulary.

Metric Dictionary derived metrics use `Draft / Published` only (`metric-detail.js:114,125`).

### 3.3 Other lifecycles

| object | states | transitions | evidence |
|---|---|---|---|
| Review item | `pending` → `approved` \| `rejected` | approve, reject (with reason) | `review.js:300–313,343–353` |
| Review AI check | `Reviewing` \| `Warning` → `Pass` | approving sets `Pass` | `review.js:351,475` |
| Skill | `Draft`, `Under Review` → `In Development` → `Published` | click the status cell/button to advance | `governance/skills.js:145–166` |
| Feedback | none — a feedback record is immutable | — | `governance/feedback.js` |
| Memory | none | create, edit, delete | `governance/memory.js:96,279–283,430–456` |

## 4. Rules

### R1 — Only the creator may operate on knowledge

Edit, delete and disable are available only when `creator === current user`.

- `field-library.js:32–33,101,648–655` — "Knowledge created by others cannot be operated."
- `business-term-library.js:106–116,211` — "You do not have permission to {action} knowledge created by
  another user."
- `scenario-reports.js:191–201` — same as field library.

**Normalize.** Same rule, two messages; one message in Phase 2.
**Not a rule:** Memory has no creator check because memory is personal by definition (§2); Review has no
reviewer check (§1).

### R2 — Take it offline before changing it

Edit and delete require `Disabled`; disable requires `Enabled`.

- `field-library.js:102` — `statusBlocked = (offline && action === "disable") || (!offline && action !== "disable")`
- `business-term-library.js:111–113` — same, plus drafts cannot be disabled (they already are, R3)
- `scenario-reports.js:196–198` — same
- `field-library.js:657–668` — the explanation: "To edit or delete this knowledge, take it offline first.
  Once offline, users cannot access it temporarily." with a confirm that disables it.

**Inference (intent):** a published, AI-visible item must never change underneath a live answer. The
guard exists to protect consumers, not to annoy the owner.

**Ask A3.** The source implements the guard twice, inconsistently: the buttons are natively `disabled`
(Analytical Model, Scenario), so the "Disable knowledge first → confirm → disabled" dialog in
`field-library.js:657–668` can never open; Business Term uses `aria-disabled` so its notice *is*
reachable (`business-term-library.js:124`). The current React keeps both behaviours through
`KnowledgeActions variant` (`src/design/features/interpreter/KnowledgeActions/index.jsx:5–15`). Which is
intended: (a) actions look disabled and explain why on hover, or (b) actions stay clickable and offer
"disable first" as a one-step fix? **Recommendation: (b)** — it is the only path the source *wrote
copy for*, and it turns a dead end into a guided step.

### R3 — Drafts are private and offline

- A draft is visible only to its creator: `business-term-library.js:85`, `field-library.js:141,220`.
- A draft is always Disabled: `business-term-library.js:112,119` ("Draft knowledge is already disabled"),
  `analytical-model-form.js:266–272` ("Save always keeps knowledge offline").
- Drafts carry a *Draft* superscript next to the title: `field-library.js:90–92`,
  `business-term-library.js:130`.

### R4 — Save keeps a draft; Submit moves it forward

- Save → `Draft` + `Disabled` (`analytical-model-form.js:266–272,291`).
- Submit → keeps the form's availability toggle (`:267–273`).

**Ask A1.** Where does Submit go? Two generations disagree:
`analytical-model-form.js:291` sets `stage = "Published"` directly; `editor-runtime.js:188` and
`knowledge/workspace.js:2159` say "submitted for review", and Review Center exists to receive exactly those
items (`data/reviews.js` `stage: "solidify"`). **Recommendation:** Submit → `Under Review`; Review Center
approval → `Published`. That is the only reading under which Review Center has a job.

### R5 — Approving over an AI concern needs a second confirmation

- Approve on `aiCheck = Pass` is immediate; on `Warning` or `Reviewing` it opens a risk modal first
  (`review.js:467–477,315–340`).
- Reject always asks for a reason (`review.js:272–313`).

**Fix (defect).** The Rejected count is a literal `3` (`review.js:46`) and rejected items leave every tab
(`review.js:95`). **Ask A5:** should Review Center show a Rejected list (the count implies one), or should
the count go?

### R6 — Destructive actions confirm, and completed actions acknowledge

- Disable and delete confirm first (`field-library.js:688–699`, `memory.js:430–456` "This action cannot be
  undone").
- After success the source *calls* `window.showKnowledgeSuccessToast?.("Deleted successfully" |
  "Taken offline successfully")` (wording varies by file) (`field-library.js:618`, `business-term-library.js:155`,
  `scenario-reports.js:214`) — but no file defines that function, so the user never sees it.

**Fix (defect).** Three call sites and the exact copy exist; only the definition is missing. Intent is
clear: show a success toast.

### R7 — Lists narrow by search + facets, and the count follows

Every governed list has free-text search over title/summary/person and one or more facet filters, and
shows a result count (`review.js:95–110`, `feedback.js:95–110`, `field-library.js:139–150,220`).

**Fix (defect).** Review Center's *Submitted* time filter stores its value (`review.js:78–83`) but
`getFilteredItems` never reads it (`review.js:95–104`). Feedback & Quality's identical control does filter
(`feedback.js:101–107`). The sibling page shows the intent.

### R8 — Skill status advances by clicking it

`governance/skills.js:145–166`: clicking a status advances Under Review → In Development → Published.

**Ask A4.** **Inference:** a demo shortcut standing in for a real review workflow — there is no
confirmation, no actor, and the Draft state cannot be entered or left this way. Keep as a visible action,
or drop and show status read-only?

## 5. Which types actually expose the governance actions

| type | row actions (edit / delete / disable) | availability shown | workflow shown | evidence |
|---|---|---|---|---|
| Business Terms | yes, R1+R2+R3 | yes | Draft only | `business-term-library.js:106–126` |
| Analytical Models | yes, R1+R2 | yes | Draft only | `field-library.js:94–107` |
| Scenario Reports | yes, R1+R2 | yes | Draft/Queued/Building/Published | `scenario-reports.js:191–210` |
| Report Context | edit description only | yes (Open/Close) | no | `field-library.js:95,409,676` |
| Metric Dictionary | none in list | no | Draft/Published (detail) | `field-library.js:94`, `metric-detail.js:114` |
| Email Reports | none | yes | no | `email-library.js:29`, `email-view.js:68` |
| Data Models | none (domain status shown) | yes | no | `data-model-browser.js:1115` |
| Principles | none | no | Under Review / Published (overview) | `principles-library.js` (no action code), `types.js:137,202` |

**Ask A2.** Are Report Context, Metric, Email, Data Model and Principles *read-only by intent* (they are
fed from systems of record), or did the demo simply not wire the actions yet? The data model supports
both: every type has an owner and an availability field. **Recommendation:** treat governance actions as
one capability of the library pattern, switched on per type by configuration — the current behaviour
becomes a config table, and the answer to A2 changes a row, not a component.

## 6. Outside the governed-knowledge core (brief)

| object | states | evidence |
|---|---|---|
| Report (Cockpit) | `Ready`, `Data delayed` | `reports/report-core.js` (5× Ready, 1× Data delayed) |
| Upload (Self-Service) | idle → submitted | `self-service/upload.js:17` |
| Campaign task | per-task status list | `campaign/workspace.js` |

These are presentation states, not governance; Phase 2 does not touch them.

## 7. Decisions (user-approved 2026-09-27)

All five recommendations were approved by the user on 2026-09-27; wherever §4–§5 say **Ask A*n***, the
recommendation below is now the rule.

| # | question | decision |
|---|---|---|
| A1 | Submit → Published directly, or → Under Review? | Under Review; Review Center publishes |
| A2 | Five types without row actions: read-only by intent? | make actions a per-type config; default = current behaviour |
| A3 | Blocked action: disabled with tooltip, or clickable with "disable first" guidance? | clickable with guidance |
| A4 | Skill click-to-advance status: keep or drop? | drop the click; show status read-only |
| A5 | Rejected review items: add a list, or drop the static count? | add a Rejected tab — the count implies the view |

