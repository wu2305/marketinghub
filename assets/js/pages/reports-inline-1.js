(function () {
  var scopeBtns = document.querySelectorAll(".scope-option");
  var descEl = document.getElementById("askScopeDescription");
  var modelPicker = document.getElementById("modelPicker");
  var modePicker = document.getElementById("modePicker");
  var descriptions = {
    report: "Ask questions about Dashboards",
    campaign: "Ask questions about Campaigns",
    knowledge: "Ask questions about Knowledge",
  };
  var askSuggestions = document.getElementById("askSuggestions");
  var scopeSuggestions = {
    report: [
      {
        prompt: "Show me the ROI trend across my active campaigns this quarter.",
        label: "ROI trend across active campaigns",
      },
      {
        prompt: "Which campaigns are near budget threshold and need attention?",
        label: "Campaigns near budget threshold",
      },
      {
        prompt: "Compare city performance across invest and non-invest cities.",
        label: "Compare city performance",
      },
    ],
    campaign: [
      { prompt: "Which campaigns have the highest ROI this week?", label: "Top ROI campaigns" },
      {
        prompt: "Show me campaigns that are underperforming this month.",
        label: "Underperforming campaigns",
      },
      {
        prompt: "Summarize the automation task queue and next best actions.",
        label: "Automation task queue overview",
      },
    ],
    knowledge: [
      {
        prompt: 'What is the governed definition of "Attributed ROI"?',
        label: "Definition of Attributed ROI",
      },
      {
        prompt: "Show me the data models connected to City Strategy reports.",
        label: "Data models for City Strategy",
      },
      {
        prompt: "Which metrics have incomplete backflow and need review?",
        label: "Metrics with quality issues",
      },
    ],
  };
  function renderSuggestions(context) {
    if (!askSuggestions) return;
    var items = scopeSuggestions[context] || scopeSuggestions.report;
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
  }
  function setScope(context) {
    scopeBtns.forEach(function (btn) {
      var isActive = btn.dataset.context === context;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    if (descEl) descEl.textContent = descriptions[context] || "";
    if (modelPicker) modelPicker.hidden = context === "knowledge";
    if (modePicker) modePicker.hidden = context === "knowledge";
    renderSuggestions(context);
  }
  scopeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setScope(btn.dataset.context);
    });
  });
  var activeScope = document.querySelector(".scope-option.active");
  if (activeScope) setScope(activeScope.dataset.context);

  /* Copilot panel: upload popup + ASK button enable/disable */
  var aiUpload = document.getElementById("aiCmdUpload");
  var aiUploadPopup = document.getElementById("aiCmdUploadPopup");
  if (aiUpload && aiUploadPopup) {
    aiUpload.addEventListener("click", function (event) {
      event.stopPropagation();
      aiUploadPopup.hidden = !aiUploadPopup.hidden;
    });
    document.addEventListener("click", function (event) {
      if (
        !aiUploadPopup.hidden &&
        !aiUploadPopup.contains(event.target) &&
        event.target !== aiUpload
      ) {
        aiUploadPopup.hidden = true;
      }
    });
    aiUploadPopup.querySelectorAll(".upload-popup-item").forEach(function (item) {
      item.addEventListener("click", function () {
        aiUploadPopup.hidden = true;
        var source = item.dataset.source;
        if (source === "business") {
          window.location.href = "knowledge.html";
        } else if (source === "personal") {
          window.location.href = "personal-memory.html";
        }
      });
    });
  }
  var aiInput = document.getElementById("aiCommandInput");
  var aiSend = document.getElementById("aiCmdSend");
  function syncSendState() {
    if (!aiInput || !aiSend) return;
    aiSend.disabled = aiInput.value.trim().length === 0;
  }
  if (aiInput && aiSend) {
    aiInput.addEventListener("input", syncSendState);
    syncSendState();
  }

  /* Main AI panel: ASK button enable/disable */
  var mainInput = document.getElementById("promptCanvas");
  var mainSend = document.getElementById("sendQuery");
  function syncMainSendState() {
    if (!mainInput || !mainSend) return;
    var text = (mainInput.textContent || mainInput.innerText || "").trim();
    mainSend.disabled = text.length === 0;
  }
  if (mainInput && mainSend) {
    mainInput.addEventListener("input", syncMainSendState);
    syncMainSendState();
  }

  /* Main AI panel: new session button */
  var newSessionBtn = document.getElementById("newSession");
  if (newSessionBtn) {
    newSessionBtn.addEventListener("click", function () {
      if (mainInput) mainInput.textContent = "";
      if (answerFeed) {
        answerFeed.innerHTML = "";
        answerFeed.hidden = true;
      }
      if (askStage) askStage.style.display = "";
      syncMainSendState();
      if (mainInput) mainInput.focus();
    });
  }

  /* Main AI panel: suggestion click → auto-fill + send → answer display */
  var answerFeed = document.getElementById("answerFeed");
  var askStage = document.querySelector(".assistant-ask-stage");

  function createMainAnswer(query) {
    var q = (query || "").toLowerCase();
    var rec =
      "Connect campaign intent, current performance, governed definitions, and prior learnings to separate the strongest signal from data-quality noise before recommending the next move.";
    var sources = ["Campaign context", "Performance reports", "Business knowledge"];
    if (/execution|launch|brief|audience|campaign plan/i.test(q)) {
      rec =
        "Start with the campaign objective and target audience, define each channel role, assign owners, and agree on launch-readiness checks. Connect tracking metrics and reporting baseline before activation begins.";
      sources = ["Campaign brief", "Audience context", "Measurement plan"];
    } else if (/optimize|next best|prior campaign|learnings/i.test(q)) {
      rec =
        "Compare the largest movement across channel, city, and audience. Validate freshness and metric definitions, weigh against prior learnings. Output: one prioritized action, expected impact, and evidence.";
      sources = ["City performance", "Campaign history", "Governed metrics"];
    } else if (/roi|budget|threshold|alert/i.test(q)) {
      rec =
        "Cross-check budget pacing against performance thresholds across active campaigns. Flag any campaign exceeding 80% spend before midpoint, and surface the underlying metric trends driving the alert.";
      sources = ["Budget reports", "Campaign ROI", "Performance alerts"];
    }
    var html = '<div class="answer-entry">';
    html +=
      '<div class="user-query"><span class="user-query-bubble">' +
      escapeHtml(query || "") +
      "</span></div>";
    html += '<div class="answer-card">';
    html += '<div class="answer-recommendation"><p>' + rec + "</p></div>";
    html +=
      '<div class="answer-sources"><span>Sources used</span><div>' +
      sources
        .map(function (s) {
          return "<span>" + s + "</span>";
        })
        .join("") +
      "</div></div>";
    html += '<div class="answer-feedback" data-answer-id="' + Date.now() + '">';
    html +=
      '<button type="button" class="answer-feedback-btn" data-feedback="helpful" aria-pressed="false">';
    html +=
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
    html += "<span>Helpful</span></button>";
    html +=
      '<button type="button" class="answer-feedback-btn" data-feedback="not-helpful" aria-pressed="false">';
    html +=
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>';
    html += "<span>Not helpful</span></button>";
    html +=
      '<button type="button" class="answer-feedback-btn copy-answer-btn" data-copy aria-label="Copy answer">';
    html +=
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    html += "<span>Copy</span></button>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    return html;
  }

  function submitMainQuery(query) {
    if (!query) {
      query = mainInput && mainInput.textContent ? mainInput.textContent.trim() : "";
    }
    if (!query) return;
    if (!answerFeed) return;
    answerFeed.hidden = false;
    if (askStage) askStage.style.display = "none";
    answerFeed.innerHTML += createMainAnswer(query);
    if (mainInput) mainInput.textContent = "";
    syncMainSendState();
    answerFeed.scrollTo({ top: answerFeed.scrollHeight, behavior: "smooth" });
  }

  if (mainSend) {
    mainSend.addEventListener("click", function () {
      submitMainQuery();
    });
  }

  /* Suggestion buttons — use event delegation (rendered dynamically) */
  var askSuggestions = document.getElementById("askSuggestions");
  if (askSuggestions) {
    askSuggestions.addEventListener("click", function (e) {
      var btn = e.target.closest(".ask-suggestion");
      if (!btn) return;
      var prompt = btn.dataset.prompt || "";
      if (mainInput) mainInput.textContent = prompt;
      syncMainSendState();
      submitMainQuery(prompt);
    });
  }

  function escapeHtml(val) {
    if (typeof val !== "string") return "";
    return val.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c];
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
