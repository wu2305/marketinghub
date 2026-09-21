const knowledgeAssets = Array.isArray(window.marketingKnowledgeAssets)
  ? window.marketingKnowledgeAssets
  : [];

const categorySummaries = {
  all: "All governed and personal knowledge.",
  principles: "Decision guardrails for trusted recommendations.",
  context: "Report intent, comparison logic, and caveats.",
  models: "Governed grain, lineage, and quality context.",
  metrics: "Approved definitions, formulas, and ownership.",
  terms: "Shared vocabulary for consistent interpretation.",
  playbooks: "Repeatable analysis and review routines.",
};

const stageNames = {
  "co-build": "Co-build",
  solidify: "Solidify",
  calibrate: "Calibrate",
};

const reportNames = {
  city: "City Strategy",
  fourp: "4P Report",
  customer: "Customer Daily Tracking",
  abo: "ABO",
  rednote: "Rednote Tracking",
  ottolv: "OTT / OLV Media Data Tracking",
};

const statusMap = {
  "co-build": "Draft",
  solidify: "Under Review",
  calibrate: "Published",
};

const aiCheckMap = {
  "co-build": "Reviewing",
  solidify: "Warning",
  calibrate: "Pass",
};

const sidebarButtons = document.querySelectorAll(".sidebar-item");
const searchInput = document.querySelector("#knowledgeSearch");
const stageFilter = document.querySelector("#stageFilter");
const typeFilter = document.querySelector("#typeFilter");
const sourceFilter = document.querySelector("#sourceFilter");
const statusDisplayFilter = document.querySelector("#statusDisplayFilter");
const aiCheckFilter = document.querySelector("#aiCheckFilter");
const assetList = document.querySelector("#assetList");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
const activeReportFilter = document.querySelector("#activeReportFilter");
const activeReportName = document.querySelector("#activeReportName");
const knowledgeTypeStats = document.querySelector("#knowledgeTypeStats");

const detailContent = document.querySelector("#detailContent");
const detailEmpty = document.querySelector("#detailEmpty");
const detailType = document.querySelector("#detailType");
const detailSource = document.querySelector("#detailSource");
const detailTitle = document.querySelector("#detailTitle");
const detailSummary = document.querySelector("#detailSummary");
const detailOwner = document.querySelector("#detailOwner");
const detailStage = document.querySelector("#detailStage");
const detailUpdated = document.querySelector("#detailUpdated");
const detailAiUse = document.querySelector("#detailAiUse");
const detailConnections = document.querySelector("#detailConnections");
const detailAction = document.querySelector("#detailAction");
const detailActionLabel = document.querySelector("#detailActionLabel");
const detailPreviewSection = document.querySelector("#detailPreviewSection");
const detailPreviewBody = document.querySelector("#detailPreviewBody");
const knowledgeDetail = document.querySelector("#knowledgeDetail");
const detailScrim = document.querySelector("#detailScrim");
const detailClose = document.querySelector("#detailClose");

const createScrim = document.querySelector("#createScrim");
const createKnowledgePanel = document.querySelector("#createKnowledgePanel");
const createPanelClose = document.querySelector("#createPanelClose");
const createKnowledgeForm = document.querySelector("#createKnowledgeForm");
const createKnowledgeBtn = document.querySelector(".create-knowledge-btn");
const createFlowSteps = document.querySelectorAll(".create-flow-step");
const createMethodBtns = document.querySelectorAll(".create-method-btn");
const createAddTagBtn = document.querySelector("#createAddTag");
const createRelatedObjects = document.querySelector("#createRelatedObjects");
const createSaveDraftBtn = document.querySelector("#createSaveDraftBtn");
const createApplyAiBtn = document.querySelector("#createApplyAiBtn");
const createAiBadge = document.querySelector("#createAiBadge");
const createNextBtn = document.querySelector("#createNextBtn");
const createBackBtn = document.querySelector("#createBackBtn");
const createAiReviewView = document.querySelector("#createAiReviewView");
const createAiAssistant = document.querySelector("#createAiAssistant");

const createRelatedDropdown = document.querySelector("#createRelatedDropdown");

const createKnowledgeTypeSelect = document.querySelector("#createKnowledgeType");
const createStandardFields = document.querySelector("#createStandardFields");
const createDataModelFields = document.querySelector("#createDataModelFields");
const createDataModelCommon = document.querySelector("#createDataModelCommon");
const createDataModelTabs = document.querySelector("#createDataModelTabs");
const createMetricDictFields = document.querySelector("#createMetricDictFields");
const createMdList = document.querySelector("#createMdList");
const createMdSearch = document.querySelector("#createMdSearch");
const createMdBasicCount = document.querySelector("#createMdBasicCount");
const createMdDerivedCount = document.querySelector("#createMdDerivedCount");
const createAddDerivedBtn = document.querySelector("#createAddDerivedBtn");
const createMdListView = document.querySelector("#createMdListView");
const createMdDerivedView = document.querySelector("#createMdDerivedView");
const createMdAiReviewView = document.querySelector("#createMdAiReviewView");
const createMdAiReviewBody = document.querySelector("#createMdAiReviewBody");
const createFormFooter = document.querySelector("#createFormFooter");
const createFormActions = document.querySelector("#createFormActions");
const dataModelTabs = document.querySelectorAll("#dataModelTabs .data-model-tab");
const dataModelPanes = document.querySelectorAll(".data-model-pane");
const dataModelTableList = document.querySelector("#dataModelTableList");
const dataModelTableSearch = document.querySelector("#dataModelTableSearch");
const dataModelBasicForm = document.querySelector("#dataModelBasicForm");
const dataModelBasicEmpty = document.querySelector("#dataModelBasicEmpty");
const dataModelFieldsWrapper = document.querySelector("#dataModelFieldsWrapper");
const dataModelFieldsEmpty = document.querySelector("#dataModelFieldsEmpty");
const dataModelFieldRows = document.querySelector("#dataModelFieldRows");
const dmAddSynonymBtn = document.querySelector("#dmAddSynonym");

/* ── Mock database tables for the Data Model picker ── */
const fieldTypeOptions = ["Dimension", "Measure", "Identifier", "Attribute"];
const semanticRoleOptions = ["Category", "Hierarchy", "Tag", "Metric"];
const aggregateOptions = ["-", "SUM", "AVG", "COUNT", "MIN", "MAX"];

// dbTables is now loaded from knowledge-data.js as window.dbTables
const dbTables =
  typeof window !== "undefined" && Array.isArray(window.dbTables) ? window.dbTables : [];

let selectedTableId = null;
let activeDmTab = "select";

const dataModelTypes = new Set(["Data Model", "Metric Dictionary"]);

function isDataModelType(type) {
  return dataModelTypes.has(type);
}

function renderDbTableList(filter) {
  if (!dataModelTableList) return;
  const q = (filter || "").trim().toLowerCase();
  const items = dbTables.filter(
    (t) => !q || t.name.toLowerCase().includes(q) || t.physical.toLowerCase().includes(q),
  );
  if (items.length === 0) {
    dataModelTableList.innerHTML =
      '<div class="data-model-empty">No tables match your search.</div>';
    return;
  }
  dataModelTableList.innerHTML = items
    .map(
      (t) => `
      <button type="button" class="data-model-table-card${selectedTableId === t.id ? " selected" : ""}" data-table="${t.id}">
        <div class="data-model-table-name">${escapeHtml(t.name)}</div>
        <div class="data-model-table-meta"><code>${escapeHtml(t.physical)}</code> · ${t.rows.toLocaleString()} rows</div>
      </button>`,
    )
    .join("");
  dataModelTableList.querySelectorAll(".data-model-table-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedTableId = card.dataset.table;
      renderDbTableList(dataModelTableSearch ? dataModelTableSearch.value : "");
      renderDataModelBasic();
      renderDataModelFields();
      setActiveDmTab("basic");
    });
  });
}

function renderDataModelBasic() {
  if (!dataModelBasicForm) return;
  const t = dbTables.find((x) => x.id === selectedTableId);
  if (!t) {
    dataModelBasicForm.hidden = true;
    if (dataModelBasicEmpty) dataModelBasicEmpty.hidden = false;
    return;
  }
  if (dataModelBasicEmpty) dataModelBasicEmpty.hidden = true;
  dataModelBasicForm.hidden = false;
  const phys = dataModelBasicForm.querySelector("#dmPhysicalName");
  const rows = dataModelBasicForm.querySelector("#dmRowCount");
  if (phys) phys.textContent = t.physical;
  if (rows) rows.textContent = t.rows.toLocaleString() + " rows";

  const comment = dataModelBasicForm.querySelector("#dmDbComment");
  const displayName = dataModelBasicForm.querySelector("#dmDisplayName");
  const tableType = dataModelBasicForm.querySelector("#dmTableType");
  const participateQa = dataModelBasicForm.querySelector("#dmParticipateQa");
  if (comment) comment.value = t.comment || "";
  if (displayName) displayName.value = t.displayName || t.name || "";
  if (tableType) tableType.value = t.tableType || "Entity";
  if (participateQa) participateQa.checked = t.participateQa !== false;

  const synWrap = dataModelBasicForm.querySelector("#dmSynonyms");
  const addBtn = dataModelBasicForm.querySelector("#dmAddSynonym");
  if (synWrap && addBtn) {
    synWrap.innerHTML = (t.tableSynonyms || [])
      .map(
        (s) =>
          `<span class="data-model-tag">${escapeHtml(s)} <button type="button" aria-label="remove">&times;</button></span>`,
      )
      .join("");
    synWrap.appendChild(addBtn);
    synWrap.querySelectorAll("button[aria-label='remove']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.closest(".data-model-tag");
        if (tag) {
          const text = tag.firstChild.textContent.trim();
          t.tableSynonyms = (t.tableSynonyms || []).filter((x) => x !== text);
          renderDataModelBasic();
        }
      });
    });
  }
}

function renderDataModelFields() {
  if (!dataModelFieldRows) return;
  const t = dbTables.find((x) => x.id === selectedTableId);
  if (!t) {
    if (dataModelFieldsWrapper) dataModelFieldsWrapper.hidden = true;
    if (dataModelFieldsEmpty) dataModelFieldsEmpty.hidden = false;
    dataModelFieldRows.innerHTML = "";
    return;
  }
  if (dataModelFieldsEmpty) dataModelFieldsEmpty.hidden = true;
  if (dataModelFieldsWrapper) dataModelFieldsWrapper.hidden = false;
  const titleEl = dataModelFieldsWrapper.querySelector("#dmFieldsTableName");
  if (titleEl) titleEl.textContent = t.name;
  dataModelFieldRows.innerHTML = t.fields
    .map((f, idx) => {
      const synonyms = (f.synonyms || [])
        .map((s) => `<span class="data-model-tag">${escapeHtml(s)}</span>`)
        .join("");
      const fieldTypeOpts = fieldTypeOptions
        .map(
          (opt) =>
            `<option value="${opt}"${opt === f.fieldType ? " selected" : ""}>${opt}</option>`,
        )
        .join("");
      const semanticOpts = semanticRoleOptions
        .map(
          (opt) => `<option value="${opt}"${opt === f.semantic ? " selected" : ""}>${opt}</option>`,
        )
        .join("");
      const aggOpts = aggregateOptions
        .map((opt) => `<option value="${opt}"${opt === f.agg ? " selected" : ""}>${opt}</option>`)
        .join("");
      return `
        <div class="data-model-fields-row" data-field-idx="${idx}">
          <div class="data-model-field-key">
            <code>${escapeHtml(f.key)}</code>
            <small>${escapeHtml(f.type)}</small>
          </div>
          <div class="data-model-field-name"><input type="text" class="data-model-inline-input" value="${escapeHtml(f.name)}" disabled /></div>
          <div class="data-model-synonyms data-model-field-synonyms" data-idx="${idx}">
            ${synonyms}
          </div>
          <div class="data-model-field-type"><select class="data-model-inline-select" disabled>${fieldTypeOpts}</select></div>
          <div class="data-model-field-semantic"><select class="data-model-inline-select" disabled>${semanticOpts}</select></div>
          <div class="data-model-fuzzy-cell">
            <label class="data-model-switch data-model-switch-sm">
              <input type="checkbox" ${f.fuzzy ? "checked" : ""} disabled />
              <span class="data-model-switch-slider"></span>
            </label>
          </div>
          <div class="data-model-field-agg"><select class="data-model-inline-select" disabled>${aggOpts}</select></div>
        </div>`;
    })
    .join("");
  const totalEl = dataModelFieldsWrapper.querySelector("#dmFieldsTotal");
  if (totalEl) totalEl.textContent = `${t.fields.length} entries total`;
}

