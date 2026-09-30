import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
import { ConfirmDialog } from "../../components/ConfirmDialog/index.jsx";
import { GovernanceNav } from "../../components/GovernanceNav/index.jsx";
import { Button } from "../../components/Button/index.jsx";
import { LibraryList } from "../../components/LibraryList/index.jsx";
import { LibraryToolbar } from "../../components/LibraryToolbar/index.jsx";
import { StatusBadge } from "../../components/StatusBadge/index.jsx";
import { Toast } from "../../components/Toast/index.jsx";
import "./ReviewCenterPage.css";

/** @type {readonly ["pending", "approved", "rejected"]} */
export const reviewTabs = ["pending", "approved", "rejected"];
/**
 * @type {readonly [
 *   "all",
 *   "Principles",
 *   "Report Context",
 *   "Data Model",
 *   "Metric Dictionary",
 *   "Business Term",
 *   "Analytical Model"
 * ]}
 */
export const reviewTypes = ["all", "Principles", "Report Context", "Data Model", "Metric Dictionary", "Business Term", "Analytical Model"];
/** @type {readonly ["all", "today", "week", "month"]} */
export const reviewTimes = ["all", "today", "week", "month"];
/** @type {readonly ["none", "detail", "reject", "risk"]} */
export const reviewPanels = ["none", "detail", "reject", "risk"];

const STATUS_TONES = { pending: "warning", approved: "success", rejected: "danger" };
const AI_TONES = { Pass: "success", Warning: "warning", Reviewing: "warning" };
const COLUMN_KEYS = ["title", "type", "submittedBy", "submitted", "status", "aiCheck", "actions"];

/**
 * Controlled Review Center page. All visible copy, records, filter state,
 * decision overlays and assistant state arrive through semantic props.
 * @param {object} props
 * @param {object} props.content Source-backed labels, hero, sidebar and suggestions; hero stats carry a `key` matching queue counts.
 * @param {object} props.logo Header logo.
 * @param {object[]} [props.navigation=[]] Primary navigation.
 * @param {string} props.image Hero image URL.
 * @param {object} [props.filters={}] Controlled tab/search/type/time, change callbacks and `onClear` (no-results state).
 * @param {object} [props.queue={}] Filtered records, counts, open-detail and action callbacks.
 * @param {object} [props.decision={}] Selected item, panel, reason, suggestions and decision callbacks.
 * @param {(event:{id:string,reason:string})=>void} [props.decision.onConfirmReject] Reject request with named fields.
 * @param {object} [props.assistant={}] Lite assistant copy, state and callbacks.
 * @param {object|null} props.skillFlow Optional ModelFlowDialog state.
 * @param {string} [props.toast=""] success message after approve/reject (hidden when empty)
 * @param {(id:string,params?: Record<string,string>)=>string} props.hrefFor Route adapter.
 * @param {(event:{id:string,params: Record<string,string>,href:string,label:string})=>void} props.onNavigate
 */
