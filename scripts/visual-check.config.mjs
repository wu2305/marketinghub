/**
 * Scenario config for scripts/visual-check.mjs.
 *
 * Each scenario pairs one original demo page state (repo-root URL, optional
 * seeded localStorage / actions) with one Storybook story state (iframe id +
 * args). `expect` entries must be visible before screenshots; missing ones fail
 * the scenario. Only describe URLs, actions and expectations — no DOM dumps.
 */
export const BASELINE = { width: 1440, height: 1400 };

export default [
  {
    id: "p01-home",
    original: { url: "/index.html", expect: [{ sel: ".home-command-hero" }, { sel: ".workspace-card" }] },
    story: { id: "pages--home", expect: [{ sel: ".mh-hero--home" }, { sel: ".mh-workspace-card" }] },
  },
  {
    id: "p01-home-assistant",
    original: {
      url: "/index.html",
      actions: [
        { click: "#aiEntry" },
        { wait: "#assistantPanel:not([hidden])" },
        { click: ".ask-suggestion" },
        { click: "#sendQuery" },
        { wait: "#answerFeed .answer-card" },
        { click: "#homeHistory" },
        { wait: "#homeHistoryPopup:not([hidden])" },
        { click: ".home-history-item" },
        { click: "#homeMaximize" },
      ],
      expect: [
        { sel: "#assistantPanel.is-ai-expanded" },
        { sel: "#answerFeed .answer-card", text: "Recommended next move." },
        { sel: "#homeHistoryPopup", state: "hidden" },
        { sel: ".ask-scope", state: "hidden" },
      ],
    },
    story: {
      id: "pages--home",
      args: { assistantOpen: true },
      actions: [
        { click: ".mh-assistant__suggestions button" },
        { click: ".mh-assistant__tools .mh-button" },
        { wait: ".mh-assistant__feed .mh-assistant__answer" },
        { click: "button[aria-label='History']" },
        { wait: ".mh-assistant__history-pop" },
        { click: ".mh-assistant__history-item" },
        { click: "button[aria-label='Maximize']" },
      ],
      expect: [
        { sel: ".mh-assistant--expanded" },
        { sel: ".mh-assistant__answer", text: "Recommended next move." },
        { sel: ".mh-assistant__history-pop", state: "detached" },
        { sel: ".mh-assistant__scopes", state: "detached" },
      ],
    },
  },
  {
    id: "p02-cockpit",
    original: { url: "/assets/pages/reports.html", expect: [{ sel: "#catalogView" }, { sel: ".workspace-page-hero" }] },
    story: { id: "pages--marketing-cockpit", expect: [{ sel: ".mh-catalog" }, { sel: ".mh-project-card" }] },
  },
  {
    id: "p03-self-service",
    original: { url: "/assets/pages/flexible.html", expect: [{ sel: "#tab-self-service" }, { sel: ".report-card" }] },
    story: { id: "pages--self-service", expect: [{ sel: ".mh-self-tools" }, { sel: ".mh-action-card" }] },
  },
  {
    id: "p03-self-service-upload",
    original: { url: "/assets/pages/flexible.html?tab=upload", expect: [{ sel: "#data-upload-panel" }, { sel: ".upload-card-grid" }] },
    story: {
      id: "pages--self-service",
      args: { tab: "upload" },
      expect: [
        { sel: ".mh-page__cards", text: "Finance Pilot City" },
        { sel: ".mh-page__cards--two", state: "detached" },
      ],
    },
  },
  {
    id: "p03-upload-history",
    original: {
      url: "/assets/pages/flexible.html?tab=upload",
      actions: [
        { click: ".upload-card .history-icon" },
        { wait: "#uploadHistoryModal:not([hidden])" },
      ],
      expect: [
        { sel: "#uploadHistoryRows", text: "finance_pilot_city_2026Q3.xlsx" },
        { sel: "#uploadHistoryModal", text: "Upload History" },
        { sel: "#uploadHistoryEmpty", state: "hidden" },
      ],
    },
    story: {
      id: "pages--self-service",
      args: { tab: "upload" },
      actions: [
        { click: ".mh-action-card__history" },
        { wait: ".mh-modal .mh-upload-history__table" },
      ],
      expect: [
        { sel: ".mh-upload-history", text: "finance_pilot_city_2026Q3.xlsx" },
        { sel: ".mh-upload-history", text: "Upload History" },
        { sel: ".mh-upload-history__empty", state: "detached" },
      ],
    },
  },
  {
    id: "p04-data-upload",
    original: {
      url: "/assets/pages/data-upload.html",
      actions: [{ click: "#dataUploadForm .submit-btn" }],
      expect: [
        { sel: "#dataUploadForm .submit-btn", text: "Submitted" },
        { sel: ".data-upload-form-card" },
        { sel: ".form-grid", text: "Sales LY" },
      ],
    },
    story: {
      id: "pages--data-upload",
      actions: [{ click: ".mh-upload__form .mh-button--gold" }],
      expect: [
        { sel: ".mh-upload__form .mh-button--gold", text: "Submitted" },
        { sel: ".mh-upload__card" },
        { sel: ".mh-upload__grid", text: "Sales LY" },
      ],
    },
  },
  {
    id: "p04-data-upload-import",
    original: {
      url: "/assets/pages/data-upload.html",
      actions: [
        { click: "#bulkImportBtn" },
        { wait: "#bulkImportModal:not([hidden])" },
      ],
      expect: [
        { sel: "#bulkImportModal", text: "Template Import" },
        { sel: ".bulk-import-dropzone-title", text: "Click or drag a file to upload here" },
        { sel: ".bulk-import-template-link", text: "Download template" },
        { sel: ".bulk-import-tips", text: "500,000" },
      ],
    },
    story: {
      id: "pages--data-upload",
      actions: [
        { click: ".mh-upload__toolbar .mh-button--secondary" },
        { wait: ".mh-modal .mh-dropzone" },
      ],
      expect: [
        { sel: ".mh-modal", text: "Template Import" },
        { sel: ".mh-dropzone__title", text: "Click or drag a file to upload here" },
        { sel: ".mh-bulk-import__template", text: "Download template" },
        { sel: ".mh-bulk-import__tips", text: "500,000" },
      ],
    },
  },
  {
    id: "p04-data-upload-close",
    original: {
      url: "/assets/pages/data-upload.html",
      actions: [
        { click: "#bulkImportBtn" },
        { wait: "#bulkImportModal:not([hidden])" },
        { press: ["body", "Escape"] },
      ],
      expect: [{ sel: "#bulkImportModal", state: "hidden" }],
    },
    story: {
      id: "pages--data-upload",
      args: { bulkImportOpen: true },
      actions: [
        { wait: ".mh-modal .mh-dropzone" },
        { press: ["body", "Escape"] },
      ],
      expect: [{ sel: ".mh-modal", state: "detached" }],
    },
  },
  {
    id: "p04-data-upload-drop",
    original: {
      url: "/assets/pages/data-upload.html",
      actions: [
        { click: "#bulkImportBtn" },
        { wait: "#bulkImportModal:not([hidden])" },
        {
          upload: [
            "#bulkImportFile",
            { name: "city-sales.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", content: "demo" },
          ],
        },
      ],
      expect: [{ sel: ".bulk-import-dropzone-hint", text: "Selected: city-sales.xlsx" }],
    },
    story: {
      id: "pages--data-upload",
      args: { bulkImportOpen: true },
      actions: [
        { wait: ".mh-modal .mh-dropzone" },
        { click: ".mh-dropzone" },
        {
          upload: [
            ".mh-dropzone__input",
            { name: "city-sales.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", content: "demo" },
          ],
        },
      ],
      expect: [{ sel: ".mh-dropzone__hint", text: "Selected: city-sales.xlsx" }],
    },
  },
  {
    id: "p05-media-tracking",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      expect: [
        { sel: ".media-tracking-head", text: "Media Tracking Detail" },
        { sel: ".media-tracking-tab.active", text: "Monthly" },
        { sel: ".media-tracking-count", text: "42 fields displayed" },
        { sel: ".media-tracking-table", text: "2493188" },
        { sel: ".media-tracking-description", text: "Region Info" },
      ],
    },
    story: {
      id: "pages--media-tracking-detail",
      expect: [
        { sel: ".mh-tracking__head", text: "Media Tracking Detail" },
        { sel: ".mh-tracking .mh-tabs__tab.is-active", text: "Monthly" },
        { sel: ".mh-tracking__count", text: "42 fields displayed" },
        { sel: ".mh-tracking__table", text: "2493188" },
        { sel: ".mh-tracking__description", text: "Region Info" },
      ],
    },
  },
  {
    id: "p05-media-tracking-tab",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      actions: [{ click: "[data-period='daily']" }],
      expect: [{ sel: ".media-tracking-tab.active", text: "Daily" }],
    },
    story: {
      id: "pages--media-tracking-detail",
      actions: [{ click: ".mh-tracking .mh-tabs__tab:first-child" }],
      expect: [{ sel: ".mh-tracking .mh-tabs__tab.is-active", text: "Daily" }],
    },
  },
  {
    id: "p05-media-tracking-assistant",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      actions: [
        { click: ".global-ai-launcher" },
        { wait: "#assistantPanel:not([hidden])" },
        { fill: ["#promptCanvas", "Summarize the latest media tracking performance."] },
        { click: "#sendQuery" },
        { wait: "#answerFeed:not([hidden]) .answer-card" },
      ],
      expect: [
        { sel: "#assistantPanel", text: "Ask AI Interpreter" },
        { sel: "#answerFeed", text: "I will use the AI Interpreter knowledge context to answer:" },
      ],
    },
    story: {
      id: "pages--media-tracking-detail",
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-assistant" },
        { fill: [".mh-assistant__box textarea", "Summarize the latest media tracking performance."] },
        { click: ".mh-assistant__send .mh-button" },
        { wait: ".mh-assistant__answer--simple" },
      ],
      expect: [
        { sel: ".mh-assistant", text: "Ask AI Interpreter" },
        { sel: ".mh-assistant__answer--simple", text: "I will use the AI Interpreter knowledge context to answer:" },
      ],
    },
  },
  {
    id: "p06-campaign",
    original: { url: "/assets/pages/campaign.html", expect: [{ sel: ".campaign-rail" }, { sel: "#overviewTitle" }] },
    story: { id: "pages--campaign", expect: [{ sel: ".mh-campaign" }, { sel: ".mh-rail" }] },
  },
  {
    id: "p06-campaign-task-dialog",
    original: {
      url: "/assets/pages/campaign.html#execution",
      actions: [
        { click: "[data-open-task]" },
        { wait: "#taskDialog[open]" },
        { click: "#taskForm button[type='submit']" },
        { wait: "#actionToast:not([hidden])" },
      ],
      expect: [
        { sel: "#actionToast", text: "Campaign task added to the review queue." },
        { sel: "#taskDialog[open]", state: "detached" },
      ],
    },
    story: {
      id: "pages--campaign",
      args: { section: "execution" },
      actions: [
        { click: ".mh-view-heading .mh-button--primary" },
        { wait: ".mh-modal .mh-task-dialog__preview" },
        { click: ".mh-task-dialog__footer .mh-button--primary" },
        { wait: ".mh-toast:not([hidden])" },
      ],
      expect: [
        { sel: ".mh-toast", text: "Campaign task added to the review queue." },
        { sel: ".mh-modal", state: "detached" },
      ],
    },
  },
  {
    id: "p06-campaign-accounts",
    original: {
      url: "/assets/pages/campaign.html#accounts",
      expect: [{ sel: "#accountsTitle" }, { sel: ".campaign-view.active .data-table" }],
    },
    story: {
      id: "pages--campaign",
      args: { section: "accounts" },
      expect: [
        { sel: ".mh-campaign", text: "Account Binding" },
        { sel: ".mh-campaign .mh-table" },
      ],
    },
  },
  {
    id: "p07-interpreter-overview",
    original: { url: "/assets/pages/knowledge.html", expect: [{ sel: ".v20-type-card" }, { sel: "#businessTypeNav button" }] },
    story: { id: "pages--interpreter", expect: [{ sel: ".mh-type-grid" }, { sel: ".mh-sidebar" }] },
  },
  {
    id: "p07-interpreter-business-term",
    original: { url: "/assets/pages/knowledge.html?type=Business%20Term", expect: [{ sel: ".bt-term-card" }] },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      expect: [{ sel: ".mh-library", text: "GMV (Gross Merchandise Value)" }, { sel: ".mh-asset" }],
    },
  },
  {
    id: "p07-interpreter-scenario",
    original: { url: "/assets/pages/knowledge.html?type=Scenario%20Reporting", expect: [{ sel: ".scenario-report-card" }] },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Scenario Reporting" },
      expect: [{ sel: ".mh-library", text: "Channel Performance Analysis" }, { sel: ".mh-asset" }],
    },
  },
];
