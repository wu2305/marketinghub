import "../../tokens.css";
import "./Toast.css";


/**
 * Transient status toast pinned to the lower-right viewport. Always mounted
 * so the aria-live region exists before `message` changes; the host owns
 * the auto-dismiss timer (the static demo hides it after ~3s).
 * @param {object} props
 * @param {string} [props.message=""]
 * @param {boolean} [props.open=false]
 */
export function Toast({ message = "", open = false }) {
  return (
    <div className="mh-toast" role="status" aria-live="polite" hidden={!open}>
      {message}
    </div>
  );
}
