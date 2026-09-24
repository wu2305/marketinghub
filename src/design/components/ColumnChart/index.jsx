import "../../tokens.css";
import "./ColumnChart.css";


/**
 * CSS-only column chart; `height` is a 0–100 percentage.
 * @param {object} props
 * @param {string} [props.label="Chart"] aria-label
 * @param {Array<{ label: string, value: React.ReactNode, height: number }>} [props.items=[]]
 */
export function ColumnChart({ label = "Chart", items = [] }) {
  return (
    <div className="mh-columns" aria-label={label}>
      {items.map((item) => (
        <div className="mh-columns__item" key={item.label} style={{ "--mh-column": `${item.height}%` }}>
          <strong>{item.value}</strong>
          <i />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
