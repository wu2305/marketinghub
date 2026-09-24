import "../../../tokens.css";
import { AssetRow } from "../../../features/interpreter/AssetRow/index.jsx";
import { LibraryToolbar } from "../../../features/interpreter/LibraryToolbar/index.jsx";
import "./KnowledgeLibrary.css";


/**
 * Generic knowledge list (transition component for the eight type views).
 * `type` drives the toolbar filters and the create entry; `manageable` types
 * get the create button, read-only types do not.
 * @param {object} props
 * @param {{ id: string, title: string, manageable?: boolean, createLabel?: string, statusFilters?: Array<object> }} props.type
 * @param {string} [props.query]
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {Object<string, string>} [props.filterValues={}]
 * @param {(event: { id: string, value: string }) => void} [props.onFilterChange]
 * @param {Array<object>} [props.rows=[]] AssetRow props plus id/typeLabel
 * @param {(event: { typeId: string, title: string }) => void} [props.onCreate]
 * @param {(row: object) => void} [props.onSelect]
 * @param {string} [props.emptyTitle="No knowledge assets"]
 * @param {string} [props.emptyMessage]
 */
export function KnowledgeLibrary({ type, query, onQueryChange, filterValues = {}, onFilterChange, rows = [], onCreate, onSelect, emptyTitle = "No knowledge assets", emptyMessage }) {
  const createLabel = type?.manageable ? type.createLabel || `Create ${type.title}` : undefined;
  return (
    <section className="mh-library" aria-label="Knowledge library">
      <LibraryToolbar
        query={query}
        filters={type?.statusFilters || []}
        filterValues={filterValues}
        onQueryChange={onQueryChange}
        onFilterChange={onFilterChange}
        createLabel={createLabel}
        onCreate={type ? () => onCreate?.({ typeId: type.id, title: type.title }) : undefined}
      />
      <div className="mh-asset-head">
        <span>Knowledge Title</span>
        <span>Type</span>
        <span>Creator</span>
        <span>Process</span>
        <span>AI Status</span>
      </div>
      {rows.length ? (
        rows.map((row) => (
          <AssetRow
            key={row.id}
            {...row}
            typeLabel={row.typeLabel ?? type?.title}
            onSelect={() => onSelect?.(row)}
          />
        ))
      ) : (
        <div className="mh-empty" role="status">
          <strong>{emptyTitle}</strong>
          <p>{emptyMessage || "No records match the current filters."}</p>
        </div>
      )}
    </section>
  );
}
