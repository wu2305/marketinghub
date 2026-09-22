export const NAV = [
  { id: "home", label: "Home", href: "/home" },
  { id: "cockpit", label: "Marketing Cockpit", href: "/cockpit" },
  { id: "self-service", label: "Self-Service Center", href: "/self-service" },
  { id: "interpreter", label: "AI Interpreter", href: "/interpreter" },
  { id: "campaign", label: "RedNote Campaign Tool", href: "/campaign" },
];

export const LOGO = { src: "/assets/images/tapestry-logo.png", alt: "Tapestry", href: "/home" };

export const HOME = {
  hero: {
    image: "/assets/images/hero-bg-coach.jpg",
    title: "Marketing Portal",
    description: "Your daily workspace for campaign planning, activation, optimization and knowledge — all in one place.",
    stats: [
      { label: "Report center", value: "12", caption: "governed reports ready to review" },
      { label: "Knowledge center", value: "27", caption: "assets across 8 knowledge types" },
      { label: "Media data tracking channels", value: "21", caption: "channels connected for tracking" },
      { label: "Active campaigns", value: "24", caption: "live campaigns in market" },
    ],
  },
  heading: {
    eyebrow: "Workspaces",
    title: "Enter the work that matters",
    description: "Start from execution, reports, or the knowledge behind every answer.",
  },
  cards: [
    {
      title: "Marketing Cockpit",
      description: "Centralized view for tracking all marketing initiatives' performance and evolving business trends.",
      image: "/assets/images/workspace-marketing-overview.png",
      links: [
        { id: "dg", label: "DG Data Insight", href: "/cockpit/rednote" },
        { id: "dc", label: "DC Data Insight", href: "/cockpit/abo" },
        { id: "d2c", label: "D2C Insight", href: "/cockpit/customer" },
      ],
    },
    {
      title: "Self-Service Center",
      description: "Explore business performance with flexible views, filters and comparisons, and upload datasets to the data lake.",
      image: "/assets/images/workspace-business-explorer.png",
      links: [],
    },
    {
      title: "AI Interpreter",
      description: "Empower business teams to create, manage and evolve trusted knowledge for consistent AI experiences.",
      image: "/assets/images/workspace-knowledge-center.png",
      links: [{ id: "knowledge", label: "Knowledge Management", href: "/interpreter" }],
    },
    {
      title: "RedNote Campaign Tool",
      description: "Plan, launch and manage every campaign from one connected workspace.",
      image: "/assets/images/workspace-campaign-operations.png",
      links: [],
    },
  ],
};

export const ASSISTANT = {
  title: "Ask AI Interpreter",
  headline: "Ask a question",
  description: "Your AI partner for every marketing task",
  suggestions: [
    "What's the ROI trend across my active campaigns?",
    "Campaigns near budget threshold",
    "Automation task queue overview",
  ],
  homeSuggestions: [
    "Analyze this Excel data and generate a summary",
    "Top insights across all data this week",
    "Weekly activity summary",
  ],
  scopes: ["All", "Campaigns", "Dashboards", "Knowledge"],
  model: "Data Model",
  mode: "Analytical Model",
};

