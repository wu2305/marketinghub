import "../../tokens.css";
import { cx } from "../../cx.js";
import "./DataTable.css";

const cellLabel = (column) => (typeof column.header === "string" ? column.header : column.key);

/**
 * Data table. `columns[].key` indexes into each row object; `columns[].header`
 * is the displayed heading. Below 760px each row stacks as a labelled block.
 * @param {object} props
 * @param {Array<{ key: string, header: React.ReactNode }>} [props.columns=[]]
 * @param {Array<{ id?: string|number, [key: string]: React.ReactNode }>} [props.rows=[]]
 * @param {React.ReactNode} [props.caption] note under the table
 * @param {React.ReactNode} [props.emptyState] shown in place of the rows when `rows` is empty
 * @param {(event: { id: string|number }) => void} [props.onOpen] makes rows openable: the first
 *   cell becomes a button, and a click anywhere on the row outside other controls opens it
 */
export function DataTable({ columns = [], rows = [], caption, emptyState, onOpen }) {
  return (
    <div className="mh-table-wrap">
      <table className={cx("mh-table", onOpen && "mh-table--openable")}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && emptyState ? (
            <tr className="mh-table__empty-row">
              <td className="mh-table__empty" colSpan={Math.max(columns.length, 1)}>{emptyState}</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={row.id ?? index}
                onClick={onOpen ? (event) => {
                  if (event.target.closest("a, button, input, select, textarea, label")) return;
                  onOpen({ id: row.id });
                } : undefined}
              >
                {columns.map((column, columnIndex) => (
                  <td key={column.key} data-label={cellLabel(column)}>
                    {onOpen && columnIndex === 0 ? (
                      <button type="button" className="mh-table__open" onClick={() => onOpen({ id: row.id })}>
                        {row[column.key]}
                      </button>
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {caption ? <p className="mh-table__note">{caption}</p> : null}
    </div>
  );
}
