document.addEventListener("DOMContentLoaded", function () {
  // Get scenario from URL parameter or default to first one
  const urlParams = new URLSearchParams(window.location.search);
  const scenarioId = urlParams.get("id") || "city-comparison";
  const scenario = scenarioLibraryData.find((s) => s.id === scenarioId) || scenarioLibraryData[0];

  // Update page title
  document.title = `Tapestry Marketing Portal | ${scenario.name}`;

  // Update hero stats
  document.getElementById("heroStatus").textContent = scenario.status;
  document.getElementById("heroVersion").textContent = scenario.version;
  document.getElementById("heroLikeRate").textContent = `${scenario.likeRate}%`;

  // Update main content
  document.getElementById("scenarioName").textContent = scenario.name;
  document.getElementById("scenarioDescription").textContent = scenario.purpose;
  document.getElementById("scenarioWhen").textContent = scenario.triggerWhen;
  document.getElementById("scenarioInput").textContent = scenario.input;
  document.getElementById("scenarioLogic").textContent = scenario.logic;
  document.getElementById("scenarioOutput").textContent = scenario.output;
  document.getElementById("scenarioBoundary").textContent = scenario.boundary;

  // Update meta tags
  const metaEl = document.getElementById("scenarioMeta");
  metaEl.innerHTML = `
    <span class="scenario-detail-info-tag ${scenario.status.toLowerCase().replace(" ", "-")}">${scenario.status}</span>
    <span class="scenario-detail-info-tag scope">${scenario.scope}</span>
    <span class="scenario-detail-info-tag version">${scenario.version}</span>
  `;

  // Update governance
  document.getElementById("govKnowledgeId").textContent = scenario.knowledgeId;
  document.getElementById("govOwner").textContent = scenario.owner;
  document.getElementById("govSource").textContent = scenario.source;
  document.getElementById("govVersion").textContent = scenario.version;
  document.getElementById("govReviewStatus").textContent = scenario.reviewStatus;
  document.getElementById("govReviewStatus").className =
    "value " + (scenario.reviewStatus === "Passed" ? "passed" : "reviewing");
  document.getElementById("govUsageCount").textContent =
    `${scenario.callCount} / ${scenario.callPeriod}`;
  document.getElementById("govAccuracy").textContent = `${scenario.accuracyScore}%`;
  document.getElementById("govUpdated").textContent = scenario.updated;
  document.getElementById("govUser").textContent = scenario.user || "Marketing Strategy Team";

  // Update preview
  document.getElementById("previewQuestion").textContent = scenario.previewQuestion;
  document.getElementById("previewOutput").textContent = scenario.previewOutput;

  // Tab switching
  const tabs = document.querySelectorAll(".scenario-detail-tab");
  const panels = {
    content: document.getElementById("tab-content"),
    related: document.getElementById("tab-related"),
    "ai-check": document.getElementById("tab-ai-check"),
    usage: document.getElementById("tab-usage"),
    version: document.getElementById("tab-version"),
    activity: document.getElementById("tab-activity"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;

      // Update tab states
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-pressed", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-pressed", "true");

      // Show/hide panels
      Object.values(panels).forEach((p) => (p.hidden = true));
      if (panels[tabName]) {
        panels[tabName].hidden = false;
      }
    });
  });

  // Preview toggle
  const previewToggle = document.getElementById("previewToggle");
  const previewContent = document.getElementById("previewContent");

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
});
