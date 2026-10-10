import React from "react";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

const EMPTY_ANSWERS = [];
const NO_INVALID = [];

const paths = {
  home: "/index.html",
  cockpit: "/assets/pages/reports.html",
  "self-service": "/assets/pages/flexible.html",
  interpreter: "/assets/pages/knowledge.html",
  campaign: "/assets/pages/campaign.html",
  "metric-dictionary": "/assets/pages/metric-dictionary.html",
};

/** Original Demo links used by P10 stories; hosts inject their own resolver. */
function metricDictionaryHrefFor(id, params = {}) {
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
 * @param {Function} [options.hrefFor]
 * @param {object} [options.modelFlow]
 * @param {Function} [options.modelDraftFor]
 * @param {Function} [options.assistantAnswerFor]
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
  const [invalid, setInvalid] = React.useState(initial.invalid || NO_INVALID);
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
  const workspace = useWorkspaceAssistantDemo({
    variant: "lite",
    initial,
    assistant: { open: Boolean(initial.assistantOpen), prompt: initial.assistantPrompt || "", answers: initial.assistantAnswers || EMPTY_ANSWERS },
    demo: { answerFor: assistantAnswerFor, modelFlow, modelDraftFor },
  });

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
    setInvalid(NO_INVALID);
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
      /* The name field says so itself (a new list refocuses it each time); the notice stays for formula messages. */
      showNotice("");
      setInvalid(["name"]);
      return false;
    }
    setInvalid(NO_INVALID);
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
    return true;
  };
  const handleNavigate = ({ id, params = {}, href }) => onNavigate?.({ id, params, href: href || hrefFor(id, params) });

  return {
    hrefFor, metrics, category, metricId, tab,
    onNavigate: handleNavigate,
    onSelect: ({ id }) => setMetricId(id),
    onCategoryChange: ({ category: next }) => setCategory(next),
    onTabChange: ({ tab: next }) => setTab(next),
    derivedEditor: {
      open: panelOpen, draft, tokens, constantOpen, notice, invalid,
      onOpen: () => { setPanelOpen(true); showNotice(""); },
      onCancel: closePanel,
      onDraftChange: ({ field, value }) => { setDraft((current) => ({ ...current, [field]: value })); setInvalid((current) => (current.includes(field) ? current.filter((item) => item !== field) : current)); },
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
    assistant: workspace.assistant,
    skillFlow: workspace.skillFlow,
  };
}
