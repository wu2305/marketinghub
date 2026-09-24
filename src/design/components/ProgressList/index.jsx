import "../../tokens.css";
import "./ProgressList.css";


/**
 * Label / value / bar rows for distribution summaries.
 * @param {object} props
 * @param {Array<{ label: string, value: React.ReactNode, percent: number }>} [props.items=[]]
 */
export function ProgressList({ items = [] }) {
  return (
    <div className="mh-progress">
      {items.map((item) => (
        <div className="mh-progress__row" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <i className="mh-progress__track">
            <b className="mh-progress__bar" style={{ width: `${item.percent}%` }} />
          </i>
        </div>
      ))}
    </div>
  );
}
