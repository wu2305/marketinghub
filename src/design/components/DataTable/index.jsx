import "../../tokens.css";
import "./DataTable.css";


/**
 * Simple data table. `columns[].key` indexes into each row object;
 * `columns[].header` is the displayed heading.
 * @param {object} props
 * @param {Array<{ key: string, header: React.ReactNode }>} [props.columns=[]]
 * @param {Array<{ id?: string|number, [key: string]: React.ReactNode }>} [props.rows=[]]
 * @param {React.ReactNode} [props.caption] note under the table
 */
export function DataTable({ columns = [], rows = [], caption }) {
  return (
    <div className="mh-table-wrap">
      <table className="mh-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption ? <p className="mh-table__note">{caption}</p> : null}
    </div>
  );
}
