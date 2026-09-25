import { Icon, knowledgeActionIconPaths } from "../../../icons.jsx";
import { cx } from "../../../cx.js";
import "./KnowledgeActions.css";

/**
 * P07 knowledge management icon row. Source-specific disabled semantics are
 * retained: Business Term uses aria-disabled so its permission/info notice
 * remains reachable; Analytical Model and Scenario use native disabled.
 * @param {object} props
 * @param {Array<{action: string, disabled: boolean, title: string, label: string}>} props.actions
 * @param {object} props.record
 * @param {"business-term"|"field-library"|"scenario"} props.variant
 * @param {(event: {action: string, id: string, record: object}) => void} props.onAction
 */
export const knowledgeActionVariants = ["business-term", "field-library", "scenario"];
export function KnowledgeActions({ actions = [], record, variant = "field-library", onAction }) {
  return (
    <div className={cx("mh-knowledge-actions", `mh-knowledge-actions--${variant}`)}>
      {actions.map((item) => (
        <button
          key={item.action}
          type="button"
          className={cx("mh-knowledge-actions__button", item.action === "delete" && "is-danger", item.disabled && "is-disabled")}
          disabled={variant !== "business-term" && item.disabled}
          aria-disabled={item.disabled}
          aria-label={variant === "field-library" ? item.label : `${item.label} ${record.title}`}
          title={item.title}
          onClick={(event) => {
            event.stopPropagation();
            onAction?.({ action: item.action, id: record.id, record });
          }}
        >
          <Icon path={knowledgeActionIconPaths[item.action]} />
        </button>
      ))}
    </div>
  );
}
