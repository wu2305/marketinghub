const reportNavigation = [
  {
    id: "consumer",
    title: "D2C Insight",
    summary: "Cities, products, and customer behavior",
    projects: [
      {
        id: "city",
        title: "City Strategy",
        summary: "City investment and business movement",
        reports: ["Invest City Strategy Analysis", "City Analysis Dashboard"],
      },
      {
        id: "fourp",
        title: "4P Report",
        summary: "Place, product, people, and price",
        reports: ["4P Executive Overview", "Promotion Lift Analysis"],
      },
      {
        id: "customer",
        title: "Customer Daily Tracking",
        summary: "Traffic, members, and conversion",
        reports: ["Customer Daily Pulse", "Customer Funnel Watch"],
      },
    ],
  },
  {
    id: "dc-media",
    title: "DC Media Performance",
    summary: "Campaign reach, quality, and ROI",
    projects: [
      {
        id: "abo",
        title: "ABO",
        summary: "Audience and campaign performance",
        reports: ["Audience Build Overview", "Campaign Quality Watch"],
      },
    ],
  },
  {
    id: "dg-media",
    title: "DG Media Tracking",
    summary: "Content and cross-channel exposure",
    projects: [
      {
        id: "rednote",
        title: "Rednote Tracking",
        summary: "Content and creative quality",
        reports: ["Rednote Media Tracking", "Creative Quality Monitor"],
      },
      {
        id: "ottolv",
        title: "OTT / OLV",
        summary: "Exposure and source integrity",
        reports: ["OTT / OLV Exposure Tracking", "Source Integrity Monitor"],
      },
    ],
  },
];

const modeNames = {
  personalized: "All Marketing Portal",
  campaign: "Campaigns",
  report: "Dashboards",
  knowledge: "Knowledge",
  memory: "My Memory",
};

const modeStatus = {
  personalized: "All connected sources",
  campaign: "Campaign workspace",
  report: "Dashboards",
  knowledge: "AI Interpreter",
  memory: "Saved knowledge",
};

const reportsNav = document.querySelector("#reportsNav");
const reportsMenuButton = document.querySelector("#reportsMenuButton");
const reportsMenu = document.querySelector("#reportsMenu");
const reportsCascade = document.querySelector("#reportsCascade");
const reportCategories = document.querySelector("#reportCategories");
const reportProjects = document.querySelector("#reportProjects");
const reportDashboards = document.querySelector("#reportDashboards");
const reportContext = document.querySelector("#reportContext");
const projectWorkspaceLink = document.querySelector("#projectWorkspaceLink");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

let activeCategoryId = reportNavigation[0].id;
let activeProjectId = reportNavigation[0].projects[0].id;
let reportsCloseTimer;

function getActiveCategory() {
  return (
    reportNavigation.find((category) => category.id === activeCategoryId) || reportNavigation[0]
  );
}

function getActiveProject() {
  const category = getActiveCategory();
  return (
    category.projects.find((project) => project.id === activeProjectId) || category.projects[0]
  );
}

function renderCategories() {
  reportCategories.innerHTML = reportNavigation
    .map(
      (category) => `
    <button class="cascade-item${category.id === activeCategoryId ? " is-active" : ""}" type="button" data-category-id="${category.id}" aria-pressed="${category.id === activeCategoryId}">
      <strong>${category.title}</strong>
      <small>${category.projects.length} ${category.projects.length === 1 ? "project" : "projects"}</small>
    </button>
  `,
    )
    .join("");
}

function renderProjects() {
  const category = getActiveCategory();
  reportProjects.innerHTML = category.projects
    .map(
      (project) => `
    <button class="cascade-item${project.id === activeProjectId ? " is-active" : ""}" type="button" data-project-id="${project.id}" aria-pressed="${project.id === activeProjectId}">
      <strong>${project.title}</strong>
      <small>${project.reports.length} reports</small>
    </button>
  `,
    )
    .join("");
}

function renderReports() {
  const category = getActiveCategory();
  const project = getActiveProject();
  reportContext.innerHTML = `<strong>${project.title}</strong><span>${project.summary}</span>`;
  reportDashboards.innerHTML = project.reports
    .map(
      (report, index) => `
    <a class="cascade-report-link" href="assets/pages/reports.html?project=${project.id}&dashboard=${index}&view=live">
      <strong>${report}</strong>
      <small>Open report</small>
    </a>
  `,
    )
    .join("");
  projectWorkspaceLink.href = `assets/pages/reports.html?project=${project.id}`;
  projectWorkspaceLink.setAttribute("aria-label", `Open ${project.title} project workspace`);
  document.querySelector("#projectsLabel").textContent = `2 / ${category.title}`;
}

