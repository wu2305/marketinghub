export default [
  {
    id: "p01-home",
    original: {
      url: "/index.html",
      expect: [
        { sel: ".home-command-hero" },
        { sel: ".workspace-card", count: 4 },
        { sel: "h1", text: "Marketing Portal" },
      ],
    },
    story: {
      id: "pages--home",
      expect: [
        { sel: ".mh-hero--home" },
        { sel: ".mh-workspace-card", count: 4 },
        { sel: "#storybook-root h1", text: "Marketing Portal" },
      ],
    },
  },
  {
    id: "p01-home-assistant",
    original: {
      url: "/index.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
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
    /* Home composer: assistant-skill-menu.js relabels "+" to "Choose AI skill"
       at init; ASK renders the disabled skin (#e8ebee/#8a949e) while empty;
       scope pills and the three composer pickers stay display:none. */
    id: "p01-home-assistant-open",
    original: {
      url: "/index.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { waitMs: 450 },
        {
          eval: "(() => { const b = document.querySelector('#sendQuery'); const cs = getComputedStyle(b); if (!b.disabled) throw new Error('ASK not disabled'); if (cs.backgroundColor !== 'rgb(232, 235, 238)') throw new Error('ASK bg ' + cs.backgroundColor); if (cs.color !== 'rgb(138, 148, 158)') throw new Error('ASK ink ' + cs.color); })()",
        },
      ],
      expect: [
        { sel: "#uploadFile[aria-label='Choose AI skill']", attr: { name: "aria-label", value: "Choose AI skill" } },
        { sel: "#assistantPanel", text: "Ask a question" },
        { sel: ".ask-scope", state: "hidden" },
        { sel: ".suggest-picker", state: "hidden" },
        { sel: ".model-picker", state: "hidden" },
        { sel: ".mode-picker", state: "hidden" },
        { sel: ".attach-picker", state: "hidden" },
      ],
    },
    story: {
      id: "pages--home",
      args: { assistantOpen: true },
      actions: [
        { wait: ".mh-assistant--drawer" },
        {
          eval: "(() => { const b = document.querySelector('.mh-assistant__send .mh-button'); const cs = getComputedStyle(b); if (!b.disabled) throw new Error('ASK not disabled'); if (cs.backgroundColor !== 'rgb(232, 235, 238)') throw new Error('ASK bg ' + cs.backgroundColor); if (cs.color !== 'rgb(138, 148, 158)') throw new Error('ASK ink ' + cs.color); })()",
        },
      ],
      expect: [
        { sel: "button[aria-label='Choose AI skill']", attr: { name: "aria-label", value: "Choose AI skill" } },
        { sel: ".mh-assistant", text: "Ask a question" },
        { sel: ".mh-assistant__scopes", state: "detached" },
        { sel: ".mh-assistant__pick", state: "detached" },
      ],
    },
  },
  {
    /* The source fills the composer without updating ASK. The React story
       enables it immediately; both sides can still submit the same prompt. */
    id: "p01-home-history-pick",
    original: {
      url: "/index.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: "#homeHistory" },
        { wait: "#homeHistoryPopup:not([hidden])" },
        { click: ".home-history-item" },
        { eval: "(() => { const c = document.querySelector('#promptCanvas'); if (!c.textContent.includes('ROI trend across my active campaigns')) throw new Error('history fill missing: ' + c.textContent); })()" },
        { press: ["#promptCanvas", "Enter"] },
        { wait: "#answerFeed .answer-entry" },
      ],
      expect: [
        { sel: "#homeHistoryPopup", state: "hidden" },
        { sel: "#answerFeed .answer-entry", text: "Recommended next move." },
      ],
    },
    story: {
      id: "pages--home",
      args: { assistantOpen: true },
      actions: [
        { click: "button[aria-label='History']" },
        { wait: ".mh-assistant__history-pop" },
        { click: ".mh-assistant__history-item" },
        { eval: "(() => { const t = document.querySelector('.mh-assistant__box .mh-textarea'); if (!t.value.includes('ROI trend across my active campaigns')) throw new Error('history fill missing: ' + t.value); if (document.querySelector('.mh-assistant__send .mh-button').disabled) throw new Error('ASK disabled after history fill'); })()" },
        { click: ".mh-assistant__send .mh-button" },
        { wait: ".mh-assistant__entry" },
      ],
      expect: [
        { sel: ".mh-assistant__history-pop", state: "detached" },
        { sel: ".mh-assistant__send .mh-button[disabled]" },
        { sel: ".mh-assistant__entry", text: "Recommended next move." },
      ],
    },
  },
  {
    id: "p01-home-skill",
    original: {
      url: "/index.html",
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
      id: "pages--home",
      args: { assistantOpen: true },
      actions: [
        { click: ".mh-assistant__skill" },
        { wait: ".mh-skill" },
        { click: ".mh-skill__category >> nth=1" },
        { wait: ".mh-skill__detail" },
        { click: ".mh-skill__option:has-text('ROI diagnosis')" },
      ],
      expect: [
        { sel: ".mh-assistant__chip", text: "Analytical Model: ROI diagnosis model" },
        { sel: ".mh-skill", state: "detached" },
      ],
    },
  },
  {
    id: "p01-home-flow",
    original: {
      url: "/index.html",
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
        { sel: "#assistantPanel", text: "Ask a question" },
      ],
    },
    story: {
      id: "pages--home",
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
  }
];
