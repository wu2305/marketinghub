(function () {
  const data = window.knowledgeFieldMapping,
    query = new URLSearchParams(location.search);
  if (!data) return;
  const existing = data.records("Analytical Model").find((x) => x.id === query.get("id"));
  if (query.get("type") !== "Analytical Model" && !existing) return;
  document.body.classList.add("unified-knowledge-create", "analytical-model-create");
  const main = document.querySelector("main.v20-shell");
  if (!main) return;
  const header = document.querySelector(".site-header");
  if (header) {
    const links = header.querySelector(".nav-links");
    if (links)
      links.innerHTML =
        '<a href="../../index.html#home" class="nav-link">Home</a><a href="reports.html" class="nav-link">Marketing Cockpit</a><a href="flexible.html" class="nav-link">Self-Service Center</a><a href="knowledge.html" class="nav-link" aria-current="page">AI Interpreter</a><a href="campaign.html" class="nav-link">RedNote Campaign Tool</a>';
    const brand = header.querySelector(".brand-mark");
    if (brand) brand.href = "../../index.html#home";
  }
  const positionForm = () => {
    main.style.paddingTop =
      (header && getComputedStyle(header).position === "fixed"
        ? header.getBoundingClientRect().height
        : 0) +
      28 +
      "px";
  };
  positionForm();
  if (header) new ResizeObserver(positionForm).observe(header);
  const editing = query.get("mode") === "edit",
    esc = data.escape;
  const record = existing
    ? JSON.parse(JSON.stringify(existing))
    : {
        id: "",
        type: "Analytical Model",
        analysis_name: "",
        visibility_scope: "Personal",
        trigger_when: "",
        aliases: [],
        trigger_keywords: [],
        business_domain: [],
        applicable_scenarios: "",
        analysis_steps: [""],
        referenced_metrics: [],
        recommended_dimensions: [],
        analysis_constraints: "",
        output_requirements: "",
        status: "Disable",
        references: [],
        connections: [],
      };
  const title = editing ? "Edit Analysis" : "Create Analysis";
  main.innerHTML = `<div class="fm-editor"><nav class="fm-breadcrumb" aria-label="Breadcrumb"><a href="../../index.html">Home</a><span>/</span><a href="knowledge.html">AI Interpreter</a><span>/</span><a href="knowledge.html">Knowledge Management</a><span>/</span><a href="knowledge.html?type=Analytical%20Model">Analytical Model</a><span>/</span><span>${esc(editing ? record.analysis_name || title : title)}</span></nav><header class="fm-editor-head"><div><p class="fm-editor-eyebrow">KNOWLEDGE MANAGEMENT</p><h1>${title}</h1><p>Describe a reusable analysis framework.</p></div></header><form id="fmAnalysisForm"></form></div>`;
  const form = main.querySelector("form");
  main.querySelector(".fm-breadcrumb a").href = "../../index.html#home";
  if (editing && (!existing || existing.created_by !== "Current User")) {
    form.innerHTML =
      '<p class="fm-feedback">This analysis is unavailable or you do not have permission to edit it. Return to Analytical Model to select another record.</p>';
    return;
  }
  const requiredLabel = (label) => label.replace(" *", ' <i class="unified-required" aria-hidden="true">*</i>');
  const field = (key, label, hint, rows = 0) => {
    if (key === "output_requirements") {
      const guidance = hint.split("\n").filter((line) => line.trim()).join("\n");
      return `<div class="fm-field full fm-analysis-logic-field"><div class="fm-multi-label"><label for="fmAnalysisLogic">${requiredLabel(label)}</label><span class="fm-metric-help fm-analysis-logic-help"><button type="button" class="fm-metric-help-trigger" aria-label="About Analysis Logic" aria-describedby="fmAnalysisLogicHelp">?</button><span class="fm-metric-help-tooltip" id="fmAnalysisLogicHelp" role="tooltip">${esc(guidance)}</span></span></div><textarea id="fmAnalysisLogic" name="${key}" rows="${rows}" placeholder="${esc(guidance)}" aria-describedby="fmAnalysisLogicHelp">${esc(record[key] || "")}</textarea></div>`;
    }
    return `<label class="fm-field full"><span>${requiredLabel(label)}</span>${rows ? `<textarea name="${key}" rows="${rows}" placeholder="${esc(hint)}">${esc(record[key] || "")}</textarea>` : `<input name="${key}" value="${esc(record[key] || "")}" placeholder="${esc(hint)}">`}</label>`;
  };
  const group = (_name, content) => `<div class="fm-section fm-flat-fields"><div class="fm-grid">${content}</div></div>`;
  const multi = (id, label, helper) => `<div class="fm-field"><div class="fm-multi-label"><span id="${id}Label">${requiredLabel(label)}</span>${id === "fmMetrics" ? `<span class="fm-metric-help"><button type="button" class="fm-metric-help-trigger" aria-label="About Referenced Metrics" aria-describedby="${id}Help">?</button><span class="fm-metric-help-tooltip" id="${id}Help" role="tooltip">${esc(helper)}</span></span>` : ""}</div><div class="v20-multi" id="${id}"><button type="button" class="v20-multi-display" aria-labelledby="${id}Label" ${id === "fmMetrics" ? `aria-describedby="${id}Help"` : ""} aria-expanded="false" aria-controls="${id}Menu"></button><div class="v20-multi-menu" id="${id}Menu" hidden></div></div></div>`;
  const metricRecords = data.records("Metric Dictionary").filter((metric) => metric.metric_name);
  record.business_domain = data.list(record.business_domain);
  record.referenced_metrics = data.list(record.referenced_metrics);
  const domainOptions = [...new Set(["Marketing", ...Object.values(data.domains), ...metricRecords.flatMap((metric) => data.list(metric.business_domain)), ...record.business_domain])];
  form.innerHTML =
    group("Basic Information",
      field("analysis_name", "Analysis Name *", 'Name this reusable analysis model, e.g. “Revenue Drop Analysis” or “Campaign Performance Review”.') +
      field("applicable_scenarios", "Description", "Briefly describe the business purpose, the decision this analysis supports, and the type of insight users should expect.", 3)) +
    group("Business Scope",
      multi("fmDomains", "Business Domain *", "Select one or more business domains this analysis model applies to.") +
      multi("fmMetrics", "Referenced Metrics", "Only metrics from your selected business domains are shown.")) +
    group("Applicable Scenarios",
      field("trigger_when", "Trigger When *", 'Describe when to use this analysis, e.g. "Why did revenue drop?" or "What caused conversion to decline?"', 3)) +
    group("Analysis Method",
      field("output_requirements", "Analysis Logic *", "Describe the analysis method, including comparison logic, calculation rules, reasoning path, and expected output.\n\nFor example：\n- Identify the key change or anomaly\n- Compare performance using methods such as WoW, MoM, YoY, target gap, or benchmark comparison\n- Break down the result by key dimensions\n- Find major contributors or drivers\n- Follow required calculation or business rules\n- Summarize the final insight, root cause, impact, and recommended next checks", 8)) +
    group("Notes & Guardrails",
      field("analysis_constraints", "Notes & Guardrails", "Note any data limitations, unsupported analyses, or conclusions AI should avoid.", 3)) +
    '<footer class="fm-editor-footer"><div><button class="fm-button" type="button" id="fmCancel">Cancel</button><button class="fm-button" type="button" id="fmSave">Save Draft</button><button class="fm-button primary" type="submit">Publish &amp; Enable</button></div></footer><p class="knowledge-operation-reminder"><span aria-hidden="true">i</span><span>Save a draft to continue editing later. Publish to enable this analysis model for AI use and make it available to all authorized users.</span></p><p class="fm-feedback" id="fmFormFeedback" role="status" aria-live="polite"></p>';
  form.noValidate = true;
  const requiredFields = [
    ["analysis_name", "Analysis name is required."],
    ["business_domain", "At least one business domain is required."],
    ["trigger_when", "Trigger condition is required."],
    ["output_requirements", "Analysis logic is required."],
  ].map(([key, message]) => ({ key, message, control: key === "business_domain" ? form.querySelector("#fmDomains button") : form.querySelector(`[name="${key}"]`) }));
  function setError(item, missing) {
    const field = item.control.closest(".fm-field");
    field.classList.toggle("is-invalid", missing);
    item.control.setAttribute("aria-invalid", String(missing));
    field.querySelector(".fm-field-error")?.remove();
    if (missing) {
      field.insertAdjacentHTML("beforeend", `<span class="fm-field-error" id="${item.key}Error">${esc(item.message)}</span>`);
      item.control.setAttribute("aria-describedby", `${item.key === "output_requirements" ? "fmAnalysisLogicHelp " : ""}${item.key}Error`);
    } else if (item.key === "output_requirements") item.control.setAttribute("aria-describedby", "fmAnalysisLogicHelp");
    else item.control.removeAttribute("aria-describedby");
  }
  requiredFields.forEach((item) => {
    if (item.key === "business_domain") return;
    item.control.required = true;
    item.control.setAttribute("aria-required", "true");
    item.control.addEventListener("input", () => { if (item.control.value.trim()) setError(item, false); });
  });
  function validateRequired() {
    let firstInvalid;
    requiredFields.forEach((item) => {
      const missing = item.key === "business_domain" ? !record.business_domain.length : !item.control.value.trim();
      setError(item, missing);
      if (missing) firstInvalid ||= item.control;
    });
    firstInvalid?.focus();
    return !firstInvalid;
  }
  const selectors = [
    { id: "fmDomains", key: "business_domain", placeholder: "Select one or more business domains this analysis model applies to." },
    { id: "fmMetrics", key: "referenced_metrics", placeholder: "Select metrics based on the chosen domains" },
  ].map((item) => ({ ...item, box: form.querySelector(`#${item.id}`), button: form.querySelector(`#${item.id} button`), menu: form.querySelector(`#${item.id}Menu`) }));
  function closeMenu(item) {
    item.menu.hidden = true;
    item.menu.classList.remove("open");
    item.button.setAttribute("aria-expanded", "false");
  }
  function paintSelect(item, options) {
    item.button.innerHTML = record[item.key].length ? record[item.key].map((value) => `<span>${esc(value)}</span>`).join("") : `<em>${esc(item.button.disabled ? "Select business domain first" : item.placeholder)}</em>`;
    const search = item.id === "fmMetrics" ? '<div class="fm-metric-search"><input type="search" placeholder="Search metrics..." aria-label="Search metrics" autocomplete="off"></div>' : "";
    const choices = options.map((value) => `<label><input type="checkbox" value="${esc(value)}" ${record[item.key].includes(value) ? "checked" : ""}>${esc(value)}</label>`).join("");
    item.menu.innerHTML = search + `<div class="fm-dropdown-options">${choices}</div><p class="fm-multi-empty" role="status" ${options.length ? "hidden" : ""}>No metrics available for the selected domains.</p>`;
  }
  function filterMetrics(item) {
    const query = (item.menu.querySelector('input[type="search"]')?.value || "").trim().toLowerCase();
    let matches = 0;
    item.menu.querySelectorAll(".fm-dropdown-options label").forEach((label) => {
      label.hidden = !label.querySelector("input").value.toLowerCase().includes(query);
      if (!label.hidden) matches++;
    });
    const empty = item.menu.querySelector(".fm-multi-empty");
    empty.hidden = matches > 0;
    empty.textContent = query ? "No matching metrics found." : "No metrics available for the selected domains.";
  }

  function syncMetrics() {
    const item = selectors[1];
    const available = [...new Set(metricRecords.filter((metric) => data.list(metric.business_domain).some((domain) => record.business_domain.includes(domain))).map((metric) => metric.metric_name))];
    record.referenced_metrics = record.referenced_metrics.filter((metric) => available.includes(metric));
    item.button.disabled = !record.business_domain.length;
    closeMenu(item);
    paintSelect(item, available);
    return available;
  }
  selectors.forEach((item) => {
    item.box.closest(".fm-section").classList.add("fm-scope-section");
    item.button.addEventListener("click", () => {
      const open = item.menu.hidden;
      selectors.forEach(closeMenu);
      item.menu.hidden = !open;
      item.menu.classList.toggle("open", open);
      item.button.setAttribute("aria-expanded", String(open));
      if (open && item.id === "fmMetrics") {
        const search = item.menu.querySelector('input[type="search"]');
        search.value = "";
        filterMetrics(item);
        search.focus();
      }
    });
    item.menu.addEventListener("input", (event) => {
      if (event.target.type === "search") filterMetrics(item);
    });
    item.menu.addEventListener("change", (event) => {
      if (event.target.type !== "checkbox") return;
      record[item.key] = [...item.menu.querySelectorAll("input:checked")].map((input) => input.value);
      // Keep the checkbox node focused when selecting several options with the keyboard.
      item.button.innerHTML = record[item.key].length ? record[item.key].map((value) => `<span>${esc(value)}</span>`).join("") : `<em>${esc(item.placeholder)}</em>`;
      if (item.key === "business_domain") {
        syncMetrics();
        if (record.business_domain.length) setError(requiredFields[1], false);
      }
    });
    item.box.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target.type === "search") event.preventDefault();
      if (event.key === "Escape") { event.preventDefault(); closeMenu(item); item.button.focus(); }
      if (event.key === "ArrowDown" && event.target === item.button && !item.button.disabled) {
        event.preventDefault();
        if (item.menu.hidden) item.button.click();
        item.menu.querySelector("input")?.focus();
      }
    });
    item.box.addEventListener("focusout", (event) => { if (!item.box.contains(event.relatedTarget)) closeMenu(item); });
  });
  document.addEventListener("click", (event) => selectors.forEach((item) => { if (!item.box.contains(event.target)) closeMenu(item); }));
  paintSelect(selectors[0], domainOptions);
  syncMetrics();
  const snapshot = () => JSON.stringify({ fields: [...new FormData(form)], domains: [...record.business_domain].sort(), metrics: [...record.referenced_metrics].sort() });
  let baseline = snapshot();
  let saved = false;
  window.addEventListener("beforeunload", (event) => { if (!saved && snapshot() !== baseline) { event.preventDefault(); event.returnValue = ""; } });
  const returnToLibrary = () => { saved = true; location.href = "knowledge.html?type=Analytical%20Model"; };
  const discardDialog = document.createElement("dialog");
  discardDialog.className = "fm-dialog fm-analysis-dialog";
  discardDialog.setAttribute("aria-labelledby", "fmDiscardTitle");
  discardDialog.innerHTML = '<h3 id="fmDiscardTitle">Discard changes?</h3><p>Your unsaved changes will be lost.</p><footer><button type="button" class="fm-button" id="fmKeepEditing" autofocus>Keep Editing</button><button type="button" class="fm-button primary" id="fmDiscard">Discard</button></footer>';
  document.body.append(discardDialog);
  discardDialog.querySelector("#fmKeepEditing").onclick = () => discardDialog.close();
  discardDialog.querySelector("#fmDiscard").onclick = returnToLibrary;
  discardDialog.addEventListener("close", () => form.querySelector("#fmCancel").focus());

  function persist(submit) {
    if (!validateRequired()) return;
    if (editing && !data.records("Analytical Model").some((x) => x.id === record.id)) {
      form.querySelector("#fmFormFeedback").textContent =
        "This analysis has been deleted. It cannot be saved.";
      return;
    }
    const values = new FormData(form);
    for (const key of [
      "analysis_name",
      "trigger_when",
      "applicable_scenarios",
      "analysis_constraints",
      "output_requirements",
    ])
      record[key] = String(values.get(key) || "").trim();
    record.status = submit ? "Enable" : "Disable";
    record.analysis_steps = String(record.output_requirements || "")
      .split(/\n+/)
      .map((x) => x.trim())
      .filter(Boolean);
    const now = new Date().toLocaleString("en-GB");
    if (!record.id) {
      record.id = `analysis-${crypto.randomUUID()}`;
      record.created_at = now;
      record.created_by = "Current User";
    }
    record.analysis_name ||= "Untitled analysis";
    record.title = record.analysis_name;
    record.summary = record.applicable_scenarios;
    record.updated_at = now;
    record.updated = now;
    record.created = record.created_at;
    record.owner = record.created_by;
    record.type = "Analytical Model";
    record.category = "playbooks";
    record.mark = "AM";
    record.source = record.visibility_scope;
    record.stage = submit ? "Published" : "Draft";
    record.published = submit;
    record.isDisabled = record.status === "Disable";
    try {
      data.save(record);
      saved = true;
      baseline = snapshot();
      const dialog = document.querySelector("#resultDialog");
      dialog.classList.add("fm-analysis-dialog");
      dialog.setAttribute("aria-labelledby", "dialogTitle");
      dialog.querySelector("#dialogTitle").textContent = submit ? "Analysis model published and enabled." : "Draft saved.";
      dialog.querySelector("#dialogText").textContent = submit ? "This analysis model is now enabled and available for AI use." : "This analysis model is disabled and will not be used by AI.";
      dialog.querySelector("#dialogClose").onclick = returnToLibrary;
      dialog.addEventListener("cancel", (event) => { event.preventDefault(); returnToLibrary(); }, { once: true });
      dialog.showModal();
    } catch (_) {
      form.querySelector("#fmFormFeedback").textContent =
        "Unable to save local demo changes. Please allow browser storage and retry.";
    }
  }
  form.querySelector("#fmCancel").onclick = () => {
    if (snapshot() === baseline) returnToLibrary();
    else discardDialog.showModal();
  };
  form.querySelector("#fmSave").onclick = () => {
    persist(false);
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    persist(true);
  });
})();