function updateActiveItems(container, dataKey, activeId) {
  const attributeName = dataKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  container.querySelectorAll(`[data-${attributeName}]`).forEach((item) => {
    const isActive = item.dataset[dataKey] === activeId;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
}

function selectCategory(categoryId) {
  const category = reportNavigation.find((item) => item.id === categoryId);
  if (!category) return;
  activeCategoryId = category.id;
  if (!category.projects.some((project) => project.id === activeProjectId)) {
    activeProjectId = category.projects[0].id;
  }
  updateActiveItems(reportCategories, "categoryId", activeCategoryId);
  renderProjects();
  renderReports();
}

function selectProject(projectId) {
  const project = getActiveCategory().projects.find((item) => item.id === projectId);
  if (!project) return;
  activeProjectId = project.id;
  updateActiveItems(reportProjects, "projectId", activeProjectId);
  renderReports();
}

function openReportsMenu(focusFirst = false) {
  window.clearTimeout(reportsCloseTimer);
  reportsMenu.hidden = false;
  reportsMenuButton.setAttribute("aria-expanded", "true");
  window.requestAnimationFrame(() => reportsMenu.classList.add("is-open"));
  if (focusFirst) {
    window.setTimeout(() => reportCategories.querySelector("button")?.focus(), 30);
  }
}

function closeReportsMenu(returnFocus = false) {
  window.clearTimeout(reportsCloseTimer);
  reportsMenu.classList.remove("is-open");
  reportsMenuButton.setAttribute("aria-expanded", "false");
  reportsCloseTimer = window.setTimeout(() => {
    reportsMenu.hidden = true;
    reportsCascade.dataset.mobileView = "categories";
  }, 180);
  if (returnFocus) reportsMenuButton.focus();
}

function moveCascadeFocus(event) {
  const current = event.target.closest(".cascade-item, .cascade-report-link");
  if (!current) return;
  const column = current.closest(".cascade-column");
  const items = [
    ...column.querySelectorAll(".cascade-item, .cascade-report-link, .project-workspace-link"),
  ];
  const index = items.indexOf(current);

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    items[(index + direction + items.length) % items.length].focus();
  }

  if (event.key === "ArrowRight" && current.matches(".cascade-item")) {
    event.preventDefault();
    if (column.classList.contains("cascade-categories")) {
      selectCategory(current.dataset.categoryId);
      reportProjects.querySelector("button")?.focus();
    } else if (column.classList.contains("cascade-projects")) {
      selectProject(current.dataset.projectId);
      reportDashboards.querySelector("a")?.focus();
    }
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    if (column.classList.contains("cascade-reports")) {
      reportProjects.querySelector(".is-active")?.focus();
    } else if (column.classList.contains("cascade-projects")) {
      reportCategories.querySelector(".is-active")?.focus();
    } else {
      closeReportsMenu(true);
    }
  }
}

if (
  reportsNav &&
  reportsMenuButton &&
  reportsMenu &&
  reportsCascade &&
  reportCategories &&
  reportProjects &&
  reportDashboards &&
  reportContext &&
  projectWorkspaceLink
) {
  renderCategories();
  renderProjects();
  renderReports();

  reportsMenuButton.addEventListener("click", () => {
    if (reportsMenu.hidden) openReportsMenu();
    else closeReportsMenu();
  });

  reportsMenuButton.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openReportsMenu(true);
    }
  });

  reportsNav.addEventListener("pointerenter", () => {
    if (finePointer.matches) openReportsMenu();
  });

  reportsNav.addEventListener("pointerleave", () => {
    if (finePointer.matches) {
      reportsCloseTimer = window.setTimeout(() => closeReportsMenu(), 180);
    }
  });

  reportCategories.addEventListener("pointerover", (event) => {
    const item = event.target.closest("[data-category-id]");
    if (item && finePointer.matches) selectCategory(item.dataset.categoryId);
  });

  reportCategories.addEventListener("focusin", (event) => {
    const item = event.target.closest("[data-category-id]");
    if (item) selectCategory(item.dataset.categoryId);
  });

  reportCategories.addEventListener("click", (event) => {
    const item = event.target.closest("[data-category-id]");
    if (!item) return;
    selectCategory(item.dataset.categoryId);
    reportsCascade.dataset.mobileView = "projects";
    if (window.matchMedia("(max-width: 760px)").matches) {
      window.setTimeout(() => reportProjects.querySelector(".is-active")?.focus(), 0);
    }
  });

  reportProjects.addEventListener("pointerover", (event) => {
    const item = event.target.closest("[data-project-id]");
    if (item && finePointer.matches) selectProject(item.dataset.projectId);
  });

  reportProjects.addEventListener("focusin", (event) => {
    const item = event.target.closest("[data-project-id]");
    if (item) selectProject(item.dataset.projectId);
  });

  reportProjects.addEventListener("click", (event) => {
    const item = event.target.closest("[data-project-id]");
    if (!item) return;
    selectProject(item.dataset.projectId);
    reportsCascade.dataset.mobileView = "reports";
    if (window.matchMedia("(max-width: 760px)").matches) {
      window.setTimeout(() => reportDashboards.querySelector("a")?.focus(), 0);
    }
  });

  reportsCascade.addEventListener("click", (event) => {
    const backButton = event.target.closest("[data-cascade-back]");
    if (!backButton) return;
    reportsCascade.dataset.mobileView = backButton.dataset.cascadeBack;
    const target =
      backButton.dataset.cascadeBack === "categories"
        ? reportCategories.querySelector(".is-active")
        : reportProjects.querySelector(".is-active");
    window.setTimeout(() => target?.focus(), 0);
  });

  reportsCascade.addEventListener("keydown", moveCascadeFocus);

  document.addEventListener("pointerdown", (event) => {
    if (!reportsMenu.hidden && !reportsNav.contains(event.target)) closeReportsMenu();
  });
}

/* Some detail pages intentionally omit the global assistant. Keep their shared
 * navigation usable instead of initializing controls that are not in the DOM. */
