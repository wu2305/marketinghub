const viewButtons = document.querySelectorAll("[data-view-target]");
const campaignViews = document.querySelectorAll("[data-campaign-view]");
const validViews = new Set(Array.from(campaignViews, (view) => view.dataset.campaignView));
const channelTabs = document.querySelectorAll("[data-channel]");
const accountSearchForm = document.querySelector("#accountSearchForm");
const accountSearch = document.querySelector("#accountSearch");
const accountReset = document.querySelector("#accountReset");
const accountRows = document.querySelectorAll("#accountTable tbody tr");
const accountTableResult = document.querySelector("#accountTableResult");
const taskDialog = document.querySelector("#taskDialog");
const taskForm = document.querySelector("#taskForm");
const actionToast = document.querySelector("#actionToast");

let toastTimer = null;

function showView(viewName, updateUrl = true) {
  const nextView = validViews.has(viewName) ? viewName : "overview";

  campaignViews.forEach((view) => {
    const isActive = view.dataset.campaignView === nextView;
    view.hidden = !isActive;
    view.classList.toggle("active", isActive);
  });

  viewButtons.forEach((button) => {
    const isActive = button.dataset.viewTarget === nextView;
    button.classList.toggle("active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });

  if (updateUrl) window.history.replaceState({}, "", "#" + nextView);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function filterAccounts() {
  const query = accountSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  accountRows.forEach((row) => {
    const isVisible = !query || row.cells[0].textContent.toLowerCase().includes(query);
    row.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  accountTableResult.textContent =
    visibleCount + " " + (visibleCount === 1 ? "account" : "accounts") + " shown";
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  actionToast.textContent = message;
  actionToast.hidden = false;
  toastTimer = window.setTimeout(() => {
    actionToast.hidden = true;
  }, 2600);
}

function openTaskDialog() {
  if (typeof taskDialog.showModal === "function") taskDialog.showModal();
  else taskDialog.setAttribute("open", "");
  document.body.classList.add("dialog-open");
}

function closeTaskDialog() {
  if (taskDialog.open && typeof taskDialog.close === "function") taskDialog.close();
  else taskDialog.removeAttribute("open");
  document.body.classList.remove("dialog-open");
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.viewTarget));
});

channelTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    channelTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
  });
});

accountSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterAccounts();
});

accountSearch.addEventListener("input", filterAccounts);

accountReset.addEventListener("click", () => {
  accountSearch.value = "";
  filterAccounts();
  accountSearch.focus();
});

document.querySelectorAll("[data-open-task]").forEach((button) => {
  button.addEventListener("click", openTaskDialog);
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", closeTaskDialog);
});

document.querySelectorAll("[data-demo-action]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.demoAction));
});

taskDialog.addEventListener("click", (event) => {
  if (event.target === taskDialog) closeTaskDialog();
});

taskDialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  closeTaskDialog();
  showToast("Campaign task added to the review queue.");
});

window.addEventListener("hashchange", () => {
  showView(window.location.hash.slice(1), false);
});

showView(window.location.hash.slice(1) || "overview", false);

