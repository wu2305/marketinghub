/** ── Metric Dictionary Page Logic ── */

// ── Basic metrics extracted from dbTables (Measure fields) ──
const basicMetrics = [];

function extractBasicMetrics() {
  basicMetrics.length = 0;
  // dbTables is loaded from knowledge-data.js as window.dbTables
  const tables =
    typeof window !== "undefined" && Array.isArray(window.dbTables) ? window.dbTables : [];
  tables.forEach((table) => {
    (table.fields || []).forEach((field) => {
      if (field.fieldType === "Measure") {
        basicMetrics.push({
          id: `${table.id}.${field.key}`,
          name: field.name,
          table: table.name,
          tablePhysical: table.physical,
          field: field.key,
          type: field.type,
          synonyms: field.synonyms || [],
          agg: field.agg || "SUM",
        });
      }
    });
  });
  // Fallback sample data if no dbTables
  if (basicMetrics.length === 0) {
    basicMetrics.push(
      {
        id: "promotion_daily.exposure_count",
        name: "Exposure Count",
        table: "Promotion & Visit Fact Table",
        tablePhysical: "fact_promotion_daily",
        field: "exposure_count",
        type: "int",
        synonyms: ["Exposures", "Impressions"],
        agg: "SUM",
      },
      {
        id: "promotion_daily.visit_count",
        name: "Visit Count",
        table: "Promotion & Visit Fact Table",
        tablePhysical: "fact_promotion_daily",
        field: "visit_count",
        type: "int",
        synonyms: ["Visits", "Clicks"],
        agg: "SUM",
      },
      {
        id: "promotion_daily.add_to_cart_count",
        name: "Add to Cart Count",
        table: "Promotion & Visit Fact Table",
        tablePhysical: "fact_promotion_daily",
        field: "add_to_cart_count",
        type: "int",
        synonyms: ["Add-to-Cart Volume", "Favorite and Add-to-Cart Volume"],
        agg: "SUM",
      },
      {
        id: "promotion_daily.order_count",
        name: "Order Count",
        table: "Promotion & Visit Fact Table",
        tablePhysical: "fact_promotion_daily",
        field: "order_count",
        type: "int",
        synonyms: ["Order Volume", "Completed Orders"],
        agg: "SUM",
      },
      {
        id: "promotion_daily.store_visit_customers",
        name: "Store Visit Customers",
        table: "Promotion & Visit Fact Table",
        tablePhysical: "fact_promotion_daily",
        field: "store_visit_customers",
        type: "int",
        synonyms: ["Store Visitors", "Traffic Driven to Stores"],
        agg: "SUM",
      },
      {
        id: "promotion_daily.sales_amount",
        name: "Sales Amount",
        table: "Promotion & Visit Fact Table",
        tablePhysical: "fact_promotion_daily",
        field: "sales_amount",
        type: "decimal(12,2)",
        synonyms: ["Sales Amount", "Promotion Sales"],
        agg: "SUM",
      },
      {
        id: "promotion_daily.promotion_cost",
        name: "Promotion Cost",
        table: "Promotion & Visit Fact Table",
        tablePhysical: "fact_promotion_daily",
        field: "promotion_cost",
        type: "decimal(12,2)",
        synonyms: ["Advertising Cost", "Promotion Expenses"],
        agg: "SUM",
      },
    );
  }
}

// ── Derived metrics data ──
const derivedMetrics = [
  {
    id: "effective-traffic",
    name: "Effective traffic",
    category: "Derived",
    desc: "Visits that satisfy the governed engagement and identity conditions for conversion and funnel analysis.",
    owner: "CRM Analytics",
    unit: "Count",
    precision: "0 decimals",
    status: "Draft",
    formula: "SUM(visit_count) WHERE engagement_score >= 60 AND member_id IS NOT NULL",
  },
  {
    id: "conversion-rate",
    name: "Conversion rate",
    category: "Derived",
    desc: "Overall conversion rate across all traffic sources, including both member and non-member visits.",
    owner: "CRM Analytics",
    unit: "Percentage",
    precision: "2 decimals",
    status: "Published",
    formula: "SUM(order_count) / SUM(visit_count) * 100",
  },
];

// ── All metrics (basic + derived) for display ──
let allMetrics = [];
let activeMetricId = "";
let activeSidebarTab = "Basic";