const assistantPanel = document.querySelector("#assistantPanel");
if (
  document.querySelector(".home-ask-panel") ||
  (assistantPanel &&
  document.querySelector("#aiEntry") &&
  document.querySelector("#promptCanvas") &&
  document.querySelector("#assistantTitle") &&
  document.querySelector(".assistant-subtitle") &&
  document.querySelector(".ask-zone") &&
  document.querySelector(".ask-scope") &&
  document.querySelector("#sendQuery") &&
  document.querySelector(".assistant-modal"))
) {
const assistantModal = document.querySelector(".assistant-modal");
const aiEntry = document.querySelector("#aiEntry");
const capabilityAiEntries = document.querySelectorAll("[data-ai-entry]");
const promptCanvas = document.querySelector("#promptCanvas");
const answerFeed = document.querySelector("#answerFeed");
const activeContext = document.querySelector("#activeContext");
const promptSuggestions = document.querySelectorAll(".prompt-suggestion");
const scopeButtons = document.querySelectorAll(".scope-option");
const sendQuery = document.querySelector("#sendQuery");
const clearPrompt = document.querySelector("#clearPrompt");
const platformGuide = document.querySelector("#platformGuide");
const platformGuideTrigger = document.querySelector("#platformGuideTrigger");
const assistantTitle = document.querySelector("#assistantTitle");
const assistantSubtitle = document.querySelector(".assistant-subtitle");
const assistantLayout = document.querySelector(".assistant-layout");
const askZone = document.querySelector(".ask-zone");
const askScope = document.querySelector(".ask-scope");
const modelPickerBtn = document.querySelector("#modelPicker");
const modePickerBtn = document.querySelector("#modePicker");

const initialActiveScope = document.querySelector(".scope-option.active");
let selectedContext = (initialActiveScope && initialActiveScope.dataset.context) || "personalized";
let lastFocusedElement = null;
let platformGuideCloseTimer = null;
let platformGuidePinned = false;

const scopeSuggestions = {
  personalized: [
    {
      prompt: "Analyze this Excel data and generate a performance summary report.",
      label: "Analyze this Excel data and generate a summary",
    },
    {
      prompt: "What are the top 3 insights across all my marketing data this week?",
      label: "Top insights across all data this week",
    },
    {
      prompt: "Summarize campaign, report, and knowledge activity for the last 7 days.",
      label: "Weekly activity summary",
    },
  ],
  campaign: [
    {
      prompt: "What's the ROI trend across my active campaigns this quarter?",
      label: "What's the ROI trend across my active campaigns?",
    },
    {
      prompt: "Which campaigns are near budget threshold and need attention?",
      label: "Campaigns near budget threshold",
    },
    {
      prompt: "Show me the automation task queue and next best actions.",
      label: "Automation task queue overview",
    },
  ],
  report: [
    {
      prompt: "Compare channel performance for the last 3 campaigns and identify top performers.",
      label: "Compare channel performance for the last 3 campaigns",
    },
    {
      prompt: "Explain the largest city movement in this week's City Strategy report.",
      label: "Largest city movement this week",
    },
    {
      prompt: "What anomalies should I review in the Campaign Quality Watch?",
      label: "Campaign quality anomalies",
    },
  ],
  knowledge: [
    {
      prompt: "What is the governed definition of 'Attributed ROI' and which reports use it?",
      label: "Definition of Attributed ROI",
    },
    {
      prompt: "Show me knowledge assets related to city investment strategy.",
      label: "City investment strategy knowledge",
    },
    {
      prompt: "Which metrics have incomplete backflow and need data quality review?",
      label: "Metrics with data quality issues",
    },
  ],
  memory: [
    {
      prompt: "Recall my last campaign optimization notes and apply to current performance.",
      label: "Apply my last optimization notes",
    },
    {
      prompt: "What did I save about Rednote creative patterns last month?",
      label: "My saved Rednote creative patterns",
    },
    {
      prompt: "Summarize my personal review notes for this week's reports.",
      label: "My weekly review notes",
    },
  ],
};

const scopeDescriptions = {
  personalized: "Ask questions across the entire Marketing Portal",
  campaign: "Ask questions about Campaigns",
  report: "Ask questions about Dashboards",
  knowledge: "Ask questions about AI Interpreter",
  memory: "Ask questions about Memory",
};

function renderSuggestions(context) {
  const container = document.querySelector("#askSuggestions");
  if (!container) return;
  const items = scopeSuggestions[context] || scopeSuggestions.personalized;
  // Only overwrite when items exist, otherwise keep HTML fallback
  if (items && items.length > 0) {
    container.innerHTML = items
      .map(function (item) {
        return (
          '<button class="ask-suggestion" type="button" data-prompt="' +
          escapeHtml(item.prompt) +
          '" data-context="' +
          context +
          '">' +
          escapeHtml(item.label) +
          "</button>"
        );
      })
      .join("");
  }
  const descriptionEl = document.querySelector("#askScopeDescription");
  if (descriptionEl) {
    descriptionEl.textContent = scopeDescriptions[context] || scopeDescriptions.personalized;
  }
}

function setMode(context) {
  selectedContext = context;
  if (activeContext)
    activeContext.textContent =
      modeStatus[context] || modeNames[context] || "All connected sources";
  scopeButtons.forEach((button) => {
    const isActive = button.dataset.context === context;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  if (modelPickerBtn) modelPickerBtn.hidden = context === "knowledge";
  if (modePickerBtn) modePickerBtn.hidden = context === "knowledge";
  renderSuggestions(context);
}

function updateSendState() {
  sendQuery.disabled = promptCanvas.textContent.trim().length === 0;
}

function configureAssistant() {
  /* Skip configuration on homepage — it has its own AI Interpreter layout */
  if (document.querySelector(".home-ask-panel")) {
    updateSendState();
    setMode(selectedContext);
    return;
  }
  assistantTitle.textContent = "Ask AI Interpreter";
  assistantSubtitle.textContent = "Your AI partner for every marketing task";
  promptCanvas.dataset.placeholder =
    "Type your question or upload Excel/CSV files for data analysis";

  const scopeLabel = askScope.querySelector("span");
  scopeLabel.textContent = "Scope";
  askScope.setAttribute("role", "group");

  const intro = document.createElement("div");
  intro.className = "ask-zone-intro";

  const introCopy = document.createElement("div");
  const introTitle = document.createElement("strong");
  const introDescription = document.createElement("span");
  introTitle.id = "askComposerTitle";
  introTitle.textContent = "Ask a question";
  introDescription.textContent = "Grounded in your connected marketing workspace.";
  introCopy.append(introTitle, introDescription);
  intro.append(introCopy);
  askZone.prepend(intro);

  promptCanvas.setAttribute("aria-labelledby", introTitle.id);
  assistantModal.insertBefore(askZone, assistantLayout);
  setMode(selectedContext);
  updateSendState();
}

function cancelPlatformGuideClose() {
  if (platformGuideCloseTimer === null) return;
  window.clearTimeout(platformGuideCloseTimer);
  platformGuideCloseTimer = null;
}

function closePlatformGuide() {
  cancelPlatformGuideClose();
  platformGuidePinned = false;
  if (platformGuide) platformGuide.hidden = true;
  assistantModal.classList.remove("is-guide-open");
  platformGuideTrigger?.setAttribute("aria-expanded", "false");
}

function openPlatformGuide() {
  if (!platformGuide) return;
  cancelPlatformGuideClose();
  platformGuide.hidden = false;
  assistantModal.classList.add("is-guide-open");
  platformGuideTrigger?.setAttribute("aria-expanded", "true");
}

function schedulePlatformGuideClose() {
  if (platformGuidePinned) return;
  cancelPlatformGuideClose();
  platformGuideCloseTimer = window.setTimeout(() => {
    platformGuideCloseTimer = null;
    closePlatformGuide();
  }, 180);
}

function togglePlatformGuide() {
  if (!platformGuide) return;
  if (platformGuidePinned) {
    closePlatformGuide();
    return;
  }
  platformGuidePinned = true;
  openPlatformGuide();
}

function openAssistant(context = selectedContext) {
  if (assistantPanel.hidden) lastFocusedElement = document.activeElement;
  closePlatformGuide();
  assistantPanel.hidden = false;
  document.body.style.overflow = "hidden";
  // Force hide the AI Interpreter button with highest priority
  if (aiEntry) aiEntry.style.setProperty("display", "none", "important");
  setMode(context);
  window.setTimeout(() => promptCanvas.focus(), 80);
}

function closeAssistant() {
  closePlatformGuide();
  assistantPanel.classList.remove("is-ai-expanded");
  const aiMaximizeBtn = document.querySelector("#aiMaximize");
  if (aiMaximizeBtn) {
    aiMaximizeBtn.setAttribute("aria-label", "Maximize AI Interpreter panel");
    aiMaximizeBtn.title = "Maximize";
  }
  assistantPanel.hidden = true;
  document.body.style.overflow = "";
  // Restore the AI Interpreter button
  if (aiEntry) aiEntry.style.removeProperty("display");
  lastFocusedElement?.focus();
}

function setPrompt(text, context) {
  closePlatformGuide();
  promptCanvas.textContent = text;
  if (assistantPanel.hidden) openAssistant(context);
  else setMode(context);
  updateSendState();
  submitQuery(text);
}

function escapeHtml(value) {
  if (typeof value !== "string") return "";
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );
}

function createAnswer(query) {
  const normalizedQuery =
    query || "Show me the most important campaign movement and the next action to take.";
  const lowerQuery = normalizedQuery.toLowerCase();
  let recommendation =
    "I would connect campaign intent, current performance, governed definitions, and prior learnings, then separate the strongest signal from data-quality noise before recommending the next move.";
  let sources = ["Campaign context", "Performance reports", "Business knowledge"];
  let primaryHref = "assets/pages/reports.html";
  let primaryLabel = "Open performance";

  if (
    ["execution", "launch", "brief", "audience", "campaign plan"].some((term) =>
      lowerQuery.includes(term),
    )
  ) {
    recommendation =
      "Start with the campaign objective and target audience, define each channel's role, assign owners, and agree on launch-readiness checks. I would then connect the tracking metrics and reporting baseline before activation begins.";
    sources = ["Campaign brief", "Audience context", "Measurement plan"];
    primaryLabel = "Open performance baseline";
  } else if (
    ["optimize", "optimization", "next best action", "prior campaign", "learnings"].some((term) =>
      lowerQuery.includes(term),
    )
  ) {
    recommendation =
      "Compare the largest movement across channel, city, and audience, validate freshness and metric definitions, then weigh the finding against prior campaign learnings. The output should be one prioritized action, its expected impact, and the evidence behind it.";
    sources = ["Campaign performance", "Metric Dictionary", "Prior learnings"];
  } else if (lowerQuery.includes("roi")) {
    recommendation =
      "ABO Campaign Quality Watch is the right starting point. Break ROI by platform and city, then compare spend pressure, conversion efficiency, and audience quality before explaining the movement and recommending an action.";
    sources = ["ABO Campaign Quality Watch", "Campaign ROI", "Audience model"];
  } else if (
    lowerQuery.includes("metric") ||
    lowerQuery.includes("definition") ||
    lowerQuery.includes("conversion")
  ) {
    recommendation =
      "Start with the governed definition and formula, then verify the source model, refresh cadence, owner, and every report that uses the metric before interpreting its movement.";
    sources = ["Metric Dictionary", "Customer model", "Linked reports"];
    primaryHref = "assets/pages/knowledge.html?category=metrics";
    primaryLabel = "Open knowledge";
  } else if (
    lowerQuery.includes("model") ||
    lowerQuery.includes("freshness") ||
    lowerQuery.includes("lineage")
  ) {
    recommendation =
      "Trace the source lineage, data grain, refresh state, and known quality notes first. Then identify which report conclusions are reliable and where context is still missing.";
    sources = ["Data Models", "Quality notes", "Linked reports"];
    primaryHref = "assets/pages/knowledge.html?category=models";
    primaryLabel = "Open knowledge";
  } else if (lowerQuery.includes("city")) {
    recommendation =
      "Use City Strategy to compare invested and non-invested cities, isolate the largest week-over-week movement, and separate real business change from missing or delayed source data.";
    sources = ["City Strategy", "City investment", "Business context"];
  } else if (selectedContext === "report") {
    recommendation =
      "Start with the largest movement in the selected report, verify freshness and metric definitions, then compare the strongest city, channel, and audience contributors before choosing the next action.";
    sources = ["Governed reports", "Metric definitions", "Refresh status"];
  } else if (selectedContext === "knowledge") {
    recommendation =
      "Start with the governed business definition, then connect the related metric formula, source model, refresh cadence, owner, and linked reports before applying it to a decision.";
    sources = ["Business terms", "Metric Dictionary", "Data Models"];
    primaryHref = "assets/pages/knowledge.html";
    primaryLabel = "Open knowledge";
  } else if (selectedContext === "campaign") {
    recommendation =
      "I would organize this as a campaign workflow: objective and audience first, activation readiness second, live performance signals third, and one evidence-backed optimization action at the end.";
    sources = ["Campaign workflow", "Performance signals", "Optimization knowledge"];
  } else if (selectedContext === "memory") {
    recommendation =
      "I would combine your saved campaign principles and recent review notes with the live report context, then show where your usual decision pattern agrees or conflicts with the current signal.";
    sources = ["My Memory", "Review notes", "Live report context"];
    primaryHref = "assets/pages/knowledge.html?category=memory";
    primaryLabel = "Open memory";
  }

  return (
    '<div class="answer-entry">' +
    '<div class="user-query"><span class="user-query-bubble">' +
    escapeHtml(query || "") +
    "</span></div>" +
    '<article class="answer-card">' +
    '<div class="answer-card-head"><span>Connected campaign view</span><small>' +
    sources.length +
    " grounded sources</small></div>" +
    "<h3>Recommended next move.</h3>" +
    "<p>" +
    recommendation +
    "</p>" +
    '<div class="answer-source-line" aria-label="Sources">' +
    sources.map((source) => "<span>" + escapeHtml(source) + "</span>").join("") +
    "</div>" +
    '<div class="answer-actions" aria-label="Related actions">' +
    '<a href="' +
    primaryHref +
    '">' +
    primaryLabel +
    "</a>" +
    "<span>Compare movement</span>" +
    "<span>Save learning</span>" +
    "</div>" +
    '<div class="answer-feedback" data-answer-id="' +
    Date.now() +
    '">' +
    '<button type="button" class="answer-feedback-btn" data-feedback="helpful" aria-pressed="false">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>' +
    "<span>Helpful</span>" +
    "</button>" +
    '<button type="button" class="answer-feedback-btn" data-feedback="not-helpful" aria-pressed="false">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>' +
    "<span>Not helpful</span>" +
    "</button>" +
    '<button type="button" class="answer-feedback-btn copy-answer-btn" data-copy aria-label="Copy answer">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
    "<span>Copy</span>" +
    "</button>" +
    "</div>" +
    "</article>" +
    "</div>"
  );
}

function submitQuery(query = promptCanvas.textContent.trim()) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return;
  answerFeed.hidden = false;
  answerFeed.innerHTML = createAnswer(normalizedQuery);
  promptCanvas.textContent = "";
  updateSendState();
  const assistantMain = document.querySelector(".assistant-main");
  window.setTimeout(
    () => assistantMain.scrollTo({ top: assistantMain.scrollHeight, behavior: "smooth" }),
    30,
  );
}

configureAssistant();

aiEntry.addEventListener("click", () => openAssistant(selectedContext));

const homeMaximizeBtn = document.querySelector("#homeMaximize");
if (homeMaximizeBtn) {
  homeMaximizeBtn.addEventListener("click", () => {
    const expanded = assistantPanel.classList.toggle("is-ai-expanded");
    homeMaximizeBtn.setAttribute("aria-label", expanded ? "Restore" : "Maximize");
    homeMaximizeBtn.title = expanded ? "Restore" : "Maximize";
  });
}

const aiMaximizeBtn = document.querySelector("#aiMaximize");
if (aiMaximizeBtn && assistantPanel && !assistantPanel.classList.contains("home-ask-panel")) {
  aiMaximizeBtn.addEventListener("click", () => {
    const expanded = assistantPanel.classList.toggle("is-ai-expanded");
    aiMaximizeBtn.setAttribute(
      "aria-label",
      expanded ? "Restore AI Interpreter panel" : "Maximize AI Interpreter panel",
    );
    aiMaximizeBtn.title = expanded ? "Restore" : "Maximize";
  });
}

const homeHistoryBtn = document.querySelector("#homeHistory");
const homeHistoryPopup = document.querySelector("#homeHistoryPopup");
const homeHistoryPopupClose = document.querySelector("#homeHistoryPopupClose");
const homeHistoryList = document.querySelector("#homeHistoryList");
if (homeHistoryBtn && homeHistoryPopup) {
  const positionHomeHistoryPopup = () => {
    const buttonRect = homeHistoryBtn.getBoundingClientRect();
    const popupRect = homeHistoryPopup.getBoundingClientRect();
    const gap = 8;
    const margin = 12;
    const left = Math.max(margin, buttonRect.left - popupRect.width - gap);
    const top = Math.max(margin, buttonRect.top);
    homeHistoryPopup.style.left = `${left}px`;
    homeHistoryPopup.style.top = `${top}px`;
  };
  homeHistoryBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    homeHistoryPopup.hidden = !homeHistoryPopup.hidden;
    if (!homeHistoryPopup.hidden) positionHomeHistoryPopup();
  });
  if (homeHistoryPopupClose) {
    homeHistoryPopupClose.addEventListener("click", (e) => {
      e.stopPropagation();
      homeHistoryPopup.hidden = true;
    });
  }
  if (homeHistoryList) {
    homeHistoryList.addEventListener("click", (e) => {
      var btn = e.target.closest(".home-history-item");
      if (!btn) return;
      var prompt = btn.dataset.prompt;
      var canvas = document.querySelector("#promptCanvas");
      if (canvas && prompt) canvas.textContent = prompt;
      homeHistoryPopup.hidden = true;
    });
  }
  document.addEventListener("click", (e) => {
    if (homeHistoryPopup.hidden) return;
    if (e.target.closest("#homeHistoryPopup") || e.target.closest("#homeHistory")) return;
    homeHistoryPopup.hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !homeHistoryPopup.hidden) homeHistoryPopup.hidden = true;
  });
  window.addEventListener("resize", () => {
    if (!homeHistoryPopup.hidden) positionHomeHistoryPopup();
  });
}
capabilityAiEntries.forEach((entry) => {
  entry.addEventListener("click", () => openAssistant(entry.dataset.aiEntry || "personalized"));
});
platformGuideTrigger?.addEventListener("click", togglePlatformGuide);

