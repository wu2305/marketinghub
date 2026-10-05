import React from "react";
import { ASSISTANT, ASSISTANT_SKILL_MENU, HOME, MODEL_FLOW, buildHomeAssistantAnswer, buildModelDraft } from "../../content.js";
import { useHomeDemo } from "../../demo/home-demo.js";
import { pageShell, bi } from "../../lib/story-helpers.js";
import { HomePage } from "./index.jsx";

const HOME_DEMO = { answerFor: buildHomeAssistantAnswer, modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft };

export default {
  title: "Pages",
  component: HomePage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi("This page is Home. It is the portal entry. To build this page, set the header, the header image area, the metric blocks, the workspace cards, and the assistant. Set `hrefFor` to turn a route id into an href. Set `onNavigate` when a card or a nav link opens another page. Set `onOpen` when a workspace card starts an action. The assistant is one `assistant` object. Set `skillFlow` when the skill menu opens the model dialog.", "这是 Home 页面，也是门户入口。组合页面时，设置页头、头图区、指标块、工作区卡片和助手。用 `hrefFor` 把路由 id 转成 href。卡片或导航要打开另一页时，设置 `onNavigate`。工作区卡片要启动一次操作时，设置 `onOpen`。助手的内容放在一个 `assistant` 对象里。技能菜单要打开建模对话框时，设置 `skillFlow`。"),
      },
    },
  },
};

export const Home = {
  name: "Home",
  args: {
    assistantOpen: false,
    prompt: "",
    scope: ASSISTANT.scopes[0],
    ...pageShell,
    hero: HOME.hero,
    heading: HOME.heading,
    cards: HOME.cards,
    assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU },
  },
  argTypes: {
    hrefFor: { control: false, description: bi("Set `hrefFor` to turn a route id into an href. The story and the host each supply this function.", "用 `hrefFor` 把路由 id 转成 href。故事和宿主各自提供这个函数。") },
    scope: { control: "select", options: ASSISTANT.scopes, description: bi("Scope sent to the demo answer builder. The first assistant scope is the default.", "传给演示回答生成器的范围。默认是助手的第一个 scope。") },
    assistantOpen: { control: "boolean", description: bi("Set true to open the assistant.", "设为 true 时打开助手。") },
    onNavigate: { action: "onNavigate", description: bi("The function runs when a card or a nav link opens another page. The result has `id`, `params`, and `href`.", "卡片或导航要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。") },
    onOpen: { action: "onOpen", description: bi("The function runs when a workspace card starts an action. The result has `title`.", "工作区卡片要启动一次操作时，会调用这个函数。结果里有 `title`。") },
    onOpenAssistant: { action: "onOpenAssistant", description: bi("The function runs when the user opens the assistant. The result has `reason: \"open\"`.", "用户打开助手时，会调用这个函数。结果里的 `reason` 是 `\"open\"`。") },
    onCloseAssistant: { action: "onCloseAssistant", description: bi("The function runs when the user closes the assistant. The result has `reason`.", "用户关闭助手时，会调用这个函数。结果里有 `reason`。") },
    onSubmit: { action: "onSubmit", description: bi("The function runs when the user sends a prompt. The result has `prompt`.", "用户发送提示时，会调用这个函数。结果里有 `prompt`。") },
    onSuggestion: { action: "onSuggestion", description: bi("The function runs when the user selects a suggestion. The result has `prompt`.", "用户选择一条建议时，会调用这个函数。结果里有 `prompt`。") },
    onPromptChange: { action: "onPromptChange", description: bi("The function runs at each change in the composer. The result has `name` and `value`.", "输入框每次变化都会调用这个函数。结果里有 `name` 和 `value`。") },
    onNewSession: { action: "onNewSession", description: bi("The function runs when the user starts a new chat.", "用户开始新对话时，会调用这个函数。") },
    onMaximize: { action: "onMaximize", description: bi("The function runs when the user expands or restores the assistant. The result has `expanded`.", "用户展开或还原助手时，会调用这个函数。结果里有 `expanded`。") },
    onHistory: { action: "onHistory", description: bi("The function runs when the user opens or closes Recent Chats. The result has `open`.", "用户打开或关闭 Recent Chats 时，会调用这个函数。结果里有 `open`。") },
    onHistorySelect: { action: "onHistorySelect", description: bi("The function runs when the user selects a recent chat. The result has `label` and `prompt`.", "用户选择一条最近对话时，会调用这个函数。结果里有 `label` 和 `prompt`。") },
    onFeedback: { action: "onFeedback", description: bi("The function runs when the user marks an answer. The result has `query` and `feedback`.", "用户给回答打标时，会调用这个函数。结果里有 `query` 和 `feedback`。") },
    onAttach: { action: "onAttach", description: bi("The function runs after the user picks files in Upload File. The result has `names`.", "用户在 Upload File 里选完文件后，会调用这个函数。结果里有 `names`。") },
    onSelectSkill: { action: "onSelectSkill", description: bi("The function runs when the user selects a skill. The result has `type` and `title`. `id` is present when the skill has one.", "用户选择一项技能时，会调用这个函数。结果里有 `type` 和 `title`。技能有 `id` 时，结果里也会带上。") },
    onClearSkill: { action: "onClearSkill", description: bi("The function runs when the user clears the selected skill.", "用户清除已选技能时，会调用这个函数。") },
    onSkillAction: { action: "onSkillAction", description: bi("The function runs when the user starts a model action. The result has `action`: `\"history\"` or `\"manual\"`.", "用户启动一项建模操作时，会调用这个函数。结果里的 `action` 是 `\"history\"` 或 `\"manual\"`。") },
    onFlowSave: { action: "onFlowSave", description: bi("The function runs when the user saves a model draft. The result has `values`.", "用户保存模型草稿时，会调用这个函数。结果里有 `values`。") },
    onFlowSubmit: { action: "onFlowSubmit", description: bi("The function runs when the user submits a model. The result has `values`.", "用户提交模型时，会调用这个函数。结果里有 `values`。") },
  },
  render: function HomeStory(args) {
    return <HomePage {...useHomeDemo({ ...args, demo: HOME_DEMO })} />;
  },
};

