const tabs = document.querySelectorAll(".flexible-tab");
const panels = document.querySelectorAll(".flexible-panel");

function setActivePanel(panelId) {
  tabs.forEach((tab) => {
    const active = tab.dataset.panel === panelId;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  panels.forEach((panel) => {
    panel.hidden = panel.id !== panelId;
  });
  const toggleSS = document.getElementById("categoryTogglesSelfService");
  if (toggleSS) toggleSS.hidden = panelId !== "self-service-panel";
  const toggleDU = document.getElementById("categoryTogglesDataUpload");
  if (toggleDU) toggleDU.hidden = panelId !== "data-upload-panel";
}

tabs.forEach((tab) => tab.addEventListener("click", () => setActivePanel(tab.dataset.panel)));

/* ── Category Filter (All / DG / DC, All / FIN) ── */
function bindCategoryToggles(togglesId, panelId, cardSelector) {
  const wraps = document.getElementById(togglesId);
  if (!wraps) return;
  const pills = wraps.querySelectorAll(".category-pill");
  const panel = document.getElementById(panelId);
  if (!panel) return;
  function applyFilter(category) {
    panel.querySelectorAll(cardSelector).forEach(function (card) {
      const cardCat = (card.getAttribute("data-category") || "").toLowerCase();
      const visible = category === "all" || cardCat === category;
      card.hidden = !visible;
    });
  }
  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      const category = pill.dataset.category || "all";
      pills.forEach(function (b) {
        const active = b === pill;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      applyFilter(category);
    });
  });
  applyFilter("all");
}
bindCategoryToggles("categoryTogglesSelfService", "self-service-panel", ".report-card");
bindCategoryToggles("categoryTogglesDataUpload", "data-upload-panel", ".upload-card");

function selectedFilters() {
  return ["periodFilter", "channelFilter", "campaignFilter", "cityFilter"].map(
    (id) => document.querySelector(`#${id}`).value,
  );
}

function downloadCurrentView() {
  const [period, channel, campaign, city] = selectedFilters();
  const csv = `Reporting period,Media channel,Campaign,City\n"${period}","${channel}","${campaign}","${city}"\n`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = "dg-mz-data.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

var openAnalysis = document.querySelector("#openAnalysis");
if (openAnalysis) {
  openAnalysis.addEventListener("click", () => {
    const [period, channel, campaign, city] = selectedFilters();
    document.querySelector("#analysisSummary").textContent =
      `${period} / ${channel} / ${campaign} / ${city}`;
    document.querySelector("#analysisWorkbench").hidden = false;
  });
}
var downloadBtn = document.querySelector("#downloadData");
if (downloadBtn) downloadBtn.addEventListener("click", downloadCurrentView);
var wbBtn = document.querySelector("#downloadWorkbench");
if (wbBtn) wbBtn.addEventListener("click", downloadCurrentView);
var offlineInput = document.querySelector("#offlineDataFile");
if (offlineInput) {
  offlineInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    document.querySelector("#uploadFileName").textContent = file
      ? `${file.name} selected and ready for validation`
      : "No file selected";
  });
}

function activateTabFromUrl() {
  const tab = new URLSearchParams(window.location.search).get("tab");
  setActivePanel(tab === "upload" ? "data-upload-panel" : "self-service-panel");
}
activateTabFromUrl();
window.addEventListener("pageshow", activateTabFromUrl);

