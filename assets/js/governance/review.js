const reviewItems = Array.isArray(window.reviewItems) ? window.reviewItems : [];

let activeTab = "pending";
let activeType = "all";
let activeTime = "all";
let searchQuery = "";

const reviewTabs = document.querySelectorAll(".review-tab");
const reviewSearch = document.querySelector("#reviewSearch");
const reviewTypeFilter = document.querySelector("#reviewTypeFilter");
const reviewTimeFilter = document.querySelector("#reviewTimeFilter");
const reviewAssetList = document.querySelector("#reviewAssetList");
const reviewEmptyState = document.querySelector("#reviewEmptyState");
const reviewResultCount = document.querySelector("#reviewResultCount");
const pendingTabCount = document.querySelector("#pendingTabCount");
const approvedTabCount = document.querySelector("#approvedTabCount");
const pendingCount = document.querySelector("#pendingCount");
const approvedCount = document.querySelector("#approvedCount");
const rejectedCount = document.querySelector("#rejectedCount");

function loadPendingRestorations() {
  try {
    const stored = JSON.parse(localStorage.getItem("pendingRestorations") || "[]");
    stored.forEach((item) => {
      if (!reviewItems.find((i) => i.id === item.id)) {
        reviewItems.push(item);
      }
    });
    localStorage.removeItem("pendingRestorations");
  } catch (e) {
    // ignore localStorage errors
  }
}

function init() {
  loadPendingRestorations();
  updateCounts();
  bindEvents();
  bindPanelEvents();
  renderItems();
}

function updateCounts() {
  const pending = reviewItems.filter((i) => i.status === "pending").length;
  const approved = reviewItems.filter((i) => i.status === "approved").length;
  const rejected = 3; // static for demo

  if (pendingTabCount) pendingTabCount.textContent = pending;
  if (approvedTabCount) approvedTabCount.textContent = approved;
  if (pendingCount) pendingCount.textContent = pending;
  if (approvedCount) approvedCount.textContent = approved;
  if (rejectedCount) rejectedCount.textContent = rejected;
}

function bindEvents() {
  reviewTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeTab = tab.dataset.tab;
      updateTabUI();
      renderItems();
    });
  });

  if (reviewSearch) {
    reviewSearch.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderItems();
    });
  }

  if (reviewTypeFilter) {
    reviewTypeFilter.addEventListener("change", (e) => {
      activeType = e.target.value;
      renderItems();
    });
  }

  if (reviewTimeFilter) {
    reviewTimeFilter.addEventListener("change", (e) => {
      activeTime = e.target.value;
      renderItems();
    });
  }
}

function updateTabUI() {
  reviewTabs.forEach((tab) => {
    const isActive = tab.dataset.tab === activeTab;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function getFilteredItems() {
  return reviewItems.filter((item) => {
    if (item.status !== activeTab) return false;
    if (activeType !== "all" && item.type !== activeType) return false;
    if (searchQuery) {
      const text = (item.title + " " + item.summary + " " + item.submittedBy).toLowerCase();
      if (!text.includes(searchQuery)) return false;
    }
    return true;
  });
}

function renderItems() {
  const items = getFilteredItems();

  if (reviewResultCount) {
    reviewResultCount.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;
  }

  if (items.length === 0) {
    if (reviewAssetList) reviewAssetList.innerHTML = "";
    if (reviewEmptyState) reviewEmptyState.hidden = false;
    return;
  }

  if (reviewEmptyState) reviewEmptyState.hidden = true;

  const html = items
    .map((item) => {
      const statusClass = item.status;
      const aiClass = item.aiCheck.toLowerCase().replace(/\s+/g, "-");
      const isRestore = item.id.startsWith("restore-");
      const restoreBadge = isRestore ? `<span class="restore-badge">Restore</span>` : "";

      const actions =
        item.status === "pending"
          ? `
            <button class="review-btn approve" type="button" data-action="approve" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 6L9 17l-5-5"/></svg>
              Approve
            </button>
            <button class="review-btn reject" type="button" data-action="reject" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Reject
            </button>
          `
          : `
            <button class="review-btn view" type="button" data-action="view" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              View
            </button>
          `;

      return `
        <div class="asset-card ${isRestore ? "restore-item" : ""}" role="option" data-id="${item.id}">
          <div class="asset-title">
            <strong>${escapeHtml(item.title)} ${restoreBadge}</strong>
            <small>${escapeHtml(item.summary)}</small>
          </div>
          <div class="asset-type">
            <span>${escapeHtml(item.type)}</span>
          </div>
          <div class="asset-submitter">
            <span class="submitter-name">${escapeHtml(item.submittedBy)}</span>
          </div>
          <div class="asset-submitted">${escapeHtml(item.submitted)}</div>
          <div>
            <span class="status-badge ${statusClass}">${escapeHtml(item.status === "pending" ? "Pending" : "Approved")}</span>
          </div>
          <div>
            <span class="ai-check-badge ${aiClass}">${escapeHtml(item.aiCheck)}</span>
          </div>
          <div class="review-actions">
            ${actions}
          </div>
        </div>
      `;
    })
    .join("");

  if (reviewAssetList) reviewAssetList.innerHTML = html;

  // Bind card click to open detail panel
  document.querySelectorAll(".asset-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // Don't open detail if clicking on action buttons
      if (e.target.closest(".review-btn")) return;
      const id = card.dataset.id;
      if (id) openReviewDetail(id);
    });
    card.style.cursor = "pointer";
  });

  // Bind action buttons
  document.querySelectorAll(".review-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      handleAction(action, id);
    });
  });
}

