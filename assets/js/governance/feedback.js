const feedbackData = Array.isArray(window.feedbackData) ? window.feedbackData : [];

let activeTab = "all";
let activeType = "all";
let activeTime = "all";
let searchQuery = "";

const feedbackTabs = document.querySelectorAll(".feedback-tab");
const feedbackSearch = document.querySelector("#feedbackSearch");
const feedbackTypeFilter = document.querySelector("#feedbackTypeFilter");
const feedbackTimeFilter = document.querySelector("#feedbackTimeFilter");
const feedbackList = document.querySelector("#feedbackList");
const feedbackEmptyState = document.querySelector("#feedbackEmptyState");
const feedbackResultCount = document.querySelector("#feedbackResultCount");
const allTabCount = document.querySelector("#allTabCount");
const thumbsUpTabCount = document.querySelector("#thumbsUpTabCount");
const thumbsDownTabCount = document.querySelector("#thumbsDownTabCount");
const totalFeedbackCount = document.querySelector("#totalFeedbackCount");
const thumbsUpCount = document.querySelector("#thumbsUpCount");
const thumbsDownCount = document.querySelector("#thumbsDownCount");

function init() {
  updateCounts();
  bindEvents();
  bindPanelEvents();
  renderFeedback();
}

function updateCounts() {
  const total = feedbackData.length;
  const thumbsUp = feedbackData.filter((i) => i.type === "thumbs-up").length;
  const thumbsDown = feedbackData.filter((i) => i.type === "thumbs-down").length;

  if (allTabCount) allTabCount.textContent = total;
  if (thumbsUpTabCount) thumbsUpTabCount.textContent = thumbsUp;
  if (thumbsDownTabCount) thumbsDownTabCount.textContent = thumbsDown;
  if (totalFeedbackCount) totalFeedbackCount.textContent = total;
  if (thumbsUpCount) thumbsUpCount.textContent = thumbsUp;
  if (thumbsDownCount) thumbsDownCount.textContent = thumbsDown;
}

function bindEvents() {
  feedbackTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeTab = tab.dataset.tab;
      // Sync type filter with tab
      if (activeTab !== "all" && feedbackTypeFilter) {
        feedbackTypeFilter.value = activeTab;
        activeType = activeTab;
      } else if (activeTab === "all" && feedbackTypeFilter) {
        feedbackTypeFilter.value = "all";
        activeType = "all";
      }
      updateTabUI();
      renderFeedback();
    });
  });

  if (feedbackSearch) {
    feedbackSearch.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderFeedback();
    });
  }

  if (feedbackTypeFilter) {
    feedbackTypeFilter.addEventListener("change", (e) => {
      activeType = e.target.value;
      // Sync tab with type filter
      if (activeType === "all") {
        activeTab = "all";
      } else if (activeType === "thumbs-up" || activeType === "thumbs-down") {
        activeTab = activeType;
      }
      updateTabUI();
      renderFeedback();
    });
  }

  if (feedbackTimeFilter) {
    feedbackTimeFilter.addEventListener("change", (e) => {
      activeTime = e.target.value;
      renderFeedback();
    });
  }
}

