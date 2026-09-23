/**
 * Report catalog + knowledge data ported verbatim from the original demo:
 * - REPORT_GROUPS / REPORT_PROJECTS from assets/js/reports/report-core.js
 *   (image paths rewritten ../images/ -> /assets/images/).
 * - KNOWLEDGE_ASSETS from assets/js/data/knowledge.js (window.marketingKnowledgeAssets).
 * Field shapes follow the original; do not 'clean up' keys the original supplies.
 */

export const REPORT_GROUPS = [
  { id: "all", label: "All reports" },
  {
    id: "consumer",
    label: "D2C Insight",
    description:
      "Post-campaign insight projects covering consumers, cities, products, and daily business tracking.",
  },
  {
    id: "dc",
    label: "DC Media Performance",
    description: "Project-based tracking for brand campaigns and DC media performance.",
  },
  {
    id: "dg",
    label: "DG Media Tracking",
    description:
      "DG media monitoring, platform tracking, and cross-channel exposure data projects.",
  },
];

export const REPORT_PROJECTS = {
  city: {
    title: "City Strategy",
    kicker: "Consumer / City Strategy",
    group: "consumer",
    category: "D2C Insight",
    description:
      "Tracks post-campaign business impact for core pilot cities, using sales, CR, traffic, and related metrics across executive, city, and channel analysis.",
    health: "Healthy",
    healthClass: "health-good",
    status: "Ready",
    freshness: "Online, offline, Outlet, and Retail channel data are updated",
    sourceStrip: ["Data updated: 2026-05-28"],
    image: "/assets/images/project-city-tabby.png",
    owner: "D2C Insight",
    accent: "#739684",
    reports: [
      {
        title: "Invest City Strategy Analysis",
        type: "Investment impact analysis",
        description:
          "Compares invested cities against non-invested cities across traffic, sales, new customer rate, store visit value, CR, AT, UPT, AUR, sales contribution, and TAM to evaluate campaign uplift during the investment period.",
        owner: "D2C Insight",
        cadence: "Weekly",
        updated: "2026-05-28",
        purpose:
          "Make city investment decisions with a consistent view of media pressure, customer response, and downstream business impact.",
        bestFor: ["City prioritization", "Investment review", "Executive brief"],
        steps: [
          "Confirm source freshness and the approved invested-city cohort.",
          "Compare business movement before and after the campaign window.",
          "Separate media pressure, traffic quality, and conversion effects.",
          "Turn material findings into a city-level action and confidence note.",
        ],
        metrics: [
          ["Attributed ROI", "2.84", "+12.6%"],
          ["Qualified traffic", "1.42M", "+8.3%"],
          ["Member conversion", "18.7%", "+1.9pt"],
          ["Invested cities", "12", "2 to watch"],
        ],
        chart: [
          ["SH", 88, 67],
          ["BJ", 73, 58],
          ["CD", 56, 48],
          ["SZ", 69, 61],
          ["HZ", 63, 54],
          ["WH", 51, 43],
        ],
        knowledgeIds: [
          "city-report-context",
          "city-performance-model",
          "campaign-roi",
          "member-conversion",
          "invested-city",
          "weekly-city-readout",
          "investment-principles",
          "personal-campaign-notes",
        ],
        assistant: {
          panelTitle: "Data Analysis Assistant",
          greeting: "Hi! I'm your data analysis mentor.",
          intro:
            "The following report context has been loaded, and I'm ready to provide in-depth insights.",
          summaryTitle: "Invest City Strategy Quick Summary",
          contextTitle: "Invest City Analysis",
          scope: "All / Invest City",
          timeFrame: "FY25 P4-P9 (Pre-Investment) / FY25 P11-FY26 P12 (Post-Investment)",
          summary:
            "Invest cities deliver 10% daily traffic uplift, driving 1% daily sales growth and 1% AUR improvement.<br><br>Key gaps: CR (-9%), SV (-7%), new customer ratio (-2%) and UPT (-1%) all decline, revealing conversion and basket-size weaknesses.<br><br>Should prioritize conversion optimization to fully monetize traffic gains.",
          periodHint:
            "Use a preset for the current month, or add a period after the analysis name to view a historical report, for example: Investment Holistic Analysis FY26P9.",
          examples: [
            {
              label: "Data Insights",
              prompt: "Help me analyze this month's report",
              answerTitle: "This month's investment view is positive, with two cities to watch.",
              summary:
                "Attributed ROI is 2.84, qualified traffic is up 8.3%, and member conversion is up 1.9 points. The broad direction is positive, while two of the 12 invested cities still need a closer review.",
              findings: [
                ["Return", "Attributed ROI is 2.84, up 12.6% versus the governed baseline."],
                ["Demand", "Qualified traffic reached 1.42M, up 8.3%."],
                ["Watch", "Two invested cities need further conversion validation."],
              ],
            },
            {
              label: "Comparative Analysis",
              prompt: "Compare metrics across Invest Cities/Channels",
              answerTitle: "The comparison is ready across the approved city and channel scope.",
              summary:
                "Use the approved invested-city cohort and the Online, Offline, Outlet, and Retail source views. Compare traffic and sales first, then isolate CR, AT, UPT, AUR, sales contribution, and TAM to explain the difference.",
              findings: [
                ["Cities", "Compare invested cities with the governed non-invested benchmark."],
                [
                  "Channels",
                  "Keep Online, Offline, Outlet, and Retail on the same reporting window.",
                ],
                [
                  "Metrics",
                  "Use traffic, sales, conversion, transaction value, basket, contribution, and TAM.",
                ],
              ],
            },
            {
              label: "Anomaly Diagnosis",
              prompt: "Identify cities with abnormal trends compared to historical data",
              answerTitle: "Chengdu is the clearest city-level watch item in the current view.",
              summary:
                "Traffic is improving faster than the available conversion evidence, and late member backflow reduces confidence in the ROI conclusion. Keep Chengdu on watch until the next complete cycle.",
              findings: [
                ["Signal", "Traffic growth is not yet matched by conversion evidence."],
                ["Data caveat", "Member backflow is incomplete for the current cycle."],
                ["Next check", "Re-run the comparison after the next complete data refresh."],
              ],
            },
          ],
        },
        recommendations: [
          {
            title: "Holistic analysis",
            meta: "Investment Holistic Analysis / current period",
            answerTitle: "Investment is working, but the next decision is city-specific.",
            summary:
              "Shanghai and Beijing account for most of the incremental return. Chengdu still shows traffic growth without enough conversion evidence, so budget expansion should wait for one more complete cycle.",
            findings: [
              ["Shanghai", "ROI reached 3.12 with member conversion up 2.4 points."],
              ["Beijing", "Qualified traffic grew 11%, with stable average transaction value."],
              ["Chengdu", "Traffic improved, but late member backflow lowers confidence in ROI."],
            ],
          },
          {
            title: "City comparison analysis",
            meta: "Invest City / benchmark city",
            answerTitle: "Invested cities lead on traffic quality, not uniformly on conversion.",
            summary:
              "The invested cohort has an 8.1% advantage in qualified traffic and a 4.7% sales lift. Conversion improvement is concentrated in Shanghai, Beijing, and Shenzhen rather than shared across all invested cities.",
            findings: [
              ["Cohort", "The comparison uses the approved invested-city definition."],
              ["Traffic", "Qualified traffic is the most consistent positive signal."],
              ["Conversion", "Four cities remain within the normal variance range."],
            ],
          },
          {
            title: "Channel comparison analysis",
            meta: "Online / Offline / Outlet / Retail",
            answerTitle: "The channel comparison is ready with the report's governed context.",
            summary:
              "Compare Online, Offline, Outlet, and Retail across traffic, sales, CR, AT, UPT, AUR, sales contribution, and TAM for the active investment window. The invested-city cohort and report definitions remain attached throughout the analysis.",
            findings: [
              ["Scope", "All four report channels use the same active investment window."],
              [
                "Comparison path",
                "Start with traffic and sales, then isolate conversion, transaction value, basket, and mix.",
              ],
              [
                "Period",
                "Use FY25 P4-P9 as pre-investment and FY25 P11-FY26 P12 as post-investment.",
              ],
            ],
          },
          {
            title: "Audience segment analysis",
            meta: "New / Engaged / Existing cohorts",
            answerTitle:
              "Member conversion backflow is the largest explainer of the weekly movement.",
            summary:
              "The new and engaged segments are the primary growth contributors. The existing segment continues to convert at baseline, with selective upside in Tier-1 cities that support a measured reallocation.",
            findings: [
              ["New", "Member conversion up 2.4 points with a 6.1% sales contribution."],
              ["Engaged", "Frequency up 0.18 with stable AUR."],
              ["Existing", "Conversion flat; share of wallet expanded in three cities."],
            ],
          },
          {
            title: "Product mix analysis",
            meta: "Category / SKU / price band",
            answerTitle:
              "Mix is shifting toward higher-AUR accessories without losing entry-tier volume.",
            summary:
              "The accessory and gifting categories are driving the AUR expansion. Entry-tier SKUs remain healthy and protect the volume base, while core categories stabilize after the season promotion.",
            findings: [
              ["Category", "Accessory contribution up 1.8 points."],
              ["Price band", "Mid and upper bands lead AUR growth."],
              ["Risk", "Watch entry-tier sell-through in non-invested cities."],
            ],
          },
          {
            title: "Campaign ROI review",
            meta: "Active / completed / pending",
            answerTitle:
              "ROI is healthy, with the next decision on reallocation between campaigns.",
            summary:
              "Active campaigns are within the approved ROI range. Two completed campaigns underperformed on conversion but delivered on qualified reach. The pending campaign should be reviewed against the current investment window before launch.",
            findings: [
              ["Active", "Average ROI 2.84 with stable payback."],
              ["Completed", "Reach on plan; conversion needs a follow-up read."],
              ["Pending", "One campaign awaiting the next investment window."],
            ],
          },
        ],
      },
      {
        title: "City Analysis Dashboard",
        type: "City business analysis",
        description:
          "Monitors city-level performance across traffic, CR, SV, sales, basic city information, customer segments, product segments, price bands, and store reclassification to identify local growth opportunities.",
        owner: "D2C Insight",
        cadence: "Daily",
        updated: "2026-05-28",
        purpose:
          "Diagnose where city performance moved and identify the customer, product, channel, or store segment that explains the change.",
        bestFor: ["Daily diagnosis", "City comparison", "Segment drill-down"],
        steps: [
          "Find cities with material movement versus the approved baseline.",
          "Locate the first break across traffic, conversion, and transaction value.",
          "Drill into customer, product, price band, and store segments.",
          "Validate the signal against city context before recommending action.",
        ],
        metrics: [
          ["Net sales", "¥86.4M", "+6.8%"],
          ["Store traffic", "2.31M", "+4.2%"],
          ["Conversion", "21.4%", "+0.8pt"],
          ["Active cities", "28", "5 notable"],
        ],
        chart: [
          ["SH", 84, 72],
          ["BJ", 76, 63],
          ["SZ", 68, 57],
          ["HZ", 61, 54],
          ["CD", 55, 51],
          ["NJ", 48, 42],
        ],
        knowledgeIds: [
          "city-report-context",
          "city-performance-model",
          "member-conversion",
          "invested-city",
          "weekly-city-readout",
          "analysis-guardrails",
          "personal-morning-routine",
        ],
        recommendations: [
          {
            title: "Explain the largest city movement today",
            meta: "Based on your daily review pattern",
            answerTitle: "Shanghai is the largest positive movement, led by traffic quality.",
            summary:
              "Sales grew 9.4% versus the comparable day. Most of the gain came from member traffic and leather goods, while conversion remained within the expected range.",
            findings: [
              ["Traffic", "Qualified member visits increased 12%."],
              ["Product", "Leather goods contributed 43% of incremental sales."],
              ["Confidence", "All primary sources are complete."],
            ],
          },
          {
            title: "Find cities where traffic and sales disagree",
            meta: "Anomaly scan",
            answerTitle: "Three cities show traffic growth without equivalent sales growth.",
            summary:
              "Chengdu, Wuhan, and Nanjing have positive traffic but weaker conversion or transaction value. Chengdu has the largest gap and should be reviewed first.",
            findings: [
              ["Chengdu", "Traffic +7.1%, sales +0.9%."],
              ["Wuhan", "Conversion is down 1.3 points."],
              ["Nanjing", "Lower transaction value explains most of the gap."],
            ],
          },
          {
            title: "Create a city performance summary",
            meta: "Executive-ready narrative",
            answerTitle: "Growth remains broad, with a small number of conversion watchouts.",
            summary:
              "Five core cities are above baseline. The main positive driver is qualified traffic; conversion pressure is isolated to Wuhan and Chengdu.",
            findings: [
              ["Growth", "Five of six core cities are above baseline."],
              ["Watch", "Two cities have conversion pressure."],
              ["Next", "Review store and product mix in Chengdu."],
            ],
          },
        ],
      },
    ],
  },
  fourp: {
    title: "4P Report",
    kicker: "Consumer / 4P Report",
    group: "consumer",
    category: "D2C Insight",
    description:
      "Analyzes current business performance across Place, Product, People, and Price to help teams identify regional, product, audience, and pricing opportunities.",
    health: "Healthy",
    healthClass: "health-good",
    status: "Ready",
    freshness: "Product, price, channel, and promotion data are synchronized",
    sourceStrip: ["Data updated: 2026-05-29"],
    image: "/assets/images/project-fourp-tabby.png",
    owner: "Business Planning",
    accent: "#9d8f70",
    reports: [
      {
        title: "4P Executive Overview",
        type: "Business overview",
        description: "Reviews business performance across Place, Product, People, and Price.",
        owner: "Business Planning",
        cadence: "Weekly",
        updated: "2026-05-29",
        purpose:
          "Give leadership one governed view of commercial movement and the 4P dimension most responsible for each opportunity or risk.",
        bestFor: ["Business review", "Opportunity sizing", "Planning"],
        steps: [
          "Confirm the comparison period and material movement.",
          "Test Place, Product, People, and Price in sequence.",
          "Control for mix, promotion, and distribution effects.",
          "Rank opportunities by impact and confidence.",
        ],
        metrics: [
          ["Net sales", "¥128M", "+7.2%"],
          ["Active doors", "184", "+6"],
          ["New customers", "31.8%", "+2.1pt"],
          ["Average price", "¥3,460", "+1.4%"],
        ],
        chart: [
          ["Place", 78, 66],
          ["Product", 84, 71],
          ["People", 62, 57],
          ["Price", 69, 64],
          ["Promo", 73, 59],
          ["Mix", 58, 52],
        ],
        knowledgeIds: [
          "fourp-report-context",
          "commerce-performance-model",
          "promotion-lift",
          "effective-traffic",
          "fourp-opportunity-scan",
          "investment-principles",
          "analysis-guardrails",
        ],
        recommendations: [
          {
            title: "Run the weekly 4P opportunity scan",
            meta: "Your common planning workflow",
            answerTitle: "Product mix is the strongest opportunity this week.",
            summary:
              "Leather and lifestyle accessories are growing faster than the business baseline in East and South regions. The signal remains after controlling for promotion mix.",
            findings: [
              ["Product", "Leather and lifestyle accessories lead incremental sales."],
              ["Place", "East and South regions contribute 71% of the gain."],
              ["Confidence", "The effect persists outside promotion periods."],
            ],
          },
          {
            title: "Explain promotion lift versus underlying demand",
            meta: "Uses the approved baseline",
            answerTitle: "Most growth is underlying demand, with selective promotion lift.",
            summary:
              "Promotions explain about one-third of incremental sales. New customer growth and product mix explain the rest.",
            findings: [
              ["Promotion", "Estimated contribution is 32% of incremental sales."],
              ["People", "New customer share rose 2.1 points."],
              ["Product", "Full-price leather remains above baseline."],
            ],
          },
          {
            title: "Rank the top commercial opportunities",
            meta: "Impact and confidence",
            answerTitle: "Three opportunities are ready for planning discussion.",
            summary:
              "East leather assortment, South lifestyle accessories, and selected mid-price offers have the strongest combined impact and confidence.",
            findings: [
              ["01", "Expand East leather depth."],
              ["02", "Protect South accessories availability."],
              ["03", "Test mid-price offers without broad discounting."],
            ],
          },
        ],
      },
      {
        title: "Promotion Lift Analysis",
        type: "Opportunity analysis",
        description:
          "Identifies opportunities across regions, products, audiences, and price bands.",
        owner: "Business Planning",
        cadence: "Campaign",
        updated: "2026-05-29",
        purpose:
          "Evaluate whether a promotion created incremental demand, shifted timing, or simply changed mix and margin.",
        bestFor: ["Promotion review", "Incrementality", "Offer design"],
        steps: [
          "Select the governed baseline and control period.",
          "Measure sales, traffic, and conversion lift.",
          "Control for product, customer, and channel mix.",
          "Balance incremental demand against margin and pull-forward risk.",
        ],
        metrics: [
          ["Promotion lift", "+14.2%", "High confidence"],
          ["Incremental sales", "¥9.8M", "+11.0%"],
          ["Margin effect", "-1.6pt", "Within plan"],
          ["New customer share", "36.1%", "+4.4pt"],
        ],
        chart: [
          ["East", 81, 61],
          ["South", 72, 55],
          ["North", 58, 50],
          ["West", 64, 53],
          ["Online", 77, 60],
          ["Outlet", 49, 45],
        ],
        knowledgeIds: [
          "fourp-report-context",
          "commerce-performance-model",
          "promotion-lift",
          "fourp-opportunity-scan",
          "investment-principles",
          "analysis-guardrails",
        ],
        recommendations: [
          {
            title: "Measure true incremental lift",
            meta: "Baseline and mix controlled",
            answerTitle: "The promotion created measurable incremental demand.",
            summary:
              "After controlling for channel and product mix, the campaign delivered 14.2% lift with high confidence. New customers contributed most of the incremental volume.",
            findings: [
              ["Lift", "14.2% above the approved baseline."],
              ["Audience", "New customers contributed 61% of incremental sales."],
              ["Margin", "Margin pressure stayed within the approved plan."],
            ],
          },
          {
            title: "Find where the promotion underperformed",
            meta: "Region and channel scan",
            answerTitle: "North region and Outlet underperformed the campaign average.",
            summary:
              "Both areas gained traffic but converted below plan. Product availability and offer relevance are the likely first checks.",
            findings: [
              ["North", "Lift was 5.1% versus 14.2% overall."],
              ["Outlet", "Traffic rose, but conversion was flat."],
              ["Next", "Review availability and eligible assortment."],
            ],
          },
          {
            title: "Create a promotion recommendation",
            meta: "Decision-ready summary",
            answerTitle: "Repeat selectively, preserving the segments with proven incrementality.",
            summary:
              "The offer should be repeated for new customers in East and South, with narrower assortment and no broader discount depth.",
            findings: [
              ["Repeat", "East and South new-customer segments."],
              ["Refine", "Reduce low-response Outlet assortment."],
              ["Protect", "Keep discount depth unchanged."],
            ],
          },
        ],
      },
    ],
  },
  customer: {
    title: "Customer Daily Tracking",
    kicker: "Consumer / Customer Daily Tracking",
    group: "consumer",
    category: "D2C Insight",
    description:
      "Daily tracking of consumer-related data across traffic, member behavior, conversion intake, and key fluctuations.",
    health: "Healthy",
    healthClass: "health-good",
    status: "Ready",
    freshness: "Member and transaction data synchronized through yesterday 24:00",
    sourceStrip: ["Data updated: Yesterday 24:00"],
    image: "/assets/images/project-customer-tabby.png",
    owner: "CRM Analytics",
    accent: "#8799a8",
    reports: [
      {
        title: "Customer Daily Pulse",
        type: "Daily tracking",
        description:
          "Tracks consumer traffic, member behavior, add-to-cart, transaction, and repeat purchase performance.",
        owner: "CRM Analytics",
        cadence: "Daily",
        updated: "Yesterday 24:00",
        purpose:
          "Surface material customer movement early and explain whether traffic, identity, conversion, or value is responsible.",
        bestFor: ["Morning review", "Customer health", "Fast diagnosis"],
        steps: [
          "Check freshness and identity coverage.",
          "Compare traffic and qualified traffic movement.",
          "Follow conversion into transaction and repeat behavior.",
          "Escalate only material, evidence-backed changes.",
        ],
        metrics: [
          ["Qualified traffic", "684K", "+5.8%"],
          ["Member conversion", "19.6%", "+1.2pt"],
          ["Transactions", "128K", "+4.9%"],
          ["Repeat rate", "27.3%", "+0.6pt"],
        ],
        chart: [
          ["Mon", 58, 49],
          ["Tue", 63, 52],
          ["Wed", 69, 57],
          ["Thu", 64, 55],
          ["Fri", 78, 62],
          ["Sat", 88, 70],
        ],
        knowledgeIds: [
          "customer-report-context",
          "commerce-performance-model",
          "member-conversion",
          "effective-traffic",
          "funnel-drop-review",
          "analysis-guardrails",
          "personal-morning-routine",
        ],
        recommendations: [
          {
            title: "Run my morning customer pulse",
            meta: "Based on your usual order",
            answerTitle: "Customer health is positive with one identity coverage watchout.",
            summary:
              "Qualified traffic, conversion, and repeat rate are above baseline. One partner channel has lower identity coverage, but it does not change the overall direction.",
            findings: [
              ["Traffic", "Qualified traffic increased 5.8%."],
              ["Conversion", "Member conversion reached 19.6%."],
              ["Watch", "Partner channel identity coverage is down 2.3 points."],
            ],
          },
          {
            title: "Explain today's conversion movement",
            meta: "Traffic-to-transaction trace",
            answerTitle: "Conversion improved because member traffic quality increased.",
            summary:
              "The change is not caused by raw traffic volume. Identified member visits and returning-customer engagement explain most of the improvement.",
            findings: [
              ["Members", "Identified member visits grew 8.4%."],
              ["Return", "Returning-customer engagement improved."],
              ["Value", "Average transaction value remained stable."],
            ],
          },
          {
            title: "Find unusual customer signals",
            meta: "Materiality and data checks",
            answerTitle: "One channel warrants review; no enterprise-wide anomaly is present.",
            summary:
              "Partner-channel identity coverage is outside its normal range. Other funnel stages remain within expected variance.",
            findings: [
              ["Signal", "Identity coverage is 2.3 points below normal."],
              ["Scope", "The issue is isolated to one partner channel."],
              ["Impact", "Current conversion direction remains trustworthy."],
            ],
          },
          {
            title: "Compare channel performance for the last 3 periods",
            meta: "Online / Offline / Outlet / Retail",
            answerTitle: "Channel comparison is ready with the report's governed context.",
            summary:
              "Compare Online, Offline, Outlet, and Retail across traffic, sales, CR, AT, UPT, AUR, sales contribution, and TAM for the active investment window. The invested-city cohort and report definitions remain attached throughout the analysis.",
            findings: [
              ["Scope", "All four report channels use the same active investment window."],
              [
                "Comparison path",
                "Start with traffic and sales, then isolate conversion, transaction value, basket, and mix.",
              ],
              ["Period", "Use the same baseline and active period used in the report."],
            ],
          },
          {
            title: "Investigate member conversion backflow",
            meta: "New / Engaged / Existing cohorts",
            answerTitle:
              "Member conversion backflow is the largest explainer of the weekly movement.",
            summary:
              "The new and engaged segments are the primary growth contributors. The existing segment continues to convert at baseline, with selective upside in Tier-1 cities that support a measured reallocation.",
            findings: [
              ["New", "Member conversion up 2.4 points with a 6.1% sales contribution."],
              ["Engaged", "Frequency up 0.18 with stable AUR."],
              ["Existing", "Conversion flat; share of wallet expanded in three cities."],
            ],
          },
          {
            title: "Summarize top movers and recommended actions",
            meta: "Materiality and decisions",
            answerTitle:
              "Top movers are isolated and the recommended actions are scoped to the report's governed context.",
            summary:
              "Materiality and data checks pass for the three funnel stages. The recommended actions remain tied to the report's owned KPIs and the invested-city cohort.",
            findings: [
              [
                "Decision",
                "Stay with the current investment pressure and monitor identity coverage.",
              ],
              ["Check", "Re-run the morning pulse to confirm stability."],
              ["Next", "Hold the next decision until the weekly readout."],
            ],
          },
        ],
      },
      {
        title: "Customer Funnel Watch",
        type: "Funnel analysis",
        description: "Monitors the consumer conversion journey from visit to transaction.",
        owner: "CRM Analytics",
        cadence: "Daily",
        updated: "Yesterday 24:00",
        purpose:
          "Locate the first material break in the customer journey and identify the cohort or channel responsible.",
        bestFor: ["Funnel diagnosis", "Cohort comparison", "Conversion recovery"],
        steps: [
          "Confirm traffic quality and identity coverage.",
          "Locate the first material funnel loss.",
          "Cut the loss by channel, cohort, and journey stage.",
          "Connect the finding to an operational follow-up.",
        ],
        metrics: [
          ["Visit to identity", "64.8%", "+1.1pt"],
          ["Identity to engage", "43.2%", "-0.8pt"],
          ["Engage to buy", "31.4%", "+0.4pt"],
          ["30-day repeat", "27.3%", "+0.6pt"],
        ],
        chart: [
          ["Visit", 94, 86],
          ["Identify", 78, 69],
          ["Engage", 62, 55],
          ["Intent", 51, 47],
          ["Buy", 42, 38],
          ["Repeat", 29, 26],
        ],
        knowledgeIds: [
          "customer-report-context",
          "commerce-performance-model",
          "member-conversion",
          "effective-traffic",
          "funnel-drop-review",
          "analysis-guardrails",
        ],
        recommendations: [
          {
            title: "Find the first material funnel break",
            meta: "Governed funnel sequence",
            answerTitle: "The first material break is identity-to-engagement.",
            summary:
              "The stage is down 0.8 points, concentrated in paid social traffic and first-time visitors. Downstream purchase conversion remains stable.",
            findings: [
              ["Stage", "Identity to engagement is the first material break."],
              ["Cohort", "First-time visitors explain most of the decline."],
              ["Channel", "Paid social is 1.6 points below baseline."],
            ],
          },
          {
            title: "Compare member and non-member journeys",
            meta: "Cohort comparison",
            answerTitle: "Member journeys remain materially stronger at every stage.",
            summary:
              "The largest advantage is engagement-to-purchase, where members convert 12.4 points above non-members.",
            findings: [
              ["Identity", "Member identification is stable."],
              ["Purchase", "Members lead by 12.4 points."],
              ["Repeat", "The gap widens again at 30-day repeat."],
            ],
          },
          {
            title: "Suggest the next diagnostic cut",
            meta: "Based on the current signal",
            answerTitle: "Review paid social first-time visitors by landing experience.",
            summary:
              "This cut is most likely to explain the engagement loss without adding unnecessary dimensions.",
            findings: [
              ["Priority", "Paid social first-time visitors."],
              ["Dimension", "Landing experience and campaign source."],
              ["Avoid", "Do not broaden to all channels yet."],
            ],
          },
        ],
      },
    ],
  },
  abo: {
    title: "ABO",
    kicker: "DC Media Performance / ABO",
    group: "dc",
    category: "DC Media Performance",
    description:
      "Tracks online e-commerce platform campaigns and performance across Tmall, JD, Douyin, and Rednote, covering traffic, conversion, and business intake.",
    health: "Partial delay",
    healthClass: "health-warn",
    status: "Data delayed",
    freshness: "Conversion backflow has gaps; some dashboards will show fallback blanks",
    sourceStrip: ["Tmall data: 2026-05-28", "JD data: 2026-05-28", "Douyin data: 2026-05-28"],
    image: "/assets/images/project-abo-tabby.png",
    owner: "DC Media",
    accent: "#a67870",
    reports: [
      {
        title: "Audience Build Overview",
        type: "Platform campaign",
        description:
          "Overview of e-commerce platform campaigns, traffic intake, and conversion performance.",
        owner: "DC Media",
        cadence: "Campaign",
        updated: "2026-05-28",
        purpose:
          "Understand whether audience packages reached the intended consumers at enough scale and quality to support campaign outcomes.",
        bestFor: ["Audience activation", "Platform comparison", "Scale and quality"],
        steps: [
          "Validate audience package and platform mapping.",
          "Compare activated reach and qualified engagement.",
          "Check conversion backflow completeness.",
          "Separate audience quality from delivery pressure.",
        ],
        metrics: [
          ["Activated reach", "18.4M", "+9.2%"],
          ["Quality rate", "72.1%", "+3.1pt"],
          ["Engagement", "2.8M", "+6.4%"],
          ["Backflow", "91.6%", "2 gaps"],
        ],
        chart: [
          ["TM", 88, 72],
          ["JD", 73, 64],
          ["DY", 84, 69],
          ["RN", 66, 58],
          ["WX", 59, 52],
          ["OT", 44, 39],
        ],
        knowledgeIds: [
          "abo-report-context",
          "abo-activation-model",
          "campaign-roi",
          "campaign-anomaly-review",
          "investment-principles",
          "analysis-guardrails",
          "personal-campaign-notes",
        ],
        recommendations: [
          {
            title: "Review audience quality by platform",
            meta: "Scale and quality together",
            answerTitle: "Tmall and Douyin combine the strongest scale and quality.",
            summary:
              "JD remains efficient but smaller. Rednote has healthy engagement quality, while incomplete conversion backflow limits the final outcome view.",
            findings: [
              ["Tmall", "Highest qualified reach at stable frequency."],
              ["Douyin", "Strong engagement quality and scale."],
              ["Rednote", "Outcome confidence is limited by backflow."],
            ],
          },
          {
            title: "Explain the backflow gaps",
            meta: "Data quality before optimization",
            answerTitle: "Two platform gaps affect outcome metrics, not delivery metrics.",
            summary:
              "Delivery, reach, and engagement remain complete. Conversion and ROI for Rednote and one JD campaign are provisional.",
            findings: [
              ["Complete", "Reach and engagement are trustworthy."],
              ["Affected", "Conversion and ROI are provisional."],
              ["Next", "Wait for recovery before reallocating spend."],
            ],
          },
          {
            title: "Create an audience activation brief",
            meta: "Campaign-ready summary",
            answerTitle: "Audience activation is healthy, with a narrow measurement caveat.",
            summary:
              "Scale and quality are above plan. The recommended action is to preserve Tmall and Douyin pressure while holding ROI-based changes for affected campaigns.",
            findings: [
              ["Scale", "Activated reach is 9.2% above plan."],
              ["Quality", "Quality rate improved 3.1 points."],
              ["Action", "Hold ROI-based changes on incomplete backflow."],
            ],
          },
        ],
      },
      {
        title: "Campaign Quality Watch",
        type: "Performance tracking",
        description:
          "Monitors campaign performance and data backflow across Tmall, JD, Douyin, and Rednote.",
        owner: "Media Analytics",
        cadence: "Daily",
        updated: "2026-05-28",
        purpose:
          "Detect campaign movement early while separating genuine optimization signals from data latency and measurement noise.",
        bestFor: ["Campaign monitoring", "Anomaly review", "Optimization"],
        steps: [
          "Check data completeness and delivery pacing.",
          "Find material movement in quality and conversion.",
          "Compare against campaign and audience context.",
          "Recommend action only when evidence is complete.",
        ],
        metrics: [
          ["Spend", "¥12.6M", "96% pace"],
          ["Campaign ROI", "2.18", "Provisional"],
          ["Quality rate", "70.8%", "+2.4pt"],
          ["Anomalies", "3", "1 actionable"],
        ],
        chart: [
          ["TM", 82, 70],
          ["JD", 69, 61],
          ["DY", 77, 66],
          ["RN", 61, 55],
          ["AM", 53, 47],
          ["PM", 72, 63],
        ],
        knowledgeIds: [
          "abo-report-context",
          "abo-activation-model",
          "campaign-roi",
          "campaign-anomaly-review",
          "analysis-guardrails",
          "source-integrity-review",
          "personal-campaign-notes",
        ],
        recommendations: [
          {
            title: "Review today's campaign anomalies",
            meta: "Checks quality before action",
            answerTitle: "One anomaly is actionable; two are measurement-related.",
            summary:
              "Douyin campaign frequency is above the agreed range and quality is beginning to fall. Rednote and JD alerts are caused by incomplete conversion backflow.",
            findings: [
              ["Action", "Reduce Douyin frequency pressure."],
              ["Wait", "Rednote ROI is provisional."],
              ["Monitor", "JD backflow recovery is expected today."],
            ],
          },
          {
            title: "Explain campaign ROI movement",
            meta: "Definition and backflow aware",
            answerTitle: "Reported ROI is down, but the complete-platform view is stable.",
            summary:
              "The decline is largely caused by missing Rednote conversion backflow. Tmall, JD complete campaigns, and Douyin are within normal movement.",
            findings: [
              ["Reported", "ROI is 2.18 and provisional."],
              ["Adjusted", "Complete-platform ROI is 2.34."],
              ["Caveat", "Do not use the reported number for reallocation yet."],
            ],
          },
          {
            title: "Recommend the next optimization",
            meta: "Evidence-backed action",
            answerTitle: "Reduce frequency on one Douyin campaign and preserve other settings.",
            summary:
              "This is the only change supported by complete delivery and outcome evidence today.",
            findings: [
              ["Change", "Reduce Douyin frequency pressure."],
              ["Preserve", "Tmall and complete JD campaigns."],
              ["Wait", "Rednote until backflow recovery."],
            ],
          },
        ],
      },
    ],
  },
  rednote: {
    title: "Rednote Tracking",
    kicker: "DG Media Tracking / Rednote",
    group: "dg",
    category: "DG Media Tracking",
    description:
      "Analyzes Rednote post-campaign performance across note performance, core TA audiences, brand keywords, interactions, impressions, and clicks.",
    health: "Healthy",
    healthClass: "health-good",
    status: "Ready",
    freshness: "Rednote Juguang API updated through 2026-05-29 10:00",
    sourceStrip: ["Data updated: 2026-05-29 10:00"],
    image: "/assets/images/project-rednote-tabby.png",
    owner: "DG Media",
    accent: "#a66f72",
    reports: [
      {
        title: "Rednote Media Tracking",
        type: "Campaign performance",
        description:
          "Tracks Rednote post-campaign impressions, clicks, interactions, spend, and conversion performance.",
        owner: "DG Media",
        cadence: "Daily",
        updated: "2026-05-29 10:00",
        purpose:
          "Connect media delivery and audience response to campaign efficiency with governed Rednote definitions and caveats.",
        bestFor: ["Media tracking", "Campaign efficiency", "Audience response"],
        steps: [
          "Validate campaign and creative mapping.",
          "Compare delivery, reach, and engagement quality.",
          "Check attribution completeness before ROI.",
          "Prioritize material platform or audience movement.",
        ],
        metrics: [
          ["Impressions", "142M", "+11.3%"],
          ["Qualified reach", "38.6M", "+8.7%"],
          ["Engagement", "4.2M", "+9.1%"],
          ["Campaign ROI", "1.86", "+5.4%"],
        ],
        chart: [
          ["W1", 58, 49],
          ["W2", 64, 54],
          ["W3", 69, 58],
          ["W4", 75, 61],
          ["W5", 82, 68],
          ["W6", 86, 71],
        ],
        knowledgeIds: [
          "rednote-report-context",
          "rednote-model",
          "campaign-roi",
          "qualified-reach-rate",
          "quality-reach",
          "campaign-anomaly-review",
          "analysis-guardrails",
        ],
        recommendations: [
          {
            title: "Summarize Rednote media performance",
            meta: "Delivery through outcome",
            answerTitle: "Media performance improved with healthy quality and efficiency.",
            summary:
              "Qualified reach and engagement grew faster than impressions, indicating better delivery quality. ROI is positive with complete attribution for the reviewed campaigns.",
            findings: [
              ["Reach", "Qualified reach increased 8.7%."],
              ["Quality", "Engagement grew faster than impressions."],
              ["ROI", "Campaign ROI improved 5.4%."],
            ],
          },
          {
            title: "Explain reach versus quality reach",
            meta: "Uses governed definitions",
            answerTitle: "Quality filters remove 18% of platform-reported reach.",
            summary:
              "Most exclusions come from frequency, viewability, and placement rules. The gap is stable and does not indicate a new issue.",
            findings: [
              ["Platform", "Reported reach is 47.1M."],
              ["Qualified", "Governed qualified reach is 38.6M."],
              ["Reason", "Frequency and viewability explain most exclusions."],
            ],
          },
          {
            title: "Find inefficient campaign segments",
            meta: "Audience and placement scan",
            answerTitle: "Two placement groups have scale without equivalent engagement.",
            summary:
              "Low-intent discovery placements are above the frequency threshold and below the campaign engagement baseline.",
            findings: [
              ["Placement", "Discovery group C has the largest gap."],
              ["Audience", "Broad-interest audiences are less efficient."],
              ["Action", "Reduce pressure and test tighter interest groups."],
            ],
          },
        ],
      },
      {
        title: "Creative Quality Monitor",
        type: "Note analysis",
        description:
          "Analyzes note performance, core TA audiences, brand keywords, and content engagement quality.",
        owner: "Content Analytics",
        cadence: "Daily",
        updated: "2026-05-29 10:00",
        purpose:
          "Identify which creative patterns drive qualified attention and translate repeatable content learning into campaign decisions.",
        bestFor: ["Creative review", "Content patterns", "Keyword learning"],
        steps: [
          "Check creative approval and delivery coverage.",
          "Compare quality engagement by note and format.",
          "Identify audience, keyword, and content patterns.",
          "Separate repeatable learning from one-off outliers.",
        ],
        metrics: [
          ["Active notes", "286", "+24"],
          ["Quality engagement", "3.1M", "+12.4%"],
          ["Save rate", "4.8%", "+0.7pt"],
          ["Top patterns", "6", "3 repeatable"],
        ],
        chart: [
          ["Story", 82, 68],
          ["Craft", 76, 64],
          ["Style", 71, 59],
          ["Gift", 63, 54],
          ["UGC", 58, 51],
          ["Brand", 52, 47],
        ],
        knowledgeIds: [
          "rednote-report-context",
          "rednote-model",
          "qualified-reach-rate",
          "quality-reach",
          "campaign-anomaly-review",
          "personal-campaign-notes",
        ],
        recommendations: [
          {
            title: "Find repeatable creative patterns",
            meta: "Your common content review",
            answerTitle: "Craft detail and personal styling are the most repeatable patterns.",
            summary:
              "Both patterns perform across creators, audiences, and paid pressure levels. Gift-led content is strong but more campaign-specific.",
            findings: [
              ["Craft", "Strong save and qualified engagement rates."],
              ["Styling", "Consistent across three audience groups."],
              ["Gift", "High impact with lower repeatability."],
            ],
          },
          {
            title: "Explain the top note performance",
            meta: "Audience, keyword, and format",
            answerTitle: "The top note combines craft detail with a high-fit audience.",
            summary:
              "Performance is supported by qualified reach, save rate, and branded search lift rather than impressions alone.",
            findings: [
              ["Audience", "High-fit fashion enthusiasts."],
              ["Format", "Close-detail carousel with personal styling."],
              ["Signal", "Save rate is 2.1 times the campaign average."],
            ],
          },
          {
            title: "Create creative guidance for the next brief",
            meta: "Reusable learning",
            answerTitle: "Lead with product craft, then make styling personally useful.",
            summary:
              "The next brief should prioritize detail-led storytelling, credible personal styling, and one clear brand cue without overloading the note.",
            findings: [
              ["Lead", "Product craft and detail."],
              ["Use", "Credible personal styling."],
              ["Avoid", "Multiple competing brand messages."],
            ],
          },
        ],
      },
    ],
  },
  ottolv: {
    title: "OTT/OLV Media Data Tracking",
    kicker: "DG Media Tracking / OTT OLV",
    group: "dg",
    category: "DG Media Tracking",
    description:
      "Tracks OTT/OLV media data returned by Miaozhen tracking, focusing on impressions, clicks, reach, frequency, and related media metrics.",
    health: "Healthy",
    healthClass: "health-good",
    status: "Ready",
    freshness: "OTT/OLV data and campaign map are updated",
    sourceStrip: ["Data updated: 2026-05-28"],
    image: "/assets/images/project-ottolv-tabby.png",
    owner: "Media Measurement",
    accent: "#748aa0",
    reports: [
      {
        title: "OTT / OLV Exposure Tracking",
        type: "Media performance",
        description: "Impressions, clicks, reach, and frequency from Miaozhen tracking media data.",
        owner: "Media Measurement",
        cadence: "Weekly",
        updated: "2026-05-28",
        purpose:
          "Evaluate whether video investment reached the intended audience with enough quality and appropriate frequency.",
        bestFor: ["Exposure review", "Reach and frequency", "Placement quality"],
        steps: [
          "Confirm campaign mapping and monitored source coverage.",
          "Compare impressions, deduplicated reach, and quality reach.",
          "Review frequency and placement distribution.",
          "Explain efficiency within measurement limits.",
        ],
        metrics: [
          ["Impressions", "386M", "+7.6%"],
          ["Qualified reach", "82.4M", "+6.2%"],
          ["Frequency", "4.7", "+0.3"],
          ["Viewability", "76.8%", "+2.4pt"],
        ],
        chart: [
          ["OTT", 86, 72],
          ["OLV", 74, 65],
          ["CTV", 79, 67],
          ["Pre", 68, 59],
          ["Mid", 61, 54],
          ["Out", 48, 43],
        ],
        knowledgeIds: [
          "ott-report-context",
          "ott-reach-model",
          "qualified-reach-rate",
          "quality-reach",
          "analysis-guardrails",
          "source-integrity-review",
        ],
        recommendations: [
          {
            title: "Review reach and frequency efficiency",
            meta: "Governed measurement scope",
            answerTitle: "Reach growth is healthy, but OTT frequency is nearing its upper range.",
            summary:
              "Qualified reach increased 6.2% and viewability improved. OTT frequency reached 5.1 in two placements, where incremental reach is beginning to flatten.",
            findings: [
              ["Reach", "Qualified reach grew 6.2%."],
              ["Frequency", "Two OTT placements reached 5.1."],
              ["Action", "Shift incremental pressure toward efficient OLV placements."],
            ],
          },
          {
            title: "Explain platform reach versus quality reach",
            meta: "Definition and filter trace",
            answerTitle: "Quality rules remove 14% of monitored reach.",
            summary:
              "Viewability, frequency, and placement exclusions account for the difference. The gap improved by 1.8 points versus the prior campaign.",
            findings: [
              ["Monitored", "Reach before quality filters is 95.8M."],
              ["Qualified", "Governed qualified reach is 82.4M."],
              ["Trend", "The quality gap narrowed 1.8 points."],
            ],
          },
          {
            title: "Recommend a placement adjustment",
            meta: "Reach curve and quality",
            answerTitle: "Move incremental pressure from saturated OTT to high-viewability OLV.",
            summary:
              "This preserves qualified reach growth while reducing frequency concentration and improving placement efficiency.",
            findings: [
              ["Reduce", "Two saturated OTT placements."],
              ["Increase", "High-viewability OLV inventory."],
              ["Monitor", "Deduplicated reach after the shift."],
            ],
          },
        ],
      },
      {
        title: "Source Integrity Monitor",
        type: "Data monitoring",
        description:
          "Monitors freshness, completeness, and field mapping status of OTT/OLV media data.",
        owner: "Data Governance",
        cadence: "Daily",
        updated: "2026-05-28",
        purpose:
          "Make data trust visible before teams interpret performance or ask AI to recommend an action.",
        bestFor: ["Data quality", "Source recovery", "Impact tracing"],
        steps: [
          "Check source arrival and row completeness.",
          "Validate campaign mapping and field consistency.",
          "Trace affected metrics and reports.",
          "Document recovery status and decision impact.",
        ],
        metrics: [
          ["Sources healthy", "11 / 12", "1 watch"],
          ["Completeness", "98.7%", "+0.4pt"],
          ["Mapped campaigns", "97.9%", "+1.1pt"],
          ["Affected reports", "1", "Low impact"],
        ],
        chart: [
          ["Fresh", 94, 90],
          ["Rows", 88, 84],
          ["Map", 91, 86],
          ["Schema", 96, 92],
          ["Fields", 89, 85],
          ["Back", 78, 72],
        ],
        knowledgeIds: [
          "ott-report-context",
          "ott-reach-model",
          "analysis-guardrails",
          "source-integrity-review",
          "qualified-reach-rate",
          "quality-reach",
        ],
        recommendations: [
          {
            title: "Summarize current data health",
            meta: "Impact-first status",
            answerTitle: "One delayed source has low business impact.",
            summary:
              "Eleven of twelve sources are healthy. A delayed OLV placement file affects one low-volume campaign and does not change the current reach conclusion.",
            findings: [
              ["Health", "11 of 12 sources are healthy."],
              ["Issue", "One OLV placement file is delayed."],
              ["Impact", "One low-volume campaign is provisional."],
            ],
          },
          {
            title: "Trace affected reports and metrics",
            meta: "Knowledge graph impact",
            answerTitle: "One report and two metrics are partially affected.",
            summary:
              "OTT / OLV Exposure Tracking has a provisional placement cut. Qualified reach and viewability are complete at total campaign level.",
            findings: [
              ["Report", "OTT / OLV Exposure Tracking."],
              ["Affected", "Placement-level frequency and viewability."],
              ["Unaffected", "Total campaign qualified reach."],
            ],
          },
          {
            title: "Create a recovery note",
            meta: "Clear owner and next step",
            answerTitle: "Recovery is expected before the next scheduled refresh.",
            summary:
              "Media Measurement is reprocessing the delayed file. No business action should be blocked; only the affected placement cut should remain provisional.",
            findings: [
              ["Owner", "Media Measurement."],
              ["ETA", "Before the next scheduled refresh."],
              ["Guidance", "Keep one placement cut provisional."],
            ],
          },
        ],
      },
    ],
  },
};