assistantPanel.addEventListener("click", (event) => {
  if (event.target.matches("[data-close]")) closeAssistant();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!assistantPanel.hidden && platformGuide && !platformGuide.hidden) closePlatformGuide();
  else if (!assistantPanel.hidden) closeAssistant();
  else if (reportsMenu && !reportsMenu.hidden) closeReportsMenu(true);
});

scopeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.context || "personalized");
    promptCanvas.focus();
  });
});

promptSuggestions.forEach((row) => {
  row.addEventListener("click", () => {
    setPrompt(row.dataset.prompt, row.dataset.context || "personalized");
  });
});

/* Homepage AI Interpreter suggestion buttons — event delegation */
const askSuggestions = document.querySelector("#askSuggestions");
if (askSuggestions) {
  askSuggestions.addEventListener("click", (event) => {
    const btn = event.target.closest(".ask-suggestion");
    if (!btn) return;
    promptCanvas.textContent = btn.dataset.prompt || "";
    updateSendState();
    promptCanvas.focus();
  });
}

/* Homepage upload button placeholder */
const uploadBtn = document.querySelector("#uploadFile");
if (uploadBtn) {
  uploadBtn.addEventListener("click", () => {
    promptCanvas.focus();
  });
}

/* Upload popup: show on + click, close on outside click */
const uploadPopup = document.querySelector("#uploadPopup");
if (uploadBtn && uploadPopup) {
  uploadBtn.addEventListener("click", (e) => {
    if (document.querySelector(".home-ask-panel")) return;
    e.stopPropagation();
    uploadPopup.hidden = !uploadPopup.hidden;
  });
  document.addEventListener("click", (e) => {
    if (uploadPopup.hidden) return;
    if (e.target.closest("#uploadPopup")) return;
    uploadPopup.hidden = true;
  });
}

