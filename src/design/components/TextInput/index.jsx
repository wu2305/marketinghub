import "../../tokens.css";
import React from "react";
import { cx } from "../../cx.js";
import "./TextInput.css";


/**
 * Single-line input. Controlled when `value` is passed, uncontrolled otherwise.
 * @param {object} props
 * @param {string} [props.name]
 * @param {string} [props.type="text"]
 * @param {string} [props.value] pass to control the field
 * @param {string} [props.defaultValue=""] initial uncontrolled value
 * @param {string} [props.placeholder]
 * @param {string} [props.autoComplete]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.invalid=false] adds aria-invalid and error styling
 * @param {typeof SIZES[number]} [props.size="md"]
 * @param {string} [props.label] accessible label (visually hidden)
 * @param {React.Ref<HTMLInputElement>} [props.inputRef] forwarded to the input
 * @param {(event: { name: string, value: string }) => void} [props.onChange]
 */
export function TextInput({
  name,
  type = "text",
  value,
  defaultValue = "",
  placeholder,
  autoComplete,
  disabled = false,
  invalid = false,
  size = "md",
  label,
  inputRef,
  onChange,
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : uncontrolled;
  return (
    <input
      ref={inputRef}
      className={cx("mh-input", `mh-input--${size}`, invalid && "is-invalid")}
      name={name}
      type={type}
      value={current}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-label={label}
      onChange={(event) => {
        if (!controlled) setUncontrolled(event.target.value);
        onChange?.({ name: name || "", value: event.target.value });
      }}
    />
  );
}
