import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { AssistantPanel } from "../../components/AssistantPanel/index.jsx";
import { ModelFlowDialog } from "../../components/ModelFlowDialog/index.jsx";
import { GovernanceNav } from "../../components/GovernanceNav/index.jsx";
import { FeedbackList } from "../../features/feedback-quality/FeedbackList/index.jsx";
import { Icon } from "../../icons.jsx";
import "./FeedbackQualityPage.css";

export const feedbackFilterTypes = ["all", "thumbs-up", "thumbs-down"];
export const feedbackFilterTimes = ["all", "today", "week", "month"];

/**
 * Controlled Feedback & Quality page. Every visible label and record is supplied by the caller.
 * @param {object} props
 * @param {object} props.content Hero, sidebar, labels and assistant copy.
 * @param {object} props.logo Header logo.
 * @param {object[]} [props.navigation=[]] Header links.
 * @param {{search:string,type:typeof feedbackFilterTypes[number],time:typeof feedbackFilterTimes[number],onSearchChange?:(event:{value:string})=>void,onTypeChange?:(event:{value:string})=>void,onTimeChange?:(event:{value:string})=>void}} [props.filters={}] Controlled filters.
 * @param {{items:object[],counts:{total:number,up:number,down:number},onOpen?:(event:{id:string})=>void}} [props.list={}] Feedback rows and counts.
 * @param {{selected:object|null,onClose?:(event:{reason:string})=>void}} [props.detail={}] Selected feedback.
 * @param {object} [props.assistant={}] Assistant state and callbacks.
 * @param {object} [props.skillFlow] Model flow state and callbacks.
 * @param {(id:string,params?:object)=>string} props.hrefFor
 * @param {(event:{id:string,params:object,href:string,label:string})=>void} [props.onNavigate]
 */
export function FeedbackQualityPage({ content, logo, navigation = [], filters = {}, list = {}, detail = {}, assistant = {}, skillFlow, hrefFor, onNavigate }) {
  const { hero, sidebar, labels } = content;
  const { search = "", type = "all", time = "all", onSearchChange, onTypeChange, onTimeChange } = filters;
  const { items = [], counts = {}, onOpen } = list;
  const { selected, onClose } = detail;
  const launcherRef = React.useRef(null);
  const { open: aiOpen = false, prompt: aiPrompt = "", answers = [], selectedSkill, onOpen: onAssistantOpen, onClose: onAssistantClose, onPromptChange, onSubmit, onSuggestion, onHistorySelect, onNewSession, onSelectSkill, onClearSkill, onSkillAction, onAttach, onMaximize, onHistory, ...aiCopy } = assistant;
  return <div className="mh-feedback-page" data-feedback-type={type} data-feedback-time={time}>
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={hero.image} eyebrow={hero.eyebrow} title={hero.title} description={hero.description} height={372} variant="home" scrim="none" asideLabel={hero.summaryAria}>
      <div className="mh-feedback-page__stats">{hero.stats.map((stat) => <MetricStat key={stat.key} label={stat.label} value={counts[stat.key] ?? 0} caption={stat.caption} variant="glass" />)}</div>
    </Hero>
    <div className="mh-feedback-page__body">
      <GovernanceNav items={sidebar} current="feedback-quality" navigationAria={labels.navigationAria} categoriesAria={labels.categoriesAria} hrefFor={hrefFor} onNavigate={onNavigate} />
      <main className="mh-feedback-page__main">
        <div className="mh-feedback-page__tabs" role="tablist" aria-label={labels.tabsAria}><button type="button" role="tab" aria-selected={type === "all"} onClick={() => onTypeChange?.({ value: "all" })}>{labels.tab} <span>{counts.total ?? 0}</span></button></div>
        <section className="mh-feedback-page__library" aria-label={labels.itemsAria}>
          <div className="mh-feedback-page__toolbar"><label className="mh-feedback-page__search"><span className="mh-feedback-page__sr">{labels.searchAria}</span><Icon name="search" /><input type="search" value={search} placeholder={labels.search} onChange={(event) => onSearchChange?.({ value: event.target.value })} /></label><div className="mh-feedback-page__filters"><label>{labels.type}<select value={type} onChange={(event) => onTypeChange?.({ value: event.target.value })}>{labels.typeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label>{labels.time}<select value={time} onChange={(event) => onTimeChange?.({ value: event.target.value })}>{labels.timeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div></div>
          <FeedbackList items={items} columns={labels.columns} labels={labels} onOpen={onOpen} />
        </section>
      </main>
    </div>
    <Modal open={Boolean(selected)} variant="drawer" className="mh-feedback-page__detail" eyebrow={labels.detailEyebrow} title={labels.detailTitle} closeLabel={labels.closeDetail} onClose={onClose}>
      {selected && <><div className="mh-feedback-page__detail-head"><div><span className={`mh-feedback-page__type mh-feedback-page__type--${selected.type}`}><Icon name={selected.type === "thumbs-up" ? "thumb-up" : "thumb-down"} />{selected.type === "thumbs-up" ? labels.up : labels.down}</span><small>{selected.time}</small></div><h2>{selected.question}</h2></div><section className="mh-feedback-page__detail-section"><h3>{labels.answer}</h3><div className="mh-feedback-page__detail-answer">{selected.answer}</div></section>{selected.reason ? <section className="mh-feedback-page__detail-section"><h3>{labels.downReason}</h3><div className="mh-feedback-page__detail-reason">{selected.reason}</div></section> : null}<dl className="mh-feedback-page__detail-meta"><div><dt>{labels.feedbackBy}</dt><dd>{selected.feedbackBy}</dd></div><div><dt>{labels.operationTime}</dt><dd>{selected.time}</dd></div></dl></>}
    </Modal>
    <AssistantLauncher ref={launcherRef} hidden={aiOpen} label={aiCopy.launcherLabel} onOpen={onAssistantOpen} />
    <AssistantPanel open={aiOpen} returnFocusRef={launcherRef} placement="drawer" variant="home" {...aiCopy} prompt={aiPrompt} answers={answers} selectedSkill={selectedSkill} onClose={onAssistantClose} onPromptChange={onPromptChange} onSubmit={onSubmit} onSuggestion={onSuggestion} onHistorySelect={onHistorySelect} onNewSession={onNewSession} onSelectSkill={onSelectSkill} onClearSkill={onClearSkill} onSkillAction={onSkillAction} onAttach={onAttach} onMaximize={onMaximize} onHistory={onHistory} />
    {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
  </div>;
}
