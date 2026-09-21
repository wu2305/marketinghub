(function () {
  if (document.querySelector("#assistantPanel")) return;

  const launchers = document.querySelectorAll(".global-ai-launcher");
  if (!launchers.length) return;

  const panel = document.createElement("section");
  panel.className = "assistant-panel";
  panel.id = "assistantPanel";
  panel.dataset.litePanel = "true";
  panel.hidden = true;
  panel.setAttribute("aria-label", "AI Interpreter");
  panel.innerHTML =
    '<div class="panel-backdrop" data-close></div>' +
    '<div class="assistant-modal" role="dialog" aria-modal="true" aria-labelledby="assistantTitle">' +
    '<header class="assistant-header">' +
    '<div class="assistant-identity"><span class="assistant-mark">AI</span><div><h2 id="assistantTitle">Ask AI Interpreter</h2></div></div>' +
    '<div class="assistant-header-actions">' +
    '<button class="ai-workspace-icon" type="button" id="aiNewSession" aria-label="New session"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg></button>' +
    '<button class="ai-workspace-icon" type="button" id="aiMaximize" aria-label="Maximize"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5"></path><path d="M16 3h5v5"></path><path d="M21 16v5h-5"></path><path d="M3 16v5h5"></path></svg></button>' +
    '<button class="ai-workspace-icon" type="button" id="aiHistory" aria-label="History"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l3 2"></path></svg></button>' +
    '<button class="close-btn" type="button" id="closeAssistant" aria-label="Close assistant">&times;</button>' +
    "</div>" +
    "</header>" +
    '<div class="assistant-main"><div class="assistant-ask-stage"><div class="ask-stage-hero"><div class="ask-stage-headline"><h3>Ask a question</h3><p>Your AI partner for every marketing task</p></div><div class="ask-stage-suggestions" id="askSuggestions"><button class="ask-suggestion" type="button" data-prompt="Definition of Attributed ROI">Definition of Attributed ROI</button><button class="ask-suggestion" type="button" data-prompt="City investment strategy knowledge">City investment strategy knowledge</button><button class="ask-suggestion" type="button" data-prompt="Metrics with data quality issues">Metrics with data quality issues</button></div></div></div><div class="answer-feed" id="answerFeed" hidden></div></div>' +
    '<section class="ask-zone" aria-label="Ask AI Interpreter AI"><div class="ask-meta"><div class="ask-scope" role="group" aria-label="Response scope"><span>Scope</span><button class="scope-option active" type="button" data-context="knowledge" aria-pressed="true">Knowledge</button></div></div><div class="ask-composer"><div class="query-canvas" id="promptCanvas" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Ask AI Interpreter AI" data-placeholder="Type your question or upload Excel/CSV files for data analysis"></div><div class="composer-toolbar"><div class="composer-actions"><button class="upload-action" type="button" id="uploadFile" aria-label="Choose AI skill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button></div><button class="send-action" type="button" id="sendQuery" aria-label="Ask" disabled><span>ASK</span></button></div></div></section>' +
    "</div>";
  document.body.append(panel);

  const promptCanvas = panel.querySelector("#promptCanvas");
  const sendButton = panel.querySelector("#sendQuery");
  const answerFeed = panel.querySelector("#answerFeed");
  const maximizeButton = panel.querySelector("#aiMaximize");
  const historyButton = panel.querySelector("#aiHistory");
  const newSessionButton = panel.querySelector("#aiNewSession");

  function openAssistant() {
    panel.hidden = false;
    document.body.style.overflow = "hidden";
    launchers.forEach((launcher) => launcher.style.setProperty("display", "none", "important"));
    window.setTimeout(() => promptCanvas.focus(), 80);
  }

  function closeAssistant() {
    panel.classList.remove("is-ai-expanded");
    maximizeButton.setAttribute("aria-label", "Maximize");
    maximizeButton.title = "Maximize";
    panel.hidden = true;
    document.body.style.overflow = "";
    launchers.forEach((launcher) => launcher.style.removeProperty("display"));
  }

  function updateSendState() {
    sendButton.disabled = promptCanvas.textContent.trim().length === 0;
  }

  function submitQuery() {
    const query = promptCanvas.textContent.trim();
    if (!query) return;
    answerFeed.hidden = false;
    answerFeed.innerHTML =
      '<article class="answer-card"><p>I will use the AI Interpreter knowledge context to answer: <strong>' +
      query.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]) +
      "</strong></p></article>";
    promptCanvas.textContent = "";
    updateSendState();
  }

  function resetSession() {
    answerFeed.hidden = true;
    answerFeed.innerHTML = "";
    promptCanvas.textContent = "";
    updateSendState();
    promptCanvas.focus();
  }

  function toggleMaximize() {
    const expanded = panel.classList.toggle("is-ai-expanded");
    maximizeButton.setAttribute("aria-label", expanded ? "Restore" : "Maximize");
    maximizeButton.title = expanded ? "Restore" : "Maximize";
  }

  if (!panel.querySelector("#aiRecentHistoryPopup")) {
    const historyPopup = document.createElement("div");
    historyPopup.className = "ai-recent-history";
    historyPopup.id = "aiRecentHistoryPopup";
    historyPopup.hidden = true;
    historyPopup.innerHTML =
      '<div class="ai-recent-history-head"><strong>Recent Chats</strong><button type="button" aria-label="Close recent chats">×</button></div>' +
      '<button type="button" class="ai-recent-chat" data-chat="Summarize the latest media tracking performance."><strong>Media tracking summary</strong><span>Summarize the latest media tracking performance.</span></button>' +
      '<button type="button" class="ai-recent-chat" data-chat="Find channels with data quality issues."><strong>Data quality issues</strong><span>Find channels with data quality issues.</span></button>' +
      '<button type="button" class="ai-recent-chat" data-chat="Explain the Attributed ROI movement."><strong>Attributed ROI</strong><span>Explain the Attributed ROI movement.</span></button>';
    historyButton.insertAdjacentElement("afterend", historyPopup);

    historyButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      historyPopup.hidden = !historyPopup.hidden;
    });
    historyPopup.querySelector(".ai-recent-history-head button").addEventListener("click", () => {
      historyPopup.hidden = true;
    });
    historyPopup.addEventListener("click", (event) => {
      const chat = event.target.closest(".ai-recent-chat");
      if (!chat) return;
      promptCanvas.textContent = chat.dataset.chat || "";
      updateSendState();
      promptCanvas.focus();
      historyPopup.hidden = true;
    });
    document.addEventListener("click", (event) => {
      if (historyPopup.hidden) return;
      if (historyPopup.contains(event.target) || historyButton.contains(event.target)) return;
      historyPopup.hidden = true;
    });
  }

  launchers.forEach((launcher) => launcher.addEventListener("click", openAssistant));
  panel.querySelector("[data-close]").addEventListener("click", closeAssistant);
  panel.querySelector("#closeAssistant").addEventListener("click", closeAssistant);
  newSessionButton.addEventListener("click", resetSession);
  maximizeButton.addEventListener("click", toggleMaximize);
  promptCanvas.addEventListener("input", updateSendState);
  sendButton.addEventListener("click", submitQuery);
  panel.querySelector("#askSuggestions").addEventListener("click", (event) => {
    const suggestion = event.target.closest(".ask-suggestion");
    if (!suggestion) return;
    promptCanvas.textContent = suggestion.dataset.prompt || suggestion.textContent.trim();
    updateSendState();
    promptCanvas.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closeAssistant();
  });
})();
