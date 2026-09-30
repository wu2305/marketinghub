# Marketing Hub — how to build with this library

**Setup.** There's no provider or theme wrapper. Every component is a plain React function on `window.MarketingHub`, and the styles come from `styles.css`: tokens, `@font-face` rules and all `mh-*` component styles. Components still render without context, but they only look right when `styles.css` is loaded.

**Always set the font on your layout root.** Components set `font-family: var(--mh-font-sans)` on most of their own elements, but not all. Some inner text (pagination labels, dropzone copy, table cells in some organisms) inherits from the page and falls back to the browser's serif if you don't set it:

```jsx
<main style={{ fontFamily: "var(--mh-font-sans)", color: "var(--mh-text-strong)", background: "var(--mh-surface-page)" }}>
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
  - Type: `--mh-font-sans` (DIN 2014, body/UI), `--mh-font-display` (BentonModDisplay italic, headlines), `--mh-font-mono`; sizes `--mh-font-size-xs` to `-display`, weights `--mh-font-weight-light|regular|bold`
  - Text: `--mh-text-strong`, `--mh-text`, `--mh-text-muted`, `--mh-text-faint` (`--mh-text-inverse` on dark surfaces)
  - Surfaces: `--mh-surface-page`, `--mh-surface`, `--mh-surface-subtle`, `--mh-surface-muted`
  - Rules: `--mh-line-subtle`, `--mh-line`, `--mh-line-strong`
  - Brand gold: `--mh-accent` (borders, markers), `--mh-accent-fill` (primary action fill), `--mh-accent-ink` (gold text and links), `--mh-accent-wash`, `--mh-accent-soft`
  - Status: `--mh-success`, `--mh-warning`, `--mh-danger`, `--mh-info`, each with a `-wash` background for `success`/`warning`/`danger`/`info`
  - Overlays: `--mh-scrim`, `--mh-shadow-modal`
  - Layout: `--mh-space-1` to `--mh-space-9`, `--mh-radius-sm|md|lg|pill`

  These roles are the whole token set. There are no component- or page-named tokens; don't invent or look for them.
- `mh-*` class names are internal BEM. Don't add them to your own markup.

**Callbacks receive named objects, not DOM events.** For example: `Button` `onClick({ label })`, `TextInput` `onChange({ name, value })`. Navigation renders a real `<a href>`, and actions render `<button type="button">`.

**Overlays** (`Modal`, `AssistantPanel`, `ReportDetailsDrawer`, `UploadHistory`, `ModelFlowDialog`, `Toast`, `AssistantLauncher`) are `position: fixed` and cover the viewport. Render them at the page root. `Modal`, `AssistantPanel`, `ReportDetailsDrawer`, `UploadHistory` and `Toast` take `open`, plus `onClose` on all but `Toast`. Mount and unmount `ModelFlowDialog` and `AssistantLauncher` instead.

**Where the truth lives.** Before styling, read `styles.css`, which imports `_ds_bundle.css` (every `mh-*` rule and every `--mh-*` token). For each component's props and callback payloads, read its `<Name>.d.ts` and `<Name>.prompt.md`. `window.MarketingHub.demoContent` holds the sample copy and data behind every preview. Use it as a realistic starting point, but pass your own data through props.

**Example:**

```jsx
const { Header, Hero, SectionHeading, MetricStat, Button, demoContent } = window.MarketingHub;

function Dashboard() {
  return (
    <main style={{ fontFamily: "var(--mh-font-sans)", background: "var(--mh-surface-page)", minHeight: "100vh" }}>
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
