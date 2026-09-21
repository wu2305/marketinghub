const personalMemories = Array.isArray(window.personalMemories) ? window.personalMemories : [];

let activeCategory = "all";
let selectedMemoryId = "";

let isEditing = false;
let editingMemoryId = null;

const memoryList = document.querySelector("#memoryList");
const memoryAiBanner = document.querySelector("#memoryAiBanner");
const memoryCategoryTabs = document.querySelectorAll(".memory-category-tab");
const memoryDetailPanel = document.querySelector("#memoryDetailPanel");
const memoryDetailEmpty = document.querySelector("#memoryDetailEmpty");
const memoryDetailContent = document.querySelector("#memoryDetailContent");
const memoryDetailTitle = document.querySelector("#memoryDetailTitle");
const memoryDetailDescription = document.querySelector("#memoryDetailDescription");
const memoryDetailSource = document.querySelector("#memoryDetailSource");
const memoryDetailUpdated = document.querySelector("#memoryDetailUpdated");
const memoryDetailUsed = document.querySelector("#memoryDetailUsed");

const newMemoryBtn = document.querySelector("#newMemoryBtn");
const createMemoryScrim = document.querySelector("#createMemoryScrim");
const createMemoryPanel = document.querySelector("#createMemoryPanel");
const createMemoryClose = document.querySelector("#createMemoryClose");
const createMemoryCancel = document.querySelector("#createMemoryCancel");
const createMemorySave = document.querySelector("#createMemorySave");
const createMemoryForm = document.querySelector("#createMemoryForm");

const categoryLabels = {
  all: "All",
  analysis: "Analysis",
  meeting: "Meeting Notes",
  findings: "Key Findings",
  reference: "Reference",
};

const categoryTagClass = {
  analysis: "analysis",
  meeting: "meeting",
  findings: "findings",
  reference: "reference",
};

function init() {
  bindEvents();
  renderMemories();
}

function bindEvents() {
  // Category tabs
  memoryCategoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeCategory = tab.dataset.category;
      updateTabUI();
      renderMemories();
    });
  });

  // AI banner close
  if (memoryAiBanner) {
    const closeBtn = memoryAiBanner.querySelector(".memory-ai-banner-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        memoryAiBanner.style.display = "none";
      });
    }
  }

  // New memory button
  if (newMemoryBtn) {
    newMemoryBtn.addEventListener("click", openCreateMemoryPanel);
  }

  // Create memory panel close
  if (createMemoryClose) {
    createMemoryClose.addEventListener("click", closeCreateMemoryPanel);
  }
  if (createMemoryCancel) {
    createMemoryCancel.addEventListener("click", closeCreateMemoryPanel);
  }
  if (createMemoryScrim) {
    createMemoryScrim.addEventListener("click", closeCreateMemoryPanel);
  }

  // Create memory save
  if (createMemorySave) {
    createMemorySave.addEventListener("click", saveNewMemory);
  }
}

function openCreateMemoryPanel() {
  if (!createMemoryPanel || !createMemoryScrim) return;
  createMemoryScrim.hidden = false;
  createMemoryPanel.setAttribute("aria-hidden", "false");
  createMemoryPanel.classList.add("open");
  document.body.classList.add("create-memory-open");
  // Reset form
  const form = document.querySelector("#createMemoryForm");
  if (form) form.reset();
}

function closeCreateMemoryPanel() {
  if (!createMemoryPanel || !createMemoryScrim) return;
  createMemoryPanel.classList.remove("open");
  createMemoryPanel.setAttribute("aria-hidden", "true");
  createMemoryScrim.hidden = true;
  document.body.classList.remove("create-memory-open");
}

function saveNewMemory() {
  const titleInput = document.querySelector("#createMemoryTitle");
  const categoryInput = document.querySelector("#createMemoryCategory");
  const descriptionInput = document.querySelector("#createMemoryDescription");

  const showError = (input) => {
    if (!input) return false;
    if ((input.value || "").trim()) {
      clearError(input);
      return false;
    }
    input.classList.add("field-error", "error");
    let err = input.parentElement.querySelector(".field-error-msg");
    if (!err) {
      err = document.createElement("span");
      err.className = "field-error-msg";
      err.textContent = "Cannot be empty";
      input.insertAdjacentElement("afterend", err);
    }
    err.hidden = false;
    return true;
  };

  const clearError = (input) => {
    if (!input) return;
    input.classList.remove("error");
    const err = input.parentElement.querySelector(".field-error-msg");
    if (err) err.hidden = true;
  };

  const hasTitleErr = showError(titleInput);
  const hasDescErr = showError(descriptionInput);
  if (hasTitleErr || hasDescErr) {
    if (hasTitleErr) titleInput.focus();
    else if (hasDescErr) descriptionInput.focus();
    return;
  }

  const title = titleInput.value.trim();
  const category = categoryInput?.value || "analysis";
  const description = descriptionInput.value.trim();

  const newMemory = {
    id: "mem-" + Date.now(),
    title,
    category,
    description,
    tags: [categoryLabels[category] || "Note"],
    relatedTags: [],
    source: "Personal Memory",
    updated: "Just now",
    used: "Never",
    avatarColor: getAvatarColor(category),
  };

  personalMemories.unshift(newMemory);

  closeCreateMemoryPanel();
  updateCategoryCounts();
  renderMemories();

  // Auto-select the new memory
  openMemoryDetail(newMemory.id);
}

