import React from "react";
import { INTERPRETER, MODEL_FLOW, buildModelDraft } from "../../content.js";
import { buildInterpreterAnswer, useInterpreterDemo } from "../../demo/interpreter-demo.js";
import { pageShell, useSynced } from "../../lib/story-helpers.js";
import { AiInterpreterPage } from "./index.jsx";

export default {
  title: "Pages",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
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
    hrefFor: { control: false, description: "Story/host supplied semantic route resolver `(id, params) => href`." },
    activeType: {
      control: "select",
      options: ["overview", "unknown-type", ...INTERPRETER.types.map((type) => type.id)],
    },
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
    assistant: { control: "object", description: "Knowledge workspace assistant content, state and named callbacks; useInterpreterDemo owns the local flow." },
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

const playClicks = (...selectors) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  for (const selector of selectors) {
    const control = doc.querySelector(selector);
    if (!control) throw new Error(`Interpreter assistant story control missing: ${selector}`);
    control.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
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
