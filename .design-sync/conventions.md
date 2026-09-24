# Marketing Hub — how to build with this library

**Setup.** There's no provider or theme wrapper. Every component is a plain React function on `window.MarketingHub`, and the styles come from `styles.css`: tokens, `@font-face` rules and all `mh-*` component styles. Components still render without context, but they only look right when `styles.css` is loaded.

**Always set the font on your layout root.** Components set `font-family: var(--mh-font)` on most of their own elements, but not all. Some inner text (pagination labels, dropzone copy, table cells in some organisms) inherits from the page and falls back to the browser's serif if you don't set it:

```jsx
<main style={{ fontFamily: "var(--mh-font)", color: "var(--mh-ink)", background: "var(--mh-page-bg)" }}>
```

**Styling idiom: props first, tokens for your own glue.**
- Components take content, state props, `children` and callbacks. They take no `className`/`style` props. Change their look with the enum props:
  - `Button` `variant`: primary | gold | secondary | quiet | danger, `size`: sm | md | lg
  - `MetricStat` `variant`: card | glass, `accent`: gold | green | amber | blue | red
  - `Tabs` `variant`: underline | segmented
  - `Hero` `variant`: banner | home | knowledge
  - `Header` `tone`: solid | overlay, `position`: sticky | fixed
  - `Modal` `variant`: modal | sheet | drawer
  - `SearchField` `variant`: field | plain
  - `AssistantPanel` `placement`: modal | drawer
- For your own layout (page grids, spacing wrappers), use the `--mh-*` CSS variables. Never hard-code hex colors. The core palette:
  - Type: `--mh-font` (DIN 2014, body/UI) and `--mh-display` (BentonModDisplay italic, headlines)
  - Ink and copy: `--mh-ink`, `--mh-copy`, `--mh-muted`, `--mh-faint`
  - Surfaces: `--mh-bg`, `--mh-bg-soft`, `--mh-surface`, `--mh-page-bg`
  - Rules: `--mh-line`, `--mh-line-strong`
  - Brand gold: `--mh-gold`, `--mh-gold-deep`, `--mh-gold-text`
  - Status: `--mh-green`, `--mh-red`, `--mh-amber`, `--mh-blue`
  - Overlays: `--mh-scrim`, `--mh-modal-shadow`

  Prefixed families (`--mh-copilot-*`, `--mh-reports-*`, `--mh-sc-*`, `--mh-bt-*`, ...) belong to single components. Don't reuse them.
- `mh-*` class names are internal BEM. Don't add them to your own markup.

**Callbacks receive named objects, not DOM events.** For example: `Button` `onClick({ label })`, `TextInput` `onChange({ name, value })`. Navigation renders a real `<a href>`, and actions render `<button type="button">`.

**Overlays** (`Modal`, `AssistantPanel`, `ReportDetailsDrawer`, `UploadHistory`, `ModelFlowDialog`, `Toast`, `AssistantLauncher`) are `position: fixed` and cover the viewport. Render them at the page root. `Modal`, `AssistantPanel`, `ReportDetailsDrawer`, `UploadHistory` and `Toast` take `open`, plus `onClose` on all but `Toast`. Mount and unmount `ModelFlowDialog` and `AssistantLauncher` instead.

**Where the truth lives.** Before styling, read `styles.css`, which imports `_ds_bundle.css` (every `mh-*` rule and every `--mh-*` token). For each component's props and callback payloads, read its `<Name>.d.ts` and `<Name>.prompt.md`. `window.MarketingHub.demoContent` holds the sample copy and data behind every preview. Use it as a realistic starting point, but pass your own data through props.

**Example:**

```jsx
const { Header, Hero, SectionHeading, MetricStat, Button, demoContent } = window.MarketingHub;

function Dashboard() {
  return (
    <main style={{ fontFamily: "var(--mh-font)", background: "var(--mh-page-bg)", minHeight: "100vh" }}>
      <Header logo={demoContent.LOGO} items={demoContent.NAV} current="home" />
      <section style={{ padding: "32px 48px", display: "grid", gap: 24 }}>
        <SectionHeading eyebrow="Workspaces" title="Enter the work that matters" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <MetricStat label="Report center" value="12" caption="governed reports" accent="gold" />
          <MetricStat label="Active campaigns" value="24" caption="live in market" accent="green" />
          <MetricStat label="Data issues" value="3" caption="needs review" accent="red" />
        </div>
        <div><Button variant="gold" onClick={({ label }) => console.log(label)}>Create Campaign Task</Button></div>
      </section>
    </main>
  );
}
```
