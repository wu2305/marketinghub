import React from "react";
import { useToast } from "./use-toast.js";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

const EMPTY = [];
const EMPTY_INITIAL = {};
/* Same windows as Feedback & Quality (feedback.js:101-107). */
const LIMIT_DAYS = { today: 1, week: 7, month: 30 };

/**
 * Whole days since submission, read from the source's relative text
 * ("2 hours ago", "Today", "Yesterday", "3 days ago"); review records carry
 * no timestamp (data/reviews.js). Unknown text counts as old.
 * @param {string} submitted
 * @returns {number}
 */
export function reviewAgeDays(submitted = "") {
  const text = String(submitted).trim().toLowerCase();
  if (text === "today" || /^\d+\s+(minute|hour)s?\s+ago$/.test(text)) return 0;
  if (text === "yesterday") return 1;
  const days = text.match(/^(\d+)\s+days?\s+ago$/);
  if (days) return Number(days[1]);
  const weeks = text.match(/^(\d+)\s+weeks?\s+ago$/);
  if (weeks) return Number(weeks[1]) * 7;
  return Infinity;
}

/**
 * review.js getFilteredItems() plus the Submitted window it never applied (D01).
 * @param {Array<object>} records
 * @param {{ tab?: string, search?: string, type?: string, time?: string }} filters
 */
export function filterReviews(records, { tab = "pending", search = "", type = "all", time = "all" } = {}) {
  const query = search.trim().toLowerCase();
  return records.filter((item) =>
    item.status === tab &&
    (type === "all" || item.type === type) &&
    (time === "all" || reviewAgeDays(item.submitted) < LIMIT_DAYS[time]) &&
    (!query || `${item.title} ${item.summary} ${item.submittedBy}`.toLowerCase().includes(query)));
}

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
  const { toast, showToast } = useToast();
  const toasts = props.content?.labels?.toasts || {};

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
  const countOf = (status) => records.filter((item) => item.status === status).length;
  const shown = filterReviews(records, { tab, search, type, time });
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
      approve(id);
    }
  };
  const approve = (id) => {
    setRecords((current) => current.map((record) => record.id === id ? { ...record, status: "approved", aiCheck: "Pass" } : record));
    setPanel(null);
    showToast(toasts.approved || "Approved");
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
      onClear: (event) => { setSearch(""); setType("all"); setTime("all"); props.onClearFilters?.(event); },
    },
    queue: {
      items: shown,
      counts: { pending: countOf("pending"), approved: countOf("approved"), rejected: countOf("rejected") },
      onOpenDetail: ({ id }) => { setSelectedId(id); setPanel("detail"); props.onOpenDetail?.({ id }); },
      onReviewAction: action,
    },
    decision: {
      panel, selected, reason, detailSuggestions, rejectSuggestions,
      onClose: closePanel,
      onReasonChange: ({ value }) => { setReason(value); props.onReasonChange?.({ value }); },
      onConfirmReject: () => {
        if (!selected) return;
        const note = reason.trim();
        setRecords((current) => current.map((item) => item.id === selected.id ? { ...item, status: "rejected", rejectionReason: note } : item));
        setPanel(null);
        showToast(toasts.rejected || "Rejected");
        props.onConfirmReject?.({ id: selected.id, reason });
      },
      onConfirmApprove: () => { if (!selected) return; approve(selected.id); props.onConfirmApprove?.({ id: selected.id }); },
    },
    toast,
    ...workspace,
  };
}
