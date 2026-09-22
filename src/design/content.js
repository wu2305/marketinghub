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
  overview: { id: "overview", label: "Overview", active: true },
  groups: [
    {
      title: "Knowledge · 8 types",
      items: [
        { id: "principles", label: "Principles" },
        { id: "context", label: "Report Context" },
        { id: "model", label: "Data Models" },
        { id: "metrics", label: "Metric Dictionary" },
        { id: "terms", label: "Business Terms", badge: "Manage" },
        { id: "analytical", label: "Analytical Models", badge: "Manage" },
        { id: "scenario", label: "Scenario Reports", badge: "Manage" },
        { id: "email", label: "Email Reports" },
      ],
    },
  ],
  types: [
    { id: "principles", title: "Principles", count: "10 principles", summary: "AI response rules and governing principles.", action: "View principles" },
    { id: "context", title: "Report Context", count: "6 contexts", summary: "Report interpretation and business context.", action: "View contexts" },
    { id: "model", title: "Data Models", count: "3 models", summary: "Entities, attributes, and relationships.", action: "View models" },
    { id: "metrics", title: "Metric Dictionary", count: "3 metrics", summary: "Governed metric definitions and calculations.", action: "View metrics" },
    { id: "terms", title: "Business Terms", count: "6 terms", summary: "Definitions and synonyms for business term.", action: "View terms" },
    { id: "analytical", title: "Analytical Models", count: "1 model", summary: "Reusable analysis frameworks and methods.", action: "View models" },
    { id: "scenario", title: "Scenario Reports", count: "3 scenarios", summary: "Governed reporting scenarios and templates.", action: "View scenarios" },
    { id: "email", title: "Email Reports", count: "3 reports", summary: "Scheduled insights and distributions.", action: "View reports" },
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
  accounts: [
    { id: "1", name: "Coach_XHS_01", feed: "82", search: "13", video: "0", full: "4", total: "99" },
    { id: "2", name: "Coach_XHS_02", feed: "61", search: "9", video: "0", full: "3", total: "73" },
    { id: "3", name: "Coach_XHS_03", feed: "54", search: "8", video: "0", full: "2", total: "64" },
  ],
};