// Reach these states through the same controls as the original page, keeping
// transient menu/model state out of the page's public interface.
const playSteps = (selectors, expected) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  await new Promise((resolve) => doc.defaultView.requestAnimationFrame(() => doc.defaultView.requestAnimationFrame(resolve)));
  for (const selector of selectors) {
    const control = doc.querySelector(selector);
    if (!control) throw new Error(`Home story control missing: ${selector}`);
    control.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  if (!doc.querySelector(expected)) throw new Error(`Home story state missing: ${expected}`);
};

export const HomeAssistantOpen = {
  ...Home,
  name: "Home assistant open",
  args: { ...Home.args, assistantOpen: true },
};

export const HomeAssistantAnswer = {
  ...HomeAssistantOpen,
  name: "Home assistant answer",
  play: playSteps([".mh-assistant__suggestions button", ".mh-assistant__send .mh-button"], ".mh-assistant__answer"),
};

export const HomeAssistantHistory = {
  ...HomeAssistantOpen,
  name: "Home assistant recent chats",
  play: playSteps(["button[aria-label='History']"], ".mh-assistant__history-pop"),
};

export const HomeAssistantMaximized = {
  ...HomeAssistantOpen,
  name: "Home assistant maximized",
  play: playSteps(["button[aria-label='Maximize']"], ".mh-assistant--expanded"),
};

export const HomeAssistantSkills = {
  ...HomeAssistantOpen,
  name: "Home assistant skills",
  play: playSteps([".mh-assistant__skill"], ".mh-skill"),
};

const modelMenu = [".mh-assistant__skill", ".mh-skill__category:nth-child(2)"];
export const HomeAssistantSelectedSkill = {
  ...HomeAssistantOpen,
  name: "Home assistant selected model",
  play: playSteps([...modelMenu, ".mh-skill__option:nth-child(2)"], ".mh-assistant__chip"),
};

export const HomeModelHistory = {
  ...HomeAssistantOpen,
  name: "Home model from chat history",
  play: playSteps([...modelMenu, ".mh-skill__action:first-child"], ".mh-flow__card--history"),
};

export const HomeModelGenerated = {
  ...HomeAssistantOpen,
  name: "Home generated model",
  play: playSteps([...modelMenu, ".mh-skill__action:first-child", ".mh-flow__foot .mh-flow__btn--primary"], ".mh-flow__card--form"),
};

export const HomeModelManual = {
  ...HomeAssistantOpen,
  name: "Home manual model",
  play: playSteps([...modelMenu, ".mh-skill__action:last-child"], ".mh-flow__card--form"),
};

export const HomeModelManualError = {
  ...HomeAssistantOpen,
  name: "Home model required fields",
  play: playSteps([...modelMenu, ".mh-skill__action:last-child", ".mh-flow__foot .mh-flow__btn--primary"], ".mh-flow__field-error"),
};

export const HomeAssistantHistoryFilled = {
  ...HomeAssistantOpen,
  name: "Home assistant history fills prompt",
  play: async (context) => {
    await playSteps(["button[aria-label='History']", ".mh-assistant__history-item"], ".mh-assistant__box textarea")(context);
    const doc = context.canvasElement.ownerDocument;
    if (!doc.querySelector(".mh-assistant__box textarea").value.includes("ROI trend across my active campaigns") || doc.querySelector(".mh-assistant__send .mh-button").disabled) {
      throw new Error("Home history must fill an enabled composer");
    }
  },
};

export const HomeAssistantSkillSearchEmpty = {
  ...HomeAssistantOpen,
  name: "Home assistant skill search empty",
  play: async (context) => {
    await playSteps(modelMenu, ".mh-skill__search input")(context);
    const doc = context.canvasElement.ownerDocument;
    const input = doc.querySelector(".mh-skill__search input");
    Object.getOwnPropertyDescriptor(doc.defaultView.HTMLInputElement.prototype, "value").set.call(input, "no matching model");
    input.dispatchEvent(new doc.defaultView.Event("input", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (!doc.querySelector(".mh-skill__empty")) throw new Error("Skill empty result missing");
  },
};

export const HomeModelEmptySelection = {
  ...HomeAssistantOpen,
  name: "Home model requires a message",
  play: async (context) => {
    await HomeModelHistory.play(context);
    const doc = context.canvasElement.ownerDocument;
    for (const input of doc.querySelectorAll(".mh-flow__msg input:checked")) input.click();
    await playSteps([".mh-flow__foot .mh-flow__btn--primary"], ".mh-flow__error:not([hidden])")(context);
  },
};

export const HomeAssistantFeedback = {
  ...HomeAssistantOpen,
  name: "Home assistant helpful feedback",
  play: playSteps([".mh-assistant__suggestions button", ".mh-assistant__send .mh-button", ".mh-assistant__feedback button[data-kind='helpful']"], ".mh-assistant__feedback button[aria-pressed='true']"),
};
