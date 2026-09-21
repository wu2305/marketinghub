(function () {
  document.querySelector("#aiSkillMenu")?.remove();
  document.querySelectorAll(".ai-skill-chip").forEach((chip) => chip.remove());

  const addButton = document.querySelector("#uploadFile");
  const composer = document.querySelector(".ask-composer");
  const toolbarActions = document.querySelector(".composer-actions");
  const promptCanvas = document.querySelector("#promptCanvas");
  const assistantPanel = document.querySelector("#assistantPanel");
  const maximizeButton = document.querySelector("#aiMaximize");
  if (!addButton || !composer || !toolbarActions) return;

  addButton.setAttribute("aria-label", "Choose AI skill");

  document.querySelector("#attachFile")?.remove();
  if (!document.querySelector("#aiAttachmentInput")) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "aiAttachmentInput";
    fileInput.hidden = true;
    fileInput.multiple = true;
    fileInput.accept = ".csv,.xlsx,.xls,.pdf,.doc,.docx,.ppt,.pptx,.txt,image/*";
    addButton.insertAdjacentElement("afterend", fileInput);
  }

  if (
    maximizeButton &&
    assistantPanel &&
    !assistantPanel.classList.contains("home-ask-panel") &&
    assistantPanel.dataset.litePanel !== "true"
  ) {
    maximizeButton.addEventListener("click", () => {
      const expanded = assistantPanel.classList.toggle("is-ai-expanded");
      maximizeButton.setAttribute(
        "aria-label",
        expanded ? "Restore AI Interpreter panel" : "Maximize AI Interpreter panel",
      );
      maximizeButton.title = expanded ? "Restore" : "Maximize";
    });

    document.querySelector("#closeAssistant")?.addEventListener("click", () => {
      assistantPanel.classList.remove("is-ai-expanded");
      maximizeButton.setAttribute("aria-label", "Maximize AI Interpreter panel");
      maximizeButton.title = "Maximize";
    });
  }

  const historyButton = document.querySelector("#aiHistory");
  if (historyButton && !document.querySelector("#aiRecentHistoryPopup")) {
    const historyPopup = document.createElement("div");
    historyPopup.className = "ai-recent-history";
    historyPopup.id = "aiRecentHistoryPopup";
    historyPopup.hidden = true;
    historyPopup.innerHTML =
      '<div class="ai-recent-history-head"><strong>Recent Chats</strong><button type="button" aria-label="Close recent chats">×</button></div>' +
      '<button type="button" class="ai-recent-chat" data-chat="Why did campaign ROI decline last week?"><strong>Campaign ROI decline</strong><span>Why did campaign ROI decline last week?</span></button>' +
      '<button type="button" class="ai-recent-chat" data-chat="Analyze conversion drop by customer segment."><strong>Conversion drop</strong><span>Analyze conversion drop by customer segment.</span></button>' +
      '<button type="button" class="ai-recent-chat" data-chat="Summarize metrics with data quality issues."><strong>Data quality issues</strong><span>Summarize metrics with data quality issues.</span></button>';
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
      if (promptCanvas) {
        promptCanvas.textContent = chat.dataset.chat || "";
        promptCanvas.focus();
        promptCanvas.dispatchEvent(new Event("input", { bubbles: true }));
      }
      historyPopup.hidden = true;
    });
    document.addEventListener("click", (event) => {
      if (historyPopup.hidden) return;
      if (historyPopup.contains(event.target) || historyButton.contains(event.target)) return;
      historyPopup.hidden = true;
    });
  }

  const escapeHtml = (value) =>
    String(value || "").replace(
      /[&<>"']/g,
      (character) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[
          character
        ],
    );
  const normalizeText = (value) => String(value || "").trim();

  const fallbackAnalytical = [
    { id: "playbook-opportunity-scan", title: "Opportunity scan playbook", note: "Use this interpretation logic" },
    { id: "roi-diagnosis", title: "ROI diagnosis model", note: "Analyze ROI movement and drivers" },
    { id: "conversion-drop", title: "Conversion drop analysis", note: "Find conversion pressure and likely reasons" },
  ];

  const skillGroups = {
    Upload: {
      label: "Upload File",
    },
    "Analytical Model": {
      label: "Analytical Model",
      searchPlaceholder: "Search Analytical Model",
    },
  };

  /*
   * Category icons reuse artwork that already ships in the demo, so the "+"
   * menu stays consistent with the rest of the product:
   * - Upload: the upload glyph used by the Template Import button on
   *   data-upload.html.
   * - Analytical Model: the Analytical Model type-card glyph on the AI
   *   Interpreter overview page (typeMeta in assets/js/knowledge/types.js).
   */
  const skillCategoryIcons = {
    Upload:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
    "Analytical Model":
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"></path></svg>',
  };

  function readAnalyticalModels() {
    const fromMapping =
      window.knowledgeFieldMapping && typeof window.knowledgeFieldMapping.records === "function"
        ? window.knowledgeFieldMapping.records("Analytical Model")
        : [];
    const fromAssets = Array.isArray(window.marketingKnowledgeAssets)
      ? window.marketingKnowledgeAssets.filter((asset) => asset.type === "Analytical Model")
      : [];
    const seen = new Set();
    return [...fromMapping, ...fromAssets]
      .map((item) => ({
        id: item.id || item.analysis_name || item.title,
        title: normalizeText(item.analysis_name || item.title),
        note: normalizeText(item.trigger_when || item.summary || "Use this interpretation logic"),
      }))
      .filter((item) => item.title && !seen.has(item.id) && seen.add(item.id))
      .slice(0, 12);
  }

  function getItems(type) {
    const analytical = readAnalyticalModels();
    return analytical.length ? analytical : fallbackAnalytical;
  }

  function skillButton(item, type) {
    return (
      '<button class="ai-skill-option" type="button" role="menuitem" data-ai-skill-type="' +
      type +
      '" data-ai-skill-id="' +
      escapeHtml(item.id) +
      '" data-ai-skill-title="' +
      escapeHtml(item.title) +
      '" data-ai-skill-note="' +
      escapeHtml(item.note) +
      '"><span class="ai-skill-option-head"><strong>' +
      escapeHtml(item.title) +
      '</strong><span class="ai-skill-option-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 4l5 5"></path><path d="M14 5l-7 7v4h4l7-7"></path><path d="M9 15l-5 5"></path></svg></span></span><small>' +
      escapeHtml(item.note) +
      "</small></button>"
    );
  }

  function skillActionIcon(action) {
    if (action === "history") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v10H8l-4 3.5V5.5Z"></path><path d="M8 9h8M8 12h6"></path></svg>';
    }
    if (action === "manual") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l11-11-4-4L4 16v4Z"></path><path d="M13.5 6.5l4 4"></path></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 0 1-2.83 2.83l-.05-.05a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 0 1-4 0v-.08a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.05.05a2 2 0 0 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 0 1 0-4h.08A1.7 1.7 0 0 0 4.6 8.92a1.7 1.7 0 0 0-.34-1.87l-.05-.05a2 2 0 0 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 8.96 4.6 1.7 1.7 0 0 0 10 3.04V3a2 2 0 0 1 4 0v.04a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.05-.05a2 2 0 0 1 2.83 2.83l-.05.05a1.7 1.7 0 0 0-.34 1.87 1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 0 1 0 4h-.04A1.7 1.7 0 0 0 19.4 15Z"></path></svg>';
  }

  function detailAction(action, label) {
    return (
      '<button class="ai-skill-footer-action" type="button" data-ai-skill-action="' +
      action +
      '"><span class="ai-skill-footer-label">' +
      skillActionIcon(action) +
      "<span>" +
      label +
      '</span></span><span aria-hidden="true">›</span></button>'
    );
  }

  addButton.setAttribute("aria-haspopup", "menu");
  addButton.setAttribute("aria-expanded", "false");

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

  let activeType = null;
  let selectedSkill = null;

  function renderMenu() {
    const categories = Object.keys(skillGroups)
      .map(
        (type) =>
          '<button class="ai-skill-category' +
          (type === activeType ? " is-active" : "") +
          '" type="button" role="menuitem" data-ai-skill-category="' +
          type +
          '"><span class="ai-skill-category-main"><span class="ai-skill-category-icon" aria-hidden="true">' +
          (skillCategoryIcons[type] || "") +
          '</span><span>' +
          skillGroups[type].label +
          '</span></span><span aria-hidden="true">›</span></button>',
      )
      .join("");
    menu.innerHTML =
      '<div class="ai-skill-category-panel">' +
      categories +
      '</div><div class="ai-skill-detail-panel" hidden></div>';
    if (activeType) renderDetail(activeType, "", true);
  }

  /* focusSearch is only true for click/keyboard opens; a hover preview must not
     pull focus away from the composer. */
  function renderDetail(type, query, focusSearch) {
    activeType = type;
    menu.querySelectorAll(".ai-skill-category").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.aiSkillCategory === type);
    });

    const config = skillGroups[type];
    const detail = menu.querySelector(".ai-skill-detail-panel");
    if (type === "Upload") {
      document.querySelector("#aiAttachmentInput")?.click();
      closeMenu();
      return;
    }
    const normalizedQuery = normalizeText(query).toLowerCase();
    const items = getItems(type).filter((item) => {
      const haystack = (item.title + " " + item.note).toLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    });
    const itemMarkup = items.length
      ? items.map((item) => skillButton(item, type)).join("")
      : '<div class="ai-skill-empty">No matching skills</div>';

    detail.hidden = false;
    detail.innerHTML =
      '<div class="ai-skill-search-row"><label class="ai-skill-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg><input type="search" value="' +
      escapeHtml(query || "") +
      '" placeholder="' +
      config.searchPlaceholder +
      '" /></label></div><div class="ai-skill-list">' +
      itemMarkup +
      '</div><div class="ai-skill-footer-actions">' +
      detailAction("history", "Add from Chat History") +
      detailAction("manual", "Create Analytical Model Manually") +
      "</div>";

    if (focusSearch) {
      const searchInput = detail.querySelector("input");
      searchInput.focus();
      searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    }
    if (selectedSkill) {
      detail.querySelectorAll(".ai-skill-option").forEach((button) => {
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
    activeType = null;
    detailPinned = false;
    cancelHoverClose();
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
    chip.querySelector("span").textContent = selectedSkill.type + ": " + selectedSkill.title;
    composer.dataset.selectedAiSkill = selectedSkill.type + " | " + selectedSkill.title;
  }

  addButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  menu.addEventListener("click", (event) => {
    const category = event.target.closest(".ai-skill-category");
    if (category) {
      const type = category.dataset.aiSkillCategory;
      /* Click opens and pins the submenu; clicking it again collapses. Hover alone
         never pins, so a hover then click promotes the preview instead of closing it. */
      if (type === activeType && detailPinned) {
        collapseDetail();
        return;
      }
      openCategory(category);
      detailPinned = true;
      return;
    }

    const action = event.target.closest("[data-ai-skill-action]");
    if (action?.dataset.aiSkillAction === "history") {
      openHistoryDialog();
      return;
    }
    if (action?.dataset.aiSkillAction === "manual") {
      openManualModelForm();
      return;
    }

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

  menu.addEventListener("input", (event) => {
    if (!event.target.matches(".ai-skill-search input")) return;
    renderDetail(activeType, event.target.value, true);
  });

  /*
   * Hover expansion. The category panel and the detail panel sit side by side with
   * an 8px gap, so a pure :hover rule drops the detail panel while the pointer
   * travels between them. Close on a short delay instead, which keeps the panel
   * open across that gap and when moving onto the detail panel itself.
   */
  const HOVER_CLOSE_DELAY = 120;
  let hoverCloseTimer = null;
  /* True when the user clicked a category, so leaving the menu keeps it open. */
  let detailPinned = false;

  function cancelHoverClose() {
    if (hoverCloseTimer === null) return;
    window.clearTimeout(hoverCloseTimer);
    hoverCloseTimer = null;
  }

  function collapseDetail() {
    cancelHoverClose();
    detailPinned = false;
    const detail = menu.querySelector(".ai-skill-detail-panel");
    if (detail) detail.hidden = true;
    menu.querySelectorAll(".ai-skill-category").forEach((button) => {
      button.classList.remove("is-active");
    });
    activeType = null;
  }

  function scheduleHoverClose() {
    if (detailPinned) return;
    cancelHoverClose();
    hoverCloseTimer = window.setTimeout(() => {
      hoverCloseTimer = null;
      collapseDetail();
    }, HOVER_CLOSE_DELAY);
  }

  /* Click/keyboard open: renders the submenu and moves focus into its search box. */
  function openCategory(category) {
    const type = category.dataset.aiSkillCategory;
    cancelHoverClose();
    if (type === "Upload") return;
    if (type === activeType) {
      /* Already opened by a hover preview - just promote it and move focus in. */
      focusDetailSearch();
      return;
    }
    detailPinned = false;
    renderDetail(type, "", true);
  }

  function focusDetailSearch() {
    const searchInput = menu.querySelector(".ai-skill-detail-panel input");
    if (!searchInput) return;
    searchInput.focus();
    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
  }

  /* Hover preview: opens the submenu without moving focus and without pinning. */
  function hoverPreviewCategory(category) {
    const type = category.dataset.aiSkillCategory;
    if (type === activeType) {
      cancelHoverClose();
      return;
    }
    cancelHoverClose();
    /* Upload is an action, not a submenu - never open it by hover. */
    if (type === "Upload") return;
    detailPinned = false;
    renderDetail(type, "", false);
  }

  menu.addEventListener("mouseenter", cancelHoverClose);
  menu.addEventListener("mouseleave", () => {
    if (menu.hidden) return;
    scheduleHoverClose();
  });
  menu.addEventListener("mouseover", (event) => {
    if (menu.hidden) return;
    const category = event.target.closest(".ai-skill-category");
    if (!category) {
      cancelHoverClose();
      return;
    }
    /* Staying on the pinned category keeps it pinned; entering a different one
       demotes the pin to a hover preview so the submenu follows the pointer. */
    if (category.dataset.aiSkillCategory === activeType) {
      cancelHoverClose();
      return;
    }
    hoverPreviewCategory(category);
  });
  menu.addEventListener("focusin", (event) => {
    if (menu.hidden) return;
    const category = event.target.closest(".ai-skill-category");
    if (category) openCategory(category);
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

  function openHistoryDialog() {
    closeMenu();
    document.querySelector("#aiHistoryGenerateDialog")?.remove();
    const dialog = document.createElement("div");
    dialog.className = "ai-flow-dialog";
    dialog.id = "aiHistoryGenerateDialog";
    dialog.innerHTML =
      '<div class="ai-flow-card ai-history-card" role="dialog" aria-modal="true" aria-labelledby="aiHistoryTitle">' +
      '<header><div><strong id="aiHistoryTitle">Generate Analytical Model</strong><span>Select conversations and describe the generation rule for the analysis logic.</span></div><button type="button" data-ai-flow-close aria-label="Close">×</button></header>' +
      '<div class="ai-history-body">' +
      '<section class="ai-history-block">' +
      '<div class="ai-history-block-head"><span>1 · Select Conversations</span><span class="ai-history-count" data-ai-history-count></span></div>' +
      '<div class="ai-history-thread">' +
      /* Flat stream: every message from every conversation is listed in one
         list, with no per-conversation grouping header. */
      chatHistory
        .map((thread, threadIndex) =>
          thread.messages
            .map((message, messageIndex) => renderHistoryMessage(threadIndex, messageIndex, message))
            .join(""),
        )
        .join("") +
      "</div>" +
      '<p class="ai-history-error" data-ai-generate-error hidden>Select at least one message to continue.</p>' +
      "</section>" +
      '<section class="ai-history-block">' +
      '<div class="ai-history-block-head"><span>2 · Generation Rule</span><span class="ai-history-optional">optional</span></div>' +
      '<textarea class="ai-history-rule" data-ai-generation-rule rows="3" placeholder="Describe how AI should distill the analysis logic, for example: focus on the channel dimension and keep only the driver with the strongest evidence."></textarea>' +
      "</section>" +
      "</div>" +
      '<footer><button type="button" class="ai-flow-secondary" data-ai-flow-close>Cancel</button><button type="button" class="ai-flow-primary" data-ai-generate-model>Generate</button></footer>' +
      "</div>";
    document.body.append(dialog);
    syncHistoryCount(dialog);
    dialog.addEventListener("change", (event) => {
      if (event.target.matches("[data-ai-history-msg]")) syncHistoryCount(dialog);
    });
  }

  /* Keeps the "Selected N / M messages" counter and the blocking error honest. */
  function syncHistoryCount(dialog) {
    const boxes = dialog.querySelectorAll("[data-ai-history-msg]");
    const checked = dialog.querySelectorAll("[data-ai-history-msg]:checked").length;
    const label = dialog.querySelector("[data-ai-history-count]");
    if (label) label.textContent = "Selected " + checked + " / " + boxes.length + " messages";
    const error = dialog.querySelector("[data-ai-generate-error]");
    if (error && checked) error.hidden = true;
    /* :has() would be shorter, but the selection ring is repainted here anyway,
       so a class keeps it working on older Chromium too. */
    boxes.forEach((input) => {
      input.closest(".ai-history-msg")?.classList.toggle("is-selected", input.checked);
    });
  }

  /*
   * Demo-only simulation of "AI generates the analysis logic". The demo is a
   * static bundle with no model behind it, so the generation rule is mapped to
   * concrete steps by keyword. That mapping is what makes the generated logic
   * visibly follow the user's rule during a walkthrough, instead of always
   * emitting the same fixed text.
   */
  function buildAnalysisLogic(rule) {
    const text = normalizeText(rule).toLowerCase();
    const has = (words) => words.some((word) => text.includes(word));

    const dimensions = [];
    if (has(["channel", "media", "platform", "site"])) dimensions.push("channels");
    if (has(["city", "cities", "market", "region", "store"])) dimensions.push("cities");
    if (has(["segment", "customer", "member", "audience"])) dimensions.push("customer segments");
    if (has(["time", "week", "month", "trend", "period", "quarter"])) dimensions.push("time periods");

    const scope = dimensions.length
      ? "across " + dimensions.join(" and ")
      : "across channels, customer segments, and time periods";

    const driver = has(["rank", "priorit", "top", "most impactful", "biggest"])
      ? "Rank the candidate drivers by business impact and keep only the strongest one."
      : has(["driver", "root cause", "reason", "why", "cause", "factor"])
        ? "Isolate the driver with the strongest supporting evidence."
        : "Identify the most likely drivers with supporting evidence.";

    const output = has(["concise", "brief", "short", "one conclusion", "one result"])
      ? "Return one conclusion and a recommended next action."
      : "Return the key findings and a recommended next action.";

    return [
      "1. Define the business question, the measurement window, and the metric to explain.",
      "2. Compare metric movement " + scope + ".",
      "3. " + driver,
      "4. " + output,
    ].join("\n");
  }

  /*
   * Chat history offered to the "Generate Analytical Model" flow. Each entry is
   * the real conversation - the user turn and the reply - so the dialog can
   * replay it as a chat log and let the user tick the exact messages that should
   * feed the generation. Ticking is per message, not per conversation.
   */
  const chatHistory = [
    {
      title: "Campaign ROI decline",
      messages: [
        {
          role: "user",
          text: "Why did campaign ROI drop last week after we shifted media budget to short-video channels?",
          checked: true,
        },
        {
          role: "ai",
          label: "Connected campaign view",
          title: "Recommended next move.",
          text: "Compare invested versus non-invested channels, isolate the largest week-over-week movement, and separate real business change from delayed source data.",
          sources: ["Campaign Performance", "Channel spend", "Refresh status"],
          checked: true,
        },
      ],
    },
    {
      title: "Conversion drop by segment",
      messages: [
        {
          role: "user",
          text: "Conversion fell mainly in new customer segments. Where should we investigate first?",
          checked: true,
        },
        {
          role: "ai",
          label: "Connected campaign view",
          title: "Segment pressure is concentrated.",
          text: "Start with the new-customer cohort, verify freshness and metric definitions, then compare the strongest city and channel contributors before acting.",
          sources: ["Customer Conversion", "Qualified traffic", "Data quality notes"],
          checked: true,
        },
      ],
    },
    {
      title: "Report interpretation",
      messages: [
        {
          role: "user",
          text: "Compare city performance across traffic, sales, CR, AUR and UPT before scaling investment.",
          checked: false,
        },
        {
          role: "ai",
          label: "Connected report view",
          title: "Optimize conversion before scaling.",
          text: "Prioritize the invested cities where traffic uplift did not convert, then re-check spend efficiency before scaling budget.",
          sources: ["City Strategy", "Governed reports"],
          checked: false,
        },
      ],
    },
  ];

  /*
   * The tick box is rendered by CSS (see .ai-history-msg) so it sits in the same
   * gutter for both roles; the reply is mirrored into a read-only answer card and
   * deliberately carries no action / feedback buttons.
   */
  function renderHistoryMessage(threadIndex, messageIndex, message) {
    const box =
      '<input type="checkbox" data-ai-history-msg data-thread="' +
      threadIndex +
      '" data-message="' +
      messageIndex +
      '"' +
      (message.checked ? " checked" : "") +
      " />";
    if (message.role === "user") {
      return (
        '<label class="ai-history-msg is-user">' +
        box +
        '<span class="ai-history-bubble">' +
        escapeHtml(message.text) +
        "</span></label>"
      );
    }
    return (
      '<label class="ai-history-msg is-ai">' +
      box +
      '<span class="ai-history-answer"><span class="ai-history-answer-head">' +
      escapeHtml(message.label) +
      " · " +
      message.sources.length +
      " grounded sources</span><strong>" +
      escapeHtml(message.title) +
      "</strong><small>" +
      escapeHtml(message.text) +
      '</small><span class="ai-history-answer-sources">' +
      message.sources.map((source) => "<span>" + escapeHtml(source) + "</span>").join("") +
      "</span></span></label>"
    );
  }

  /* Reads the ticks back out of the dialog, in conversation order. */
  function collectSelectedMessages(dialog) {
    const picked = [];
    dialog.querySelectorAll("[data-ai-history-msg]").forEach((input) => {
      if (!input.checked) return;
      const thread = chatHistory[Number(input.dataset.thread)];
      const message = thread && thread.messages[Number(input.dataset.message)];
      if (!message) return;
      picked.push({
        threadIndex: Number(input.dataset.thread),
        role: message.role,
        title: message.title || "",
        text: message.text,
        conversation: thread.title,
      });
    });
    return picked;
  }

  /*
   * Demo-only simulation of "AI drafts the model description". The real editor
   * defines Description as "the business goal, the decision to support, and the
   * expected insight - do not list analysis steps here" (see
   * assets/js/knowledge/analytical-model-form.js), so the generated text stays at
   * that level: the topics come from the ticked questions, the wording of the
   * method comes from the generation rule, and no steps are listed.
   */
  function buildDescription(messages, rule) {
    /* The business question lives in the user turns, so topics are read from
       those first and only fall back to the replies when no question is ticked. */
    const questions = messages.filter((message) => message.role === "user").map((message) => message.text);
    const scope = (questions.length ? questions : messages.map((message) => message.text))
      .join(" ")
      .toLowerCase();

    const topics = [];
    if (/\broi\b|budget|media spend/.test(scope)) topics.push("campaign ROI");
    if (/conversion/.test(scope)) topics.push("conversion");
    if (/\bcit(y|ies)\b/.test(scope)) topics.push("city performance");
    if (!topics.length) topics.push("marketing performance");
    const topicPhrase =
      topics.length > 1
        ? topics.slice(0, -1).join(", ") + " and " + topics[topics.length - 1]
        : topics[0];

    const ruleText = normalizeText(rule).toLowerCase();
    const has = (words) => words.some((word) => ruleText.includes(word));
    const dimensions = [];
    if (has(["channel", "media", "platform", "site"])) dimensions.push("channels");
    if (has(["city", "cities", "market", "region", "store"])) dimensions.push("cities");
    if (has(["segment", "customer", "member", "audience"])) dimensions.push("customer segments");
    if (has(["time", "week", "month", "trend", "period", "quarter"])) dimensions.push("time periods");
    const dimensionPhrase = dimensions.join(" and ");
    const ranked = has(["rank", "priorit", "top", "most impactful", "biggest"]);

    const goal =
      "Clarify what drove the movement in " +
      topicPhrase +
      ", so the marketing team can decide the next optimization step.";
    const method = dimensionPhrase
      ? ranked
        ? "Ranks " + dimensionPhrase + " by business impact and returns one conclusion."
        : "Compares " + dimensionPhrase + " to isolate the strongest driver and support one next action."
      : "Expected insight is the primary driver with supporting evidence.";

    const conversations = new Set(messages.map((message) => message.threadIndex)).size;
    return (
      goal +
      " " +
      method +
      "\n\nSource: " +
      conversations +
      " conversation" +
      (conversations === 1 ? "" : "s") +
      " · " +
      messages.length +
      " message" +
      (messages.length === 1 ? "" : "s") +
      "."
    );
  }

  function historyItem(id, text, checked) {
    return (
      '<label class="ai-history-item"><input type="checkbox" value="' +
      escapeHtml(text) +
      '"' +
      (checked ? " checked" : "") +
      ' /><span><strong>' +
      escapeHtml(id.replace("history-", "Chat ")) +
      "</strong><small>" +
      escapeHtml(text) +
      "</small></span></label>"
    );
  }

  function openGeneratedModelForm(messages, rule) {
    /*
     * The generation step is hidden rather than removed, so Back can restore it
     * with every tick, the generation rule and the scroll position still intact.
     */
    const historyDialog = document.querySelector("#aiHistoryGenerateDialog");
    if (historyDialog) historyDialog.hidden = true;
    document.querySelector("#aiGeneratedModelDialog")?.remove();
    const ruleText = normalizeText(rule);
    /* Both fields are drafted from the ticked messages plus the generation rule,
       then handed to the form below where the user can still edit them. */
    const description = buildDescription(messages, rule);
    const guidance = buildAnalysisLogic(rule);
    const dialog = document.createElement("div");
    dialog.className = "ai-flow-dialog";
    dialog.id = "aiGeneratedModelDialog";
    dialog.innerHTML =
      '<div class="ai-flow-card ai-model-form-card" role="dialog" aria-modal="true" aria-labelledby="aiModelTitle">' +
      '<header><div><strong id="aiModelTitle">New Analytical Model</strong><span>' +
      (ruleText
        ? "Generated from selected conversations and your generation rule."
        : "Generated from selected conversations.") +
      " Submit will publish this knowledge immediately.</span></div><button type=\"button\" data-ai-flow-close aria-label=\"Close\">×</button></header>" +
      '<div class="ai-model-form">' +
      '<section><h4>Basic Information</h4><label><span class="field-label-text">Name <span class="required-star">*</span></span><input data-ai-required="Name" value="ROI movement diagnosis model" /></label><label>Description<textarea>' +
      escapeHtml(description) +
      '</textarea></label><label><span class="field-label-text">Trigger When <span class="required-star">*</span></span><textarea data-ai-required="Trigger When">Use when users ask why a marketing metric changed and need one interpretation result grounded in available evidence.</textarea></label></section>' +
      '<section><h4>Metrics</h4><label>Business Domain<input value="Campaign Performance; Customer Conversion" /></label><label>Referenced Metrics<input value="Campaign ROI; Conversion Rate; Spend" /></label></section>' +
      '<section><h4>Structure & Guidance</h4><label><span class="field-label-text">Structure & Guidance <span class="required-star">*</span></span><textarea data-ai-required="Structure & Guidance">' +
      escapeHtml(guidance) +
      '</textarea></label></section>' +
      '<section><h4>Constraints</h4><label>Prohibited Analysis Directions<textarea>Do not infer causality from correlation. Do not analyze dimensions without supporting data. Do not generate charts or a full report; return one concise analysis result.</textarea></label></section>' +
      "</div>" +
      '<footer><button type="button" class="ai-flow-secondary ai-flow-back" data-ai-back-to-history>← Back</button><button type="button" class="ai-flow-secondary" data-ai-flow-close>Cancel</button><button type="button" class="ai-flow-secondary" data-ai-save-model>Save</button><button type="button" class="ai-flow-primary" data-ai-submit-model>Submit</button></footer>' +
      "</div>";
    document.body.append(dialog);
  }

  function openManualModelForm() {
    closeMenu();
    /* Manual creation has no previous step, so any hidden generation step left
       behind by the chat-history path is dropped here too. */
    document.querySelector("#aiHistoryGenerateDialog")?.remove();
    document.querySelector("#aiGeneratedModelDialog")?.remove();
    const dialog = document.createElement("div");
    dialog.className = "ai-flow-dialog";
    dialog.id = "aiGeneratedModelDialog";
    dialog.innerHTML =
      '<div class="ai-flow-card ai-model-form-card" role="dialog" aria-modal="true" aria-labelledby="aiManualModelTitle">' +
      '<header><div><strong id="aiManualModelTitle">Create Analytical Model Manually</strong><span>Draft the model fields and publish it to the knowledge base.</span></div><button type="button" data-ai-flow-close aria-label="Close">×</button></header>' +
      '<div class="ai-model-form">' +
      '<section><h4>Basic Information</h4><label><span class="field-label-text">Name <span class="required-star">*</span></span><input data-ai-required="Name" placeholder="Enter analytical model name" /></label><label>Description<textarea placeholder="Describe what this model helps interpret"></textarea></label><label><span class="field-label-text">Trigger When <span class="required-star">*</span></span><textarea data-ai-required="Trigger When" placeholder="Describe when AI should use this model"></textarea></label></section>' +
      '<section><h4>Metrics</h4><label>Business Domain<input placeholder="Campaign Performance; Customer Conversion" /></label><label>Referenced Metrics<input placeholder="ROI; Conversion Rate; Spend" /></label></section>' +
      '<section><h4>Structure & Guidance</h4><label><span class="field-label-text">Structure & Guidance <span class="required-star">*</span></span><textarea data-ai-required="Structure & Guidance" placeholder="Write the step-by-step interpretation logic"></textarea></label></section>' +
      '<section><h4>Constraints</h4><label>Prohibited Analysis Directions<textarea placeholder="Add limits, warnings, or blocked analysis directions"></textarea></label></section>' +
      "</div>" +
      '<footer><button type="button" class="ai-flow-secondary" data-ai-flow-close>Cancel</button><button type="button" class="ai-flow-secondary" data-ai-save-model>Save</button><button type="button" class="ai-flow-primary" data-ai-submit-model>Submit</button></footer>' +
      "</div>";
    document.body.append(dialog);
  }

  function validateModelDialog(dialog) {
    if (!dialog) return false;
    let valid = true;
    dialog.querySelectorAll(".field-error").forEach((node) => node.remove());
    dialog.querySelectorAll("[data-ai-required]").forEach((field) => {
      field.classList.remove("is-invalid");
      if (field.value.trim()) return;
      valid = false;
      field.classList.add("is-invalid");
      field.insertAdjacentHTML(
        "afterend",
        '<span class="field-error">' + field.dataset.aiRequired + " is required.</span>",
      );
    });
    const firstInvalid = dialog.querySelector(".is-invalid");
    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  document.addEventListener("click", (event) => {
    if (event.target.matches("[data-ai-flow-close]")) {
      const dialog = event.target.closest(".ai-flow-dialog");
      /* Cancel / close on the generated form ends the whole flow, so the hidden
         generation step behind it is cleaned up instead of lingering. */
      if (dialog && dialog.id === "aiGeneratedModelDialog") {
        document.querySelector("#aiHistoryGenerateDialog")?.remove();
      }
      dialog?.remove();
      return;
    }
    if (event.target.matches("[data-ai-back-to-history]")) {
      event.target.closest(".ai-flow-dialog")?.remove();
      const historyDialog = document.querySelector("#aiHistoryGenerateDialog");
      if (historyDialog) historyDialog.hidden = false;
      return;
    }
    if (event.target.matches("[data-ai-generate-model]")) {
      const dialog = event.target.closest(".ai-flow-dialog");
      const selected = collectSelectedMessages(dialog);
      const error = dialog.querySelector("[data-ai-generate-error]");
      /* The messages are the source material, so at least one is required. The
         generation rule is optional - when it is empty AI falls back to its own
         default reasoning. */
      if (!selected.length) {
        if (error) error.hidden = false;
        return;
      }
      if (error) error.hidden = true;
      const ruleField = dialog.querySelector("[data-ai-generation-rule]");
      openGeneratedModelForm(selected, ruleField ? ruleField.value : "");
      return;
    }
    if (event.target.matches("[data-ai-submit-model], [data-ai-save-model]")) {
      const dialog = event.target.closest(".ai-flow-dialog");
      if (!validateModelDialog(dialog)) return;
      event.target.textContent = event.target.matches("[data-ai-save-model]") ? "Saved" : "Published";
      window.setTimeout(() => dialog?.remove(), 450);
    }
  });
})();
