import { LOGO, NAV, LITE_ASSISTANT, MODEL_FLOW, buildModelDraft, buildLiteAssistantAnswer } from "../../content.js";
import { METRIC_DICTIONARY } from "../../demo/content/metric-dictionary.js";
import { useMetricDictionaryDemo } from "../../demo/metric-dictionary-demo.js";
import { MetricDictionaryPage, metricCategories, metricDetailTabs } from "./index.jsx";

export default {
  title: "Pages",
  tags: ["autodocs"],
  component: MetricDictionaryPage,
  parameters: { layout: "fullscreen" },
  args: {
    logo: LOGO,
    navigation: NAV,
    content: METRIC_DICTIONARY,
    assistant: LITE_ASSISTANT,
    category: "Basic",
    tab: "definition",
    panelOpen: false,
    constantOpen: false,
    metricId: "promotion_daily.exposure_count",
  },
  argTypes: {
    category: { control: "inline-radio", options: metricCategories },
    tab: { control: "inline-radio", options: metricDetailTabs },
    panelOpen: { control: "boolean" },
    constantOpen: { control: "boolean" },
    onNavigate: { action: "onNavigate" },
    onCategoryChange: { action: "onCategoryChange" },
    onSelect: { action: "onSelect" },
    onTabChange: { action: "onTabChange" },
    onOpen: { action: "onOpen" },
    onCancel: { action: "onCancel" },
    onDraftChange: { action: "onDraftChange" },
    onOperator: { action: "onOperator" },
    onReference: { action: "onReference" },
    onRemoveToken: { action: "onRemoveToken" },
    onConstantAdd: { action: "onConstantAdd" },
    onTest: { action: "onTest" },
    onSave: { action: "onSave" },
  },
  render: function MetricDictionaryStory(args) {
    const demo = useMetricDictionaryDemo({
      content: args.content,
      initial: {
        category: args.category, tab: args.tab, panelOpen: args.panelOpen,
        constantOpen: args.constantOpen, metricId: args.metricId,
        tokens: args.tokens, draft: args.draft, notice: args.notice, extraMetrics: args.extraMetrics,
        assistantOpen: args.assistantOpen, assistantPrompt: args.assistantPrompt,
      },
      onNavigate: args.onNavigate,
      modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, assistantAnswerFor: buildLiteAssistantAnswer,
    });
    return <MetricDictionaryPage {...args} {...demo} onCategoryChange={(event) => { demo.onCategoryChange(event); args.onCategoryChange?.(event); }} onSelect={(event) => { demo.onSelect(event); args.onSelect?.(event); }} onTabChange={(event) => { demo.onTabChange(event); args.onTabChange?.(event); }} onOpen={() => { demo.onOpen(); args.onOpen?.(); }} onCancel={(event) => { demo.onCancel(event); args.onCancel?.(event); }} onDraftChange={(event) => { demo.onDraftChange(event); args.onDraftChange?.(event); }} onOperator={(event) => { demo.onOperator(event); args.onOperator?.(event); }} onReference={(event) => { demo.onReference(event); args.onReference?.(event); }} onRemoveToken={(event) => { demo.onRemoveToken(event); args.onRemoveToken?.(event); }} onConstantAdd={(event) => { demo.onConstantAdd(event); args.onConstantAdd?.(event); }} onTest={() => { demo.onTest(); args.onTest?.(); }} onSave={() => { demo.onSave(); args.onSave?.(); }} />;
  },
};

export const MetricDictionary = { name: "Metric Dictionary" };
export const MetricDictionaryDerived = { name: "Metric Dictionary · Derived", args: { category: "Derived" } };
export const MetricDictionaryFormula = { name: "Metric Dictionary · Formula", args: { tab: "formula" } };
export const MetricDictionaryDimensions = { name: "Metric Dictionary · Dimensions", args: { tab: "dimensions" } };
export const MetricDictionaryDerivedDetail = { name: "Metric Dictionary · Derived detail", args: { category: "Derived", metricId: "effective-traffic" } };
export const MetricDictionaryAddDerived = { name: "Metric Dictionary · Add derived", args: { panelOpen: true } };
export const MetricDictionaryFormulaTokens = { name: "Metric Dictionary · Formula tokens", args: { panelOpen: true, tokens: [{ type: "metric", value: "fact_promotion_daily.exposure_count", label: "Exposure Count" }, { type: "operator", value: "+", label: "+" }, { type: "constant", value: 100, label: "100" }] } };
export const MetricDictionaryConstant = { name: "Metric Dictionary · Add constant", args: { panelOpen: true, constantOpen: true } };
export const MetricDictionaryNameRequired = { name: "Metric Dictionary · Name required", args: { panelOpen: true, notice: METRIC_DICTIONARY.derivedPanel.nameError } };
export const MetricDictionaryTestEmpty = { name: "Metric Dictionary · Test without formula", args: { panelOpen: true, notice: METRIC_DICTIONARY.derivedPanel.formulaError } };
export const MetricDictionaryTestResult = { name: "Metric Dictionary · Test result", args: { panelOpen: true, tokens: [{ type: "metric", value: "fact_promotion_daily.exposure_count", label: "Exposure Count" }], notice: METRIC_DICTIONARY.derivedPanel.testResult } };
export const MetricDictionarySaved = { name: "Metric Dictionary · Saved Draft", args: { category: "Derived", metricId: "derived-local-10", extraMetrics: [{ id: "derived-local-10", name: "New metric", category: "Derived", desc: "New metric", owner: "Current User", unit: "Count", precision: "2 decimals", status: "Draft", formula: "", synonyms: [] }], notice: METRIC_DICTIONARY.derivedPanel.savedMetric("New metric") } };
export const MetricDictionaryAssistant = { name: "Metric Dictionary · Assistant", args: { assistantOpen: true } };