function setActiveDmTab(name) {
  activeDmTab = name;
  dataModelTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
  dataModelPanes.forEach((pane) => {
    const isActive = pane.dataset.pane === name;
    pane.classList.toggle("active", isActive);
    if (isActive) {
      pane.removeAttribute("hidden");
    } else {
      pane.setAttribute("hidden", "");
    }
  });
}

function toggleCreateFormByType() {
  if (!createKnowledgeTypeSelect) return;
  const type = createKnowledgeTypeSelect.value;
  const isDataModel = type === "Data Model";
  const isMetricDict = type === "Metric Dictionary";
  const isSpecial = isDataModel || isMetricDict;
  if (createStandardFields) createStandardFields.hidden = isSpecial;
  if (createDataModelFields) createDataModelFields.hidden = !isSpecial;
  if (createDataModelCommon) createDataModelCommon.hidden = !isDataModel;
  if (createDataModelTabs) createDataModelTabs.hidden = !isDataModel;
  if (createMetricDictFields) createMetricDictFields.hidden = !isMetricDict;
  if (createFormFooter) createFormFooter.hidden = isMetricDict;
  if (createFormActions) createFormActions.hidden = isMetricDict;
  const analyticalTagField = document.querySelector("#createAnalyticalTagField");
  if (analyticalTagField) analyticalTagField.hidden = type !== "Analytical Model";
  if (isDataModel) {
    renderDbTableList(dataModelTableSearch ? dataModelTableSearch.value : "");
    setActiveDmTab(activeDmTab);
  }
  if (isMetricDict) {
    extractCreateBasicMetrics();
    showCreateMdView("list");
    renderCreateMdList();
  }
}

/* ── Metric Dictionary (create panel) ── */
const createBasicMetrics = [];
const createDerivedMetrics = [];
let createMdActiveTab = "basic";

function extractCreateBasicMetrics() {
  createBasicMetrics.length = 0;
  dbTables.forEach((table) => {
    (table.fields || []).forEach((field) => {
      if (field.fieldType === "Measure") {
        createBasicMetrics.push({
          id: `${table.id}.${field.key}`,
          name: field.name,
          table: table.name,
          tablePhysical: table.physical,
          field: field.key,
          type: field.type,
          agg: field.agg || "SUM",
        });
      }
    });
  });
}

function renderCreateMdList() {
  if (!createMdList) return;
  const q = (createMdSearch ? createMdSearch.value : "").trim().toLowerCase();

  const basicItems = createBasicMetrics
    .filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q) ||
        `${m.tablePhysical}.${m.field}`.toLowerCase().includes(q),
    )
    .map((m) => ({
      id: m.id,
      name: m.name,
      meta: `${m.tablePhysical}.${m.field}`,
      kind: "basic",
    }));

  const derivedItems = createDerivedMetrics
    .filter(
      (m) => !q || m.name.toLowerCase().includes(q) || (m.formula || "").toLowerCase().includes(q),
    )
    .map((m) => ({
      id: m.id,
      name: m.name,
      meta: m.formula || "Derived metric",
      kind: "derived",
    }));

  if (createMdBasicCount) createMdBasicCount.textContent = basicItems.length;
  if (createMdDerivedCount) createMdDerivedCount.textContent = derivedItems.length;

  const items = createMdActiveTab === "basic" ? basicItems : derivedItems;
  if (items.length === 0) {
    createMdList.innerHTML = `<div class="create-md-empty">${createMdActiveTab === "derived" ? 'No derived metrics yet. Click "Add Derived Metric" to create one.' : "No basic metrics found in the data model."}</div>`;
    return;
  }
  createMdList.innerHTML = items
    .map(
      (m) => `
      <div class="create-md-item" data-id="${m.id}">
        <div class="create-md-item-name">${escapeHtml(m.name)}</div>
        <div class="create-md-item-meta">${escapeHtml(m.meta)}</div>
      </div>`,
    )
    .join("");
}

document.querySelectorAll(".create-md-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".create-md-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    createMdActiveTab = tab.dataset.category === "derived" ? "derived" : "basic";
    renderCreateMdList();
  });
});
if (createMdSearch) {
  createMdSearch.addEventListener("input", renderCreateMdList);
}

/* ── Derived Metric Inline Views (create panel) ── */
const createDerivedCancelBtn = document.querySelector("#createDerivedCancelBtn");
const createDerivedNextBtn = document.querySelector("#createDerivedNextBtn");
const createDerivedBackBtn = document.querySelector("#createMdDerivedBackBtn");
const createDerivedTestBtn = document.querySelector("#createDerivedTestBtn");
const createDerivedRefList = document.querySelector("#createDerivedRefList");
const createDerivedFormula = document.querySelector("#createDerivedFormula");
const createDerivedFormulaDisplay = document.querySelector("#createDerivedFormulaDisplay");
const createDerivedFormulaBuilder = document.querySelector("#createDerivedFormulaBuilder");
const createMdAiBackBtn = document.querySelector("#createMdAiBackBtn");
const createMdAiCancelBtn = document.querySelector("#createMdAiCancelBtn");
const createMdAiConfirmBtn = document.querySelector("#createMdAiConfirmBtn");

let createFormulaTokens = [];

function showCreateMdView(view) {
  if (createMdListView) createMdListView.hidden = view !== "list";
  if (createMdDerivedView) createMdDerivedView.hidden = view !== "derived";
  if (createMdAiReviewView) createMdAiReviewView.hidden = view !== "ai";
  if (createFormFooter) createFormFooter.hidden = view !== "list";
}

