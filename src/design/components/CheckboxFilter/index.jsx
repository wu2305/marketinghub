import "../../tokens.css";
import "./CheckboxFilter.css";


/**
 * Multi-select dropdown filter — a field label plus a `<details>`/`<summary>`
 * disclosure holding checkbox options. Mirrors the shared
 * `.business-filter-field` / `.fm-options` control used for status, data-model
 * and category filters in the original knowledge libraries.
 * @param {object} props
 * @param {string} props.label field label, e.g. "Category"
 * @param {string} [props.allLabel="All"] summary when nothing is selected
 * @param {string} [props.selectedLabel="{count} selected"] summary template once options are checked
 * @param {Array<{ id: string, label: string }>} [props.options=[]]
 * @param {Array<string>} [props.selected=[]] checked option ids
 * @param {(event: { id: string, checked: boolean }) => void} [props.onToggle]
 */
export function CheckboxFilter({ label, allLabel = "All", selectedLabel = "{count} selected", options = [], selected = [], onToggle }) {
  const summary = selected.length ? selectedLabel.replace("{count}", String(selected.length)) : allLabel;
  return (
    <div className="mh-check-filter">
      <span className="mh-check-filter__label">{label}</span>
      <details className="mh-check-filter__details">
        <summary className="mh-check-filter__summary">
          <b>{summary}</b>
        </summary>
        <div className="mh-check-filter__options">
          {options.map((option) => (
            <label key={option.id} className="mh-check-filter__option">
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={(event) => onToggle?.({ id: option.id, checked: event.target.checked })}
              />
              {option.label}
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
