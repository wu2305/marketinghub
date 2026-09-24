/**
 * TEST FIXTURE, not demo data.
 * Alternative report/knowledge/copilot/city-invest data used by
 * ../cockpit-demo.test.jsx to prove the page + demo-state layer render only
 * what props supply. Every value is deliberately different from the real
 * fixtures — nothing here may copy demo text, city names or labels.
 */

import { assetUrl } from "../../asset-url.js";
export const ALT_GROUPS = [
  { id: "all", label: "All reports" },
  { id: "alpha", label: "Alt Alpha Group", description: "First alt group." },
  { id: "beta", label: "Alt Beta Group", description: "Second alt group." },
];

export const ALT_PROJECTS = {
  alpha: {
    title: "Alpha Portfolio",
    kicker: "Alt / Alpha",
    group: "alpha",
    category: "Alt Insight",
    description: "Alt alpha project description.",
    health: "Healthy",
    healthClass: "health-good",
    status: "Ready",
    freshness: "Alt freshness note",
    sourceStrip: ["Data updated: 2030-01-01"],
    image: assetUrl("assets/images/project-city-tabby.png"),
    owner: "Alt Owner",
    accent: "#446688",
    reports: [
      {
        title: "Alt Metro Uplift Study",
        type: "Alt impact analysis",
        embed: "city-invest",
        description: "Alt report zero description.",
        owner: "Alt Owner",
        cadence: "Monthly",
        updated: "2030-01-01",
        knowledgeIds: ["alt-context-metro", "alt-model-lift"],
        assistant: {
          panelTitle: "Alt Assistant",
          periodHint: "Alt period hint.",
        },
        recommendations: [
          {
            title: "Alt holistic pick",
            meta: "Alt holistic / current",
            answerTitle: "Alt holistic answer title",
            summary: "Alt holistic summary — should not surface; index 0 is the holistic report.",
            findings: [["Alt A", "Alt finding zero"]],
          },
          {
            title: "Alt driver pick",
            meta: "Alt driver / current",
            answerTitle: "Alt standard answer title",
            summary: "Alt standard answer summary.",
            findings: [
              ["Alt Label 1", "Alt finding one."],
              ["Alt Label 2", "Alt finding two."],
            ],
          },
        ],
      },
      {
        title: "Alt Weekly Digest",
        type: "Alt digest",
        description: "Alt report one description.",
        owner: "Alt Owner",
        cadence: "Weekly",
        updated: "2030-01-01",
        metrics: [
          ["Alt Metric", "1.0", "+1%"],
        ],
        chart: [["A1", 10, 5]],
        knowledgeIds: ["alt-term-glossary"],
        recommendations: [
          {
            title: "Alt digest pick",
            meta: "Alt digest",
            answerTitle: "Alt digest answer",
            summary: "Alt digest summary.",
            findings: [],
          },
        ],
      },
    ],
  },
  beta: {
    title: "Beta Portfolio",
    kicker: "Alt / Beta",
    group: "beta",
    category: "Alt Insight",
    description: "Alt beta project description.",
    health: "Watch",
    healthClass: "health-warn",
    status: "Ready",
    freshness: "Alt beta freshness",
    sourceStrip: ["Data updated: 2030-02-02"],
    image: assetUrl("assets/images/project-city-tabby.png"),
    owner: "Alt Owner",
    accent: "#886644",
    reports: [
      {
        title: "Alt Beta Report",
        type: "Alt report",
        description: "Alt beta report description.",
        owner: "Alt Owner",
        cadence: "Daily",
        updated: "2030-02-02",
        metrics: [["Alt B", "2.0", "-1%"]],
        chart: [["B1", 3, 7]],
        knowledgeIds: ["alt-term-glossary"],
        recommendations: [],
      },
    ],
  },
};

export const ALT_KNOWLEDGE = [
  {
    id: "alt-context-metro",
    title: "Alt Metro Report Context",
    type: "Report Context",
    category: "context",
    summary: "Alt context summary.",
    projects: ["alpha"],
    connections: [{ name: "Alt Metro Uplift Study", kind: "Dashboard" }],
    href: "/alt/context",
  },
  {
    id: "alt-model-lift",
    title: "Alt Lift Model",
    type: "Analytical Model",
    category: "models",
    summary: "Alt model summary.",
    projects: ["alpha"],
    href: "/alt/model",
  },
  {
    id: "alt-term-glossary",
    title: "Alt Glossary Term",
    type: "Business Term",
    category: "terms",
    summary: "Alt glossary entry.",
    href: "/alt/term",
  },
];

const ALT_STORES = {
  Osaka: ["Umeda One", "Namba Two"],
  Lyon: ["Part-Dieu", "Presquile"],
  Porto: ["Boavista", "Ribeira"],
};

