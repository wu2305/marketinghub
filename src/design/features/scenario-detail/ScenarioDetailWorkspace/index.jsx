import "../../../tokens.css";
import React from "react";
import "./ScenarioDetailWorkspace.css";

/** @type {readonly ["content", "related", "ai-check", "usage", "version", "activity"]} */
export const scenarioDetailTabs = ["content", "related", "ai-check", "usage", "version", "activity"];

function isPlainPrimaryLink(event) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.currentTarget.target;
}

const glyphs = {
  edit: <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  table: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
  bulb: <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
  "arrow-left": <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />,
  warning: <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
  file: <><path d="M10 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path d="M14 2v6h6" /></>,
  user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  layers: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  "check-circle": <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  chart: <path d="M18 20V10M12 20V4M6 20v-6" />,
  "file-text": <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></>,
  heart: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />,
  "grid-four": <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  eye: <><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
  "eye-off": <><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.99M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.058 10.058 0 01-3.704 4.976m0 0L21 21" /></>,
  report: <><path d="M9 17v-2a2 2 0 012-2h6a2 2 0 012 2v2M9 17H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2" /><path d="M13 2v6h6" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
  missing: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>,
};

function DetailGlyph({ name }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{glyphs[name]}</svg>;
}

function fieldValue(record, key, labels) {
  if (key === "usageCount") return `${record.callCount} / ${record.callPeriod}`;
  if (key === "accuracy") return `${record.accuracyScore}%`;
  if (key === "user") return record.user || labels.userFallback;
  return record[key];
}

function ContentPanel({ record, labels, previewOpen, onTogglePreview, hrefFor, onNavigate }) {
  const editParams = { id: record.id };
  const editHref = hrefFor?.("scenario-edit", editParams) || `scenario-edit.html?id=${encodeURIComponent(record.id)}`;
  return <div className="mh-scenario-detail__content" data-scenario-panel="content">
    <div className="mh-scenario-detail__info-head"><div><h2>{record.name}</h2><div className="mh-scenario-detail__meta"><span className={`mh-scenario-detail__tag mh-scenario-detail__tag--${record.status.toLowerCase().replaceAll(" ", "-")}`}>{record.status}</span><span className="mh-scenario-detail__tag mh-scenario-detail__tag--scope">{record.scope}</span><span className="mh-scenario-detail__tag mh-scenario-detail__tag--version">{record.version}</span></div></div><a className="mh-scenario-detail__edit" href={editHref} onClick={(event) => isPlainPrimaryLink(event) && onNavigate?.({ id: "scenario-edit", params: editParams, href: editHref, label: labels.edit })}><DetailGlyph name="edit" />{labels.edit}</a></div>
    <p className="mh-scenario-detail__description">{record.purpose}</p>
    <div className="mh-scenario-detail__structure">{labels.structure.map((field) => <div className="mh-scenario-detail__structure-item" key={field.key}><span className={`mh-scenario-detail__structure-icon mh-scenario-detail__structure-icon--${field.tone}`}><DetailGlyph name={field.icon} /></span><div><strong>{field.label}</strong><p>{record[field.key]}</p></div></div>)}</div>
    <section className="mh-scenario-detail__governance"><h3>{labels.governance}</h3><div className="mh-scenario-detail__governance-grid">{labels.governanceFields.map((field) => <div className="mh-scenario-detail__governance-item" key={field.key}><DetailGlyph name={field.icon} /><span className="mh-scenario-detail__field-label">{field.label}</span><span className={`mh-scenario-detail__field-value ${field.key === "reviewStatus" ? `mh-scenario-detail__field-value--${record.reviewStatus.toLowerCase()}` : ""}`}>{fieldValue(record, field.key, labels)}</span></div>)}</div></section>
    <section className="mh-scenario-detail__preview"><div className="mh-scenario-detail__preview-head"><h3>{labels.preview}</h3><button type="button" aria-expanded={previewOpen} onClick={() => onTogglePreview?.({ open: !previewOpen })}><DetailGlyph name={previewOpen ? "eye-off" : "eye"} />{previewOpen ? labels.hidePreview : labels.showPreview}</button></div>{previewOpen && <div className="mh-scenario-detail__preview-body"><div className="mh-scenario-detail__preview-question"><strong>{labels.exampleQuestion}</strong><span>{record.previewQuestion}</span></div><div className="mh-scenario-detail__preview-output"><pre>{record.previewOutput}</pre></div></div>}</section>
    <a className="mh-scenario-detail__usage-link" href="#"><DetailGlyph name="report" />{labels.usageLink.replace("{reports}", record.usedInReports).replace("{scenarios}", record.usedInScenarios)}</a>
  </div>;
}

