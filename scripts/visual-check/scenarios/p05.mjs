export default [
  {
    id: "p05-media-tracking",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      expect: [
        { sel: ".media-tracking-head", text: "Media Tracking Detail" },
        { sel: ".nav-link.active[aria-current='page']", text: "Self-Service Center" },
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
        { sel: ".mh-header__link[aria-current='page']", text: "Self-Service Center" },
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
      id: "pages--media-tracking-detail-daily",
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
        { sel: ".ask-scope", state: "hidden" },
        { sel: ".global-ai-launcher", state: "hidden" },
      ],
    },
    story: {
      id: "pages--media-tracking-detail-assistant-answer",
      expect: [
        { sel: ".mh-assistant", text: "Ask AI Interpreter" },
        { sel: ".mh-assistant__answer--simple", text: "I will use the AI Interpreter knowledge context to answer:" },
        { sel: ".mh-assistant__scopes", state: "detached" },
        { sel: ".mh-assistant__scope-reserve" },
        { sel: ".mh-launcher", state: "hidden" },
      ],
    },
  },
  {
    id: "p05-assistant-history",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      actions: [
        { click: ".global-ai-launcher" },
        { wait: "#assistantPanel:not([hidden])" },
        { click: "#aiHistory" },
        { wait: "#aiRecentHistoryPopup:not([hidden])" },
        { click: ".ai-recent-chat" },
      ],
      expect: [
        { sel: "#aiRecentHistoryPopup", state: "hidden" },
        { sel: "#promptCanvas", text: "Summarize the latest media tracking performance." },
        { sel: "#sendQuery:not([disabled])" },
      ],
    },
    story: {
      id: "pages--media-tracking-detail-assistant-history-filled",
      expect: [
        { sel: ".mh-assistant__history-pop", state: "detached" },
        { sel: ".mh-assistant__send .mh-button:not([disabled])", text: "ASK" },
        { sel: ".mh-assistant", text: "Ask a question" },
      ],
    },
  },
  {
    id: "p05-assistant-maximize",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      actions: [
        { click: ".global-ai-launcher" },
        { wait: "#assistantPanel:not([hidden])" },
        { click: "#aiMaximize" },
      ],
      expect: [
        { sel: "#assistantPanel.is-ai-expanded", text: "Ask AI Interpreter" },
        { sel: "#aiMaximize", attr: { name: "aria-label", value: "Restore" } },
      ],
    },
    story: {
      id: "pages--media-tracking-detail-assistant-maximized",
      expect: [
        { sel: ".mh-assistant--expanded", text: "Ask AI Interpreter" },
        { sel: "button[aria-label='Restore']", attr: { name: "aria-label", value: "Restore" } },
      ],
    },
  },
  {
    id: "p05-assistant-new-session",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      actions: [
        { click: ".global-ai-launcher" },
        { wait: "#assistantPanel:not([hidden])" },
        { fill: ["#promptCanvas", "Summarize the latest media tracking performance."] },
        { click: "#sendQuery" },
        { wait: "#answerFeed .answer-card" },
        { click: "#aiNewSession" },
      ],
      expect: [
        { sel: "#answerFeed .answer-card", state: "detached" },
        { sel: "#assistantPanel", text: "Ask a question" },
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
        { click: "button[aria-label='New session']" },
      ],
      expect: [
        { sel: ".mh-assistant__answer", state: "detached" },
        { sel: ".mh-assistant", text: "Ask a question" },
      ],
    },
  },
  {
    id: "p05-assistant-escape",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      actions: [
        { click: ".global-ai-launcher" },
        { wait: "#assistantPanel:not([hidden])" },
        { press: ["body", "Escape"] },
      ],
      expect: [
        { sel: "#assistantPanel", state: "hidden" },
        { sel: ".global-ai-launcher", text: "AI Interpreter" },
      ],
    },
    story: {
      id: "pages--media-tracking-detail",
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-assistant" },
        { press: ["body", "Escape"] },
      ],
      expect: [
        { sel: ".mh-assistant", state: "detached" },
        { sel: ".mh-launcher", text: "AI Interpreter" },
      ],
    },
  },
  {
    id: "p05-skill-menu",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      actions: [
        { click: ".global-ai-launcher" },
        { wait: "#assistantPanel:not([hidden])" },
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
      id: "pages--media-tracking-detail-assistant-selected-skill",
      expect: [
        { sel: ".mh-assistant__chip", text: "Analytical Model: ROI diagnosis model" },
        { sel: ".mh-skill", state: "detached" },
      ],
    },
  },
  {
    id: "p05-skill-history",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      actions: [
        { click: ".global-ai-launcher" },
        { wait: "#assistantPanel:not([hidden])" },
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
        { sel: "h1", text: "Media Tracking Detail" },
      ],
    },
    story: {
      id: "pages--media-tracking-detail",
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-assistant" },
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
    id: "p05-skill-manual",
    original: {
      url: "/assets/pages/media-tracking-detail.html",
      actions: [
        { click: ".global-ai-launcher" },
        { wait: "#assistantPanel:not([hidden])" },
        { click: "#uploadFile" },
        { wait: "#aiSkillMenu:not([hidden])" },
        { click: ".ai-skill-category >> nth=1" },
        { wait: ".ai-skill-detail-panel:not([hidden])" },
        { click: "[data-ai-skill-action='manual']" },
        { wait: "#aiGeneratedModelDialog" },
        { click: "#aiGeneratedModelDialog [data-ai-submit-model]" },
        { wait: "#aiGeneratedModelDialog .field-error" },
      ],
      expect: [
        { sel: "#aiGeneratedModelDialog .field-error", text: "Name is required." },
      ],
    },
    story: {
      id: "pages--media-tracking-detail-model-manual-error",
      expect: [
        { sel: ".mh-flow__field-error", text: "Name is required." },
      ],
    },
  }
];
