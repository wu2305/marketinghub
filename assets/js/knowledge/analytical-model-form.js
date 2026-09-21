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
  const requiredLabel = (label) =>
    label.replace(" *", ' <i class="unified-required" aria-hidden="true">*</i>');
  const field = (key, label, full, textarea = false, hint = "", labelHelp = "") =>
    `<label class="fm-field ${full ? "full" : ""}"><span>${requiredLabel(label)}${labelHelp}</span>${textarea ? `<textarea name="${key}" placeholder="${esc(hint)}">${esc(record[key])}</textarea>` : `<input name="${key}" value="${esc(record[key])}" placeholder="${esc(hint)}">`}</label>`;
  const chipField = (key, label, suggestions = [], full = false) =>
    `<div class="fm-field ${full ? "full" : ""}"><span>${label}</span><div class="fm-tag-editor" data-tags="${key}"><div class="fm-tags"></div><div class="fm-tag-entry"><input aria-label="${label}" placeholder="Type and press Enter; use semicolons for multiple values" ${suggestions.length ? `list="fm-${key}"` : ""}></div>${suggestions.length ? `<datalist id="fm-${key}">${suggestions.map((x) => `<option value="${esc(x)}"></option>`).join("")}</datalist>` : ""}</div></div>`;
  const group = (name, content) =>
    `<section class="fm-section"><h3>${requiredLabel(name)}</h3><div class="fm-grid">${content}</div></section>`;
  const defaultGuidanceText = () =>
    [
      "Describe the analysis logic and reasoning path. Focus on how to analyze the question and what final result should be returned. Do not ask AI to create charts or extra report sections.",
      "",
      "For example:",
      "1. Confirm the user's business question, analysis period, target scope and comparison baseline.",
      "2. Check whether the selected metrics changed materially, and identify the main direction of the change.",
      "3. Compare related dimensions or segments to locate the most likely driver of the change.",
      "4. Judge whether the evidence supports a clear cause. If not, explain the limitation.",
      "5. Return one concise analysis result with the key finding, reason and recommended next action.",
    ].join("\n");
  const guidanceTooltip = (text) =>
    `<span class="fm-guidance-tooltip-wrap"><button class="fm-guidance-tooltip-trigger" type="button" aria-label="Show Structure and Guidance prompt" aria-describedby="fmGuidanceHelp">?</button><span class="fm-guidance-tooltip" id="fmGuidanceHelp" role="tooltip"><span class="fm-guidance-tooltip-copy">${esc(text)}</span></span></span>`;
  const metricOptions = [
    ...new Set([
      ...data.records("Metric Dictionary").map((x) => x.metric_name),
      ...record.referenced_metrics,
    ]),
  ];
  const metricsField = () =>
    '<div class="fm-field"><span id="fmMetricsLabel">Referenced Metrics</span><div class="v20-multi" id="fmMetrics"><button type="button" class="v20-multi-display" aria-labelledby="fmMetricsLabel" aria-expanded="false" aria-controls="fmMetricsMenu"></button><div class="v20-multi-menu" id="fmMetricsMenu">' +
    metricOptions
      .map(
        (value) =>
          '<label><input type="checkbox" value="' +
          esc(value) +
          '"' +
          (record.referenced_metrics.includes(value) ? " checked" : "") +
          ">" +
          esc(value) +
          "</label>",
      )
      .join("") +
    "</div></div></div>";
  const guidanceText = defaultGuidanceText();
  form.innerHTML =
    group(
      "Basic Information",
      field("analysis_name", "Analysis Name *", true, false, "Enter a name for this new analysis.") +
        field(
          "applicable_scenarios",
          "Description",
          true,
          true,
          "Briefly state the business goal, decision to support, and expected insight. Do not list analysis steps here.",
        ) +
        field(
          "trigger_when",
          "Trigger When *",
          true,
          true,
          "Describe the user questions, business events, or conditions that should trigger this analysis.",
        ),
    ) +
    group(
      "Metrics",
      chipField("business_domain", "Business Domain", [
        "Marketing",
        ...Object.values(data.domains),
      ]) + metricsField(),
    ) +
    group(
      "Structure & Guidance *",
      field(
        "output_requirements",
        "Structure & Guidance *",
        true,
        true,
        guidanceText,
        guidanceTooltip(guidanceText),
      ).replace('class="fm-field full"', 'class="fm-field full fm-guidance-field"'),
    ) +
    group(
      "Constraints",
      field(
        "analysis_constraints",
        "Prohibited Analysis Directions",
        true,
        true,
        "State unsupported dimensions, missing data and conclusions AI must avoid.",
      ),
    ) +
    '<footer class="fm-editor-footer"><div><button class="fm-button" type="button" id="fmCancel">Cancel</button><button class="fm-button" type="button" id="fmSave">Save</button><button class="fm-button primary" type="submit">Submit</button></div></footer><p class="knowledge-operation-reminder"><span aria-hidden="true">i</span><span>Operation reminder: Save keeps this model disabled. Submit publishes it using the selected AI Interpreter Status.</span></p><p class="fm-feedback" id="fmFormFeedback" role="status" aria-live="polite"></p>';
  form.noValidate = true;
  const requiredControls = ["analysis_name", "trigger_when", "output_requirements"].map((key) => form.querySelector(`[name="${key}"]`)).filter(Boolean);
  requiredControls.forEach((control) => {
    control.required = true;
    control.setAttribute("aria-required", "true");
    control.addEventListener("input", () => {
      if (!control.value.trim()) return;
      const field = control.closest(".fm-field");
      field?.classList.remove("is-invalid");
      field?.querySelector(".fm-field-error")?.remove();
    });
  });
  function validateRequired() {
    let firstInvalid = null;
    requiredControls.forEach((control) => {
      const field = control.closest(".fm-field");
      const missing = !control.value.trim();
      field?.classList.toggle("is-invalid", missing);
      field?.querySelector(".fm-field-error")?.remove();
      if (missing) {
        field?.insertAdjacentHTML("beforeend", '<span class="fm-field-error">This field is required.</span>');
        firstInvalid ||= control;
      }
    });
    firstInvalid?.focus();
    return !firstInvalid;
  }
  const metrics = form.querySelector("#fmMetrics"),
    metricsButton = metrics.querySelector("button"),
    metricsMenu = metrics.querySelector(".v20-multi-menu");
  metrics.closest(".fm-section").classList.add("fm-metrics-section");
  const paintMetrics = () => {
    metricsButton.innerHTML = record.referenced_metrics.length
      ? record.referenced_metrics.map((value) => "<span>" + esc(value) + "</span>").join("")
      : "<em>Select one or more</em>";
  };
  const closeMetrics = () => {
    metricsMenu.classList.remove("open");
    metricsButton.setAttribute("aria-expanded", "false");
  };
  metricsButton.addEventListener("click", () => {
    const open = metricsMenu.classList.toggle("open");
    metricsButton.setAttribute("aria-expanded", String(open));
  });
  metricsMenu.addEventListener("change", () => {
    record.referenced_metrics = [...metricsMenu.querySelectorAll("input:checked")].map(
      (input) => input.value,
    );
    paintMetrics();
  });
  document.addEventListener("click", (event) => {
    if (!metrics.contains(event.target)) closeMetrics();
  });
  metrics.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMetrics();
      metricsButton.focus();
    }
  });
  paintMetrics();
  const statusToggle = form.querySelector('[name="status"]');
  const updateStatusToggle = () => {
    if (statusToggle)
      statusToggle.nextElementSibling.textContent = statusToggle.checked ? "Enabled" : "Disabled";
  };
  statusToggle?.addEventListener("change", updateStatusToggle);
  updateStatusToggle();
  function paintTags(key) {
    const box = form.querySelector(`[data-tags="${key}"] .fm-tags`);
    box.innerHTML = record[key]
      .map(
        (value, index) =>
          `<span class="fm-chip">${esc(value)}<button type="button" data-remove-tag="${key}" data-index="${index}" aria-label="Remove ${esc(value)}">×</button></span>`,
      )
      .join("");
  }
  function addTags(key) {
    const input = form.querySelector(`[data-tags="${key}"] input`);
    record[key] = [...new Set([...record[key], ...data.list(input.value)])];
    input.value = "";
    paintTags(key);
  }
  const tagKeys = ["business_domain"];
  tagKeys.forEach(paintTags);
  form.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches("[data-tags] input")) {
      event.preventDefault();
      addTags(event.target.closest("[data-tags]").dataset.tags);
    }
  });
  form.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove-tag]");
    if (remove) {
      record[remove.dataset.removeTag].splice(Number(remove.dataset.index), 1);
      paintTags(remove.dataset.removeTag);
    }
  });
  function persist(submit) {
    if (!validateRequired()) return;
    if (editing && !data.records("Analytical Model").some((x) => x.id === record.id)) {
      form.querySelector("#fmFormFeedback").textContent =
        "This analysis has been deleted. It cannot be saved.";
      return;
    }
    tagKeys.forEach(addTags);
    const values = new FormData(form);
    for (const key of [
      "analysis_name",
      "trigger_when",
      "applicable_scenarios",
      "analysis_constraints",
      "output_requirements",
    ])
      record[key] = String(values.get(key) || "").trim();
    // Save always keeps knowledge offline. Submit retains the form's enabled setting.
    record.status = !submit
      ? "Disable"
      : statusToggle
        ? statusToggle.checked
          ? "Enable"
          : "Disable"
        : "Enable";
    if (statusToggle) statusToggle.checked = record.status === "Enable";
    updateStatusToggle();
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
      location.href = `knowledge.html?type=Analytical%20Model&notice=${submit ? "published" : "saved"}`;
    } catch (_) {
      form.querySelector("#fmFormFeedback").textContent =
        "Unable to save local demo changes. Please allow browser storage and retry.";
    }
  }
  form.querySelector("#fmCancel").onclick = () => {
    location.href = "knowledge.html?type=Analytical%20Model";
  };
  form.querySelector("#fmSave").onclick = () => {
    persist(false);
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    persist(true);
  });
})();