function RelatedPanel({ labels, hrefFor, onNavigate }) {
  return <section className="mh-scenario-detail__related" data-scenario-panel="related"><h3>{labels.relatedTitle}</h3><div className="mh-scenario-detail__related-grid">{labels.related.map((item) => {
    const href = hrefFor?.(item.routeId, {}) || item.href;
    return <a key={item.id} href={href} onClick={(event) => isPlainPrimaryLink(event) && onNavigate?.({ id: item.routeId, params: {}, href, label: item.title })}><span className="mh-scenario-detail__related-icon"><DetailGlyph name={item.icon} /></span><span><strong>{item.title}</strong><small>{item.kind}</small></span><span className="mh-scenario-detail__related-arrow" aria-hidden="true">→</span></a>;
  })}</div></section>;
}

function AiCheckPanel({ check }) {
  return <section className="mh-scenario-detail__ai-check" data-scenario-panel="ai-check"><div className="mh-scenario-detail__ai-head"><DetailGlyph name="layers" /><h3>{check.title}</h3><span><DetailGlyph name="clock" />{check.status}</span></div><div className="mh-scenario-detail__ai-card"><div className="mh-scenario-detail__ai-score"><span>{check.completeness}</span><strong>{check.score}</strong></div><div className="mh-scenario-detail__ai-progress"><span style={{ width: `${check.percent}%` }} /></div><div className="mh-scenario-detail__ai-fields">{check.fields.map((field) => <div className={`mh-scenario-detail__ai-field mh-scenario-detail__ai-field--${field.state}`} key={field.label}><DetailGlyph name={field.state === "filled" ? "check" : "missing"} />{field.label}</div>)}</div></div></section>;
}

function UsagePanel({ usage }) {
  return <section className="mh-scenario-detail__usage" data-scenario-panel="usage"><h3>{usage.title}</h3><div className="mh-scenario-detail__governance-grid">{usage.fields.map((field) => <div className="mh-scenario-detail__governance-item" key={field.label}><DetailGlyph name={field.icon} /><span className="mh-scenario-detail__field-label">{field.label}</span><span className="mh-scenario-detail__field-value">{field.value}</span></div>)}</div></section>;
}

function VersionPanel({ version }) {
  return <section className="mh-scenario-detail__version" data-scenario-panel="version"><h3>{version.title}</h3><div>{version.items.map((item) => <div className={`mh-scenario-detail__version-row ${item.current ? "is-current" : ""}`} key={item.version}><span className="mh-scenario-detail__version-number">{item.version}</span><div><strong>{item.title}</strong><small>{item.meta}</small></div><span className="mh-scenario-detail__version-badge">{item.status}</span></div>)}</div></section>;
}

function ActivityPanel({ items }) {
  return <section className="mh-scenario-detail__activity" data-scenario-panel="activity">{items.map((item, index) => <div className="mh-scenario-detail__activity-row" key={`${item.time}-${index}`}><span className="mh-scenario-detail__activity-avatar">{item.initials}</span><div><strong>{item.title}</strong><small>{item.detail}</small></div><time>{item.time}</time></div>)}</section>;
}

/**
 * Controlled Scenario Detail tabs, record content and preview.
 * @param {object} props
 * @param {object} props.record Skill record with structure, governance and preview fields.
 * @param {object} props.labels Visible copy and static panel data.
 * @param {typeof scenarioDetailTabs[number]} props.tab
 * @param {boolean} props.previewOpen
 * @param {(event:{value:string})=>void} [props.onTabChange]
 * @param {(event:{open:boolean})=>void} [props.onTogglePreview]
 * @param {(id:string,params?:object)=>string} [props.hrefFor]
 * @param {(event:{id:string,params:object,href:string,label:string})=>void} [props.onNavigate]
 */
export function ScenarioDetailWorkspace({ record, labels, tab = "content", previewOpen = false, onTabChange, onTogglePreview, hrefFor, onNavigate }) {
  if (!record) return null;
  return <div className="mh-scenario-detail" data-scenario-tab={tab}>
    <nav className="mh-scenario-detail__tabs" aria-label={labels.tabsAria}>{labels.tabs.map((item) => <button key={item.value} type="button" aria-pressed={tab === item.value} className={tab === item.value ? "is-active" : ""} onClick={() => onTabChange?.({ value: item.value })}>{item.label}</button>)}</nav>
    <div className="mh-scenario-detail__panel">
      {tab === "content" && <ContentPanel record={record} labels={labels} previewOpen={previewOpen} onTogglePreview={onTogglePreview} hrefFor={hrefFor} onNavigate={onNavigate} />}
      {tab === "related" && <RelatedPanel labels={labels} hrefFor={hrefFor} onNavigate={onNavigate} />}
      {tab === "ai-check" && <AiCheckPanel check={labels.aiCheck} />}
      {tab === "usage" && <UsagePanel usage={labels.usage} />}
      {tab === "version" && <VersionPanel version={labels.version} />}
      {tab === "activity" && <ActivityPanel items={labels.activity} />}
    </div>
  </div>;
}
