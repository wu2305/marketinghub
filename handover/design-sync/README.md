# Design sync: from an updated demo bundle to Storybook

This is the procedure for when the designer (not an engineer) has changed the static demo, meaning
`index.html` plus `assets/**`, and the change has to be carried into `src/design` and Storybook. It is
written for whichever LLM agent does the work: the designer's own agent, or one started by the
maintainer. `AGENTS.md` still applies in full. This file only adds the sync-specific order, roles and
record-keeping.

Designer-facing instructions are in `designer-guide.md`. The paste-in kickoff prompt is `llm-prompt.md`.

## 1. Roles: who answers what

| question type | who answers | how |
|---|---|---|
| Design intent: what a control should do, which of two looks is right, whether a new state is real or a leftover, the copy, whether to keep a stub | **Designer** | Ask her in the chat (one question at a time, with options and a recommendation). Record her answer in the change note (§3) with the date. |
| A disposition that `handover/design-intent/dispositions.md` or `domain-model.md` already decides | Nobody | Apply it and cite the row. |
| Engineering: a gate fails for a reason you can't trace to the sync, an architecture or public API change, a new dependency, CI or config, anything in `.storybook/`, `scripts/` (except visual-check scenarios), `package*.json` or `examples/host` | **Maintainer (Wu)** | Stop that item. Leave a PR comment with the exact output or question. Carry on with other pages. |

Never ask the designer an engineering question, and never ask the maintainer a design question.
Explain design questions in product terms (what users see and can do), not in code terms.

## 2. Branch and commit sequence

One sync = one branch `design-sync/<yyyy-mm-dd>-<slug>` from the latest `origin/main` = one PR, made of
these commits in this order. Each commit must build (`npm run lint && npm test && npm run build-storybook`).

1. **`demo: <summary>`** changes only `index.html`, `assets/**` and the new change note
   `handover/design-sync/changes/<yyyy-mm-dd>-<slug>.md` (copied from `changes/TEMPLATE.md`, with
   §A filled in). This is the designer's bundle, unchanged. If the designer hands over a whole new bundle, copy
   it over the old one file by file. Keep file names stable where the page is the same page. Do
   not delete an image or font that `src/design` still references (`grep -rn "/assets/" src/design`)
   without replacing that reference in a later commit.
2. **`sync: inventory <slug>`** fills in §B of the change note: every changed behaviour or visual,
   per page, with its disposition (§4), the React files it affects, and any open question. Ask the
   designer the Ask items now, record her answers, and commit.
3. **`sync(<Pxx>): <summary>`**, one commit per page (or per shared component, done before the pages
   that use it). Each covers components, stories, `demo/` hooks, `content.js`, tests and
   `scripts/visual-check/scenarios/pNN.mjs` (selectors on the *original* side change when the bundle's
   markup changes, so update them to the new bundle and never loosen an assertion to make it pass).
4. **`sync: handover <slug>`** covers `handover/README.md` (§1 numbers, §2.2 row status, §3 intentional
   differences, §4 known gaps, §5 log line naming the designer's change note) and new rows in
   `dispositions.md`.

If the bundle adds a whole new page, it gets the next free P-id, a new `pages/<Page>/`, a ledger row
in `handover/README.md` §2.2, and its own scenario file.

## 3. The change note

`changes/<date>-<slug>.md` is the durable record of one sync. §A is the designer's own description,
which her agent may draft from the diff and she confirms. §B is the inventory table. §C is her
answers to design questions. §D is what was left open. Later syncs read earlier notes, so they
don't ask again.

## 4. Classifying each change

Use the dispositions in `handover/design-intent/dispositions.md` (Intent / Normalize / Fix / Drop-stub /
Ask), with these sync-specific readings:

- **A deliberate visual change** (new colour, spacing, layout): map it to the foundation *role*
  (`foundations.md` §3). If an existing role token fits, use it. If the designer is changing a role
  everywhere, that is a token change in `tokens.css`, and it must be applied to the role and not to one
  component. If no role fits, it's an **Ask** for the designer (a new role, or a one-off to normalise
  away?).
- **A new control or state**: rebuild it (AGENTS §5 standard 1) with a named story and a scenario. If it
  has no behaviour in the bundle and nothing says what it should do, it's an **Ask** (not a silent
  Drop-stub). The designer is the one person who can say what she meant.
