(function () {
  const library = document.querySelector("#businessKnowledgeLibrary");
  if (!library) return;
  const section = document.createElement("section");
  section.id = "emailReportsOverview";
  section.className = "er-overview";
  section.hidden = true;
  library.querySelector(".library-toolbar").insertAdjacentElement("afterend", section);
  const esc = (v) =>
    String(v || "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const reports = () =>
    (window.marketingKnowledgeAssets || []).filter((x) => x.type === "Email Reports");
  function render() {
    const q = (document.querySelector("#knowledgeSearch")?.value || "").toLowerCase();
    const items = reports().filter((x) =>
      [x.title, x.emailSubject, x.recipients, x.relatedReport].join(" ").toLowerCase().includes(q),
    );
    section.innerHTML = `<div class="er-table-wrap"><table class="er-table"><thead><tr><th>Report Name</th><th>Email Subject</th><th>Recipients</th><th>Schedule</th><th>Content Sections</th><th>Related Report</th><th>Status</th><th>Last Sent</th><th>Updated</th><th>Actions</th></tr></thead><tbody>${items
      .map(
        (x) =>
          `<tr data-er-id="${esc(x.id)}"><td>${esc(x.title)}</td><td class="er-subject" title="${esc(x.emailSubject)}">${esc(x.emailSubject)}</td><td>${esc(x.recipients)}</td><td>${esc(x.schedule)}</td><td><div class="er-sections">${x.sections
            .split(", ")
            .map((s) => `<span class="er-chip">${esc(s)}</span>`)
            .join(
              "",
            )}</div></td><td>${esc(x.relatedReport)}</td><td><span class="er-status ${x.status === "Disable" ? "paused" : ""}">${esc(x.status === "Enable" ? "Enabled" : x.status === "Disable" ? "Disabled" : x.status)}</span></td><td>${esc(x.lastSent)}</td><td>${esc(x.updated)}</td><td><button class="er-view-button" data-er-view="${esc(x.id)}" type="button" aria-label="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/></svg></button></td></tr>`,
      )
      .join(
        "",
      )}</tbody></table></div><div class="er-pagination"><span>${items.length} reports</span><span>Rows per page&nbsp;&nbsp;10&nbsp;&nbsp; 1</span></div>`;
  }
  function sync() {
    const active = new URLSearchParams(location.search).get("type") === "Email Reports";
    section.hidden = !active;
    [".asset-table-head", "#principlesCardGrid", "#assetList", "#businessPagination"].forEach(
      (s) => {
        const el = library.querySelector(s);
        if (el) el.hidden = active;
      },
    );
    if (active) render();
  }
  document.addEventListener("knowledge:typechange", sync);
  document.querySelector("#knowledgeSearch")?.addEventListener("input", () => {
    if (!section.hidden) render();
  });
  section.addEventListener("click", (e) => {
    const row = e.target.closest("[data-er-id]");
    if (row)
      window.open(
        `knowledge-view.html?id=${encodeURIComponent(row.dataset.erId)}`,
        "_blank",
        "noopener,noreferrer",
      );
  });
  window.setTimeout(sync, 100);
})();
