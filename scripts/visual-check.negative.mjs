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
  { id: "neg-p17-wrong-record", base: "p17-known", story: { id: "pages--scenario-edit" }, reason: "HTML City Comparison defaults cannot satisfy known Campaign Review fields and corrected scope" },
  { id: "neg-p17-missing-preview", base: "p17-preview", story: { id: "pages--scenario-edit" }, reason: "Unrun form cannot satisfy the generated preview" },
  { id: "neg-p17-missing-validation", base: "p17-required", story: { id: "pages--scenario-edit-known" }, reason: "Valid seeded form cannot satisfy five required-field errors" },
  {
    id: "neg-p04-import-closed",
    base: "p04-data-upload-import",
    story: { id: "pages--data-upload", actions: [] },
    reason: "Closed default upload page cannot satisfy the Template Import dialog assertions",
  },
  { id: "neg-p14-wrong-category", base: "p14-analysis", story: { id: "pages--personal-memory" }, reason: "All eighteen memories cannot satisfy six Analysis cards" },
  { id: "neg-p14-missing-detail", base: "p14-detail", story: { id: "pages--personal-memory" }, reason: "Empty detail cannot satisfy selected memory description" },
  { id: "neg-p14-missing-create-errors", base: "p14-create-errors", story: { id: "pages--personal-memory-create" }, reason: "Untouched create form cannot satisfy required-field errors" },
  {
    id: "neg-p15-wrong-filter",
    base: "p15-draft",
    story: { id: "pages--scenario-library-published" },
    reason: "Published's four rows cannot satisfy the Draft single-row assertions",
  },
  {
    id: "neg-p15-missing-preview",
    base: "p15-preview",
    story: { id: "pages--scenario-library-detail" },
    reason: "Closed example preview cannot satisfy the expanded output assertions",
  },
  { id: "neg-p16-wrong-record", base: "p16-known-record", story: { id: "pages--scenario-detail" }, reason: "City Comparison cannot satisfy Campaign Review record identity and governance assertions" },
  { id: "neg-p16-wrong-tab", base: "p16-ai-check", story: { id: "pages--scenario-detail-related" }, reason: "Related Objects cannot satisfy AI Check fields and panel assertions" },
  { id: "neg-p16-missing-preview", base: "p16-preview", story: { id: "pages--scenario-detail" }, reason: "Closed Content preview cannot satisfy expanded question, output and aria state" },
  { id: "neg-p16-assistant-closed", base: "p16-assistant-open", story: { id: "pages--scenario-detail" }, reason: "Closed launcher state cannot satisfy open lite assistant assertions" },
  {
    id: "neg-p12-wrong-tab",
    base: "p12-approved",
    story: { id: "pages--review-center" },
    reason: "Pending six-row queue cannot satisfy Approved 21-row assertions",
  },
  {
    id: "neg-p12-wrong-search",
    base: "p12-search",
    story: { actions: [{ fill: [".mh-library-toolbar input[type='search']", "no matching review"] }] },
    reason: "A search that matches nothing cannot satisfy Campaign ROI search result assertions",
  },
  {
    id: "neg-p12-missing-answer",
    base: "p12-assistant-answer",
    story: { id: "pages--review-center-assistant" },
    reason: "Open lite assistant without Ask cannot satisfy answer assertions",
  },
  {
    id: "neg-p12-escape-left-open",
    base: "p12-assistant-escape",
    story: { actions: [] },
    reason: "Assistant left open cannot satisfy Escape closure and launcher assertions",
  },
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
    // The overview's type grid must not satisfy Business Term card and
    // toolbar assertions; the assistant launcher is visible in both views.
    id: "neg-p07-business-term-overview",
    base: "p07-interpreter-business-term",
    story: { args: { activeType: "overview" } },
    reason: "activeType=overview must not satisfy Business Term card/toolbar assertions",
  },
  {
    // The named Daily story starts on Daily; swapping in the default Monthly
    // story must fail its active-tab assertion.
    id: "neg-p05-default-tab",
    base: "p05-media-tracking-tab",
    story: { id: "pages--media-tracking-detail", actions: [] },
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
  {
    id: "neg-p07-assistant-closed",
    base: "p07-assistant-open",
    story: { id: "pages--interpreter" },
    reason: "closed Interpreter page must not satisfy open knowledge drawer assertions",
  },
  {
    id: "neg-p07-assistant-missing-answer",
    base: "p07-assistant-answer",
    story: { id: "pages--interpreter-assistant" },
    reason: "open knowledge assistant without a submitted suggestion must not satisfy answer assertions",
  },
  {
    id: "neg-p07-assistant-escape-left-open",
    base: "p07-assistant-escape-focus",
    story: { id: "pages--interpreter-assistant", actions: [] },
    reason: "knowledge assistant left open must fail Escape closure and launcher focus assertions",
  },
  {
    id: "neg-p13-wrong-type",
    base: "p13-down",
    story: { id: "pages--feedback-quality", actions: [{ select: ['.mh-library-toolbar__facet:has-text("Feedback Type") select', "thumbs-up"] }] },
    reason: "selecting Thumbs Up (ten records) cannot satisfy the five-record Thumbs Down state",
  },
  {
    id: "neg-p13-wrong-detail",
    base: "p13-negative-detail",
    story: { id: "pages--feedback-quality-positive-detail" },
    reason: "positive feedback has no reason section and cannot satisfy negative detail",
  },
  {
    id: "neg-p13-assistant-closed",
    base: "p13-assistant-guard-correction",
    story: { id: "pages--feedback-quality" },
    reason: "closed React default cannot satisfy the restored assistant-open assertion",
  },
];