let pendingRejectId = null;
let pendingApproveId = null;

const rejectScrim = document.querySelector("#rejectScrim");
const rejectPanel = document.querySelector("#rejectPanel");
const rejectCloseBtn = document.querySelector("#rejectCloseBtn");
const rejectCancelBtn = document.querySelector("#rejectCancelBtn");
const rejectConfirmBtn = document.querySelector("#rejectConfirmBtn");
const rejectPanelTitle = document.querySelector("#rejectPanelTitle");
const rejectAiContent = document.querySelector("#rejectAiContent");
const rejectReasonInput = document.querySelector("#rejectReasonInput");

/* ── Review Detail Panel Elements ── */
const reviewDetailScrim = document.querySelector("#reviewDetailScrim");
const reviewDetailPanel = document.querySelector("#reviewDetailPanel");
const reviewDetailClose = document.querySelector("#reviewDetailClose");
const reviewDetailContent = document.querySelector("#reviewDetailContent");
const reviewDetailEmpty = document.querySelector("#reviewDetailEmpty");
const reviewDetailType = document.querySelector("#reviewDetailType");
const reviewDetailSource = document.querySelector("#reviewDetailSource");
const reviewDetailItemTitle = document.querySelector("#reviewDetailItemTitle");
const reviewDetailSummary = document.querySelector("#reviewDetailSummary");
const reviewDetailSubmitter = document.querySelector("#reviewDetailSubmitter");
const reviewDetailSubmitted = document.querySelector("#reviewDetailSubmitted");
const reviewDetailStatus = document.querySelector("#reviewDetailStatus");
const reviewDetailAiCheck = document.querySelector("#reviewDetailAiCheck");
const reviewDetailAiSection = document.querySelector("#reviewDetailAiSection");
const reviewDetailAiSuggestions = document.querySelector("#reviewDetailAiSuggestions");
const reviewDetailWarning = document.querySelector("#reviewDetailWarning");
const reviewDetailWarningText = document.querySelector("#reviewDetailWarningText");
const reviewDetailActions = document.querySelector("#reviewDetailActions");

let selectedReviewItemId = "";

const riskModalScrim = document.querySelector("#riskModalScrim");
const riskModal = document.querySelector("#riskModal");
const riskModalCancel = document.querySelector("#riskModalCancel");
const riskModalConfirm = document.querySelector("#riskModalConfirm");
const riskModalTitle = document.querySelector("#riskModalTitle");
const riskModalMessage = document.querySelector("#riskModalMessage");

