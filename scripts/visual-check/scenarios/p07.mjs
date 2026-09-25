export default [
  {
    id: "p07-interpreter-overview",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
      { orig: ".v20-type-card", story: ".mh-type-card", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".v20-type-card:last-of-type", story: ".mh-type-card:last-of-type", props: ["x", "y", "width", "height"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html",
      expect: [
        { sel: ".v20-type-card", count: 8 },
        { sel: "#businessTypeNav button", count: 8 },
        { sel: "h1", text: "AI Interpreter" },
      ],
    },
    story: {
      id: "pages--interpreter",
      expect: [
        { sel: ".mh-type-grid" },
        { sel: ".mh-type-card", count: 8 },
        { sel: ".mh-sidebar", text: "AI INTERPRETER" },
      ],
    },
  },
  {
    /* business-term-library.js hides the generic library chrome and renders
       #businessTermOverview: shared toolbar (300px search + 180px Status /
       Creator disclosures + gold "＋ Add Business Term"), 3-column term cards
       (clamp-clipped synonyms, pinned creator + bottom-right icon actions,
       fixed 76px status pill) and fm-style Previous/"p / total"/Next
       pagination. The assistant launcher is display:none for this type. */
    id: "p07-interpreter-business-term",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
      { orig: ".bt-overview-tools", story: ".mh-btview__tools", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".bt-overview-search", story: ".mh-btview__search", props: ["x", "width"], tol: 8 },
      { orig: ".bt-overview-filter:has(input[data-bt-filter='status'])", story: ".mh-btview .mh-check-filter:nth-of-type(2)", props: ["x", "width"], tol: 8 },
      { orig: ".bt-overview-filter:has(input[data-bt-filter='creator'])", story: ".mh-btview .mh-check-filter:nth-of-type(3)", props: ["x", "width"], tol: 8 },
      { orig: ".bt-overview-tools .knowledge-add-button", story: ".mh-btview__create", props: ["x", "y"], tol: 10 },
      { orig: ".bt-term-card", story: ".mh-btview__card", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".bt-term-card .bt-term-card-pills", story: ".mh-btview__card .mh-btview__pills", props: ["x", "y"], tol: 8 },
      { orig: ".fm-pagination", story: ".mh-btview .mh-pagination", props: ["x", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      actions: [
        /* clampSynonymRows runs in a rAF that races stylesheet loading —
           resize forces a re-clamp under the final cascade. */
        { waitMs: 800 },
        { eval: "window.dispatchEvent(new Event('resize'))" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".bt-term-card", count: 6, text: "GMV (Gross Merchandise Value)" },
        { sel: ".bt-overview-search input", attr: { name: "placeholder", value: "Search knowledge..." } },
        { sel: ".bt-overview-filter:has(input[data-bt-filter='status']) summary", text: "All statuses" },
        { sel: ".bt-overview-filter:has(input[data-bt-filter='creator']) summary", text: "All creators" },
        { sel: ".bt-overview-tools .knowledge-add-button", text: "Add Business Term" },
        { sel: ".bt-term-card[data-bt-id='business-term-gmv'] .fm-state", text: "Enabled" },
        /* ai-interpreter-overview.css hides the data-model scope tags on
           cards; only the status pill stays visible. */
        { sel: ".bt-term-card[data-bt-id='global-synonym-campaign'] .bt-scope-tags", state: "hidden" },
        { sel: ".fm-pagination", text: "6 records" },
        /* assistant-panel.css loads after business-term-reference.css and
           re-shows #aiEntry with !important — the launcher stays visible. */
        { sel: "#aiEntry.global-ai-launcher", text: "AI Interpreter" },
        /* clampSynonymRows quirk: "…" is appended (offsetParent-relative
           overflow check) but only survives the clip on the short rows —
           DOM presence is the deterministic assertion. */
        { sel: ".bt-term-card[data-bt-id='business-term-gmv'] .bt-tag-overflow", count: 1 },
        { sel: ".bt-term-card[data-bt-id='business-term-paid-customer'] .bt-tag-overflow", count: 1 },
        { sel: ".bt-term-card[data-bt-id='business-term-active-member'] .bt-tag-overflow", count: 0, state: "detached" },
        { sel: ".bt-term-card[data-bt-id='global-synonym-revenue'] .bt-tag-overflow", count: 1 },
        { sel: ".bt-term-card[data-bt-id='global-synonym-customer'] .bt-tag-overflow", count: 1 },
        { sel: ".bt-term-card[data-bt-id='global-synonym-campaign'] .bt-tag-overflow", count: 1 },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      expect: [
        { sel: ".mh-btview__card", count: 6, text: "GMV (Gross Merchandise Value)" },
        { sel: ".mh-btview__search input", attr: { name: "placeholder", value: "Search knowledge..." } },
        { sel: ".mh-btview .mh-check-filter:nth-of-type(2) .mh-check-filter__summary", text: "All statuses" },
        { sel: ".mh-btview .mh-check-filter:nth-of-type(3) .mh-check-filter__summary", text: "All creators" },
        { sel: ".mh-btview__create", text: "Add Business Term" },
        { sel: ".mh-btview__card:has-text('GMV') .mh-btview__state", text: "Enabled" },
        { sel: ".mh-btview__card:has-text('Campaign') .mh-btview__state", text: "Enabled" },
        { sel: ".mh-btview .mh-pagination", text: "6 records" },
        { sel: ".mh-launcher", text: "AI Interpreter" },
        { sel: ".mh-asset", state: "detached" },
        { sel: ".mh-btview__card[data-id='business-term-gmv'] .mh-btview__tag--overflow", count: 1 },
        { sel: ".mh-btview__card[data-id='business-term-paid-customer'] .mh-btview__tag--overflow", count: 1 },
        { sel: ".mh-btview__card[data-id='business-term-active-member'] .mh-btview__tag--overflow", count: 0, state: "detached" },
        { sel: ".mh-btview__card[data-id='global-synonym-revenue'] .mh-btview__tag--overflow", count: 1 },
        { sel: ".mh-btview__card[data-id='global-synonym-customer'] .mh-btview__tag--overflow", count: 1 },
        { sel: ".mh-btview__card[data-id='global-synonym-campaign'] .mh-btview__tag--overflow", count: 1 },
      ],
    },
  },
  {
    /* Status disclosure stays open after toggling; checking Disabled leaves
       zero rows and shows "No matching records". */
    id: "p07-business-term-status-empty",
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      actions: [
        /* types.js re-dispatches knowledge:typechange ~60ms after load and
           re-renders the toolbar — let it settle before opening the
           disclosure. */
        { waitMs: 800 },
        { click: ".bt-overview-filter:has(input[data-bt-filter='status']) summary" },
        { wait: ".bt-overview-filter:has(input[data-bt-filter='status']) details[open]" },
        { click: ".bt-overview-filter:has(input[data-bt-filter='status']) .fm-options label:has-text('Disabled')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".bt-overview-filter:has(input[data-bt-filter='status']) details[open]" },
        { sel: ".bt-overview-filter:has(input[data-bt-filter='status']) summary", text: "1 selected" },
        { sel: ".bt-empty", text: "No matching records" },
        { sel: ".bt-term-card", count: 0, state: "detached" },
        { sel: ".fm-pagination", text: "0 records" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      actions: [
        { click: ".mh-btview .mh-check-filter:nth-of-type(2) .mh-check-filter__summary" },
        { wait: ".mh-btview .mh-check-filter__details[open]" },
        { click: ".mh-btview .mh-check-filter__option:has-text('Disabled')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-btview .mh-check-filter__details[open]" },
        { sel: ".mh-btview .mh-check-filter:nth-of-type(2) .mh-check-filter__summary", text: "1 selected" },
        { sel: ".mh-btview__empty", text: "No matching records" },
        { sel: ".mh-btview__card", count: 0, state: "detached" },
        { sel: ".mh-btview .mh-pagination", text: "0 records" },
      ],
    },
  },
  {
    /* Creator multi-select: Current User + Emily Wang keeps GMV, Paid
       Customer and Revenue (OR within the creator filter). */
    id: "p07-business-term-creator-filter",
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      actions: [
        { waitMs: 800 },
        { click: ".bt-overview-filter:has(input[data-bt-filter='creator']) summary" },
        { wait: ".bt-overview-filter:has(input[data-bt-filter='creator']) details[open]" },
        { click: ".bt-overview-filter:has(input[data-bt-filter='creator']) .fm-options label:has-text('Current User')" },
        { click: ".bt-overview-filter:has(input[data-bt-filter='creator']) .fm-options label:has-text('Emily Wang')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".bt-overview-filter:has(input[data-bt-filter='creator']) summary", text: "2 selected" },
        { sel: ".bt-term-card", count: 3 },
        { sel: ".bt-term-card[data-bt-id='business-term-paid-customer']" },
        { sel: ".bt-term-card[data-bt-id='business-term-active-member']", state: "detached" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      actions: [
        { click: ".mh-btview .mh-check-filter:nth-of-type(3) .mh-check-filter__summary" },
        { click: ".mh-btview .mh-check-filter:nth-of-type(3) .mh-check-filter__option:has-text('Current User')" },
        { click: ".mh-btview .mh-check-filter:nth-of-type(3) .mh-check-filter__option:has-text('Emily Wang')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-btview .mh-check-filter:nth-of-type(3) .mh-check-filter__summary", text: "2 selected" },
        { sel: ".mh-btview__card", count: 3 },
        { sel: ".mh-btview__card:has-text('Paid Customer')" },
        { sel: ".mh-btview__card:has-text('Active Member')", state: "detached" },
      ],
    },
  },
  {
    /* Search is a trimmed lowercase substring over title + description +
       synonyms + scope + creator — "turnover" is a Revenue synonym. */
    id: "p07-business-term-search",
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      actions: [{ fill: ["input[data-bt-search]", "turnover"] }, { waitMs: 300 }],
      expect: [
        { sel: ".bt-term-card", count: 1 },
        { sel: ".bt-term-card[data-bt-id='global-synonym-revenue']", text: "Revenue" },
        { sel: ".fm-pagination", text: "1 records" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      actions: [{ fill: [".mh-btview__search input[type='search']", "turnover"] }, { waitMs: 300 }],
      expect: [
        { sel: ".mh-btview__card", count: 1 },
        { sel: ".mh-btview__card:has-text('Revenue')" },
        { sel: ".mh-btview .mh-pagination", text: "1 records" },
      ],
    },
  },
  {
    /* fm-pagination: 5 rows per page → page 2 holds the sixth card. */
    id: "p07-business-term-pagination",
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      actions: [
        { waitMs: 800 },
        { select: ["[data-bt-page-size]", "5"] },
        { waitMs: 200 },
        { click: "[data-bt-page='next']" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".bt-term-card", count: 1 },
        { sel: ".bt-term-card[data-bt-id='global-synonym-campaign']", text: "Campaign" },
        { sel: ".fm-pagination", text: "2 / 2" },
        { sel: "[data-bt-page='next']", attr: { name: "disabled", value: "" } },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      actions: [
        { select: [".mh-btview .mh-pagination__size select", "5"] },
        { waitMs: 200 },
        { click: ".mh-pagination__next" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-btview__card", count: 1 },
        { sel: ".mh-btview__card:has-text('Campaign')" },
        { sel: ".mh-btview .mh-pagination", text: "2 / 2" },
        { sel: ".mh-pagination__next", attr: { name: "disabled", value: "" } },
      ],
    },
  },
  {
    /* Clicking a card opens the right-side detail drawer with the type
       eyebrow, title + status pill and the footer actions. */
    id: "p07-business-term-detail",
    layout: [
      { orig: ".fm-overlay .fm-drawer", story: ".mh-modal--drawer .mh-modal__dialog", props: ["y", "height"], tol: 8 },
      { orig: ".fm-drawer-head", story: ".mh-modal--drawer .mh-modal__header", props: ["y", "height"], tol: 8 },
      { orig: ".fm-drawer-head small", story: ".mh-modal--drawer .mh-modal__eyebrow", props: ["x", "y"], tol: 8 },
      { orig: ".fm-drawer-titleline h2", story: ".mh-modal--drawer .mh-modal__title", props: ["x", "y", "height"], tol: 8 },
      { orig: ".fm-title-status", story: ".mh-btview__drawer-status", props: ["y", "height"], tol: 8 },
      { orig: ".fm-drawer-body .bt-scope-tag", story: ".mh-btview__detail .mh-btview__scope", props: ["x", "y"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      actions: [{ click: ".bt-term-card[data-bt-id='business-term-gmv']" }, { wait: ".fm-drawer" }],
      expect: [
        { sel: ".fm-drawer-head small", text: "Business Term" },
        { sel: ".fm-drawer-titleline h2", text: "GMV (Gross Merchandise Value)" },
        { sel: ".fm-drawer .fm-title-status", text: "Enabled" },
        { sel: ".fm-drawer-foot .fm-icon-action", count: 3 },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      actions: [{ click: ".mh-btview__card:has-text('GMV')" }, { wait: ".mh-modal--drawer .mh-modal__dialog" }],
      expect: [
        { sel: ".mh-modal--drawer .mh-modal__eyebrow", text: "Business Term" },
        { sel: ".mh-modal--drawer .mh-modal__title", text: "GMV (Gross Merchandise Value)" },
        { sel: ".mh-modal--drawer .mh-btview__drawer-status", text: "Enabled" },
        { sel: ".mh-modal--drawer .mh-modal__foot .mh-btview__action", count: 3 },
      ],
    },
  },
  {
    /* Disable on an enabled own record opens the confirm-offline dialog;
       confirming flips the card pill to Disabled (no toast — the original's
       success-toast hook is undefined). */
    id: "p07-business-term-disable-confirm",
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      actions: [
        { waitMs: 800 },
        { click: ".bt-term-card[data-bt-id='business-term-gmv'] button[data-bt-action='disable']" },
        { wait: ".knowledge-confirm-dialog" },
        { click: ".knowledge-confirm-dialog button:has-text('Confirm Offline')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".bt-term-card[data-bt-id='business-term-gmv'] .fm-state", text: "Disabled" },
        { sel: ".bt-term-card[data-bt-id='business-term-gmv'] .fm-state.off" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      actions: [
        { click: ".mh-btview__card:has-text('GMV') [aria-label^='Disable']" },
        { wait: ".mh-confirm--confirm" },
        { click: ".mh-confirm--confirm button:has-text('Confirm Offline')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-btview__card:has-text('GMV') .mh-btview__state", text: "Disabled" },
        { sel: ".mh-btview__card:has-text('GMV') .mh-btview__state.is-off" },
      ],
    },
  },
  {
    /* The confirm dialog itself (mid-flow state) — warning icon, "Confirm
       Operation" title, Cancel + Confirm Offline. */
    id: "p07-business-term-dialog",
    layout: [
      { orig: ".knowledge-confirm-dialog", story: ".mh-confirm--confirm", props: ["width", "height"], tol: 8 },
      { orig: ".knowledge-confirm-icon", story: ".mh-confirm--confirm .mh-modal__eyebrow", props: ["width", "height"], tol: 8 },
      { orig: ".knowledge-confirm-dialog h3", story: ".mh-confirm--confirm .mh-modal__title", props: ["x", "y"], tol: 8 },
      { orig: ".knowledge-confirm-dialog footer", story: ".mh-confirm--confirm .mh-confirm__foot", props: ["height"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      actions: [
        { waitMs: 800 },
        { click: ".bt-term-card[data-bt-id='business-term-gmv'] button[data-bt-action='disable']" },
        { wait: ".knowledge-confirm-dialog" },
      ],
      expect: [
        { sel: ".knowledge-confirm-dialog h3", text: "Confirm Operation" },
        { sel: ".knowledge-confirm-dialog", text: "Please confirm whether to offline this knowledge." },
        { sel: ".knowledge-confirm-dialog button:has-text('Confirm Offline')" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      actions: [
        { click: ".mh-btview__card:has-text('GMV') [aria-label^='Disable']" },
        { wait: ".mh-confirm--confirm" },
      ],
      expect: [
        { sel: ".mh-confirm--confirm .mh-modal__title", text: "Confirm Operation" },
        { sel: ".mh-confirm--confirm", text: "Please confirm whether to offline this knowledge." },
        { sel: ".mh-confirm--confirm button:has-text('Confirm Offline')" },
      ],
    },
  },
  {
    /* Another user's record: actions stay clickable but show the
       permission-denied info dialog. */
    id: "p07-business-term-permission",
    layout: [
      { orig: "dialog.fm-dialog", story: ".mh-confirm--info", props: ["width", "height"], tol: 8 },
      { orig: "dialog.fm-dialog h3", story: ".mh-confirm--info .mh-modal__title", props: ["x", "y"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      actions: [
        { waitMs: 800 },
        { eval: "document.querySelector(\".bt-term-card[data-bt-id='business-term-paid-customer'] button[data-bt-action='edit']\").click()" },
        { wait: "dialog.fm-dialog" },
        { eval: "if(document.activeElement?.innerText.trim()!=='Close')throw new Error('focus: '+(document.activeElement&&document.activeElement.innerText));" },
        /* text box centre (Range bounds) vs dialog centre, tol 4px */
        { eval: "const d=document.querySelector('dialog.fm-dialog').getBoundingClientRect();const h=document.querySelector('dialog.fm-dialog h3');const rg=document.createRange();rg.selectNodeContents(h);const t=rg.getBoundingClientRect();if(Math.abs(t.x+t.width/2-(d.x+d.width/2))>4)throw new Error('title centre off by '+(t.x+t.width/2-(d.x+d.width/2)));" },
      ],
      expect: [
        { sel: "dialog.fm-dialog h3", text: "Permission denied" },
        { sel: "dialog.fm-dialog", text: "You do not have permission to edit knowledge created by another user." },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      actions: [
        { eval: "document.querySelector(\".mh-btview__card[data-id='business-term-paid-customer'] [aria-label^='Edit']\").click()" },
        { wait: ".mh-confirm--info" },
      ],
      expect: [
        { sel: ".mh-confirm--info .mh-modal__title", text: "Permission denied" },
        { sel: ".mh-confirm--info", text: "You do not have permission to edit knowledge created by another user." },
      ],
    },
  },
  {
    /* Bottom of the type page: the fm-pagination footer stays visible after
       scrolling to the end. */
    id: "p07-business-term-long",
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      actions: [{ waitMs: 800 },
        { eval: "window.scrollTo(0, document.body.scrollHeight)" }, { waitMs: 300 }],
      expect: [
        { sel: ".fm-pagination", text: "6 records" },
        { sel: ".fm-pagination", text: "1 / 1" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      actions: [{ eval: "window.scrollTo(0, document.body.scrollHeight)" }, { waitMs: 300 }],
      expect: [
        { sel: ".mh-btview .mh-pagination", text: "6 records" },
        { sel: ".mh-btview .mh-pagination", text: "1 / 1" },
      ],
    },
  },
  {
    /* 1024 viewport: the 1180px document min-width keeps three columns; the
       tool row and cards narrow with the content column. */
    id: "p07-business-term-narrow",
    viewport: { width: 1024, height: 1400 },
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
      { orig: ".bt-overview-tools", story: ".mh-btview__tools", props: ["x", "width"], tol: 8 },
      { orig: ".bt-term-card", story: ".mh-btview__card", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Business%20Term",
      expect: [
        { sel: ".bt-term-card", count: 6 },
        { sel: ".bt-tag-overflow", count: 6 },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Business Term" },
      expect: [
        { sel: ".mh-btview__card", count: 6 },
        { sel: ".mh-btview__tag--overflow", count: 6 },
      ],
    },
  },
  {
    /* scenario-reports.js #scenarioReportOverview — the toolbar is normalized
       to the unified look (300px search first via order:-1, two 180px boxed
       selects, gold create pushed right) and the card grid to 3 columns. */
    id: "p07-interpreter-scenario",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
      { orig: ".scenario-report-toolbar", story: ".mh-srview__tools", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".scenario-report-toolbar .overview-global-search", story: ".mh-srview__search", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".scenario-report-card", story: ".mh-srview__card", props: ["x", "y", "width"], tol: 8 },
      { orig: ".scenario-report-card .bt-flow-status", story: ".mh-srview__card .mh-srview__flow", props: ["x", "y", "height"], tol: 8 },
      { orig: ".scenario-report-pagination", story: ".mh-srview__pagination", props: ["x", "y"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Scenario%20Reporting",
      expect: [
        { sel: ".scenario-report-card", count: 3, text: "Channel Performance Analysis" },
        { sel: ".scenario-report-card .fm-state.off", count: 2, text: "Disabled" },
        { sel: ".scenario-report-card [data-sr-action='edit']", count: 3 },
        { sel: "#scenarioReportOverview .fm-overview-countline", state: "hidden" },
        { sel: ".scenario-report-pagination", text: "3 records" },
        { sel: "#scenarioAvailabilityFilter" },
        { sel: "#scenarioWorkflowFilter" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Scenario Reporting" },
      expect: [
        { sel: ".mh-srview__card", count: 3, text: "Channel Performance Analysis" },
        { sel: ".mh-srview__state.is-off", count: 2, text: "Disabled" },
        { sel: ".mh-srview__card .mh-srview__icon", count: 9 },
        { sel: ".mh-srview__countline", state: "hidden" },
        { sel: ".mh-srview__pagination", text: "3 records" },
        { sel: ".mh-srview__filter", count: 2 },
      ],
    },
  },
  {
    /* The card click opens the shared #knowledgeDetail drawer: label + title +
       availability/workflow pills, sectioned body, icon-action footer. The
       drawer sits below the 56px header (unlike the fm overlay). */
    id: "p07-scenario-report-drawer",
    layout: [
      { orig: "#knowledgeDetail", story: ".mh-srview__drawer", props: ["x", "y", "width"], tol: 8 },
      { orig: "#knowledgeDetail .detail-drawer-head", story: ".mh-srview__drawer .mh-modal__header", props: ["y", "height"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Scenario%20Reporting",
      actions: [{ waitMs: 800 }, { click: ".scenario-report-card[data-sr-id='scenario-channel-performance'] h3" }, { wait: "#knowledgeDetail.open" }],
      expect: [
        { sel: "#knowledgeDetail .detail-drawer-head span", text: "SCENARIO REPORTING" },
        { sel: "#knowledgeDetail .detail-drawer-head strong", text: "Channel Performance Analysis" },
        { sel: "#knowledgeDetail .scenario-title-status", text: "Disabled" },
        { sel: "#knowledgeDetail .scenario-header-status", text: "Building" },
        { sel: "#knowledgeDetail .scenario-report-link", text: "Invest City Strategy Analysis" },
        { sel: "#knowledgeDetail .scenario-report-workflow-note", text: "AI Interpreter is enabled automatically" },
        { sel: "#knowledgeDetail .scenario-drawer-actions .fm-icon-action", count: 3 },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Scenario Reporting" },
      actions: [{ click: ".mh-srview__card[data-id='scenario-channel-performance'] h3" }, { wait: ".mh-srview__drawer" }],
      expect: [
        { sel: ".mh-srview__drawer .mh-modal__eyebrow", text: "SCENARIO REPORTING" },
        { sel: ".mh-srview__drawer .mh-modal__title", text: "Channel Performance Analysis" },
        { sel: ".mh-srview__drawer .mh-srview__title-pill", text: "Disabled" },
        { sel: ".mh-srview__drawer .mh-srview__flow--head", text: "Building" },
        { sel: ".mh-srview__drawer .mh-srview__detail-link", text: "Invest City Strategy Analysis" },
        { sel: ".mh-srview__drawer .mh-srview__note", text: "AI Interpreter is enabled automatically" },
        { sel: ".mh-srview__drawer .mh-srview__icon", count: 3 },
      ],
    },
  },
  {
    /* types.js: ?type=Principles swaps the asset table for the numbered card
       grid; the "Showing X of Y" count line is display:none on type pages. */
    id: "p07-interpreter-principles",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center .eyebrow", story: ".mh-hero__eyebrow", props: ["x", "y", "height"], tol: 8 },
      { orig: ".business-type-nav button", story: ".mh-sidebar__group .mh-sidebar-item", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      expect: [
        { sel: ".knowledge-main[data-active-type='Principles']" },
        { sel: "#principlesCategoryFilter" },
        { sel: ".principle-list-item", text: "Interactive Agent for Business Questions" },
        { sel: "#assetList", state: "hidden" },
        { sel: "#businessPagination button.active", text: "1" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Principles" },
      expect: [
        { sel: ".mh-interpreter__main[data-active-type='Principles']" },
        { sel: ".mh-check-filter" },
        { sel: ".mh-principle", text: "Interactive Agent for Business Questions" },
        { sel: ".mh-library", state: "detached" },
        { sel: ".mh-pagination__pages button.is-active", text: "1" },
      ],
    },
  },
  {
    id: "p07-principles-category-open",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      actions: [
        { click: "#principlesCategoryFilter summary" },
        { wait: "#principlesCategoryFilter details[open]" },
      ],
      expect: [
        { sel: "#principlesCategoryOptions label", text: "Role" },
        { sel: "#principlesCategorySummary", text: "All categories" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Principles" },
      actions: [
        { click: ".mh-check-filter__summary" },
        { wait: ".mh-check-filter__details[open]" },
      ],
      expect: [
        { sel: ".mh-check-filter__option", text: "Role" },
        { sel: ".mh-check-filter__summary", text: "All categories" },
      ],
    },
  },
  {
    /* Multi-select category filter: picking one category keeps the dropdown
       open, updates the summary to "{n} selected" and re-renders the cards. */
    id: "p07-principles-category-filter",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      actions: [
        { click: "#principlesCategoryFilter summary" },
        { wait: "#principlesCategoryFilter details[open]" },
        { click: "#principlesCategoryOptions label:has-text('System')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: "#principlesCategorySummary", text: "1 selected" },
        { sel: ".principle-list-item", text: "Handle Runtime Context Carefully" },
        { sel: ".principle-list-item:has-text('Interactive Agent')", state: "detached" },
        { sel: "#businessPagination", text: "1 principle" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Principles" },
      actions: [
        { click: ".mh-check-filter__summary" },
        { wait: ".mh-check-filter__details[open]" },
        { click: ".mh-check-filter__option:has-text('System')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-check-filter__summary", text: "1 selected" },
        { sel: ".mh-principle", text: "Handle Runtime Context Carefully" },
        { sel: ".mh-principle:has-text('Interactive Agent')", state: "detached" },
        { sel: ".mh-pagination", text: "1 principle" },
      ],
    },
  },
  {
    /* Search matches category, title and description; the page count and card
       list update live ("Match the Requested Scope" contains "boundary"). */
    id: "p07-principles-search",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      actions: [{ fill: ["#knowledgeSearch", "requested scope"] }, { waitMs: 300 }],
      expect: [
        { sel: ".principle-list-item", text: "Match the Requested Scope" },
        { sel: ".principle-list-item:has-text('Interactive Agent')", state: "detached" },
        { sel: "#businessPagination", text: "1 principle" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Principles" },
      actions: [{ fill: [".mh-principles input[type='search']", "requested scope"] }, { waitMs: 300 }],
      expect: [
        { sel: ".mh-principle", text: "Match the Requested Scope" },
        { sel: ".mh-principle:has-text('Interactive Agent')", state: "detached" },
        { sel: ".mh-pagination", text: "1 principle" },
      ],
    },
  },
  {
    id: "p07-principles-empty",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      actions: [{ fill: ["#knowledgeSearch", "zzzz-nothing"] }, { waitMs: 300 }],
      expect: [{ sel: ".principles-empty", text: "No matching principles" }],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Principles" },
      actions: [{ fill: [".mh-principles input[type='search']", "zzzz-nothing"] }, { waitMs: 300 }],
      expect: [{ sel: ".mh-principles__empty", text: "No matching principles" }],
    },
  },
  {
    /* Long descriptions clamp to ~2 lines; the chevron expands the full text
       (toggle only renders when the measured text overflows). */
    id: "p07-principles-expand",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      actions: [
        { wait: ".principle-list-item:has-text('Resolve Requests') .principle-description-toggle" },
        { click: ".principle-list-item:has-text('Resolve Requests') .principle-description-toggle" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".principle-list-item:has-text('Resolve Requests') .principle-description.is-expanded", text: "Users primarily request business data" },
        { sel: ".principle-list-item:has-text('Resolve Requests') .principle-description-toggle", attr: { name: "aria-expanded", value: "true" } },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Principles" },
      actions: [
        { wait: ".mh-principle:has-text('Resolve Requests') .mh-principle__toggle" },
        { click: ".mh-principle:has-text('Resolve Requests') .mh-principle__toggle" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-principle:has-text('Resolve Requests') .mh-principle__desc.is-expanded", text: "Users primarily request business data" },
        { sel: ".mh-principle:has-text('Resolve Requests') .mh-principle__toggle", attr: { name: "aria-expanded", value: "true" } },
      ],
    },
  },
  {
    /* types.js: "/" focuses the visible type-page search (not while editing). */
    id: "p07-principles-slash",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      actions: [{ press: ["body", "/"] }, { waitMs: 200 }],
      expect: [
        { sel: "#knowledgeSearch:focus" },
        { sel: "#businessPagination", text: "10 principles" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Principles" },
      actions: [
        { wait: ".mh-principles input[type='search']" },
        { waitMs: 400 },
        { press: ["body", "/"] },
        { waitMs: 200 },
      ],
      expect: [
        { sel: ".mh-principles input[type='search']:focus" },
        { sel: ".mh-pagination", text: "10 principles" },
      ],
    },
  },
  {
    /* Long page scrolled to the bottom: the fixed sidebar rail must still sit
       at y=56 under the header (the layout check proves it stays fixed). */
    id: "p07-principles-long",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      actions: [{ eval: "window.scrollTo(0, document.body.scrollHeight)" }, { waitMs: 300 }],
      expect: [
        { sel: ".principle-list-item:has-text('Respect Session Guidance')" },
        { sel: "#businessPagination", text: "10 principles" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Principles" },
      actions: [{ eval: "window.scrollTo(0, document.body.scrollHeight)" }, { waitMs: 300 }],
      expect: [
        { sel: ".mh-principle:has-text('Respect Session Guidance')", text: "Respect Session Guidance" },
        { sel: ".mh-pagination", text: "10 principles" },
      ],
    },
  },
  {
    /* The original's min-width:1180 document + ≤1240 breakpoint: the fixed
       rail moves to left:32 and the hero takes margin-left:272/width:876 at
       a 1024 viewport (the document stays 1180 wide). */
    id: "p07-interpreter-overview-narrow",
    viewport: { width: 1024, height: 1400 },
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-hero-stat", story: ".mh-hero__aside .mh-metric", props: ["x", "y", "width", "height"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html",
      expect: [{ sel: ".v20-type-card", count: 8 }, { sel: "h1", text: "AI Interpreter" }],
    },
    story: {
      id: "pages--interpreter",
      expect: [{ sel: ".mh-type-card", count: 8 }, { sel: ".mh-hero h1", text: "AI Interpreter" }],
    },
  },
  {
    id: "p07-interpreter-principles-narrow",
    viewport: { width: 1024, height: 1400 },
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-hero-stat", story: ".mh-hero__aside .mh-metric", props: ["x", "y", "width", "height"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      expect: [
        { sel: ".principle-list-item", text: "Interactive Agent for Business Questions" },
        { sel: "#businessPagination", text: "10 principles" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Principles" },
      expect: [
        { sel: ".mh-principle", text: "Interactive Agent for Business Questions" },
        { sel: ".mh-pagination", text: "10 principles" },
      ],
    },
  },
  {
    /* field-library.js #fmLibrary: the unified toolbar (300px gold search
       pill visually first + 180px Project disclosure) over a three-column
       .fm-report-card grid and fm-pagination. */
    id: "p07-interpreter-report-context",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
      { orig: "#fmLibrary .fm-tools", story: ".mh-flview__tools", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: "#fmLibrary .fm-search-field", story: ".mh-flview__search", props: ["x", "width"], tol: 8 },
      { orig: "#fmLibrary .fm-report-card", story: ".mh-flview__report-card", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: "#fmLibrary .fm-pagination", story: ".mh-flview .mh-pagination", props: ["x", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Report%20Context",
      expect: [
        { sel: ".fm-report-card", count: 6, text: "Invest City Strategy Analysis" },
        { sel: "#fmLibrary .fm-search", attr: { name: "placeholder", value: "Search knowledge..." } },
        { sel: "#fmLibrary .fm-filter summary", text: "All projects" },
        { sel: ".fm-report-card[data-fm-id='city-report-context'] .fm-report-card-status", text: "Enabled" },
        { sel: ".fm-pagination", text: "6 records" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Report Context" },
      expect: [
        { sel: ".mh-flview__report-card", count: 6, text: "Invest City Strategy Analysis" },
        { sel: ".mh-flview__search input", attr: { name: "placeholder", value: "Search knowledge..." } },
        { sel: ".mh-flview .mh-check-filter .mh-check-filter__summary", text: "All projects" },
        { sel: ".mh-flview__card[data-id='city-report-context'] .mh-flview__state", text: "Enabled" },
        { sel: ".mh-flview .mh-pagination", text: "6 records" },
        { sel: ".mh-asset", state: "detached" },
      ],
    },
  },
  {
    /* RC Project disclosure: checking D2C Insights keeps the three D2C
       contexts and the summary shows the joined label (not "1 selected"). */
    id: "p07-field-library-project-filter",
    original: {
      url: "/assets/pages/knowledge.html?type=Report%20Context",
      actions: [
        { waitMs: 800 },
        { click: "#fmLibrary .fm-filter summary" },
        { wait: "#fmLibrary .fm-filter details[open]" },
        { click: "#fmLibrary .fm-options label:has-text('D2C Insights')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: "#fmLibrary .fm-filter summary", text: "D2C Insights" },
        { sel: ".fm-report-card", count: 3 },
        { sel: ".fm-report-card[data-fm-id='abo-report-context']", state: "detached" },
        { sel: ".fm-pagination", text: "3 records" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Report Context" },
      actions: [
        { click: ".mh-flview .mh-check-filter__summary" },
        { wait: ".mh-flview .mh-check-filter__details[open]" },
        { click: ".mh-flview .mh-check-filter__option:has-text('D2C Insights')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-flview .mh-check-filter__summary", text: "D2C Insights" },
        { sel: ".mh-flview__card", count: 3 },
        { sel: ".mh-flview__card[data-id='abo-report-context']", state: "detached" },
        { sel: ".mh-flview .mh-pagination", text: "3 records" },
      ],
    },
  },
  {
    /* RC card click opens the 820px drawer: eyebrow + title + Enabled pill,
       thumbnail, Report Description with the gold pencil, project chip, AI
       status rows, linked-scenario chips, scope and Close/Open Dashboard. */
    /* NB: two .fm-overlay drawers live in the document — the fm library's
       (#fmDrawerTitle) and the Business Term one (#btDrawerTitle). Original
       selectors must scope to the open overlay. */
    id: "p07-field-library-rc-drawer",
    layout: [
      { orig: ".fm-overlay:not([hidden]) .fm-drawer", story: ".mh-modal--drawer .mh-modal__dialog", props: ["y", "height"], tol: 8 },
      { orig: ".fm-overlay:not([hidden]) .fm-drawer-head", story: ".mh-modal--drawer .mh-modal__header", props: ["y", "height"], tol: 8 },
      { orig: "#fmDrawerTitle", story: ".mh-modal--drawer .mh-modal__title", props: ["x", "y", "height"], tol: 8 },
      { orig: ".fm-overlay:not([hidden]) .fm-rc-thumbnail", story: ".mh-flview__rc-thumb", props: ["x", "y", "width"], tol: 8 },
      { orig: ".fm-overlay:not([hidden]) .fm-drawer-foot", story: ".mh-modal--drawer .mh-modal__foot", props: ["height"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Report%20Context",
      actions: [{ waitMs: 800 }, { click: ".fm-report-card[data-fm-id='city-report-context']" }, { wait: ".fm-overlay:not([hidden])" }],
      expect: [
        { sel: ".fm-overlay:not([hidden]) .fm-drawer-head small", text: "Report Context" },
        { sel: "#fmDrawerTitle", text: "Invest City Strategy Analysis" },
        { sel: "#fmDrawerStatus", text: "Enabled" },
        { sel: ".fm-overlay:not([hidden]) .fm-rc-meta [class*='fm-domain-']", text: "D2C Insights" },
        { sel: ".fm-overlay:not([hidden]) .fm-scenario-link", count: 2, text: "Channel Performance Analysis" },
        { sel: ".fm-overlay:not([hidden]) .fm-open-dashboard", text: "Open Dashboard" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Report Context" },
      actions: [{ click: ".mh-flview__report-card[data-id='city-report-context']" }, { wait: ".mh-modal--drawer .mh-modal__dialog" }],
      expect: [
        { sel: ".mh-modal--drawer .mh-modal__eyebrow", text: "Report Context" },
        { sel: ".mh-modal--drawer .mh-modal__title", text: "Invest City Strategy Analysis" },
        { sel: ".mh-modal--drawer .mh-flview__state", text: "Enabled" },
        { sel: ".mh-modal--drawer .mh-flview__domain", text: "D2C Insights" },
        { sel: ".mh-modal--drawer .mh-flview__scenario-link", count: 2, text: "Channel Performance Analysis" },
        { sel: ".mh-flview__open-dashboard", text: "Open Dashboard" },
      ],
    },
  },
  {
    /* RC description dialog: Confirm stays disabled until the text differs
       from the stored description; confirming rewrites the card/drawer copy
       and appends a history entry (the standalone history dialog is dead
       code in the original — not reproduced). */
    id: "p07-field-library-rc-description",
    original: {
      url: "/assets/pages/knowledge.html?type=Report%20Context",
      actions: [
        { waitMs: 800 },
        { click: ".fm-report-card[data-fm-id='city-report-context']" },
        { wait: ".fm-overlay:not([hidden])" },
        { click: ".fm-overlay:not([hidden]) .fm-rc-description-edit" },
        { wait: "dialog.rc-description-edit-dialog" },
        { fill: [".rc-description-edit-field textarea", "Updated description."] },
        { waitMs: 200 },
        { click: "dialog.rc-description-edit-dialog button.primary" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".fm-report-card[data-fm-id='city-report-context'] p", text: "Updated description." },
        { sel: ".fm-overlay:not([hidden]) .fm-rc-overview > p", text: "Updated description." },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Report Context" },
      actions: [
        { click: ".mh-flview__report-card[data-id='city-report-context']" },
        { wait: ".mh-modal--drawer .mh-modal__dialog" },
        { click: ".mh-flview__rc-edit" },
        { wait: ".mh-flview__edit textarea" },
        { fill: [".mh-flview__edit textarea", "Updated description."] },
        { waitMs: 200 },
        { click: ".mh-flview__edit-btn--primary" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-flview__report-card[data-id='city-report-context'] p", text: "Updated description." },
        { sel: ".mh-modal--drawer .mh-flview__rc-overview p", text: "Updated description." },
      ],
    },
  },
  {
    /* Metric Dictionary: 3-column fm-metric-card grid with the definition
       clamp, Unit/Type/Data-model meta and the synonym + "…" chips; the card
       opens the governed-fields drawer (Metric Name through Calculation
       Rules) with an empty footer strip. */
    id: "p07-field-library-metric-dictionary",
    layout: [
      { orig: "#fmLibrary .fm-metric-card", story: ".mh-flview__metric-card", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: "#fmLibrary .fm-metric-meta", story: ".mh-flview__metric-meta", props: ["x", "y"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Metric%20Dictionary",
      actions: [{ waitMs: 800 }, { click: ".fm-metric-card[data-fm-id='metric-dictionary-member-conversion']" }, { wait: ".fm-overlay:not([hidden])" }],
      expect: [
        { sel: ".fm-metric-card", count: 3, text: "Member conversion" },
        { sel: "#fmLibrary .fm-filter summary", text: "All models" },
        { sel: ".fm-metric-synonym.fm-metric-more", count: 3 },
        { sel: ".fm-overlay:not([hidden]) .fm-drawer-head small", text: "Metric Dictionary" },
        { sel: ".fm-overlay:not([hidden]) .scenario-report-section:has(h3:text-is('Calculation Rules')) .scenario-report-prewrap", text: "Qualified member transactions" },
        { sel: ".fm-overlay:not([hidden]) .fm-drawer-foot .fm-icon-action", count: 0, state: "detached" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Metric Dictionary" },
      actions: [{ click: ".mh-flview__metric-card[data-id='metric-dictionary-member-conversion']" }, { wait: ".mh-modal--drawer .mh-modal__dialog" }],
      expect: [
        { sel: ".mh-flview__metric-card", count: 3, text: "Member conversion" },
        { sel: ".mh-flview .mh-check-filter .mh-check-filter__summary", text: "All models" },
        { sel: ".mh-flview__synonym--more", count: 3 },
        { sel: ".mh-modal--drawer .mh-modal__eyebrow", text: "Metric Dictionary" },
        { sel: ".mh-modal--drawer .mh-flview__section:has(h3:text-is('Calculation Rules')) .mh-flview__prewrap", text: "Qualified member transactions" },
        { sel: ".mh-modal--drawer .mh-modal__foot .mh-flview__action", count: 0, state: "detached" },
      ],
    },
  },
  {
    /* Analytical Model: single playbook card with the 3-filter toolbar +
       gold create link; owner+Enabled gates edit/delete to `disabled` while
       Disable stays live; the card drawer re-lists the gated actions in its
       footer. */
    id: "p07-field-library-analytical-model",
    layout: [
      { orig: "#fmLibrary .fm-tools", story: ".mh-flview__tools", props: ["x", "y", "width"], tol: 8 },
      { orig: "#fmLibrary .knowledge-add-button", story: ".mh-flview__create", props: ["x", "y"], tol: 10 },
      { orig: "#fmLibrary .fm-analysis-card", story: ".mh-flview__analysis-card", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: "#fmLibrary .fm-analysis-card-footer", story: ".mh-flview__analysis-footer", props: ["x", "y"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Analytical%20Model",
      expect: [
        { sel: ".fm-analysis-card", count: 1, text: "Opportunity scan playbook" },
        { sel: "#fmLibrary .knowledge-add-button", text: "Add Analytical Model" },
        { sel: "#fmLibrary .fm-filter", count: 3 },
        { sel: ".fm-analysis-card [data-fm-action='edit']", attr: { name: "disabled", value: "" } },
        { sel: ".fm-analysis-card [data-fm-action='delete']", attr: { name: "disabled", value: "" } },
        { sel: ".fm-analysis-card [data-fm-action='disable']:not([disabled])" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Analytical Model" },
      expect: [
        { sel: ".mh-flview__analysis-card", count: 1, text: "Opportunity scan playbook" },
        { sel: ".mh-flview__create", text: "Add Analytical Model" },
        { sel: ".mh-flview .mh-check-filter", count: 3 },
        { sel: ".mh-flview__analysis-card [aria-label='Edit']", attr: { name: "disabled", value: "" } },
        { sel: ".mh-flview__analysis-card [aria-label='Delete']", attr: { name: "disabled", value: "" } },
        { sel: ".mh-flview__analysis-card [aria-label='Disable']:not([disabled])" },
      ],
    },
  },
  {
    /* AM disable flow: "Disable" → "Confirm Offline" flips the card pill to
       Disabled and unlocks edit/delete (status gate is `Disabled` only). */
    id: "p07-field-library-am-disable",
    original: {
      url: "/assets/pages/knowledge.html?type=Analytical%20Model",
      actions: [
        { waitMs: 800 },
        { click: ".fm-analysis-card [data-fm-action='disable']" },
        { wait: "dialog.fm-dialog" },
        { click: "dialog.fm-dialog button:has-text('Confirm Offline')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".fm-analysis-card .fm-state", text: "Disabled" },
        { sel: ".fm-analysis-card [data-fm-action='edit']:not([disabled])" },
        { sel: ".fm-analysis-card [data-fm-action='delete']:not([disabled])" },
        { sel: ".fm-analysis-card [data-fm-action='disable']", attr: { name: "disabled", value: "" } },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Analytical Model" },
      actions: [
        { click: ".mh-flview__analysis-card [aria-label='Disable']" },
        { wait: ".mh-confirm--confirm" },
        { click: ".mh-confirm--confirm button:has-text('Confirm Offline')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-flview__analysis-card .mh-flview__state", text: "Disabled" },
        { sel: ".mh-flview__analysis-card [aria-label='Edit']:not([disabled])" },
        { sel: ".mh-flview__analysis-card [aria-label='Delete']:not([disabled])" },
        { sel: ".mh-flview__analysis-card [aria-label='Disable']", attr: { name: "disabled", value: "" } },
      ],
    },
  },
  {
    /* AM delete on a referenced (now-disabled) record opens the info dialog —
       the record stays in the grid. */
    id: "p07-field-library-am-delete-blocked",
    original: {
      url: "/assets/pages/knowledge.html?type=Analytical%20Model",
      actions: [
        { waitMs: 800 },
        { click: ".fm-analysis-card [data-fm-action='disable']" },
        { wait: "dialog.fm-dialog" },
        { click: "dialog.fm-dialog button:has-text('Confirm Offline')" },
        { waitMs: 300 },
        { click: ".fm-analysis-card [data-fm-action='delete']" },
        { wait: "dialog.fm-dialog" },
      ],
      expect: [
        { sel: "dialog.fm-dialog h3", text: "Deletion blocked" },
        { sel: "dialog.fm-dialog", text: "City Strategy Dashboard" },
        { sel: ".fm-analysis-card", count: 1 },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Analytical Model" },
      actions: [
        { click: ".mh-flview__analysis-card [aria-label='Disable']" },
        { wait: ".mh-confirm--confirm" },
        { click: ".mh-confirm--confirm button:has-text('Confirm Offline')" },
        { waitMs: 300 },
        { click: ".mh-flview__analysis-card [aria-label='Delete']" },
        { wait: ".mh-confirm--info" },
      ],
      expect: [
        { sel: ".mh-confirm--info .mh-modal__title", text: "Deletion blocked" },
        { sel: ".mh-confirm--info", text: "City Strategy Dashboard" },
        { sel: ".mh-flview__analysis-card", count: 1 },
      ],
    },
  },
  {
    /* Email Reports: fm-email-card grid (send time, recipient chips, Data
       Model); the third report is Disabled. The card drawer lists subject,
       trigger, to/cc recipients, related report and last sent, and hides the
       footer entirely. */
    id: "p07-field-library-email-reports",
    layout: [
      { orig: "#fmLibrary .fm-email-card", story: ".mh-flview__email-card", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: "#fmLibrary .fm-email-recipient-tags", story: ".mh-flview__email-recipient-tags", props: ["x", "y"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Email%20Reports",
      actions: [{ waitMs: 800 }, { click: ".fm-email-card[data-fm-id='email-report-campaign-alert']" }, { wait: ".fm-overlay:not([hidden])" }],
      expect: [
        { sel: ".fm-email-card", count: 3, text: "Weekly Marketing Performance" },
        { sel: ".fm-email-card.is-disabled", text: "Monthly Customer Growth Review" },
        { sel: "#fmLibrary .fm-filter summary", text: "All statuses" },
        { sel: ".fm-overlay:not([hidden]) .fm-drawer-head small", text: "Email Reports" },
        { sel: ".fm-overlay:not([hidden]) .fm-drawer", text: "Noah Wang" },
        { sel: ".fm-overlay:not([hidden]) .fm-drawer-foot", state: "hidden" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Email Reports" },
      actions: [{ click: ".mh-flview__email-card[data-id='email-report-campaign-alert']" }, { wait: ".mh-modal--drawer .mh-modal__dialog" }],
      expect: [
        { sel: ".mh-flview__email-card", count: 3, text: "Weekly Marketing Performance" },
        { sel: ".mh-flview__email-card.is-disabled", text: "Monthly Customer Growth Review" },
        { sel: ".mh-flview .mh-check-filter .mh-check-filter__summary", text: "All statuses" },
        { sel: ".mh-modal--drawer .mh-modal__eyebrow", text: "Email Reports" },
        { sel: ".mh-modal--drawer", text: "Noah Wang" },
        { sel: ".mh-modal--drawer .mh-modal__foot", state: "detached" },
      ],
    },
  },
  {
    /* fm pagination + search on RC: 5/page splits the grid, search "4P"
       collapses to one page. */
    id: "p07-field-library-pagination",
    original: {
      url: "/assets/pages/knowledge.html?type=Report%20Context",
      actions: [
        { waitMs: 800 },
        { select: ["#fmLibrary .fm-pagination select", "5"] },
        { waitMs: 200 },
        { click: "#fmLibrary .fm-pagination [data-page='next']" },
        { waitMs: 200 },
        { fill: ["#fmLibrary .fm-search", "4P"] },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".fm-report-card", count: 1 },
        { sel: ".fm-pagination", text: "1 / 1" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Report Context" },
      actions: [
        { select: [".mh-flview .mh-pagination__size select", "5"] },
        { waitMs: 200 },
        { click: ".mh-flview .mh-pagination__next" },
        { waitMs: 200 },
        { fill: [".mh-flview__search input[type='search']", "4P"] },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-flview__report-card", count: 1 },
        { sel: ".mh-flview .mh-pagination", text: "1 / 1" },
      ],
    },
  },
  {
    /* data-model-browser.js #dataModelOverview — domain sidebar (search +
       domain cards, Customer Growth hidden) + tab strip + Basic information
       card (name + Enabled pill, synonym chips, related-report buttons). */
    id: "p07-data-model-basic",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
      { orig: ".dm-domain-shell", story: ".mh-dmview__shell", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".dm-domain-sidebar", story: ".mh-dmview__sidebar", props: ["x", "width"], tol: 8 },
      { orig: ".dm-search-wrap", story: ".mh-dmview__search", props: ["x", "y", "height"], tol: 8 },
      { orig: ".dm-domain-card", story: ".mh-dmview__domain", props: ["x", "y", "width"], tol: 8 },
      { orig: ".dm-domain-tabs", story: ".mh-dmview__tabs", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".dm-basic-card", story: ".mh-dmview__basic", props: ["x", "y", "width"], tol: 8 },
      { orig: ".dm-basic-card .fm-report-card-status", story: ".mh-dmview__basic-status", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".dm-related-report", story: ".mh-dmview__report", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Data%20Model",
      expect: [
        { sel: ".dm-domain-card", count: 3 },
        { sel: ".dm-domain-card:has-text(\"Customer Growth\")", count: 0, state: "detached" },
        { sel: ".dm-domain-card.active", text: "D2C Insight" },
        { sel: ".dm-domain-tab.active", text: "Basic information" },
        { sel: ".dm-basic-card .dm-basic-name-row strong", text: "D2C Insight" },
        { sel: ".dm-basic-card .fm-report-card-status", text: "Enabled" },
        { sel: ".dm-basic-card .dm-tag", count: 5 },
        { sel: ".dm-related-report", count: 3 },
        { sel: ".dm-related-report:has-text(\"4P Report\")" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Data Model" },
      expect: [
        { sel: ".mh-dmview__domain", count: 3 },
        { sel: ".mh-dmview__domain:has-text(\"Customer Growth\")", count: 0, state: "detached" },
        { sel: ".mh-dmview__domain.is-active", text: "D2C Insight" },
        { sel: ".mh-dmview__tab.is-active", text: "Basic information" },
        { sel: ".mh-dmview__basic-name strong", text: "D2C Insight" },
        { sel: ".mh-dmview__basic-status", text: "Enabled" },
        { sel: ".mh-dmview__synonym", count: 5 },
        { sel: ".mh-dmview__report", count: 3 },
        { sel: ".mh-dmview__report:has-text(\"4P Report\")" },
      ],
    },
  },
  {
    /* Relationship graph tab — fact + 5 dimension nodes on the fixed-slot
       canvas, dashed bezier links, zoom tools. */
    id: "p07-data-model-graph",
    layout: [
      { orig: ".dm-graph-canvas", story: ".mh-dmview__canvas", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".dm-graph-node.dm-node-1", story: ".mh-dmview__node--1", props: ["x", "y", "width"], tol: 12 },
      { orig: ".dm-graph-node.dm-node-5", story: ".mh-dmview__node--5", props: ["x", "y", "width"], tol: 12 },
      { orig: ".dm-graph-tools", story: ".mh-dmview__graph-tools", props: ["x", "y"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Data%20Model",
      actions: [{ waitMs: 800 }, { click: ".dm-domain-tab[data-tab='graph']" }, { waitMs: 400 }],
      expect: [
        { sel: ".dm-graph-node", count: 6 },
        { sel: ".dm-graph-node.is-fact", count: 1, text: "Sales Order Detail" },
        { sel: ".dm-graph-links" },
        { sel: ".dm-graph-links path.dm-graph-link", count: 5, state: "detached" },
        { sel: ".dm-graph-tools button", count: 3 },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Data Model" },
      actions: [{ click: ".mh-dmview__tab:last-child" }, { waitMs: 400 }],
      expect: [
        { sel: ".mh-dmview__node", count: 6 },
        { sel: ".mh-dmview__node.is-fact", count: 1, text: "Sales Order Detail" },
        { sel: ".mh-dmview__links" },
        { sel: ".mh-dmview__links path.mh-dmview__link", count: 5, state: "detached" },
        { sel: ".mh-dmview__graph-tools button", count: 3 },
      ],
    },
  },
  {
    /* Graph node click → the restyled centered table dialog (1120px, title +
       Fact mark + description head, segmented Field Details/Data Preview
       tabs, gold-header field table with the fact-only Unit column). */
    id: "p07-data-model-table-drawer",
    layout: [
      { orig: ".dm-table-dialog", story: ".mh-dmview__dialog", props: ["x", "y", "width"], tol: 12 },
      { orig: ".dm-table-dialog-tabs", story: ".mh-dmview__dialog-tabs", props: ["x", "y"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Data%20Model",
      actions: [
        { waitMs: 800 },
        { click: ".dm-domain-tab[data-tab='graph']" },
        { waitMs: 400 },
        { click: ".dm-graph-node.is-fact" },
        { wait: ".dm-table-drawer.open" },
      ],
      expect: [
        { sel: ".dm-table-drawer-head strong", text: "Sales Order Detail" },
        { sel: ".dm-table-type.is-fact", text: "Fact" },
        { sel: ".dm-table-dialog-tab.is-active", text: "Field Details" },
        { sel: ".dm-fields-table th:has-text(\"Unit\")" },
        { sel: ".dm-fields-table .dm-field-code:has-text(\"sales_amount\")" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Data Model" },
      actions: [
        { click: ".mh-dmview__tab:last-child" },
        { waitMs: 400 },
        { click: ".mh-dmview__node.is-fact" },
        { wait: ".mh-dmview__dialog" },
      ],
      expect: [
        { sel: ".mh-dmview__dialog-titleline strong", text: "Sales Order Detail" },
        { sel: ".mh-dmview__table-type.is-fact", text: "Fact" },
        { sel: ".mh-dmview__dialog-tab.is-active", text: "Field Details" },
        { sel: ".mh-dmview__table th:has-text(\"Unit\")" },
        { sel: ".mh-dmview__field-code:has-text(\"sales_amount\")" },
      ],
    },
  },
  {
    /* Data Preview tab — 10 deterministic rows; Escape closes the dialog. */
    id: "p07-data-model-preview-close",
    original: {
      url: "/assets/pages/knowledge.html?type=Data%20Model",
      actions: [
        { waitMs: 800 },
        { click: ".dm-domain-tab[data-tab='graph']" },
        { waitMs: 400 },
        { click: ".dm-graph-node.is-fact" },
        { wait: ".dm-table-drawer.open" },
        { click: ".dm-table-dialog-tab[data-dm-table-tab='preview']" },
        { waitMs: 200 },
      ],
      expect: [
        { sel: ".dm-table-dialog-tab.is-active", text: "Data Preview" },
        { sel: ".dm-preview-table tbody tr", count: 10 },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Data Model" },
      actions: [
        { click: ".mh-dmview__tab:last-child" },
        { waitMs: 400 },
        { click: ".mh-dmview__node.is-fact" },
        { wait: ".mh-dmview__dialog" },
        { click: ".mh-dmview__dialog-tab:last-child" },
        { waitMs: 200 },
      ],
      expect: [
        { sel: ".mh-dmview__dialog-tab.is-active", text: "Data Preview" },
        { sel: ".mh-dmview__table tbody tr", count: 10 },
      ],
    },
  },
  {
    /* Domain search filters the sidebar (hidden Customer Growth never
       surfaces) + a related-report button opens the fm RC drawer over the
       Data Model page (reportcontext:view). */
    id: "p07-data-model-search-peek",
    original: {
      url: "/assets/pages/knowledge.html?type=Data%20Model",
      actions: [
        { waitMs: 800 },
        { fill: ["#dmDomainSearch", "audience"] },
        { waitMs: 300 },
      ],
      expect: [{ sel: ".dm-domain-card", count: 1, text: "DC Media Performance" }],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Data Model" },
      actions: [
        { fill: [".mh-dmview__search input[type='search']", "audience"] },
        { waitMs: 300 },
      ],
      expect: [{ sel: ".mh-dmview__domain", count: 1, text: "DC Media Performance" }],
    },
  },
  {
    id: "p07-data-model-rc-peek",
    layout: [
      { orig: ".fm-overlay:not([hidden]) .fm-drawer", story: ".mh-modal--drawer .mh-modal__dialog", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Data%20Model",
      actions: [
        { waitMs: 800 },
        { click: ".dm-related-report[data-report-context-id='fourp-report-context']" },
        { wait: ".fm-overlay:not([hidden]) .fm-drawer" },
      ],
      expect: [
        { sel: ".fm-overlay:not([hidden]) .fm-drawer-head small", text: "Report Context" },
        { sel: ".fm-overlay:not([hidden]) .fm-drawer:has-text(\"4P Executive Overview\")" },
        { sel: ".dm-domain-shell" },
      ],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Data Model" },
      actions: [
        { click: ".mh-dmview__report[aria-label='Open 4P Report Report Context']" },
        { wait: ".mh-modal--drawer .mh-modal__dialog" },
      ],
      expect: [
        { sel: ".mh-modal--drawer .mh-modal__eyebrow", text: "Report Context" },
        { sel: ".mh-modal--drawer:has-text(\"4P Executive Overview\")" },
        { sel: ".mh-dmview__shell" },
      ],
    },
  },
];
