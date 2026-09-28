/** P11 standalone Data Model uses the same browser runtime as P07, with its own shell. */
const source = (query = "?type=Data%20Model") => `/assets/pages/data-model.html${query}`;
const graphOriginal = [{ waitMs: 200 }, { press: [".dm-domain-tab[data-tab='graph']", "Enter"] }, { waitMs: 250 }];
const graphStory = (id = "graph", expect = [], actions = []) => ({ id: `pages--data-model-${id}`, actions, expect });
const graphBefore = (selector) => ({ eval: `window.__p11GraphBefore = document.querySelector(${JSON.stringify(selector)})?.style.transform; if (!window.__p11GraphBefore) throw new Error('graph has no initial transform')` });
const graphChanged = (selector) => ({ eval: `const next = document.querySelector(${JSON.stringify(selector)})?.style.transform; if (!next || next === window.__p11GraphBefore) throw new Error('graph transform did not change')` });
const graphRestored = (selector) => ({ eval: `const next = document.querySelector(${JSON.stringify(selector)})?.style.transform; if (next !== window.__p11GraphBefore) throw new Error('fit did not restore graph transform')` });

export default [
  {
    id: "p11-default",
    original: { url: source(), expect: [
      { sel: ".dm-domain-card", count: 3 }, { sel: ".dm-domain-card.active", text: "D2C Insight" },
      { sel: ".dm-domain-tab.active", text: "Basic information" }, { sel: ".dm-basic-name-row strong", text: "D2C Insight" },
      { sel: ".dm-related-report", count: 3 }, { sel: "#assistantPanel,#aiEntry", count: 0, state: "detached" },
    ] },
    story: graphStory("default", [
      { sel: ".mh-dmview__domains .mh-library-item", count: 3 }, { sel: ".mh-dmview__domains .mh-library-item--selected", text: "D2C Insight" },
      { sel: ".mh-dmview__domains .mh-library-item .mh-badge", count: 3 },
      { sel: ".mh-dmview__tab.is-active", text: "Basic information" }, { sel: ".mh-dmview__basic-name strong", text: "D2C Insight" },
      { sel: ".mh-dmview__report", count: 3 }, { sel: ".mh-assistant,.mh-launcher", count: 0, state: "detached" },
    ]),
  },
  {
    id: "p11-type-normalized",
    original: { url: source("?foo=kept&type=Other"), actions: [{ eval: "const params = new URLSearchParams(location.search); if (params.get('type') !== 'Data Model' || params.get('foo') !== 'kept') throw new Error('source URL did not normalize type while preserving foo')" }], expect: [{ sel: ".dm-domain-card.active", text: "D2C Insight" }] },
    story: graphStory("default", [{ sel: ".mh-dmview__domains .mh-library-item--selected", text: "D2C Insight" }]),
  },
  {
    id: "p11-domain",
    original: { url: source(), actions: [{ click: ".dm-domain-card:nth-child(2)" }], expect: [
      { sel: ".dm-domain-card.active", text: "DC Media Performance" }, { sel: ".dm-basic-name-row strong", text: "DC Media Performance" },
      { sel: ".dm-related-report", count: 1 },
    ] },
    story: graphStory("domain", [
      { sel: ".mh-dmview__domains .mh-library-item--selected", text: "DC Media Performance" },
      { sel: ".mh-dmview__basic-name strong", text: "DC Media Performance" }, { sel: ".mh-dmview__report", count: 1 },
    ]),
  },
  {
    id: "p11-search-hit",
    original: { url: source(), actions: [{ fill: ["#dmDomainSearch", "ABO"] }], expect: [
      { sel: ".dm-domain-card", count: 1, text: "DC Media Performance" },
      { sel: ".dm-domain-card.active", text: "DC Media Performance" }, { sel: ".dm-basic-name-row strong", text: "DC Media Performance" },
    ] },
    story: graphStory("search-hit", [
      { sel: ".mh-dmview__domains .mh-library-item", count: 1, text: "DC Media Performance" },
      { sel: ".mh-dmview__domains .mh-library-item--selected", text: "DC Media Performance" }, { sel: ".mh-dmview__basic-name strong", text: "DC Media Performance" },
    ]),
  },
  {
    id: "p11-search-empty",
    original: { url: source(), actions: [{ fill: ["#dmDomainSearch", "NO_SUCH_MODEL_123"] }], expect: [
      { sel: ".dm-domain-card", count: 0, state: "detached" }, { sel: ".dm-empty", text: "No matching data models." },
      { sel: ".dm-basic-name-row strong", text: "D2C Insight" },
    ] },
    story: graphStory("search-empty", [
      { sel: ".mh-dmview__domains .mh-library-item", count: 0, state: "detached" }, { sel: ".mh-dmview__domains .mh-library-empty", text: "No matching data models." },
      { sel: ".mh-dmview__basic-name strong", text: "D2C Insight" },
    ]),
  },
  {
    id: "p11-related-inert",
    original: { url: source(), actions: [{ click: ".dm-related-report:first-child" }], expect: [
      { sel: ".dm-related-report:first-child", text: "City Strategy" }, { sel: ".dm-table-drawer.open", count: 0, state: "detached" },
      { sel: ".fm-overlay:not([hidden])", count: 0, state: "detached" },
    ] },
    story: graphStory("default", [
      { sel: ".mh-dmview__report:first-child", text: "City Strategy" }, { sel: ".mh-dmview__dialog", count: 0, state: "detached" },
      { sel: ".mh-modal--drawer", count: 0, state: "detached" },
    ], [{ click: ".mh-dmview__report:first-child" }]),
  },
  {
    id: "p11-graph",
    original: { url: source(), actions: graphOriginal, expect: [
      { sel: ".dm-domain-tab.active", text: "Relationship graph" }, { sel: ".dm-graph-node", count: 6 },
      { sel: ".dm-graph-node.is-fact", count: 1 }, { sel: ".dm-graph-tools button", count: 3 },
    ] },
    story: graphStory("graph", [
      { sel: ".mh-dmview__tab.is-active", text: "Relationship graph" }, { sel: ".mh-dmview__node", count: 6 },
      { sel: ".mh-dmview__node.is-fact", count: 1 }, { sel: ".mh-dmview__graph-tools button", count: 3 },
    ]),
  },
  {
    id: "p11-zoom",
    original: { url: source(), actions: [...graphOriginal, graphBefore(".dm-graph-viewport"), { click: "[data-graph-action='in']" }, graphChanged(".dm-graph-viewport")], expect: [
      { sel: ".dm-graph-node", count: 6 }, { sel: ".dm-graph-viewport[style*='scale']" },
    ] },
    story: graphStory("graph", [
      { sel: ".mh-dmview__node", count: 6 }, { sel: ".mh-dmview__viewport[style*='scale']" },
    ], [graphBefore(".mh-dmview__viewport"), { click: ".mh-dmview__graph-tools button:first-child" }, graphChanged(".mh-dmview__viewport")]),
  },
  {
    id: "p11-fit",
    original: { url: source(), actions: [...graphOriginal, graphBefore(".dm-graph-viewport"), { click: "[data-graph-action='in']" }, graphChanged(".dm-graph-viewport"), { click: "[data-graph-action='fit']" }, graphRestored(".dm-graph-viewport")], expect: [
      { sel: ".dm-graph-node", count: 6 }, { sel: ".dm-graph-tools button", count: 3 },
    ] },
    story: graphStory("graph", [
      { sel: ".mh-dmview__node", count: 6 }, { sel: ".mh-dmview__graph-tools button", count: 3 },
    ], [graphBefore(".mh-dmview__viewport"), { click: ".mh-dmview__graph-tools button:first-child" }, graphChanged(".mh-dmview__viewport"), { click: ".mh-dmview__graph-tools button:last-child" }, graphRestored(".mh-dmview__viewport")]),
  },
  {
    id: "p11-pan",
    original: { url: source(), actions: [...graphOriginal, graphBefore(".dm-graph-viewport"), { drag: [".dm-graph-canvas", 80, 40] }, graphChanged(".dm-graph-viewport")], expect: [
      { sel: ".dm-graph-node", count: 6 }, { sel: ".dm-graph-canvas" },
    ] },
    story: graphStory("graph", [
      { sel: ".mh-dmview__node", count: 6 }, { sel: ".mh-dmview__canvas" },
    ], [graphBefore(".mh-dmview__viewport"), { drag: [".mh-dmview__canvas", 80, 40] }, graphChanged(".mh-dmview__viewport")]),
  },
  {
    id: "p11-fact-fields",
    original: { url: source(), actions: [...graphOriginal, { click: ".dm-graph-node.is-fact" }], expect: [
      { sel: ".dm-table-drawer.open" }, { sel: ".dm-table-type.is-fact", text: "Fact" },
      { sel: ".dm-fields-table th:has-text('Unit')" }, { sel: ".dm-fields-table .dm-field-code:has-text('sales_amount')" },
    ] },
    story: graphStory("fact-fields", [
      { sel: ".mh-dmview__dialog" }, { sel: ".mh-dmview__table-type.is-fact", text: "Fact" },
      { sel: ".mh-dmview__table th:has-text('Unit')" }, { sel: ".mh-dmview__field-code:has-text('sales_amount')" },
    ]),
  },
  {
    id: "p11-dimension-fields",
    original: { url: source(), actions: [...graphOriginal, { click: ".dm-graph-node.is-dimension:nth-of-type(2)" }], expect: [
      { sel: ".dm-table-drawer.open" }, { sel: ".dm-table-type.is-dimension", text: "Dimension" },
      { sel: ".dm-fields-table th:has-text('Unit')", count: 0, state: "detached" },
    ] },
    story: graphStory("dimension-fields", [
      { sel: ".mh-dmview__dialog" }, { sel: ".mh-dmview__table-type.is-dimension", text: "Dimension" },
      { sel: ".mh-dmview__table th:has-text('Unit')", count: 0, state: "detached" },
    ]),
  },
  {
    id: "p11-preview",
    original: { url: source(), actions: [...graphOriginal, { click: ".dm-graph-node.is-fact" }, { click: "[data-dm-table-tab='preview']" }], expect: [
      { sel: ".dm-table-dialog-tab.is-active", text: "Data Preview" }, { sel: ".dm-preview-table tbody tr", count: 10 },
    ] },
    story: graphStory("preview", [
      { sel: ".mh-dmview__dialog-tab.is-active", text: "Data Preview" }, { sel: ".mh-dmview__dialog tbody tr", count: 10 },
    ]),
  },
  {
    id: "p11-close",
    original: { url: source(), actions: [...graphOriginal, { click: ".dm-graph-node.is-fact" }, { click: "#dmDrawerClose" }], expect: [
      { sel: ".dm-table-drawer.open", count: 0, state: "detached" }, { sel: ".dm-domain-tab.active", text: "Relationship graph" },
    ] },
    story: graphStory("fact-fields", [
      { sel: ".mh-dmview__dialog", count: 0, state: "detached" }, { sel: ".mh-dmview__tab.is-active", text: "Relationship graph" },
    ], [{ click: ".mh-dmview__dialog .mh-dmview__icon-btn" }]),
  },
  {
    id: "p11-escape",
    original: { url: source(), actions: [...graphOriginal, { click: ".dm-graph-node.is-fact" }, { press: ["body", "Escape"] }], expect: [
      { sel: ".dm-table-drawer.open", count: 0, state: "detached" }, { sel: ".dm-domain-tab.active", text: "Relationship graph" },
    ] },
    story: graphStory("fact-fields", [
      { sel: ".mh-dmview__dialog", count: 0, state: "detached" }, { sel: ".mh-dmview__tab.is-active", text: "Relationship graph" },
    ], [{ press: ["body", "Escape"] }]),
  },
];