/* Upload input dialog: open from popup, close on X/Cancel/scrim/Save */
const uploadDialog = document.querySelector("#uploadDialog");
const uploadDialogScrim = document.querySelector("#uploadDialogScrim");
const uploadDialogText = document.querySelector("#uploadDialogText");
const uploadDialogTitle = document.querySelector("#uploadDialogTitle");
const uploadDialogClose = document.querySelector("#uploadDialogClose");
const uploadDialogCancel = document.querySelector("#uploadDialogCancel");
const uploadDialogSave = document.querySelector("#uploadDialogSave");
const uploadDialogAiFill = document.querySelector("#uploadDialogAiFill");

function openUploadDialog(source) {
  if (!uploadDialog) return;
  var labelMap = {
    business: "Add business knowledge",
    personal: "Add personal memory",
  };
  var placeholderMap = {
    business: "Describe the business rule, definition, or context you want to remember...",
    personal: "Describe a personal preference, decision, or note you want to remember...",
  };
  if (uploadDialogTitle) uploadDialogTitle.textContent = labelMap[source] || "Add details";
  if (uploadDialogText) {
    uploadDialogText.value = "";
    uploadDialogText.placeholder =
      placeholderMap[source] || "Type or describe what you want to add...";
  }
  uploadDialog.dataset.source = source;
  uploadDialog.hidden = false;
  if (uploadDialogScrim) uploadDialogScrim.hidden = false;
  setTimeout(() => {
    if (uploadDialogText) uploadDialogText.focus();
  }, 50);
}

