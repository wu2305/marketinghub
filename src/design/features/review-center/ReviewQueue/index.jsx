import "../../../tokens.css";
import "./ReviewQueue.css";

/**
 * Review-only seven-column asset queue with independent title and action buttons.
 * @param {object} props
 * @param {Array<{id:string,title:string,summary:string,status:string,aiCheck:string,restored?:boolean}>} props.items Filtered review records; `restored` controls the badge.
 * @param {string[]} props.columns Visible headings.
 * @param {object} props.labels Action and empty-state copy.
 * @param {(event:{id:string}) => void} props.onOpenDetail
 * @param {(event:{id:string,action:"approve"|"reject"|"view"}) => void} props.onReviewAction
 */
export function ReviewQueue({ items = [], columns = [], labels = {}, onOpenDetail, onReviewAction }) {
  return <div className="mh-review-queue">
    <div className="mh-review-queue__head" aria-hidden="true">{columns.map((column) => <span key={column}>{column}</span>)}</div>
    {items.length ? <div className="mh-review-queue__list" role="list" aria-label={labels.itemsAria}>
      {items.map((item) => <div key={item.id} className={`mh-review-queue__row${item.restored ? " mh-review-queue__row--restore" : ""}`} role="listitem" data-review-id={item.id} onClick={(event) => { if (!event.target.closest("button")) onOpenDetail?.({ id: item.id }); }}>
        <div className="mh-review-queue__title"><button type="button" onClick={() => onOpenDetail?.({ id: item.id })}>{item.title}</button>{item.restored ? <b>{labels.restore}</b> : null}<small>{item.summary}</small></div>
        <span className="mh-review-queue__type">{item.type}</span>
        <span>{item.submittedBy}</span><span className="mh-review-queue__submitted">{item.submitted}</span>
        <span><em className={`mh-review-queue__badge mh-review-queue__badge--${item.status}`}>{item.status === "pending" ? labels.pending : labels.approved}</em></span>
        <span><em className={`mh-review-queue__badge mh-review-queue__badge--${String(item.aiCheck).toLowerCase()}`}>{item.aiCheck}</em></span>
        <span className="mh-review-queue__actions">{item.status === "pending" ? <><button type="button" className="mh-review-queue__approve" onClick={() => onReviewAction?.({ id: item.id, action: "approve" })}><span aria-hidden="true">✓</span> {labels.approve}</button><button type="button" className="mh-review-queue__reject" onClick={() => onReviewAction?.({ id: item.id, action: "reject" })}><span aria-hidden="true">×</span> {labels.reject}</button></> : <button type="button" className="mh-review-queue__view" onClick={() => onReviewAction?.({ id: item.id, action: "view" })}>{labels.view}</button>}</span>
      </div>)}
    </div> : <div className="mh-review-queue__empty"><strong>{labels.emptyTitle}</strong><span>{labels.emptyDescription}</span></div>}
  </div>;
}
