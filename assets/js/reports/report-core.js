const knowledgeAssets = window.marketingKnowledgeAssets || [];

const reportGroups = [
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

const projects = {
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
    image: "../images/project-city-tabby.png",
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
    image: "../images/project-fourp-tabby.png",
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
    image: "../images/project-customer-tabby.png",
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
    image: "../images/project-abo-tabby.png",
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
    image: "../images/project-rednote-tabby.png",
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
    image: "../images/project-ottolv-tabby.png",
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

const categoryLabels = {
  all: "All knowledge",
  context: "Report context",
  models: "Models",
  metrics: "Metrics",
  terms: "Business terms",
  playbooks: "Analysis playbooks",
  principles: "Principles",
  memory: "My memory",
};

const stageLabels = { "co-build": "Co-build", solidify: "Solidify", calibrate: "Calibrate" };
const query = new URLSearchParams(window.location.search);
const catalogView = document.querySelector("#catalogView");
const reportView = document.querySelector("#reportView");
const liveView = document.querySelector("#liveView");
const reportCatalog = document.querySelector("#reportCatalog");
const reportSearch = document.querySelector("#reportSearch");
const reportEmpty = document.querySelector("#reportEmpty");
const categoryDirectory = document.querySelector("#categoryDirectory");
const projectDirectory = document.querySelector("#projectDirectory");
const knowledgeFilters = document.querySelector("#knowledgeFilters");
const connectedKnowledge = document.querySelector("#connectedKnowledge");
const aiWorkspace = document.querySelector("#aiWorkspace");
const aiScrim = document.querySelector("#aiScrim");
const reportDetailsDrawer = document.querySelector("#reportDetailsDrawer");
const detailsScrim = document.querySelector("#detailsScrim");
const detailsFullscreenBtn = document.querySelector("#detailsFullscreen");
const scenariosViewMoreBtn = document.querySelector("#scenariosViewMore");
if (scenariosViewMoreBtn) {
  scenariosViewMoreBtn.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    var cont = document.querySelector("#detailsScenarios");
    if (!cont) return;
    if (cont.classList.contains("show-all")) return;
    cont.classList.add("show-all");
  };
}
if (detailsFullscreenBtn) {
  detailsFullscreenBtn.addEventListener("click", function () {
    var drawer = reportDetailsDrawer;
    if (!drawer) return;
    drawer.classList.toggle("fullscreen");
    var isFullscreen = drawer.classList.contains("fullscreen");
    if (isFullscreen) {
      try {
        document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
      } catch (e) {}
    } else {
      try {
        document.fullscreenElement && document.exitFullscreen();
      } catch (e) {}
    }
  });
}

const initialCatalogProject =
  query.get("dashboard") === null && projects[query.get("project")] ? query.get("project") : "all";
let activeCatalogProject = initialCatalogProject;
let activeProject = projects[query.get("project")] ? query.get("project") : "city";
let activeReportIndex = Number.isFinite(Number(query.get("dashboard")))
  ? Number(query.get("dashboard"))
  : 0;
let activeKnowledgeCategory = "all";
let detailsReturnFocus = null;

function activeReport() {
  const project = projects[activeProject] || projects.city;
  const index = project.reports[activeReportIndex] ? activeReportIndex : 0;
  return { project: project, report: project.reports[index], index: index };
}

function isAiEnabled() {
  return true;
}

function updateAiVisibility() {
  if (!isAiEnabled() && aiWorkspace.classList.contains("open")) closeAi();
}

function activeAssistantProfile() {
  const current = activeReport();
  return (
    current.report.assistant || {
      panelTitle: "Data Analysis Assistant",
      greeting: "Hi! I'm your data analysis mentor.",
      intro: "The active report context has been loaded, and I'm ready to help you explore it.",
      summaryTitle: current.report.title + " Quick Summary",
      contextTitle: current.report.title,
      scope: current.project.title,
      timeFrame: current.report.cadence + " report / updated " + current.report.updated,
      summary: "The active report context has been loaded, and I'm ready to help you explore it.",
      periodHint: "Type your question directly or start with a preset analysis below.",
      examples: [
        { label: "Data Insights", prompt: "Help me analyze this report" },
        { label: "Comparative Analysis", prompt: "Compare the main metrics in this report" },
        {
          label: "Anomaly Diagnosis",
          prompt: "Identify unusual movements compared with the baseline",
        },
      ],
    }
  );
}

function reportKnowledge(projectKey, report) {
  return report.knowledgeIds
    .map(function (id) {
      return knowledgeAssets.find(function (asset) {
        return asset.id === id;
      });
    })
    .filter(Boolean)
    .filter(function (asset) {
      return !asset.projects || asset.projects.includes(projectKey);
    });
}

function setUrl(params) {
  const next = new URL(window.location.href);
  next.search = params;
  window.history.replaceState({}, "", next);
}

function showView(view) {
  catalogView.hidden = view !== "catalog";
  reportView.hidden = view !== "report";
  liveView.hidden = view !== "live";
  window.scrollTo({ top: 0, behavior: "instant" });
  updateAiVisibility();
}

function renderMockReport(report, project) {
  const bars = report.chart
    .map(function (item) {
      return (
        "<div class='mock-bar-group'><i style='height:" +
        item[1] +
        "%'></i><b style='height:" +
        item[2] +
        "%'></b></div>"
      );
    })
    .join("");
  const rows = report.chart
    .slice(0, 5)
    .map(function (item, index) {
      return (
        "<div class='mock-list-row'><i style='opacity:" +
        (1 - index * 0.11) +
        "'></i><span></span><b>" +
        item[0] +
        "</b></div>"
      );
    })
    .join("");
  const kpis = report.metrics
    .map(function (metric) {
      return (
        "<div class='mock-kpi'><span>" +
        metric[0] +
        "</span><strong>" +
        metric[1] +
        "</strong><small>" +
        metric[2] +
        "</small></div>"
      );
    })
    .join("");
  return (
    "<div class='mock-report' style='--preview-accent:" +
    project.accent +
    "'>" +
    "<div class='mock-topbar'><div class='mock-brand'><i></i>COACH PERFORMANCE</div><div class='mock-controls'><i></i><i></i><i></i></div></div>" +
    "<div class='mock-report-body'><div class='mock-report-title'><div><i class='mock-title-line'></i><i class='mock-subtitle-line'></i></div><span class='mock-date'>UPDATED " +
    report.updated.toUpperCase() +
    "</span></div>" +
    "<div class='mock-kpis'>" +
    kpis +
    "</div><div class='mock-grid'><div class='mock-panel'><div class='mock-panel-head'><strong>PERFORMANCE MOVEMENT</strong><i></i></div><div class='mock-bars'>" +
    bars +
    "</div></div>" +
    "<div class='mock-panel'><div class='mock-panel-head'><strong>PRIORITY VIEW</strong><i></i></div><div class='mock-list'>" +
    rows +
    "</div></div></div></div></div>"
  );
}

function pluralize(count, singular, plural) {
  return count + " " + (count === 1 ? singular : plural || singular + "s");
}

function projectSearchText(projectKey) {
  const project = projects[projectKey];
  const knowledge = project.reports.reduce(function (titles, report) {
    return titles.concat(
      reportKnowledge(projectKey, report).map(function (asset) {
        return asset.title;
      }),
    );
  }, []);
  return [project.title, project.kicker, project.category, project.description]
    .concat(
      project.reports.map(function (report) {
        return [report.title, report.type, report.description, report.owner].join(" ");
      }),
    )
    .concat(knowledge)
    .join(" ")
    .toLowerCase();
}

function renderProjectCard(projectKey) {
  const project = projects[projectKey];
  const updated = project.sourceStrip[0] || "Update schedule available in project";
  return (
    "<article class='report-project-card'>" +
    "<a class='report-project-image' href='reports.html?project=" +
    projectKey +
    "' aria-label='View " +
    project.title +
    " reports'><img src='" +
    project.image +
    "' alt='' /></a>" +
    "<div class='report-project-body'><div class='report-project-topline'><span>" +
    project.kicker +
    "</span></div>" +
    "<h3><a href='reports.html?project=" +
    projectKey +
    "'>" +
    project.title +
    "</a></h3>" +
    "<p>" +
    project.description +
    "</p>" +
    "<div class='report-project-footer'><span>" +
    updated +
    "</span><a href='reports.html?project=" +
    projectKey +
    "'>View Dashboards <i aria-hidden='true'>&#8594;</i></a></div></div></article>"
  );
}

function renderReportRow(item) {
  const liveHref =
    "reports.html?project=" + item.projectKey + "&dashboard=" + item.index + "&view=live";
  const assets = reportKnowledge(item.projectKey, item.report);
  return (
    "<article class='project-report-row' data-project='" +
    item.projectKey +
    "'>" +
    "<div class='report-row-index'><span>REPORT</span><strong>" +
    String(item.index + 1).padStart(2, "0") +
    "</strong></div>" +
    "<div class='report-row-main'><span class='report-row-path'>" +
    item.project.category +
    " / " +
    item.project.title +
    " / " +
    item.report.type +
    "</span>" +
    "<h3><a href='" +
    liveHref +
    "'>" +
    item.report.title +
    "</a></h3><p>" +
    item.report.description +
    "</p></div>" +
    "<dl class='report-row-meta'><div><dt>Owner</dt><dd>" +
    item.report.owner +
    "</dd></div><div><dt>Cadence</dt><dd>" +
    item.report.cadence +
    "</dd></div><div><dt>Updated</dt><dd>" +
    item.report.updated +
    "</dd></div><div><dt>Knowledge</dt><dd>" +
    pluralize(assets.length, "asset") +
    "</dd></div></dl>" +
    "<div class='report-row-actions'><button class='details-action' type='button' data-details-project='" +
    item.projectKey +
    "' data-details-report='" +
    item.index +
    "' aria-label='Open knowledge for " +
    item.report.title +
    "'>Knowledge</button>" +
    "<a class='report-row-open' href='" +
    liveHref +
    "'>Open Dashboard <span aria-hidden='true'>&#8594;</span></a></div></article>"
  );
}

function renderCatalog() {
  if (!categoryDirectory || !projectDirectory || !reportCatalog) return;
  const search = reportSearch ? reportSearch.value.trim().toLowerCase() : "";

  if (activeCatalogProject !== "all" && projects[activeCatalogProject]) {
    const project = projects[activeCatalogProject];
    const items = project.reports
      .map(function (report, index) {
        return { projectKey: activeCatalogProject, project: project, report: report, index: index };
      })
      .filter(function (item) {
        const knowledgeText = reportKnowledge(item.projectKey, item.report)
          .map(function (asset) {
            return asset.title;
          })
          .join(" ");
        const searchable = [
          item.report.title,
          item.report.type,
          item.report.description,
          item.report.owner,
          knowledgeText,
        ]
          .join(" ")
          .toLowerCase();
        return !search || searchable.includes(search);
      });

    categoryDirectory.hidden = true;
    projectDirectory.hidden = false;
    const cd1 = document.querySelector("#catalogDescription");
    if (cd1)
      cd1.textContent =
        "Open a dashboard, or review its connected models, metrics, knowledge, and AI analysis scenarios.";
    if (reportSearch) reportSearch.placeholder = "Search dashboards";
    document.querySelector("#projectDirectoryImage").src = project.image;
    document.querySelector("#projectDirectoryImage").alt = project.title + " report preview";
    document.querySelector("#projectDirectoryKicker").textContent = project.kicker;
    document.querySelector("#projectDirectoryTitle").textContent = project.title;
    document.querySelector("#projectDirectoryDescription").textContent = project.description;
    document.querySelector("#projectDirectoryCount").textContent = pluralize(
      project.reports.length,
      "dashboard",
    );
    document.querySelector("#projectDirectoryUpdated").textContent =
      project.sourceStrip[0] || "Update schedule available in project";
    document.querySelector("#projectReportCount").textContent = pluralize(
      items.length,
      "dashboard",
    );
    reportCatalog.innerHTML = items.map(renderReportRow).join("");
    reportEmpty.hidden = items.length > 0;
    return;
  }

  activeCatalogProject = "all";
  categoryDirectory.hidden = false;
  projectDirectory.hidden = true;
  const cd2 = document.querySelector("#catalogDescription");
  if (cd2)
    cd2.textContent =
      "Browse dashboard projects by business area, then open a dashboard or review its governed context.";
  if (reportSearch) reportSearch.placeholder = "Search dashboards";

  let visibleProjectCount = 0;
  categoryDirectory.innerHTML = reportGroups
    .filter(function (group) {
      return group.id !== "all";
    })
    .map(function (group) {
      const projectKeys = Object.keys(projects).filter(function (projectKey) {
        return (
          projects[projectKey].group === group.id &&
          (!search || projectSearchText(projectKey).includes(search))
        );
      });
      if (!projectKeys.length) return "";
      visibleProjectCount += projectKeys.length;
      const categoryMark =
        { consumer: "CI", dc: "DC", dg: "DG" }[group.id] || group.id.slice(0, 2).toUpperCase();
      return (
        "<section class='report-category-section' aria-labelledby='category-" +
        group.id +
        "'>" +
        "<header class='report-category-heading'><div><span class='report-category-mark' aria-hidden='true'>" +
        categoryMark +
        "</span><h2 id='category-" +
        group.id +
        "'>" +
        group.label +
        "</h2></div></header>" +
        "<div class='report-project-grid'>" +
        projectKeys.map(renderProjectCard).join("") +
        "</div></section>"
      );
    })
    .join("");
  reportEmpty.hidden = visibleProjectCount > 0;
}

function renderRelationshipMap(assets, report) {
  const preferred = ["models", "metrics", "terms", "playbooks"];
  const nodes = preferred
    .map(function (category) {
      const matches = assets.filter(function (asset) {
        return asset.category === category;
      });
      const asset = matches[0];
      return (
        "<div class='relationship-node'><span>" +
        categoryLabels[category] +
        "</span><strong>" +
        (asset ? asset.title : "Connected knowledge") +
        "</strong><small>" +
        matches.length +
        (matches.length === 1 ? " asset" : " assets") +
        "</small></div>"
      );
    })
    .join("");
  document.querySelector("#relationshipMap").innerHTML =
    "<div class='relationship-node report-node'><span>Report</span><strong>" +
    report.title +
    "</strong><small>Current context</small></div><div class='relationship-arrow' aria-hidden='true'>&#8594;</div>" +
    nodes;
}

function renderKnowledgeFilters(assets) {
  const categories = [
    "all",
    "context",
    "models",
    "metrics",
    "terms",
    "playbooks",
    "principles",
    "memory",
  ].filter(function (category) {
    return (
      category === "all" ||
      assets.some(function (asset) {
        return asset.category === category;
      })
    );
  });
  knowledgeFilters.innerHTML = categories
    .map(function (category) {
      const count =
        category === "all"
          ? assets.length
          : assets.filter(function (asset) {
              return asset.category === category;
            }).length;
      return (
        "<button class='" +
        (activeKnowledgeCategory === category ? "active" : "") +
        "' type='button' data-knowledge-category='" +
        category +
        "'>" +
        categoryLabels[category] +
        " " +
        count +
        "</button>"
      );
    })
    .join("");
}

function renderConnectedKnowledge() {
  const current = activeReport();
  const assets = reportKnowledge(activeProject, current.report);
  if (
    activeKnowledgeCategory !== "all" &&
    !assets.some(function (asset) {
      return asset.category === activeKnowledgeCategory;
    })
  ) {
    activeKnowledgeCategory = "all";
  }
  const visible =
    activeKnowledgeCategory === "all"
      ? assets
      : assets.filter(function (asset) {
          return asset.category === activeKnowledgeCategory;
        });
  renderKnowledgeFilters(assets);
  connectedKnowledge.innerHTML = visible
    .map(function (asset) {
      return (
        "<article class='knowledge-card' data-category='" +
        asset.category +
        "'><span class='knowledge-mark'>" +
        asset.mark +
        "</span><div class='knowledge-card-main'><span>" +
        asset.type +
        "</span><h3>" +
        asset.title +
        "</h3><p>" +
        asset.summary +
        "</p><div class='knowledge-card-meta'><span>" +
        asset.owner +
        "</span><span>&middot;</span><span>" +
        stageLabels[asset.stage] +
        "</span></div></div><a href='knowledge.html?report=" +
        activeProject +
        "&category=" +
        asset.category +
        "&asset=" +
        asset.id +
        "' aria-label='Open " +
        asset.title +
        " in Knowledge'>&#8594;</a></article>"
      );
    })
    .join("");
  renderRelationshipMap(assets, current.report);
}

function renderReportContext() {
  const current = activeReport();
  const project = current.project;
  const report = current.report;
  const statusIndicator = document.querySelector(".status-indicator");
  document.querySelector("#reportCategory").textContent =
    project.category + " / " + project.title + " / " + report.type;
  document.querySelector("#reportStatus").textContent = project.status;
  statusIndicator.classList.toggle("warning", project.status !== "Ready");
  document.querySelector("#reportTitle").textContent = report.title;
  document.querySelector("#reportDescription").textContent = report.description;
  document.querySelector("#reportOwner").textContent = report.owner;
  document.querySelector("#reportCadence").textContent = report.cadence;
  document.querySelector("#reportUpdated").textContent = report.updated;
  document.querySelector("#reportPurpose").textContent = report.purpose;
  document.querySelector("#reportPreview").innerHTML = renderMockReport(report, project);

  const assets = reportKnowledge(activeProject, report);
  const modelCount = assets.filter(function (asset) {
    return asset.category === "models";
  }).length;
  const metricCount = assets.filter(function (asset) {
    return asset.category === "metrics";
  }).length;
  document.querySelector("#previewContextStrip").innerHTML =
    "<div><span>Knowledge context</span><strong>" +
    pluralize(assets.length, "connected asset") +
    "</strong></div><div><span>Governed lineage</span><strong>" +
    pluralize(modelCount, "model") +
    " / " +
    pluralize(metricCount, "metric") +
    "</strong></div><div><span>Freshness</span><strong>" +
    project.freshness +
    "</strong></div>";

  const knowledgeButton = document.querySelector("#fullKnowledgeLink");
  const knowledgeSection = document.querySelector("#reportKnowledge");
  knowledgeButton.href = "#reportKnowledge";
  knowledgeButton.onclick = function (event) {
    event.preventDefault();
    const top = knowledgeSection.getBoundingClientRect().top + window.scrollY - 112;
    window.scrollTo({ top: top, behavior: "smooth" });
  };
  document.querySelector("#viewAllKnowledge").href = "knowledge.html?report=" + activeProject;
  activeKnowledgeCategory = "all";
  renderConnectedKnowledge();
  showView("report");
}

function openReport(projectKey, reportIndex, updateUrl) {
  activeProject = projects[projectKey] ? projectKey : "city";
  activeReportIndex = projects[activeProject].reports[Number(reportIndex)]
    ? Number(reportIndex)
    : 0;
  openLiveReport(updateUrl);
}

function knowledgeHref(projectKey, asset) {
  return (
    "knowledge.html?report=" + projectKey + "&category=" + asset.category + "&asset=" + asset.id
  );
}

function renderDetailsAssets(projectKey, assets) {
  if (!assets.length) return "<p class='details-empty'>No linked assets in this category.</p>";
  return assets
    .map(function (asset) {
      return (
        "<a class='details-asset' href='" +
        knowledgeHref(projectKey, asset) +
        "'><span class='details-asset-mark'>" +
        asset.mark +
        "</span><span><strong>" +
        asset.title +
        "</strong><small>" +
        asset.summary +
        "</small></span><i aria-hidden='true'>&#8594;</i></a>"
      );
    })
    .join("");
}

function openDetails(projectKey, reportIndex, trigger) {
  const project = projects[projectKey];
  const report = project && project.reports[Number(reportIndex)];
  if (!project || !report) return;
  const assets = reportKnowledge(projectKey, report);
  const dataModels = assets.filter(function (asset) {
    return asset.category === "models";
  });
  const metrics = assets.filter(function (asset) {
    return asset.category === "metrics";
  });
  const related = assets.filter(function (asset) {
    return !["models", "metrics"].includes(asset.category);
  });

  closeAi();
  detailsReturnFocus = trigger || document.activeElement;
  document.querySelector("#detailsProjectLabel").textContent = project.title;
  document.querySelector("#detailsThumbnail").src = project.image;
  document.querySelector("#detailsThumbnail").alt = project.title + " report preview";
  document.querySelector("#detailsHierarchy").textContent =
    project.category + " / " + project.title + " / " + report.type;
  // detailsPrinciples, detailsReportContext, detailsDataModel, detailsMetrics, detailsBusinessTerms, detailsPlaybooks are static in HTML
  document.querySelector("#detailsExplanation").textContent = report.description;
  document.querySelector("#detailsMeta").innerHTML = [
    ["Owner", report.owner],
    ["Cadence", report.cadence],
    ["Updated", report.updated],
  ]
    .map(function (item) {
      return "<div><dt>" + item[0] + "</dt><dd>" + item[1] + "</dd></div>";
    })
    .join("");
  var scenariosContainer = document.querySelector("#detailsScenarios");
  scenariosContainer.classList.remove("show-all");
  scenariosContainer.innerHTML = report.recommendations
    .map(function (scenario, index) {
      var isExtra = index >= 3;
      return (
        "<li class='" +
        (isExtra ? "scenario-extra" : "") +
        "'><span>0" +
        (index + 1) +
        "</span><div><strong>" +
        scenario.title +
        "</strong><small>" +
        scenario.meta +
        "</small></div></li>"
      );
    })
    .join("");
  /* Click to toggle active state on scenario cards */
  scenariosContainer.querySelectorAll("li").forEach(function (li) {
    li.addEventListener("click", function () {
      scenariosContainer.querySelectorAll("li").forEach(function (other) {
        other.classList.remove("active");
      });
      this.classList.add("active");
    });
  });
  document.querySelector("#detailsOpenReport").href =
    "reports.html?project=" + projectKey + "&dashboard=" + Number(reportIndex) + "&view=live";

  detailsScrim.hidden = false;
  reportDetailsDrawer.classList.add("open");
  reportDetailsDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("details-open");
  document.querySelector("[data-close-details]").focus();
}

function closeDetails() {
  if (!reportDetailsDrawer.classList.contains("open")) return;
  reportDetailsDrawer.classList.remove("open");
  reportDetailsDrawer.setAttribute("aria-hidden", "true");
  detailsScrim.hidden = true;
  document.body.classList.remove("details-open");
  if (detailsReturnFocus && document.contains(detailsReturnFocus)) detailsReturnFocus.focus();
  detailsReturnFocus = null;
}

function renderLiveOverview(project, report) {
  const kpis = report.metrics
    .map(function (metric) {
      return (
        "<article class='live-kpi'><span>" +
        metric[0] +
        "</span><strong>" +
        metric[1] +
        "</strong><small>" +
        metric[2] +
        "</small></article>"
      );
    })
    .join("");
  const bars = report.chart
    .map(function (item) {
      return (
        "<div class='live-chart-group'><i style='height:" +
        item[1] +
        "%'></i><b style='height:" +
        item[2] +
        "%'></b><span>" +
        item[0] +
        "</span></div>"
      );
    })
    .join("");
  const ranks = report.chart
    .slice(0, 5)
    .map(function (item, index) {
      return (
        "<div class='live-rank-row'><span>0" +
        (index + 1) +
        "</span><div><strong>" +
        item[0] +
        "</strong><i style='width:" +
        item[1] +
        "%;--preview-accent:" +
        project.accent +
        "'></i></div><b>" +
        item[1] +
        "</b></div>"
      );
    })
    .join("");
  return (
    "<div class='live-dashboard'><div class='live-kpis'>" +
    kpis +
    "</div><div class='live-grid'><section class='live-card'><header class='live-card-head'><div><span>PERFORMANCE</span><h2>Current period versus baseline</h2></div><span>Primary / comparison</span></header><div class='live-chart'>" +
    bars +
    "</div></section><section class='live-card'><header class='live-card-head'><div><span>PRIORITY</span><h2>Leading views</h2></div><span>Index</span></header><div class='live-rank-list'>" +
    ranks +
    "</div></section></div></div>"
  );
}

function renderLiveDrivers(report) {
  const source = report.recommendations[0].findings
    .concat(report.recommendations[1].findings)
    .slice(0, 5);
  const items = source
    .map(function (finding, index) {
      return (
        "<div class='driver-item'><span>0" +
        (index + 1) +
        "</span><div><strong>" +
        finding[0] +
        "</strong><p>" +
        finding[1] +
        "</p></div><b>" +
        (index < 2 ? "Material" : "Watch") +
        "</b></div>"
      );
    })
    .join("");
  const questions = report.recommendations
    .map(function (item, index) {
      return (
        "<button class='ai-recommendation' type='button' data-ai-mode='analysis' data-open-recommendation='" +
        index +
        "'><span><strong>" +
        item.title +
        "</strong><small>" +
        item.meta +
        "</small></span><span>→</span></button>"
      );
    })
    .join("");
  return (
    "<div class='drivers-layout'><section class='driver-rank'><h2>Material drivers</h2>" +
    items +
    "</section><section class='driver-rank'><h2>Continue with AI</h2><div class='ai-recommendations'>" +
    questions +
    "</div></section></div>"
  );
}

function renderLiveDefinitions(report) {
  const assets = reportKnowledge(activeProject, report).filter(function (asset) {
    return ["models", "metrics", "terms"].includes(asset.category);
  });
  const rows = assets
    .map(function (asset) {
      return (
        "<div class='definition-row'><strong>" +
        asset.title +
        "</strong><span>" +
        asset.type +
        "</span><span>" +
        asset.owner +
        "</span><a href='knowledge.html?report=" +
        activeProject +
        "&category=" +
        asset.category +
        "&asset=" +
        asset.id +
        "'>View definition →</a></div>"
      );
    })
    .join("");
  return (
    "<section class='definition-list'><h2>Governed models and definitions</h2>" +
    rows +
    "</section>"
  );
}

function openLiveReport(updateUrl) {
  const current = activeReport();
  document.querySelector("#liveKicker").textContent =
    current.project.title.toUpperCase() + " / LIVE REPORT";
  document.querySelector("#liveTitle").textContent = current.report.title;
  const liveHost = document.querySelector("#live-panel-overview");
  if (isCityInvestReport()) {
    liveHost.innerHTML = renderCityInvestDashboard();
    initCityInvestDashboard(liveHost);
  } else {
    liveHost.innerHTML = renderLiveOverview(
      current.project,
      current.report,
    );
  }
  if (updateUrl !== false)
    setUrl("?project=" + activeProject + "&dashboard=" + activeReportIndex + "&view=live");
  showView("live");
}

function renderAiRecommendations() {
  const current = activeReport();
  const profile = activeAssistantProfile();
  const recommendations = current.report.recommendations;

  var aiGreeting = document.querySelector("#aiGreeting");
  if (aiGreeting) aiGreeting.textContent = profile.greeting;
  var aiIntroCopy = document.querySelector("#aiIntroCopy");
  if (aiIntroCopy) aiIntroCopy.textContent = profile.intro;
  var aiQuestionGuide = document.querySelector("#aiQuestionGuide");
  if (aiQuestionGuide) aiQuestionGuide.hidden = false;
  var aiQuestionExamples = document.querySelector("#aiQuestionExamples");
  if (aiQuestionExamples) {
    aiQuestionExamples.innerHTML = profile.examples
      .map(function (example, index) {
        return (
          "<button class='ai-question-example' type='button' data-ai-example='" +
          index +
          "'><span>" +
          example.prompt +
          "</span><i aria-hidden='true'>&#8594;</i></button>"
        );
      })
      .join("");
  }
  var recsContainer = document.querySelector("#aiRecommendations");
  if (recsContainer) {
    recsContainer.classList.remove("show-all");
    recsContainer.innerHTML = recommendations
      .map(function (item, index) {
        var isExtra = index >= 3;
        return (
          "<button class='ai-recommendation" +
          (isExtra ? " rec-extra" : "") +
          "' type='button' data-ai-recommendation='" +
          index +
          "'><i class='ai-recommendation-index'>0" +
          (index + 1) +
          "</i><span><strong>" +
          item.title +
          "</strong></span><span aria-hidden='true'>&#8594;</span></button>"
        );
      })
      .join("");
  }
  var aiPeriodHint = document.querySelector("#aiPeriodHint");
  if (aiPeriodHint) aiPeriodHint.textContent = profile.periodHint;
  var aiCommandInput = document.querySelector("#aiCommandInput");
  if (aiCommandInput) aiCommandInput.placeholder = "Choose a preset or ask your own question...";
  var aiWorkspaceTitle = document.querySelector("#aiWorkspaceTitle");
  if (aiWorkspaceTitle) aiWorkspaceTitle.textContent = profile.panelTitle;
  var aiStart = document.querySelector("#aiStart");
  if (aiStart) aiStart.hidden = false;
  var aiAnswer = document.querySelector("#aiAnswer");
  if (aiAnswer) aiAnswer.hidden = true;
}

function openAi(mode, recommendationIndex) {
  const current = activeReport();
  const profile = activeAssistantProfile();
  const assets = reportKnowledge(activeProject, current.report);
  const isLiveView = !liveView.hidden;

  if (!isLiveView) {
    // Catalog / Report view — use main Ask AI Interpreter dialog
    closeDetails();
    const panel = document.getElementById("assistantPanel");
    if (panel) panel.hidden = false;
    return;
  }

  // Specific report detail page — use Data Analysis Assistant popover
  var aiContextReport = document.querySelector("#aiContextReport");
  if (aiContextReport) aiContextReport.textContent = profile.contextTitle;
  var aiContextMeta = document.querySelector("#aiContextMeta");
  if (aiContextMeta) {
    aiContextMeta.innerHTML = [
      ["Scope", profile.scope],
      ["Time frame", profile.timeFrame],
    ]
      .map(function (item) {
        return "<div><dt>" + item[0] + "</dt><dd>" + item[1] + "</dd></div>";
      })
      .join("");
  }
  var aiContextSources = document.querySelector("#aiContextSources");
  if (aiContextSources) {
    const counts = ["models", "metrics", "playbooks", "memory"]
      .map(function (category) {
        const count = assets.filter(function (asset) {
          return asset.category === category;
        }).length;
        const label =
          count === 1 ? categoryLabels[category].replace(/s$/, "") : categoryLabels[category];
        return count ? "<span>" + count + " " + label + "</span>" : "";
      })
      .join("");
    aiContextSources.innerHTML = counts;
  }
  closeDetails();
  restoreAiContextPanels();
  try {
    renderAiRecommendations();
  } catch (e) {
    /* ignore */
  }
  aiScrim.hidden = false;
  aiWorkspace.classList.add("open");
  aiWorkspace.setAttribute("aria-hidden", "false");
  document.body.classList.add("ai-open");
  document.querySelector("[data-close-ai]").focus();
  if (recommendationIndex !== undefined && recommendationIndex !== null)
    showAiAnswer(Number(recommendationIndex));
}

// Close handlers
document.addEventListener("click", function (e) {
  if (e.target.closest("[data-close]")) {
    const panel = document.getElementById("assistantPanel");
    if (panel) panel.hidden = true;
  } else if (e.target.closest("[data-close-ai]")) {
    closeAi();
  }
});

function closeAi() {
  aiWorkspace.classList.remove("open");
  aiWorkspace.classList.remove("is-ai-expanded");
  aiWorkspace.setAttribute("aria-hidden", "true");
  aiScrim.hidden = true;
  document.body.classList.remove("ai-open");
  document.body.classList.remove("ai-workspace-expanded");
  const maximizeButton = aiWorkspace.querySelector("#aiMaximize");
  if (maximizeButton) {
    maximizeButton.setAttribute("aria-label", "Maximize");
    maximizeButton.title = "Maximize";
  }
}

const aiMaximizeButton = aiWorkspace ? aiWorkspace.querySelector("#aiMaximize") : null;
if (aiMaximizeButton && aiWorkspace) {
  aiMaximizeButton.title = "Maximize";
  aiMaximizeButton.addEventListener("click", function () {
    const expanded = aiWorkspace.classList.toggle("is-ai-expanded");
    document.body.classList.toggle("ai-workspace-expanded", expanded);
    aiMaximizeButton.setAttribute("aria-label", expanded ? "Restore" : "Maximize");
    aiMaximizeButton.title = expanded ? "Restore" : "Maximize";
  });
}

const aiHistoryButton = aiWorkspace ? aiWorkspace.querySelector("#aiHistory") : null;
if (aiHistoryButton && aiWorkspace && !document.querySelector("#aiReportHistoryPopup")) {
  const historyPopup = document.createElement("div");
  historyPopup.className = "ai-recent-history";
  historyPopup.id = "aiReportHistoryPopup";
  historyPopup.hidden = true;
  historyPopup.innerHTML =
    '<div class="ai-recent-history-head"><strong>Recent Chats</strong><button type="button" aria-label="Close recent chats">×</button></div>' +
    '<button type="button" class="ai-recent-chat" data-chat="Summarize the latest city performance movements."><strong>City performance summary</strong><span>Summarize the latest city performance movements.</span></button>' +
    '<button type="button" class="ai-recent-chat" data-chat="Compare traffic uplift with sales growth by city."><strong>Traffic vs sales</strong><span>Compare traffic uplift with sales growth by city.</span></button>' +
    '<button type="button" class="ai-recent-chat" data-chat="Find conversion gaps in this scenario report."><strong>Conversion gaps</strong><span>Find conversion gaps in this scenario report.</span></button>';
  aiHistoryButton.insertAdjacentElement("afterend", historyPopup);
  aiHistoryButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    historyPopup.hidden = !historyPopup.hidden;
  });
  historyPopup.querySelector(".ai-recent-history-head button").addEventListener("click", function () {
    historyPopup.hidden = true;
  });
  historyPopup.addEventListener("click", function (event) {
    const chat = event.target.closest(".ai-recent-chat");
    if (!chat) return;
    const input = document.querySelector("#aiCommandInput");
    if (input) {
      input.value = chat.dataset.chat || "";
      input.focus();
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    historyPopup.hidden = true;
  });
  document.addEventListener("click", function (event) {
    if (historyPopup.hidden) return;
    if (historyPopup.contains(event.target) || aiHistoryButton.contains(event.target)) return;
    historyPopup.hidden = true;
  });
}

