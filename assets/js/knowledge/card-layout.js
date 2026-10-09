/* Shared content renderer for the six static knowledge card types. */
(function () {
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]);
  window.renderKnowledgePills = values => values?.length ? `<span class="knowledge-card-pills">${values.map(value => `<span title="${esc(value)}">${esc(value)}</span>`).join("")}</span>` : "—";
  window.renderKnowledgeCard = ({ title, description = "", enabled = true, draft = false, rows = [], actions = "" }) => {
    const field = row => `<div class="knowledge-card-field"><dt>${esc(row.label)}</dt><dd title="${esc(row.value)}">${row.html || esc(row.value || "—")}</dd></div>`;
    return `<header class="knowledge-card-head"><h3 title="${esc(title)}">${esc(title)}${draft ? '<sup class="fm-draft-badge">Draft</sup>' : ''}</h3><span class="knowledge-card-status ${enabled ? '' : 'is-disabled'}"><i aria-hidden="true"></i>${enabled ? 'Enabled' : 'Disabled'}</span></header><p class="knowledge-card-description" title="${esc(description)}">${esc(description)}</p><dl class="knowledge-card-fields">${rows.map((row, i) => `<div class="knowledge-card-row">${field(row)}${row.secondary ? field(row.secondary) : ''}${actions && i === rows.length - 1 ? `<div class="knowledge-card-actions fm-actions">${actions}</div>` : ''}</div>`).join('')}</dl>`;
  };
})();
