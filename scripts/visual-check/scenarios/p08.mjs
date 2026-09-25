/* P08: the direct-entry dedicated forms and selectable generic form states. */
const url = "/assets/pages/knowledge-create.html";
const select = (type) => [{ select: ["#knowledgeType", type] }, { waitMs: 250 }, { eval: "() => window.scrollTo(0, 0)" }];
const generic = (id, type, storyId, originalText, storyText) => ({
  id,
  original: { url: `${url}?type=Principles`, actions: select(type), fullPage: true, expect: [
    { sel: "#knowledgeType" },
    { sel: "body", text: originalText },
  ] },
  story: { id: storyId, fullPage: true, expect: [
    { sel: `.mh-kcreate[data-kc-type='${type}']` },
    { sel: ".mh-kcreate__card", text: storyText },
  ] },
});

export default [
  {
    id: "p08-business-term",
    layout: [
      { orig: ".bt-business-term-form", story: ".mh-btform", props: ["x", "y", "width"], tol: 24 },
    ],
    original: { url, expect: [
      { sel: "h1", text: "Create Business Term" },
      { sel: "select[name='kind']", count: 1 },
      { sel: "body", text: "Build a common language" },
    ] },
    story: { id: "pages--knowledge-create", expect: [
      { sel: ".mh-kcreate[data-kc-type='Business Term']" },
      { sel: ".mh-btform__guidance", text: "Build a common language" },
      { sel: ".mh-btform__fields", text: "Data Model" },
    ] },
  },
  {
    id: "p08-global-synonym",
    original: { url, actions: [{ select: ["select[name='kind']", "Global Synonym"] }], expect: [
      { sel: "select[name='kind']", count: 1 },
      { sel: "#businessTermScopeField", state: "hidden" },
    ] },
    story: { id: "pages--knowledge-create-global-synonym", expect: [
      { sel: "select[name='kind']", count: 1 },
      { sel: ".mh-btform__scope", state: "detached", count: 0 },
    ] },
  },
  {
    id: "p08-business-edit",
    original: { url: `${url}?type=Business%20Term&mode=edit&id=business-term-gmv`, expect: [
      { sel: "h1", text: "Edit GMV (Gross Merchandise Value)" }, { sel: ".fm-breadcrumb a", count: 4 }, { sel: "body", text: "GMV (Gross Merchandise Value)" },
    ] },
    story: { id: "pages--knowledge-create-business-edit", expect: [
      { sel: ".mh-kcreate[data-kc-mode='edit']" }, { sel: ".mh-kcreate h1", text: "Edit GMV (Gross Merchandise Value)" }, { sel: ".mh-kcreate__breadcrumb a", count: 4 },
    ] },
  },
  generic("p08-principles", "Principles", "pages--knowledge-create-principles", "Core Description", "Core Description"),
  generic("p08-report-context", "Report Context", "pages--knowledge-create-report-context", "Dashboard Description", "Dashboard Description"),
  generic("p08-data-model", "Data Model", "pages--knowledge-create-data-model", "AI Modeling", "AI Modeling"),
  generic("p08-metric", "Metric Dictionary", "pages--knowledge-create-metric", "Formula Builder", "Formula Builder"),
  { ...generic("p08-synonyms", "Synonyms", "pages--knowledge-create-synonyms", "Synonym Management", "Synonym Management"), original: { ...generic("p08-synonyms", "Synonyms", "pages--knowledge-create-synonyms", "Synonym Management", "Synonym Management").original, actions: [{ select: ["#knowledgeType", "Synonyms"] }, { waitMs: 800 }] } },
  {
    id: "p08-analysis",
    original: { url: `${url}?type=Analytical%20Model`, fullPage: true, expect: [
      { sel: "h1", text: "Create Analysis" }, { sel: "body", text: "Trigger When" }, { sel: "body", text: "Referenced Metrics" },
    ] },
    story: { id: "pages--knowledge-create-analysis", fullPage: true, expect: [
      { sel: ".mh-kcreate[data-kc-type='Analytical Model']" }, { sel: ".mh-kcf__analysis", text: "Trigger When" },
    ] },
  },
  {
    id: "p08-scenario",
    original: { url: `${url}?type=Scenario%20Reporting`, fullPage: true, expect: [
      { sel: "h1", text: "Create Scenario Reporting" }, { sel: "body", text: "Upload reference" },
    ] },
    story: { id: "pages--knowledge-create-scenario", fullPage: true, expect: [
      { sel: ".mh-kcreate[data-kc-type='Scenario Reporting']" }, { sel: ".mh-kcf__scenario", text: "Upload reference" },
    ] },
  },
  {
    id: "p08-report-edit",
    original: { url: `${url}?type=Report%20Context&mode=edit&id=city-report-context`, expect: [
      { sel: "h1", text: "Edit Invest City Strategy Analysis" }, { sel: "body", text: "Version history" },
    ] },
    story: { id: "pages--knowledge-create-report-edit", expect: [
      { sel: ".mh-kcreate[data-kc-mode='edit']" }, { sel: ".mh-kcf__rc-edit", text: "Version history" },
    ] },
  },
  {
    id: "p08-report-unknown-edit",
    original: { url: `${url}?type=Report%20Context&mode=edit&id=missing-report-context`, expect: [
      { sel: "#pageTitle", text: "Edit Knowledge" },
      { sel: "#typeFields", text: "Knowledge Title" },
      { sel: ".rc-edit-overview", count: 0, state: "detached" },
    ] },
    story: { id: "pages--knowledge-create-report-unknown-edit", expect: [
      { sel: ".mh-kcreate[data-kc-type='Report Context'][data-kc-mode='edit']" },
      { sel: ".mh-kcreate h1", text: "Edit Knowledge" },
      { sel: ".mh-kcf__generic", text: "Dashboard Description" },
      { sel: ".mh-kcf__rc-edit", count: 0, state: "detached" },
    ] },
  },
  {
    id: "p08-analysis-edit",
    original: { url: `${url}?type=Analytical%20Model&mode=edit&id=playbook-opportunity-scan`, expect: [
      { sel: "h1", text: "Edit Analysis" }, { sel: ".fm-breadcrumb > span:last-child", text: "Opportunity scan playbook" }, { sel: ".fm-tag-editor", text: "City Strategy" }, { sel: ".v20-multi-display", text: "Member conversion" },
    ] },
    story: { id: "pages--knowledge-create-analysis-edit", expect: [
      { sel: ".mh-kcreate[data-kc-mode='edit']" }, { sel: ".mh-kcf__analysis input[name='analysis_name']", count: 1 }, { sel: ".mh-kcreate h1", text: "Edit Analysis" }, { sel: ".mh-kcreate__breadcrumb b", text: "Opportunity scan playbook" }, { sel: ".mh-kcf__tag-input", text: "City Strategy" }, { sel: ".mh-kcf__multi-trigger", text: "Member conversion" },
    ] },
  },
  {
    id: "p08-analysis-unavailable",
    original: { url: `${url}?type=Analytical%20Model&mode=edit&id=missing-analysis`, expect: [
      { sel: "h1", text: "Edit Analysis" },
      { sel: "#fmAnalysisForm .fm-feedback", text: "This analysis is unavailable or you do not have permission to edit it." },
      { sel: "#fmAnalysisForm input", count: 0, state: "detached" },
    ] },
    story: { id: "pages--knowledge-create-analysis-unavailable", expect: [
      { sel: ".mh-kcreate[data-kc-type='Analytical Model'][data-kc-mode='edit']" },
      { sel: ".mh-kcreate__unavailable", text: "This analysis is unavailable or you do not have permission to edit it." },
      { sel: ".mh-kcf__analysis", count: 0, state: "detached" },
    ] },
  },
  {
    id: "p08-scenario-edit",
    original: { url: `${url}?type=Scenario%20Reporting&mode=edit&id=scenario-channel-performance&title=Channel%20Performance%20Analysis&report=Invest%20City%20Strategy%20Analysis&description=Channel%20efficiency%2C%20drivers%20and%20recommended%20actions&blueprint=Summarize%20channel%20performance.&attachments=channel-report.pdf`, expect: [
      { sel: "h1", text: "Edit Scenario Reporting" }, { sel: "body", text: "channel-report.pdf" },
    ] },
    story: { id: "pages--knowledge-create-scenario-edit", expect: [
      { sel: ".mh-kcreate[data-kc-mode='edit']" }, { sel: ".mh-kcf__scenario", text: "channel-report.pdf" },
    ] },
  },
  {
    id: "p08-metric-test",
    original: { url: `${url}?type=Principles`, actions: [...select("Metric Dictionary"), { click: ".v20-basic-metric[data-metric='Visit Count']" }, { click: ".v20-test-run button" }], expect: [
      { sel: "#resultDialog[open]", text: "Test completed" }, { sel: "#resultDialog", text: "1,284.60" }, { sel: ".v20-token-formula .v20-formula-token", count: 1 }, { sel: "#dialogClose", text: "Back to Knowledge Management" },
    ] },
    story: { id: "pages--knowledge-create-metric-test", expect: [
      { sel: ".mh-confirm[role='dialog']", text: "Test completed" }, { sel: ".mh-confirm", text: "1,284.60" }, { sel: ".mh-kcf__formula .mh-kcf__formula-token", count: 1 }, { sel: ".mh-confirm__btn", text: "Back to Knowledge Management" },
    ] },
  },
  {
    id: "p08-metric-test-required",
    original: { url: `${url}?type=Principles`, actions: [...select("Metric Dictionary"), { click: ".v20-test-run button" }], expect: [
      { sel: "#resultDialog[open]", text: "Formula required" }, { sel: "#metricFormulaError", text: "Please build a formula first." },
    ] },
    story: { id: "pages--knowledge-create-metric-test-empty", expect: [
      { sel: ".mh-confirm[role='dialog']", text: "Formula required" }, { sel: ".mh-confirm", text: "Please build a formula before testing." },
    ] },
  },
  {
    id: "p08-metric-token",
    original: { url: `${url}?type=Principles`, actions: [...select("Metric Dictionary"), { click: ".v20-basic-metric[data-metric='Visit Count']" }], expect: [
      { sel: ".v20-token-formula[aria-readonly='true'] .v20-formula-token", text: "Visit Count" },
    ] },
    story: { id: "pages--knowledge-create-metric-token", expect: [
      { sel: ".mh-kcf__formula[aria-readonly='true'] .mh-kcf__formula-token", text: "Visit Count" },
    ] },
  },
  {
    id: "p08-metric-backspace",
    original: { url: `${url}?type=Principles`, actions: [...select("Metric Dictionary"), { click: ".v20-basic-metric[data-metric='Visit Count']" }, { click: ".v20-basic-metric[data-metric='Exposure Count']" }, { click: "#metricBackspace" }], expect: [
      { sel: ".v20-token-formula .v20-formula-token", count: 1 }, { sel: ".v20-token-formula .v20-formula-token", text: "Visit Count" },
    ] },
    story: { id: "pages--knowledge-create-metric-token", expect: [
      { sel: ".mh-kcf__formula .mh-kcf__formula-token", count: 1 }, { sel: ".mh-kcf__formula .mh-kcf__formula-token", text: "Visit Count" },
    ] },
  },
  {
    id: "p08-model-basic",
    original: { url: `${url}?type=Principles`, actions: [...select("Data Model"), { click: "button:has-text('Basic Info'):visible" }], expect: [
      { sel: "body", text: "Physical Table" },
    ] },
    story: { id: "pages--knowledge-create-data-model-basic", expect: [
      { sel: ".mh-kcf__model-basic", text: "Physical Table" },
    ] },
  },
  {
    id: "p08-report-unlocked",
    original: { url: `${url}?type=Report%20Context&mode=edit&id=city-report-context`, actions: [{ click: "#rcUnlockDescription" }], expect: [
      { sel: "#rcUnlockDescription", attr: { name: "aria-pressed", value: "true" } }, { sel: "#rcDescription" },
    ] },
    story: { id: "pages--knowledge-create-report-unlocked", expect: [
      { sel: ".mh-kcf__rc-edit button[aria-label='Lock report description']", count: 1 }, { sel: ".mh-kcf__rc-edit textarea:not([disabled])", count: 1 },
    ] },
  },
  {
    id: "p08-model-required",
    original: { url: `${url}?type=Principles`, actions: [...select("Data Model"), { waitMs: 350 }, { click: "#knowledgeForm button[type='submit']" }], expect: [
      { sel: ".v20-dm-create-info .v20-field-error", count: 1 },
    ] },
    story: { id: "pages--knowledge-create-data-model-required", expect: [
      { sel: ".mh-kcf__model-intro .mh-kcf__field.is-invalid", count: 1 },
    ] },
  },
  {
    id: "p08-model-second-basic",
    original: { url: `${url}?type=Principles`, actions: [...select("Data Model"), { waitMs: 350 }, { click: ".v20-dm-table-list button:nth-child(2)" }, { click: ".v20-dm-tabs button:first-child" }], expect: [
      { sel: ".v20-dm-table-list button:nth-child(2).active", text: "User & Member Dimension" }, { sel: ".v20-dm-basic input", attr: { name: "value", value: "Channel Dimension" } },
    ] },
    story: { id: "pages--knowledge-create-data-model-second-basic", expect: [
      { sel: ".mh-kcf__model-list button.is-active", text: "User & Member Dimension" }, { sel: ".mh-kcf__model-basic input[name='tableName']", attr: { name: "value", value: "User & Member Dimension" } },
    ] },
  },
  {
    id: "p08-metric-required",
    original: { url: `${url}?type=Principles`, actions: [...select("Metric Dictionary"), { click: "#knowledgeForm button[type='submit']" }], expect: [
      { sel: ".v20-derived-metric .v20-field-error", count: 2 },
    ] },
    story: { id: "pages--knowledge-create-metric-required", expect: [
      { sel: ".mh-kcf__metric .mh-kcf__error", count: 2 },
    ] },
  },
  {
    id: "p08-synonym-required",
    original: { url: `${url}?type=Principles`, actions: [{ select: ["#knowledgeType", "Synonyms"] }, { waitMs: 850 }, { click: "#addSynonymRow" }, { click: "#knowledgeForm button[type='submit']" }], expect: [
      { sel: ".v20-synonym-new .v20-field-error", count: 3 },
    ] },
    story: { id: "pages--knowledge-create-synonym-required", expect: [
      { sel: ".mh-kcf__synonyms tbody tr.is-invalid", count: 1 },
    ] },
  },
  {
    id: "p08-business-required",
    original: { url, actions: [{ click: "button#saveBtn" }], expect: [
      { sel: ".bt-business-term-form .bt-field.is-invalid", count: 2 },
    ] },
    story: { id: "pages--knowledge-create-required", expect: [
      { sel: ".mh-btform__fields>label.is-invalid", count: 2 },
    ] },
  },
  {
    id: "p08-principles-edit",
    original: { url: `${url}?mode=edit&id=investment-principles`, actions: [{ waitMs: 700 }], expect: [
      { sel: ".bt-business-term-form", text: "Term Type" },
    ] },
    story: { id: "pages--knowledge-create-principles-edit", expect: [
      { sel: ".mh-kcreate[data-kc-type='Principles'][data-kc-mode='edit']" }, { sel: ".mh-kcreate h1", text: "Campaign investment decision principles" }, { sel: ".mh-kcf__generic", text: "Core Description" },
    ] },
  },
  {
    id: "p08-principles-copy",
    original: { url: `${url}?copy=investment-principles`, expect: [
      { sel: "h1", text: "Create Business Term" }, { sel: ".bt-business-term-form", text: "Term Type" },
    ] },
    story: { id: "pages--knowledge-create-principles-copy", expect: [
      { sel: ".mh-kcreate[data-kc-type='Principles'][data-kc-mode='copy']" }, { sel: ".mh-kcreate h1", text: "Copy Knowledge" }, { sel: ".mh-kcf__generic", text: "Core Description" },
    ] },
  },
  {
    id: "p08-report-history",
    original: { url: `${url}?type=Report%20Context&mode=edit&id=city-report-context`, actions: [{ click: "#rcViewDescriptionHistory" }], expect: [
      { sel: "dialog.rc-history-dialog[open]", text: "Previous version" },
    ] },
    story: { id: "pages--knowledge-create-report-history", expect: [
      { sel: ".mh-kcreate__history[role='dialog']", text: "Previous version" },
    ] },
  },
  {
    id: "p08-report-confirm",
    original: { url: `${url}?type=Report%20Context&mode=edit&id=city-report-context`, actions: [
      { click: "#rcUnlockDescription" }, { fill: ["#rcDescription", "Updated city strategy report description."] }, { click: "#rcEditSubmit" },
    ], expect: [{ sel: "dialog.fm-dialog[open]", text: "Submit description update?" }] },
    story: { id: "pages--knowledge-create-report-confirm", expect: [
      { sel: ".mh-confirm[role='dialog']", text: "Submit description update?" },
    ] },
  },
  {
    id: "p08-model-event",
    original: { url: `${url}?type=Principles`, actions: [...select("Data Model"), { waitMs: 350 }, { click: ".v20-dm-switch button:nth-child(2)" }], expect: [
      { sel: ".v20-dm-table-wrap", text: "event_id" }, { sel: ".v20-dm-table-list", text: "Media Performance Event" },
    ] },
    story: { id: "pages--knowledge-create-data-model-event", expect: [
      { sel: ".mh-kcf__model-list", text: "Media Performance Event" }, { sel: ".mh-kcf__table-scroll", text: "event_id" },
    ] },
  },
  {
    id: "p08-model-preview",
    original: { url: `${url}?type=Principles`, actions: [...select("Data Model"), { waitMs: 350 }, { click: ".v20-dm-config header .v20-secondary" }], expect: [
      { sel: "#resultDialog[open]", text: "Preview data is ready for this model." }, { sel: "#dialogClose", text: "Back to Knowledge Management" },
    ] },
    story: { id: "pages--knowledge-create-data-model-preview", expect: [
      { sel: ".mh-confirm[role='dialog']", text: "Preview data is ready for this model." }, { sel: ".mh-confirm__btn", text: "Back to Knowledge Management" },
    ] },
  },
  {
    id: "p08-model-search-empty",
    original: { url: `${url}?type=Principles`, actions: [...select("Data Model"), { waitMs: 350 }, { fill: [".v20-dm-search", "zzzz"] }], expect: [
      { sel: ".v20-dm-table-list button:not([hidden])", state: "detached", count: 0 },
    ] },
    story: { id: "pages--knowledge-create-data-model-search-empty", expect: [
      { sel: ".mh-kcf__model-list button", state: "detached", count: 0 }, { sel: ".mh-kcf__model-list" },
    ] },
  },
  {
    id: "p08-model-synonym-saved",
    original: { url: `${url}?type=Principles`, actions: [...select("Data Model"), { waitMs: 350 }, { click: ".v20-dm-table-wrap tbody tr:first-child .v20-dm-plus" }, { fill: [".v20-dm-synonym-input", "Customer Channel"] }, { click: ".v20-dm-table-wrap tbody tr:first-child td:first-child" }], expect: [
      { sel: ".v20-dm-table-wrap tbody tr:first-child .v20-dm-tag", count: 2 }, { sel: ".v20-dm-table-wrap tbody tr:first-child", text: "Customer Channel" },
    ] },
    story: { id: "pages--knowledge-create-data-model-synonym-saved", expect: [
      { sel: ".mh-kcf__table-scroll tbody tr:first-child .mh-kcf__chip", count: 2 }, { sel: ".mh-kcf__table-scroll tbody tr:first-child", text: "Customer Channel" },
    ] },
  },
  {
    id: "p08-model-smart",
    original: { url: `${url}?type=Principles`, actions: [...select("Data Model"), { waitMs: 350 }, { click: ".v20-dm-ai button" }], expect: [
      { sel: "dialog[open]", text: "Smart Modeling has prepared" },
    ] },
    story: { id: "pages--knowledge-create-data-model-smart", expect: [
      { sel: ".mh-confirm[role='dialog']", text: "Smart Modeling has prepared" },
    ] },
  },
  {
    id: "p08-synonym-row",
    original: { url: `${url}?type=Principles`, actions: [{ select: ["#knowledgeType", "Synonyms"] }, { waitMs: 850 }, { click: "#addSynonymRow" }], expect: [
      { sel: ".v20-synonym-new", count: 1 }, { sel: ".v20-synonym-new details", count: 3 },
    ] },
    story: { id: "pages--knowledge-create-synonym-row", expect: [
      { sel: ".mh-kcf__synonyms tbody tr:has(input[aria-label='Standard term'])", count: 1 }, { sel: ".mh-kcf__synonym-scope", count: 3 },
    ] },
  },
  {
    id: "p08-term-scope",
    original: { url, actions: [{ click: "#businessTermScopeField .v20-multi-display" }, { click: "#businessTermScopeField .v20-multi-menu label:has-text('Marketing')" }], expect: [
      { sel: "#businessTermScopeField .v20-multi-display", text: "Marketing" },
    ] },
    story: { id: "pages--knowledge-create-scope", expect: [
      { sel: ".mh-btform__scope", text: "Marketing" },
    ] },
  },
  {
    id: "p08-report-ai-off",
    original: { url: `${url}?type=Principles`, actions: [...select("Report Context"), { click: "#aiOverview" }], expect: [
      { sel: "#aiFields", state: "hidden" }, { sel: "body", text: "Dashboard Description" },
    ] },
    story: { id: "pages--knowledge-create-report-ai-off", expect: [
      { sel: ".mh-kcreate[data-kc-type='Report Context']" }, { sel: ".mh-kcf__multi", count: 3 },
    ] },
  },
  {
    id: "p08-model-field-synonym",
    original: { url: `${url}?type=Principles`, actions: [...select("Data Model"), { waitMs: 350 }, { click: ".v20-dm-table-wrap tbody tr:first-child .v20-dm-plus" }], expect: [
      { sel: ".v20-dm-synonym-input", count: 1 },
    ] },
    story: { id: "pages--knowledge-create-data-model-synonym", expect: [
      { sel: "input[aria-label='New synonym']", count: 1 },
    ] },
  },
  {
    id: "p08-analysis-required",
    original: { url: `${url}?type=Analytical%20Model`, actions: [{ click: "#fmSave" }], expect: [
      { sel: ".fm-field.is-invalid", count: 3 },
    ] },
    story: { id: "pages--knowledge-create-analysis-required", expect: [
      { sel: ".mh-kcf__analysis .mh-kcf__field.is-invalid", count: 3 },
    ] },
  },
  {
    id: "p08-analysis-guidance",
    original: { url: `${url}?type=Analytical%20Model`, actions: [{ hover: ".fm-guidance-tooltip-trigger" }], expect: [
      { sel: ".fm-guidance-tooltip", text: "For example:" },
    ] },
    story: { id: "pages--knowledge-create-analysis-guidance", expect: [
      { sel: ".mh-kcf__help-tip", text: "For example:" },
    ] },
  },
  {
    id: "p08-scenario-required",
    original: { url: `${url}?type=Scenario%20Reporting`, actions: [{ click: "#knowledgeForm button[type='submit']" }], expect: [
      { sel: "#typeFields :invalid", count: 4 },
    ] },
    story: { id: "pages--knowledge-create-scenario-required", expect: [
      { sel: ".mh-kcf__scenario .mh-kcf__field.is-invalid", count: 4 },
    ] },
  },
  {
    id: "p08-scenario-guidance",
    original: { url: `${url}?type=Scenario%20Reporting`, actions: [{ hover: ".scenario-report-guidance-tooltip-trigger" }], expect: [
      { sel: ".scenario-report-guidance-tooltip", text: "For example:" },
    ] },
    story: { id: "pages--knowledge-create-scenario-guidance", expect: [
      { sel: ".mh-kcf__help-tip", text: "For example:" },
    ] },
  },
  {
    id: "p08-scenario-attachment",
    original: { url: `${url}?type=Scenario%20Reporting`, actions: [{ upload: ["#scenarioReportFiles", { name: "channel-report.pdf", mimeType: "application/pdf", content: "local reference" }] }], expect: [
      { sel: "body", text: "channel-report.pdf" },
    ] },
    story: { id: "pages--knowledge-create-scenario-attachment", expect: [
      { sel: ".mh-kcf__upload", text: "channel-report.pdf" },
    ] },
  },
  {
    id: "p08-saved-result",
    original: { url: `${url}?type=Principles`, actions: [{ click: "#saveBtn" }], expect: [
      { sel: "#resultDialog[open]", text: "Saved successfully" },
    ] },
    story: { id: "pages--knowledge-create-saved", expect: [
      { sel: ".mh-confirm[role='dialog']", text: "Saved successfully" },
    ] },
  },
  {
    id: "p08-submitted-result",
    original: { url: `${url}?type=Principles`, actions: [{ fill: ["#typeFields input[required]", "Local rule"] }, { fill: ["#typeFields textarea[required]", "Approved meaning."] }, { click: "#knowledgeForm button[type='submit']" }], expect: [
      { sel: "#resultDialog[open]", text: "Submitted successfully" },
    ] },
    story: { id: "pages--knowledge-create-submitted", expect: [
      { sel: ".mh-confirm[role='dialog']", text: "Submitted successfully" },
    ] },
  },
];
