# Kickoff prompt for a design sync

The designer pastes everything below the line into her coding agent, at the start of a session on
`wu2305/marketinghub`. It is self-contained, so it also works for an agent that doesn't read
`AGENTS.md` by itself.

---

You're syncing an updated static design demo into this repository's React components and Storybook.
I'm the product's UI/UX designer, and I don't write code. You do all the engineering. I answer design
questions. The repository owner, Wu, answers engineering questions and merges.

My new demo is: <attach the files, or give the folder or link>. It has the same layout as the repo's
current demo: `index.html` plus `assets/**`.

Before you edit anything, read these in order: `AGENTS.md`, `handover/design-sync/README.md`,
`handover/README.md` §1 and §2.2, `handover/design-intent/phase2-guide.md` §0 (and the files it
lists), and every earlier note in `handover/design-sync/changes/`. Then follow
`handover/design-sync/README.md` exactly. In short:

1. Branch `design-sync/<today>-<slug>` from the latest `origin/main`.
2. Commit 1 contains only my new bundle (`index.html`, `assets/**`) plus a change note copied from
   `handover/design-sync/changes/TEMPLATE.md`. Draft section A from the diff, then show it to me and
   let me correct it before you commit.
3. Commit 2 is the inventory: classify every user-visible change. Put design questions to me **one at a
   time**, in product language, with 2–4 options and your recommendation. Record my answers in the
   note. Don't guess where I haven't answered. Leave the item open.
4. Then one commit per page or shared component, updating components, stories, demo state, copy and the
   page's visual-check scenario. Each commit must pass `npm run lint && npm test && npm run build-storybook`.
5. A final commit updates `handover/README.md` and `handover/design-intent/dispositions.md`.
6. Run the full gate (`phase2-guide.md` §3). Show me side-by-side screenshots of each changed page
   (demo vs story, 1440px and 390px) and ask me for pass or fail on each.
7. Open a pull request using the template `.github/PULL_REQUEST_TEMPLATE/design-sync.md`, and request
   review from `wu2305`.

Hard rules:
- Never copy the demo's HTML or DOM into components, never load `assets/js` in stories, and never
  build anything that parses the demo's markup. Components take semantic props, and the demo is only
  evidence of the design intent.
- Colours, fonts, spacing, radii and shadows come from `src/design/tokens.css` roles (see
  `handover/design-intent/foundations.md`). A deliberate change I make to a role applies everywhere.
- Storybook docs are bilingual (English + 中文). For every story, argType and page prop you add or
  change, write the description as `bi("English", "中文")` (from `src/design/lib/story-helpers.js`), or
  `English text // 中文` in a page's `@param` JSDoc. Leave the rendered UI copy as my demo has it.
  `npm test` checks this.
- Don't ask me engineering questions. If a check fails for a reason you can't trace to this sync,
  or the work needs a change to `.storybook/`, `scripts/` (except visual-check scenarios),
  `package*.json`, CI or `examples/host`, stop that item and leave a pull request comment for Wu
  with the exact output. Then continue with the rest.
- Never merge. Never force-push to `main`. Never disable or loosen a check to make it pass.
