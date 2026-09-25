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
    story: { id: "pages--metric-dictionary-formula-tokens", expect: [{ sel: ".mh-derived-panel__token", count: 3 }, { sel: ".mh-derived-panel__tokens", text: "Exposure Count" }] },
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
];
