import "../../tokens.css";
import { cx } from "../../cx.js";
import { Icon } from "../../icons.jsx";
import "./Button.css";


/** @type {readonly ["primary", "gold", "secondary", "quiet", "danger"]} */
const BUTTON_VARIANTS = ["primary", "gold", "secondary", "quiet", "danger"];
/** @type {readonly ["sm", "md", "lg"]} */
const SIZES = ["sm", "md", "lg"];
/** @type {readonly ["button", "submit"]} */
const BUTTON_TYPES = ["button", "submit"];

/**
 * Action button. Renders `<button type="button">`. With `href` it renders a
 * link with the same look, for actions that navigate (AGENTS §3.1).
 * @param {object} props
 * @param {typeof BUTTON_VARIANTS[number]} [props.variant="primary"]
 * @param {typeof SIZES[number]} [props.size="md"]
 * @param {boolean} [props.disabled=false]
 * @param {typeof BUTTON_TYPES[number]} [props.type="button"]
 * @param {typeof import("../../icons.jsx").iconNames[number]} [props.icon] icon name from icons.jsx
 * @param {React.ReactNode} props.children
 * @param {string} [props.label] aria-label override when the visible text isn't the right accessible name
 * @param {string} [props.href] navigation target; renders `<a href>`. With `disabled` the link has no href and is `aria-disabled`
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
  href,
  onClick,
}) {
  const className = cx("mh-button", `mh-button--${variant}`, `mh-button--${size}`);
  const content = (
    <>
      {icon ? <Icon name={icon} className="mh-button__icon" /> : null}
      {children}
    </>
  );
  if (href !== undefined) {
    return (
      <a
        className={className}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        aria-label={label}
        onClick={(event) => {
          if (!disabled) onClick?.({ label: label ?? event.currentTarget.textContent.trim() });
        }}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      className={cx("mh-button", `mh-button--${variant}`, `mh-button--${size}`)}
      type={type}
      disabled={disabled}
      aria-label={label}
      onClick={(event) => onClick?.({ label: label ?? event.currentTarget.textContent.trim() })}
    >
      {content}
    </button>
  );
}

export const buttonVariants = BUTTON_VARIANTS;
export const controlSizes = SIZES;
export const buttonTypes = BUTTON_TYPES;
