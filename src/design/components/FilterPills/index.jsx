import "../../tokens.css";
import { cx } from "../../cx.js";
import "./FilterPills.css";


/**
 * Single-select pill filter group.
 * @param {object} props
 * @param {string} [props.label="Filters"] group aria-label
 * @param {Array<{ id: string, label: string }>} [props.items=[]]
 * @param {string} [props.value] id of the active pill
 * @param {(event: { id: string, label: string }) => void} [props.onChange]
 */
export function FilterPills({ label = "Filters", items = [], value, onChange }) {
  return (
    <div className="mh-pills" role="group" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          className={cx("mh-pills__item", item.id === value && "is-active")}
          type="button"
          aria-pressed={item.id === value}
          onClick={() => onChange?.({ id: item.id, label: item.label })}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
