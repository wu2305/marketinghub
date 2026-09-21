(function () {
  const data = window.knowledgeFieldMapping,
    library = document.querySelector("#businessKnowledgeLibrary");
  if (!data || !library) return;
  const esc = data.escape;
  const section = document.createElement("section");
  section.id = "fmLibrary";
  section.className = "fm-library";
  section.hidden = true;
  library.append(section);
  let type = "",
    search = "",
    statuses = [],
    summaryStatuses = [],
    selectedDomains = [],
    selectedMetricTypes = [],
    selectedCreators = [],
    page = 1,
    pageSize = 10,
    current = null,
    returnFocus = null,
    previousOverflow = "";
  const eye =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/></svg>';
  const actionIcons = {
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L12 14l-4 1 1-4 7.5-7.5z"/></svg>',
    delete:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>',
    disable:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/></svg>',
  };
  const currentUser = "Current User";
  const isOwner = (record) => record.created_by === currentUser;
  const reportContextProjects = [
    { label: "D2C Insights", domains: ["City Strategy", "4P", "Customer"] },
    { label: "DC Media Performance", domains: ["ABO"] },
    { label: "DG Media Tracking", domains: ["Rednote", "OTTOLV"] },
  ];
  const reportContextProjectOptions = reportContextProjects.map((project) => project.label);
  const reportContextProjectLabels = (record) => {
    const domains = data.list(record.business_domain);
    const labels = reportContextProjects
      .filter((project) => project.domains.some((domain) => domains.includes(domain)))
      .map((project) => project.label);
    return labels.length ? labels : domains;
  };
  const tags = (values, domain = false) =>
    `<div class="fm-tags">${
      data
        .list(values)
        .map(
          (value) =>
            `<span class="fm-chip ${domain ? "fm-domain-" + (Array.from(value).reduce((sum, c) => sum + c.charCodeAt(0), 0) % 5) : ""}">${esc(value)}</span>`,
        )
        .join("") || "—"
    }</div>`;
  const reportContextState = (value) => (value ? "Open" : "Close");
  function state(value, plain = false) {
    if (plain) return `<span class="fm-state-text">${esc(value)}</span>`;
    if (value === "Enable" || value === "Disable")
      return `<span class="fm-state ${value === "Disable" ? "off" : ""}">${value === "Enable" ? "Enabled" : "Disabled"}</span>`;
    const label = typeof value === "boolean" ? (value ? "Enabled" : "Disabled") : value;
    return `<span class="fm-state ${label === "Disabled" ? "off" : ""}">${esc(label)}</span>`;
  }
  function cellTitle(record, key, format) {
    if (format) return "";
    const tooltipFields = new Set(["business_definition", "calculation_definition"]);
    if (type !== "Metric Dictionary" || !tooltipFields.has(key)) return "";
    const raw = record[key];
    const text = Array.isArray(raw) ? raw.join(", ") : raw || "";
    return text ? ` title="${esc(text)}"` : "";
  }
  function value(record, key, format) {
    const result =
      key === "keywords"
        ? [...data.list(record.aliases), ...data.list(record.trigger_keywords)]
        : record[key];
    if (format === "flow")
      return `<span class="bt-flow-status" data-flow-status="${esc(result)}">${esc(result)}</span>`;
    const text =
      format === "domain"
        ? tags(type === "Report Context" ? reportContextProjectLabels(record) : result, true)
        : format === "tags"
          ? tags(result)
          : format === "state" && type === "Report Context"
            ? state(reportContextState(result), true)
            : format === "state"
              ? state(result)
            : esc(Array.isArray(result) ? result.join(", ") : result || "—");
    return type === "Analytical Model" && key === "analysis_name" && record.stage === "Draft"
      ? `${text}<sup class="fm-draft-badge">Draft</sup>`
      : text;
  }
  function actions(record) {
    if (type === "Report Context") return "";
    if (type !== "Analytical Model") return "";
    const owner = isOwner(record),
      offline = record.status === "Disable";
    return ["edit", "delete", "disable"]
      .map((action) => {
        const permissionBlocked = !owner;
        const statusBlocked = (offline && action === "disable") || (!offline && action !== "disable");
        const blocked = permissionBlocked || statusBlocked;
        const permissionMessage = "Knowledge created by others cannot be operated.";
        const statusTitle = offline && action === "disable" ? "Already disabled" : "Disable knowledge first";
        return `<button class="fm-button fm-icon-action ${action === "delete" ? "danger" : ""} ${blocked ? "is-action-disabled" : ""}" data-fm-action="${action}" ${permissionBlocked ? `data-action-disabled="${esc(permissionMessage)}"` : offline && action === "disable" ? `data-action-disabled="${esc("This knowledge is already disabled.")}"` : ""} ${blocked ? "disabled" : ""} aria-disabled="${blocked ? "true" : "false"}" aria-label="${action[0].toUpperCase() + action.slice(1)}" title="${permissionBlocked ? permissionMessage : blocked ? statusTitle : action[0].toUpperCase() + action.slice(1)}">${actionIcons[action]}</button>`;
      })
      .join("");
  }
  function reportContextCard(record) {
    const dataModel = reportContextProjectLabels(record).join(", ") || "—";
    return `<article class="fm-report-card" tabindex="0" data-fm-id="${esc(record.id)}" aria-label="View ${esc(record.report_name)}">
      <div class="fm-report-card-body">
        <div class="fm-report-card-head">
          <div class="fm-report-card-title-row"><h3>${esc(record.report_name)}</h3><span class="fm-report-card-status ${record.ai_interpretation_enabled ? "" : "is-disabled"}"><i aria-hidden="true"></i>${record.ai_interpretation_enabled ? "Enabled" : "Disabled"}</span></div>
          <p>${esc(record.report_description)}</p>
          <dl class="fm-report-card-meta">
            <div><dt>Project</dt><dd>${esc(dataModel)}</dd></div>
          </dl>
        </div>
      </div>
      <div class="fm-report-card-actions">${actions(record)}</div>
    </article>`;
  }
  function filter(label, name, options) {
    const defaultSummary = ["status", "summary-status"].includes(name)
      ? "All statuses"
      : name === "creator"
        ? "All creators"
        : label === "Project"
          ? "All projects"
        : label === "Data Model"
          ? "All models"
          : name === "metric-type"
            ? "All types"
          : "All domains";
    return `<div class="fm-filter"><span>${label}</span><details data-filter="${name}" data-filter-label="${esc(label)}"><summary>${defaultSummary}</summary><div class="fm-options">${options.map((x) => `<label><input type="checkbox" value="${esc(x)}">${esc(x === "Enable" ? "Enabled" : x === "Disable" ? "Disabled" : x)}</label>`).join("")}</div></details></div>`;
  }
  function rows() {
    return data.records(type).filter((record) => {
      if (type === "Analytical Model" && record.stage === "Draft" && !isOwner(record)) return false;
      const status =
        type === "Report Context"
          ? reportContextState(record.ai_interpretation_enabled)
          : record.status;
      const summaryStatus = reportContextState(record.ai_summary_enabled);
      const statusMatch =
        !statuses.length ||
        statuses.some((value) => (value === "Draft" ? record.stage === "Draft" : value === status));
      return (
        statusMatch &&
        (type !== "Report Context" ||
          !summaryStatuses.length ||
          summaryStatuses.includes(summaryStatus)) &&
        (!selectedDomains.length ||
          (type === "Report Context"
            ? reportContextProjectLabels(record).some((x) => selectedDomains.includes(x))
            : data.list(record.business_domain).some((x) => selectedDomains.includes(x)))) &&
        (type !== "Metric Dictionary" ||
          !selectedMetricTypes.length ||
          selectedMetricTypes.includes(record.metric_type)) &&
        (type !== "Analytical Model" ||
          !selectedCreators.length ||
          selectedCreators.includes(record.created_by)) &&
        JSON.stringify(record).toLowerCase().includes(search.toLowerCase())
      );
    });
  }
  function emailStatus(record) {
    return record.status === "Disable" ? "Disabled" : "Enabled";
  }
  function emailCard(record) {
    const disabled = record.status === "Disable";
    const title = record.title || record.email_subject || "Untitled email report";
    const sendTime = (record.trigger_type || record.schedule || record.sent_at || "Not configured").replace(/^Scheduled\s*·\s*/, "");
    const recipients = data.list(record.recipients);
    const dataModel = record.data_model || "All models";
    const recipientTags = recipients.length
      ? recipients.map((recipient) => `<span>${esc(recipient)}</span>`).join("")
      : "<em>—</em>";
    return `<article class="fm-email-card ${disabled ? "is-disabled" : "is-enabled"}" tabindex="0" data-fm-id="${esc(record.id)}" aria-label="View ${esc(title)}"><header class="fm-email-card-head"><div class="fm-email-titleline"><h3 title="${esc(title)}">${esc(title)}</h3></div></header><div class="fm-email-meta"><div><span>Send time</span><strong title="${esc(sendTime)}">${esc(sendTime)}</strong></div><div class="fm-email-recipients"><span>Recipients</span><div class="fm-email-recipient-tags">${recipientTags}</div></div><div><span>Data Model</span><strong title="${esc(dataModel)}">${esc(dataModel)}</strong></div></div></article>`;
  }
  function analysisCard(record) {
    const disabled = record.status === "Disable";
    const title = record.analysis_name || record.title || "Untitled analysis";
    const description = record.applicable_scenarios || record.trigger_when || record.summary || "—";
    const creator = record.created_by || record.owner || "Current User";
    const dataModel = data.list(record.business_domain).join(", ") || "General";
    const referencedMetricList = data.list(record.referenced_metrics);
    const referencedMetrics = referencedMetricList.join(", ") || "—";
    const firstReferencedMetric = referencedMetricList[0] || "";
    const referencedMetricTags = referencedMetricList.length
      ? `<div class="fm-analysis-reference-tags"><span class="fm-analysis-reference-chip">${esc(firstReferencedMetric)}</span>${referencedMetricList.length > 1 ? '<span class="fm-analysis-reference-chip fm-analysis-reference-more" aria-label="More referenced metrics">…</span>' : ""}</div>`
      : `<strong title="${esc(referencedMetrics)}">${esc(referencedMetrics)}</strong>`;
    const analysisStatusBadge = state(record.status);
    const modelTags = data
      .list(record.business_domain)
      .map((domain) => `<span class="fm-analysis-domain">${esc(domain)}</span>`)
      .join("") || '<span class="fm-analysis-domain">General</span>';
    return `<article class="fm-analysis-card ${disabled ? "is-disabled" : "is-enabled"}" tabindex="0" data-fm-id="${esc(record.id)}" aria-label="View ${esc(title)}"><header class="fm-analysis-card-head"><div class="fm-analysis-title-wrap"><h3 title="${esc(title)}">${esc(title)}</h3></div><div class="fm-analysis-pills"><div class="fm-analysis-domains">${modelTags}</div>${analysisStatusBadge}</div></header><p class="fm-analysis-description" title="${esc(description)}">${esc(description)}</p><div class="fm-analysis-meta"><div><span>Data Model</span><strong title="${esc(dataModel)}">${esc(dataModel)}</strong></div><div class="fm-analysis-referenced"><span>Referenced Metrics</span>${referencedMetricTags}</div></div><footer class="fm-analysis-card-footer"><div class="fm-analysis-creator"><span>Creator</span><strong title="${esc(creator)}">${esc(creator)}</strong></div><div class="fm-analysis-card-actions">${actions(record)}</div></footer></article>`;
  }
  function metricCard(record) {
    const disabled = record.status === "Disable";
    const title = record.metric_name || record.title || "Untitled metric";
    const definition = record.business_definition || record.summary || "—";
    const aliases = data.list(record.metric_aliases);
    const firstAlias = aliases[0] || "";
    const synonyms =
      firstAlias && firstAlias.length <= 24
        ? `<span class="fm-metric-synonym">${esc(firstAlias)}</span>`
        : "";
    const remainingAliases = aliases.length > 1 || firstAlias.length > 24
      ? '<span class="fm-metric-synonym fm-metric-more" aria-label="More synonyms">…</span>'
      : "";
    const dataModel = data.list(record.business_domain).join(", ") || "General";
    return `<article class="fm-metric-card ${disabled ? "is-disabled" : "is-enabled"}" tabindex="0" data-fm-id="${esc(record.id)}" aria-label="View ${esc(title)}"><header class="fm-metric-card-head"><h3 title="${esc(title)}">${esc(title)}</h3><span class="fm-metric-status ${disabled ? "is-disabled" : ""}"><i aria-hidden="true"></i>${disabled ? "Disabled" : "Enabled"}</span></header><p class="fm-metric-definition" title="${esc(definition)}">${esc(definition)}</p><dl class="fm-metric-meta"><div><dt>Unit</dt><dd>${esc(record.unit || "—")}</dd></div><div><dt>Type</dt><dd>${esc(record.metric_type || "Base")}</dd></div><div class="fm-metric-data-model"><dt>Data model</dt><dd>${esc(dataModel)}</dd></div></dl>${synonyms || remainingAliases ? `<div class="fm-metric-synonyms"><span>Synonyms</span><div>${synonyms}${remainingAliases}</div></div>` : ""}</article>`;
  }
  function renderRows() {
    const records = rows(),
      totalRecords = data.records(type).filter((record) => type !== "Analytical Model" || record.stage !== "Draft" || isOwner(record)).length,
      total = Math.max(1, Math.ceil(records.length / pageSize)),
      visible = records.slice((page - 1) * pageSize, page * pageSize);
    page = Math.min(page, total);
    const countUnit = {
      "Report Context": "contexts",
      "Metric Dictionary": "metrics",
      "Analytical Model": "models",
      "Email Reports": "reports",
    }[type] || "records";
    const countLine = section.querySelector(".fm-overview-countline");
    if (countLine)
      countLine.innerHTML = `Showing <strong>${records.length}</strong> of <strong>${totalRecords}</strong> ${countUnit}`;
    const hasActions = ["Analytical Model", "Report Context"].includes(type);
    const tableWrap = section.querySelector(".fm-table-wrap"),
      cardWrap = section.querySelector(".fm-card-wrap");
    if (
      type === "Email Reports" ||
      type === "Analytical Model" ||
      type === "Metric Dictionary" ||
      type === "Report Context"
    ) {
      if (tableWrap) tableWrap.hidden = true;
      if (cardWrap) {
        cardWrap.hidden = false;
        const cards =
          type === "Email Reports"
            ? visible.map(emailCard)
            : type === "Metric Dictionary"
              ? visible.map(metricCard)
              : type === "Report Context"
                ? visible.map(reportContextCard)
                : visible.map(analysisCard);
        cardWrap.innerHTML =
          cards.join("") ||
          `<div class="fm-empty ${type === "Report Context" ? "fm-card-empty" : "fm-email-empty"}">No knowledge matches your filters.</div>`;
      }
    } else {
      if (cardWrap) {
        cardWrap.hidden = true;
        cardWrap.innerHTML = "";
      }
      if (tableWrap) tableWrap.hidden = false;
      section.querySelector("tbody").innerHTML =
        visible
          .map(
            (record) =>
              `<tr tabindex="0" data-fm-id="${esc(record.id)}" aria-label="View ${esc(record.title)}">${listColumns()
                .map(
                  ([key, , format]) =>
                    `<td data-field="${key}"><div class="${format ? "" : "fm-cell-text"}"${cellTitle(record, key, format)}>${value(record, key, format)}</div></td>`,
                )
                .join(
                  "",
                )}${hasActions ? `<td><div class="fm-actions">${actions(record)}</div></td>` : ""}</tr>`,
          )
          .join("") ||
        `<tr><td class="fm-empty" colspan="${listColumns().length + (hasActions ? 1 : 0)}">No knowledge matches your filters.</td></tr>`;
    }
    section.querySelector(".fm-pagination").innerHTML =
      `<span>${records.length} records</span><div><label>Rows per page <select aria-label="Rows per page">${[5, 10, 20].map((n) => `<option ${n === pageSize ? "selected" : ""}>${n}</option>`).join("")}</select></label><button class="fm-button" data-page="previous" ${page === 1 ? "disabled" : ""}>Previous</button><span>${page} / ${total}</span><button class="fm-button" data-page="next" ${page === total ? "disabled" : ""}>Next</button></div>`;
  }
  const listColumns = () =>
    data.columns[type].filter(
      ([key]) =>
        (type !== "Metric Dictionary" || !["updated_at", "status"].includes(key)) &&
        (type !== "Analytical Model" || !["created_at", "updated_at"].includes(key)),
    );
  function render() {
    section.dataset.fmType = type;
    const domains = [...new Set(data.records(type).flatMap((r) => data.list(r.business_domain)))];
    const statusLabel = type === "Report Context" ? "AI Interpreter Status" : "Status";
    const statusOptions =
      type === "Report Context"
        ? ["Open", "Close"]
        : type === "Analytical Model"
          ? ["Enable", "Disable"]
          : ["Enable", "Disable"];
    const creators = [
      ...new Set(
        data
          .records(type)
          .map((record) => record.created_by)
          .filter(Boolean),
      ),
    ];
    const domainLabel = "Data Model";
    const metricTypes = ["Base", "Calculated"];
    const filters =
      type === "Report Context"
        ? filter("Project", "domain", reportContextProjectOptions)
        : type === "Metric Dictionary"
          ? `${filter(domainLabel, "domain", domains)}${filter("Type", "metric-type", metricTypes)}`
          : `${filter(statusLabel, "status", statusOptions)}${filter(domainLabel, "domain", domains)}`;
    const countUnit = {
      "Report Context": "contexts",
      "Metric Dictionary": "metrics",
      "Analytical Model": "models",
      "Email Reports": "reports",
    }[type] || "records";
    section.innerHTML = `<div class="fm-tools">${filters}${type === "Analytical Model" ? filter("Creator", "creator", creators) : ""}<label class="fm-search-field overview-global-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.35-4.35"></path></svg><input class="fm-search" type="search" placeholder="Search knowledge..." aria-label="Search knowledge"></label>${type === "Analytical Model" ? '<a class="knowledge-add-button" href="knowledge-create.html?type=Analytical%20Model" target="_blank" rel="noopener"><span aria-hidden="true">＋</span>Add Analytical Model</a>' : ""}</div><div class="fm-overview-countline" aria-live="polite">Showing <strong>${rows().length}</strong> of <strong>${data.records(type).length}</strong> ${countUnit}</div><div class="fm-table-wrap"><table class="fm-table"><thead><tr>${listColumns()
      .map(([, label]) => `<th scope="col">${label}</th>`)
      .join(
        "",
      )}${["Analytical Model", "Report Context"].includes(type) ? '<th scope="col">Actions</th>' : ""}</tr></thead><tbody></tbody></table></div><div class="fm-card-wrap" hidden></div><footer class="fm-pagination"></footer>`;
    renderRows();
  }
  const overlay = document.createElement("div");
  overlay.className = "fm-overlay";
  overlay.hidden = true;
  overlay.innerHTML =
    '<aside class="fm-drawer" role="dialog" aria-modal="true" aria-labelledby="fmDrawerTitle" tabindex="-1"><header class="fm-drawer-head"><div><small id="fmDrawerType"></small><div class="fm-drawer-titleline"><h2 id="fmDrawerTitle"></h2><span class="fm-title-status" id="fmDrawerStatus"></span></div></div><button class="fm-button fm-close" aria-label="Close details">×</button></header><div class="fm-drawer-body"></div><footer class="fm-drawer-foot"></footer></aside>';
  document.body.append(overlay);
  const field = (label, content, full = false) =>
    `<div class="fm-field ${full ? "full" : ""} ${label === "Status" ? "fm-inline-field" : ""}"><span>${label}${label === "Status" ? ":" : ""}</span><div class="fm-value">${content || "—"}</div></div>`;
  const analysisField = (label, content, kind = "inline") =>
    `<div class="fm-field full fm-analysis-field fm-analysis-${kind}"><span>${label}${kind === "inline" ? ":" : ""}</span><div class="fm-value">${content || "—"}</div></div>`;
  const analysisHeading = (label) => `<h3 class="fm-analysis-subhead full">${label}</h3>`;
  const group = (name, content) =>
    `<section class="fm-section"><h3>${name}</h3><div class="fm-grid">${content}</div></section>`;
  const detailSection = (label, body) =>
    `<section class="scenario-report-section"><h3>${label}</h3>${body}</section>`;
  const detailParagraph = (text) => `<p class="scenario-report-prewrap">${esc(text || "—")}</p>`;
  function open(record, keepFocus = false) {
    if (!keepFocus) returnFocus = document.activeElement;
    current = record;
    overlay.querySelector("#fmDrawerType").textContent = record.type;
    overlay
      .querySelector(".fm-drawer")
      .classList.toggle("fm-report-context", type === "Report Context");
    overlay
      .querySelector(".fm-drawer")
      .classList.toggle(
        "fm-analysis-drawer",
        ["Analytical Model", "Metric Dictionary", "Email Reports"].includes(type),
      );
    overlay.querySelector("#fmDrawerTitle").textContent =
      record.report_name || record.metric_name || record.analysis_name || record.email_subject;
    const drawerStatus = overlay.querySelector("#fmDrawerStatus");
    const rawStatusText =
      type === "Report Context"
        ? (reportContextState(record.ai_interpretation_enabled) === "Open" ? "Enable" : "Disable")
        : type === "Analytical Model"
          ? record.status || record.stage
          : record.status;
    const statusText =
      rawStatusText === "Enable"
        ? "Enabled"
        : rawStatusText === "Disable"
          ? "Disabled"
          : rawStatusText;
    drawerStatus.textContent = statusText || "";
    drawerStatus.hidden = false;
    drawerStatus.className = `fm-title-status ${String(statusText).toLowerCase().startsWith("enable") ? "is-enable" : "is-neutral"}`;
    let content = "";
    if (type === "Analytical Model") {
      const guidanceContent =
        record.output_requirements ||
        (record.analysis_steps || []).map((step) => String(step || "").trim()).filter(Boolean).join("\n");
      content = `<div class="scenario-report-detail">
        ${detailSection("Description", detailParagraph(record.applicable_scenarios || record.summary))}
        ${detailSection("Trigger When", detailParagraph(record.trigger_when))}
        ${detailSection("Data Model", tags(record.business_domain, true))}
        ${detailSection("Referenced Metrics", tags(record.referenced_metrics))}
        ${detailSection("Structure & Guidance", detailParagraph(guidanceContent))}
        ${detailSection("Prohibited Analysis Directions", detailParagraph(record.analysis_constraints))}
        <dl class="scenario-report-detail-meta"><div><dt>Created By</dt><dd>${esc(record.created_by)}</dd></div><div><dt>Created At</dt><dd>${esc(record.created_at)}</dd></div><div><dt>Updated At</dt><dd>${esc(record.updated_at)}</dd></div></dl>
      </div>`;
    } else if (type === "Metric Dictionary") {
      content = `<div class="scenario-report-detail metric-dictionary-detail">
        ${detailSection("Metric Name", detailParagraph(record.metric_name))}
        ${detailSection("Unit", detailParagraph(record.unit))}
        ${detailSection("Type", detailParagraph(record.metric_type || "Base"))}
        ${detailSection("Synonyms", tags(record.metric_aliases))}
        ${detailSection("Data Model", tags(record.business_domain, true))}
        ${detailSection("Business Definition", detailParagraph(record.business_definition))}
        ${detailSection("Calculation Rules", detailParagraph(record.calculation_definition))}
      </div>`;
    } else if (type === "Report Context") {
      const heading = (title) => `<h3 class="fm-rc-heading">${title}</h3>`;
      const scenarios = data
        .list(record.scenario_report_ids)
        .map((id) =>
          (window.marketingKnowledgeAssets || []).find(
            (asset) => asset.id === id && asset.type === "Scenario Reporting",
          ),
        )
        .filter(Boolean);
      content = `<div class="fm-rc-thumbnail">${record.report_thumbnail ? `<img src="${esc(record.report_thumbnail)}" alt="${esc(record.report_name)} thumbnail">` : "<span>Report preview unavailable</span>"}</div>`;
      content += `<section class="fm-rc-overview"><h4 class="fm-rc-description-title"><span>Report Description</span><button type="button" class="fm-button fm-icon-action fm-rc-description-edit" data-fm-action="edit-description" aria-label="Edit report description" title="Edit report description">${actionIcons.edit}</button></h4><p>${esc(record.report_description)}</p><div class="fm-rc-meta"><div><span>Project</span>${tags(reportContextProjectLabels(record), true)}</div><div><span>AI Interpreter Status</span>${state(reportContextState(record.ai_interpretation_enabled), true)}</div><div><span>AI Summary</span>${state(reportContextState(record.ai_summary_enabled), true)}</div></div></section>`;
      content += `<section class="fm-rc-section fm-rc-linked-row">${heading("Scenario Reportings")}<div class="fm-tags">${scenarios.map((asset) => `<a class="fm-chip fm-scenario-link" href="knowledge.html?type=${encodeURIComponent("Scenario Reporting")}&detail=${encodeURIComponent(asset.id)}" aria-label="Open ${esc(asset.title)} scenario reporting detail">${esc(asset.title)} &gt;</a>`).join("") || "<span>No scenario reportings linked to this report.</span>"}</div></section>`;
      content += `<section class="fm-rc-section">${heading("Report Data Scope")}<p class="fm-rc-scope">${esc(record.report_data_scope || "Report data scope has not been configured.")}</p></section>`;
    } else {
      const columns =
        type === "Email Reports"
          ? [
              ["email_subject", "Email Subject"],
              ["business_domain", "Data Model", "domain"],
              ["trigger_type", "Trigger Type"],
              ["recipients", "Recipients", "tags"],
              ["cc_recipients", "CC Recipients", "tags"],
              ["sent_at", "Sent At"],
              ["data_as_of", "Data Snapshot Date"],
            ]
          : data.columns[type];
      content =
        type === "Email Reports"
          ? `<div class="scenario-report-detail">${columns.map(([key, label, format]) => detailSection(label, format === "tags" ? tags(record[key]) : key === "business_domain" ? tags(record[key], true) : detailParagraph(record[key]))).join("")}</div>`
          : group(
              "Details",
              columns
                .map(([key, label, format]) =>
                  field(
                    label,
                    value(record, key, format),
                    [
                      "report_description",
                      "business_definition",
                      "calculation_definition",
                      "email_subject",
                    ].includes(key),
                  ),
                )
                .join(""),
            );
    }
    overlay.querySelector(".fm-drawer-body").innerHTML = content;

    const thumbnail = overlay.querySelector(".fm-rc-thumbnail img");
    thumbnail?.addEventListener(
      "error",
      () => {
        thumbnail.parentElement.textContent = "Report preview unavailable";
      },
      { once: true },
    );
    overlay.querySelector(".fm-drawer-foot").hidden = type === "Email Reports";
    overlay.querySelector(".fm-drawer-foot").innerHTML =
      type === "Metric Dictionary" || type === "Email Reports"
        ? ""
        : type === "Analytical Model"
          ? actions(record)
          : type === "Report Context"
            ? `<button class="fm-button" data-fm-action="close">Close</button><a class="fm-button fm-open-dashboard" href="reports.html" target="_blank" rel="noopener">Open Dashboard <span aria-hidden="true">→</span></a>`
            : '<button class="fm-button" data-fm-action="close">Close</button>';
    if (overlay.hidden) previousOverflow = document.body.style.overflow;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    overlay.querySelector(".fm-close").focus();
  }
  function close() {
    overlay.hidden = true;
    current = null;
    document.body.style.overflow = previousOverflow;
    returnFocus?.focus();
  }
  function viewDescriptionHistory(record) {
    const history =
      Array.isArray(record.report_description_history) && record.report_description_history.length
        ? record.report_description_history
        : [
            {
              editor: record.created_by || "Current User",
              changed_at: record.updated_at || "Sep 3, 2026",
              content: record.report_description || "",
            },
          ];
    const dialog = document.createElement("dialog");
    dialog.className = "fm-dialog rc-description-history-dialog";
    dialog.innerHTML = `<header><div><small>VERSION HISTORY</small><h3>Report Description</h3></div><button class="fm-button fm-close" aria-label="Close version history">×</button></header><div class="rc-history-list">${history
      .slice()
      .reverse()
      .map(
        (item) =>
          `<article><strong>${esc(item.editor || "Current User")}</strong><time>${esc(item.changed_at || item.updated_at || "—")}</time><p>${esc(item.content || "—")}</p></article>`,
      )
      .join("")}</div>`;
    document.body.append(dialog);
    dialog.querySelector(".fm-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => dialog.remove());
    dialog.showModal();
  }
  function editReportDescriptionDialog(record) {
    const original = record.report_description || "";
    const dialog = document.createElement("dialog");
    dialog.className = "fm-dialog rc-description-edit-dialog";
    dialog.innerHTML = `<header><div><small>REPORT CONTEXT</small><h3>Edit Report Description</h3></div><button class="fm-button fm-close" data-dialog="cancel" aria-label="Close description editor">×</button></header><label class="rc-description-edit-field"><span>Report Description</span><textarea aria-label="Report Description">${esc(original)}</textarea></label><p class="fm-feedback" aria-live="polite"></p><footer><button class="fm-button" data-dialog="cancel">Cancel</button><button class="fm-button primary" data-dialog="confirm" disabled>Confirm</button></footer>`;
    document.body.append(dialog);
    const area = dialog.querySelector("textarea");
    const confirm = dialog.querySelector('[data-dialog="confirm"]');
    area.addEventListener("input", () => {
      confirm.disabled = area.value === original;
    });
    dialog.addEventListener("close", () => dialog.remove());
    dialog.addEventListener("click", (event) => {
      const action = event.target.closest("[data-dialog]")?.dataset.dialog;
      if (!action) return;
      if (action === "cancel") {
        dialog.close();
        return;
      }
      const nextDescription = area.value;
      if (nextDescription === original) {
        dialog.close();
        return;
      }
      const changedAt = new Date().toLocaleString("en-GB");
      record.report_description = nextDescription;
      record.report_description_history = [
        ...(record.report_description_history || []),
        { editor: currentUser, changed_at: changedAt, content: nextDescription },
      ];
      record.updated_at = changedAt;
      data.save(record);
      renderRows();
      if (current?.id === record.id && !overlay.hidden) open(record, true);
      dialog.close();
    });
    dialog.showModal();
    area.focus();
  }
  function editReportContext(record) {
    if (type !== "Report Context") return;
    if (current?.id !== record.id || overlay.hidden) open(record);
    const overview = overlay.querySelector(".fm-rc-overview");
    if (!overview) return;
    const original = record.report_description || "";
    const descriptionLabel = overview.querySelector("h4");
    const descriptionText = descriptionLabel?.nextElementSibling;
    if (!descriptionLabel || !descriptionText) return;
    descriptionLabel.classList.add("rc-edit-label");
    descriptionLabel.innerHTML = `Report Description <span class="rc-edit-label-actions"><button type="button" class="fm-button fm-icon-action" data-rc-unlock aria-pressed="false" title="Unlock report description" aria-label="Unlock report description">🔒</button><button type="button" class="fm-button" data-rc-history>Version history</button></span>`;
    const area = document.createElement("textarea");
    area.className = "rc-drawer-description-input";
    area.value = original;
    area.disabled = true;
    area.setAttribute("aria-label", "Report Description");
    descriptionText.replaceWith(area);
    const footer = overlay.querySelector(".fm-drawer-foot");
    footer.hidden = false;
    footer.innerHTML =
      '<button class="fm-button" data-fm-action="cancel-edit">Cancel</button><button class="fm-button primary" data-fm-action="submit-description" disabled>Submit</button>';
    const submit = footer.querySelector('[data-fm-action="submit-description"]');
    const unlock = overview.querySelector("[data-rc-unlock]");
    unlock.addEventListener("click", () => {
      area.disabled = !area.disabled;
      unlock.setAttribute("aria-pressed", String(!area.disabled));
      unlock.textContent = area.disabled ? "🔒" : "🔓";
      unlock.title = area.disabled ? "Unlock report description" : "Lock report description";
      unlock.setAttribute("aria-label", unlock.title);
      if (!area.disabled) area.focus();
    });
    overview
      .querySelector("[data-rc-history]")
      .addEventListener("click", () => viewDescriptionHistory(record));
    area.addEventListener("input", () => {
      submit.disabled = area.value === original;
    });
  }
  overlay.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-scenario-id]");
    if (!trigger) return;
    const asset = (window.marketingKnowledgeAssets || []).find(
      (item) => item.id === trigger.dataset.scenarioId && item.type === "Scenario Reporting",
    );
    if (!asset) return;
    close();
    document.dispatchEvent(new CustomEvent("scenario:open", { detail: { id: asset.id } }));
    return;
    const dialog = document.createElement("dialog");
    dialog.className = "fm-scenario-dialog";
    dialog.setAttribute("aria-label", asset.title);
    dialog.innerHTML = `<header class="fm-drawer-head"><div><small>Scenario Reporting</small><h2>${esc(asset.title)}</h2></div><button class="fm-button fm-close" aria-label="Close knowledge details">×</button></header><div class="fm-scenario-body">${group("Details", field("Reporting Scenario", esc(asset.tag || "Performance Review"), true) + field("Knowledge Title", esc(asset.title), true) + field("Core Description", esc(asset.summary || ""), true) + field("Related Objects", tags((asset.connections || [{ name: "City Strategy Analysis" }, { name: "4P Executive Overview" }]).map((item) => item.name)), true))}</div>`;
    document.body.append(dialog);
    dialog.querySelector("button").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => {
      if (
        e.target === dialog &&
        (e.clientX < dialog.getBoundingClientRect().left ||
          e.clientX > dialog.getBoundingClientRect().right ||
          e.clientY < dialog.getBoundingClientRect().top ||
          e.clientY > dialog.getBoundingClientRect().bottom)
      )
        dialog.close();
    });
    dialog.addEventListener("close", () => {
      dialog.remove();
      trigger.focus();
    });
    dialog.querySelectorAll(".fm-field").forEach((node, index) => {
      if (index === 2) return;
      node.classList.add("fm-inline-field");
      node.querySelector(":scope > span").textContent += ":";
    });
    dialog.showModal();
  });
  function notice(title, message, onConfirm, blocked = false) {
    if (blocked && /knowledge (disabled|deleted)/i.test(title)) {
      window.showKnowledgeSuccessToast?.(title === "Knowledge deleted" ? "Deleted successfully" : "Taken offline successfully");
      return;
    }
    const dialog = document.createElement("dialog");
    const needsOffline = /offline first/i.test(title);
    const isDelete = /delete/i.test(title);
    const isOffline = /disable|offline/i.test(title);
    const isConfirm = Boolean(onConfirm);
    const icon = '<span class="knowledge-confirm-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4m0 4h.01"/><path d="M10.3 3.6 2.5 17.1A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.9L13.7 3.6a2 2 0 0 0-3.4 0Z"/></svg></span>';
    dialog.className = `fm-dialog${isConfirm ? " knowledge-confirm-dialog" : ""}`;
    dialog.innerHTML = isConfirm
      ? `<div class="knowledge-confirm-main">${icon}<div><h3>${needsOffline ? "Please take the knowledge offline first" : "Confirm Operation"}</h3><p>${needsOffline ? message : isDelete ? "Please confirm whether to delete this knowledge. Deletion cannot be undone." : isOffline ? "Please confirm whether to offline this knowledge." : message}</p></div></div><footer><button class="fm-button" data-dialog="cancel">Cancel</button><button class="fm-button primary" data-dialog="confirm">${needsOffline ? "Go Offline" : isDelete ? "Confirm Delete" : isOffline ? "Confirm Offline" : "Confirm"}</button></footer>`
      : `<h3>${esc(title)}</h3><p>${esc(message)}</p><p class="fm-feedback" aria-live="polite"></p><footer><button class="fm-button" data-dialog="cancel">Close</button></footer>`;
    document.body.append(dialog);
    dialog.addEventListener("close", () => dialog.remove());
    dialog.addEventListener("click", (e) => {
      const action = e.target.closest("[data-dialog]")?.dataset.dialog;
      if (action === "cancel") dialog.close();
      if (action === "confirm") {
        try { dialog.close(); onConfirm(); }
        catch (_) { dialog.querySelector(".fm-feedback").textContent = "Unable to save local demo changes. Please allow browser storage and retry."; }
      }
    });
    dialog.showModal();
  }
  function act(action, record) {
    if (action === "view") {
      open(record);
      return;
    }
    if (type === "Analytical Model" && !isOwner(record)) {
      notice(
        "Permission denied",
        "Knowledge created by others cannot be operated.",
        null,
        true,
      );
      return;
    }
    if (
      type === "Analytical Model" &&
      ["edit", "delete"].includes(action) &&
      record.status !== "Disable"
    ) {
      notice(
        "Disable knowledge first",
        "To edit or delete this knowledge, take it offline first. Once offline, users cannot access it temporarily.",
        () => {
          record.status = "Disable";
          record.isDisabled = true;
          record.updated_at = new Date().toLocaleString("en-GB");
          data.save(record);
          renderRows();
          if (current?.id === record.id) open(record, true);
        },
      );
      return;
    }
    if ((action === "edit" || action === "edit-description") && type === "Report Context") {
      editReportDescriptionDialog(record);
      return;
    }
    if (action === "edit") {
      location.href = `knowledge-create.html?type=${encodeURIComponent(type)}&mode=edit&id=${encodeURIComponent(record.id)}`;
      return;
    }
    if (action === "disable" && record.status === "Disable") {
      notice("Knowledge already disabled", "This knowledge is already disabled.", null, true);
      return;
    }
    if (action === "disable")
      notice(
        "Disable knowledge?",
        `Disable “${record.analysis_name}”? It will no longer be available for future AI use.`,
        () => {
          record.status = "Disable";
          record.isDisabled = true;
          record.updated_at = new Date().toLocaleString("en-GB");
          data.save(record);
          renderRows();
          if (current?.id === record.id) open(record, true);
          notice("Knowledge disabled", `“${record.analysis_name}” has been disabled.`, null, true);
        },
      );
    if (action === "delete") {
      const references = record.references || [];
      if (references.length) {
        notice(
          "Deletion blocked",
          `This analysis is referenced by: ${references.join(", ")}. Remove these references before deleting.`,
          null,
          true,
        );
        return;
      }
      notice(
        "Delete knowledge?",
        `Delete “${record.analysis_name}”? This action cannot be undone.`,
        () => {
          data.remove(record.id);
          if (current?.id === record.id) close();
          renderRows();
          document.dispatchEvent(new CustomEvent("knowledge:mappedchange"));
          notice("Knowledge deleted", `“${record.analysis_name}” has been deleted.`, null, true);
        },
      );
    }
  }
  section.addEventListener("input", (event) => {
    if (event.target.matches(".fm-search")) {
      search = event.target.value;
      page = 1;
      renderRows();
    }
  });
  section.addEventListener("change", (event) => {
    const details = event.target.closest("[data-filter]");
    if (details) {
      const selected = [...details.querySelectorAll("input:checked")].map((x) => x.value);
      if (details.dataset.filter === "status") statuses = selected;
      else if (details.dataset.filter === "summary-status") summaryStatuses = selected;
      else if (details.dataset.filter === "creator") selectedCreators = selected;
      else if (details.dataset.filter === "metric-type") selectedMetricTypes = selected;
      else selectedDomains = selected;
      details.querySelector("summary").textContent = selected.length
        ? selected
            .map((value) =>
              value === "Enable" ? "Enabled" : value === "Disable" ? "Disabled" : value,
            )
            .join(", ")
        : details.dataset.filter === "domain"
          ? details.dataset.filterLabel === "Project"
            ? "All projects"
            : details.dataset.filterLabel === "Data Model"
              ? "All models"
              : "All domains"
          : details.dataset.filter === "creator"
            ? "All creators"
            : details.dataset.filter === "metric-type"
              ? "All types"
            : "All statuses";
      page = 1;
      renderRows();
    }
    if (event.target.matches(".fm-pagination select")) {
      pageSize = Number(event.target.value);
      page = 1;
      renderRows();
    }
  });
  section.addEventListener("click", (event) => {
    const pager = event.target.closest("[data-page]");
    if (pager && !pager.disabled) {
      page += pager.dataset.page === "next" ? 1 : -1;
      renderRows();
      return;
    }
    const row = event.target.closest("[data-fm-id]");
    if (!row) return;
    const record = data.records(type).find((x) => x.id === row.dataset.fmId);
    if (!record) return;
    const button = event.target.closest("[data-fm-action]");
    if (button?.dataset.actionDisabled) {
      notice("Permission or status restricted", button.dataset.actionDisabled, null, true);
      return;
    }
    act(button ? button.dataset.fmAction : "view", record);
  });
  section.addEventListener("keydown", (event) => {
    if (event.target.matches("tr[data-fm-id], article[data-fm-id]") && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      event.target.click();
    }
  });
  overlay.addEventListener("click", (event) => {
    if (
      event.target === overlay ||
      event.target.closest(".fm-close") ||
      event.target.closest('[data-fm-action="close"]')
    ) {
      close();
      return;
    }
    const button = event.target.closest("[data-fm-action]");
    if (!button || !current) return;
    if (button.dataset.actionDisabled) {
      notice("Permission or status restricted", button.dataset.actionDisabled, null, true);
      return;
    }
    if (button.dataset.fmAction === "cancel-edit") {
      open(current, true);
      return;
    }
    if (button.dataset.fmAction === "submit-description") {
      const area = overlay.querySelector(".rc-drawer-description-input");
      if (!area || area.value === (current.report_description || "")) return;
      notice(
        "Submit report description?",
        "This will update the governed report description.",
        () => {
          const changedAt = new Date().toLocaleString("en-GB");
          current.report_description = area.value;
          current.report_description_history = [
            ...(current.report_description_history || []),
            { editor: currentUser, changed_at: changedAt, content: area.value },
          ];
          current.updated_at = changedAt;
          data.save(current);
          renderRows();
          open(current, true);
        },
      );
      return;
    }
    act(button.dataset.fmAction, current);
  });
  document.addEventListener("keydown", (event) => {
    if (overlay.hidden || document.querySelector("dialog[open]")) return;
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key === "Tab") {
      const items = [
        ...overlay.querySelectorAll(
          'button:not(:disabled),[href],input,select,textarea,[tabindex="0"]',
        ),
      ];
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  document.addEventListener("reportcontext:view", (event) => {
    const record = data.records("Report Context").find((item) => item.id === event.detail?.id);
    if (!record) return;
    const listType = type;
    type = "Report Context";
    open(record);
    type = listType;
  });
  function sync() {
    const next = new URLSearchParams(location.search).get("type") || "";
    const head = document.querySelector(".business-overview-head");
    let create = head?.querySelector(".fm-create-analysis");
    if (
      head &&
      ["Analytical Model", "Business Term", "Scenario Reporting"].includes(next) &&
      !create
    ) {
      create = document.createElement("a");
      create.className = "fm-button primary fm-create-analysis";
      create.href = "knowledge-create.html?type=Analytical%20Model";
      create.target = "_blank";
      create.rel = "noopener";
      create.textContent = "Add New";
      head.append(create);
    }
    if (create) {
      create.hidden = !["Analytical Model", "Business Term", "Scenario Reporting"].includes(next);
      create.href = "knowledge-create.html?type=" + encodeURIComponent(next);
    }
    const active = data.types.includes(next);
    library.classList.toggle("fm-active", active);
    section.hidden = !active;
    if (!active) {
      if (!overlay.hidden) close();
      type = next;
      return;
    }
    if (next !== type) {
      if (!overlay.hidden) close();
      type = next;
      search = "";
      statuses = [];
      summaryStatuses = [];
      selectedDomains = [];
      selectedCreators = [];
      page = 1;
      render();
    }
    const url = new URL(location.href),
      detail = url.searchParams.get("detail");
    if (detail) {
      const record = data.records(type).find((x) => x.id === detail);
      url.searchParams.delete("detail");
      history.replaceState({}, "", url);
      if (record) open(record);
    }
  }
  document.addEventListener("knowledge:typechange", sync);
  window.addEventListener("popstate", sync);
  window.addEventListener("storage", (event) => {
    if (event.key === data.storageKey && !section.hidden) {
      renderRows();
      if (current) {
        const record = data.records(type).find((x) => x.id === current.id);
        record ? open(record, true) : close();
      }
    }
  });
  sync();
})();



































