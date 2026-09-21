document.addEventListener("DOMContentLoaded", function () {
  const scenarioList = document.getElementById("scenarioList");
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");
  const searchInput = document.getElementById("scenarioSearch");
  const statusFilter = document.getElementById("statusFilter");
  const detailScrim = document.getElementById("detailScrim");
  const detailDrawer = document.getElementById("scenarioDetail");
  const detailClose = document.getElementById("detailClose");
  const detailContent = document.getElementById("detailContent");
  const detailEmpty = document.getElementById("detailEmpty");
  const previewToggle = document.getElementById("previewToggle");
  const previewContent = document.getElementById("previewContent");
  const allTabCount = document.getElementById("allTabCount");

  let activeScenario = null;
  let filteredScenarios = [...scenarioLibraryData];

  function renderScenarios() {
    scenarioList.innerHTML = "";
    if (filteredScenarios.length === 0) {
      emptyState.hidden = false;
      resultCount.textContent = "0 scenarios";
      return;
    }
    emptyState.hidden = true;
    resultCount.textContent = `${filteredScenarios.length} scenario${filteredScenarios.length !== 1 ? "s" : ""}`;

    filteredScenarios.forEach((scenario, index) => {
      const row = document.createElement("div");
      row.className = "scenario-row";
      row.setAttribute("role", "option");
      row.setAttribute("data-index", index);
      row.innerHTML = `
        <div class="scenario-main">
          <div class="scenario-mark">${scenario.name.charAt(0)}</div>
          <div class="scenario-copy">
            <strong>${scenario.name}</strong>
            <small>${scenario.purpose}</small>
          </div>
        </div>
        <span class="scenario-purpose">${scenario.purpose}</span>
        <span class="scenario-call-count">${scenario.callCount}</span>
        <span class="scenario-like-rate">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          ${scenario.likeRate}%
        </span>
        <span class="scenario-status" data-status="${scenario.status}">${scenario.status}</span>
        <div class="scenario-owner">
          <span class="scenario-owner-name">${scenario.owner}</span>
        </div>
        <div class="scenario-actions">
          <button class="scenario-actions-btn" type="button" aria-label="Actions for ${scenario.name}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
      `;
      row.addEventListener("click", () => openDetail(scenario));
      scenarioList.appendChild(row);
    });
  }

  function filterScenarios() {
    const search = searchInput.value.toLowerCase();
    const status = statusFilter.value;

    filteredScenarios = scenarioLibraryData.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search) ||
        s.purpose.toLowerCase().includes(search) ||
        s.owner.toLowerCase().includes(search);
      const matchesStatus = status === "all" || s.status === status;
      return matchesSearch && matchesStatus;
    });

    renderScenarios();
  }

  function openDetail(scenario) {
    activeScenario = scenario;
    document.body.classList.add("scenario-detail-open");
    detailScrim.hidden = false;
    detailDrawer.setAttribute("aria-hidden", "false");
    detailDrawer.classList.add("open");
    detailContent.hidden = false;
    detailEmpty.hidden = true;

    // Populate detail content
    const tagsEl = document.getElementById("detailTags");
    tagsEl.innerHTML = `
      <span class="scenario-detail-tag ${scenario.status.toLowerCase().replace(" ", "-")}">${scenario.status}</span>
      <span class="scenario-detail-tag scope">${scenario.scope}</span>
      <span class="scenario-detail-tag version">${scenario.version}</span>
    `;

    document.getElementById("detailTitle").textContent = scenario.name;
    document.getElementById("detailDescription").textContent = scenario.purpose;
    document.getElementById("detailKnowledgeId").textContent = scenario.knowledgeId;
    document.getElementById("detailOwner").textContent = scenario.owner;
    document.getElementById("detailSource").textContent = scenario.source;
    document.getElementById("detailVersion").textContent = scenario.version;
    document.getElementById("detailReviewStatus").textContent = scenario.reviewStatus;
    document.getElementById("detailReviewStatus").className =
      "value " + (scenario.reviewStatus === "Passed" ? "passed" : "reviewing");
    document.getElementById("detailUsageCount").textContent =
      `${scenario.callCount} / ${scenario.callPeriod}`;
    document.getElementById("detailAccuracyScore").textContent = `${scenario.accuracyScore}%`;
    document.getElementById("detailUpdated").textContent = scenario.updated;
    document.getElementById("detailUser").textContent = scenario.user || "Marketing Strategy Team";

    document.getElementById("detailWhen").textContent = scenario.triggerWhen;
    document.getElementById("detailInput").textContent = scenario.input;
    document.getElementById("detailLogic").textContent = scenario.logic;
    document.getElementById("detailOutput").textContent = scenario.output;
    document.getElementById("detailBoundary").textContent = scenario.boundary;

    document.getElementById("previewQuestion").textContent = scenario.previewQuestion;
    document.getElementById("previewOutput").textContent = scenario.previewOutput;
    document.getElementById("detailUsageText").textContent =
      `Used in ${scenario.usedInReports} Reports / ${scenario.usedInScenarios} Scenarios`;

    // Hide preview by default
    previewContent.hidden = true;
    previewToggle.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
      Show Preview
    `;
  }

  function closeDetail() {
    document.body.classList.remove("scenario-detail-open");
    detailScrim.hidden = true;
    detailDrawer.setAttribute("aria-hidden", "true");
    detailDrawer.classList.remove("open");
    activeScenario = null;
  }

  // Event listeners
  searchInput.addEventListener("input", filterScenarios);
  statusFilter.addEventListener("change", filterScenarios);
  detailClose.addEventListener("click", closeDetail);
  detailScrim.addEventListener("click", closeDetail);

  // Advance status (Under Review → In Development → Published)
  function advanceStatus(scenario) {
    if (scenario.status === "Under Review") {
      scenario.status = "In Development";
    } else if (scenario.status === "In Development") {
      scenario.status = "Published";
    }
    filterScenarios();
    if (activeScenario === scenario) {
      openDetail(scenario);
    }
  }

  // Click on status cell in row → advance (Under Review → In Development, In Development → Published)
  scenarioList.addEventListener("click", (e) => {
    const statusCell = e.target.closest(".scenario-status");
    if (!statusCell) return;
    e.stopPropagation();
    const row = statusCell.closest(".scenario-row");
    const idx = parseInt(row.dataset.index, 10);
    const scenario = filteredScenarios[idx];
    if (scenario && (scenario.status === "Under Review" || scenario.status === "In Development")) {
      advanceStatus(scenario);
    }
  });

  previewToggle.addEventListener("click", () => {
    const isHidden = previewContent.hidden;
    previewContent.hidden = !isHidden;
    previewToggle.innerHTML = isHidden
      ? `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.99M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.058 10.058 0 01-3.704 4.976m0 0L21 21"/></svg>
      Hide Preview
    `
      : `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
      Show Preview
    `;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeScenario) {
      closeDetail();
    }
  });

  // Initial render
  if (allTabCount) allTabCount.textContent = scenarioLibraryData.length;
  filterScenarios();

  // Inline edit view toggle (Create New Scenario)
  const createNewBtn = document.getElementById("createNewScenarioBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const scenarioEditView = document.getElementById("scenarioEditView");
  const scenarioEditForm = document.getElementById("scenarioEditForm");
  const mainEl = document.querySelector(".scenario-library-v4");
  const bodyClass = "editing";

  function showEditView() {
    if (scenarioEditView) {
      scenarioEditView.hidden = false;
      if (mainEl) mainEl.classList.add(bodyClass);
    }
  }
  function hideEditView() {
    if (scenarioEditView) {
      scenarioEditView.hidden = true;
      if (mainEl) mainEl.classList.remove(bodyClass);
    }
  }
  if (createNewBtn) createNewBtn.addEventListener("click", showEditView);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", hideEditView);

  // Edit Scenario button: populate form from active scenario and show inline edit
  const detailEditBtn = document.getElementById("detailEditBtn");
  function populateEditFormFromScenario(scenario) {
    if (!scenario || !scenarioEditForm) return;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    };
    setVal("scenarioName", scenario.name);
    setVal("scenarioPurpose", scenario.purpose);
    setVal("scenarioScope", scenario.scope);
    setVal("scenarioOwner", scenario.owner);
    setVal("editWhen", scenario.triggerWhen);
    setVal("editInput", scenario.input);
    setVal("editLogic", scenario.logic);
    setVal("editOutput", scenario.output);
    setVal("editBoundary", scenario.boundary);
  }
  if (detailEditBtn) {
    detailEditBtn.addEventListener("click", function () {
      if (activeScenario) {
        populateEditFormFromScenario(activeScenario);
        closeDetail();
        showEditView();
      }
    });
  }
  if (scenarioEditForm) {
    scenarioEditForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Scenario submitted for review!");
      hideEditView();
    });
  }
});
