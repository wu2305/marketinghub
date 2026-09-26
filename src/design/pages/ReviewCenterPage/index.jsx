import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { AssistantPanel } from "../../components/AssistantPanel/index.jsx";
import { ModelFlowDialog } from "../../components/ModelFlowDialog/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
import { ConfirmDialog } from "../../components/ConfirmDialog/index.jsx";
import { ReviewQueue } from "../../features/review-center/ReviewQueue/index.jsx";
import "./ReviewCenterPage.css";

export const reviewTabs = ["pending", "approved"];
export const reviewTypes = ["all", "Principles", "Report Context", "Data Model", "Metric Dictionary", "Business Term", "Analytical Model"];
export const reviewTimes = ["all", "today", "week", "month"];
export const reviewPanels = ["none", "detail", "reject", "risk"];

/**
 * Controlled Review Center page. All visible copy, records, filter state,
 * decision overlays and assistant state arrive through semantic props.
 * @param {object} props
 * @param {object} props.content Source-backed labels, hero, sidebar and suggestions.
 * @param {object} props.logo Header logo.
 * @param {object[]} props.navigation Primary navigation.
 * @param {string} props.image Hero image URL.
 * @param {object} props.filters Controlled tab/search/type/time and change callbacks.
 * @param {object} props.queue Filtered records, counts, open-detail and action callbacks.
 * @param {object} props.decision Selected item, panel, reason, suggestions and decision callbacks.
 * @param {object} props.assistant Lite assistant copy, state and callbacks.
 * @param {object|null} props.skillFlow Optional ModelFlowDialog state.
 * @param {(id:string,params?:object)=>string} props.hrefFor Route adapter.
 * @param {(event:{id:string,params:object,href:string,label:string})=>void} props.onNavigate
 */
