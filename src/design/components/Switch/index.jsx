import React from "react";
import "../../tokens.css";
import "./Switch.css";

/**
 * On/off switch for a setting that applies right away, such as "Participate in Q&A" or "Enable Metric".
 * A native checkbox sits under the track, so keyboard, form and screen-reader behaviour stay native.
 * @param {object} props
 * @param {string} props.label accessible name; the visible text sits next to the switch, in the caller's markup
 * @param {boolean} [props.checked] pass to control the switch
 * @param {boolean} [props.defaultChecked=false] initial state when uncontrolled
 * @param {boolean} [props.disabled=false]
 * @param {(event: { checked: boolean }) => void} [props.onChange]
 */
export function Switch({ label, checked, defaultChecked = false, disabled = false, onChange }) {
  return (
    <label className="mh-switch">
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        disabled={disabled}
        {...(checked === undefined ? { defaultChecked } : { checked })}
        onChange={(event) => onChange?.({ checked: event.target.checked })}
      />
      <span className="mh-switch__track" aria-hidden="true" />
    </label>
  );
}
