import React from "react";
import { Modal } from "../../../components/Modal/index.jsx";
import "./KnowledgeDetail.css";

/** @type {readonly ["Principles", "Business Term", "Data Model", "Scenario Reporting"]} */
export const knowledgeDetailTypes = ["Principles", "Business Term", "Data Model", "Scenario Reporting"];
/** @type {readonly ["preview", "smart", "export", "edit"]} */
export const knowledgeModelActions = ["preview", "smart", "export", "edit"];
/** @type {readonly ["basic", "fields"]} */
export const knowledgeModelTabs = ["basic", "fields"];
/** @type {readonly ["entity", "event"]} */
export const knowledgeModelGroups = ["entity", "event"];

function notifyNavigation(event, onNavigate, target) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  onNavigate?.(target);
}

function Crumbs({ record, copy, hrefFor, onNavigate, model = false }) {
  const steps = model
    ? [{ id: "knowledge", label: copy.interpreter }, { id: "knowledge", label: copy.model.crumbType, params: { type: record.type } }]
    : [{ id: "home", label: copy.home }, { id: "knowledge", label: copy.interpreter }, { id: "knowledge", label: copy.management }, { id: "knowledge", label: record.type, params: { type: record.type } }];
  return <nav className="mh-kdetail__crumbs" aria-label={copy.breadcrumbAria}>{steps.map((step, i) => {
    const params = step.params || {};
    const href = hrefFor(step.id, params);
    return <React.Fragment key={`${step.id}-${i}`}><a href={href} onClick={(event) => notifyNavigation(event, onNavigate, { id: step.id, params, href })}>{step.label}</a><span>/</span></React.Fragment>;
  })}<b>{model ? copy.model.title : record.title}</b></nav>;
}

function VersionPanel({ copy, versions, open, onClose }) {
  return <Modal open={open} variant="drawer" className="mh-kdetail__versions" eyebrow={copy.versionEyebrow} title={copy.versionButton} closeLabel={copy.closeVersions} onClose={onClose}>
    <div className="mh-kdetail__version-list">{versions.map((version) => <article className={`mh-kdetail__version${version.current ? " mh-kdetail__version--current" : ""}`} key={version.number}>
      <div className="mh-kdetail__version-number">{version.number}</div><div><strong>{version.label}</strong><span>{version.editor} · {version.date}</span><p>{version.description}</p></div>
    </article>)}</div>
  </Modal>;
}

function Section({ number, title, caption, children }) {
  return <section className="mh-kdetail__section"><header className="mh-kdetail__section-head"><span className="mh-kdetail__number">{number}</span><div><strong>{title}</strong><small>{caption}</small></div></header><div className="mh-kdetail__section-body">{children}</div></section>;
}

function ReadonlyField({ label, children, full = false }) {
  return <div className={`mh-kdetail__field${full ? " mh-kdetail__field--full" : ""}`}><span className="mh-kdetail__label">{label}</span><div className="mh-kdetail__value">{children}</div></div>;
}

function Chips({ values, empty }) {
  return <div className="mh-kdetail__chips">{values?.length ? values.map((value) => <span className="mh-kdetail__chip" key={value}>{value}</span>) : <span className="mh-kdetail__chip mh-kdetail__chip--muted">{empty}</span>}</div>;
}