function buildAllMetrics() {
  allMetrics = [];
  // Add basic metrics
  basicMetrics.forEach((bm) => {
    allMetrics.push({
      id: bm.id,
      name: bm.name,
      category: "Basic",
      desc: `${bm.name} from ${bm.tablePhysical}.${bm.field}`,
      owner: "Data Model",
      unit: bm.type && bm.type.includes("decimal") ? "Currency" : "Count",
      precision: bm.type && bm.type.includes("decimal") ? "2 decimals" : "0 decimals",
      status: "Published",
      source: `${bm.tablePhysical}.${bm.field}`,
      synonyms: bm.synonyms,
    });
  });
  // Add derived metrics
  derivedMetrics.forEach((dm) => {
    allMetrics.push({ ...dm, category: "Derived" });
  });
}

function renderMetricList() {
  const list = document.getElementById("metricList");
  if (!list) return;
  const filtered = allMetrics.filter((m) => m.category === activeSidebarTab);
  if (filtered.length === 0) {
    list.innerHTML = '<div class="metric-empty-state"><span>No metrics found</span></div>';
  } else {
    list.innerHTML = filtered
      .map(
        (metric) => `
        <div class="metric-item ${metric.id === activeMetricId ? "active" : ""}" data-id="${metric.id}">
          <div class="metric-item-name">${metric.name}</div>
          <div class="metric-item-meta">${metric.owner} · ${metric.unit}</div>
        </div>
      `,
      )
      .join("");
  }

  // Update counts
  const basicCount = document.getElementById("basicCount");
  const derivedCount = document.getElementById("derivedCount");
  if (basicCount) basicCount.textContent = allMetrics.filter((m) => m.category === "Basic").length;
  if (derivedCount)
    derivedCount.textContent = allMetrics.filter((m) => m.category === "Derived").length;

  // Auto-select first item if none selected
  if (!activeMetricId && filtered.length > 0) {
    activeMetricId = filtered[0].id;
    renderMetricDetail();
  }
}

function renderMetricDetail() {
  const metric = allMetrics.find((m) => m.id === activeMetricId);
  if (!metric) return;

  const titleEl = document.getElementById("metricTitle");
  const nameEl = document.getElementById("metricName");
  const descEl = document.getElementById("metricDesc");
  const nameInput = document.getElementById("metricNameInput");
  const defInput = document.getElementById("metricDefinition");
  const ownerInput = document.getElementById("metricOwner");
  const statusEl = document.getElementById("metricStatus");

  if (titleEl) titleEl.textContent = metric.name;
  if (nameEl) nameEl.textContent = metric.name;
  if (descEl) descEl.textContent = metric.desc;
  if (nameInput) nameInput.value = metric.name;
  if (defInput) defInput.value = metric.desc;
  if (ownerInput) ownerInput.value = metric.owner;

  if (statusEl) {
    statusEl.textContent = metric.status;
    statusEl.dataset.status = metric.status;
  }

  // Update formula tab for basic metrics
  const formulaBox = document.querySelector(".metric-formula-box code");
  if (formulaBox && metric.category === "Basic") {
    formulaBox.textContent = metric.source || `${metric.name}`;
  } else if (formulaBox && metric.category === "Derived") {
    formulaBox.textContent = metric.formula || "No formula defined";
  }

  // Update synonyms
  const synonymsContainer = document.getElementById("metricSynonyms");
  if (synonymsContainer && metric.synonyms) {
    const tags = metric.synonyms
      .map((s) => `<span class="metric-synonym-tag">${s} <b>&times;</b></span>`)
      .join("");
    synonymsContainer.innerHTML =
      tags + '<button class="metric-add-synonym" type="button">+</button>';
  }
}

// ── Derived Metric Panel ──
let derivedScrim = null;
let derivedMetricPanel = null;
let derivedPanelClose = null;
let derivedCancelBtn = null;
let derivedSaveBtn = null;
let addDerivedMetricBtn = null;
let derivedTestBtn = null;
let derivedRefList = null;
let derivedFormula = null;
let derivedFormulaDisplay = null;
let derivedFormulaBuilder = null;

// Formula tokens array: { type: "metric"|"operator"|"constant"|"parenthesis", value, label? }
let formulaTokens = [];