export const KNOWLEDGE_ASSETS = [
  {
    id: "investment-principles",
    category: "principles",
    type: "Principles",
    mark: "PR",
    title: "Campaign investment decision principles",
    summary:
      "Shared guardrails for evaluating investment pressure, conversion efficiency, and the confidence required before recommending action.",
    source: "Shared",
    stage: "solidify",
    owner: "Sarah Chen",
    updated: "2 days ago",
    created: "Jul 18, 2026",
    projects: ["city", "fourp", "abo"],
    aiUse: [
      "Applies agreed decision guardrails before recommending budget movement.",
      "Separates directional signals from evidence strong enough for action.",
      "Explains when a recommendation conflicts with an existing principle.",
    ],
    connections: [
      { name: "Invest City Strategy Analysis", kind: "Report" },
      { name: "Campaign ROI", kind: "Metric" },
      { name: "Opportunity scan", kind: "Playbook" },
    ],
    href: "reports.html?project=city&dashboard=0",
  },
  {
    id: "analysis-guardrails",
    category: "principles",
    type: "Principles",
    mark: "PR",
    title: "Trusted analysis guardrails",
    summary:
      "Minimum checks for freshness, metric consistency, comparison windows, and business context before an AI answer is decision-ready.",
    source: "Shared",
    stage: "calibrate",
    owner: "Michael Liu",
    updated: "Yesterday",
    created: "Jul 19, 2026",
    projects: ["city", "fourp", "customer", "abo", "rednote", "ottolv"],
    aiUse: [
      "Checks source freshness before summarizing movement.",
      "Flags inconsistent definitions across reports.",
      "States confidence and missing context in material conclusions.",
    ],
    connections: [
      { name: "Source Integrity Monitor", kind: "Report" },
      { name: "Data quality review", kind: "Playbook" },
    ],
    href: "reports.html?project=ottolv&dashboard=1",
  },
  {
    id: "city-report-context",
    category: "context",
    type: "Report Context",
    mark: "RC",
    title: "City Strategy report context",
    summary:
      "Purpose, audience, comparison logic, and guardrails for the Invest City Strategy report.",
    source: "Shared",
    stage: "calibrate",
    owner: "Emily Wang",
    updated: "3 days ago",
    created: "Jul 17, 2026",
    projects: ["city"],
    aiUse: [
      "Frames answers within the report's intended scope.",
      "Uses the approved comparison window and hierarchy.",
      "Flags when a request is outside the governed report boundary.",
    ],
    connections: [
      { name: "Invest City Strategy Analysis", kind: "Report" },
      { name: "City Strategy Dashboard", kind: "Dashboard" },
    ],
    href: "reports.html?project=city&dashboard=0",
  },
  {
    id: "fourp-report-context",
    category: "context",
    type: "Report Context",
    mark: "RC",
    title: "4P performance context",
    summary:
      "Approved interpretation of Place, Price, Product, and Promotion performance within the governed 4P framework.",
    source: "Shared",
    stage: "solidify",
    owner: "David Zhang",
    updated: "1 week ago",
    created: "Jul 13, 2026",
    projects: ["fourp"],
    aiUse: [
      "Interprets 4P metrics using the approved framework.",
      "Flags when a metric is missing or redefined.",
      "Suggests the right drill-down for a 4P question.",
    ],
    connections: [
      { name: "4P Executive Overview", kind: "Report" },
      { name: "Promotion Lift Analysis", kind: "Report" },
    ],
    href: "reports.html?project=fourp&dashboard=0",
  },
  {
    id: "customer-report-context",
    category: "context",
    type: "Report Context",
    mark: "RC",
    title: "Customer journey context",
    summary:
      "Business intent and interpretation rules for the Customer Daily Pulse and Customer Funnel Watch reports.",
    source: "Shared",
    stage: "calibrate",
    owner: "Jessica Li",
    updated: "Yesterday",
    created: "Jul 19, 2026",
    projects: ["customer"],
    aiUse: [
      "Frames customer journey answers within the governed funnel stages.",
      "Uses approved conversion definitions and windows.",
      "Flags when a question requires a different report.",
    ],
    connections: [
      { name: "Customer Daily Pulse", kind: "Report" },
      { name: "Customer Funnel Watch", kind: "Report" },
    ],
    href: "reports.html?project=customer&dashboard=0",
  },
  {
    id: "abo-report-context",
    category: "context",
    type: "Report Context",
    mark: "RC",
    title: "ABO campaign quality context",
    summary:
      "Business intent and interpretation rules for the ABO campaign quality and performance reports.",
    source: "Shared",
    stage: "solidify",
    owner: "Alex Johnson",
    updated: "2 days ago",
    created: "Jul 18, 2026",
    projects: ["abo"],
    aiUse: [
      "Frames ABO campaign answers within the approved quality framework.",
      "Uses governed attribution and comparison logic.",
      "Flags when a metric is missing or redefined.",
    ],
    connections: [
      { name: "ABO Campaign Quality", kind: "Report" },
      { name: "ABO Performance Dashboard", kind: "Dashboard" },
    ],
    href: "reports.html?project=abo&dashboard=0",
  },
  {
    id: "rednote-report-context",
    category: "context",
    type: "Report Context",
    mark: "RC",
    title: "Rednote reporting context",
    summary:
      "Business intent and interpretation rules for the Rednote social media tracking and performance reports.",
    source: "Shared",
    stage: "calibrate",
    owner: "Rachel Kim",
    updated: "3 days ago",
    created: "Jul 17, 2026",
    projects: ["rednote"],
    aiUse: [
      "Frames Rednote answers within the approved social media framework.",
      "Uses governed engagement and conversion definitions.",
      "Flags when a question requires a different report.",
    ],
    connections: [
      { name: "Rednote Tracking Dashboard", kind: "Dashboard" },
      { name: "Social Media Performance", kind: "Report" },
    ],
    href: "reports.html?project=rednote&dashboard=0",
  },
  {
    id: "ottolv-report-context",
    category: "context",
    type: "Report Context",
    mark: "RC",
    title: "OTT and OLV measurement context",
    summary:
      "Measurement scope, deduplication logic, and comparison rules for the OTT and OLV media data tracking reports.",
    source: "Shared",
    stage: "solidify",
    owner: "James Brown",
    updated: "1 week ago",
    created: "Jul 13, 2026",
    projects: ["ottolv"],
    aiUse: [
      "Frames OTT/OLV answers within the approved media measurement framework.",
      "Uses governed deduplication and comparison logic.",
      "Flags when a metric is missing or redefined.",
    ],
    connections: [
      { name: "OTT/OLV Media Data Tracking", kind: "Report" },
      { name: "Media Performance Dashboard", kind: "Dashboard" },
    ],
    href: "reports.html?project=ottolv&dashboard=0",
  },
  {
    id: "channel-data-model",
    category: "models",
    type: "Data Model",
    mark: "DM",
    title: "Channel data model",
    summary:
      "Governed grain, lineage, and quality context for the Channel dimension and related fact tables.",
    source: "Shared",
    stage: "calibrate",
    owner: "Kevin Zhao",
    updated: "2 weeks ago",
    created: "Jul 6, 2026",
    projects: ["city", "fourp", "customer", "abo", "rednote", "ottolv"],
    aiUse: [
      "Provides governed grain and lineage for channel-related queries.",
      "Ensures consistent channel definitions across reports.",
      "Flags when a query requires a different data model.",
    ],
    connections: [
      { name: "Channel Dimension", kind: "Table" },
      { name: "Promotion Fact Table", kind: "Table" },
    ],
    href: "data-model.html?asset=channel-data-model",
  },
  {
    id: "metric-dictionary-member-conversion",
    category: "metrics",
    type: "Metric Dictionary",
    mark: "MD",
    title: "Member conversion",
    metric_type: "Base",
    summary:
      "Share of identified member visits that result in a qualified transaction within the governed conversion window.",
    source: "Shared",
    stage: "calibrate",
    owner: "Amy Wu",
    updated: "Yesterday",
    created: "Jul 19, 2026",
    projects: ["customer"],
    aiUse: [
      "Provides the governed definition and formula for member conversion.",
      "Ensures consistent conversion calculations across reports.",
      "Flags when a query uses a different conversion definition.",
    ],
    connections: [
      { name: "Customer Funnel Watch", kind: "Report" },
      { name: "Customer Daily Pulse", kind: "Report" },
    ],
    href: "metric-dictionary.html?asset=metric-dictionary-member-conversion",
  },
  {
    id: "metric-dictionary-campaign-roi",
    category: "metrics",
    type: "Metric Dictionary",
    mark: "MD",
    title: "Campaign ROI",
    metric_type: "Calculated",
    summary:
      "Attributed campaign revenue divided by governed media spend, using the approved attribution and comparison window.",
    source: "Shared",
    stage: "solidify",
    owner: "Tom Anderson",
    updated: "2 days ago",
    created: "Jul 18, 2026",
    projects: ["city", "fourp", "abo"],
    aiUse: [
      "Provides the governed definition and formula for campaign ROI.",
      "Ensures consistent ROI calculations across reports.",
      "Flags when a query uses a different attribution logic.",
    ],
    connections: [
      { name: "Campaign Performance Dashboard", kind: "Dashboard" },
      { name: "Investment Analysis", kind: "Report" },
    ],
    href: "metric-dictionary.html?asset=metric-dictionary-campaign-roi",
  },
  {
    id: "metric-dictionary-promotion-lift",
    category: "metrics",
    type: "Metric Dictionary",
    mark: "MD",
    title: "Promotion lift",
    metric_type: "Calculated",
    summary:
      "Incremental performance versus the approved baseline after controlling for channel, product mix, and comparison period.",
    source: "Shared",
    stage: "co-build",
    owner: "Linda Park",
    updated: "3 days ago",
    created: "Jul 17, 2026",
    projects: ["fourp"],
    aiUse: [
      "Provides the governed definition and formula for promotion lift.",
      "Ensures consistent lift calculations across reports.",
      "Flags when a query uses a different baseline or comparison.",
    ],
    connections: [
      { name: "Promotion Lift Analysis", kind: "Report" },
      { name: "4P Executive Overview", kind: "Report" },
    ],
    href: "metric-dictionary.html?asset=metric-dictionary-promotion-lift",
  },
  {
    id: "business-term-gmv",
    category: "terms",
    type: "Business Term",
    mark: "BT",
    title: "GMV (Gross Merchandise Value)",
    summary:
      "Total value of merchandise sold through the platform before deductions, used as a primary revenue indicator.",
    source: "Shared",
    stage: "calibrate",
    owner: "Chris Martinez",
    updated: "1 week ago",
    created: "Jul 13, 2026",
    projects: ["city", "fourp", "customer", "abo"],
    aiUse: [
      "Provides the governed definition for GMV across all reports.",
      "Ensures consistent GMV calculations and comparisons.",
      "Flags when a query uses a different revenue definition.",
    ],
    connections: [
      { name: "Revenue Dashboard", kind: "Dashboard" },
      { name: "Sales Performance Report", kind: "Report" },
    ],
    href: "/assets/pages/knowledge.html?asset=business-term-gmv",
  },
  {
    id: "playbook-opportunity-scan",
    category: "playbooks",
    type: "Analytical Model",
    mark: "PB",
    title: "Opportunity scan playbook",
    summary:
      "Repeatable routine for identifying and prioritizing growth opportunities across channels and regions.",
    source: "Shared",
    stage: "calibrate",
    owner: "Current User",
    updated: "2 weeks ago",
    created: "Jul 6, 2026",
    projects: ["city", "fourp"],
    aiUse: [
      "Guides the opportunity scan process with governed steps.",
      "Ensures consistent opportunity identification and prioritization.",
      "Flags when a scan requires additional context or data.",
    ],
    connections: [
      { name: "City Strategy Dashboard", kind: "Dashboard" },
      { name: "4P Executive Overview", kind: "Report" },
    ],
    href: "/assets/pages/knowledge.html?asset=playbook-opportunity-scan",
  },
  {
    id: "personal-memory-city",
    category: "memory",
    type: "Personal Memory",
    mark: "PM",
    title: "City strategy preferences",
    summary:
      "Private preferences, observations, and habits for the City Strategy analysis and reporting.",
    source: "Personal",
    stage: "co-build",
    owner: "Ryan Miller",
    updated: "Just now",
    created: "Jul 20, 2026",
    projects: ["city"],
    aiUse: [
      "Remembers personal preferences for city strategy analysis.",
      "Suggests relevant reports and metrics based on past behavior.",
      "Flags when a preference conflicts with governed definitions.",
    ],
    connections: [{ name: "City Strategy Dashboard", kind: "Dashboard" }],
    href: "/assets/pages/knowledge.html?asset=personal-memory-city",
  },
];


