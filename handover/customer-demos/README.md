# Customer demo pages: building a demo site from the Storybook components

This is the procedure for when the designer (not an engineer) wants a demo for a customer: a few pages
that look and behave like the product, with the customer's name, logo, wording and sample data. The
pages are assembled from the components and demo flows that Storybook documents. It is written for
whichever LLM agent does the work, normally the designer's own agent. `AGENTS.md` still applies, but
this work does not change the design system: it only adds a folder under `examples/demos/`.

Designer-facing instructions are in `designer-guide.md`. The paste-in kickoff prompt is `llm-prompt.md`.
Wiring for each page is in `page-recipes.md`. Updating the static demo bundle and syncing Storybook
to it is a different job (`handover/design-sync/README.md`); do that first if both are needed.

## What you get

- `examples/demos/<name>/`: the demo's source. `content.js` holds what is the customer's (brand, copy,
  data), `App.jsx` holds the list of pages and how each is wired, and `index.html` / `main.jsx` start it.
- `npm run demo build <name>`: `demo-dist/<name>/index.html`, **one self-contained file**. It opens from a
  double click, an email attachment or any static host. `demo-dist/` is git-ignored; the source in
  `examples/demos/<name>/` is the record, and the file can be rebuilt at any time.
- The pages are the product's own pages. Navigation, search, tabs, dialogs, the assistants and forms work the
  way they do in Storybook's `Pages` stories. The business behind them is simulated with fixed, local
  answers (the `useXxxDemo` hooks from `marketing-hub/demo`). Nothing is saved or sent anywhere.

## The all-pages demo

`examples/demos/showcase/` is a reference site with every page the repository still builds: the nine current pages
and eight pages the product owner retired on 2026-10-09 (`knowledge-view`, `metric-dictionary`, `review-center`,
`feedback-quality`, `personal-memory`, `scenario-library`, `scenario-detail`, `scenario-edit`). The retired pages
keep their source and tests but have no Storybook story, and they are not part of the current product. Build the
showcase with `npm run demo build showcase` to see every page working together. For a customer demo, start from
the **nine current pages** (`home`, `cockpit`, `self-service`, `data-upload`, `media-tracking-detail`, `campaign`,
`interpreter`, `knowledge-create`, `data-model`): `npm run demo new <name>`, then copy the `XxxRoute` functions and
route lines you need from `showcase/App.jsx` instead of from `examples/host/main.jsx`. Add a retired page only when
the designer's brief asks for it and she confirms it.
`showcase/showcase.test.jsx` opens every page, every Cockpit project and dashboard, every Interpreter type and every
create form, and runs one assistant exchange, so a page that crashes on open or after one click fails `npm test`.

## Commands

```
npm ci                       once per fresh checkout
npm run demo list            the demos that exist
npm run demo new <name>      copy the template to examples/demos/<name> (lowercase, dashes, e.g. acme-retail)
npm run demo dev <name>      live preview (http://127.0.0.1:5180), reloads on every edit
npm run demo build <name>    build the single file
npm test                     includes every demo: each page in the navigation must open
```

## Steps

1. **Ask the designer for the brief**, in product terms: who the customer is, which pages they will visit
   and in what order (the story of the demo), which customer-specific wording, numbers, names and logo
   to show. Ask one question at a time, with options and your recommendation. Do not ask engineering
   questions.
2. **Branch** `customer-demo/<yyyy-mm-dd>-<name>` from the latest `origin/main`, then `npm run demo new <name>`.
3. **Choose the pages.** The template starts with Home, Marketing Cockpit and AI Interpreter. Keep the pages in
   the story, and add others from `page-recipes.md` (copy the named `XxxRoute` function from
   `examples/host/main.jsx` and change its first lines as the recipe says, then add one line to `routes` in
   `App.jsx`). Top navigation and Home cards only show pages that are in `routes`.
4. **Put the customer's content in `content.js`.** Import a default constant from `marketing-hub/demo`, spread it
   and override only what differs (`{ ...HOME.hero, title: "Acme Portal" }`). To see a complete replacement
   data set that is known to work, read `src/design/demo/__fixtures__/alt-cockpit.js` and
   `alt-business-terms.js` (read only; copy what you need into the demo folder). Customer images: keep them in
   the demo folder and `import logo from "./logo.png"`; the build embeds them.
5. **Look at it.** Run `npm run demo dev <name>`, go through the story's pages as the customer will, and take
   screenshots at 1440 px and 390 px wide. Check the things a customer will click: navigation, the
   assistant, one dialog or form, a filter or tab. Show the designer and ask for pass or what looks wrong.
   You judge whether it works; she judges whether it looks right. Fix what she flags in `content.js` or `App.jsx`.
6. **Gate.** `npm run lint && npm test && npm run demo build <name>`, then open the built file from disk (not from
   the dev server) and click through it once.
7. **Deliver.** Open a pull request with the template `.github/PULL_REQUEST_TEMPLATE/customer-demo.md`
   and request review from `wu2305`. Give the designer the built `index.html` (attach the file, or say where it
   is on the machine). Never merge.

## Rules

- Import only from `react`, `react-dom/client`, `marketing-hub`, `marketing-hub/demo` and files inside the demo
  folder. `examples/demos/demos.test.jsx` fails on anything else, and on `iframe`, `dangerouslySetInnerHTML`
  or `assets/js`. The same spirit as AGENTS §2.2 applies: no copying the static demo's HTML, no loading its
  scripts.
- **Do not edit `src/design`, `.storybook`, `scripts/`, `package*.json`, CI, `examples/host` or the static
  demo** for a customer demo. A customer demo is not a reason to change the product's components.
- Do not copy or restyle a component inside the demo folder to get a look. Colours, fonts, spacing and radii come from the
  components. If the page needs something they cannot do (a missing variant, a control that does not exist), write it
  in `examples/demos/<name>/GAPS.md` (what the customer would see, what is missing) and tell the designer; use the
  closest existing component meanwhile. Wu decides whether it becomes a component.
- Real customer data: the designer decides what goes into the repository. Ask before using names, numbers
  or logos that look confidential; the repository history keeps them.
- Only the pages in `routes` exist. A page that is not included shows "This page is not part of this demo" if
  reached by a link; prefer leaving the link out (remove the card or the nav item).
- Every navigation starts the page fresh: an open assistant or half-filled form is reset when the customer moves
  to another page. That is intended for a demo.

## When something doesn't work

| symptom | what to do |
|---|---|
| a page renders blank or throws | you passed a prop the page did not expect; compare with the same `XxxRoute` in `examples/host/main.jsx` and with the page's story args |
| a link goes to a "not part of this demo" page | add the page to `routes`, or remove the link |
| `npm test` fails in `examples/demos` | read the test name: a navigation page that does not open, or a forbidden import |
| the build fails, or needs a change outside `examples/demos/` | stop, leave a pull request comment for Wu with the exact output, and carry on with other pages |
| the page looks different from Storybook | it should not; check that the content is a spread of the default and that nothing wraps the page in extra styles |
