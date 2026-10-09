import "../../tokens.css";
import React from "react";
import { AssistantLauncher } from "../AssistantLauncher/index.jsx";
import { AssistantPanel } from "../AssistantPanel/index.jsx";
import { ModelFlowDialog } from "../ModelFlowDialog/index.jsx";

/**
 * @typedef {Parameters<typeof AssistantPanel>[0] & { launcherLabel?: string, onOpen?: (event: { reason: "open" }) => void }} AssistantDockState
 * Everything AssistantPanel takes (`open`, `prompt`, `answers`, copy, callbacks), plus `launcherLabel` and `onOpen` for the launcher.
 */

/** @typedef {NonNullable<AssistantDockProps["skillFlow"]>} AssistantSkillFlow ModelFlowDialog props for a page's `skillFlow`. */

/**
 * @typedef {object} AssistantDockProps
 * @property {AssistantDockState} [assistant={}]
 * @property {Parameters<typeof ModelFlowDialog>[0]} [skillFlow] ModelFlowDialog props; the dialog renders while `skillFlow.step` is set
 * @property {"home"|"cockpit"|"campaign"|"lite"} [variant="campaign"] AssistantPanel behavior preset; wins over `assistant.variant`
 * @property {"modal"|"drawer"} [placement="drawer"] AssistantPanel layout; wins over `assistant.placement`
 * @property {"home"} [tone] AssistantPanel tone; wins over `assistant.tone`
 * @property {string} [launcherLabel] launcher text; falls back to `assistant.launcherLabel` when omitted or `null` (an empty string is used as given)
 * @property {boolean} [launcherHidden=false] hide the launcher while another overlay is open
 * @property {(event: { reason: "open" }) => void} [onLauncherOpen] replaces `assistant.onOpen` (the launcher calls only this one when set), for a launcher that opens something else; call `assistant.onOpen` yourself if the panel must still open
 */

/**
 * The page-level assistant: corner launcher, panel drawer and the model-creation
 * dialog its skill menu opens. It owns the launcher ref, hides the launcher while
 * the panel is open and returns focus to it on close, so a page mounts one
 * element instead of wiring the three pieces itself. The forwarded ref points at
 * the launcher button, for a second overlay that also returns focus to it.
 * @type {React.ForwardRefExoticComponent<AssistantDockProps & React.RefAttributes<HTMLButtonElement>>}
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
      <AssistantPanel {...panel} placement={placement} tone={tone} variant={variant} returnFocusRef={launcherRef} />
      {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    </>
  );
});
