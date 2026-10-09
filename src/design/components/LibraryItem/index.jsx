import "../../tokens.css";
import { cx } from "../../cx.js";
import { ItemActions } from "../ItemActions/index.jsx";
import { StatusBadge } from "../StatusBadge/index.jsx";
import "./LibraryItem.css";

/**
 * One card in a governed library (patterns/library.md §2). The title is the
 * card's button: activating it — or clicking anywhere on the card outside
 * another control — opens the item. `children` is the single slot for
 * view-specific content the pattern keeps (e.g. synonym chips).
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.title
 * @param {boolean} [props.draft=false] shows the draft marker next to the title
 * @param {boolean} [props.selected=false] the item the surrounding view currently shows (pattern §6 selected/active); sets `aria-current` on the title button
 * @param {string} [props.draftLabel="Draft"]
 * @param {string} [props.description] clamped to two lines
 * @param {React.ReactNode} [props.leading] a small mark before the content (an avatar or initial), for list rows such as Personal Memory
 * @param {Array<{ label: string, value: React.ReactNode }>} [props.meta=[]]
 * @param {{ status: string, tone?: string, label?: string }} [props.status] StatusBadge content
 * @param {object} [props.actions] ItemActions props without `id`/`name`/`onAction` (omit to hide)
 * @param {React.ReactNode} [props.children]
 * @param {(event: { id: string }) => void} [props.onOpen]
 * @param {(event: { action: string, id: string, blocked: boolean, reason: string|null }) => void} [props.onAction]
 */
export function LibraryItem({ id, title, draft = false, selected = false, draftLabel = "Draft", description, leading, meta = [], status, actions, children, onOpen, onAction }) {
  return (
    <article
      className={cx("mh-library-item", selected && "mh-library-item--selected", leading && "mh-library-item--leading")}
      onClick={(event) => {
        if (event.target.closest("a, button, input, select, textarea, label, summary")) return;
        onOpen?.({ id });
      }}
    >
      {leading ? <span className="mh-library-item__leading" aria-hidden="true">{leading}</span> : null}
      <header className="mh-library-item__head">
        <h3 className="mh-library-item__title">
          <button type="button" aria-current={selected || undefined} onClick={() => onOpen?.({ id })}>{title}</button>
          {draft ? <sup className="mh-library-item__draft"><StatusBadge status="draft">{draftLabel}</StatusBadge></sup> : null}
        </h3>
        {status ? <StatusBadge status={status.status} tone={status.tone}>{status.label}</StatusBadge> : null}
      </header>
      {description ? <p className="mh-library-item__description">{description}</p> : null}
      {children ? <div className="mh-library-item__extra">{children}</div> : null}
      {meta.length || actions ? (
        <footer className="mh-library-item__foot">
          <dl className="mh-library-item__meta">
            {meta.map((entry) => (
              <div key={entry.label}>
                <dt>{entry.label}</dt>
                <dd>{entry.value}</dd>
              </div>
            ))}
          </dl>
          {actions ? <ItemActions {...actions} id={id} name={title} onAction={onAction} /> : null}
        </footer>
      ) : null}
    </article>
  );
}