function closeUploadDialog() {
  if (uploadDialog) uploadDialog.hidden = true;
  if (uploadDialogScrim) uploadDialogScrim.hidden = true;
}

document.querySelectorAll("#uploadPopup .upload-popup-item").forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (document.querySelector(".home-ask-panel")) return;
    var source = btn.dataset.source || "business";
    if (uploadPopup) uploadPopup.hidden = true;
    openUploadDialog(source);
  });
});

if (uploadDialogClose) uploadDialogClose.addEventListener("click", closeUploadDialog);
if (uploadDialogCancel) uploadDialogCancel.addEventListener("click", closeUploadDialog);
if (uploadDialogSave) uploadDialogSave.addEventListener("click", closeUploadDialog);
if (uploadDialogScrim) uploadDialogScrim.addEventListener("click", closeUploadDialog);

if (uploadDialogAiFill) {
  uploadDialogAiFill.addEventListener("click", function () {
    if (!uploadDialogText) return;
    uploadDialogText.focus();
  });
}

function updateAiFillState() {
  if (!uploadDialogText || !uploadDialogAiFill) return;
  uploadDialogAiFill.disabled = uploadDialogText.value.trim().length === 0;
}

if (uploadDialogText) {
  uploadDialogText.addEventListener("input", updateAiFillState);
}

