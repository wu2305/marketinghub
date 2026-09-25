import React from "react";
import { METRIC_DICTIONARY } from "../../../demo/content/metric-dictionary.js";
import { DerivedMetricPanel, formulaOperators } from "./index.jsx";

export default {
  title: "Features/Metric Dictionary/Derived Metric Panel",
  component: DerivedMetricPanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { description: { component: "P10 derived metric drawer: controlled form fields, basic metric references, token formula toolbar, test, constant dialog, and Save callbacks. The story writes field and formula changes back to the canvas." } } },
  args: {
    open: true,
    copy: METRIC_DICTIONARY.derivedPanel,
    references: METRIC_DICTIONARY.metrics.filter((metric) => metric.category === "Basic"),
    draft: { domain: "", name: "", unit: "", description: "", synonyms: "", enabled: true },
    tokens: [],
    constantOpen: false,
    notice: "",
  },
  argTypes: {
    onCancel: { action: "onCancel" },
    onChange: { action: "onChange" },
    onOperator: { action: "onOperator" },
    onReference: { action: "onReference" },
    onRemoveToken: { action: "onRemoveToken" },
    onTest: { action: "onTest" },
    onSave: { action: "onSave" },
  },
  render: function DerivedPanelStory(args) {
    const [draft, setDraft] = React.useState(args.draft);
    const [tokens, setTokens] = React.useState(args.tokens);
    return <DerivedMetricPanel {...args} draft={draft} tokens={tokens} onChange={(event) => { setDraft((current) => ({ ...current, [event.field]: event.value })); args.onChange?.(event); }} onReference={(event) => { setTokens((current) => [...current, { type: "metric", value: event.metric.source, label: event.metric.name }]); args.onReference?.(event); }} onOperator={(event) => { if (event.operator === "clear") setTokens([]); else if (event.operator === "backspace") setTokens((current) => current.slice(0, -1)); else if (formulaOperators.includes(event.operator) && event.operator !== "const") setTokens((current) => [...current, { type: "operator", value: event.operator, label: event.operator }]); args.onOperator?.(event); }} onRemoveToken={(event) => { setTokens((current) => current.filter((_, index) => index !== event.index)); args.onRemoveToken?.(event); }} />;
  },
};

export const Default = {};