function getAvatarColor(category) {
  const colors = {
    analysis: "purple",
    meeting: "gold",
    findings: "pink",
    reference: "teal",
  };
  return colors[category] || "gold";
}

function updateTabUI() {
  memoryCategoryTabs.forEach((tab) => {
    const isActive = tab.dataset.category === activeCategory;
    tab.classList.toggle("active", isActive);
  });
}

function getFilteredMemories() {
  if (activeCategory === "all") return personalMemories;
  return personalMemories.filter((m) => m.category === activeCategory);
}

function getCategoryTagClass(category) {
  return categoryTagClass[category] || "note";
}

function renderMemories() {
  const items = getFilteredMemories();

  if (items.length === 0) {
    memoryList.innerHTML = `
      <div class="memory-empty-state">
        <span>No memories in this category</span>
        <strong>Add your first memory</strong>
      </div>
    `;
    return;
  }

  const html = items
    .map((item) => {
      const isActive = item.id === selectedMemoryId;

      return `
        <div class="memory-card ${isActive ? "active" : ""}" role="option" data-id="${item.id}">
          <div class="memory-card-avatar ${item.avatarColor || "gold"}">
            ${escapeHtml(item.title.charAt(0).toUpperCase())}
          </div>
          <div class="memory-card-body">
            <h4 class="memory-card-title">${escapeHtml(item.title)}</h4>
            <p class="memory-card-desc">${escapeHtml(item.description.substring(0, 100))}${item.description.length > 100 ? "..." : ""}</p>
            <div class="memory-card-meta">
              <span>${escapeHtml(item.source)}</span>
              <span>·</span>
              <span>${escapeHtml(item.updated)}</span>
            </div>
          </div>
          <div class="memory-card-actions">
            <button class="memory-card-more" type="button" aria-label="More actions" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>
            </button>
            <div class="memory-card-dropdown" data-dropdown="${item.id}">
              <button class="memory-card-dropdown-item edit" data-action="edit" data-id="${item.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button class="memory-card-dropdown-item delete" data-action="delete" data-id="${item.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  memoryList.innerHTML = html;

  // Bind card click
  memoryList.querySelectorAll(".memory-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".memory-card-more") || e.target.closest(".memory-card-dropdown"))
        return;
      const id = card.dataset.id;
      if (id) openMemoryDetail(id);
    });
  });

  // Bind more button click
  memoryList.querySelectorAll(".memory-card-more").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCardDropdown(btn.dataset.id);
    });
  });

  // Bind dropdown actions
  memoryList.querySelectorAll(".memory-card-dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      const id = item.dataset.id;
      closeAllDropdowns();
      if (action === "edit") {
        openMemoryDetail(id);
        enterEditMode(id);
      } else if (action === "delete") {
        showDeleteConfirm(id);
      }
    });
  });
}

function toggleCardDropdown(id) {
  const dropdown = document.querySelector(`.memory-card-dropdown[data-dropdown="${id}"]`);
  if (!dropdown) return;
  const isOpen = dropdown.classList.contains("open");
  closeAllDropdowns();
  if (!isOpen) dropdown.classList.add("open");
}

function closeAllDropdowns() {
  document
    .querySelectorAll(".memory-card-dropdown.open")
    .forEach((d) => d.classList.remove("open"));
}

// Close dropdowns when clicking outside
document.addEventListener("click", () => closeAllDropdowns());

function openMemoryDetail(id) {
  const item = personalMemories.find((m) => m.id === id);
  if (!item) return;

  selectedMemoryId = id;
  isEditing = false;
  editingMemoryId = null;

  // Update active card
  memoryList.querySelectorAll(".memory-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.id === id);
  });

  // Show detail content
  memoryDetailEmpty.hidden = true;
  memoryDetailContent.hidden = false;

  renderDetailView(item);
}

function renderDetailView(item) {
  memoryDetailContent.innerHTML = `
    <header class="memory-detail-header">
      <h3 id="memoryDetailTitle">${escapeHtml(item.title)}</h3>
    </header>

    <section class="memory-detail-section">
      <h4>Description</h4>
      <p id="memoryDetailDescription">${escapeHtml(item.description)}</p>
    </section>

    <dl class="memory-detail-meta">
      <div><dt>Source</dt><dd id="memoryDetailSource">${escapeHtml(item.source)}</dd></div>
      <div><dt>Last Updated</dt><dd id="memoryDetailUpdated">${escapeHtml(item.updated)}</dd></div>
      <div><dt>Used</dt><dd id="memoryDetailUsed">${escapeHtml(item.used)}</dd></div>
    </dl>

    <div class="memory-detail-actions">
      <button class="memory-detail-btn secondary" type="button" id="memoryEditBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Edit
      </button>
      <button class="memory-detail-btn primary" type="button" id="memoryShareBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6z"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
        Share to Public Library
      </button>
    </div>

    <button class="memory-delete-btn" type="button" id="memoryDeleteBtn">Delete Memory</button>
  `;

  // Bind edit button
  document.querySelector("#memoryEditBtn")?.addEventListener("click", () => enterEditMode(item.id));
  // Bind delete button
  document
    .querySelector("#memoryDeleteBtn")
    ?.addEventListener("click", () => showDeleteConfirm(item.id));
}

function enterEditMode(id) {
  const item = personalMemories.find((m) => m.id === id);
  if (!item) return;

  isEditing = true;
  editingMemoryId = id;

  memoryDetailContent.innerHTML = `
    <header class="memory-detail-header">
      <div class="memory-detail-edit-field">
        <label for="editTitle">Title</label>
        <input type="text" id="editTitle" value="${escapeHtml(item.title)}" />
      </div>
    </header>

    <section class="memory-detail-section">
      <div class="memory-detail-edit-field">
        <label for="editDescription">Description</label>
        <textarea id="editDescription">${escapeHtml(item.description)}</textarea>
      </div>
    </section>

    <dl class="memory-detail-meta">
      <div><dt>Source</dt><dd id="memoryDetailSource">${escapeHtml(item.source)}</dd></div>
      <div><dt>Last Updated</dt><dd id="memoryDetailUpdated">${escapeHtml(item.updated)}</dd></div>
      <div><dt>Used</dt><dd id="memoryDetailUsed">${escapeHtml(item.used)}</dd></div>
    </dl>

    <div class="memory-detail-edit-actions">
      <button class="memory-detail-btn secondary" type="button" id="editCancelBtn">Cancel</button>
      <button class="memory-detail-btn primary" type="button" id="editSaveBtn">Save Changes</button>
    </div>
  `;

  document.querySelector("#editCancelBtn")?.addEventListener("click", () => {
    isEditing = false;
    editingMemoryId = null;
    renderDetailView(item);
  });

  document.querySelector("#editSaveBtn")?.addEventListener("click", () => {
    const newTitle = document.querySelector("#editTitle")?.value.trim();
    const newDescription = document.querySelector("#editDescription")?.value.trim();
    if (!newTitle || !newDescription) return;

    item.title = newTitle;
    item.description = newDescription;
    item.updated = "Just now";

    isEditing = false;
    editingMemoryId = null;
    renderMemories();
    renderDetailView(item);
  });
}

function showDeleteConfirm(id) {
  const item = personalMemories.find((m) => m.id === id);
  if (!item) return;

  // Create overlay if not exists
  let overlay = document.querySelector("#memoryDeleteOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "memoryDeleteOverlay";
    overlay.className = "memory-delete-overlay";
    overlay.innerHTML = `
      <div class="memory-delete-dialog">
        <h4>Delete Memory</h4>
        <p>Are you sure you want to delete "<strong id="deleteDialogTitle"></strong>"? This action cannot be undone.</p>
        <div class="memory-delete-dialog-actions">
          <button class="cancel-btn" type="button" id="deleteCancelBtn">Cancel</button>
          <button class="confirm-btn" type="button" id="deleteConfirmBtn">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeDeleteConfirm();
    });

    document.querySelector("#deleteCancelBtn")?.addEventListener("click", closeDeleteConfirm);
    document.querySelector("#deleteConfirmBtn")?.addEventListener("click", () => {
      const targetId = overlay.dataset.targetId;
      if (targetId) performDelete(targetId);
      closeDeleteConfirm();
    });
  }

  overlay.dataset.targetId = id;
  document.querySelector("#deleteDialogTitle").textContent = item.title;
  overlay.classList.add("open");
}

function closeDeleteConfirm() {
  document.querySelector("#memoryDeleteOverlay")?.classList.remove("open");
}

function performDelete(id) {
  const idx = personalMemories.findIndex((m) => m.id === id);
  if (idx === -1) return;

  personalMemories.splice(idx, 1);

  if (selectedMemoryId === id) {
    selectedMemoryId = "";
    memoryDetailEmpty.hidden = false;
    memoryDetailContent.hidden = true;
  }

  renderMemories();
  updateCategoryCounts();
}

function updateCategoryCounts() {
  const counts = {
    all: personalMemories.length,
    analysis: personalMemories.filter((m) => m.category === "analysis").length,
    meeting: personalMemories.filter((m) => m.category === "meeting").length,
    findings: personalMemories.filter((m) => m.category === "findings").length,
    reference: personalMemories.filter((m) => m.category === "reference").length,
  };

  document.querySelectorAll(".memory-category-tab").forEach((tab) => {
    const cat = tab.dataset.category;
    const badge = tab.querySelector(".memory-count");
    if (badge && counts[cat] !== undefined) {
      badge.textContent = counts[cat];
    }
  });
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
