/**
 * Negative checks for scripts/visual-check.mjs --negative.
 *
 * Each entry deep-merges its overrides onto a copy of the named base scenario
 * and MUST produce a machine FAIL — they prove the harness cannot be satisfied
 * by the wrong story, wrong args or wrong state. A mutation that passes is a
 * regression in the assertions and fails the --negative run.
 *
 * Fields: id (own id), base (scenario id), story?/original? partial overrides
 * (merged per-key; `args` merges into the base args), reason.
 */
export default [
  {
    id: "neg-p08-wrong-type",
    base: "p08-business-term",
    story: { id: "pages--knowledge-create-analysis" },
    reason: "Analytical Model must not satisfy Business Term form assertions",
  },
  {
    // Pages--campaign renders the campaign workspace, so the Home hero and
    // workspace-card expects can never be satisfied.
    id: "neg-p01-wrong-story",
    base: "p01-home",
    story: { id: "pages--campaign" },
    reason: "wrong story id: campaign page must not satisfy Home assertions",
  },
  {
    // Regression for the old audit hole: the accounts scenario passed while the
    // story actually rendered the Overview Dashboard.
    id: "neg-p06-accounts-overview",
    base: "p06-campaign-accounts",
    story: { args: { section: "overview" } },
    reason: "section=overview must not satisfy Account Binding assertions",
  },
  {
    // Base asserts the 4P overview copy; the city project renders a different
    // live report with different title/KPIs.
    id: "neg-p02-live-wrong-project",
    base: "p02-live-overview",
    story: { args: { project: "city" } },
    reason: "project=city must not satisfy 4P Executive Overview assertions",
  },
  {
    // Base filters Principles by category; the dedicated Business Term view
    // renders term cards instead of principle cards.
    id: "neg-p07-wrong-type",
    base: "p07-principles-category-filter",
    story: { args: { activeType: "Business Term" } },
    reason: "activeType=Business Term must not satisfy Principles filter assertions",
  },
  {
    // The dedicated view has no generic asset rows and no launcher; the
    // overview's type grid must not satisfy its assertions either.
    id: "neg-p07-business-term-overview",
    base: "p07-interpreter-business-term",
    story: { args: { activeType: "overview" } },
    reason: "activeType=overview must not satisfy Business Term card/toolbar assertions",
  },
  {
    // Base clicks the Daily tab; with the default tab (Monthly) still active
    // the "Daily" active-tab assertion must fail.
    id: "neg-p05-default-tab",
    base: "p05-media-tracking-tab",
    story: { actions: [] },
    reason: "default Monthly tab must not satisfy Daily active-tab assertion",
  },
  {
    id: "neg-p11-wrong-tab",
    base: "p11-graph",
    story: { id: "pages--data-model-default" },
    reason: "default Basic information cannot satisfy relationship graph assertions",
  },
  {
    id: "neg-p11-wrong-search",
    base: "p11-search-hit",
    story: { args: { query: "NO_SUCH_MODEL_123" } },
    reason: "empty search cannot satisfy filtered DC Media result and Basic card assertions",
  },
  {
    id: "neg-p10-wrong-category",
    base: "p10-metric-derived-category",
    story: { id: "pages--metric-dictionary" },
    reason: "Basic 7-row story must not satisfy Derived 2-row state",
  },
  {
    id: "neg-p09-wrong-record",
    base: "p09-business-empty-assets",
    story: { id: "pages--knowledge-view-business-term" },
    reason: "Paid Customer has two related rows and cannot satisfy GMV's empty-assets assertion",
  },
  {
    id: "neg-p09-wrong-action",
    base: "p09-model-export-notice",
    story: { id: "pages--knowledge-view-data-model-preview" },
    reason: "Preview notice cannot satisfy Export's result message",
  },
  {
    // Proves the layout check bites: restoring the pre-Batch-D full-width hero
    // on a type page must fail the sidebar/hero/main geometry assertions.
    id: "neg-p07-hero-fullwidth",
    base: "p07-interpreter-principles",
    story: { actions: [{ eval: "document.querySelector('.mh-hero').style.cssText = 'margin-left:0;width:100%'" }] },
    reason: "full-width hero must fail the layout geometry assertions",
  },
  {
    id: "neg-p03-assistant-missing-answer",
    base: "p03-assistant-answer",
    story: { id: "pages--self-service-assistant" },
    reason: "open assistant without a submitted suggestion must not satisfy report-answer assertions",
  },
  {
    id: "neg-p03-assistant-closed",
    base: "p03-assistant-open",
    story: { id: "pages--self-service" },
    reason: "closed Self-Service page must not satisfy open assistant and drawer assertions",
  },
  {
    id: "neg-p03-assistant-escape-left-open",
    base: "p03-assistant-escape-focus",
    story: { id: "pages--self-service-assistant", actions: [] },
    reason: "assistant left open must not satisfy Escape closure and launcher-focus assertions",
  },
];
