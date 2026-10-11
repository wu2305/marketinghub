import "../../../tokens.css";
import "./SummaryStrip.css";


/**
 * Horizontal execution-status strip (label / caption / value cells).
 * @param {object} props
 * @param {Array<{ label: string, caption?: string, value: React.ReactNode }>} [props.items=[]]
 * @param {string} [props.ariaLabel="Execution status"] accessible name of the strip
 */
export function SummaryStrip({ items = [], ariaLabel = "Execution status" }) {
  return (
    <div className="mh-summary" aria-label={ariaLabel}>
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
