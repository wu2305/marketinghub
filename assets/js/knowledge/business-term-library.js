(function () {
  const library = document.querySelector("#businessKnowledgeLibrary");
  if (!library) return;
  const draftKey = "tapestry-business-term-drafts-v1";
  const esc = (value) =>
    String(value || "").replace(
      /[&<>\"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
    );
  const statusLabel = (value) => (value === "Disable" ? "Disabled" : "Enabled");
  const section = document.createElement("section");
  section.id = "businessTermOverview";
  section.hidden = true;
  library.querySelector(".library-toolbar")?.insertAdjacentElement("afterend", section);

  const records = [
    {
      id: "business-term-gmv",
      title: "GMV (Gross Merchandise Value)",
      description: "Total value of merchandise sold through the platform before deductions.",
      synonyms: ["Gross Sales", "Merchandise Value", "Gross Merchandise Sales"],
      scope: ["D2C Insight", "Revenue Dashboard", "Sales Performance"],
      kind: "Business Term",
      creator: "Current User",
    },
    {
      id: "business-term-paid-customer",
      title: "Paid Customer",
      description:
        "A customer who completed at least one valid paid order during the selected period.",
      synonyms: ["Paying Customer", "Converted Customer"],
      scope: ["D2C Insight", "Customer 360", "Conversion Overview"],
      kind: "Business Term",
      creator: "Emily Wang",
    },
    {
      id: "business-term-active-member",
      title: "Active Member",
      description:
        "A registered member with a qualified visit or transaction in the reporting period.",
      synonyms: ["Engaged Member"],
      scope: ["D2C Insight", "Member Performance"],
      kind: "Business Term",
      creator: "Sophie Taylor",
    },
    {
      id: "global-synonym-revenue",
      title: "Revenue",
      description: "Global aliases used to recognize governed revenue-related questions.",
      synonyms: ["Sales", "Turnover", "Income"],
      scope: ["All models", "All reports"],
      kind: "Global Synonym",
      creator: "Current User",
    },
    {
      id: "global-synonym-customer",
      title: "Customer",
      description: "Global aliases for customers and purchasing members.",
      synonyms: ["Buyer", "Shopper", "Client"],
      scope: ["All models", "All reports"],
      kind: "Global Synonym",
      creator: "Marco Li",
    },
    {
      id: "global-synonym-campaign",
      title: "Campaign",
      description: "Global aliases for marketing campaign activities.",
      synonyms: ["Promotion", "Activation"],
      scope: ["All models", "All reports"],
      kind: "Global Synonym",
      creator: "Sophie Chen",
    },
  ];
  records.forEach((item) => {
    item.status = item.disabled ? "Disable" : "Enable";
  });
  const getDrafts = () => {
    try {
      return JSON.parse(localStorage.getItem(draftKey) || "[]");
    } catch (_) {
      return [];
    }
  };
  const setDrafts = (drafts) => localStorage.setItem(draftKey, JSON.stringify(drafts));
  getDrafts().filter((draft) => draft.stage !== "Draft" || draft.creator === "Current User").forEach((draft) =>
    records.unshift({
      ...draft,
      status: draft.status === "Disable" ? "Disable" : "Enable",
      stage: draft.stage || (draft.status === "Disable" ? "Draft" : "Published"),
      creator: draft.creator || "Current User",
      kind: draft.kind || "Business Term",
      synonyms: Array.isArray(draft.synonyms) ? draft.synonyms : [],
    }),
  );

  const icons = {
    term: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v4H4zM4 10h16v4H4zM4 16h10v4H4z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L12 14l-4 1 1-4 7.5-7.5z"/></svg>',
    delete:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>',
    disable:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/></svg>',
  };
  const domainTags = (item) =>
    `<div class="bt-scope-tags"><span class="bt-scope-tag">${esc(item.kind === "Global Synonym" || item.scope[0] === "Global" ? "All models" : item.scope[0] || "—")}</span></div>`;
  const isOwn = (item) => item.creator === "Current User";
  const actions = (item) =>
    ["edit", "delete", "disable"]
      .map((action) => {
        const disabled =
          !isOwn(item) ||
          (action === "disable" && (item.status === "Disable" || item.stage === "Draft")) ||
          (action !== "disable" && item.status !== "Disable");
        const text = action[0].toUpperCase() + action.slice(1);
        const title = !isOwn(item)
          ? `You do not have permission to ${action} knowledge created by another user.`
          : action !== "disable" && item.status !== "Disable"
            ? "Disable knowledge first"
            : item.stage === "Draft" && action === "disable"
              ? "Draft knowledge is already disabled."
              : item.status === "Disable" && action === "disable"
                ? "Knowledge is already disabled."
                : text;
        return `<button type="button" class="fm-button fm-icon-action ${action === "delete" ? "danger" : ""} ${disabled ? "is-action-disabled" : ""}" data-bt-action="${action}" data-bt-target="${esc(item.id)}" aria-disabled="${disabled}" aria-label="${text} ${esc(item.title)}" title="${title}">${icons[action]}</button>`;
      })
      .join("");
  const card = (item) => `
    <article class="bt-term-card" data-bt-id="${esc(item.id)}" tabindex="0">
      <div class="bt-term-card-main">
        <h3 title="${esc(item.title)}">${esc(item.title)}${item.stage === "Draft" ? '<sup class="fm-draft-badge">Draft</sup>' : ""}</h3>
        <p title="${esc(item.description)}">${esc(item.description)}</p>
        <div class="bt-term-card-meta">
          <div class="bt-term-card-field">
            <span>Creator</span>
            <strong title="${esc(item.creator)}">${esc(item.creator)}</strong>
          </div>
        </div>
        <div class="bt-term-card-field bt-term-card-synonyms">
          <span>Synonyms</span>
          <div class="bt-tags">${item.synonyms.map((value) => `<span class="bt-tag">${esc(value)}</span>`).join("")}</div>
        </div>
      </div>
      <div class="bt-term-card-pills">
        <span class="fm-state ${item.status === "Disable" ? "off" : ""}">${statusLabel(item.status)}</span>
        ${domainTags(item)}
      </div>
      <div class="bt-term-card-actions">
        <div class="fm-actions">${actions(item)}</div>
      </div>
    </article>
  `;

  function dialog(title, message, onConfirm) {
    if (!onConfirm && /knowledge (disabled|deleted)/i.test(title)) {
      window.showKnowledgeSuccessToast?.(title === "Knowledge deleted" ? "Deleted successfully" : "Taken offline successfully");
      return;
    }
    const modal = document.createElement("dialog");
    const blocked = /offline first/i.test(title);
    const isDelete = /delete/i.test(title);
    const isOffline = /disable|offline/i.test(title);
    const isConfirm = Boolean(onConfirm);
    const icon = '<span class="knowledge-confirm-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4m0 4h.01"/><path d="M10.3 3.6 2.5 17.1A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.9L13.7 3.6a2 2 0 0 0-3.4 0Z"/></svg></span>';
    modal.className = `fm-dialog${isConfirm ? " knowledge-confirm-dialog" : ""}`;
    modal.innerHTML = isConfirm
      ? `<div class="knowledge-confirm-main">${icon}<div><h3>${blocked ? "Please take the knowledge offline first" : "Confirm Operation"}</h3><p>${blocked ? message : isDelete ? "Please confirm whether to delete this knowledge. Deletion cannot be undone." : isOffline ? "Please confirm whether to offline this knowledge." : message}</p></div></div><footer><button type="button" class="fm-button" data-dialog-close>Cancel</button><button type="button" class="fm-button primary" data-dialog-confirm>${blocked ? "Go Offline" : isDelete ? "Confirm Delete" : isOffline ? "Confirm Offline" : "Confirm"}</button></footer>`
      : `<h3>${esc(title)}</h3><p>${esc(message)}</p><footer><button type="button" class="fm-button" data-dialog-close>Close</button></footer>`;
    document.body.append(modal);
    modal.querySelector("[data-dialog-close]").onclick = () => modal.close();
    modal.querySelector("[data-dialog-confirm]")?.addEventListener("click", () => {
      modal.close();
      onConfirm();
    });
    modal.addEventListener("close", () => modal.remove());
    modal.showModal();
  }

  const overlay = document.createElement("div");
  overlay.className = "fm-overlay";
  overlay.hidden = true;
  overlay.innerHTML =
    '<aside class="fm-drawer fm-analysis-drawer" role="dialog" aria-modal="true"><header class="fm-drawer-head"><div><small>Business Term</small><div class="fm-drawer-titleline"><h2 id="btDrawerTitle"></h2><span class="fm-title-status" id="btDrawerStatus"></span></div></div><button type="button" class="fm-button fm-close" aria-label="Close details">×</button></header><div class="fm-drawer-body"></div><footer class="fm-drawer-foot"></footer></aside>';
  document.body.append(overlay);
  let current = null;
  function closeDetail() {
    overlay.hidden = true;
    current = null;
  }
  function openDetail(item) {
    current = item;
    overlay.querySelector("#btDrawerTitle").textContent = item.title;
    const status = overlay.querySelector("#btDrawerStatus");
    status.textContent = statusLabel(item.status);
    status.className = `fm-title-status ${item.status === "Enable" ? "is-enable" : "is-neutral"}`;
    overlay.querySelector(".fm-drawer-body").innerHTML =
      `<div class="scenario-report-detail"><section class="scenario-report-section"><h3>Term Type</h3><p>${esc(item.kind)}</p></section><section class="scenario-report-section"><h3>Description</h3><p>${esc(item.description)}</p></section><section class="scenario-report-section"><h3>Synonyms</h3><div class="fm-tags">${item.synonyms.map((value) => `<span class="fm-chip">${esc(value)}</span>`).join("")}</div></section><section class="scenario-report-section"><h3>Data Model</h3>${domainTags(item)}</section><section class="scenario-report-section"><h3>Creator</h3><p>${esc(item.creator)}</p></section></div>`;
    overlay.querySelector(".fm-drawer-foot").innerHTML = actions(item);
    overlay.hidden = false;
  }
  function act(event) {
    const button = event.target.closest("[data-bt-action]");
    if (!button) return false;
    event.preventDefault();
    event.stopPropagation();
    const item = records.find((record) => record.id === button.dataset.btTarget);
    if (!item) return true;
    const action = button.dataset.btAction;
    if (!isOwn(item)) {
      dialog(
        "Permission denied",
        `You do not have permission to ${action} knowledge created by another user.`,
      );
      return true;
    }
    if (["edit", "delete"].includes(action) && item.status !== "Disable") {
      dialog(
        "Disable knowledge first",
        `To edit or delete this knowledge, take it offline first. Once offline, users cannot access it temporarily.`,
        () => {
          item.status = "Disable";
          if (current === item) openDetail(item);
          render();
        },
      );
      return true;
    }
    if (action === "edit")
      location.href = `knowledge-create.html?type=Business%20Term&mode=edit&id=${encodeURIComponent(item.id)}`;
    if (action === "delete")
      dialog("Delete knowledge?", `Delete “${item.title}”? This action cannot be undone.`, () => {
        setDrafts(getDrafts().filter((draft) => draft.id !== item.id));
        records.splice(records.indexOf(item), 1);
        if (current === item) closeDetail();
        render();
        dialog("Knowledge deleted", `“${item.title}” has been deleted.`);
      });
    if (action === "disable" && item.status === "Disable")
      dialog("Knowledge already disabled", "This knowledge is already disabled.");
    if (action === "disable" && item.status !== "Disable")
      dialog(
        "Disable knowledge?",
        `Disable “${item.title}”? It will no longer be available for AI use.`,
        () => {
          item.status = "Disable";
          render();
          dialog("Knowledge disabled", `“${item.title}” has been disabled.`);
        },
      );
    return true;
  }
  overlay.addEventListener("click", (event) => {
    if (act(event)) return;
    if (event.target === overlay || event.target.closest(".fm-close")) closeDetail();
  });
  document.addEventListener("keydown", (event) => {
    if (!overlay.hidden && event.key === "Escape") closeDetail();
  });

  const filters = { status: new Set(), domain: new Set(), creator: new Set(), query: "" };
  let page = 1;
  let pageSize = 10;
  let tagClampFrame = 0;
  function alignCardActions() {
    section.querySelectorAll(".bt-term-card").forEach((card) => {
      const actions = card.querySelector(".bt-term-card-actions");
      const synonymField = card.querySelector(".bt-term-card-synonyms");
      const visibleTags = synonymField
        ? Array.from(synonymField.querySelectorAll(".bt-tag")).filter(
            (tag) => window.getComputedStyle(tag).display !== "none",
          )
        : [];
      const target = visibleTags[visibleTags.length - 1] || synonymField?.querySelector(":scope > span");
      if (!actions || !target) return;
      const cardRect = card.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const borderTop = Number.parseFloat(window.getComputedStyle(card).borderTopWidth) || 0;
      const top = targetRect.top - cardRect.top - borderTop + (targetRect.height - actions.offsetHeight) / 2;
      actions.style.setProperty("--bt-actions-top", `${Math.round(top)}px`);
      actions.classList.add("is-synonym-aligned");
    });
  }
  function clampSynonymRows() {
    section.querySelectorAll(".bt-tags").forEach((container) => {
      container.querySelector(".bt-tag-overflow")?.remove();
      const tags = Array.from(container.querySelectorAll(":scope > .bt-tag"));
      tags.forEach((tag) => tag.style.removeProperty("display"));
      if (!tags.length) return;
      const isOutside = (element) =>
        element.offsetLeft + element.offsetWidth > container.clientWidth + 1;
      if (!tags.some(isOutside)) return;
      const overflow = document.createElement("span");
      overflow.className = "bt-tag bt-tag-overflow";
      overflow.textContent = "…";
      overflow.setAttribute("aria-label", "More synonyms");
      container.append(overflow);
      while (isOutside(overflow)) {
        const visibleTags = tags.filter((tag) => tag.style.display !== "none");
        const lastVisible = visibleTags[visibleTags.length - 1];
        if (!lastVisible) break;
        lastVisible.style.display = "none";
      }
    });
    alignCardActions();
  }
  function queueSynonymClamp() {
    window.cancelAnimationFrame(tagClampFrame);
    tagClampFrame = window.requestAnimationFrame(clampSynonymRows);
  }
  function filter(label, key, options, openFilterKey) {
    const defaultSummary =
      key === "status"
        ? "All statuses"
        : key === "domain"
          ? "All models"
          : "All creators";
    const summary = filters[key].size ? `${filters[key].size} selected` : defaultSummary;
    return `<div class="fm-filter bt-overview-filter"><span>${label}</span><details${openFilterKey === key ? " open" : ""}><summary>${summary}<i></i></summary><div class="fm-options">${options.map((option) => `<label><input type="checkbox" value="${esc(option.value)}" data-bt-filter="${key}" ${filters[key].has(option.value) ? "checked" : ""}>${esc(option.label || option.value)}</label>`).join("")}</div></details></div>`;
  }
  function render(openFilterKey = "") {
    const creators = [...new Set(records.map((item) => item.creator).filter(Boolean))];
    const rows = records.filter((item) => {
      const statusMatch =
        !filters.status.size ||
        [...filters.status].some((value) =>
          value === "Draft" ? item.stage === "Draft" : item.status === value,
        );
      const text = [
        item.title,
        item.description,
        item.synonyms.join(" "),
        item.scope.join(" "),
        item.creator,
      ]
        .join(" ")
        .toLowerCase();
      return (
        statusMatch &&
        (!filters.creator.size || filters.creator.has(item.creator)) &&
        text.includes(filters.query)
      );
    });
    const total = Math.max(1, Math.ceil(rows.length / pageSize));
    page = Math.min(page, total);
    const visibleRows = rows.slice((page - 1) * pageSize, page * pageSize);
    section.innerHTML = `<div class="bt-table-wrap"><div class="fm-tools bt-overview-tools">${filter(
      "Status",
      "status",
      [
        { value: "Enable", label: "Enabled" },
        { value: "Disable", label: "Disabled" },
      ],
      openFilterKey,
    )}${filter(
      "Creator",
      "creator",
      creators.map((value) => ({ value })),
      openFilterKey,
    )}<label class="search-field scenario-report-search bt-overview-search overview-global-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg><input type="search" data-bt-search placeholder="Search knowledge..." value="${esc(filters.query)}"></label><a class="knowledge-add-button" href="knowledge-create.html?type=Business%20Term" target="_blank" rel="noopener"><span aria-hidden="true">＋</span>Add Business Term</a></div><div class="bt-overview-countline" aria-live="polite">Showing <strong>${rows.length}</strong> of <strong>${records.length}</strong> terms</div>${rows.length ? `<div class="bt-term-card-list">${visibleRows.map(card).join("")}</div>` : '<div class="bt-empty">No matching records</div>'}<footer class="fm-pagination"><span>${rows.length} records</span><div><label>Rows per page <select data-bt-page-size aria-label="Rows per page">${[5, 10, 20].map((n) => `<option ${n === pageSize ? "selected" : ""}>${n}</option>`).join("")}</select></label><button class="fm-button" data-bt-page="previous" ${page === 1 ? "disabled" : ""}>Previous</button><span>${page} / ${total}</span><button class="fm-button" data-bt-page="next" ${page === total ? "disabled" : ""}>Next</button></div></footer></div>`;
    queueSynonymClamp();
  }
  function sync() {
    const active = new URLSearchParams(location.search).get("type") === "Business Term";
    section.hidden = !active;
    library.classList.toggle("bt-overview-active", active);
    [
      ".asset-table-head",
      "#principlesCardGrid",
      "#assetList",
      "#businessPagination",
      ".library-toolbar",
    ].forEach((selector) => {
      const element = library.querySelector(selector);
      if (element) element.hidden = active;
    });
    if (active) render();
    else closeDetail();
  }
  document.addEventListener("knowledge:typechange", sync);
  window.addEventListener("resize", queueSynonymClamp);
  section.addEventListener("change", (event) => {
    const input = event.target.closest("[data-bt-filter]");
    if (!input) return;
    const filterKey = input.dataset.btFilter;
    input.checked
      ? filters[filterKey].add(input.value)
      : filters[filterKey].delete(input.value);
    page = 1;
    render(filterKey);
  });
  section.addEventListener("input", (event) => {
    const input = event.target.closest("[data-bt-search]");
    if (!input) return;
    filters.query = input.value.trim().toLowerCase();
    page = 1;
    render();
  });
  section.addEventListener("click", (event) => {
    const pager = event.target.closest("[data-bt-page]");
    if (pager && !pager.disabled) {
      page += pager.dataset.btPage === "next" ? 1 : -1;
      render();
      return;
    }
    if (act(event)) return;
    const card = event.target.closest("[data-bt-id]");
    if (!card || event.target.closest("button, a, input, select, textarea")) return;
    const item = records.find((record) => record.id === card.dataset.btId);
    if (item) openDetail(item);
  });
  section.addEventListener("change", (event) => {
    if (!event.target.matches("[data-bt-page-size]")) return;
    pageSize = Number(event.target.value);
    page = 1;
    render();
  });
  section.addEventListener("keydown", (event) => {
    if (event.target.matches("[data-bt-id]") && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      const item = records.find((record) => record.id === event.target.dataset.btId);
      if (item) openDetail(item);
    }
  });
  document.querySelector(".create-knowledge-btn")?.addEventListener(
    "click",
    (event) => {
      if (section.hidden) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = "knowledge-create.html?type=Business%20Term";
    },
    true,
  );
  window.setTimeout(sync, 100);
})();









