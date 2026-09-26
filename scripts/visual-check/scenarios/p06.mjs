export default [
  {
    id: "p06-campaign",
    original: { url: "/assets/pages/campaign.html", expect: [{ sel: ".campaign-rail" }, { sel: "#overviewTitle", text: "Overview Dashboard" }] },
    story: { id: "pages--campaign", expect: [{ sel: ".mh-campaign", text: "Overview Dashboard" }, { sel: ".mh-rail" }] },
  },
  {
    id: "p06-campaign-account-filtered",
    original: { url: "/assets/pages/campaign.html", actions: [{ fill: ["#accountSearch", "Coach_XHS_02"] }], expect: [{ sel: "#accountTable tbody tr:not([hidden])", count: 1, text: "Coach_XHS_02" }, { sel: "#accountTableResult", text: "1 account shown" }] },
    story: { id: "pages--campaign-account-filtered", expect: [{ sel: ".mh-campaign__table tbody tr", count: 1, text: "Coach_XHS_02" }, { sel: ".mh-campaign__table", text: "1 account shown" }] },
  },
  {
    id: "p06-campaign-execution",
    original: { url: "/assets/pages/campaign.html#execution", expect: [{ sel: "#executionTitle", text: "RedNote Campaign Tool" }, { sel: ".execution-summary", text: "Awaiting confirmation" }] },
    story: { id: "pages--campaign-execution", expect: [{ sel: ".mh-heading--view h2", text: "RedNote Campaign Tool" }, { sel: ".mh-summary", text: "Awaiting confirmation" }] },
  },
  {
    id: "p06-campaign-assets",
    original: { url: "/assets/pages/campaign.html#assets", expect: [{ sel: "#assetsTitle", text: "Creative Assets" }, { sel: ".asset-table", text: "Tabby 26SS seeding assets" }] },
    story: { id: "pages--campaign-assets", expect: [{ sel: ".mh-heading--view h2", text: "Creative Assets" }, { sel: ".mh-campaign .mh-table", text: "Tabby 26SS seeding assets" }] },
  },
  {
    id: "p06-campaign-analytics",
    original: { url: "/assets/pages/campaign.html#analytics", expect: [{ sel: "#analyticsTitle", text: "Analytics Center" }, { sel: ".efficiency-metrics", text: "Time saved" }] },
    story: { id: "pages--campaign-analytics", expect: [{ sel: ".mh-heading--view h2", text: "Analytics Center" }, { sel: ".mh-efficiency", text: "Time saved" }] },
  },
  {
    id: "p06-campaign-task-open",
    original: { url: "/assets/pages/campaign.html#execution", actions: [{ click: "[data-open-task]" }], expect: [{ sel: "#taskDialog[open]", text: "Create Campaign Task" }, { sel: "#taskForm", text: "Pending confirmation" }] },
    story: { id: "pages--campaign-task-dialog", expect: [{ sel: ".mh-task-dialog__form", text: "Pending confirmation" }, { sel: ".mh-task-dialog .mh-modal__title", text: "Create Campaign Task" }] },
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
      id: "pages--campaign-task-submitted",
      expect: [
        { sel: ".mh-toast", text: "Campaign task added to the review queue." },
        { sel: ".mh-modal", state: "detached" },
      ],
    },
  },
  {
    /* The original task <dialog> never resets its form — Cancel/×/backdrop/
       Escape and even submit keep the field values; reopening shows them.
       useCampaignDemo keeps the controlled draft across Modal unmounts. */
    id: "p06-campaign-task-draft",
    original: {
      url: "/assets/pages/campaign.html#execution",
      actions: [
        { click: "[data-open-task]" },
        { wait: "#taskDialog[open]" },
        { fill: ["#taskForm input[name='object']", "12 plans"] },
        { select: ["#taskForm select[name='platform']", "Douyin"] },
        { click: "#taskForm .secondary-action" },
        { waitMs: 300 },
        { click: "[data-open-task]" },
        { wait: "#taskDialog[open]" },
        { eval: "(() => { const v = document.querySelector(\"#taskForm input[name='object']\").value; if (v !== '12 plans') throw new Error('object reset to ' + v); })()" },
        { eval: "(() => { const v = document.querySelector(\"#taskForm select[name='platform']\").value; if (v !== 'Douyin') throw new Error('platform reset to ' + v); })()" },
      ],
      expect: [{ sel: "#taskDialog", text: "Create Campaign Task" }, { sel: "#taskDialog[open]" }],
    },
    story: {
      id: "pages--campaign",
      args: { section: "execution" },
      actions: [
        { click: ".mh-heading--view .mh-button--primary" },
        { wait: ".mh-modal .mh-task-dialog__form" },
        { fill: [".mh-task-dialog input[name='object']", "12 plans"] },
        { select: [".mh-task-dialog select[name='platform']", "Douyin"] },
        { click: ".mh-task-dialog__footer .mh-button--secondary" },
        { waitMs: 300 },
        { click: ".mh-heading--view .mh-button--primary" },
        { wait: ".mh-modal .mh-task-dialog__form" },
        { eval: "(() => { const v = document.querySelector(\".mh-task-dialog input[name='object']\").value; if (v !== '12 plans') throw new Error('object reset to ' + v); })()" },
        { eval: "(() => { const v = document.querySelector(\".mh-task-dialog select[name='platform']\").value; if (v !== 'Douyin') throw new Error('platform reset to ' + v); })()" },
      ],
      expect: [{ sel: ".mh-task-dialog", text: "Create Campaign Task" }, { sel: ".mh-modal .mh-task-dialog__form" }],
    },
  },
  {
    id: "p06-campaign-accounts",
    original: {
      url: "/assets/pages/campaign.html#accounts",
      expect: [{ sel: "#accountsTitle", text: "Account Binding" }, { sel: ".campaign-view.active .data-table" }],
    },
    story: {
      id: "pages--campaign-accounts",
      expect: [
        { sel: ".mh-campaign", text: "Account Binding" },
        { sel: ".mh-campaign .mh-table" },
      ],
    },
  },
  {
    /* Channel tabs: original only toggles active/aria-selected — no content
       swap — and Douyin is disabled+aria-disabled with a title tooltip. */
    id: "p06-campaign-channel",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [{ click: "[data-channel='Rednote']" }, { waitMs: 150 }],
      expect: [
        { sel: "[data-channel='Rednote'].active[aria-selected='true']" },
        { sel: "[data-channel='Douyin'][disabled][aria-disabled='true']" },
        { sel: "[data-channel='Douyin'][title*='not configured']" },
        { sel: ".metric-card strong", text: "83" },
      ],
    },
    story: {
      id: "pages--campaign",
      actions: [{ click: ".mh-tabs__tab:has-text('Rednote')" }, { waitMs: 150 }],
      expect: [
        { sel: ".mh-tabs__tab.is-active[aria-selected='true']", text: "Rednote" },
        { sel: ".mh-tabs__tab[disabled][aria-disabled='true']", text: "Douyin" },
        { sel: ".mh-tabs__tab[title*='not configured']" },
        { sel: ".mh-metric__value", text: "83" },
      ],
    },
  },
  {
    /* Campaign assistant = shared non-home panel: right drawer
       min(40vw,100vw-80), scope pills and the three composer pickers are
       display:none !important, "+" skill trigger + ASK remain. */
    id: "p06-assistant-open",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { waitMs: 450 },
        {
          eval: "(() => { const r = document.querySelector('.assistant-modal').getBoundingClientRect(); if (Math.round(r.width) !== 576 || Math.round(r.x) !== 864 || Math.round(r.height) !== 1400) throw new Error('drawer geometry ' + JSON.stringify({ x: r.x, w: r.width, h: r.height })); })()",
        },
      ],
      expect: [
        { sel: ".assistant-panel:not(.home-ask-panel):not([hidden]) .assistant-modal" },
        { sel: ".ask-stage-headline h3", text: "Ask a question" },
        { sel: ".ask-scope", state: "hidden" },
        { sel: ".suggest-picker", state: "hidden" },
        { sel: ".model-picker", state: "hidden" },
        { sel: ".mode-picker", state: "hidden" },
        { sel: "#uploadFile" },
        { sel: "#sendQuery[disabled]" },
        { sel: ".ask-suggestion", text: "What's the ROI trend across my active campaigns?" },
        { sel: "#aiEntry", state: "hidden" },
      ],
    },
    story: {
      id: "pages--campaign-assistant-open",
      actions: [
        { wait: ".mh-assistant--drawer" },
        { waitMs: 450 },
        {
          eval: "(() => { const r = document.querySelector('.mh-assistant__dialog').getBoundingClientRect(); if (Math.round(r.width) !== 576 || Math.round(r.x) !== 864 || Math.round(r.height) !== 1400) throw new Error('drawer geometry ' + JSON.stringify({ x: r.x, w: r.width, h: r.height })); })()",
        },
      ],
      expect: [
        { sel: ".mh-assistant__stage h3", text: "Ask a question" },
        { sel: ".mh-assistant__scopes", state: "detached" },
        { sel: ".mh-assistant__pick", state: "detached" },
        { sel: "button[aria-label='Choose AI skill']" },
        { sel: ".mh-assistant__send .mh-button[disabled]" },
        { sel: ".mh-assistant__suggestions button", text: "What's the ROI trend across my active campaigns?" },
        { sel: ".mh-launcher", state: "hidden" },
      ],
    },
  },
  {
    /* workspace.js createAnswer: suggestion click submits immediately; the feed
       renders the workspace card (banner, findings, source chips) below
       the always-visible ask stage. */
    id: "p06-assistant-answer",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: ".ask-suggestion" },
        { wait: "#answerFeed .answer-card" },
      ],
      expect: [
        { sel: ".answer-card-header", text: "AI ResponseContext: Campaigns" },
        { sel: ".answer-card-body > p", text: "Based on current campaign data, here are the key findings." },
        { sel: ".answer-finding", text: "ROI Trend" },
        { sel: ".answer-finding:has-text('Budget Alert')" },
        { sel: ".answer-finding:has-text('Automation Queue')" },
        { sel: ".answer-source-line span", text: "Campaign Dashboard / Active Plans" },
        { sel: ".answer-feedback-btn[data-feedback='helpful']" },
        { sel: ".assistant-ask-stage" },
        { sel: "#sendQuery[disabled]" },
        { sel: ".user-query-bubble", text: "What's the ROI trend across my active campaigns this quarter?" },
      ],
    },
    story: {
      id: "pages--campaign-assistant-answer",
      actions: [
        { wait: ".mh-assistant__answer--workspace" },
        { eval: "(() => { const banner = document.querySelector('.mh-assistant__answer-banner'); const style = getComputedStyle(banner); if (style.display !== 'grid' || style.borderBottomStyle !== 'solid') throw new Error('response header not styled'); })()" },
      ],
      expect: [
        { sel: ".mh-assistant__answer-banner strong", text: "AI Response" },
        { sel: ".mh-assistant__answer-banner span", text: "Context: Campaigns" },
        { sel: ".mh-assistant__answer-body > p", text: "Based on current campaign data, here are the key findings." },
        { sel: ".mh-assistant__finding", text: "ROI Trend" },
        { sel: ".mh-assistant__finding:has-text('Budget Alert')" },
        { sel: ".mh-assistant__finding:has-text('Automation Queue')" },
        { sel: ".mh-assistant__sources span", text: "Campaign Dashboard / Active Plans" },
        { sel: ".mh-assistant__feedback button[data-kind='helpful']" },
        { sel: ".mh-assistant__stage" },
        { sel: ".mh-assistant__send .mh-button[disabled]" },
        { sel: ".mh-assistant__bubble", text: "What's the ROI trend across my active campaigns this quarter?" },
      ],
    },
  },
  {
    /* submitQuery assigns answerFeed.innerHTML — each ask replaces the feed,
       never appends. */
    id: "p06-assistant-replace",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { fill: ["#promptCanvas", "First question about budgets"] },
        { click: "#sendQuery" },
        { wait: "#answerFeed .answer-card" },
        { fill: ["#promptCanvas", "Second question about automation"] },
        { click: "#sendQuery" },
        { waitMs: 200 },
        {
          eval: "(() => { const n = document.querySelectorAll('#answerFeed .answer-entry').length; if (n !== 1) throw new Error('feed entries ' + n); })()",
        },
      ],
      expect: [{ sel: ".user-query-bubble", text: "Second question about automation" }],
    },
    story: {
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [
        { fill: [".mh-assistant__box textarea", "First question about budgets"] },
        { click: ".mh-assistant__send .mh-button" },
        { wait: ".mh-assistant__answer--workspace" },
        { fill: [".mh-assistant__box textarea", "Second question about automation"] },
        { click: ".mh-assistant__send .mh-button" },
        { waitMs: 200 },
        {
          eval: "(() => { const n = document.querySelectorAll('.mh-assistant__entry').length; if (n !== 1) throw new Error('feed entries ' + n); })()",
        },
      ],
      expect: [{ sel: ".mh-assistant__bubble", text: "Second question about automation" }],
    },
  },
  {
    id: "p06-assistant-newsession",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: ".ask-suggestion" },
        { wait: "#answerFeed .answer-card" },
        { click: "#newSession" },
      ],
      expect: [
        { sel: "#answerFeed .answer-card", state: "detached" },
        { sel: "#answerFeed", state: "hidden" },
        { sel: ".assistant-modal", text: "Ask a question" },
      ],
    },
    story: {
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [
        { click: ".mh-assistant__suggestions button" },
        { wait: ".mh-assistant__answer--workspace" },
        { click: "button[aria-label='New session']" },
      ],
      expect: [
        { sel: ".mh-assistant__entry", state: "detached" },
        { sel: ".mh-assistant", text: "Ask a question" },
      ],
    },
  },
  {
    /* assistant-skill-menu.js history popup: click fills the canvas AND
       dispatches input, so send re-enables (unlike the home quirk). */
    id: "p06-assistant-history",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: "#aiHistory" },
        { wait: "#aiRecentHistoryPopup:not([hidden])" },
        { click: ".ai-recent-chat" },
      ],
      expect: [
        { sel: "#aiRecentHistoryPopup", state: "hidden" },
        { sel: "#sendQuery:not([disabled])", text: "ASK" },
      ],
    },
    story: {
      id: "pages--campaign-assistant-history-filled",
      actions: [
        { wait: ".mh-assistant__send .mh-button:not([disabled])" },
        { eval: "(() => { const v = document.querySelector('.mh-assistant__box textarea').value; if (v !== 'Why did campaign ROI decline last week?') throw new Error('prompt fill ' + JSON.stringify(v)); })()" },
      ],
      expect: [
        { sel: ".mh-assistant__history-pop", state: "detached" },
        { sel: ".mh-assistant__send .mh-button:not([disabled])", text: "ASK" },
      ],
    },
  },
  {
    id: "p06-assistant-maximize",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: "#aiMaximize" },
      ],
      expect: [
        { sel: ".assistant-panel.is-ai-expanded .assistant-modal", text: "Ask AI Interpreter" },
        { sel: "#aiMaximize", attr: { name: "aria-label", value: "Restore AI Interpreter panel" } },
      ],
    },
    story: {
      id: "pages--campaign-assistant-maximized",
      expect: [
        { sel: ".mh-assistant--expanded", text: "Ask AI Interpreter" },
        { sel: "button[aria-label='Restore AI Interpreter panel']", attr: { name: "aria-label", value: "Restore AI Interpreter panel" } },
      ],
    },
  },
  {
    /* The original shared panel retains expansion after close. A fresh React
       opening returns to the drawer layout. */
    id: "p06-assistant-expand-reset",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: "#aiMaximize" },
        { wait: ".assistant-panel.is-ai-expanded .assistant-modal" },
        { click: "#assistantPanel .close-btn" },
        { wait: "#aiEntry:not([hidden])" },
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
      ],
      expect: [
        { sel: ".assistant-panel:not([hidden]) .assistant-modal", text: "Ask AI Interpreter" },
      ],
    },
    story: {
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [
        { click: "button[aria-label='Maximize AI Interpreter panel']" },
        { wait: ".mh-assistant--expanded" },
        { click: ".mh-assistant__close" },
        { wait: "button[aria-label='Open AI assistant']:not([hidden])" },
        { click: "button[aria-label='Open AI assistant']" },
        { wait: ".mh-assistant" },
      ],
      expect: [
        { sel: ".mh-assistant--drawer", text: "Ask AI Interpreter" },
        { sel: "button[aria-label='Maximize AI Interpreter panel']", attr: { name: "aria-label", value: "Maximize AI Interpreter panel" } },
      ],
    },
  },
  {
    id: "p06-assistant-skill",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: "#uploadFile" },
        { wait: "#aiSkillMenu:not([hidden])" },
        { click: ".ai-skill-category >> nth=1" },
        { wait: ".ai-skill-detail-panel:not([hidden])" },
        { click: ".ai-skill-option:has-text('ROI diagnosis')" },
      ],
      expect: [
        { sel: ".ai-skill-chip:not([hidden])", text: "Analytical Model: ROI diagnosis model" },
        { sel: "#aiSkillMenu", state: "hidden" },
      ],
    },
    story: {
      id: "pages--campaign-assistant-selected-skill",
      expect: [
        { sel: ".mh-assistant__chip", text: "Analytical Model: ROI diagnosis model" },
        { sel: ".mh-skill", state: "detached" },
      ],
    },
  },
  {
    id: "p06-assistant-flow",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: "#uploadFile" },
        { wait: "#aiSkillMenu:not([hidden])" },
        { click: ".ai-skill-category >> nth=1" },
        { wait: ".ai-skill-detail-panel:not([hidden])" },
        { click: "[data-ai-skill-action='history']" },
        { wait: "#aiHistoryGenerateDialog" },
        { click: "[data-ai-generate-model]" },
        { wait: "#aiGeneratedModelDialog" },
        { click: "[data-ai-back-to-history]" },
        { wait: "#aiHistoryGenerateDialog:not([hidden])" },
        { click: "#aiHistoryGenerateDialog footer [data-ai-flow-close]" },
      ],
      expect: [
        { sel: "#aiHistoryGenerateDialog", state: "detached" },
        { sel: ".assistant-modal", text: "Ask a question" },
      ],
    },
    story: {
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [
        { click: ".mh-assistant__skill" },
        { wait: ".mh-skill" },
        { click: ".mh-skill__category >> nth=1" },
        { wait: ".mh-skill__detail" },
        { click: ".mh-skill__action >> nth=0" },
        { wait: ".mh-flow__card--history" },
        { click: ".mh-flow__foot .mh-flow__btn--primary" },
        { wait: ".mh-flow__card--form" },
        { click: ".mh-flow__back" },
        { wait: ".mh-flow__card--history" },
        { click: ".mh-flow__foot .mh-flow__btn--secondary" },
      ],
      expect: [
        { sel: ".mh-flow", state: "detached" },
        { sel: ".mh-assistant", text: "Ask a question" },
      ],
    },
  },
  {
    id: "p06-assistant-manual",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: "#uploadFile" },
        { wait: "#aiSkillMenu:not([hidden])" },
        { click: ".ai-skill-category >> nth=1" },
        { wait: ".ai-skill-detail-panel:not([hidden])" },
        { click: "[data-ai-skill-action='manual']" },
        { wait: "#aiGeneratedModelDialog" },
        { click: "#aiGeneratedModelDialog [data-ai-submit-model]" },
        { wait: "#aiGeneratedModelDialog .field-error" },
      ],
      expect: [{ sel: "#aiGeneratedModelDialog .field-error", text: "Name is required." }],
    },
    story: {
      id: "pages--campaign-model-manual-error",
      expect: [{ sel: ".mh-flow__field-error", text: "Name is required." }],
    },
  },
  {
    id: "p06-assistant-escape",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { press: ["body", "Escape"] },
      ],
      expect: [
        { sel: "#assistantPanel[hidden]", state: "attached" },
        { sel: "#aiEntry", text: "AI Interpreter" },
      ],
    },
    story: {
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [{ wait: ".mh-assistant" }, { press: ["body", "Escape"] }],
      expect: [
        { sel: ".mh-assistant", state: "detached" },
        { sel: ".mh-launcher", text: "AI Interpreter" },
      ],
    },
  },
  {
    /* feedback toggles aria-pressed + .active (green/red chips after the 150ms
       transition); copy writes the card text and shows "Copied!". */
    id: "p06-assistant-feedback",
    original: {
      url: "/assets/pages/campaign.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: ".ask-suggestion" },
        { wait: "#answerFeed .answer-card" },
        { click: ".answer-feedback-btn[data-feedback='helpful']" },
        { waitMs: 300 },
        {
          eval: "(() => { const b = document.querySelector('.answer-feedback-btn[data-feedback=\\\"helpful\\\"]'); if (b.getAttribute('aria-pressed') !== 'true' || !b.classList.contains('active')) throw new Error('feedback not pressed'); if (getComputedStyle(b).color !== 'rgb(46, 125, 50)') throw new Error('feedback color ' + getComputedStyle(b).color); })()",
        },
        { click: ".answer-feedback-btn[data-feedback='helpful']" },
        { waitMs: 300 },
      ],
      expect: [{ sel: ".answer-feedback-btn[data-feedback='helpful']", attr: { name: "aria-pressed", value: "false" }, text: "Helpful" }],
    },
    story: {
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [
        { click: ".mh-assistant__suggestions button" },
        { wait: ".mh-assistant__answer--workspace" },
        { click: ".mh-assistant__feedback button[data-kind='helpful']" },
        { waitMs: 300 },
        {
          eval: "(() => { const b = document.querySelector('.mh-assistant__feedback button[data-kind=\\\"helpful\\\"]'); if (b.getAttribute('aria-pressed') !== 'true') throw new Error('feedback not pressed'); if (getComputedStyle(b).color !== 'rgb(46, 125, 50)') throw new Error('feedback color ' + getComputedStyle(b).color); })()",
        },
        { click: ".mh-assistant__feedback button[data-kind='helpful']" },
        { waitMs: 300 },
      ],
      expect: [{ sel: ".mh-assistant__feedback button[data-kind='helpful']", attr: { name: "aria-pressed", value: "false" }, text: "Helpful" }],
    },
  }
];
