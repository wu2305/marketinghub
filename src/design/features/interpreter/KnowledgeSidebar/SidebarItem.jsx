import "../../../tokens.css";
import { cx } from "../../../cx.js";
import { Icon } from "../../../icons.jsx";
import "./SidebarItem.css";


/**
 * Sidebar navigation entry with optional icon, badge, and count.
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.icon] SVG path data
 * @param {boolean} [props.active=false]
 * @param {React.ReactNode} [props.badge]
 * @param {number} [props.count]
 * @param {(event: { label: string }) => void} [props.onSelect]
 */
export function SidebarItem({ label, icon, active = false, badge, count, onSelect }) {
  return (
    <button
      className={cx("mh-sidebar-item", active && "is-active")}
      type="button"
      aria-current={active ? "page" : undefined}
      title={count !== undefined && count !== null ? `${label} · ${count}` : label}
      onClick={() => onSelect?.({ label })}
    >
      {icon ? <Icon path={icon} className="mh-sidebar-item__icon" /> : null}
      <span className="mh-sidebar-item__label">{label}</span>
      {badge ? <span className="mh-sidebar-item__badge">{badge}</span> : null}
      {count !== undefined && count !== null ? <span className="mh-sidebar-item__count">{count}</span> : null}
    </button>
  );
}
