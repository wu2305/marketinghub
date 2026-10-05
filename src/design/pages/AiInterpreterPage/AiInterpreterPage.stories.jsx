import React from "react";
import { INTERPRETER, MODEL_FLOW, buildModelDraft } from "../../content.js";
import { buildInterpreterAnswer, useInterpreterDemo } from "../../demo/interpreter-demo.js";
import { callbackProp, enumProp, pageShell, useSynced, bi } from "../../lib/story-helpers.js";
import { AiInterpreterPage } from "./index.jsx";

export default {
  title: "Pages",
  component: AiInterpreterPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi("This page is AI Interpreter. It is the knowledge workspace. A composing engineer sets the header, the header image area, the metric blocks, the type list, and the assistant. The overview shows eight knowledge types. Set `activeType` to open one type. Business Terms, Analytical Models, and Scenario Reports show a `!` icon under the metric block when `manageable` is true. The icon aligns with the right edge of the metric block. Hover or keyboard focus opens a tip above the icon. The tip can overflow the header image area. The tip opens upward, so it does not cover Add. The tip lines are: Only knowledge created by you can be managed. Disable knowledge before editing or deleting it. Deletion is permanent and cannot be undone. Disabled knowledge is unavailable for AI use and can be enabled again. Scenario Reports on this page is a knowledge type. It is not Skill Library, Scenario Detail, or Skill Edit.", "这是 AI Interpreter 页面，也是知识工作台。组合页面时，设置页头、头图区、指标块、类型列表和助手。概览显示八类知识。用 `activeType` 打开其中一类。当 `manageable` 为 true 时，Business Terms、Analytical Models 和 Scenario Reports 会在指标块下方显示 `!` 图标。图标和指标块右边缘对齐。鼠标悬停或键盘聚焦时，提示框从图标上方展开。头图区允许提示框溢出。提示框向上打开，所以不会挡住 Add。提示文案是：Only knowledge created by you can be managed. Disable knowledge before editing or deleting it. Deletion is permanent and cannot be undone. Disabled knowledge is unavailable for AI use and can be enabled again. 本页的 Scenario Reports 是一种知识类型。它不是 Skill Library、Scenario Detail 或 Skill Edit。"),
      },
    },
  },
};

