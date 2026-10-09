import "../../../tokens.css";
import art1 from "../../../assets/images/knowledge-card-icons/layer-1.png";
import art2 from "../../../assets/images/knowledge-card-icons/layer-2.png";
import art3 from "../../../assets/images/knowledge-card-icons/layer-3.png";
import art4 from "../../../assets/images/knowledge-card-icons/layer-4.png";
import art5 from "../../../assets/images/knowledge-card-icons/layer-5.png";
import art6 from "../../../assets/images/knowledge-card-icons/layer-6.png";
import art7 from "../../../assets/images/knowledge-card-icons/layer-7.png";
import art8 from "../../../assets/images/knowledge-card-icons/layer-8.png";
import { cx } from "../../../cx.js";
import "./TypeCard.css";


const ART = [art1, art2, art3, art4, art5, art6, art7, art8];

/**
 * Knowledge-type card in the overview grid. `manageable` flips read-only vs
 * manage styling; `art` picks one of 8 baked background images (0–7).
 * @param {object} props
 * @param {string} props.title
 * @param {React.ReactNode} props.count preformatted count label, e.g. "10 principles"
 * @param {string} props.summary
 * @param {string} props.action action line, e.g. "Manage terms"
 * @param {boolean} [props.manageable=false]
 * @param {number} [props.art=0]
 * @param {string} [props.image] custom background URL; defaults to the selected bundled art
 * @param {boolean} [props.active=false]
 * @param {(event: { title: string }) => void} [props.onSelect]
 */
export function TypeCard({ title, count, summary, action, manageable = false, art = 0, image, active = false, onSelect }) {
  return (
    <button
      className={cx("mh-type-card", manageable ? "is-manageable" : "is-read-only", active && "is-active")}
      type="button"
      style={{ "--mh-art": `url("${image || ART[art] || ART[0]}")` }}
      onClick={() => onSelect?.({ title })}
    >
      <span className="mh-type-card__heading">
        <strong title={title}>{title}</strong>
        <span className="mh-type-card__count">{count}</span>
      </span>
      <small>{summary}</small>
      <em>{action} →</em>
    </button>
  );
}
