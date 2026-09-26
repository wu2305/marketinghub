import "../../../tokens.css";
import React from "react";
import { Icon, knowledgeActionIconPaths } from "../../../icons.jsx";
import "./MemoryWorkspace.css";

/**
 * Source memory cards and inline detail, controlled by the page.
 * @param {object} props
 * @param {object[]} props.items
 * @param {object|null} props.selected
 * @param {boolean} props.editing
 * @param {{title?:string,description?:string}} props.draft
 * @param {string|null} props.menuId
 * @param {object} props.labels
 * @param {(event:{id:string})=>void} [props.onSelect]
 * @param {(event:{id:string})=>void} [props.onToggleMenu]
 * @param {(event:{reason:string})=>void} [props.onCloseMenu]
 * @param {(event:{id:string})=>void} [props.onEdit]
 * @param {(event:{id:string})=>void} [props.onDelete]
 * @param {(event:{field:"title"|"description",value:string})=>void} [props.onDraftChange]
 * @param {(event:{id:string})=>void} [props.onCancelEdit]
 * @param {(event:{id:string,title:string,description:string})=>void} [props.onSaveEdit]
 * @param {(event:{id:string})=>void} [props.onShare]
 */
export function MemoryWorkspace({ items = [], selected, editing = false, draft = {}, menuId, labels, onSelect, onToggleMenu, onCloseMenu, onEdit, onDelete, onDraftChange, onCancelEdit, onSaveEdit, onShare }) {
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    if (!menuId) return undefined;
    const outside = (event) => { if (!rootRef.current?.contains(event.target) || !event.target.closest(".mh-memory-workspace__more")) onCloseMenu?.({ reason: "outside" }); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [menuId, onCloseMenu]);
  return <div className="mh-memory-workspace" ref={rootRef}>
    <div className="mh-memory-workspace__list" role="list" aria-label={labels.listAria}>
      {items.length ? items.map((item) => <article className={`mh-memory-workspace__card${selected?.id === item.id ? " mh-memory-workspace__card--active" : ""}`} key={item.id} data-memory-id={item.id} role="listitem">
        <span className={`mh-memory-workspace__avatar mh-memory-workspace__avatar--${item.avatarColor || "gold"}`} aria-hidden="true">{item.title.charAt(0).toUpperCase()}</span>
        <button type="button" className="mh-memory-workspace__card-main" onClick={() => onSelect?.({ id: item.id })} aria-label={item.title}>
          <strong>{item.title}</strong><span className="mh-memory-workspace__excerpt">{item.description.substring(0, 100)}{item.description.length > 100 ? "..." : ""}</span><small>{item.source} <span aria-hidden="true">·</span> {item.updated}</small>
        </button>
        <div className="mh-memory-workspace__more">
          <button type="button" className="mh-memory-workspace__more-button" aria-label={`${labels.moreActions}: ${item.title}`} aria-expanded={menuId === item.id} onClick={() => onToggleMenu?.({ id: item.id })}><Icon name="more-vertical" /></button>
          {menuId === item.id && <div className="mh-memory-workspace__menu"><button type="button" onClick={() => onEdit?.({ id: item.id })}><Icon path={knowledgeActionIconPaths.edit} />{labels.edit}</button><button type="button" onClick={() => onDelete?.({ id: item.id })}><Icon path={knowledgeActionIconPaths.delete} />{labels.delete}</button></div>}
        </div>
      </article>) : <div className="mh-memory-workspace__empty-list"><span>{labels.emptyList}</span><strong>{labels.emptyListPrompt}</strong></div>}
    </div>
    <aside className="mh-memory-workspace__detail" aria-label={labels.detailAria}>
      {!selected ? <div className="mh-memory-workspace__empty-detail">{labels.emptyDetail}</div> : <div className="mh-memory-workspace__detail-content">
        {editing ? <><label className="mh-memory-workspace__field">{labels.title}<input value={draft.title || ""} onChange={(event) => onDraftChange?.({ field: "title", value: event.target.value })} /></label><label className="mh-memory-workspace__field">{labels.description}<textarea value={draft.description || ""} onChange={(event) => onDraftChange?.({ field: "description", value: event.target.value })} /></label></> : <><h3>{selected.title}</h3><section><h4>{labels.description}</h4><p>{selected.description}</p></section></>}
        <dl><div><dt>{labels.source}</dt><dd>{selected.source}</dd></div><div><dt>{labels.updated}</dt><dd>{selected.updated}</dd></div><div><dt>{labels.used}</dt><dd>{selected.used}</dd></div></dl>
        {editing ? <div className="mh-memory-workspace__actions"><button type="button" onClick={() => onCancelEdit?.({ id: selected.id })}>{labels.cancel}</button><button type="button" className="mh-memory-workspace__primary" onClick={() => onSaveEdit?.({ id: selected.id, title: draft.title, description: draft.description })}>{labels.saveChanges}</button></div> : <><div className="mh-memory-workspace__actions"><button type="button" onClick={() => onEdit?.({ id: selected.id })}><Icon path={knowledgeActionIconPaths.edit} />{labels.edit}</button><button type="button" className="mh-memory-workspace__primary" onClick={() => onShare?.({ id: selected.id })}><Icon name="share" />{labels.share}</button></div><button type="button" className="mh-memory-workspace__delete" onClick={() => onDelete?.({ id: selected.id })}>{labels.deleteMemory}</button></>}
      </div>}
    </aside>
  </div>;
}