/* ── Upload History Modal ── */
(function () {
  const modal = document.getElementById("uploadHistoryModal");
  const titleEl = document.getElementById("uploadHistoryTitle");
  const rowsEl = document.getElementById("uploadHistoryRows");
  const emptyEl = document.getElementById("uploadHistoryEmpty");
  if (!modal || !titleEl || !rowsEl) return;

  const moduleTitles = {
    "store-performance": "Store Performance",
    "channel-mix": "Channel Mix Upload",
    "campaign-spend": "Campaign Spend",
  };

  const moduleHistory = {
    "store-performance": [
      {
        file: "finance_pilot_city_2026Q3.xlsx",
        uploader: "Wang Chen",
        time: "2 days ago",
        size: "248 KB",
      },
      {
        file: "finance_pilot_city_metrics_sept_v2.xlsx",
        uploader: "Liu Yang",
        time: "5 days ago",
        size: "186 KB",
      },
      {
        file: "finance_pilot_city_daily_2026W38.xlsx",
        uploader: "Zhang Wei",
        time: "1 week ago",
        size: "92 KB",
      },
      {
        file: "Finance_Pilot_City_Sales_0525.xlsx",
        uploader: "Sarah Lin",
        time: "2 weeks ago",
        size: "312 KB",
      },
      {
        file: "finance_pilot_city_weekly_template.xlsx",
        uploader: "System",
        time: "3 weeks ago",
        size: "48 KB",
      },
    ],
    "channel-mix": [
      { file: "channel_mix_oct.xlsx", uploader: "Liu Yang", time: "1 day ago", size: "172 KB" },
      {
        file: "channel_performance_q3.xlsx",
        uploader: "Wang Chen",
        time: "1 week ago",
        size: "204 KB",
      },
      {
        file: "display_rednote_sept.xlsx",
        uploader: "Marketing Team",
        time: "2 weeks ago",
        size: "138 KB",
      },
      {
        file: "channel_breakdown_w37.xlsx",
        uploader: "Sarah Lin",
        time: "3 weeks ago",
        size: "76 KB",
      },
    ],
    "campaign-spend": [
      {
        file: "campaign_spend_q3_final.xlsx",
        uploader: "Sarah Lin",
        time: "3 days ago",
        size: "320 KB",
      },
      {
        file: "activation_costs_oct.xlsx",
        uploader: "Wang Chen",
        time: "1 week ago",
        size: "164 KB",
      },
      {
        file: "partnership_costs_q3.xlsx",
        uploader: "Finance",
        time: "2 weeks ago",
        size: "98 KB",
      },
      {
        file: "holiday_budget_v3.xlsx",
        uploader: "Marketing Team",
        time: "1 month ago",
        size: "412 KB",
      },
    ],
  };

  const fallbackNames = {
    "store-performance": "store-performance.xlsx",
    "channel-mix": "channel-mix.xlsx",
    "campaign-spend": "campaign-spend.xlsx",
  };

  function escapeHtml(value) {
    if (typeof value !== "string") return "";
    return value.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c];
    });
  }

  function openHistory(card) {
    const moduleId = card.getAttribute("data-module") || "";
    const moduleName =
      moduleTitles[moduleId] ||
      (card.querySelector("h3") &&
        card.querySelector("h3").firstChild &&
        card.querySelector("h3").firstChild.textContent.trim()) ||
      "Module";
    const rows = moduleHistory[moduleId] || [];

    titleEl.textContent = "Upload History";

    if (!rows.length) {
      rowsEl.innerHTML = "";
      emptyEl.hidden = false;
    } else {
      emptyEl.hidden = true;
      rowsEl.innerHTML = rows
        .map(function (row) {
          var fileEnc = encodeURIComponent(row.file);
          return (
            "<tr>" +
            '<td><span class="upload-history-file">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
            "<span>" +
            escapeHtml(row.file) +
            "</span>" +
            "</span></td>" +
            '<td class="upload-history-uploader">' +
            escapeHtml(row.uploader) +
            "</td>" +
            '<td class="upload-history-time">' +
            escapeHtml(row.time) +
            "</td>" +
            '<td><div class="history-actions">' +
            '<button type="button" class="history-preview-btn" data-file="' +
            fileEnc +
            '" aria-label="Preview ' +
            escapeHtml(row.file) +
            '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>' +
            "<span>Preview</span>" +
            "</button>" +
            '<a href="#" class="history-download-btn" data-file="' +
            fileEnc +
            '" aria-label="Download ' +
            escapeHtml(row.file) +
            '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
            "<span>Download</span>" +
            "</a>" +
            "</div></td>" +
            "</tr>"
          );
        })
        .join("");
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeHistory() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".upload-card .history-icon").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const card = btn.closest(".upload-card");
      if (card) openHistory(card);
    });
  });

  modal.addEventListener("click", function (event) {
    if (event.target.matches("[data-close]") || event.target.closest("[data-close]")) {
      closeHistory();
      return;
    }
    var dl = event.target.closest(".history-download-btn");
    if (dl) {
      event.preventDefault();
      var file = dl.getAttribute("data-file") || "file.xlsx";
      if (window.console && console.log)
        console.log("[History Download]", decodeURIComponent(file));
      return;
    }
    var pv = event.target.closest(".history-preview-btn");
    if (pv) {
      var pfile = pv.getAttribute("data-file") || "file.xlsx";
      if (window.console && console.log)
        console.log("[History Preview]", decodeURIComponent(pfile));
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) closeHistory();
  });
})();

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
    knowledge: "Knowledge Base",
    memory: "Saved knowledge",
  };

  const scopeDescriptions = {
    personalized: "Ask questions across the entire Marketing Portal",
    campaign: "Ask questions about Campaigns",
    report: "Ask questions about Dashboards",
    knowledge: "Ask questions about Knowledge Base",
    memory: "Ask questions about Memory",
  };

  const initialActiveScope = document.querySelector(".scope-option.active");
  let selectedContext = (initialActiveScope && initialActiveScope.dataset.context) || "report";
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
    setMode(context);
    renderSuggestions(context);
    window.setTimeout(function () {
      if (promptCanvas) promptCanvas.focus();
    }, 80);
  }

  function closeAssistant() {
    assistantPanel.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function createAnswer(query) {
    var normalizedQuery = query || "Show me the latest report insights.";
    var recommendation =
      "Based on current report data and flexible analysis views, here are the key findings.";
    var findings = [
      {
        label: "Media Monitoring",
        detail:
          "DG MZ data shows consistent channel performance with Rednote leading in engagement metrics.",
      },
      {
        label: "Data Upload Status",
        detail: "Last offline data upload was validated successfully — 341 records processed.",
      },
      {
        label: "Cross-Channel Comparison",
        detail:
          "City Strategy reports show 10% traffic uplift in invest cities across all monitored channels.",
      },
    ];
    var sources = [
      "Flexible Analysis / DG MZ Data",
      "Performance Tracking / City Strategy",
      "Data Upload / Validated Records",
    ];
    return (
      '<div class="answer-entry">' +
      '<div class="user-query"><span class="user-query-bubble">' +
      escapeHtml(query || "") +
      "</span></div>" +
      '<article class="answer-card">' +
      '<div class="answer-card-header"><strong>AI Response</strong><span>Context: Reports</span></div>' +
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
    openAssistant("report");
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
      setMode(btn.dataset.context || "report");
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

  renderSuggestions("report");
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