/* AI ask skill selector: + opens Analytical Model and Scenario Reporting options. */
(function initAskSkillSelector() {
  if (document.querySelector(".home-ask-panel")) return;
  const addButton = document.querySelector("#uploadFile");
  const composer = document.querySelector(".ask-composer");
  const toolbarActions = document.querySelector(".composer-actions");
  if (!addButton || !composer || !toolbarActions) return;

  addButton.setAttribute("aria-label", "Choose AI skill");
  addButton.setAttribute("aria-haspopup", "menu");
  addButton.setAttribute("aria-expanded", "false");

  const normalizeText = (value) => String(value || "").trim();
  const fallbackAnalytical = [
    {
      id: "playbook-opportunity-scan",
      title: "Opportunity scan playbook",
      note: "Use this interpretation logic",
    },
    {
      id: "roi-diagnosis",
      title: "ROI diagnosis model",
      note: "Analyze ROI movement and drivers",
    },
    {
      id: "conversion-drop",
      title: "Conversion drop analysis",
      note: "Find conversion pressure and likely reasons",
    },
  ];
  const fallbackScenario = [
    {
      id: "scenario-channel-performance",
      title: "Channel Performance Analysis",
      note: "Generate with this report structure",
    },
    {
      id: "scenario-campaign-review",
      title: "Campaign Review Reporting",
      note: "Create a campaign review report",
    },
    {
      id: "scenario-channel-exceptions",
      title: "Channel Exception Watch",
      note: "Summarize exceptions and follow-ups",
    },
  ];

  function readAnalyticalModels() {
    const fromMapping =
      window.knowledgeFieldMapping && typeof window.knowledgeFieldMapping.records === "function"
        ? window.knowledgeFieldMapping.records("Analytical Model")
        : [];
    const fromAssets = Array.isArray(window.marketingKnowledgeAssets)
      ? window.marketingKnowledgeAssets.filter((asset) => asset.type === "Analytical Model")
      : [];
    const merged = [...fromMapping, ...fromAssets];
    const seen = new Set();
    return merged
      .map((item) => ({
        id: item.id || item.analysis_name || item.title,
        title: normalizeText(item.analysis_name || item.title),
        note: normalizeText(item.trigger_when || item.summary || "Use this interpretation logic"),
      }))
      .filter((item) => item.title && !seen.has(item.id) && seen.add(item.id))
      .slice(0, 5);
  }

  function readScenarioReports() {
    const fromScenarioRecords = Array.isArray(window.scenarioReportingRecords)
      ? window.scenarioReportingRecords
      : [];
    const fromAssets = Array.isArray(window.marketingKnowledgeAssets)
      ? window.marketingKnowledgeAssets.filter((asset) => asset.type === "Scenario Reporting")
      : [];
    const merged = [...fromScenarioRecords, ...fromAssets];
    const seen = new Set();
    return merged
      .map((item) => ({
        id: item.id || item.title,
        title: normalizeText(item.title || item.name),
        note: normalizeText(
          item.report
            ? "Generate report for " + item.report
            : item.description || item.summary || "Generate with this report structure",
        ),
      }))
      .filter((item) => item.title && !seen.has(item.id) && seen.add(item.id))
      .slice(0, 5);
  }

  function skillButton(item, type) {
    return (
      '<button class="ai-skill-option" type="button" role="menuitem" data-ai-skill-type="' +
      type +
      '" data-ai-skill-id="' +
      escapeHtml(item.id) +
      '" data-ai-skill-title="' +
      escapeHtml(item.title) +
      '">' +
      "<strong>" +
      escapeHtml(item.title) +
      "</strong><small>" +
      escapeHtml(item.note) +
      "</small></button>"
    );
  }

  const menu = document.createElement("div");
  menu.className = "ai-skill-menu";
  menu.id = "aiSkillMenu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;
  toolbarActions.append(menu);

  const chip = document.createElement("span");
  chip.className = "ai-skill-chip";
  chip.hidden = true;
  chip.innerHTML = '<span></span><button type="button" aria-label="Clear selected skill">×</button>';
  composer.insertBefore(chip, composer.firstElementChild);

  let selectedSkill = null;

  function renderMenu() {
    const analytical = readAnalyticalModels();
    const scenarios = readScenarioReports();
    const analyticalItems = (analytical.length ? analytical : fallbackAnalytical)
      .map((item) => skillButton(item, "Analytical Model"))
      .join("");
    const scenarioItems = (scenarios.length ? scenarios : fallbackScenario)
      .map((item) => skillButton(item, "Scenario Reporting"))
      .join("");
    menu.innerHTML =
      '<section class="ai-skill-group"><h4 class="ai-skill-group-title">Analytical Model <span>解读思路</span></h4>' +
      analyticalItems +
      '</section><section class="ai-skill-group"><h4 class="ai-skill-group-title">Scenario Reporting <span>分析报告</span></h4>' +
      scenarioItems +
      "</section>";
    if (selectedSkill) {
      menu.querySelectorAll(".ai-skill-option").forEach((button) => {
        button.classList.toggle(
          "is-selected",
          button.dataset.aiSkillType === selectedSkill.type &&
            button.dataset.aiSkillTitle === selectedSkill.title,
        );
      });
    }
  }

  function closeMenu() {
    menu.hidden = true;
    addButton.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    renderMenu();
    menu.hidden = false;
    addButton.setAttribute("aria-expanded", "true");
  }

  function updateChip() {
    if (!selectedSkill) {
      chip.hidden = true;
      chip.querySelector("span").textContent = "";
      composer.removeAttribute("data-selected-ai-skill");
      return;
    }
    chip.hidden = false;
    chip.querySelector("span").textContent =
      selectedSkill.type + ": " + selectedSkill.title;
    composer.dataset.selectedAiSkill = selectedSkill.type + " | " + selectedSkill.title;
  }

  addButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  menu.addEventListener("click", (event) => {
    const button = event.target.closest(".ai-skill-option");
    if (!button) return;
    selectedSkill = {
      type: button.dataset.aiSkillType,
      id: button.dataset.aiSkillId,
      title: button.dataset.aiSkillTitle,
    };
    updateChip();
    closeMenu();
    promptCanvas?.focus();
  });

  chip.querySelector("button").addEventListener("click", () => {
    selectedSkill = null;
    updateChip();
    promptCanvas?.focus();
  });

  document.addEventListener("click", (event) => {
    if (menu.hidden) return;
    if (menu.contains(event.target) || addButton.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) closeMenu();
  });
})();

