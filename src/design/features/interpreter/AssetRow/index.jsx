import "../../../tokens.css";
import { StatusBadge } from "../../../components/StatusBadge/index.jsx";
import { cx } from "../../../cx.js";
import "./AssetRow.css";


const STAGE_LABELS = { draft: "Draft", "under-review": "Under Review", queued: "Queued", building: "Building", published: "Published" };
const AVAILABILITY_LABELS = { enabled: "Enabled", disabled: "Disabled" };

/**
 * Single row in the generic knowledge list (transition component — the
 * per-type original views are card/table grids, see handover §2.3 P07).
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.summary]
 * @param {string} [props.badge] leading kind chip, e.g. "Synonym"
 * @param {string} [props.typeLabel]
 * @param {string} [props.owner]
 * @param {"draft"|"under-review"|"queued"|"building"|"published"} [props.stage] process stage
 * @param {"enabled"|"disabled"} [props.availability] AI availability
 * @param {boolean} [props.active=false]
 * @param {(event: { title: string }) => void} [props.onSelect]
 */
export function AssetRow({ title, summary, badge, typeLabel, owner, stage, availability, active = false, onSelect }) {
  return (
    <button className={cx("mh-asset", active && "is-active")} type="button" onClick={() => onSelect?.({ title })}>
      <span>
        <strong>
          {badge ? <span className="mh-asset__kind">{badge}</span> : null}
          {title}
        </strong>
        <small>{summary}</small>
      </span>
      <span>{typeLabel}</span>
      <span>{owner}</span>
      <StatusBadge status={stage}>{STAGE_LABELS[stage] || stage}</StatusBadge>
      <StatusBadge status={availability}>{AVAILABILITY_LABELS[availability] || availability}</StatusBadge>
    </button>
  );
}
