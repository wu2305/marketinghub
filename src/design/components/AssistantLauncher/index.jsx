import "../../tokens.css";
import React from "react";
import "./AssistantLauncher.css";


/**
 * Floating corner button that opens the assistant panel.
 * @param {object} props
 * @param {string} [props.label="AI Interpreter"]
 * @param {boolean} [props.hidden=false] mirrors the original `display:none` while the panel is open
 * @param {(event: { reason: "open" }) => void} [props.onOpen]
 */
export const AssistantLauncher = React.forwardRef(function AssistantLauncher({ label = "AI Interpreter", hidden = false, onOpen }, ref) {
  return (
    <button ref={ref} className="mh-launcher" type="button" aria-label="Open AI assistant" hidden={hidden} onClick={() => onOpen?.({ reason: "open" })}>
      <span className="mh-launcher__orb">AI</span>
      <span>{label}</span>
    </button>
  );
});
