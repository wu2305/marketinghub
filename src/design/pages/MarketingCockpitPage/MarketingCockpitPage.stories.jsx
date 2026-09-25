import React from "react";
import { COCKPIT, COCKPIT_SKILL_MENU, MODEL_FLOW, buildReportAssistantAnswer } from "../../content.js";
import { useCockpitDemo } from "../../demo/cockpit-demo.js";
import { cityInvestScenarioSource } from "../../demo/report-demo.js";
import { CITY_INVEST, COPILOT, KNOWLEDGE_ASSETS } from "../../demo/report-fixtures.js";
import { pageShell } from "../../lib/story-helpers.js";
import { MarketingCockpitPage, cockpitViews } from "./index.jsx";

/* CityInvestDashboard arg data: the component never reads `baseline` — only the
   getScenario source built from it does. */
const { baseline: _baseline, ...CITY_INVEST_VIEW } = CITY_INVEST;

export default {
  title: "Pages",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export const MarketingCockpit = {
  name: "Marketing Cockpit",
  args: {
    query: "",
    project: "all",
    view: "catalog",
    details: null,
    assistantOpen: false,
    workspaceOpen: false,
    prompt: "",
    ...pageShell,
    hero: COCKPIT.hero,
    groups: COCKPIT.groups,
    projects: COCKPIT.projects,
    knowledge: KNOWLEDGE_ASSETS,
    cityInvest: { ...CITY_INVEST_VIEW, getScenario: cityInvestScenarioSource(CITY_INVEST) },
    demo: { copilot: COPILOT, modelFlow: MODEL_FLOW, reportAnswerFor: buildReportAssistantAnswer },
    detailsSections: COCKPIT.detailsSections,
    assistant: { ...COCKPIT.assistant, skillMenu: COCKPIT_SKILL_MENU },
  },
  argTypes: {
    project: { control: "select", options: ["all", "city", "fourp", "customer", "abo", "rednote", "ottolv"] },
    view: { control: "select", options: cockpitViews },
    dashboard: { control: { type: "number", min: 0, max: 1 } },
    knowledge: { control: false },
    cityInvest: { control: false },
    demo: { control: false },
    onFiltersChange: { action: "onFiltersChange" },
    onNavigate: { action: "onNavigate" },
    onQueryChange: { action: "onQueryChange" },
    onOpenProject: { action: "onOpenProject" },
    onOpenReport: { action: "onOpenReport" },
    onOpenDetails: { action: "onOpenDetails" },
    onCloseDetails: { action: "onCloseDetails" },
    onOpenLive: { action: "onOpenLive" },
    onBack: { action: "onBack" },
    onOpenWorkspace: { action: "onOpenWorkspace" },
    onWorkspaceClose: { action: "onWorkspaceClose" },
    onWorkspaceBack: { action: "onWorkspaceBack" },
    onWorkspaceRecommendation: { action: "onWorkspaceRecommendation" },
    onWorkspaceAsk: { action: "onWorkspaceAsk" },
    onWorkspacePromptChange: { action: "onWorkspacePromptChange" },
    onWorkspaceExplore: { action: "onWorkspaceExplore" },
    onChatFeedback: { action: "onChatFeedback" },
    onCopy: { action: "onCopy" },
    onOpenAssistant: { action: "onOpenAssistant" },
    onCloseAssistant: { action: "onCloseAssistant" },
    onPromptChange: { action: "onPromptChange" },
    onSubmit: { action: "onSubmit" },
    onSuggestion: { action: "onSuggestion" },
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
  render: function CockpitStory(args) {
    return <MarketingCockpitPage {...useCockpitDemo(args)} />;
  },
};