export const Interpreter = {
  name: "AI Interpreter",
  args: {
    activeType: "overview",
    query: "",
    ...pageShell,
    hero: INTERPRETER.hero,
    overviewItem: INTERPRETER.overview,
    sidebarTitle: INTERPRETER.sidebarTitle,
    copy: INTERPRETER.copy,
    types: INTERPRETER.types,
    records: INTERPRETER.records,
    principles: {
      items: INTERPRETER.principles,
      strings: INTERPRETER.principlesLibrary,
      selectedCategories: [],
      page: 1,
      pageSize: 10,
      expanded: [],
    },
    fieldLibrary: INTERPRETER.fieldLibrary,
    scenarioReports: INTERPRETER.scenarioReports,
    assistant: { ...INTERPRETER.assistant, open: false, prompt: "" },
  },
  argTypes: {
    hrefFor: { control: false, description: bi("Set this function to turn a route id into an href. The story and the host supply it.", "用这个函数把路由 id 转成 href。由故事或宿主提供。") },
    activeType: enumProp(["overview", "unknown-type", ...INTERPRETER.types.map((type) => type.id)], "overview", bi("Selected knowledge view. `unknown-type` shows the empty unknown state.", "当前选中的知识视图。`unknown-type` 会显示未知类型的空状态。")),
    onNavigate: callbackProp("onNavigate", "({id, params, href, typeId}) => void", { id: "interpreter", params: { type: "Business Term" }, href: "/assets/pages/knowledge.html?type=Business%20Term", typeId: "overview" }, bi("The function runs when a link opens another page. The demo hook adds `typeId`.", "链接要打开另一页时会调用这个函数。demo hook 会补上 `typeId`。")),
    onSelectType: callbackProp("onSelectType", "({id, label, typeId}) => void", { id: "Business Term", label: "Business Terms", typeId: "overview" }, bi("The function runs when a knowledge type is selected. `typeId` is the type that was active.", "选中一种知识类型时会调用这个函数。`typeId` 是之前处于激活状态的类型。")),
    onQueryChange: callbackProp("onQueryChange", "({name?, value, typeId}) => void", { name: "search", value: "gmv", typeId: "Business Term" }, bi("The function runs when search text changes. The demo hook adds `typeId`.", "搜索文字变化时会调用这个函数。demo hook 会补上 `typeId`。")),
    onFilterChange: callbackProp("onFilterChange", "({id, value, typeId}) => void", { id: "process", value: "Published", typeId: "Scenario Reporting" }, bi("The function runs when a Scenario Reports select filter changes. The result has `id`, `value`, and `typeId`.", "Scenario Reports 的下拉筛选变化时会调用这个函数。结果里有 `id`、`value` 和 `typeId`。")),
    onCreate: callbackProp("onCreate", "({href, typeId}) => void", { href: "/assets/pages/knowledge-create.html?type=Business%20Term", typeId: "Business Term" }, bi("The function runs when Add opens Knowledge create. The result has `href` and `typeId`.", "Add 打开 Knowledge create 时会调用这个函数。结果里有 `href` 和 `typeId`。")),
    onToggleCategory: callbackProp("onToggleCategory", "({id, checked, typeId}) => void", { id: "System", checked: true, typeId: "Principles" }, bi("The function runs when a Principles Category checkbox changes. The result has `id`, `checked`, and `typeId`.", "Principles 的 Category 复选框变化时会调用这个函数。结果里有 `id`、`checked` 和 `typeId`。")),
    onPage: callbackProp("onPage", "({page, typeId}) => void", { page: 2, typeId: "Business Term" }, bi("The function runs on Previous or Next. The result has `page` and `typeId`.", "点击 Previous 或 Next 时会调用这个函数。结果里有 `page` 和 `typeId`。")),
    onPageSize: callbackProp("onPageSize", "({pageSize, typeId}) => void", { pageSize: 20, typeId: "Business Term" }, bi("The function runs when rows per page change. The result has `pageSize` and `typeId`.", "每页条数变化时会调用这个函数。结果里有 `pageSize` 和 `typeId`。")),
    onToggleExpand: callbackProp("onToggleExpand", "({id, expanded, typeId}) => void", { id: "principle-04", expanded: true, typeId: "Principles" }, bi("The function runs when a Principles description expands or collapses. The result has `id`, `expanded`, and `typeId`.", "Principles 描述展开或收起时会调用这个函数。结果里有 `id`、`expanded` 和 `typeId`。")),
    onFilterToggle: callbackProp("onFilterToggle", "({id, value, checked, typeId}) => void", { id: "status", value: "Disable", checked: true, typeId: "Business Term" }, bi("The function runs when a checkbox filter changes. The result has `id`, `value`, `checked`, and `typeId`.", "复选框筛选变化时会调用这个函数。结果里有 `id`、`value`、`checked` 和 `typeId`。")),
    onOpen: callbackProp("onOpen", "({id, typeId}) => void", { id: "business-term-gmv", typeId: "Business Term" }, bi("The function runs when a card opens the detail drawer. The result has `id` and `typeId`.", "卡片打开详情抽屉时会调用这个函数。结果里有 `id` 和 `typeId`。")),
    onCloseDetail: callbackProp("onCloseDetail", "({reason, typeId}) => void", { reason: "button", typeId: "Business Term" }, bi("The function runs when the detail drawer closes. The result has `reason` and `typeId`.", "详情抽屉关闭时会调用这个函数。结果里有 `reason` 和 `typeId`。")),
    onAction: callbackProp("onAction", "({action, id, blocked, reason, typeId}) => void", { action: "edit", id: "business-term-gmv", blocked: true, reason: "disable-first", typeId: "Business Term" }, bi("The function runs on Edit, Delete, or Disable. A blocked click still runs. The demo hook adds `typeId`.", "Edit、Delete 或 Disable 时会调用这个函数。被阻止的点击也会调用。demo hook 会补上 `typeId`。")),
    onDialogConfirm: callbackProp("onDialogConfirm", "({confirmed, typeId}) => void", { confirmed: true, typeId: "Business Term" }, bi("The function runs on the confirm dialog primary action. The result has `confirmed` and `typeId`.", "确认对话框的主操作会调用这个函数。结果里有 `confirmed` 和 `typeId`。")),
    onDialogCancel: callbackProp("onDialogCancel", "({reason, typeId}) => void", { reason: "cancel", typeId: "Business Term" }, bi("The function runs when the confirm dialog closes. The result has `reason` and `typeId`.", "确认对话框关闭时会调用这个函数。结果里有 `reason` 和 `typeId`。")),
    onDescriptionChange: callbackProp("onDescriptionChange", "({value, typeId}) => void", { value: "Updated description.", typeId: "Report Context" }, bi("The function runs at each change in the Report Context description dialog. The result has `value` and `typeId`.", "Report Context 描述对话框每次变化都会调用这个函数。结果里有 `value` 和 `typeId`。")),
    onDescriptionConfirm: callbackProp("onDescriptionConfirm", "({id, typeId}) => void", { id: "city-report-context", typeId: "Report Context" }, bi("The function runs on Confirm in the Report Context description dialog. The result has `id` and `typeId`.", "Report Context 描述对话框点击 Confirm 时会调用这个函数。结果里有 `id` 和 `typeId`。")),
    onDescriptionCancel: callbackProp("onDescriptionCancel", "({reason, typeId}) => void", { reason: "cancel", typeId: "Report Context" }, bi("The function runs when the Report Context description dialog closes. The result has `reason` and `typeId`.", "Report Context 描述对话框关闭时会调用这个函数。结果里有 `reason` 和 `typeId`。")),
    onOpenReportContext: callbackProp("onOpenReportContext", "({typeId, id}) => void", { typeId: "Data Model", id: "city-report-context" }, bi("The function runs when a related report opens the Report Context drawer from Data Model. The result has `typeId` and `id`.", "Data Model 上的关联报表打开 Report Context 抽屉时会调用这个函数。结果里有 `typeId` 和 `id`。")),
    onSelectDomain: callbackProp("onSelectDomain", "({typeId, domain}) => void", { typeId: "Data Model", domain: "finance-analysis" }, bi("The function runs when a Data Model domain card is selected. The result has `typeId` and `domain`.", "选中 Data Model 域卡片时会调用这个函数。结果里有 `typeId` 和 `domain`。")),
    onTabChange: callbackProp("onTabChange", "({typeId, tab}) => void", { typeId: "Data Model", tab: "graph" }, bi("The function runs when Basic information or Relationship graph is selected. `tab` is `basic` or `graph`.", "选择 Basic information 或 Relationship graph 时会调用这个函数。`tab` 是 `basic` 或 `graph`。")),
    onOpenTable: callbackProp("onOpenTable", "({typeId, table}) => void", { typeId: "Data Model", table: "fact_sales_order" }, bi("The function runs when a graph node opens the table dialog. The result has `typeId` and `table`.", "图节点打开表对话框时会调用这个函数。结果里有 `typeId` 和 `table`。")),
    onCloseTable: callbackProp("onCloseTable", "({typeId}) => void", { typeId: "Data Model" }, bi("The function runs when the table dialog closes. The result has `typeId`.", "表对话框关闭时会调用这个函数。结果里有 `typeId`。")),
    onDrawerTab: callbackProp("onDrawerTab", "({typeId, tab}) => void", { typeId: "Data Model", tab: "preview" }, bi("The function runs when Field Details or Data Preview is selected. `tab` is `fields` or `preview`.", "选择 Field Details 或 Data Preview 时会调用这个函数。`tab` 是 `fields` 或 `preview`。")),
    notice: enumProp(["", "submitted"], "", bi("Arrival notice key from the host `?notice=`. `submitted` shows the Submitted-for-review toast.", "到达页面时的提示键，来自宿主的 `?notice=`。`submitted` 会显示 Submitted-for-review 的 Toast。")),
    assistant: { control: "object", description: bi("Assistant content, state, and named callbacks. `useInterpreterDemo` owns the local flow.", "助手的内容、状态和具名回调。本地流程由 `useInterpreterDemo` 负责。") },
  },
  render: function InterpreterStory(args) {
    const [activeType, setActiveType] = useSynced(args.activeType);
    const onSelectType = (event) => {
      setActiveType(event.id);
      args.onSelectType?.(event);
    };
    /* Page-level container: filter/search/page/detail state survives switching
       to other knowledge types and back (module-level in the original). */
    const demo = useInterpreterDemo({
      types: args.types,
      records: args.records,
      activeType,
      query: args.query,
      principles: args.principles,
      businessTermLibrary: INTERPRETER.businessTermLibrary,
      fieldLibrary: args.fieldLibrary,
      scenarioReports: args.scenarioReports,
      onNavigate: args.onNavigate,
      onQueryChange: args.onQueryChange,
      onFilterChange: args.onFilterChange,
      onCreate: args.onCreate,
      onToggleCategory: args.onToggleCategory,
      onPage: args.onPage,
      onPageSize: args.onPageSize,
      onToggleExpand: args.onToggleExpand,
      onFilterToggle: args.onFilterToggle,
      onOpen: args.onOpen,
      onCloseDetail: args.onCloseDetail,
      onAction: args.onAction,
      onDialogConfirm: args.onDialogConfirm,
      onDialogCancel: args.onDialogCancel,
      onDescriptionChange: args.onDescriptionChange,
      onDescriptionConfirm: args.onDescriptionConfirm,
      onDescriptionCancel: args.onDescriptionCancel,
      onOpenReportContext: args.onOpenReportContext,
      onSelectDomain: args.onSelectDomain,
      onTabChange: args.onTabChange,
      onOpenTable: args.onOpenTable,
      onCloseTable: args.onCloseTable,
      onDrawerTab: args.onDrawerTab,
      assistant: args.assistant,
      notice: args.notice,
      notices: INTERPRETER.notices,
      demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, answerFor: buildInterpreterAnswer },
    });
    return <AiInterpreterPage {...args} activeType={activeType} {...demo} onSelectType={onSelectType} />;
  },
};