const aiCmdUpload = document.querySelector("#aiCmdUpload");
const aiCmdUploadPopup = document.querySelector("#aiCmdUploadPopup");
if (aiCmdUpload && aiCmdUploadPopup) {
  const fallbackAnalyticalModels = [
    {
      id: "playbook-opportunity-scan",
      title: "Opportunity scan playbook",
      note: "Use this interpretation logic",
    },
    { id: "roi-diagnosis", title: "ROI diagnosis model", note: "Analyze ROI movement and drivers" },
    {
      id: "conversion-drop",
      title: "Conversion drop analysis",
      note: "Find conversion pressure and likely reasons",
    },
  ];
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.hidden = true;
  fileInput.multiple = true;
  fileInput.accept = ".csv,.xlsx,.xls,.pdf,.doc,.docx,.ppt,.pptx,.txt,image/*";
  aiCmdUpload.insertAdjacentElement("afterend", fileInput);
  aiCmdUploadPopup.classList.add("report-ai-upload-popup", "ai-skill-menu");
  aiCmdUploadPopup.setAttribute("role", "menu");
  document.body.appendChild(aiCmdUploadPopup);
  let activeReportSkillType = null;
  /* Hover expansion state. The category panel and detail panel sit side by side
     with an 8px gap, so a pure :hover rule would close the submenu while the
     pointer crosses that gap. Close on a short delay instead. */
  let reportSkillDetailPinned = false;
  let reportHoverCloseTimer = null;

  function escapeAiMenuHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[
        character
      ];
    });
  }

  function normalizeAiMenuText(value) {
    return String(value || "").trim();
  }

  function readReportAnalyticalModels() {
    const fromMapping =
      window.knowledgeFieldMapping && typeof window.knowledgeFieldMapping.records === "function"
        ? window.knowledgeFieldMapping.records("Analytical Model")
        : [];
    const fromAssets = Array.isArray(window.marketingKnowledgeAssets)
      ? window.marketingKnowledgeAssets.filter(function (asset) {
          return asset.type === "Analytical Model";
        })
      : [];
    const seen = new Set();
    const models = fromMapping.concat(fromAssets).map(function (item) {
      return {
        id: item.id || item.analysis_name || item.title,
        title: normalizeAiMenuText(item.analysis_name || item.title),
        note: normalizeAiMenuText(
          item.trigger_when || item.summary || "Use this interpretation logic",
        ),
      };
    });
    return models
      .filter(function (item) {
        return item.title && !seen.has(item.id) && seen.add(item.id);
      })
      .slice(0, 12);
  }

  function reportSkillOption(item) {
    return (
      '<button class="ai-skill-option" type="button" role="menuitem" data-ai-skill-id="' +
      escapeAiMenuHtml(item.id) +
      '" data-ai-skill-title="' +
      escapeAiMenuHtml(item.title) +
      '" data-ai-skill-note="' +
      escapeAiMenuHtml(item.note) +
      '"><span class="ai-skill-option-head"><strong>' +
      escapeAiMenuHtml(item.title) +
      '</strong><span class="ai-skill-option-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 4l5 5"></path><path d="M14 5l-7 7v4h4l7-7"></path><path d="M9 15l-5 5"></path></svg></span></span><small>' +
      escapeAiMenuHtml(item.note) +
      "</small></button>"
    );
  }

  function reportSkillActionIcon(action) {
    if (action === "history") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v10H8l-4 3.5V5.5Z"></path><path d="M8 9h8M8 12h6"></path></svg>';
    }
    if (action === "manual") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l11-11-4-4L4 16v4Z"></path><path d="M13.5 6.5l4 4"></path></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 0 1-2.83 2.83l-.05-.05a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 0 1-4 0v-.08a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.05.05a2 2 0 0 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 0 1 0-4h.08A1.7 1.7 0 0 0 4.6 8.92a1.7 1.7 0 0 0-.34-1.87l-.05-.05a2 2 0 0 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 8.96 4.6 1.7 1.7 0 0 0 10 3.04V3a2 2 0 0 1 4 0v.04a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.05-.05a2 2 0 0 1 2.83 2.83l-.05.05a1.7 1.7 0 0 0-.34 1.87 1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 0 1 0 4h-.04A1.7 1.7 0 0 0 19.4 15Z"></path></svg>';
  }

  /*
   * Category icons mirror the shared "+" menu (assets/js/shared/assistant-skill-menu.js)
   * and reuse artwork that already ships in the demo:
   * - Upload: the upload glyph from data-upload.html.
   * - Analytical Model: the Analytical Model type-card glyph from the AI
   *   Interpreter overview page (typeMeta in assets/js/knowledge/types.js).
   */
  function reportSkillCategoryIcon(type) {
    if (type === "Upload") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"></path></svg>';
  }

  function reportSkillAction(action, label) {
    return (
      '<button class="ai-skill-footer-action" type="button" data-report-skill-action="' +
      action +
      '"><span class="ai-skill-footer-label">' +
      reportSkillActionIcon(action) +
      "<span>" +
      label +
      '</span></span><span aria-hidden="true">›</span></button>'
    );
  }

  function renderReportSkillMenu() {
    aiCmdUploadPopup.innerHTML =
      '<div class="ai-skill-category-panel">' +
      '<button class="ai-skill-category" type="button" role="menuitem" data-report-skill-category="Upload"><span class="ai-skill-category-main"><span class="ai-skill-category-icon" aria-hidden="true">' +
      reportSkillCategoryIcon("Upload") +
      '</span><span>Upload File</span></span><span aria-hidden="true">›</span></button>' +
      '<button class="ai-skill-category' +
      (activeReportSkillType === "Analytical Model" ? " is-active" : "") +
      '" type="button" role="menuitem" data-report-skill-category="Analytical Model"><span class="ai-skill-category-main"><span class="ai-skill-category-icon" aria-hidden="true">' +
      reportSkillCategoryIcon("Analytical Model") +
      '</span><span>Analytical Model</span></span><span aria-hidden="true">›</span></button>' +
      '</div><div class="ai-skill-detail-panel" hidden></div>';
    if (activeReportSkillType === "Analytical Model") renderReportSkillDetail("", true);
  }

  function renderReportSkillDetail(query, focusSearch) {
    activeReportSkillType = "Analytical Model";
    const detail = aiCmdUploadPopup.querySelector(".ai-skill-detail-panel");
    if (!detail) return;
    aiCmdUploadPopup.querySelectorAll(".ai-skill-category").forEach(function (button) {
      button.classList.toggle(
        "is-active",
        button.dataset.reportSkillCategory === "Analytical Model",
      );
    });
    const normalizedQuery = normalizeAiMenuText(query).toLowerCase();
    const models = readReportAnalyticalModels();
    const items = (models.length ? models : fallbackAnalyticalModels).filter(function (item) {
      const haystack = (item.title + " " + item.note).toLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    });
    const itemMarkup = items.length
      ? items.map(reportSkillOption).join("")
      : '<div class="ai-skill-empty">No matching skills</div>';
    detail.hidden = false;
    detail.innerHTML =
      '<div class="ai-skill-search-row"><label class="ai-skill-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg><input type="search" value="' +
      escapeAiMenuHtml(query || "") +
      '" placeholder="Search Analytical Model" /></label></div><div class="ai-skill-list">' +
      itemMarkup +
      '</div><div class="ai-skill-footer-actions">' +
      reportSkillAction("history", "Add from Chat History") +
      reportSkillAction("manual", "Create Analytical Model Manually") +
      "</div>";
    const searchInput = detail.querySelector("input");
    if (searchInput && focusSearch) {
      searchInput.focus();
      searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    }
    placeAiUploadPopup();
  }

  /*
   * Mirrors the shared "Generate Analytical Model" flow (see
   * assets/js/shared/assistant-skill-menu.js) with report-flavoured content.
   * Keep both implementations in sync when editing either one.
   */
  const reportChatHistory = [
    {
      title: "City investment review",
      messages: [
        {
          role: "user",
          text: "Invested cities show traffic uplift but conversion gaps remain. Where should we focus first?",
          checked: true,
        },
        {
          role: "ai",
          label: "Connected report view",
          title: "Conversion is the bottleneck.",
          text: "Start with the invested cities where traffic uplift did not convert, then verify data freshness before scaling budget.",
          sources: ["City Strategy", "Qualified traffic", "Conversion Rate"],
          checked: true,
        },
      ],
    },
    {
      title: "Report performance comparison",
      messages: [
        {
          role: "user",
          text: "Compare city performance across traffic, sales, CR, AUR and UPT before scaling investment.",
          checked: true,
        },
        {
          role: "ai",
          label: "Connected report view",
          title: "Prioritize conversion before scaling.",
          text: "Compare cities on the same window and grain, isolate the largest gap, and separate real change from delayed source data.",
          sources: ["Governed reports", "Metric definitions", "Refresh status"],
          checked: true,
        },
      ],
    },
    {
      title: "Data quality check",
      messages: [
        {
          role: "user",
          text: "Which metrics have data quality issues that make the report unreliable?",
          checked: false,
        },
        {
          role: "ai",
          label: "Connected knowledge view",
          title: "Three metrics need a freshness check.",
          text: "Trace source lineage and refresh state for the flagged metrics before using the report conclusion.",
          sources: ["Data Models", "Quality notes", "Refresh status"],
          checked: false,
        },
      ],
    },
  ];

  function renderReportHistoryMessage(threadIndex, messageIndex, message) {
    const box =
      '<input type="checkbox" data-report-history-msg data-thread="' +
      threadIndex +
      '" data-message="' +
      messageIndex +
      '"' +
      (message.checked ? " checked" : "") +
      " />";
    if (message.role === "user") {
      return (
        '<label class="ai-history-msg is-user">' +
        box +
        '<span class="ai-history-bubble">' +
        escapeAiMenuHtml(message.text) +
        "</span></label>"
      );
    }
    return (
      '<label class="ai-history-msg is-ai">' +
      box +
      '<span class="ai-history-answer"><span class="ai-history-answer-head">' +
      escapeAiMenuHtml(message.label) +
      " · " +
      message.sources.length +
      " grounded sources</span><strong>" +
      escapeAiMenuHtml(message.title) +
      "</strong><small>" +
      escapeAiMenuHtml(message.text) +
      '</small><span class="ai-history-answer-sources">' +
      message.sources
        .map(function (source) {
          return "<span>" + escapeAiMenuHtml(source) + "</span>";
        })
        .join("") +
      "</span></span></label>"
    );
  }

  /* Reads the ticks back out of the dialog, in conversation order. */
  function collectReportSelectedMessages(dialog) {
    const picked = [];
    dialog.querySelectorAll("[data-report-history-msg]").forEach(function (input) {
      if (!input.checked) return;
      const thread = reportChatHistory[Number(input.dataset.thread)];
      const message = thread && thread.messages[Number(input.dataset.message)];
      if (!message) return;
      picked.push({
        threadIndex: Number(input.dataset.thread),
        role: message.role,
        title: message.title || "",
        text: message.text,
        conversation: thread.title,
      });
    });
    return picked;
  }

  /*
   * Demo-only simulation of "AI drafts the model description", matching the real
   * editor's definition of the field: the business goal, the decision to support
   * and the expected insight - never the analysis steps.
   */
  function buildReportDescription(messages, rule) {
    const questions = messages
      .filter(function (message) {
        return message.role === "user";
      })
      .map(function (message) {
        return message.text;
      });
    const scope = (questions.length
      ? questions
      : messages.map(function (message) {
          return message.text;
        })
    )
      .join(" ")
      .toLowerCase();

    const topics = [];
    if (/\bcit(y|ies)\b|invest/.test(scope)) topics.push("city performance");
    if (/conversion|\bcr\b/.test(scope)) topics.push("conversion");
    if (/data quality|lineage|freshness/.test(scope)) topics.push("data quality");
    if (!topics.length) topics.push("report performance");
    const topicPhrase =
      topics.length > 1
        ? topics.slice(0, -1).join(", ") + " and " + topics[topics.length - 1]
        : topics[0];

    const ruleText = normalizeAiMenuText(rule).toLowerCase();
    const has = function (words) {
      return words.some(function (word) {
        return ruleText.indexOf(word) !== -1;
      });
    };
    const dimensions = [];
    if (has(["channel", "media", "platform", "site"])) dimensions.push("channels");
    if (has(["city", "cities", "market", "region", "store"])) dimensions.push("cities");
    if (has(["segment", "customer", "member", "audience"])) dimensions.push("customer segments");
    if (has(["time", "week", "month", "trend", "period", "quarter"])) dimensions.push("time periods");
    const dimensionPhrase = dimensions.join(" and ");
    const ranked = has(["rank", "priorit", "top", "most impactful", "biggest"]);

    const goal =
      "Clarify what drove the movement in " +
      topicPhrase +
      ", so the team can decide the next optimization step.";
    const method = dimensionPhrase
      ? ranked
        ? "Ranks " + dimensionPhrase + " by business impact and returns one conclusion."
        : "Compares " +
          dimensionPhrase +
          " to isolate the strongest performance signal and support one next action."
      : "Expected insight is the strongest performance signal and the primary risk driver.";

    const conversations = new Set(
      messages.map(function (message) {
        return message.threadIndex;
      }),
    ).size;
    return (
      goal +
      " " +
      method +
      "\n\nSource: " +
      conversations +
      " conversation" +
      (conversations === 1 ? "" : "s") +
      " · " +
      messages.length +
      " message" +
      (messages.length === 1 ? "" : "s") +
      "."
    );
  }

  function openReportHistoryDialog() {
    closeReportSkillPopup();
    renderReportSkillMenu();
    document.querySelector("#aiReportHistoryGenerateDialog")?.remove();
    const dialog = document.createElement("div");
    dialog.className = "ai-flow-dialog";
    dialog.id = "aiReportHistoryGenerateDialog";
    dialog.innerHTML =
      '<div class="ai-flow-card ai-history-card" role="dialog" aria-modal="true" aria-labelledby="aiReportHistoryTitle">' +
      '<header><div><strong id="aiReportHistoryTitle">Generate Analytical Model</strong><span>Select conversations and describe the generation rule for the analysis logic.</span></div><button type="button" data-report-flow-close aria-label="Close">×</button></header>' +
      '<div class="ai-history-body">' +
      '<section class="ai-history-block">' +
      '<div class="ai-history-block-head"><span>1 · Select Conversations</span><span class="ai-history-count" data-report-history-count></span></div>' +
      '<div class="ai-history-thread">' +
      /* Flat stream: every message from every conversation is listed in one
         list, with no per-conversation grouping header. */
      reportChatHistory
        .map(function (thread, threadIndex) {
          return thread.messages
            .map(function (message, messageIndex) {
              return renderReportHistoryMessage(threadIndex, messageIndex, message);
            })
            .join("");
        })
        .join("") +
      "</div>" +
      '<p class="ai-history-error" data-report-generate-error hidden>Select at least one message to continue.</p>' +
      "</section>" +
      '<section class="ai-history-block">' +
      '<div class="ai-history-block-head"><span>2 · Generation Rule</span><span class="ai-history-optional">optional</span></div>' +
      '<textarea class="ai-history-rule" data-report-generation-rule rows="3" placeholder="Describe how AI should distill the analysis logic, for example: focus on the city dimension and keep only the driver with the strongest evidence."></textarea>' +
      "</section>" +
      "</div>" +
      '<footer><button type="button" class="ai-flow-secondary" data-report-flow-close>Cancel</button><button type="button" class="ai-flow-primary" data-report-generate-model>Generate</button></footer>' +
      "</div>";
    document.body.append(dialog);
    syncReportHistoryCount(dialog);
    dialog.addEventListener("change", function (event) {
      if (event.target.matches("[data-report-history-msg]")) syncReportHistoryCount(dialog);
    });
  }

  /* Keeps the "Selected N / M messages" counter and the blocking error honest. */
  function syncReportHistoryCount(dialog) {
    const boxes = dialog.querySelectorAll("[data-report-history-msg]");
    const checked = dialog.querySelectorAll("[data-report-history-msg]:checked").length;
    const label = dialog.querySelector("[data-report-history-count]");
    if (label) label.textContent = "Selected " + checked + " / " + boxes.length + " messages";
    const error = dialog.querySelector("[data-report-generate-error]");
    if (error && checked) error.hidden = true;
    boxes.forEach(function (input) {
      const row = input.closest(".ai-history-msg");
      if (row) row.classList.toggle("is-selected", input.checked);
    });
  }

  /*
   * Demo-only simulation of "AI generates the analysis logic" for the reports
   * engine. Same approach as the shared assistant menu: map the generation rule
   * to concrete steps by keyword so the generated logic visibly follows what the
   * user typed. Keep both implementations in sync when editing either one.
   */
  function buildReportAnalysisLogic(rule) {
    const text = normalizeAiMenuText(rule).toLowerCase();
    const has = function (words) {
      return words.some(function (word) {
        return text.indexOf(word) !== -1;
      });
    };

    const dimensions = [];
    if (has(["channel", "media", "platform", "site"])) dimensions.push("channels");
    if (has(["city", "cities", "market", "region", "store"])) dimensions.push("cities");
    if (has(["segment", "customer", "member", "audience"])) dimensions.push("customer segments");
    if (has(["time", "week", "month", "trend", "period", "quarter"])) dimensions.push("time periods");

    const scope = dimensions.length
      ? "across " + dimensions.join(" and ")
      : "across cities, channels, and key report dimensions";

    const driver = has(["rank", "priorit", "top", "most impactful", "biggest"])
      ? "Rank the candidate drivers by business impact and keep only the strongest one."
      : has(["driver", "root cause", "reason", "why", "cause", "factor"])
        ? "Isolate the driver with the strongest supporting evidence."
        : "Identify the strongest performance signal and the primary risk driver.";

    const output = has(["concise", "brief", "short", "one conclusion", "one result"])
      ? "Return one conclusion and a recommended next action."
      : "Return the key findings and a recommended next action.";

    return [
      "1. Define the report question, the comparison window, and the business scope.",
      "2. Compare metric movement " + scope + ".",
      "3. " + driver,
      "4. " + output,
    ].join("\n");
  }

  function openReportGeneratedModelForm(messages, rule) {
    /*
     * The generation step is hidden rather than removed, so Back can restore it
     * with every tick, the generation rule and the scroll position still intact.
     */
    const historyDialog = document.querySelector("#aiReportHistoryGenerateDialog");
    if (historyDialog) historyDialog.hidden = true;
    document.querySelector("#aiReportGeneratedModelDialog")?.remove();
    const ruleText = normalizeAiMenuText(rule);
    /* Both fields are drafted from the ticked messages plus the generation rule,
       then handed to the form below where the user can still edit them. */
    const description = buildReportDescription(messages, rule);
    const guidance = buildReportAnalysisLogic(rule);
    const dialog = document.createElement("div");
    dialog.className = "ai-flow-dialog";
    dialog.id = "aiReportGeneratedModelDialog";
    dialog.innerHTML =
      '<div class="ai-flow-card ai-model-form-card" role="dialog" aria-modal="true" aria-labelledby="aiReportModelTitle">' +
      '<header><div><strong id="aiReportModelTitle">New Analytical Model</strong><span>' +
      (ruleText
        ? "Generated from selected conversations and your generation rule."
        : "Generated from selected conversations.") +
      ' Submit will publish this knowledge immediately.</span></div><button type="button" data-report-flow-close aria-label="Close">×</button></header>' +
      '<div class="ai-model-form">' +
      '<section><h4>Basic Information</h4><label><span class="field-label-text">Name <span class="required-star">*</span></span><input data-report-required="Name" value="Report performance interpretation model" /></label><label>Description<textarea>' +
      escapeAiMenuHtml(description) +
      '</textarea></label><label><span class="field-label-text">Trigger When <span class="required-star">*</span></span><textarea data-report-required="Trigger When">Use when users ask for an interpretation of a report result and need one clear conclusion grounded in connected report context.</textarea></label></section>' +
      '<section><h4>Metrics</h4><label>Business Domain<input value="Report Performance; City Strategy" /></label><label>Referenced Metrics<input value="Traffic; Sales; Conversion Rate; AUR; UPT" /></label></section>' +
      '<section><h4>Structure & Guidance</h4><label><span class="field-label-text">Structure & Guidance <span class="required-star">*</span></span><textarea data-report-required="Structure & Guidance">' +
      escapeAiMenuHtml(guidance) +
      '</textarea></label></section>' +
      '<section><h4>Constraints</h4><label>Prohibited Analysis Directions<textarea>Do not infer causality without supporting context. Do not generate charts or a full report; return one concise analysis result.</textarea></label></section>' +
      "</div>" +
      '<footer><button type="button" class="ai-flow-secondary ai-flow-back" data-report-back-to-history>← Back</button><button type="button" class="ai-flow-secondary" data-report-flow-close>Cancel</button><button type="button" class="ai-flow-primary" data-report-submit-model>Submit</button><button type="button" class="ai-flow-secondary" data-report-save-model>Save</button></footer>' +
      "</div>";
    document.body.append(dialog);
  }

  function openReportManualModelForm() {
    closeReportSkillPopup();
    renderReportSkillMenu();
    /* Manual creation has no previous step, so any hidden generation step left
       behind by the chat-history path is dropped here too. */
    document.querySelector("#aiReportHistoryGenerateDialog")?.remove();
    document.querySelector("#aiReportGeneratedModelDialog")?.remove();
    const dialog = document.createElement("div");
    dialog.className = "ai-flow-dialog";
    dialog.id = "aiReportGeneratedModelDialog";
    dialog.innerHTML =
      '<div class="ai-flow-card ai-model-form-card" role="dialog" aria-modal="true" aria-labelledby="aiReportManualModelTitle">' +
      '<header><div><strong id="aiReportManualModelTitle">Create Analytical Model Manually</strong><span>Draft the model fields and publish it to the knowledge base.</span></div><button type="button" data-report-flow-close aria-label="Close">×</button></header>' +
      '<div class="ai-model-form">' +
      '<section><h4>Basic Information</h4><label><span class="field-label-text">Name <span class="required-star">*</span></span><input data-report-required="Name" placeholder="Enter analytical model name" /></label><label>Description<textarea placeholder="Describe what this model helps interpret"></textarea></label><label><span class="field-label-text">Trigger When <span class="required-star">*</span></span><textarea data-report-required="Trigger When" placeholder="Describe when AI should use this model"></textarea></label></section>' +
      '<section><h4>Metrics</h4><label>Business Domain<input placeholder="Report Performance; City Strategy" /></label><label>Referenced Metrics<input placeholder="Traffic; Sales; Conversion Rate; AUR; UPT" /></label></section>' +
      '<section><h4>Structure & Guidance</h4><label><span class="field-label-text">Structure & Guidance <span class="required-star">*</span></span><textarea data-report-required="Structure & Guidance" placeholder="Write the step-by-step interpretation logic"></textarea></label></section>' +
      '<section><h4>Constraints</h4><label>Prohibited Analysis Directions<textarea placeholder="Add limits, warnings, or blocked analysis directions"></textarea></label></section>' +
      "</div>" +
      '<footer><button type="button" class="ai-flow-secondary" data-report-flow-close>Cancel</button><button type="button" class="ai-flow-primary" data-report-submit-model>Submit</button><button type="button" class="ai-flow-secondary" data-report-save-model>Save</button></footer>' +
      "</div>";
    document.body.append(dialog);
  }

  function validateReportModelDialog(dialog) {
    if (!dialog) return false;
    let valid = true;
    dialog.querySelectorAll(".field-error").forEach(function (node) {
      node.remove();
    });
    dialog.querySelectorAll("[data-report-required]").forEach(function (field) {
      field.classList.remove("is-invalid");
      if (field.value.trim()) return;
      valid = false;
      field.classList.add("is-invalid");
      field.insertAdjacentHTML(
        "afterend",
        '<span class="field-error">' + field.dataset.reportRequired + " is required.</span>",
      );
    });
    const firstInvalid = dialog.querySelector(".is-invalid");
    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  /*
   * Hover expansion for the report AI menu. Mirrors the shared assistant menu:
   * the category panel and detail panel sit side by side with an 8px gap, so the
   * submenu closes on a short delay instead of instantly, which survives the
   * pointer crossing that gap and moving onto the detail panel.
   */
  const REPORT_HOVER_CLOSE_DELAY = 120;

  function cancelReportHoverClose() {
    if (reportHoverCloseTimer === null) return;
    window.clearTimeout(reportHoverCloseTimer);
    reportHoverCloseTimer = null;
  }

  function collapseReportSkillDetail() {
    cancelReportHoverClose();
    reportSkillDetailPinned = false;
    const detail = aiCmdUploadPopup.querySelector(".ai-skill-detail-panel");
    if (detail) detail.hidden = true;
    aiCmdUploadPopup.querySelectorAll(".ai-skill-category").forEach(function (button) {
      button.classList.remove("is-active");
    });
    activeReportSkillType = null;
    placeAiUploadPopup();
  }

  function scheduleReportHoverClose() {
    if (reportSkillDetailPinned) return;
    cancelReportHoverClose();
    reportHoverCloseTimer = window.setTimeout(function () {
      reportHoverCloseTimer = null;
      collapseReportSkillDetail();
    }, REPORT_HOVER_CLOSE_DELAY);
  }

  /* focusSearch is true for click/keyboard opens; a hover preview must not steal
     focus from the report command input. */
  function openReportSkillDetail(focusSearch) {
    cancelReportHoverClose();
    reportSkillDetailPinned = false;
    renderReportSkillDetail("", focusSearch);
  }

  aiCmdUploadPopup.addEventListener("mouseenter", cancelReportHoverClose);
  aiCmdUploadPopup.addEventListener("mouseleave", function () {
    if (aiCmdUploadPopup.hidden) return;
    scheduleReportHoverClose();
  });
  aiCmdUploadPopup.addEventListener("mouseover", function (event) {
    if (aiCmdUploadPopup.hidden) return;
    const category = event.target.closest("[data-report-skill-category]");
    if (!category) {
      cancelReportHoverClose();
      return;
    }
    const type = category.dataset.reportSkillCategory;
    /* Upload is an action, not a submenu - never open it by hover. */
    if (type === "Upload") return;
    if (type === activeReportSkillType) {
      cancelReportHoverClose();
      return;
    }
    openReportSkillDetail(false);
  });
  aiCmdUploadPopup.addEventListener("focusin", function (event) {
    if (aiCmdUploadPopup.hidden) return;
    const category = event.target.closest("[data-report-skill-category]");
    if (!category) return;
    if (category.dataset.reportSkillCategory === "Upload") return;
    openReportSkillDetail(true);
  });

  /* Single close path for the report AI menu so hover state never leaks across
     open/close cycles. */
  function closeReportSkillPopup() {
    aiCmdUploadPopup.hidden = true;
    activeReportSkillType = null;
    reportSkillDetailPinned = false;
    cancelReportHoverClose();
  }

  function placeAiUploadPopup() {
    const rect = aiCmdUpload.getBoundingClientRect();
    const menuWidth = activeReportSkillType === "Analytical Model" ? 472 : 164;
    aiCmdUploadPopup.style.left =
      Math.max(16, Math.min(rect.left, window.innerWidth - menuWidth - 16)) + "px";
    aiCmdUploadPopup.style.top = Math.max(16, rect.top - aiCmdUploadPopup.offsetHeight - 8) + "px";
  }

  function toggleAiUploadPopup() {
    const willOpen = aiCmdUploadPopup.hidden;
    if (willOpen) {
      activeReportSkillType = null;
      reportSkillDetailPinned = false;
      cancelReportHoverClose();
      renderReportSkillMenu();
      aiCmdUploadPopup.hidden = false;
      placeAiUploadPopup();
    } else {
      closeReportSkillPopup();
    }
  }

  document.addEventListener(
    "click",
    function (event) {
      const trigger = event.target.closest("#aiCmdUpload");
      if (!trigger) return;
      event.preventDefault();
      event.stopPropagation();
      toggleAiUploadPopup();
    },
    true,
  );

  aiCmdUploadPopup.addEventListener("click", function (event) {
    const category = event.target.closest("[data-report-skill-category]");
    if (category) {
      event.preventDefault();
      event.stopPropagation();
      if (category.dataset.reportSkillCategory === "Upload") {
        closeReportSkillPopup();
        fileInput.click();
        return;
      }
      /* Click opens and pins the submenu; clicking it again collapses. Hovering
         alone never pins, so hover-then-click promotes the preview instead of
         closing it. */
      if (
        category.dataset.reportSkillCategory === activeReportSkillType &&
        reportSkillDetailPinned
      ) {
        collapseReportSkillDetail();
        return;
      }
      openReportSkillDetail(true);
      reportSkillDetailPinned = true;
      return;
    }

    const action = event.target.closest("[data-report-skill-action]");
    if (action?.dataset.reportSkillAction === "history") {
      event.preventDefault();
      openReportHistoryDialog();
      return;
    }
    if (action?.dataset.reportSkillAction === "manual") {
      event.preventDefault();
      openReportManualModelForm();
      return;
    }

    const option = event.target.closest(".ai-skill-option");
    if (!option) return;
    const input = document.querySelector("#aiCommandInput");
    if (input) {
      input.value = "Use " + option.dataset.aiSkillTitle + " to interpret this report.";
      input.focus();
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    closeReportSkillPopup();
  });

  aiCmdUploadPopup.addEventListener("input", function (event) {
    if (!event.target.matches(".ai-skill-search input")) return;
    renderReportSkillDetail(event.target.value, true);
  });

  aiCmdUploadPopup.addEventListener("click", function (event) {
    const item = event.target.closest(".upload-popup-item");
    if (!item) return;
    if (item.dataset.source === "business") {
      fileInput.click();
    } else {
      const input = document.querySelector("#aiCommandInput");
      if (input) {
        input.value = "Use an Analytical Model to interpret this report.";
        input.focus();
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    closeReportSkillPopup();
  });

  document.addEventListener("click", function (event) {
    if (aiCmdUploadPopup.hidden) return;
    if (aiCmdUploadPopup.contains(event.target) || aiCmdUpload.contains(event.target)) return;
    closeReportSkillPopup();
  });

  window.addEventListener("resize", function () {
    if (!aiCmdUploadPopup.hidden) placeAiUploadPopup();
  });

  document.addEventListener("click", function (event) {
    if (event.target.matches("[data-report-flow-close]")) {
      const dialog = event.target.closest(".ai-flow-dialog");
      /* Cancel / close on the generated form ends the whole flow, so the hidden
         generation step behind it is cleaned up instead of lingering. */
      if (dialog && dialog.id === "aiReportGeneratedModelDialog") {
        document.querySelector("#aiReportHistoryGenerateDialog")?.remove();
      }
      dialog?.remove();
      return;
    }
    if (event.target.matches("[data-report-back-to-history]")) {
      event.target.closest(".ai-flow-dialog")?.remove();
      const historyDialog = document.querySelector("#aiReportHistoryGenerateDialog");
      if (historyDialog) historyDialog.hidden = false;
      return;
    }
    if (event.target.matches("[data-report-generate-model]")) {
      const dialog = event.target.closest(".ai-flow-dialog");
      const selected = collectReportSelectedMessages(dialog);
      const error = dialog.querySelector("[data-report-generate-error]");
      /* The messages are the source material, so at least one is required. The
         generation rule is optional - when it is empty AI falls back to its own
         default reasoning. */
      if (!selected.length) {
        if (error) error.hidden = false;
        return;
      }
      if (error) error.hidden = true;
      const ruleField = dialog.querySelector("[data-report-generation-rule]");
      openReportGeneratedModelForm(selected, ruleField ? ruleField.value : "");
      return;
    }
    if (event.target.matches("[data-report-submit-model], [data-report-save-model]")) {
      const dialog = event.target.closest(".ai-flow-dialog");
      if (!validateReportModelDialog(dialog)) return;
      event.target.textContent = event.target.matches("[data-report-save-model]")
        ? "Saved"
        : "Published";
      window.setTimeout(function () {
        dialog?.remove();
      }, 450);
    }
  });
}

function syncAiCommandState() {
  const input = document.querySelector("#aiCommandInput");
  const send = document.querySelector("#aiCmdSend");
  if (!input || !send) return;
  send.disabled = !input.value.trim();
}

function resetAiFeedback() {
  document.querySelectorAll("[data-ai-feedback]").forEach(function (button) {
    button.setAttribute("aria-pressed", "false");
  });
  document.querySelector("#aiFeedbackStatus").hidden = true;
}

const aiSummaryPanel = document.querySelector(".ai-summary-drawer");
const aiScenarioPanel = document.querySelector("#aiStart");
const aiAnswerPanel = document.querySelector("#aiAnswer");
const aiAnswerContextDock = document.querySelector("#aiAnswerContextDock");
const aiContextTools = document.querySelectorAll("[data-ai-context-panel]");
const aiSummaryHomeMarker = document.createComment("ai-summary-home");
const aiScenarioHomeMarker = document.createComment("ai-scenario-home");

if (aiSummaryPanel && aiSummaryPanel.parentNode) {
  aiSummaryPanel.parentNode.insertBefore(aiSummaryHomeMarker, aiSummaryPanel);
}
if (aiScenarioPanel && aiScenarioPanel.parentNode) {
  aiScenarioPanel.parentNode.insertBefore(aiScenarioHomeMarker, aiScenarioPanel);
}

function setContextToolActive(name) {
  aiContextTools.forEach(function (button) {
    button.classList.toggle("active", button.dataset.aiContextPanel === name);
  });
}

function restoreAiContextPanels() {
  if (aiSummaryPanel && aiSummaryHomeMarker.parentNode) {
    aiSummaryHomeMarker.parentNode.insertBefore(aiSummaryPanel, aiSummaryHomeMarker.nextSibling);
    aiSummaryPanel.hidden = false;
  }
  if (aiScenarioPanel && aiScenarioHomeMarker.parentNode) {
    aiScenarioHomeMarker.parentNode.insertBefore(aiScenarioPanel, aiScenarioHomeMarker.nextSibling);
    aiScenarioPanel.hidden = false;
  }
  setContextToolActive("");
}

function enterAiAnswerMode() {
  if (aiSummaryPanel) aiSummaryPanel.hidden = true;
  if (aiScenarioPanel) aiScenarioPanel.hidden = true;
  if (aiAnswerContextDock) aiAnswerContextDock.innerHTML = "";
  setContextToolActive("");
}

function toggleAiContextPanel(name) {
  const panel = name === "summary" ? aiSummaryPanel : aiScenarioPanel;
  if (!panel || !aiAnswerContextDock) return;
  const isOpen = panel.parentNode === aiAnswerContextDock && !panel.hidden;
  if (aiSummaryPanel) aiSummaryPanel.hidden = true;
  if (aiScenarioPanel) aiScenarioPanel.hidden = true;
  if (isOpen) {
    setContextToolActive("");
    return;
  }
  aiAnswerContextDock.appendChild(panel);
  panel.hidden = false;
  setContextToolActive(name);
}

function renderAiFindingList(findings) {
  return findings
    .map(function (finding, findingIndex) {
      return (
        "<div class='answer-finding'><span>0" +
        (findingIndex + 1) +
        "</span><div><strong>" +
        finding[0] +
        "</strong><p>" +
        finding[1] +
        "</p></div></div>"
      );
    })
    .join("");
}

function renderAiSourcesList(sources) {
  return (
    "<span>Sources used</span><div>" +
    sources
      .map(function (asset) {
        return (
          "<a href='knowledge.html?report=" +
          activeProject +
          "&category=" +
          asset.category +
          "&asset=" +
          asset.id +
          "'>" +
          asset.title +
          "</a>"
        );
      })
      .join("") +
    "</div>"
  );
}

function escapeAiHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function appendAiChatExchange(answer, sources) {
  const thread = document.querySelector("#aiChatThread");
  if (!thread) return;
  const entry = document.createElement("article");
  entry.className = "answer-entry report-chat-entry";
  const sourceLabels = sources.slice(0, 3).map(function (asset) {
    return asset.title;
  });
  const primaryHref =
    sources[0] && sources[0].category && sources[0].id
      ? "knowledge.html?report=" +
        activeProject +
        "&category=" +
        sources[0].category +
        "&asset=" +
        sources[0].id
      : "knowledge.html";
  entry.innerHTML =
    "<div class='user-query'><span class='user-query-bubble'>" +
    escapeAiHtml(answer.answerTitle) +
    "</span></div><article class='answer-card'><div class='answer-card-head'><span>Connected report view</span><small>" +
    sourceLabels.length +
    " grounded sources</small></div><h3>Recommended next move.</h3><p>" +
    escapeAiHtml(answer.summary) +
    "</p><div class='answer-source-line' aria-label='Sources'>" +
    sourceLabels
      .map(function (source) {
        return "<span>" + escapeAiHtml(source) + "</span>";
      })
      .join("") +
    "</div><div class='answer-actions' aria-label='Related actions'><a href='" +
    primaryHref +
    "'>Open report context</a><span>Compare movement</span><span>Save learning</span></div><div class='answer-feedback' data-answer-id='" +
    Date.now() +
    "'><button type='button' class='answer-feedback-btn' data-chat-feedback='helpful' aria-pressed='false'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' aria-hidden='true'><path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3'></path></svg><span>Helpful</span></button><button type='button' class='answer-feedback-btn' data-chat-feedback='not-helpful' aria-pressed='false'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' aria-hidden='true'><path d='M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3'></path></svg><span>Not helpful</span></button><button type='button' class='answer-feedback-btn copy-answer-btn' data-copy aria-label='Copy answer'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' aria-hidden='true'><rect x='9' y='9' width='13' height='13' rx='2'></rect><path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path></svg><span>Copy</span></button></div></article>";
  thread.appendChild(entry);
  entry.scrollIntoView({ block: "nearest" });
}

function showAiAnswer(index, customQuestion, sourceType) {
  const current = activeReport();
  const profile = activeAssistantProfile();
  const shouldAppendToChat =
    Boolean(customQuestion) && aiAnswerPanel && !aiAnswerPanel.hidden;
  let answer;
  if (customQuestion) {
    const assets = reportKnowledge(activeProject, current.report);
    const model = assets.find(function (asset) {
      return asset.category === "models";
    });
    const metric = assets.find(function (asset) {
      return asset.category === "metrics";
    });
    answer = {
      answerTitle: customQuestion,
      summary:
        "I would answer this using the active report, its governed comparison window, and the connected knowledge below. The first pass would validate data freshness, identify material movement, and trace the conclusion to its model and definitions.",
      findings: [
        [
          "Report signal",
          current.report.metrics[0][0] +
            " is currently " +
            current.report.metrics[0][1] +
            " (" +
            current.report.metrics[0][2] +
            ").",
        ],
        [
          "Model context",
          model
            ? model.title + " supplies the governed data grain."
            : "The report model supplies the governed data grain.",
        ],
        [
          "Definition",
          metric
            ? metric.title + " anchors the primary metric interpretation."
            : "Connected metric definitions anchor the interpretation.",
        ],
      ],
    };
  } else if (sourceType === "example") {
    const example = profile.examples[index] || profile.examples[0];
    if (example.answerTitle) {
      answer = {
        answerTitle: example.answerTitle,
        summary: example.summary,
        findings: example.findings,
      };
    } else {
      const questions = [
        "Movement is strongest in " +
          current.report.chart[0][0] +
          ", supported by " +
          current.report.metrics[0][0].toLowerCase() +
          ".",
        current.report.metrics[0][0] +
          " is the primary decision metric; its connected definition and model are attached.",
        "The largest unexplained movement is in " +
          current.report.chart[2][0] +
          ", where the primary and comparison signals diverge.",
      ];
      answer = {
        answerTitle: example.prompt,
        summary: questions[index] || questions[0],
        findings: [
          [
            "Current value",
            current.report.metrics[0][0] + ": " + current.report.metrics[0][1] + ".",
          ],
          ["Comparison", current.report.metrics[0][2] + " versus the governed baseline."],
          [
            "Confidence",
            projects[activeProject].status === "Ready"
              ? "Primary sources are complete."
              : "One source caveat is attached to this answer.",
          ],
        ],
      };
    }
  } else {
    answer = current.report.recommendations[index] || current.report.recommendations[0];
  }
  const sources = reportKnowledge(activeProject, current.report).slice(0, 4);
  if (customQuestion && isPilotCitySalesQuestion(customQuestion)) {
    if (!shouldAppendToChat) {
      const chatThread = document.querySelector("#aiChatThread");
      if (chatThread) chatThread.innerHTML = "";
      enterAiAnswerMode();
      resetAiFeedback();
      if (aiAnswerPanel) {
        aiAnswerPanel.classList.add("is-chat-mode");
        aiAnswerPanel.hidden = false;
      }
    }
    appendPilotCitySalesExchange(customQuestion, sources);
    return;
  }
  if (customQuestion) {
    if (!shouldAppendToChat) {
      const chatThread = document.querySelector("#aiChatThread");
      if (chatThread) chatThread.innerHTML = "";
      enterAiAnswerMode();
      resetAiFeedback();
      if (aiAnswerPanel) {
        aiAnswerPanel.classList.add("is-chat-mode");
        aiAnswerPanel.hidden = false;
      }
    }
    appendAiChatExchange(answer, sources);
    return;
  }
  if (aiAnswerPanel) aiAnswerPanel.classList.remove("is-chat-mode");
  const chatThread = document.querySelector("#aiChatThread");
  if (chatThread) chatThread.innerHTML = "";
  const summaryEl = document.querySelector("#aiAnswerSummary");
  const findingsEl = document.querySelector("#aiAnswerFindings");
  const reportHost = document.querySelector("#aiAnswerReport");
  cancelActiveStream();
  if (summaryEl) summaryEl.hidden = false;
  if (findingsEl) findingsEl.hidden = false;
  if (reportHost) {
    reportHost.hidden = true;
    reportHost.innerHTML = "";
  }
  if (sourceType !== "example" && isCityInvestReport() && index === 0) {
    showHolisticReport(sources);
    return;
  }
  document.querySelector("#aiAnswerTitle").textContent = answer.answerTitle;
  document.querySelector("#aiAnswerSummary").textContent = answer.summary;
  document.querySelector("#aiAnswerFindings").innerHTML = renderAiFindingList(answer.findings);
  document.querySelector("#aiAnswerSources").innerHTML = renderAiSourcesList(sources);
  resetAiFeedback();
  enterAiAnswerMode();
  document.querySelector("#aiAnswer").hidden = false;
  document.querySelector("#aiAnswer").scrollTop = 0;
}

document.addEventListener("click", function (event) {
  const detailsButton = event.target.closest("[data-details-project]");
  if (detailsButton) {
    const projectKey = detailsButton.dataset.detailsProject;
    const project = projects[projectKey];
    const report = project && project.reports[Number(detailsButton.dataset.detailsReport)];
    if (!report) return;
    const contexts = (window.marketingKnowledgeAssets || []).filter(function (asset) {
      return asset.type === "Report Context";
    });
    const context =
      contexts.find(function (asset) {
        return (asset.connections || []).some(function (connection) {
          return connection.name === report.title;
        });
      }) ||
      contexts.find(function (asset) {
        return (report.knowledgeIds || []).includes(asset.id);
      }) ||
      contexts.find(function (asset) {
        return (asset.projects || []).includes(projectKey);
      });
    if (context)
      window.location.href =
        "knowledge.html?type=Report%20Context&detail=" + encodeURIComponent(context.id);
    return;
  }

  if (event.target.closest("[data-close-details]") || event.target === detailsScrim) {
    closeDetails();
    return;
  }

  const knowledgeButton = event.target.closest("[data-knowledge-category]");
  if (knowledgeButton) {
    activeKnowledgeCategory = knowledgeButton.dataset.knowledgeCategory;
    renderConnectedKnowledge();
    return;
  }

  if (event.target.closest("[data-back-catalog]")) {
    activeCatalogProject = activeProject;
    setUrl("?project=" + activeProject);
    renderCatalog();
    showView("catalog");
    return;
  }

  if (event.target.closest("[data-open-live]")) {
    openLiveReport();
    return;
  }

  if (event.target.closest("[data-back-report]")) {
    activeCatalogProject = activeProject;
    setUrl("?project=" + activeProject);
    renderCatalog();
    showView("catalog");
    return;
  }

  const aiModeButton = event.target.closest("[data-ai-mode]");
  if (aiModeButton) {
    if (!isAiEnabled()) return;
    if (aiModeButton.classList.contains("global-ai-launcher")) {
      openAi(aiModeButton.dataset.aiMode);
      return;
    }
    const recommendation = aiModeButton.dataset.openRecommendation;
    openAi(aiModeButton.dataset.aiMode, recommendation);
    return;
  }

  const questionExample = event.target.closest("[data-ai-example]");
  if (questionExample) {
    showAiAnswer(Number(questionExample.dataset.aiExample), "", "example");
    return;
  }

  const recommendation = event.target.closest("[data-ai-recommendation]");
  if (recommendation) {
    showAiAnswer(Number(recommendation.dataset.aiRecommendation));
    return;
  }

  if (event.target.closest("[data-ai-back]")) {
    restoreAiContextPanels();
    document.querySelector("#aiAnswer").hidden = true;
    document.querySelector("#aiAnswer").classList.remove("is-chat-mode");
    return;
  }

  const contextPanelButton = event.target.closest("[data-ai-context-panel]");
  if (contextPanelButton) {
    toggleAiContextPanel(contextPanelButton.dataset.aiContextPanel);
    return;
  }

  const feedbackButton = event.target.closest("[data-ai-feedback]");
  if (feedbackButton) {
    document.querySelectorAll("[data-ai-feedback]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button === feedbackButton));
    });
    const status = document.querySelector("#aiFeedbackStatus");
    status.textContent =
      feedbackButton.dataset.aiFeedback === "helpful"
        ? "Thanks. This answer was marked helpful."
        : "Thanks. This answer was marked not helpful.";
    status.hidden = false;
    return;
  }

  const chatFeedbackButton = event.target.closest("[data-chat-feedback]");
  if (chatFeedbackButton) {
    const feedbackWrap = chatFeedbackButton.closest(".answer-feedback");
    if (feedbackWrap) {
      feedbackWrap.querySelectorAll("[data-chat-feedback]").forEach(function (button) {
        button.setAttribute("aria-pressed", String(button === chatFeedbackButton));
      });
    }
    return;
  }

  const copyAnswerButton = event.target.closest("[data-copy]");
  if (copyAnswerButton) {
    const card = copyAnswerButton.closest(".answer-card");
    const text = card ? card.innerText.trim() : "";
    if (text && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(function () {});
    }
    return;
  }

  if (event.target.closest("[data-close-ai]") || event.target === aiScrim) {
    closeAi();
  }
});

if (reportSearch) {
  reportSearch.addEventListener("input", renderCatalog);
}
document.querySelector("#aiCommandForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const input = document.querySelector("#aiCommandInput");
  const question = input.value.trim();
  if (!question) return;
  showAiAnswer(0, question);
  input.value = "";
  syncAiCommandState();
});

document.querySelector("#aiCommandInput").addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 160) + "px";
  syncAiCommandState();
});