export const CATEGORY_LABELS = {
  all: "All knowledge",
  context: "Report context",
  models: "Models",
  metrics: "Metrics",
  terms: "Business terms",
  playbooks: "Analysis playbooks",
  principles: "Principles",
  memory: "My memory",
};

export const STAGE_LABELS = { "co-build": "Co-build", solidify: "Solidify", calibrate: "Calibrate" };

export function pluralize(count, singular, plural) {
  return count + " " + (count === 1 ? singular : plural || singular + "s");
}

/** Knowledge assets linked to a report: resolvable ids scoped to the project. */
export function resolveReportAssets(projectKey, report) {
  return (report.knowledgeIds || [])
    .map((id) => KNOWLEDGE_ASSETS.find((asset) => asset.id === id))
    .filter(Boolean)
    .filter((asset) => !asset.projects || asset.projects.includes(projectKey));
}

/** All-mode catalog search text for a project (title/kicker/category/description + reports + asset titles). */
export function projectSearchText(projectKey, project) {
  const knowledge = project.reports.reduce(
    (titles, report) => titles.concat(resolveReportAssets(projectKey, report).map((asset) => asset.title)),
    [],
  );
  return [project.title, project.kicker, project.category, project.description]
    .concat(project.reports.map((report) => [report.title, report.type, report.description, report.owner].join(" ")))
    .concat(knowledge)
    .join(" ")
    .toLowerCase();
}

