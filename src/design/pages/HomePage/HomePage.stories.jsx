import React from "react";
import { ASSISTANT, ASSISTANT_SKILL_MENU, HOME, MODEL_FLOW, buildHomeAssistantAnswer, buildModelDraft } from "../../content.js";
import { useHomeDemo } from "../../demo/home-demo.js";
import { pageShell } from "../../lib/story-helpers.js";
import { HomePage } from "./index.jsx";

const HOME_DEMO = { answerFor: buildHomeAssistantAnswer, modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft };

export default {
  title: "Pages",
  component: HomePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
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
    hrefFor: { control: false, description: "Story/host supplied semantic route resolver `(id, params) => href`." },
    scope: { control: "select", options: ASSISTANT.scopes },
    assistantOpen: { control: "boolean" },
    onNavigate: { action: "onNavigate" },
    onOpen: { action: "onOpen" },
    onOpenAssistant: { action: "onOpenAssistant" },
    onCloseAssistant: { action: "onCloseAssistant" },
    onSubmit: { action: "onSubmit" },
    onSuggestion: { action: "onSuggestion" },
    onScopeChange: { action: "onScopeChange" },
    onPromptChange: { action: "onPromptChange" },
    onNewSession: { action: "onNewSession" },
    onMaximize: { action: "onMaximize" },
    onHistory: { action: "onHistory" },
    onHistorySelect: { action: "onHistorySelect" },
    onFeedback: { action: "onFeedback" },
    onAttach: { action: "onAttach" },
    onSelectSkill: { action: "onSelectSkill" },
    onClearSkill: { action: "onClearSkill" },
    onSkillAction: { action: "onSkillAction" },
    onFlowSave: { action: "onFlowSave" },
    onFlowSubmit: { action: "onFlowSubmit" },
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
