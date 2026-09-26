import React from "react";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

const EMPTY = [];
const EMPTY_INITIAL = {};

function mergeRecords(records, restorations) {
  const ids = new Set(records.map((item) => item.id));
  // The original demo encodes its Restore badge in an id prefix. Normalize
  // that source convention here so the feature reads semantic record data.
  const normalized = (item) => ({ ...item, restored: item.restored ?? item.id.startsWith("restore-") });
  const merged = records.map(normalized);
  for (const item of restorations) {
    if (ids.has(item.id)) continue;
    ids.add(item.id);
    merged.push(normalized(item));
  }
  return merged;
}

/**
 * Deterministic P12 workflow for both Storybook and a consuming host.
 * @param {object} props Source-backed content, injected records/restorations,
 *   initial page state, assistant/model fixtures, and named host callbacks.
 * @returns {object} controlled ReviewCenterPage props
 */
export function useReviewCenterDemo(props) {
  const recordsInput = props.records || EMPTY;
  const restorations = props.restorations || EMPTY;
  const initial = props.initial || EMPTY_INITIAL;
  const [records, setRecords] = React.useState(() => mergeRecords(recordsInput, restorations));
  const mountedRecords = React.useRef(recordsInput);
  const [tab, setTab] = React.useState(initial.tab || "pending");
  const [search, setSearch] = React.useState(initial.search || "");
  const [type, setType] = React.useState(initial.type || "all");
  const [time, setTime] = React.useState(initial.time || "all");
  const [panel, setPanel] = React.useState(initial.panel || null);
  const [selectedId, setSelectedId] = React.useState(initial.selectedId || null);
  const [reason, setReason] = React.useState(initial.reason || "");

  // The source consumes pendingRestorations once. New equivalent restoration
  // props must not replay a rejected record; changing records is an explicit
  // host fixture replacement and may reset the demo state.
  React.useEffect(() => {
    if (mountedRecords.current === recordsInput) return;
    mountedRecords.current = recordsInput;
    setRecords(mergeRecords(recordsInput, EMPTY));
  }, [recordsInput]);
  React.useEffect(() => { setTab(initial.tab || "pending"); setSearch(initial.search || ""); setType(initial.type || "all"); setTime(initial.time || "all"); setPanel(initial.panel || null); setSelectedId(initial.selectedId || null); setReason(initial.reason || ""); }, [initial]);

  const selected = records.find((item) => item.id === selectedId) || null;
  const pendingCount = records.filter((item) => item.status === "pending").length;
  const approvedCount = records.filter((item) => item.status === "approved").length;
  const shown = records.filter((item) => item.status === tab && (type === "all" || item.type === type) && (!search.trim() || `${item.title} ${item.summary} ${item.submittedBy}`.toLowerCase().includes(search.trim().toLowerCase())));
  const detailSuggestions = selected ? props.suggestions?.[selected.id] || EMPTY : EMPTY;
  const rejectSuggestions = selected ? props.suggestions?.[selected.id] || props.fallbackSuggestions || EMPTY : EMPTY;

  const closePanel = (event) => { setPanel(null); props.onClosePanel?.({ panel, reason: event?.reason || "button" }); };
  const action = ({ id, action: kind }) => {
    const item = records.find((record) => record.id === id);
    if (!item) return;
    setSelectedId(id);
    props.onReviewAction?.({ id, action: kind });
    if (kind === "view") { setPanel("detail"); return; }
    if (kind === "reject") { setReason(""); setPanel("reject"); return; }
    if (kind === "approve") {
      if (item.aiCheck === "Warning" || item.aiCheck === "Reviewing") { setPanel("risk"); return; }
      setRecords((current) => current.map((record) => record.id === id ? { ...record, status: "approved", aiCheck: "Pass" } : record));
      setPanel(null);
    }
  };
  const workspace = useWorkspaceAssistantDemo({
    variant: "lite",
    initial,
    assistant: {
      ...props.assistant,
      open: Boolean(initial.assistantOpen),
      prompt: initial.assistantPrompt || "",
      answers: initial.assistantAnswers || EMPTY,
      onOpen: props.onAssistantOpen,
      onClose: props.onAssistantClose,
      onSubmit: props.onAssistantSubmit,
      onNewSession: props.onAssistantNewSession,
      onSelectSkill: props.onAssistantSelectSkill,
      onClearSkill: props.onAssistantClearSkill,
      onSkillAction: props.onSkillAction,
      onAttach: props.onAssistantAttach,
      onMaximize: props.onAssistantMaximize,
      onHistory: props.onAssistantHistory,
    },
    demo: { answerFor: props.answerFor, modelFlow: props.modelFlow, modelDraftFor: props.modelDraftFor },
    onFlowSave: props.onFlowSave,
    onFlowSubmit: props.onFlowSubmit,
  });

  return {
    content: props.content,
    logo: props.logo,
    navigation: props.navigation,
    image: props.image,
    hrefFor: props.hrefFor,
    onNavigate: props.onNavigate,
    filters: {
      tab, search, type, time,
      onTabChange: ({ value }) => { setTab(value); props.onTabChange?.({ value }); },
      onSearchChange: ({ value }) => { setSearch(value); props.onSearchChange?.({ value }); },
      onTypeChange: ({ value }) => { setType(value); props.onTypeChange?.({ value }); },
      onTimeChange: ({ value }) => { setTime(value); props.onTimeChange?.({ value }); },
    },
    queue: {
      items: shown,
      counts: { pending: pendingCount, approved: approvedCount, rejected: 3 },
      onOpenDetail: ({ id }) => { setSelectedId(id); setPanel("detail"); props.onOpenDetail?.({ id }); },
      onReviewAction: action,
    },
    decision: {
      panel, selected, reason, detailSuggestions, rejectSuggestions,
      onClose: closePanel,
      onReasonChange: ({ value }) => { setReason(value); props.onReasonChange?.({ value }); },
      onConfirmReject: () => { if (!selected) return; setRecords((current) => current.map((item) => item.id === selected.id ? { ...item, status: "rejected" } : item)); setPanel(null); props.onConfirmReject?.({ id: selected.id, reason }); },
      onConfirmApprove: () => { if (!selected) return; setRecords((current) => current.map((item) => item.id === selected.id ? { ...item, status: "approved", aiCheck: "Pass" } : item)); setPanel(null); props.onConfirmApprove?.({ id: selected.id }); },
    },
    ...workspace,
  };
}
