window.scenarioLibraryData = [
  {
    id: "scenario-channel-performance",
    name: "Channel Performance Analysis",
    category: "Reporting",
    purpose:
      "A reusable reporting scenario for channel efficiency, drivers, and recommendation-style summaries.",
    triggerWhen:
      "When users need to explain channel movement, compare city or channel performance, and turn report findings into next actions.",
    input: "Report, City, Channel, Date Range, Traffic, Sales, Conversion, and Basket Metrics",
    logic:
      "Confirm report context -> Compare channel movement -> Decompose drivers -> Explain exceptions -> Recommend actions",
    output: "Channel performance summary, key drivers, exceptions, and recommended next actions",
    boundary:
      "Incomplete reporting periods, missing source data, or ungoverned channel definitions must be flagged before recommendations are made.",
    callCount: 128,
    callPeriod: "30 days",
    likeRate: 91,
    owner: "Emily Wang",
    ownerAvatar: "",
    user: "D2C Insights",
    status: "In Development",
    version: "v1.1",
    scope: "D2C Insights",
    tags: ["Scenario Reporting", "D2C Insights"],
    updated: "2026-09-03",
    knowledgeId: "SCN-CH-001",
    source: "Team Created",
    reviewStatus: "Reviewing",
    accuracyScore: 86,
    usedInReports: 2,
    usedInScenarios: 1,
    previewQuestion: "Explain the largest channel movement in the Invest City Strategy report.",
    previewOutput:
      "The largest channel movement should be explained against the approved report context, with city scope, comparison period, source freshness, and conversion impact stated before recommending follow-up actions.",
  },
  {
    id: "scenario-campaign-review",
    name: "Campaign Review Reporting",
    category: "Reporting",
    purpose:
      "A structured reporting scenario that reviews delivery, engagement, conversion, and return.",
    triggerWhen:
      "When users need a campaign readout across delivery, engagement, conversion, return, and exception handling.",
    input: "Campaign, Date Range, Media Channel, Spend, Exposure, Engagement, Conversion, and Revenue Metrics",
    logic:
      "Summarize delivery -> Identify abnormal campaigns -> Explain movement by mix and spend -> Highlight next-cycle actions",
    output: "Campaign performance readout, risks, opportunities, and action list",
    boundary:
      "Campaigns outside the governed attribution window, invalid traffic, or unapproved baselines are excluded from interpretation.",
    callCount: 96,
    callPeriod: "30 days",
    likeRate: 88,
    owner: "Marco Li",
    ownerAvatar: "",
    user: "DC Media Performance",
    status: "Published",
    version: "v1.0",
    scope: "DC Media Performance",
    tags: ["Scenario Reporting", "DC Media Performance"],
    updated: "2026-08-31",
    knowledgeId: "SCN-CR-001",
    source: "Team Created",
    reviewStatus: "Passed",
    accuracyScore: 90,
    usedInReports: 3,
    usedInScenarios: 1,
    previewQuestion: "Review the latest campaign performance and identify actions for the next cycle.",
    previewOutput:
      "Campaign review should start with delivery and conversion performance, then separate spend, mix, and attribution-window effects before listing prioritized actions.",
  },
  {
    id: "scenario-channel-exceptions",
    name: "Channel Exception Watch",
    category: "Monitoring",
    purpose:
      "A short-form scenario for monitoring channel anomalies, queue state, and release readiness.",
    triggerWhen:
      "When users need to monitor source integrity, abnormal channel movement, or unresolved data readiness issues.",
    input: "Channel, Source System, Refresh Status, Exception Queue, Delivery Metrics, and Data Quality Flags",
    logic:
      "Check queue status -> Surface rule breaches -> Separate blockers from normal movement -> List required follow-up",
    output: "Exception summary, blocker list, owner actions, and readiness note",
    boundary:
      "Unsupported cross-device deduplication, invalid traffic, and unresolved source gaps must remain visible in the final answer.",
    callCount: 74,
    callPeriod: "30 days",
    likeRate: 84,
    owner: "Sophie Chen",
    ownerAvatar: "",
    user: "DG Media Tracking",
    status: "In Development",
    version: "v0.9",
    scope: "DG Media Tracking",
    tags: ["Scenario Reporting", "DG Media Tracking"],
    updated: "2026-09-01",
    knowledgeId: "SCN-CX-001",
    source: "Team Created",
    reviewStatus: "Reviewing",
    accuracyScore: 82,
    usedInReports: 2,
    usedInScenarios: 1,
    previewQuestion: "Which channel exceptions are blocking the current tracking release?",
    previewOutput:
      "Exception watch should separate release blockers from normal fluctuations, then name the owner, expected action, and readiness impact for each issue.",
  },
  {
    id: "city-comparison",
    name: "City Comparison Analysis",
    category: "Analysis",
    purpose:
      "Compare media investment performance across multiple cities to identify performance gaps, growth opportunities, and areas requiring optimization.",
    triggerWhen:
      "When users need to compare media performance across cities, sales contribution or traffic efficiency, etc.",
    input: "City, Date Range, Media Channel, Sales / Traffic / CR Metrics",
    logic:
      "Unified Dimension → City Ranking → Metric Decomposition → Anomaly Detection → Driver Analysis",
    output: "City Performance Overview, Key Insights, Opportunity Recommendations",
    boundary:
      "Insufficient data coverage, incomplete city definition, or missing dimension conditions are not included in the analysis.",
    callCount: 386,
    callPeriod: "30 days",
    likeRate: 89,
    owner: "Sarah Chen",
    ownerAvatar: "",
    user: "Marketing Strategy Team",
    status: "In Development",
    version: "v1.3",
    scope: "Global",
    tags: ["Analysis Scenario", "Global"],
    updated: "2026-07-11",
    knowledgeId: "SCN-000128",
    source: "AI Suggested",
    reviewStatus: "Passed",
    accuracyScore: 89,
    usedInReports: 42,
    usedInScenarios: 6,
    previewQuestion:
      "Compare media investment performance between Shanghai and Beijing for Q2 2026",
    previewOutput: `## City Comparison: Shanghai vs Beijing (Q2 2026)

### Performance Overview
| Metric | Shanghai | Beijing | Difference |
|--------|----------|---------|------------|
| Media Investment | ¥12.5M | ¥10.8M | +15.7% |
| Sales Revenue | ¥45.2M | ¥38.6M | +17.1% |
| Traffic | 2.8M | 2.3M | +21.7% |
| Conversion Rate | 3.2% | 2.9% | +0.3pp |
| ROI | 3.62 | 3.57 | +1.4% |

### Key Insights
1. **Shanghai outperforms Beijing** in both absolute sales (+17.1%) and traffic efficiency (+21.7%)
2. **Higher investment in Shanghai** yields proportionally higher returns, suggesting scalable opportunity
3. **Beijing's lower conversion rate** (2.9% vs 3.2%) indicates potential optimization in targeting or creative

### Opportunity Recommendations
- Increase Shanghai investment by 20% given strong ROI performance
- Investigate Beijing conversion gap - review audience targeting and creative assets
- Consider replicating Shanghai's media mix strategy in Beijing`,
  },
  {
    id: "campaign-anomaly",
    name: "Campaign Anomaly Detection",
    category: "Monitoring",
    purpose:
      "Automatically detect and diagnose unusual patterns in campaign performance metrics to flag potential issues or opportunities early.",
    triggerWhen:
      "When campaign performance deviates significantly from historical baseline or forecasted trajectory.",
    input: "Campaign ID, Time Series Data, Baseline Metrics, Threshold Parameters",
    logic:
      "Baseline Establishment → Statistical Deviation Detection → Root Cause Classification → Impact Assessment → Recommendation Generation",
    output: "Anomaly Alert, Root Cause Analysis, Recommended Actions, Confidence Score",
    boundary:
      "Anomalies caused by known scheduled events (holidays, planned maintenance) are excluded from alerting.",
    callCount: 245,
    callPeriod: "30 days",
    likeRate: 92,
    owner: "James Brown",
    ownerAvatar: "",
    user: "Marketing Strategy Team",
    status: "Published",
    version: "v2.1",
    scope: "Campaign",
    tags: ["Monitoring", "Campaign"],
    updated: "2026-07-15",
    knowledgeId: "SCN-000145",
    source: "Team Created",
    reviewStatus: "Passed",
    accuracyScore: 92,
    usedInReports: 28,
    usedInScenarios: 4,
    previewQuestion: "Detect anomalies in the Summer Promo campaign performance for last 7 days",
    previewOutput: `## Campaign Anomaly Detection: Summer Promo (Last 7 Days)

### Anomaly Summary
| Metric | Current | Expected | Deviation | Status |
|--------|---------|----------|-----------|--------|
| CTR | 2.1% | 3.5% | -40.0% | 🔴 Critical |
| CPC | ¥8.5 | ¥5.2 | +63.5% | 🔴 Critical |
| Conversion | 4.2% | 4.8% | -12.5% | 🟡 Warning |
| Spend | ¥125K | ¥120K | +4.2% | 🟢 Normal |

### Root Cause Analysis
1. **CTR Drop (-40%)**: Linked to creative fatigue - same creative running for 21 days
2. **CPC Spike (+63%)**: Increased auction competition due to competitor campaign launch
3. **Conversion Decline (-12%)**: Landing page load time increased to 4.2s (threshold: 2.5s)

### Recommended Actions
- Refresh creative assets immediately (priority: HIGH)
- Review bidding strategy to counter competitor pressure
- Investigate landing page performance with engineering team`,
  },
  {
    id: "funnel-optimization",
    name: "Customer Funnel Optimization",
    category: "Analysis",
    purpose:
      "Identify bottlenecks and optimization opportunities across the customer conversion funnel from awareness to purchase.",
    triggerWhen:
      "When analyzing customer journey performance or investigating conversion rate changes.",
    input: "Funnel Stages, Conversion Rates, Traffic Sources, User Segments, Time Period",
    logic:
      "Funnel Stage Mapping → Drop-off Point Identification → Segment Comparison → Cohort Analysis → Optimization Recommendation",
    output: "Funnel Visualization, Drop-off Analysis, Segment Insights, Action Plan",
    boundary:
      "Users with incomplete identity tracking or single-session visitors are excluded from multi-stage funnel analysis.",
    callCount: 178,
    callPeriod: "30 days",
    likeRate: 87,
    owner: "Jessica Li",
    ownerAvatar: "",
    user: "Marketing Strategy Team",
    status: "Under Review",
    version: "v1.0",
    scope: "Customer",
    tags: ["Analysis", "Customer"],
    updated: "2026-07-18",
    knowledgeId: "SCN-000162",
    source: "AI Suggested",
    reviewStatus: "Reviewing",
    accuracyScore: 87,
    usedInReports: 15,
    usedInScenarios: 3,
    previewQuestion: "Analyze the customer funnel for mobile app users in June 2026",
    previewOutput: `## Customer Funnel Analysis: Mobile App Users (June 2026)

### Funnel Performance
| Stage | Users | Conversion | Drop-off | vs Last Month |
|-------|-------|------------|----------|---------------|
| App Open | 1,250,000 | 100% | - | +5.2% |
| Product View | 875,000 | 70.0% | 30.0% | -2.1% |
| Add to Cart | 312,500 | 35.7% | 64.3% | -8.5% |
| Checkout | 187,500 | 60.0% | 40.0% | +3.2% |
| Purchase | 131,250 | 70.0% | 30.0% | +1.8% |

### Critical Bottleneck
**Add to Cart stage shows 64.3% drop-off** - largest opportunity for improvement

### Segment Insights
- **iOS users**: 15% higher add-to-cart rate than Android
- **Returning users**: 2.3x higher conversion than new users
- **Users from social ads**: Lowest add-to-cart rate (28.1%)

### Optimization Recommendations
1. Simplify add-to-cart flow (reduce steps from 3 to 2)
2. Implement abandoned cart push notifications
3. A/B test product page layout for social traffic
4. Introduce guest checkout option`,
  },
  {
    id: "roi-forecast",
    name: "Campaign ROI Forecasting",
    category: "Planning",
    purpose:
      "Predict future campaign ROI based on historical performance, market trends, and planned investment changes.",
    triggerWhen: "When planning budget allocation or evaluating campaign investment scenarios.",
    input:
      "Historical ROI Data, Planned Budget, Campaign Parameters, Market Indicators, Seasonality Factors",
    logic:
      "Historical Trend Analysis → Seasonal Adjustment → Market Factor Integration → Monte Carlo Simulation → Confidence Interval Generation",
    output: "ROI Forecast Range, Confidence Level, Sensitivity Analysis, Budget Recommendation",
    boundary:
      "Forecasts are limited to 90-day horizon. External market disruptions (competitor actions, policy changes) may reduce accuracy.",
    callCount: 134,
    callPeriod: "30 days",
    likeRate: 85,
    owner: "David Zhang",
    ownerAvatar: "",
    user: "Marketing Strategy Team",
    status: "Published",
    version: "v1.5",
    scope: "Global",
    tags: ["Planning", "Forecast"],
    updated: "2026-07-10",
    knowledgeId: "SCN-000138",
    source: "Team Created",
    reviewStatus: "Passed",
    accuracyScore: 85,
    usedInReports: 22,
    usedInScenarios: 5,
    previewQuestion: "Forecast Q3 ROI for the OTT campaign with 15% budget increase",
    previewOutput: `## ROI Forecast: OTT Campaign Q3 2026

### Forecast Parameters
- Budget Increase: +15% (¥8.5M → ¥9.8M)
- Historical Baseline ROI: 3.2
- Forecast Horizon: 90 days
- Confidence Level: 85%

### ROI Forecast
| Scenario | ROI | Probability | Range |
|----------|-----|-------------|-------|
| Optimistic | 3.8 | 15% | 3.6 - 4.0 |
| Baseline | 3.4 | 55% | 3.2 - 3.6 |
| Conservative | 2.9 | 30% | 2.7 - 3.1 |

### Expected ROI: 3.4 (±0.4)

### Sensitivity Analysis
- **Creative refresh**: +0.3 ROI potential
- **Audience expansion**: +0.2 ROI, -5% confidence
- **Frequency increase**: -0.1 ROI risk

### Budget Recommendation
Proceed with 15% increase. Expected incremental revenue: ¥4.9M. Monitor weekly for deviation from baseline trajectory.`,
  },
  {
    id: "audience-insight",
    name: "Audience Insight Generation",
    category: "Analysis",
    purpose:
      "Generate actionable audience insights by analyzing demographic, behavioral, and engagement patterns across segments.",
    triggerWhen:
      "When understanding audience composition or identifying high-value segments for targeting.",
    input:
      "Audience Data, Engagement Metrics, Demographic Profiles, Behavioral Signals, Conversion Data",
    logic:
      "Segmentation → Engagement Scoring → Value Attribution → Pattern Recognition → Insight Synthesis",
    output:
      "Audience Segments, High-Value Profiles, Engagement Patterns, Targeting Recommendations",
    boundary:
      "Segments with less than 1,000 users are excluded from statistical analysis to ensure significance.",
    callCount: 312,
    callPeriod: "30 days",
    likeRate: 91,
    owner: "Emily Wang",
    ownerAvatar: "",
    user: "Marketing Strategy Team",
    status: "Published",
    version: "v2.0",
    scope: "Audience",
    tags: ["Analysis", "Audience"],
    updated: "2026-07-14",
    knowledgeId: "SCN-000156",
    source: "AI Suggested",
    reviewStatus: "Passed",
    accuracyScore: 91,
    usedInReports: 35,
    usedInScenarios: 7,
    previewQuestion: "Generate audience insights for the luxury handbag campaign",
    previewOutput: `## Audience Insights: Luxury Handbag Campaign

### Top Segments by Value
| Segment | Size | Avg Order | Conversion | LTV Score |
|---------|------|-----------|------------|-----------|
| Urban Professionals | 245K | ¥3,850 | 4.2% | 9.2/10 |
| Fashion Enthusiasts | 189K | ¥2,940 | 5.8% | 8.7/10 |
| Gift Buyers | 134K | ¥4,200 | 3.1% | 8.5/10 |
| Deal Seekers | 312K | ¥1,280 | 7.2% | 5.3/10 |

### Key Insights
1. **Urban Professionals** are the highest LTV segment despite moderate conversion
2. **Gift Buyers** show highest AOV but lowest conversion - opportunity for gifting-focused messaging
3. **Fashion Enthusiasts** convert at 5.8% - consider expanding lookalike audiences

### Engagement Patterns
- Peak engagement: 8-10 PM weekdays
- Preferred content: Product videos (2.3x engagement vs static)
- Device: 68% mobile, 32% desktop

### Targeting Recommendations
- Increase Urban Professional budget allocation by 25%
- Create gift-specific creative for Gift Buyers segment
- Expand Fashion Enthusiasts lookalike audience to 2% similarity`,
  },
  {
    id: "competitive-analysis",
    name: "Competitive Media Analysis",
    category: "Analysis",
    purpose:
      "Analyze competitor media strategies, share of voice, and positioning to identify competitive advantages and threats.",
    triggerWhen:
      "When evaluating competitive landscape or planning counter-strategies to competitor campaigns.",
    input:
      "Competitor Data, Media Spend Estimates, Share of Voice, Creative Assets, Channel Presence",
    logic:
      "Competitor Identification → Media Mix Analysis → Share of Voice Calculation → Creative Analysis → Gap Identification",
    output: "Competitive Landscape, SOV Analysis, Channel Gaps, Strategic Recommendations",
    boundary:
      "Analysis limited to publicly available data and estimated metrics. Proprietary competitor data is not included.",
    callCount: 98,
    callPeriod: "30 days",
    likeRate: 88,
    owner: "Michael Liu",
    ownerAvatar: "",
    user: "Marketing Strategy Team",
    status: "Draft",
    version: "v0.8",
    scope: "Market",
    tags: ["Analysis", "Competitive"],
    updated: "2026-07-17",
    knowledgeId: "SCN-000171",
    source: "Team Created",
    reviewStatus: "Draft",
    accuracyScore: 88,
    usedInReports: 8,
    usedInScenarios: 2,
    previewQuestion: "Analyze competitor media strategy for the luxury segment in Q2 2026",
    previewOutput: `## Competitive Media Analysis: Luxury Segment (Q2 2026)

### Competitor Landscape
| Brand | Est. Spend | SOV | Primary Channels | Key Messaging |
|-------|------------|-----|------------------|---------------|
| Competitor A | ¥45M | 32% | TV, Digital | Heritage & Craftsmanship |
| Competitor B | ¥38M | 27% | Social, KOL | Trend & Exclusivity |
| Our Brand | ¥35M | 25% | Digital, OOH | Innovation & Lifestyle |
| Competitor C | ¥22M | 16% | Digital | Value & Accessibility |

### Share of Voice Trend
- Our SOV decreased 3pp vs Q1 (28% → 25%)
- Competitor A increased spend by 15% QoQ
- Digital channel competition intensified (+22% spend)

### Gap Analysis
1. **KOL/Influencer presence**: 40% below Competitor B
2. **Video content volume**: 25% below category average
3. **Programmatic display**: Under-indexed at 12% vs 20% category

### Strategic Recommendations
- Increase KOL partnership budget by 30%
- Launch video-first creative strategy
- Expand programmatic display to 18% of digital budget`,
  },
];