function BusinessTermDetail({ record, copy, hrefFor, onNavigate, onOpen, overlay, onClose }) {
  const c = copy.business;
  const versions = [
    { number: record.version, label: copy.versionCurrent, editor: record.owner, date: record.updated, description: c.currentDescription, current: true },
    { number: c.initialVersion, label: copy.versionPublished, editor: record.owner, date: c.initialDate, description: c.initialDescription },
  ];
  const editParams = { mode: "edit", id: record.id };
  const editHref = hrefFor("knowledgeCreate", editParams);
  return <div className="mh-kdetail mh-kdetail--business"><Crumbs record={record} copy={copy} hrefFor={hrefFor} onNavigate={onNavigate} />
    <header className="mh-kdetail__head"><h1>{record.title}</h1><button type="button" className="mh-kdetail__outline" onClick={() => onOpen?.({ kind: "versions" })}>{copy.versionButton}</button></header>
    <div className="mh-kdetail__sections">
      <Section number="1" {...c.sections[0]}><div className="mh-kdetail__grid">
        <ReadonlyField label={c.labels.title}>{record.title}</ReadonlyField>
        <ReadonlyField label={c.labels.description} full>{record.description}</ReadonlyField>
        <ReadonlyField label={c.labels.synonyms} full><Chips values={record.synonyms} empty={copy.none} /></ReadonlyField>
        <ReadonlyField label={c.labels.scope} full><Chips values={record.scope} empty={copy.global} /></ReadonlyField>
        <ReadonlyField label={c.labels.status}><span className="mh-kdetail__status">{record.status}</span></ReadonlyField>
        <ReadonlyField label={c.labels.version}>{record.version}</ReadonlyField>
      </div></Section>
      <Section number="2" {...c.sections[1]}><div className="mh-kdetail__table-wrap"><table className="mh-kdetail__table"><thead><tr>{c.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{record.relatedAssets?.length ? record.relatedAssets.map((row, i) => <tr key={`${row[0]}-${i}`}>{row.slice(0, 3).map((item, j) => <td key={j}>{item}</td>)}<td><span className="mh-kdetail__status">{row[3] || copy.statusPublished}</span></td></tr>) : <tr><td colSpan={4}>{c.emptyRelated}</td></tr>}</tbody></table></div></Section>
      <Section number="3" {...c.sections[2]}><div className="mh-kdetail__grid">
        <ReadonlyField label={c.labels.owner}>{record.owner}</ReadonlyField><ReadonlyField label={c.labels.reviewer}>{c.reviewer}</ReadonlyField><ReadonlyField label={c.labels.department}>{record.department}</ReadonlyField><ReadonlyField label={c.labels.status}><span className="mh-kdetail__status">{record.status}</span></ReadonlyField><ReadonlyField label={c.labels.currentVersion}>{record.version}</ReadonlyField><ReadonlyField label={c.labels.updated}>{record.updated}</ReadonlyField>
      </div></Section>
    </div><div className="mh-kdetail__actions"><a className="mh-kdetail__primary" href={editHref} onClick={(event) => notifyNavigation(event, onNavigate, { id: "knowledgeCreate", params: editParams, href: editHref })}>{c.edit}</a></div>
    <VersionPanel record={record} copy={copy} versions={versions} open={overlay === "versions"} onClose={onClose} />
  </div>;
}

function PrinciplesDetail({ record, copy, promptSections, collapsed, hrefFor, onNavigate, onOpen, overlay, onClose, onToggle }) {
  const first = promptSections[0];
  const versions = [
    { number: copy.principles.versionNumbers[0], label: copy.versionCurrent, editor: record.owner, date: record.updated, description: copy.principles.versionDescriptions[0], current: true },
    { number: copy.principles.versionNumbers[1], label: copy.versionPublished, editor: copy.principles.priorEditor, date: copy.principles.priorDate, description: copy.principles.versionDescriptions[1] },
    { number: copy.principles.versionNumbers[2], label: copy.versionPublished, editor: record.owner, date: record.created, description: copy.principles.versionDescriptions[2] },
  ];
  return <div className="mh-kdetail mh-kdetail--principles"><Crumbs record={record} copy={copy} hrefFor={hrefFor} onNavigate={onNavigate} />
    <header className="mh-kdetail__head"><div><h1>{record.title}</h1><p>{record.summary || copy.principles.leadFallback}</p><div className="mh-kdetail__chips mh-kdetail__chips--gold"><span className="mh-kdetail__chip">{copy.principles.governedPrompt}</span><span className="mh-kdetail__chip">{record.source}</span></div></div><button type="button" className="mh-kdetail__outline" onClick={() => onOpen?.({ kind: "versions" })}>{copy.versionButton}</button></header>
    <section className={`mh-kdetail__principle${collapsed ? " mh-kdetail__principle--collapsed" : ""}`}><header><span className="mh-kdetail__principle-index">01</span><div><strong>{first.title}</strong><small>{first.summary}</small></div><button type="button" aria-label={copy.principles.collapse(first.title)} aria-expanded={!collapsed} onClick={() => onToggle?.({ id: "prompt-first", expanded: collapsed })}>⌃</button></header>{!collapsed && <ul>{first.body.map((item) => <li key={item}>{item}</li>)}</ul>}</section>
    <VersionPanel record={record} copy={copy} versions={versions} open={overlay === "versions"} onClose={onClose} />
  </div>;
}

function ScenarioDetail({ record, copy, hrefFor, onNavigate, onOpen, overlay, onClose }) {
  const c = copy.scenario;
  const editParams = { type: record.type, mode: "edit", id: record.id };
  const editHref = hrefFor("knowledgeCreate", editParams);
  return <div className="mh-kdetail mh-kdetail--scenario"><Crumbs record={record} copy={copy} hrefFor={hrefFor} onNavigate={onNavigate} />
    <header className="mh-kdetail__head"><h1>{record.title}</h1><span className="mh-kdetail__status">{record.statusDisplay}</span></header>
    <div className="mh-kdetail__scenario-card"><Section number="01" {...c.sections[0]}><div className="mh-kdetail__grid"><ReadonlyField label={c.labels.title}>{record.title}</ReadonlyField><ReadonlyField label={c.labels.description} full>{record.description}</ReadonlyField><ReadonlyField label={c.labels.dataSources} full><Chips values={record.dataSources} empty={copy.none} /></ReadonlyField><ReadonlyField label={c.labels.triggerWhen} full>{record.triggerWhen}</ReadonlyField></div></Section>
    <Section number="02" {...c.sections[1]}><div className="mh-kdetail__grid"><ReadonlyField label={c.labels.input} full>{record.input}</ReadonlyField><ReadonlyField label={c.labels.analysisLogic} full>{record.analysisLogic}</ReadonlyField><ReadonlyField label={c.labels.output} full>{record.output}</ReadonlyField><ReadonlyField label={c.labels.owner}>{record.owner}</ReadonlyField><ReadonlyField label={c.labels.updated}>{record.updated}</ReadonlyField></div></Section>
    <footer className="mh-kdetail__scenario-actions"><a className="mh-kdetail__outline" href={editHref} onClick={(event) => notifyNavigation(event, onNavigate, { id: "knowledgeCreate", params: editParams, href: editHref })}>{c.edit}</a><button type="button" className="mh-kdetail__outline" onClick={() => onOpen?.({ kind: "scenario-versions" })}>{copy.versionButton}</button></footer></div>
    <Modal open={overlay === "scenario-versions"} title={c.versionsNoticeTitle} closeLabel={copy.closeNotice} onClose={onClose}><p className="mh-kdetail__notice">{c.versionsNotice}</p><a className="mh-kdetail__primary" href={hrefFor("knowledge")} onClick={(event) => notifyNavigation(event, onNavigate, { id: "knowledge", params: {}, href: hrefFor("knowledge") })}>{copy.backManagement}</a></Modal>
  </div>;
}

function DataModelDetail({ record, copy, model, hrefFor, onNavigate, query, group, tableId, tab, fields, overlay, onChange, onSelect, onAction, onClose }) {
  const c = copy.model;
  const visibleTables = model.tables.filter((table) => `${table.name} ${table.meta}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="mh-kdetail mh-kdetail--model"><header className="mh-kdetail__model-head"><div><Crumbs record={record} copy={copy} hrefFor={hrefFor} onNavigate={onNavigate} model /><h1>{c.title}</h1><p>{c.description}</p></div><div className="mh-kdetail__model-actions"><span className="mh-kdetail__model-published">{c.published}</span><button type="button" className="mh-kdetail__outline" onClick={() => onAction?.({ id: "edit" })}>{c.edit}</button><button type="button" className="mh-kdetail__model-export" onClick={() => onAction?.({ id: "export" })}>{c.export}</button></div></header>
    <section className="mh-kdetail__model-ai"><div className="mh-kdetail__model-ai-icon">◇</div><div><strong>{c.aiTitle} <small>{c.beta}</small></strong><p>{c.aiText}</p></div><button type="button" className="mh-kdetail__primary" onClick={() => onAction?.({ id: "smart" })}>{c.smart}</button></section>
    <div className="mh-kdetail__model-work"><aside className="mh-kdetail__model-side"><input type="search" aria-label={c.search} placeholder={c.search} value={query} onChange={(event) => onChange?.({ name: "query", value: event.target.value })} /><div className="mh-kdetail__model-switch">{knowledgeModelGroups.map((item) => <button type="button" key={item} className={group === item ? "is-active" : ""} onClick={() => onSelect?.({ kind: "group", id: item })}>{c[item]}</button>)}</div><div className="mh-kdetail__model-tables">{visibleTables.map((table) => <button type="button" key={table.id} className={tableId === table.id ? "is-active" : ""} onClick={() => onSelect?.({ kind: "table", id: table.id })}><b>{table.name}</b><small>{table.meta}</small></button>)}{visibleTables.length === 0 && <p>{c.noTables}</p>}</div><footer><b>{c.dataSource}</b><div>{c.sourceName}<span>{c.enabled}</span></div></footer></aside>
    <section className="mh-kdetail__model-config"><header><div className="mh-kdetail__model-tabs">{knowledgeModelTabs.map((item) => <button type="button" key={item} className={tab === item ? "is-active" : ""} onClick={() => onSelect?.({ kind: "tab", id: item })}>{c[item]}</button>)}</div><button type="button" className="mh-kdetail__outline" onClick={() => onAction?.({ id: "preview" })}>{c.preview}</button></header><div className="mh-kdetail__table-wrap"><table className="mh-kdetail__model-table"><thead><tr>{c.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{fields.map((field) => <tr key={field.id}><td><b>{field.id}</b><small>{field.format}</small></td><td><input aria-label={`${field.id} name`} value={field.name} onChange={(event) => onChange?.({ name: "fieldName", id: field.id, value: event.target.value })} /></td><td><span className="mh-kdetail__model-tag">{field.synonyms} ×</span><button type="button" aria-label={c.synonymsAddAria(field.id)} className="mh-kdetail__model-plus">＋</button></td><td><select aria-label={`${field.id} field type`} value={field.fieldType || c.fieldTypes[0]} onChange={(event) => onChange?.({ name: "fieldType", id: field.id, value: event.target.value })}>{c.fieldTypes.map((choice) => <option key={choice}>{choice}</option>)}</select></td><td><select aria-label={`${field.id} semantic role`} value={field.role || c.roles[0]} onChange={(event) => onChange?.({ name: "role", id: field.id, value: event.target.value })}>{c.roles.map((choice) => <option key={choice}>{choice}</option>)}</select></td><td><label className="mh-kdetail__model-toggle"><input type="checkbox" aria-label={`${field.id} fuzzy match`} checked={field.fuzzy} onChange={(event) => onChange?.({ name: "fuzzy", id: field.id, value: event.target.checked })} /><i /></label></td><td>{c.noAggregation}</td></tr>)}</tbody></table></div></section></div>
    <Modal open={knowledgeModelActions.includes(overlay)} title={copy.actionDone} closeLabel={copy.closeNotice} onClose={onClose}><p className="mh-kdetail__notice">{c.notices[overlay]}</p><a className="mh-kdetail__primary" href={hrefFor("knowledge")} onClick={(event) => notifyNavigation(event, onNavigate, { id: "knowledge", params: {}, href: hrefFor("knowledge") })}>{copy.backManagement}</a></Modal>
  </div>;
}

/** Four source-backed P09 detail compositions; each type keeps its own structure and actions.
 * @param {object} props
 * @param {{id:string,type:typeof knowledgeDetailTypes[number],title:string}} props.record
 * @param {object} props.copy All visible shell and detail text
 * @param {(id:string,params?:object)=>string} props.hrefFor
 * @param {(target:{id:string,params:object,href:string})=>void} [props.onNavigate]
 * @param {(action:{id:typeof knowledgeModelActions[number]})=>void} [props.onAction]
 */
export function KnowledgeDetail(props) {
  if (props.record.type === "Business Term") return <BusinessTermDetail {...props} />;
  if (props.record.type === "Principles") return <PrinciplesDetail {...props} />;
  if (props.record.type === "Scenario Reporting") return <ScenarioDetail {...props} />;
  if (props.record.type === "Data Model") return <DataModelDetail {...props} />;
  return null;
}
