(function () {
  const displayStatus = (value) =>
    value === "Enable" ? "Enabled" : value === "Disable" ? "Disabled" : value;

  function applyStatusLabels(scope) {
    scope
      .querySelectorAll(".fm-state, .fm-title-status, .er-status, .dm-status, .asset-stage")
      .forEach((node) => {
        const label = displayStatus(node.textContent.trim());
        if (label !== node.textContent.trim()) node.textContent = label;
      });

    scope
      .querySelectorAll('select[id*="Status"] option, select[name*="status"] option')
      .forEach((option) => {
        const label = displayStatus(option.textContent.trim());
        if (label !== option.textContent.trim()) option.textContent = label;
      });

    scope.querySelectorAll(".fm-options label, #statusMultiFilter label").forEach((label) => {
      const text = label.lastChild;
      if (text && text.nodeType === Node.TEXT_NODE)
        text.textContent = displayStatus(text.textContent.trim());
    });
  }

  function applyKnowledgeType() {
    const type = new URLSearchParams(location.search).get("type") || "all";
    document.body.dataset.knowledgeType = type;
    const principles = type === "Principles";
    document.querySelector("#statusMultiFilter")?.toggleAttribute("hidden", principles);
    document
      .querySelector("#subjectDomainFilter")
      ?.toggleAttribute("hidden", principles || type !== "Report Context");
  }

  function removeUnusedVersionDrawer() {
    document.querySelector("#principleVersionDrawer")?.remove();
    document.querySelector("#principleVersionScrim")?.remove();
  }

  applyKnowledgeType();
  applyStatusLabels(document);
  removeUnusedVersionDrawer();
  document.addEventListener("knowledge:typechange", () => {
    applyKnowledgeType();
    requestAnimationFrame(() => applyStatusLabels(document));
  });
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) applyStatusLabels(node);
      }
    }
    removeUnusedVersionDrawer();
  }).observe(document.body, { childList: true, subtree: true });
})();
