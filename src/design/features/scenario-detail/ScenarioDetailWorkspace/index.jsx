import "../../../tokens.css";
import React from "react";
import { Icon } from "../../../icons.jsx";
import { ScenarioGovernance } from "../../../components/ScenarioGovernance/index.jsx";
import { ScenarioStructure } from "../../../components/ScenarioStructure/index.jsx";
import { ExamplePreview } from "../../../components/ExamplePreview/index.jsx";
import "./ScenarioDetailWorkspace.css";

/** @type {readonly ["content", "related", "ai-check", "usage", "version", "activity"]} */
export const scenarioDetailTabs = ["content", "related", "ai-check", "usage", "version", "activity"];

function isPlainPrimaryLink(event) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.currentTarget.target;
}

const glyphs = {
  edit: <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
  table: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
  layers: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  chart: <path d="M18 20V10M12 20V4M6 20v-6" />,
  "file-text": <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></>,
  heart: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />,
  "grid-four": <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  report: <><path d="M9 17v-2a2 2 0 012-2h6a2 2 0 012 2v2M9 17H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2" /><path d="M13 2v6h6" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
  missing: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>,
};

function DetailGlyph({ name }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{glyphs[name]}</svg>;
}

function ContentPanel({ record, labels, previewOpen, onTogglePreview, hrefFor, onNavigate }) {
  const editParams = { id: record.id };
  const editHref = hrefFor?.("scenario-edit", editParams) || `scenario-edit.html?id=${encodeURIComponent(record.id)}`;
  return <div className="mh-scenario-detail__content" data-scenario-panel="content">
    <div className="mh-scenario-detail__info-head"><div><h2>{record.name}</h2><div className="mh-scenario-detail__meta"><span className={`mh-scenario-detail__tag mh-scenario-detail__tag--${record.status.toLowerCase().replaceAll(" ", "-")}`}>{record.status}</span><span className="mh-scenario-detail__tag mh-scenario-detail__tag--scope">{record.scope}</span><span className="mh-scenario-detail__tag mh-scenario-detail__tag--version">{record.version}</span></div></div><a className="mh-scenario-detail__edit" href={editHref} onClick={(event) => isPlainPrimaryLink(event) && onNavigate?.({ id: "scenario-edit", params: editParams, href: editHref, label: labels.edit })}><DetailGlyph name="edit" />{labels.edit}</a></div>
    <p className="mh-scenario-detail__description">{record.purpose}</p>
    <div className="mh-scenario-detail__structure"><ScenarioStructure record={record} fields={labels.structure} /></div>
    <section className="mh-scenario-detail__governance"><h3>{labels.governance}</h3><ScenarioGovernance record={record} fields={labels.governanceFields} layout="columns" userFallback={labels.userFallback} /></section>
    <section className="mh-scenario-detail__preview"><ExamplePreview variant="view" title={labels.preview} actionLabel={previewOpen ? labels.hidePreview : labels.showPreview} questionLabel={labels.exampleQuestion} question={record.previewQuestion} output={previewOpen ? record.previewOutput : null} onToggle={onTogglePreview} /></section>
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
  return <section className="mh-scenario-detail__ai-check" data-scenario-panel="ai-check"><div className="mh-scenario-detail__ai-head"><DetailGlyph name="layers" /><h3>{check.title}</h3><span><Icon name="clock" />{check.status}</span></div><div className="mh-scenario-detail__ai-card"><div className="mh-scenario-detail__ai-score"><span>{check.completeness}</span><strong>{check.score}</strong></div><div className="mh-scenario-detail__ai-progress"><span style={{ width: `${check.percent}%` }} /></div><div className="mh-scenario-detail__ai-fields">{check.fields.map((field) => <div className={`mh-scenario-detail__ai-field mh-scenario-detail__ai-field--${field.state}`} key={field.label}><DetailGlyph name={field.state === "filled" ? "check" : "missing"} />{field.label}</div>)}</div></div></section>;
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