export const InterpreterAssistant = {
  ...Interpreter,
  name: "AI Interpreter assistant",
  args: { ...Interpreter.args, assistant: { ...Interpreter.args.assistant, open: true } },
};

export const InterpreterAssistantAnswer = {
  ...Interpreter,
  name: "AI Interpreter assistant answer",
  args: {
    ...Interpreter.args,
    assistant: {
      ...Interpreter.args.assistant,
      open: true,
      answers: [buildInterpreterAnswer("What is the governed definition of 'Attributed ROI' and which reports use it?")],
    },
  },
};

export const InterpreterSubmittedNotice = {
  ...Interpreter,
  name: "AI Interpreter submitted notice",
  args: { ...Interpreter.args, activeType: "Business Term", notice: "submitted" },
};

const playClicks = (...selectors) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  for (const selector of selectors) {
    const control = doc.querySelector(selector);
    if (!control) throw new Error(`Interpreter story control missing: ${selector}`);
    control.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};

const typeStory = (activeType, name) => ({
  ...Interpreter,
  name,
  args: { ...Interpreter.args, activeType },
});

export const InterpreterPrinciples = typeStory("Principles", "Principles library");
export const InterpreterReportContext = typeStory("Report Context", "Report Context library");
export const InterpreterDataModel = typeStory("Data Model", "Data Model browser");
export const InterpreterMetricDictionary = typeStory("Metric Dictionary", "Metric Dictionary library");
export const InterpreterBusinessTerm = typeStory("Business Term", "Business Term library");
export const InterpreterAnalyticalModel = typeStory("Analytical Model", "Analytical Model library");
export const InterpreterScenarioReporting = typeStory("Scenario Reporting", "Scenario Reporting library");
export const InterpreterEmailReports = typeStory("Email Reports", "Email Reports library");

