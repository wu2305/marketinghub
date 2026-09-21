(function () {
  const root = document.querySelector("#dataModelOverview");
  const library = document.querySelector("#businessKnowledgeLibrary");
  const tasks = document.querySelector(".business-my-tasks");
  if (!root || !library) return;

  const icon = (path) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
  const escapeHtml = (value) =>
    String(value ?? "").replace(
      /[&<>\"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
    );

  const domains = [
    {
      id: "business-data",
      name: "D2C Insight",
      status: "enable",
      description:
        "Consumer insight data model covering city strategy, 4P performance, traffic, members, conversion, and daily tracking.",
      businessDescription:
        "Governed consumer, city, product, pricing, traffic, member, and conversion data for D2C insight reports.",
      synonyms: ["D2C", "Consumer Insight", "City Strategy", "4P", "Customer Daily Tracking"],
      dataSource: "Marketing Cockpit",
      reports: ["City Strategy", "4P Report", "Customer Daily Tracking"],
      tables: [
        {
          id: "fact_sales_order",
          name: "Sales Order Detail",
          physicalName: "fact_sales_order",
          type: "fact",
          rowCount: "92,468 rows",
          description:
            "Order-level sales fact table containing transaction, product, customer, channel and value measures.",
          fields: [
            {
              field: "order_id",
              name: "Order ID",
              synonyms: ["Order Key"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "order_date",
              name: "Order Date",
              synonyms: ["Transaction Date"],
              fieldType: "Date",
              unit: "-",
              aggregation: "MAX",
            },
            {
              field: "store_id",
              name: "Store ID",
              synonyms: ["Outlet ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "channel_id",
              name: "Channel ID",
              synonyms: ["Sales Channel ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "customer_id",
              name: "Customer ID",
              synonyms: ["Member ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "product_id",
              name: "Product ID",
              synonyms: ["SKU ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "quantity",
              name: "Quantity",
              synonyms: ["Units Sold"],
              fieldType: "Measure",
              unit: "Count",
              aggregation: "SUM",
            },
            {
              field: "sales_amount",
              name: "Sales Amount",
              synonyms: ["GMV", "Revenue"],
              fieldType: "Measure",
              unit: "CNY",
              aggregation: "SUM",
            },
            {
              field: "discount_amount",
              name: "Discount Amount",
              synonyms: ["Promotion Discount"],
              fieldType: "Measure",
              unit: "CNY",
              aggregation: "SUM",
            },
            {
              field: "gross_profit_amount",
              name: "Gross Profit Amount",
              synonyms: ["Profit"],
              fieldType: "Measure",
              unit: "CNY",
              aggregation: "SUM",
            },
          ],
        },
        {
          id: "dim_channel",
          name: "Channel Dimension",
          physicalName: "dim_channel",
          type: "dimension",
          rowCount: "7 rows",
          description:
            "Channel master data including online/offline attributes and channel classifications.",
          fields: [
            {
              field: "channel_id",
              name: "Channel ID",
              synonyms: ["Channel Key"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "channel_code",
              name: "Channel Code",
              synonyms: ["Channel Code"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "channel_name",
              name: "Channel Name",
              synonyms: ["Channel", "Media Channel"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "channel_group",
              name: "Channel Group",
              synonyms: ["Channel Type", "Channel Category"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "online_offline",
              name: "Online / Offline",
              synonyms: ["Channel Form"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
          ],
        },
        {
          id: "dim_customer",
          name: "Customer Dimension",
          physicalName: "dim_customer",
          type: "dimension",
          rowCount: "1,320 rows",
          description: "Customer profile and segment attributes used across governed reports.",
          fields: [
            {
              field: "customer_id",
              name: "Customer ID",
              synonyms: ["Member ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "member_no",
              name: "Member Number",
              synonyms: ["Member Code"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "gender",
              name: "Gender",
              synonyms: ["Sex"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "age_group",
              name: "Age Group",
              synonyms: ["Age Band"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "customer_segment",
              name: "Customer Segment",
              synonyms: ["Segment"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "value_level",
              name: "Value Level",
              synonyms: ["Customer Value"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
          ],
        },
        {
          id: "dim_product",
          name: "Product SKU Dimension",
          physicalName: "dim_product",
          type: "dimension",
          rowCount: "8,540 rows",
          description:
            "Product hierarchy and SKU attributes for category, brand and lifecycle analysis.",
          fields: [
            {
              field: "product_id",
              name: "Product ID",
              synonyms: ["SKU ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "sku_code",
              name: "SKU Code",
              synonyms: ["Product Code"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "product_name",
              name: "Product Name",
              synonyms: ["SKU Name"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "category_name",
              name: "Category",
              synonyms: ["Product Category"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "brand_name",
              name: "Brand",
              synonyms: ["Brand Name"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
          ],
        },
        {
          id: "dim_store",
          name: "Store Dimension",
          physicalName: "dim_store",
          type: "dimension",
          rowCount: "318 rows",
          description:
            "Store and market hierarchy used for regional operations and retail reporting.",
          fields: [
            {
              field: "store_id",
              name: "Store ID",
              synonyms: ["Outlet ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "store_name",
              name: "Store Name",
              synonyms: ["Outlet Name"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "region_id",
              name: "Region ID",
              synonyms: ["Market ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "region_name",
              name: "Region Name",
              synonyms: ["Market"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "store_type",
              name: "Store Type",
              synonyms: ["Retail Format"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
          ],
        },
        {
          id: "dim_date",
          name: "Date Dimension",
          physicalName: "dim_date",
          type: "dimension",
          rowCount: "1,826 rows",
          description:
            "Governed calendar dimension for daily, weekly, monthly and quarterly reporting.",
          fields: [
            {
              field: "date_key",
              name: "Date Key",
              synonyms: ["Day Key"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "date_value",
              name: "Date",
              synonyms: ["Calendar Date"],
              fieldType: "Date",
              unit: "-",
              aggregation: "MAX",
            },
            {
              field: "week_number",
              name: "Week Number",
              synonyms: ["Week"],
              fieldType: "Dimension",
              unit: "Week",
              aggregation: "-",
            },
            {
              field: "month_number",
              name: "Month Number",
              synonyms: ["Month"],
              fieldType: "Dimension",
              unit: "Month",
              aggregation: "-",
            },
            {
              field: "quarter_number",
              name: "Quarter Number",
              synonyms: ["Quarter"],
              fieldType: "Dimension",
              unit: "Quarter",
              aggregation: "-",
            },
          ],
        },
      ],
      relations: [
        { from: "fact_sales_order", to: "dim_channel", label: "left join: channel_id" },
        { from: "fact_sales_order", to: "dim_customer", label: "left join: customer_id" },
        { from: "fact_sales_order", to: "dim_product", label: "left join: product_id" },
        { from: "fact_sales_order", to: "dim_store", label: "left join: store_id" },
        { from: "fact_sales_order", to: "dim_date", label: "left join: order_date" },
      ],
    },
    {
      id: "finance-analysis",
      name: "DC Media Performance",
      status: "enable",
      description:
        "Campaign media performance data model covering audience build, delivery quality, conversion, and ROI review.",
      businessDescription:
        "Audience, campaign, delivery, engagement, conversion, and return data for DC media performance reporting.",
      synonyms: ["DC Media", "ABO", "Campaign Performance", "Audience Build"],
      dataSource: "Marketing Cockpit",
      reports: ["ABO"],
      tables: [
        {
          id: "fact_finance_margin",
          name: "Finance Margin Fact",
          physicalName: "fact_finance_margin",
          type: "fact",
          rowCount: "38,420 rows",
          description: "Daily finance fact table for revenue, cost, margin and budget variance.",
          fields: [
            {
              field: "finance_id",
              name: "Finance ID",
              synonyms: ["Finance Key"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "date_key",
              name: "Date Key",
              synonyms: ["Accounting Date"],
              fieldType: "Date",
              unit: "-",
              aggregation: "MAX",
            },
            {
              field: "department_id",
              name: "Department ID",
              synonyms: ["Cost Center ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "revenue_amount",
              name: "Revenue Amount",
              synonyms: ["Revenue"],
              fieldType: "Measure",
              unit: "CNY",
              aggregation: "SUM",
            },
            {
              field: "cost_amount",
              name: "Cost Amount",
              synonyms: ["Cost"],
              fieldType: "Measure",
              unit: "CNY",
              aggregation: "SUM",
            },
            {
              field: "gross_margin_rate",
              name: "Gross Margin Rate",
              synonyms: ["Margin Rate"],
              fieldType: "Measure",
              unit: "%",
              aggregation: "AVG",
            },
          ],
        },
        {
          id: "dim_department",
          name: "Department Dimension",
          physicalName: "dim_department",
          type: "dimension",
          rowCount: "64 rows",
          description: "Department and cost center hierarchy for finance ownership.",
          fields: [
            {
              field: "department_id",
              name: "Department ID",
              synonyms: ["Cost Center ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "department_name",
              name: "Department Name",
              synonyms: ["Cost Center"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "department_group",
              name: "Department Group",
              synonyms: ["Finance Group"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "owner_name",
              name: "Owner",
              synonyms: ["Budget Owner"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
          ],
        },
        {
          id: "dim_fiscal_calendar",
          name: "Fiscal Calendar Dimension",
          physicalName: "dim_fiscal_calendar",
          type: "dimension",
          rowCount: "1,826 rows",
          description: "Fiscal calendar with accounting periods and financial year attributes.",
          fields: [
            {
              field: "date_key",
              name: "Date Key",
              synonyms: ["Fiscal Date Key"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "fiscal_year",
              name: "Fiscal Year",
              synonyms: ["FY"],
              fieldType: "Dimension",
              unit: "Year",
              aggregation: "-",
            },
            {
              field: "fiscal_month",
              name: "Fiscal Month",
              synonyms: ["FM"],
              fieldType: "Dimension",
              unit: "Month",
              aggregation: "-",
            },
            {
              field: "fiscal_quarter",
              name: "Fiscal Quarter",
              synonyms: ["FQ"],
              fieldType: "Dimension",
              unit: "Quarter",
              aggregation: "-",
            },
          ],
        },
      ],
      relations: [
        { from: "fact_finance_margin", to: "dim_department", label: "left join: department_id" },
        { from: "fact_finance_margin", to: "dim_fiscal_calendar", label: "left join: date_key" },
      ],
    },
    {
      id: "customer-growth",
      name: "Customer Growth",
      hidden: true,
      status: "enable",
      description:
        "Customer lifecycle, membership, touchpoint and funnel data for growth analysis.",
      businessDescription:
        "Member growth, lifecycle and engagement tables for customer operations.",
      synonyms: ["Customer 360", "Member Growth", "Lifecycle Analysis", "Customer Funnel"],
      dataSource: "Customer 360",
      reports: ["Customer 360 Overview", "Customer Daily Pulse", "Customer Funnel Watch"],
      tables: [
        {
          id: "fact_customer_interaction",
          name: "Customer Interaction Fact",
          physicalName: "fact_customer_interaction",
          type: "fact",
          rowCount: "128,734 rows",
          description: "Customer touchpoint and engagement event facts across channels.",
          fields: [
            {
              field: "interaction_id",
              name: "Interaction ID",
              synonyms: ["Touchpoint ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "customer_id",
              name: "Customer ID",
              synonyms: ["Member ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "channel_id",
              name: "Channel ID",
              synonyms: ["Touchpoint Channel"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "visit_count",
              name: "Visit Count",
              synonyms: ["Sessions"],
              fieldType: "Measure",
              unit: "Count",
              aggregation: "SUM",
            },
            {
              field: "engagement_rate",
              name: "Engagement Rate",
              synonyms: ["Interaction Rate"],
              fieldType: "Measure",
              unit: "%",
              aggregation: "AVG",
            },
            {
              field: "event_date",
              name: "Event Date",
              synonyms: ["Interaction Date"],
              fieldType: "Date",
              unit: "-",
              aggregation: "MAX",
            },
          ],
        },
        {
          id: "dim_customer_profile",
          name: "Customer Profile Dimension",
          physicalName: "dim_customer_profile",
          type: "dimension",
          rowCount: "48,120 rows",
          description: "Unified customer profile with lifecycle, tier and value attributes.",
          fields: [
            {
              field: "customer_id",
              name: "Customer ID",
              synonyms: ["Profile ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "customer_name",
              name: "Customer Name",
              synonyms: ["Full Name"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "lifecycle_stage",
              name: "Lifecycle Stage",
              synonyms: ["Stage"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "membership_level",
              name: "Membership Level",
              synonyms: ["Tier"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "last_visit_date",
              name: "Last Visit Date",
              synonyms: ["Recent Visit"],
              fieldType: "Date",
              unit: "-",
              aggregation: "MAX",
            },
          ],
        },
        {
          id: "dim_member_segment",
          name: "Member Segment Dimension",
          physicalName: "dim_member_segment",
          type: "dimension",
          rowCount: "34 rows",
          description: "Member segment definitions and lifecycle groups for customer analytics.",
          fields: [
            {
              field: "segment_id",
              name: "Segment ID",
              synonyms: ["Tier ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "segment_name",
              name: "Segment Name",
              synonyms: ["Tier Name"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "segment_level",
              name: "Segment Level",
              synonyms: ["Tier Level"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "active_members",
              name: "Active Members",
              synonyms: ["Members"],
              fieldType: "Measure",
              unit: "Count",
              aggregation: "SUM",
            },
          ],
        },
      ],
      relations: [
        {
          from: "fact_customer_interaction",
          to: "dim_customer_profile",
          label: "left join: customer_id",
        },
        { from: "dim_customer_profile", to: "dim_member_segment", label: "left join: segment_id" },
      ],
    },
    {
      id: "social-media",
      name: "DG Media Tracking",
      status: "enable",
      description:
        "DG media tracking data model covering Rednote content, creative quality, OTT/OLV exposure, reach, frequency, and source integrity.",
      businessDescription:
        "Content, creative, reach, exposure, frequency, and source tracking data for DG media reporting.",
      synonyms: ["DG Media", "Rednote Tracking", "OTT / OLV", "Media Exposure"],
      dataSource: "Marketing Cockpit",
      reports: ["Rednote Tracking", "OTT / OLV"],
      tables: [
        {
          id: "fact_engagement",
          name: "Engagement Event Fact",
          physicalName: "fact_engagement",
          type: "fact",
          rowCount: "74,902 rows",
          description: "Social reach and interaction facts by content, creator and date.",
          fields: [
            {
              field: "engagement_id",
              name: "Engagement ID",
              synonyms: ["Interaction ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "content_id",
              name: "Content ID",
              synonyms: ["Post ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "reach",
              name: "Reach",
              synonyms: ["Exposure"],
              fieldType: "Measure",
              unit: "Count",
              aggregation: "SUM",
            },
            {
              field: "likes",
              name: "Likes",
              synonyms: ["Favorites"],
              fieldType: "Measure",
              unit: "Count",
              aggregation: "SUM",
            },
            {
              field: "comments",
              name: "Comments",
              synonyms: ["Replies"],
              fieldType: "Measure",
              unit: "Count",
              aggregation: "SUM",
            },
            {
              field: "event_date",
              name: "Event Date",
              synonyms: ["Interaction Date"],
              fieldType: "Date",
              unit: "-",
              aggregation: "MAX",
            },
          ],
        },
        {
          id: "dim_content",
          name: "Content Dimension",
          physicalName: "dim_content",
          type: "dimension",
          rowCount: "12,486 rows",
          description:
            "Social content attributes including topic, format, creator and publish date.",
          fields: [
            {
              field: "content_id",
              name: "Content ID",
              synonyms: ["Post ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "content_title",
              name: "Content Title",
              synonyms: ["Post Title"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "content_type",
              name: "Content Type",
              synonyms: ["Format"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "creator_name",
              name: "Creator",
              synonyms: ["Author"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "publish_date",
              name: "Publish Date",
              synonyms: ["Release Date"],
              fieldType: "Date",
              unit: "-",
              aggregation: "MAX",
            },
          ],
        },
        {
          id: "fact_mention",
          name: "Mention Event Fact",
          physicalName: "fact_mention",
          type: "fact",
          rowCount: "21,806 rows",
          description: "Brand, campaign and product mention facts with sentiment signals.",
          fields: [
            {
              field: "mention_id",
              name: "Mention ID",
              synonyms: ["Reference ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "content_id",
              name: "Content ID",
              synonyms: ["Post ID"],
              fieldType: "Identifier",
              unit: "-",
              aggregation: "-",
            },
            {
              field: "mention_count",
              name: "Mention Count",
              synonyms: ["Mentions"],
              fieldType: "Measure",
              unit: "Count",
              aggregation: "SUM",
            },
            {
              field: "sentiment_score",
              name: "Sentiment Score",
              synonyms: ["Tone"],
              fieldType: "Measure",
              unit: "Score",
              aggregation: "AVG",
            },
            {
              field: "source_platform",
              name: "Source Platform",
              synonyms: ["Platform"],
              fieldType: "Dimension",
              unit: "-",
              aggregation: "-",
            },
          ],
        },
      ],
      relations: [
        { from: "fact_engagement", to: "dim_content", label: "left join: content_id" },
        { from: "fact_mention", to: "dim_content", label: "left join: content_id" },
      ],
    },
  ];

  const state = {
    query: "",
    selectedDomainId: domains[0]?.id || null,
    activeTab: "basic",
    drawerOpen: false,
    drawerTab: "fields",
    selectedTableId: null,
    previewOpen: false,
    graphScale: 1,
    graphX: 0,
    graphY: 0,
  };

  const elements = {};
  const currentDomain = () =>
    domains.find((domain) => domain.id === state.selectedDomainId) || domains[0];
  const currentTable = () => {
    const domain = currentDomain();
    return domain?.tables.find((table) => table.id === state.selectedTableId) || domain?.tables[0];
  };
  const filteredDomains = () => {
    const query = state.query.trim().toLowerCase();
    const visibleDomains = domains.filter((domain) => !domain.hidden);
    if (!query) return visibleDomains;
    return visibleDomains.filter((domain) =>
      [domain.name, domain.description, domain.businessDescription, domain.synonyms.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  };

  const tagList = (items, className = "dm-tag", listClass = "") => {
    const values = (items || []).filter(Boolean);
    if (!values.length) return `<span class="dm-empty-inline">None</span>`;
    return `<div class="dm-tags ${listClass}">${values.map((item) => `<span class="${className}">${escapeHtml(item)}</span>`).join("")}</div>`;
  };

  const reportContextByDomain = {
    "business-data": "city-report-context",
    "finance-analysis": "abo-report-context",
    "social-media": "rednote-report-context",
  };

  const reportContextByReport = {
    "City Strategy": "city-report-context",
    "4P Report": "fourp-report-context",
    "Customer Daily Tracking": "customer-report-context",
    ABO: "abo-report-context",
    "Rednote Tracking": "rednote-report-context",
    "OTT / OLV": "ottolv-report-context",
  };

  const reportDetailMeta = {
    "City Strategy": "D2C Insight",
    "4P Report": "D2C Insight",
    "Customer Daily Tracking": "D2C Insight",
    ABO: "DC Media Performance",
    "Rednote Tracking": "DG Media Tracking",
    "OTT / OLV": "DG Media Tracking",
  };

  const reportLinks = (domain) =>
    `<div class="dm-related-reports">${domain.reports
      .map(
        (report) => `
    <button class="dm-related-report" type="button" data-report-context-id="${escapeHtml(reportContextByReport[report] || reportContextByDomain[domain.id] || "city-report-context")}" aria-label="Open ${escapeHtml(report)} Report Context">
      <span class="dm-related-icon" aria-hidden="true">${icon("M7 3.5h6l4 4V20.5H7V3.5Zm6 0v5h5")}</span>
      <span class="dm-related-copy"><strong>${escapeHtml(report)}</strong></span>
      <b aria-hidden="true">›</b>
    </button>
  `,
      )
      .join("")}</div>`;

  const previewValue = (field, index) => {
    const key = String(field.field || "").toLowerCase();
    if (/date|time|day|month|quarter|year/.test(key))
      return `2026-09-${String(index + 1).padStart(2, "0")}`;
    if (/rate|share|ratio|pct|percent|score|sentiment/.test(key))
      return `${(12 + index * 0.8).toFixed(1)}%`;
    if (/spend|gmv|value|amount|cost|revenue|sales|profit/.test(key))
      return `CNY ${(1200 + index * 86).toLocaleString("en-US")}`;
    if (
      /count|orders|buyers|clicks|impressions|conversions|visits|likes|comments|mentions|reach|quantity|members/.test(
        key,
      )
    )
      return String((index + 1) * 120);
    if (/_id$|id$/.test(key)) return String(1000 + index);
    return `${field.name} ${index + 1}`;
  };

  const fieldFormat = (field) => {
    const key = String(field.field || "").toLowerCase();
    if (field.fieldType === "Date" || /date|time/.test(key)) return "date";
    if (field.fieldType === "Identifier" || /_id$|id$/.test(key)) return "bigint";
    if (field.fieldType === "Measure") {
      if (field.unit === "%") return "decimal(8,2)";
      if (field.unit === "CNY") return "decimal(12,2)";
      return "bigint";
    }
    return "varchar(64)";
  };

  function renderShell() {
    root.innerHTML = `
      <section class="dm-domain-shell">
        <aside class="dm-domain-sidebar">
          <label class="dm-search-wrap">
            ${icon("M21 21l-4.3-4.3M19 11a8 8 0 11-16 0 8 8 0 0116 0")}
            <input class="dm-search" id="dmDomainSearch" type="search" placeholder="Search data model" autocomplete="off">
          </label>
          <div class="dm-domain-list" id="dmDomainList" role="listbox" aria-label="Data models"></div>
        </aside>

        <section class="dm-domain-main">
          <div class="dm-domain-tabs" role="tablist" aria-label="Data model tabs">
            <button class="dm-domain-tab active" type="button" data-tab="basic">Basic information</button>
            <button class="dm-domain-tab" type="button" data-tab="graph">Relationship graph</button>
          </div>

          <div class="dm-domain-panel">
            <section class="dm-domain-tab-content active" id="dmBasicTab"></section>
            <section class="dm-domain-tab-content" id="dmGraphTab"></section>
          </div>
        </section>
      </section>
    `;

    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="dm-scrim" id="dmScrim" hidden></div>
      <div class="dm-table-drawer" id="dmTableDrawer" aria-hidden="true">
        <section class="dm-table-dialog" role="dialog" aria-modal="true" aria-labelledby="dmDrawerTitle">
          <header class="dm-table-drawer-head">
            <div class="dm-table-drawer-head-copy">
              <div class="dm-table-drawer-titleline">
                <strong id="dmDrawerTitle"></strong>
                <mark class="dm-table-type" id="dmDrawerType"></mark>
              </div>
              <small id="dmDrawerDesc"></small>
            </div>
            <button class="dm-icon-btn" id="dmDrawerClose" type="button" aria-label="Close table detail" title="Close">${icon("M6 6l12 12M18 6 6 18")}</button>
          </header>
          <nav class="dm-table-dialog-tabs" aria-label="Table detail tabs">
            <button class="dm-table-dialog-tab" type="button" data-dm-table-tab="fields">Field Details</button>
            <button class="dm-table-dialog-tab" type="button" data-dm-table-tab="preview">Data Preview</button>
          </nav>
          <div class="dm-table-drawer-body">
            <section id="dmTableBasic"></section>
          </div>
        </section>
      </div>
    `,
    );

    elements.search = document.querySelector("#dmDomainSearch");
    elements.domainList = document.querySelector("#dmDomainList");
    elements.basicTab = document.querySelector("#dmBasicTab");
    elements.graphTab = document.querySelector("#dmGraphTab");
    elements.scrim = document.querySelector("#dmScrim");
    elements.drawer = document.querySelector("#dmTableDrawer");
    elements.drawerTitle = document.querySelector("#dmDrawerTitle");
    elements.drawerDesc = document.querySelector("#dmDrawerDesc");
    elements.drawerType = document.querySelector("#dmDrawerType");
    elements.drawerClose = document.querySelector("#dmDrawerClose");
    elements.tableBasic = document.querySelector("#dmTableBasic");

    bind();
    render();
  }

  function renderDomainList() {
    const list = filteredDomains();
    if (list.length && !list.some((domain) => domain.id === state.selectedDomainId)) {
      state.selectedDomainId = list[0].id;
    }
    elements.domainList.innerHTML = list.length
      ? list
          .map(
            (domain) => `
        <button class="dm-domain-card ${domain.id === state.selectedDomainId ? "active" : ""}" type="button" data-domain-id="${escapeHtml(domain.id)}" aria-selected="${domain.id === state.selectedDomainId}">
          <span class="dm-domain-dot" aria-hidden="true"></span>
          <span class="dm-domain-copy">
            <strong>${escapeHtml(domain.name)}</strong>
            <small>${escapeHtml(domain.description)}</small>
          </span>
          <b>${escapeHtml(domain.tables.length)} tables</b>
        </button>
      `,
          )
          .join("")
      : `<div class="dm-empty">No matching data models.</div>`;
  }

  function renderTabs() {
    const domain = currentDomain();
    const graphTab = document.querySelector('.dm-domain-tab[data-tab="graph"]');
    if (graphTab && domain) {
      graphTab.innerHTML = `Relationship graph <span class="dm-tab-count">${escapeHtml(domain.tables.length)}</span>`;
    }
    document.querySelectorAll(".dm-domain-tab").forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === state.activeTab);
    });
    elements.basicTab.classList.toggle("active", state.activeTab === "basic");
    elements.graphTab.classList.toggle("active", state.activeTab === "graph");
  }

  function renderBasic() {
    const domain = currentDomain();
    if (!domain) return;
    const isEnabled = domain.status === "enable";
    elements.basicTab.innerHTML = `
      <div class="dm-basic-card dm-basic-card-legacy">
        <section class="dm-basic-section dm-basic-name-section dm-basic-hero-section">
          <div class="dm-basic-name-row">
            <strong>${escapeHtml(domain.name)}</strong>
            <span class="fm-report-card-status ${isEnabled ? "" : "is-disabled"}"><i aria-hidden="true"></i>${isEnabled ? "Enabled" : "Disabled"}</span>
          </div>
          <p class="dm-basic-summary">${escapeHtml(domain.description)}</p>
        </section>
        <section class="dm-basic-section dm-basic-synonyms-section">
          <span class="dm-basic-label">Synonyms <em>${escapeHtml(domain.synonyms.length)}</em></span>
          ${tagList(domain.synonyms, "dm-tag dm-synonym-tag", "dm-synonym-list")}
        </section>
        <section class="dm-basic-section dm-basic-related-section">
          <span class="dm-basic-label">Related reports <em>${escapeHtml(domain.reports.length)}</em></span>
          ${reportLinks(domain)}
        </section>
      </div>
    `;
  }

  function renderGraph() {
    const domain = currentDomain();
    if (!domain) return;
    const central = domain.tables.find((table) => table.type === "fact") || domain.tables[0];
    const rest = domain.tables.filter((table) => table.id !== central.id).slice(0, 5);
    const nodes = [central, ...rest];
    const paths = [
      "M300 420 C390 420, 390 175, 455 175",
      "M300 440 C390 440, 390 455, 455 455",
      "M300 460 C390 460, 390 735, 455 735",
      "M300 480 C650 480, 650 280, 925 280",
      "M300 500 C650 500, 650 650, 925 650",
    ];
    elements.graphTab.innerHTML = `
      <div class="dm-graph-card">
        <div class="dm-graph-canvas">
          <div class="dm-graph-viewport">
          <svg class="dm-graph-links" viewBox="0 0 1200 920" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <marker id="dmArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z"></path>
              </marker>
            </defs>
            ${(domain.relations || []).map((relation, index) => `<path class="dm-graph-link" d="${paths[index % paths.length]}" data-from="${escapeHtml(relation.from)}" data-to="${escapeHtml(relation.to)}" />`).join("")}
          </svg>
          ${nodes
            .map(
              (table, index) => `
            <button class="dm-graph-node ${table.type === "fact" ? "is-fact" : "is-dimension"} dm-node-${index + 1}" type="button" data-table-id="${escapeHtml(table.id)}">
              <header>
                <strong>${escapeHtml(table.name)}</strong>
                <span>${escapeHtml(table.physicalName)}</span>
                <div class="dm-node-meta"><small>${escapeHtml(table.rowCount)}</small><em>${table.type === "fact" ? "Fact" : "Dimension"}</em></div>
              </header>
              <div class="dm-node-fields">
                ${table.fields.map((field) => `<div><code>${escapeHtml(field.field)}</code><span>${escapeHtml(field.name)}</span><small>${escapeHtml(fieldFormat(field))}</small></div>`).join("")}
              </div>
            </button>
          `,
            )
            .join("")}
          </div>
          <div class="dm-graph-tools" aria-label="Relationship graph zoom controls">
            <button type="button" data-graph-action="in" aria-label="Zoom in" title="Zoom in">+</button>
            <button type="button" data-graph-action="out" aria-label="Zoom out" title="Zoom out">−</button>
            <button type="button" data-graph-action="fit" aria-label="Fit graph" title="Fit graph">${icon("M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7")}</button>
          </div>
        </div>
      </div>
    `;
    requestAnimationFrame(() =>
      fitGraph(state.graphScale === 1 && state.graphX === 0 && state.graphY === 0),
    );
  }

  function applyGraphTransform() {
    const viewport = elements.graphTab?.querySelector(".dm-graph-viewport");
    if (viewport)
      viewport.style.transform = `translate(${state.graphX}px, ${state.graphY}px) scale(${state.graphScale})`;
  }

  function fitGraph(force = true) {
    const canvas = elements.graphTab?.querySelector(".dm-graph-canvas");
    if (!canvas || (!force && !canvas.offsetWidth)) return;
    state.graphScale = Math.min(1, Math.max(0.42, (canvas.clientWidth - 36) / 1200));
    state.graphX = Math.max(18, (canvas.clientWidth - 1200 * state.graphScale) / 2);
    state.graphY = 18;
    applyGraphTransform();
  }

  function zoomGraph(delta, clientX, clientY) {
    const canvas = elements.graphTab?.querySelector(".dm-graph-canvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const oldScale = state.graphScale;
    const nextScale = Math.min(1.5, Math.max(0.35, oldScale + delta));
    const x = (clientX ?? rect.left + rect.width / 2) - rect.left;
    const y = (clientY ?? rect.top + rect.height / 2) - rect.top;
    state.graphX = x - (x - state.graphX) * (nextScale / oldScale);
    state.graphY = y - (y - state.graphY) * (nextScale / oldScale);
    state.graphScale = nextScale;
    applyGraphTransform();
  }

  function renderTableDrawer() {
    const domain = currentDomain();
    const table = currentTable();
    if (!domain || !table) return;
    const isFact = table.type === "fact";
    elements.drawerTitle.textContent = table.name;
    elements.drawerDesc.textContent = table.description;
    elements.drawerType.textContent = isFact ? "Fact" : "Dimension";
    elements.drawerType.className = `dm-table-type ${isFact ? "is-fact" : "is-dimension"}`;
    elements.drawer.querySelectorAll("[data-dm-table-tab]").forEach((button) => {
      const isActive = button.dataset.dmTableTab === state.drawerTab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    const fieldColumns = isFact
      ? `
            <th>Field</th>
            <th>Name</th>
            <th>Synonyms</th>
            <th>Unit</th>
        `
      : `
            <th>Field</th>
            <th>Name</th>
            <th>Synonyms</th>
        `;
    const fieldRows = table.fields
      .map(
        (field) => `
      <tr>
        <td><strong class="dm-field-code">${escapeHtml(field.field)}</strong></td>
        <td>${escapeHtml(field.name)}</td>
        <td>${tagList(field.synonyms, "dm-field-tag")}</td>
        ${isFact ? `<td>${escapeHtml(field.unit)}</td>` : ""}
      </tr>
    `,
      )
      .join("");
    if (state.drawerTab === "preview") {
      const columns = table.fields.map((field) => `<th>${escapeHtml(field.field)}</th>`).join("");
      const rows = Array.from(
        { length: 10 },
        (_, rowIndex) =>
          `<tr>${table.fields.map((field) => `<td>${escapeHtml(previewValue(field, rowIndex))}</td>`).join("")}</tr>`,
      ).join("");
      elements.tableBasic.innerHTML = `<div class="dm-preview-wrap"><table class="dm-preview-table"><thead><tr>${columns}</tr></thead><tbody>${rows}</tbody></table></div>`;
    } else {
      elements.tableBasic.innerHTML = `
        <section class="dm-fields-wrap">
          <table class="dm-fields-table">
            <thead>
              <tr>${fieldColumns}</tr>
            </thead>
            <tbody>${fieldRows}</tbody>
          </table>
        </section>
      `;
    }
  }

  function renderPreviewModal() {
    return;
  }

  function closePreview() {
    state.previewOpen = false;
    state.drawerTab = "fields";
    render();
  }

  function openTable(tableId) {
    state.selectedTableId = tableId;
    state.drawerOpen = true;
    state.drawerTab = "fields";
    state.previewOpen = false;
    render();
  }

  function closeTableDrawer() {
    state.drawerOpen = false;
    state.selectedTableId = null;
    state.previewOpen = false;
    render();
  }

  function render() {
    renderDomainList();
    renderTabs();
    renderBasic();
    renderGraph();

    if (state.drawerOpen && currentTable()) {
      renderTableDrawer();
      elements.scrim.hidden = false;
      elements.drawer.classList.add("open");
      elements.drawer.setAttribute("aria-hidden", "false");
      document.body.classList.add("dm-drawer-open");
    } else {
      elements.drawer.classList.remove("open");
      elements.drawer.setAttribute("aria-hidden", "true");
      elements.scrim.hidden = true;
      document.body.classList.remove("dm-drawer-open");
    }
  }

  function bind() {
    elements.search.addEventListener("input", (event) => {
      state.query = event.target.value;
      render();
    });

    elements.domainList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-domain-id]");
      if (!button) return;
      state.selectedDomainId = button.dataset.domainId;
      state.activeTab = "basic";
      state.drawerOpen = false;
      render();
    });

    document.addEventListener("click", (event) => {
      const tab = event.target.closest(".dm-domain-tab");
      if (tab) {
        state.activeTab = tab.dataset.tab || "basic";
        render();
        return;
      }

      const tableTab = event.target.closest("[data-dm-table-tab]");
      if (tableTab) {
        state.drawerTab = tableTab.dataset.dmTableTab || "fields";
        renderTableDrawer();
        tableTab.focus();
        return;
      }

      const graphNode = event.target.closest(".dm-graph-node");
      if (graphNode) {
        openTable(graphNode.dataset.tableId);
        return;
      }

      const graphAction = event.target.closest("[data-graph-action]");
      if (graphAction) {
        if (graphAction.dataset.graphAction === "fit") fitGraph(true);
        else zoomGraph(graphAction.dataset.graphAction === "in" ? 0.12 : -0.12);
        return;
      }

      const reportLink = event.target.closest("[data-report-context-id]");
      if (reportLink) {
        document.dispatchEvent(
          new CustomEvent("reportcontext:view", {
            detail: { id: reportLink.dataset.reportContextId },
          }),
        );
      }
    });

    elements.scrim.addEventListener("click", closeTableDrawer);
    let dragging = false,
      dragX = 0,
      dragY = 0,
      startX = 0,
      startY = 0;
    elements.graphTab.addEventListener(
      "wheel",
      (event) => {
        const canvas = event.target.closest(".dm-graph-canvas");
        if (!canvas) return;
        event.preventDefault();
        zoomGraph(event.deltaY < 0 ? 0.08 : -0.08, event.clientX, event.clientY);
      },
      { passive: false },
    );
    elements.graphTab.addEventListener("pointerdown", (event) => {
      const canvas = event.target.closest(".dm-graph-canvas");
      if (!canvas || event.target.closest(".dm-graph-node,.dm-graph-tools")) return;
      dragging = true;
      dragX = event.clientX;
      dragY = event.clientY;
      startX = state.graphX;
      startY = state.graphY;
      canvas.classList.add("is-panning");
      canvas.setPointerCapture(event.pointerId);
    });
    elements.graphTab.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      state.graphX = startX + event.clientX - dragX;
      state.graphY = startY + event.clientY - dragY;
      applyGraphTransform();
    });
    elements.graphTab.addEventListener("pointerup", (event) => {
      if (!dragging) return;
      dragging = false;
      event.target.closest(".dm-graph-canvas")?.classList.remove("is-panning");
    });
    elements.drawerClose?.addEventListener("click", closeTableDrawer);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.drawerOpen) closeTableDrawer();
    });
  }

  function toggle(type) {
    const active = type === "Data Model";
    root.hidden = !active;
    library.hidden = active;
    if (tasks) tasks.hidden = active;
    if (active && !root.dataset.ready) {
      root.dataset.ready = "true";
      renderShell();
    } else if (active) {
      render();
    } else if (root.dataset.ready) {
      state.drawerOpen = false;
      state.previewOpen = false;
      elements.scrim.hidden = true;
      elements.drawer.classList.remove("open");
      document.body.classList.remove("dm-drawer-open");
    }
  }

  document.addEventListener("knowledge:typechange", (event) => toggle(event.detail.type));
  toggle(new URLSearchParams(location.search).get("type"));
})();