export function ReviewCenterPage({ content, logo, navigation = [], image, filters = {}, queue = {}, decision = {}, assistant = {}, skillFlow, hrefFor, onNavigate }) {
  const { tab = "pending", search = "", type = "all", time = "all", onTabChange, onSearchChange, onTypeChange, onTimeChange } = filters;
  const { items: records = [], counts = {}, onOpenDetail, onReviewAction } = queue;
  const { selected, panel, reason = "", detailSuggestions = [], rejectSuggestions = [], onClose: onClosePanel, onReasonChange, onConfirmReject, onConfirmApprove } = decision;
  const launcherRef = React.useRef(null);
  const reasonRef = React.useRef(null);
  const labels = content.labels;
  const route = (item) => hrefFor?.(item.id, {}) || item.href;
  const follow = (event, item) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    onNavigate?.({ id: item.id, params: {}, href: route(item), label: item.label });
  };
  const action = (kind) => selected && onReviewAction?.({ id: selected.id, action: kind });
  const ai = assistant || {};
  const { open: aiOpen = false, prompt: aiPrompt = "", answers: aiAnswers = [], selectedSkill, onOpen: onAssistantOpen, onClose: onAssistantClose, onPromptChange, onSubmit, onSuggestion, onHistorySelect, onNewSession, onSelectSkill, onClearSkill, onSkillAction, onAttach, onMaximize, onHistory, ...aiCopy } = ai;
  return <div className="mh-review-page" data-review-tab={tab} data-review-panel={panel || "none"}>
    <Header logo={logo} items={navigation} current="interpreter" onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={image} eyebrow={content.hero.eyebrow} title={content.hero.title} description={content.hero.description} height={372} variant="home" scrim="none" asideLabel={labels.summaryAria}>
      <div className="mh-review-page__stats">{content.hero.stats.map((stat, index) => <article key={stat.label}><span>{stat.label}</span><strong>{counts[["pending", "approved", "rejected"][index]] ?? 0}</strong><small>{stat.caption}</small></article>)}</div>
    </Hero>
    <div className="mh-review-page__body">
      <aside className="mh-review-page__sidebar" aria-label={labels.navigationAria}><nav aria-label={labels.categoriesAria}>{content.sidebar.map((item) => <a key={item.id} href={route(item)} aria-current={item.id === "review-center" ? "page" : undefined} onClick={(event) => follow(event, item)}>{item.label}</a>)}</nav></aside>
      <main className="mh-review-page__main">
        <div className="mh-review-page__tabs" role="tablist" aria-label={labels.tabsAria}>{reviewTabs.map((value) => <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => onTabChange?.({ value })}>{labels.tabs[value]} <span>{counts[value] ?? 0}</span></button>)}</div>
        <section className="mh-review-page__library" aria-label={labels.itemsAria}>
          <div className="mh-review-page__toolbar"><label className="mh-review-page__search"><span className="mh-review-page__sr">{labels.searchAria}</span><input type="search" value={search} placeholder={labels.search} onChange={(event) => onSearchChange?.({ value: event.target.value })} /></label><div className="mh-review-page__filters"><strong>{records.length} {records.length === 1 ? labels.itemSingular : labels.itemPlural}</strong><label>{labels.type}<select value={type} onChange={(event) => onTypeChange?.({ value: event.target.value })}><option value="all">{labels.allTypes}</option>{labels.types.map((name) => <option key={name} value={name}>{name}</option>)}</select></label><label>{labels.submitted}<select value={time} onChange={(event) => onTimeChange?.({ value: event.target.value })}>{labels.timeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div></div>
          <ReviewQueue items={records} columns={labels.columns} labels={labels} onOpenDetail={onOpenDetail} onReviewAction={onReviewAction} />
        </section>
      </main>
    </div>
    <AssistantLauncher ref={launcherRef} hidden={aiOpen} label={aiCopy.launcherLabel} onOpen={onAssistantOpen} />
    <AssistantPanel open={aiOpen} returnFocusRef={launcherRef} placement="drawer" variant="lite" {...aiCopy} prompt={aiPrompt} answers={aiAnswers} selectedSkill={selectedSkill} onClose={onAssistantClose} onPromptChange={onPromptChange} onSubmit={onSubmit} onSuggestion={onSuggestion} onHistorySelect={onHistorySelect} onNewSession={onNewSession} onSelectSkill={onSelectSkill} onClearSkill={onClearSkill} onSkillAction={onSkillAction} onAttach={onAttach} onMaximize={onMaximize} onHistory={onHistory} />
    {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    <Modal open={panel === "detail" && Boolean(selected)} variant="drawer" className="mh-review-page__detail" eyebrow={labels.reviewItem} title={selected?.title} closeLabel={labels.closeDetail} onClose={onClosePanel}>
      {selected && <><div className="mh-review-page__detail-head"><span>{selected.type}</span><small>{selected.source}</small><h2>{selected.title}</h2><p>{selected.summary}</p></div><dl className="mh-review-page__meta"><div><dt>{labels.submittedBy}</dt><dd>{selected.submittedBy}</dd></div><div><dt>{labels.submitted}</dt><dd>{selected.submitted}</dd></div><div><dt>{labels.status}</dt><dd>{selected.status === "pending" ? labels.pending : labels.approved}</dd></div><div><dt>{labels.aiCheck}</dt><dd>{selected.aiCheck}</dd></div></dl>{selected.warning && <section className="mh-review-page__warning"><h3>{labels.warning}</h3><p>{selected.warning}</p></section>}{detailSuggestions.length > 0 && <section className="mh-review-page__suggestions"><h3>{labels.aiSuggestions}</h3><ul>{detailSuggestions.map((text) => <li key={text}>{text}</li>)}</ul></section>}<div className="mh-review-page__detail-actions">{selected.status === "pending" ? <><button type="button" onClick={() => action("approve")}>{labels.approve}</button><button type="button" onClick={() => action("reject")}>{labels.reject}</button></> : <button type="button" onClick={() => action("view")}>{labels.viewKnowledge}</button>}</div></>}
    </Modal>
    <Modal open={panel === "reject" && Boolean(selected)} variant="drawer" className="mh-review-page__reject" eyebrow={labels.rejectReview} title={`${labels.rejectPrefix} ${selected?.title || ""}`} closeLabel={labels.closeReject} initialFocus={reasonRef} onClose={onClosePanel} footer={<div className="mh-review-page__reject-actions"><button type="button" onClick={() => onClosePanel?.({ reason: "cancel" })}>{labels.cancel}</button><button type="button" onClick={onConfirmReject}>{labels.confirmReject}</button></div>}>
      <section className="mh-review-page__suggestions"><h3>{labels.aiSuggestion}</h3><ul>{rejectSuggestions.map((text) => <li key={text}>{text}</li>)}</ul></section><label className="mh-review-page__reason">{labels.rejectionReason}<textarea ref={reasonRef} rows="5" value={reason} placeholder={labels.rejectionPlaceholder} onChange={(event) => onReasonChange?.({ value: event.target.value })} /></label>
    </Modal>
    <ConfirmDialog open={panel === "risk" && Boolean(selected)} title={selected?.aiCheck === "Warning" ? labels.warningTitle : labels.reviewingTitle} message={selected?.aiCheck === "Warning" ? labels.warningMessage : labels.reviewingMessage} cancelLabel={labels.cancel} confirmLabel={labels.approveAnyway} onCancel={onClosePanel} onConfirm={onConfirmApprove} />
  </div>;
}