/** Project-mode search text for one report row. */
export function reportSearchText(projectKey, project, report) {
  const knowledgeText = resolveReportAssets(projectKey, report)
    .map((asset) => asset.title)
    .join(" ");
  return [report.title, report.type, report.description, report.owner, knowledgeText].join(" ").toLowerCase();
}

/**
 * Static knowledge-asset pill sections inside the report details drawer.
 * The original drawer hard-codes these pills (city-scoped hrefs) for every
 * report — they are markup content, not resolved from knowledgeIds.
 */
export const DETAILS_ASSET_SECTIONS = [
  {
    label: "PRINCIPLES",
    pills: [
      { label: "City Strategy report context", href: "/assets/pages/knowledge.html?report=city&category=principles&asset=city-strategy-context" },
      { label: "Campaign ROI shared guardrails", href: "/assets/pages/knowledge.html?report=city&category=principles&asset=campaign-roi" },
    ],
  },
  {
    label: "REPORT CONTEXT",
    pills: [
      { label: "City Strategy report context", href: "/assets/pages/knowledge.html?report=city&category=context&asset=city-report-context" },
      { label: "City performance model", href: "/assets/pages/knowledge.html?report=city&category=context&asset=city-performance-model" },
      { label: "Invested city definition", href: "/assets/pages/knowledge.html?report=city&category=context&asset=invested-city" },
    ],
  },
  {
    label: "DATA MODEL",
    pills: [
      { label: "City performance model", href: "/assets/pages/knowledge.html?report=city&category=models&asset=city-performance-model" },
      { label: "Commerce performance model", href: "/assets/pages/knowledge.html?report=city&category=models&asset=commerce-performance-model" },
      { label: "Member conversion model", href: "/assets/pages/knowledge.html?report=city&category=models&asset=member-conversion" },
    ],
  },
  {
    label: "METRICS",
    pills: [
      { label: "Qualified reach rate", href: "/assets/pages/knowledge.html?report=city&category=metrics&asset=qualified-reach-rate" },
      { label: "Quality reach", href: "/assets/pages/knowledge.html?report=city&category=metrics&asset=quality-reach" },
      { label: "Analysis guardrails", href: "/assets/pages/knowledge.html?report=city&category=metrics&asset=analysis-guardrails" },
    ],
  },
  {
    label: "BUSINESS TERMS",
    pills: [
      { label: "Investment principles", href: "/assets/pages/knowledge.html?report=city&category=terms&asset=investment-principles" },
      { label: "Weekly city readout", href: "/assets/pages/knowledge.html?report=city&category=terms&asset=weekly-city-readout" },
    ],
  },
  {
    label: "ANALYTICAL MODEL",
    pills: [
      { label: "Funnel drop review", href: "/assets/pages/knowledge.html?report=city&category=playbooks&asset=funnel-drop-review" },
      { label: "Campaign anomaly review", href: "/assets/pages/knowledge.html?report=city&category=playbooks&asset=campaign-anomaly-review" },
    ],
  },
];

