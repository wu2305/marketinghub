import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
import { GovernanceNav } from "../../components/GovernanceNav/index.jsx";
import { LibraryList } from "../../components/LibraryList/index.jsx";
import { LibraryToolbar } from "../../components/LibraryToolbar/index.jsx";
import { StatusBadge } from "../../components/StatusBadge/index.jsx";
import { Icon } from "../../icons.jsx";
import "./FeedbackQualityPage.css";

/** @type {readonly ["all", "thumbs-up", "thumbs-down"]} */
export const feedbackFilterTypes = ["all", "thumbs-up", "thumbs-down"];
/** @type {readonly ["all", "today", "week", "month"]} */
export const feedbackFilterTimes = ["all", "today", "week", "month"];
/** @type {readonly ["all", "thumbs-up", "thumbs-down"]} */
export const feedbackTabs = ["all", "thumbs-up", "thumbs-down"];

const COLUMN_KEYS = ["question", "answer", "type", "reason", "feedbackBy", "time"];
const truncate = (value, limit) => (value.length > limit ? `${value.slice(0, limit)}...` : value);
const facetOptions = (options) => options.filter((option) => option.value !== "all").map((option) => ({ id: option.value, label: option.label }));
const single = (value) => (value === "all" ? "" : value);

/**
 * Controlled Feedback & Quality page on the governed-library table pattern:
 * All / Thumbs Up / Thumbs Down tabs, search, Type and Time facets, the feedback
 * table and its detail drawer. Feedback is immutable, so rows carry no actions.
 * Every visible label and record is supplied by the caller.
 * @param {object} props
 * @param {object} props.content Hero, sidebar, labels and assistant copy. // Hero、侧栏、标签与助手文案。
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {object[]} [props.navigation=[]] Header links. // 页头链接。
 * @param {{search:string,type:typeof feedbackFilterTypes[number],time:typeof feedbackFilterTimes[number],onSearchChange?:(event:{value:string})=>void,onTypeChange?:(event:{value:string})=>void,onTimeChange?:(event:{value:string})=>void,onClear?:(event:{kind:string})=>void,tabs?:typeof feedbackTabs[number][]}} [props.filters={}] Controlled filters; Type also drives the tabs; `tabs` lists the visible tabs (each can be left out, default all three); `onClear` comes from the no-results state. // 受控的筛选；Type 同时驱动标签页；`tabs` 列出可见标签页（每个都可以不传，默认全部三个）；`onClear` 来自无结果状态。
 * @param {{items:object[],counts:{total:number,up:number,down:number},onOpen?:(event:{id:string})=>void}} [props.list={}] Filtered rows and the dataset counts (Hero stats and tab labels). // 筛选后的行以及数据集计数（Hero 统计与标签页标签）。
 * @param {{selected:object|null,onClose?:(event:{reason:string})=>void}} [props.detail={}] Selected feedback. // 选中的反馈。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState} [props.assistant={}] Assistant state and callbacks. // 助手状态与回调。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model flow state and callbacks. // 建模流程状态与回调。
 * @param {(id:string,params?: Record<string,string>)=>string} props.hrefFor
 * @param {(event:{id:string,params: Record<string,string>,href:string,label:string})=>void} [props.onNavigate]
 */