function initDerivedPanelElements() {
  derivedScrim = document.getElementById("derivedScrim");
  derivedMetricPanel = document.getElementById("derivedMetricPanel");
  derivedPanelClose = document.getElementById("derivedPanelClose");
  derivedCancelBtn = document.getElementById("derivedCancelBtn");
  derivedSaveBtn = document.getElementById("derivedSaveBtn");
  addDerivedMetricBtn = document.getElementById("addDerivedMetricBtn");
  derivedTestBtn = document.getElementById("derivedTestBtn");
  derivedRefList = document.getElementById("derivedRefList");
  derivedFormula = document.getElementById("derivedFormula");
  derivedFormulaDisplay = document.getElementById("derivedFormulaDisplay");
  derivedFormulaBuilder = document.getElementById("derivedFormulaBuilder");
}

function openDerivedPanel() {
  if (!derivedScrim || !derivedMetricPanel) return;
  derivedScrim.hidden = false;
  derivedMetricPanel.classList.add("open");
  derivedMetricPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("derived-panel-open");
  if (derivedPanelClose) derivedPanelClose.focus();
  renderDerivedRefList();
  // Reset formula
  formulaTokens = [];
  renderFormulaDisplay();
}

function closeDerivedPanel() {
  if (!derivedMetricPanel || !derivedMetricPanel.classList.contains("open")) return;
  derivedMetricPanel.classList.remove("open");
  derivedMetricPanel.setAttribute("aria-hidden", "true");
  if (derivedScrim) derivedScrim.hidden = true;
  document.body.classList.remove("derived-panel-open");
  const form = document.getElementById("derivedMetricForm");
  if (form) form.reset();
  formulaTokens = [];
}

function renderFormulaDisplay() {
  if (!derivedFormulaDisplay) return;
  if (formulaTokens.length === 0) {
    derivedFormulaDisplay.innerHTML =
      '<span class="derived-formula-placeholder">Click a metric or operator to build your formula...</span>';
  } else {
    derivedFormulaDisplay.innerHTML = formulaTokens
      .map((token, index) => {
        if (token.type === "metric") {
          return `<span class="derived-formula-token metric" title="${token.value}">${token.label}<button type="button" class="token-remove" data-index="${index}" aria-label="Remove">&times;</button></span>`;
        }
        if (token.type === "operator") {
          return `<span class="derived-formula-token operator">${escapeOp(token.value)}</span>`;
        }
        if (token.type === "constant") {
          return `<span class="derived-formula-token constant">${token.value}<button type="button" class="token-remove" data-index="${index}" aria-label="Remove">&times;</button></span>`;
        }
        if (token.type === "parenthesis") {
          return `<span class="derived-formula-token parenthesis">${token.value}</span>`;
        }
        return "";
      })
      .join("");
  }
  // Bind remove buttons on metric and constant tokens
  derivedFormulaDisplay.querySelectorAll(".token-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index, 10);
      formulaTokens.splice(idx, 1);
      renderFormulaDisplay();
    });
  });
  // Sync hidden textarea
  if (derivedFormula) {
    derivedFormula.value = formulaTokens.map((t) => t.value).join(" ");
  }
}

function escapeOp(op) {
  if (op === "*") return "&times;";
  if (op === "/") return "&divide;";
  return op;
}

function addFormulaToken(type, value, label) {
  formulaTokens.push({ type, value, label: label || value });
  renderFormulaDisplay();
}

function addFormulaOperator(op) {
  if (op === "clear") {
    formulaTokens = [];
    renderFormulaDisplay();
    return;
  }
  if (op === "backspace") {
    formulaTokens.pop();
    renderFormulaDisplay();
    return;
  }
  if (op === "const") {
    const val = window.prompt("Enter a constant value (e.g. 100, 0.5):");
    if (val && !isNaN(parseFloat(val))) {
      addFormulaToken("constant", parseFloat(val), String(parseFloat(val)));
    }
    return;
  }
  // Operator or parenthesis
  const tokenType = op === "(" || op === ")" ? "parenthesis" : "operator";
  addFormulaToken(tokenType, op, op);
}

function bindFormulaToolbar() {
  if (!derivedFormulaBuilder) return;
  const toolbar = derivedFormulaBuilder.querySelector(".derived-formula-toolbar");
  if (!toolbar) return;
  toolbar.querySelectorAll(".derived-formula-op").forEach((btn) => {
    btn.addEventListener("click", () => {
      const op = btn.dataset.op;
      addFormulaOperator(op);
    });
  });
}

