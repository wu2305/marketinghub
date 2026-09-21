(function () {
  const p = new URLSearchParams(location.search),
    a = window.marketingKnowledgeAssets || [],
    s = document.querySelector("#knowledgeType"),
    f = document.querySelector("#typeFields"),
    form = document.querySelector("#knowledgeForm"),
    view = document.querySelector("#viewPage"),
    d = document.querySelector("#resultDialog"),
    asset = a.find((x) => x.id === p.get("id")) || a[0];
  const opt = (x) => x.map((v) => `<option>${v}</option>`).join("");
  const shared = () =>
    `<div class="v20-grid"><label class="v20-field">Applicable Business Domain<select multiple>${opt(["Marketing", "C360", "Retail Operations", "Data Governance"])}</select></label><label class="v20-field">Applicable Reports<select multiple>${opt(["City Strategy", "4P Report", "Customer Daily Tracking", "ABO", "Rednote Tracking"])}</select></label><label class="v20-field full">Related Datasets<select multiple>${opt(["Marketing DW", "Campaign Performance", "Customer 360", "Commerce Performance"])}</select></label><label class="v20-field v20-switch full"><input type="checkbox" checked> Enable knowledge</label></div>`;
  const dm = () =>
    `<section class="v20-data-model"><div class="v20-model-ai"><div><b>✦ AI Modeling</b><p>Generate a data-model draft, then configure tables and fields below.</p></div><button type="button" class="v20-primary">Smart Modeling</button></div><div class="v20-model-layout"><aside class="v20-model-sidebar"><input placeholder="Search table name or description"><div class="v20-model-table active"><b>Channel Dimension</b><small>dim_channel · 7 rows</small></div><div class="v20-model-table"><b>User & Member Dimension</b><small>dim_customer · 1320 rows</small></div><div class="v20-model-table"><b>Date Dimension</b><small>dim_date · 581 rows</small></div></aside><div class="v20-model-main"><div class="v20-model-tabs"><span>Basic Information</span><b>Field Configuration · 5</b></div><table class="v20-field-table"><thead><tr><th>Field</th><th>Name</th><th>Synonyms</th><th>Field Type</th><th>Semantic Role</th><th>Fuzzy Match</th></tr></thead><tbody>${[
      ["channel_id", "Channel ID", "Channel primary key"],
      ["channel_code", "Channel Code", "Channel code"],
      ["channel_name", "Channel Name", "Channel, Channel name"],
      ["channel_group", "Channel Group", "Channel type"],
      ["online_offline", "Online / Offline", "Online, Offline"],
    ]
      .map(
        (r, i) =>
          `<tr><td><b>${r[0]}</b><br><small>${i ? "varchar(32)" : "int"}</small></td><td><span class="v20-input-pill">${r[1]}</span></td><td><span class="v20-input-pill">${r[2]} ×</span></td><td><span class="v20-input-pill">Dimension⌄</span></td><td><span class="v20-input-pill">Category⌄</span></td><td>${i > 1 ? "●" : "○"}</td></tr>`,
      )
      .join("")}</tbody></table></div></div></section>`;
  function draw(t) {
    if (t === "Data Model") {
      f.innerHTML = dm();
      return;
    }
    let x =
      t === "Principles"
        ? '<label class="v20-field full">Knowledge Title<input required placeholder="Enter knowledge title"></label><label class="v20-field full">Core Description<textarea required placeholder="Describe the principle and rule details"></textarea></label>'
        : t === "Report Context"
          ? `<label class="v20-field full">Dashboard Description<textarea required></textarea></label><label class="v20-field v20-switch full"><input id="aiOverview" type="checkbox" checked> Enable AI Overview</label><div id="aiFields" class="v20-grid"><label class="v20-field full">AI Overview Description<textarea></textarea></label><label class="v20-field full">AI Overview Parameter Sources<select multiple>${opt(["Marketing DW", "Campaign Performance", "Customer 360"])}</select></label></div>`
          : t === "Metric Dictionary"
            ? '<label class="v20-field">Metric Name<input required></label><label class="v20-field">English Name<input></label><label class="v20-field">Unit<input></label><label class="v20-field">Synonyms<input></label><label class="v20-field full">Metric Definition<textarea required></textarea></label><label class="v20-field full">Calculation Expression<textarea></textarea></label><label class="v20-field full">Global Filter Condition<textarea></textarea></label>'
            : t === "Email Reports"
              ? `<label class="v20-field full">Email Name<input required placeholder="Enter email report name"></label><label class="v20-field">Business Domain<select>${opt(["Marketing", "Campaign", "Customer", "Commerce"] )}</select></label><label class="v20-field">Send Time<input placeholder="Every Monday · 09:00"></label><label class="v20-field full v20-tag-field">Recipients<input data-tag-input="recipients" value="Emily Wang, Sophie Taylor, Daniel Chen" placeholder="Enter recipient names, separated by commas"></label><label class="v20-field full v20-tag-field">CC Recipients<input data-tag-input="cc_recipients" value="Grace Liu, Michael Zhao" placeholder="Enter CC names, separated by commas"></label><label class="v20-field full">Description<textarea placeholder="Briefly describe this scheduled email report."></textarea></label>` 
              : t === "Business Term"
              ? '<label class="v20-field full">Title<input required placeholder="Enter the business term title."></label><label class="v20-field full">Description<textarea required placeholder="Explain the meaning, usage, and boundary of this term."></textarea></label><label class="v20-field full">Synonyms<input placeholder="Add aliases, abbreviations, or equivalent terms, separated by commas."></label><label class="v20-field full">Subject Domain / Report<select multiple>' +
                opt([
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
                ]) +
                "</select></label>"
              : '<label class="v20-field">Standard Term<input required></label><label class="v20-field">Term Type<select>' +
                opt(["Metric", "Dimension", "Enumeration"]) +
                '</select></label><label class="v20-field full">Synonym List<input required></label>';
    f.innerHTML = '<div class="v20-grid">' + x + "</div>" + shared();
    enhance();
    enhanceEmailRecipientTags();
    let ai = document.querySelector("#aiOverview");
    if (ai) ai.onchange = () => (document.querySelector("#aiFields").hidden = !ai.checked);
  }
  function enhance() {
    document.querySelectorAll("select[multiple]").forEach((q) => {
      if (q.dataset.ready) return;
      q.dataset.ready = 1;
      let w = document.createElement("div"),
        b = document.createElement("button"),
        m = document.createElement("div");
      w.className = "v20-multi";
      b.type = "button";
      b.className = "v20-multi-display";
      m.className = "v20-multi-menu";
      q.parentNode.insertBefore(w, q);
      w.append(q, b, m);
      q.hidden = true;
      let paint = () => {
        b.innerHTML =
          Array.from(q.selectedOptions)
            .map((o) => `<span>${o.text}<b data-v="${o.value}">×</b></span>`)
            .join("") || "<em>Select one or more</em>";
        m.innerHTML = Array.from(q.options)
          .map(
            (o) =>
              `<label><input type="checkbox" value="${o.value}" ${o.selected ? "checked" : ""}>${o.text}</label>`,
          )
          .join("");
      };
      paint();
      b.onclick = (e) => {
        let r = e.target.closest("[data-v]");
        if (r) {
          let o = Array.from(q.options).find((o) => o.value === r.dataset.v);
          if (o) o.selected = false;
          paint();
        } else m.classList.toggle("open");
      };
      m.onchange = (e) => {
        let o = Array.from(q.options).find((o) => o.value === e.target.value);
        if (o) o.selected = e.target.checked;
        paint();
      };
    });
  }
  function enhanceEmailRecipientTags() {
    document.querySelectorAll('input[data-tag-input]').forEach((input) => {
      if (input.dataset.tagReady) return;
      input.dataset.tagReady = "1";
      const holder = document.createElement("div");
      const entry = document.createElement("input");
      holder.className = "v20-recipient-tags";
      entry.type = "text";
      entry.placeholder = input.placeholder || "Enter a name";
      input.hidden = true;
      input.insertAdjacentElement("afterend", holder);
      holder.append(entry);
      const values = () => Array.from(holder.querySelectorAll(".v20-recipient-tag")).map((tag) => tag.dataset.value);
      const sync = () => {
        input.value = values().join(", ");
      };
      const add = (raw) => {
        String(raw || "")
          .split(/[，,]/)
          .map((x) => x.trim())
          .filter(Boolean)
          .forEach((name) => {
            if (values().includes(name)) return;
            const tag = document.createElement("span");
            tag.className = "v20-recipient-tag";
            tag.dataset.value = name;
            tag.innerHTML = `${name}<button type="button" aria-label="Remove ${name}">×</button>`;
            holder.insertBefore(tag, entry);
          });
        sync();
      };
      add(input.value);
      entry.addEventListener("keydown", (event) => {
        if (!["Enter", ",", "，"].includes(event.key)) return;
        event.preventDefault();
        add(entry.value);
        entry.value = "";
      });
      entry.addEventListener("blur", () => {
        add(entry.value);
        entry.value = "";
      });
      holder.addEventListener("click", (event) => {
        const remove = event.target.closest("button");
        if (!remove) {
          entry.focus();
          return;
        }
        remove.closest(".v20-recipient-tag")?.remove();
        sync();
      });
    });
  }
  function show(t, x) {
    document.querySelector("#dialogTitle").textContent = t;
    document.querySelector("#dialogText").textContent = x;
    d.showModal();
  }
  if (form && s) {
    if (p.get("mode") === "edit") {
      document.querySelector("#pageTitle").textContent = "Edit Knowledge";
      s.value = asset.type;
    }
    if (p.get("copy")) {
      document.querySelector("#pageTitle").textContent = "Copy Knowledge";
      s.value = asset.type;
    }
    draw(s.value);
    s.onchange = () => draw(s.value);
    document.querySelector("#saveBtn").onclick = () =>
      show("Saved successfully", "Your knowledge draft has been saved.");
    form.onsubmit = (e) => {
      e.preventDefault();
      show("Submitted successfully", "Your knowledge has been submitted for review.");
    };
  }
  if (view) {
    let x = asset;
    view.innerHTML = `<section class="v20-view-card"><header class="v20-view-head"><div><p class="v20-eyebrow">${x.type}</p><h1>${x.title}</h1><p>${x.summary || "Knowledge configuration and governance details."}</p></div><span class="v20-pill">${x.stage === "calibrate" ? "Published" : "Draft"}</span></header><div class="v20-ref-grid"><div class="v20-ref-card"><strong>${x.usage || 126}</strong><span>Total references</span></div><div class="v20-ref-card"><strong>8</strong><span>Report references</span></div><div class="v20-ref-card"><strong>4</strong><span>AI references</span></div></div><div class="v20-detail-grid"><div>Creater</div><div>${x.owner || "Current User"}</div><div>Type</div><div>${x.type}</div><div>Source</div><div>${x.source || "Shared"}</div><div>Related reports</div><div>${(x.connections || []).map((c) => c.name).join(", ") || "None"}</div><div>Updated</div><div>${x.updated || "Just now"}</div></div><div class="v20-view-actions"><button class="v20-secondary" data-a="copy">Copy</button><button class="v20-secondary" data-a="edit">Edit</button><button class="v20-secondary" data-a="versions">View Versions</button><button class="v20-secondary" data-a="disable">Disable</button><button class="v20-secondary v20-danger" data-a="delete">Delete</button></div></section>`;
    view.onclick = (e) => {
      let b = e.target.closest("[data-a]");
      if (!b) return;
      if (b.dataset.a === "copy") location.href = "knowledge-create.html?copy=" + x.id;
      if (b.dataset.a === "edit") location.href = "knowledge-create.html?mode=edit&id=" + x.id;
      if (b.dataset.a === "versions")
        show("Version History", "Version comparison is available in this V20.01 demo.");
      if (b.dataset.a === "disable") show("Knowledge disabled", "The knowledge is now disabled.");
      if (b.dataset.a === "delete")
        show("Delete blocked", "Please disable this knowledge before deleting it.");
    };
  }
  document
    .querySelector("#dialogClose")
    ?.addEventListener("click", () => (location.href = "knowledge.html"));
})();
(function () {
  function setup() {
    const back = document.querySelector(".v20-back"),
      title = document.querySelector("#pageTitle");
    if (back) {
      const isView = Boolean(document.querySelector("#viewPage"));
      const isEdit = title && title.textContent === "Edit Knowledge";
      const current = isView
        ? "Knowledge Details"
        : isEdit
          ? "Edit Knowledge"
          : "Create New Knowledge";
      back.innerHTML = `<a href="knowledge.html">AI Interpreter</a><span>/</span><a href="knowledge.html">Knowledge Management</a><span>/</span><b>${current}</b>`;
    }
    document
      .querySelectorAll("#typeFields input[required],#typeFields textarea[required]")
      .forEach((input) => {
        const label = input.closest("label");
        if (label && !label.querySelector(".v20-required"))
          label.insertAdjacentHTML(
            "afterbegin",
            '<span class="v20-required" aria-hidden="true">*</span> ',
          );
      });
  }
  window.setTimeout(setup, 0);
})();
(function () {
  function mount() {
    const back = document.querySelector(".v20-back"),
      form = document.querySelector("#knowledgeForm"),
      hint = document.querySelector(".v20-hint"),
      title = document.querySelector("#pageTitle"),
      isView = Boolean(document.querySelector("#viewPage"));
    if (hint) hint.remove();
    if (back) {
      const current = isView
        ? "Knowledge Details"
        : title && title.textContent === "Edit Knowledge"
          ? "Edit Knowledge"
          : "Create New Knowledge";
      back.innerHTML = `<a href="knowledge.html">AI Interpreter</a><span>/</span><a href="knowledge.html">Knowledge Management</a><span>/</span><b>${current}</b>`;
    }
    if (!form) return;
    form.noValidate = true;
    const actions = form.querySelector(".v20-form-footer > div:last-child");
    if (actions) {
      const cancelButtons = [...actions.querySelectorAll("button")].filter(
        (button) => button.textContent && button.textContent.trim() === "Cancel",
      );
      cancelButtons.slice(1).forEach((button) => button.remove());
      if (!cancelButtons.length) {
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.id = "cancelBtn";
        cancel.className = "v20-secondary";
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", () => (location.href = "knowledge.html"));
        actions.prepend(cancel);
      }
    }
    form
      .querySelectorAll("input[required],textarea[required],select[required]")
      .forEach((input) => {
        const label = input.closest("label");
        if (label && !label.querySelector(".v20-required"))
          label.insertAdjacentHTML(
            "afterbegin",
            '<span class="v20-required" aria-hidden="true">*</span> ',
          );
      });
    form.addEventListener(
      "submit",
      (event) => {
        const required = Array.from(
          form.querySelectorAll("input[required],textarea[required],select[required]"),
        );
        let first = null;
        required.forEach((input) => {
          let error = input.parentElement.querySelector(".v20-field-error"),
            empty = !String(input.value || "").trim();
          if (empty) {
            input.classList.add("v20-input-error");
            if (!error) {
              error = document.createElement("small");
              error.className = "v20-field-error";
              error.textContent = "This field is required.";
              input.insertAdjacentElement("afterend", error);
            }
            if (!first) first = input;
          } else {
            input.classList.remove("v20-input-error");
            if (error) error.remove();
          }
        });
        if (first) {
          event.preventDefault();
          event.stopImmediatePropagation();
          first.scrollIntoView({ behavior: "smooth", block: "center" });
          first.focus();
        }
      },
      true,
    );
  }
  window.setTimeout(mount, 30);
})();
(function () {
  const type = document.querySelector("#knowledgeType");
  if (type)
    type.addEventListener("change", () =>
      window.setTimeout(
        () =>
          document
            .querySelectorAll(
              "#typeFields input[required],#typeFields textarea[required],#typeFields select[required]",
            )
            .forEach((input) => {
              const label = input.closest("label");
              if (label && !label.querySelector(".v20-required"))
                label.insertAdjacentHTML(
                  "afterbegin",
                  '<span class="v20-required" aria-hidden="true">*</span> ',
                );
            }),
        0,
      ),
    );
})();
(function () {
  function refine() {
    document.querySelector(".v20-form-footer>span")?.remove();
    document.querySelectorAll("#typeFields label.v20-field").forEach((label) => {
      const text = Array.from(label.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      );
      if (text && !label.querySelector(".v20-label-text")) {
        const span = document.createElement("span");
        span.className = "v20-label-text";
        span.textContent = text.textContent.trim();
        text.replaceWith(span);
      }
    });
  }
  window.setTimeout(refine, 60);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(refine, 20));
})();
(function () {
  window.setTimeout(() => {
    const current = document.querySelector("#breadcrumbCurrent"),
      title = document.querySelector("#pageTitle");
    if (current && title && title.textContent === "Edit Knowledge")
      current.textContent = "Edit Knowledge";
  }, 40);
})();
(function () {
  const tables = [
    ["Channel Dimension", "dim_channel · 7 rows"],
    ["User & Member Dimension", "dim_customer · 1,320 rows"],
    ["Date Dimension", "dim_date · 581 rows"],
    ["Product SKU Dimension", "dim_product · 36 rows"],
    ["Region Dimension", "dim_region · 12 rows"],
  ];
  const rows = [
    ["channel_id", "int", "Channel ID", "Channel Key"],
    ["channel_code", "varchar(32)", "Channel Code", "Channel Code"],
    ["channel_name", "varchar(50)", "Channel Name", "Channel, Channel name"],
    ["channel_group", "varchar(20)", "Channel Group", "Channel type, Sales channel"],
    ["online_offline", "varchar(20)", "Online / Offline", "Online, Offline"],
  ];
  function model(title, readonly) {
    return `<section class="v20-dm-page"><header class="v20-dm-head"><div><div class="v20-dm-crumb">AI Interpreter <span>/</span> Data Model <span>/</span> <b>${title}</b></div><h1>${title}</h1><p>Curated weekly city model joining investment, exposure, customer traffic, member conversion, and business performance.</p></div><div><span class="v20-dm-published">Published</span><button class="v20-secondary">${readonly ? "Edit Model" : "Save Model"}</button><button class="v20-dm-export">⇧ Export</button></div></header><section class="v20-dm-ai"><div class="v20-dm-ai-icon">◇</div><div><b>AI Modeling <small>BETA</small></b><p>Generate data model configuration drafts through AI assistant. Results will sync to the table and field configuration area below.</p></div><button class="v20-primary" type="button">◇ Smart Modeling</button></section><div class="v20-dm-work"><aside class="v20-dm-side"><input class="v20-dm-search" placeholder="Search table name or description..."><div class="v20-dm-switch"><button class="active">Entity · 6</button><button>Event · 1</button></div><div class="v20-dm-table-list">${tables.map((t, i) => `<button class="${i === 0 ? "active" : ""}" type="button"><b>${t[0]}</b><small>${t[1]}</small></button>`).join("")}</div><footer><b>DATA SOURCE</b><div>Marketing DW <span>Enabled</span></div></footer></aside><section class="v20-dm-config"><header><div class="v20-dm-tabs"><button>Basic Info</button><button class="active">Field Config · 5</button></div><button class="v20-secondary" type="button">◉ Preview Data</button></header><div class="v20-dm-table-wrap"><table><thead><tr><th>FIELD</th><th>NAME</th><th>SYNONYMS</th><th>FIELD TYPE</th><th>SEMANTIC ROLE</th><th>FUZZY MATCH</th><th>DEFAULT AGGREGATION</th></tr></thead><tbody>${rows.map((r, i) => `<tr><td><b>${r[0]}</b><small>${r[1]}</small></td><td><input value="${r[2]}"></td><td><span class="v20-dm-tag">${r[3]} ×</span><button class="v20-dm-plus">＋</button></td><td><select><option>Dimension</option><option>Measure</option><option>Identifier</option></select></td><td><select><option>Category</option><option>Metric</option><option>Hierarchy</option></select></td><td><label class="v20-dm-toggle"><input type="checkbox" ${i > 1 ? "checked" : ""}><i></i></label></td><td>–</td></tr>`).join("")}</tbody></table></div></section></div></section>`;
  }
  function apply() {
    const type = document.querySelector("#knowledgeType"),
      fields = document.querySelector("#typeFields"),
      view = document.querySelector("#viewPage");
    if (type && type.value === "Data Model" && fields) {
      fields.innerHTML = model("City media performance model", false);
    }
    if (view && /Data Model/.test(view.querySelector(".v20-eyebrow")?.textContent || "")) {
      view.innerHTML = model("City media performance model", true);
    }
  }
  window.setTimeout(apply, 80);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(apply, 20));
})();
(function () {
  function notify(message) {
    const dialog = document.querySelector("#resultDialog"),
      content = document.querySelector("#dialogText");
    if (dialog && content) {
      content.textContent = message;
      dialog.showModal();
    } else {
      window.alert(message);
    }
  }
  function bind() {
    const page = document.querySelector(".v20-dm-page");
    if (!page || page.dataset.bound) return;
    page.dataset.bound = "true";
    document.querySelector(".v20-breadcrumb")?.setAttribute("hidden", "");
    page
      .querySelectorAll(".v20-dm-table-list button,.v20-dm-switch button,.v20-dm-tabs button")
      .forEach((button) =>
        button.addEventListener("click", () => {
          button.parentElement
            .querySelectorAll("button")
            .forEach((item) => item.classList.remove("active"));
          button.classList.add("active");
        }),
      );
    page
      .querySelector(".v20-dm-config header .v20-secondary")
      ?.addEventListener("click", () => notify("Preview data is ready for this model."));
    page
      .querySelector(".v20-dm-ai .v20-primary")
      ?.addEventListener("click", () =>
        notify("Smart Modeling has prepared a configuration draft."),
      );
    page
      .querySelector(".v20-dm-export")
      ?.addEventListener("click", () => notify("The model configuration is ready to export."));
    page
      .querySelector(".v20-dm-head .v20-secondary")
      ?.addEventListener("click", () =>
        notify(
          page.closest("#viewPage")
            ? "Edit Model is ready."
            : "Model configuration has been saved.",
        ),
      );
  }
  function refresh() {
    window.setTimeout(bind, 100);
  }
  refresh();
  document.querySelector("#knowledgeType")?.addEventListener("change", refresh);
})();
(function () {
  function addSearch() {
    const page = document.querySelector(".v20-dm-page");
    const search = page?.querySelector(".v20-dm-search");
    if (!search || search.dataset.searchBound) return;
    search.dataset.searchBound = "true";
    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      page.querySelectorAll(".v20-dm-table-list button").forEach((item) => {
        item.hidden = !!query && !item.textContent.toLowerCase().includes(query);
      });
    });
  }
  window.setTimeout(addSearch, 120);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(addSearch, 50));
})();
(function () {
  const entityTables = [
    { name: "Channel Dimension", meta: "dim_channel · 7 rows" },
    { name: "User & Member Dimension", meta: "dim_customer · 1,320 rows" },
    { name: "Date Dimension", meta: "dim_date · 581 rows" },
    { name: "Product SKU Dimension", meta: "dim_product · 36 rows" },
    { name: "Region Dimension", meta: "dim_region · 12 rows" },
  ];
  const eventTables = [
    { name: "Media Performance Event", meta: "fact_media_performance · 58,420 rows" },
  ];
  const entityRows = [
    ["channel_id", "int", "Channel ID", "Channel Key"],
    ["channel_code", "varchar(32)", "Channel Code", "Channel Code"],
    ["channel_name", "varchar(50)", "Channel Name", "Channel, Channel name"],
    ["channel_group", "varchar(20)", "Channel Group", "Channel type, Sales channel"],
    ["online_offline", "varchar(20)", "Online / Offline", "Online, Offline"],
  ];
  const eventRows = [
    ["event_id", "bigint", "Event ID", "Performance Event"],
    ["event_date", "date", "Event Date", "Activity Date"],
    ["media_channel", "varchar(50)", "Media Channel", "Channel"],
    ["impressions", "decimal(18,2)", "Impressions", "Exposure"],
    ["spend", "decimal(18,2)", "Media Spend", "Investment"],
  ];
  function fieldRows(rows) {
    return rows
      .map(
        (row, index) =>
          `<tr><td><b>${row[0]}</b><small>${row[1]}</small></td><td><input value="${row[2]}"></td><td><span class="v20-dm-synonyms"><span class="v20-dm-tag">${row[3]} ×</span><button class="v20-dm-plus" type="button" aria-label="Add synonym">＋</button></span></td><td><select><option>Dimension</option><option>Measure</option><option>Identifier</option></select></td><td><select><option>Category</option><option>Metric</option><option>Hierarchy</option></select></td><td><label class="v20-dm-toggle"><input type="checkbox" ${index > 1 ? "checked" : ""}><i></i></label></td><td>–</td></tr>`,
      )
      .join("");
  }
  function setConfig(page, rows) {
    page.querySelector(".v20-dm-table-wrap tbody").innerHTML = fieldRows(rows);
    bindSynonyms(page);
  }
  function setList(page, kind) {
    const list = kind === "event" ? eventTables : entityTables;
    page.querySelector(".v20-dm-table-list").innerHTML = list
      .map(
        (table, index) =>
          `<button class="${index === 0 ? "active" : ""}" type="button"><b>${table.name}</b><small>${table.meta}</small></button>`,
      )
      .join("");
    page.querySelectorAll(".v20-dm-table-list button").forEach((button) =>
      button.addEventListener("click", () => {
        page
          .querySelectorAll(".v20-dm-table-list button")
          .forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        if (page.querySelector(".v20-dm-table-wrap tbody"))
          setConfig(page, kind === "event" ? eventRows : entityRows);
      }),
    );
    if (page.querySelector(".v20-dm-table-wrap tbody"))
      setConfig(page, kind === "event" ? eventRows : entityRows);
  }
  function bindSynonyms(page) {
    page.querySelectorAll(".v20-dm-plus").forEach((button) =>
      button.addEventListener("click", () => {
        const holder = button.parentElement;
        if (holder.querySelector(".v20-dm-synonym-input")) return;
        const input = document.createElement("input");
        input.className = "v20-dm-synonym-input";
        input.placeholder = "Enter synonym";
        input.setAttribute("aria-label", "New synonym");
        holder.insertBefore(input, button);
        input.focus();
        const save = () => {
          const value = input.value.trim();
          if (value) {
            const tag = document.createElement("span");
            tag.className = "v20-dm-tag";
            tag.textContent = value + " ×";
            tag.addEventListener("click", () => tag.remove());
            holder.insertBefore(tag, input);
          }
          input.remove();
        };
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            save();
          }
          if (event.key === "Escape") input.remove();
        });
        input.addEventListener("blur", save);
      }),
    );
  }
  function basicInfo(page) {
    const wrap = page.querySelector(".v20-dm-table-wrap");
    wrap.innerHTML = `<section class="v20-dm-basic"><div><b>Table Name</b><input value="Channel Dimension"></div><div><b>Physical Table</b><input value="dim_channel"></div><div><b>Table Description</b><textarea>Master data for marketing channel attributes and channel classifications.</textarea></div><div><b>Table Type</b><select><option>Entity</option><option>Event</option></select></div><div><b>Data Source</b><select><option>Marketing DW</option></select></div><label class="v20-dm-enable"><input type="checkbox" checked><i></i> Enable table</label></section>`;
  }
  function fieldConfig(page, rows) {
    const wrap = page.querySelector(".v20-dm-table-wrap");
    wrap.innerHTML =
      "<table><thead><tr><th>FIELD</th><th>NAME</th><th>SYNONYMS</th><th>FIELD TYPE</th><th>SEMANTIC ROLE</th><th>FUZZY MATCH</th><th>DEFAULT AGGREGATION</th></tr></thead><tbody></tbody></table>";
    setConfig(page, rows);
  }
  function enhance() {
    const type = document.querySelector("#knowledgeType"),
      page = document.querySelector(".v20-form-card .v20-dm-page");
    if (!type || type.value !== "Data Model" || !page || page.dataset.v201Enhance) return;
    page.dataset.v201Enhance = "true";
    document.querySelector(".v20-breadcrumb")?.removeAttribute("hidden");
    page.querySelector(".v20-dm-crumb")?.remove();
    page.querySelector(".v20-dm-head")?.remove();
    const intro = document.createElement("section");
    intro.className = "v20-dm-create-info";
    intro.innerHTML =
      '<label><span class="v20-dm-label"><i>*</i> Model Name</span><input required placeholder="Enter model name"></label><label>Model Description<textarea placeholder="Describe the purpose and scope of this data model"></textarea></label><label class="v20-dm-enable"><input type="checkbox" checked><i></i> Enable Model</label>';
    page.insertBefore(intro, page.querySelector(".v20-dm-ai"));
    const switches = page.querySelectorAll(".v20-dm-switch button");
    switches.forEach((button, index) => {
      button.type = "button";
      button.addEventListener("click", () => {
        switches.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const event = index === 1;
        setList(page, event ? "event" : "entity");
        fieldConfig(page, event ? eventRows : entityRows);
      });
    });
    const tabs = page.querySelectorAll(".v20-dm-tabs button");
    tabs.forEach((button, index) => {
      button.type = "button";
      button.addEventListener("click", () => {
        tabs.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const event = page.querySelector(".v20-dm-switch button.active") === switches[1];
        if (index === 0) basicInfo(page);
        else fieldConfig(page, event ? eventRows : entityRows);
      });
    });
    page.querySelectorAll("button").forEach((button) => (button.type = "button"));
    setList(page, "entity");
    bindSynonyms(page);
  }
  window.setTimeout(enhance, 170);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(enhance, 80));
})();
(function () {
  const basics = [
    ["Exposure Count", "fact_promotion_daily.exposure_count"],
    ["Visit Count", "fact_promotion_daily.visit_count"],
    ["Add to Cart Count", "fact_promotion_daily.add_to_cart_count"],
    ["Promotion Attributed Orders", "fact_promotion_daily.order_count"],
    ["Store Visit Customers", "fact_promotion_daily.store_visit_customers"],
    ["Promotion Attributed Sales", "fact_promotion_daily.sales_amount"],
    ["Promotion Spend", "fact_promotion_daily.promotion_cost"],
  ];
  function metricForm() {
    return `<section class="v20-derived-metric"><div class="v20-derived-main"><label class="v20-derived-field full">Business Domain<select><option value="">Select a business domain</option><option>Marketing</option><option>Customer Growth</option><option>Retail Operations</option></select></label><div class="v20-derived-grid"><label class="v20-derived-field"><span><i>*</i> Metric Name</span><input id="metricName" required placeholder="Enter metric name..."><em class="v20-metric-error" id="metricNameError">Please enter a metric name.</em></label><label class="v20-derived-field">Unit<input placeholder="e.g. USD, %, count"></label></div><section class="v20-formula-section"><b><i>*</i> Formula Builder</b><textarea id="metricFormula" required placeholder="Click a metric or operator to build your formula..."></textarea><em class="v20-metric-error" id="metricFormulaError">Please build a formula first.</em><div class="v20-formula-tools"><div>${["+", "−", "×", "÷", "(", ")", "123"].map((value) => `<button type="button" data-formula="${value}">${value}</button>`).join("")}</div><div><button type="button" id="metricClear" class="v20-clear-formula" title="Clear formula">⌫</button><button type="button" id="metricBackspace" title="Delete last character">←</button></div></div><small>Build the formula by clicking referenceable basic metrics and operators.</small></section><label class="v20-derived-field full">Description<textarea placeholder="Describe the metric purpose and calculation logic..."></textarea></label><label class="v20-derived-field full">Synonyms<input placeholder="Comma separated"></label><label class="v20-dm-enable"><input type="checkbox" checked><i></i> Enable Metric</label></div><aside class="v20-basic-metrics"><h3>REFERENCEABLE BASIC METRICS</h3>${basics.map((metric) => `<button type="button" class="v20-basic-metric" data-metric="${metric[0]}"><b>${metric[0]}</b><small>${metric[1]}</small></button>`).join("")}</aside></section>`;
  }
  function mountMetric() {
    const type = document.querySelector("#knowledgeType"),
      fields = document.querySelector("#typeFields");
    if (!type || type.value !== "Metric Dictionary" || !fields || fields.dataset.derivedMounted)
      return;
    if (!fields.querySelector(".v20-derived-metric")) fields.innerHTML = metricForm();
    fields.dataset.derivedMounted = "true";
    const formula = fields.querySelector("#metricFormula");
    const append = (value) => {
      formula.value += (formula.value.trim() ? " " : "") + value;
      formula.focus();
    };
    fields
      .querySelectorAll("[data-formula]")
      .forEach((button) => button.addEventListener("click", () => append(button.dataset.formula)));
    fields
      .querySelectorAll("[data-metric]")
      .forEach((button) => button.addEventListener("click", () => append(button.dataset.metric)));
    fields.querySelector("#metricClear").addEventListener("click", () => {
      formula.value = "";
      formula.focus();
    });
    fields.querySelector("#metricBackspace").addEventListener("click", () => {
      formula.value = formula.value.trimEnd().replace(/\S+$/, "").trimEnd();
      formula.focus();
    });
    const clearError = (input) => {
      const error = fields.querySelector("#" + input.id + "Error");
      if (error) error.hidden = !!input.value.trim();
    };
    [fields.querySelector("#metricName"), formula].forEach((input) => {
      input.addEventListener("input", () => clearError(input));
      input.addEventListener("invalid", () => {
        const error = fields.querySelector("#" + input.id + "Error");
        if (error) error.hidden = false;
      });
    });
  }
  window.setTimeout(mountMetric, 180);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(mountMetric, 50));
})();
(function () {
  function hideMetricErrors() {
    document
      .querySelectorAll(".v20-derived-metric .v20-metric-error")
      .forEach((error) => (error.hidden = true));
  }
  window.setTimeout(hideMetricErrors, 230);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(hideMetricErrors, 100));
})();
(function () {
  function mountTokenFormula() {
    const section = document.querySelector(".v20-derived-metric");
    const source = section?.querySelector("#metricFormula");
    if (!section || !source || section.dataset.tokenFormula) return;
    section.dataset.tokenFormula = "true";
    const box = document.createElement("div");
    box.className = "v20-token-formula";
    box.contentEditable = "true";
    box.dataset.placeholder = source.placeholder;
    source.hidden = true;
    source.parentNode.insertBefore(box, source);
    let tokens = [];
    const sync = () => {
      source.value = tokens.map((token) => token.value).join(" ");
      source.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const render = () => {
      box.innerHTML = "";
      tokens.forEach((token, index) => {
        const item = document.createElement(token.kind === "metric" ? "span" : "span");
        item.className = token.kind === "metric" ? "v20-formula-token" : "v20-formula-operator";
        item.textContent = token.value;
        if (token.kind === "metric") {
          const remove = document.createElement("button");
          remove.type = "button";
          remove.textContent = "×";
          remove.title = "Remove metric";
          remove.addEventListener("click", (event) => {
            event.preventDefault();
            tokens.splice(index, 1);
            render();
            sync();
          });
          item.append(remove);
        }
        box.append(item);
      });
      if (!tokens.length) box.append(document.createElement("br"));
    };
    const add = (value, kind) => {
      tokens.push({ value, kind });
      render();
      sync();
      box.focus();
    };
    section.querySelectorAll("[data-metric]").forEach((button) => {
      const copy = button.cloneNode(true);
      button.replaceWith(copy);
      copy.addEventListener("click", () => add(copy.dataset.metric, "metric"));
    });
    section.querySelectorAll("[data-formula]").forEach((button) => {
      const copy = button.cloneNode(true);
      button.replaceWith(copy);
      copy.addEventListener("click", () => add(copy.dataset.formula, "operator"));
    });
    ["metricClear", "metricBackspace"].forEach((id) => {
      const button = section.querySelector("#" + id);
      if (!button) return;
      const copy = button.cloneNode(true);
      button.replaceWith(copy);
      copy.addEventListener("click", () => {
        if (id === "metricClear") tokens = [];
        else tokens.pop();
        render();
        sync();
      });
    });
    box.addEventListener("input", () => {
      const extra = box.textContent.trim();
      if (extra && tokens.length === 0) {
        tokens = [{ value: extra, kind: "operator" }];
        sync();
      }
    });
    render();
  }
  window.setTimeout(mountTokenFormula, 280);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(mountTokenFormula, 140));
})();
(function () {
  function validateTokenFormula() {
    const section = document.querySelector(".v20-derived-metric");
    const source = section?.querySelector("#metricFormula");
    const box = section?.querySelector(".v20-token-formula");
    const form = section?.closest("form");
    if (!section || !source || !box || !form || form.dataset.tokenValidation) return;
    form.dataset.tokenValidation = "true";
    form.addEventListener(
      "submit",
      (event) => {
        if (!source.value.trim()) {
          event.preventDefault();
          event.stopImmediatePropagation();
          section.querySelector("#metricFormulaError").hidden = false;
          box.focus();
        }
      },
      true,
    );
  }
  window.setTimeout(validateTokenFormula, 320);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(validateTokenFormula, 170));
})();
(function () {
  function lockTokenFormula() {
    const box = document.querySelector(".v20-token-formula");
    if (!box) return;
    box.contentEditable = "false";
    box.setAttribute("aria-readonly", "true");
    box.setAttribute("tabindex", "-1");
  }
  window.setTimeout(lockTokenFormula, 360);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(lockTokenFormula, 210));
})();
(function () {
  function showPublicBreadcrumb() {
    document.querySelector(".v20-breadcrumb")?.removeAttribute("hidden");
  }
  window.setTimeout(showPublicBreadcrumb, 450);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(showPublicBreadcrumb, 260));
})();
(function () {
  function mountTestRun() {
    const section = document.querySelector(".v20-derived-metric");
    const formula = section?.querySelector(".v20-formula-section");
    const source = section?.querySelector("#metricFormula");
    if (!section || !formula || !source || section.querySelector(".v20-test-run")) return;
    const test = document.createElement("section");
    test.className = "v20-test-run";
    test.innerHTML =
      '<div><b>Test Run</b><p>Test will execute the formula and return a single aggregated result.</p></div><button type="button" class="v20-secondary">Test</button>';
    formula.insertAdjacentElement("afterend", test);
    test.querySelector("button").addEventListener("click", () => {
      const dialog = document.querySelector("#resultDialog"),
        title = document.querySelector("#dialogTitle"),
        text = document.querySelector("#dialogText");
      if (!source.value.trim()) {
        section.querySelector("#metricFormulaError").hidden = false;
        title.textContent = "Formula required";
        text.textContent = "Please build a formula before testing.";
      } else {
        title.textContent = "Test completed";
        text.textContent = "Formula executed successfully. Aggregated result: 1,284.60.";
      }
      dialog?.showModal();
    });
  }
  window.setTimeout(mountTestRun, 430);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(mountTestRun, 240));
})();
(function () {
  function removeLegacyModelCrumbs() {
    document.querySelectorAll(".v20-dm-crumb").forEach((item) => item.remove());
  }
  removeLegacyModelCrumbs();
  new MutationObserver(removeLegacyModelCrumbs).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
(function () {
  const existing = [
    ["Conversion Rate", "CVR", "Metric", "Marketing", "Campaign Performance", "Enabled"],
    ["Customer Lifetime Value", "CLV", "Metric", "Customer Growth", "Customer 360", "Enabled"],
    ["Media Investment", "Media Spend", "Business Term", "Marketing", "Marketing DW", "Enabled"],
    ["Channel", "Media Channel", "Dimension", "Marketing", "Marketing DW", "Enabled"],
    [
      "Store Traffic",
      "Store Visits",
      "Metric",
      "Retail Operations",
      "Commerce Performance",
      "Enabled",
    ],
  ];
  const options = {
    type: ["Metric", "Dimension", "Business Term", "Report", "Other"],
    domain: ["Marketing", "Customer Growth", "Retail Operations"],
    dataset: ["Marketing DW", "Campaign Performance", "Customer 360", "Commerce Performance"],
    status: ["Enabled", "Disabled"],
  };
  const select = (key) =>
    `<select required><option value="">Select</option>${options[key].map((value) => `<option>${value}</option>`).join("")}</select>`;
  function existingRow(row) {
    return `<tr class="v20-synonym-existing">${row.map((value) => `<td>${value}</td>`).join("")}<td><span class="v20-readonly">Read only</span></td></tr>`;
  }
  function newRow() {
    return `<tr class="v20-synonym-new"><td><input required placeholder="Standard term"></td><td><input required placeholder="Synonym"></td><td>${select("type")}</td><td>${select("domain")}</td><td>${select("dataset")}</td><td>${select("status")}</td><td><button type="button" class="v20-remove-synonym" title="Remove row" aria-label="Remove row">×</button></td></tr>`;
  }
  function table() {
    return `<section class="v20-synonym-manager"><header><div><h2>Synonym Management</h2><p>Add multiple synonyms in the table. Existing synonyms are read only.</p></div><button type="button" class="v20-primary" id="addSynonymRow">+ Add Synonym</button></header><div class="v20-synonym-table-wrap"><table><thead><tr><th>STANDARD TERM <i>*</i></th><th>SYNONYM <i>*</i></th><th>TERM TYPE <i>*</i></th><th>APPLICABLE DOMAIN</th><th>RELATED DATASET</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>${existing.map(existingRow).join("")}</tbody></table></div><small class="v20-synonym-note">New rows appear at the top. Complete required fields before submitting.</small></section>`;
  }
  function mountSynonyms() {
    const type = document.querySelector("#knowledgeType"),
      fields = document.querySelector("#typeFields");
    if (!type || type.value !== "Synonyms" || !fields || fields.dataset.synonymMounted) return;
    fields.innerHTML = table();
    fields.dataset.synonymMounted = "true";
    const body = fields.querySelector("tbody");
    const add = () => {
      body.insertAdjacentHTML("afterbegin", newRow());
      body.querySelector(".v20-synonym-new input")?.focus();
    };
    fields.querySelector("#addSynonymRow").addEventListener("click", add);
    body.addEventListener("click", (event) => {
      const button = event.target.closest(".v20-remove-synonym");
      if (button) button.closest("tr").remove();
    });
  }
  window.setTimeout(mountSynonyms, 500);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(mountSynonyms, 300));
})();
(function () {
  const rows = [
    [
      "East China Region",
      "East China",
      "Dimension",
      "Marketing",
      "City Strategy",
      "Marketing DW",
      "Enabled",
    ],
    [
      "Gross Sales Value",
      "GSV",
      "Metric",
      "Marketing",
      "4P Report",
      "Campaign Performance",
      "Enabled",
    ],
    [
      "Gross Sales Value",
      "Sales Amount",
      "Metric",
      "Retail Operations",
      "Customer Daily Tracking",
      "Commerce Performance",
      "Enabled",
    ],
    [
      "Channel",
      "Media Channel",
      "Dimension",
      "Marketing",
      "City Strategy",
      "Marketing DW",
      "Enabled",
    ],
    [
      "Member Segment",
      "Customer Tier",
      "Enumeration",
      "Customer Growth",
      "Customer Daily Tracking",
      "Customer 360",
      "Enabled",
    ],
  ];
  const choices = {
    business: ["Marketing", "Customer Growth", "Retail Operations", "Data Governance"],
    report: ["City Strategy", "4P Report", "Customer Daily Tracking", "ABO", "Rednote Tracking"],
    dataset: ["Marketing DW", "Campaign Performance", "Customer 360", "Commerce Performance"],
  };
  function multi(key) {
    return `<details class="v20-synonym-multi"><summary>Select one or more</summary><div>${choices[key].map((value) => `<label><input type="checkbox" value="${value}">${value}</label>`).join("")}</div></details>`;
  }
  function readonly(row) {
    return `<tr class="v20-synonym-existing">${row.map((value) => `<td>${value}</td>`).join("")}<td><span class="v20-readonly">Read only</span></td></tr>`;
  }
  function editable() {
    return `<tr class="v20-synonym-new"><td><input required placeholder="Standard term"></td><td><input required placeholder="Synonym"></td><td><select required><option value="">Select</option><option>Metric</option><option>Dimension</option><option>Enumeration</option></select></td><td>${multi("business")}</td><td>${multi("report")}</td><td>${multi("dataset")}</td><td><select><option>Enabled</option><option>Disabled</option></select></td><td><button type="button" class="v20-remove-synonym" title="Remove row" aria-label="Remove row">×</button></td></tr>`;
  }
  function manager() {
    return `<section class="v20-synonym-manager"><header><div><h2>Synonym Management</h2><p>Maintain global language mappings so AI can understand different business expressions.</p></div><button type="button" class="v20-primary" id="addSynonymRow">+ Add Synonym</button></header><div class="v20-synonym-table-wrap"><table class="v20-synonym-wide"><thead><tr><th>STANDARD TERM <i>*</i></th><th>SYNONYM <i>*</i></th><th>TERM TYPE <i>*</i></th><th>APPLICABLE BUSINESS DOMAIN</th><th>APPLICABLE REPORTS</th><th>RELATED DATASETS</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>${rows.map(readonly).join("")}</tbody></table></div><small class="v20-synonym-note">New rows appear at the top. Complete required fields before submitting.</small></section>`;
  }
  function bindMulti(scope) {
    scope.querySelectorAll(".v20-synonym-multi").forEach((control) => {
      const summary = control.querySelector("summary"),
        boxes = control.querySelectorAll("input");
      boxes.forEach((box) =>
        box.addEventListener("change", () => {
          const values = Array.from(boxes)
            .filter((item) => item.checked)
            .map((item) => item.value);
          summary.textContent = values.join(", ") || "Select one or more";
        }),
      );
    });
  }
  function mount() {
    const type = document.querySelector("#knowledgeType"),
      fields = document.querySelector("#typeFields");
    if (!type || type.value !== "Synonyms" || !fields || fields.dataset.synonymV2) return;
    fields.innerHTML = manager();
    fields.dataset.synonymV2 = "true";
    const body = fields.querySelector("tbody");
    const add = () => {
      body.insertAdjacentHTML("afterbegin", editable());
      const row = body.querySelector(".v20-synonym-new");
      bindMulti(row);
      row.querySelector("input")?.focus();
    };
    fields.querySelector("#addSynonymRow").addEventListener("click", add);
    body.addEventListener("click", (event) => {
      const button = event.target.closest(".v20-remove-synonym");
      if (button) button.closest("tr").remove();
    });
  }
  window.setTimeout(mount, 700);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(mount, 400));
})();
(function () {
  function applyEditPrefill() {
    const query = new URLSearchParams(location.search);
    if (query.get("mode") !== "edit") return;
    const asset = (window.marketingKnowledgeAssets || []).find(
      (item) => item.id === query.get("id"),
    );
    const fields = document.querySelector("#typeFields");
    if (!asset || !fields) return;
    const pageTitle = document.querySelector("#pageTitle"),
      crumb = document.querySelector("#breadcrumbCurrent");
    if (pageTitle) pageTitle.textContent = asset.title;
    if (crumb) crumb.textContent = "Edit Knowledge";
    const setValue = (selector, value) => {
      const element = fields.querySelector(selector);
      if (element && value) element.value = value;
    };
    const summary = asset.summary || "";
    if (asset.type === "Principles") {
      setValue("input", asset.title);
      setValue("textarea", summary);
    }
    if (asset.type === "Report Context") {
      const areas = fields.querySelectorAll("textarea");
      if (areas[0]) areas[0].value = summary;
      if (areas[1]) areas[1].value = (asset.aiUse || []).join(" ");
    }
    if (asset.type === "Business Term") {
      setValue('input[name="title"]', asset.title);
      setValue('textarea[name="description"]', summary);
      setValue('input[name="synonyms"]', asset.synonyms || asset.aliases || "");
      const scope = fields.querySelector('select[name="scope"]');
      if (scope) {
        const related = (asset.connections || []).map((item) => item.name);
        Array.from(scope.options).forEach((option) => {
          option.selected = related.some(
            (name) => name === option.value || name === option.textContent,
          );
        });
      }
    }
    if (asset.type === "Data Model") {
      const model = fields.querySelector(".v20-dm-create-info");
      if (model) {
        const input = model.querySelector("input[required]"),
          area = model.querySelector("textarea"),
          toggle = model.querySelector('input[type="checkbox"]');
        if (input) input.value = asset.title;
        if (area) area.value = summary;
        if (toggle) toggle.checked = !asset.isDisabled;
      }
    }
    if (asset.type === "Metric Dictionary") {
      setValue("#metricName", asset.title);
      setValue("#metricFormula", "Exposure Count ÷ Visit Count");
      const description = fields.querySelector(".v20-derived-field textarea");
      if (description) description.value = summary;
      const tokenBox = fields.querySelector(".v20-token-formula");
      if (tokenBox) {
        tokenBox.innerHTML =
          '<span class="v20-formula-token">Exposure Count</span><span class="v20-formula-operator">÷</span><span class="v20-formula-token">Visit Count</span>';
      }
    }
    const links = (asset.connections || []).map((item) => item.name);
    fields.querySelectorAll(".v20-multi-menu").forEach((menu) => {
      const values = Array.from(menu.querySelectorAll("input")).map((input) => input.value);
      const matched = values.filter((value) =>
        links.some((link) =>
          link.toLowerCase().includes(value.toLowerCase().replace(" strategy", "")),
        ),
      );
      if (!matched.length) return;
      menu.querySelectorAll("input").forEach((input) => {
        if (matched.includes(input.value)) {
          input.checked = true;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });
  }
  window.setTimeout(applyEditPrefill, 1050);
})();

(function () {
  function syncAiOverviewLabel() {
    const input = document.querySelector("#aiOverview");
    if (!input) return;
    const label = input.closest("label");
    let text = label.querySelector("[data-ai-overview-label]");
    if (!text) {
      Array.from(label.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .forEach((node) => node.remove());
      text = document.createElement("span");
      text.dataset.aiOverviewLabel = "true";
      label.append(text);
    }
    const paint = () => {
      text.textContent = input.checked ? "Enable AI Overview" : "Disable AI Overview";
    };
    if (!input.dataset.aiOverviewEnum) {
      input.dataset.aiOverviewEnum = "true";
      input.addEventListener("change", paint);
    }
    paint();
  }
  window.setTimeout(syncAiOverviewLabel, 100);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(syncAiOverviewLabel, 0));
})();

(function () {
  document.querySelector(".v20-view-card .v20-pill")?.remove();
})();
(function () {
  function fixBusinessTermLabel() {
    document
      .querySelectorAll("#typeFields .v20-field span, #typeFields .v20-label-text")
      .forEach((node) => {
        if (node.textContent.trim() === "Subject Domain / Report")
          node.textContent = "Business Domain / Report";
      });
  }
  window.setTimeout(fixBusinessTermLabel, 120);
  document
    .querySelector("#knowledgeType")
    ?.addEventListener("change", () => window.setTimeout(fixBusinessTermLabel, 40));
})();



