const scenarios = [
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
    id: "p01-home-narrow",
    viewport: { width: 390, height: 844 },
    original: {
      url: "/index.html",
      fullPage: true,
      actions: [{ eval: "(() => { const cards = [...document.querySelectorAll('.workspace-card')]; if (document.documentElement.scrollWidth <= innerWidth + 100 || cards.at(-1).getBoundingClientRect().left <= innerWidth) throw new Error('Original four-column mobile overflow changed'); })()" }],
      expect: [
        { sel: ".workspace-card", count: 4 },
        { sel: ".workspace-card-link", count: 4 },
        { sel: ".workspace-card:last-child h3", text: "RedNote Campaign Tool" },
      ],
    },
    story: {
      id: "pages--home",
      fullPage: true,
      actions: [{ eval: "(() => { const cards = [...document.querySelectorAll('.mh-workspace-card')]; if (cards.length !== 4) throw new Error('Expected four workspaces'); for (const card of cards) { const box = card.getBoundingClientRect(); const heading = card.querySelector('h3'); const description = card.querySelector('p'); const open = card.querySelector('.mh-workspace-card__open'); if (box.width < 300 || box.left < 0 || box.right > innerWidth + 1 || !heading?.textContent?.trim() || !description?.textContent?.trim() || !open?.getAttribute('href')) throw new Error('Workspace card content or entry is unreadable'); if (heading.scrollWidth > heading.clientWidth + 1 || description.scrollWidth > description.clientWidth + 1) throw new Error('Workspace text is horizontally clipped'); } })()" }],
      expect: [
        { sel: ".mh-workspace-card", count: 4 },
        { sel: ".mh-workspace-card__open", count: 4 },
        { sel: ".mh-workspace-card:last-child h3", text: "RedNote Campaign Tool" },
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
      id: "pages--home-assistant-open",
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
      id: "pages--home-assistant-open",
      actions: [
        { wait: ".mh-assistant--drawer" },
        {
          eval: "(() => { const b = document.querySelector('.mh-assistant__send .mh-button'); const cs = getComputedStyle(b); if (!b.disabled) throw new Error('ASK not disabled'); if (cs.backgroundColor !== 'rgb(240, 242, 244)') throw new Error('ASK bg must use foundation surface-muted: ' + cs.backgroundColor); if (cs.color !== 'rgb(139, 148, 157)') throw new Error('ASK ink must use foundation text-faint: ' + cs.color); })()",
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
      id: "pages--home-assistant-open",
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
      id: "pages--home-assistant-open",
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
      id: "pages--home-assistant-open",
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

const sourceOpen = [
  { click: "#aiEntry" },
  { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
];
const sourceModelMenu = [...sourceOpen, { click: "#uploadFile" }, { click: ".ai-skill-category >> nth=1" }];
const archived = (id, actions, originalExpect, storyId, storyExpect) => ({
  id: `p01-${id}`,
  original: { url: "/index.html", actions, expect: originalExpect },
  story: { id: `pages--home-${storyId}`, expect: storyExpect },
});

export default [...scenarios,
  archived("answer-archive", [...sourceOpen, { click: ".ask-suggestion" }, { click: "#sendQuery" }],
    [{ sel: "#answerFeed .answer-card", text: "Recommended next move." }], "assistant-answer",
    [{ sel: ".mh-assistant__answer", text: "Recommended next move." }]),
  archived("history-archive", [...sourceOpen, { click: "#homeHistory" }],
    [{ sel: "#homeHistoryPopup:not([hidden]) .home-history-item", count: 11 }], "assistant-history",
    [{ sel: ".mh-assistant__history-pop .mh-assistant__history-item", count: 11 }]),
  archived("maximized-archive", [...sourceOpen, { click: "#homeMaximize" }],
    [{ sel: "#assistantPanel.is-ai-expanded", text: "Ask a question" }], "assistant-maximized",
    [{ sel: ".mh-assistant--expanded", text: "Ask a question" }]),
  archived("skills-archive", [...sourceOpen, { click: "#uploadFile" }],
    [{ sel: "#aiSkillMenu:not([hidden])", text: "Analytical Model" }], "assistant-skills",
    [{ sel: ".mh-skill", text: "Analytical Model" }]),
  archived("selected-skill-archive", [...sourceModelMenu, { click: ".ai-skill-option:has-text('ROI diagnosis')" }],
    [{ sel: ".ai-skill-chip:not([hidden])", text: "ROI diagnosis model" }], "assistant-selected-skill",
    [{ sel: ".mh-assistant__chip", text: "ROI diagnosis model" }]),
  archived("model-history-archive", [...sourceModelMenu, { click: "[data-ai-skill-action='history']" }],
    [{ sel: "#aiHistoryGenerateDialog", text: "Generate Analytical Model" }], "model-history",
    [{ sel: ".mh-flow__card--history", text: "Generate Analytical Model" }]),
  archived("model-generated-archive", [...sourceModelMenu, { click: "[data-ai-skill-action='history']" }, { click: "[data-ai-generate-model]" }],
    [{ sel: "#aiGeneratedModelDialog header strong", text: "New Analytical Model" }, { sel: "[data-ai-back-to-history]" }], "model-generated",
    [{ sel: ".mh-flow__card--form header strong", text: "New Analytical Model" }, { sel: ".mh-flow__back" }]),
  archived("model-manual-archive", [...sourceModelMenu, { click: "[data-ai-skill-action='manual']" }],
    [{ sel: "#aiGeneratedModelDialog header strong", text: "Create Analytical Model Manually" }, { sel: "[data-ai-back-to-history]", state: "detached" }], "model-manual",
    [{ sel: ".mh-flow__card--form header strong", text: "Create Analytical Model Manually" }, { sel: ".mh-flow__back", state: "detached" }]),
  archived("model-error-archive", [...sourceModelMenu, { click: "[data-ai-skill-action='manual']" }, { click: "[data-ai-submit-model]" }],
    [{ sel: "#aiGeneratedModelDialog .field-error", text: "required" }], "model-manual-error",
    [{ sel: ".mh-flow__field-error", text: "required" }]),
  archived("history-filled-archive", [...sourceOpen, { click: "#homeHistory" }, { click: ".home-history-item" }],
    [{ sel: "#promptCanvas", text: "ROI trend across my active campaigns" }], "assistant-history-filled",
    [{ sel: ".mh-assistant__send .mh-button:not([disabled])", count: 1 }, { sel: ".mh-assistant__history-pop", state: "detached" }]),
  archived("skill-empty-archive", [...sourceModelMenu, { fill: [".ai-skill-search input", "no matching model"] }],
    [{ sel: ".ai-skill-empty", text: "No matching skills" }], "assistant-skill-search-empty",
    [{ sel: ".mh-skill__empty", text: "No matching skills" }]),
  archived("model-empty-archive", [...sourceModelMenu, { click: "[data-ai-skill-action='history']" },
    { eval: "document.querySelectorAll('[data-ai-history-msg]:checked').forEach(input => input.click())" }, { click: "[data-ai-generate-model]" }],
    [{ sel: ".ai-history-error:not([hidden])", text: "Select at least one message" }], "model-empty-selection",
    [{ sel: ".mh-flow__error:not([hidden])", text: "Select at least one message" }]),
  archived("feedback-archive", [...sourceOpen, { click: ".ask-suggestion" }, { click: "#sendQuery" }, { click: ".answer-feedback-btn[data-feedback='helpful']" }],
    [{ sel: ".answer-feedback-btn[data-feedback='helpful']", attr: { name: "aria-pressed", value: "true" } }], "assistant-feedback",
    [{ sel: ".mh-assistant__feedback button[data-kind='helpful']", attr: { name: "aria-pressed", value: "true" } }]),
];