function renderDerivedRefList() {
  if (!derivedRefList) return;
  derivedRefList.innerHTML = basicMetrics
    .map(
      (bm) => `
      <div class="derived-ref-item" data-ref="${bm.id}" title="Click to add to formula">
        <div class="derived-ref-name">${bm.name}</div>
        <div class="derived-ref-path">${bm.tablePhysical}.${bm.field}</div>
      </div>
    `,
    )
    .join("");

  derivedRefList.querySelectorAll(".derived-ref-item").forEach((item) => {
    item.addEventListener("click", () => {
      const ref = item.dataset.ref;
      const bm = basicMetrics.find((b) => b.id === ref);
      if (!bm) return;
      const insertValue = `${bm.tablePhysical}.${bm.field}`;
      addFormulaToken("metric", insertValue, bm.name);
      showToast(`Added "${bm.name}" to formula`);
    });
  });
}

// ── Event Bindings ──
function bindDerivedPanelEvents() {
  if (addDerivedMetricBtn) {
    addDerivedMetricBtn.addEventListener("click", openDerivedPanel);
  }
  if (derivedPanelClose) {
    derivedPanelClose.addEventListener("click", closeDerivedPanel);
  }
  if (derivedCancelBtn) {
    derivedCancelBtn.addEventListener("click", closeDerivedPanel);
  }
  if (derivedScrim) {
    derivedScrim.addEventListener("click", closeDerivedPanel);
  }
  if (derivedSaveBtn) {
    derivedSaveBtn.addEventListener("click", () => {
      const name = document.getElementById("derivedMetricName").value.trim();
      if (!name) {
        alert("Please enter a metric name.");
        return;
      }
      const formulaText = formulaTokens.map((t) => t.value).join(" ");
      const unit = document.getElementById("derivedUnit").value.trim() || "Count";
      const desc = document.getElementById("derivedDescription").value.trim() || name;
      const synonyms = document
        .getElementById("derivedSynonyms")
        .value.split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const newMetric = {
        id: "derived-" + Date.now(),
        name,
        category: "Derived",
        desc,
        owner: "Current User",
        unit,
        precision: "2 decimals",
        status: "Draft",
        formula: formulaText,
        synonyms,
      };
      derivedMetrics.push(newMetric);
      buildAllMetrics();
      activeMetricId = newMetric.id;
      activeSidebarTab = "Derived";
      // Update sidebar tabs
      document.querySelectorAll(".metric-tab").forEach((t) => {
        t.classList.toggle("active", t.dataset.category === "derived");
      });
      renderMetricList();
      renderMetricDetail();
      closeDerivedPanel();
      showToast(`Derived metric "${name}" created successfully`);
    });
  }
  if (derivedTestBtn) {
    derivedTestBtn.addEventListener("click", () => {
      const formulaText = formulaTokens.map((t) => t.value).join(" ");
      if (!formulaText) {
        alert("Please build a formula first.");
        return;
      }
      // Simulate test run
      showToast("Test running formula... Result: 42.86 (simulated)");
    });
  }
  bindFormulaToolbar();
}

// ── Tab switching ──
function bindTabEvents() {
  document.querySelectorAll(".metric-detail-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".metric-detail-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const tabName = tab.dataset.tab;
      document.querySelectorAll(".metric-tab-content").forEach((c) => c.classList.remove("active"));
      const target = document.getElementById(tabName + "Tab");
      if (target) target.classList.add("active");
    });
  });

  // Sidebar tab switching
  document.querySelectorAll(".metric-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".metric-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeSidebarTab = tab.dataset.category === "derived" ? "Derived" : "Basic";
      renderMetricList();
    });
  });

  // Metric selection
  const metricList = document.getElementById("metricList");
  if (metricList) {
    metricList.addEventListener("click", (e) => {
      const item = e.target.closest(".metric-item");
      if (!item) return;
      activeMetricId = item.dataset.id;
      renderMetricList();
      renderMetricDetail();
    });
  }
}

// ── Toast helper (reuse from knowledge.js if available) ──
function showToast(message) {
  if (typeof window.showToast === "function") {
    window.showToast(message);
    return;
  }
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(20px);
      background: #1a1d20; color: #fff; padding: 12px 20px; border-radius: 8px; font-size: 13px;
      font-weight: 600; z-index: 200; opacity: 0; transition: opacity 300ms ease, transform 300ms ease;
      pointer-events: none; box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 3000);
}

// ── Initialize ──
document.addEventListener("DOMContentLoaded", () => {
  initDerivedPanelElements();
  bindDerivedPanelEvents();
  extractBasicMetrics();
  buildAllMetrics();
  bindTabEvents();
  renderMetricList();
  renderMetricDetail();
});
