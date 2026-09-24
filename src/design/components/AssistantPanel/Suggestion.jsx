import "../../tokens.css";
import "./Suggestion.css";


/**
 * Clickable suggested prompt chip.
 * @param {object} props
 * @param {React.ReactNode} props.children suggestion text
 * @param {(event: { label: React.ReactNode }) => void} [props.onSelect]
 */
export function Suggestion({ children, onSelect }) {
  return (
    <button className="mh-suggestion" type="button" onClick={() => onSelect?.({ label: children })}>
      {children}
    </button>
  );
}
