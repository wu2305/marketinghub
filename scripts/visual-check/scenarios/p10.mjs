/** P10: metric-dictionary.html effective states. Native alert/prompt UI is
 * represented by deterministic React notices/dialog; original screenshots
 * capture the page after Chromium dismisses native dialogs. */
export default [
  {
    id: "p10-metric-default",
    original: { url: "/assets/pages/metric-dictionary.html", expect: [{ sel: "#metricName", text: "Exposure Count" }, { sel: "#metricList .metric-item", count: 7 }] },
    story: { id: "pages--metric-dictionary", expect: [{ sel: ".mh-metric-page h1", text: "Exposure Count" }, { sel: ".mh-metric-page__list button", count: 7 }] },
  },
  {
    id: "p10-metric-derived-category",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: '.metric-tab[data-category="derived"]' }], expect: [{ sel: "#metricName", text: "Exposure Count" }, { sel: "#metricList .metric-item", count: 2 }] },
    story: { id: "pages--metric-dictionary-derived", expect: [{ sel: ".mh-metric-page h1", text: "Exposure Count" }, { sel: ".mh-metric-page__list button", count: 2 }] },
  },
  {
    id: "p10-metric-derived-detail",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: '.metric-tab[data-category="derived"]' }, { click: '#metricList .metric-item:first-child' }], expect: [{ sel: "#metricName", text: "Effective traffic" }, { sel: "#metricStatus", text: "Draft" }] },
    story: { id: "pages--metric-dictionary-derived-detail", expect: [{ sel: ".mh-metric-page h1", text: "Effective traffic" }, { sel: ".mh-metric-page__status", text: "Draft" }] },
  },
  {
    id: "p10-metric-formula",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: '.metric-detail-tab[data-tab="formula"]' }], expect: [{ sel: "#formulaTab.active .metric-formula-box", text: "fact_promotion_daily.exposure_count" }] },
    story: { id: "pages--metric-dictionary-formula", expect: [{ sel: ".mh-metric-page__formula", text: "fact_promotion_daily.exposure_count" }] },
  },
  {
    id: "p10-metric-dimensions",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: '.metric-detail-tab[data-tab="dimensions"]' }], expect: [{ sel: "#dimensionsTab.active .metric-dim-list", text: "dim_channel.channel_name" }] },
    story: { id: "pages--metric-dictionary-dimensions", expect: [{ sel: ".mh-metric-page__dimension-grid", text: "dim_channel.channel_name" }] },
  },
  {
    id: "p10-metric-add-derived",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: "#addDerivedMetricBtn" }, { wait: "#derivedMetricPanel.open" }], expect: [{ sel: "#derivedMetricPanel.open .derived-ref-title", text: "REFERENCEABLE BASIC METRICS" }, { sel: "#derivedRefList .derived-ref-item", count: 7 }] },
    story: { id: "pages--metric-dictionary-add-derived", expect: [{ sel: ".mh-derived-panel__references h3", text: "REFERENCEABLE BASIC METRICS" }, { sel: ".mh-derived-panel__reference", count: 7 }] },
  },
  {
    id: "p10-metric-formula-tokens",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ eval: "window.showToast = () => {}" }, { click: "#addDerivedMetricBtn" }, { click: "#derivedRefList .derived-ref-item:first-child" }, { click: '.derived-formula-op[data-op="+"]' }], expect: [{ sel: "#derivedFormulaDisplay .derived-formula-token", count: 2 }, { sel: "#derivedFormulaDisplay", text: "Exposure Count" }] },
    story: { id: "pages--metric-dictionary-formula-tokens", expect: [{ sel: ".mh-derived-panel__token", count: 2 }, { sel: ".mh-derived-panel__tokens", text: "Exposure Count" }] },
  },
  {
    id: "p10-metric-name-required",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: "#addDerivedMetricBtn" }, { press: ["#derivedSaveBtn", "Enter"] }], expect: [{ sel: "#derivedMetricPanel.open", text: "Add Derived Metric" }, { sel: "#derivedMetricName" }] },
    story: { id: "pages--metric-dictionary-name-required", expect: [{ sel: ".mh-derived-panel__notice", text: "Please enter a metric name." }] },
  },
  {
    id: "p10-metric-test-empty",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: "#addDerivedMetricBtn" }, { click: "#derivedTestBtn" }], expect: [{ sel: "#derivedMetricPanel.open", text: "Test Run" }] },
    story: { id: "pages--metric-dictionary-test-empty", expect: [{ sel: ".mh-derived-panel__notice", text: "Please build a formula first." }] },
  },
  {
    id: "p10-metric-test-result",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ eval: "window.showToast = () => {}" }, { click: "#addDerivedMetricBtn" }, { click: "#derivedRefList .derived-ref-item:first-child" }, { click: "#derivedTestBtn" }], expect: [{ sel: "#derivedFormulaDisplay .derived-formula-token", count: 1 }, { sel: "#derivedMetricPanel.open", text: "Test Run" }] },
    story: { id: "pages--metric-dictionary-test-result", expect: [{ sel: ".mh-derived-panel__notice", text: "42.86" }] },
  },
  {
    id: "p10-metric-save-empty-formula",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ eval: "window.showToast = () => {}" }, { click: "#addDerivedMetricBtn" }, { fill: ["#derivedMetricName", "New metric"] }, { press: ["#derivedSaveBtn", "Enter"] }], expect: [{ sel: "#metricName", text: "New metric" }, { sel: "#metricList .metric-item", count: 3 }] },
    story: { id: "pages--metric-dictionary-saved", expect: [{ sel: ".mh-metric-page h1", text: "New metric" }, { sel: ".mh-metric-page__list button", count: 3 }] },
  },
  {
    id: "p10-assistant-open",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { wait: "#assistantPanel:not([hidden])" }], expect: [{ sel: "#assistantPanel", text: "Ask a question" }, { sel: ".global-ai-launcher", state: "hidden" }] },
    story: { id: "pages--metric-dictionary-assistant", expect: [{ sel: ".mh-assistant", text: "Ask a question" }, { sel: ".mh-launcher", state: "hidden" }] },
  },
  {
    id: "p10-assistant-prompt",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { click: '.ask-suggestion:first-child' }], expect: [{ sel: "#promptCanvas", text: "Definition of Attributed ROI" }, { sel: "#sendQuery:not([disabled])" }] },
    story: { id: "pages--metric-dictionary-assistant-prompt", expect: [{ sel: ".mh-assistant__send .mh-button:not([disabled])", text: "ASK" }] },
  },
  {
    id: "p10-assistant-answer",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { fill: ["#promptCanvas", "Definition of Attributed ROI"] }, { click: "#sendQuery" }], expect: [{ sel: "#answerFeed .answer-card", text: "I will use the AI Interpreter knowledge context to answer:" }] },
    story: { id: "pages--metric-dictionary-assistant-answer", expect: [{ sel: ".mh-assistant__answer--simple", text: "I will use the AI Interpreter knowledge context to answer:" }] },
  },
  {
    id: "p10-assistant-history",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { click: "#aiHistory" }], expect: [{ sel: "#aiRecentHistoryPopup:not([hidden])", text: "Summarize the latest media tracking performance." }] },
    story: { id: "pages--metric-dictionary-assistant-history", expect: [{ sel: ".mh-assistant__history-pop", text: "Summarize the latest media tracking performance." }] },
  },
  {
    id: "p10-assistant-history-pick",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { click: "#aiHistory" }, { click: "#aiRecentHistoryPopup .ai-recent-chat:first-of-type" }], expect: [{ sel: "#promptCanvas", text: "Summarize the latest media tracking performance." }, { sel: "#sendQuery:not([disabled])" }] },
    story: { id: "pages--metric-dictionary-assistant-history-pick", expect: [{ sel: ".mh-assistant__send .mh-button:not([disabled])", text: "ASK" }] },
  },
  {
    id: "p10-assistant-expanded",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { click: "#aiMaximize" }], expect: [{ sel: "#assistantPanel.is-ai-expanded", text: "Ask AI Interpreter" }, { sel: "#aiMaximize", attr: { name: "aria-label", value: "Restore" } }] },
    story: { id: "pages--metric-dictionary-assistant-expanded", expect: [{ sel: ".mh-assistant--expanded", text: "Ask AI Interpreter" }, { sel: '.mh-assistant [aria-label="Restore"]', attr: { name: "aria-label", value: "Restore" } }] },
  },
  {
    id: "p10-assistant-skill-menu",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { click: "#uploadFile" }], expect: [{ sel: "#aiSkillMenu:not([hidden])", text: "Analytical Model" }] },
    story: { id: "pages--metric-dictionary-assistant-skill-menu", expect: [{ sel: ".mh-skill", text: "Analytical Model" }] },
  },
  {
    id: "p10-assistant-skill-selected",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { click: "#uploadFile" }, { click: ".ai-skill-category >> nth=1" }, { wait: ".ai-skill-detail-panel:not([hidden])" }, { click: ".ai-skill-option:has-text('Opportunity scan')" }], expect: [{ sel: ".ai-skill-chip:not([hidden])", text: "Analytical Model: Opportunity scan playbook" }] },
    story: { id: "pages--metric-dictionary-assistant-skill-selected", expect: [{ sel: ".mh-assistant__chip", text: "Analytical Model: Opportunity scan playbook" }] },
  },
  {
    id: "p10-model-history",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { click: "#uploadFile" }, { click: ".ai-skill-category >> nth=1" }, { wait: ".ai-skill-detail-panel:not([hidden])" }, { click: "[data-ai-skill-action='history']" }], expect: [{ sel: "#aiHistoryGenerateDialog", text: "Select Conversations" }] },
    story: { id: "pages--metric-dictionary-model-history", expect: [{ sel: ".mh-flow__card--history", text: "Select Conversations" }] },
  },
  {
    id: "p10-model-manual",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { click: "#uploadFile" }, { click: ".ai-skill-category >> nth=1" }, { wait: ".ai-skill-detail-panel:not([hidden])" }, { click: "[data-ai-skill-action='manual']" }], expect: [{ sel: "#aiGeneratedModelDialog", text: "Create Analytical Model Manually" }] },
    story: { id: "pages--metric-dictionary-model-manual", expect: [{ sel: ".mh-flow__card--form", text: "Create Analytical Model Manually" }] },
  },
  {
    id: "p10-model-generated",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".global-ai-launcher" }, { click: "#uploadFile" }, { click: ".ai-skill-category >> nth=1" }, { wait: ".ai-skill-detail-panel:not([hidden])" }, { click: "[data-ai-skill-action='history']" }, { click: "[data-ai-generate-model]" }], expect: [{ sel: "#aiGeneratedModelDialog", text: "New Analytical Model" }] },
    story: { id: "pages--metric-dictionary-model-generated", expect: [{ sel: ".mh-flow__card--form", text: "New Analytical Model" }] },
  },
  {
    id: "p10-metric-constant-prompt",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: "#addDerivedMetricBtn" }, { click: '.derived-formula-op[data-op="const"]' }], expect: [{ sel: "#derivedMetricPanel.open", text: "Add Derived Metric" }] },
    story: { id: "pages--metric-dictionary-constant", expect: [{ sel: ".mh-modal", text: "Enter a constant value" }] },
  },
  {
    id: "p10-metric-qa-disabled",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: ".metric-toggle" }], expect: [{ sel: "#metricQaToggle:not(:checked)", state: "attached", count: 1 }] },
    story: { id: "pages--metric-dictionary-qa-disabled", expect: [{ sel: ".mh-metric-page__toggle input:not(:checked)", count: 1 }] },
  },
  {
    id: "p10-metric-dimension-disabled",
    original: { url: "/assets/pages/metric-dictionary.html", actions: [{ click: '.metric-detail-tab[data-tab="dimensions"]' }, { click: "#dimensionsTab .metric-dim-list .metric-dim-item:first-child .metric-dim-toggle" }], expect: [{ sel: "#dimensionsTab .metric-dim-list input:not(:checked)", state: "attached", count: 1 }] },
    story: { id: "pages--metric-dictionary-dimension-disabled", expect: [{ sel: ".mh-metric-page__dimension-grid input:not(:checked)", count: 1 }] },
  },
];
