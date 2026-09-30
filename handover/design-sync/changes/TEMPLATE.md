# Design sync <yyyy-mm-dd> — <short title>

Designer: <name> · Branch: `design-sync/<yyyy-mm-dd>-<slug>` · PR: #<n>

## A. What changed (designer)

Plain language, one bullet per change. Say why when it isn't obvious: a new feature, a visual refresh,
a fix to something that was wrong, or removing something.

- <page or area>: <what changed> (<why>)

Screenshots (optional): before/after paths or links.

Bundle version: <e.g. v22> (set as the title of `docs/demo/README.md`). Local paths stripped from
`docs/cleanup-manifest.json`: yes / no files of that kind in this bundle.

## B. Inventory (agent)

One row per user-visible change. Regeneration noise with no visible effect gets one summary row.

| # | page (P-id) | change | bundle evidence (file:line) | disposition | React files / stories / scenarios | status |
|---|---|---|---|---|---|---|
| S01 | | | | Intent / Normalize / Fix / Drop-stub / Ask / no-visible-change | | todo / done / open |

## C. Designer answers

| # | question | options offered | answer | date |
|---|---|---|---|---|

## D. Left open

Anything not done in this PR, with the reason and who it's waiting on (designer or maintainer).
