import "../../../tokens.css";
import "./SummaryStrip.css";


/**
 * Horizontal execution-status strip (label / caption / value cells).
 * @param {object} props
 * @param {Array<{ label: string, caption?: string, value: React.ReactNode }>} [props.items=[]]
 */
export function SummaryStrip({ items = [] }) {
  return (
    <div className="mh-summary" aria-label="Execution status">
      {items.map((item) => (
        <div className="mh-summary__item" key={item.label}>
          <span>{item.label}</span>
          <small>{item.caption}</small>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