function updateTabUI() {
  feedbackTabs.forEach((tab) => {
    const isActive = tab.dataset.tab === activeTab;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function getFilteredItems() {
  const now = new Date();
  return feedbackData.filter((item) => {
    if (activeTab !== "all" && item.type !== activeTab) return false;
    if (activeType !== "all" && item.type !== activeType) return false;
    if (activeTime !== "all") {
      const itemDate = new Date(item.timestamp);
      const diffMs = now - itemDate;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (activeTime === "today" && diffDays > 1) return false;
      if (activeTime === "week" && diffDays > 7) return false;
      if (activeTime === "month" && diffDays > 30) return false;
    }
    if (searchQuery) {
      const text = (
        item.question +
        " " +
        item.answer +
        " " +
        item.feedbackBy +
        " " +
        item.reason
      ).toLowerCase();
      if (!text.includes(searchQuery)) return false;
    }
    return true;
  });
}

function renderFeedback() {
  const items = getFilteredItems();

  if (feedbackResultCount) {
    feedbackResultCount.textContent = `${items.length} ${items.length === 1 ? "record" : "records"}`;
  }

  if (items.length === 0) {
    if (feedbackList) feedbackList.innerHTML = "";
    if (feedbackEmptyState) feedbackEmptyState.hidden = false;
    return;
  }

  if (feedbackEmptyState) feedbackEmptyState.hidden = true;

  const html = items
    .map((item) => {
      const isThumbsUp = item.type === "thumbs-up";
      const typeLabel = isThumbsUp ? "Thumbs Up" : "Thumbs Down";
      const typeClass = isThumbsUp ? "thumbs-up" : "thumbs-down";
      const reasonDisplay = item.reason
        ? `<span class="feedback-reason-text" title="${escapeHtml(item.reason)}">${escapeHtml(truncateText(item.reason, 40))}</span>`
        : `<span class="feedback-reason-none">—</span>`;
      const thumbsIcon = isThumbsUp
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 2.3l1.38 9a2 2 0 002 1.7H10zm0 0V8.5"/><path d="M17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3"/></svg>`;

      return `
        <div class="asset-card feedback-card" role="option" data-id="${item.id}">
          <div class="feedback-question">
            <strong>${escapeHtml(truncateText(item.question, 50))}</strong>
          </div>
          <div class="feedback-answer">
            <span>${escapeHtml(truncateText(item.answer, 60))}</span>
          </div>
          <div class="feedback-type">
            <span class="feedback-type-badge ${typeClass}">${thumbsIcon} ${typeLabel}</span>
          </div>
          <div class="feedback-reason">
            ${reasonDisplay}
          </div>
          <div class="feedback-by">
            <span class="feedback-avatar">${escapeHtml(item.feedbackByInitials)}</span>
            <span>${escapeHtml(item.feedbackBy)}</span>
          </div>
          <div class="feedback-time">${escapeHtml(item.time)}</div>
          <div class="feedback-actions">
            <button class="feedback-view-btn" type="button" data-action="view" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              View
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  if (feedbackList) feedbackList.innerHTML = html;

  // Bind view buttons
  feedbackList.querySelectorAll("[data-action='view']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openDetail(e.target.closest("[data-id]").dataset.id);
    });
  });

  // Bind row clicks
  feedbackList.querySelectorAll(".feedback-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".feedback-actions")) return;
      openDetail(card.dataset.id);
    });
  });
}

/* ── Detail Panel ── */
const feedbackDetailScrim = document.querySelector("#feedbackDetailScrim");
const feedbackDetailPanel = document.querySelector("#feedbackDetailPanel");
const feedbackDetailClose = document.querySelector("#feedbackDetailClose");
const feedbackDetailContent = document.querySelector("#feedbackDetailContent");
const feedbackDetailEmpty = document.querySelector("#feedbackDetailEmpty");

function bindPanelEvents() {
  if (feedbackDetailClose) {
    feedbackDetailClose.addEventListener("click", closeDetail);
  }
  if (feedbackDetailScrim) {
    feedbackDetailScrim.addEventListener("click", closeDetail);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });
}

function openDetail(id) {
  const item = feedbackData.find((i) => i.id === id);
  if (!item) return;

  const isThumbsUp = item.type === "thumbs-up";
  const typeLabel = isThumbsUp ? "Thumbs Up" : "Thumbs Down";
  const typeClass = isThumbsUp ? "thumbs-up" : "thumbs-down";

  document.querySelector("#feedbackDetailType").textContent = typeLabel;
  document.querySelector("#feedbackDetailType").className = `feedback-type-badge ${typeClass}`;
  document.querySelector("#feedbackDetailTime").textContent = item.time;
  document.querySelector("#feedbackDetailQuestion").textContent = item.question;
  document.querySelector("#feedbackDetailAnswer").textContent = item.answer;
  document.querySelector("#feedbackDetailBy").textContent = item.feedbackBy;
  document.querySelector("#feedbackDetailOperationTime").textContent = item.time;

  const reasonSection = document.querySelector("#feedbackDetailReasonSection");
  const reasonEl = document.querySelector("#feedbackDetailReason");
  if (item.reason) {
    reasonSection.hidden = false;
    reasonEl.textContent = item.reason;
  } else {
    reasonSection.hidden = true;
  }

  if (feedbackDetailContent) feedbackDetailContent.hidden = false;
  if (feedbackDetailEmpty) feedbackDetailEmpty.hidden = true;

  if (feedbackDetailScrim) feedbackDetailScrim.hidden = false;
  if (feedbackDetailPanel) {
    feedbackDetailPanel.classList.add("open");
    feedbackDetailPanel.setAttribute("aria-hidden", "false");
  }
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  if (feedbackDetailScrim) feedbackDetailScrim.hidden = true;
  if (feedbackDetailPanel) {
    feedbackDetailPanel.classList.remove("open");
    feedbackDetailPanel.setAttribute("aria-hidden", "true");
  }
  document.body.style.overflow = "";
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncateText(str, maxLength) {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
