import React from "react";

const EMPTY_ANSWERS = [];

/** Deterministic replacement for flexible.html's createAnswer(). */
export function buildSelfServiceAnswer(query) {
  return {
    query,
    variant: "workspace",
    banner: "AI Response",
    context: "Context: Reports",
    body: "Based on current report data and flexible analysis views, here are the key findings.",
    findings: [
      { label: "Media Monitoring", detail: "DG MZ data shows consistent channel performance with Rednote leading in engagement metrics." },
      { label: "Data Upload Status", detail: "Last offline data upload was validated successfully — 341 records processed." },
      { label: "Cross-Channel Comparison", detail: "City Strategy reports show 10% traffic uplift in invest cities across all monitored channels." },
    ],
    sources: [
      "Flexible Analysis / DG MZ Data",
      "Performance Tracking / City Strategy",
      "Data Upload / Validated Records",
    ],
  };
}

/**
 * Self-Service's local demo flow, shared by Storybook and independent hosts.
 * The original page keeps one answer at a time, auto-submits suggestions,
 * and only fills the composer when a recent chat is selected.
 * @param {object} props SelfServicePage data, initial state and callbacks
 * @param {{ answerFor?: (query: string) => object, modelFlow?: object, modelDraftFor?: (messages: object[], rule: string) => object }} [props.demo]
 * @returns {object} fully wired SelfServicePage props
 */
export function useSelfServiceDemo(props) {
  const [tab, setTab] = React.useState(props.tab || "analysis");
  const [categories, setCategories] = React.useState({ analysis: props.category || "all", upload: "all" });
  const [historyItem, setHistoryItem] = React.useState(null);
  const [open, setOpen] = React.useState(Boolean(props.assistant?.open));
  const [prompt, setPrompt] = React.useState(props.assistant?.prompt || "");
  const [answers, setAnswers] = React.useState(props.assistant?.answers || EMPTY_ANSWERS);
  const [skill, setSkill] = React.useState(null);
  const [flow, setFlow] = React.useState(null);

  React.useEffect(() => setTab(props.tab || "analysis"), [props.tab]);
  React.useEffect(() => setCategories((current) => ({ ...current, analysis: props.category || "all" })), [props.category]);
  React.useEffect(() => setOpen(Boolean(props.assistant?.open)), [props.assistant?.open]);
  React.useEffect(() => setPrompt(props.assistant?.prompt || ""), [props.assistant?.prompt]);
  React.useEffect(() => setAnswers(props.assistant?.answers || EMPTY_ANSWERS), [props.assistant?.answers]);

  const answerFor = props.demo?.answerFor || buildSelfServiceAnswer;
  const modelFlow = props.demo?.modelFlow;
  const submit = (value) => {
    const query = String(value || "").trim();
    if (!query) return;
    const answer = answerFor(query);
    if (answer) setAnswers([answer]);
    setPrompt("");
  };
  const openFlow = (action) => {
    if (!modelFlow) return;
    setFlow({
      step: action === "history" ? "history" : "manual",
      threads: (modelFlow.threads || []).map((thread) => ({
        ...thread,
        messages: thread.messages.map((message) => ({ ...message })),
      })),
      rule: "",
      draft: {},
    });
  };

  return {
    ...props,
    tab,
    category: categories[tab] || "all",
    uploadHistory: { ...props.uploadHistory, ...(historyItem || {}) },
    onTabChange: (event) => {
      setTab(event.id);
      props.onTabChange?.(event);
    },
    onCategoryChange: (event) => {
      setCategories((current) => ({ ...current, [tab]: event.id }));
      props.onCategoryChange?.(event);
    },
    onOpenHistory: ({ item }) => {
      setHistoryItem({ open: true, rows: item.history || [] });
      props.onOpenHistory?.({ item });
    },
    onCloseHistory: (event) => {
      setHistoryItem((current) => ({ ...(current || {}), open: false }));
      props.onCloseHistory?.(event);
    },
    assistant: {
      ...props.assistant,
      open,
      prompt,
      answers,
      selectedSkill: skill,
      onOpen: (event) => {
        setOpen(true);
        props.assistant?.onOpen?.(event);
      },
      onClose: (event) => {
        setOpen(false);
        props.assistant?.onClose?.(event);
      },
      onPromptChange: (event) => {
        setPrompt(event.value);
        props.assistant?.onPromptChange?.(event);
      },
      onSubmit: (event) => {
        submit(event.prompt);
        props.assistant?.onSubmit?.(event);
      },
      onSuggestion: (event) => {
        submit(event.prompt);
        props.assistant?.onSuggestion?.(event);
      },
      onHistorySelect: (event) => {
        setPrompt(event.prompt);
        props.assistant?.onHistorySelect?.(event);
      },
      onNewSession: () => {
        setPrompt("");
        setAnswers([]);
        props.assistant?.onNewSession?.();
      },
      onSelectSkill: (event) => {
        setSkill({ id: event.id, type: event.type, title: event.title });
        props.assistant?.onSelectSkill?.(event);
      },
      onClearSkill: () => {
        setSkill(null);
        props.assistant?.onClearSkill?.();
      },
      onSkillAction: ({ action }) => {
        openFlow(action);
        props.assistant?.onSkillAction?.({ action });
      },
    },
    skillFlow: flow ? {
      step: flow.step,
      threads: flow.threads,
      rule: flow.rule,
      draft: flow.draft,
      sections: modelFlow.sections,
      labels: modelFlow,
      onToggleMessage: ({ threadIndex, messageIndex, checked }) =>
        setFlow((current) => ({ ...current, threads: current.threads.map((thread, ti) =>
          ti === threadIndex ? { ...thread, messages: thread.messages.map((message, mi) =>
            mi === messageIndex ? { ...message, checked } : message) } : thread) })),
      onRuleChange: ({ value }) => setFlow((current) => ({ ...current, rule: value })),
      onGenerate: ({ messages, rule }) => setFlow((current) => ({
        ...current,
        step: "generated",
        rule,
        draft: props.demo?.modelDraftFor?.(messages, rule) || {},
      })),
      onBack: () => setFlow((current) => ({ ...current, step: "history" })),
      onClose: () => setFlow(null),
      onSave: (event) => props.onFlowSave?.(event),
      onSubmit: (event) => props.onFlowSubmit?.(event),
    } : undefined,
  };
}
