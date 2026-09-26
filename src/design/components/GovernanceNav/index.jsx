import "../../tokens.css";
import { Icon } from "../../icons.jsx";
import "./GovernanceNav.css";

function isPlainPrimaryLink(event) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.currentTarget.target;
}

/**
 * The four visible governance destination anchors shared by Review Center and Feedback & Quality.
 * @param {object} props
 * @param {Array<{id:string,icon:string,label:string,href:string}>} props.items
 * @param {string} props.current Active route id.
 * @param {string} props.navigationAria
 * @param {string} props.categoriesAria
 * @param {(id:string,params?:object)=>string} [props.hrefFor]
 * @param {(event:{id:string,params:object,href:string,label:string})=>void} [props.onNavigate]
 */
export function GovernanceNav({ items = [], current, navigationAria, categoriesAria, hrefFor, onNavigate }) {
  return <aside className="mh-governance-nav" aria-label={navigationAria}>
    <nav aria-label={categoriesAria}>{items.map((item) => {
      const href = hrefFor?.(item.id, {}) || item.href;
      return <a key={item.id} href={href} aria-current={item.id === current ? "page" : undefined} onClick={(event) => isPlainPrimaryLink(event) && onNavigate?.({ id: item.id, params: {}, href, label: item.label })}><Icon name={item.icon} />{item.label}</a>;
    })}</nav>
  </aside>;
}