export function FeedbackQualityPage({ content, logo, navigation = [], filters = {}, list = {}, detail = {}, assistant = {}, skillFlow, hrefFor, onNavigate }) {
  const { hero, sidebar, labels } = content;
  const { search = "", type = "all", time = "all", onSearchChange, onTypeChange, onTimeChange, onClear, tabs: visibleTabs = feedbackTabs } = filters;
  const { items = [], counts = {}, onOpen } = list;
  const tabItems = [{ id: "all", label: `${labels.tab} ${counts.total ?? 0}` }, { id: "thumbs-up", label: `${labels.up} ${counts.up ?? 0}` }, { id: "thumbs-down", label: `${labels.down} ${counts.down ?? 0}` }].filter((tab) => visibleTabs.includes(tab.id));
  const { selected, onClose } = detail;
  const typeBadge = (value) => <StatusBadge status={value} tone={value === "thumbs-up" ? "success" : "danger"}><span className="mh-feedback-page__type"><Icon name={value === "thumbs-up" ? "thumb-up" : "thumb-down"} />{value === "thumbs-up" ? labels.up : labels.down}</span></StatusBadge>;
  const rows = items.map((item) => ({
    id: item.id,
    question: <span title={item.question}>{truncate(item.question, 50)}</span>,
    answer: <span className="mh-feedback-page__muted" title={item.answer}>{truncate(item.answer, 60)}</span>,
    type: typeBadge(item.type),
    reason: item.reason ? <span className="mh-feedback-page__muted" title={item.reason}>{truncate(item.reason, 40)}</span> : <span className="mh-feedback-page__none">{labels.reasonNone}</span>,
    feedbackBy: <span className="mh-feedback-page__by"><span className="mh-feedback-page__avatar" aria-hidden="true">{item.feedbackByInitials}</span>{item.feedbackBy}</span>,
    time: item.time,
  }));
  return <div className="mh-feedback-page">
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={hero.image} eyebrow={hero.eyebrow} title={hero.title} description={hero.description} height={372} variant="home" scrim="none" asideLabel={hero.summaryAria}>
      <div className="mh-feedback-page__stats">{hero.stats.map((stat) => <MetricStat key={stat.key} label={stat.label} value={counts[stat.key] ?? 0} caption={stat.caption} variant="glass" />)}</div>
    </Hero>
    <div className="mh-feedback-page__body">
      <GovernanceNav items={sidebar} current="feedback-quality" navigationAria={labels.navigationAria} categoriesAria={labels.categoriesAria} hrefFor={hrefFor} onNavigate={onNavigate} />
      <main className="mh-feedback-page__main">
        <LibraryToolbar
          tabs={tabItems.length ? { label: labels.tabsAria, value: type, items: tabItems } : undefined}
          search={{ label: labels.searchAria, placeholder: labels.search, value: search }}
          facets={[
            { id: "type", label: labels.type, kind: "single", allLabel: labels.typeOptions[0]?.label, options: facetOptions(labels.typeOptions), selected: single(type) },
            { id: "time", label: labels.time, kind: "single", allLabel: labels.timeOptions[0]?.label, options: facetOptions(labels.timeOptions), selected: single(time) },
          ]}
          count={`${items.length} ${items.length === 1 ? labels.unitOne : labels.unitOther}`}
          onChange={({ field, value }) => {
            if (field === "search") onSearchChange?.({ value });
            else if (field === "tab" || field === "type") onTypeChange?.({ value: value || "all" });
            else if (field === "time") onTimeChange?.({ value: value || "all" });
          }}
        />
        <LibraryList
          label={labels.itemsAria}
          layout="table"
          columns={COLUMN_KEYS.map((key, index) => ({ key, header: labels.columns[index] }))}
          rows={rows}
          empty={{ kind: "no-results", title: labels.emptyTitle, message: labels.emptyDescription, clearLabel: labels.clearFiltersLabel }}
          onOpen={onOpen}
          onClear={onClear}
        />
      </main>
    </div>
    <Modal open={Boolean(selected)} variant="drawer" className="mh-feedback-page__detail" eyebrow={labels.detailEyebrow} title={labels.detailTitle} closeLabel={labels.closeDetail} onClose={onClose}>
      {selected && <><div className="mh-feedback-page__detail-head"><div>{typeBadge(selected.type)}<small>{selected.time}</small></div><h2>{selected.question}</h2></div><section className="mh-feedback-page__detail-section"><h3>{labels.answer}</h3><div className="mh-feedback-page__detail-answer">{selected.answer}</div></section>{selected.reason ? <section className="mh-feedback-page__detail-section"><h3>{labels.downReason}</h3><div className="mh-feedback-page__detail-reason">{selected.reason}</div></section> : null}<dl className="mh-feedback-page__detail-meta"><div><dt>{labels.feedbackBy}</dt><dd>{selected.feedbackBy}</dd></div><div><dt>{labels.operationTime}</dt><dd>{selected.time}</dd></div></dl></>}
    </Modal>
    <AssistantDock assistant={assistant} skillFlow={skillFlow} variant="home" />
  </div>;
}