document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") return;
  if (aiWorkspace.classList.contains("open")) {
    closeAi();
  } else if (reportDetailsDrawer.classList.contains("open")) {
    closeDetails();
  }
});

/* Copilot new session: hide answer and start stage */
const aiNewSession = document.querySelector("#aiNewSession");
if (aiNewSession) {
  aiNewSession.addEventListener("click", function () {
    const aiAnswerEl = document.querySelector("#aiAnswer");
    if (aiAnswerEl) {
      aiAnswerEl.hidden = true;
      aiAnswerEl.classList.remove("is-chat-mode");
    }
    restoreAiContextPanels();
    const aiInputEl = document.querySelector("#aiCommandInput");
    if (aiInputEl) {
      aiInputEl.value = "";
      aiInputEl.focus();
      syncAiCommandState();
    }
    try {
      renderAiRecommendations();
    } catch (e) {
      /* ignore */
    }
  });
}

/* Initial render runs at the very end of this file, after the
   City Invest Analysis module below has been fully initialized. */

document.querySelectorAll(".collapsible").forEach(function (heading) {
  heading.addEventListener("click", function (event) {
    if (event.target.closest("button, a, input, select, textarea")) return;
    const targetId = heading.dataset.collapseTarget;
    if (!targetId) return;
    const content = document.getElementById(targetId);
    if (!content) return;
    const toggleBtn = heading.querySelector(".collapse-toggle");
    const isCollapsed = content.classList.toggle("collapsed");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-expanded", String(!isCollapsed));
    }
  });
});