export const COCKPIT = {
  hero: {
    image: "/assets/images/project-city-tabby.png",
    eyebrow: "Performance tracking",
    title: "Marketing Cockpit",
    description: "Stay connected to the business trends, performance and metrics that matter most.",
  },
  groups: [
    {
      id: "consumer",
      title: "D2C Insight",
      projects: [
        {
          id: "city",
          title: "City Strategy",
          kicker: "Consumer / City Strategy",
          description: "Tracks post-campaign business impact for core pilot cities, using sales, CR, traffic, and related metrics across executive, city, and channel analysis.",
          image: "/assets/images/project-city-tabby.png",
          updated: "Data updated: 2026-05-28",
        },
        {
          id: "fourp",
          title: "4P Report",
          kicker: "Consumer / 4P Report",
          description: "Analyzes current business performance across Place, Product, People, and Price to help teams identify regional, product, audience, and pricing opportunities.",
          image: "/assets/images/project-fourp-tabby.png",
          updated: "Data updated: 2026-05-29",
        },
        {
          id: "customer",
          title: "Customer Daily Tracking",
          kicker: "Consumer / Customer Daily Tracking",
          description: "Daily tracking of consumer-related data across traffic, member behavior, conversion intake, and key fluctuations.",
          image: "/assets/images/project-customer-tabby.png",
          updated: "Data updated: Yesterday 24:00",
        },
      ],
    },
    {
      id: "dc",
      title: "DC Media Performance",
      projects: [
        {
          id: "abo",
          title: "ABO",
          kicker: "DC Media Performance / ABO",
          description: "Tracks online e-commerce platform campaigns and performance across Tmall, JD, Douyin, and Rednote, covering traffic, conversion, and business intake.",
          image: "/assets/images/project-abo-tabby.png",
          updated: "Tmall data: 2026-05-28",
        },
      ],
    },
    {
      id: "dg",
      title: "DG Media Tracking",
      projects: [
        {
          id: "rednote",
          title: "Rednote Tracking",
          kicker: "DG Media Tracking / Rednote",
          description: "Analyzes Rednote post-campaign performance across note performance, core TA audiences, brand keywords, interactions, impressions, and clicks.",
          image: "/assets/images/project-rednote-tabby.png",
          updated: "Data updated: 2026-05-29 10:00",
        },
        {
          id: "ottolv",
          title: "OTT/OLV Media Data Tracking",
          kicker: "DG Media Tracking / OTT OLV",
          description: "Tracks OTT/OLV media data returned by Miaozhen tracking, focusing on impressions, clicks, reach, frequency, and related media metrics.",
          image: "/assets/images/project-ottolv-tabby.png",
          updated: "Data updated: 2026-05-28",
        },
      ],
    },
  ],
};

export const SELF_SERVICE = {
  hero: {
    image: "/assets/images/business-explorer-hero.jpg",
    eyebrow: "Flexible analysis",
    title: "Self-Service Center",
    description: "Explore business performance with flexible views, filters and comparisons, and upload datasets to the data lake.",
  },
  tabs: [
    { id: "analysis", label: "Self-Service Analysis" },
    { id: "upload", label: "Data Upload" },
  ],
  filters: {
    analysis: [
      { id: "all", label: "All" },
      { id: "dg", label: "DG" },
      { id: "dc", label: "DC" },
    ],
    upload: [{ id: "all", label: "All" }],
  },
  reports: [
    {
      title: "MZ Tracking Detail",
      category: "dg",
      description: "Miaozhen OTV/OLV media monitoring self-analysis by Campaign, Media & Platform dimensions.",
      actionLabel: "Open data view",
    },
    {
      title: "ABO Tracking Detail",
      category: "dc",
      description: "Self-analysis of ad placement and conversion data: TMALL, JD, Tiktok, Wechat.",
      actionLabel: "Open data view",
    },
    {
      title: "Rednote Tracking Detail",
      category: "dg",
      description: "Self-analysis of Rednote Campaign & note placement and conversion data.",
      actionLabel: "Open data view",
    },
  ],
  uploads: [
    {
      title: "Finance Pilot City",
      description: "Upload finance pilot city data covering budgets, expenses and KPIs across business lines and reporting periods.",
      actionLabel: "Open upload module",
    },
  ],
};

// Totals are typeMeta[].stats.total from assets/js/knowledge/types.js.
function knowledgeCount(total, singular, plural) {
  return `${total} ${total === 1 ? singular : plural}`;
}

