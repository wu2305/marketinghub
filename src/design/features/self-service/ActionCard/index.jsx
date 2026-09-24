import "../../../tokens.css";
import { Button } from "../../../components/Button/index.jsx";
import { Icon } from "../../../icons.jsx";
import "./ActionCard.css";


/**
 * Self-Service entry card with a single action.
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.actionLabel]
 * @param {string} [props.href] navigation target; renders a real link instead of a button
 * @param {Array<object>} [props.history] upload-history rows; truthy shows the history affordance
 * @param {(target: { title: string, href?: string }) => void} [props.onOpen]
 * @param {(target: { title: string }) => void} [props.onShowHistory]
 */
export function ActionCard({ title, description, actionLabel, href, history, onOpen, onShowHistory }) {
  return (
    <article className="mh-action-card">
      <div className="mh-action-card__copy">
        <h3>
          {title}
          {history ? (
            <button
              className="mh-action-card__history"
              type="button"
              aria-label="View upload history"
              onClick={() => onShowHistory?.({ title })}
            >
              <Icon name="history" />
            </button>
          ) : null}
        </h3>
        <p>{description}</p>
      </div>
      {href ? (
        <a className="mh-button mh-button--gold mh-button--md" href={href} onClick={() => onOpen?.({ title, href })}>
          {actionLabel}
        </a>
      ) : (
        <Button variant="gold" size="md" onClick={() => onOpen?.({ title })}>
          {actionLabel}
        </Button>
      )}
    </article>
  );
}
