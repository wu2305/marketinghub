# Kickoff prompt for a customer demo

The designer pastes everything below the line into her coding agent, at the start of a session on
`wu2305/marketinghub`, with the brief filled in. It is self-contained, so it also works for an agent that
doesn't read `AGENTS.md` by itself.

---

You're building a demo site for a customer from this repository's React components. I'm the product's
UI/UX designer, and I don't write code. You do all the engineering. I decide what the customer sees and
judge how it looks. The repository owner, Wu, answers engineering questions and merges.

**My brief** (ask me if anything important is missing, one question at a time, with options and your
recommendation):
- Customer and purpose: <...>
- Pages to show, in order: <for example Home, Marketing Cockpit, AI Interpreter>
- Customer-specific names, numbers, wording, logo: <...>

Before you edit anything, read in this order: `AGENTS.md` (skim §1, §2.2, §3.1), `handover/customer-demos/README.md`,
and `handover/customer-demos/page-recipes.md`. Then follow the README exactly. In short:

1. Branch `customer-demo/<today>-<name>` from the latest `origin/main`; `npm ci`; `npm run demo new <name>`.
2. Put the customer's content in `examples/demos/<name>/content.js` (spread the product's default content and
   override only what differs) and list the pages in `App.jsx`. Add pages with the recipes.
3. Preview with `npm run demo dev <name>`, click through the story, and show me screenshots of every page at
   1440 px and 390 px wide. Ask me for pass or what looks wrong. Fix what I flag.
4. Run `npm run lint && npm test && npm run demo build <name>`, open the built file `demo-dist/<name>/index.html`
   from disk, and click through it once. Give me that file.
5. Open a pull request with `.github/PULL_REQUEST_TEMPLATE/customer-demo.md` and request review from `wu2305`.

Hard rules:
- The demo uses only the public entries (`marketing-hub`, `marketing-hub/demo`) and its own folder. Never copy the
  static demo's HTML, never load `assets/js`, never copy or restyle a component inside the demo folder.
- Change nothing outside `examples/demos/<name>/`. If the demo needs a component or variant that doesn't exist, use the
  closest existing one, write the gap in `examples/demos/<name>/GAPS.md`, and tell me.
- Don't ask me engineering questions. If a check fails for a reason you can't trace to the demo, or the work
  needs a change outside `examples/demos/<name>/`, stop that item and leave a pull request comment for Wu with the exact
  output. Then continue with the rest.
- Don't put anything in the repository that I've marked confidential.
- Never merge. Never force-push to `main`. Never disable or loosen a check to make it pass.
