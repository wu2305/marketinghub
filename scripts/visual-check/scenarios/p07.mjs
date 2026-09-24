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
    id: "p07-interpreter-scenario",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
    ],
    original: { url: "/assets/pages/knowledge.html?type=Scenario%20Reporting", expect: [{ sel: ".scenario-report-card", count: 3, text: "Channel Performance Analysis" }] },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Scenario Reporting" },
      expect: [{ sel: ".mh-library", text: "Channel Performance Analysis" }, { sel: ".mh-asset", count: 3 }],
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
    /* Report Context's original view renders dedicated .fm-report-card shells
       (the generic .asset-rows are present but 0-height); React still shows the
       transitional generic list of the same six records. The pair asserts the
       shared shell geometry plus each side's own six items. */
    id: "p07-interpreter-report-context",
    layout: [
      { orig: ".knowledge-sidebar", story: ".mh-sidebar", props: ["x", "y", "width"], tol: 8 },
      { orig: ".knowledge-command-center", story: ".mh-hero", props: ["x", "y", "width", "height"], tol: 8 },
      { orig: ".knowledge-main", story: ".mh-interpreter__main", props: ["x", "y", "width"], tol: 8 },
    ],
    original: {
      url: "/assets/pages/knowledge.html?type=Report%20Context",
      expect: [{ sel: ".fm-report-card", count: 6, text: "Invest City Strategy Analysis" }],
    },
    story: {
      id: "pages--interpreter",
      args: { activeType: "Report Context" },
      expect: [{ sel: ".mh-asset", count: 6, text: "City Strategy report context" }],
    },
  }
];
