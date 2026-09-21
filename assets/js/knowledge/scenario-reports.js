(function () {
  const storageKey = "scenario-reporting-records-v1";
  const library = document.querySelector("#businessKnowledgeLibrary");
  if (!library) return;

  const esc = (value) =>
    String(value || "").replace(
      /[&<>\"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
    );
  const detailScrim = document.querySelector("#detailScrim");
  const detailDrawer = document.querySelector("#knowledgeDetail");
  const detailClose = document.querySelector("#detailClose");
  const detailContent = document.querySelector("#detailContent");
  const detailEmpty = document.querySelector("#detailEmpty");
  const detailHeadLabel = detailDrawer?.querySelector(".detail-drawer-head > div > span");
  const detailHeadTitle = detailDrawer?.querySelector(".detail-drawer-head > div > strong");
  let drawerBody = detailDrawer?.querySelector("[data-scenario-detail-body]") || null;
  const actionIcons = {
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L12 14l-4 1 1-4 7.5-7.5z"/></svg>',
    delete:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>',
    enable:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>',
    disable:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/></svg>',
  };
  const section = document.createElement("section");
  section.id = "scenarioReportOverview";
  section.hidden = true;
  library.querySelector(".library-toolbar")?.insertAdjacentElement("afterend", section);

  const reportCatalog = {
    "Invest City Strategy Analysis": "../pages/reports.html?project=city&dashboard=0",
    "City Analysis Dashboard": "../pages/reports.html?project=city&dashboard=1",
    "4P Executive Overview": "../pages/reports.html?project=fourp&dashboard=0",
    "Promotion Lift Analysis": "../pages/reports.html?project=fourp&dashboard=1",
    "Customer Daily Pulse": "../pages/reports.html?project=customer&dashboard=0",
    "Customer Funnel Watch": "../pages/reports.html?project=customer&dashboard=1",
    "Audience Build Overview": "../pages/reports.html?project=abo&dashboard=0",
    "Campaign Quality Watch": "../pages/reports.html?project=abo&dashboard=1",
    "Rednote Media Tracking": "../pages/reports.html?project=rednote&dashboard=0",
    "Creative Quality Monitor": "../pages/reports.html?project=rednote&dashboard=1",
    "OTT / OLV Exposure Tracking": "../pages/reports.html?project=ottolv&dashboard=0",
    "Source Integrity Monitor": "../pages/reports.html?project=ottolv&dashboard=1",
  };
  const list = (value) =>
    Array.isArray(value)
      ? value
      : String(value || "")
          .split(";")
          .map((item) => item.trim())
          .filter(Boolean);
  function readStoredRecords() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (_) {
      return {};
    }
  }
  function writeStoredRecord(record) {
    try {
      const values = readStoredRecords();
      values[record.id] = record;
      localStorage.setItem(storageKey, JSON.stringify(values));
    } catch (_) {}
  }
  function deleteStoredRecord(id) {
    try {
      const values = readStoredRecords();
      values[id] = { deleted: true };
      localStorage.setItem(storageKey, JSON.stringify(values));
    } catch (_) {}
  }
  function workflowStatus(value, fallback = "Draft") {
    const candidate = String(value || "").trim();
    if (["Draft", "Queued", "Building", "Published"].includes(candidate)) return candidate;
    if (/queued/i.test(candidate)) return "Queued";
    if (/build|develop|processing|review/i.test(candidate)) return "Building";
    if (/ready|live|published|calibrate/i.test(candidate)) return "Published";
    return fallback;
  }
  function normalizeScenarioRecord(asset) {
    const report = asset.report || asset.report_name || "";
    const workflow = workflowStatus(
      asset.workflow_status || asset.stage || asset.statusDisplay || asset.status,
      asset.published ? "Published" : "Draft",
    );
    const enabled =
      typeof asset.ai_interpreter_enabled === "boolean"
        ? asset.ai_interpreter_enabled
        : asset.status === "Enable" ||
          asset.statusDisplay === "Published" ||
          (workflow === "Published" && asset.disabled !== true);
    const description = asset.description || asset.summary || "";
    const structureGuidance = asset.structure_guidance || asset.analysisLogic || asset.output || "";
    const attachments = Array.isArray(asset.attachments)
      ? asset.attachments
      : list(asset.attachments);
    return {
      ...asset,
      id: asset.id || `scenario-report-${crypto.randomUUID()}`,
      type: "Scenario Reporting",
      title: asset.title || asset.name || "Untitled Scenario Reporting",
      description,
      summary: asset.summary || description,
      report,
      reportHref: asset.reportHref || reportCatalog[report] || "",
      creator: asset.creator || asset.owner || "Current User",
      owner: asset.owner || asset.creator || "Current User",
      updated: asset.updated || asset.update || "Not recorded",
      workflow_status: workflow,
      ai_interpreter_enabled: Boolean(enabled),
      status: Boolean(enabled) ? "Enable" : "Disable",
      stage: workflow,
      statusDisplay: workflow,
      structure_guidance: structureGuidance,
      analysisLogic: structureGuidance,
      attachments,
      created: asset.created || asset.created_at || "Not recorded",
      created_at: asset.created_at || asset.created || "Not recorded",
    };
  }
  const baseRecords = [
    {
      id: "scenario-channel-performance",
      title: "Channel Performance Analysis",
      description:
        "A reusable reporting scenario for channel efficiency, drivers, and recommendation-style summaries.",
      report: "Invest City Strategy Analysis",
      reportHref: "../pages/reports.html?project=city&dashboard=0",
      creator: "Emily Wang",
      owner: "Emily Wang",
      updated: "Sep 3, 2026",
      workflow_status: "Building",
      ai_interpreter_enabled: false,
      structure_guidance:
        "1. Open with the main conclusion and the key business change.\n2. Break down the movement by city, channel, and period.\n3. Explain exceptions and the most likely drivers.\n4. End with actions, ownership, and timing.",
      attachments: ["City strategy briefing"],
    },
    {
      id: "scenario-campaign-review",
      title: "Campaign Review Reporting",
      description:
        "A structured reporting scenario that reviews delivery, engagement, conversion, and return.",
      report: "Campaign Quality Watch",
      reportHref: "../pages/reports.html?project=abo&dashboard=1",
      creator: "Marco Li",
      owner: "Marco Li",
      updated: "Aug 31, 2026",
      workflow_status: "Published",
      ai_interpreter_enabled: true,
      structure_guidance:
        "1. Summarize delivery and performance.\n2. Identify abnormal campaigns or channels.\n3. Explain changes by mix, spend, and conversion.\n4. Highlight actions for the next cycle.",
      attachments: ["Campaign review template", "Reference screenshot"],
    },
    {
      id: "scenario-channel-exceptions",
      title: "Channel Exception Watch",
      description:
        "A short-form scenario for monitoring channel anomalies, queue state and release readiness.",
      report: "Source Integrity Monitor",
      reportHref: "../pages/reports.html?project=ottolv&dashboard=1",
      creator: "Sophie Chen",
      owner: "Sophie Chen",
      updated: "Sep 1, 2026",
      workflow_status: "Queued",
      ai_interpreter_enabled: false,
      structure_guidance:
        "1. Check the current queue status.\n2. Surface rule breaches and blocked items.\n3. Separate release blockers from normal fluctuations.\n4. List the items that need follow-up.",
      attachments: ["Exception checklist"],
    },
  ];
  const records = baseRecords.map(normalizeScenarioRecord);
  Object.entries(readStoredRecords()).forEach(([id, value]) => {
    const index = records.findIndex((item) => item.id === id);
    if (value && value.deleted) {
      if (index >= 0) records.splice(index, 1);
      return;
    }
    const normalized = normalizeScenarioRecord({ ...value, id });
    if (index >= 0) Object.assign(records[index], normalized);
    else records.push(normalized);
  });
  window.scenarioReportingRecords = records;
  window.scenarioReportingReports = reportCatalog;

  const tags = (values) =>
    `<div class="bt-tags">${values.map((value) => `<span class="bt-tag">${esc(value)}</span>`).join("")}</div>`;
  const isOwn = (item) => (item.creator || item.owner) === "Current User";
  const actions = (item) =>
    ["edit", "delete", "disable"]
      .map((action) => {
        const owner = isOwn(item);
        const disabled = !item.ai_interpreter_enabled;
        const permissionBlocked = !owner;
        const statusBlocked = (disabled && action === "disable") || (!disabled && action !== "disable");
        const blocked = permissionBlocked || statusBlocked;
        const label = action[0].toUpperCase() + action.slice(1);
        const permissionMessage = "Knowledge created by others cannot be operated.";
        const disabledMessage = "This knowledge is already disabled.";
        const statusTitle = disabled && action === "disable" ? "Already disabled" : "Disable knowledge first";
        const tooltip = permissionBlocked
          ? permissionMessage
          : disabled && action === "disable"
            ? disabledMessage
            : "";
        return `<button class="fm-button fm-icon-action ${action === "delete" ? "danger" : ""} ${blocked ? "is-action-disabled" : ""}" type="button" title="${permissionBlocked ? permissionMessage : blocked ? statusTitle : label}" aria-disabled="${blocked ? "true" : "false"}" aria-label="${label} ${esc(item.title)}" data-sr-action="${action}" data-sr-target="${esc(item.id)}" ${tooltip ? `data-action-disabled="${esc(tooltip)}"` : ""} ${blocked ? "disabled" : ""}>${actionIcons[action]}</button>`;
      })
      .join("");
  function dialog(title, message, onConfirm) {
    if (!onConfirm && /knowledge (disabled|deleted)/i.test(title)) {
      window.showKnowledgeSuccessToast?.(title === "Knowledge deleted" ? "Deleted successfully" : "Disabled successfully");
      return;
    }
    const modal = document.createElement("dialog");
    const blocked = /disable knowledge first/i.test(title);
    const isDelete = /delete/i.test(title);
    const isDisabled = /disable/i.test(title);
    const isConfirm = Boolean(onConfirm);
    const icon = '<span class="knowledge-confirm-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4m0 4h.01"/><path d="M10.3 3.6 2.5 17.1A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.9L13.7 3.6a2 2 0 0 0-3.4 0Z"/></svg></span>';
    modal.className = `fm-dialog${isConfirm ? " knowledge-confirm-dialog" : ""}`;
    modal.innerHTML = isConfirm
      ? `<div class="knowledge-confirm-main">${icon}<div><h3>${blocked ? "Please disable the knowledge first" : "Confirm Operation"}</h3><p>${blocked ? message : isDelete ? "Please confirm whether to delete this knowledge. Deletion cannot be undone." : isDisabled ? "Please confirm whether to disable this knowledge." : message}</p></div></div><footer><button type="button" class="fm-button" data-close>Cancel</button><button type="button" class="fm-button primary" data-confirm>${blocked ? "Disable" : isDelete ? "Confirm Delete" : isDisabled ? "Confirm Disable" : "Confirm"}</button></footer>`
      : `<h3>${esc(title)}</h3><p>${esc(message)}</p><footer><button type="button" class="fm-button" data-close>Close</button></footer>`;
    document.body.append(modal);
    modal.querySelector("[data-close]").onclick = () => modal.close();
    modal.querySelector("[data-confirm]")?.addEventListener("click", () => {
      modal.close();
      onConfirm();
    });
    modal.addEventListener("close", () => modal.remove());
    modal.showModal();
  }
  let activeScenarioId = null;
  let activeWorkflowFilter = "";
  let activeAvailabilityFilter = "";
  let activeSearch = "";
  let page = 1;
  let pageSize = 10;

  function ensureDrawerBody() {
    if (!detailDrawer) return null;
    if (drawerBody && drawerBody.isConnected) return drawerBody;
    drawerBody = document.createElement("div");
    drawerBody.setAttribute("data-scenario-detail-body", "true");
    drawerBody.className = "scenario-report-drawer-body";
    if (detailContent) detailContent.hidden = true;
    const mountPoint = detailEmpty?.parentNode === detailDrawer ? detailEmpty : null;
    if (mountPoint) {
      detailDrawer.insertBefore(drawerBody, mountPoint);
    } else {
      detailDrawer.appendChild(drawerBody);
    }
    return drawerBody;
  }

  function currentScenario(id) {
    return records.find((record) => record.id === id) || null;
  }

  function renderScenarioDetail(item) {
    const body = ensureDrawerBody();
    if (!body || !item) return;
    body.innerHTML = `
      <div class="scenario-report-detail">

        <section class="scenario-report-section">
          <h3>Related Report</h3>
          ${item.reportHref ? `<a class="scenario-report-link" href="${esc(item.reportHref)}">${esc(item.report || "—")}</a>` : `<p>${esc(item.report || "—")}</p>`}
        </section>

        <section class="scenario-report-section">
          <h3>Description</h3>
          <p>${esc(item.description || "—")}</p>
        </section>

        <section class="scenario-report-section">
          <h3>Structure &amp; Guidance</h3>
          <p class="scenario-report-prewrap">${esc(item.structure_guidance || item.analysisLogic || "—")}</p>
        </section>

        <section class="scenario-report-section">
          <h3>Supporting Files</h3>
          ${item.attachments?.length ? tags(item.attachments) : `<p>—</p>`}
        </section>
        ${!item.ai_interpreter_enabled && item.workflow_status !== "Published" ? `<p class="scenario-report-workflow-note"><span class="scenario-report-note-mark" aria-hidden="true">i</span><span>AI Interpreter is enabled automatically when Processing Status becomes Published.</span></p>` : ""}
        <dl class="scenario-report-detail-meta scenario-report-detail-meta-footer">
          <div>
            <dt>Created By</dt>
            <dd>${esc(item.creator || item.owner || "—")}</dd>
          </div>
          <div>
            <dt>Created At</dt>
            <dd>${esc(item.created_at || item.created || "—")}</dd>
          </div>
          <div>
            <dt>Updated At</dt>
            <dd>${esc(item.updated || item.update || item.updated_at || "—")}</dd>
          </div>
        </dl>
      </div>
    `;
  }

  function syncScenarioDetailHeader(item) {
    if (detailHeadLabel) detailHeadLabel.textContent = "SCENARIO REPORTING";
    if (detailHeadTitle) detailHeadTitle.textContent = item.title;
    const headInfo = detailHeadLabel?.parentElement;
    let titleLine = headInfo?.querySelector(".scenario-title-line");
    if (!titleLine && detailHeadTitle) {
      titleLine = document.createElement("div");
      titleLine.className = "scenario-title-line";
      detailHeadTitle.replaceWith(titleLine);
      titleLine.append(detailHeadTitle);
    }
    if (titleLine) {
      let availability = titleLine.querySelector(".scenario-title-status");
      if (!availability) {
        availability = document.createElement("span");
        availability.className = "scenario-title-status";
        titleLine.append(availability);
      }
      const enabled = Boolean(item.ai_interpreter_enabled);
      availability.textContent = enabled ? "Enabled" : "Disabled";
      availability.dataset.status = enabled ? "enabled" : "disabled";

      let workflow =
        titleLine.querySelector(".scenario-header-status") ||
        detailDrawer?.querySelector(".scenario-header-status");
      if (!workflow) {
        workflow = document.createElement("span");
        workflow.className = "scenario-header-status";
      }
      workflow.textContent = item.workflow_status;
      workflow.dataset.flowStatus = item.workflow_status;
      titleLine.append(workflow);
    }
  }

  function openDetail(item) {
    if (!detailDrawer || !detailScrim) return;
    activeScenarioId = item.id;
    renderScenarioDetail(item);
    ensureDrawerBody();
    syncScenarioDetailHeader(item);
    const drawerHead = detailDrawer.querySelector(".detail-drawer-head");
    let headActions = drawerHead?.querySelector(".scenario-head-actions");
    if (drawerHead && detailClose && !headActions) {
      headActions = document.createElement("div");
      headActions.className = "scenario-head-actions";
      detailClose.replaceWith(headActions);
      headActions.append(detailClose);
    }
    let drawerActions = detailDrawer.querySelector(".scenario-drawer-actions");
    if (!drawerActions) {
      drawerActions = document.createElement("div");
      drawerActions.className = "scenario-drawer-actions";
      detailDrawer.append(drawerActions);
      drawerActions.addEventListener("click", (event) => {
        const control = event.target.closest("[data-sr-action]");
        if (!control || control.disabled) return;
        const overviewControl = section.querySelector(
          `[data-sr-action="${control.dataset.srAction}"][data-sr-target="${control.dataset.srTarget}"]`,
        );
        overviewControl?.click();
      });
    }
    // Keep drawer controls fully aligned with the overview: permissions, state gates, labels and tooltips.
    drawerActions.innerHTML = `<div class="fm-actions">${actions(item)}</div>`;
    if (detailEmpty) detailEmpty.hidden = true;
    detailScrim.hidden = false;
    detailDrawer.classList.add("open");
    detailDrawer.classList.add("scenario-report-detail-mode");
    detailDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("knowledge-detail-open");
  }

  function closeDetail() {
    if (!detailDrawer || !detailScrim) return;
    if (!detailDrawer.classList.contains("open")) return;
    detailDrawer.classList.remove("open");
    detailDrawer.classList.remove("scenario-report-detail-mode");
    detailDrawer.setAttribute("aria-hidden", "true");
    detailScrim.hidden = true;
    document.body.classList.remove("knowledge-detail-open");
    activeScenarioId = null;
    if (drawerBody) {
      drawerBody.remove();
      drawerBody = null;
    }
    detailDrawer.querySelector(".scenario-drawer-actions")?.remove();
    if (detailContent) detailContent.hidden = false;
  }

  function render() {
    const active = new URLSearchParams(location.search).get("type") === "Scenario Reporting";
    const workflowFilter = activeWorkflowFilter;
    const availabilityFilter = activeAvailabilityFilter;
    const query = [activeSearch, document.querySelector("#knowledgeSearch")?.value || ""]
      .join(" ")
      .trim()
      .toLowerCase();
    const rows = records.filter((item) => {
      if (item.workflow_status === "Draft" && !isOwn(item)) return false;
      const matchesQuery = [
        item.title,
        item.description,
        item.report,
        item.creator,
        item.workflow_status,
        item.structure_guidance,
        item.attachments?.join(" ") || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
      const matchesWorkflow = !workflowFilter || item.workflow_status === workflowFilter;
      const matchesAvailability =
        !availabilityFilter ||
        (availabilityFilter === "Enabled"
          ? item.ai_interpreter_enabled
          : !item.ai_interpreter_enabled);
      return matchesQuery && matchesWorkflow && matchesAvailability;
    });
    const total = Math.max(1, Math.ceil(rows.length / pageSize));
    page = Math.min(page, total);
    const visibleRows = rows.slice((page - 1) * pageSize, page * pageSize);

    section.innerHTML = `
      <div class="scenario-report-toolbar">
        <label class="type-filter scenario-report-filter">
          <span>Status</span>
          <select id="scenarioAvailabilityFilter">
            <option value="">All statuses</option>
            <option ${availabilityFilter === "Enabled" ? "selected" : ""}>Enabled</option>
            <option ${availabilityFilter === "Disabled" ? "selected" : ""}>Disabled</option>
          </select>
        </label>
        <label class="type-filter scenario-report-filter">
          <span>Process</span>
          <select id="scenarioWorkflowFilter">
            <option value="">All statuses</option>
            <option ${workflowFilter === "Draft" ? "selected" : ""}>Draft</option>
            <option ${workflowFilter === "Queued" ? "selected" : ""}>Queued</option>
            <option ${workflowFilter === "Building" ? "selected" : ""}>Building</option>
            <option ${workflowFilter === "Published" ? "selected" : ""}>Published</option>
          </select>
        </label>
        <label class="search-field library-search library-search-top scenario-report-search overview-global-search">
          <span class="sr-only">Search knowledge</span>
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
          <input id="scenarioReportSearch" type="search" placeholder="Search knowledge..." autocomplete="off" />
        </label>
        <a class="knowledge-add-button" href="knowledge-create.html?type=Scenario%20Reporting" target="_blank" rel="noopener"><span aria-hidden="true">＋</span>Add Scenario reporting</a>
      </div>
      <div class="fm-overview-countline" aria-live="polite">Showing <strong>${rows.length}</strong> of <strong>${records.length}</strong> scenarios</div>
      <div class="bt-table-wrap">
        ${
          rows.length
            ? `<div class="scenario-report-card-list">
                ${visibleRows
                  .map(
                    (item) => `
                  <article class="scenario-report-card" data-sr-id="${esc(item.id)}" tabindex="0">
                    <div class="scenario-report-card-main">
                      <h3>${esc(item.title)}</h3>
                      <p title="${esc(item.description)}">${esc(item.description)}</p>
                      <div class="scenario-report-card-meta">
                        <span>Report</span>
                        ${item.reportHref ? `<a class="scenario-report-link" href="${esc(item.reportHref)}">${esc(item.report || "—")}</a>` : `<strong>${esc(item.report || "—")}</strong>`}
                      </div>
                      <div class="scenario-report-card-meta">
                        <span>Creator</span>
                        <strong>${esc(item.creator)}</strong>
                      </div>
                      <div class="scenario-report-card-meta scenario-report-process">
                        <span>Process</span>
                        <strong class="bt-flow-status" data-flow-status="${esc(item.workflow_status)}">${esc(item.workflow_status)}</strong>
                      </div>
                    </div>
                    <div class="scenario-report-card-pills">
                      <span class="fm-state ${item.ai_interpreter_enabled ? "" : "off"}">${item.ai_interpreter_enabled ? "Enabled" : "Disabled"}</span>
                    </div>
                    <div class="scenario-report-card-actions">
                      <div class="fm-actions">
                        ${actions(item)}
                      </div>
                    </div>
                  </article>
                `,
                  )
                  .join("")}
              </div>`
            : '<div class="bt-empty">No matching records</div>'
        }
      </div>
      <footer class="fm-pagination scenario-report-pagination"><span>${rows.length} records</span><div><label>Rows per page <select data-sr-page-size aria-label="Rows per page">${[5, 10, 20].map((n) => `<option ${n === pageSize ? "selected" : ""}>${n}</option>`).join("")}</select></label><button class="fm-button" data-sr-page="previous" ${page === 1 ? "disabled" : ""}>Previous</button><span>${page} / ${total}</span><button class="fm-button" data-sr-page="next" ${page === total ? "disabled" : ""}>Next</button></div></footer>
    `;
    if (activeScenarioId) {
      const activeItem = currentScenario(activeScenarioId);
      if (activeItem) {
        renderScenarioDetail(activeItem);
        syncScenarioDetailHeader(activeItem);
      } else {
        closeDetail();
      }
    }
  }

  function sync() {
    const active = new URLSearchParams(location.search).get("type") === "Scenario Reporting";
    section.hidden = !active;
    [".asset-table-head", "#principlesCardGrid", "#assetList", "#businessPagination"].forEach(
      (selector) => {
        const element = library.querySelector(selector);
        if (element) element.hidden = active;
      },
    );
    ["#statusMultiFilter", "#subjectDomainFilter"].forEach((selector) => {
      const element = library.querySelector(selector);
      if (element) element.hidden = active;
    });
    if (active) render();
    /* Deep link support: knowledge.html?type=Scenario%20Reporting&detail=<id>
       opens that scenario reporting's detail drawer, then the param is stripped
       from the URL so a refresh or back-navigation does not re-trigger it. */
    if (!active) return;
    const url = new URL(location.href);
    const detail = url.searchParams.get("detail");
    if (!detail) return;
    url.searchParams.delete("detail");
    history.replaceState({}, "", url);
    const item = currentScenario(detail);
    if (item) openDetail(item);
  }

  document.addEventListener("knowledge:typechange", sync);
  const style = document.createElement("style");
  style.textContent = `
    .scenario-report-filter-bar {
      display: none;
    }
    .scenario-report-toolbar {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: 12px;
      padding: 10px 18px 14px;
      width: 100%;
      margin: 0;
      overflow-x: auto;
      box-sizing: border-box;
      min-height: 54px;
    }
    .scenario-report-toolbar .scenario-report-filter {
      flex: 0 0 auto;
      width: auto;
      max-width: none;
      min-width: 0;
      padding-top: 0;
    }
    .scenario-report-toolbar .scenario-report-filter > span {
      color: #74808a;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 1.15;
      flex: 0 0 auto;
    }
    .scenario-report-toolbar .scenario-report-filter select {
      width: 130px;
      min-width: 130px;
      height: 32px;
      padding: 0 22px 0 8px;
      border: 1px solid #d8e0e6;
      border-radius: 6px;
      background: #fff;
      color: #3f4c55;
      font-size: 10px;
    }
    .scenario-report-toolbar .scenario-report-filter select option {
      font-size: 10px;
    }
    .scenario-report-toolbar .scenario-report-search {
      margin-left: auto !important;
      margin-right: 0 !important;
      flex: 0 0 180px !important;
      width: 180px !important;
      max-width: 180px !important;
      min-width: 180px !important;
      height: 32px !important;
      border: 1px solid #d8e0e6;
      border-radius: 6px;
      background: #fff;
      align-items: center;
      padding: 0 8px;
      box-sizing: border-box;
      display: flex;
      gap: 8px;
    }
    .scenario-report-toolbar .scenario-report-search input {
      width: 100%;
      border: 0;
      background: transparent;
      font: inherit;
      font-size: 12px;
      color: #3f4c55;
      outline: none;
      min-width: 0;
    }
    .scenario-report-toolbar .scenario-report-search input::placeholder {
      font-size: 10px;
    }
    #scenarioReportOverview input[type="checkbox"] {
      width: 9px;
      height: 9px;
    }
    .scenario-report-toolbar .scenario-report-search .search-icon {
      width: 14px;
      height: 14px;
      flex: 0 0 auto;
      color: #7b8794;
    }
    #scenarioReportOverview .bt-table-wrap {
      overflow: visible;
    }
    .scenario-report-card-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: stretch;
      gap: 12px;
      padding: 18px;
      border-top: 1px solid #e3e8ed;
      background: #f8fafc;
    }
    .scenario-report-card {
      position: relative;
      display: grid;
      min-height: 156px;
      grid-template-columns: minmax(0, 1fr) 96px;
      column-gap: 18px;
      padding: 18px;
      border: 1px solid #d9e1e8;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 8px 22px rgba(31, 41, 55, 0.04);
      color: #2f3a45;
      outline: 0;
      transition:
        border-color 160ms ease,
        box-shadow 160ms ease,
        transform 160ms ease;
    }
    .scenario-report-card:hover,
    .scenario-report-card:focus-visible {
      transform: translateY(-2px);
      border-color: #d9aa63;
      box-shadow:
        0 14px 28px rgba(31, 41, 55, 0.08),
        0 0 0 3px rgba(217, 170, 99, 0.12);
    }
    .scenario-report-card-main {
      grid-column: 1;
      min-width: 0;
    }
    .scenario-report-card h3 {
      margin: 0;
      color: #202932;
      font-size: 14px;
      line-height: 1.3;
      font-weight: 750;
    }
    .scenario-report-card p {
      margin: 10px 0 0;
      color: #536170;
      font-size: 12px;
      line-height: 1.65;
    }
    .scenario-report-card-meta {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-top: 10px;
      color: #536170;
      font-size: 11px;
      line-height: 1.3;
    }
    .scenario-report-card-meta > span {
      color: #7d8790;
      font-weight: 700;
    }
    .scenario-report-card-meta > strong {
      color: #536170;
      font-weight: 500;
    }
    .scenario-report-card-pills {
      position: absolute;
      top: 18px;
      right: 18px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      max-width: 116px;
    }
    .scenario-report-card-pills .bt-flow-status,
    .scenario-report-process .bt-flow-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 24px;
      padding: 0 10px;
      border-radius: 999px;
      background: #eef2f6 !important;
      color: #536170 !important;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.25;
      white-space: nowrap;
    }
    .scenario-report-card-pills .bt-flow-status[data-flow-status="Published"],
    .scenario-report-process .bt-flow-status[data-flow-status="Published"] {
      background: #e7f6ed !important;
      color: #0f9f5d !important;
    }
    .scenario-report-card-pills .bt-flow-status[data-flow-status="Building"],
    .scenario-report-process .bt-flow-status[data-flow-status="Building"] {
      background: #fff2d8 !important;
      color: #9f6b24 !important;
    }
    .scenario-report-card-pills .bt-flow-status[data-flow-status="Queued"],
    .scenario-report-process .bt-flow-status[data-flow-status="Queued"] {
      background: #eef2f6 !important;
      color: #667085 !important;
    }
    .scenario-report-card-pills .bt-flow-status[data-flow-status="Draft"],
    .scenario-report-process .bt-flow-status[data-flow-status="Draft"] {
      background: #f4f0ff !important;
      color: #6941c6 !important;
    }
    .scenario-report-card-pills .fm-state {
      min-height: 24px;
      padding: 0 10px;
      font-size: 11px;
      font-weight: 500;
    }
    .scenario-report-card-actions {
      grid-column: 2;
      align-self: end;
      justify-self: end;
    }
    .scenario-report-card-actions .fm-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .scenario-report-card-actions .fm-button.fm-icon-action {
      border-color: transparent !important;
      background: transparent !important;
      color: #c8892b !important;
    }
    .scenario-report-card-actions .fm-button.fm-icon-action svg {
      stroke: #c8892b !important;
    }
    .scenario-report-card-actions .fm-button.fm-icon-action:hover:not(.is-action-disabled):not([aria-disabled="true"]),
    .scenario-report-card-actions .fm-button.fm-icon-action:focus-visible:not(.is-action-disabled):not([aria-disabled="true"]) {
      background: #fff6e8 !important;
      box-shadow: none !important;
    }
    .scenario-report-card-actions .fm-button.fm-icon-action.is-action-disabled,
    .scenario-report-card-actions .fm-button.fm-icon-action[aria-disabled="true"],
    .scenario-report-card-actions .fm-button.fm-icon-action:disabled {
      color: #aeb7c1 !important;
      cursor: not-allowed;
    }
    .scenario-report-card-actions .fm-button.fm-icon-action.is-action-disabled svg,
    .scenario-report-card-actions .fm-button.fm-icon-action[aria-disabled="true"] svg,
    .scenario-report-card-actions .fm-button.fm-icon-action:disabled svg {
      stroke: #aeb7c1 !important;
    }
    @media (max-width: 900px) {
      .scenario-report-card-list {
        grid-template-columns: 1fr;
      }
    }
    .bt-table-scenario th:nth-child(4),
    .bt-table-scenario td:nth-child(4) {
      width: 150px;
      max-width: 150px;
      white-space: nowrap;
    }
    .bt-table-scenario th:nth-child(5),
    .bt-table-scenario td:nth-child(5) {
      width: 150px;
      max-width: 150px;
      white-space: nowrap;
    }
    .bt-table-scenario th:nth-child(6),
    .bt-table-scenario td:nth-child(6) {
      width: 122px;
      max-width: 122px;
      white-space: nowrap;
    }
    .bt-table-scenario {
      border-top: 0;
    }
    .bt-table-scenario th:nth-child(4),
    .bt-table-scenario th:nth-child(5),
    .bt-table-scenario th:nth-child(6) {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bt-table-scenario th:nth-child(2),
    .bt-table-scenario td:nth-child(2) {
      width: 220px;
      max-width: 220px;
    }
    .bt-table-scenario th:nth-child(4) {
      overflow: visible;
      text-overflow: clip;
    }
    .bt-table-scenario {
      width: 1170px;
      min-width: 1170px;
      table-layout: fixed;
    }
    .bt-table-scenario th:nth-child(1),
    .bt-table-scenario td:nth-child(1) {
      width: 200px;
      max-width: 200px;
    }
    .bt-table-scenario th:nth-child(2),
    .bt-table-scenario td:nth-child(2) {
      width: 220px;
      max-width: 220px;
    }
    .bt-table-scenario th:nth-child(3),
    .bt-table-scenario td:nth-child(3) {
      width: 180px;
      max-width: 180px;
    }
    .bt-table-scenario th:nth-child(4),
    .bt-table-scenario td:nth-child(4) {
      width: 150px;
      max-width: 150px;
    }
    .bt-table-scenario th:nth-child(5),
    .bt-table-scenario td:nth-child(5) {
      width: 180px;
      max-width: 180px;
    }
    .bt-table-scenario th:nth-child(6),
    .bt-table-scenario td:nth-child(6) {
      width: 120px;
      max-width: 120px;
    }
    .bt-table-scenario th:nth-child(7),
    .bt-table-scenario td:nth-child(7) {
      width: 120px;
      max-width: 120px;
    }
    #scenarioReportOverview .bt-table-scenario {
      width: 1100px;
      min-width: 1100px;
      table-layout: fixed;
    }
    #scenarioReportOverview .bt-table-scenario th:nth-child(1),
    #scenarioReportOverview .bt-table-scenario td:nth-child(1) {
      width: 180px;
      max-width: 180px;
    }
    #scenarioReportOverview .bt-table-scenario th:nth-child(2),
    #scenarioReportOverview .bt-table-scenario td:nth-child(2) {
      width: 200px;
      max-width: 200px;
    }
    #scenarioReportOverview .bt-table-scenario th:nth-child(3),
    #scenarioReportOverview .bt-table-scenario td:nth-child(3) {
      width: 160px;
      max-width: 160px;
    }
    #scenarioReportOverview .bt-table-scenario th:nth-child(4),
    #scenarioReportOverview .bt-table-scenario td:nth-child(4) {
      width: 150px;
      max-width: 150px;
      white-space: nowrap;
    }
    #scenarioReportOverview .bt-table-scenario th:nth-child(5),
    #scenarioReportOverview .bt-table-scenario td:nth-child(5) {
      width: 170px;
      max-width: 170px;
      white-space: nowrap;
    }
    #scenarioReportOverview .bt-table-scenario th:nth-child(6),
    #scenarioReportOverview .bt-table-scenario td:nth-child(6) {
      width: 110px;
      max-width: 110px;
      white-space: nowrap;
    }
    #scenarioReportOverview .bt-table-scenario th:nth-child(7),
    #scenarioReportOverview .bt-table-scenario td:nth-child(7) {
      width: 100px;
      max-width: 100px;
    }
    #scenarioReportOverview .bt-table-scenario th:nth-child(4) {
      overflow: visible;
      text-overflow: clip;
    }
    .bt-table-scenario .bt-flow-status {
      display: inline;
      min-width: 0;
      padding: 0;
      border-radius: 0;
      background: transparent !important;
      color: #344054 !important;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.45;
      white-space: nowrap;
    }
    .bt-table-scenario .bt-flow-status[data-flow-status="Queued"],
    .bt-table-scenario .bt-flow-status[data-flow-status="Building"],
    .bt-table-scenario .bt-flow-status[data-flow-status="Published"],
    .bt-table-scenario .bt-flow-status[data-flow-status="Draft"] {
      background: transparent !important;
      color: #344054 !important;
    }
    .scenario-report-link {
      color: #184a8c;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .scenario-report-link:hover,
    .scenario-report-link:focus-visible {
      color: #12386b;
    }
    .scenario-report-workflow-note {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin: 10px 0 0;
      color: #667085;
      font-size: 12px;
      line-height: 1.45;
    }
    .scenario-report-note-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      margin-top: 1px;
      border: 1px solid #cbd3df;
      border-radius: 999px;
      color: #7b8794;
      font-size: 9px;
      font-weight: 700;
      line-height: 1;
      flex: 0 0 auto;
    }

  `;
  document.head.appendChild(style);
  document.querySelector("#knowledgeSearch")?.addEventListener("input", () => {
    if (!section.hidden) {
      page = 1;
      render();
    }
  });
  section.addEventListener("input", (event) => {
    if (event.target.id === "scenarioReportSearch") {
      activeSearch = event.target.value;
      page = 1;
      render();
    }
  });
  document.querySelector("#statusMultiFilter")?.addEventListener("change", () => {
    if (!section.hidden) render();
  });
  section.addEventListener("change", (event) => {
    if (
      event.target.id === "scenarioWorkflowFilter" ||
      event.target.id === "scenarioAvailabilityFilter"
    ) {
      activeWorkflowFilter = section.querySelector("#scenarioWorkflowFilter")?.value || "";
      activeAvailabilityFilter = section.querySelector("#scenarioAvailabilityFilter")?.value || "";
      page = 1;
      render();
    }
    if (event.target.matches("[data-sr-page-size]")) {
      pageSize = Number(event.target.value);
      page = 1;
      render();
    }
  });
  section.addEventListener("click", (event) => {
    const pager = event.target.closest("[data-sr-page]");
    if (pager && !pager.disabled) {
      page += pager.dataset.srPage === "next" ? 1 : -1;
      render();
      return;
    }
    const action = event.target.closest("[data-sr-action]");
    if (action) {
      const item = records.find((record) => record.id === action.dataset.srTarget);
      event.preventDefault();
      event.stopPropagation();
      if (!item) return;
      const operation = action.dataset.srAction;
      if (!isOwn(item)) {
        dialog(
          "Permission denied",
          "Knowledge created by others cannot be operated.",
        );
        return;
      }
      if (["edit", "delete"].includes(operation) && item.ai_interpreter_enabled) {
        dialog(
          "Disable knowledge first",
          "To edit or delete this knowledge, disable it first. Once disabled, users cannot access it temporarily.",
          () => {
            item.ai_interpreter_enabled = false;
            item.status = "Disable";
            writeStoredRecord(item);
            render();
            if (activeScenarioId === item.id) openDetail(item);
          },
        );
        return;
      }
      if (operation === "edit") {
        const editUrl = new URL("knowledge-create.html", location.href);
        editUrl.searchParams.set("type", "Scenario Reporting");
        editUrl.searchParams.set("mode", "edit");
        editUrl.searchParams.set("id", item.id);
        editUrl.searchParams.set("title", item.title || "");
        editUrl.searchParams.set("report", item.report || "");
        editUrl.searchParams.set("reportHref", item.reportHref || "");
        editUrl.searchParams.set("description", item.description || "");
        editUrl.searchParams.set("blueprint", item.structure_guidance || item.analysisLogic || "");
        editUrl.searchParams.set("workflow_status", item.workflow_status || "");
        editUrl.searchParams.set(
          "ai_interpreter_enabled",
          String(Boolean(item.ai_interpreter_enabled)),
        );
        editUrl.searchParams.set("attachments", (item.attachments || []).join("|"));
        editUrl.searchParams.set("creator", item.creator || "");
        location.href = editUrl.toString();
        return;
      }
      if (operation === "delete") {
        dialog("Delete knowledge?", `Delete “${item.title}”? This action cannot be undone.`, () => {
          const index = records.findIndex((record) => record.id === item.id);
          if (index > -1) records.splice(index, 1);
          deleteStoredRecord(item.id);
          if (activeScenarioId === item.id) closeDetail();
          render();
          dialog("Knowledge deleted", `“${item.title}” has been deleted.`);
        });
        return;
      }
      if (operation === "disable") {
        if (!item.ai_interpreter_enabled) {
          dialog("Knowledge already disabled", "This knowledge is already disabled.");
          return;
        }
        dialog(
          "Disable knowledge?",
          `Disable “${item.title}”? It will no longer be available for AI use.`,
          () => {
            item.ai_interpreter_enabled = false;
            item.status = "Disable";
            writeStoredRecord(item);
            render();
            if (activeScenarioId === item.id) openDetail(item);
            dialog("Knowledge disabled", `“${item.title}” has been disabled.`);
          },
        );
      }
      return;
    }
    const row = event.target.closest("[data-sr-id]");
    if (row) {
      if (event.target.closest("a")) return;
      const item = currentScenario(row.dataset.srId);
      if (item) openDetail(item);
    }
  });

  detailClose?.addEventListener("click", closeDetail);
  detailScrim?.addEventListener("click", closeDetail);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDetail();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey) return;
    Object.entries(readStoredRecords()).forEach(([id, value]) => {
      const index = records.findIndex((item) => item.id === id);
      if (value && value.deleted) {
        if (index >= 0) records.splice(index, 1);
        return;
      }
      const normalized = normalizeScenarioRecord({ ...value, id });
      if (index >= 0) Object.assign(records[index], normalized);
      else records.push(normalized);
    });
    render();
  });

  window.setTimeout(sync, 100);
})();









