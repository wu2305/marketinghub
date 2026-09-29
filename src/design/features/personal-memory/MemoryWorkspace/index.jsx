import "../../../tokens.css";
import { Icon, knowledgeActionIconPaths } from "../../../icons.jsx";
import "./MemoryWorkspace.css";

/**
 * Personal Memory split workspace: the list column arrives as `children`
 * (a governed `LibraryList`), the detail aside is controlled by the page.
 * @param {object} props
 * @param {React.ReactNode} [props.children] list column
 * @param {object|null} props.selected
 * @param {boolean} props.editing
 * @param {{title?:string,description?:string}} props.draft
 * @param {object} props.labels
 * @param {(event:{id:string})=>void} [props.onEdit]
 * @param {(event:{id:string})=>void} [props.onDelete]
 * @param {(event:{field:"title"|"description",value:string})=>void} [props.onDraftChange]
 * @param {(event:{id:string})=>void} [props.onCancelEdit]
 * @param {(event:{id:string,title:string,description:string})=>void} [props.onSaveEdit]
 * @param {(event:{id:string})=>void} [props.onShare]
 */
export function MemoryWorkspace({ children, selected, editing = false, draft = {}, labels, onEdit, onDelete, onDraftChange, onCancelEdit, onSaveEdit, onShare }) {
  return <div className="mh-memory-workspace">
    <div className="mh-memory-workspace__list">{children}</div>
    <aside className="mh-memory-workspace__detail" aria-label={labels.detailAria}>
      {!selected ? <div className="mh-memory-workspace__empty-detail">{labels.emptyDetail}</div> : <div className="mh-memory-workspace__detail-content">
        {editing ? <><label className="mh-memory-workspace__field">{labels.title}<input value={draft.title || ""} onChange={(event) => onDraftChange?.({ field: "title", value: event.target.value })} /></label><label className="mh-memory-workspace__field">{labels.description}<textarea value={draft.description || ""} onChange={(event) => onDraftChange?.({ field: "description", value: event.target.value })} /></label></> : <><h3>{selected.title}</h3><section><h4>{labels.description}</h4><p>{selected.description}</p></section></>}
        <dl><div><dt>{labels.source}</dt><dd>{selected.source}</dd></div><div><dt>{labels.updated}</dt><dd>{selected.updated}</dd></div><div><dt>{labels.used}</dt><dd>{selected.used}</dd></div></dl>
        {editing ? <div className="mh-memory-workspace__actions"><button type="button" onClick={() => onCancelEdit?.({ id: selected.id })}>{labels.cancel}</button><button type="button" className="mh-memory-workspace__primary" onClick={() => onSaveEdit?.({ id: selected.id, title: draft.title, description: draft.description })}>{labels.saveChanges}</button></div> : <><div className="mh-memory-workspace__actions"><button type="button" onClick={() => onEdit?.({ id: selected.id })}><Icon path={knowledgeActionIconPaths.edit} />{labels.edit}</button><button type="button" className="mh-memory-workspace__primary" onClick={() => onShare?.({ id: selected.id })}><Icon name="share" />{labels.share}</button></div><button type="button" className="mh-memory-workspace__delete" onClick={() => onDelete?.({ id: selected.id })}>{labels.deleteMemory}</button></>}
      </div>}
    </aside>
  </div>;
}
