(function () {
  const params = new URLSearchParams(location.search);
  const assets = window.marketingKnowledgeAssets || [];
  const view = document.querySelector("#viewPage");
  if (!view) return;

  const esc = (value) =>
    String(value || "").replace(
      /[&<>\"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
    );
  const id = params.get("id") || "";
  const records = {
    "business-term-gmv": {
      title: "GMV (Gross Merchandise Value)",
      description: "Total value of merchandise sold through the platform before deductions.",
      synonyms: ["Gross Sales", "Merchandise Value", "Gross Merchandise Sales"],
      scope: ["Commerce", "Revenue Dashboard", "Sales Performance"],
      owner: "Chris Martinez",
      department: "Marketing Analytics",
      version: "v2.3",
      updated: "Jul 26, 2026",
      status: "Published",
      relatedAssets: [
        ["Marketing DW", "orders", "gross_merchandise_value", "Published"],
        ["Commerce DW", "transactions", "order_value", "Published"],
        ["Revenue Dashboard", "Sales Performance", "Metric Coverage", "Published"],
      ],
    },
    "business-term-paid-customer": {
      title: "Paid Customer",
      description:
        "A customer who completed at least one valid paid order during the selected period.",
      synonyms: ["Paying Customer", "Converted Customer"],
      scope: ["Customer", "Customer 360", "Conversion Overview"],
      owner: "Sarah Chen",
      department: "Customer Operations",
      version: "v2.0",
      updated: "Aug 30, 2026",
      status: "Published",
      relatedAssets: [
        ["Customer DW", "customer", "customer_id", "Published"],
        ["Commerce DW", "orders", "paid_at", "Published"],
      ],
    },
    "business-term-active-member": {
      title: "Active Member",
      description:
        "A registered member with a qualified visit or transaction in the reporting period.",
      synonyms: ["Engaged Member"],
      scope: ["Customer", "Member Performance"],
      owner: "Emily Wang",
      department: "CRM Operations",
      version: "v1.4",
      updated: "Sep 1, 2026",
      status: "Published",
      relatedAssets: [["Customer DW", "member_activity", "member_id", "Published"]],
    },
    "global-synonym-revenue": {
      title: "Revenue",
      description: "Global aliases used to recognize governed revenue-related questions.",
      synonyms: ["Sales", "Turnover", "Income"],
      scope: ["Global", "All reports"],
      owner: "Data Governance",
      department: "Data Office",
      version: "v1.2",
      updated: "Sep 1, 2026",
      status: "Published",
      relatedAssets: [],
    },
    "global-synonym-customer": {
      title: "Customer",
      description: "Global aliases for customers and purchasing members.",
      synonyms: ["Buyer", "Shopper", "Client"],
      scope: ["Global", "All reports"],
      owner: "Data Governance",
      department: "Data Office",
      version: "v1.1",
      updated: "Aug 29, 2026",
      status: "Published",
      relatedAssets: [],
    },
    "global-synonym-campaign": {
      title: "Campaign",
      description: "Global aliases for marketing campaign activities.",
      synonyms: ["Promotion", "Activation"],
      scope: ["Global", "All reports"],
      owner: "Data Governance",
      department: "Data Office",
      version: "v1.0",
      updated: "Aug 25, 2026",
      status: "Published",
      relatedAssets: [],
    },
  };

  const asset =
    assets.find((item) => item.id === id) || records[id] || records["business-term-gmv"];
  const title = asset.title || asset.name || "Business Term";
  const description = asset.description || asset.summary || "";
  const synonyms = asset.synonyms || asset.metric_aliases || asset.tags || [];
  const scope = asset.scope || asset.business_domain || asset.reports || asset.projects || [];
  const relatedAssets =
    asset.relatedAssets ||
    asset.fields?.map((field) => [field[0], field[1], field[2], "Published"]) ||
    [];

  const tags = (items) =>
    `<div class="bt-tags">${items.map((item) => `<span class="bt-tag">${esc(item)}</span>`).join("") || '<span class="bt-tag bt-tag-muted">None</span>'}</div>`;
  const scopeTags = (items) =>
    `<div class="bt-scope-tags">${items.map((item) => `<span class="bt-scope-tag">${esc(item)}</span>`).join("") || '<span class="bt-scope-tag bt-scope-tag-muted">Global</span>'}</div>`;
  const field = (label, value, extra = "") =>
    `<div class="bt-field ${extra}"><label>${label}</label><div class="bt-readonly ${extra}">${value}</div></div>`;

  document.querySelector(".v20-view-title-breadcrumb")?.setAttribute("hidden", "");
  view.innerHTML = `
    <div class="bt-view">
      <div class="bt-view-path">
        <a href="../../index.html">Home</a><span>/</span><a href="knowledge.html">AI Interpreter</a><span>/</span><a href="knowledge.html">Knowledge Management</a><span>/</span><a href="knowledge.html?type=Business%20Term">Business Term</a><span>/</span><b>${esc(title)}</b>
      </div>
      <header class="bt-page-head">
        <h1>${esc(title)}</h1>
        <button class="bt-version-btn" id="btViewVersions" type="button">View Versions</button>
      </header>
      <div class="bt-sections">
        <section class="bt-section">
          <header class="bt-section-head">
            <div class="bt-section-title">
              <span class="bt-number">1</span>
              <strong>Basic Definition</strong>
              <small>Unified business concept and interpretation</small>
            </div>
          </header>
          <div class="bt-section-body">
            <div class="bt-basic-grid">
              ${field("Title", esc(title))}
              ${field("Description", esc(description), "span-2")}
              ${field("Synonyms", tags(synonyms), "span-2")}
              ${field("Business Domain / Report", scopeTags(scope), "span-2")}
              ${field("Status", `<span class="bt-status">${esc(asset.status || "Published")}</span>`)}
              ${field("Version", esc(asset.version || "v1.0"))}
            </div>
          </div>
        </section>

        <section class="bt-section">
          <header class="bt-section-head">
            <div class="bt-section-title">
              <span class="bt-number">2</span>
              <strong>Related Data Assets</strong>
              <small>Fields, datasets, and report links in one list</small>
            </div>
          </header>
          <div class="bt-section-body">
            <div class="bt-related bt-related-merged">
              <table class="bt-related-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Table / Report</th>
                    <th>Item</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    relatedAssets.length
                      ? relatedAssets
                          .map(
                            (row) => `
                    <tr>
                      <td>${esc(row[0])}</td>
                      <td>${esc(row[1])}</td>
                      <td>${esc(row[2])}</td>
                      <td><span class="bt-status">${esc(row[3] || "Published")}</span></td>
                    </tr>
                  `,
                          )
                          .join("")
                      : '<tr><td colspan="4">No related data assets</td></tr>'
                  }
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="bt-section">
          <header class="bt-section-head">
            <div class="bt-section-title">
              <span class="bt-number">3</span>
              <strong>Governance Information</strong>
              <small>Ownership, review and usage scope</small>
            </div>
          </header>
          <div class="bt-section-body">
            <div class="bt-governance">
              ${field("Owner", esc(asset.owner || "Current User"))}
              ${field("Reviewer", "Marketing Governance")}
              ${field("Department", esc(asset.department || "Data Office"))}
              ${field("Status", `<span class="bt-status">${esc(asset.status || "Published")}</span>`)}
              ${field("Current Version", esc(asset.version || "v1.0"))}
              ${field("Updated", esc(asset.updated || "Just now"))}
            </div>
          </div>
        </section>
      </div>

      <div class="bt-view-actions">
        <button type="button" class="primary" data-bt-view-action="edit">Edit</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="principles-scrim" id="btVersionScrim" hidden></div>
    <aside class="principles-version-panel" id="btVersionPanel" aria-hidden="true">
      <header class="principles-panel-head">
        <div><span>VERSION HISTORY</span><strong>View Versions</strong></div>
        <button class="principles-icon-btn" id="btVersionClose" type="button">&times;</button>
      </header>
      <div class="principles-version-list">
        <article class="principles-version-item current">
          <div class="principles-version-number">${esc(asset.version || "v1.0")}</div>
          <div class="principles-version-meta">
            <strong>Current Version</strong>
            <span>${esc(asset.owner || "Current User")} · ${esc(asset.updated || "Just now")}</span>
            <p>Updated definition and governed references.</p>
          </div>
        </article>
        <article class="principles-version-item">
          <div class="principles-version-number">v1.0</div>
          <div class="principles-version-meta">
            <strong>Published</strong>
            <span>${esc(asset.owner || "Current User")} · Mar 12, 2026</span>
            <p>Initial approved definition.</p>
          </div>
        </article>
      </div>
    </aside>
  `,
  );

  const panel = document.querySelector("#btVersionPanel");
  const scrim = document.querySelector("#btVersionScrim");
  const close = () => {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    scrim.hidden = true;
  };

  document.querySelector("#btViewVersions").onclick = () => {
    scrim.hidden = false;
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
  };
  document.querySelector("#btVersionClose").onclick = close;
  scrim.onclick = close;

  view.addEventListener("click", (event) => {
    const button = event.target.closest("[data-bt-view-action]");
    if (!button) return;
    if (button.dataset.btViewAction === "edit") {
      location.href = `knowledge-create.html?mode=edit&id=${encodeURIComponent(asset.id || id)}`;
    }
  });
})();
