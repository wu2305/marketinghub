import { LOGO, NAV, MODEL_FLOW, buildModelDraft, buildLiteAssistantAnswer } from "../../content.js";
import { METRIC_ASSISTANT, METRIC_DICTIONARY } from "../../demo/content/metric-dictionary.js";
import { useMetricDictionaryDemo } from "../../demo/metric-dictionary-demo.js";
import { bi } from "../../lib/story-helpers.js";
import { MetricDictionaryPage, metricCategories, metricDetailTabs } from "./index.jsx";

export default {
  title: "Pages",
  tags: ["autodocs"],
  component: MetricDictionaryPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi("This page is Metric Dictionary. It shows Basic and Derived metrics. To build this page, set the list, the selected metric, and the detail tabs. The tabs are Definition, Formula, and Dimensions. Set `derivedEditor` to open the Add derived drawer. The assistant is the lite drawer.", "这是 Metric Dictionary 页面。它列出 Basic 和 Derived 指标。组合页面时，设置列表、当前指标和详情标签。标签是 Definition、Formula 和 Dimensions。用 `derivedEditor` 打开 Add derived 抽屉。助手是轻量抽屉。"),
      },
    },
  },
  args: {
    logo: LOGO,
    navigation: NAV,
    content: METRIC_DICTIONARY,
    assistant: METRIC_ASSISTANT,
    category: "Basic",
    tab: "definition",
    panelOpen: false,
    constantOpen: false,
    metricId: "promotion_daily.exposure_count",
  },
  argTypes: {
    category: { control: "inline-radio", options: metricCategories, description: bi("Metric list. Values are Basic and Derived.", "指标列表。取值是 Basic 和 Derived。") },
    tab: { control: "inline-radio", options: metricDetailTabs, description: bi("Detail tab. Values are definition, formula, and dimensions.", "详情标签。取值是 definition、formula 和 dimensions。") },
    panelOpen: { control: "boolean", description: bi("Set true to open the Add derived drawer.", "设为 true 时打开 Add derived 抽屉。") },
    constantOpen: { control: "boolean", description: bi("Set true to open the constant pad in the formula builder.", "设为 true 时打开公式构建器里的常数面板。") },
    onNavigate: { action: "onNavigate", description: bi("The function runs when a crumb or a nav link opens another page. The result has `id`, `params`, and `href`.", "面包屑或导航要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。") },
    onCategoryChange: { action: "onCategoryChange", description: bi("The function runs when the user selects Basic or Derived. The result has `category`.", "用户选择 Basic 或 Derived 时，会调用这个函数。结果里有 `category`。") },
    onSelect: { action: "onSelect", description: bi("The function runs when the user selects a metric. The result has `id`.", "用户选择一项指标时，会调用这个函数。结果里有 `id`。") },
    onTabChange: { action: "onTabChange", description: bi("The function runs when the user selects a detail tab. The result has `tab`.", "用户选择详情标签时，会调用这个函数。结果里有 `tab`。") },
    onOpen: { action: "onOpen", description: bi("The function runs when the user opens Add derived.", "用户打开 Add derived 时，会调用这个函数。") },
    onCancel: { action: "onCancel", description: bi("The function runs when the user closes the Add derived drawer. The result has `reason`.", "用户关闭 Add derived 抽屉时，会调用这个函数。结果里有 `reason`。") },
    onDraftChange: { action: "onDraftChange", description: bi("The function runs at each change in the derived form. The result has `field` and `value`.", "派生表单每次变化都会调用这个函数。结果里有 `field` 和 `value`。") },
    onOperator: { action: "onOperator", description: bi("The function runs when the user picks a formula operator. The result has `operator`.", "用户选择公式运算符时，会调用这个函数。结果里有 `operator`。") },
    onReference: { action: "onReference", description: bi("The function runs when the user inserts a basic metric. The result has `metric`.", "用户插入一项基础指标时，会调用这个函数。结果里有 `metric`。") },
    onRemoveToken: { action: "onRemoveToken", description: bi("The function runs when the user removes a formula token. The result has `index`.", "用户删除一个公式标记时，会调用这个函数。结果里有 `index`。") },
    onConstantAdd: { action: "onConstantAdd", description: bi("The function runs when the user inserts a constant. The result has `value`.", "用户插入常数时，会调用这个函数。结果里有 `value`。") },
    onTest: { action: "onTest", description: bi("The function runs when the user tests the formula.", "用户测试公式时，会调用这个函数。") },
    onSave: { action: "onSave", description: bi("The function runs when the user saves a derived metric.", "用户保存派生指标时，会调用这个函数。") },
  },
  render: function MetricDictionaryStory(args) {
    const demo = useMetricDictionaryDemo({
      content: args.content,
      initial: {
        category: args.category, tab: args.tab, panelOpen: args.panelOpen,
        constantOpen: args.constantOpen, metricId: args.metricId,
        tokens: args.tokens, draft: args.draft, notice: args.notice, extraMetrics: args.extraMetrics,
        assistantOpen: args.assistantOpen, assistantPrompt: args.assistantPrompt,
        assistantAnswers: args.assistantAnswers, selectedSkill: args.selectedSkill, flow: args.flow,
      },
      onNavigate: args.onNavigate,
      modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, assistantAnswerFor: buildLiteAssistantAnswer,
    });
    const derivedEditor = {
      ...demo.derivedEditor,
      onOpen: () => { demo.derivedEditor.onOpen(); args.onOpen?.(); },
      onCancel: (event) => { demo.derivedEditor.onCancel(event); args.onCancel?.(event); },
      onDraftChange: (event) => { demo.derivedEditor.onDraftChange(event); args.onDraftChange?.(event); },
      onOperator: (event) => { demo.derivedEditor.onOperator(event); args.onOperator?.(event); },
      onReference: (event) => { demo.derivedEditor.onReference(event); args.onReference?.(event); },
      onRemoveToken: (event) => { demo.derivedEditor.onRemoveToken(event); args.onRemoveToken?.(event); },
      onConstantAdd: (event) => { demo.derivedEditor.onConstantAdd(event); args.onConstantAdd?.(event); },
      onTest: () => { demo.derivedEditor.onTest(); args.onTest?.(); },
      onSave: () => { demo.derivedEditor.onSave(); args.onSave?.(); },
    };
    return <MetricDictionaryPage {...args} {...demo} derivedEditor={derivedEditor} assistant={{ ...args.assistant, ...demo.assistant }} onCategoryChange={(event) => { demo.onCategoryChange(event); args.onCategoryChange?.(event); }} onSelect={(event) => { demo.onSelect(event); args.onSelect?.(event); }} onTabChange={(event) => { demo.onTabChange(event); args.onTabChange?.(event); }} />;
  },
};

