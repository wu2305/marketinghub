import "../../../tokens.css";
import { cx } from "../../../cx.js";
import "./CampaignRail.css";


/**
 * RedNote Campaign Tool left rail: numbered view navigation.
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {Array<{ id: string, label: string, index: string, caption?: string }>} [props.items=[]]
 * @param {string} [props.current] active item id
 * @param {(event: { id: string, label: string }) => void} [props.onSelect]
 */
export function CampaignRail({ eyebrow, title, description, items = [], current, onSelect }) {
  return (
    <aside className="mh-rail" aria-label="RedNote Campaign Tool navigation">
      <header className="mh-rail__head">
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        <span>{description}</span>
      </header>
      <nav className="mh-rail__nav" aria-label="Trading Desk views">
        {items.map((item) => (
          <button
            key={item.id}
            className={cx("mh-rail__item", item.id === current && "is-active")}
            type="button"
            aria-current={item.id === current ? "page" : undefined}
            onClick={() => onSelect?.({ id: item.id, label: item.label })}
          >
            <span className="mh-rail__index">{item.index}</span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.caption}</small>
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
