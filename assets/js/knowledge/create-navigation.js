(function () {
  const query = new URLSearchParams(location.search);
  if (
    !["Business Term", "Analytical Model", "Scenario Reporting"].includes(query.get("type")) &&
    !/^(business-term-|global-synonym-|scenario-)/.test(query.get("id") || "")
  )
    return;
  const header = document.querySelector(".site-header"),
    main = document.querySelector("main.v20-shell");
  if (!header || !main) return;
  const links = header.querySelector(".nav-links");
  if (links)
    links.innerHTML =
      '<a href="../../index.html#home" class="nav-link">Home</a><a href="reports.html" class="nav-link">Marketing Cockpit</a><a href="flexible.html" class="nav-link">Self-Service Center</a><a href="knowledge.html" class="nav-link" aria-current="page">AI Interpreter</a><a href="campaign.html" class="nav-link">RedNote Campaign Tool</a>';
  header.querySelector(".brand-mark").href = "../../index.html#home";
  const breadcrumb = main.querySelector(".bt-breadcrumb, .approach-breadcrumb, .fm-breadcrumb, .v20-title-breadcrumb");
  if (breadcrumb) {
    breadcrumb.className = "fm-breadcrumb";
    breadcrumb.setAttribute("role", "navigation");
    breadcrumb.setAttribute("aria-label", "Breadcrumb");
    const firstLink = breadcrumb.querySelector("a");
    if (firstLink) firstLink.href = "../../index.html#home";
    if (!breadcrumb.querySelector('a[href*="../../index.html"]'))
      breadcrumb.insertAdjacentHTML("afterbegin", '<a href="../../index.html#home">Home</a><span>/</span>');
    main.prepend(breadcrumb);
  }
  const positionForm = () => {
    main.style.paddingTop =
      (getComputedStyle(header).position === "fixed" ? header.getBoundingClientRect().height : 0) +
      28 +
      "px";
  };
  positionForm();
  new ResizeObserver(positionForm).observe(header);
})();

(function () {
  const supported = ["Report Context", "Metric Dictionary", "Email Reports"];
  function normalizeStatusControl() {
    const type =
      document.querySelector("#knowledgeType")?.value ||
      new URLSearchParams(location.search).get("type");
    if (type === "Principles") {
      Array.from(document.querySelectorAll("#typeFields label"))
        .filter((label) => /Enable knowledge/i.test(label.textContent || ""))
        .forEach((label) => label.remove());
      return;
    }
    if (!supported.includes(type)) return;
    const fields = document.querySelector("#typeFields");
    if (!fields) return;
    let toggle =
      fields.querySelector('.v20-dm-enable input[type="checkbox"]') ||
      Array.from(fields.querySelectorAll('label input[type="checkbox"]')).find((input) =>
        /Enable knowledge|Enable Model/i.test(input.parentElement?.textContent || ""),
      );
    if (!toggle) {
      const label = document.createElement("label");
      label.className = "v20-field v20-switch full fm-status-toggle";
      label.innerHTML =
        '<input type="checkbox" name="status" checked><span>Status: <b>Enable</b></span>';
      (fields.querySelector(".v20-grid") || fields).append(label);
      toggle = label.querySelector("input");
    }
    toggle.name = "status";
    const label = toggle.closest("label");
    label.classList.add("fm-status-toggle");
    let text = label.querySelector("[data-status-label]");
    if (!text) {
      Array.from(label.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .forEach((node) => node.remove());
      text = document.createElement("span");
      text.dataset.statusLabel = "true";
      text.innerHTML = "Status: <b>Enable</b>";
      label.append(text);
    }
    const sync = () => {
      text.querySelector("b").textContent = toggle.checked ? "Enable" : "Disable";
    };
    if (!toggle.dataset.statusBound) {
      toggle.dataset.statusBound = "true";
      toggle.addEventListener("change", sync);
    }
    sync();
  }
  window.setTimeout(normalizeStatusControl, 1200);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(normalizeStatusControl, 500));
})();