/** Catalog links — same targets as the original `reports.html?…` URLs under the demo host. */
export function projectCatalogHref(projectKey) {
  return "/assets/pages/reports.html?project=" + projectKey;
}

export function liveReportHref(projectKey, reportIndex) {
  return "/assets/pages/reports.html?project=" + projectKey + "&dashboard=" + reportIndex + "&view=live";
}

export const REPORT_CATALOG_HREF = "/assets/pages/reports.html";

export const KNOWLEDGE_HREF = "/assets/pages/knowledge.html";

/** Mirrors the original `data-details-project` click resolution in report-core.js. */
export function resolveReportContext(projectKey, report) {
  const contexts = KNOWLEDGE_ASSETS.filter((asset) => asset.type === "Report Context");
  return (
    contexts.find((asset) =>
      (asset.connections || []).some((connection) => connection.name === report.title)
    ) ||
    contexts.find((asset) => (report.knowledgeIds || []).includes(asset.id)) ||
    contexts.find((asset) => (asset.projects || []).includes(projectKey)) ||
    null
  );
}

export function reportContextHref(projectKey, report) {
  const context = resolveReportContext(projectKey, report);
  if (!context) return KNOWLEDGE_HREF;
  return KNOWLEDGE_HREF + "?type=Report%20Context&detail=" + encodeURIComponent(context.id);
}

