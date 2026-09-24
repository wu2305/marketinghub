import "../../../tokens.css";
import { Button } from "../../../components/Button/index.jsx";
import { SearchField } from "../../../components/SearchField/index.jsx";
import "../../../components/Select/Select.css";
import "./LibraryToolbar.css";


/**
 * Toolbar above the knowledge list: per-type filters, search, create action.
 * @param {object} props
 * @param {string} [props.query]
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {Array<{ id: string, label: string, allLabel?: string, options?: Array<{ id: string, label: string }> }>} [props.filters=[]]
 * @param {Object<string, string>} [props.filterValues={}] selected option id per filter id
 * @param {(event: { id: string, value: string }) => void} [props.onFilterChange]
 * @param {string} [props.createLabel] when omitted the create button is not rendered
 * @param {() => void} [props.onCreate]
 * @param {React.Ref} [props.searchRef] forwarded to the search input ("/" shortcut)
 */
export function LibraryToolbar({ query, onQueryChange, filters = [], filterValues = {}, onFilterChange, createLabel, onCreate, searchRef }) {
  return (
    <div className="mh-toolbar">
      <div className="mh-toolbar__filters">
        {filters.map((filter) => (
          <label className="mh-filter" key={filter.id}>
            {filter.label}
            <select
              className="mh-select mh-select--sm"
              value={filterValues[filter.id] || ""}
              aria-label={filter.label}
              onChange={(event) => onFilterChange?.({ id: filter.id, value: event.target.value })}
            >
              <option value="">{filter.allLabel || "All"}</option>
              {(filter.options || []).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="mh-toolbar__actions">
        <div style={{ width: 280 }}>
          <SearchField label="Search knowledge" value={query} placeholder="Search knowledge..." size="sm" inputRef={searchRef} onChange={onQueryChange} />
        </div>
        {createLabel ? (
          <Button variant="gold" size="lg" icon="plus" onClick={onCreate}>
            {createLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
