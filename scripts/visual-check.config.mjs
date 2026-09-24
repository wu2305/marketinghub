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
        { sel: "#uploadFile[aria-label='Choose AI skill']" },
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
        { sel: "button[aria-label='Choose AI skill']" },
        { sel: ".mh-assistant__scopes", state: "detached" },
        { sel: ".mh-assistant__pick", state: "detached" },
      ],
    },
  },
  {
    /* Home history pick fills promptCanvas WITHOUT updateSendState — the ASK
       button stays disabled until the next input event (original quirk). */
    id: "p01-home-history-quirk",
    original: {
      url: "/index.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: "#homeHistory" },
        { wait: "#homeHistoryPopup:not([hidden])" },
        { click: ".home-history-item" },
      ],
      expect: [
        { sel: "#homeHistoryPopup", state: "hidden" },
        { sel: "#sendQuery[disabled]" },
      ],
    },
    story: {
      id: "pages--home",
      args: { assistantOpen: true },
      actions: [
        { click: "button[aria-label='History']" },
        { wait: ".mh-assistant__history-pop" },
        { click: ".mh-assistant__history-item" },
      ],
      expect: [
        { sel: ".mh-assistant__history-pop", state: "detached" },
        { sel: ".mh-assistant__send .mh-button[disabled]" },
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
      expect: [{ sel: "#aiHistoryGenerateDialog", state: "detached" }],
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
      expect: [{ sel: ".mh-flow", state: "detached" }],
    },
  },
  {
    id: "p02-cockpit",
    original: {
      url: "/assets/pages/reports.html",
      expect: [
        { sel: ".reports-page-hero", text: "Marketing Cockpit" },
        { sel: ".report-category-heading h2", text: "D2C Insight" },
        { sel: ".report-project-card", text: "City Strategy" },
        { sel: ".report-project-card:has-text('OTT/OLV')", text: "OTT/OLV Media Data Tracking" },
        { sel: "#reportSearch" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      expect: [
        { sel: ".mh-hero", text: "Marketing Cockpit" },
        { sel: ".mh-category h2", text: "D2C Insight" },
        { sel: ".mh-project-card", text: "City Strategy" },
        { sel: ".mh-project-card:has-text('OTT/OLV')", text: "OTT/OLV Media Data Tracking" },
        { sel: ".mh-search input" },
      ],
    },
  },
  {
    id: "p02-cockpit-project",
    original: {
      url: "/assets/pages/reports.html?project=city",
      expect: [
        { sel: "#projectDirectory:not([hidden])" },
        { sel: "#projectDirectoryTitle", text: "City Strategy" },
        { sel: "#projectDirectoryCount", text: "2 dashboards" },
        { sel: "#projectReportCount", text: "2 dashboards" },
        { sel: ".project-report-row", text: "Invest City Strategy Analysis" },
        { sel: ".project-report-row", text: "2 assets" },
        { sel: "#categoryDirectory", state: "hidden" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city" },
      expect: [
        { sel: ".mh-project-directory" },
        { sel: ".mh-project-directory h2", text: "City Strategy" },
        { sel: ".mh-project-directory__count", text: "2 dashboards" },
        { sel: ".mh-report-list__heading strong", text: "2 dashboards" },
        { sel: ".mh-report-row", text: "Invest City Strategy Analysis" },
        { sel: ".mh-report-row", text: "2 assets" },
        { sel: ".mh-catalog", state: "detached" },
      ],
    },
  },
  {
    id: "p02-cockpit-search",
    original: {
      url: "/assets/pages/reports.html",
      actions: [{ fill: ["#reportSearch", "ott"] }],
      expect: [
        { sel: ".report-project-card", text: "OTT/OLV Media Data Tracking" },
        { sel: ".report-project-card:has-text('City Strategy')", state: "detached" },
        { sel: "#reportEmpty", state: "hidden" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      actions: [{ fill: [".mh-search input", "ott"] }],
      expect: [
        { sel: ".mh-project-card", text: "OTT/OLV Media Data Tracking" },
        { sel: ".mh-project-card:has-text('City Strategy')", state: "detached" },
        { sel: ".mh-empty-state", state: "detached" },
      ],
    },
  },
  {
    id: "p02-cockpit-search-empty",
    original: {
      url: "/assets/pages/reports.html",
      actions: [{ fill: ["#reportSearch", "zzz-nomatch"] }],
      expect: [
        { sel: "#reportEmpty:not([hidden])", text: "No matching reports." },
        { sel: ".report-project-card", state: "detached" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      actions: [{ fill: [".mh-search input", "zzz-nomatch"] }],
      expect: [
        { sel: ".mh-empty-state", text: "No matching reports." },
        { sel: ".mh-project-card", state: "detached" },
      ],
    },
  },
  {
    // The report-details drawer exists in the original markup but openDetails()
    // has no caller — the row's Knowledge button navigates to knowledge.html.
    // The eval step invokes the original's own unwired function.
    id: "p02-cockpit-details",
    original: {
      url: "/assets/pages/reports.html?project=city",
      actions: [
        { eval: "openDetails('city', 0)" },
        { wait: ".report-details-drawer.open" },
      ],
      expect: [
        { sel: "#detailsHierarchy", text: "D2C INSIGHT / CITY STRATEGY / INVESTMENT IMPACT ANALYSIS" },
        { sel: "#detailsMeta", text: "Weekly" },
        { sel: "#detailsPrinciples", text: "City Strategy report context" },
        { sel: "#detailsScenarios li", text: "Holistic analysis" },
        { sel: ".details-scenarios .scenario-extra", state: "hidden" },
        { sel: "#detailsScrim:not([hidden])" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", details: { project: "city", index: 0 } },
      actions: [{ wait: ".mh-details" }],
      expect: [
        { sel: ".mh-details__hierarchy", text: "D2C INSIGHT / CITY STRATEGY / INVESTMENT IMPACT ANALYSIS" },
        { sel: ".mh-details__meta", text: "Weekly" },
        { sel: ".mh-details__assets", text: "City Strategy report context" },
        { sel: ".mh-details__scenarios li", text: "Holistic analysis" },
        { sel: ".mh-details__scenario-extra", state: "hidden" },
        { sel: ".mh-details-scrim" },
      ],
    },
  },
  {
    id: "p02-cockpit-details-more",
    original: {
      url: "/assets/pages/reports.html?project=city",
      actions: [
        { eval: "openDetails('city', 0)" },
        { wait: ".report-details-drawer.open" },
        { click: "#scenariosViewMore" },
        { click: ".details-scenarios li >> nth=1" },
      ],
      expect: [
        { sel: ".details-scenarios.show-all" },
        { sel: ".details-scenarios .scenario-extra:has-text('Product mix analysis')" },
        { sel: ".details-scenarios li.active", text: "City comparison analysis" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", details: { project: "city", index: 0 } },
      actions: [
        { wait: ".mh-details" },
        { click: ".mh-details__view-more" },
        { click: ".mh-details__scenarios li >> nth=1" },
      ],
      expect: [
        { sel: ".mh-details__scenarios.is-expanded" },
        { sel: ".mh-details__scenario-extra:has-text('Product mix analysis')" },
        { sel: ".mh-details__scenarios li.is-active", text: "City comparison analysis" },
      ],
    },
  },
  {
    id: "p02-cockpit-details-fullscreen",
    original: {
      url: "/assets/pages/reports.html?project=city",
      actions: [
        { eval: "openDetails('city', 0)" },
        { wait: ".report-details-drawer.open" },
        { click: "#detailsFullscreen" },
      ],
      expect: [{ sel: ".report-details-drawer.fullscreen" }],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", details: { project: "city", index: 0 } },
      actions: [
        { wait: ".mh-details" },
        { click: "button[aria-label='Toggle fullscreen']" },
      ],
      expect: [{ sel: ".mh-details.is-fullscreen" }],
    },
  },
  {
    id: "p02-cockpit-details-escape",
    original: {
      url: "/assets/pages/reports.html?project=city",
      actions: [
        { eval: "openDetails('city', 0)" },
        { wait: ".report-details-drawer.open" },
        { press: ["body", "Escape"] },
      ],
      expect: [{ sel: ".report-details-drawer.open", state: "detached" }],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", details: { project: "city", index: 0 } },
      actions: [
        { wait: ".mh-details" },
        { press: ["body", "Escape"] },
      ],
      expect: [{ sel: ".mh-details", state: "detached" }],
    },
  },
  {
    id: "p02-cockpit-assistant",
    original: {
      url: "/assets/pages/reports.html",
      actions: [
        { click: "#aiEntry" },
        { wait: ".assistant-panel:not([hidden]) .assistant-modal" },
        { click: ".ask-suggestion" },
        { wait: "#answerFeed .answer-card" },
      ],
      expect: [
        { sel: "#assistantPanel", text: "Ask AI Interpreter" },
        { sel: "#answerFeed", text: "Sources used" },
        { sel: ".assistant-ask-stage", state: "hidden" },
        { sel: ".ask-scope", state: "hidden" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-assistant" },
        { click: ".mh-assistant__suggestions button" },
        { wait: ".mh-assistant__feed .mh-assistant__answer" },
      ],
      expect: [
        { sel: ".mh-assistant", text: "Ask AI Interpreter" },
        { sel: ".mh-assistant", text: "Sources used" },
        { sel: ".mh-assistant__stage", state: "detached" },
        { sel: ".mh-assistant__scopes", state: "detached" },
      ],
    },
  },
  {
    id: "p02-live-overview",
    original: {
      url: "/assets/pages/reports.html?project=fourp&dashboard=0&view=live",
      expect: [
        { sel: "#liveView:not([hidden])" },
        { sel: "#liveKicker", text: "4P REPORT / LIVE REPORT" },
        { sel: "#liveTitle", text: "4P Executive Overview" },
        { sel: ".live-view .back-button", text: "Report library" },
        { sel: ".live-kpi:has-text('NET SALES')" },
        { sel: ".live-kpi:has-text('¥128M')" },
        { sel: ".live-chart-group", text: "Place" },
        { sel: ".live-card:has-text('Leading views')" },
        { sel: ".live-rank-list", text: "84" },
        { sel: "#catalogView", state: "hidden" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "fourp", view: "live", dashboard: 0 },
      expect: [
        { sel: ".mh-live" },
        { sel: ".mh-live-heading .mh-eyebrow", text: "4P REPORT / LIVE REPORT" },
        { sel: ".mh-live-heading h1", text: "4P Executive Overview" },
        { sel: ".mh-live-back", text: "Report library" },
        { sel: ".mh-live-kpi:has-text('NET SALES')" },
        { sel: ".mh-live-kpi:has-text('¥128M')" },
        { sel: ".mh-live-chart__group", text: "Place" },
        { sel: ".mh-live-card:has-text('Leading views')" },
        { sel: ".mh-live-ranks", text: "84" },
        { sel: ".mh-catalog", state: "detached" },
      ],
    },
  },
  {
    id: "p02-live-city",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      expect: [
        { sel: ".sixcity-embed" },
        { sel: ".sc-title", text: "Invest City Strategy Analysis（6 Cities）" },
        { sel: ".sc-filters", text: "FY25 P4–P9" },
        { sel: "#sc-cityCtrl .sc-fval-txt", text: "All Stores" },
        { sel: "#sc-storeCtrl .sc-fval-txt", text: "All Stores · 6 Cities" },
        { sel: ".sc-kpi:has-text('Avg Daily Traffic')" },
        { sel: ".sc-kpi:has-text('+14%')" },
        { sel: ".sc-kpi:has-text('After 0.3K')" },
        { sel: ".sc-kpi:has-text('5,121')" },
        { sel: ".sc-sec-title", text: "Total Monthly Key Indicator Trend vs. Non Invest City" },
        { sel: ".sc-chart svg" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      expect: [
        { sel: ".mh-sixcity" },
        { sel: ".mh-sc-title", text: "Invest City Strategy Analysis（6 Cities）" },
        { sel: ".mh-sc-filters", text: "FY25 P4–P9" },
        { sel: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('City')) .mh-sc-fval__txt", text: "All Stores" },
        { sel: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('Store')) .mh-sc-fval__txt", text: "All Stores · 6 Cities" },
        { sel: ".mh-sc-kpi:has-text('Avg Daily Traffic')" },
        { sel: ".mh-sc-kpi:has-text('+14%')" },
        { sel: ".mh-sc-kpi:has-text('After 0.3K')" },
        { sel: ".mh-sc-kpi:has-text('5,121')" },
        { sel: ".mh-sc-sec-title", text: "Total Monthly Key Indicator Trend vs. Non Invest City" },
        { sel: ".mh-sc-chart svg" },
      ],
    },
  },
  {
    id: "p02-live-city-channel",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#sc-channelCtrl" },
        { wait: "#sc-channelCtrl.sc-open .sc-panel" },
        { click: "#sc-channelCtrl .sc-prow:has-text('Online')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: "#sc-channelCtrl .sc-fval-txt", text: "Online" },
        { sel: ".sc-kpi:has-text('+15%')" },
        { sel: ".sc-kpi:has-text('After 0.4K')" },
        { sel: ".sc-kpi:has-text('4,565')" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-sc-fitem:has-text('Channel') .mh-sc-fval" },
        { wait: ".mh-sc-fval.is-open .mh-sc-panel" },
        { click: ".mh-sc-fval.is-open .mh-sc-prow:has-text('Online')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('Channel')) .mh-sc-fval__txt", text: "Online" },
        { sel: ".mh-sc-kpi:has-text('+15%')" },
        { sel: ".mh-sc-kpi:has-text('After 0.4K')" },
        { sel: ".mh-sc-kpi:has-text('4,565')" },
      ],
    },
  },
  {
    id: "p02-live-city-cascade",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#sc-cityCtrl" },
        { wait: "#sc-cityCtrl.sc-open .sc-panel" },
        { click: "#sc-cityCtrl .sc-prow:has-text('Chengdu')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".sc-sec-title", text: "5 Cities Monthly Key Indicator Trend vs. Non Invest City" },
        { sel: "#sc-cityCtrl .sc-fval-txt", text: "Hefei, Qingdao +3" },
        { sel: "#sc-storeCtrl .sc-fval-txt", text: "All Stores · 5 Cities" },
        { sel: ".sc-kpi:has-text('+13%')" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-sc-fitem:has-text('City') .mh-sc-fval" },
        { wait: ".mh-sc-fval.is-open .mh-sc-panel" },
        { click: ".mh-sc-fval.is-open .mh-sc-prow:has-text('Chengdu')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-sc-sec-title", text: "5 Cities Monthly Key Indicator Trend vs. Non Invest City" },
        { sel: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('City')) .mh-sc-fval__txt", text: "Hefei, Qingdao +3" },
        { sel: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('Store')) .mh-sc-fval__txt", text: "All Stores · 5 Cities" },
        { sel: ".mh-sc-kpi:has-text('+13%')" },
      ],
    },
  },
  {
    id: "p02-live-city-hover",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [{ hover: ".sc-chart svg" }, { waitMs: 200 }],
      expect: [
        { sel: ".sc-tip", text: "Non-Invest:" },
        { sel: ".sc-tip", text: "Total:" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [{ hover: ".mh-sc-chart svg" }, { waitMs: 200 }],
      expect: [
        { sel: ".mh-sc-tip", text: "Non-Invest:" },
        { sel: ".mh-sc-tip", text: "Total:" },
      ],
    },
  },
  {
    /* Regression: hovering a late index then shrinking the period must not crash
       on a stale hover.index (React state outlives the shortened data arrays). */
    id: "p02-live-city-hover-shrink",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { hover: ".sc-chart:first-child svg" },
        { waitMs: 200 },
        /* Programmatic clicks keep the pointer over the svg — a real click
           would fire mouseleave and clear the hover before the shrink. */
        { eval: "document.querySelector('#sc-endCtrl').click()" },
        { wait: "#sc-endCtrl.sc-open .sc-panel" },
        { eval: "[...document.querySelectorAll('#sc-endCtrl .sc-prow')].find((el) => el.textContent.includes('FY25 P11')).click()" },
        { waitMs: 400 },
      ],
      expect: [
        { sel: "#sc-endCtrl .sc-fval-txt", text: "FY25 P11" },
        { sel: ".sc-chart svg" },
        { sel: ".sc-tip", state: "hidden" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { hover: ".mh-sc-chart:first-of-type svg" },
        { waitMs: 200 },
        { eval: "document.querySelector('.mh-sc-fitem .mh-sc-fval').click()" },
        { wait: ".mh-sc-fval.is-open .mh-sc-panel" },
        { eval: "[...document.querySelectorAll('.mh-sc-fval.is-open .mh-sc-prow')].find((el) => el.textContent.includes('FY25 P11')).click()" },
        { waitMs: 400 },
      ],
      expect: [
        { sel: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('Invest Period End')) .mh-sc-fval__txt", text: "FY25 P11" },
        { sel: ".mh-sc-chart svg" },
        { sel: ".mh-sc-tip", state: "hidden" },
      ],
    },
  },
  {
    /* `?view=live` without a dashboard param must NOT open the live view —
       the original gates on `query.get("dashboard") !== null` and renders
       the project catalog instead. */
    id: "p02-live-gate",
    original: {
      url: "/assets/pages/reports.html?project=fourp&view=live",
      expect: [
        { sel: ".project-report-row", text: "4P Executive Overview" },
        { sel: "#liveTitle", state: "hidden" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "fourp", view: "live" },
      expect: [
        { sel: ".mh-report-row", text: "4P Executive Overview" },
        { sel: ".mh-live", state: "detached" },
      ],
    },
  },
  {
    /* Out-of-range dashboard index falls back to report 0
       (`reports[i] ? i : 0`), not the last report. */
    id: "p02-live-oob",
    original: {
      url: "/assets/pages/reports.html?project=fourp&dashboard=9&view=live",
      expect: [{ sel: "#liveTitle", text: "4P Executive Overview" }],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "fourp", view: "live", dashboard: 9 },
      expect: [{ sel: ".mh-live-heading h1", text: "4P Executive Overview" }],
    },
  },
  {
    /* No `view` param at all: the original still opens live (dashboard param
       alone is the gate — it rewrites view=live into the URL). */
    id: "p02-live-noview",
    original: {
      url: "/assets/pages/reports.html?project=fourp&dashboard=0",
      expect: [{ sel: "#liveTitle", text: "4P Executive Overview" }],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "fourp", dashboard: 0 },
      expect: [{ sel: ".mh-live-heading h1", text: "4P Executive Overview" }],
    },
  },
  {
    /* City + out-of-range index: content falls back to report 0 but the
       six-city embed gate reads the RAW index — generic overview, no embed. */
    id: "p02-live-city-oob",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=2&view=live",
      expect: [
        { sel: "#liveTitle", text: "Invest City Strategy Analysis" },
        { sel: ".live-kpi strong", text: "2.84" },
        { sel: ".sixcity-embed", state: "detached" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 2 },
      expect: [
        { sel: ".mh-live-heading h1", text: "Invest City Strategy Analysis" },
        { sel: ".mh-live-kpi strong", text: "2.84" },
        { sel: ".mh-sixcity", state: "detached" },
      ],
    },
  },
  {
    /* city dashboard=1 is the generic LiveOverview (six-city embed only at index 0). */
    id: "p02-live-city-d1",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=1&view=live",
      expect: [
        { sel: "#liveKicker", text: "CITY STRATEGY / LIVE REPORT" },
        { sel: "#liveTitle", text: "City Analysis Dashboard" },
        { sel: ".live-kpi strong", text: "¥86.4M" },
        { sel: ".live-rank-row b", text: "84" },
        { sel: ".sixcity-embed", state: "detached" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 1 },
      expect: [
        { sel: ".mh-live-heading .mh-eyebrow", text: "CITY STRATEGY / LIVE REPORT" },
        { sel: ".mh-live-heading h1", text: "City Analysis Dashboard" },
        { sel: ".mh-live-kpi strong", text: "¥86.4M" },
        { sel: ".mh-live-rank b", text: "84" },
        { sel: ".mh-sixcity", state: "detached" },
      ],
    },
  },
  {
    id: "p02-live-fourp-d1",
    original: {
      url: "/assets/pages/reports.html?project=fourp&dashboard=1&view=live",
      expect: [
        { sel: "#liveKicker", text: "4P REPORT / LIVE REPORT" },
        { sel: "#liveTitle", text: "Promotion Lift Analysis" },
        { sel: ".live-kpi strong", text: "+14.2%" },
        { sel: ".live-rank-row b", text: "81" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "fourp", view: "live", dashboard: 1 },
      expect: [
        { sel: ".mh-live-heading .mh-eyebrow", text: "4P REPORT / LIVE REPORT" },
        { sel: ".mh-live-heading h1", text: "Promotion Lift Analysis" },
        { sel: ".mh-live-kpi strong", text: "+14.2%" },
        { sel: ".mh-live-rank b", text: "81" },
      ],
    },
  },
  {
    id: "p02-live-customer-d0",
    original: {
      url: "/assets/pages/reports.html?project=customer&dashboard=0&view=live",
      expect: [
        { sel: "#liveKicker", text: "CUSTOMER DAILY TRACKING / LIVE REPORT" },
        { sel: "#liveTitle", text: "Customer Daily Pulse" },
        { sel: ".live-kpi strong", text: "684K" },
        { sel: ".live-rank-row b", text: "58" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "customer", view: "live", dashboard: 0 },
      expect: [
        { sel: ".mh-live-heading .mh-eyebrow", text: "CUSTOMER DAILY TRACKING / LIVE REPORT" },
        { sel: ".mh-live-heading h1", text: "Customer Daily Pulse" },
        { sel: ".mh-live-kpi strong", text: "684K" },
        { sel: ".mh-live-rank b", text: "58" },
      ],
    },
  },
  {
    id: "p02-live-customer-d1",
    original: {
      url: "/assets/pages/reports.html?project=customer&dashboard=1&view=live",
      expect: [
        { sel: "#liveTitle", text: "Customer Funnel Watch" },
        { sel: ".live-kpi strong", text: "64.8%" },
        { sel: ".live-rank-row b", text: "94" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "customer", view: "live", dashboard: 1 },
      expect: [
        { sel: ".mh-live-heading h1", text: "Customer Funnel Watch" },
        { sel: ".mh-live-kpi strong", text: "64.8%" },
        { sel: ".mh-live-rank b", text: "94" },
      ],
    },
  },
  {
    id: "p02-live-abo-d0",
    original: {
      url: "/assets/pages/reports.html?project=abo&dashboard=0&view=live",
      expect: [
        { sel: "#liveTitle", text: "Audience Build Overview" },
        { sel: ".live-kpi strong", text: "18.4M" },
        { sel: ".live-rank-row b", text: "88" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "abo", view: "live", dashboard: 0 },
      expect: [
        { sel: ".mh-live-heading h1", text: "Audience Build Overview" },
        { sel: ".mh-live-kpi strong", text: "18.4M" },
        { sel: ".mh-live-rank b", text: "88" },
      ],
    },
  },
  {
    id: "p02-live-abo-d1",
    original: {
      url: "/assets/pages/reports.html?project=abo&dashboard=1&view=live",
      expect: [
        { sel: "#liveTitle", text: "Campaign Quality Watch" },
        { sel: ".live-kpi strong", text: "¥12.6M" },
        { sel: ".live-rank-row b", text: "82" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "abo", view: "live", dashboard: 1 },
      expect: [
        { sel: ".mh-live-heading h1", text: "Campaign Quality Watch" },
        { sel: ".mh-live-kpi strong", text: "¥12.6M" },
        { sel: ".mh-live-rank b", text: "82" },
      ],
    },
  },
  {
    id: "p02-live-rednote-d0",
    original: {
      url: "/assets/pages/reports.html?project=rednote&dashboard=0&view=live",
      expect: [
        { sel: "#liveTitle", text: "Rednote Media Tracking" },
        { sel: ".live-kpi strong", text: "142M" },
        { sel: ".live-rank-row b", text: "58" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "rednote", view: "live", dashboard: 0 },
      expect: [
        { sel: ".mh-live-heading h1", text: "Rednote Media Tracking" },
        { sel: ".mh-live-kpi strong", text: "142M" },
        { sel: ".mh-live-rank b", text: "58" },
      ],
    },
  },
  {
    id: "p02-live-rednote-d1",
    original: {
      url: "/assets/pages/reports.html?project=rednote&dashboard=1&view=live",
      expect: [
        { sel: "#liveTitle", text: "Creative Quality Monitor" },
        { sel: ".live-kpi strong", text: "286" },
        { sel: ".live-rank-row b", text: "82" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "rednote", view: "live", dashboard: 1 },
      expect: [
        { sel: ".mh-live-heading h1", text: "Creative Quality Monitor" },
        { sel: ".mh-live-kpi strong", text: "286" },
        { sel: ".mh-live-rank b", text: "82" },
      ],
    },
  },
  {
    id: "p02-live-ottolv-d0",
    original: {
      url: "/assets/pages/reports.html?project=ottolv&dashboard=0&view=live",
      expect: [
        { sel: "#liveTitle", text: "OTT / OLV Exposure Tracking" },
        { sel: ".live-kpi strong", text: "386M" },
        { sel: ".live-rank-row b", text: "86" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "ottolv", view: "live", dashboard: 0 },
      expect: [
        { sel: ".mh-live-heading h1", text: "OTT / OLV Exposure Tracking" },
        { sel: ".mh-live-kpi strong", text: "386M" },
        { sel: ".mh-live-rank b", text: "86" },
      ],
    },
  },
  {
    id: "p02-live-ottolv-d1",
    original: {
      url: "/assets/pages/reports.html?project=ottolv&dashboard=1&view=live",
      expect: [
        { sel: "#liveTitle", text: "Source Integrity Monitor" },
        { sel: ".live-kpi strong", text: "11 / 12" },
        { sel: ".live-rank-row b", text: "94" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "ottolv", view: "live", dashboard: 1 },
      expect: [
        { sel: ".mh-live-heading h1", text: "Source Integrity Monitor" },
        { sel: ".mh-live-kpi strong", text: "11 / 12" },
        { sel: ".mh-live-rank b", text: "94" },
      ],
    },
  },
  {
    /* Report Copilot workspace (aiWorkspace) — drawer opens over the live view. */
    id: "p02-copilot-open",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { waitMs: 400 },
      ],
      expect: [
        { sel: "#aiWorkspace", text: "Data Analysis Assistant" },
        { sel: ".ai-workspace-head span", text: "REPORT COPILOT" },
        { sel: ".ai-context-card", text: "INVEST CITY STRATEGY QUICK SUMMARY" },
        { sel: ".ai-context-card", text: "Context loaded" },
        { sel: ".ai-recommendation-head h3", text: "Scenario reports" },
        { sel: "#aiPeriodHint", text: "Investment Holistic Analysis FY26P9" },
        { sel: "#aiCommandInput[required]" },
        { sel: "#aiEntry.global-ai-launcher", state: "hidden" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { waitMs: 400 },
      ],
      expect: [
        { sel: ".mh-copilot", text: "Data Analysis Assistant" },
        { sel: ".mh-copilot__head-title span", text: "REPORT COPILOT" },
        { sel: ".mh-copilot__summary-card", text: "INVEST CITY STRATEGY QUICK SUMMARY" },
        { sel: ".mh-copilot__summary-card", text: "Context loaded" },
        { sel: ".mh-copilot__start .mh-copilot__section-title h3", text: "Scenario reports" },
        { sel: ".mh-copilot__period-hint", text: "Investment Holistic Analysis FY26P9" },
        { sel: ".mh-copilot__command-box textarea[required]" },
        { sel: ".mh-launcher", state: "hidden" },
      ],
    },
  },
  {
    id: "p02-copilot-more",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiRecommendationNote" },
      ],
      expect: [
        { sel: "#aiRecommendations.show-all" },
        { sel: ".ai-recommendation >> nth=4", text: "Product mix analysis" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__view-more" },
      ],
      expect: [
        { sel: ".mh-copilot__recs.is-show-all" },
        { sel: ".mh-copilot__rec >> nth=4", text: "Product mix analysis" },
      ],
    },
  },
  {
    id: "p02-copilot-answer",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiRecommendations .ai-recommendation >> nth=1" },
        { wait: "#aiAnswer:not([hidden])" },
      ],
      expect: [
        { sel: "#aiAnswer .answer-label", text: "CONTEXTUAL ANSWER" },
        { sel: "#aiAnswerTitle", text: "Invested cities lead on traffic quality, not uniformly on conversion." },
        { sel: "#aiAnswerFindings .answer-finding" },
        { sel: "#aiAnswerSources a" },
        { sel: ".ai-answer-context-tools", text: "AI summary" },
        { sel: "#aiAnswerFeedback", text: "Was this answer helpful?" },
        { sel: "#aiStart .ai-recommendation", state: "hidden" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__rec >> nth=1" },
        { wait: ".mh-copilot__answer" },
      ],
      expect: [
        { sel: ".mh-copilot__answer-label", text: "CONTEXTUAL ANSWER" },
        { sel: ".mh-copilot__answer-title", text: "Invested cities lead on traffic quality, not uniformly on conversion." },
        { sel: ".mh-copilot__findings .mh-copilot__finding" },
        { sel: ".mh-copilot__sources a" },
        { sel: ".mh-copilot__tools", text: "AI summary" },
        { sel: ".mh-copilot__feedback", text: "Was this answer helpful?" },
        { sel: ".mh-copilot__start", state: "detached" },
      ],
    },
  },
  {
    /* Holistic report streams 11 blocks at 110ms — settle past the stream. */
    id: "p02-copilot-holistic",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiRecommendations .ai-recommendation >> nth=0" },
        { wait: "#aiAnswerReport .stream-block" },
        { waitMs: 1600 },
      ],
      expect: [
        { sel: "#aiAnswerTitle", text: "Investment Holistic Analysis — COACH Pilot City" },
        { sel: ".holistic-report", text: "Executive Summary" },
        { sel: ".holistic-report", text: "City-Level Breakdown" },
        { sel: ".holistic-report .hr-table" },
        { sel: ".holistic-report .hr-insight" },
        { sel: "#aiAnswerSummary", state: "hidden" },
      ],
      settleMs: 1800,
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__rec >> nth=0" },
        { wait: ".mh-holistic .mh-stream-block" },
        { waitMs: 1600 },
      ],
      expect: [
        { sel: ".mh-copilot__answer-title", text: "Investment Holistic Analysis — COACH Pilot City" },
        { sel: ".mh-holistic", text: "Executive Summary" },
        { sel: ".mh-holistic", text: "City-Level Breakdown" },
        { sel: ".mh-holistic .mh-hr-table" },
        { sel: ".mh-holistic .mh-hr-insight" },
        { sel: ".mh-copilot__answer-summary", state: "detached" },
      ],
      settleMs: 1800,
    },
  },
  {
    /* Fresh custom question → chat mode: query bubble + standard answer card. */
    id: "p02-copilot-chat",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { fill: ["#aiCommandInput", "What changed this week?"] },
        { click: "#aiCmdSend" },
        { wait: "#aiChatThread .report-chat-entry" },
      ],
      expect: [
        { sel: "#aiAnswer.is-chat-mode" },
        { sel: ".user-query-bubble", text: "What changed this week?" },
        { sel: ".answer-card h3", text: "Recommended next move." },
        { sel: ".answer-card-head small", text: "2 grounded sources" },
        { sel: ".answer-actions", text: "Open report context" },
        { sel: ".answer-feedback-btn", text: "Helpful" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { fill: [".mh-copilot__command-box textarea", "What changed this week?"] },
        { click: ".mh-copilot__send" },
        { wait: ".mh-copilot__thread .mh-copilot__entry" },
      ],
      expect: [
        { sel: ".mh-copilot__answer.is-chat-mode" },
        { sel: ".mh-copilot__bubble", text: "What changed this week?" },
        { sel: ".mh-copilot__card h3", text: "Recommended next move." },
        { sel: ".mh-copilot__card-head small", text: "2 grounded sources" },
        { sel: ".mh-copilot__card-actions", text: "Open report context" },
        { sel: ".mh-copilot__fb", text: "Helpful" },
      ],
    },
  },
  {
    /* Canonical phrasing → rich pilot-city sales card (streams ~5 blocks/140ms). */
    id: "p02-copilot-chat-rich",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { fill: ["#aiCommandInput", "How was pilot city sales performance last month?"] },
        { click: "#aiCmdSend" },
        { wait: "#aiChatThread .rich-answer" },
        { waitMs: 1200 },
      ],
      expect: [
        { sel: ".rich-answer .ra-lead", text: "7,916.2" },
        { sel: ".rich-answer .ra-channel >> nth=0", text: "Retail" },
        { sel: ".rich-answer .ra-channel >> nth=0", text: "+6.7%" },
        { sel: ".rich-answer .ra-channel >> nth=1", text: "−9.0%" },
        { sel: ".rich-answer .ra-insight", text: "FY27P2" },
        { sel: ".rich-answer .ra-option", text: "Analyze 6 cities" },
        { sel: ".rich-answer .ra-source-line", text: "Sources used" },
        { sel: ".rich-answer .answer-feedback-btn >> nth=1", text: "Not helpful" },
      ],
      settleMs: 1400,
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { fill: [".mh-copilot__command-box textarea", "How was pilot city sales performance last month?"] },
        { click: ".mh-copilot__send" },
        { wait: ".mh-copilot__card--rich" },
        { waitMs: 1200 },
      ],
      expect: [
        { sel: ".mh-copilot__card--rich .mh-ra-lead", text: "7,916.2" },
        { sel: ".mh-ra-channel >> nth=0", text: "Retail" },
        { sel: ".mh-ra-channel >> nth=0", text: "+6.7%" },
        { sel: ".mh-ra-channel >> nth=1", text: "−9.0%" },
        { sel: ".mh-ra-insight", text: "FY27P2" },
        { sel: ".mh-ra-option", text: "Analyze 6 cities" },
        { sel: ".mh-ra-source-line", text: "Sources used" },
        { sel: ".mh-copilot__card--rich .mh-copilot__fb >> nth=1", text: "Not helpful" },
      ],
      settleMs: 1400,
    },
  },
  {
    /* Custom question over an open answer appends below it (answer stays). */
    id: "p02-copilot-chat-append",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiRecommendations .ai-recommendation >> nth=1" },
        { wait: "#aiAnswer:not([hidden])" },
        { fill: ["#aiCommandInput", "Any follow-up?"] },
        { click: "#aiCmdSend" },
        { wait: "#aiChatThread .report-chat-entry" },
      ],
      expect: [
        { sel: "#aiAnswer:not(.is-chat-mode)" },
        { sel: "#aiAnswerTitle", text: "Invested cities lead on traffic quality, not uniformly on conversion." },
        { sel: "#aiChatThread .user-query-bubble", text: "Any follow-up?" },
        { sel: "#aiAnswerFindings .answer-finding" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__rec >> nth=1" },
        { wait: ".mh-copilot__answer" },
        { fill: [".mh-copilot__command-box textarea", "Any follow-up?"] },
        { click: ".mh-copilot__send" },
        { wait: ".mh-copilot__thread .mh-copilot__entry" },
      ],
      expect: [
        { sel: ".mh-copilot__answer:not(.is-chat-mode)" },
        { sel: ".mh-copilot__answer-title", text: "Invested cities lead on traffic quality, not uniformly on conversion." },
        { sel: ".mh-copilot__thread .mh-copilot__bubble", text: "Any follow-up?" },
        { sel: ".mh-copilot__findings .mh-copilot__finding" },
      ],
    },
  },
  {
    /* Context dock: "AI summary" tool moves the section into the answer view. */
    id: "p02-copilot-dock",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiRecommendations .ai-recommendation >> nth=1" },
        { wait: "#aiAnswer:not([hidden])" },
        { click: "[data-ai-context-panel='summary']" },
      ],
      expect: [
        { sel: "#aiAnswerContextDock .ai-context-section:not([hidden])" },
        { sel: "#aiAnswerContextDock .ai-context-card", text: "Context loaded" },
        { sel: "[data-ai-context-panel='summary'].active" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__rec >> nth=1" },
        { wait: ".mh-copilot__answer" },
        { click: ".mh-copilot__tool >> nth=0" },
      ],
      expect: [
        { sel: ".mh-copilot__dock .mh-copilot__section--docked" },
        { sel: ".mh-copilot__dock .mh-copilot__summary-card", text: "Context loaded" },
        { sel: ".mh-copilot__tool.is-active" },
      ],
    },
  },
  {
    /* History popup: the original anchors to the fixed drawer (offscreen bug —
       attached-only expect). The story anchors inside the head-actions bar and
       clicking an item fills the composer. */
    id: "p02-copilot-history",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiWorkspace #aiHistory" },
        { wait: "#aiReportHistoryPopup:not([hidden])" },
      ],
      expect: [
        { sel: "#aiReportHistoryPopup", state: "attached" },
        { sel: "#aiReportHistoryPopup .ai-recent-chat >> nth=2", state: "attached" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: "button[aria-label='History']" },
        { wait: ".mh-copilot__history" },
        { click: ".mh-copilot__history-item >> nth=1" },
        {
          eval:
            "(() => { const v = document.querySelector('.mh-copilot__command-box textarea').value; if (!v.includes('Compare traffic uplift with sales growth by city.')) throw new Error('composer value: ' + JSON.stringify(v)); })()",
        },
      ],
      expect: [{ sel: ".mh-copilot__history", state: "detached" }],
    },
  },
  {
    /* "+" opens the report skill menu; hovering Analytical Model previews the
       detail panel (unpinned, no focus steal). */
    id: "p02-copilot-skill",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiCmdUpload" },
        { wait: ".report-ai-upload-popup:not([hidden])" },
        { hover: "[data-report-skill-category='Analytical Model']" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".report-ai-upload-popup", text: "Upload File" },
        { sel: ".report-ai-upload-popup", text: "Analytical Model" },
        { sel: ".ai-skill-detail-panel:not([hidden])" },
        { sel: ".ai-skill-detail-panel input[type='search']" },
        { sel: ".ai-skill-footer-action >> nth=0", text: "Add from Chat History" },
        { sel: ".ai-skill-footer-action >> nth=1", text: "Create Analytical Model Manually" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__command-actions .mh-assistant__skill" },
        { wait: ".mh-skill" },
        { hover: ".mh-skill__category:has-text('Analytical Model')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-skill", text: "Upload File" },
        { sel: ".mh-skill", text: "Analytical Model" },
        { sel: ".mh-skill__detail" },
        { sel: ".mh-skill__detail input[type='search']" },
        { sel: ".mh-skill__action >> nth=0", text: "Add from Chat History" },
        { sel: ".mh-skill__action >> nth=1", text: "Create Analytical Model Manually" },
      ],
    },
  },
  {
    /* Picking a model option fills the composer with the canned sentence. */
    id: "p02-copilot-skill-pick",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiCmdUpload" },
        { wait: ".report-ai-upload-popup:not([hidden])" },
        { click: "[data-report-skill-category='Analytical Model']" },
        { wait: ".ai-skill-detail-panel:not([hidden]) .ai-skill-option" },
        { click: ".ai-skill-option >> nth=0" },
        {
          eval:
            "(() => { const v = document.querySelector('#aiCommandInput').value; if (!/^Use .+ to interpret this report\\.$/.test(v)) throw new Error('composer value: ' + JSON.stringify(v)); })()",
        },
      ],
      expect: [{ sel: ".report-ai-upload-popup", state: "hidden" }],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__command-actions .mh-assistant__skill" },
        { wait: ".mh-skill" },
        { click: ".mh-skill__category:has-text('Analytical Model')" },
        { wait: ".mh-skill__option" },
        { click: ".mh-skill__option >> nth=0" },
        {
          eval:
            "(() => { const v = document.querySelector('.mh-copilot__command-box textarea').value; if (!/^Use .+ to interpret this report\\.$/.test(v)) throw new Error('composer value: ' + JSON.stringify(v)); })()",
        },
      ],
      expect: [{ sel: ".mh-skill", state: "detached" }],
    },
  },
  {
    /* "Add from Chat History" → flat message list + generation rule. */
    id: "p02-copilot-flow-history",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiCmdUpload" },
        { wait: ".report-ai-upload-popup:not([hidden])" },
        { click: "[data-report-skill-category='Analytical Model']" },
        { wait: ".ai-skill-detail-panel:not([hidden])" },
        { click: "[data-report-skill-action='history']" },
        { wait: "#aiReportHistoryGenerateDialog" },
      ],
      expect: [
        { sel: "#aiReportHistoryGenerateDialog", text: "Generate Analytical Model" },
        { sel: "#aiReportHistoryGenerateDialog", text: "1 · Select Conversations" },
        { sel: "#aiReportHistoryGenerateDialog", text: "2 · Generation Rule" },
        { sel: "[data-report-history-count]", text: "Selected" },
        { sel: "#aiReportHistoryGenerateDialog textarea" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__command-actions .mh-assistant__skill" },
        { wait: ".mh-skill" },
        { click: ".mh-skill__category:has-text('Analytical Model')" },
        { wait: ".mh-skill__detail" },
        { click: ".mh-skill__action:has-text('Add from Chat History')" },
        { wait: ".mh-flow__card--history" },
      ],
      expect: [
        { sel: ".mh-flow__card--history", text: "Generate Analytical Model" },
        { sel: ".mh-flow__card--history", text: "1 · Select Conversations" },
        { sel: ".mh-flow__card--history", text: "2 · Generation Rule" },
        { sel: ".mh-flow__count", text: "Selected" },
        { sel: ".mh-flow__rule" },
      ],
    },
  },
  {
    /* Generate → model form (Submit before Save in the report variant). */
    id: "p02-copilot-flow-form",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiCmdUpload" },
        { wait: ".report-ai-upload-popup:not([hidden])" },
        { click: "[data-report-skill-category='Analytical Model']" },
        { wait: ".ai-skill-detail-panel:not([hidden])" },
        { click: "[data-report-skill-action='history']" },
        { wait: "#aiReportHistoryGenerateDialog" },
        { click: "[data-report-generate-model]" },
        { wait: "#aiReportGeneratedModelDialog" },
      ],
      expect: [
        { sel: "#aiReportGeneratedModelDialog", text: "New Analytical Model" },
        { sel: "#aiReportGeneratedModelDialog", text: "Basic Information" },
        { sel: "#aiReportGeneratedModelDialog", text: "Trigger When" },
        { sel: "#aiReportGeneratedModelDialog", text: "Prohibited Analysis Directions" },
        { sel: "#aiReportGeneratedModelDialog .ai-flow-back", text: "← Back" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__command-actions .mh-assistant__skill" },
        { wait: ".mh-skill" },
        { click: ".mh-skill__category:has-text('Analytical Model')" },
        { wait: ".mh-skill__detail" },
        { click: ".mh-skill__action:has-text('Add from Chat History')" },
        { wait: ".mh-flow__card--history" },
        { click: ".mh-flow__btn--primary" },
        { wait: ".mh-flow__card--form" },
      ],
      expect: [
        { sel: ".mh-flow__card--form", text: "New Analytical Model" },
        { sel: ".mh-flow__card--form", text: "Basic Information" },
        { sel: ".mh-flow__card--form", text: "Trigger When" },
        { sel: ".mh-flow__card--form", text: "Prohibited Analysis Directions" },
        { sel: ".mh-flow__back", text: "← Back" },
      ],
    },
  },
  {
    id: "p02-copilot-maximize",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiWorkspace #aiMaximize" },
        { waitMs: 400 },
      ],
      expect: [
        { sel: "#aiWorkspace.open.is-ai-expanded" },
        { sel: "#aiWorkspace #aiMaximize[aria-label='Restore']" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: "button[aria-label='Maximize']" },
        { waitMs: 400 },
      ],
      expect: [
        { sel: ".mh-copilot.is-open.mh-copilot--expanded" },
        { sel: "button[aria-label='Restore']" },
      ],
    },
  },
  {
    /* New Session clears the answer and restores both context panels. */
    id: "p02-copilot-newsession",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiRecommendations .ai-recommendation >> nth=1" },
        { wait: "#aiAnswer:not([hidden])" },
        { click: "#aiNewSession" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: "#aiAnswer", state: "hidden" },
        { sel: ".ai-context-section:not([hidden])" },
        { sel: "#aiRecommendations .ai-recommendation" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__rec >> nth=1" },
        { wait: ".mh-copilot__answer" },
        { click: "button[aria-label='New session']" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-copilot__answer", state: "detached" },
        { sel: ".mh-copilot__summary-card" },
        { sel: ".mh-copilot__rec" },
      ],
    },
  },
  {
    id: "p02-copilot-escape",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { press: ["body", "Escape"] },
        { waitMs: 400 },
      ],
      expect: [{ sel: "#aiWorkspace.open", state: "detached" }],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { press: ["body", "Escape"] },
        { waitMs: 400 },
      ],
      expect: [{ sel: ".mh-copilot.is-open", state: "detached" }],
    },
  },
  {
    id: "p02-copilot-scrim",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiScrim" },
        { waitMs: 400 },
      ],
      expect: [{ sel: "#aiWorkspace.open", state: "detached" }],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__scrim" },
        { waitMs: 400 },
      ],
      expect: [{ sel: ".mh-copilot.is-open", state: "detached" }],
    },
  },
  {
    /* "← Suggested questions" exits the answer view and restores the panels. */
    id: "p02-copilot-back",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiRecommendations .ai-recommendation >> nth=1" },
        { wait: "#aiAnswer:not([hidden])" },
        { click: "[data-ai-back]" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: "#aiAnswer", state: "hidden" },
        { sel: "#aiStart .ai-recommendation" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__rec >> nth=1" },
        { wait: ".mh-copilot__answer" },
        { click: ".mh-copilot__back" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-copilot__answer", state: "detached" },
        { sel: ".mh-copilot__rec" },
      ],
    },
  },
  {
    /* Answer feedback is radio-like with a dynamic status line. */
    id: "p02-copilot-feedback",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiRecommendations .ai-recommendation >> nth=1" },
        { wait: "#aiAnswer:not([hidden])" },
        { click: "[data-ai-feedback='helpful']" },
      ],
      expect: [
        { sel: "[data-ai-feedback='helpful'][aria-pressed='true']" },
        { sel: "#aiFeedbackStatus", text: "Thanks. This answer was marked helpful." },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { click: ".mh-copilot__rec >> nth=1" },
        { wait: ".mh-copilot__answer" },
        { click: ".mh-copilot__feedback button:has-text('Helpful')" },
      ],
      expect: [
        { sel: ".mh-copilot__feedback button[aria-pressed='true']", text: "Helpful" },
        { sel: ".mh-copilot__feedback-status", text: "Thanks. This answer was marked helpful." },
      ],
    },
  },
  {
    /* Opening moves focus onto the workspace close button (keyboard exit). */
    id: "p02-copilot-focus",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { waitMs: 400 },
        {
          eval:
            "(() => { const el = document.activeElement; if (!el || !el.classList.contains('ai-close')) throw new Error('focus on ' + (el && el.className)); })()",
        },
      ],
      expect: [{ sel: "#aiWorkspace.open" }],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { waitMs: 400 },
        {
          eval:
            "(() => { const el = document.activeElement; if (!el || !el.classList.contains('mh-copilot__close')) throw new Error('focus on ' + (el && el.className)); })()",
        },
      ],
      expect: [{ sel: ".mh-copilot.is-open" }],
    },
  },
  {
    /* 390px: unexpanded drawer = min(40vw,100vw-80)=156px flush right;
       expanded fills the viewport with a 12px inset. */
    id: "p02-copilot-mobile",
    viewport: { width: 390, height: 844 },
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { waitMs: 600 },
        {
          eval:
            "(() => { const r = document.querySelector('#aiWorkspace').getBoundingClientRect(); if (Math.abs(r.left - 234) > 2 || Math.abs(r.width - 156) > 2) throw new Error('drawer ' + JSON.stringify(r)); })()",
        },
        { click: "#aiWorkspace #aiMaximize" },
        { waitMs: 600 },
        {
          eval:
            "(() => { const r = document.querySelector('#aiWorkspace').getBoundingClientRect(); if (Math.abs(r.left - 12) > 2 || Math.abs(r.top - 12) > 2 || Math.abs(r.width - 366) > 2 || Math.abs(r.height - 820) > 2) throw new Error('expanded ' + JSON.stringify(r)); })()",
        },
      ],
      expect: [{ sel: "#aiWorkspace.open.is-ai-expanded" }],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { waitMs: 600 },
        {
          eval:
            "(() => { const r = document.querySelector('.mh-copilot').getBoundingClientRect(); if (Math.abs(r.left - 234) > 2 || Math.abs(r.width - 156) > 2) throw new Error('drawer ' + JSON.stringify(r)); })()",
        },
        { click: "button[aria-label='Maximize']" },
        { waitMs: 600 },
        {
          eval:
            "(() => { const r = document.querySelector('.mh-copilot').getBoundingClientRect(); if (Math.abs(r.left - 12) > 2 || Math.abs(r.top - 12) > 2 || Math.abs(r.width - 366) > 2 || Math.abs(r.height - 820) > 2) throw new Error('expanded ' + JSON.stringify(r)); })()",
        },
      ],
      expect: [{ sel: ".mh-copilot.is-open.mh-copilot--expanded" }],
    },
  },
  {
    /* Non-city report keeps the shared chrome with the default profile hint. */
    id: "p02-copilot-generic",
    original: {
      url: "/assets/pages/reports.html?project=fourp&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { waitMs: 400 },
      ],
      expect: [
        { sel: "#aiWorkspace", text: "Data Analysis Assistant" },
        { sel: "#aiPeriodHint", text: "Type your question directly or start with a preset analysis below." },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "fourp", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-copilot.is-open" },
        { waitMs: 400 },
      ],
      expect: [
        { sel: ".mh-copilot", text: "Data Analysis Assistant" },
        { sel: ".mh-copilot__period-hint", text: "Type your question directly or start with a preset analysis below." },
      ],
    },
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
        { sel: ".ask-scope", state: "hidden" },
        { sel: ".global-ai-launcher", state: "hidden" },
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
      id: "pages--media-tracking-detail",
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-assistant" },
        { click: "button[aria-label='History']" },
        { wait: ".mh-assistant__history-pop" },
        { click: ".mh-assistant__history-item" },
      ],
      expect: [
        { sel: ".mh-assistant__history-pop", state: "detached" },
        { sel: ".mh-assistant__send .mh-button:not([disabled])" },
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
        { sel: "#assistantPanel.is-ai-expanded" },
        { sel: "#aiMaximize[aria-label='Restore']" },
      ],
    },
    story: {
      id: "pages--media-tracking-detail",
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-assistant" },
        { click: "button[aria-label='Maximize']" },
      ],
      expect: [
        { sel: ".mh-assistant--expanded" },
        { sel: "button[aria-label='Restore']" },
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
      expect: [{ sel: "#answerFeed .answer-card", state: "detached" }],
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
      expect: [{ sel: ".mh-assistant__answer", state: "detached" }],
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
        { sel: ".global-ai-launcher" },
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
        { sel: ".mh-launcher" },
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
      id: "pages--media-tracking-detail",
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-assistant" },
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
      id: "pages--media-tracking-detail",
      actions: [
        { click: ".mh-launcher" },
        { wait: ".mh-assistant" },
        { click: ".mh-assistant__skill" },
        { wait: ".mh-skill" },
        { click: ".mh-skill__category >> nth=1" },
        { wait: ".mh-skill__detail" },
        { click: ".mh-skill__action >> nth=1" },
        { wait: ".mh-flow__card--form" },
        { click: ".mh-flow__foot .mh-flow__btn--primary" },
        { wait: ".mh-flow__field-error" },
      ],
      expect: [
        { sel: ".mh-flow__field-error", text: "Name is required." },
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
      id: "pages--campaign",
      args: { assistantOpen: true },
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
       renders the workspace card (flush banner, findings, source chips) below
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
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [{ click: ".mh-assistant__suggestions button" }, { wait: ".mh-assistant__answer--workspace" }],
      expect: [
        { sel: ".mh-assistant__answer-banner", text: "AI ResponseContext: Campaigns" },
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
      expect: [{ sel: ".mh-assistant__entry", state: "detached" }],
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
        { sel: "#sendQuery:not([disabled])" },
      ],
    },
    story: {
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [
        { click: "button[aria-label='History']" },
        { wait: ".mh-assistant__history-pop" },
        { click: ".mh-assistant__history-item" },
        {
          eval: "(() => { const v = document.querySelector('.mh-assistant__box textarea').value; if (v !== 'Why did campaign ROI decline last week?') throw new Error('prompt fill ' + JSON.stringify(v)); })()",
        },
      ],
      expect: [
        { sel: ".mh-assistant__history-pop", state: "detached" },
        { sel: ".mh-assistant__send .mh-button:not([disabled])" },
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
        { sel: ".assistant-panel.is-ai-expanded .assistant-modal" },
        { sel: "#aiMaximize[aria-label='Restore AI Interpreter panel']" },
      ],
    },
    story: {
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [{ click: "button[aria-label='Maximize AI Interpreter panel']" }],
      expect: [
        { sel: ".mh-assistant--expanded" },
        { sel: "button[aria-label='Restore AI Interpreter panel']" },
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
      id: "pages--campaign",
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
      expect: [{ sel: "#aiHistoryGenerateDialog", state: "detached" }],
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
      expect: [{ sel: ".mh-flow", state: "detached" }],
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
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [
        { click: ".mh-assistant__skill" },
        { wait: ".mh-skill" },
        { click: ".mh-skill__category >> nth=1" },
        { wait: ".mh-skill__detail" },
        { click: ".mh-skill__action >> nth=1" },
        { wait: ".mh-flow__card--form" },
        { click: ".mh-flow__foot .mh-flow__btn--primary" },
        { wait: ".mh-flow__field-error" },
      ],
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
        { sel: "#aiEntry" },
      ],
    },
    story: {
      id: "pages--campaign",
      args: { assistantOpen: true },
      actions: [{ wait: ".mh-assistant" }, { press: ["body", "Escape"] }],
      expect: [
        { sel: ".mh-assistant", state: "detached" },
        { sel: ".mh-launcher" },
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
      expect: [{ sel: ".answer-feedback-btn[data-feedback='helpful'][aria-pressed='false']" }],
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
      expect: [{ sel: ".mh-assistant__feedback button[data-kind='helpful'][aria-pressed='false']" }],
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
  {
    /* types.js: ?type=Principles swaps the asset table for the numbered card
       grid; the "Showing X of Y" count line is display:none on type pages. */
    id: "p07-interpreter-principles",
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
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      actions: [
        { wait: ".principle-list-item:has-text('Resolve Requests') .principle-description-toggle" },
        { click: ".principle-list-item:has-text('Resolve Requests') .principle-description-toggle" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".principle-list-item:has-text('Resolve Requests') .principle-description.is-expanded" },
        { sel: ".principle-list-item:has-text('Resolve Requests') .principle-description-toggle[aria-expanded='true']" },
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
        { sel: ".mh-principle:has-text('Resolve Requests') .mh-principle__desc.is-expanded" },
        { sel: ".mh-principle:has-text('Resolve Requests') .mh-principle__toggle[aria-expanded='true']" },
      ],
    },
  },
  {
    /* types.js: "/" focuses the visible type-page search (not while editing). */
    id: "p07-principles-slash",
    original: {
      url: "/assets/pages/knowledge.html?type=Principles",
      actions: [{ press: ["body", "/"] }, { waitMs: 200 }],
      expect: [{ sel: "#knowledgeSearch:focus" }],
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
      expect: [{ sel: ".mh-principles input[type='search']:focus" }],
    },
  },
];
