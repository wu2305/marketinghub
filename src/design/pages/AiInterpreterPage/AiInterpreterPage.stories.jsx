import React from "react";
import { INTERPRETER, MODEL_FLOW, buildModelDraft } from "../../content.js";
import { buildInterpreterAnswer, useInterpreterDemo } from "../../demo/interpreter-demo.js";
import { enumProp, pageShell, useSynced, bi } from "../../lib/story-helpers.js";
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
    onNavigate: { action: "onNavigate" },
    onSelectType: { action: "onSelectType" },
    onQueryChange: { action: "onQueryChange" },
    onFilterChange: { action: "onFilterChange" },
    onCreate: { action: "onCreate" },
    onToggleCategory: { action: "onToggleCategory" },
    onPage: { action: "onPage" },
    onPageSize: { action: "onPageSize" },
    onToggleExpand: { action: "onToggleExpand" },
    onFilterToggle: { action: "onFilterToggle" },
    onOpen: { action: "onOpen" },
    onCloseDetail: { action: "onCloseDetail" },
    onAction: { action: "onAction" },
    onDialogConfirm: { action: "onDialogConfirm" },
    onDialogCancel: { action: "onDialogCancel" },
    onDescriptionChange: { action: "onDescriptionChange" },
    onDescriptionConfirm: { action: "onDescriptionConfirm" },
    onDescriptionCancel: { action: "onDescriptionCancel" },
    onOpenReportContext: { action: "onOpenReportContext" },
    onSelectDomain: { action: "onSelectDomain" },
    onTabChange: { action: "onTabChange" },
    onOpenTable: { action: "onOpenTable" },
    onCloseTable: { action: "onCloseTable" },
    onDrawerTab: { action: "onDrawerTab" },
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
