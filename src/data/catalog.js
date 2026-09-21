export const navItems = [
  { id: "home", label: "Home", href: "/original/index.html" },
  { id: "cockpit", label: "Marketing Cockpit", href: "/original/assets/pages/reports.html" },
  { id: "self", label: "Self-Service Center", href: "/original/assets/pages/flexible.html" },
  { id: "knowledge", label: "AI Interpreter", href: "/original/assets/pages/knowledge.html" },
  { id: "campaign", label: "RedNote Campaign Tool", href: "/original/assets/pages/campaign.html" },
];

export const knowledgeTypes = [
  {
    key: "Principles",
    label: "Principles",
    color: "#d09a00",
    description: "AI response rules and governing principles.",
    icon: "M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z",
    stats: { unit: "principles", total: 10, monthly: 2 },
  },
  {
    key: "Report Context",
    label: "Report Context",
    color: "#d7662c",
    description: "Report interpretation and business context.",
    icon: "M4 4h12l4 4v12H4V4zM16 4v4h4",
    stats: { unit: "contexts", total: 6, monthly: 2 },
  },
  {
    key: "Data Model",
    label: "Data Models",
    color: "#28785f",
    description: "Entities, attributes, and relationships.",
    icon: "M3 7h18M3 12h18M3 17h18",
    stats: { unit: "models", total: 3, monthly: 1 },
  },
  {
    key: "Metric Dictionary",
    label: "Metric Dictionary",
    color: "#8961bd",
    description: "Governed metric definitions and calculations.",
    icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    stats: { unit: "metrics", total: 3, monthly: 1 },
  },
  {
    key: "Business Term",
    label: "Business Terms",
    color: "#bd426c",
    description: "Definitions and synonyms for business term.",
    icon: "M4 4h16v4H4zM4 10h16v4H4zM4 16h10v4H4z",
    stats: { unit: "terms", total: 6, monthly: 3 },
  },
  {
    key: "Analytical Model",
    label: "Analytical Models",
    color: "#337ea9",
    description: "Reusable analysis frameworks and methods.",
    icon: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4",
    stats: { unit: "models", total: 1, monthly: 1 },
  },
  {
    key: "Scenario Reporting",
    label: "Scenario Reports",
    color: "#64708d",
    description: "Governed reporting scenarios and templates.",
    icon: "M5 3h10l4 4v14H5zM15 3v5h5M8 12h8M8 16h8",
    stats: { unit: "scenarios", total: 3, monthly: 2 },
  },
  {
    key: "Email Reports",
    label: "Email Reports",
    color: "#4f7893",
    description: "Scheduled insights and distributions.",
    icon: "M3 5h18v14H3zM3 6l9 7 9-7",
    stats: { unit: "reports", total: 3, monthly: 1 },
  },
];

export const manageableTypes = ["Business Term", "Analytical Model", "Scenario Reporting"];

export const managementRules = [
  "Only knowledge created by you can be managed.",
  "Disable knowledge before editing or deleting it.",
  "Deletion is permanent and cannot be undone.",
  "Disabled knowledge is unavailable for AI use and can be enabled again.",
];

export const dataModelOptions = [
  "Marketing",
  "Customer",
  "Retail Operations",
  "Data Governance",
  "City Strategy",
  "Commerce",
  "Revenue Dashboard",
  "Sales Performance",
  "Sales Performance Report",
  "Customer 360",
  "Conversion Overview",
  "Member Performance",
  "4P Report",
  "Customer Daily Tracking",
  "ABO",
  "Rednote Tracking",
  "OTT/OLV Media Data Tracking",
  "Global",
  "All reports",
];

export const metricOptions = ["Member conversion", "Campaign ROI", "Promotion lift"];

export const domainSuggestions = ["Marketing", "Customer", "Retail Operations", "Data Governance"];

export const guidancePrompt = [
  "Describe the analysis logic and reasoning path. Focus on how to analyze the question and what final result should be returned. Do not ask AI to create charts or extra report sections.",
  "",
  "For example:",
  "1. Confirm the user's business question, analysis period, target scope and comparison baseline.",
  "2. Check whether the selected metrics changed materially, and identify the main direction of the change.",
  "3. Compare related dimensions or segments to locate the most likely driver of the change.",
  "4. Judge whether the evidence supports a clear cause. If not, explain the limitation.",
  "5. Return one concise analysis result with the key finding, reason and recommended next action.",
].join("\n");