function openCreateDerivedForm() {
  extractCreateBasicMetrics();
  renderCreateDerivedRefList();
  createFormulaTokens = [];
  renderCreateFormulaDisplay();
  [
    "createDerivedBusinessDomain",
    "createDerivedMetricName",
    "createDerivedUnit",
    "createDerivedDescription",
    "createDerivedSynonyms",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const enableToggle = document.getElementById("createDerivedEnableToggle");
  if (enableToggle) enableToggle.checked = true;
  showCreateMdView("derived");
}

function renderCreateMdAiReview() {
  if (!createMdAiReviewBody) return;
  const name = document.getElementById("createDerivedMetricName").value.trim();
  const unit = document.getElementById("createDerivedUnit").value.trim();
  const desc = document.getElementById("createDerivedDescription").value.trim();
  const synonyms = document.getElementById("createDerivedSynonyms").value.trim();
  const formulaText = createFormulaTokens.map((t) => t.value).join(" ");

  const checks = [
    { label: "Metric Name", filled: !!name },
    { label: "Unit", filled: !!unit },
    { label: "Formula", filled: createFormulaTokens.length > 0 },
    { label: "Description", filled: !!desc },
    { label: "Synonyms", filled: !!synonyms },
    {
      label: "Business Domain",
      filled: !!document.getElementById("createDerivedBusinessDomain").value,
    },
  ];
  const filledCount = checks.filter((c) => c.filled).length;
  const pct = Math.round((filledCount / checks.length) * 100);

  const metricTokens = createFormulaTokens.filter((t) => t.type === "metric");
  const warnings = [];
  if (createFormulaTokens.length === 0) {
    warnings.push("No formula defined. The derived metric cannot be calculated without a formula.");
  } else if (metricTokens.length === 0) {
    warnings.push(
      "Formula does not reference any basic metric. Consider adding at least one basic metric.",
    );
  }
  if (!desc) {
    warnings.push(
      "Description is empty. A clear business description helps AI use this metric correctly.",
    );
  }

  let html = `<div class="create-ai-section">`;
  html += `<div class="create-ai-item">`;
  html += `<div class="create-ai-item-header"><span>Completeness</span><strong>${filledCount} / ${checks.length} fields</strong></div>`;
  html += `<div class="create-ai-progress"><div class="create-ai-progress-bar" style="width: ${pct}%"></div></div>`;
  html += `<div class="create-ai-detail">`;
  checks.forEach((c) => {
    html += `<div class="create-ai-detail-row ${c.filled ? "filled" : "missing"}">`;
    html += c.filled
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`;
    html += `<span>${c.label}</span></div>`;
  });
  html += `</div></div>`;

  html += `<div class="create-ai-item">`;
  html += `<div class="create-ai-item-header"><span>Metric Summary</span><strong>${escapeHtml(name || "(unnamed)")}</strong></div>`;
  html += `<div class="create-ai-detail">`;
  html += `<div class="create-ai-detail-row filled"><span>Formula: <code>${escapeHtml(formulaText || "—")}</code></span></div>`;
  html += `<div class="create-ai-detail-row filled"><span>Unit: ${escapeHtml(unit || "Count")}</span></div>`;
  html += `<div class="create-ai-detail-row filled"><span>Referenced metrics: ${metricTokens.length}</span></div>`;
  html += `</div></div>`;

  if (warnings.length > 0) {
    html += `<div class="create-ai-item create-ai-warning">`;
    html += `<div class="create-ai-item-header"><span>AI Suggestions</span><strong>${warnings.length} suggestion${warnings.length > 1 ? "s" : ""}</strong></div>`;
    html += `<div class="create-ai-detail">`;
    warnings.forEach((w) => {
      html += `<div class="create-ai-detail-row missing"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg><span>${escapeHtml(w)}</span></div>`;
    });
    html += `</div></div>`;
  }
  html += `</div>`;
  createMdAiReviewBody.innerHTML = html;
}

function saveCreateDerivedMetric() {
  const nameEl = document.getElementById("createDerivedMetricName");
  const name = nameEl.value.trim();
  const nameError = document.getElementById("createDerivedMetricNameError");
  if (nameError) nameError.hidden = !!name;
  if (!name) {
    nameEl.classList.add("field-input-error");
    nameEl.focus();
    return;
  }
  nameEl.classList.remove("field-input-error");
  const formulaText = createFormulaTokens.map((t) => t.value).join(" ");
  const unit = document.getElementById("createDerivedUnit").value.trim() || "Count";
  const desc = document.getElementById("createDerivedDescription").value.trim() || name;
  const synonyms = document
    .getElementById("createDerivedSynonyms")
    .value.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  createDerivedMetrics.push({
    id: "derived-" + Date.now(),
    name,
    desc,
    unit,
    formula: formulaText,
    synonyms,
  });
  createMdActiveTab = "derived";
  document.querySelectorAll(".create-md-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.category === "derived");
  });
  renderCreateMdList();
  showCreateMdView("list");
  showToast(`Derived metric "${name}" created successfully`);
}

function renderCreateFormulaDisplay() {
  if (!createDerivedFormulaDisplay) return;
  if (createFormulaTokens.length === 0) {
    createDerivedFormulaDisplay.innerHTML =
      '<span class="derived-formula-placeholder">Click a metric or operator to build your formula...</span>';
  } else {
    createDerivedFormulaDisplay.innerHTML = createFormulaTokens
      .map((token, index) => {
        if (token.type === "metric") {
          return `<span class="derived-formula-token metric" title="${escapeHtml(token.value)}">${escapeHtml(token.label)}<button type="button" class="token-remove" data-index="${index}" aria-label="Remove">&times;</button></span>`;
        }
        if (token.type === "operator") {
          return `<span class="derived-formula-token operator">${token.value === "*" ? "&times;" : token.value === "/" ? "&divide;" : token.value}</span>`;
        }
        if (token.type === "constant") {
          return `<span class="derived-formula-token constant">${escapeHtml(String(token.value))}<button type="button" class="token-remove" data-index="${index}" aria-label="Remove">&times;</button></span>`;
        }
        if (token.type === "parenthesis") {
          return `<span class="derived-formula-token parenthesis">${token.value}</span>`;
        }
        return "";
      })
      .join("");
  }
  createDerivedFormulaDisplay.querySelectorAll(".token-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index, 10);
      createFormulaTokens.splice(idx, 1);
      renderCreateFormulaDisplay();
    });
  });
  if (createDerivedFormula) {
    createDerivedFormula.value = createFormulaTokens.map((t) => t.value).join(" ");
  }
}

function addCreateFormulaToken(type, value, label) {
  createFormulaTokens.push({ type, value, label: label || value });
  renderCreateFormulaDisplay();
}

function addCreateFormulaOperator(op) {
  if (op === "clear") {
    createFormulaTokens = [];
    renderCreateFormulaDisplay();
    return;
  }
  if (op === "backspace") {
    createFormulaTokens.pop();
    renderCreateFormulaDisplay();
    return;
  }
  if (op === "const") {
    const val = window.prompt("Enter a constant value (e.g. 100, 0.5):");
    if (val && !isNaN(parseFloat(val))) {
      addCreateFormulaToken("constant", parseFloat(val), String(parseFloat(val)));
    }
    return;
  }
  const tokenType = op === "(" || op === ")" ? "parenthesis" : "operator";
  addCreateFormulaToken(tokenType, op, op);
}

function renderCreateDerivedRefList() {
  if (!createDerivedRefList) return;
  createDerivedRefList.innerHTML = createBasicMetrics
    .map(
      (bm) => `
      <div class="derived-ref-item" data-ref="${bm.id}" title="Click to add to formula">
        <div class="derived-ref-name">${escapeHtml(bm.name)}</div>
        <div class="derived-ref-path">${escapeHtml(bm.tablePhysical)}.${escapeHtml(bm.field)}</div>
      </div>`,
    )
    .join("");

  createDerivedRefList.querySelectorAll(".derived-ref-item").forEach((item) => {
    item.addEventListener("click", () => {
      const ref = item.dataset.ref;
      const bm = createBasicMetrics.find((b) => b.id === ref);
      if (!bm) return;
      addCreateFormulaToken("metric", `${bm.tablePhysical}.${bm.field}`, bm.name);
      showToast(`Added "${bm.name}" to formula`);
    });
  });
}

if (createAddDerivedBtn) {
  createAddDerivedBtn.addEventListener("click", openCreateDerivedForm);
}
if (createDerivedBackBtn) {
  createDerivedBackBtn.addEventListener("click", () => showCreateMdView("list"));
}
if (createDerivedCancelBtn) {
  createDerivedCancelBtn.addEventListener("click", () => showCreateMdView("list"));
}
if (createDerivedNextBtn) {
  createDerivedNextBtn.addEventListener("click", () => {
    const nameEl = document.getElementById("createDerivedMetricName");
    const name = nameEl.value.trim();
    const nameError = document.getElementById("createDerivedMetricNameError");
    if (nameError) nameError.hidden = !!name;
    if (!name) {
      nameEl.classList.add("field-input-error");
      nameEl.focus();
      return;
    }
    nameEl.classList.remove("field-input-error");
    renderCreateMdAiReview();
    showCreateMdView("ai");
  });
}
if (createMdAiBackBtn) {
  createMdAiBackBtn.addEventListener("click", () => showCreateMdView("derived"));
}
if (createMdAiCancelBtn) {
  createMdAiCancelBtn.addEventListener("click", () => showCreateMdView("list"));
}
if (createMdAiConfirmBtn) {
  createMdAiConfirmBtn.addEventListener("click", saveCreateDerivedMetric);
}
if (createDerivedFormulaBuilder) {
  const toolbar = createDerivedFormulaBuilder.querySelector(".derived-formula-toolbar");
  if (toolbar) {
    toolbar.querySelectorAll(".derived-formula-op").forEach((btn) => {
      btn.addEventListener("click", () => addCreateFormulaOperator(btn.dataset.op));
    });
  }
}
if (createDerivedTestBtn) {
  createDerivedTestBtn.addEventListener("click", () => {
    const formulaText = createFormulaTokens.map((t) => t.value).join(" ");
    const formulaError = document.getElementById("createDerivedFormulaError");
    if (formulaError) formulaError.hidden = !!formulaText;
    if (!formulaText) {
      if (createDerivedFormulaDisplay)
        createDerivedFormulaDisplay.classList.add("field-input-error");
      return;
    }
    if (createDerivedFormulaDisplay)
      createDerivedFormulaDisplay.classList.remove("field-input-error");
    showToast("Test running formula... Result: 42.86 (simulated)");
  });
}

if (createKnowledgeTypeSelect) {
  createKnowledgeTypeSelect.addEventListener("change", toggleCreateFormByType);
}
if (dataModelTableSearch) {
  dataModelTableSearch.addEventListener("input", () => {
    renderDbTableList(dataModelTableSearch.value);
  });
}
dataModelTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveDmTab(tab.dataset.tab);
    if (tab.dataset.tab === "basic") renderDataModelBasic();
    if (tab.dataset.tab === "fields") renderDataModelFields();
  });
});
if (dmAddSynonymBtn) {
  dmAddSynonymBtn.addEventListener("click", () => {
    const name = window.prompt("Synonym");
    if (!name) return;
    const t = dbTables.find((x) => x.id === selectedTableId);
    if (!t) return;
    if (!t.tableSynonyms) t.tableSynonyms = [];
    if (!t.tableSynonyms.includes(name)) t.tableSynonyms.push(name);
    renderDataModelBasic();
  });
}

/* Sync Basic Info form inputs back to dbTables */
function bindDataModelBasicEvents() {
  if (!dataModelBasicForm) return;
  const comment = dataModelBasicForm.querySelector("#dmDbComment");
  const displayName = dataModelBasicForm.querySelector("#dmDisplayName");
  const tableType = dataModelBasicForm.querySelector("#dmTableType");
  const participateQa = dataModelBasicForm.querySelector("#dmParticipateQa");
  if (comment) {
    comment.addEventListener("input", () => {
      const t = dbTables.find((x) => x.id === selectedTableId);
      if (t) t.comment = comment.value;
    });
  }
  if (displayName) {
    displayName.addEventListener("input", () => {
      const t = dbTables.find((x) => x.id === selectedTableId);
      if (t) t.displayName = displayName.value;
    });
  }
  if (tableType) {
    tableType.addEventListener("change", () => {
      const t = dbTables.find((x) => x.id === selectedTableId);
      if (t) t.tableType = tableType.value;
    });
  }
  if (participateQa) {
    participateQa.addEventListener("change", () => {
      const t = dbTables.find((x) => x.id === selectedTableId);
      if (t) t.participateQa = participateQa.checked;
    });
  }
}
bindDataModelBasicEvents();

/* ── Edit Panel Elements ── */
const editScrim = document.querySelector("#editScrim");
const editKnowledgePanel = document.querySelector("#editKnowledgePanel");
const editPanelClose = document.querySelector("#editPanelClose");
const editKnowledgeForm = document.querySelector("#editKnowledgeForm");
const editKnowledgeType = document.querySelector("#editKnowledgeType");
const editTitle = document.querySelector("#editTitle");
const editSummary = document.querySelector("#editSummary");
const editOwner = document.querySelector("#editOwner");
const editSource = document.querySelector("#editSource");
const editStage = document.querySelector("#editStage");
const editAiUseList = document.querySelector("#editAiUseList");
const editAddAiUse = document.querySelector("#editAddAiUse");
const editCancelBtn = document.querySelector("#editCancelBtn");
const editSaveBtn = document.querySelector("#editSaveBtn");
const editAiReviewView = document.querySelector("#editAiReviewView");
const editAiReviewBody = document.querySelector("#editAiReviewBody");
const editAiBackBtn = document.querySelector("#editAiBackBtn");
const editAiApplyBtn = document.querySelector("#editAiApplyBtn");
const editApprovalView = document.querySelector("#editApprovalView");
const editApprovalSummary = document.querySelector("#editApprovalSummary");
const editApprovalBackBtn = document.querySelector("#editApprovalBackBtn");
const editApprovalConfirmBtn = document.querySelector("#editApprovalConfirmBtn");
const editPanelFooter = document.querySelector("#editPanelFooter");

let currentEditAssetId = "";
let editStep = 1; // 1 = form, 2 = AI review, 3 = approval

const allowedCategories = Object.keys(categorySummaries);
const allowedStages = ["all", ...Object.keys(stageNames)];
const allowedTypes = [
  "all",
  "Principles",
  "Report Context",
  "Data Model",
  "Metric Dictionary",
  "Business Term",
  "Analytical Model",
];
const knowledgeParams = new URLSearchParams(window.location.search);
const requestedCategory = knowledgeParams.get("category");
const requestedStage = knowledgeParams.get("stage");
const requestedType = knowledgeParams.get("type");
const requestedReport = knowledgeParams.get("report");
const requestedAsset = knowledgeParams.get("asset");

let activeCategory = allowedCategories.includes(requestedCategory) ? requestedCategory : "all";
let activeStage = allowedStages.includes(requestedStage) ? requestedStage : "all";
let activeType = allowedTypes.includes(requestedType) ? requestedType : "all";
let activeSource = "all";
let activeStatusDisplay = "all";
let activeAiCheck = "all";
let selectedAssetId = knowledgeAssets.some((asset) => asset.id === requestedAsset)
  ? requestedAsset
  : "";

function matchesReport(asset) {
  return !requestedReport || (asset.projects || []).includes(requestedReport);
}

function getFilteredAssets() {
  const query = searchInput.value.trim().toLowerCase();

  return knowledgeAssets.filter((asset) => {
    // Exclude personal memory assets from the main list
    if (asset.category === "memory") return false;
    const matchesCategory = activeCategory === "all" || asset.category === activeCategory;
    const matchesStage = activeStage === "all" || asset.stage === activeStage;
    const matchesType = activeType === "all" || asset.type === activeType;
    const matchesSource = activeSource === "all" || asset.source === activeSource;
    const assetStatus = statusMap[asset.stage] || asset.stage;
    const matchesStatus = activeStatusDisplay === "all" || assetStatus === activeStatusDisplay;
    const assetAiCheck = aiCheckMap[asset.stage] || "Reviewing";
    const matchesAiCheck = activeAiCheck === "all" || assetAiCheck === activeAiCheck;
    const searchable = [
      asset.title,
      asset.type,
      asset.summary,
      asset.owner,
      asset.source,
      ...(asset.connections || []).map((connection) => connection.name),
    ]
      .join(" ")
      .toLowerCase();

    return (
      matchesCategory &&
      matchesStage &&
      matchesType &&
      matchesSource &&
      matchesStatus &&
      matchesAiCheck &&
      matchesReport(asset) &&
      (!query || searchable.includes(query))
    );
  });
}

function updateUrlParam(name, value, defaultValue = "") {
  const url = new URL(window.location.href);
  if (!value || value === defaultValue) url.searchParams.delete(name);
  else url.searchParams.set(name, value);
  window.history.replaceState({}, "", url);
}

function renderDetail(asset) {
  const hasAsset = Boolean(asset);
  detailContent.hidden = !hasAsset;
  detailEmpty.hidden = hasAsset;
  if (!asset) return;

  detailType.textContent = asset.type;
  detailType.dataset.category = asset.category;
  detailSource.textContent = asset.source;
  detailSource.dataset.source = asset.source.toLowerCase();
  detailTitle.textContent = asset.title;
  detailSummary.textContent = asset.summary;
  detailOwner.textContent = asset.owner;
  detailStage.textContent = stageNames[asset.stage] || asset.stage;
  detailUpdated.textContent = asset.updated;

  const connectionItems = (asset.connections || []).map((connection) => {
    const link = document.createElement("a");
    const name = document.createElement("span");
    const meta = document.createElement("small");
    const arrow = document.createElement("b");

    link.className = "connection-item";
    link.href = asset.href;
    link.setAttribute("aria-label", `Open ${connection.name}`);
    name.textContent = connection.name;
    meta.textContent = connection.kind;
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "\u2197";
    link.append(name, meta, arrow);
    return link;
  });
  detailConnections.replaceChildren(...connectionItems);

  // Content Preview for non-Data Model / non-Metric Dictionary types
  if (detailAction) detailAction.href = asset.href;
  if (detailActionLabel)
    detailActionLabel.textContent =
      asset.category === "memory" ? "Open related reports" : "Open connected workspace";
}

function generatePreviewContent(asset) {
  let html = "";

  // Generate rich preview based on asset type
  const type = asset.type;
  const summary = asset.summary || "";
  const aiUse = asset.aiUse || [];
  const connections = asset.connections || [];

  // Core description card
  html += `<div class="preview-card">`;
  html += `<div class="preview-card-header"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg><span>Description</span></div>`;
  html += `<p class="preview-text">${escapeHtml(summary)}</p>`;
  html += `</div>`;

  // AI Use cases card
  if (aiUse.length > 0) {
    html += `<div class="preview-card">`;
    html += `<div class="preview-card-header"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>AI Use Cases</span></div>`;
    html += `<ul class="preview-list">`;
    aiUse.forEach((item) => {
      html += `<li><span class="preview-bullet"></span>${escapeHtml(item)}</li>`;
    });
    html += `</ul>`;
    html += `</div>`;
  }

  // Connections card
  if (connections.length > 0) {
    html += `<div class="preview-card">`;
    html += `<div class="preview-card-header"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg><span>Connected Objects (${connections.length})</span></div>`;
    html += `<div class="preview-connections">`;
    connections.forEach((conn) => {
      html += `<a href="${asset.href}" class="preview-connection-item"><span class="preview-connection-name">${escapeHtml(conn.name)}</span><span class="preview-connection-kind">${escapeHtml(conn.kind)}</span></a>`;
    });
    html += `</div>`;
    html += `</div>`;
  }

  // Metadata summary card
  html += `<div class="preview-card preview-meta-card">`;
  html += `<div class="preview-card-header"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Metadata</span></div>`;
  html += `<div class="preview-meta-grid">`;
  html += `<div class="preview-meta-item"><span class="preview-meta-label">Version</span><span class="preview-meta-value">${getVersion(asset)}</span></div>`;
  html += `<div class="preview-meta-item"><span class="preview-meta-label">Status</span><span class="preview-meta-value preview-status-badge" data-status="${statusMap[asset.stage] || "Draft"}">${statusMap[asset.stage] || "Draft"}</span></div>`;
  html += `<div class="preview-meta-item"><span class="preview-meta-label">AI Check</span><span class="preview-meta-value preview-ai-badge" data-check="${aiCheckMap[asset.stage] || "Reviewing"}">${aiCheckMap[asset.stage] || "Reviewing"}</span></div>`;
  html += `<div class="preview-meta-item"><span class="preview-meta-label">Usage</span><span class="preview-meta-value">${getUsage(asset).toLocaleString()}</span></div>`;
  html += `</div>`;
  html += `</div>`;

  return html;
}

function openCreatePanel() {
  createScrim.hidden = false;
  createKnowledgePanel.classList.add("open");
  createKnowledgePanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("create-panel-open");
  createPanelClose.focus();
  setCreateStep(2);
  toggleCreateFormByType();
}

function closeCreatePanel() {
  if (!createKnowledgePanel.classList.contains("open")) return;
  createKnowledgePanel.classList.remove("open");
  createKnowledgePanel.setAttribute("aria-hidden", "true");
  createScrim.hidden = true;
  document.body.classList.remove("create-panel-open");
  createKnowledgeForm.reset();
  setCreateStep(1);
}

function setCreateStep(stepNum) {
  createFlowSteps.forEach((step) => {
    const num = parseInt(step.dataset.step, 10);
    step.classList.toggle("active", num < stepNum);
    step.classList.toggle("current", num === stepNum);
  });
}

/* ── Edit Panel Functions ── */
function openEditPanel(assetId) {
  const asset = knowledgeAssets.find((item) => item.id === assetId);
  if (!asset) return;

  currentEditAssetId = assetId;

  // Populate form fields
  editKnowledgeType.value = asset.type;
  editTitle.value = asset.title;
  editSummary.value = asset.summary || "";
  editOwner.value = asset.owner || "";
  editSource.value = asset.source || "Shared";
  editStage.value = asset.stage || "co-build";

  // Populate AI use items
  renderEditAiUseList(asset.aiUse || []);

  // Open panel with animation
  editScrim.hidden = false;
  editKnowledgePanel.classList.add("open");
  editKnowledgePanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("edit-panel-open");
  editPanelClose.focus();
}

function closeEditPanel() {
  if (!editKnowledgePanel.classList.contains("open")) return;
  editKnowledgePanel.classList.remove("open");
  editKnowledgePanel.setAttribute("aria-hidden", "true");
  editScrim.hidden = true;
  document.body.classList.remove("edit-panel-open");
  editKnowledgeForm.reset();
  currentEditAssetId = "";
  // Reset step state
  editStep = 1;
  editKnowledgeForm.hidden = false;
  editAiReviewView.hidden = true;
  editApprovalView.hidden = true;
  editPanelFooter.hidden = false;
}

function renderEditAiUseList(items) {
  editAiUseList.innerHTML = "";
  items.forEach((text, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "edit-ai-use-item";
    itemDiv.innerHTML = `
      <input type="text" value="${escapeHtml(text)}" data-index="${index}" placeholder="Describe how AI uses this knowledge..." />
      <button type="button" class="edit-remove-ai-use" aria-label="Remove item" data-index="${index}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    `;
    editAiUseList.appendChild(itemDiv);
  });

  // Bind remove buttons
  editAiUseList.querySelectorAll(".edit-remove-ai-use").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index, 10);
      const currentItems = getEditAiUseItems();
      currentItems.splice(index, 1);
      renderEditAiUseList(currentItems);
    });
  });
}