document.querySelectorAll(".collapsible .collapse-toggle").forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    event.stopPropagation();
    const heading = btn.closest(".collapsible");
    if (!heading) return;
    const targetId = heading.dataset.collapseTarget;
    if (!targetId) return;
    const content = document.getElementById(targetId);
    if (!content) return;
    const isCollapsed = content.classList.toggle("collapsed");
    btn.setAttribute("aria-expanded", String(!isCollapsed));
  });
});

document.querySelectorAll("#aiQuestionExamplesWrap").forEach(function (content) {
  content.classList.add("collapsed");
  const targetId = content.id;
  const heading = document.querySelector('[data-collapse-target="' + targetId + '"]');
  if (heading) {
    const toggleBtn = heading.querySelector(".collapse-toggle");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
  }
});

/* ============================================================
   City Invest Analysis — embedded 6-city dashboard, streamed
   Holistic Analysis report, and pilot-city sales rich answer.
   Only active for project=city & dashboard=0.
   ============================================================ */

function isCityInvestReport() {
  return activeProject === "city" && activeReportIndex === 0;
}

/* ---------- 1. Embedded 6-city dashboard ---------- */

function renderCityInvestDashboard() {
  return (
    '<div class="sixcity-embed"><div class="sc-canvas">' +
    '<div class="sc-titlebar"><p class="sc-title">Invest City Strategy Analysis（6 Cities）</p>' +
    '<div class="sc-footnotes"><p class="sc-footnote">*Non-invest city: Excluding stores in Invest cities; from FY27P01 onward, 11 cities are excluded (6 before FY27P01). Only Comp Stores are counted.</p></div></div>' +
    '<div class="sc-filters" id="sc-filters">' +
    '<div class="sc-fitem"><span class="sc-flabel">Base Period</span><span class="sc-fstatic">FY25 P4–P9</span></div>' +
    '<div class="sc-fitem"><span class="sc-flabel">Invest Period Start</span><span class="sc-fstatic">FY25 P11</span></div>' +
    '<div class="sc-fitem"><span class="sc-flabel">Invest Period End</span><span class="sc-fval" id="sc-endCtrl">FY27 P3</span></div>' +
    '<div class="sc-fitem"><span class="sc-flabel">Channel</span><span class="sc-fval" id="sc-channelCtrl">All</span></div>' +
    '<div class="sc-fitem"><span class="sc-flabel">Pilot</span><span class="sc-fval" id="sc-pilotCtrl">Pilot TTL</span></div>' +
    '<div class="sc-fitem"><span class="sc-flabel">City</span><span class="sc-fval" id="sc-cityCtrl">Total</span></div>' +
    '<div class="sc-fitem"><span class="sc-flabel">Store</span><span class="sc-fval" id="sc-storeCtrl">All Stores</span></div>' +
    "</div>" +
    '<div class="sc-kpi-grid" id="sc-kpiRow1"></div>' +
    '<div class="sc-kpi-grid" id="sc-kpiRow2" style="margin-top:10px;"></div>' +
    '<div class="sc-kpi-legend"><span class="sc-formula">Uplift = Invest City Var% − Non Invest City Var%；Var% = Invest / Base × 100%</span></div>' +
    '<div class="sc-sec-title" id="sc-secTitle">Total Monthly Key Indicator Trend vs. Non Invest City</div>' +
    '<div class="sc-chart-grid" id="sc-charts"></div>' +
    "</div></div>"
  );
}