export function ReviewCenterPage({ content, logo, navigation = [], image, filters = {}, queue = {}, decision = {}, assistant = {}, skillFlow, toast = "", hrefFor, onNavigate }) {
  const { tab = "pending", search = "", type = "all", time = "all", onTabChange, onSearchChange, onTypeChange, onTimeChange, onClear } = filters;
  const { items: records = [], counts = {}, onOpenDetail, onReviewAction } = queue;
  const { selected, panel, reason = "", detailSuggestions = [], rejectSuggestions = [], onClose: onClosePanel, onReasonChange, onConfirmReject, onConfirmApprove } = decision;
  const reasonRef = React.useRef(null);
  const labels = content.labels;
  const action = (kind) => selected && onReviewAction?.({ id: selected.id, action: kind });
  const statusBadge = (item) => <StatusBadge status={item.status} tone={STATUS_TONES[item.status]}>{labels[item.status]}</StatusBadge>;
  const rows = records.map((item) => ({
    id: item.id,
    title: <span className="mh-review-page__title"><strong>{item.title}</strong>{item.restored ? <StatusBadge status="restore" tone="warning">{labels.restore}</StatusBadge> : null}<small>{item.summary}</small></span>,
    type: item.type,
    submittedBy: item.submittedBy,
    submitted: item.submitted,
    status: statusBadge(item),
    aiCheck: <StatusBadge status={String(item.aiCheck).toLowerCase()} tone={AI_TONES[item.aiCheck] || "neutral"}>{item.aiCheck}</StatusBadge>,
    actions: <span className="mh-review-page__row-actions">{item.status === "pending"
      ? <><Button variant="gold" size="sm" icon="check-circle" label={`${labels.approve} ${item.title}`} onClick={() => onReviewAction?.({ id: item.id, action: "approve" })}>{labels.approve}</Button><Button variant="danger" size="sm" icon="close" label={`${labels.reject} ${item.title}`} onClick={() => onReviewAction?.({ id: item.id, action: "reject" })}>{labels.reject}</Button></>
      : <Button variant="secondary" size="sm" icon="eye" label={`${labels.view} ${item.title}`} onClick={() => onReviewAction?.({ id: item.id, action: "view" })}>{labels.view}</Button>}</span>,
  }));
  const single = (value) => (value === "all" ? "" : value);
  return <div className="mh-review-page" data-review-tab={tab} data-review-panel={panel || "none"}>
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={image} eyebrow={content.hero.eyebrow} title={content.hero.title} description={content.hero.description} height={372} variant="home" scrim="none" asideLabel={labels.summaryAria}>
      <div className="mh-review-page__stats">{content.hero.stats.map((stat) => <MetricStat key={stat.key} label={stat.label} value={counts[stat.key] ?? 0} caption={stat.caption} variant="glass" />)}</div>
    </Hero>
    <div className="mh-review-page__body">
      <GovernanceNav items={content.sidebar} current="review-center" navigationAria={labels.navigationAria} categoriesAria={labels.categoriesAria} hrefFor={hrefFor} onNavigate={onNavigate} />
      <main className="mh-review-page__main">
        <LibraryToolbar
          tabs={{ label: labels.tabsAria, value: tab, items: reviewTabs.map((value) => ({ id: value, label: `${labels.tabs[value]} ${counts[value] ?? 0}` })) }}
          search={{ label: labels.searchAria, placeholder: labels.search, value: search }}
          facets={[
            { id: "type", label: labels.type, kind: "single", allLabel: labels.allTypes, options: labels.types.map((name) => ({ id: name, label: name })), selected: single(type) },
            { id: "time", label: labels.submitted, kind: "single", allLabel: labels.timeOptions.find((option) => option.value === "all")?.label, options: labels.timeOptions.filter((option) => option.value !== "all").map((option) => ({ id: option.value, label: option.label })), selected: single(time) },
          ]}
          count={`${records.length} ${records.length === 1 ? labels.itemSingular : labels.itemPlural}`}
          onChange={({ field, value }) => {
            if (field === "tab") onTabChange?.({ value });
            else if (field === "search") onSearchChange?.({ value });
            else if (field === "type") onTypeChange?.({ value: value || "all" });
            else if (field === "time") onTimeChange?.({ value: value || "all" });
          }}
        />
        <LibraryList
          label={labels.itemsAria}
          layout="table"
          columns={COLUMN_KEYS.map((key, index) => ({ key, header: labels.columns[index] }))}
          rows={rows}
          empty={{ kind: "no-results", title: labels.emptyTitle, message: labels.emptyDescription, clearLabel: labels.clearFilters }}
          onOpen={onOpenDetail}
          onClear={onClear}
        />
      </main>
    </div>
    <AssistantDock assistant={assistant} skillFlow={skillFlow} variant="lite" />
    <Modal open={panel === "detail" && Boolean(selected)} variant="drawer" className="mh-review-page__detail" eyebrow={labels.reviewItem} title={selected?.title} closeLabel={labels.closeDetail} onClose={onClosePanel}>
      {selected && <><div className="mh-review-page__detail-head"><span>{selected.type}</span><small>{selected.source}</small><h2>{selected.title}</h2><p>{selected.summary}</p></div><dl className="mh-review-page__meta"><div><dt>{labels.submittedBy}</dt><dd>{selected.submittedBy}</dd></div><div><dt>{labels.submitted}</dt><dd>{selected.submitted}</dd></div><div><dt>{labels.status}</dt><dd>{labels[selected.status]}</dd></div><div><dt>{labels.aiCheck}</dt><dd>{selected.aiCheck}</dd></div></dl>{selected.warning && <section className="mh-review-page__warning"><h3>{labels.warning}</h3><p>{selected.warning}</p></section>}{detailSuggestions.length > 0 && <section className="mh-review-page__suggestions"><h3>{labels.aiSuggestions}</h3><ul>{detailSuggestions.map((text) => <li key={text}>{text}</li>)}</ul></section>}{selected.rejectionReason ? <section className="mh-review-page__suggestions"><h3>{labels.rejectionReason}</h3><p>{selected.rejectionReason}</p></section> : null}{selected.status === "rejected" ? null : <div className="mh-review-page__detail-actions">{selected.status === "pending" ? <><Button variant="gold" icon="check-circle" onClick={() => action("approve")}>{labels.approve}</Button><Button variant="danger" icon="close" onClick={() => action("reject")}>{labels.reject}</Button></> : <Button variant="secondary" onClick={() => action("view")}>{labels.viewKnowledge}</Button>}</div>}</>}
    </Modal>
    <Modal open={panel === "reject" && Boolean(selected)} variant="drawer" className="mh-review-page__reject" eyebrow={labels.rejectReview} title={`${labels.rejectPrefix} ${selected?.title || ""}`} closeLabel={labels.closeReject} initialFocus={reasonRef} onClose={onClosePanel} footer={<div className="mh-review-page__reject-actions"><Button variant="secondary" onClick={() => onClosePanel?.({ reason: "cancel" })}>{labels.cancel}</Button><Button onClick={() => selected && onConfirmReject?.({ id: selected.id, reason })}>{labels.confirmReject}</Button></div>}>
      <section className="mh-review-page__suggestions"><h3>{labels.aiSuggestion}</h3><ul>{rejectSuggestions.map((text) => <li key={text}>{text}</li>)}</ul></section><label className="mh-review-page__reason">{labels.rejectionReason}<textarea ref={reasonRef} rows="5" value={reason} placeholder={labels.rejectionPlaceholder} onChange={(event) => onReasonChange?.({ value: event.target.value })} /></label>
    </Modal>
    <Toast open={Boolean(toast)} message={toast} />
    <ConfirmDialog open={panel === "risk" && Boolean(selected)} purpose="warning" title={selected?.aiCheck === "Warning" ? labels.warningTitle : labels.reviewingTitle} message={selected?.aiCheck === "Warning" ? labels.warningMessage : labels.reviewingMessage} cancelLabel={labels.cancel} confirmLabel={labels.approveAnyway} onCancel={onClosePanel} onConfirm={onConfirmApprove} />
  </div>;
}