function getEditAiUseItems() {
  return Array.from(editAiUseList.querySelectorAll('input[type="text"]'))
    .map((input) => input.value.trim())
    .filter((val) => val.length > 0);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function openDetail(assetId, updateUrl = true) {
  const asset = knowledgeAssets.find((item) => item.id === assetId);
  if (!asset) return;
  // For Data Model and Metric Dictionary types, navigate to dedicated pages
  if (asset.type === "Data Model") {
    window.location.href = `data-model.html?asset=${asset.id}`;
    return;
  }
  if (asset.type === "Metric Dictionary") {
    window.location.href = `metric-dictionary.html?asset=${asset.id}`;
    return;
  }

  selectedAssetId = asset.id;
  if (updateUrl) updateUrlParam("asset", selectedAssetId);
  renderAssets();
  detailScrim.hidden = false;
  knowledgeDetail.classList.add("open");
  knowledgeDetail.setAttribute("aria-hidden", "false");
  document.body.classList.add("knowledge-detail-open");
  detailClose.focus();
}

function closeDetail(updateUrl = true) {
  if (!knowledgeDetail.classList.contains("open")) return;
  knowledgeDetail.classList.remove("open");
  knowledgeDetail.setAttribute("aria-hidden", "true");
  detailScrim.hidden = true;
  document.body.classList.remove("knowledge-detail-open");
  selectedAssetId = "";
  assetList.querySelectorAll(".asset-row.active").forEach((row) => {
    row.classList.remove("active");
    row.setAttribute("aria-pressed", "false");
  });
  renderDetail(null);
  if (updateUrl) updateUrlParam("asset", "");
}

function getEffectiveScope(asset) {
  const scopes = [];
  if (asset.projects && asset.projects.length > 0) {
    if (asset.projects.length === 1) {
      scopes.push(reportNames[asset.projects[0]] || asset.projects[0]);
    } else {
      scopes.push(`${asset.projects.length} Reports`);
    }
  }
  const connections = (asset.connections || []).length;
  if (connections > 0) {
    scopes.push(`${connections} Models`);
  }
  return scopes.join(" / ") || "Global";
}

function getVersion(asset) {
  const stages = { "co-build": 1, solidify: 2, calibrate: 3 };
  const stageNum = stages[asset.stage] || 1;
  return `v${stageNum}.0`;
}

function getUsage(asset) {
  const base = {
    principles: 1245,
    context: 2156,
    models: 890,
    metrics: 1567,
    terms: 432,
    playbooks: 678,
    memory: 89,
  };
  const cat = asset.category;
  const baseVal = base[cat] || 500;
  const idHash = asset.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return baseVal + (idHash % 2000);
}

function createAssetRow(asset) {
  const isSelected = asset.id === selectedAssetId;
  const row = document.createElement("button");

  row.className = `asset-row${isSelected ? " active" : ""}`;
  row.type = "button";
  row.dataset.assetId = asset.id;
  row.setAttribute("aria-pressed", String(isSelected));

  // Knowledge Title cell
  const mainCell = document.createElement("span");
  mainCell.className = "asset-main";
  const mark = document.createElement("span");
  mark.className = "asset-mark";
  mark.textContent = asset.mark;
  const copy = document.createElement("span");
  copy.className = "asset-copy";
  const title = document.createElement("strong");
  title.textContent = asset.title;
  const meta = document.createElement("small");
  meta.textContent = asset.summary.substring(0, 60) + (asset.summary.length > 60 ? "..." : "");
  copy.append(title, meta);
  mainCell.append(mark, copy);

  // Type cell
  const typeCell = document.createElement("span");
  typeCell.className = "asset-type-badge";
  typeCell.dataset.type = asset.type;
  typeCell.textContent = asset.type;

  // Effective Scope cell
  const scopeCell = document.createElement("span");
  scopeCell.className = "asset-scope";
  scopeCell.textContent = getEffectiveScope(asset);

  // Owner cell
  const ownerCell = document.createElement("span");
  ownerCell.className = "asset-owner";
  ownerCell.textContent = asset.owner;

  // Status cell
  const statusCell = document.createElement("span");
  statusCell.className = "asset-status";
  const status = statusMap[asset.stage] || "Draft";
  statusCell.dataset.status = status;
  statusCell.textContent = status;

  // AI Check cell
  const aiCheckCell = document.createElement("span");
  aiCheckCell.className = "asset-ai-check";
  const aiCheck = aiCheckMap[asset.stage] || "Reviewing";
  aiCheckCell.dataset.check = aiCheck;
  aiCheckCell.textContent = aiCheck;

  // Version cell
  const versionCell = document.createElement("span");
  versionCell.className = "asset-version";
  versionCell.textContent = getVersion(asset);

  // Usage cell
  const usageCell = document.createElement("span");
  usageCell.className = "asset-usage";
  usageCell.textContent = getUsage(asset).toLocaleString();

  // Created cell
  const createdCell = document.createElement("span");
  createdCell.className = "asset-created";
  createdCell.textContent = asset.created;

  // Actions cell — dropdown menu
  const actionsCell = document.createElement("span");
  actionsCell.className = "asset-actions";
  const actionsWrapper = document.createElement("div");
  actionsWrapper.className = "asset-actions-dropdown";

  const actionsBtn = document.createElement("button");
  actionsBtn.className = "asset-actions-btn";
  actionsBtn.type = "button";
  actionsBtn.setAttribute("aria-label", "More actions");
  actionsBtn.setAttribute("aria-haspopup", "true");
  actionsBtn.setAttribute("aria-expanded", "false");
  actionsBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>`;

  const menu = document.createElement("div");
  menu.className = "asset-actions-menu";
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", "Asset actions");
  menu.hidden = true;

  const menuItems = [
    {
      label: "Edit",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
      action: "edit",
    },
    {
      label: asset.stage === "co-build" ? "Enable" : "Disable",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18.36 6.64a9 9 0 11-12.73 0"/><path d="M12 2v10"/></svg>`,
      action: "toggle",
    },
    {
      label: "Delete",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`,
      action: "delete",
    },
    {
      label: "View versions",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
      action: "versions",
    },
  ];

  menuItems.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "asset-menu-item";
    btn.type = "button";
    btn.setAttribute("role", "menuitem");
    btn.dataset.action = item.action;
    btn.dataset.assetId = asset.id;
    btn.innerHTML = `<span class="asset-menu-icon" aria-hidden="true">${item.icon}</span><span class="asset-menu-label">${item.label}</span>`;
    menu.appendChild(btn);
  });

  actionsWrapper.append(actionsBtn, menu);
  actionsCell.append(actionsWrapper);

  // Toggle menu on button click
  actionsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !menu.hidden;
    // Close all other menus
    document.querySelectorAll(".asset-actions-menu").forEach((m) => {
      if (m !== menu) {
        m.hidden = true;
        m.previousElementSibling?.setAttribute("aria-expanded", "false");
      }
    });
    menu.hidden = isOpen;
    actionsBtn.setAttribute("aria-expanded", String(!isOpen));
  });

  // Menu item click
  menu.addEventListener("click", (e) => {
    const item = e.target.closest("[data-action]");
    if (!item) return;
    e.stopPropagation();
    const action = item.dataset.action;
    const assetId = item.dataset.assetId;
    if (action === "edit") {
      openEditPanel(assetId);
    } else if (action === "toggle") {
      const isDisabling = asset.stage !== "co-build";
      const title = isDisabling ? "Disable Asset" : "Enable Asset";
      const message = isDisabling
        ? `Are you sure you want to disable "<strong>${asset.title}</strong>"? It will be deactivated and removed from active use. You can re-enable it later.`
        : `Are you sure you want to enable "<strong>${asset.title}</strong>"? It will be reactivated for active use.`;
      const confirmLabel = isDisabling ? "Disable" : "Enable";
      const confirmStyle = isDisabling ? "warning" : "primary";
      showConfirmDialog({
        title,
        message,
        confirmLabel,
        confirmStyle,
        onConfirm: () => {
          asset.stage = isDisabling ? "co-build" : "calibrate";
          asset.updated = "Just now";
          renderAssets();
          if (selectedAssetId === assetId) {
            renderDetail(asset);
          }
          showToast(`"${asset.title}" ${isDisabling ? "disabled" : "enabled"} successfully`);
        },
      });
    } else if (action === "delete") {
      showConfirmDialog({
        title: "Delete Asset",
        message: `Are you sure you want to delete "<strong>${asset.title}</strong>"? This action cannot be undone. The asset will be permanently removed.`,
        confirmLabel: "Delete",
        confirmStyle: "danger",
        onConfirm: () => {
          const idx = knowledgeAssets.findIndex((a) => a.id === assetId);
          if (idx >= 0) {
            knowledgeAssets.splice(idx, 1);
          }
          if (selectedAssetId === assetId) {
            closeDetail();
          }
          renderAssets();
          showToast(`"${asset.title}" deleted successfully`);
        },
      });
    } else if (action === "versions") {
      openVersionPanel(assetId);
    }
    menu.hidden = true;
    actionsBtn.setAttribute("aria-expanded", "false");
  });

  row.append(
    mainCell,
    typeCell,
    scopeCell,
    ownerCell,
    statusCell,
    usageCell,
    createdCell,
    actionsCell,
  );

  // Click on the row opens the detail panel (except actions dropdown)
  row.addEventListener("click", (e) => {
    if (e.target.closest(".asset-actions-dropdown")) return;
    openDetail(asset.id);
  });

  return row;
}

function syncStageControls() {
  if (stageFilter) stageFilter.value = activeStage;
  if (typeFilter) typeFilter.value = activeType;
}

const knowledgeTypeMeta = [
  {
    key: "Principles",
    label: "Principles",
    color: "#ffcd00",
    delta: 12.5,
    icon: "M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z",
  },
  {
    key: "Report Context",
    label: "Report Context",
    color: "#e07a3a",
    delta: 8.3,
    icon: "M4 4h12l4 4v12H4V4z M4 4v16 M16 4v4h4",
  },
  {
    key: "Data Model",
    label: "Data Model",
    color: "#3a8268",
    delta: 6.4,
    icon: "M3 7h18M3 12h18M3 17h18",
  },
  {
    key: "Metric Dictionary",
    label: "Metrics",
    color: "#9b6dc7",
    delta: 9.1,
    icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  },
  {
    key: "Business Term",
    label: "Business Terms",
    color: "#c95a7a",
    delta: 4.7,
    icon: "M4 4h16v4H4zM4 10h16v4H4zM4 16h10v4H4z",
  },
  {
    key: "Analytical Model",
    label: "Analytical Model",
    color: "#5b8db8",
    delta: 15.2,
    icon: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
  },
];

function renderKnowledgeTypeStats(filteredAssets) {
  if (!knowledgeTypeStats) return;
  const counts = {};
  filteredAssets.forEach((asset) => {
    counts[asset.type] = (counts[asset.type] || 0) + 1;
  });
  const total = filteredAssets.length;
  const cards = knowledgeTypeMeta.map((meta) => {
    const count = counts[meta.key] || 0;
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    const isActive = activeType === meta.key;
    return (
      '<div class="type-stat-card' +
      (isActive ? " active" : "") +
      '" data-type="' +
      meta.key +
      '">' +
      '<div class="type-stat-icon" style="background:' +
      meta.color +
      "15; color:" +
      meta.color +
      '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="' +
      meta.icon +
      '"/></svg>' +
      "</div>" +
      '<div class="type-stat-body">' +
      "<strong>" +
      count.toLocaleString() +
      "</strong>" +
      '<span class="type-stat-label">' +
      meta.label +
      "</span>" +
      "</div>" +
      "</div>"
    );
  });
  knowledgeTypeStats.innerHTML = cards.join("");

  // Bind click events to filter the table by type
  knowledgeTypeStats.querySelectorAll(".type-stat-card").forEach((card) => {
    card.addEventListener("click", () => {
      const type = card.dataset.type;
      if (activeType === type) {
        selectType("all");
      } else {
        selectType(type);
      }
    });
  });
}

function renderAssets() {
  const filteredAssets = getFilteredAssets();
  const assetLabel = filteredAssets.length === 1 ? "asset" : "assets";

  resultCount.textContent = `${filteredAssets.length} ${assetLabel}`;
  emptyState.hidden = filteredAssets.length > 0;
  assetList.hidden = filteredAssets.length === 0;

  if (!filteredAssets.some((asset) => asset.id === selectedAssetId)) {
    selectedAssetId = "";
  }

  renderKnowledgeTypeStats(filteredAssets);
  assetList.replaceChildren(...filteredAssets.map(createAssetRow));
  renderDetail(knowledgeAssets.find((asset) => asset.id === selectedAssetId));
  syncStageControls();
}

function selectCategory(category, updateUrl = true) {
  closeDetail();
  activeCategory = allowedCategories.includes(category) ? category : "all";
  sidebarButtons.forEach((button) => {
    if (!button.dataset.category) return; // skip nav links
    const isActive = button.dataset.category === activeCategory;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (updateUrl) updateUrlParam("category", activeCategory, "all");
  renderAssets();
}

function selectType(type, updateUrl = true) {
  activeType = allowedTypes.includes(type) ? type : "all";
  if (updateUrl) updateUrlParam("type", activeType, "all");
  renderAssets();
}

function selectStage(stage, updateUrl = true) {
  activeStage = allowedStages.includes(stage) ? stage : "all";
  if (updateUrl) updateUrlParam("stage", activeStage, "all");
  renderAssets();
}

sidebarButtons.forEach((button) => {
  if (!button.dataset.category) return; // skip nav links
  button.addEventListener("click", () => selectCategory(button.dataset.category));
});

if (stageFilter) {
  stageFilter.addEventListener("change", () => selectStage(stageFilter.value));
}
if (typeFilter) {
  typeFilter.addEventListener("change", () => selectType(typeFilter.value));
}
if (sourceFilter) {
  sourceFilter.addEventListener("change", () => {
    activeSource = sourceFilter.value;
    renderAssets();
  });
}
if (statusDisplayFilter) {
  statusDisplayFilter.addEventListener("change", () => {
    activeStatusDisplay = statusDisplayFilter.value;
    renderAssets();
  });
}
if (aiCheckFilter) {
  aiCheckFilter.addEventListener("change", () => {
    activeAiCheck = aiCheckFilter.value;
    renderAssets();
  });
}

assetList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-asset-id]");
  if (!row) return;
  openDetail(row.dataset.assetId);
});

assetList.addEventListener("keydown", (event) => {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const rows = Array.from(assetList.querySelectorAll(".asset-row"));
  if (!rows.length) return;

  event.preventDefault();
  const currentIndex = rows.indexOf(document.activeElement);
  let nextIndex = currentIndex;
  if (event.key === "ArrowDown") nextIndex = Math.min(currentIndex + 1, rows.length - 1);
  if (event.key === "ArrowUp") nextIndex = Math.max(currentIndex - 1, 0);
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = rows.length - 1;
  rows[nextIndex < 0 ? 0 : nextIndex].focus();
});

searchInput.addEventListener("input", renderAssets);
detailClose.addEventListener("click", () => closeDetail());
detailScrim.addEventListener("click", () => closeDetail());
document.addEventListener("click", (event) => {
  if (!event.target.closest(".asset-actions-dropdown")) {
    document.querySelectorAll(".asset-actions-menu").forEach((menu) => {
      menu.hidden = true;
      menu.previousElementSibling?.setAttribute("aria-expanded", "false");
    });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const activeDialog = document.querySelector(".confirm-overlay:not([hidden])");
    if (activeDialog) {
      dismissConfirmDialog(activeDialog);
      return;
    }
    closeDetail();
    closeCreatePanel();
  }
});

/**
 * Show a custom confirmation dialog matching the site's design language.
 * @param {Object} opts
 * @param {string} opts.title       - Dialog title
 * @param {string} opts.message     - Body text (HTML allowed for inline <strong> etc.)
 * @param {string} opts.confirmLabel - Confirm button label
 * @param {"primary"|"warning"|"danger"} opts.confirmStyle - Button color variant
 * @param {Function} opts.onConfirm - Callback when user confirms
 */
function showConfirmDialog({ title, message, confirmLabel, confirmStyle = "primary", onConfirm }) {
  // Remove any existing dialog
  const existing = document.querySelector(".confirm-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "confirm-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", title);

  overlay.innerHTML = `
    <div class="confirm-dialog">
      <div class="confirm-dialog-icon">
        ${
          confirmStyle === "danger"
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`
            : confirmStyle === "warning"
              ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>`
              : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`
        }
      </div>
      <h3 class="confirm-dialog-title">${title}</h3>
      <p class="confirm-dialog-message">${message}</p>
      <div class="confirm-dialog-actions">
        <button class="confirm-dialog-btn cancel" type="button">Cancel</button>
        <button class="confirm-dialog-btn ${confirmStyle}" type="button">${confirmLabel}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add("active");
  });

  // Cancel button
  overlay.querySelector(".confirm-dialog-btn.cancel").addEventListener("click", () => {
    dismissConfirmDialog(overlay);
  });

  // Confirm button
  overlay.querySelector(`.confirm-dialog-btn.${confirmStyle}`).addEventListener("click", () => {
    dismissConfirmDialog(overlay);
    if (typeof onConfirm === "function") onConfirm();
  });

  // Click backdrop to dismiss
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) dismissConfirmDialog(overlay);
  });
}

function dismissConfirmDialog(overlay) {
  overlay.classList.remove("active");
  overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
  // Fallback removal if transition doesn't fire
  setTimeout(() => {
    if (overlay.parentNode) overlay.remove();
  }, 300);
}

/* ── Version Comparison Panel ── */
const versionScrim = document.querySelector("#versionScrim");
const versionPanel = document.querySelector("#versionPanel");
const versionClose = document.querySelector("#versionClose");
const versionList = document.querySelector("#versionList");
const versionListSection = document.querySelector("#versionListSection");
const versionCompareSection = document.querySelector("#versionCompareSection");
const versionBackBtn = document.querySelector("#versionBackBtn");
const versionRestoreBtn = document.querySelector("#versionRestoreBtn");
const compareVersionLabel = document.querySelector("#compareVersionLabel");
const diffOldDate = document.querySelector("#diffOldDate");
const diffCurrentDate = document.querySelector("#diffCurrentDate");
const diffOldContent = document.querySelector("#diffOldContent");
const diffCurrentContent = document.querySelector("#diffCurrentContent");

let currentVersionAssetId = "";
let selectedVersionIndex = -1;

// Generate mock version history for an asset
function getVersionHistory(asset) {
  const versions = [];
  const stages = ["co-build", "solidify", "calibrate"];
  const stageLabels = ["Draft", "Under Review", "Published"];
  const dates = ["Today", "Yesterday", "3 days ago", "1 week ago", "2 weeks ago"];
  const editors = [asset.owner, "Data Governance", "AI Assistant", "System"];

  // Current version
  versions.push({
    version: getVersion(asset),
    stage: asset.stage,
    stageLabel: stageMap[asset.stage] || "Draft",
    date: asset.updated,
    editor: asset.owner,
    isCurrent: true,
    summary: asset.summary,
    aiUse: asset.aiUse || [],
    connections: asset.connections || [],
  });

  // Historical versions
  const numVersions = Math.min(3 + Math.floor(asset.id.length % 3), 5);
  for (let i = 1; i <= numVersions; i++) {
    const stageIdx = Math.min(i, stages.length - 1);
    versions.push({
      version: `v${Math.max(1, 3 - i)}.0`,
      stage: stages[stageIdx],
      stageLabel: stageLabels[stageIdx],
      date: dates[Math.min(i, dates.length - 1)],
      editor: editors[i % editors.length],
      isCurrent: false,
      summary: generateHistoricalSummary(asset.summary, i),
      aiUse: generateHistoricalAiUse(asset.aiUse || [], i),
      connections: generateHistoricalConnections(asset.connections || [], i),
    });
  }

  return versions;
}

function generateHistoricalSummary(current, index) {
  const prefixes = ["Initial draft: ", "Updated: ", "Revised: ", "Finalized: ", "Approved: "];
  return prefixes[Math.min(index - 1, prefixes.length - 1)] + current;
}

function generateHistoricalAiUse(current, index) {
  if (!current.length) return [];
  const modifiers = [
    (item) => item,
    (item) => item + " (clarified)",
    (item) => item.replace(/\./g, " (updated)."),
  ];
  return current
    .slice(0, Math.max(1, current.length - (index % 2)))
    .map(modifiers[index % modifiers.length]);
}

function generateHistoricalConnections(current, index) {
  if (!current.length) return [];
  return current.slice(0, Math.max(1, current.length - (index % 2)));
}

const stageMap = {
  "co-build": "Draft",
  solidify: "Under Review",
  calibrate: "Published",
};

function openVersionPanel(assetId) {
  const asset = knowledgeAssets.find((a) => a.id === assetId);
  if (!asset) return;

  currentVersionAssetId = assetId;
  selectedVersionIndex = -1;

  versionScrim.hidden = false;
  versionPanel.classList.add("open");
  versionPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("version-panel-open");
  versionClose.focus();

  renderVersionList(asset);
  showVersionList();
}

function closeVersionPanel() {
  if (!versionPanel.classList.contains("open")) return;
  versionPanel.classList.remove("open");
  versionPanel.setAttribute("aria-hidden", "true");
  versionScrim.hidden = true;
  document.body.classList.remove("version-panel-open");
  currentVersionAssetId = "";
  selectedVersionIndex = -1;
}

function showVersionList() {
  versionListSection.hidden = false;
  versionCompareSection.hidden = true;
}

function showCompareView() {
  versionListSection.hidden = true;
  versionCompareSection.hidden = false;
}

function renderVersionList(asset) {
  const versions = getVersionHistory(asset);

  versionList.innerHTML = versions
    .map((v, index) => {
      const isCurrent = v.isCurrent;
      return `
        <div class="version-item ${isCurrent ? "current" : ""}" data-index="${index}">
          <div class="version-number">${v.version}</div>
          <div class="version-info">
            <strong>${isCurrent ? "Current Version" : v.stageLabel}</strong>
            <span>${v.editor} · ${v.date}</span>
          </div>
          <div class="version-item-actions">
            ${!isCurrent ? `<button class="version-compare-btn" data-index="${index}" type="button">Compare</button>` : ""}
            ${!isCurrent ? `<button class="version-restore-small-btn" data-index="${index}" type="button">Restore</button>` : ""}
          </div>
        </div>
      `;
    })
    .join("");

  // Bind compare buttons
  versionList.querySelectorAll(".version-compare-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index, 10);
      showVersionCompare(asset, idx);
    });
  });

  // Bind restore buttons
  versionList.querySelectorAll(".version-restore-small-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index, 10);
      promptRestoreVersion(asset, idx);
    });
  });

  // Click on version item (not buttons) to compare
  versionList.querySelectorAll(".version-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.closest(".version-item-actions")) return;
      const idx = parseInt(item.dataset.index, 10);
      if (idx === 0) return; // current version, nothing to compare
      showVersionCompare(asset, idx);
    });
  });
}

function showVersionCompare(asset, versionIndex) {
  selectedVersionIndex = versionIndex;
  const versions = getVersionHistory(asset);
  const oldVersion = versions[versionIndex];
  const currentVersion = versions[0];

  compareVersionLabel.textContent = `${oldVersion.version} vs ${currentVersion.version}`;
  diffOldDate.textContent = oldVersion.date;
  diffCurrentDate.textContent = currentVersion.date;

  // Render diff content
  diffOldContent.innerHTML = renderDiffContent(oldVersion, currentVersion, "old");
  diffCurrentContent.innerHTML = renderDiffContent(currentVersion, oldVersion, "current");

  // Update restore button state
  if (versionRestoreBtn) {
    versionRestoreBtn.disabled = false;
    versionRestoreBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
      Restore ${oldVersion.version}
    `;
  }

  showCompareView();
}

function renderDiffContent(version, otherVersion, side) {
  const lines = [];

  // Summary diff
  const summaryClass =
    version.summary !== otherVersion.summary ? (side === "old" ? "removed" : "added") : "unchanged";
  lines.push(
    `<div class="diff-line ${summaryClass}"><span class="diff-label">${side === "old" ? "-" : "+"}</span><strong>Summary:</strong> ${escapeHtml(version.summary)}</div>`,
  );

  // AI Use diff
  lines.push(`<div class="diff-line unchanged"><strong>AI Application:</strong></div>`);
  version.aiUse.forEach((item, i) => {
    const otherItem = otherVersion.aiUse[i];
    const itemClass =
      otherItem && item !== otherItem ? (side === "old" ? "removed" : "added") : "unchanged";
    lines.push(
      `<div class="diff-line ${itemClass}"><span class="diff-label">${side === "old" ? "-" : "+"}</span>• ${escapeHtml(item)}</div>`,
    );
  });

  // Connections diff
  lines.push(`<div class="diff-line unchanged"><strong>Connections:</strong></div>`);
  version.connections.forEach((conn, i) => {
    const otherConn = otherVersion.connections[i];
    const connClass =
      !otherConn || conn.name !== otherConn.name
        ? side === "old"
          ? "removed"
          : "added"
        : "unchanged";
    lines.push(
      `<div class="diff-line ${connClass}"><span class="diff-label">${side === "old" ? "-" : "+"}</span>• ${escapeHtml(conn.name)} (${escapeHtml(conn.kind)})</div>`,
    );
  });

  return lines.join("");
}

function promptRestoreVersion(asset, versionIndex) {
  const versions = getVersionHistory(asset);
  const version = versions[versionIndex];

  showConfirmDialog({
    title: "Restore Version",
    message: `Restore "<strong>${asset.title}</strong>" to ${version.version}?<br><br>This will create a new pending review item in the Review Center for approval before it becomes the current version.`,
    confirmLabel: "Restore & Submit for Review",
    confirmStyle: "warning",
    onConfirm: () => {
      // Add to review center as pending
      addToReviewCenter(asset, version);
      showToast(`Version ${version.version} restored and submitted for review`);
    },
  });
}

function addToReviewCenter(asset, version) {
  // Store in localStorage for review center to pick up
  const pendingRestorations = JSON.parse(localStorage.getItem("pendingRestorations") || "[]");
  pendingRestorations.push({
    id: `restore-${asset.id}-${Date.now()}`,
    originalId: asset.id,
    title: asset.title,
    type: asset.type,
    mark: asset.mark,
    source: asset.source,
    submittedBy: "You",
    submitterInitials: "YO",
    submitted: "Just now",
    status: "pending",
    aiCheck: "Reviewing",
    stage: version.stage,
    restoreVersion: version.version,
    restoreDate: version.date,
  });
  localStorage.setItem("pendingRestorations", JSON.stringify(pendingRestorations));
}

function showToast(message) {
  const existing = document.querySelector(".version-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "version-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    padding: 12px 24px;
    background: #1a1d20;
    color: #fff;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    z-index: 100;
    opacity: 0;
    transition: all 0.3s ease;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Version panel event listeners
if (versionClose) versionClose.addEventListener("click", closeVersionPanel);
if (versionScrim) versionScrim.addEventListener("click", closeVersionPanel);
if (versionBackBtn) versionBackBtn.addEventListener("click", showVersionList);
if (versionRestoreBtn) {
  versionRestoreBtn.addEventListener("click", () => {
    if (currentVersionAssetId && selectedVersionIndex >= 0) {
      const asset = knowledgeAssets.find((a) => a.id === currentVersionAssetId);
      if (asset) promptRestoreVersion(asset, selectedVersionIndex);
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && versionPanel && versionPanel.classList.contains("open")) {
    closeVersionPanel();
  }
});

if (requestedReport) {
  const clearReportUrl = new URL(window.location.href);
  clearReportUrl.searchParams.delete("report");
  activeReportFilter.href = clearReportUrl;
  activeReportName.textContent = reportNames[requestedReport] || requestedReport;
  activeReportFilter.hidden = false;
}

selectStage(activeStage, false);
selectCategory(activeCategory, false);
selectType(activeType, false);
// Deep-link to a specific asset removed — drawer now only opens via row click to avoid auto-popup.
// Also force-clear any previously selected asset + drawer state.
if (typeof selectedAssetId !== "undefined") selectedAssetId = "";
if (typeof knowledgeDetail !== "undefined") {
  knowledgeDetail.classList.remove("open");
  knowledgeDetail.setAttribute("aria-hidden", "true");
  detailScrim.hidden = true;
  document.body.classList.remove("knowledge-detail-open");
}

// Create knowledge panel interactions
createKnowledgeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeDetail();
  openCreatePanel();
});

createPanelClose.addEventListener("click", closeCreatePanel);
createScrim.addEventListener("click", closeCreatePanel);

/* ── Edit panel interactions ── */
editPanelClose.addEventListener("click", closeEditPanel);
editScrim.addEventListener("click", closeEditPanel);
editCancelBtn.addEventListener("click", closeEditPanel);

editAddAiUse.addEventListener("click", () => {
  const currentItems = getEditAiUseItems();
  currentItems.push("");
  renderEditAiUseList(currentItems);
  // Focus the new empty input
  const inputs = editAiUseList.querySelectorAll('input[type="text"]');
  if (inputs.length > 0) inputs[inputs.length - 1].focus();
});

editSaveBtn.addEventListener("click", () => {
  if (!currentEditAssetId) return;
  const asset = knowledgeAssets.find((item) => item.id === currentEditAssetId);
  if (!asset) return;

  // Go to AI Review step
  editStep = 2;
  editKnowledgeForm.hidden = true;
  editAiReviewView.hidden = false;
  editApprovalView.hidden = true;
  editPanelFooter.hidden = true;

  // Generate AI review suggestions based on current edits
  const suggestions = generateEditAiSuggestions(asset);
  renderEditAiReview(suggestions);
});

function generateEditAiSuggestions(asset) {
  const suggestions = [];
  const newTitle = editTitle.value.trim();
  const newSummary = editSummary.value.trim();
  const newType = editKnowledgeType.value;

  if (newTitle && newTitle !== asset.title) {
    suggestions.push({
      field: "Title",
      old: asset.title,
      new: newTitle,
      reason: "Title has been updated to better reflect the knowledge scope.",
    });
  }
  if (newSummary && newSummary !== asset.summary) {
    suggestions.push({
      field: "Description",
      old: asset.summary || "(empty)",
      new: newSummary,
      reason: "Description refined for clarity and completeness.",
    });
  }
  if (newType && newType !== asset.type) {
    suggestions.push({
      field: "Type",
      old: asset.type,
      new: newType,
      reason: "Knowledge type adjusted to match content classification.",
    });
  }
  if (suggestions.length === 0) {
    suggestions.push({
      field: "General",
      old: "—",
      new: "—",
      reason: "No significant changes detected. Review recommended before submitting.",
    });
  }
  return suggestions;
}

function renderEditAiReview(suggestions) {
  let html = "";
  suggestions.forEach((s) => {
    html += `<div class="edit-ai-review-item">`;
    html += `<div class="edit-ai-review-field">${escapeHtml(s.field)}</div>`;
    html += `<div class="edit-ai-review-change">`;
    html += `<div class="edit-ai-review-old"><span>Before:</span> ${escapeHtml(s.old)}</div>`;
    html += `<div class="edit-ai-review-new"><span>After:</span> ${escapeHtml(s.new)}</div>`;
    html += `</div>`;
    html += `<div class="edit-ai-review-reason">${escapeHtml(s.reason)}</div>`;
    html += `</div>`;
  });
  editAiReviewBody.innerHTML = html;
}

editAiBackBtn.addEventListener("click", () => {
  editStep = 1;
  editKnowledgeForm.hidden = false;
  editAiReviewView.hidden = true;
  editApprovalView.hidden = true;
  editPanelFooter.hidden = false;
});

editAiApplyBtn.addEventListener("click", () => {
  // Go to Approval step
  editStep = 3;
  editKnowledgeForm.hidden = true;
  editAiReviewView.hidden = true;
  editApprovalView.hidden = false;
  editPanelFooter.hidden = true;

  // Render approval summary
  const asset = knowledgeAssets.find((item) => item.id === currentEditAssetId);
  if (asset) {
    editApprovalSummary.innerHTML = `
      <div class="edit-approval-row"><span>Title:</span> <strong>${escapeHtml(editTitle.value.trim() || asset.title)}</strong></div>
      <div class="edit-approval-row"><span>Type:</span> <strong>${escapeHtml(editKnowledgeType.value || asset.type)}</strong></div>
      <div class="edit-approval-row"><span>Owner:</span> <strong>${escapeHtml(editOwner.value.trim() || asset.owner || "—")}</strong></div>
      <div class="edit-approval-row"><span>Stage:</span> <strong>${escapeHtml(editStage.value === "co-build" ? "Draft" : editStage.value === "solidify" ? "Under Review" : "Published")}</strong></div>
    `;
  }
});

editApprovalBackBtn.addEventListener("click", () => {
  editStep = 2;
  editKnowledgeForm.hidden = true;
  editAiReviewView.hidden = false;
  editApprovalView.hidden = true;
  editPanelFooter.hidden = true;
});

editApprovalConfirmBtn.addEventListener("click", () => {
  if (!currentEditAssetId) return;
  const asset = knowledgeAssets.find((item) => item.id === currentEditAssetId);
  if (!asset) return;

  // Update asset data
  asset.type = editKnowledgeType.value;
  asset.title = editTitle.value.trim();
  asset.summary = editSummary.value.trim();
  asset.owner = editOwner.value.trim();
  asset.source = editSource.value;
  asset.stage = editStage.value;
  asset.aiUse = getEditAiUseItems();
  asset.updated = "Just now";

  // Refresh UI
  renderAssets();
  if (selectedAssetId === currentEditAssetId) {
    renderDetail(asset);
  }
  closeEditPanel();
  showToast(`"${asset.title}" submitted for approval`);
});

// Input method switching
createMethodBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    createMethodBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Add related tag — inline dropdown toggle
function toggleRelatedDropdown(e) {
  e.stopPropagation();
  const isOpen = createRelatedDropdown.classList.contains("open");
  if (isOpen) {
    createRelatedDropdown.classList.remove("open");
  } else {
    // Pre-check existing tags
    const existing = Array.from(createRelatedObjects.querySelectorAll(".create-related-tag")).map(
      (t) => t.textContent.trim(),
    );
    createRelatedDropdown.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = existing.includes(cb.value);
    });
    createRelatedDropdown.classList.add("open");
  }
}

