import React from "react";
import { buildCampaignAnswer } from "../content.js";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

function firstOption(options) {
  const first = options?.[0];
  return typeof first === "object" && first !== null ? first.value : first || "";
}

function initialTaskDraft(taskDialog) {
  return {
    action: firstOption(taskDialog?.fields?.actions),
    platform: firstOption(taskDialog?.fields?.platforms),
    account: firstOption(taskDialog?.fields?.accounts),
    object: taskDialog?.object?.value || "",
  };
}

/**
 * Campaign's deterministic five-section, task, assistant and model flow.
 * Storybook and the independent host pass the same page data and callbacks.
 * @param {object} props CampaignPage content, initial state and callbacks.
 * @param {{answerFor?:(query:string)=>object,modelFlow?:object,modelDraftFor?:(messages:object[],rule:string)=>object,toasts?:{taskSubmitted:string,bindAccount:string}}} [props.demo] Private deterministic fixtures.
 * @returns {object} Fully wired CampaignPage props.
 */
export function useCampaignDemo(props) {
  const [section, setSection] = React.useState(props.section || "overview");
  const [channel, setChannel] = React.useState(props.channel || "rednote");
  const [query, setQuery] = React.useState(props.query || "");
  const [taskOpen, setTaskOpen] = React.useState(Boolean(props.taskDialogOpen));
  const [taskDraft, setTaskDraft] = React.useState(() => props.taskDraft || initialTaskDraft(props.taskDialog));
  const [toast, setToast] = React.useState(props.toast || { open: false, message: "" });
  const toastTimer = React.useRef(null);

  React.useEffect(() => setSection(props.section || "overview"), [props.section]);
  React.useEffect(() => setChannel(props.channel || "rednote"), [props.channel]);
  React.useEffect(() => setQuery(props.query || ""), [props.query]);
  React.useEffect(() => setTaskOpen(Boolean(props.taskDialogOpen)), [props.taskDialogOpen]);
  React.useEffect(() => {
    if (props.taskDraft !== undefined) setTaskDraft(props.taskDraft);
  }, [props.taskDraft]);
  React.useEffect(() => setToast(props.toast || { open: false, message: "" }), [props.toast]);
  React.useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast({ open: true, message });
    toastTimer.current = setTimeout(() => setToast({ open: false, message }), 2600);
  };

  const workspace = useWorkspaceAssistantDemo({
    ...props,
    assistant: {
      ...props.assistant,
      open: props.assistantOpen ?? props.assistant?.open,
      prompt: props.prompt ?? props.assistant?.prompt,
      onOpen: props.onOpenAssistant,
      onClose: props.onCloseAssistant,
      onPromptChange: props.onPromptChange,
      onSubmit: props.onSubmit,
      onSuggestion: props.onSuggestion,
      onNewSession: props.onNewSession,
      onMaximize: props.onMaximize,
      onHistorySelect: props.onHistorySelect,
      onFeedback: props.onFeedback,
      onAttach: props.onAttach,
      onSelectSkill: props.onSelectSkill,
      onClearSkill: props.onClearSkill,
      onSkillAction: props.onSkillAction,
    },
    variant: "campaign",
    demo: { ...props.demo, answerFor: props.demo?.answerFor || buildCampaignAnswer },
  });

  return {
    ...props,
    section,
    channel,
    query,
    taskDialogOpen: taskOpen,
    taskDraft,
    toast,
    assistantOpen: workspace.assistant.open,
    prompt: workspace.assistant.prompt,
    assistant: workspace.assistant,
    skillFlow: workspace.skillFlow,
    onSectionChange: (event) => { setSection(event.id); props.onSectionChange?.(event); },
    onChannelChange: (event) => { setChannel(event.id); props.onChannelChange?.(event); },
    onQueryChange: (event) => { setQuery(event.value); props.onQueryChange?.(event); },
    onReset: (event) => { setQuery(""); props.onReset?.(event); },
    onCreateTask: (event) => { setTaskOpen(true); props.onCreateTask?.(event); },
    onBindAccount: (event) => { showToast(props.demo?.toasts?.bindAccount || props.toasts?.bindAccount || ""); props.onBindAccount?.(event); },
    onCloseTask: (event) => { setTaskOpen(false); props.onCloseTask?.(event); },
    onSubmitTask: (event) => {
      setTaskOpen(false);
      showToast(props.demo?.toasts?.taskSubmitted || props.toasts?.taskSubmitted || "");
      props.onSubmitTask?.(event);
    },
    onTaskDraftChange: (event) => { setTaskDraft(event.draft); props.onTaskDraftChange?.(event); },
    onOpenAssistant: workspace.assistant.onOpen,
    onCloseAssistant: workspace.assistant.onClose,
    onPromptChange: workspace.assistant.onPromptChange,
    onSubmit: workspace.assistant.onSubmit,
    onSuggestion: workspace.assistant.onSuggestion,
  };
}
