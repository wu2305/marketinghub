(function () {
  const storageKey = "tapestry-field-mapping-analyses-v1";
  const assets = window.marketingKnowledgeAssets || [];
  const types = ["Report Context", "Metric Dictionary", "Analytical Model", "Email Reports"];
  const domains = {
    city: "City Strategy",
    fourp: "4P",
    customer: "Customer",
    abo: "ABO",
    rednote: "Rednote",
    ottolv: "OTTOLV",
  };
  const reportContexts = {
    city: {
      rules: [
        "Invest cities deliver xx% daily traffic uplift, driving xx% daily sales growth and xx% AUR improvement.",
        "Key gaps: CR (xx%), SV (xx%), new customer ratio (xx%) and UPT (xx%) reveal potential conversion and basket-size weaknesses.",
        "Prioritize conversion optimization when supported by the evidence, and state the comparison period and data limitations.",
      ],
      reports: ["scenario-channel-performance", "scenario-campaign-review"],
      scope:
        "Covers the selected invest cities, reporting period and comparable stores. Includes governed traffic, sales, conversion and basket metrics. Excludes test stores, cancelled transactions and returns; incomplete periods must be identified.",
    },
    fourp: {
      rules: [
        "Review Place, Price, Product and Promotion performance. Summarize sales movement of xx% and conversion movement of xx%.",
        "Compare promotion lift of xx% with the approved baseline and distinguish mix changes from underlying demand.",
        "Rank opportunities by supported business impact. State the comparison scope and avoid unsupported causal conclusions.",
      ],
      reports: ["scenario-campaign-review", "scenario-channel-performance"],
      scope:
        "Covers governed 4P metrics for the selected products, stores and reporting period. Uses comparable promotion and baseline scopes. Excludes test campaigns, cancelled orders and returns.",
    },
    customer: {
      rules: [
        "Summarize customer acquisition growth of xx%, activation of xx% and retention of xx% for the selected period.",
        "Compare funnel stages and highlight the largest supported movement of xx percentage points.",
        "Explain cohort definitions and identification coverage before recommending follow-up analysis.",
      ],
      reports: [],
      scope:
        "Covers identified customers and governed acquisition, activation and retention cohorts for the selected period. Excludes test accounts and duplicate customer records; anonymous visits are outside customer-level analysis.",
    },
    abo: {
      rules: [
        "Summarize campaign delivery and conversion performance against the approved targets, with variance of xx%.",
        "Highlight spend movement of xx% and attributed revenue movement of xx%, using the same attribution window.",
        "Identify supported campaign exceptions and distinguish measurement gaps from performance changes.",
      ],
      reports: ["scenario-campaign-review"],
      scope:
        "Covers approved ABO campaigns, media delivery and attributed conversions for the selected dates. Excludes test campaigns, invalid traffic and conversions outside the governed attribution window.",
    },
    rednote: {
      rules: [
        "Summarize reach movement of xx% and engagement rate of xx% across the selected Rednote content.",
        "Compare content and campaign groups using the same reporting window and available conversion coverage.",
        "Separate observed engagement from attributed business outcomes and flag missing attribution.",
      ],
      reports: ["scenario-campaign-review"],
      scope:
        "Covers tracked Rednote campaigns and content with available reach, engagement and attributed conversion data. Excludes deleted or unavailable content metrics and untracked off-platform activity.",
    },
    ottolv: {
      rules: [
        "Summarize video reach movement of xx%, completion rate of xx% and channel efficiency.",
        "Compare OTT and OLV outcomes within the governed deduplication and attribution scope.",
        "Flag cross-channel measurement limitations and recommend only evidence-supported follow-up actions.",
      ],
      reports: ["scenario-channel-performance"],
      scope:
        "Covers available OTT and OLV delivery, reach and completion data for the selected period. Excludes invalid traffic and unsupported cross-device deduplication; conversions follow the approved attribution window.",
    },
  };
  const list = (value) =>
    Array.isArray(value)
      ? value
      : String(value || "")
          .split(/[;,，]/)
          .map((x) => x.trim())
          .filter(Boolean);
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (_) {
      return {};
    }
  };
  const columns = {
    "Report Context": [
      ["report_name", "Report Name"],
      ["report_description", "Report Description"],
      ["business_domain", "Project", "domain"],
      ["ai_interpretation_enabled", "AI interpreter", "state"],
      ["ai_summary_enabled", "AI Summary", "state"],
    ],
    "Metric Dictionary": [
      ["metric_name", "Metric Name"],
      ["metric_aliases", "Synonyms", "tags"],
      ["business_definition", "Business Definition"],
      ["calculation_definition", "Calculation Definition"],
      ["unit", "Unit"],
      ["metric_type", "Type"],
      ["updated_at", "Updated"],
      ["business_domain", "Data Model", "domain"],
    ],
    "Analytical Model": [
      ["analysis_name", "Analysis Name"],
      ["trigger_when", "Trigger When"],
      ["business_domain", "Data Model", "domain"],
      ["status", "Status", "state"],
      ["created_by", "Creator"],
    ],
    "Email Reports": [
      ["email_subject", "Email Subject"],
      ["business_domain", "Data Model", "domain"],
      ["status", "Status", "state"],
      ["sent_at", "Sent At"],
    ],
  };
  function normalize(asset) {
    const domain =
      asset.business_domain || (asset.projects || []).map((p) => domains[p]).filter(Boolean);
    const legacyDisabled =
      asset.status === "Disable" ||
      asset.status === "disable" ||
      asset.usage_status === "Disabled" ||
      asset.isDisabled === true ||
      asset.disabled === true;
    const common = {
      ...asset,
      business_domain:
        asset.business_domain !== undefined
          ? list(asset.business_domain)
          : list(domain).length
            ? list(domain)
            : ["Marketing"],
      updated_at: asset.updated_at || asset.updated || "Not recorded",
      status: legacyDisabled ? "Disable" : "Enable",
    };
    if (asset.type === "Report Context") {
      const project = (asset.projects || []).find((key) => reportContexts[key]);
      const context = reportContexts[project] || {
        rules: [],
        reports: [],
        scope: "Report data scope has not been configured.",
      };
      return {
        ...common,
        report_name:
          asset.report_name ||
          asset.connections?.find((x) => x.kind === "Report")?.name ||
          asset.title,
        report_description: asset.report_description || asset.summary,
        ai_interpretation_enabled: asset.ai_interpretation_enabled ?? Boolean(asset.aiUse?.length),
        ai_summary_enabled: asset.ai_summary_enabled ?? Boolean(asset.aiUse?.length),
        report_thumbnail:
          asset.report_thumbnail || (project ? `../images/project-${project}-tabby.png` : ""),
        ai_interpretation_rules: asset.ai_interpretation_rules ?? context.rules,
        scenario_report_ids: asset.scenario_report_ids ?? context.reports,
        report_data_scope: asset.report_data_scope ?? context.scope,
      };
    }
    if (asset.type === "Metric Dictionary") {
      const definitions = {
        "Member conversion":
          "Qualified member transactions divided by identified member visits within the same conversion window. Excludes unidentified visits and invalid transactions.",
        "Campaign ROI":
          "Attributed campaign revenue divided by media spend for the same reporting period. Excludes unattributed revenue and cancelled transactions.",
        "Promotion lift":
          "Promotion-period sales minus the comparable baseline sales. Uses the same store and product scope; excludes test stores and returns.",
      };
      const aliases = {
        "Member conversion": [
          "Member conversion KPI",
          "Member Conversion Rate",
          "Member Visit-to-Purchase Rate",
          "Member CVR",
        ],
        "Campaign ROI": [
          "Campaign ROI KPI",
          "Campaign Return on Investment",
          "Campaign Investment Return",
          "Marketing Campaign ROI",
        ],
        "Promotion lift": [
          "Promotion lift KPI",
          "Promotional Sales Lift",
          "Incremental Promotion Sales",
          "Sales Uplift",
        ],
      };
      return {
        ...common,
        metric_name: asset.metric_name || asset.title,
        metric_aliases: asset.metric_aliases || aliases[asset.title] || [asset.title + " KPI"],
        business_definition: asset.business_definition || asset.summary,
        calculation_definition:
          asset.calculation_definition ||
          definitions[asset.title] ||
          "Calculation definition has not been configured.",
        unit:
          asset.unit ||
          (asset.title === "Campaign ROI"
            ? "Ratio"
            : asset.title === "Promotion lift"
              ? "CNY"
              : "%"),
        metric_type: asset.metric_type || "Base",
      };
    }
    if (asset.type === "Analytical Model") {
      const model = {
        ...common,
        stage: ["Draft", "Under Review", "Published"].includes(asset.stage)
          ? asset.stage
          : asset.published
            ? "Published"
            : "Draft",
        analysis_name: asset.analysis_name ?? asset.title,
        visibility_scope: asset.visibility_scope || "Public",
        trigger_when:
          asset.trigger_when ||
          asset.triggerWhen ||
          "When a user request matches this analysis approach and its supported business context.",
        aliases: list(asset.aliases ?? ["Opportunity scan"]),
        trigger_keywords: list(
          asset.trigger_keywords ?? ["Find growth opportunities", "Identify performance gaps"],
        ),
        applicable_scenarios: asset.applicable_scenarios ?? asset.summary,
        analysis_steps: list(
          asset.analysis_steps ?? [
            "Confirm the reporting period, business scope and comparison baseline.",
            "Compare performance across channels and regions to locate material gaps.",
            "Evaluate supported drivers and rank opportunities by impact and confidence.",
          ],
        ),
        referenced_metrics: list(asset.referenced_metrics ?? ["Member conversion", "Campaign ROI"]),
        recommended_dimensions: list(
          asset.recommended_dimensions ?? ["Channel", "Region", "Reporting period"],
        ),
        analysis_constraints:
          asset.analysis_constraints ??
          "Do not infer causality from correlation or analyze dimensions without supporting data.",
        output_requirements:
          asset.output_requirements ??
          "Start with an executive summary, then list evidence, prioritized opportunities, limitations and recommended actions.",
        created_by: asset.created_by || asset.owner || "Current User",
        created_at: asset.created_at || asset.created || "Not recorded",
        references: asset.references ?? (asset.connections || []).map((x) => x.name),
      };
      delete model.workflow_status;
      delete model.statusDisplay;
      return model;
    }
    return {
      ...common,
      email_subject: asset.email_subject || asset.emailSubject || asset.title,
      trigger_type:
        asset.trigger_type || (asset.schedule ? "Scheduled · " + asset.schedule : "Not configured"),
      recipients: list(asset.recipients).length ? list(asset.recipients) : ["Emily Wang", "Sophie Taylor", "Daniel Chen"],
      cc_recipients: list(asset.cc_recipients).length ? list(asset.cc_recipients) : ["Grace Liu", "Michael Zhao"],
      sent_at: asset.sent_at || asset.lastSent || "Not recorded",
      data_as_of: asset.data_as_of || "Not recorded",
    };
  }
  function syncStored() {
    Object.entries(read()).forEach(([id, value]) => {
      const index = assets.findIndex((x) => x.id === id && x.type === value.type);
      if (value.deleted) {
        if (index >= 0) assets.splice(index, 1);
        return;
      }
      if (!types.includes(value.type)) return;
      if (index >= 0) Object.assign(assets[index], value);
      else assets.push(value);
    });
  }
  function records(type) {
    syncStored();
    return assets.filter((x) => x.type === type).map(normalize);
  }
  function save(record) {
    const values = read();
    values[record.id] = record;
    localStorage.setItem(storageKey, JSON.stringify(values));
    syncStored();
  }
  function remove(id) {
    const values = read();
    values[id] = { deleted: true };
    localStorage.setItem(storageKey, JSON.stringify(values));
    syncStored();
  }
  syncStored();
  window.knowledgeFieldMapping = {
    types,
    columns,
    records,
    normalize,
    save,
    remove,
    escape,
    list,
    domains,
    storageKey,
  };
})();




