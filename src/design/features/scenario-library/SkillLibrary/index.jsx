import "../../../tokens.css";
import React from "react";
import { Icon } from "../../../icons.jsx";
import "./SkillLibrary.css";

export const skillStatuses = ["all", "Draft", "Under Review", "In Development", "Published"];

/**
 * Searchable Skill Library table; filtering and stage transitions are owned by its caller.
 * @param {object} props
 * @param {object} props.labels Source-backed table, toolbar and empty-state copy.
 * @param {object[]} props.items Already filtered semantic skill records.
 * @param {number} props.totalCount Unfiltered All Scenarios badge count.
 * @param {string} props.search Controlled query.
 * @param {typeof skillStatuses[number]} props.status Controlled status.
 * @param {(event:{value:string})=>void} [props.onChange] Search changes.
 * @param {(event:{value:string})=>void} [props.onSelect] Status filter changes.
 * @param {(event:{id:string})=>void} [props.onOpen] Row or actions button.
 * @param {(event:{id:string})=>void} [props.onAdvance] Under Review/In Development status click.
 * @param {(event:{action:"create"})=>void} [props.onClick] Create New Scenario.
 */
export function SkillLibrary({ labels, items = [], totalCount = 0, search = "", status = "all", onChange, onSelect, onOpen, onAdvance, onClick }) {
  const statusLabel = (item) => item.status;
  return <section className="mh-skill-library" aria-label={labels.tab}>
    <div className="mh-skill-library__tabs" role="tablist" aria-label={labels.tabsAria}><button type="button" role="tab" aria-selected="true">{labels.tab} <span>{totalCount}</span></button></div>
    <div className="mh-skill-library__toolbar"><div className="mh-skill-library__controls"><label className="mh-skill-library__search"><span className="mh-skill-library__sr">{labels.searchAria}</span><Icon name="search" /><input type="search" value={search} placeholder={labels.searchPlaceholder} autoComplete="off" onChange={(event) => onChange?.({ value: event.target.value })} /></label><label className="mh-skill-library__filter"><span>{labels.statusLabel}</span><select value={status} onChange={(event) => onSelect?.({ value: event.target.value })}>{labels.statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div><button className="mh-skill-library__create" type="button" onClick={() => onClick?.({ action: "create" })}><Icon name="plus" />{labels.create}</button></div>
    <div className="mh-skill-library__head" aria-hidden="true">{labels.columns.map((column) => <span key={column}>{column}</span>)}</div>
    {items.length ? <div className="mh-skill-library__list" role="listbox" aria-label={labels.listAria}>{items.map((item) => <div className="mh-skill-library__row" data-skill-id={item.id} role="option" aria-selected="false" tabIndex={0} key={item.id} onClick={() => onOpen?.({ id: item.id })} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onOpen?.({ id: item.id }); } }}>
      <div className="mh-skill-library__main"><span className="mh-skill-library__mark">{item.name.charAt(0)}</span><span className="mh-skill-library__copy"><strong>{item.name}</strong><small>{item.purpose}</small></span></div><span className="mh-skill-library__purpose">{item.purpose}</span><span className="mh-skill-library__calls">{item.callCount}</span><span className="mh-skill-library__likes"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>{item.likeRate}%</span><span className="mh-skill-library__status-cell">{["Under Review", "In Development"].includes(item.status) ? <button type="button" className="mh-skill-library__status" data-status={item.status} onClick={(event) => { event.stopPropagation(); onAdvance?.({ id: item.id }); }}>{statusLabel(item)}</button> : <span className="mh-skill-library__status" data-status={item.status}>{statusLabel(item)}</span>}</span><span className="mh-skill-library__owner">{item.owner}</span><span className="mh-skill-library__action"><button type="button" aria-label={`${labels.actionsFor} ${item.name}`} onClick={(event) => { event.stopPropagation(); onOpen?.({ id: item.id }); }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></button></span>
    </div>)}</div> : <div className="mh-skill-library__empty"><strong>{labels.emptyTitle}</strong><span>{labels.emptyHelp}</span></div>}
  </section>;
}
