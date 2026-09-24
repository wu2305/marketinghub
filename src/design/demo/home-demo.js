/**
 * Demo state container for HomePage — the deterministic local stand-in for
 * the original demo's portal.js scripting: assistant drawer open/close, prompt
 * editing, history fills, suggestions, skill selection and the model-flow
 * dialog. Takes ordinary page props (data + initial state + host callbacks)
 * plus a `demo` bundle of content simulators and returns the fully wired prop
 * set. No Storybook imports; any host can drive the page the same way.
 */
import React from "react";

/** Controlled-prop mirror: local state re-syncs when the input value changes. */
function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}

/**
 * @param {object} props ordinary HomePage props:
 *   data (logo, navigation, hero, heading, cards, assistant, current) +
 *   initial state values (assistantOpen, prompt, scope — mirrored locally so
 *   host prop changes still drive them) + host callbacks (onNavigate, onOpen,
 *   onOpenAssistant, onCloseAssistant, onPromptChange, onSubmit, onSuggestion,
 *   onScopeChange, onNewSession, onMaximize, onHistory, onHistorySelect,
 *   onFeedback, onAttach, onSelectSkill, onClearSkill, onSkillAction,
 *   onFlowSave, onFlowSubmit). Host callbacks fire after the internal update
 *   with the same named payloads the page emits.
 * @param {object} props.demo deterministic content simulators:
 *   `answerFor(text, scope)` → assistant answer entry — no answer is added
 *   when absent; `modelFlow` = `{ threads, sections }` for the model-
 *   generation dialog — skill actions open nothing when absent;
 *   `modelDraftFor(messages, rule)` → generated form draft.
 * @returns {object} HomePage props
 */
export function useHomeDemo(props) {
  const { answerFor, modelFlow, modelDraftFor } = props.demo || {};

  const [open, setOpen] = useSynced(props.assistantOpen);
  const [prompt, setPrompt] = useSynced(props.prompt);
  const [scope, setScope] = useSynced(props.scope);
  const [answers, setAnswers] = React.useState([]);
  const [skill, setSkill] = React.useState(null);
  const [flow, setFlow] = React.useState(null);
  /* portal.js home-history pick writes promptCanvas.textContent without
     updateSendState() — ASK stays disabled until the user types. */
  const [historyFilled, setHistoryFilled] = React.useState(false);

  return {
    ...props,
    assistant: {
      ...props.assistant,
      answers,
      selectedSkill: skill,
      submitDisabled: historyFilled,
      onAttach: props.onAttach,
      onSelectSkill: (event) => {
        setSkill({ id: event.id, type: event.type, title: event.title });
        props.onSelectSkill?.(event);
      },
      onClearSkill: () => {
        setSkill(null);
        props.onClearSkill?.();
      },
      onSkillAction: ({ action }) => {
        props.onSkillAction?.({ action });
        if (!modelFlow) return;
        setFlow({
          step: action === "history" ? "history" : "manual",
          threads: (modelFlow.threads || []).map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) })),
          rule: "",
          draft: {},
        });
      },
    },
    assistantOpen: open,
    prompt,
    scope,
    skillFlow: flow
      ? {
          step: flow.step,
          threads: flow.threads,
          rule: flow.rule,
          draft: flow.draft,
          sections: modelFlow.sections,
          onToggleMessage: ({ threadIndex, messageIndex, checked }) =>
            setFlow((current) => ({
              ...current,
              threads: current.threads.map((thread, ti) =>
                ti === threadIndex
                  ? { ...thread, messages: thread.messages.map((message, mi) => (mi === messageIndex ? { ...message, checked } : message)) }
                  : thread,
              ),
            })),
          onRuleChange: ({ value }) => setFlow((current) => ({ ...current, rule: value })),
          onGenerate: ({ messages, rule }) =>
            setFlow((current) => ({ ...current, step: "generated", rule, draft: modelDraftFor?.(messages, rule) || {} })),
          onBack: () => setFlow((current) => ({ ...current, step: "history" })),
          onClose: () => setFlow(null),
          onSave: ({ values }) => props.onFlowSave?.({ values }),
          onSubmit: ({ values }) => props.onFlowSubmit?.({ values }),
        }
      : undefined,
    onNavigate: props.onNavigate,
    onOpen: props.onOpen,
    onOpenAssistant: (event) => {
      setOpen(true);
      props.onOpenAssistant?.(event);
    },
    onCloseAssistant: (event) => {
      setOpen(false);
      props.onCloseAssistant?.(event);
    },
    onPromptChange: (event) => {
      setPrompt(event.value);
      setHistoryFilled(false);
      props.onPromptChange?.(event);
    },
    onSuggestion: (event) => {
      setPrompt(event.prompt);
      setHistoryFilled(false);
      props.onSuggestion?.(event);
    },
    onScopeChange: (event) => {
      setScope(event.scope);
      props.onScopeChange?.(event);
    },
    onSubmit: (event) => {
      const text = String(event.prompt || "").trim();
      if (text) {
        const entry = answerFor?.(text, scope);
        if (entry) setAnswers([entry]);
        setPrompt("");
        setHistoryFilled(false);
      }
      props.onSubmit?.(event);
    },
    onNewSession: () => {
      setAnswers([]);
      setPrompt("");
      setHistoryFilled(false);
      props.onNewSession?.();
    },
    onMaximize: props.onMaximize,
    onHistory: props.onHistory,
    onHistorySelect: (event) => {
      setPrompt(event.prompt);
      setHistoryFilled(true);
      props.onHistorySelect?.(event);
    },
    onFeedback: props.onFeedback,
  };
}
