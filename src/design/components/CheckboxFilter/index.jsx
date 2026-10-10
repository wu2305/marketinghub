import { useId } from "react";
import "../../tokens.css";
import "./CheckboxFilter.css";


/**
 * Multi-select dropdown filter — a field label plus a `<details>`/`<summary>`
 * disclosure holding checkbox options. Mirrors the shared
 * `.business-filter-field` / `.fm-options` control used for status, data-model
 * and category filters in the original knowledge libraries.
 * @param {object} props
 * @param {boolean} [props.single=false] use a single-choice radio menu
 * @param {string} [props.ariaLabel] accessible name for the dropdown trigger
 * @param {string} props.label field label, e.g. "Category"
 * @param {string} [props.allLabel="All"] summary when nothing is selected
 * @param {string} [props.selectedLabel="{count} selected"] summary template once options are
 *   checked; `{count}` substitutes the selection size and `{labels}` the joined
 *   selected option labels (the fm libraries' "Enabled, 4P" style summary)
 * @param {Array<{ id: string, label: string }>} [props.options=[]]
 * @param {Array<string>} [props.selected=[]] checked option ids
 * @param {(event: { id: string, checked: boolean }) => void} [props.onToggle]
 */
export function CheckboxFilter({ label, allLabel = "All", selectedLabel = "{count} selected", options = [], selected = [], onToggle, single = false, ariaLabel }) {
  const groupName = useId();
  const selectedNames = options.filter((option) => selected.includes(option.id)).map((option) => option.label).join(", ");
  const summary = selected.length
    ? selectedLabel
        .replace("{count}", String(selected.length))
        .replace("{labels}", selected.length > 1 ? `${selected.length} selected` : selectedNames)
    : allLabel;
  return (
    <div className="mh-check-filter">
      <span className="mh-check-filter__label">{label}</span>
      <details className="mh-check-filter__details">
        <summary className="mh-check-filter__summary" aria-label={ariaLabel}>
          <b title={selectedNames || allLabel}>{summary}</b>
        </summary>
        <div className="mh-check-filter__options">
          {options.map((option) => (
            <label key={option.id} className="mh-check-filter__option">
              <input
                type={single ? "radio" : "checkbox"}
                name={single ? groupName : undefined}
                checked={selected.includes(option.id)}
                onChange={(event) => {
                  onToggle?.({ id: option.id, checked: event.target.checked });
                  if (single) event.currentTarget.closest("details").open = false;
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
