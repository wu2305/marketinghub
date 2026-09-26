import "../../../tokens.css";
import { SidebarItem } from "./SidebarItem.jsx";
import "./KnowledgeSidebar.css";


/**
 * AI Interpreter sidebar: brand, overview entry, and the 8-type navigation.
 * @param {object} props
 * @param {string} [props.brand="AI Interpreter"]
 * @param {{ id: string, label: string, icon?: string }} [props.overview]
 * @param {string} [props.title] group label, e.g. "Knowledge · 8 types"
 * @param {Array<{ id: string, title: string, icon?: string, manageable?: boolean, stats?: { total: number }, navCount?: number }>} [props.types=[]]
 *   `navCount` feeds the "label · count" tooltip; the count chip itself is
 *   display:none in the original (`.sidebar-type-count` under
 *   `[data-active-type]`), so it never renders visibly.
 * @param {string} [props.activeId] id of the selected type or "overview"
 * @param {string} [props.overviewHref] true Overview navigation target
 * @param {(event: { id: string, label: string }) => void} [props.onSelect]
 */
export function KnowledgeSidebar({ brand = "AI Interpreter", overview, overviewHref, title, types = [], activeId, onSelect }) {
  return (
    <aside className="mh-sidebar" aria-label="Knowledge navigation">
      <div className="mh-sidebar__brand">{brand}</div>
      {overview ? (
        <SidebarItem {...overview} href={overviewHref} active={overview.id === activeId} onSelect={() => onSelect?.({ id: overview.id, label: overview.label })} />
      ) : null}
      {types.length ? (
        <div className="mh-sidebar__group">
          {title ? <div className="mh-sidebar__title">{title}</div> : null}
          {types.map((type) => (
            <SidebarItem
              key={type.id}
              label={type.title}
              icon={type.icon}
              badge={type.manageable ? "Manage" : undefined}
              count={type.navCount ?? type.stats?.total}
              active={type.id === activeId}
              onSelect={() => onSelect?.({ id: type.id, label: type.title })}
            />
          ))}
        </div>
      ) : null}
    </aside>
  );
}