export const assets = [
  {
    id: "investment-principles",
    type: "Principles",
    mark: "PR",
    title: "Campaign investment decision principles",
    summary: "Shared guardrails for evaluating investment pressure, conversion efficiency, and confidence.",
    owner: "Sarah Chen",
    scope: "Global",
    status: "Published",
    usage: "1,482",
    created: "Jul 18, 2026",
  },
  {
    id: "analysis-guardrails",
    type: "Principles",
    mark: "PR",
    title: "Trusted analysis guardrails",
    summary: "Minimum checks for freshness, metric consistency, comparison windows, and business context.",
    owner: "Michael Liu",
    scope: "Global",
    status: "Published",
    usage: "1,106",
    created: "Jul 19, 2026",
  },
  {
    id: "city-report-context",
    type: "Report Context",
    mark: "RC",
    title: "City Strategy report context",
    summary: "Purpose, audience, comparison logic, and guardrails for the Invest City Strategy report.",
    owner: "Emily Wang",
    scope: "City Strategy",
    status: "Published",
    usage: "2,156",
    created: "Jul 17, 2026",
  },
  {
    id: "channel-data-model",
    type: "Data Model",
    mark: "DM",
    title: "Channel data model",
    summary: "Governed grain, lineage, and quality context for the Channel dimension and related fact tables.",
    owner: "Kevin Zhao",
    scope: "1 Model",
    status: "Published",
    usage: "890",
    created: "Jul 6, 2026",
  },
  {
    id: "metric-dictionary-campaign-roi",
    type: "Metric Dictionary",
    mark: "MD",
    title: "Campaign ROI",
    summary: "Attributed campaign revenue divided by governed media spend.",
    owner: "Tom Anderson",
    scope: "3 Reports",
    status: "Published",
    usage: "1,567",
    created: "Jul 18, 2026",
  },
  {
    id: "business-term-gmv",
    type: "Business Term",
    mark: "BT",
    title: "GMV (Gross Merchandise Value)",
    summary: "Total value of merchandise sold through the platform before deductions.",
    owner: "Chris Martinez",
    scope: "Global",
    status: "Published",
    usage: "432",
    created: "Jul 13, 2026",
    kind: "Business Term",
    description: "Total value of merchandise sold through the platform before deductions, used as a primary revenue indicator.",
    synonyms: "Gross merchandise volume",
  },
  {
    id: "playbook-opportunity-scan",
    type: "Analytical Model",
    mark: "AM",
    title: "Opportunity scan playbook",
    summary: "Repeatable routine for identifying and prioritizing growth opportunities.",
    owner: "Current User",
    scope: "Shared",
    status: "Draft",
    usage: "678",
    created: "Jul 6, 2026",
  },
  {
    id: "scenario-channel-performance",
    type: "Scenario Reporting",
    mark: "SR",
    title: "Channel Performance Analysis",
    summary: "A reusable report approach for channel efficiency, drivers and recommended actions.",
    owner: "Marketing Analytics",
    scope: "Channel Performance",
    status: "Published",
    usage: "86",
    created: "Aug 26, 2026",
  },
  {
    id: "scenario-campaign-review",
    type: "Scenario Reporting",
    mark: "SR",
    title: "Campaign Review Reporting",
    summary: "A structured campaign review covering delivery, engagement, conversion and return.",
    owner: "Campaign Operations",
    scope: "Campaign Review",
    status: "Under Review",
    usage: "34",
    created: "Aug 29, 2026",
  },
  {
    id: "email-report-weekly-performance",
    type: "Email Reports",
    mark: "ER",
    title: "Weekly Marketing Performance",
    summary: "Weekly executive summary of channel delivery, conversion and ROI.",
    owner: "Emily Wang",
    scope: "Marketing Executive Dashboard",
    status: "Published",
    usage: "28",
    created: "Aug 10, 2026",
  },
];

export const referencePages = [
  { id: "home", label: "Home", src: "/original/index.html" },
  { id: "cockpit", label: "Marketing Cockpit", src: "/original/assets/pages/reports.html" },
  { id: "self", label: "Self-Service Center", src: "/original/assets/pages/flexible.html" },
  { id: "knowledge", label: "AI Interpreter", src: "/original/assets/pages/knowledge.html" },
  { id: "campaign", label: "RedNote Campaign Tool", src: "/original/assets/pages/campaign.html" },
  {
    id: "business-term",
    label: "Business Term form",
    src: "/original/assets/pages/knowledge-create.html?type=Business%20Term",
  },
  {
    id: "analysis",
    label: "Analytical Model form",
    src: "/original/assets/pages/knowledge-create.html?type=Analytical%20Model",
  },
];

export function heroTotals(typeKey) {
  const meta = knowledgeTypes.find((item) => item.key === typeKey);
  if (meta) return meta.stats;
  return knowledgeTypes.reduce(
    (sum, item) => ({
      unit: "knowledge assets",
      total: sum.total + item.stats.total,
      monthly: sum.monthly + item.stats.monthly,
    }),
    { unit: "knowledge assets", total: 0, monthly: 0 },
  );
}

export function captionUnit(unit, value) {
  return value === 1 && unit.endsWith("s") ? unit.slice(0, -1) : unit;
}