const aiSuggestions = {
  "pending-1": [
    "The investment pressure thresholds are not aligned with the latest Q3 governance framework.",
    "Conversion efficiency benchmarks reference an outdated fiscal year.",
    "Consider adding a cross-channel consistency check before approval.",
  ],
  "pending-3": [
    "Data lineage for the customer segment is incomplete.",
    "Promotion mapping table has not been validated since last schema change.",
    "AI review is still in progress — manual verification recommended.",
  ],
  "pending-5": [
    "City movement narrative lacks a defined statistical significance threshold.",
    "The repeatable path references a deprecated reporting template.",
    "Consider adding automated anomaly detection as a prerequisite.",
  ],
  "pending-6": [
    "AI review is still in progress — manual verification recommended.",
    "4P interpretation may conflict with the latest product taxonomy update.",
    "Business Planning sign-off is missing from the approval chain.",
  ],
  "pending-8": [
    "Attribution window definition differs from the current media governance policy.",
    "Governed media spend figure may include non-approved vendor costs.",
    "Consider clarifying the difference between attributed and incremental revenue.",
  ],
  "pending-11": [
    "AI review is still in progress — manual verification recommended.",
    "Engagement signal definitions are not yet aligned with the Rednote API v2.",
    "Creative taxonomy mapping is incomplete for 3 of the 12 content categories.",
  ],
};

function openRejectPanel(id) {
  const item = reviewItems.find((i) => i.id === id);
  if (!item) return;
  pendingRejectId = id;

  if (rejectPanelTitle) rejectPanelTitle.textContent = `Reject: ${item.title}`;
  if (rejectReasonInput) {
    rejectReasonInput.value = "";
    rejectReasonInput.focus();
  }

  const suggestions = aiSuggestions[id] || [
    "No specific AI suggestions available for this item.",
    "Please review the content carefully before rejecting.",
  ];
  if (rejectAiContent) {
    rejectAiContent.innerHTML = `<ul>${suggestions.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`;
  }

  if (rejectScrim) rejectScrim.hidden = false;
  if (rejectPanel) rejectPanel.classList.add("open");
  document.body.classList.add("reject-panel-open");
}

function closeRejectPanel() {
  if (rejectScrim) rejectScrim.hidden = true;
  if (rejectPanel) rejectPanel.classList.remove("open");
  document.body.classList.remove("reject-panel-open");
  pendingRejectId = null;
  if (rejectReasonInput) rejectReasonInput.value = "";
}

function confirmReject() {
  if (!pendingRejectId) return;
  const item = reviewItems.find((i) => i.id === pendingRejectId);
  if (item) {
    item.status = "rejected";
    updateCounts();
    renderItems();
  }
  closeRejectPanel();
}

function openRiskModal(id) {
  const item = reviewItems.find((i) => i.id === id);
  if (!item) return;
  pendingApproveId = id;

  const isWarning = item.aiCheck === "Warning";
  const isReviewing = item.aiCheck === "Reviewing";

  if (riskModalTitle) {
    riskModalTitle.textContent = isWarning ? "AI Warning Detected" : "AI Review In Progress";
  }
  if (riskModalMessage) {
    if (isWarning) {
      riskModalMessage.textContent = `This item has an AI Warning. Approving it may introduce inaccurate or incomplete data into the knowledge base. Are you sure you want to proceed?`;
    } else if (isReviewing) {
      riskModalMessage.textContent = `AI is still reviewing this item. The analysis may be incomplete. Approving now could result in publishing unverified content. Are you sure you want to proceed?`;
    }
  }

  if (riskModalScrim) riskModalScrim.hidden = false;
  if (riskModal) riskModal.hidden = false;
  document.body.classList.add("risk-modal-open");
}

function closeRiskModal() {
  if (riskModalScrim) riskModalScrim.hidden = true;
  if (riskModal) riskModal.hidden = true;
  document.body.classList.remove("risk-modal-open");
  pendingApproveId = null;
}

function confirmApprove() {
  if (!pendingApproveId) return;
  const item = reviewItems.find((i) => i.id === pendingApproveId);
  if (item) {
    item.status = "approved";
    item.aiCheck = "Pass";
    updateCounts();
    renderItems();
  }
  closeRiskModal();
}