function syncRelatedTags() {
  const selected = Array.from(
    createRelatedDropdown.querySelectorAll('input[type="checkbox"]:checked'),
  ).map((cb) => cb.value);
  createRelatedObjects.querySelectorAll(".create-related-tag").forEach((tag) => tag.remove());
  selected.forEach((val) => {
    const tag = document.createElement("span");
    tag.className = "create-related-tag";
    tag.textContent = val;
    createRelatedObjects.insertBefore(tag, createAddTagBtn);
  });
}

createAddTagBtn.addEventListener("click", toggleRelatedDropdown);

createRelatedDropdown.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
  cb.addEventListener("change", syncRelatedTags);
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!createRelatedDropdown.contains(e.target) && e.target !== createAddTagBtn) {
    createRelatedDropdown.classList.remove("open");
  }
});

// Step navigation: switch to AI Review
function goToAiReview() {
  // Validate required fields
  const titleInput = document.querySelector("#createTitle");
  const detailInput = document.querySelector("#createDetail");
  const dataModelTitle = document.querySelector("#createDataModelTitle");
  const dataModelDesc = document.querySelector("#createDataModelDescription");
  let firstInvalid = null;

  const showError = (input) => {
    if (!input) return false;
    const val = (input.value || "").trim();
    if (val) {
      clearError(input);
      return false;
    }
    let err = input.parentElement.querySelector(".field-error-msg");
    if (!err) {
      err = document.createElement("span");
      err.className = "field-error-msg";
      err.textContent = "Cannot be empty";
      input.insertAdjacentElement("afterend", err);
    }
    err.hidden = false;
    input.classList.add("field-error");
    if (!firstInvalid) firstInvalid = input;
    return true;
  };

  const clearError = (input) => {
    if (!input) return;
    const err = input.parentElement.querySelector(".field-error-msg");
    if (err) err.hidden = true;
    input.classList.remove("field-error");
  };

  const standardVisible = !document.querySelector("#createStandardFields").hidden;
  const dmVisible = !document.querySelector("#createDataModelFields").hidden;

  if (standardVisible) {
    showError(titleInput);
    showError(detailInput);
  } else if (dmVisible) {
    showError(dataModelTitle);
    showError(dataModelDesc);
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  // Hide form, show AI Review view
  createKnowledgeForm.hidden = true;
  createAiReviewView.hidden = false;
  // Update flow step highlight to step 3 (AI Review)
  // Mark step 2 (Fill Content) as completed, step 3 as current
  createFlowSteps.forEach((step) => {
    const s = parseInt(step.dataset.step, 10);
    step.classList.remove("active", "current", "completed");
    if (s === 3) step.classList.add("current");
    else if (s < 3) step.classList.add("completed");
  });
}

// Step navigation: back to Create Knowledge
function goToCreateKnowledge() {
  createAiReviewView.hidden = true;
  createKnowledgeForm.hidden = false;
  createFlowSteps.forEach((step) => {
    const s = parseInt(step.dataset.step, 10);
    step.classList.remove("active", "current", "completed");
    if (s === 2) step.classList.add("current");
  });
}

// Step navigation: from AI Review to Confirm Scope
const createConfirmScopeView = document.querySelector("#createConfirmScopeView");
const createConfirmScopeBtn = document.querySelector("#createConfirmScopeBtn");
const createBackToReviewBtn = document.querySelector("#createBackToReviewBtn");
const createFinalSubmitBtn = document.querySelector("#createFinalSubmitBtn");

function goToConfirmScope() {
  createAiReviewView.hidden = true;
  if (createConfirmScopeView) createConfirmScopeView.hidden = false;
  // Mark steps 2-3 as completed, step 4 as current
  createFlowSteps.forEach((step) => {
    const s = parseInt(step.dataset.step, 10);
    step.classList.remove("active", "current", "completed");
    if (s === 4) step.classList.add("current");
    else if (s < 4) step.classList.add("completed");
  });
}

function goBackToAiReview() {
  if (createConfirmScopeView) createConfirmScopeView.hidden = true;
  createAiReviewView.hidden = false;
  // Mark steps 2 as completed, step 3 as current
  createFlowSteps.forEach((step) => {
    const s = parseInt(step.dataset.step, 10);
    step.classList.remove("active", "current", "completed");
    if (s === 3) step.classList.add("current");
    else if (s < 3) step.classList.add("completed");
  });
}

if (createConfirmScopeBtn) createConfirmScopeBtn.addEventListener("click", goToConfirmScope);
if (createBackToReviewBtn) createBackToReviewBtn.addEventListener("click", goBackToAiReview);
if (createFinalSubmitBtn) {
  createFinalSubmitBtn.addEventListener("click", function () {
    alert("Knowledge submitted for review!");
    if (createConfirmScopeView) createConfirmScopeView.hidden = true;
    createKnowledgeForm.hidden = false;
    createKnowledgePanel.hidden = true;
    // Reset all step indicators
    createFlowSteps.forEach((step) => {
      step.classList.remove("active", "current", "completed");
    });
  });
}

createNextBtn.addEventListener("click", goToAiReview);
createBackBtn.addEventListener("click", goToCreateKnowledge);

// Save draft
createSaveDraftBtn.addEventListener("click", () => {
  const toast = document.createElement("div");
  toast.className = "create-toast";
  toast.textContent = "Draft saved successfully";
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
});

// Apply AI suggestions
createApplyAiBtn.addEventListener("click", () => {
  const titleInput = document.querySelector("#createTitle");
  const detailInput = document.querySelector("#createDetail");
  if (!titleInput.value.trim()) {
    titleInput.value = "City Comparison Analysis";
  }
  if (!detailInput.value.trim()) {
    detailInput.value =
      "Used to compare how different cities perform across core indicators such as Sales, Traffic, and CR, helping identify growth opportunities and allocation gaps.";
  }
  const toast = document.createElement("div");
  toast.className = "create-toast";
  toast.textContent = "AI suggestions applied";
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
});

// AI auto-fill badge
createAiBadge.addEventListener("click", () => {
  const titleInput = document.querySelector("#createTitle");
  const detailInput = document.querySelector("#createDetail");
  if (!titleInput.value.trim()) {
    titleInput.value = "City Comparison Analysis";
  }
  if (!detailInput.value.trim()) {
    detailInput.value =
      "Used to compare how different cities perform across core indicators such as Sales, Traffic, and CR, helping identify growth opportunities and allocation gaps.";
  }
});

// Form submission
createKnowledgeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#createTitle").value.trim();
  const detail = document.querySelector("#createDetail").value.trim();

  if (!title) {
    document.querySelector("#createTitle").focus();
    return;
  }

  const newAsset = {
    id: `k-${Date.now()}`,
    title,
    type: "Analytical Model",
    category: "playbooks",
    summary: detail || "New knowledge asset.",
    source: "Shared",
    owner: "Marketing Strategy",
    stage: "co-build",
    updated: "Just now",
    mark: "KN",
    aiUse: ["Available for AI analysis"],
    connections: [],
    href: "knowledge.html",
  };

  knowledgeAssets.unshift(newAsset);
  renderAssets();
  closeCreatePanel();

  // Show success feedback
  const toast = document.createElement("div");
  toast.className = "create-toast";
  toast.textContent = `Knowledge "${title}" created successfully`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
});

