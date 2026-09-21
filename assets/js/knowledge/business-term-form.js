(function () {
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode");
  const id = query.get("id") || query.get("copy") || "";
  // A direct visit to the creation page is the Business Term workflow by default.
  // Explicit type parameters still select their own specialized forms.
  const isBusinessTerm =
    !query.get("type") ||
    query.get("type") === "Business Term" ||
    id.startsWith("business-term-") ||
    id.startsWith("global-synonym-");
  if (!isBusinessTerm) return;
  document.body.classList.add("unified-knowledge-create");
  document.body.classList.add("business-term-create");
  document.querySelector(".v20-page-head .v20-status")?.remove();

  const records = {
    "global-synonym-revenue": {
      title: "Revenue",
      description: "Global aliases used to recognize governed revenue-related questions.",
      synonyms: "Sales, Turnover, Income",
      scope: ["Global", "All reports"],
    },
    "global-synonym-customer": {
      title: "Customer",
      description: "Global aliases for customers and purchasing members.",
      synonyms: "Buyer, Shopper, Client",
      scope: ["Global", "All reports"],
    },
    "global-synonym-campaign": {
      title: "Campaign",
      description: "Global aliases for marketing campaign activities.",
      synonyms: "Promotion, Activation",
      scope: ["Global", "All reports"],
    },
    "business-term-gmv": {
      title: "GMV (Gross Merchandise Value)",
      description: "Total value of merchandise sold through the platform before deductions.",
      synonyms: "Gross Sales, Merchandise Value, Gross Merchandise Sales",
      scope: ["Commerce", "Revenue Dashboard", "Sales Performance"],
    },
    "business-term-paid-customer": {
      title: "Paid Customer",
      description:
        "A customer who completed at least one valid paid order during the selected period.",
      synonyms: "Paying Customer, Converted Customer",
      scope: ["Customer", "Customer 360", "Conversion Overview"],
    },
    "business-term-active-member": {
      title: "Active Member",
      description:
        "A registered member with a qualified visit or transaction in the reporting period.",
      synonyms: "Engaged Member",
      scope: ["Customer", "Member Performance"],
    },
  };
  const draftKey = "tapestry-business-term-drafts-v1";
  const drafts = (() => {
    try {
      return JSON.parse(localStorage.getItem(draftKey) || "[]");
    } catch (_) {
      return [];
    }
  })();
  drafts.forEach((draft) => {
    records[draft.id] = {
      ...draft,
      synonyms: Array.isArray(draft.synonyms) ? draft.synonyms.join(", ") : draft.synonyms || "",
    };
  });

  const domainOptions = Array.from(
    new Set([
      "Marketing",
      "Customer",
      "Retail Operations",
      "Data Governance",
      "City Strategy",
      "Commerce",
      "Revenue Dashboard",
      "Sales Performance",
      "Sales Performance Report",
      "Customer 360",
      "Conversion Overview",
      "Member Performance",
      "4P Report",
      "Customer Daily Tracking",
      "ABO",
      "Rednote Tracking",
      "OTT/OLV Media Data Tracking",
      "Global",
      "All reports",
    ]),
  );

  const item =
    mode === "edit" || query.get("copy")
      ? records[id] || records["business-term-gmv"]
      : {
          title: "",
          description: "",
          synonyms: "",
          scope: [],
          kind: "Business Term",
        };
  const initialTermType = item.kind === "Global Synonym" || id.startsWith("global-synonym-") ? "Global Synonym" : "Business Term";

  const esc = (value) =>
    String(value || "").replace(
      /[&<>\"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
    );
  const pageTitle = document.querySelector("#pageTitle");
  const head = document.querySelector(".v20-page-head");
  const card = document.querySelector(".v20-form-card");
  const fields = document.querySelector("#typeFields");
  const footer = document.querySelector(".v20-form-footer");

  function mountMultiSelect(select) {
    if (!select || select.dataset.btMounted) return;
    select.dataset.btMounted = "true";
    const wrap = document.createElement("div");
    const button = document.createElement("button");
    const menu = document.createElement("div");
    wrap.className = "v20-multi bt-multi";
    button.type = "button";
    button.className = "v20-multi-display";
    menu.className = "v20-multi-menu";
    select.parentNode.insertBefore(wrap, select);
    wrap.append(select, button, menu);
    select.hidden = true;
    const render = () => {
      const values = Array.from(select.selectedOptions)
        .map((option) => option.textContent || "")
        .filter(Boolean);
      button.innerHTML = values.length
        ? values.map((value) => `<span>${esc(value)}</span>`).join("")
        : "<em>Select one or more</em>";
      menu.innerHTML = Array.from(select.options)
        .map(
          (option) => `
        <label>
          <input type="checkbox" value="${esc(option.value)}" ${option.selected ? "checked" : ""}>
          ${esc(option.textContent || option.value)}
        </label>
      `,
        )
        .join("");
    };
    render();
    button.addEventListener("click", () => menu.classList.toggle("open"));
    menu.addEventListener("change", (event) => {
      const checkbox = event.target.closest("input[type='checkbox']");
      if (!checkbox) return;
      const option = Array.from(select.options).find((item) => item.value === checkbox.value);
      if (option) option.selected = checkbox.checked;
      render();
    });
    document.addEventListener("click", (event) => {
      if (!wrap.contains(event.target)) menu.classList.remove("open");
    });
  }

  const selectedScopes = Array.isArray(item.scope) ? item.scope : [];
  const scopeOptions = domainOptions
    .map(
      (option) =>
        `<option ${selectedScopes.includes(option) ? "selected" : ""}>${esc(option)}</option>`,
    )
    .join("");

  document.querySelector(".v20-type-row")?.remove();
  card.classList.add("bt-create-shell");
  const title = mode === "edit" ? `Edit ${item.title}` : "Create Business Term";
  if (pageTitle) pageTitle.textContent = title;
  head.querySelector("p:not(.v20-eyebrow)")?.remove();
  head.querySelector(".v20-title-breadcrumb")?.remove();
  head.querySelector(":scope > div")?.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="bt-breadcrumb">
      <a href="../../index.html">Home</a><span>/</span><a href="knowledge.html">AI Interpreter</a><span>/</span><a href="knowledge.html">Knowledge Management</a><span>/</span><a href="knowledge.html?type=Business%20Term">Business Term</a><span>/</span><b>${esc(title)}</b>
    </div>
  `,
  );

  fields.className = "bt-edit-form bt-business-term-form unified-knowledge-form";
  fields.innerHTML = `
    <div class="bt-business-term-panel">
      <aside class="bt-form-guidance" aria-label="Business term guidance">
        <span class="bt-guidance-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 21h4"></path><path d="M8.7 14.6A6.5 6.5 0 1 1 15.3 14.6c-.8.7-1.3 1.6-1.3 2.6h-4c0-1-.5-1.9-1.3-2.6Z"></path><path d="M12 2V.8M4.9 4.9 4 4M19.1 4.9 20 4M2 12H.8M23.2 12H22M4.9 19.1 4 20M19.1 19.1 20 20"></path></svg></span>
        <div><strong>Build a common language</strong><p>Clearly define the meaning, usage, and boundaries of this business term to help teams talk about data consistently.</p></div>
      </aside>
      <div class="bt-basic-grid bt-business-term-grid">
        <label class="bt-field span-2">
          <span>Title <i class="unified-required" aria-hidden="true">*</i></span>
          <input name="title" required placeholder="Enter the business term title." value="${esc(item.title)}">
        </label>
        <label class="bt-field span-2">
          <span>Term Type <i class="unified-required" aria-hidden="true">*</i></span>
          <select name="kind" id="businessTermKind" required>
            <option value="Business Term" ${initialTermType === "Business Term" ? "selected" : ""}>Business Term</option>
            <option value="Global Synonym" ${initialTermType === "Global Synonym" ? "selected" : ""}>Global Synonym</option>
          </select>
        </label>
        <label class="bt-field span-2">
          <span>Description <i class="unified-required" aria-hidden="true">*</i></span>
          <textarea name="description" required placeholder="Explain the meaning, usage, and boundary of this term.">${esc(item.description)}</textarea>
        </label>
        <label class="bt-field span-2">
          <span>Synonyms</span>
          <input name="synonyms" placeholder="Add aliases, abbreviations, or equivalent terms, separated by commas." value="${esc(item.synonyms)}">
        </label>
        <label class="bt-field span-2" id="businessTermScopeField">
          <span>Data Model</span>
          <select name="scope" id="businessTermScope" multiple class="bt-multi-select">
            ${scopeOptions}
          </select>
        </label>
      </div>
    </div>
  `;

  mountMultiSelect(fields.querySelector("#businessTermScope"));
  const kindSelect = fields.querySelector("#businessTermKind");
  const scopeField = fields.querySelector("#businessTermScopeField");
  const scopeSelect = fields.querySelector("#businessTermScope");
  function syncScopeField() {
    const showDataModel = kindSelect?.value === "Business Term";
    if (scopeField) scopeField.hidden = !showDataModel;
    if (!showDataModel && scopeSelect) {
      Array.from(scopeSelect.options).forEach((option) => {
        option.selected = false;
      });
      scopeField?.querySelectorAll('.v20-multi-menu input[type="checkbox"]').forEach((input) => {
        input.checked = false;
      });
      const display = scopeField?.querySelector(".v20-multi-display");
      if (display) display.innerHTML = "<em>Select one or more</em>";
    }
  }
  kindSelect?.addEventListener("change", syncScopeField);
  syncScopeField();
  const form = fields.closest("form");
  form.noValidate = true;
  const requiredControls = Array.from(fields.querySelectorAll("[required]"));
  requiredControls.forEach((control) => {
    control.addEventListener("input", () => {
      if (!String(control.value || "").trim()) return;
      const field = control.closest(".bt-field");
      field?.classList.remove("is-invalid");
      field?.querySelector(".fm-field-error")?.remove();
    });
    control.addEventListener("change", () => {
      if (!String(control.value || "").trim()) return;
      const field = control.closest(".bt-field");
      field?.classList.remove("is-invalid");
      field?.querySelector(".fm-field-error")?.remove();
    });
  });
  function validateRequired() {
    let firstInvalid = null;
    requiredControls.forEach((control) => {
      const field = control.closest(".bt-field");
      const missing = !String(control.value || "").trim();
      field?.classList.toggle("is-invalid", missing);
      field?.querySelector(".fm-field-error")?.remove();
      if (missing) {
        field?.insertAdjacentHTML("beforeend", '<span class="fm-field-error">This field is required.</span>');
        firstInvalid ||= control;
      }
    });
    firstInvalid?.focus();
    return !firstInvalid;
  }
  footer.innerHTML = `<span></span><div class="bt-form-actions"><button type="button" id="cancelBtn">Cancel</button><button type="button" id="saveBtn">Save</button><button type="submit" class="primary">Submit</button></div><p class="knowledge-operation-reminder"><span aria-hidden="true">i</span><span>Operation reminder: Save keeps this term in Draft. Submit publishes it for AI use.</span></p>`;

  document.querySelector("#cancelBtn").onclick = () =>
    (location.href = "knowledge.html?type=Business%20Term");
  document.querySelector("#saveBtn").onclick = () => persist(false);
  function persist(isSubmit) {
    if (!validateRequired()) return;
    const formData = new FormData(form);
    const titleValue = String(formData.get("title") || "").trim();
    const kindValue = String(formData.get("kind") || "Business Term");
    const isGlobalSynonym = kindValue === "Global Synonym";
    const draftId = mode === "edit" ? id : `${isGlobalSynonym ? "global-synonym" : "business-term"}-draft-${Date.now()}`;
    const draft = {
      id: draftId,
      title: titleValue,
      description: String(formData.get("description") || "").trim(),
      synonyms: String(formData.get("synonyms") || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      scope: isGlobalSynonym
        ? []
        : Array.from(fields.querySelector('[name="scope"]')?.selectedOptions || []).map(
            (option) => option.value,
          ),
      kind: kindValue,
      creator: "Current User",
      status: isSubmit ? "Enable" : "Disable",
      stage: isSubmit ? "Published" : "Draft",
    };
    const nextDrafts = drafts.filter((value) => value.id !== draftId);
    nextDrafts.unshift(draft);
    localStorage.setItem(draftKey, JSON.stringify(nextDrafts));
    location.href = `knowledge.html?type=Business%20Term&notice=${isSubmit ? "published" : "saved"}`;
  }
  form.onsubmit = (event) => {
    event.preventDefault();
    persist(true);
  };
})();








