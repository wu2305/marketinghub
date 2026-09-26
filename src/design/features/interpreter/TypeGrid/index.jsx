import "../../../tokens.css";
import { TypeCard } from "../../../features/interpreter/TypeCard/index.jsx";
import "./TypeGrid.css";


// Mirrors types.js overviewCountLabel: "<total> <singular|plural unit>".
function formatTypeCount(stats) {
  if (!stats) return undefined;
  const { units, total } = stats;
  return `${total} ${total === 1 ? units[0] : units[1]}`;
}

/**
 * Overview grid of TypeCard for the eight knowledge types.
 * @param {object} props
 * @param {Array<object>} [props.items=[]] type entries (id, title, summary, action, manageable, stats)
 * @param {string} [props.activeId]
 * @param {(event: { id: string, title: string }) => void} [props.onSelect]
 */
export function TypeGrid({ items = [], activeId, onSelect }) {
  return (
    <div className="mh-type-grid">
      {items.map((item, index) => (
        <TypeCard
          key={item.id}
          title={item.title}
          count={item.count ?? formatTypeCount(item.stats)}
          summary={item.summary}
          action={item.action}
          manageable={item.manageable}
          art={item.art ?? index}
          image={item.image}
          active={item.id === activeId}
          onSelect={() => onSelect?.({ id: item.id, title: item.title })}
        />
      ))}
    </div>
  );
}
