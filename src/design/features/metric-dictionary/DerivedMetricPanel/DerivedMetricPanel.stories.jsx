import React from "react";
import { METRIC_DICTIONARY } from "../../../demo/content/metric-dictionary.js";
import { DerivedMetricPanel, formulaOperators } from "./index.jsx";
import { bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Metric Dictionary/Derived Metric Panel",
  component: DerivedMetricPanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { description: { component: bi("This component is the derived metric drawer on Metric Dictionary. The user can edit domain, name, unit, description, synonyms, and whether the metric is enabled. The user can add basic metrics and operators to a formula. Test and Save are callbacks. The host owns the formula tokens. Set `constantOpen` to show the constant dialog.", "这是 Metric Dictionary 上的派生指标抽屉。用户可以编辑域、名称、单位、说明、同义词，以及该指标是否启用。用户可以把基础指标和运算符加入公式。Test 和 Save 都是回调。公式 token 由宿主保存。设置 `constantOpen` 可打开常量对话框。") } } },
  args: {
    open: true,
    copy: METRIC_DICTIONARY.derivedPanel,
    references: METRIC_DICTIONARY.metrics.filter((metric) => metric.category === "Basic"),
    draft: { domain: "", name: "", unit: "", description: "", synonyms: "", enabled: true },
    tokens: [],
    constantOpen: false,
    notice: "",
    invalid: [],
  },
  argTypes: {
    invalid: { control: "object", description: bi("Fields the last Save refused. `[\"name\"]` marks the metric name invalid, shows `copy.nameError` under it and moves focus to it. Send a new list for each failed save and drop `\"name\"` when the name changes.", "上一次保存被拒绝的字段。`[\"name\"]` 会把指标名称标为无效，在其下方显示 `copy.nameError`，并把焦点移到它。每次保存失败都传一个新的列表；名称一变化就去掉 `\"name\"`。") },
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
