export default [
  {
    id: "p03-self-service",
    original: {
      url: "/assets/pages/flexible.html",
      expect: [
        { sel: "#tab-self-service", text: "Self-Service Analysis", attr: { name: "aria-selected", value: "true" } },
        { sel: ".report-card", count: 3 },
      ],
    },
    story: {
      id: "pages--self-service",
      expect: [
        { sel: ".mh-self-tools", text: "Self-Service Analysis" },
        { sel: ".mh-action-card", count: 3 },
      ],
    },
  },
  {
    id: "p03-self-service-upload",
    original: { url: "/assets/pages/flexible.html?tab=upload", expect: [{ sel: "#data-upload-panel", text: "Finance Pilot City" }, { sel: ".upload-card-grid" }] },
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
    id: "p03-assistant-open",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { wait: "#assistantPanel:not([hidden]) .assistant-modal" }, { waitMs: 450 }],
      expect: [
        { sel: ".assistant-ask-stage h3", text: "Ask a question" },
        { sel: ".ask-suggestion", text: "Compare channel performance for the last 3 campaigns" },
        { sel: ".ask-scope", state: "hidden" },
        { sel: "#uploadFile[aria-label='Choose AI skill']" },
        { sel: "#sendQuery[disabled]" },
      ],
    },
    story: {
      id: "pages--self-service-assistant",
      actions: [{ wait: ".mh-assistant--drawer" }, { waitMs: 450 }],
      expect: [
        { sel: ".mh-assistant__stage h3", text: "Ask a question" },
        { sel: ".mh-assistant__suggestions button", text: "Compare channel performance for the last 3 campaigns" },
        { sel: "button[aria-label='Choose AI skill']" },
        { sel: ".mh-assistant__send button[disabled]" },
      ],
    },
  },
  {
    id: "p03-assistant-answer",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: ".ask-suggestion" }, { wait: "#answerFeed .answer-card" }],
      expect: [
        { sel: ".answer-card-header", text: "Context: Reports" },
        { sel: ".answer-finding", count: 3 },
        { sel: ".answer-source-line span", text: "Flexible Analysis / DG MZ Data" },
        { sel: ".user-query-bubble", text: "Compare channel performance for the last 3 campaigns" },
      ],
    },
    story: {
      id: "pages--self-service-assistant-answer",
      expect: [
        { sel: ".mh-assistant__answer-banner", text: "Context: Reports" },
        { sel: ".mh-assistant__finding", count: 3 },
        { sel: ".mh-assistant__sources span", text: "Flexible Analysis / DG MZ Data" },
        { sel: ".mh-assistant__bubble", text: "Compare channel performance for the last 3 campaigns" },
      ],
    },
  },
  {
    id: "p03-assistant-replace",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [
        { click: "#aiEntry" }, { fill: ["#promptCanvas", "First report question"] }, { click: "#sendQuery" },
        { fill: ["#promptCanvas", "Second report question"] }, { click: "#sendQuery" },
      ],
      expect: [{ sel: "#answerFeed .answer-entry", count: 1 }, { sel: ".user-query-bubble", text: "Second report question" }],
    },
    story: {
      id: "pages--self-service-assistant",
      actions: [
        { fill: [".mh-assistant__box textarea", "First report question"] }, { click: ".mh-assistant__send button" },
        { fill: [".mh-assistant__box textarea", "Second report question"] }, { click: ".mh-assistant__send button" },
      ],
      expect: [{ sel: ".mh-assistant__entry", count: 1 }, { sel: ".mh-assistant__bubble", text: "Second report question" }],
    },
  },
  {
    id: "p03-assistant-history",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#aiHistory" }, { click: ".ai-recent-chat" }, { eval: "(() => { if (document.querySelector('#promptCanvas').textContent.trim() !== 'Why did campaign ROI decline last week?') throw new Error('history did not fill composer'); })()" }],
      expect: [{ sel: "#sendQuery:not([disabled])" }, { sel: "#answerFeed .answer-card", state: "detached", count: 0 }],
    },
    story: {
      id: "pages--self-service-assistant-history-filled",
      actions: [{ eval: "(() => { if (document.querySelector('.mh-assistant__box textarea').value !== 'Why did campaign ROI decline last week?') throw new Error('history did not fill composer'); })()" }],
      expect: [{ sel: ".mh-assistant__send button:not([disabled])" }, { sel: ".mh-assistant__answer", state: "detached", count: 0 }],
    },
  },
  {
    id: "p03-assistant-skill-manual",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { click: "[data-ai-skill-action='manual']" }],
      expect: [{ sel: ".ai-model-form-card", text: "Create Analytical Model Manually" }],
    },
    story: {
      id: "pages--self-service-assistant",
      actions: [{ click: "button[aria-label='Choose AI skill']" }, { click: "[role='menuitem']:has-text('Analytical Model')" }, { click: "button:has-text('Create Analytical Model Manually')" }],
      expect: [{ sel: ".mh-flow", text: "Create Analytical Model Manually" }],
    },
  },
  {
    id: "p03-assistant-maximize",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#aiMaximize" }],
      expect: [{ sel: "#assistantPanel.is-ai-expanded .assistant-modal", text: "Ask AI Interpreter" }, { sel: "#aiMaximize", attr: { name: "aria-label", value: "Restore AI Interpreter panel" } }],
    },
    story: {
      id: "pages--self-service-assistant-maximized",
      expect: [{ sel: ".mh-assistant--expanded", text: "Ask AI Interpreter" }, { sel: "button[aria-label='Restore AI Interpreter panel']" }],
    },
  },
  {
    id: "p03-assistant-newsession",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: ".ask-suggestion" }, { wait: "#answerFeed .answer-card" }, { click: "#newSession" }],
      expect: [{ sel: "#answerFeed", state: "hidden" }, { sel: ".assistant-ask-stage", text: "Ask a question" }],
    },
    story: {
      id: "pages--self-service-assistant",
      actions: [{ click: ".mh-assistant__suggestions button" }, { wait: ".mh-assistant__answer" }, { click: "button[aria-label='New session']" }],
      expect: [{ sel: ".mh-assistant__entry", state: "detached" }, { sel: ".mh-assistant__stage", text: "Ask a question" }],
    },
  },
  {
    id: "p03-assistant-skill-search",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { fill: [".ai-skill-search input", "no matching model"] }],
      expect: [{ sel: ".ai-skill-empty", text: "No matching skills" }, { sel: ".ai-skill-detail-panel:not([hidden])" }],
    },
    story: {
      id: "pages--self-service-assistant-skill-search",
      expect: [{ sel: ".mh-skill__empty", text: "No matching skills" }, { sel: ".mh-skill__detail" }],
    },
  },
  {
    id: "p03-assistant-skill-pick",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { click: ".ai-skill-option:has-text('ROI diagnosis')" }],
      expect: [{ sel: ".ai-skill-chip:not([hidden])", text: "Analytical Model: ROI diagnosis model" }, { sel: "#aiSkillMenu", state: "hidden" }],
    },
    story: {
      id: "pages--self-service-assistant-selected-skill",
      expect: [{ sel: ".mh-assistant__chip", text: "Analytical Model: ROI diagnosis model" }, { sel: ".mh-skill", state: "detached" }],
    },
  },
  {
    id: "p03-assistant-flow-history",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { click: "[data-ai-skill-action='history']" }],
      expect: [{ sel: "#aiHistoryGenerateDialog", text: "Generate Analytical Model" }, { sel: "[data-ai-history-count]", text: "Selected 4 / 6 messages" }],
    },
    story: {
      id: "pages--self-service-assistant-model-history",
      expect: [{ sel: ".mh-flow__card--history", text: "Generate Analytical Model" }, { sel: ".mh-flow__count", text: "Selected 4 / 6 messages" }],
    },
  },
  {
    id: "p03-assistant-flow-generated",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { click: "[data-ai-skill-action='history']" }, { click: "[data-ai-generate-model]" }],
      expect: [{ sel: "#aiGeneratedModelDialog", text: "New Analytical Model" }, { sel: "#aiGeneratedModelDialog .ai-model-form", text: "Structure & Guidance" }],
    },
    story: {
      id: "pages--self-service-assistant-model-generated",
      expect: [{ sel: ".mh-flow__card--form", text: "New Analytical Model" }, { sel: ".mh-flow__card--form", text: "Structure & Guidance" }],
    },
  },
  {
    id: "p03-assistant-flow-required",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { click: "[data-ai-skill-action='manual']" }, { click: "[data-ai-submit-model]" }],
      expect: [{ sel: "#aiGeneratedModelDialog .field-error", text: "Name is required." }],
    },
    story: {
      id: "pages--self-service-assistant-model-error",
      expect: [{ sel: ".mh-flow__field-error", text: "Name is required." }],
    },
  },
  {
    id: "p03-assistant-enter",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { fill: ["#promptCanvas", "Line one"] }, { press: ["#promptCanvas", "Enter"] }, { eval: "(() => { if (!document.querySelector('#promptCanvas').textContent.includes('Line one')) throw new Error('composer lost text'); })()" }],
      expect: [{ sel: "#answerFeed .answer-card", state: "detached", count: 0 }, { sel: "#sendQuery:not([disabled])" }],
    },
    story: {
      id: "pages--self-service-assistant",
      actions: [{ fill: [".mh-assistant__box textarea", "Line one"] }, { press: [".mh-assistant__box textarea", "Enter"] }],
      expect: [{ sel: ".mh-assistant__answer", state: "detached", count: 0 }, { sel: ".mh-assistant__send button:not([disabled])" }],
    },
  },
  {
    id: "p03-assistant-scrim",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#assistantPanel .panel-backdrop" }],
      expect: [{ sel: "#assistantPanel[hidden]", state: "attached" }, { sel: "#aiEntry", text: "AI Interpreter" }],
    },
    story: {
      id: "pages--self-service-assistant",
      actions: [{ click: ".mh-assistant__backdrop" }],
      expect: [{ sel: ".mh-assistant", state: "detached" }, { sel: ".mh-launcher", text: "AI Interpreter" }],
    },
  },
  {
    id: "p03-assistant-feedback",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: ".ask-suggestion" }, { click: ".answer-feedback-btn[data-feedback='helpful']" }],
      expect: [{ sel: ".answer-feedback-btn[data-feedback='helpful']", attr: { name: "aria-pressed", value: "true" } }],
    },
    story: {
      id: "pages--self-service-assistant-feedback",
      expect: [{ sel: ".mh-assistant__feedback button[data-kind='helpful']", attr: { name: "aria-pressed", value: "true" } }],
    },
  },
  {
    id: "p03-assistant-history-popup",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#aiHistory" }],
      expect: [{ sel: "#aiRecentHistoryPopup:not([hidden])", text: "Recent Chats" }, { sel: ".ai-recent-chat", count: 3 }],
    },
    story: {
      id: "pages--self-service-assistant-history",
      expect: [{ sel: ".mh-assistant__history-pop", text: "Recent Chats" }, { sel: ".mh-assistant__history-item", count: 3 }],
    },
  },
  {
    id: "p03-assistant-skill-menu",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#uploadFile" }],
      expect: [{ sel: "#aiSkillMenu:not([hidden])", text: "Analytical Model" }, { sel: ".ai-skill-category", count: 2 }],
    },
    story: {
      id: "pages--self-service-assistant-skill-menu",
      expect: [{ sel: ".mh-skill", text: "Analytical Model" }, { sel: ".mh-skill__category", count: 2 }],
    },
  },
  {
    id: "p03-assistant-skill-clear",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { click: ".ai-skill-option:has-text('ROI diagnosis')" }, { click: ".ai-skill-chip button" }],
      expect: [{ sel: ".ai-skill-chip", state: "hidden" }, { sel: "#promptCanvas", attr: { name: "aria-label", value: "Ask AI Interpreter AI" } }],
    },
    story: {
      id: "pages--self-service-assistant-selected-skill",
      actions: [{ click: ".mh-assistant__chip button" }],
      expect: [{ sel: ".mh-assistant__chip", state: "detached" }, { sel: ".mh-assistant__box textarea", attr: { name: "aria-label", value: "Ask AI Interpreter AI" } }],
    },
  },
  {
    id: "p03-assistant-copy",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [
        { eval: "Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copiedAnswer = text; } } })" },
        { click: "#aiEntry" }, { click: ".ask-suggestion" }, { click: ".answer-feedback-btn[data-copy]" },
        { eval: "(() => { if (!window.__copiedAnswer?.includes('Media Monitoring')) throw new Error('copy missing answer'); })()" },
      ],
      expect: [{ sel: ".answer-feedback-btn[data-copy]", text: "Copied!" }],
    },
    story: {
      id: "pages--self-service-assistant-answer",
      actions: [
        { eval: "Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copiedAnswer = text; } } })" },
        { click: ".mh-assistant__feedback button[data-kind='copy']" },
        { eval: "(() => { if (!window.__copiedAnswer?.includes('Media Monitoring')) throw new Error('copy missing answer'); })()" },
      ],
      expect: [{ sel: ".mh-assistant__feedback button[data-kind='copy']", text: "Copied!" }],
    },
  },
  {
    id: "p03-assistant-flow-empty-selection",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [
        { click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { click: "[data-ai-skill-action='history']" },
        { eval: "document.querySelectorAll('#aiHistoryGenerateDialog [data-ai-history-msg]:checked').forEach(el => { el.click(); })" },
        { click: "[data-ai-generate-model]" },
      ],
      expect: [{ sel: "[data-ai-generate-error]:not([hidden])", text: "Select at least one message to continue." }],
    },
    story: {
      id: "pages--self-service-assistant-model-empty-selection",
      expect: [{ sel: ".mh-flow__error", text: "Select at least one message to continue." }],
    },
  },
  {
    id: "p03-assistant-flow-save",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [
        { click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { click: "[data-ai-skill-action='manual']" },
        { fill: ["#aiGeneratedModelDialog [data-ai-required='Name']", "Weekly report diagnosis"] },
        { fill: ["#aiGeneratedModelDialog [data-ai-required='Trigger When']", "When report metrics move"] },
        { fill: ["#aiGeneratedModelDialog [data-ai-required='Structure & Guidance']", "Compare and explain"] },
        { click: "[data-ai-save-model]" }, { waitMs: 550 },
      ],
      expect: [{ sel: "#aiGeneratedModelDialog", state: "detached" }, { sel: "#assistantPanel:not([hidden]) .assistant-modal", text: "Ask AI Interpreter" }],
    },
    story: {
      id: "pages--self-service-assistant-model-manual",
      actions: [
        { fill: [".mh-flow input[name='name']", "Weekly report diagnosis"] },
        { fill: [".mh-flow textarea[name='trigger']", "When report metrics move"] },
        { fill: [".mh-flow textarea[name='structure']", "Compare and explain"] },
        { click: ".mh-flow__foot .mh-flow__btn--secondary:has-text('Save')" }, { waitMs: 550 },
      ],
      expect: [{ sel: ".mh-flow", state: "detached" }, { sel: ".mh-assistant", text: "Ask AI Interpreter" }],
    },
  },
  {
    id: "p03-assistant-escape-focus",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { press: ["body", "Escape"] }, { eval: "(() => { if (document.activeElement?.id !== 'aiEntry') throw new Error('focus not returned'); })()" }],
      expect: [{ sel: "#assistantPanel[hidden]", state: "attached" }, { sel: "#aiEntry", text: "AI Interpreter" }],
    },
    story: {
      id: "pages--self-service-assistant",
      actions: [{ press: ["body", "Escape"] }, { eval: "(() => { if (document.activeElement?.getAttribute('aria-label') !== 'Open AI assistant') throw new Error('focus not returned'); })()" }],
      expect: [{ sel: ".mh-assistant", state: "detached" }, { sel: ".mh-launcher", text: "AI Interpreter" }],
    },
  },
  {
    id: "p03-assistant-maximize-restore",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#aiMaximize" }, { click: "#aiMaximize" }],
      expect: [{ sel: "#assistantPanel:not(.is-ai-expanded) .assistant-modal", text: "Ask AI Interpreter" }, { sel: "#aiMaximize", attr: { name: "aria-label", value: "Maximize AI Interpreter panel" } }],
    },
    story: {
      id: "pages--self-service-assistant-maximized",
      actions: [{ click: "button[aria-label='Restore AI Interpreter panel']" }],
      expect: [{ sel: ".mh-assistant--drawer:not(.mh-assistant--expanded)", text: "Ask AI Interpreter" }, { sel: "button[aria-label='Maximize AI Interpreter panel']" }],
    },
  },
  {
    id: "p03-assistant-history-close",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#aiHistory" }, { click: "#aiRecentHistoryPopup .ai-recent-history-head button" }],
      expect: [{ sel: "#aiRecentHistoryPopup", state: "hidden" }, { sel: "#aiHistory", attr: { name: "aria-label", value: "History" } }],
    },
    story: {
      id: "pages--self-service-assistant-history",
      actions: [{ click: ".mh-assistant__history-head button" }],
      expect: [{ sel: ".mh-assistant__history-pop", state: "detached" }, { sel: "button[aria-label='History']", attr: { name: "aria-expanded", value: "false" } }],
    },
  },
  {
    id: "p03-assistant-flow-back",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [{ click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { click: "[data-ai-skill-action='history']" }, { fill: ["[data-ai-generation-rule]", "focus on channel"] }, { click: "[data-ai-generate-model]" }, { click: "[data-ai-back-to-history]" }, { eval: "(() => { if (document.querySelector('[data-ai-generation-rule]').value !== 'focus on channel') throw new Error('rule lost on Back'); })()" }],
      expect: [{ sel: "#aiHistoryGenerateDialog:not([hidden])", text: "Generate Analytical Model" }, { sel: "#aiGeneratedModelDialog", state: "detached" }],
    },
    story: {
      id: "pages--self-service-assistant-model-history",
      actions: [{ fill: [".mh-flow__rule", "focus on channel"] }, { click: ".mh-flow__foot .mh-flow__btn--primary" }, { click: ".mh-flow__back" }, { eval: "(() => { if (document.querySelector('.mh-flow__rule').value !== 'focus on channel') throw new Error('rule lost on Back'); })()" }],
      expect: [{ sel: ".mh-flow__card--history", text: "Generate Analytical Model" }, { sel: ".mh-flow__card--form", state: "detached" }],
    },
  },
  {
    id: "p03-assistant-flow-submit",
    original: {
      url: "/assets/pages/flexible.html",
      actions: [
        { click: "#aiEntry" }, { click: "#uploadFile" }, { click: ".ai-skill-category[data-ai-skill-category='Analytical Model']" }, { click: "[data-ai-skill-action='manual']" },
        { fill: ["#aiGeneratedModelDialog [data-ai-required='Name']", "Weekly report diagnosis"] },
        { fill: ["#aiGeneratedModelDialog [data-ai-required='Trigger When']", "When report metrics move"] },
        { fill: ["#aiGeneratedModelDialog [data-ai-required='Structure & Guidance']", "Compare and explain"] },
        { click: "[data-ai-submit-model]" }, { waitMs: 550 },
      ],
      expect: [{ sel: "#aiGeneratedModelDialog", state: "detached" }, { sel: "#assistantPanel:not([hidden]) .assistant-modal", text: "Ask AI Interpreter" }],
    },
    story: {
      id: "pages--self-service-assistant-model-manual",
      actions: [
        { fill: [".mh-flow input[name='name']", "Weekly report diagnosis"] },
        { fill: [".mh-flow textarea[name='trigger']", "When report metrics move"] },
        { fill: [".mh-flow textarea[name='structure']", "Compare and explain"] },
        { click: ".mh-flow__foot .mh-flow__btn--primary:has-text('Submit')" }, { waitMs: 550 },
      ],
      expect: [{ sel: ".mh-flow", state: "detached" }, { sel: ".mh-assistant", text: "Ask AI Interpreter" }],
    },
  }
];
