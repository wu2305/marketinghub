import "../../tokens.css";
import { cx } from "../../cx.js";
import "./ChipList.css";

/** @type {readonly ["neutral", "accent", "success"]} */
export const chipListTones = ["neutral", "accent", "success"];

/**
 * A labelled row of short values (synonyms, referenced metrics, recipients,
 * data models) inside a library card or drawer (patterns/library.md §2).
 * Shows the first `max` values and counts the rest in a "+N" chip whose
 * accessible name lists them (dispositions D07).
 * @param {object} props
 * @param {boolean} [props.singleLine=false] one non-wrapping row with ellipsis inside each pill // 单行排列，每个胶囊内部可省略
 * @param {string} [props.label] row label; omit in drawers where a heading already names it
 * @param {Array<string>} [props.values=[]]
 * @param {number} [props.max=3] values shown before the "+N" chip; `Infinity` shows all
 * @param {string} [props.moreLabel="More"] accessible prefix of the "+N" chip
 * @param {typeof chipListTones[number]} [props.tone="neutral"]
 * @param {string} [props.emptyLabel="—"] shown when there are no values
 */
export function ChipList({ singleLine = false, label, values = [], max = 3, moreLabel = "More", tone = "neutral", emptyLabel = "—" }) {
  const shown = values.slice(0, max);
  const hidden = values.slice(shown.length);
  return (
    <div className={cx("mh-chip-list", `mh-chip-list--${tone}`, singleLine && "mh-chip-list--single-line")}>
      {label ? <span className="mh-chip-list__label">{label}</span> : null}
      {values.length ? (
        <ul>
          {shown.map((value) => <li key={value} title={value}>{value}</li>)}
          {hidden.length ? (
            <li className="mh-chip-list__more" aria-label={`${moreLabel}: ${hidden.join(", ")}`} title={hidden.join(", ")}>+{hidden.length}</li>
          ) : null}
        </ul>
      ) : (
        <span className="mh-chip-list__empty">{emptyLabel}</span>
      )}
    </div>
  );
}
