import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { GovernanceNav } from "../../components/GovernanceNav/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { ConfirmDialog } from "../../components/ConfirmDialog/index.jsx";
import { LibraryList } from "../../components/LibraryList/index.jsx";
import { LibraryToolbar } from "../../components/LibraryToolbar/index.jsx";
import { StatusBadge } from "../../components/StatusBadge/index.jsx";
import { Toast } from "../../components/Toast/index.jsx";
import { SkillDetail, skillStatusTones } from "../../features/scenario-library/SkillDetail/index.jsx";
import { SkillInlineForm } from "../../features/scenario-library/SkillInlineForm/index.jsx";
import "./ScenarioLibraryPage.css";

/** @type {readonly ["list", "create", "edit"]} */
export const skillLibraryModes = ["list", "create", "edit"];
/** @type {readonly ["all", "Draft", "Under Review", "In Development", "Published"]} */
export const skillStatuses = ["all", "Draft", "Under Review", "In Development", "Published"];

const COLUMN_KEYS = ["name", "purpose", "calls", "likes", "status", "owner"];
const HEART = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

/**
 * Controlled P15 page. All visible page copy, rows, workflow state and navigation are props.
 * @param {object} props
 * @param {object} props.content Hero, navigation, table, detail and form copy.
 * @param {object} props.logo Header logo.
 * @param {object[]} [props.navigation=[]] Primary navigation links.
 * @param {string} props.image Hero image URL.
 * @param {{items:object[],totalCount:number,search:string,status:typeof skillStatuses[number],onChange?:(event:{value:string})=>void,onSelect?:(event:{value:string})=>void,onClear?:(event:{kind:string})=>void,onOpen?:(event:{id:string})=>void,onClick?:(event:{action:"create"})=>void}} [props.library={}] Filtered skills and the controlled search/status filters; `onClick` is Create New Scenario, `onClear` the no-results state.
 * @param {object} [props.detail={}] Selected record and preview state.
 * @param {{purpose:string,title:string,message:string,confirmLabel:string,cancelLabel:string,onConfirm?:Function,onCancel?:Function}|null} [props.dialog=null] Delete confirmation.
 * @param {string} [props.toast=""] Success message after a delete (hidden when empty).
 * @param {object} [props.form={}] Controlled inline create/edit state.
 * @param {object} [props.assistant={}] Controlled lite assistant.
 * @param {object|null} props.skillFlow Optional model flow overlay.
 * @param {(id:string,params?:object)=>string} props.hrefFor Route adapter.
 * @param {(event:{id:string,params:object,href:string,label:string})=>void} [props.onNavigate]
 */
export function ScenarioLibraryPage({ content, logo, navigation = [], image, library = {}, detail = {}, form = {}, assistant = {}, skillFlow, dialog = null, toast = "", hrefFor, onNavigate }) {
  const labels = content.labels;
  const { items = [], totalCount = 0, search = "", status = "all" } = library;
  const rows = items.map((item) => ({
    id: item.id,
    name: <span className="mh-skill-page__name"><span className="mh-skill-page__mark" aria-hidden="true">{item.name.charAt(0)}</span>{item.name}</span>,
    purpose: <span className="mh-skill-page__muted">{item.purpose}</span>,
    calls: item.callCount,
    likes: <span className="mh-skill-page__likes"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={HEART} /></svg>{item.likeRate}%</span>,
    status: <StatusBadge status={item.status} tone={skillStatusTones[item.status]} />,
    owner: item.owner,
  }));
  return <div className="mh-skill-page" data-skill-mode={form.mode || "list"} data-skill-status={library.status || "all"}>
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={image} eyebrow={content.hero.eyebrow} title={content.hero.title} description={content.hero.description} height={372} variant="home" scrim="none" asideLabel={content.labels.summaryAria}><div className="mh-skill-page__stats">{content.hero.stats.map((stat) => <MetricStat key={stat.label} label={stat.label} value={stat.value} caption={stat.caption} variant="glass" />)}</div></Hero>
    <div className="mh-skill-page__body"><GovernanceNav items={content.sidebar} current="scenario-library" navigationAria={content.labels.navigationAria} categoriesAria={content.labels.categoriesAria} hrefFor={hrefFor} onNavigate={onNavigate} /><main className="mh-skill-page__main">{form.mode === "create" || form.mode === "edit" ? <SkillInlineForm labels={content.labels} values={form.values} preview={form.preview} onChange={form.onChange} onSubmit={form.onSubmit} onCancel={form.onCancel} onAutoFill={form.onAutoFill} onRunPreview={form.onRunPreview} onSaveDraft={form.onSaveDraft} /> : <>
      <LibraryToolbar
        search={{ label: labels.searchAria, placeholder: labels.searchPlaceholder, value: search }}
        facets={[{ id: "status", label: labels.statusLabel, kind: "single", allLabel: labels.statusOptions[0].label, options: labels.statusOptions.filter((option) => option.value !== "all").map((option) => ({ id: option.value, label: option.label })), selected: status === "all" ? "" : status }]}
        count={`${items.length} ${items.length === 1 ? labels.scenarioSingular : labels.scenarioPlural}`}
        create={{ label: labels.create }}
        onChange={({ field, value }) => { if (field === "search") library.onChange?.({ value }); else library.onSelect?.({ value: value || "all" }); }}
        onCreate={() => library.onClick?.({ action: "create" })}
      />
      <LibraryList label={labels.listAria} layout="table" columns={COLUMN_KEYS.map((key, index) => ({ key, header: labels.columns[index] }))} rows={rows} empty={{ kind: totalCount ? "no-results" : "empty", title: labels.emptyTitle, message: labels.emptyHelp, clearLabel: labels.clearFilters }} onOpen={library.onOpen} onClear={library.onClear} />
    </>}</main></div>
    <AssistantDock assistant={assistant} skillFlow={skillFlow} variant="lite" />
    <SkillDetail skill={detail.skill} labels={labels} previewOpen={detail.previewOpen} onCancel={detail.onCancel} onChange={detail.onChange} onOpen={detail.onOpen} onClick={detail.onClick} />
    <ConfirmDialog open={Boolean(dialog)} purpose={dialog?.purpose} title={dialog?.title} message={dialog?.message} confirmLabel={dialog?.confirmLabel} cancelLabel={dialog?.cancelLabel} onConfirm={dialog?.onConfirm} onCancel={dialog?.onCancel} />
    <Toast open={Boolean(toast)} message={toast} />
  </div>;
}
