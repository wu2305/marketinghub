import "../../tokens.css";
import { DataTable } from "../DataTable/index.jsx";
import { LibraryEmpty } from "../LibraryEmpty/index.jsx";
import { LibraryItem } from "../LibraryItem/index.jsx";
import "./LibraryList.css";

/** @type {readonly ["cards", "list", "table"]} */
export const libraryLayouts = ["cards", "list", "table"];

/**
 * The item region of a governed library (patterns/library.md §2). Owns every
 * layout — views never render the grid, the list or DataTable directly — and
 * shows `LibraryEmpty` when there is nothing to list. `cards` is a grid of
 * LibraryItems; `list` stacks them one per row for items whose body is long
 * text read in full (Principles); `table` is a DataTable.
 * @param {object} props
 * @param {string} props.label accessible name of the list
 * @param {typeof libraryLayouts[number]} [props.layout="cards"]
 * @param {Array<object>} [props.items=[]] cards/list: LibraryItem props, each with `id`
 * @param {Array<{ key: string, header: React.ReactNode }>} [props.columns=[]] table only
 * @param {Array<{ id: string, [key: string]: React.ReactNode }>} [props.rows=[]] table only
 * @param {{ kind?: "no-results"|"empty", title: string, message?: string, clearLabel?: string }} [props.empty] shown when there are no items/rows
 * @param {(event: { id: string }) => void} [props.onOpen]
 * @param {(event: { action: string, id: string, blocked: boolean, reason: string|null }) => void} [props.onAction] cards and list; table rows carry their own ItemActions
 * @param {(event: { kind: string }) => void} [props.onClear] clears filters from the no-results state
 */
export function LibraryList({ label, layout = "cards", items = [], columns = [], rows = [], empty, onOpen, onAction, onClear }) {
  const count = layout === "table" ? rows.length : items.length;
  if (count === 0 && empty) return <LibraryEmpty {...empty} onClear={onClear} />;
  if (layout === "table") {
    return (
      <section className="mh-library-list mh-library-list--table" aria-label={label}>
        <DataTable columns={columns} rows={rows} onOpen={onOpen} />
      </section>
    );
  }
  return (
    <ul className={`mh-library-list mh-library-list--${layout}`} aria-label={label}>
      {items.map((item) => (
        <li key={item.id}>
          <LibraryItem {...item} onOpen={onOpen} onAction={onAction} />
        </li>
      ))}
    </ul>
  );
}