function bindPanelEvents() {
  if (rejectCloseBtn) rejectCloseBtn.addEventListener("click", closeRejectPanel);
  if (rejectCancelBtn) rejectCancelBtn.addEventListener("click", closeRejectPanel);
  if (rejectConfirmBtn) rejectConfirmBtn.addEventListener("click", confirmReject);
  if (rejectScrim) rejectScrim.addEventListener("click", closeRejectPanel);

  if (riskModalCancel) riskModalCancel.addEventListener("click", closeRiskModal);
  if (riskModalConfirm) riskModalConfirm.addEventListener("click", confirmApprove);
  if (riskModalScrim) riskModalScrim.addEventListener("click", closeRiskModal);

  /* ── Review Detail Panel Events ── */
  if (reviewDetailClose) reviewDetailClose.addEventListener("click", closeReviewDetail);
  if (reviewDetailScrim) reviewDetailScrim.addEventListener("click", closeReviewDetail);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (reviewDetailPanel && reviewDetailPanel.classList.contains("open")) closeReviewDetail();
      if (rejectPanel && !rejectPanel.classList.contains("open") === false) closeRejectPanel();
      if (riskModal && !riskModal.hidden) closeRiskModal();
    }
  });
}

/* ── Review Detail Panel Functions ── */
function openReviewDetail(itemId) {
  const item = reviewItems.find((i) => i.id === itemId);
  if (!item) return;

  selectedReviewItemId = itemId;

  reviewDetailContent.hidden = false;
  reviewDetailEmpty.hidden = true;

  reviewDetailType.textContent = item.type;
  reviewDetailSource.textContent = item.source;
  reviewDetailItemTitle.textContent = item.title;
  reviewDetailSummary.textContent = item.summary || "";
  reviewDetailSubmitter.textContent = item.submittedBy;
  reviewDetailSubmitted.textContent = item.submitted;
  reviewDetailStatus.textContent = item.status === "pending" ? "Pending" : "Approved";
  reviewDetailAiCheck.textContent = item.aiCheck;

  // Warning block (shown for items with AI Warning / potential issues)
  if (item.warning) {
    reviewDetailWarning.hidden = false;
    reviewDetailWarningText.textContent = item.warning;
  } else {
    reviewDetailWarning.hidden = true;
  }

  // AI Suggestions
  const suggestions = aiSuggestions[itemId];
  if (suggestions && suggestions.length > 0) {
    reviewDetailAiSection.hidden = false;
    reviewDetailAiSuggestions.innerHTML = suggestions
      .map((s) => `<li>${escapeHtml(s)}</li>`)
      .join("");
  } else {
    reviewDetailAiSection.hidden = true;
  }

  // Action buttons in detail panel
  if (item.status === "pending") {
    reviewDetailActions.innerHTML = `
      <button class="review-btn approve" type="button" data-action="approve" data-id="${item.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 6L9 17l-5-5"/></svg>
        Approve
      </button>
      <button class="review-btn reject" type="button" data-action="reject" data-id="${item.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 6L6 18M6 6l12 12"/></svg>
        Reject
      </button>
    `;
  } else {
    reviewDetailActions.innerHTML = `
      <button class="review-btn view" type="button" data-action="view" data-id="${item.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        View in Knowledge Base
      </button>
    `;
  }

  // Bind action buttons inside detail panel
  reviewDetailActions.querySelectorAll(".review-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      closeReviewDetail();
      handleAction(action, id);
    });
  });

  reviewDetailScrim.hidden = false;
  reviewDetailPanel.classList.add("open");
  reviewDetailPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("review-detail-open");
  reviewDetailClose.focus();
}

function closeReviewDetail() {
  if (!reviewDetailPanel.classList.contains("open")) return;
  reviewDetailPanel.classList.remove("open");
  reviewDetailPanel.setAttribute("aria-hidden", "true");
  reviewDetailScrim.hidden = true;
  document.body.classList.remove("review-detail-open");
  selectedReviewItemId = "";
}

function handleAction(action, id) {
  if (action === "approve") {
    const item = reviewItems.find((i) => i.id === id);
    if (item) {
      if (item.aiCheck === "Warning" || item.aiCheck === "Reviewing") {
        openRiskModal(id);
      } else {
        item.status = "approved";
        item.aiCheck = "Pass";
        updateCounts();
        renderItems();
      }
    }
  } else if (action === "reject") {
    openRejectPanel(id);
  } else if (action === "view") {
    openReviewDetail(id);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

init();