const scCats = [
  "FY25P4", "FY25P5", "FY25P6", "FY25P7", "FY25P8", "FY25P9", "FY25P10", "FY25P11",
  "FY25P12", "FY26P1", "FY26P2", "FY26P3", "FY26P4", "FY26P5", "FY26P6", "FY26P7",
  "FY26P8", "FY26P9", "FY26P10", "FY26P11", "FY26P12", "FY27P1", "FY27P2", "FY27P3",
];
const scBaseline = {
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
const SC_CHART_ORDER = ["SV", "New%", "AT", "AUR", "CR%", "UPT"];
const SC_END_IDX = {
  "FY25 P11": 7, "FY25 P12": 8, "FY26 P1": 9, "FY26 P2": 10, "FY26 P3": 11,
  "FY26 P4": 12, "FY26 P5": 13, "FY26 P6": 14, "FY26 P7": 15, "FY26 P8": 16,
  "FY26 P9": 17, "FY26 P10": 18, "FY26 P11": 19, "FY26 P12": 20, "FY27 P1": 21,
  "FY27 P2": 22, "FY27 P3": 23,
};
const SC_START_IDX = scCats.indexOf("FY25P11");
const SC_KPI = [
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
const SC_KPI_ROWS = [
  ["ADT", "ADS", "New", "SV", "SC"],
  ["CR", "AT", "UPT", "AUR", "TAM"],
];
const scCityStores = {
  Chengdu: ["Wangfujing", "Mixc Mall", "Ifs", "Lotte", "Chicony Dps", "Skp", "Time Outlet", "Florentia Village", "Times Outlets 2", "Shanshan Outlet Plaza"],
  Hefei: ["Intime", "Mixc", "Sasseur Outlet"],
  Qingdao: ["Mixc", "Hisense", "Bailian Outlets"],
  Shenzhen: ["King Glory", "Mixc Mall", "Maoye", "Haiya Mega Mall", "Uni Walk (Yifang City)", "Pafc Mall", "Coh Cn Mixc World", "No.8 Warehouse Outlet", "Shanshan Outlet Pop Up"],
  Wuhan: ["International Plaza", "Chicony", "Dream Plaza", "Skp Permanent Store", "Bailian Outlet", "Florentia Village", "Shouchuang Outlet Temp"],
  Xian: ["Saga", "City On (Taubman)", "Skp Women'S", "Skp Men'S", "Kaiyuan", "Coh Cn Dt51", "Sean Outlet", "Sasseur Outlet", "Coh Cn Mixc"],
};
const scAllStores = [...new Set(Object.values(scCityStores).flat())];
const scCityOptions = ["Chengdu", "Hefei", "Qingdao", "Shenzhen", "Wuhan", "Xian"];

function scHashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function scMulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function scFmtAfter(meta, v) {
  if (meta.fmt === "K") return v.toFixed(meta.dec) + "K";
  if (meta.fmt === "%") return v.toFixed(meta.dec) + "%";
  if (meta.fmt === "%2") return Math.round(v) + "%";
  if (meta.fmt === "int") return Math.round(v).toLocaleString("en-US");
  return v.toFixed(meta.dec);
}

function scGenScenario(f) {
  const isDefault =
    f.channel === "All" && f.pilot === "Pilot TTL" && f.city.includes("Total") && f.end === "FY27 P3";
  const seedStr = [f.channel, f.pilot, f.city.slice().sort().join(","), f.store.slice().sort().join(","), f.end].join("|");
  const rng = scMulberry32(scHashStr(seedStr));
  const endIdx = SC_END_IDX[f.end] ?? 14;
  const trends = {};
  SC_CHART_ORDER.forEach(function (m) {
    if (isDefault) {
      trends[m] = { t: scBaseline[m].t.slice(), n: scBaseline[m].n.slice() };
    } else {
      const fT = 0.88 + rng() * 0.24;
      const fN = 0.88 + rng() * 0.24;
      trends[m] = {
        t: scBaseline[m].t.map(function (v) { return v * fT * (1 + (rng() - 0.5) * 0.06); }),
        n: scBaseline[m].n.map(function (v) { return v * fN * (1 + (rng() - 0.5) * 0.06); }),
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

function scRenderKPIs(host, scn) {
  SC_KPI_ROWS.forEach(function (row, r) {
    const grid = host.querySelector(r === 0 ? "#sc-kpiRow1" : "#sc-kpiRow2");
    grid.innerHTML = "";
    row.forEach(function (key) {
      const meta = SC_KPI.find(function (k) { return k.key === key; });
      const v = scn.kpi[key];
      const div = document.createElement("div");
      let inner = "";
      if (meta.uplift === null) {
        div.className = "sc-kpi sc-plain";
        inner += '<div class="sc-top"><span class="sc-name">' + meta.name + "</span></div>";
        inner += '<div class="sc-uplift">' + scFmtAfter(meta, v.after) + "</div>";
      } else {
        const up = v.uplift;
        const cls = up >= 0 ? "sc-pos" : "sc-neg";
        const arr = up >= 0 ? "▲" : "▼";
        div.className = "sc-kpi";
        inner += '<div class="sc-top"><span class="sc-name">' + meta.name + "</span></div>";
        inner += '<div class="sc-uplift-label">Uplift</div>';
        inner += '<div class="sc-uplift ' + cls + '">' + (up > 0 ? "+" : "") + up + '%<span class="sc-arrow">' + arr + "</span></div>";
        inner += '<div class="sc-row2"><span class="sc-var">Var% ' + (v.vari > 0 ? "+" : "") + v.vari + '%</span><span class="sc-after">After <b>' + scFmtAfter(meta, v.after) + "</b></span></div>";
      }
      div.innerHTML = inner;
      grid.appendChild(div);
    });
  });
}

function scPickTicks(len) {
  if (len <= 3) return Array.from({ length: len }, function (_, i) { return i; });
  const step = Math.max(2, Math.round((len - 1) / 6));
  const out = [];
  for (let i = 0; i < len; i += step) out.push(i);
  if (out[out.length - 1] !== len - 1) out.push(len - 1);
  if (out.length >= 3 && out[out.length - 1] - out[out.length - 2] === 1) out.splice(out.length - 2, 1);
  return out;
}

function scDrawChart(name, d, endIdx, dec) {
  dec = dec || 0;
  const s = Math.min(SC_START_IDX, endIdx);
  const labels = scCats.slice(s, endIdx + 1);
  const t = d.t.slice(s, endIdx + 1);
  const n = d.n.slice(s, endIdx + 1);
  const W = 440, H = 150, padL = 42, padR = 16, padT = 10, padB = 30;
  const all = t.concat(n);
  let min = Math.min.apply(null, all);
  let max = Math.max.apply(null, all);
  const span = max - min || 1;
  min -= span * 0.12;
  max += span * 0.12;
  const X = function (i) { return padL + (W - padL - padR) * (i / (labels.length - 1)); };
  const Y = function (v) { return padT + (H - padT - padB) * (1 - (v - min) / (max - min)); };
  let grid = "";
  let ylab = "";
  for (let g = 0; g <= 3; g++) {
    const val = min + ((max - min) * g) / 3;
    const y = Y(val);
    grid += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="#eef0f3" stroke-width="1"/>';
    ylab += '<text x="' + (padL - 6) + '" y="' + (y + 3) + '" text-anchor="end" font-size="9" fill="#aab0b8">' + val.toFixed(dec) + "</text>";
  }
  let xlab = "";
  const ticks = new Set(scPickTicks(labels.length));
  labels.forEach(function (c, i) {
    if (ticks.has(i)) {
      xlab += '<text x="' + X(i) + '" y="' + (H - 12) + '" text-anchor="middle" font-size="8" fill="#aab0b8">' + c + "</text>";
    }
  });
  const line = function (arr, color, w) {
    return (
      '<polyline points="' +
      arr.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); }).join(" ") +
      '" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linejoin="round" stroke-linecap="round"/>'
    );
  };
  const svg =
    '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet" style="width:100%;display:block;">' +
    '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="transparent" pointer-events="all"/>' +
    grid + ylab + xlab + line(n, "#c9a876", 1) + line(t, "#333333", 1.4) +
    '<g class="sc-hov" style="display:none"></g></svg>';
  return { svg: svg, geo: { labels: labels, t: t, n: n, dec: dec, W: W, H: H, padT: padT, padB: padB, X: X, Y: Y } };
}

function scAttachHover(div, geo, totalLabel) {
  const svg = div.querySelector("svg");
  const hov = svg.querySelector(".sc-hov");
  const tip = div.querySelector(".sc-tip");
  const labels = geo.labels, t = geo.t, n = geo.n, dec = geo.dec;
  const W = geo.W, H = geo.H, padT = geo.padT, padB = geo.padB, X = geo.X, Y = geo.Y;
  const fmt = function (v) { return v.toFixed(dec); };
  svg.addEventListener("mousemove", function (e) {
    const r = svg.getBoundingClientRect();
    if (!r.width) return;
    const lx = (e.clientX - r.left) * (W / r.width);
    let best = 0, bd = 1e9;
    for (let i = 0; i < labels.length; i++) {
      const dx = Math.abs(X(i) - lx);
      if (dx < bd) { bd = dx; best = i; }
    }
    const gx = X(best);
    hov.style.display = "";
    hov.innerHTML =
      '<line x1="' + gx.toFixed(1) + '" y1="' + padT + '" x2="' + gx.toFixed(1) + '" y2="' + (H - padB) + '" stroke="#9aa0a8" stroke-width="1" stroke-dasharray="3 2"/>' +
      '<circle cx="' + gx.toFixed(1) + '" cy="' + Y(t[best]).toFixed(1) + '" r="3.2" fill="#333" stroke="#fff" stroke-width="1"/>' +
      '<circle cx="' + gx.toFixed(1) + '" cy="' + Y(n[best]).toFixed(1) + '" r="3.2" fill="#c9a876" stroke="#fff" stroke-width="1"/>';
    tip.innerHTML =
      "<b>" + labels[best] + "</b><br>" +
      '<span style="color:#1f2329;">● ' + totalLabel + ": " + fmt(t[best]) + "</span><br>" +
      '<span style="color:#1f2329;">● Non-Invest: ' + fmt(n[best]) + "</span>";
    tip.style.display = "block";
    const dr = div.getBoundingClientRect();
    let tx = e.clientX - dr.left + 14;
    let ty = e.clientY - dr.top + 10;
    if (tx + tip.offsetWidth > dr.width) tx = e.clientX - dr.left - tip.offsetWidth - 14;
    tip.style.left = tx + "px";
    tip.style.top = ty + "px";
  });
  svg.addEventListener("mouseleave", function () {
    hov.style.display = "none";
    tip.style.display = "none";
  });
}

function scRenderCharts(host, scn, totalLabel) {
  const wrap = host.querySelector("#sc-charts");
  wrap.innerHTML = "";
  SC_CHART_ORDER.forEach(function (name) {
    const result = scDrawChart(name, scn.trends[name], scn.endIdx, name === "UPT" ? 2 : 0);
    const div = document.createElement("div");
    div.className = "sc-chart";
    div.innerHTML =
      '<div class="sc-chart-head"><span class="sc-name">' + name + "</span>" +
      '<span class="sc-legend"><span><i style="background:#333;"></i>' + totalLabel + '</span><span><i style="background:#c9a876;"></i>Non-Invest Avg</span></span></div>' +
      result.svg + '<div class="sc-tip"></div>';
    wrap.appendChild(div);
    scAttachHover(div, result.geo, totalLabel);
  });
}

let scDocCloseBound = false;

function scBuildDropdown(host, elId, opts, multi, defaultSel, onChange, withAll, suffix, getCitySel) {
  const el = host.querySelector("#" + elId);
  [...el.childNodes].forEach(function (n) { if (n.nodeType === 3) el.removeChild(n); });
  const txt = document.createElement("span");
  txt.className = "sc-fval-txt";
  el.insertBefore(txt, el.firstChild);
  const panel = document.createElement("div");
  panel.className = "sc-panel";
  const ALL = "All";
  const selected = new Set(multi ? defaultSel : [defaultSel]);
  let optList = withAll ? [ALL].concat(opts) : opts.slice();
  function fire() { if (onChange) onChange([...selected]); }
  function renderRows() {
    panel.innerHTML = "";
    if (multi) {
      const head = document.createElement("div");
      head.className = "sc-phead";
      head.innerHTML = '<span class="sc-ph">Multi-select</span><span><a class="sc-all">Select all</a> · <a class="sc-none">Clear</a></span>';
      panel.appendChild(head);
      head.querySelector(".sc-all").onclick = function () {
        if (withAll) {
          selected.clear();
          selected.add(ALL);
        } else {
          optList.forEach(function (o) { selected.add(o); });
        }
        renderRows(); refresh(); fire();
      };
      head.querySelector(".sc-none").onclick = function () {
        selected.clear();
        renderRows(); refresh(); fire();
      };
    }
    optList.forEach(function (o) {
      const row = document.createElement("label");
      row.className = "sc-prow";
      const cb = document.createElement("input");
      cb.type = multi ? "checkbox" : "radio";
      cb.name = elId;
      cb.value = o;
      cb.checked = selected.has(o);
      const span = document.createElement("span");
      span.textContent = o;
      row.appendChild(cb);
      row.appendChild(span);
      cb.onchange = function () {
        if (multi) {
          if (cb.checked) selected.add(o); else selected.delete(o);
        } else {
          selected.clear();
          selected.add(o);
        }
        renderRows(); refresh(); fire();
      };
      panel.appendChild(row);
    });
  }
  function refresh() {
    let label;
    if (multi) {
      if (withAll && selected.has(ALL)) {
        label = "All Stores";
      } else {
        const arr = [...selected];
        if (arr.length === 0) label = "(None)";
        else if (arr.length === optList.length) label = "All Stores";
        else label = arr.length > 2 ? arr.slice(0, 2).join(", ") + " +" + (arr.length - 2) : arr.join(", ");
      }
    } else {
      label = [...selected][0];
    }
    txt.textContent = label + (suffix ? " " + suffix() : "");
  }
  el.appendChild(panel);
  el.addEventListener("click", function (e) {
    if (panel.contains(e.target)) { e.stopPropagation(); return; }
    e.stopPropagation();
    host.querySelectorAll(".sc-panel").forEach(function (p) { if (p !== panel) p.style.display = "none"; });
    host.querySelectorAll(".sc-fval.sc-open").forEach(function (f) { if (f !== el) f.classList.remove("sc-open"); });
    const show = panel.style.display !== "block";
    panel.style.display = show ? "block" : "none";
    el.classList.toggle("sc-open", show);
  });
  if (!scDocCloseBound) {
    scDocCloseBound = true;
    document.addEventListener("click", function () {
      document.querySelectorAll(".sixcity-embed .sc-panel").forEach(function (p) { p.style.display = "none"; });
      document.querySelectorAll(".sixcity-embed .sc-fval.sc-open").forEach(function (f) { f.classList.remove("sc-open"); });
    });
  }
  renderRows(); refresh();
  return {
    get: function () {
      if (withAll && selected.has(ALL)) return optList.filter(function (o) { return o !== ALL; });
      return [...selected];
    },
    setOptions: function (newOpts) {
      optList = withAll ? [ALL].concat(newOpts) : newOpts.slice();
      if (withAll) { selected.clear(); selected.add(ALL); }
      else { selected.clear(); newOpts.forEach(function (x) { selected.add(x); }); }
      renderRows(); refresh();
    },
  };
}

function initCityInvestDashboard(host) {
  let scCurTotalLabel = "Total";
  let endCtrl, channelCtrl, pilotCtrl, cityCtrl, storeCtrl;

  function storeOptsFor(cities) {
    if (cities.length === 0) return scAllStores;
    return [
      ...new Set(
        cities
          .filter(function (c) { return scCityStores[c]; })
          .flatMap(function (c) { return scCityStores[c]; })
      ),
    ];
  }

  function storeScopeSuffix() {
    const c = cityCtrl.get();
    if (c.length === 0) return "";
    if (c.length === 1) return "· " + c[0];
    if (c.length === 2) return "· " + c.join(" + ");
    return "· " + c.length + " Cities";
  }

  function totalLabel() {
    const c = cityCtrl.get();
    if (c.length === 0) return "Total";
    const full = c.length === scCityOptions.length && scCityOptions.every(function (x) { return c.includes(x); });
    if (full) return "Total";
    if (c.length <= 2) return c.join(" + ");
    return c.length + " Cities";
  }

  function update() {
    scCurTotalLabel = totalLabel();
    const titleEl = host.querySelector("#sc-secTitle");
    if (titleEl) titleEl.textContent = scCurTotalLabel + " Monthly Key Indicator Trend vs. Non Invest City";
    const cv = host.querySelector(".sc-canvas");
    const scn = scGenScenario({
      end: endCtrl.get()[0],
      channel: channelCtrl.get()[0],
      pilot: pilotCtrl.get()[0],
      city: cityCtrl.get(),
      store: storeCtrl.get(),
    });
    cv.style.opacity = ".55";
    requestAnimationFrame(function () {
      scRenderKPIs(host, scn);
      scRenderCharts(host, scn, scCurTotalLabel);
      requestAnimationFrame(function () { cv.style.opacity = "1"; });
    });
  }

  endCtrl = scBuildDropdown(host, "sc-endCtrl", ["FY27 P3", "FY27 P2", "FY27 P1", "FY26 P12", "FY26 P11", "FY26 P10", "FY26 P9", "FY26 P8", "FY26 P7", "FY26 P6", "FY26 P5", "FY26 P4", "FY26 P3", "FY26 P2", "FY26 P1", "FY25 P12", "FY25 P11"], false, "FY27 P3", update);
  channelCtrl = scBuildDropdown(host, "sc-channelCtrl", ["All", "Offline Outlet", "Offline Retail", "Online"], false, "All", update);
  pilotCtrl = scBuildDropdown(host, "sc-pilotCtrl", ["Pilot TTL", "Pilot Comp"], false, "Pilot TTL", update);
  cityCtrl = scBuildDropdown(host, "sc-cityCtrl", scCityOptions, true, scCityOptions, function (cities) {
    storeCtrl.setOptions(storeOptsFor(cities));
    update();
  });
  storeCtrl = scBuildDropdown(host, "sc-storeCtrl", scAllStores, true, scAllStores, update, false, storeScopeSuffix);

  update();
}

/* ---------- 2. Streaming helper ---------- */

let activeStreamTimer = null;

function cancelActiveStream() {
  if (activeStreamTimer) {
    clearTimeout(activeStreamTimer);
    activeStreamTimer = null;
  }
  document.querySelectorAll(".streaming-cursor").forEach(function (c) { c.remove(); });
}

function streamBlocksInto(host, blocks, interval) {
  cancelActiveStream();
  const cursor = document.createElement("span");
  cursor.className = "streaming-cursor";
  let i = 0;
  function step() {
    if (!document.contains(host)) {
      activeStreamTimer = null;
      return;
    }
    if (i >= blocks.length) {
      cursor.remove();
      activeStreamTimer = null;
      return;
    }
    const block = document.createElement("div");
    block.className = "stream-block";
    block.innerHTML = blocks[i];
    host.appendChild(block);
    host.appendChild(cursor);
    requestAnimationFrame(function () { block.classList.add("revealed"); });
    const scroller = host.closest(".ai-answer");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
    i += 1;
    activeStreamTimer = setTimeout(step, interval);
  }
  step();
}

/* ---------- 3. Holistic Analysis report ---------- */

function hrDot(kind) {
  return '<span class="hr-dot-cell"><i class="hr-dot hr-' + kind + '"></i></span>';
}

function hrTable(headers, rows, markLastTotal) {
  let html = '<table class="hr-table"><thead><tr>';
  headers.forEach(function (h) { html += "<th>" + h + "</th>"; });
  html += "</tr></thead><tbody>";
  rows.forEach(function (row, rowIndex) {
    const isTotal = markLastTotal && rowIndex === rows.length - 1;
    html += "<tr" + (isTotal ? ' class="hr-total"' : "") + ">";
    row.forEach(function (cell) { html += "<td>" + cell + "</td>"; });
    html += "</tr>";
  });
  html += "</tbody></table>";
  return html;
}

function hrNum(value) {
  const negative = String(value).indexOf("-") === 0 || String(value).indexOf("−") === 0;
  return '<span class="' + (negative ? "hr-neg" : "hr-pos") + '">' + value + "</span>";
}

function buildHrTrendChart() {
  const periods = ["FY26P7", "FY26P8", "FY26P9", "FY26P10", "FY26P11", "FY26P12", "FY27P1", "FY27P2"];
  const series = [
    { name: "Sales", color: "#1f2329", values: [2.4, 1.9, 1.2, 0.6, -0.4, 0.1, -0.3, 0.3] },
    { name: "Traffic", color: "#00a06b", values: [6.2, 7.1, 7.6, 8.3, 8.8, 9.4, 9.0, 9.1] },
    { name: "CR%", color: "#e34d59", values: [-6.5, -7.2, -8.0, -8.6, -9.2, -9.6, -10.1, -9.8] },
  ];
  const W = 520, H = 170, padL = 36, padR = 12, padT = 12, padB = 26;
  const min = -12, max = 12;
  const X = function (i) { return padL + (W - padL - padR) * (i / (periods.length - 1)); };
  const Y = function (v) { return padT + (H - padT - padB) * (1 - (v - min) / (max - min)); };
  let svg = '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet" style="width:100%;display:block;">';
  [-12, -6, 0, 6, 12].forEach(function (g) {
    const y = Y(g);
    svg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="' + (g === 0 ? "#c9c7bd" : "#eef0f3") + '" stroke-width="1"' + (g === 0 ? ' stroke-dasharray="4 3"' : "") + "/>";
    svg += '<text x="' + (padL - 6) + '" y="' + (y + 3) + '" text-anchor="end" font-size="9" fill="#aab0b8">' + (g > 0 ? "+" + g : g) + "%</text>";
  });
  periods.forEach(function (p, i) {
    svg += '<text x="' + X(i) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="8.5" fill="#aab0b8">' + p + "</text>";
  });
  series.forEach(function (s) {
    const pts = s.values.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); }).join(" ");
    svg += '<polyline points="' + pts + '" fill="none" stroke="' + s.color + '" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>';
    const lastX = X(s.values.length - 1);
    const lastY = Y(s.values[s.values.length - 1]);
    svg += '<circle cx="' + lastX + '" cy="' + lastY + '" r="3" fill="' + s.color + '" stroke="#fff" stroke-width="1"/>';
    svg += '<text x="' + (lastX - 2) + '" y="' + (lastY - 6) + '" text-anchor="end" font-size="9" font-weight="600" fill="' + s.color + '">' + (s.values[s.values.length - 1] > 0 ? "+" : "") + s.values[s.values.length - 1].toFixed(1) + "%</text>";
  });
  svg += "</svg>";
  return svg;
}

function buildHolisticReportBlocks() {
  const blocks = [];

  blocks.push(
    '<div class="hr-meta"><span>Report date <b>2026-09-17</b></span><span>Data as of <b>FY27P2</b></span><span>Baseline <b>FY25P4–FY25P9</b></span><span>Investment period <b>FY25P11–FY27P2</b></span></div>'
  );

  blocks.push(
    '<div class="hr-h"><i>I</i><strong>Executive Summary</strong></div>' +
    '<div class="hr-h4">⚠ Anomaly alerts</div>' +
    '<ul class="hr-alerts">' +
    "<li>" + hrDot("g") + "<span><b>Strongest metric:</b> Traffic uplift by " + hrNum("+9.1%") + "</span></li>" +
    "<li>" + hrDot("r") + "<span><b>Weakest metric:</b> CR% uplift by " + hrNum("−9.8%") + "</span></li>" +
    "<li>" + hrDot("y") + "<span><b>Overall:</b> Sales flat at " + hrNum("+0.3%") + " despite strong Traffic, dragged by significant Conversion decline.</span></li>" +
    "<li>" + hrDot("y") + "<span><b>Outlet channel:</b> Material decline in Sales uplift by " + hrNum("−9.0%") + " with negative Traffic and CR.</span></li>" +
    "<li>" + hrDot("y") + "<span><b>Chengdu:</b> Severe divergence with Traffic uplift " + hrNum("+12.5%") + " but CR% uplift " + hrNum("−14.9%") + ", leading to Sales decline.</span></li>" +
    "<li>" + hrDot("y") + "<span><b>Qingdao:</b> Strong Sales uplift " + hrNum("+7.4%") + " driven by Traffic, though CR% remains negative at " + hrNum("−7.8%") + ".</span></li>" +
    "<li>" + hrDot("y") + "<span><b>Hefei:</b> Top performer with Sales uplift " + hrNum("+14.4%") + " and stable CR%, outperforming all other pilot cities.</span></li>" +
    "</ul>"
  );

  blocks.push(
    '<div class="hr-h4">1.2 Overall core metrics summary</div>' +
    '<p class="hr-note">UPLIFT% — positive values in green, negative in red.</p>' +
    hrTable(
      ["Metric", "PRE", "POST", "VAR%", "UPLIFT%"],
      [
        ["Sales", "7,187.0", "7,916.2", "110.1%", hrNum("+0.3%")],
        ["Traffic", "303.7", "350.8", "115.5%", hrNum("+9.1%")],
        ["CR", "6%", "7%", "114.9%", hrNum("−9.8%")],
        ["SV", "23.7", "22.6", "95.4%", hrNum("−7.9%")],
        ["AT", "379.1", "314.5", "83.0%", hrNum("+0.2%")],
        ["UPT", "1.3", "1.2", "87.2%", hrNum("−1.5%")],
      ]
    ) +
    '<div class="hr-insight"><b>Insight</b>The core metric summary reveals a classic \'traffic-conversion mismatch\': Traffic uplift by +9.1% failed to translate into Sales due to a substantial CR% decline of -9.8%. Consequently, Selling Value (SV) dropped by -7.9%, neutralizing the volume gain. Average Transaction (AT) remained stable with a negligible uplift of +0.2%, indicating that basket size metrics (AUR/UPT) were not the primary drivers of the performance gap.</div>'
  );

  blocks.push(
    '<div class="hr-h"><i>II</i><strong>Monthly Trend Analysis</strong></div>' +
    '<div class="hr-h4">2.1 Monthly Uplift% by core metric</div>' +
    '<p class="hr-note">Sales, Traffic, and CR% only. Monthly Uplift% = Invest City Var% − Non-Invest City Var%.</p>' +
    '<div class="hr-chart"><div class="hr-chart-legend"><span><i style="background:#1f2329;"></i>Sales</span><span><i style="background:#00a06b;"></i>Traffic</span><span><i style="background:#e34d59;"></i>CR%</span></div>' +
    buildHrTrendChart() +
    "</div>"
  );

  blocks.push(
    '<div class="hr-insight"><b>Insight</b>In the latest period (FY27P2), the trend shows signs of stabilization with Sales direction improving. Traffic continues to lead growth at +9.1%, while CR% remains the primary drag at -9.8%. The divergence suggests that while customer acquisition efforts are effective, in-store conversion mechanisms require immediate attention to sustain Sales momentum.</div>'
  );

  blocks.push(
    '<div class="hr-h"><i>III</i><strong>City-Level Breakdown</strong></div>' +
    '<div class="hr-h4">3.1 City performance summary</div>' +
    hrTable(
      ["City", "Sales", "Traffic", "CR%"],
      [
        ["Chengdu", hrDot("r"), hrDot("g"), hrDot("r")],
        ["Xian", hrDot("r"), hrDot("y"), hrDot("r")],
        ["Wuhan", hrDot("r"), hrDot("y"), hrDot("r")],
        ["Qingdao", hrDot("g"), hrDot("g"), hrDot("r")],
        ["Shenzhen", hrDot("g"), hrDot("y"), hrDot("r")],
        ["Hefei", hrDot("g"), hrDot("y"), hrDot("r")],
        ["Total Invest City", "—", "—", "—"],
      ],
      true
    ) +
    '<p class="hr-note">' + hrDot("r") + " Pilot falls behind National Rest &nbsp; " + hrDot("y") + " Better than National Rest, below Pilot average &nbsp; " + hrDot("g") + " Better than National Rest and above Pilot average</p>"
  );

  blocks.push(
    '<div class="hr-h4">3.2 City UPLIFT% data table</div>' +
    hrTable(
      ["City", "Sales UPLIFT%", "Traffic UPLIFT%", "CR% UPLIFT%"],
      [
        ["Chengdu", hrNum("−3.2%"), hrNum("+12.5%"), hrNum("−14.9%")],
        ["Xian", hrNum("−3.1%"), hrNum("+4.4%"), hrNum("−5.6%")],
        ["Wuhan", hrNum("−1.2%"), hrNum("+7.4%"), hrNum("−13.4%")],
        ["Qingdao", hrNum("+7.4%"), hrNum("+18.5%"), hrNum("−7.8%")],
        ["Shenzhen", hrNum("+2.4%"), hrNum("+6.4%"), hrNum("−6.5%")],
        ["Hefei", hrNum("+14.4%"), hrNum("+7.9%"), hrNum("−0.1%")],
        ["Total Invest City", hrNum("+0.3%"), hrNum("+9.1%"), hrNum("−9.8%")],
      ],
      true
    )
  );

  blocks.push(
    '<div class="hr-insight"><b>City insights</b>' +
    "🌟 <b>Top performers — Hefei:</b> highest Sales uplift +14.4%, supported by positive Traffic and stable CR%, demonstrating balanced growth. <b>Qingdao:</b> Sales uplift +7.4% primarily driven by strong Traffic uplift +18.5%, despite weaker conversion. <b>Shenzhen:</b> modest Sales growth +2.4%, with Traffic gains partially offset by declining CR% and UPT.<br><br>" +
    "🔴 <b>Underperformers — Chengdu:</b> Sales declined -3.2% due to a severe CR% drop of -14.9%, which overwhelmed a +12.5% Traffic increase. <b>Xian:</b> Sales fell -3.1% as moderate Traffic growth could not compensate for declines in both CR% and AT. <b>Wuhan:</b> Sales dipped -1.2%, characterized by high Traffic volatility and significant CR% erosion of -13.4%.</div>"
  );

  blocks.push(
    '<div class="hr-h"><i>IV</i><strong>Channel-Level Breakdown</strong></div>' +
    '<div class="hr-h4">4.1 Channel UPLIFT% data table</div>' +
    hrTable(
      ["Channel", "Sales UPLIFT%", "Traffic UPLIFT%", "CR% UPLIFT%"],
      [
        ["Retail", hrNum("+6.7%"), hrNum("+19.5%"), hrNum("−9.6%")],
        ["Outlet", hrNum("−9.0%"), hrNum("−4.9%"), hrNum("−5.6%")],
        ["TTL", hrNum("+0.3%"), hrNum("+9.1%"), hrNum("−9.8%")],
      ],
      true
    ) +
    '<div class="hr-insight"><b>Channel insights</b>' +
    "<b>Overall (TTL):</b> Retail channel acted as the growth engine with Sales uplift +6.7%, while Outlet channel dragged overall performance with a -9.0% decline.<br><br>" +
    "<b>Retail:</b> Strong Traffic generation (+19.5%) but suffered from conversion inefficiencies (-9.6% CR%), resulting in net positive Sales.<br><br>" +
    "<b>Outlet:</b> Headwinds across the board with negative Traffic (-4.9%) and CR% (-5.6%), leading to a broad-based Sales contraction.<br><br>" +
    "<b>Shared weakness:</b> Both channels experienced negative Conversion Rate trends, indicating a systemic issue in closing sales despite varying traffic conditions.</div>"
  );

  blocks.push(
    '<div class="hr-h"><i>V</i><strong>City × Channel Cross-Dimensional Analysis</strong></div>' +
    '<div class="hr-h4">5.1 Cross-dimensional performance summary</div>' +
    hrTable(
      ["City", "Channel", "Sales", "Traffic", "CR%"],
      [
        ["Total Invest City", "Retail", "—", "—", "—"],
        ["Total Invest City", "Outlet", "—", "—", "—"],
        ["Chengdu", "Retail", hrDot("g"), hrDot("g"), hrDot("r")],
        ["Chengdu", "Outlet", hrDot("r"), hrDot("r"), hrDot("r")],
        ["Xian", "Retail", hrDot("r"), hrDot("y"), hrDot("r")],
        ["Xian", "Outlet", hrDot("g"), hrDot("g"), hrDot("r")],
        ["Wuhan", "Retail", hrDot("g"), hrDot("g"), hrDot("r")],
        ["Wuhan", "Outlet", hrDot("r"), hrDot("r"), hrDot("r")],
        ["Qingdao", "Retail", hrDot("y"), hrDot("g"), hrDot("r")],
        ["Qingdao", "Outlet", hrDot("g"), hrDot("g"), hrDot("g")],
        ["Shenzhen", "Retail", hrDot("y"), hrDot("y"), hrDot("r")],
        ["Shenzhen", "Outlet", hrDot("g"), hrDot("r"), hrDot("g")],
        ["Hefei", "Retail", hrDot("g"), hrDot("y"), hrDot("g")],
        ["Hefei", "Outlet", hrDot("g"), hrDot("g"), hrDot("g")],
      ]
    ) +
    '<p class="hr-note">' + hrDot("r") + " Pilot falls behind National Rest &nbsp; " + hrDot("y") + " Better than National Rest, below Pilot average &nbsp; " + hrDot("g") + " Better than National Rest and above Pilot average</p>"
  );

  blocks.push(
    '<div class="hr-h4">5.2 Cross-dimensional data table</div>' +
    hrTable(
      ["City", "Channel", "Sales UPLIFT%", "Traffic UPLIFT%", "CR% UPLIFT%"],
      [
        ["Total Invest City", "Retail", hrNum("+6.7%"), hrNum("+19.5%"), hrNum("−9.6%")],
        ["Total Invest City", "Outlet", hrNum("−9.0%"), hrNum("−4.9%"), hrNum("−5.6%")],
        ["Chengdu", "Retail", hrNum("+14.3%"), hrNum("+34.2%"), hrNum("−14.4%")],
        ["Chengdu", "Outlet", hrNum("−38.4%"), hrNum("−26.0%"), hrNum("−16.1%")],
        ["Xian", "Retail", hrNum("−8.5%"), hrNum("+4.5%"), hrNum("−6.1%")],
        ["Xian", "Outlet", hrNum("+8.5%"), hrNum("+9.0%"), hrNum("−1.7%")],
        ["Wuhan", "Retail", hrNum("+13.4%"), hrNum("+30.6%"), hrNum("−13.5%")],
        ["Wuhan", "Outlet", hrNum("−10.0%"), hrNum("−10.7%"), hrNum("−1.2%")],
        ["Qingdao", "Retail", hrNum("+3.3%"), hrNum("+20.9%"), hrNum("−12.7%")],
        ["Qingdao", "Outlet", hrNum("+23.9%"), hrNum("+7.9%"), hrNum("+13.6%")],
        ["Shenzhen", "Retail", hrNum("+6.4%"), hrNum("+17.4%"), hrNum("−9.2%")],
        ["Shenzhen", "Outlet", hrNum("+4.0%"), hrNum("−4.9%"), hrNum("+8.5%")],
        ["Hefei", "Retail", hrNum("+20.7%"), hrNum("+10.4%"), hrNum("+0.9%")],
        ["Hefei", "Outlet", hrNum("+8.8%"), hrNum("+4.8%"), hrNum("+1.7%")],
      ]
    ) +
    '<div class="hr-insight"><b>Cross-dimensional insight</b>' +
    "<b>Overall:</b> A stark contrast exists between channels: Retail cities like Hefei and Chengdu show high Traffic but mixed Sales outcomes, while Outlet performance is generally weak except for specific pockets like Qingdao Outlet.<br><br>" +
    "<b>Retail channel:</b> Most cities exhibit a 'High Traffic, Low Conversion' pattern; for instance, Chengdu Retail Traffic surged +34.2% but CR% fell -14.4%, yet Sales still grew +14.3% due to volume.<br><br>" +
    "<b>Outlet channel:</b> Highly polarized results; Qingdao Outlet achieved strong Sales uplift +23.9% with positive CR%, whereas Chengdu Outlet collapsed with Sales down -38.4% and negative Traffic/CR.</div>"
  );

  return blocks;
}

function showHolisticReport(sources) {
  cancelActiveStream();
  const titleEl = document.querySelector("#aiAnswerTitle");
  const summaryEl = document.querySelector("#aiAnswerSummary");
  const findingsEl = document.querySelector("#aiAnswerFindings");
  if (titleEl) titleEl.textContent = "Investment Holistic Analysis — COACH Pilot City";
  if (summaryEl) {
    summaryEl.textContent = "";
    summaryEl.hidden = true;
  }
  if (findingsEl) {
    findingsEl.innerHTML = "";
    findingsEl.hidden = true;
  }
  document.querySelector("#aiAnswerSources").innerHTML = renderAiSourcesList(sources);
  resetAiFeedback();
  enterAiAnswerMode();
  let host = document.querySelector("#aiAnswerReport");
  if (!host) {
    host = document.createElement("div");
    host.id = "aiAnswerReport";
    host.className = "holistic-report";
    findingsEl.parentNode.insertBefore(host, findingsEl.nextSibling);
  }
  host.hidden = false;
  host.innerHTML = "";
  document.querySelector("#aiAnswer").hidden = false;
  document.querySelector("#aiAnswer").scrollTop = 0;
  streamBlocksInto(host, buildHolisticReportBlocks(), 110);
}

/* ---------- 4. Pilot city sales rich answer card ---------- */

/* Only the canonical "last month" phrasing gets the fixed rich card.
   The "explore further" follow-ups also contain "pilot city sales
   performance", so matching on that substring alone would send them
   straight back to the same card — require the period wording too. */
function isPilotCitySalesQuestion(question) {
  const normalized = String(question || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return false;
  return (
    normalized.indexOf("pilot city") !== -1 &&
    normalized.indexOf("sales") !== -1 &&
    normalized.indexOf("last month") !== -1
  );
}

const RA_ICON = {
  cart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6"/></svg>',
  tag:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  chart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>',
  store:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v10h16V10"/><path d="M3 6l1.5-3h15L21 6c0 1.7-1.3 3-3 3-1.1 0-2.1-.6-2.6-1.5C14.9 8.4 13.9 9 13 9s-1.9-.6-2.4-1.5C10.1 8.4 9.1 9 8 9 6.3 9 3 7.7 3 6Z"/><path d="M9 20v-5h6v5"/></svg>',
  trend:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>',
  bulb:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2l.1.2h4.8l.1-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z"/></svg>',
};

function buildPilotCitySalesBlocks(sources) {
  const sourceChips = sources
    .slice(0, 3)
    .map(function (asset) {
      return "<span class='ra-source-chip'>" + escapeAiHtml(asset.title) + "</span>";
    })
    .join("");

  const channelStat = function (label, value, isUp) {
    return (
      "<span class='ra-stat'><i>" + label + "</i>" +
      "<b class='" + (isUp ? "ra-up" : "ra-down") + "'>" + value + "</b></span>"
    );
  };

  const channelCard = function (icon, cls, name, uplift, isUp, stats) {
    return (
      '<div class="ra-channel">' +
      "<div class='ra-ch-head'>" +
      '<span class="ra-icon ' + cls + '">' + icon + "</span>" +
      "<span class='ra-ch-name'>" + name + "</span>" +
      "</div>" +
      "<div class='ra-ch-main'>" +
      "<span class='ra-value " + (isUp ? "ra-up" : "ra-down") + "'>" + uplift +
      "<i class='ra-arrow' aria-hidden='true'>" + (isUp ? "▲" : "▼") + "</i></span>" +
      "</div>" +
      "<div class='ra-ch-label'>Sales uplift</div>" +
      "<div class='ra-ch-stats'>" + stats.join("") + "</div>" +
      "</div>"
    );
  };

  const exploreOption = function (icon, title, sub, question) {
    return (
      '<button class="ra-option" type="button" data-ra-question="' + question + '">' +
      '<span class="ra-option-icon">' + icon + "</span>" +
      "<span><strong>" + title + "</strong><small>" + sub + "</small></span>" +
      "</button>"
    );
  };

  const blocks = [];

  blocks.push(
    "<p class='ra-lead'>Last month (FY27P2), Pilot City delivered total Sales of <strong>7,916.2</strong>, with Sales uplift <span class='ra-badge ra-pos'>↑ +0.3%</span> vs. non-invest cities — essentially flat.</p>"
  );

  blocks.push(
    "<div class='ra-divider'></div>" +
    "<p class='ra-sec-title'>Sales by channel</p>" +
    "<p class='ra-sec-sub'>Uplift vs. non-invest cities</p>" +
    "<div class='ra-channels'>" +
    channelCard(RA_ICON.cart, "ra-retail", "Retail", "+6.7%", true, [
      channelStat("Traffic", "+19.5%", true),
      channelStat("CR%", "−9.6%", false),
    ]) +
    channelCard(RA_ICON.tag, "ra-outlet", "Outlet", "−9.0%", false, [
      channelStat("Traffic", "−4.9%", false),
      channelStat("CR%", "−5.6%", false),
    ]) +
    "</div>"
  );

  blocks.push(
    "<p class='ra-insight'>In the latest period (FY27P2), the trend shows signs of stabilization with Sales direction improving. Traffic continues to lead growth at +9.1%, while CR% remains the primary drag at −9.8%. The divergence suggests that while customer acquisition efforts are effective, in-store conversion mechanisms require immediate attention to sustain Sales momentum.</p>"
  );

  blocks.push(
    "<div class='ra-divider'></div>" +
    "<p class='ra-sec-title'>Would you like to explore further?</p>" +
    "<p class='ra-explore-hint'>Here are some quick options:</p>" +
    "<div class='ra-explore'>" +
    exploreOption(RA_ICON.chart, "Analyze 6 cities", "Which cities drive the change?", "Compare pilot city sales performance across the 6 cities") +
    exploreOption(RA_ICON.store, "Channel by city", "How do channels perform in each city?", "Show the city by channel breakdown for pilot cities") +
    exploreOption(RA_ICON.trend, "Compare with previous periods", "Is the trend sustained?", "Compare pilot city sales performance with previous periods") +
    exploreOption(RA_ICON.bulb, "Key insights &amp; next steps", "What's driving the performance?", "What are the key insights and next steps for pilot cities?") +
    "</div>"
  );

  blocks.push(
    "<div class='ra-divider'></div>" +
    "<div class='answer-source-line ra-source-line' aria-label='Sources'><span class='ra-source-label'>Sources used</span>" + sourceChips + "</div>" +
    "<div class='answer-feedback' data-answer-id='" + Date.now() + "'>" +
    "<button type='button' class='answer-feedback-btn' data-chat-feedback='helpful' aria-pressed='false'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' aria-hidden='true'><path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3'></path></svg><span>Helpful</span></button>" +
    "<button type='button' class='answer-feedback-btn' data-chat-feedback='not-helpful' aria-pressed='false'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' aria-hidden='true'><path d='M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3'></path></svg><span>Not helpful</span></button>" +
    "<button type='button' class='answer-feedback-btn copy-answer-btn' data-copy aria-label='Copy answer'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' aria-hidden='true'><rect x='9' y='9' width='13' height='13' rx='2'></rect><path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path></svg><span>Copy</span></button>" +
    "</div>"
  );

  return blocks;
}

function appendPilotCitySalesExchange(question, sources) {
  const thread = document.querySelector("#aiChatThread");
  if (!thread) return;
  const entry = document.createElement("article");
  entry.className = "answer-entry report-chat-entry";
  entry.innerHTML =
    "<div class='user-query'><span class='user-query-bubble'>" + escapeAiHtml(question) + "</span></div>" +
    "<article class='answer-card rich-answer'>" +
    "<div class='answer-card-head'><span>Connected report view</span><small>" + sources.length + " grounded sources</small></div>" +
    "<div class='ra-body'></div>" +
    "</article>";
  thread.appendChild(entry);
  entry.scrollIntoView({ block: "nearest" });
  streamBlocksInto(entry.querySelector(".ra-body"), buildPilotCitySalesBlocks(sources), 140);
}

document.addEventListener("click", function (event) {
  const option = event.target.closest("[data-ra-question]");
  if (!option) return;
  const input = document.querySelector("#aiCommandInput");
  if (input) {
    input.value = option.dataset.raQuestion || "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  }
});

/* ---------- Initial render (after all declarations above) ---------- */

renderCatalog();
if (query.get("dashboard") !== null) {
  if (query.get("view") !== "live") {
    const liveUrl = new URL(window.location.href);
    liveUrl.searchParams.set("view", "live");
    window.history.replaceState({}, "", liveUrl);
  }
  openLiveReport(false);
} else {
  showView("catalog");
}
updateAiVisibility();

/* "view more" one-click expand: show all cards, no toggle back */
function bindViewMore() {
  var note = document.querySelector("#aiRecommendationNote");
  var recs = document.querySelector("#aiRecommendations");
  if (!note || !recs) return;
  note.onclick = function (e) {
    if (recs.classList.contains("show-all")) return;
    e.preventDefault();
    e.stopPropagation();
    recs.classList.add("show-all");
  };
}
bindViewMore();
syncAiCommandState();