/* ---------------------------------------------------------------------------
 * Six-city invest analysis embed — the live view of `city` report index 0.
 * Constants, seeded scenario generator, labels, and chart helpers are verbatim
 * ports of the original `sc*` block in assets/js/reports/report-core.js so the
 * deterministic demo output matches byte-for-byte. The original `isDefault`
 * check (`f.city.includes("Total")`) is kept exactly: the city filter carries
 * city names, never "Total", so every render — including the default state —
 * takes the seeded-variation branch.
 * ------------------------------------------------------------------------- */

export function isCityInvestReport(projectKey, reportIndex) {
  return projectKey === "city" && reportIndex === 0;
}

export const SC_TITLE = "Invest City Strategy Analysis（6 Cities）";
export const SC_FOOTNOTE =
  "*Non-invest city: Excluding stores in Invest cities; from FY27P01 onward, 11 cities are excluded (6 before FY27P01). Only Comp Stores are counted.";
export const SC_BASE_PERIOD = "FY25 P4–P9";
export const SC_INVEST_START = "FY25 P11";
export const SC_FORMULA =
  "Uplift = Invest City Var% − Non Invest City Var%；Var% = Invest / Base × 100%";

export const SC_CATS = [
  "FY25P4", "FY25P5", "FY25P6", "FY25P7", "FY25P8", "FY25P9", "FY25P10", "FY25P11",
  "FY25P12", "FY26P1", "FY26P2", "FY26P3", "FY26P4", "FY26P5", "FY26P6", "FY26P7",
  "FY26P8", "FY26P9", "FY26P10", "FY26P11", "FY26P12", "FY27P1", "FY27P2", "FY27P3",
];

