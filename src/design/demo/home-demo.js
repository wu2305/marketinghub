/**
 * Demo state container for HomePage — the deterministic local stand-in for
 * the original demo's portal.js scripting: assistant drawer open/close, prompt
 * editing, history fills, suggestions, skill selection and the model-flow
 * dialog. Takes ordinary page props (data + initial state + host callbacks)
 * plus a `demo` bundle of content simulators and returns the fully wired prop
 * set. No Storybook imports; any host can drive the page the same way.
 */
import { demoHrefFor } from "./navigation.js";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

/**
 * @param {object} props ordinary HomePage props:
 *   data (logo, navigation, hero, heading, cards, assistant, current) +
 *   initial state values (assistantOpen, prompt — mirrored locally so host
 *   prop changes still drive them) + `scope` (the scope handed to
 *   `demo.answerFor`) + host callbacks (onNavigate, onOpen,
 *   onOpenAssistant, onCloseAssistant, onPromptChange, onSubmit, onSuggestion,
 *   onNewSession, onMaximize, onHistory, onHistorySelect,
 *   onFeedback, onAttach, onSelectSkill, onClearSkill, onSkillAction,
 *   onFlowSave, onFlowSubmit). Host callbacks fire after the internal update
 *   with the same named payloads the page emits.
 * @param {object} props.demo deterministic content simulators:
 *   `answerFor(text, scope)` → assistant answer entry — no answer is added
 *   when absent; `modelFlow` = `{ threads, sections }` for the model-
 *   generation dialog — skill actions open nothing when absent;
 *   `modelDraftFor(messages, rule)` → generated form draft.
 * @returns {object} HomePage props; the assistant state and callbacks come back inside `assistant`
 */
export function useHomeDemo(props) {
  const { answerFor, modelFlow, modelDraftFor } = props.demo || {};
  const workspace = useWorkspaceAssistantDemo({
    variant: "home",
    assistant: {
      ...props.assistant,
      open: props.assistantOpen,
      prompt: props.prompt,
      onOpen: props.onOpenAssistant,
      onClose: props.onCloseAssistant,
      onPromptChange: props.onPromptChange,
      onSuggestion: props.onSuggestion,
      onSubmit: props.onSubmit,
      onNewSession: props.onNewSession,
      onMaximize: props.onMaximize,
      onHistory: props.onHistory,
      onHistorySelect: props.onHistorySelect,
      onFeedback: props.onFeedback,
      onAttach: props.onAttach,
      onSelectSkill: props.onSelectSkill,
      onClearSkill: props.onClearSkill,
      onSkillAction: props.onSkillAction,
    },
    demo: { answerFor: answerFor && ((text) => answerFor(text, props.scope)), modelFlow, modelDraftFor },
    onFlowSave: props.onFlowSave,
    onFlowSubmit: props.onFlowSubmit,
  });

  return {
    ...props,
    hrefFor: props.hrefFor || demoHrefFor,
    assistant: workspace.assistant,
    skillFlow: workspace.skillFlow,
  };
}
