import React from "react";
import { ASSISTANT, ASSISTANT_SKILL_MENU, HOME, MODEL_FLOW, buildHomeAssistantAnswer, buildModelDraft } from "../../content.js";
import { useHomeDemo } from "../../demo/home-demo.js";
import { pageShell } from "../../lib/story-helpers.js";
import { HomePage } from "./index.jsx";

const HOME_DEMO = { answerFor: buildHomeAssistantAnswer, modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft };

export default {
  title: "Pages",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export const Home = {
  name: "Home",
  args: {
    assistantOpen: false,
    prompt: "",
    scope: "All",
    ...pageShell,
    hero: HOME.hero,
    heading: HOME.heading,
    cards: HOME.cards,
    assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU },
  },
  argTypes: {
    hrefFor: { control: false, description: "Story/host supplied semantic route resolver `(id, params) => href`." },
    scope: { control: "select", options: ["All", "Campaigns", "Dashboards", "Knowledge"] },
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
