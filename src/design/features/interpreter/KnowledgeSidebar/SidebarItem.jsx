import "../../../tokens.css";
import { cx } from "../../../cx.js";
import { Icon } from "../../../icons.jsx";
import { isPlainPrimaryLink } from "../../../lib/link-activation.js";
import "./SidebarItem.css";


/**
 * Sidebar navigation entry with optional icon, badge, and count.
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.icon] SVG path data
 * @param {boolean} [props.active=false]
 * @param {React.ReactNode} [props.badge]
 * @param {number} [props.count]
 * @param {string} [props.href] navigation target; omitted for an in-page type switch
 * @param {(event: { label: string }) => void} [props.onSelect]
 */
export function SidebarItem({ label, icon, active = false, badge, count, href, onSelect }) {
  const content = (
    <>
      {icon ? <Icon path={icon} className="mh-sidebar-item__icon" /> : null}
      <span className="mh-sidebar-item__label">{label}</span>
      {badge ? <span className="mh-sidebar-item__badge">{badge}</span> : null}
      {count !== undefined && count !== null ? <span className="mh-sidebar-item__count">{count}</span> : null}
    </>
  );
  const common = {
    className: cx("mh-sidebar-item", active && "is-active"),
    "aria-current": active ? "page" : undefined,
    title: count !== undefined && count !== null ? `${label} · ${count}` : label,
  };
  return href ? (
    <a {...common} href={href} onClick={(event) => {
      if (isPlainPrimaryLink(event) && onSelect) {
        event.preventDefault();
        onSelect({ label });
      }
    }}>{content}</a>
  ) : (
    <button {...common} type="button" onClick={() => onSelect?.({ label })}>{content}</button>
  );
}