export const InterpreterDataModelReportContextPeek = {
  ...InterpreterDataModel,
  name: "Data Model related Report Context",
  play: async (context) => {
    await playClicks(".mh-dmview__report[aria-label='Open 4P Report Report Context']")(context);
    const doc = context.canvasElement.ownerDocument;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      if (doc.querySelector(".mh-modal--drawer .mh-modal__dialog")) return;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    throw new Error("Related Report Context drawer did not open");
  },
};

export const InterpreterAssistantHistory = {
  ...InterpreterAssistant,
  name: "AI Interpreter recent chats",
  play: playClicks(".mh-assistant__history .mh-assistant__icon"),
};

export const InterpreterAssistantHistoryFilled = {
  ...InterpreterAssistant,
  name: "AI Interpreter history fills prompt",
  play: playClicks(".mh-assistant__history .mh-assistant__icon", ".mh-assistant__history-item:first-child"),
};

export const InterpreterAssistantMaximized = {
  ...InterpreterAssistant,
  name: "AI Interpreter assistant maximized",
  play: playClicks("button[aria-label='Maximize AI Interpreter panel']"),
};

export const InterpreterAssistantSkillMenu = {
  ...InterpreterAssistant,
  name: "AI Interpreter assistant skills",
  play: playClicks(".mh-assistant__skill"),
};

