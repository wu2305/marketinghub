import "../../tokens.css";
import { cx } from "../../cx.js";
import { Icon } from "../../icons.jsx";
import "./Button.css";


const BUTTON_VARIANTS = ["primary", "gold", "secondary", "quiet", "danger"];
const SIZES = ["sm", "md", "lg"];
const BUTTON_TYPES = ["button", "submit"];

/**
 * Action button. Renders `<button type="button">`; never use it for navigation.
 * @param {object} props
 * @param {typeof BUTTON_VARIANTS[number]} [props.variant="primary"]
 * @param {typeof SIZES[number]} [props.size="md"]
 * @param {boolean} [props.disabled=false]
 * @param {typeof BUTTON_TYPES[number]} [props.type="button"]
 * @param {string} [props.icon] icon name from icons.jsx
 * @param {React.ReactNode} props.children
 * @param {string} [props.label] aria-label override when the visible text isn't the right accessible name
 * @param {(event: { label: string }) => void} [props.onClick] `label` is the label prop, or the trimmed visible text
 */
export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  icon,
  children,
  label,
  onClick,
}) {
  return (
    <button
      className={cx("mh-button", `mh-button--${variant}`, `mh-button--${size}`)}
      type={type}
      disabled={disabled}
      aria-label={label}
      onClick={(event) => onClick?.({ label: label ?? event.currentTarget.textContent.trim() })}
    >
      {icon ? <Icon name={icon} className="mh-button__icon" /> : null}
      {children}
    </button>
  );
}

export const buttonVariants = BUTTON_VARIANTS;
export const controlSizes = SIZES;
export const buttonTypes = BUTTON_TYPES;
