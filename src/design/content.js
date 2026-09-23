export const NAV = [
  { id: "home", label: "Home", href: "/index.html" },
  { id: "cockpit", label: "Marketing Cockpit", href: "/assets/pages/reports.html" },
  { id: "self-service", label: "Self-Service Center", href: "/assets/pages/flexible.html" },
  { id: "interpreter", label: "AI Interpreter", href: "/assets/pages/knowledge.html" },
  { id: "campaign", label: "RedNote Campaign Tool", href: "/assets/pages/campaign.html" },
];

export const LOGO = { src: "/assets/images/tapestry-logo.png", alt: "Tapestry", href: "/index.html" };

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
      href: "/assets/pages/reports.html",
      description: "Centralized view for tracking all marketing initiatives' performance and evolving business trends.",
      image: "/assets/images/workspace-marketing-overview.png",
      links: [
        { id: "dg", label: "DG Data Insight", href: "/assets/pages/reports.html?project=rednote" },
        { id: "dc", label: "DC Data Insight", href: "/assets/pages/reports.html?project=abo" },
        { id: "d2c", label: "D2C Insight", href: "/assets/pages/reports.html?project=customer" },
      ],
    },
    {
      title: "Self-Service Center",
      href: "/assets/pages/flexible.html",
      description: "Explore business performance with flexible views, filters and comparisons, and upload datasets to the data lake.",
      image: "/assets/images/workspace-business-explorer.png",
      links: [],
    },
    {
      title: "AI Interpreter",
      href: "/assets/pages/knowledge.html",
      description: "Empower business teams to create, manage and evolve trusted knowledge for consistent AI experiences.",
      image: "/assets/images/workspace-knowledge-center.png",
      links: [{ id: "knowledge", label: "Knowledge Management", href: "/assets/pages/knowledge.html" }],
    },
    {
      title: "RedNote Campaign Tool",
      href: "/assets/pages/campaign.html",
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

// Knowledge type ids are the typeMeta[].key values from assets/js/knowledge/types.js —
// the same identifiers the original demo uses in ?type= URLs and asset.type fields.
// stats mirror typeMeta[].stats (the agreed counting source, see AGENTS.md 3.3).
// statusFilters mirror each type's own library view:
//   types.js (generic list + Principles), business-term-library.js, scenario-reports.js,
//   field-library.js (Report Context / Metric Dictionary / Analytical Model / Email Reports).
const availabilityFilter = (label = "Status") => ({
  id: "availability",
  label,
  allLabel: "All statuses",
  options: [
    { id: "enabled", label: "Enabled" },
    { id: "disabled", label: "Disabled" },
  ],
});

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
    icon: "M3 11.5 12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6",
  },
  sidebarTitle: "Knowledge · 8 types",
  types: [
    {
      id: "Principles",
      title: "Principles",
      icon: "M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z",
      summary: "AI response rules and governing principles.",
      action: "View principles",
      manageable: false,
      stats: { units: ["principle", "principles"], total: 10, monthly: 2 },
      statusFilters: [],
    },
    {
      id: "Report Context",
      title: "Report Context",
      icon: "M4 4h12l4 4v12H4V4zM16 4v4h4",
      summary: "Report interpretation and business context.",
      action: "View contexts",
      manageable: false,
      stats: { units: ["context", "contexts"], total: 6, monthly: 2 },
      statusFilters: [
        {
          id: "projects",
          label: "Project",
          allLabel: "All projects",
          options: [
            { id: "D2C Insights", label: "D2C Insights" },
            { id: "DC Media Performance", label: "DC Media Performance" },
            { id: "DG Media Tracking", label: "DG Media Tracking" },
          ],
        },
        availabilityFilter("AI Interpreter Status"),
      ],
    },
    {
      id: "Data Model",
      title: "Data Models",
      icon: "M3 7h18M3 12h18M3 17h18",
      summary: "Entities, attributes, and relationships.",
      action: "View models",
      manageable: false,
      stats: { units: ["model", "models"], total: 3, monthly: 1 },
      statusFilters: [],
    },
    {
      id: "Metric Dictionary",
      title: "Metric Dictionary",
      icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
      summary: "Governed metric definitions and calculations.",
      action: "View metrics",
      manageable: false,
      stats: { units: ["metric", "metrics"], total: 3, monthly: 1 },
      statusFilters: [
        { id: "domains", label: "Data Model", allLabel: "All models" },
        {
          id: "metricType",
          label: "Type",
          allLabel: "All types",
          options: [
            { id: "Base", label: "Base" },
            { id: "Calculated", label: "Calculated" },
          ],
        },
      ],
    },
    {
      id: "Business Term",
      title: "Business Terms",
      icon: "M4 4h16v4H4zM4 10h16v4H4zM4 16h10v4H4z",
      summary: "Definitions and synonyms for business term.",
      action: "Manage terms",
      manageable: true,
      createLabel: "Add Business Term",
      stats: { units: ["term", "terms"], total: 6, monthly: 3 },
      statusFilters: [
        {
          id: "availability",
          label: "Status",
          allLabel: "All statuses",
          options: [
            { id: "enabled", label: "Enabled" },
            { id: "disabled", label: "Disabled" },
            { id: "draft", label: "Draft", field: "stage" },
          ],
        },
        { id: "owner", label: "Creator", allLabel: "All creators" },
      ],
    },
    {
      id: "Analytical Model",
      title: "Analytical Models",
      icon: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4",
      summary: "Reusable analysis frameworks and methods.",
      action: "Manage models",
      manageable: true,
      createLabel: "Add Analytical Model",
      stats: { units: ["model", "models"], total: 1, monthly: 1 },
      statusFilters: [
        availabilityFilter(),
        { id: "domains", label: "Data Model", allLabel: "All models" },
        { id: "owner", label: "Creator", allLabel: "All creators" },
      ],
    },
    {
      id: "Scenario Reporting",
      title: "Scenario Reports",
      icon: "M5 3h10l4 4v14H5zM15 3v5h5M8 12h8M8 16h8",
      summary: "Governed reporting scenarios and templates.",
      action: "Manage scenarios",
      manageable: true,
      createLabel: "Add Scenario Reporting",
      stats: { units: ["scenario", "scenarios"], total: 3, monthly: 2 },
      statusFilters: [
        availabilityFilter(),
        {
          id: "stage",
          label: "Process",
          allLabel: "All statuses",
          options: [
            { id: "draft", label: "Draft" },
            { id: "queued", label: "Queued" },
            { id: "building", label: "Building" },
            { id: "published", label: "Published" },
          ],
        },
      ],
    },
    {
      id: "Email Reports",
      title: "Email Reports",
      icon: "M3 5h18v14H3zM3 6l9 7 9-7",
      summary: "Scheduled insights and distributions.",
      action: "View reports",
      manageable: false,
      stats: { units: ["report", "reports"], total: 3, monthly: 1 },
      statusFilters: [availabilityFilter()],
    },
  ],
  // Sampled records only — overview totals live on types[].stats, so rows below
  // intentionally cover fewer entries than stats.total. Sources:
  //   Principles       types.js globalPrinciples
  //   Report Context   knowledge.js marketingKnowledgeAssets
  //   Data Model       data-model-browser.js / knowledge.html dataModelSources
  //   Metric Dictionary knowledge.js metric assets (field-library.js view)
  //   Business Term    business-term-library.js seed terms/synonyms
  //   Analytical Model field-library.js normalized playbook
  //   Scenario Reporting scenario-reports.js base scenarios
  //   Email Reports    email-library.js demoAssets
  // Sampled records only — overview totals live on types[].stats, so rows below
  // intentionally cover fewer entries than stats.total. Field names mirror the
  // source payloads; `stage` is the workflow/process dimension and
  // `availability` the AI Interpreter enablement — never collapse the two.
  //   stage: generic map co-build->draft / solidify->under-review / calibrate->published;
  //          Scenario keeps its own vocabulary (draft/queued/building/published).
  // Sources:
  //   Principles        knowledge.js assets (globalPrinciples powers the dedicated card view — Phase C)
  //   Report Context    knowledge.js assets; projects = project labels from field-library.js
  //                     (business_domain -> D2C Insights / DC Media Performance / DG Media Tracking)
  //   Data Model        knowledge.js "Channel data model" + knowledge.html dataModelSources
  //                     "Marketing DW Data Model" + data-model-browser.js "D2C Insight"
  //   Metric Dictionary knowledge.js metric assets; metricType mirrors metric_type
  //   Business Term     business-term-library.js seeds (scope is the Data Model association;
  //                     Global Synonym rows carry the global "All models / All reports" scope)
  //   Analytical Model  knowledge.js playbook normalized by field-library.js
  //                     (Current User + Enabled + Draft)
  //   Scenario Reporting scenario-reports.js baseRecords (report + reportHref = linked report;
  //                     structureGuidance / attachments preserved for the future form)
  //   Email Reports     types.js demoAssets (email-library.js table consumes the same records)
  records: [
    {
      id: "investment-principles",
      typeId: "Principles",
      title: "Campaign investment decision principles",
      summary: "Shared guardrails for evaluating investment pressure, conversion efficiency, and the confidence required before recommending action.",
      owner: "Sarah Chen",
      stage: "under-review",
      availability: "enabled",
    },
    {
      id: "analysis-guardrails",
      typeId: "Principles",
      title: "Trusted analysis guardrails",
      summary: "Minimum checks for freshness, metric consistency, comparison windows, and business context before an AI answer is decision-ready.",
      owner: "Michael Liu",
      stage: "published",
      availability: "enabled",
    },
    {
      id: "city-report-context",
      typeId: "Report Context",
      title: "City Strategy report context",
      summary: "Purpose, audience, comparison logic, and guardrails for the Invest City Strategy report.",
      owner: "Emily Wang",
      projects: ["D2C Insights"],
      domains: ["City Strategy"],
      stage: "published",
      availability: "enabled",
    },
    {
      id: "fourp-report-context",
      typeId: "Report Context",
      title: "4P performance context",
      summary: "Approved interpretation of Place, Price, Product, and Promotion performance within the governed 4P framework.",
      owner: "David Zhang",
      projects: ["D2C Insights"],
      domains: ["4P"],
      stage: "under-review",
      availability: "enabled",
    },
    {
      id: "rednote-reporting-context",
      typeId: "Report Context",
      title: "Rednote reporting context",
      summary: "Approved interpretation rules and scope for Rednote reporting.",
      owner: "Rachel Kim",
      projects: ["DG Media Tracking"],
      domains: ["Rednote"],
      stage: "published",
      availability: "enabled",
    },
    {
      id: "channel-data-model",
      typeId: "Data Model",
      title: "Channel data model",
      summary: "Governed grain, lineage, and quality context for the Channel dimension and related fact tables.",
      owner: "Kevin Zhao",
      stage: "published",
      availability: "enabled",
    },
    {
      id: "marketing-dw-data-model",
      typeId: "Data Model",
      title: "Marketing DW Data Model",
      summary: "Data model source bundling the Channel, Customer, and Campaign Performance tables.",
      stage: "published",
      availability: "enabled",
    },
    {
      id: "d2c-insight-data-model",
      typeId: "Data Model",
      title: "D2C Insight",
      summary: "Data model browser domain covering sales order detail, channel, and customer tables.",
      stage: "published",
      availability: "enabled",
    },
    {
      id: "metric-dictionary-member-conversion",
      typeId: "Metric Dictionary",
      title: "Member conversion",
      summary: "Share of identified member visits that result in a qualified transaction within the governed conversion window.",
      badge: "Base",
      owner: "Amy Wu",
      domains: ["Customer"],
      metricType: "Base",
      stage: "published",
      availability: "enabled",
    },
    {
      id: "metric-dictionary-campaign-roi",
      typeId: "Metric Dictionary",
      title: "Campaign ROI",
      summary: "Attributed campaign revenue divided by governed media spend, using the approved attribution and comparison window.",
      badge: "Calculated",
      owner: "Tom Anderson",
      domains: ["City Strategy", "4P", "ABO"],
      metricType: "Calculated",
      stage: "under-review",
      availability: "enabled",
    },
    {
      id: "metric-dictionary-promotion-lift",
      typeId: "Metric Dictionary",
      title: "Promotion lift",
      summary: "Incremental performance versus the approved baseline after controlling for channel, product mix, and comparison period.",
      badge: "Calculated",
      owner: "Linda Park",
      domains: ["4P"],
      metricType: "Calculated",
      stage: "draft",
      availability: "enabled",
    },
    {
      id: "business-term-gmv",
      typeId: "Business Term",
      title: "GMV (Gross Merchandise Value)",
      summary: "Total value of merchandise sold through the platform before deductions.",
      badge: "Business Term",
      owner: "Current User",
      stage: "published",
      availability: "enabled",
      kind: "Business Term",
      synonyms: ["Gross Sales", "Merchandise Value", "Gross Merchandise Sales"],
      scope: ["D2C Insight", "Revenue Dashboard", "Sales Performance"],
    },
    {
      id: "business-term-paid-customer",
      typeId: "Business Term",
      title: "Paid Customer",
      summary: "A customer who completed at least one valid paid order during the selected period.",
      badge: "Business Term",
      owner: "Emily Wang",
      stage: "published",
      availability: "enabled",
      kind: "Business Term",
      synonyms: ["Paying Customer", "Converted Customer"],
      scope: ["D2C Insight", "Customer 360", "Conversion Overview"],
    },
    {
      id: "business-term-active-member",
      typeId: "Business Term",
      title: "Active Member",
      summary: "A registered member with a qualified visit or transaction in the reporting period.",
      badge: "Business Term",
      owner: "Sophie Taylor",
      stage: "published",
      availability: "enabled",
      kind: "Business Term",
      synonyms: ["Engaged Member"],
      scope: ["D2C Insight", "Member Performance"],
    },
    {
      id: "global-synonym-revenue",
      typeId: "Business Term",
      title: "Revenue",
      summary: "Global aliases used to recognize governed revenue-related questions.",
      badge: "Global Synonym",
      owner: "Current User",
      stage: "published",
      availability: "enabled",
      kind: "Global Synonym",
      synonyms: ["Sales", "Turnover", "Income"],
      scope: ["All models", "All reports"],
    },
    {
      id: "global-synonym-customer",
      typeId: "Business Term",
      title: "Customer",
      summary: "Global aliases for customers and purchasing members.",
      badge: "Global Synonym",
      owner: "Marco Li",
      stage: "published",
      availability: "enabled",
      kind: "Global Synonym",
      synonyms: ["Buyer", "Shopper", "Client"],
      scope: ["All models", "All reports"],
    },
    {
      id: "global-synonym-campaign",
      typeId: "Business Term",
      title: "Campaign",
      summary: "Global aliases for marketing campaign activities.",
      badge: "Global Synonym",
      owner: "Sophie Chen",
      stage: "published",
      availability: "enabled",
      kind: "Global Synonym",
      synonyms: ["Promotion", "Activation"],
      scope: ["All models", "All reports"],
    },
    {
      id: "playbook-opportunity-scan",
      typeId: "Analytical Model",
      title: "Opportunity scan playbook",
      summary: "Repeatable routine for identifying and prioritizing growth opportunities across channels and regions.",
      owner: "Current User",
      domains: ["City Strategy", "4P"],
      stage: "draft",
      availability: "enabled",
      kind: "Playbook",
    },
    {
      id: "scenario-channel-performance",
      typeId: "Scenario Reporting",
      title: "Channel Performance Analysis",
      summary: "A reusable reporting scenario for channel efficiency, drivers, and recommendation-style summaries.",
      owner: "Emily Wang",
      stage: "building",
      availability: "disabled",
      report: "Invest City Strategy Analysis",
      reportHref: "../pages/reports.html?project=city&dashboard=0",
      updated: "Sep 3, 2026",
      structureGuidance:
        "1. Open with the main conclusion and the key business change.\n2. Break down the movement by city, channel, and period.\n3. Explain exceptions and the most likely drivers.\n4. End with actions, ownership, and timing.",
      attachments: ["City strategy briefing"],
    },
    {
      id: "scenario-campaign-review",
      typeId: "Scenario Reporting",
      title: "Campaign Review Reporting",
      summary: "A structured reporting scenario that reviews delivery, engagement, conversion, and return.",
      owner: "Marco Li",
      stage: "published",
      availability: "enabled",
      report: "Campaign Quality Watch",
      reportHref: "../pages/reports.html?project=abo&dashboard=1",
      updated: "Aug 31, 2026",
      structureGuidance:
        "1. Summarize delivery and performance.\n2. Identify abnormal campaigns or channels.\n3. Explain changes by mix, spend, and conversion.\n4. Highlight actions for the next cycle.",
      attachments: ["Campaign review template", "Reference screenshot"],
    },
    {
      id: "scenario-channel-exceptions",
      typeId: "Scenario Reporting",
      title: "Channel Exception Watch",
      summary: "A short-form scenario for monitoring channel anomalies, queue state and release readiness.",
      owner: "Sophie Chen",
      stage: "queued",
      availability: "disabled",
      report: "Source Integrity Monitor",
      reportHref: "../pages/reports.html?project=ottolv&dashboard=1",
      updated: "Sep 1, 2026",
      structureGuidance:
        "1. Check the current queue status.\n2. Surface rule breaches and blocked items.\n3. Separate release blockers from normal fluctuations.\n4. List the items that need follow-up.",
      attachments: ["Exception checklist"],
    },
    {
      id: "email-report-weekly-performance",
      typeId: "Email Reports",
      title: "Weekly Marketing Performance",
      summary: "Weekly executive summary of channel delivery, conversion and ROI.",
      owner: "Emily Wang",
      stage: "published",
      availability: "enabled",
      emailSubject: "Weekly Marketing Performance | Executive Summary",
      schedule: "Every Monday · 09:00",
      relatedReport: "Marketing Executive Dashboard",
      lastSent: "Aug 31, 2026",
      updated: "Yesterday",
    },
    {
      id: "email-report-campaign-alert",
      typeId: "Email Reports",
      title: "Campaign Performance Alert",
      summary: "Daily exception report for campaigns outside governed performance thresholds.",
      owner: "Campaign Operations",
      stage: "published",
      availability: "enabled",
      emailSubject: "Campaign Performance Alert | Action Required",
      schedule: "Daily · 08:30",
      relatedReport: "Campaign Performance",
      lastSent: "Sep 1, 2026",
      updated: "2 days ago",
    },
    {
      id: "email-report-monthly-customer",
      typeId: "Email Reports",
      title: "Monthly Customer Growth Review",
      summary: "Monthly customer acquisition, activation and retention review.",
      owner: "Customer Analytics",
      stage: "under-review",
      availability: "disabled",
      emailSubject: "Monthly Customer Growth Review",
      schedule: "First business day · 10:00",
      relatedReport: "Customer 360",
      lastSent: "Aug 1, 2026",
      updated: "1 week ago",
    },
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