/* Conversation history multi-select popup */
const historyBtn = document.querySelector("#uploadDialogHistory");
const historyPopup = document.querySelector("#uploadHistoryPopup");
const historyList = document.querySelector("#uploadHistoryList");
const historyCount = document.querySelector("#uploadDialogHistoryCount");
const historyPopupCount = document.querySelector("#uploadHistoryPopupCount");
const historyClear = document.querySelector("#uploadHistoryClear");
const historyConfirm = document.querySelector("#uploadHistoryConfirm");
const historyPopupClose = document.querySelector("#uploadHistoryPopupClose");

function updateHistorySelection() {
  if (!historyList) return;
  const checked = historyList.querySelectorAll('input[type="checkbox"]:checked');
  const n = checked.length;
  if (historyCount) {
    historyCount.textContent = n || "";
    historyCount.dataset.count = String(n);
  }
  if (historyPopupCount) {
    historyPopupCount.textContent = n + " selected";
  }
}

if (historyBtn && historyPopup) {
  historyBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    historyPopup.hidden = !historyPopup.hidden;
  });
}

if (historyPopupClose) {
  historyPopupClose.addEventListener("click", function (e) {
    e.stopPropagation();
    historyPopup.hidden = true;
  });
}

if (historyList) {
  historyList.addEventListener("change", updateHistorySelection);
}

if (historyClear) {
  historyClear.addEventListener("click", function () {
    if (!historyList) return;
    historyList.querySelectorAll('input[type="checkbox"]:checked').forEach(function (cb) {
      cb.checked = false;
    });
    updateHistorySelection();
  });
}

if (historyConfirm) {
  historyConfirm.addEventListener("click", function () {
    if (historyPopup) historyPopup.hidden = true;
  });
}

document.addEventListener("click", function (e) {
  if (!historyPopup || historyPopup.hidden) return;
  if (e.target.closest("#uploadHistoryPopup") || e.target.closest("#uploadDialogHistory")) return;
  historyPopup.hidden = true;
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && historyPopup && !historyPopup.hidden) {
    historyPopup.hidden = true;
  }
});

/* Analysis mode picker dropdown */
const modePicker = document.querySelector("#modePicker");
const modePickerMenu = document.querySelector("#modePickerMenu");
if (modePicker && modePickerMenu) {
  const closeModeMenu = () => {
    modePickerMenu.hidden = true;
    modePicker.setAttribute("aria-expanded", "false");
  };
  modePicker.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = !modePickerMenu.hidden;
    if (isOpen) {
      closeModeMenu();
    } else {
      modePickerMenu.hidden = false;
      modePicker.setAttribute("aria-expanded", "true");
    }
  });
  modePickerMenu.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-mode]");
    if (!button) return;
    const mode = button.dataset.mode;
    modePickerMenu.querySelectorAll("button[data-mode]").forEach((item) => {
      item.classList.toggle("active", item.dataset.mode === mode);
    });
    const valueEl = modePicker.querySelector(".composer-picker-value");
    if (valueEl) valueEl.textContent = button.querySelector("strong").textContent;
    closeModeMenu();
  });
  document.addEventListener("click", (event) => {
    if (
      !modePickerMenu.hidden &&
      !modePickerMenu.contains(event.target) &&
      !modePicker.contains(event.target)
    ) {
      closeModeMenu();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modePickerMenu.hidden) {
      closeModeMenu();
    }
  });
}

sendQuery.addEventListener("click", () => submitQuery());

promptCanvas.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submitQuery();
  }
});

promptCanvas.addEventListener("input", updateSendState);

clearPrompt?.addEventListener("click", () => {
  promptCanvas.textContent = "";
  answerFeed.hidden = true;
  updateSendState();
  promptCanvas.focus();
});

/* New session: clear conversation and reset to fresh state */
const newSession = document.querySelector("#newSession");
if (newSession) {
  newSession.addEventListener("click", () => {
    if (promptCanvas) promptCanvas.textContent = "";
    if (answerFeed) {
      answerFeed.innerHTML = "";
      answerFeed.hidden = true;
    }
    const askStage = document.querySelector(".assistant-ask-stage");
    if (askStage) askStage.style.display = "";
    renderSuggestions(selectedContext);
    updateSendState();
    if (promptCanvas) promptCanvas.focus();
  });
}

const requestedAiContext = new URLSearchParams(window.location.search).get("ask");

if (requestedAiContext && modeNames[requestedAiContext]) {
  openAssistant(requestedAiContext);
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("ask");
  window.history.replaceState({}, "", `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
}

/* Answer feedback (like/dislike) and copy — global event delegation */
document.addEventListener("click", function (event) {
  const btn = event.target.closest(".answer-feedback-btn");
  if (!btn) return;
  const feedbackBar = btn.closest(".answer-feedback");
  if (!feedbackBar) return;

  if (btn.hasAttribute("data-copy")) {
    var card = btn.closest(".answer-card");
    var text = card && card.textContent ? card.textContent.trim() : "";
    if (text && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(function () {
          btn.querySelector("span").textContent = "Copied!";
          setTimeout(function () {
            btn.querySelector("span").textContent = "Copy";
          }, 1500);
        })
        .catch(function () {
          /* ignore */
        });
    }
    return;
  }

  /* Like / Dislike toggle */
  var feedback = btn.dataset.feedback;
  var allBtns = feedbackBar.querySelectorAll(".answer-feedback-btn[data-feedback]");
  allBtns.forEach(function (b) {
    var isActive = b.dataset.feedback === feedback && b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(isActive));
    b.classList.toggle("active", isActive);
  });
});
}
