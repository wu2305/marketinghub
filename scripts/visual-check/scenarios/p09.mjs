/** P09: effective knowledge-view runtime, with source-backed wrong-type corrections. */
const url = (id) => `/assets/pages/knowledge-view.html${id ? `?id=${id}` : ""}`;
const story = (id, expect, actions = []) => ({ id: `pages--knowledge-view-${id}`, expect, actions });
const hijackedTitles = { "investment-principles": "Campaign investment decision principles", "analysis-guardrails": "Trusted analysis guardrails", "channel-data-model": "Channel data model" };
const actualBusiness = (id) => ({ url: url(id), actions: [{ waitMs: 300 }], expect: [{ sel: ".bt-view" }, { sel: ".bt-page-head h1", text: hijackedTitles[id] }, { sel: ".principles-view, .v20-dm-page", count: 0, state: "detached" }] });
const wrongType = (id, sourceId, storyId, expect) => ({ id, original: actualBusiness(sourceId), story: story(storyId, expect) });
const modelExpect = [{ sel: ".mh-kdetail--model" }, { sel: ".mh-kdetail__model-table tbody tr", count: 5 }, { sel: ".mh-kdetail__model-ai", text: "AI Modeling" }];

export default [
  { id: "p09-business-term", original: { url: url("business-term-paid-customer"), expect: [{ sel: ".bt-view" }, { sel: ".bt-section", count: 3 }, { sel: ".bt-related-table tbody tr", count: 2 }, { sel: ".bt-page-head h1", text: "Paid Customer" }] }, story: story("business-term", [{ sel: ".mh-kdetail--business" }, { sel: ".mh-kdetail__section", count: 3 }, { sel: ".mh-kdetail__table tbody tr", count: 2 }, { sel: ".mh-kdetail__head h1", text: "Paid Customer" }, { sel: ".mh-kdetail__actions a", attr: { name: "href", value: "/assets/pages/knowledge-create.html?mode=edit&id=business-term-paid-customer" } }]) },
  { id: "p09-business-versions", original: { url: url("business-term-gmv"), actions: [{ click: "#btViewVersions" }], expect: [{ sel: "#btVersionPanel.open" }, { sel: ".principles-version-item", count: 2 }] }, story: story("business-term-versions", [{ sel: ".mh-kdetail__versions[role='dialog']" }, { sel: ".mh-kdetail__version", count: 2 }]) },
  { id: "p09-business-empty-assets", original: { url: url("business-term-gmv"), expect: [{ sel: ".bt-page-head h1", text: "GMV" }, { sel: ".bt-related-table tbody", text: "No related data assets" }] }, story: story("business-term-empty", [{ sel: ".mh-kdetail__head h1", text: "GMV" }, { sel: ".mh-kdetail__table tbody", text: "No related data assets" }]) },
  { id: "p09-business-no-id-fallback", original: { url: url(), expect: [{ sel: ".bt-page-head h1", text: "GMV" }] }, story: story("business-term-empty", [{ sel: ".mh-kdetail__head h1", text: "GMV" }]) },
  { id: "p09-business-unknown-fallback", original: { url: url("unknown-record"), expect: [{ sel: ".bt-page-head h1", text: "GMV" }] }, story: story("business-term-empty", [{ sel: ".mh-kdetail__head h1", text: "GMV" }]) },
  { id: "p09-scenario", original: { url: url("scenario-channel-performance"), expect: [{ sel: ".approach-view" }, { sel: ".approach-section", count: 2 }, { sel: ".approach-page-head h1", text: "Channel Performance Analysis" }] }, story: story("scenario", [{ sel: ".mh-kdetail--scenario" }, { sel: ".mh-kdetail__section", count: 2 }, { sel: ".mh-kdetail__head h1", text: "Channel Performance Analysis" }]) },
  { id: "p09-scenario-review", original: { url: url("scenario-campaign-review"), expect: [{ sel: ".approach-page-head h1", text: "Campaign Review Reporting" }, { sel: ".approach-page-head .v20-status", text: "Under Review" }] }, story: story("scenario-review", [{ sel: ".mh-kdetail__head h1", text: "Campaign Review Reporting" }, { sel: ".mh-kdetail__head .mh-kdetail__status", text: "Under Review" }]) },
  { id: "p09-scenario-versions", original: { url: url("scenario-channel-performance"), actions: [{ press: ["[data-approach-action='versions']", "Enter"] }], expect: [{ sel: "#resultDialog[open]", text: "Version comparison is available in this demo view." }] }, story: story("scenario-versions", [{ sel: ".mh-modal__dialog[role='dialog']", text: "Version comparison is available in this demo view." }]) },
  wrongType("p09-principles-corrected", "investment-principles", "principles", [{ sel: ".mh-kdetail--principles" }, { sel: ".mh-kdetail__principle", count: 1 }, { sel: ".mh-kdetail__head h1", text: "Campaign investment decision principles" }]),
  { id: "p09-principles-alternate", original: actualBusiness("analysis-guardrails"), story: { ...story("principles", [{ sel: ".mh-kdetail--principles" }, { sel: ".mh-kdetail__head h1", text: "Trusted analysis guardrails" }]), args: { recordId: "analysis-guardrails" } } },
  wrongType("p09-principles-collapsed", "investment-principles", "principles-collapsed", [{ sel: ".mh-kdetail__principle--collapsed" }, { sel: ".mh-kdetail__principle ul", count: 0, state: "detached" }]),
  wrongType("p09-principles-versions", "investment-principles", "principles-versions", [{ sel: ".mh-kdetail__versions[role='dialog']" }, { sel: ".mh-kdetail__version", count: 3 }]),
  wrongType("p09-model-corrected", "channel-data-model", "data-model", modelExpect),
  wrongType("p09-model-search-empty", "channel-data-model", "data-model-search", [...modelExpect, { sel: ".mh-kdetail__model-tables button", count: 0, state: "detached" }, { sel: ".mh-kdetail__model-tables", text: "No matching tables" }]),
  { id: "p09-model-search-hit", original: actualBusiness("channel-data-model"), story: { ...story("data-model-search", [...modelExpect, { sel: ".mh-kdetail__model-tables button", count: 1 }, { sel: ".mh-kdetail__model-tables button", text: "Region Dimension" }], [{ fill: [".mh-kdetail__model-side input", "region"] }]) } },
  wrongType("p09-model-basic-highlight", "channel-data-model", "data-model-basic", [...modelExpect, { sel: ".mh-kdetail__model-tabs button.is-active", text: "Basic Info" }]),
  wrongType("p09-model-event-highlight", "channel-data-model", "data-model-event", [...modelExpect, { sel: ".mh-kdetail__model-switch button.is-active", text: "Event · 1" }]),
  wrongType("p09-model-table-highlight", "channel-data-model", "data-model-table", [...modelExpect, { sel: ".mh-kdetail__model-tables button.is-active", text: "Region Dimension" }]),
  ...[
    ["preview", "Preview data is ready for this model."],
    ["smart", "Smart Modeling has prepared a configuration draft."],
    ["export", "The model configuration is ready to export."],
    ["edit", "Edit Model is ready."],
  ].map(([id, message]) => wrongType(`p09-model-${id}-notice`, "channel-data-model", `data-model-${id}`, [{ sel: ".mh-kdetail--model" }, { sel: ".mh-modal__dialog[role='dialog']", text: message }])),
];