export const INTERPRETER = {
  hero: {
    image: "/assets/images/knowledge-hero.jpg",
    eyebrow: "Knowledge management",
    title: "AI Interpreter",
    description: "Explore and govern the trusted knowledge that powers AI interpretation.",
    stats: [
      { label: "Published knowledge", value: "35", caption: "knowledge assets governed for AI use" },
      { label: "New this month", value: "13", caption: "knowledge assets added recently" },
    ],
  },
  heading: {
    eyebrow: "AI Interpreter foundation",
    title: "Knowledge Overview",
    description: "Explore the knowledge available to AI Interpreter.",
  },
  overview: {
    id: "overview",
    label: "Overview",
    active: true,
    icon: "M3 11.5 12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6",
  },
  groups: [
    {
      title: "Knowledge · 8 types",
      items: [
        { id: "principles", label: "Principles", icon: "M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" },
        { id: "context", label: "Report Context", icon: "M4 4h12l4 4v12H4V4zM16 4v4h4" },
        { id: "model", label: "Data Models", icon: "M3 7h18M3 12h18M3 17h18" },
        { id: "metrics", label: "Metric Dictionary", icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
        { id: "terms", label: "Business Terms", badge: "Manage", icon: "M4 4h16v4H4zM4 10h16v4H4zM4 16h10v4H4z" },
        { id: "analytical", label: "Analytical Models", badge: "Manage", icon: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" },
        { id: "scenario", label: "Scenario Reports", badge: "Manage", icon: "M5 3h10l4 4v14H5zM15 3v5h5M8 12h8M8 16h8" },
        { id: "email", label: "Email Reports", icon: "M3 5h18v14H3zM3 6l9 7 9-7" },
      ],
    },
  ],
  types: [
    { id: "principles", title: "Principles", total: 10, count: knowledgeCount(10, "principle", "principles"), summary: "AI response rules and governing principles.", action: "View principles" },
    { id: "context", title: "Report Context", total: 6, count: knowledgeCount(6, "context", "contexts"), summary: "Report interpretation and business context.", action: "View contexts" },
    { id: "model", title: "Data Models", total: 3, count: knowledgeCount(3, "model", "models"), summary: "Entities, attributes, and relationships.", action: "View models" },
    { id: "metrics", title: "Metric Dictionary", total: 3, count: knowledgeCount(3, "metric", "metrics"), summary: "Governed metric definitions and calculations.", action: "View metrics" },
    { id: "terms", title: "Business Terms", total: 6, count: knowledgeCount(6, "term", "terms"), summary: "Definitions and synonyms for business term.", action: "Manage terms" },
    { id: "analytical", title: "Analytical Models", total: 1, count: knowledgeCount(1, "model", "models"), summary: "Reusable analysis frameworks and methods.", action: "Manage models" },
    { id: "scenario", title: "Scenario Reports", total: 3, count: knowledgeCount(3, "scenario", "scenarios"), summary: "Governed reporting scenarios and templates.", action: "Manage scenarios" },
    { id: "email", title: "Email Reports", total: 3, count: knowledgeCount(3, "report", "reports"), summary: "Scheduled insights and distributions.", action: "View reports" },
  ],
  assets: [
    { id: "investment-principles", title: "Campaign investment decision principles", summary: "Shared guardrails for evaluating investment pressure and conversion efficiency.", type: "Principles", owner: "Sarah Chen", status: "Published" },
    { id: "analysis-guardrails", title: "Trusted analysis guardrails", summary: "Minimum checks for freshness, metric consistency, and comparison windows.", type: "Principles", owner: "Michael Liu", status: "Published" },
    { id: "city-report-context", title: "City Strategy report context", summary: "Purpose, audience, and guardrails for the Invest City Strategy report.", type: "Report Context", owner: "Emily Wang", status: "Published" },
    { id: "business-term-gmv", title: "GMV (Gross Merchandise Value)", summary: "Total value of merchandise sold through the platform before deductions.", type: "Business Term", owner: "Current User", status: "Draft" },
    { id: "playbook-opportunity-scan", title: "Opportunity scan playbook", summary: "A reusable scan for weekly commercial opportunity review.", type: "Analytical Model", owner: "Marketing Analytics", status: "Under Review" },
    { id: "scenario-channel-performance", title: "Channel Performance Analysis", summary: "A reusable report approach for channel efficiency and recommended actions.", type: "Scenario Reporting", owner: "Marketing Analytics", status: "Published" },
  ],
};

export const CAMPAIGN = {
  rail: {
    eyebrow: "Campaign execution",
    title: "Trading Desk",
    description: "Media operations, automation, and optimization in one workspace.",
    items: [
      { id: "overview", index: "01", label: "Overview", caption: "Live campaign pulse" },
      { id: "execution", index: "02", label: "Execution", caption: "Launch and optimize" },
      { id: "assets", index: "03", label: "Assets", caption: "Creative library" },
      { id: "analytics", index: "04", label: "Analytics", caption: "Efficiency signals" },
      { id: "accounts", index: "05", label: "Accounts", caption: "Media binding" },
    ],
  },
  channels: [
    { id: "rednote", label: "Rednote" },
    { id: "douyin", label: "Douyin", disabled: true },
  ],
  metrics: [
    { label: "Automated actions", value: "83", caption: "Current workspace", accent: "gold" },
    { label: "Active accounts", value: "5", caption: "Authorized", accent: "green" },
    { label: "Plans", value: "341", caption: "Generated", accent: "amber" },
    { label: "Units", value: "343", caption: "In operation", accent: "blue" },
    { label: "Creatives", value: "7,017", caption: "In library", accent: "red" },
  ],
  distribution: [
    { label: "Feed promotion", value: "282", percent: 86 },
    { label: "Search promotion", value: "43", percent: 24 },
    { label: "Video feed promotion", value: "0", percent: 0 },
    { label: "Full-site promotion", value: "16", percent: 10 },
  ],
  objectives: [
    { label: "Product seeding", value: "329", height: 88 },
    { label: "Direct seeding", value: "9", height: 11 },
    { label: "Lead capture", value: "3", height: 7 },
  ],
  accountColumns: [
    { key: "name", header: "Account Name" },
    { key: "feed", header: "Feed" },
    { key: "search", header: "Search" },
    { key: "video", header: "Video Feed" },
    { key: "full", header: "Full-site" },
    { key: "total", header: "Total Plans" },
  ],
  accountRows: [
    { id: "1", name: "Coach_XHS_01", feed: "82", search: "13", video: "0", full: "4", total: "99" },
    { id: "2", name: "Coach_XHS_02", feed: "61", search: "9", video: "0", full: "3", total: "73" },
    { id: "3", name: "Coach_XHS_03", feed: "54", search: "8", video: "0", full: "2", total: "64" },
  ],
  headings: {
    overview: {
      eyebrow: "Campaign workspace / Overview",
      title: "Overview Dashboard",
      description: "Monitor automated media operations across accounts, plans, units, and creative assets.",
    },
    execution: {
      eyebrow: "Campaign workspace / Execution",
      title: "RedNote Campaign Tool",
      description: "Centralize media account operations, bulk plan creation, budget pacing, and campaign action publishing to reduce platform switching.",
      action: "Create Campaign Task",
    },
    assets: {
      eyebrow: "Campaign workspace / Assets",
      title: "Creative Assets",
      description: "Manage creative review status, channel readiness, and creative performance so operators can quickly identify reusable or replaceable assets.",
      badge: "7,017 creatives",
    },
    analytics: {
      eyebrow: "Campaign workspace / Analytics",
      title: "Analytics Center",
      description: "Analyze execution efficiency, account performance, plan quality, and creative performance to support the next automation cycle.",
      status: "Insights ready",
    },
    accounts: {
      eyebrow: "Campaign workspace / Account binding",
      title: "Account Binding",
      description: "Manage media account authorization, token status, and publishing permissions with traceable account boundaries.",
      action: "Bind New Account",
    },
  },
  panels: {
    distribution: { eyebrow: "Distribution", title: "Promotion Type Distribution", meta: "Plans" },
    objectives: { eyebrow: "Objective mix", title: "Marketing Objective Distribution", meta: "Plans" },
    accountOperations: { eyebrow: "Account operations", title: "Account Operation Details" },
    queue: { eyebrow: "Automation", title: "Automation Task Queue", meta: "3 active tasks" },
    log: { eyebrow: "Action history", title: "Campaign Action Log", meta: "Recent actions" },
    creatives: { eyebrow: "Creative library", title: "Creative Status Dashboard", meta: "Channel readiness" },
    efficiency: { eyebrow: "Human efficiency", title: "Efficiency Lift", meta: "Current cycle" },
    recommendations: { eyebrow: "Next best actions", title: "Optimization Recommendations", meta: "2 recommendations" },
    accounts: { eyebrow: "OAuth / API", title: "Media Account Status", meta: "Authorization health" },
  },
  executionSummary: [
    { label: "Awaiting confirmation", value: "341", caption: "generated plans" },
    { label: "Budget watch", value: "2", caption: "cities near threshold" },
    { label: "Under review", value: "3", caption: "anomalous plans" },
  ],
  taskQueue: [
    { status: "Pending", title: "Rednote bulk plan creation", detail: "341 plans generated and awaiting final publishing confirmation" },
    { status: "Watch", title: "Budget pacing calibration", detail: "Shanghai and Beijing budgets are near the upper threshold; reduce by 8%" },
    { status: "Review", title: "Anomalous plan pause", detail: "3 plans have no conversions for two days and are under review" },
  ],
  actionLog: {
    columns: [
      { key: "action", header: "Action" },
      { key: "platform", header: "Platform" },
      { key: "object", header: "Object" },
      { key: "status", header: "Status" },
    ],
    rows: [
      { id: "a", action: "Bulk create plans", platform: "Rednote", object: "Coach_XHS_01", status: "Pending", statusLabel: "Pending confirmation" },
      { id: "b", action: "Adjust daily budget", platform: "Rednote", object: "23 units", status: "Success", statusLabel: "Success" },
      { id: "c", action: "Sync plan status", platform: "Douyin", object: "12 plans", status: "Syncing", statusLabel: "Syncing" },
    ],
  },
  creativeColumns: [
    { key: "group", header: "Creative Group" },
    { key: "channel", header: "Channel" },
    { key: "ready", header: "Ready" },
    { key: "review", header: "In Review" },
    { key: "replace", header: "Replace" },
  ],
  creatives: [
    { id: "1", group: "Tabby 26SS seeding assets", subtitle: "Product seeding", channel: "Rednote", ready: "128", review: "14", replace: "6" },
    { id: "2", group: "City limited campaign", subtitle: "City activation", channel: "Douyin", ready: "72", review: "8", replace: "3" },
    { id: "3", group: "Member conversion assets", subtitle: "Conversion", channel: "Rednote", ready: "43", review: "2", replace: "1" },
  ],
  efficiency: [
    { label: "Time saved", value: "42h" },
    { label: "Automated actions", value: "83" },
    { label: "Anomaly blocks", value: "9" },
  ],
  recommendations: [
    { index: "01", title: "Budget reallocation", detail: "Move Chengdu search budget to Shanghai feed promotion" },
    { index: "02", title: "Creative replacement", detail: "Replace 3 low-engagement creatives with high-save-rate versions" },
  ],
  bindingColumns: [
    { key: "account", header: "Account" },
    { key: "platform", header: "Platform" },
    { key: "auth", header: "Auth Status" },
    { key: "sync", header: "Last Sync" },
    { key: "permission", header: "Action Permission" },
  ],
  accounts: [
    { id: "1", account: "Coach_XHS_01", platform: "Rednote", authStatus: "Success", authLabel: "Token valid", sync: "2026-05-29 10:00", permission: "Allowed" },
    { id: "2", account: "Coach_XHS_02", platform: "Rednote", authStatus: "Success", authLabel: "Token valid", sync: "2026-05-29 10:00", permission: "Allowed" },
    { id: "3", account: "Coach_DY_01", platform: "Douyin", authStatus: "Pending", authLabel: "Renewal required", sync: "2026-05-28 18:20", permission: "Paused", permissionStatus: "Paused" },
  ],
};
