(function () {
  const params = new URLSearchParams(location.search);
  const assets = window.marketingKnowledgeAssets || [];
  const asset = assets.find((item) => item.id === params.get("id"));
  const view = document.querySelector("#viewPage");
  if (!asset || asset.type !== "Report Context" || !view) return;

  const escapeHtml = (value) =>
    String(value || "").replace(
      /[&<>"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
    );
  const projectNames = {
    city: "City Strategy",
    fourp: "4P Report",
    customer: "Customer Daily Tracking",
    abo: "ABO",
    rednote: "Rednote Tracking",
    ottolv: "OTTOLV",
  };
  const reports = (asset.connections || [])
    .filter((item) => item.kind === "Report" || item.kind === "Dashboard")
    .map((item) => item.name);
  const datasets = ["Marketing DW", "Campaign Performance"];
  const parameterSources = asset.projects?.includes("customer")
    ? ["Customer 360"]
    : ["Marketing DW", "Campaign Performance"];
  const domains = asset.projects?.includes("customer") ? ["C360"] : ["Marketing"];
  const feedback = [];
  const chips = (items) =>
    items.map((item) => `<span class="principles-chip">${escapeHtml(item)}</span>`).join("");

  const oldBreadcrumb = document.querySelector(".v20-view-title-breadcrumb");
  if (oldBreadcrumb) oldBreadcrumb.hidden = true;
  view.innerHTML = `
    <div class="principles-view report-context-view">
      <nav class="principles-breadcrumb" aria-label="Breadcrumb"><a href="../../index.html">Home</a><span>/</span><a href="knowledge.html">AI Interpreter</a><span>/</span><a href="knowledge.html">Knowledge Management</a><span>/</span><a href="knowledge.html?type=Report%20Context">Report Context</a><span>/</span><b>${escapeHtml(asset.title)}</b></nav>
      <header class="principles-page-head"><h1>${escapeHtml(asset.title)}</h1><button class="principles-version-btn" id="reportViewVersions" type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 109-9 9.4 9.4 0 00-6.4 2.6L3 8M3 3v5h5M12 7v5l3 2"/></svg>View Versions</button></header>
      <div class="principles-modules">
        <section class="principles-module" data-report-module hidden>
          <div class="principles-module-head"><div class="principles-module-title">Details</div><button class="principles-module-toggle" type="button" aria-label="Collapse Details" aria-expanded="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15l6-6 6 6"/></svg></button></div>
          <div class="principles-module-body"><div class="principles-fields">
            <div class="principles-field wide"><label>Dashboard Description</label><textarea readonly tabindex="-1">${escapeHtml(asset.summary)}</textarea></div>
            <div class="principles-field wide"><label>Enable AI Overview</label><div class="principles-switch-row"><span class="principles-switch on" aria-hidden="true"></span><span>Enabled</span></div></div>
            <div class="principles-field wide"><label>AI Overview Description</label><textarea readonly tabindex="-1">${escapeHtml((asset.aiUse || []).join(" "))}</textarea></div>
            <div class="principles-field wide"><label>AI Overview Parameter Sources</label><div class="principles-readonly-box">${chips(parameterSources)}</div></div>
            <div class="principles-field"><label>Applicable Business Domain</label><div class="principles-readonly-box">${chips(domains)}</div></div>
            <div class="principles-field"><label>Applicable Reports</label><div class="principles-readonly-box">${chips(reports.length ? reports : (asset.projects || []).map((item) => projectNames[item]).filter(Boolean))}</div></div>
            <div class="principles-field wide"><label>Related Datasets</label><div class="principles-readonly-box">${chips(datasets)}</div></div>
            <div class="principles-field wide"><label>Enable Knowledge</label><div class="principles-switch-row"><span class="principles-switch ${asset.isDisabled ? "" : "on"}" aria-hidden="true"></span><span>${asset.isDisabled ? "Disabled" : "Enabled"}</span></div></div>
          </div></div>
        </section>
        <section class="principles-module" data-report-module>
          <div class="principles-module-head"><div class="principles-module-title">Feedback &amp; Processing</div><div class="feedback-head-actions"><button class="principles-primary" id="reportAddFeedback" type="button">Add Feedback</button><button class="principles-module-toggle" type="button" aria-label="Collapse Feedback and Processing" aria-expanded="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15l6-6 6 6"/></svg></button></div></div>
          <div class="principles-module-body" id="reportFeedbackBody"></div>
        </section>
      </div>
    </div>`;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="principles-scrim" id="reportVersionScrim" hidden></div><aside class="principles-version-panel" id="reportVersionPanel" aria-hidden="true" aria-label="Version history"><header class="principles-panel-head"><div><span>VERSION HISTORY</span><strong>View Versions</strong></div><button class="principles-icon-btn" id="reportVersionClose" type="button" aria-label="Close version history">&times;</button></header><div class="principles-version-list" id="reportVersionList"></div></aside>
    <div class="principles-scrim" id="reportFeedbackScrim" hidden></div><section class="principles-modal" id="reportFeedbackModal" role="dialog" aria-modal="true" aria-labelledby="reportFeedbackTitle" hidden><header class="principles-modal-head"><h2 id="reportFeedbackTitle">Add Feedback</h2><button class="principles-icon-btn" id="reportFeedbackClose" type="button" aria-label="Close feedback dialog">&times;</button></header><div class="principles-modal-body"><div class="principles-toolbar" aria-label="Text formatting"><button type="button" data-report-command="bold" aria-label="Bold"><b>B</b></button><button type="button" data-report-command="italic" aria-label="Italic"><i>I</i></button><button type="button" data-report-command="insertUnorderedList" aria-label="Bulleted list">&#8226; List</button></div><div class="principles-editor" id="reportFeedbackEditor" contenteditable="true" role="textbox" aria-multiline="true"></div></div><footer class="principles-modal-foot"><button class="principles-secondary" id="reportFeedbackCancel" type="button">Cancel</button><button class="principles-primary" id="reportFeedbackSubmit" type="button">Submit</button></footer></section>`,
  );

  const feedbackBody = document.querySelector("#reportFeedbackBody");
  const modal = document.querySelector("#reportFeedbackModal");
  const feedbackScrim = document.querySelector("#reportFeedbackScrim");
  const editor = document.querySelector("#reportFeedbackEditor");
  const versionPanel = document.querySelector("#reportVersionPanel");
  const versionScrim = document.querySelector("#reportVersionScrim");
  const renderFeedback = () => {
    feedbackBody.innerHTML = feedback.length
      ? `<table class="principles-feedback-table"><thead><tr><th>Feedback</th><th>Submitted By</th><th>Submitted At</th><th>Status</th><th>Processing Result</th></tr></thead><tbody>${feedback.map((item) => `<tr><td>${item.content}</td><td>Business User</td><td>${item.time}</td><td><span class="principles-status">Submitted</span></td><td>—</td></tr>`).join("")}</tbody></table>`
      : `<div class="principles-feedback-empty">No feedback or processing records yet.</div>`;
  };
  const closeFeedback = () => {
    modal.hidden = true;
    feedbackScrim.hidden = true;
  };
  const closeVersions = () => {
    versionPanel.classList.remove("open");
    versionPanel.setAttribute("aria-hidden", "true");
    versionScrim.hidden = true;
  };
  document.querySelectorAll("[data-report-module]").forEach((module) =>
    module.querySelector(".principles-module-toggle").addEventListener("click", () => {
      const collapsed = module.classList.toggle("collapsed");
      module
        .querySelector(".principles-module-toggle")
        .setAttribute("aria-expanded", String(!collapsed));
    }),
  );
  document
    .querySelectorAll(
      ".report-context-view .principles-field input[readonly], .report-context-view .principles-field textarea[readonly], .report-context-view .principles-readonly-box, .report-context-view .principles-switch-row",
    )
    .forEach((element) => element.addEventListener("mousedown", (event) => event.preventDefault()));
  document.querySelector("#reportAddFeedback").addEventListener("click", () => {
    feedbackScrim.hidden = false;
    modal.hidden = false;
    editor.innerHTML = "";
    editor.focus();
  });
  document.querySelectorAll("[data-report-command]").forEach((button) =>
    button.addEventListener("click", () => {
      document.execCommand(button.dataset.reportCommand, false);
      editor.focus();
    }),
  );
  document.querySelector("#reportFeedbackSubmit").addEventListener("click", () => {
    if (!editor.textContent.trim()) return editor.focus();
    feedback.unshift({
      content: escapeHtml(editor.textContent.trim()),
      time: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    });
    renderFeedback();
    closeFeedback();
  });
  ["#reportFeedbackClose", "#reportFeedbackCancel"].forEach((selector) =>
    document.querySelector(selector).addEventListener("click", closeFeedback),
  );
  feedbackScrim.addEventListener("click", closeFeedback);
  const versions = [
    {
      number: "v3.0",
      label: "Current Version",
      editor: asset.owner,
      date: asset.updated,
      description: "Refined report scope and AI overview guidance.",
      current: true,
    },
    {
      number: "v2.1",
      label: "Published",
      editor: "Data Governance",
      date: "Jul 24, 2026",
      description: "Updated parameter sources and applicable reports.",
    },
    {
      number: "v1.0",
      label: "Published",
      editor: asset.owner,
      date: asset.created,
      description: "Initial approved report context.",
    },
  ];
  document.querySelector("#reportVersionList").innerHTML = versions
    .map(
      (version) =>
        `<article class="principles-version-item ${version.current ? "current" : ""}"><div class="principles-version-number">${version.number}</div><div class="principles-version-meta"><strong>${version.label}</strong><span>${escapeHtml(version.editor)} · ${escapeHtml(version.date)}</span><p>${escapeHtml(version.description)}</p></div></article>`,
    )
    .join("");
  document.querySelector("#reportViewVersions").addEventListener("click", () => {
    versionScrim.hidden = false;
    versionPanel.classList.add("open");
    versionPanel.setAttribute("aria-hidden", "false");
  });
  document.querySelector("#reportVersionClose").addEventListener("click", closeVersions);
  versionScrim.addEventListener("click", closeVersions);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeFeedback();
      closeVersions();
    }
  });
  renderFeedback();
})();
