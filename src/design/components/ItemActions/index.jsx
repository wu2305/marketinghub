import "../../tokens.css";
import { cx } from "../../cx.js";
import { Icon, knowledgeActionIconPaths } from "../../icons.jsx";
import { governanceMessages } from "../../lib/governance.js";
import "./ItemActions.css";

const defaultLabels = { edit: "Edit", delete: "Delete", disable: "Disable" };

/**
 * Governed item actions (patterns/library.md B6–B7). Renders what
 * `governedActions()` returns; never decides permissions itself. A blocked
 * action stays focusable and clickable (`aria-disabled`) so the caller can
 * explain the block or offer the fix; every click reports the reason.
 * @param {object} props
 * @param {string} props.id item id reported with every action
 * @param {string} props.name item name, appended to each accessible label ("Edit Gross margin")
 * @param {Array<{ action: "edit"|"delete"|"disable", blocked: boolean, reason: null|"permission"|"disable-first"|"already-disabled" }>} [props.actions=[]]
 * @param {{ edit?: string, delete?: string, disable?: string }} [props.labels] visible-to-AT action names
 * @param {{ permission?: string, "disable-first"?: string, "already-disabled"?: string }} [props.messages] tooltip per block reason; defaults from lib/governance.js
 * @param {(event: { action: string, id: string, blocked: boolean, reason: string|null }) => void} [props.onAction]
 */
export function ItemActions({ id, name, actions = [], labels = {}, messages = {}, onAction }) {
  const text = { ...defaultLabels, ...labels };
  const tips = { ...governanceMessages, ...messages };
  return (
    <div className="mh-item-actions">
      {actions.map(({ action, blocked, reason }) => (
        <button
          key={action}
          type="button"
          className={cx("mh-item-actions__button", action === "delete" && "mh-item-actions__button--danger")}
          aria-disabled={blocked || undefined}
          aria-label={`${text[action]} ${name}`}
          title={blocked ? tips[reason] : text[action]}
          onClick={(event) => {
            event.stopPropagation();
            onAction?.({ action, id, blocked, reason });
          }}
        >
          <Icon path={knowledgeActionIconPaths[action]} />
        </button>
      ))}
    </div>
  );
}
