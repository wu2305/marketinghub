import "../../../tokens.css";
import { assetUrl } from "../../../asset-url.js";
import { cx } from "../../../cx.js";
import "./TypeCard.css";


const ART = [1, 2, 3, 4, 5, 6, 7, 8].map((index) => `url("${assetUrl(`assets/images/knowledge-card-icons/layer-${index}.png`)}")`);

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
 * @param {boolean} [props.active=false]
 * @param {(event: { title: string }) => void} [props.onSelect]
 */
export function TypeCard({ title, count, summary, action, manageable = false, art = 0, active = false, onSelect }) {
  return (
    <button
      className={cx("mh-type-card", manageable ? "is-manageable" : "is-read-only", active && "is-active")}
      type="button"
      style={{ "--mh-art": ART[art] || ART[0] }}
      onClick={() => onSelect?.({ title })}
    >
      <span className="mh-type-card__heading">
        <strong>{title}</strong>
        <span className="mh-type-card__count">{count}</span>
      </span>
      <small>{summary}</small>
      <em>{action} →</em>
    </button>
  );
}