export const SC_BASELINE = {
  SV: {
    t: [26, 25, 24, 23, 22, 23, 24, 23, 22, 22, 23, 22.6, 23, 22, 22, 22.5, 21.8, 22.2, 21.5, 22, 21.7, 22.3, 21.9, 22.1],
    n: [24, 25, 24, 23, 22, 23, 25, 24, 23, 23, 24, 23, 24, 23, 23, 23.5, 22.8, 23.2, 22.5, 23, 22.7, 23.1, 22.9, 23.0],
  },
  "New%": {
    t: [50, 51, 49, 52, 53, 51, 50, 49, 48, 47, 48, 49, 50, 49, 48, 48, 49, 47, 48, 49, 48, 48, 49, 48],
    n: [45, 46, 44, 47, 48, 46, 45, 44, 43, 42, 43, 44, 45, 44, 43, 43, 44, 42, 43, 44, 43, 43, 44, 43],
  },
  AT: {
    t: [320, 315, 322, 318, 310, 305, 300, 295, 290, 295, 300, 305, 310, 308, 306, 304, 307, 305, 308, 305, 307, 306, 309, 307],
    n: [308, 302, 310, 305, 298, 294, 290, 286, 282, 286, 290, 295, 300, 298, 296, 294, 297, 295, 298, 295, 297, 296, 299, 297],
  },
  AUR: {
    t: [290, 285, 292, 288, 280, 275, 270, 265, 262, 268, 272, 278, 282, 280, 279, 277, 280, 278, 281, 279, 280, 278, 281, 280],
    n: [282, 278, 285, 280, 274, 270, 266, 262, 260, 264, 268, 272, 276, 274, 273, 271, 274, 272, 275, 273, 274, 272, 275, 274],
  },
  "CR%": {
    t: [9, 8.5, 9.2, 8.8, 8, 7.5, 7, 6.8, 6.5, 6.8, 7, 7.2, 7.5, 7.3, 7.1, 6.9, 7.1, 6.8, 7, 6.9, 7, 6.9, 7.1, 7],
    n: [7, 6.8, 7.1, 6.9, 6.4, 6.1, 5.8, 5.6, 5.4, 5.6, 5.8, 6, 6.2, 6.1, 6, 5.9, 6.1, 5.8, 6, 5.9, 6, 5.9, 6.1, 6],
  },
  UPT: {
    t: [1.30, 1.29, 1.31, 1.28, 1.25, 1.22, 1.20, 1.18, 1.15, 1.18, 1.20, 1.22, 1.24, 1.23, 1.22, 1.21, 1.22, 1.20, 1.21, 1.20, 1.21, 1.20, 1.21, 1.20],
    n: [1.22, 1.21, 1.23, 1.20, 1.18, 1.16, 1.14, 1.12, 1.10, 1.12, 1.14, 1.16, 1.18, 1.17, 1.16, 1.15, 1.16, 1.14, 1.15, 1.14, 1.15, 1.14, 1.15, 1.14],
  },
};

