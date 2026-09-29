import "../../tokens.css";
import React from "react";
import "./AssistantLauncher.css";


/**
 * @typedef {object} AssistantLauncherProps
 * @property {string} [label="AI Interpreter"]
 * @property {boolean} [hidden=false] mirrors the original `display:none` while the panel is open
 * @property {(event: { reason: "open" }) => void} [onOpen]
 */

/**
 * Floating corner button that opens the assistant panel. The forwarded ref
 * points at the button.
 * @type {React.ForwardRefExoticComponent<AssistantLauncherProps & React.RefAttributes<HTMLButtonElement>>}
 */
export const AssistantLauncher = React.forwardRef(function AssistantLauncher({ label = "AI Interpreter", hidden = false, onOpen }, ref) {
  return (
    <button ref={ref} className="mh-launcher" type="button" aria-label="Open AI assistant" hidden={hidden} onClick={() => onOpen?.({ reason: "open" })}>
      <span className="mh-launcher__orb">AI</span>
      <span>{label}</span>
    </button>
  );
});
