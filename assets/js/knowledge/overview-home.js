/* Overview-only discovery behavior for the Figma-aligned knowledge workspace. */
(function () {
  const input = document.querySelector("#overviewKnowledgeSearch");
  const status = document.querySelector("#overviewSearchStatus");
  const grid = document.querySelector("#knowledgeTypeStats");
  const overviewNav = document.querySelector("#businessOverviewNav");
  const askAiButton = document.querySelector("#overviewAskAi");
  if (!input || !grid) return;

  function isOverview() {
    return document.querySelector(".knowledge-main")?.classList.contains("business-overview-page");
  }

  function applyFilter() {
    const query = input.value.trim().toLowerCase();
    const cards = Array.from(grid.querySelectorAll(".v20-type-card"));
    let visibleCount = 0;
    cards.forEach((card) => {
      const matches = !query || card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    if (status) {
      status.textContent = query
        ? `${visibleCount} knowledge ${visibleCount === 1 ? "area" : "areas"} found`
        : "";
    }
  }

  input.addEventListener("input", applyFilter);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && input.value) {
      input.value = "";
      applyFilter();
      return;
    }
    if (event.key === "Enter") {
      const visibleCards = Array.from(grid.querySelectorAll(".v20-type-card:not([hidden])"));
      if (visibleCards.length === 1) visibleCards[0].click();
    }
  });

  document.addEventListener("keydown", (event) => {
    const active = document.activeElement;
    const editing =
      active &&
      (active.matches("input, textarea, select") || active.getAttribute("contenteditable") === "true");
    const isSearchShortcut =
      event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k");
    if (isSearchShortcut && !editing && isOverview()) {
      event.preventDefault();
      input.focus();
    }
  });

  askAiButton?.addEventListener("click", () => {
    document.querySelector("#aiEntry")?.click();
  });

  overviewNav?.addEventListener("click", () => {
    window.setTimeout(applyFilter, 0);
  });

  document.addEventListener("knowledge:typechange", () => {
    if (isOverview()) window.setTimeout(applyFilter, 0);
  });

  new MutationObserver(applyFilter).observe(grid, { childList: true });
  applyFilter();
})();