export const SC_CHART_ORDER = ["SV", "New%", "AT", "AUR", "CR%", "UPT"];

export const SC_END_OPTIONS = [
  "FY27 P3", "FY27 P2", "FY27 P1", "FY26 P12", "FY26 P11", "FY26 P10", "FY26 P9",
  "FY26 P8", "FY26 P7", "FY26 P6", "FY26 P5", "FY26 P4", "FY26 P3", "FY26 P2",
  "FY26 P1", "FY25 P12", "FY25 P11",
];

export const SC_END_IDX = {
  "FY25 P11": 7, "FY25 P12": 8, "FY26 P1": 9, "FY26 P2": 10, "FY26 P3": 11,
  "FY26 P4": 12, "FY26 P5": 13, "FY26 P6": 14, "FY26 P7": 15, "FY26 P8": 16,
  "FY26 P9": 17, "FY26 P10": 18, "FY26 P11": 19, "FY26 P12": 20, "FY27 P1": 21,
  "FY27 P2": 22, "FY27 P3": 23,
};

export const SC_START_IDX = SC_CATS.indexOf("FY25P11");

export const SC_KPI = [
  { key: "ADT", name: "Avg Daily Traffic", uplift: 10, var: 116, baseAfter: 0.4, fmt: "K", dec: 1 },
  { key: "ADS", name: "Avg Daily Sales", uplift: 1, var: 6, baseAfter: 8, fmt: "K", dec: 0 },
  { key: "New", name: "New%", uplift: -2, var: -15, trend: "New%", baseAfter: 57, fmt: "%", dec: 0 },
  { key: "SV", name: "SV", uplift: -8, var: -18, trend: "SV", baseAfter: 22.6, fmt: "num", dec: 1 },
  { key: "SC", name: "Sales Contribution", uplift: null, var: null, baseAfter: 20, fmt: "%2" },
  { key: "CR", name: "CR%", uplift: -9, var: -15, trend: "CR%", baseAfter: 8, fmt: "%", dec: 0 },
  { key: "AT", name: "AT", uplift: 0, var: -8, trend: "AT", baseAfter: 314.7, fmt: "num", dec: 1 },
  { key: "UPT", name: "UPT", uplift: -1, var: -2, trend: "UPT", baseAfter: 1.2, fmt: "num", dec: 1 },
  { key: "AUR", name: "AUR", uplift: 1, var: 0, trend: "AUR", baseAfter: 274.7, fmt: "num", dec: 1 },
  { key: "TAM", name: "TAM(K)", uplift: null, var: null, baseAfter: 4581, fmt: "int" },
];

export const SC_KPI_ROWS = [
  ["ADT", "ADS", "New", "SV", "SC"],
  ["CR", "AT", "UPT", "AUR", "TAM"],
];

export const SC_CITY_STORES = {
  Chengdu: ["Wangfujing", "Mixc Mall", "Ifs", "Lotte", "Chicony Dps", "Skp", "Time Outlet", "Florentia Village", "Times Outlets 2", "Shanshan Outlet Plaza"],
  Hefei: ["Intime", "Mixc", "Sasseur Outlet"],
  Qingdao: ["Mixc", "Hisense", "Bailian Outlets"],
  Shenzhen: ["King Glory", "Mixc Mall", "Maoye", "Haiya Mega Mall", "Uni Walk (Yifang City)", "Pafc Mall", "Coh Cn Mixc World", "No.8 Warehouse Outlet", "Shanshan Outlet Pop Up"],
  Wuhan: ["International Plaza", "Chicony", "Dream Plaza", "Skp Permanent Store", "Bailian Outlet", "Florentia Village", "Shouchuang Outlet Temp"],
  Xian: ["Saga", "City On (Taubman)", "Skp Women'S", "Skp Men'S", "Kaiyuan", "Coh Cn Dt51", "Sean Outlet", "Sasseur Outlet", "Coh Cn Mixc"],
};

export const SC_ALL_STORES = [...new Set(Object.values(SC_CITY_STORES).flat())];
export const SC_CITY_OPTIONS = ["Chengdu", "Hefei", "Qingdao", "Shenzhen", "Wuhan", "Xian"];
export const SC_CHANNEL_OPTIONS = ["All", "Offline Outlet", "Offline Retail", "Online"];
export const SC_PILOT_OPTIONS = ["Pilot TTL", "Pilot Comp"];

export function scHashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function scMulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scFmtAfter(meta, v) {
  if (meta.fmt === "K") return v.toFixed(meta.dec) + "K";
  if (meta.fmt === "%") return v.toFixed(meta.dec) + "%";
  if (meta.fmt === "%2") return Math.round(v) + "%";
  if (meta.fmt === "int") return Math.round(v).toLocaleString("en-US");
  return v.toFixed(meta.dec);
}

export function scGenScenario(f) {
  const isDefault =
    f.channel === "All" && f.pilot === "Pilot TTL" && f.city.includes("Total") && f.end === "FY27 P3";
  const seedStr = [f.channel, f.pilot, f.city.slice().sort().join(","), f.store.slice().sort().join(","), f.end].join("|");
  const rng = scMulberry32(scHashStr(seedStr));
  const endIdx = SC_END_IDX[f.end] ?? 14;
  const trends = {};
  SC_CHART_ORDER.forEach(function (m) {
    if (isDefault) {
      trends[m] = { t: SC_BASELINE[m].t.slice(), n: SC_BASELINE[m].n.slice() };
    } else {
      const fT = 0.88 + rng() * 0.24;
      const fN = 0.88 + rng() * 0.24;
      trends[m] = {
        t: SC_BASELINE[m].t.map(function (v) { return v * fT * (1 + (rng() - 0.5) * 0.06); }),
        n: SC_BASELINE[m].n.map(function (v) { return v * fN * (1 + (rng() - 0.5) * 0.06); }),
      };
    }
  });
  const kpi = {};
  SC_KPI.forEach(function (meta) {
    let uplift = meta.uplift;
    let vari = meta.var;
    let after = meta.baseAfter;
    if (meta.trend) after = trends[meta.trend].t[endIdx];
    if (!isDefault) {
      if (meta.key === "ADT" || meta.key === "ADS") {
        after = meta.baseAfter * (0.86 + rng() * 0.28);
      } else if (meta.key === "SC") {
        after = 13 + rng() * 14;
      } else if (meta.key === "TAM") {
        after = 3900 + rng() * 1900;
      }
      if (meta.uplift !== null) {
        uplift = Math.round(meta.uplift + (rng() - 0.5) * 10);
        vari = Math.round(meta.var + (rng() - 0.5) * 28);
      }
    }
    kpi[meta.key] = { uplift: uplift, vari: vari, after: after };
  });
  return { trends: trends, kpi: kpi, endIdx: endIdx, isDefault: isDefault };
}

export function scPickTicks(len) {
  if (len <= 3) return Array.from({ length: len }, function (_, i) { return i; });
  const step = Math.max(2, Math.round((len - 1) / 6));
  const out = [];
  for (let i = 0; i < len; i += step) out.push(i);
  if (out[out.length - 1] !== len - 1) out.push(len - 1);
  if (out.length >= 3 && out[out.length - 1] - out[out.length - 2] === 1) out.splice(out.length - 2, 1);
  return out;
}

export function scStoreOptionsFor(cities) {
  if (cities.length === 0) return SC_ALL_STORES;
  return [
    ...new Set(
      cities.filter(function (c) { return SC_CITY_STORES[c]; }).flatMap(function (c) { return SC_CITY_STORES[c]; })
    ),
  ];
}

export function scStoreScopeSuffix(cities) {
  if (cities.length === 0) return "";
  if (cities.length === 1) return "· " + cities[0];
  if (cities.length === 2) return "· " + cities.join(" + ");
  return "· " + cities.length + " Cities";
}

export function scTotalLabel(cities) {
  if (cities.length === 0) return "Total";
  const full = cities.length === SC_CITY_OPTIONS.length && SC_CITY_OPTIONS.every(function (x) { return cities.includes(x); });
  if (full) return "Total";
  if (cities.length <= 2) return cities.join(" + ");
  return cities.length + " Cities";
}

/** Multi-select display label — the original refresh() branch (no "All" sentinel option). */
export function scSelectionLabel(selected, optionCount) {
  if (selected.length === 0) return "(None)";
  if (selected.length === optionCount) return "All Stores";
  return selected.length > 2
    ? selected.slice(0, 2).join(", ") + " +" + (selected.length - 2)
    : selected.join(", ");
}
