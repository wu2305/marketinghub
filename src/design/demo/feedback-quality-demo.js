import React from "react";
import { makeFeedbackRecords, FEEDBACK_QUALITY } from "./content/feedback-quality.js";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

const LIMIT_DAYS = { today: 1, week: 7, month: 30 };
const EMPTY_ANSWERS = [];
const EMPTY_INITIAL = {};

/** Source's strict day-threshold filter, evaluated against one injected clock. */
export function filterFeedback(records, { search = "", type = "all", time = "all" } = {}, now = Date.now()) {
  const needle = search.trim().toLowerCase();
  const clock = Number(new Date(now));
  return records.filter((item) => {
    if (type !== "all" && item.type !== type) return false;
    if (time !== "all" && (clock - Number(new Date(item.timestamp))) / 86400000 > LIMIT_DAYS[time]) return false;
    if (!needle) return true;
    return [item.question, item.answer, item.feedbackBy, item.reason].join(" ").toLowerCase().includes(needle);
  });
}

/** Private source-backed flow shared by page stories and the independent host. */
export function useFeedbackQualityDemo({ content = FEEDBACK_QUALITY, records, now = Date.UTC(2026, 8, 26, 12), initial = EMPTY_INITIAL, onNavigate, onTypeChange, onTimeChange, onSearchChange, onOpen, onCloseDetail, onAssistantSubmit, onFlowSave, onFlowSubmit } = {}) {
  const sourceRecords = React.useMemo(() => records || makeFeedbackRecords(now), [records, now]);
  const [search, setSearch] = React.useState(initial.search || "");
  const [type, setType] = React.useState(initial.type || "all");
  const [time, setTime] = React.useState(initial.time || "all");
  const [selectedId, setSelectedId] = React.useState(initial.selectedId || null);
  React.useEffect(() => { setSearch(initial.search || ""); setType(initial.type || "all"); setTime(initial.time || "all"); setSelectedId(initial.selectedId || null); }, [initial]);
  const selected = sourceRecords.find((item) => item.id === selectedId) || null;
  const items = filterFeedback(sourceRecords, { search, type, time }, now);
  const up = sourceRecords.filter((item) => item.type === "thumbs-up").length;
  const workspace = useWorkspaceAssistantDemo({
    variant: "home",
    initial,
    assistant: { ...content.assistant, open: Boolean(initial.assistantOpen), prompt: initial.assistantPrompt || "", answers: initial.assistantAnswers || EMPTY_ANSWERS, onSubmit: onAssistantSubmit },
    demo: { answerFor: content.answerFor, modelFlow: content.modelFlow, modelDraftFor: content.modelDraftFor },
    onFlowSave,
    onFlowSubmit,
  });
  return {
    content,
    logo: content.logo,
    navigation: content.navigation,
    filters: {
      search, type, time,
      onSearchChange: ({ value }) => { setSearch(value); onSearchChange?.({ value }); },
      onTypeChange: ({ value }) => { setType(value); onTypeChange?.({ value }); },
      onTimeChange: ({ value }) => { setTime(value); onTimeChange?.({ value }); },
    },
    list: { items, counts: { total: sourceRecords.length, up, down: sourceRecords.length - up }, onOpen: ({ id }) => { setSelectedId(id); onOpen?.({ id }); } },
    detail: { selected, onClose: ({ reason }) => { setSelectedId(null); onCloseDetail?.({ reason }); } },
    assistant: workspace.assistant,
    skillFlow: workspace.skillFlow,
    onNavigate,
  };
}
