import "../../tokens.css";
import { cx } from "../../cx.js";
import "./ScopeOption.css";


/**
 * Toggleable scope option inside the assistant ask box.
 * @param {object} props
 * @param {string} props.label
 * @param {boolean} [props.pressed=false]
 * @param {(event: { label: string, pressed: boolean }) => void} [props.onChange]
 */
export function ScopeOption({ label, pressed = false, onChange }) {
  return (
    <button
      className={cx("mh-scope", pressed && "is-active")}
      type="button"
      aria-pressed={pressed}
      onClick={() => onChange?.({ label, pressed: !pressed })}
    >
      {label}
    </button>
  );
}
