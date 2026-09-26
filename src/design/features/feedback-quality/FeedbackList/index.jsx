import "../../../tokens.css";
import { Icon } from "../../../icons.jsx";
import "./FeedbackList.css";

const truncate = (value, limit) => value.length > limit ? `${value.slice(0, limit)}...` : value;

/**
 * Feedback table from feedback-quality.html, including every source-visible cell.
 * @param {object} props
 * @param {Array<{id:string,question:string,answer:string,type:"thumbs-up"|"thumbs-down",reason:string,feedbackBy:string,feedbackByInitials:string,time:string}>} props.items
 * @param {string[]} props.columns Seven source column headings.
 * @param {{up:string,down:string,reasonNone:string,view:string,emptyTitle:string,emptyDescription:string,itemsAria:string}} props.labels
 * @param {(event:{id:string})=>void} [props.onOpen]
 */
export function FeedbackList({ items = [], columns = [], labels, onOpen }) {
  return <>
    <div className="mh-feedback-list__head" aria-hidden="true">{columns.map((label) => <span key={label}>{label}</span>)}</div>
    {items.length ? <div className="mh-feedback-list" role="list" aria-label={labels.itemsAria}>
      {items.map((item) => <article className="mh-feedback-list__row" key={item.id} role="listitem" onClick={() => onOpen?.({ id: item.id })}>
        <div className="mh-feedback-list__question" data-label={columns[0]}><button type="button" onClick={(event) => { event.stopPropagation(); onOpen?.({ id: item.id }); }} title={item.question}>{truncate(item.question, 50)}</button></div>
        <div className="mh-feedback-list__answer" data-label={columns[1]}><span title={item.answer}>{truncate(item.answer, 60)}</span></div>
        <div data-label={columns[2]}><span className={`mh-feedback-list__badge mh-feedback-list__badge--${item.type}`}><Icon name={item.type === "thumbs-up" ? "thumb-up" : "thumb-down"} />{item.type === "thumbs-up" ? labels.up : labels.down}</span></div>
        <div className="mh-feedback-list__reason" data-label={columns[3]}>{item.reason ? <span title={item.reason}>{truncate(item.reason, 40)}</span> : <span className="mh-feedback-list__none">{labels.reasonNone}</span>}</div>
        <div className="mh-feedback-list__by" data-label={columns[4]}><span className="mh-feedback-list__avatar" aria-hidden="true">{item.feedbackByInitials}</span><span>{item.feedbackBy}</span></div>
        <div data-label={columns[5]}>{item.time}</div>
        <div data-label={columns[6]}><button className="mh-feedback-list__view" type="button" onClick={(event) => { event.stopPropagation(); onOpen?.({ id: item.id }); }}><Icon name="eye" />{labels.view}</button></div>
      </article>)}
    </div> : <div className="mh-feedback-list__empty"><strong>{labels.emptyTitle}</strong><span>{labels.emptyDescription}</span></div>}
  </>;
}
