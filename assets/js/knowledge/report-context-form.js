(function () {
  const query = new URLSearchParams(location.search);
  if (query.get("type") !== "Report Context" || query.get("mode") !== "edit") return;

  const data = window.knowledgeFieldMapping;
  const fields = document.querySelector("#typeFields");
  const form = document.querySelector("#knowledgeForm");
  const footer = document.querySelector(".v20-form-footer");
  const record = data?.records("Report Context").find((item) => item.id === query.get("id"));
  if (!data || !fields || !form || !footer || !record) return;

  const esc = data.escape;
  form.onsubmit = null;
  const tags = (values) =>
    data
      .list(values)
      .map((value) => `<span class="fm-chip">${esc(value)}</span>`)
      .join("") || "—";
  const original = record.report_description || "";
  document.querySelector(".v20-type-row")?.setAttribute("hidden", "");
  document.body.classList.add("report-context-edit-page");
  document.querySelector("#pageTitle").textContent = `Edit ${record.report_name}`;
  document.querySelector("#breadcrumbCurrent").textContent = "Edit Report Context";

  fields.innerHTML = `
    <section class="rc-edit-overview">
      <div class="rc-edit-thumbnail">${record.report_thumbnail ? `<img src="${esc(record.report_thumbnail)}" alt="${esc(record.report_name)} preview">` : "<span>Report preview unavailable</span>"}</div>
      <div class="rc-edit-description-head">
        <div><span class="v20-eyebrow">REPORT DESCRIPTION</span><h2>${esc(record.report_name)}</h2></div>
        <div class="rc-edit-actions"><button type="button" class="fm-button fm-icon-action" id="rcUnlockDescription" aria-pressed="false" title="Unlock report description" aria-label="Unlock report description">🔒</button><button type="button" class="v20-secondary rc-version-history" id="rcViewDescriptionHistory">Version history</button></div>
      </div>
      <textarea id="rcDescription" class="rc-description-input" disabled>${esc(original)}</textarea>
      <p class="rc-description-hint" id="rcDescriptionHint">Unlock the description to edit this governed report context.</p>
      <div class="rc-edit-meta">
        <div><span>Data Model</span><div class="fm-tags">${tags(record.business_domain)}</div></div>
        <div><span>AI Interpreter Status</span><span class="fm-state">${record.ai_interpretation_enabled ? "Enabled" : "Disabled"}</span></div>
        <div><span>AI Summary</span><span class="fm-state">${record.ai_summary_enabled ? "Enabled" : "Disabled"}</span></div>
      </div>
    </section>
    <section class="rc-edit-readonly"><h3>Scenario Reports</h3><div class="fm-tags">${tags(record.scenario_report_ids)}</div><h3>Report Data Scope</h3><p>${esc(record.report_data_scope || "Report data scope has not been configured.")}</p></section>
  `;

  footer.innerHTML = `<span></span><div><button type="button" class="v20-secondary" id="rcEditCancel">Cancel</button><button type="submit" class="v20-primary" id="rcEditSubmit" disabled>Submit</button></div>`;
  const description = document.querySelector("#rcDescription");
  const unlock = document.querySelector("#rcUnlockDescription");
  const submit = document.querySelector("#rcEditSubmit");
  const hint = document.querySelector("#rcDescriptionHint");
  let unlocked = false;
  const refreshSubmit = () => {
    submit.disabled = description.value.trim() === original.trim();
  };

  unlock.addEventListener("click", () => {
    unlocked = !unlocked;
    description.disabled = !unlocked;
    unlock.setAttribute("aria-pressed", String(unlocked));
    unlock.textContent = unlocked ? "🔓" : "🔒";
    unlock.title = unlocked ? "Lock report description" : "Unlock report description";
    unlock.setAttribute("aria-label", unlock.title);
    hint.textContent = unlocked
      ? "You can now update the report description."
      : "Unlock the description to edit this governed report context.";
    if (unlocked) description.focus();
  });
  description.addEventListener("input", refreshSubmit);
  document.querySelector("#rcEditCancel").addEventListener("click", () => {
    location.href = "knowledge.html?type=Report%20Context";
  });
  document.querySelector("#rcViewDescriptionHistory").addEventListener("click", () => {
    const dialog = document.createElement("dialog");
    dialog.className = "fm-dialog rc-history-dialog";
    dialog.innerHTML = `<h3>Report description history</h3><div class="rc-history-list"><article><strong>Current version</strong><span>Current User · ${esc(record.updated_at)}</span><p>${esc(original)}</p></article><article><strong>Previous version</strong><span>Data Governance · Jul 24, 2026</span><p>Updated parameter sources and reporting guardrails.</p></article></div><footer><button type="button" class="fm-button primary">Close</button></footer>`;
    document.body.append(dialog);
    dialog.querySelector("button").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => dialog.remove());
    dialog.showModal();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const dialog = document.createElement("dialog");
    dialog.className = "fm-dialog";
    dialog.innerHTML = `<h3>Submit description update?</h3><p>This will submit the updated report description for review.</p><footer><button type="button" class="fm-button" data-action="cancel">Cancel</button><button type="button" class="fm-button primary" data-action="confirm">Submit</button></footer>`;
    document.body.append(dialog);
    dialog.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action === "cancel") dialog.close();
      if (action === "confirm") {
        data.save({
          ...record,
          report_description: description.value.trim(),
          summary: description.value.trim(),
          updated_at: new Date().toLocaleString("en-GB"),
        });
        dialog.close();
        location.href = "knowledge.html?type=Report%20Context";
      }
    });
    dialog.addEventListener("close", () => dialog.remove());
    dialog.showModal();
  });
})();
