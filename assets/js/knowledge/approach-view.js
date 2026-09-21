(function () {
  const query = new URLSearchParams(location.search);
  const id = query.get("id") || "";
  const assets = window.marketingKnowledgeAssets || [];

  const fallbacks = {
    "scenario-channel-performance": {
      id: "scenario-channel-performance",
      type: "Scenario Reporting",
      title: "Channel Performance Analysis",
      description:
        "A reusable reporting scenario for channel efficiency, drivers, and recommendation-style summaries.",
      dataSources: ["Marketing DW", "Channel Performance Dashboard", "Campaign Performance"],
      triggerWhen:
        "When a user asks why channel performance changed or how one channel compares with another.",
      input: "Sales, Traffic, CR%, SV, AT, UPT; channel, region, date, and report period.",
      analysisLogic:
        "Start from the total view, compare Retail and Outlet, then trace the strongest driver gaps by channel and metric.",
      output: "Executive summary, supporting evidence, and a compact channel comparison table.",
      owner: "Marketing Analytics",
      updated: "Yesterday",
      source: "Shared",
      statusDisplay: "Published",
      version: "v1.0",
    },
    "scenario-campaign-review": {
      id: "scenario-campaign-review",
      type: "Scenario Reporting",
      title: "Campaign Review Reporting",
      description:
        "A structured reporting scenario that reviews delivery, engagement, conversion, and return.",
      dataSources: ["Marketing DW", "Campaign Performance", "Activation Dashboard"],
      triggerWhen:
        "When the business needs a weekly or monthly readout of campaign results and exceptions.",
      input:
        "Delivery, reach, traffic, conversion, ROI, spend, campaign group, region, and period.",
      analysisLogic:
        "Check overall delivery first, then compare channels, then isolate the main performance drag or lift drivers.",
      output: "Report summary, metric breakdown, key movements, and a concise evidence table.",
      owner: "Campaign Operations",
      updated: "Today",
      source: "Shared",
      statusDisplay: "Under Review",
      version: "v1.0",
    },
  };

  const asset = assets.find((item) => item.id === id) || fallbacks[id];
  if (!asset || !["Analytical Model", "Scenario Reporting"].includes(asset.type)) return;

  const view = document.querySelector("#viewPage");
  if (!view) return;

  const esc = (value) =>
    String(value || "").replace(
      /[&<>\"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
    );
  const analytical = asset.type === "Analytical Model";
  const title = asset.title || asset.analysis_name || "Scenario Reporting";
  const description = asset.description || asset.summary || "";
  const dataSources = asset.dataSources || (asset.connections || []).map((item) => item.name) || [];
  const triggerWhen =
    asset.triggerWhen || "Describe the question patterns that should invoke this scenario.";
  const input = asset.input || "List the key metrics, dimensions, and time grain.";
  const logic = asset.analysisLogic || asset.logic || "Describe the default analysis order.";
  const output = asset.output || "Describe the output template and delivery style.";
  const owner = asset.owner || "Current User";
  const updated = asset.updated || "Just now";

  const chips = (values) =>
    `<div class="bt-tags">${values.map((value) => `<span class="bt-tag">${esc(value)}</span>`).join("") || '<span class="bt-tag bt-tag-muted">None</span>'}</div>`;
  const field = (label, value, full = false) =>
    `<div class="approach-field ${full ? "full" : ""}"><span>${label}</span><div class="approach-readonly">${value}</div></div>`;

  view.innerHTML = `
    <div class="approach-view">
      <nav class="approach-breadcrumb" aria-label="Breadcrumb">
        <a href="../../index.html">Home</a><span>/</span><a href="knowledge.html">AI Interpreter</a><span>/</span><a href="knowledge.html">Knowledge Management</a><span>/</span><a href="knowledge.html?type=${encodeURIComponent(asset.type)}">${asset.type}</a><span>/</span><b>${esc(title)}</b>
      </nav>
      <header class="approach-page-head">
        <h1>${esc(title)}</h1>
        <span class="v20-status">${esc(asset.statusDisplay || "Published")}</span>
      </header>

      <section class="v20-form-card approach-form-card">
        <div class="approach-sections">
          <section class="approach-section">
            <header class="approach-section-head">
              <div>
                <span>01</span>
                <strong>Scenario Overview</strong>
                <small>Title, description, source, and trigger condition</small>
              </div>
            </header>
            <div class="approach-section-body">
              <div class="approach-form-grid">
                ${field("Title", esc(title))}
                ${field("Description", esc(description), true)}
                ${field("Data Sources", chips(dataSources), true)}
                ${field("Trigger When", esc(triggerWhen), true)}
              </div>
            </div>
          </section>

          <section class="approach-section">
            <header class="approach-section-head">
              <div>
                <span>02</span>
                <strong>Analysis Logic</strong>
                <small>Input, logic, output, and governance information</small>
              </div>
            </header>
            <div class="approach-section-body">
              <div class="approach-form-grid">
                ${field("Input", esc(input), true)}
                ${field("Analysis Logic", esc(logic), true)}
                ${field("Output", esc(output), true)}
                ${field("Owner", esc(owner))}
                ${field("Updated", esc(updated))}
              </div>
            </div>
          </section>
        </div>

        <footer class="approach-footer">
          <button type="button" class="v20-secondary" data-approach-action="edit">Edit Scenario</button>
          <button type="button" class="v20-secondary" data-approach-action="versions">View Versions</button>
        </footer>
      </section>
    </div>
  `;

  view.addEventListener("click", (event) => {
    const button = event.target.closest("[data-approach-action]");
    if (!button) return;
    if (button.dataset.approachAction === "edit") {
      location.href = `knowledge-create.html?type=${encodeURIComponent(asset.type)}&mode=edit&id=${encodeURIComponent(asset.id || id)}`;
      return;
    }
    if (button.dataset.approachAction === "versions") {
      const dialog = document.querySelector("#resultDialog");
      document.querySelector("#dialogTitle").textContent = "Version History";
      document.querySelector("#dialogText").textContent =
        "Version comparison is available in this demo view.";
      dialog?.showModal();
    }
  });
})();