export const ALT_CITY_INVEST = {
  copy: {
    title: "Alt Metro Uplift Study (3 Metros)",
    footnote: "*Alt footnote about non-invest metros.",
    basePeriod: "Q1–Q3",
    investStart: "Q4",
    formula: "Alt formula text",
    trendHeading: "Alt Trend Heading",
    labelBasePeriod: "Alt Base",
    labelInvestStart: "Alt Start",
    labelInvestEnd: "Alt End",
    labelChannel: "Alt Channel",
    labelPilot: "Alt Pilot",
    labelCity: "Alt Metro",
    labelStore: "Alt Store",
    uplift: "AltUplift",
    varPct: "AltVar%",
    after: "AltAfter",
    allStores: "All Alt Stores",
    none: "(Alt None)",
    total: "AltTotal",
    cities: "Metros",
    multiSelect: "Alt multi",
    selectAll: "Pick all",
    clear: "Reset",
    nonInvestAvg: "Non-Alt Avg",
    nonInvest: "Non-Alt",
  },
  periods: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"],
  startIndex: 3,
  endIndex: { Q4: 3, Q5: 4, Q6: 5, Q7: 6, Q8: 7 },
  options: {
    end: ["Q8", "Q7", "Q6", "Q5", "Q4"],
    channel: ["All", "Direct", "Partner"],
    pilot: ["Group A", "Group B"],
    cities: ["Osaka", "Lyon", "Porto"],
    cityStores: ALT_STORES,
  },
  kpis: [
    { key: "VIS", name: "Alt Visitors", uplift: 4, var: 9, baseAfter: 5.5, fmt: "K", dec: 1 },
    { key: "ORD", name: "Alt Orders", uplift: -3, var: -7, trend: "FLX", baseAfter: 30, fmt: "num", dec: 1 },
    { key: "RSZ", name: "Alt Basket", uplift: null, var: null, baseAfter: 120, fmt: "int" },
  ],
  kpiRows: [["VIS", "ORD", "RSZ"]],
  charts: ["FLX", "RTN"],
  baseline: {
    FLX: { t: [10, 11, 12, 13, 14, 15, 16, 17], n: [9, 10, 10, 11, 12, 12, 13, 14] },
    RTN: { t: [30, 31, 29, 32, 33, 34, 33, 35], n: [28, 29, 28, 30, 30, 31, 31, 32] },
  },
  defaultFilters: {
    end: "Q8",
    channel: "All",
    pilot: "Group A",
    cities: ["Osaka", "Lyon", "Porto"],
    stores: [...new Set(Object.values(ALT_STORES).flat())],
  },
};

export const ALT_COPILOT = {
  eyebrow: "ALT COPILOT",
  commandHint: "Alt command hint.",
  inputPlaceholder: "Alt composer placeholder...",
  answerLabel: "ALT ANSWER",
  genericSummary: "Alt generic summary: the alt copilot would answer with alt sources.",
  defaultProfile: { panelTitle: "Alt Assistant", periodHint: "Alt period hint." },
  summary: {
    title: "Alt Quick Summary",
    status: "Alt loaded",
    paragraphs: [[{ text: "Alt summary body " }, { text: "+42%", tone: "positive" }, { text: " alt." }]],
  },
  history: [{ title: "Alt recent chat", prompt: "Alt history prompt." }],
  holistic: {
    title: "Alt Holistic Report — Metro Pilot",
    meta: [["Alt date", "2030-01-01"]],
    blocks: [
      { type: "meta" },
      {
        type: "group",
        heading: { index: "I", title: "Alt Executive Summary" },
        sub: "Alt alerts",
        alerts: [{ dot: "g", segments: [{ b: "Alt strongest:" }, " alt +7.7%"] }],
      },
    ],
    chart: {
      periods: ["Q6", "Q7", "Q8"],
      min: -10,
      max: 10,
      ticks: [-10, 0, 10],
      series: [{ name: "Alt Sales", tone: "ink", values: [1, 2, 3] }],
    },
    dotLegend: [{ dot: "g", text: " Alt legend" }],
  },
  pilotSales: {
    lead: ["Alt rich card lead ", { b: "9,999" }, " alt."],
    channelsTitle: "Alt channels",
    channelsSub: "Alt uplift",
    channels: [
      {
        icon: "cart",
        tone: "retail",
        name: "Alt Retail",
        uplift: "+2.2%",
        up: true,
        stats: [{ label: "Alt Stat", value: "+1%", up: true }],
      },
    ],
    insight: "Alt rich insight.",
    exploreTitle: "Alt explore?",
    exploreHint: "Alt options:",
    explore: [{ icon: "chart", title: "Alt explore one", sub: "Alt sub", question: "Alt explore question" }],
  },
  skillFallback: [{ id: "alt-skill", title: "Alt fallback skill", note: "Alt note" }],
  skillMenu: {
    triggerLabel: "Alt skill",
    attachAccept: ".csv",
    categories: [
      { id: "upload", label: "Alt Upload", icon: "upload" },
      { id: "model", label: "Alt Model", icon: "spokes" },
    ],
    searchPlaceholder: "Alt search",
    emptyLabel: "Alt empty",
    historyLabel: "Alt history add",
    manualLabel: "Alt manual create",
  },
  flow: {
    labels: { rulePlaceholder: "Alt rule placeholder." },
    threads: [
      {
        title: "Alt thread",
        messages: [{ role: "user", text: "Alt user message", checked: true }],
      },
    ],
    sections: [
      { title: "Alt Section", fields: [{ key: "name", label: "Alt Name", required: true, placeholder: "Alt name" }] },
    ],
    generatedDefaults: {
      name: "Alt generated model",
      trigger: "Alt trigger",
      domain: "Alt domain",
      metrics: "Alt metrics",
      constraints: "Alt constraints",
    },
  },
};

export const ALT_MODEL_FLOW = {
  threads: [
    {
      title: "Alt flow thread",
      messages: [{ role: "user", text: "Alt flow message", checked: true }],
    },
  ],
  sections: [{ title: "Alt flow section", fields: [] }],
  generatedDefaults: { name: "Alt model flow default" },
};

/** Compact assistant answer stand-in (the real one is content.js buildReportAssistantAnswer). */
export function altReportAnswer(query) {
  return {
    query,
    lead: "Alt compact answer lead.",
    recommendation: "Alt recommendation for: " + query,
    sources: ["Alt source"],
  };
}