/* ── Global AI Sidebar ── */
(function () {
  const assistantPanel = document.querySelector("#assistantPanel");
  const aiEntry = document.querySelector("#aiEntry");
  const promptCanvas = document.querySelector("#promptCanvas");
  const answerFeed = document.querySelector("#answerFeed");
  const activeContext = document.querySelector("#activeContext");
  const scopeButtons = document.querySelectorAll(".scope-option");
  const sendQuery = document.querySelector("#sendQuery");
  const clearPrompt = document.querySelector("#clearPrompt");
  const askSuggestions = document.querySelector("#askSuggestions");

  if (!assistantPanel || !aiEntry) return;

  const scopeSuggestions = {
    campaign: [
      {
        prompt: "What's the ROI trend across my active campaigns this quarter?",
        label: "What's the ROI trend across my active campaigns?",
      },
      {
        prompt: "Which campaigns are near budget threshold and need attention?",
        label: "Campaigns near budget threshold",
      },
      {
        prompt: "Show me the automation task queue and next best actions.",
        label: "Automation task queue overview",
      },
    ],
    report: [
      {
        prompt: "Compare channel performance for the last 3 campaigns and identify top performers.",
        label: "Compare channel performance for the last 3 campaigns",
      },
      {
        prompt: "Explain the largest city movement in this week's City Strategy report.",
        label: "Largest city movement this week",
      },
      {
        prompt: "What anomalies should I review in the Campaign Quality Watch?",
        label: "Campaign quality anomalies",
      },
    ],
    knowledge: [
      {
        prompt: "What is the governed definition of 'Attributed ROI' and which reports use it?",
        label: "Definition of Attributed ROI",
      },
      {
        prompt: "Show me knowledge assets related to city investment strategy.",
        label: "City investment strategy knowledge",
      },
      {
        prompt: "Which metrics have incomplete backflow and need data quality review?",
        label: "Metrics with data quality issues",
      },
    ],
    memory: [
      {
        prompt: "Recall my last campaign optimization notes and apply to current performance.",
        label: "Apply my last optimization notes",
      },
      {
        prompt: "What did I save about Rednote creative patterns last month?",
        label: "My saved Rednote creative patterns",
      },
      {
        prompt: "Summarize my personal review notes for this week's reports.",
        label: "My weekly review notes",
      },
    ],
  };

  const modeStatus = {
    campaign: "Campaign workspace",
    report: "Dashboards",
    knowledge: "Knowledge Base",
    memory: "Saved knowledge",
  };

  const scopeDescriptions = {
    personalized: "Ask questions across the entire Marketing Portal",
    campaign: "Ask questions about Campaigns",
    report: "Ask questions about Dashboards",
    knowledge: "Ask questions about Knowledge Base",
    memory: "Ask questions about Memory",
  };

  let initialActiveScope = document.querySelector(".scope-option.active");
  let selectedContext = (initialActiveScope && initialActiveScope.dataset.context) || "knowledge";
  let lastFocusedElement = null;

  /* Hide model pickers when Knowledge scope is active */
  var modelPickerBtn = document.querySelector("#modelPicker");
  var modePickerBtn = document.querySelector("#modePicker");
  function updatePickerVisibility(context) {
    if (modelPickerBtn) modelPickerBtn.hidden = context === "knowledge";
    if (modePickerBtn) modePickerBtn.hidden = context === "knowledge";
  }
  updatePickerVisibility(selectedContext);

  function escapeHtml(value) {
    if (typeof value !== "string") return "";
    return value.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c];
    });
  }

  function renderSuggestions(context) {
    if (!askSuggestions) return;
    var items = scopeSuggestions[context] || [];
    askSuggestions.innerHTML = items
      .map(function (item) {
        return (
          '<button class="ask-suggestion" type="button" data-prompt="' +
          escapeHtml(item.prompt) +
          '" data-context="' +
          context +
          '">' +
          escapeHtml(item.label) +
          "</button>"
        );
      })
      .join("");
    var descriptionEl = document.querySelector("#askScopeDescription");
    if (descriptionEl) {
      descriptionEl.textContent = scopeDescriptions[context] || scopeDescriptions.personalized;
    }
  }

  function setMode(context) {
    selectedContext = context;
    if (activeContext) activeContext.textContent = modeStatus[context] || context;
    scopeButtons.forEach(function (btn) {
      var isActive = btn.dataset.context === context;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    updatePickerVisibility(context);
    renderSuggestions(context);
  }

  function updateSendState() {
    if (sendQuery) sendQuery.disabled = !(promptCanvas && promptCanvas.textContent.trim().length);
  }

  function openAssistant(context) {
    if (!context) context = selectedContext;
    if (assistantPanel.hidden) lastFocusedElement = document.activeElement;
    assistantPanel.hidden = false;
    document.body.style.overflow = "hidden";
    setMode(context);
    renderSuggestions(context);
    window.setTimeout(function () {
      if (promptCanvas) promptCanvas.focus();
    }, 80);
  }

  function closeAssistant() {
    assistantPanel.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function createAnswer(query) {
    var normalizedQuery = query || "Show me the most important knowledge assets.";
    var recommendation = "Based on the governed knowledge, I've identified the following insights.";
    var findings = [
      {
        label: "Related Assets",
        detail: "Found 3 knowledge assets connected to your query in the Knowledge Base.",
      },
      {
        label: "Metric Definition",
        detail:
          "Attributed ROI is defined as net revenue attributed to marketing divided by total marketing cost.",
      },
      { label: "Data Quality", detail: "2 metrics show incomplete backflow and need review." },
    ];
    var sources = [
      "Knowledge Base / Metrics Dictionary",
      "Data Model / City Strategy",
      "Governed Definitions",
    ];
    return (
      '<div class="answer-entry">' +
      '<div class="user-query"><span class="user-query-bubble">' +
      escapeHtml(query || "") +
      "</span></div>" +
      '<article class="answer-card">' +
      '<div class="answer-card-header"><strong>AI Response</strong><span>Context: Knowledge Base</span></div>' +
      '<div class="answer-card-body"><p>' +
      escapeHtml(recommendation) +
      "</p>" +
      findings
        .map(function (f) {
          return (
            '<div class="answer-finding"><strong>' +
            escapeHtml(f.label) +
            "</strong><p>" +
            escapeHtml(f.detail) +
            "</p></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="answer-source-line" aria-label="Sources">' +
      sources
        .map(function (s) {
          return "<span>" + escapeHtml(s) + "</span>";
        })
        .join("") +
      "</div>" +
      '<div class="answer-feedback" data-answer-id="' +
      Date.now() +
      '">' +
      '<button type="button" class="answer-feedback-btn" data-feedback="helpful" aria-pressed="false">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>' +
      "<span>Helpful</span>" +
      "</button>" +
      '<button type="button" class="answer-feedback-btn" data-feedback="not-helpful" aria-pressed="false">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>' +
      "<span>Not helpful</span>" +
      "</button>" +
      '<button type="button" class="answer-feedback-btn copy-answer-btn" data-copy aria-label="Copy answer">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
      "<span>Copy</span>" +
      "</button>" +
      "</div>" +
      "</article>" +
      "</div>"
    );
  }

  function submitQuery(query) {
    if (!query)
      query = promptCanvas && promptCanvas.textContent ? promptCanvas.textContent.trim() : "";
    var normalizedQuery = query.trim();
    if (!normalizedQuery) return;
    if (answerFeed) {
      answerFeed.hidden = false;
      answerFeed.innerHTML = createAnswer(normalizedQuery);
    }
    var assistantMain = document.querySelector(".assistant-main");
    if (assistantMain) {
      window.setTimeout(function () {
        assistantMain.scrollTo({ top: assistantMain.scrollHeight, behavior: "smooth" });
      }, 30);
    }
    if (promptCanvas) promptCanvas.textContent = "";
    updateSendState();
  }

  aiEntry.addEventListener("click", function () {
    openAssistant("knowledge");
  });

  assistantPanel.addEventListener("click", function (event) {
    if (event.target.matches("[data-close]") || event.target.closest("[data-close]"))
      closeAssistant();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (assistantPanel && !assistantPanel.hidden) closeAssistant();
  });

  scopeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setMode(btn.dataset.context || "knowledge");
      if (promptCanvas) promptCanvas.focus();
    });
  });

  if (askSuggestions) {
    askSuggestions.addEventListener("click", function (event) {
      var suggestionBtn = event.target.closest(".ask-suggestion");
      if (!suggestionBtn) return;
      var prompt = suggestionBtn.dataset.prompt;
      var context = suggestionBtn.dataset.context;
      if (promptCanvas) promptCanvas.textContent = prompt || "";
      if (context) setMode(context);
      updateSendState();
      submitQuery(prompt);
    });
  }

  if (sendQuery) {
    sendQuery.addEventListener("click", function () {
      submitQuery();
    });
  }

  if (clearPrompt) {
    clearPrompt.addEventListener("click", function () {
      if (promptCanvas) promptCanvas.textContent = "";
      updateSendState();
      if (answerFeed) answerFeed.hidden = true;
    });
  }

  if (promptCanvas) {
    promptCanvas.addEventListener("input", updateSendState);
  }

  renderSuggestions("knowledge");
  if (sendQuery) sendQuery.disabled = true;

  /* New session: clear conversation and reset */
  var newSession = document.getElementById("newSession");
  if (newSession) {
    newSession.addEventListener("click", function () {
      if (promptCanvas) promptCanvas.textContent = "";
      if (answerFeed) {
        answerFeed.innerHTML = "";
        answerFeed.hidden = true;
      }
      var askStage = document.querySelector(".assistant-ask-stage");
      if (askStage) askStage.style.display = "";
      renderSuggestions(selectedContext);
      if (typeof updateSendState === "function") updateSendState();
      if (promptCanvas) promptCanvas.focus();
    });
  }

  /* Answer feedback & copy */
  document.addEventListener("click", function (event) {
    var btn = event.target.closest(".answer-feedback-btn");
    if (!btn) return;
    var feedbackBar = btn.closest(".answer-feedback");
    if (!feedbackBar) return;
    if (btn.hasAttribute("data-copy")) {
      var card = btn.closest(".answer-card");
      var text = card && card.textContent ? card.textContent.trim() : "";
      if (text && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(function () {
            btn.querySelector("span").textContent = "Copied!";
            setTimeout(function () {
              btn.querySelector("span").textContent = "Copy";
            }, 1500);
          })
          .catch(function () {
            /* ignore */
          });
      }
      return;
    }
    var feedback = btn.dataset.feedback;
    var allBtns = feedbackBar.querySelectorAll(".answer-feedback-btn[data-feedback]");
    allBtns.forEach(function (b) {
      var isActive = b.dataset.feedback === feedback && b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", String(isActive));
      b.classList.toggle("active", isActive);
    });
  });
})();
