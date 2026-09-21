(function () {
  const assets = window.marketingKnowledgeAssets || [];
  const escapeHtml = (value) =>
    String(value || "").replace(
      /[&<>"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
    );
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="rc-drawer-scrim" id="principleVersionScrim" hidden></div><aside class="rc-version-drawer" id="principleVersionDrawer" aria-hidden="true" aria-label="Principle version history"><header class="rc-drawer-head"><div><small>VERSION HISTORY</small><h2>View Versions</h2></div><button class="rc-close" id="principleVersionClose" type="button" aria-label="Close versions">&times;</button></header><div class="rc-drawer-body"><div class="rc-version-list" id="principleVersionList"></div></div></aside>`,
  );
  const drawer = document.querySelector("#principleVersionDrawer"),
    scrim = document.querySelector("#principleVersionScrim");
  function close() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    scrim.hidden = true;
  }
  document.addEventListener("principles:versions", (event) => {
    const asset = assets.find((item) => item.id === event.detail.id && item.type === "Principles");
    if (!asset) return;
    const versions = [
      {
        number: "v3.2",
        label: "Current Version",
        editor: asset.owner,
        date: asset.updated,
        description: "Refined decision thresholds and confidence requirements.",
        current: true,
      },
      {
        number: "v3.1",
        label: "Published",
        editor: "Data Governance",
        date: "Jul 28, 2026",
        description: "Clarified the core business principle.",
      },
      {
        number: "v2.0",
        label: "Published",
        editor: asset.owner,
        date: asset.created,
        description: "Initial approved principle.",
      },
    ];
    document.querySelector("#principleVersionList").innerHTML = versions
      .map(
        (version) =>
          `<article class="rc-version-item ${version.current ? "current" : ""}"><div class="rc-version-number">${version.number}</div><div><strong>${version.label}</strong><span>${escapeHtml(version.editor)} · ${escapeHtml(version.date)}</span><p>${escapeHtml(version.description)}</p></div></article>`,
      )
      .join("");
    scrim.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
  });
  document.querySelector("#principleVersionClose").addEventListener("click", close);
  scrim.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
})();
