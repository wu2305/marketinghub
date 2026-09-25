import React from "react";
const paths = {
  home: "/index.html",
  cockpit: "/assets/pages/reports.html",
  "self-service": "/assets/pages/flexible.html",
  interpreter: "/assets/pages/knowledge.html",
  campaign: "/assets/pages/campaign.html",
  "metric-dictionary": "/assets/pages/metric-dictionary.html",
};

/** Original Demo links used by P10 stories; hosts inject their own resolver. */
export function metricDictionaryHrefFor(id, params = {}) {
  const query = new URLSearchParams(params);
  return (paths[id] || paths.interpreter) + (query.size ? `?${query}` : "");
}

const emptyDraft = () => ({ domain: "", name: "", unit: "", description: "", synonyms: "", enabled: true });

/**
 * Deterministic P10 process state; accepts alternate copy and records for host reuse.
 * @param {object} options
 * @param {object} options.content page copy and initial metrics
 * @param {object} [options.initial] named story state
 * @param {Function} [options.onNavigate]
 */
export function useMetricDictionaryDemo({ content, initial = {}, hrefFor = metricDictionaryHrefFor, onNavigate, modelFlow, modelDraftFor, assistantAnswerFor } = {}) {
  const [metrics, setMetrics] = React.useState(() => [...content.metrics, ...(initial.extraMetrics || [])].map((metric) => ({ ...metric })));
  const [category, setCategory] = React.useState(initial.category || "Basic");
  const [metricId, setMetricId] = React.useState(initial.metricId || content.metrics[0]?.id);
  const [tab, setTab] = React.useState(initial.tab || "definition");
  const [panelOpen, setPanelOpen] = React.useState(Boolean(initial.panelOpen));
  const [draft, setDraft] = React.useState(() => ({ ...emptyDraft(), ...initial.draft }));
  const [tokens, setTokens] = React.useState(() => initial.tokens || []);
  const [constantOpen, setConstantOpen] = React.useState(Boolean(initial.constantOpen));
  const [notice, setNotice] = React.useState(initial.notice || "");
  const noticeTimer = React.useRef(null);
  const clearNoticeTimer = () => {
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = null;
  };
  const showNotice = (message, transient = false) => {
    clearNoticeTimer();
    setNotice(message);
    if (transient) noticeTimer.current = window.setTimeout(() => {
      setNotice("");
      noticeTimer.current = null;
    }, 3000);
  };
  React.useEffect(() => () => window.clearTimeout(noticeTimer.current), []);
  const [assistantOpen, setAssistantOpen] = React.useState(Boolean(initial.assistantOpen));
  const [assistantPrompt, setAssistantPrompt] = React.useState(initial.assistantPrompt || "");
  const [assistantAnswers, setAssistantAnswers] = React.useState(initial.assistantAnswers || []);
  const [selectedSkill, setSelectedSkill] = React.useState(initial.selectedSkill || null);
  const [flow, setFlow] = React.useState(initial.flow || null);

  React.useEffect(() => setCategory(initial.category || "Basic"), [initial.category]);
  React.useEffect(() => setTab(initial.tab || "definition"), [initial.tab]);
  React.useEffect(() => setPanelOpen(Boolean(initial.panelOpen)), [initial.panelOpen]);
  // A new fixture is a new dataset: discard local derived records and select a
  // valid metric from it. Ordinary user edits keep their records until then.
  const sourceMetricsRef = React.useRef(content.metrics);
  React.useEffect(() => {
    if (sourceMetricsRef.current === content.metrics) return;
    sourceMetricsRef.current = content.metrics;
    setCategory(initial.category || "Basic");
    setMetrics([...content.metrics, ...(initial.extraMetrics || [])].map((metric) => ({ ...metric })));
    setMetricId(content.metrics.some((metric) => metric.id === initial.metricId) ? initial.metricId : content.metrics[0]?.id);
  }, [content.metrics, initial.category, initial.extraMetrics, initial.metricId]);
  React.useEffect(() => {
    if (!initial.metricId) return;
    setMetricId(initial.metricId);
  }, [initial.metricId]);
  React.useEffect(() => setConstantOpen(Boolean(initial.constantOpen)), [initial.constantOpen]);

  const closePanel = () => {
    setPanelOpen(false);
    setDraft(emptyDraft());
    setTokens([]);
    setConstantOpen(false);
    showNotice("");
  };
  const addToken = ({ type, value, label }) => {
    setTokens((current) => [...current, { type, value, label: label || String(value) }]);
  };
  const onOperator = ({ operator }) => {
    if (operator === "clear") setTokens([]);
    else if (operator === "backspace") setTokens((current) => current.slice(0, -1));
    else if (operator === "const") setConstantOpen(true);
    else addToken({ type: operator === "(" || operator === ")" ? "parenthesis" : "operator", value: operator });
  };
  const onReference = ({ metric }) => {
    addToken({ type: "metric", value: metric.source, label: metric.name });
    showNotice(content.derivedPanel.addedMetric(metric.name), true);
  };
  const onTest = () => {
    showNotice(tokens.length ? content.derivedPanel.testResult : content.derivedPanel.formulaError, tokens.length > 0);
  };
  const onSave = () => {
    const name = draft.name.trim();
    if (!name) {
      showNotice(content.derivedPanel.nameError);
      return;
    }
    const newMetric = {
      id: `derived-local-${metrics.length + 1}`,
      name,
      category: "Derived",
      desc: draft.description.trim() || name,
      owner: "Current User",
      unit: draft.unit.trim() || "Count",
      precision: "2 decimals",
      status: "Draft",
      formula: tokens.map((token) => token.value).join(" "),
      synonyms: draft.synonyms.split(",").map((value) => value.trim()).filter(Boolean),
    };
    setMetrics((current) => [...current, newMetric]);
    setMetricId(newMetric.id);
    setCategory("Derived");
    closePanel();
    showNotice(content.derivedPanel.savedMetric(name), true);
  };
  const handleNavigate = ({ id, params = {}, href }) => onNavigate?.({ id, params, href: href || hrefFor(id, params) });

  return {
    hrefFor, metrics, category, metricId, tab,
    onNavigate: handleNavigate,
    onSelect: ({ id }) => setMetricId(id),
    onCategoryChange: ({ category: next }) => setCategory(next),
    onTabChange: ({ tab: next }) => setTab(next),
    derivedEditor: {
      open: panelOpen, draft, tokens, constantOpen, notice,
      onOpen: () => { setPanelOpen(true); showNotice(""); },
      onCancel: closePanel,
      onDraftChange: ({ field, value }) => setDraft((current) => ({ ...current, [field]: value })),
      onOperator,
      onReference,
      onRemoveToken: ({ index }) => setTokens((current) => current.filter((_, i) => i !== index)),
      onConstantCancel: () => setConstantOpen(false),
      onConstantAdd: ({ value }) => {
        const number = Number.parseFloat(value);
        if (Number.isFinite(number)) addToken({ type: "constant", value: number, label: String(number) });
        setConstantOpen(false);
      },
      onTest,
      onSave,
      onDismissNotice: () => showNotice(""),
    },
    assistantState: {
      open: assistantOpen, prompt: assistantPrompt, answers: assistantAnswers, selectedSkill,
      skillFlow: flow ? {
        step: flow.step, threads: flow.threads, rule: flow.rule, draft: flow.draft,
        sections: modelFlow?.sections || [],
        onToggleMessage: ({ threadIndex, messageIndex, checked }) => setFlow((current) => ({
          ...current, threads: current.threads.map((thread, ti) => ti === threadIndex
            ? { ...thread, messages: thread.messages.map((message, mi) => mi === messageIndex ? { ...message, checked } : message) }
            : thread),
        })),
        onRuleChange: ({ value }) => setFlow((current) => ({ ...current, rule: value })),
        onGenerate: ({ messages, rule }) => setFlow((current) => ({ ...current, step: "generated", rule, draft: modelDraftFor?.(messages, rule) || {} })),
        onBack: () => setFlow((current) => ({ ...current, step: "history" })),
        onClose: () => setFlow(null),
      } : null,
      onOpen: () => setAssistantOpen(true),
      onClose: () => setAssistantOpen(false),
      onPromptChange: ({ value }) => setAssistantPrompt(value),
      onSuggestion: ({ prompt }) => setAssistantPrompt(prompt),
      onHistorySelect: ({ prompt }) => setAssistantPrompt(prompt),
      onSelectSkill: ({ id, type, title }) => setSelectedSkill({ id, type, title }),
      onClearSkill: () => setSelectedSkill(null),
      onSkillAction: ({ action }) => {
        if (!modelFlow) return;
        setFlow({
          step: action === "history" ? "history" : "manual",
          threads: (modelFlow.threads || []).map((thread) => ({
            ...thread, messages: thread.messages.map((message) => ({ ...message })),
          })),
          rule: "", draft: {},
        });
      },
      onSubmit: ({ prompt }) => {
        const query = (prompt || assistantPrompt).trim();
        if (!query) return;
        setAssistantAnswers([assistantAnswerFor?.(query) || { query, variant: "simple", lead: "I will use the AI Interpreter knowledge context to answer:" }]);
        setAssistantPrompt("");
      },
      onNewSession: () => { setAssistantPrompt(""); setAssistantAnswers([]); },
    },
  };
}
