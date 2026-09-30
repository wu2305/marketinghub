import React from "react";
import { useModelFlowState } from "./model-flow-state.js";

const EMPTY_ANSWERS = [];

/**
 * Deterministic state for the shared non-home assistant and model-creation flow.
 * Both real callers supply their own answer builder, copy and skill data.
 * This is private demo composition, not a component or a public library export.
 * @param {{ assistant?: object, variant?: "home"|"campaign"|"lite", initial?: {selectedSkill?:object,flow?:object}, demo?: { answerFor?: (query: string) => object, modelFlow?: object, modelDraftFor?: (messages: object[], rule: string) => object }, typeId?: string, onFlowSave?: Function, onFlowSubmit?: Function }} props
 * @returns {{assistant: object, skillFlow?: object}}
 */
export function useWorkspaceAssistantDemo(props) {
  const source = props.assistant || {};
  const [open, setOpen] = React.useState(Boolean(source.open));
  const [prompt, setPrompt] = React.useState(source.prompt || "");
  const [answers, setAnswers] = React.useState(source.answers || EMPTY_ANSWERS);
  const answerSequence = React.useRef(0);
  const [skill, setSkill] = React.useState(props.initial?.selectedSkill || null);
  const { setFlow, start, dialog } = useModelFlowState(props.initial?.flow || null);

  React.useEffect(() => setOpen(Boolean(source.open)), [source.open]);
  React.useEffect(() => setPrompt(source.prompt || ""), [source.prompt]);
  React.useEffect(() => setAnswers(source.answers || EMPTY_ANSWERS), [source.answers]);
  React.useEffect(() => setSkill(props.initial?.selectedSkill || null), [props.initial?.selectedSkill]);
  React.useEffect(() => setFlow(props.initial?.flow || null), [props.initial?.flow, setFlow]);

  const modelFlow = props.demo?.modelFlow;
  const emit = (callback, event) => {
    if (!callback) return;
    if (props.typeId === undefined) return event === undefined ? callback() : callback(event);
    return callback({ ...(event || {}), typeId: props.typeId });
  };
  const submit = (value) => {
    const query = String(value || "").trim();
    if (!query) return;
    const answer = props.demo?.answerFor?.(query);
    // The source replaces its answer markup on every send, including repeated
    // identical prompts. A fresh key also resets local feedback/copy state.
    if (answer) setAnswers([{ ...answer, id: `workspace-answer-${++answerSequence.current}` }]);
    setPrompt("");
  };

  return {
    assistant: {
      ...source,
      open,
      prompt,
      answers,
      selectedSkill: skill,
      onOpen: (event) => { setOpen(true); emit(source.onOpen, event); },
      onClose: (event) => { setOpen(false); emit(source.onClose, event); },
      onPromptChange: (event) => { setPrompt(event.value); emit(source.onPromptChange, event); },
      onSubmit: (event) => { submit(event.prompt); emit(source.onSubmit, event); },
      onSuggestion: (event) => { if (props.variant === "lite" || props.variant === "home") setPrompt(event.prompt); else submit(event.prompt); emit(source.onSuggestion, event); },
      onHistorySelect: (event) => { setPrompt(event.prompt); emit(source.onHistorySelect, event); },
      onNewSession: () => { setPrompt(""); setAnswers([]); emit(source.onNewSession); },
      onSelectSkill: (event) => { setSkill({ id: event.id, type: event.type, title: event.title }); emit(source.onSelectSkill, event); },
      onClearSkill: () => { setSkill(null); emit(source.onClearSkill); },
      onSkillAction: (event) => { if (modelFlow) start(modelFlow.threads, event.action); emit(source.onSkillAction, event); },
      onAttach: (event) => emit(source.onAttach, event),
      onMaximize: (event) => emit(source.onMaximize, event),
      onHistory: (event) => emit(source.onHistory, event),
      onFeedback: (event) => emit(source.onFeedback, event),
    },
    skillFlow: dialog((messages, rule) => props.demo?.modelDraftFor?.(messages, rule), {
      sections: modelFlow?.sections,
      labels: modelFlow,
      onSave: (event) => emit(props.onFlowSave, event),
      onSubmit: (event) => emit(props.onFlowSubmit, event),
    }),
  };
}
