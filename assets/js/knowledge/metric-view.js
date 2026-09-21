(function () {
  const params = new URLSearchParams(location.search);
  const assets = window.marketingKnowledgeAssets || [];
  const asset = assets.find((item) => item.id === params.get("id"));
  const view = document.querySelector("#viewPage");
  if (!asset || asset.type !== "Metric Dictionary" || !view) return;
  const escapeHtml = (value) =>
    String(value || "").replace(
      /[&<>"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
    );
  const slug = asset.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const domain = asset.projects?.includes("customer") ? "Customer Growth" : "Marketing";
  const formulas = {
    "Member conversion": [
      { value: "Qualified Transactions", kind: "field" },
      { value: "÷", kind: "operator" },
      { value: "Member Visits", kind: "field" },
    ],
    "Campaign ROI": [
      { value: "Attributed Revenue", kind: "field" },
      { value: "÷", kind: "operator" },
      { value: "Media Spend", kind: "field" },
    ],
    "Promotion lift": [
      { value: "Promotion Sales", kind: "field" },
      { value: "−", kind: "operator" },
      { value: "Baseline Sales", kind: "field" },
    ],
  };
  let tokens = (formulas[asset.title] || formulas["Member conversion"]).map((item) => ({
    ...item,
  }));
  let activePalette = "fields";
  const palette = {
    fields: [
      ["Qualified Transactions", "fact_transaction.qualified_orders"],
      ["Member Visits", "fact_customer_visit.member_visits"],
      ["Attributed Revenue", "fact_campaign.attributed_revenue"],
      ["Media Spend", "fact_campaign.media_spend"],
    ],
    metrics: [
      ["Customer Visits", "Governed metric"],
      ["Conversion Rate", "Governed metric"],
      ["Campaign Revenue", "Governed metric"],
      ["Promotion Spend", "Governed metric"],
    ],
    functions: [
      ["COUNT_DISTINCT(", "Function"],
      ["SUM(", "Function"],
      ["AVG(", "Function"],
      ["COALESCE(", "Function"],
    ],
    operators: [
      ["+", "Operator"],
      ["−", "Operator"],
      ["×", "Operator"],
      ["÷", "Operator"],
      ["(", "Operator"],
      [")", "Operator"],
    ],
  };
  document.querySelector(".v20-view-title-breadcrumb")?.setAttribute("hidden", "");
  view.innerHTML = `<div class="metric-view"><div class="metric-view-path"><a href="../../index.html">Home</a><span>/</span><a href="knowledge.html">AI Interpreter</a><span>/</span><a href="knowledge.html">Knowledge Management</a><span>/</span><a href="knowledge.html?type=Metric%20Dictionary">Metric Dictionary</a><span>/</span><b>${escapeHtml(asset.title)}</b></div><header class="metric-page-head"><h1>${escapeHtml(asset.title)}</h1><button class="metric-version-btn" id="metricViewVersions" type="button">View Versions</button></header><div class="metric-sections">
    <section class="metric-section"><header class="metric-section-head"><div class="metric-section-title"><span class="metric-section-number">1</span><strong>Basic Information</strong><small>Metric attributes and business definition</small></div><span class="metric-complete">● Complete</span></header><div class="metric-section-body"><div class="metric-basic-grid"><div class="metric-field"><label>Metric Name</label><input readonly tabindex="-1" value="${escapeHtml(asset.title)}"></div><div class="metric-field"><label>Metric Code</label><input readonly tabindex="-1" value="${slug}"></div><div class="metric-field span-2"><label>Business Definition</label><textarea readonly tabindex="-1">${escapeHtml(asset.summary)}</textarea></div><div class="metric-field span-2"><label>Metric Synonyms</label><div class="metric-readonly-box"><span class="metric-chip">${escapeHtml(asset.title.replace(/\s+/g, " "))}</span><span class="metric-chip">${escapeHtml(asset.title.replace(/\s+/g, " "))} KPI</span></div></div><div class="metric-field"><label>Business Domain</label><input readonly tabindex="-1" value="${domain}"></div><div class="metric-field"><label>Metric Category</label><input readonly tabindex="-1" value="Derived Metric"></div><div class="metric-field"><label>Return Type</label><input readonly tabindex="-1" value="DECIMAL"></div><div class="metric-field"><label>Unit</label><input readonly tabindex="-1" value="${asset.title.includes("ROI") || asset.title.includes("conversion") ? "%" : "Count"}"></div><div class="metric-field"><label>Decimal Places</label><input readonly tabindex="-1" value="2"></div><div class="metric-field"><label>Enable Status</label><div class="metric-switch"><i></i>Enabled</div></div></div></div></section>
    <section class="metric-section"><header class="metric-section-head"><div class="metric-section-title"><span class="metric-section-number">2</span><strong>Calculation Rules</strong><small>Formula and aggregation logic</small></div><span class="metric-complete">● Complete</span></header><div class="metric-section-body"><div class="metric-calc-layout"><div class="metric-calc-main"><div class="metric-source-row"><div class="metric-field"><label>Data Source</label><input readonly tabindex="-1" value="Marketing DW"></div><div class="metric-field"><label>Data Table</label><input readonly tabindex="-1" value="Campaign Performance"></div></div><div class="metric-field"><label>Calculation Formula</label><div class="metric-token-formula" id="metricTokenFormula"></div></div><div class="metric-field"><label>Advanced Expression</label><input readonly tabindex="-1" value="Optional SQL expression"></div><div class="metric-field"><label>Filter Conditions</label><div class="metric-filter-box">Order Status = Paid</div></div><div class="metric-calc-options"><div class="metric-field"><label>Null Handling</label><input readonly tabindex="-1" value="Treat as 0"></div><div class="metric-field"><label>Divide-by-zero Handling</label><input readonly tabindex="-1" value="Return null"></div></div><div class="metric-test-row"><button class="metric-test-btn" id="metricTest" type="button">Test</button></div></div><aside class="metric-palette"><div class="metric-palette-tabs"><button class="active" data-metric-tab="fields" type="button">Reference Base Fields</button><button data-metric-tab="metrics" type="button">Reference Existing Metrics</button><button data-metric-tab="functions" type="button">Functions</button><button data-metric-tab="operators" type="button">Operators</button></div><div class="metric-palette-body" id="metricPaletteBody"></div></aside></div></div></section>
    <section class="metric-section"><header class="metric-section-head"><div class="metric-section-title"><span class="metric-section-number">3</span><strong>Dependencies</strong><small>Upstream dependencies and downstream impact</small></div><span class="metric-complete">● Complete</span></header><div class="metric-section-body"><div class="metric-dependencies"><article class="metric-dependency-card"><h3>Upstream Dependencies</h3><div class="metric-upstream"><span class="metric-node">Marketing DW</span><span class="metric-arrow">→</span><span class="metric-node">Campaign Performance</span><span class="metric-arrow">→</span><span class="metric-node metric">${escapeHtml(asset.title)}</span></div></article><article class="metric-dependency-card"><h3>Downstream Impact</h3><table class="metric-impact-table"><thead><tr><th>Object Type</th><th>Object Name</th><th>Status</th></tr></thead><tbody>${(asset.connections || []).map((item) => `<tr><td>${escapeHtml(item.kind)}</td><td>${escapeHtml(item.name)}</td><td><span class="metric-impact-status">In Use</span></td></tr>`).join("")}</tbody></table></article></div></div></section>
  </div></div>`;
  const metricPath = view.querySelector(".metric-view-path"),
    metricHeader = view.querySelector(".metric-page-head");
  if (metricPath && metricHeader) metricHeader.prepend(metricPath);
  if (metricHeader)
    metricHeader.dataset.visiblePath = `Home  /  AI Interpreter  /  Knowledge Management  /  Metric Dictionary  /  ${asset.title}`;
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="principles-scrim" id="metricVersionScrim" hidden></div><aside class="principles-version-panel" id="metricVersionPanel" aria-hidden="true"><header class="principles-panel-head"><div><span>VERSION HISTORY</span><strong>View Versions</strong></div><button class="principles-icon-btn" id="metricVersionClose" type="button">&times;</button></header><div class="principles-version-list" id="metricVersionList"></div></aside>`,
  );
  const formulaBox = document.querySelector("#metricTokenFormula"),
    paletteBody = document.querySelector("#metricPaletteBody");
  function renderFormula() {
    formulaBox.innerHTML = tokens.length
      ? tokens
          .map(
            (token, index) =>
              `<span class="metric-formula-${token.kind === "field" || token.kind === "metric" ? "token" : token.kind === "function" ? "fn" : "op"}">${escapeHtml(token.value)}${token.kind === "field" || token.kind === "metric" ? `<button type="button" data-remove-token="${index}" aria-label="Remove ${escapeHtml(token.value)}">×</button>` : ""}</span>`,
          )
          .join("")
      : `<span style="color:#89939b;font-size:11px">Select an item from the reference panel.</span>`;
  }
  function renderPalette() {
    paletteBody.innerHTML = palette[activePalette]
      .map(
        (item) =>
          `<button class="metric-palette-item" type="button" data-palette-value="${escapeHtml(item[0])}"><strong>${escapeHtml(item[0])}</strong><small>${escapeHtml(item[1])}</small></button>`,
      )
      .join("");
  }
  document.querySelectorAll("[data-metric-tab]").forEach((button) =>
    button.addEventListener("click", () => {
      activePalette = button.dataset.metricTab;
      document
        .querySelectorAll("[data-metric-tab]")
        .forEach((item) => item.classList.toggle("active", item === button));
      renderPalette();
    }),
  );
  paletteBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-palette-value]");
    if (!button) return;
    const kind =
      activePalette === "fields"
        ? "field"
        : activePalette === "metrics"
          ? "metric"
          : activePalette === "functions"
            ? "function"
            : "operator";
    tokens.push({ value: button.dataset.paletteValue, kind });
    renderFormula();
  });
  formulaBox.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-token]");
    if (!button) return;
    tokens.splice(Number(button.dataset.removeToken), 1);
    renderFormula();
  });
  document
    .querySelectorAll(
      ".metric-field input[readonly],.metric-field textarea[readonly],.metric-readonly-box,.metric-switch",
    )
    .forEach((element) => element.addEventListener("mousedown", (event) => event.preventDefault()));
  document.querySelector("#metricTest").addEventListener("click", () => {
    const dialog = document.querySelector("#resultDialog");
    document.querySelector("#dialogTitle").textContent = tokens.length
      ? "Test completed"
      : "Formula required";
    document.querySelector("#dialogText").textContent = tokens.length
      ? "The formula passed syntax and dependency checks."
      : "Add at least one formula item before testing.";
    dialog?.showModal();
  });
  const versions = [
    {
      number: "v3.1",
      label: "Current Version",
      editor: asset.owner,
      date: asset.updated,
      description: "Updated formula and dependency references.",
      current: true,
    },
    {
      number: "v2.0",
      label: "Published",
      editor: "Data Governance",
      date: "Jul 22, 2026",
      description: "Aligned the governed business definition.",
    },
    {
      number: "v1.0",
      label: "Published",
      editor: asset.owner,
      date: asset.created,
      description: "Initial approved metric.",
    },
  ];
  document.querySelector("#metricVersionList").innerHTML = versions
    .map(
      (version) =>
        `<article class="principles-version-item ${version.current ? "current" : ""}"><div class="principles-version-number">${version.number}</div><div class="principles-version-meta"><strong>${version.label}</strong><span>${escapeHtml(version.editor)} · ${escapeHtml(version.date)}</span><p>${escapeHtml(version.description)}</p></div></article>`,
    )
    .join("");
  const versionPanel = document.querySelector("#metricVersionPanel"),
    versionScrim = document.querySelector("#metricVersionScrim");
  const closeVersions = () => {
    versionPanel.classList.remove("open");
    versionPanel.setAttribute("aria-hidden", "true");
    versionScrim.hidden = true;
  };
  document.querySelector("#metricViewVersions").addEventListener("click", () => {
    versionScrim.hidden = false;
    versionPanel.classList.add("open");
    versionPanel.setAttribute("aria-hidden", "false");
  });
  document.querySelector("#metricVersionClose").addEventListener("click", closeVersions);
  versionScrim.addEventListener("click", closeVersions);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeVersions();
  });
  document
    .querySelectorAll('[data-metric-tab="functions"],[data-metric-tab="operators"]')
    .forEach((button) => button.remove());
  formulaBox.insertAdjacentHTML(
    "afterend",
    `<div class="metric-operator-row"><span>Operators</span>${["+", "−", "×", "÷", "(", ")"].map((operator) => `<button type="button" disabled>${operator}</button>`).join("")}</div>`,
  );
  renderFormula();
  renderPalette();
  document.querySelectorAll(".metric-view button:not(#metricViewVersions)").forEach((button) => {
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
  });
  document.querySelector("#metricVersionClose")?.setAttribute("disabled", "");
})();