export const InterpreterAssistantSkillSearch = {
  ...InterpreterAssistant,
  name: "AI Interpreter assistant skill search empty",
  play: async (context) => {
    await playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)")(context);
    const input = context.canvasElement.ownerDocument.querySelector(".mh-skill__search input");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, "no matching model");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  },
};

export const InterpreterAssistantSelectedSkill = {
  ...InterpreterAssistant,
  name: "AI Interpreter assistant selected model",
  play: playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)", ".mh-skill__option:first-child"),
};

export const InterpreterAssistantModelHistory = {
  ...InterpreterAssistant,
  name: "AI Interpreter assistant model from chats",
  play: playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)", ".mh-skill__action:first-child"),
};

export const InterpreterAssistantModelEmptySelection = {
  ...InterpreterAssistantModelHistory,
  name: "AI Interpreter model requires a message",
  play: async (context) => {
    await InterpreterAssistantModelHistory.play(context);
    const doc = context.canvasElement.ownerDocument;
    const selected = [...doc.querySelectorAll(".mh-flow__msg input:checked")];
    if (selected.length === 0) throw new Error("Model history story has no selected messages");
    selected.forEach((input) => input.click());
    await playClicks(".mh-flow__foot .mh-flow__btn--primary")(context);
  },
};

export const InterpreterAssistantModelGenerated = {
  ...InterpreterAssistant,
  name: "AI Interpreter generated model",
  play: playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)", ".mh-skill__action:first-child", ".mh-flow__foot .mh-flow__btn--primary"),
};

export const InterpreterAssistantModelManual = {
  ...InterpreterAssistant,
  name: "AI Interpreter manual model",
  play: playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)", ".mh-skill__action:nth-child(2)"),
};

export const InterpreterAssistantModelError = {
  ...InterpreterAssistantModelManual,
  name: "AI Interpreter model required fields",
  play: playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)", ".mh-skill__action:nth-child(2)", ".mh-flow__foot .mh-flow__btn--primary"),
};

export const InterpreterAssistantFeedback = {
  ...InterpreterAssistantAnswer,
  name: "AI Interpreter assistant helpful feedback",
  play: playClicks(".mh-assistant__feedback button[data-kind='helpful']"),
};

export const InterpreterAssistantUnhelpfulFeedback = {
  ...InterpreterAssistantAnswer,
  name: "AI Interpreter assistant not helpful feedback",
  play: playClicks(".mh-assistant__feedback button[data-kind='not-helpful']"),
};
