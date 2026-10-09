export default [
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
      id: "pages--marketing-cockpit-project",
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
      id: "pages--marketing-cockpit-search-empty",
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
      expect: [{ sel: ".report-details-drawer.fullscreen", text: "REPORT DETAILS" }],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", details: { project: "city", index: 0 } },
      actions: [
        { wait: ".mh-details" },
        { click: "button[aria-label='Toggle fullscreen']" },
      ],
      expect: [{ sel: ".mh-details.is-fullscreen", text: "REPORT DETAILS" }],
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
      expect: [
        { sel: ".report-details-drawer.open", state: "detached" },
        { sel: ".project-report-heading", text: "Available reports" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", details: { project: "city", index: 0 } },
      actions: [
        { wait: ".mh-details" },
        { press: ["body", "Escape"] },
      ],
      expect: [
        { sel: ".mh-details", state: "detached" },
        { sel: ".mh-project-directory", text: "Available reports" },
      ],
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
      id: "pages--marketing-cockpit-catalog-assistant-answer",
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
      id: "pages--marketing-cockpit-live-report",
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
      id: "pages--marketing-cockpit-city-dashboard",
      expect: [
        { sel: ".mh-sixcity" },
        { sel: ".mh-sc-title", text: "Invest City Strategy Analysis（6 Cities）" },
        { sel: ".mh-sc-filters", text: "FY25 P4–P9" },
        { sel: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('City')) .mh-sc-fval__txt", text: "Total" },
        { sel: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('Store')) .mh-sc-fval__txt", text: "All Stores · 6 Cities" },
        { sel: ".mh-sc-kpi:has-text('Avg Daily Traffic')" },
        { sel: ".mh-sc-kpi:has-text('+10%')" },
        { sel: ".mh-sc-kpi:has-text('After 0.4K')" },
        { sel: ".mh-sc-kpi:has-text('4,581')" },
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
    id: "p02-live-city-empty",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#sc-cityCtrl" },
        { click: "#sc-cityCtrl .sc-none" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: "#sc-cityCtrl .sc-fval-txt", text: "(None)" },
        { sel: ".sc-sec-title", text: "Total Monthly Key Indicator Trend vs. Non Invest City" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit",
      args: { project: "city", view: "live", dashboard: 0 },
      actions: [
        { click: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('City')) .mh-sc-fval" },
        { click: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('City')) .mh-sc-phead button:has-text('Clear')" },
        { waitMs: 300 },
      ],
      expect: [
        { sel: ".mh-sc-fitem:has(.mh-sc-flabel:text-is('City')) .mh-sc-fval__txt", text: "(None)" },
        { sel: ".mh-sc-sec-title", text: "(None) Monthly Key Indicator Trend vs. Non Invest City" },
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
      id: "pages--marketing-cockpit-copilot-open",
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
      id: "pages--marketing-cockpit-copilot-recommendations-expanded",
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
      id: "pages--marketing-cockpit-copilot-answer",
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
      id: "pages--marketing-cockpit-copilot-holistic",
      actions: [{ wait: ".mh-holistic:has-text('Executive Summary'):has-text('City-Level Breakdown')" }],
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
      id: "pages--marketing-cockpit-copilot-chat",
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
      id: "pages--marketing-cockpit-copilot-rich-chat",
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
      id: "pages--marketing-cockpit-copilot-chat-append",
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
      id: "pages--marketing-cockpit-copilot-context-dock",
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
        { sel: "#aiReportHistoryPopup", state: "attached", text: "Recent Chats" },
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
      expect: [
        { sel: ".mh-copilot__history", state: "detached" },
        { sel: ".mh-copilot", text: "Data Analysis Assistant" },
      ],
    },
  },
  {
    id: "p02-copilot-history-case",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiWorkspace #aiHistory" },
        { wait: "#aiReportHistoryPopup:not([hidden])" },
      ],
      expect: [{ sel: "#aiReportHistoryPopup", state: "attached", text: "Recent Chats" }],
    },
    story: {
      id: "pages--marketing-cockpit-copilot-history",
      expect: [{ sel: ".mh-copilot__history-item span >> nth=2", text: "Find conversion gaps in this scenario report." }],
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
      id: "pages--marketing-cockpit-copilot-skills",
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
      expect: [
        { sel: ".report-ai-upload-popup", state: "hidden" },
        { sel: "#aiWorkspace", text: "Data Analysis Assistant" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit-copilot-skill-picked",
      expect: [
        { sel: ".mh-skill", state: "detached" },
        { sel: ".mh-copilot", text: "Data Analysis Assistant" },
      ],
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
      id: "pages--marketing-cockpit-copilot-model-history",
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
      id: "pages--marketing-cockpit-copilot-model-generated",
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
    id: "p02-copilot-flow-manual",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" },
        { wait: "#aiWorkspace.open" },
        { click: "#aiCmdUpload" },
        { wait: ".report-ai-upload-popup:not([hidden])" },
        { click: "[data-report-skill-category='Analytical Model']" },
        { wait: ".ai-skill-detail-panel:not([hidden])" },
        { click: "[data-report-skill-action='manual']" },
      ],
      expect: [
        { sel: "#aiReportGeneratedModelDialog", text: "Create Analytical Model Manually" },
        { sel: "#aiReportGeneratedModelDialog input[placeholder='Enter analytical model name']" },
      ],
    },
    story: {
      id: "pages--marketing-cockpit-copilot-model-manual",
      expect: [
        { sel: ".mh-flow__card--form", text: "Create Analytical Model Manually" },
        { sel: ".mh-flow__card--form input[placeholder='Enter analytical model name']" },
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
        { sel: "#aiWorkspace.open.is-ai-expanded", text: "Data Analysis Assistant" },
        { sel: "#aiWorkspace #aiMaximize", attr: { name: "aria-label", value: "Restore" } },
      ],
    },
    story: {
      id: "pages--marketing-cockpit-copilot-maximized",
      expect: [
        { sel: ".mh-copilot.is-open.mh-copilot--expanded", text: "Data Analysis Assistant" },
        { sel: "button[aria-label='Restore']", attr: { name: "aria-label", value: "Restore" } },
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
        { sel: ".ai-context-section:not([hidden])", text: "AI summary" },
        { sel: "#aiRecommendations .ai-recommendation", count: 6 },
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
        { sel: ".mh-copilot__summary-card", text: "INVEST CITY STRATEGY QUICK SUMMARY" },
        { sel: ".mh-copilot__rec", count: 6 },
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
      expect: [
        { sel: "#aiWorkspace.open", state: "detached" },
        { sel: "h1", text: "Marketing Cockpit" },
      ],
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
      expect: [
        { sel: ".mh-copilot.is-open", state: "detached" },
        { sel: "#storybook-root h1", text: "Marketing Cockpit" },
      ],
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
      expect: [
        { sel: "#aiWorkspace.open", state: "detached" },
        { sel: "h1", text: "Marketing Cockpit" },
      ],
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
      expect: [
        { sel: ".mh-copilot.is-open", state: "detached" },
        { sel: "#storybook-root h1", text: "Marketing Cockpit" },
      ],
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
        { sel: "#aiStart .ai-recommendation", count: 6 },
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
        { sel: ".mh-copilot__rec", count: 6 },
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
      id: "pages--marketing-cockpit-copilot-feedback",
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
      expect: [{ sel: "#aiWorkspace.open", text: "Data Analysis Assistant" }],
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
      expect: [{ sel: ".mh-copilot.is-open", text: "Data Analysis Assistant" }],
    },
  },
  {
    /* 390px: the original keeps a 156px drawer flush right, with the header and composer
       running off it (an intentional difference, handover §3): the story's drawer fills the
       screen with Close, history and the composer inside it. Expanded fills the viewport with
       a 12px inset in both. */
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
      expect: [{ sel: "#aiWorkspace.open.is-ai-expanded", text: "Data Analysis Assistant" }],
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
            "(() => { const r = document.querySelector('.mh-copilot').getBoundingClientRect(); if (Math.abs(r.left) > 2 || Math.abs(r.width - 390) > 2) throw new Error('drawer ' + JSON.stringify(r)); const inside = (sel) => { const b = document.querySelector(sel).getBoundingClientRect(); if (b.left < -1 || b.right > 391) throw new Error(sel + ' off screen ' + JSON.stringify(b)); }; inside('.mh-copilot__close'); inside('.mh-copilot textarea'); inside('.mh-copilot__command-box'); })()",
        },
        { click: "button[aria-label='History']" },
        { wait: ".mh-copilot__history" },
        {
          eval:
            "(() => { const b = document.querySelector('.mh-copilot__history').getBoundingClientRect(); if (b.left < -1 || b.right > 391) throw new Error('history popup off screen ' + JSON.stringify(b)); })()",
        },
        { click: ".mh-copilot__history-head button" },
        { click: "button[aria-label='Maximize']" },
        { waitMs: 600 },
        {
          eval:
            "(() => { const r = document.querySelector('.mh-copilot').getBoundingClientRect(); if (Math.abs(r.left - 12) > 2 || Math.abs(r.top - 12) > 2 || Math.abs(r.width - 366) > 2 || Math.abs(r.height - 820) > 2) throw new Error('expanded ' + JSON.stringify(r)); })()",
        },
      ],
      expect: [{ sel: ".mh-copilot.is-open.mh-copilot--expanded", text: "Data Analysis Assistant" }],
    },
  },
  {
    /* 390px: the skill menu and the New Analytical Model dialog stay inside the screen. The original's
       Copilot is a 156px strip there (see p02-copilot-mobile), so only the story is driven. */
    id: "p02-copilot-skill-flow-mobile",
    viewport: { width: 390, height: 844 },
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [{ click: "#aiEntry" }, { wait: "#aiWorkspace.open" }],
      expect: [{ sel: "#aiWorkspace.open", text: "Data Analysis Assistant" }],
    },
    story: {
      id: "pages--marketing-cockpit-copilot-skills",
      actions: [
        {
          eval:
            "(() => { for (const el of document.querySelectorAll('.mh-skill, .mh-skill__detail, .mh-skill__action')) { const b = el.getBoundingClientRect(); if (b.left < -1 || b.right > 391) throw new Error(el.className + ' off screen ' + JSON.stringify(b)); } if (document.documentElement.scrollWidth > 390) throw new Error('page scrolls sideways'); })()",
        },
        { click: ".mh-skill__action >> nth=0" },
        { wait: ".mh-flow__card--history" },
        { click: ".mh-flow__foot .mh-flow__btn--primary" },
        { wait: ".mh-flow__card--form" },
        {
          eval:
            "(() => { for (const el of document.querySelectorAll('.mh-flow__card--form, .mh-flow__head button, .mh-flow__foot button')) { const b = el.getBoundingClientRect(); if (b.left < -1 || b.right > 391) throw new Error(el.className + ' off screen ' + JSON.stringify(b)); } if (document.documentElement.scrollWidth > 390) throw new Error('page scrolls sideways'); })()",
        },
      ],
      expect: [{ sel: ".mh-flow__card--form", text: "New Analytical Model" }],
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
    id: "p02-copilot-skill-empty",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" }, { wait: "#aiWorkspace.open" }, { click: "#aiCmdUpload" },
        { click: "[data-report-skill-category='Analytical Model']" },
        { fill: [".ai-skill-detail-panel input[type='search']", "no matching model"] },
      ],
      expect: [{ sel: ".ai-skill-empty", text: "No matching skills" }],
    },
    story: { id: "pages--marketing-cockpit-copilot-skills-empty", expect: [{ sel: ".mh-skill__empty", text: "No matching skills" }] },
  },
  {
    id: "p02-copilot-flow-empty",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" }, { wait: "#aiWorkspace.open" }, { click: "#aiCmdUpload" },
        { click: "[data-report-skill-category='Analytical Model']" },
        { click: "[data-report-skill-action='history']" },
        { wait: "#aiReportHistoryGenerateDialog" },
        { eval: "(() => { document.querySelectorAll('#aiReportHistoryGenerateDialog [data-report-history-msg]:checked').forEach(input => input.click()); })()" },
        { click: "[data-report-generate-model]" },
      ],
      expect: [{ sel: "[data-report-generate-error]:not([hidden])", text: "Select at least one message to continue." }],
    },
    story: { id: "pages--marketing-cockpit-copilot-model-empty", expect: [{ sel: ".mh-flow__error:not([hidden])", text: "Select at least one message to continue." }] },
  },
  {
    id: "p02-copilot-flow-manual-required",
    original: {
      url: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
      actions: [
        { click: "#aiEntry" }, { wait: "#aiWorkspace.open" }, { click: "#aiCmdUpload" },
        { click: "[data-report-skill-category='Analytical Model']" },
        { click: "[data-report-skill-action='manual']" },
        { wait: "#aiReportGeneratedModelDialog" },
        { click: "#aiReportGeneratedModelDialog [data-report-submit-model]" },
      ],
      expect: [{ sel: "#aiReportGeneratedModelDialog .field-error", count: 3, text: "Name is required." }],
    },
    story: { id: "pages--marketing-cockpit-copilot-model-required", expect: [{ sel: ".mh-flow__field-error", count: 3, text: "Name is required." }] },
  }
];
