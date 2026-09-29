import "../../tokens.css";
import React from "react";
import { AssistantLauncher } from "../AssistantLauncher/index.jsx";
import { AssistantPanel } from "../AssistantPanel/index.jsx";
import { ModelFlowDialog } from "../ModelFlowDialog/index.jsx";

/**
 * The page-level assistant: corner launcher, panel drawer and the model-creation
 * dialog its skill menu opens. It owns the launcher ref, hides the launcher while
 * the panel is open and returns focus to it on close, so a page mounts one
 * element instead of wiring the three pieces itself. The forwarded ref points at
 * the launcher button, for a second overlay that also returns focus to it.
 * @param {object} props
 * @param {object} [props.assistant={}] everything the panel takes (`open`, `prompt`, `answers`, copy, callbacks; see AssistantPanel) plus `launcherLabel` and `onOpen` for the launcher
 * @param {object} [props.skillFlow] ModelFlowDialog props; the dialog renders while `skillFlow.step` is set
 * @param {"home"|"cockpit"|"campaign"|"lite"} [props.variant="campaign"] AssistantPanel behavior preset; wins over `assistant.variant`
 * @param {"modal"|"drawer"} [props.placement="drawer"]
 * @param {"home"|undefined} [props.tone] AssistantPanel tone
 * @param {string} [props.launcherLabel] launcher text; falls back to `assistant.launcherLabel`
 * @param {boolean} [props.launcherHidden=false] hide the launcher while another overlay is open
 * @param {(event: { reason: "open" }) => void} [props.onLauncherOpen] replaces `assistant.onOpen` when the launcher opens something else
 */
export const AssistantDock = React.forwardRef(function AssistantDock({
  assistant = {},
  skillFlow,
  variant = "campaign",
  placement = "drawer",
  tone,
  launcherLabel,
  launcherHidden = false,
  onLauncherOpen,
}, ref) {
  const { launcherLabel: assistantLauncherLabel, onOpen, ...panel } = assistant || {};
  const launcherRef = React.useRef(null);
  const setLauncher = React.useCallback((node) => {
    launcherRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);
  return (
    <>
      <AssistantLauncher
        ref={setLauncher}
        label={launcherLabel ?? assistantLauncherLabel}
        hidden={Boolean(panel.open) || launcherHidden}
        onOpen={onLauncherOpen ?? onOpen}
      />
      <AssistantPanel placement={placement} tone={tone} {...panel} variant={variant} returnFocusRef={launcherRef} />
      {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    </>
  );
});