export const MetricDictionary = { name: "Metric Dictionary" };
export const MetricDictionaryDerived = { name: "Metric Dictionary · Derived", args: { category: "Derived" } };
export const MetricDictionaryFormula = { name: "Metric Dictionary · Formula", args: { tab: "formula" } };
export const MetricDictionaryDimensions = { name: "Metric Dictionary · Dimensions", args: { tab: "dimensions" } };
export const MetricDictionaryDerivedDetail = { name: "Metric Dictionary · Derived detail", args: { category: "Derived", metricId: "effective-traffic" } };
export const MetricDictionaryAddDerived = { name: "Metric Dictionary · Add derived", args: { panelOpen: true } };
export const MetricDictionaryFormulaTokens = { name: "Metric Dictionary · Formula tokens", args: { panelOpen: true, tokens: [{ type: "metric", value: "fact_promotion_daily.exposure_count", label: "Exposure Count" }, { type: "operator", value: "+", label: "+" }] } };
export const MetricDictionaryConstant = { name: "Metric Dictionary · Add constant", args: { panelOpen: true, constantOpen: true } };
export const MetricDictionaryNameRequired = { name: "Metric Dictionary · Name required", args: { panelOpen: true, notice: METRIC_DICTIONARY.derivedPanel.nameError } };
export const MetricDictionaryTestEmpty = { name: "Metric Dictionary · Test without formula", args: { panelOpen: true, notice: METRIC_DICTIONARY.derivedPanel.formulaError } };
export const MetricDictionaryTestResult = { name: "Metric Dictionary · Test result", args: { panelOpen: true, tokens: [{ type: "metric", value: "fact_promotion_daily.exposure_count", label: "Exposure Count" }], notice: METRIC_DICTIONARY.derivedPanel.testResult } };
export const MetricDictionarySaved = { name: "Metric Dictionary · Saved Draft", args: { category: "Derived", metricId: "derived-local-10", extraMetrics: [{ id: "derived-local-10", name: "New metric", category: "Derived", desc: "New metric", owner: "Current User", unit: "Count", precision: "2 decimals", status: "Draft", formula: "", synonyms: [] }], notice: METRIC_DICTIONARY.derivedPanel.savedMetric("New metric") } };
export const MetricDictionaryAssistant = { name: "Metric Dictionary · Assistant", args: { assistantOpen: true } };
export const MetricDictionaryAssistantPrompt = { name: "Metric Dictionary · Assistant prompt", args: { assistantOpen: true, assistantPrompt: "Definition of Attributed ROI" } };
export const MetricDictionaryAssistantAnswer = { name: "Metric Dictionary · Assistant answer", args: { assistantOpen: true, assistantAnswers: [buildLiteAssistantAnswer("Definition of Attributed ROI")] } };
export const MetricDictionaryAssistantHistory = { name: "Metric Dictionary · Assistant history", args: { assistantOpen: true }, play: async ({ canvasElement }) => { canvasElement.ownerDocument.querySelector('.mh-assistant [aria-label="History"]')?.click(); } };
export const MetricDictionaryAssistantHistoryPick = { name: "Metric Dictionary · Assistant history pick", args: { assistantOpen: true, assistantPrompt: METRIC_ASSISTANT.history[0].prompt } };
export const MetricDictionaryAssistantExpanded = { name: "Metric Dictionary · Assistant expanded", args: { assistantOpen: true }, play: async ({ canvasElement }) => { canvasElement.ownerDocument.querySelector('.mh-assistant [aria-label="Maximize"]')?.click(); } };
export const MetricDictionaryAssistantSkillMenu = { name: "Metric Dictionary · Assistant skill menu", args: { assistantOpen: true }, play: async ({ canvasElement }) => { canvasElement.ownerDocument.querySelector('.mh-assistant [aria-label="Choose AI skill"]')?.click(); } };
export const MetricDictionaryAssistantSkillSelected = { name: "Metric Dictionary · Assistant skill selected", args: { assistantOpen: true, selectedSkill: { id: "playbook-opportunity-scan", type: "Analytical Model", title: "Opportunity scan playbook" } } };
export const MetricDictionaryModelHistory = { name: "Metric Dictionary · Generate model", args: { assistantOpen: true, flow: { step: "history", threads: MODEL_FLOW.threads, rule: "", draft: {} } } };
export const MetricDictionaryModelManual = { name: "Metric Dictionary · Manual model", args: { assistantOpen: true, flow: { step: "manual", threads: MODEL_FLOW.threads, rule: "", draft: {} } } };
export const MetricDictionaryModelGenerated = { name: "Metric Dictionary · Generated model", args: { assistantOpen: true, flow: { step: "generated", threads: MODEL_FLOW.threads, rule: "", draft: buildModelDraft([], "") } } };
export const MetricDictionaryQaDisabled = { name: "Metric Dictionary · Q&A disabled", play: async ({ canvasElement }) => { canvasElement.querySelector(".mh-metric-page__toggle input")?.click(); } };
export const MetricDictionaryDimensionDisabled = { name: "Metric Dictionary · Dimension disabled", args: { tab: "dimensions" }, play: async ({ canvasElement }) => { canvasElement.querySelector(".mh-metric-page__dimension-grid input")?.click(); } };
