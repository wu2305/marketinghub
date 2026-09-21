(function () {
  const query = new URLSearchParams(location.search);
  const type = query.get("type");
  const allowed = ["Analytical Model", "Scenario Reporting"];
  if (!allowed.includes(type)) return;
  document.body.classList.add("unified-knowledge-create");

  const fields = document.querySelector("#typeFields");
  const form = document.querySelector("#knowledgeForm");
  const card = document.querySelector(".v20-form-card");
  const head = document.querySelector(".v20-page-head");
  if (!fields || !form || !card || !head) return;

  const analytical = type === "Analytical Model";
  const name = `Create ${type}`;
  const esc = (value) =>
    String(value || "").replace(
      /[&<>\"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
    );
  const scenarioSourceOptions = [
    "Business Domain · Marketing",
    "Business Domain · Customer",
    "Business Domain · City Strategy",
    "Business Domain · Commerce",
    "Business Domain · Retail Operations",
    "Report · Channel Performance",
    "Report · Campaign Performance",
    "Report · Campaign Review",
    "Report · Customer 360 Overview",
    "Report · Customer Daily Pulse",
    "Report · ABO Performance Dashboard",
    "Report · Weekly Marketing Performance",
    "Report · Marketing Executive Dashboard",
    "Report · Activation Dashboard",
  ];

  document.querySelector(".v20-type-row").hidden = true;
  document.querySelector("#knowledgeType").value = type;
  card.classList.add("approach-form-card");
  head.querySelector(".v20-title-breadcrumb")?.remove();
  head.querySelector("p:not(.v20-eyebrow)")?.remove();
  head.querySelector(":scope > div").insertAdjacentHTML(
    "afterbegin",
    `
    <nav class="approach-breadcrumb" aria-label="Breadcrumb">
      <a href="../../index.html">Home</a><span>/</span><a href="knowledge.html">AI Interpreter</a><span>/</span><a href="knowledge.html">Knowledge Management</a><span>/</span><a href="knowledge.html?type=${encodeURIComponent(type)}">${type}</a><span>/</span><b>${name}</b>
    </nav>
  `,
  );
  document.querySelector("#pageTitle").textContent = name;

  if (analytical) {
    fields.innerHTML = `
      <div class="approach-form">
        <div class="approach-form-grid">
          <label class="approach-field">
            <span>${analytical ? "Analytical Tag" : "Reporting Scenario"}</span>
            <select>
              <option>${analytical ? "AI Insight Summary" : "Performance Review"}</option>
              <option>${analytical ? "Data Interpretation" : "Executive Summary"}</option>
              <option>${analytical ? "Root Cause Analysis" : "Campaign Analysis"}</option>
            </select>
          </label>
          <label class="approach-field">
            <span>Knowledge Title <i class="unified-required" aria-hidden="true">*</i></span>
            <input required placeholder="Enter knowledge title.">
          </label>
          <label class="approach-field full">
            <span>Core Description <i class="unified-required" aria-hidden="true">*</i></span>
            <textarea required placeholder="Describe the knowledge, its purpose, and how it should be used."></textarea>
          </label>
          <label class="approach-field full">
            <span>Related Objects</span>
            <div class="approach-related">
              <span>City Strategy Analysis</span>
              <span>4P Executive Overview</span>
              <span>Customer Daily Pulse</span>
            </div>
          </label>
        </div>
      </div>`;
  } else {
    const sourceOptions = scenarioSourceOptions
      .map((value) => `<option value="${esc(value)}">${esc(value)}</option>`)
      .join("");
    fields.innerHTML = `
      <div class="approach-form approach-form-scenario">
        <div class="approach-form-grid">
          <label class="approach-field full">
            <span>Title *</span>
            <input name="scenarioTitle" required placeholder="Enter the scenario name.">
          </label>
          <label class="approach-field full">
            <span>Description *</span>
            <textarea name="scenarioDescription" required placeholder="Summarize the business issue and intended decision context."></textarea>
          </label>
          <label class="approach-field">
            <span>Data Sources *</span>
            <select name="scenarioSources" id="scenarioSources" multiple required>
              ${sourceOptions}
            </select>
          </label>
          <label class="approach-field">
            <span>Trigger When *</span>
            <textarea name="scenarioTrigger" required placeholder="Describe the common question patterns or business triggers."></textarea>
          </label>
        </div>

        <div class="approach-section">
          <header class="approach-section-head">
            <div>
              <span>Analysis Setup</span>
              <strong>Input / Analysis Logic / Output</strong>
            </div>
          </header>
          <div class="approach-section-body">
            <div class="approach-form-grid">
              <label class="approach-field full">
                <span>Input *</span>
                <textarea name="scenarioInput" required placeholder="List the core metrics, breakdown dimensions, time grain, comparison rules, and anomaly thresholds."></textarea>
              </label>
              <label class="approach-field full">
                <span>Analysis Logic *</span>
                <textarea name="scenarioLogic" required placeholder="Describe the default analysis order, attribution logic, and insight priorities."></textarea>
              </label>
              <label class="approach-field full">
                <span>Output *</span>
                <textarea name="scenarioOutput" required placeholder="Specify the output template, writing style, and whether tables or charts are required."></textarea>
              </label>
              <label class="approach-field">
                <span>Owner</span>
                <input name="scenarioOwner" placeholder="Enter the owner or steward.">
              </label>
              <label class="approach-field">
                <span>Update</span>
                <input name="scenarioUpdate" placeholder="Enter the last update date.">
              </label>
            </div>
          </div>
        </div>
      </div>`;
    const multiSelect = fields.querySelector("#scenarioSources");
    if (multiSelect && !multiSelect.dataset.ready) {
      multiSelect.dataset.ready = "1";
      const wrap = document.createElement("div");
      const button = document.createElement("button");
      const menu = document.createElement("div");
      wrap.className = "v20-multi";
      button.type = "button";
      button.className = "v20-multi-display";
      menu.className = "v20-multi-menu";
      multiSelect.parentNode.insertBefore(wrap, multiSelect);
      wrap.append(multiSelect, button, menu);
      multiSelect.hidden = true;
      const renderMulti = () => {
        const selected = Array.from(multiSelect.selectedOptions)
          .map((option) => option.textContent || option.value)
          .filter(Boolean);
        button.innerHTML = selected.length
          ? selected
              .map((value) => `<span>${esc(value)}<b data-v="${esc(value)}">×</b></span>`)
              .join("")
          : "<em>Select one or more</em>";
        menu.innerHTML = Array.from(multiSelect.options)
          .map(
            (option) => `
          <label>
            <input type="checkbox" value="${esc(option.value)}" ${option.selected ? "checked" : ""}>
            ${esc(option.textContent || option.value)}
          </label>
        `,
          )
          .join("");
      };
      renderMulti();
      button.addEventListener("click", (event) => {
        const remover = event.target.closest("[data-v]");
        event.preventDefault();
        event.stopPropagation();
        if (remover) {
          const option = Array.from(multiSelect.options).find(
            (item) => item.value === remover.dataset.v,
          );
          if (option) option.selected = false;
          renderMulti();
          return;
        }
        menu.classList.toggle("open");
      });
      menu.addEventListener("change", (event) => {
        const checkbox = event.target.closest('input[type="checkbox"]');
        if (!checkbox) return;
        const option = Array.from(multiSelect.options).find(
          (item) => item.value === checkbox.value,
        );
        if (option) option.selected = checkbox.checked;
        renderMulti();
      });
      document.addEventListener("click", (event) => {
        if (!wrap.contains(event.target)) menu.classList.remove("open");
      });
    }
  }

  const oldFooter = form.querySelector(".v20-form-footer");
  oldFooter.innerHTML =
    '<span></span><div><button type="button" class="v20-secondary" id="cancelBtn">Cancel</button><button type="button" class="v20-secondary" id="saveBtn">Save</button><button type="submit" class="v20-primary">Submit</button></div>';
  oldFooter.classList.add("approach-footer");
  document.querySelector("#cancelBtn").onclick = () =>
    (location.href = `knowledge.html?type=${encodeURIComponent(type)}`);
  document.querySelector("#saveBtn").onclick = () => {
    const dialog = document.querySelector("#resultDialog");
    document.querySelector("#dialogTitle").textContent = "Saved successfully";
    document.querySelector("#dialogText").textContent = "Your knowledge draft has been saved.";
    dialog?.showModal();
  };
  function keepSingleCancel() {
    const cancelButtons = Array.from(form.querySelectorAll(".v20-form-footer button")).filter(
      (button) => button.textContent.trim() === "Cancel",
    );
    cancelButtons.slice(1).forEach((button) => button.remove());
  }
  keepSingleCancel();
  window.setTimeout(keepSingleCancel, 80);
  window.setTimeout(keepSingleCancel, 220);
})();