/* ── Global AI Sidebar ── */
(function () {
  const assistantPanel = document.querySelector("#assistantPanel");
  const aiEntry = document.querySelector("#aiEntry");
  const promptCanvas = document.querySelector("#promptCanvas");
  const answerFeed = document.querySelector("#answerFeed");
  const activeContext = document.querySelector("#activeContext");
  const scopeButtons = document.querySelectorAll(".scope-option");
  const sendQuery = document.querySelector("#sendQuery");
  const clearPrompt = document.querySelector("#clearPrompt");
  const askSuggestions = document.querySelector("#askSuggestions");

  if (!assistantPanel || !aiEntry) return;

  const scopeSuggestions = {
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

  const modeStatus = {
    campaign: "Campaign workspace",
    report: "Dashboards",
    knowledge: "AI Interpreter",
    memory: "Saved knowledge",
  };

  const scopeDescriptions = {
    personalized: "Ask questions across the entire Marketing Portal",
    campaign: "Ask questions about Campaigns",
    report: "Ask questions about Dashboards",
    knowledge: "Ask questions about AI Interpreter",
    memory: "Ask questions about Memory",
  };

  const initialActiveScope = document.querySelector(".scope-option.active");
  let selectedContext = (initialActiveScope && initialActiveScope.dataset.context) || "campaign";
  let lastFocusedElement = null;

  function escapeHtml(value) {
    if (typeof value !== "string") return "";
    return value.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c];
    });
  }

  function renderSuggestions(context) {
    if (!askSuggestions) return;
    var items = scopeSuggestions[context] || [];
    askSuggestions.innerHTML = items
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
    var descriptionEl = document.querySelector("#askScopeDescription");
    if (descriptionEl) {
      descriptionEl.textContent = scopeDescriptions[context] || scopeDescriptions.personalized;
    }
  }

  function setMode(context) {
    selectedContext = context;
    if (activeContext) activeContext.textContent = modeStatus[context] || context;
    scopeButtons.forEach(function (btn) {
      var isActive = btn.dataset.context === context;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    renderSuggestions(context);
  }

  function updateSendState() {
    if (sendQuery) sendQuery.disabled = !(promptCanvas && promptCanvas.textContent.trim().length);
  }

  function openAssistant(context) {
    if (!context) context = selectedContext;
    if (assistantPanel.hidden) lastFocusedElement = document.activeElement;
    assistantPanel.hidden = false;
    document.body.style.overflow = "hidden";
    if (aiEntry) aiEntry.style.setProperty("display", "none", "important");
    setMode(context);
    renderSuggestions(context);
    window.setTimeout(function () {
      if (promptCanvas) promptCanvas.focus();
    }, 80);
  }

  function closeAssistant() {
    assistantPanel.hidden = true;
    document.body.style.overflow = "";
    if (aiEntry) aiEntry.style.removeProperty("display");
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function createAnswer(query) {
    var normalizedQuery = query || "Show me campaign performance trends.";
    var recommendation = "Based on current campaign data, here are the key findings.";
    var findings = [
      {
        label: "ROI Trend",
        detail:
          "Active campaigns show 12% average ROI this quarter, with Rednote channels outperforming others.",
      },
      {
        label: "Budget Alert",
        detail: "2 campaigns are approaching 90% budget utilization and need attention.",
      },
      {
        label: "Automation Queue",
        detail: "3 tasks pending in review queue — 1 bulk plan creation, 2 status syncs.",
      },
    ];
    var sources = [
      "Campaign Dashboard / Active Plans",
      "Automation Queue / Pending Tasks",
      "Budget Tracker / Real-time",
    ];
    return (
      '<div class="answer-entry">' +
      '<div class="user-query"><span class="user-query-bubble">' +
      escapeHtml(query || "") +
      "</span></div>" +
      '<article class="answer-card">' +
      '<div class="answer-card-header"><strong>AI Response</strong><span>Context: Campaigns</span></div>' +
      '<div class="answer-card-body"><p>' +
      escapeHtml(recommendation) +
      "</p>" +
      findings
        .map(function (f) {
          return (
            '<div class="answer-finding"><strong>' +
            escapeHtml(f.label) +
            "</strong><p>" +
            escapeHtml(f.detail) +
            "</p></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="answer-source-line" aria-label="Sources">' +
      sources
        .map(function (s) {
          return "<span>" + escapeHtml(s) + "</span>";
        })
        .join("") +
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

  function submitQuery(query) {
    if (!query)
      query = promptCanvas && promptCanvas.textContent ? promptCanvas.textContent.trim() : "";
    var normalizedQuery = query.trim();
    if (!normalizedQuery) return;
    if (answerFeed) {
      answerFeed.hidden = false;
      answerFeed.innerHTML = createAnswer(normalizedQuery);
    }
    var assistantMain = document.querySelector(".assistant-main");
    if (assistantMain) {
      window.setTimeout(function () {
        assistantMain.scrollTo({ top: assistantMain.scrollHeight, behavior: "smooth" });
      }, 30);
    }
    if (promptCanvas) promptCanvas.textContent = "";
    updateSendState();
  }

  aiEntry.addEventListener("click", function () {
    openAssistant("campaign");
  });

  assistantPanel.addEventListener("click", function (event) {
    if (event.target.matches("[data-close]") || event.target.closest("[data-close]"))
      closeAssistant();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (assistantPanel && !assistantPanel.hidden) closeAssistant();
  });

  scopeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setMode(btn.dataset.context || "campaign");
      if (promptCanvas) promptCanvas.focus();
    });
  });

  if (askSuggestions) {
    askSuggestions.addEventListener("click", function (event) {
      var suggestionBtn = event.target.closest(".ask-suggestion");
      if (!suggestionBtn) return;
      var prompt = suggestionBtn.dataset.prompt;
      var context = suggestionBtn.dataset.context;
      if (promptCanvas) promptCanvas.textContent = prompt || "";
      if (context) setMode(context);
      updateSendState();
      submitQuery(prompt);
    });
  }

  if (sendQuery) {
    sendQuery.addEventListener("click", function () {
      submitQuery();
    });
  }

  if (clearPrompt) {
    clearPrompt.addEventListener("click", function () {
      if (promptCanvas) promptCanvas.textContent = "";
      updateSendState();
      if (answerFeed) answerFeed.hidden = true;
    });
  }

  if (promptCanvas) {
    promptCanvas.addEventListener("input", updateSendState);
  }

  renderSuggestions("campaign");
  if (sendQuery) sendQuery.disabled = true;

  /* New session: clear conversation and reset */
  var newSession = document.getElementById("newSession");
  if (newSession) {
    newSession.addEventListener("click", function () {
      if (promptCanvas) promptCanvas.textContent = "";
      if (answerFeed) {
        answerFeed.innerHTML = "";
        answerFeed.hidden = true;
      }
      var askStage = document.querySelector(".assistant-ask-stage");
      if (askStage) askStage.style.display = "";
      renderSuggestions(selectedContext);
      if (typeof updateSendState === "function") updateSendState();
      if (promptCanvas) promptCanvas.focus();
    });
  }

  /* Answer feedback & copy */
  document.addEventListener("click", function (event) {
    var btn = event.target.closest(".answer-feedback-btn");
    if (!btn) return;
    var feedbackBar = btn.closest(".answer-feedback");
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
    var feedback = btn.dataset.feedback;
    var allBtns = feedbackBar.querySelectorAll(".answer-feedback-btn[data-feedback]");
    allBtns.forEach(function (b) {
      var isActive = b.dataset.feedback === feedback && b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", String(isActive));
      b.classList.toggle("active", isActive);
    });
  });
})();