- **Changed copy or data**: update `content.js` and fixtures. Pages receive copy via props (AGENTS §3.1).
- **New or changed stories, argTypes and page props: keep the docs bilingual** (English + 中文, AGENTS §3.4).
  Write every documentation string as `bi("English", "中文")` (`bi` is exported from
  `src/design/lib/story-helpers.js`; also pass it as the description of `prop`, `enumProp` and
  `callbackProp`), and write page-prop JSDoc as `@param {type} props.x English text // 中文`. Keep code, prop
  names and UI labels in English in both halves, and leave the rendered UI copy as the demo has it.
  `npm test` fails (`docs-bilingual.test.js`) on a description without Chinese text. Translate from the
  English sentence, and ask the designer only if a product term has no established Chinese wording.
- **Removed feature**: delete its props, stories and scenarios, and list the removed story ids in the
  handover (AGENTS §4.1).
- **Accidental noise** from regeneration (renamed classes, reordered CSS, reformatted JS with the same
  result) doesn't count as a change. Note it in §B as "no user-visible change" and move on.

Still forbidden (AGENTS §2.2): copying the bundle's DOM or HTML into components, loading `assets/js`
in stories, or any DOM-recognition pipeline. Components keep their semantic props, and the bundle is
evidence of intent.

## 5. Gate

On the final commit, run the full gate from `handover/design-intent/phase2-guide.md` §3 (lint, test,
build-storybook, host build + check, visual-check, `--negative`, build:lib, font probe). Put outputs in
`/tmp`, and put the summary and paths in the PR body. A visual-check failure is either fixed or
explained in the change note §D. The designer gives the visual verdict (`visual-check --review`),
because that's a design judgement.

Use the **unfiltered** visual-check and font probe for a sync, not `--affected`. `scripts/affected.mjs`
selects scenarios from `src/design` imports and changed scenario files only, so a change to
`index.html` or `assets/**` alone selects nothing. Once it maps bundle files to the pages that load
them, `--affected` is fine here too. Where CI uploads the `gate-evidence` artifact, link that run so the
designer can open the screenshots without running anything locally.

## 6. PR

The PR body follows `.github/PULL_REQUEST_TEMPLATE/design-sync.md`. The maintainer reviews code and
merges. The designer reviews the Storybook result.

## 7. Page map

| ID | bundle entry | page component | story id prefix | scenario file |
|---|---|---|---|---|
| P01 | `index.html` | `pages/HomePage` | `pages--home` | `p01.mjs` |
| P02 | `assets/pages/reports.html` | `pages/MarketingCockpitPage` | `pages--marketing-cockpit` | `p02.mjs` |
| P03 | `assets/pages/flexible.html` | `pages/SelfServicePage` | `pages--self-service` | `p03.mjs` |
| P04 | `assets/pages/data-upload.html` | `pages/DataUploadPage` | `pages--data-upload` | `p04.mjs` |
| P05 | `assets/pages/media-tracking-detail.html` | `pages/MediaTrackingDetailPage` | `pages--media-tracking-detail` | `p05.mjs` |
| P06 | `assets/pages/campaign.html` | `pages/CampaignPage` | `pages--campaign` | `p06.mjs` |
| P07 | `assets/pages/knowledge.html` | `pages/AiInterpreterPage` | `pages--interpreter` | `p07.mjs` |
| P08 | `assets/pages/knowledge-create.html` | `pages/KnowledgeCreatePage` | `pages--knowledge-create` | `p08.mjs` |
| P09 | `assets/pages/knowledge-view.html` | `pages/KnowledgeViewPage` | `pages--knowledge-view` | `p09.mjs` |
| P10 | `assets/pages/metric-dictionary.html` | `pages/MetricDictionaryPage` | `pages--metric-dictionary` | `p10.mjs` |
| P11 | `assets/pages/data-model.html` | `pages/DataModelPage` | `pages--data-model` | `p11.mjs` |
| P12 | `assets/pages/review-center.html` | `pages/ReviewCenterPage` | `pages--review-center` | `p12.mjs` |
| P13 | `assets/pages/feedback-quality.html` | `pages/FeedbackQualityPage` | `pages--feedback-quality` | `p13.mjs` |
| P14 | `assets/pages/personal-memory.html` | `pages/PersonalMemoryPage` | `pages--personal-memory` | `p14.mjs` |
| P15 | `assets/pages/scenario-library.html` | `pages/ScenarioLibraryPage` | `pages--scenario-library` | `p15.mjs` |
| P16 | `assets/pages/scenario-detail.html` | `pages/ScenarioDetailPage` | `pages--scenario-detail` | `p16.mjs` |
| P17 | `assets/pages/scenario-edit.html` | `pages/ScenarioEditPage` | `pages--scenario-edit` | `p17.mjs` |

Shared CSS and JS (`assets/css/*`, `assets/js/components/*` and so on) can affect several pages. Find
which pages load a changed file (`grep -ln "<file name>" index.html assets/pages/*.html`) and treat each
one as affected.
