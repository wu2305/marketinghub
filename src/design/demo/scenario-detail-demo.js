import React from "react";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

const EMPTY_INITIAL = {};
const EMPTY_ANSWERS = [];

/** Source selection: absent id selects City Comparison; unknown id selects the first record. */
export function resolveScenarioDetail(records, id) {
  if (!records?.length) return null;
  const requested = id || "city-comparison";
  return records.find((record) => record.id === requested) || records[0];
}

/** Private deterministic workflow used by Storybook and the independent host. */
export function useScenarioDetailDemo({ content, records, shell, initial = EMPTY_INITIAL, hrefFor, onNavigate, onTabChange, onTogglePreview, onAssistantSubmit, onFlowSave, onFlowSubmit } = {}) {
  const [tab, setTab] = React.useState(initial.tab || "content");
  const [previewOpen, setPreviewOpen] = React.useState(Boolean(initial.previewOpen));
  React.useEffect(() => { setTab(initial.tab || "content"); setPreviewOpen(Boolean(initial.previewOpen)); }, [initial]);
  const record = resolveScenarioDetail(records, initial.id);
  const workspace = useWorkspaceAssistantDemo({
    variant: "lite",
    initial,
    assistant: { ...shell.assistant, open: Boolean(initial.assistantOpen), prompt: initial.assistantPrompt || "", answers: initial.assistantAnswers || EMPTY_ANSWERS, onSubmit: onAssistantSubmit },
    demo: { answerFor: shell.answerFor, modelFlow: shell.modelFlow, modelDraftFor: shell.modelDraftFor },
    onFlowSave,
    onFlowSubmit,
  });
  return {
    content,
    logo: content.logo,
    navigation: content.navigation,
    detail: {
      record,
      tab,
      previewOpen,
      onTabChange: ({ value }) => { setTab(value); onTabChange?.({ value }); },
      onTogglePreview: ({ open }) => { setPreviewOpen(open); onTogglePreview?.({ open }); },
    },
    assistant: workspace.assistant,
    skillFlow: workspace.skillFlow,
    hrefFor,
    onNavigate,
  };
}
