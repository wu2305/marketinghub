(function () {
  const query = new URLSearchParams(location.search);
  if (query.get("type") === "Scenario Reporting") {
    document.body.classList.add("unified-knowledge-create", "scenario-reporting-create");
    document.querySelector(".v20-page-head .v20-status")?.remove();
  }

  const storageKey = "scenario-reporting-records-v1";
  const reportLinks = window.scenarioReportingReports || {
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

  const reportOptions = Object.keys(reportLinks);

  function escapeHtml(value) {
    return String(value || "").replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );
  }

  function currentType() {
    return document.querySelector("#knowledgeType")?.value || "";
  }

  function readStoredRecords() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (_) {
      return {};
    }
  }

  function loadStoredRecord(id) {
    if (!id) return null;
    return readStoredRecords()[id] || null;
  }

  function saveStoredRecord(record) {
    const values = readStoredRecords();
    values[record.id] = record;
    localStorage.setItem(storageKey, JSON.stringify(values));
  }

  function setHeading(isEdit) {
    const title = document.querySelector("#pageTitle");
    const breadcrumb = document.querySelector("#breadcrumbCurrent");
    const description = document.querySelector(".v20-page-head > div > p:last-of-type");
    if (title) title.textContent = isEdit ? "Edit Scenario Reporting" : "Create Scenario Reporting";
    if (breadcrumb)
      breadcrumb.textContent = isEdit ? "Edit Scenario Reporting" : "Create Scenario Reporting";
    if (description) {
      description.textContent =
        "Use a related report, supporting materials, and a structure note to define how this report should be written.";
    }
  }

  function buildReportOptions(selectedReport, selectedHref) {
    const options = reportOptions
      .map((label) => {
        const selected = label === selectedReport || reportLinks[label] === selectedHref;
        return `<option value="${escapeHtml(label)}"${selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
      })
      .join("");
    const custom =
      selectedReport && !reportLinks[selectedReport] && selectedHref
        ? `<option value="${escapeHtml(selectedReport)}" selected>${escapeHtml(selectedReport)}</option>`
        : "";
    return `<option value="">Select a report</option>${custom}${options}`;
  }

  function defaultBlueprintText() {
    return [
      "Describe the report structure, what each section should cover, and any chart, table, or style requirements.",
      "",
      "For example:",
      "1. An executive summary.",
      "2. Show sales and traffic trends by city with a line chart for the reporting period and a bar chart for city comparison. Include a compact table with clear column headers, right-aligned numeric values, and rankings by sales, conversion rate, and traffic.",
      "3. Explain abnormal cities and give action recommendations.",
      "4. Conclusions or recommendations.",
    ].join("\n");
  }

  function blueprintTooltipMarkup() {
    return `<span class="scenario-report-guidance-tooltip-copy">${escapeHtml(defaultBlueprintText())}</span>`;
  }

  function availabilityLabel(enabled) {
    return enabled ? "Enabled" : "Disabled";
  }

  function renderScenarioForm() {
    if (currentType() !== "Scenario Reporting") return;
    const form = document.querySelector("#knowledgeForm");
    const fields = document.querySelector("#typeFields");
    if (!form || !fields) return;

    const mode = query.get("mode") === "edit";
    const recordId = query.get("id") || "";
    const storedRecord = mode && recordId ? loadStoredRecord(recordId) : null;
    let currentId = storedRecord?.id || recordId || "";

    const title = storedRecord?.title || query.get("title") || "";
    const report = storedRecord?.report || query.get("report") || "";
    const reportHref = storedRecord?.reportHref || query.get("reportHref") || "";
    const description = storedRecord?.description || query.get("description") || "";
    const blueprint =
      storedRecord?.structure_guidance ||
      query.get("blueprint") ||
      query.get("logic") ||
      query.get("output") ||
      "";
    const creator = storedRecord?.creator || query.get("creator") || "Current User";
    const attachments =
      storedRecord?.attachments ||
      (query.get("attachments") ? query.get("attachments").split("|").filter(Boolean) : []);
    const aiEnabled =
      typeof storedRecord?.ai_interpreter_enabled === "boolean"
        ? storedRecord.ai_interpreter_enabled
        : query.get("ai_interpreter_enabled") === "true";
    let selectedFiles = [];
    let attachmentItems = attachments.map((name) => ({ kind: "attachment", name }));

    setHeading(mode);

    fields.innerHTML = `
      <section class="v20-scenario-report-form">
        <div class="v20-grid">
          <div class="scenario-report-top-row full">
            <label class="v20-field">
              <span class="v20-label-text">Scenario Reporting Name <span class="v20-required" aria-hidden="true">*</span></span>
              <input id="scenarioReportTitle" name="scenario_report_title" required placeholder="Enter scenario reporting name" value="${escapeHtml(title)}" />
            </label>

            <label class="v20-field scenario-report-linked-field">
              <span class="v20-label-text">Related Report <span class="v20-required" aria-hidden="true">*</span></span>
              <select id="scenarioReportLinked" name="scenario_report_linked" required>
                ${buildReportOptions(report, reportHref)}
              </select>
            </label>
          </div>

          <label class="v20-field full">
            <span class="v20-label-text">Description <span class="v20-required" aria-hidden="true">*</span></span>
            <textarea id="scenarioReportDescription" name="scenario_report_description" rows="4" required placeholder="Describe this scenario report's use case and main purpose, so it is easy to reference later.">${escapeHtml(description)}</textarea>
          </label>

          <label class="v20-field full scenario-report-structure-panel">
            <span class="v20-label-text">Structure &amp; Guidance <span class="v20-required" aria-hidden="true">*</span><span class="scenario-report-guidance-tooltip-wrap"><button class="scenario-report-guidance-tooltip-trigger" type="button" aria-label="Show Structure and Guidance prompt" aria-describedby="scenarioReportBlueprintHelp">?</button><span class="scenario-report-guidance-tooltip" id="scenarioReportBlueprintHelp" role="tooltip">${blueprintTooltipMarkup()}</span></span></span>
            <textarea id="scenarioReportBlueprint" name="scenario_report_blueprint" rows="8" required>${escapeHtml(blueprint)}</textarea>
          </label>

          <div class="v20-field full scenario-report-upload-card" id="scenarioReportUploadCard" role="button" tabindex="0" aria-label="Upload supporting files">
            <input id="scenarioReportFiles" type="file" multiple accept=".doc,.docx,.pdf,.ppt,.pptx,.png,.jpg,.jpeg,.webp" />
            <span>Upload reference</span>
            <small>Show how this scenario reporting should be written. You can upload reports, screenshots, slides, or documents.</small>
            <div class="scenario-report-file-list" id="scenarioReportFileList"></div>
          </div>

          <div class="scenario-report-availability-row full" aria-label="AI Interpreter Status">
            <div class="scenario-report-availability-copy">
              <span class="scenario-report-state-label">AI Interpreter Status</span>
              <p class="scenario-report-availability-note"><span class="scenario-report-note-mark" aria-hidden="true">i</span><span>AI Interpreter Status is enabled automatically when processing reaches Published.</span></p>
            </div>
            <strong id="scenarioReportAiAvailability" class="scenario-report-availability-value" data-availability="${aiEnabled ? "Enabled" : "Disabled"}">${escapeHtml(availabilityLabel(aiEnabled))}</strong>
          </div>

          <input id="scenarioReportCreator" name="scenario_report_creator" type="hidden" value="${escapeHtml(creator || "")}" />
        </div>
      </section>
    `;

    const aiAvailabilityNode = document.querySelector("#scenarioReportAiAvailability");
    const updateStateSummary = (nextEnabled) => {
      if (aiAvailabilityNode) {
        aiAvailabilityNode.textContent = availabilityLabel(nextEnabled);
        aiAvailabilityNode.dataset.availability = nextEnabled ? "Enabled" : "Disabled";
      }
    };
    updateStateSummary(aiEnabled);

    const footerCreator = form.querySelector(".v20-form-footer > span");
    if (footerCreator) footerCreator.hidden = true;

    const footerActions = form.querySelector(".v20-form-footer > div:last-child");
    if (footerActions) {
      footerActions.closest(".v20-form-footer")?.classList.add("scenario-report-footer");
      let cancelButton = footerActions.querySelector("#cancelBtn");
      if (!cancelButton) {
        cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.id = "cancelBtn";
        footerActions.prepend(cancelButton);
      }
      cancelButton.className = "fm-button scenario-report-cancel";
      cancelButton.textContent = "Cancel";
      cancelButton.onclick = () => {
        location.href = "knowledge.html?type=Scenario%20Reporting";
      };

      let saveButton = footerActions.querySelector("#saveBtn");
      if (!saveButton) {
        saveButton = document.createElement("button");
        saveButton.type = "button";
        saveButton.id = "saveBtn";
        footerActions.insertBefore(
          saveButton,
          footerActions.querySelector('button[type="submit"]'),
        );
      }
      saveButton.className = "fm-button scenario-report-save";
      saveButton.textContent = "Save";

      const submitButton = footerActions.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.className = "fm-button primary scenario-report-submit";
        submitButton.textContent = "Submit";
      }
    }

    const footerHintText =
      "Operation reminder: Save keeps this scenario in Draft. Submit sends it to Queued first, then Building.";
    let footerHint = form.querySelector("#scenarioReportFooterHint");
    if (!footerHint) {
      footerHint = document.createElement("p");
      footerHint.id = "scenarioReportFooterHint";
      footerHint.className = "scenario-report-footer-hint";
      footerActions?.insertAdjacentElement("afterend", footerHint);
    }
    footerHint.innerHTML =
      '<span class="scenario-report-note-mark" aria-hidden="true">i</span><span>' +
      footerHintText +
      "</span>";

    const reportSelect = document.querySelector("#scenarioReportLinked");
    const fileInput = document.querySelector("#scenarioReportFiles");
    const fileList = document.querySelector("#scenarioReportFileList");
    const uploadCard = document.querySelector("#scenarioReportUploadCard");
    const blueprintField = document.querySelector("#scenarioReportBlueprint");

    const syncFileInput = () => {
      if (!fileInput) return;
      if (typeof DataTransfer !== "function") return;
      const transfer = new DataTransfer();
      selectedFiles.forEach((file) => transfer.items.add(file));
      fileInput.files = transfer.files;
    };

    const renderCombinedFiles = () => {
      if (!fileList) return;
      const items = [
        ...attachmentItems,
        ...selectedFiles.map((file) => ({ kind: "file", name: file.name })),
      ];
      if (!items.length) {
        fileList.innerHTML = "";
        return;
      }
      fileList.innerHTML = items
        .map(
          (item, index) => `
        <span class="scenario-report-file-pill" data-file-index="${index}" data-file-kind="${item.kind}">
          <span>${escapeHtml(item.name)}</span>
          <button type="button" class="scenario-report-file-remove" aria-label="Remove ${escapeHtml(item.name)}">×</button>
        </span>
      `,
        )
        .join("");
    };

    const refreshFiles = () => {
      syncFileInput();
      renderCombinedFiles();
    };

    if (fileList) {
      renderCombinedFiles();
      fileInput?.addEventListener("change", () => {
        selectedFiles = Array.from(fileInput.files || []);
        refreshFiles();
      });
      fileList.addEventListener("click", (event) => {
        const removeButton = event.target.closest(".scenario-report-file-remove");
        if (!removeButton) return;
        event.preventDefault();
        event.stopPropagation();
        const pill = removeButton.closest(".scenario-report-file-pill");
        const kind = pill?.dataset.fileKind;
        const index = Number(pill?.dataset.fileIndex || -1);
        if (kind === "attachment" && index >= 0) {
          attachmentItems.splice(index, 1);
        } else if (kind === "file" && index >= 0) {
          selectedFiles.splice(index - attachmentItems.length, 1);
        }
        refreshFiles();
      });
    }

    uploadCard?.addEventListener("click", (event) => {
      if (event.target.closest(".scenario-report-file-remove")) return;
      fileInput?.click();
    });
    uploadCard?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput?.click();
      }
    });

    if (blueprintField) {
      blueprintField.placeholder = defaultBlueprintText();
      if (blueprint) blueprintField.value = blueprint;
    }

    if (reportSelect) {
      if (report && !reportLinks[report] && reportHref) {
        const custom = document.createElement("option");
        custom.value = report;
        custom.textContent = report;
        custom.selected = true;
        reportSelect.appendChild(custom);
      }
      if (report) reportSelect.value = report;
    }

    function collectRecord(isSubmit) {
      const values = new FormData(form);
      const titleValue = String(values.get("scenario_report_title") || "").trim();
      const reportValue = String(values.get("scenario_report_linked") || "").trim();
      const reportHrefValue =
        reportLinks[reportValue] || reportHref || storedRecord?.reportHref || "";
      const descriptionValue = String(values.get("scenario_report_description") || "").trim();
      const guidanceValue = String(values.get("scenario_report_blueprint") || "").trim();
      const now = new Date().toLocaleString("en-GB");
      const nextWorkflowStatus = isSubmit ? "Queued" : "Draft";
      const nextEnabled = false;
      const record = {
        ...storedRecord,
        id: currentId || storedRecord?.id || `scenario-report-${crypto.randomUUID()}`,
        type: "Scenario Reporting",
        title: titleValue || storedRecord?.title || "Untitled Scenario Reporting",
        summary: descriptionValue || storedRecord?.summary || "",
        description: descriptionValue,
        report: reportValue,
        reportHref: reportHrefValue,
        structure_guidance: guidanceValue,
        analysisLogic: guidanceValue,
        creator: creator || storedRecord?.creator || "Current User",
        owner: creator || storedRecord?.owner || "Current User",
        attachments: [
          ...attachmentItems.map((item) => item.name),
          ...selectedFiles.map((file) => file.name),
        ],
        workflow_status: nextWorkflowStatus,
        ai_interpreter_enabled: nextEnabled,
        stage: nextWorkflowStatus,
        statusDisplay: nextWorkflowStatus,
        status: nextEnabled ? "Enable" : "Disable",
        updated: now,
        updated_at: now,
        created: storedRecord?.created || storedRecord?.created_at || now,
        created_at: storedRecord?.created_at || storedRecord?.created || now,
        report_name: reportValue,
        report_description: descriptionValue,
      };
      currentId = record.id;
      return record;
    }

    function showDialog(title, text) {
      const dialogTitle = document.querySelector("#dialogTitle");
      const dialogText = document.querySelector("#dialogText");
      const dialog = document.querySelector("#resultDialog");
      if (dialogTitle) dialogTitle.textContent = title;
      if (dialogText) dialogText.textContent = text;
      dialog?.showModal();
    }

    function persist(isSubmit) {
      try {
        const record = collectRecord(isSubmit);
        saveStoredRecord(record);
        updateStateSummary(record.ai_interpreter_enabled);
        location.href = `knowledge.html?type=Scenario%20Reporting&notice=${isSubmit ? "published" : "saved"}`;
      } catch (_) {
        showDialog(
          "Unable to save",
          "Browser storage is unavailable right now. Please allow storage and try again.",
        );
      }
    }

    const saveButton = footerActions?.querySelector("#saveBtn");
    if (saveButton) {
      saveButton.onclick = () => persist(false);
    }
    form.onsubmit = (event) => {
      event.preventDefault();
      persist(true);
    };

    const dialogClose = document.querySelector("#dialogClose");
    if (dialogClose) {
      dialogClose.textContent = "Back to Scenario Reporting";
      dialogClose.onclick = () => {
        location.href = "knowledge.html?type=Scenario%20Reporting";
      };
    }
  }

  function maybeRender() {
    const typeSelect = document.querySelector("#knowledgeType");
    const shouldForceScenario = query.get("type") === "Scenario Reporting";
    if (shouldForceScenario && typeSelect && typeSelect.value !== "Scenario Reporting") {
      typeSelect.value = "Scenario Reporting";
    }
    if (currentType() === "Scenario Reporting") {
      renderScenarioForm();
    }
  }

  document.addEventListener("DOMContentLoaded", maybeRender);
  document.querySelector("#knowledgeType")?.addEventListener("change", maybeRender);
  window.addEventListener("load", maybeRender);

  const style = document.createElement("style");
  style.textContent = `
    .v20-scenario-report-form {
      padding-top: 6px;
    }
    .scenario-report-linked-field {
      min-width: 0;
    }
    .scenario-report-top-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      grid-column: 1 / -1;
    }
    .scenario-report-top-row .v20-field {
      min-width: 0;
    }
    .scenario-report-structure-panel {
      display: flex;
      flex-direction: column;
      gap: 6px;
      grid-column: 1 / -1;
      padding-top: 2px;
      min-width: 0;
      width: 100%;
      align-items: flex-start;
      text-align: left;
    }
    .scenario-report-structure-panel .v20-label-text {
      align-self: flex-start;
      color: #344054;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.35;
      text-align: left;
    }
    .scenario-report-guidance-tooltip-wrap {
      display: inline-flex;
      position: relative;
      margin-left: 6px;
      vertical-align: middle;
    }
    .scenario-report-guidance-tooltip-trigger {
      display: inline-grid;
      width: 16px;
      height: 16px;
      padding: 0;
      place-items: center;
      border: 1px solid #98a2b3;
      border-radius: 50%;
      background: #fff;
      color: #667085;
      font: inherit;
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
      cursor: help;
    }
    .scenario-report-guidance-tooltip-trigger:hover,
    .scenario-report-guidance-tooltip-trigger:focus-visible {
      border-color: #b7791f;
      background: #fff8e8;
      color: #9a5c10;
      outline: none;
    }
    .scenario-report-guidance-tooltip {
      position: absolute;
      z-index: 20;
      top: calc(100% + 8px);
      left: 0;
      display: grid;
      gap: 5px;
      width: min(340px, calc(100vw - 48px));
      padding: 11px 12px;
      border: 1px solid #d8c49b;
      border-radius: 6px;
      background: #fffdf8;
      box-shadow: 0 8px 20px rgba(52, 64, 84, 0.16);
      color: #526176;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.45;
      opacity: 0;
      pointer-events: none;
      transform: translateY(-3px);
      transition: opacity 0.15s ease, transform 0.15s ease;
    }
    .scenario-report-guidance-tooltip-copy { white-space: pre-wrap; }
    .scenario-report-guidance-tooltip-wrap:hover .scenario-report-guidance-tooltip,
    .scenario-report-guidance-tooltip-wrap:focus-within .scenario-report-guidance-tooltip {
      opacity: 1;
      transform: translateY(0);
    }
    .scenario-report-structure-panel textarea {
      min-height: 132px;
      resize: vertical;
      width: 100%;
      box-sizing: border-box;
      text-align: left;
      font-size: 14px;
      line-height: 1.55;
    }
    .scenario-report-structure-panel textarea::placeholder {
      color: #667085;
      font-size: 14px;
      line-height: 1.55;
      opacity: 1;
    }
    .scenario-report-upload-card {
      display: grid;
      gap: 5px;
      padding: 14px 16px;
      border: 1px dashed #cfd7df;
      border-radius: 8px;
      background: #f8fbfd;
      color: #1a1d20;
      cursor: pointer;
      position: relative;
    }
    .scenario-report-upload-card:hover {
      border-color: #b88339;
      background: #fffdf7;
    }
    .scenario-report-upload-card input {
      position: absolute;
      inset: 0;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    }
    .scenario-report-upload-card > span {
      font-size: 13px;
      font-weight: 700;
    }
    .scenario-report-upload-card > small {
      color: #65717d;
      font-size: 12px;
      line-height: 1.4;
    }
    .scenario-report-file-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      min-height: 0;
      padding: 2px 0 0;
      position: relative;
    }
    .scenario-report-file-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 28px;
      padding: 0 8px 0 10px;
      border-radius: 999px;
      background: #eef3f8;
      color: #264055;
      font-size: 12px;
      font-weight: 600;
    }
    .scenario-report-file-remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      padding: 0;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: #6e7a86;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
    }
    .scenario-report-file-remove:hover,
    .scenario-report-file-remove:focus-visible {
      background: rgba(78, 103, 126, 0.12);
      color: #1f2a33;
      outline: 0;
    }
    .scenario-report-state-label {
      color: #344054;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.35;
    }
    .scenario-report-availability-row {
      display: grid;
      gap: 8px;
      grid-column: 1 / -1;
      padding-top: 4px;
      text-align: left;
      min-width: 0;
    }
    .scenario-report-availability-copy {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      min-width: 0;
    }
    .scenario-report-availability-note {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      color: #667085;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.45;
      max-width: none;
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
    .scenario-report-availability-value {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      min-height: 28px;
      padding: 0 12px;
      border-radius: 999px;
      background: #eef2f6;
      color: #44505c;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.2;
      white-space: nowrap;
    }
    .scenario-report-availability-value[data-availability="Enabled"] {
      background: #fff4df;
      color: #8c5622;
    }
    .scenario-report-availability-value[data-availability="Disabled"] {
      background: #eef2f6;
      color: #5f6975;
    }
    .scenario-report-footer {
      flex-wrap: wrap;
      gap: 10px;
      align-items: flex-start;
      border-top: 1px solid #eceef2;
      margin-top: 28px;
      padding-top: 22px;
    }
    .scenario-report-footer-hint {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      flex: 1 0 100%;
      margin: 0;
      color: #667085;
      font-size: 12px;
      line-height: 1.45;
    }
    .scenario-report-save,
    .scenario-report-submit {
      min-width: 0;
    }
  `;
  document.head.appendChild(style);
})();




