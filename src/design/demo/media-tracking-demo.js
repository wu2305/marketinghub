import React from "react";
import { MODEL_FLOW, buildLiteAssistantAnswer, buildModelDraft } from "../content.js";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

/**
 * Media Tracking's local period and lite-assistant flow for stories and hosts.
 * The report fields stay injected; changing period only changes the active tab,
 * as it does in the source demo.
 * @param {object} props MediaTrackingDetailPage data, initial state and callbacks
 * @param {{answerFor?:(query:string)=>object,modelFlow?:object,modelDraftFor?:(messages:object[],rule:string)=>object}} [props.demo]
 * @returns {object} fully wired MediaTrackingDetailPage props
 */
export function useMediaTrackingDemo(props) {
  const [period, setPeriod] = React.useState(props.period || "monthly");
  React.useEffect(() => setPeriod(props.period || "monthly"), [props.period]);

  const assistant = props.assistant || {};
  const workspace = useWorkspaceAssistantDemo({
    variant: "lite",
    assistant: {
      ...assistant,
      open: props.assistantOpen || false,
      prompt: props.prompt || "",
      onOpen: props.onOpenAssistant,
      onClose: props.onCloseAssistant,
      onPromptChange: props.onPromptChange,
      onSubmit: props.onSubmit,
      onSuggestion: props.onSuggestion,
      onNewSession: props.onNewSession,
      onMaximize: props.onMaximize,
      onHistory: props.onHistory,
      onHistorySelect: props.onHistorySelect,
      onAttach: props.onAttach,
      onSelectSkill: props.onSelectSkill,
      onClearSkill: props.onClearSkill,
      onSkillAction: props.onSkillAction,
    },
    demo: {
      answerFor: props.demo?.answerFor || buildLiteAssistantAnswer,
      modelFlow: props.demo?.modelFlow || MODEL_FLOW,
      modelDraftFor: props.demo?.modelDraftFor || buildModelDraft,
    },
    onFlowSave: props.onFlowSave,
    onFlowSubmit: props.onFlowSubmit,
  });
  return {
    ...props,
    period,
    assistant: workspace.assistant,
    skillFlow: workspace.skillFlow,
    onPeriodChange: (event) => { setPeriod(event.id); props.onPeriodChange?.(event); },
  };
}
