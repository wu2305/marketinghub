import React from "react";
import { COCKPIT, COCKPIT_SKILL_MENU, MODEL_FLOW, buildReportAssistantAnswer } from "../../content.js";
import { useCockpitDemo } from "../../demo/cockpit-demo.js";
import { cityInvestScenarioSource } from "../../demo/report-demo.js";
import { CITY_INVEST, COPILOT, KNOWLEDGE_ASSETS } from "../../demo/report-fixtures.js";
import { enumProp, pageShell } from "../../lib/story-helpers.js";
import { MarketingCockpitPage, cockpitViews } from "./index.jsx";

/* CityInvestDashboard arg data: the component never reads `baseline` — only the
   getScenario source built from it does. */
const { baseline: _baseline, ...CITY_INVEST_VIEW } = CITY_INVEST;

export default {
  title: "Pages",
  component: MarketingCockpitPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

const args = {
    query: "",
    project: "all",
    view: "catalog",
    dashboard: null,
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
};

export const MarketingCockpit = {
  name: "Marketing Cockpit",
  args,
  argTypes: {
    project: { control: "select", options: ["all", ...Object.keys(args.projects)] },
    view: enumProp(cockpitViews, "catalog", "Catalog or live view; a dashboard index opens the live report"),
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
    onFlowSave: { action: "onFlowSave", description: "Model draft save callback: `{ values }`." },
    onFlowSubmit: { action: "onFlowSubmit", description: "Model submission callback: `{ values }`." },
  },
  render: function CockpitStory(args) {
    return <MarketingCockpitPage {...useCockpitDemo(args)} />;
  },
};

const pageState = (name, initial) => ({ ...MarketingCockpit, name, args: { ...args, ...initial } });
const liveState = (name, initial = {}) => pageState(name, { project: "city", view: "live", dashboard: 0, ...initial });
const copilotState = (name) => liveState(name, { workspaceOpen: true });

async function waitFor(doc, selector) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const element = doc.querySelector(selector);
    if (element) return element;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Cockpit story state missing: ${selector}`);
}

function steps(actions, expected) {
  return async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    await new Promise((resolve) => doc.defaultView.requestAnimationFrame(() => doc.defaultView.requestAnimationFrame(resolve)));
    for (const action of actions) {
      const [kind, selector, value] = action;
      const element = await waitFor(doc, selector);
      if (kind === "click") element.click();
      if (kind === "fill") {
        const prototype = element.tagName === "TEXTAREA" ? doc.defaultView.HTMLTextAreaElement.prototype : doc.defaultView.HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(prototype, "value").set;
        setter.call(element, value);
        element.dispatchEvent(new doc.defaultView.Event("input", { bubbles: true }));
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    await waitFor(doc, expected);
  };
}

const click = (selector) => ["click", selector];
const fill = (selector, value) => ["fill", selector, value];

export const MarketingCockpitProject = pageState("Project directory", { project: "city" });
export const MarketingCockpitLiveReport = liveState("Live report overview", { project: "fourp" });
export const MarketingCockpitCityDashboard = liveState("City Invest dashboard");
export const MarketingCockpitSearchEmpty = pageState("No matching dashboards", { query: "no matching dashboards" });

export const MarketingCockpitCatalogAssistantOpen = pageState("Catalog assistant open", { assistantOpen: true });
export const MarketingCockpitCatalogAssistantAnswer = {
  ...MarketingCockpitCatalogAssistantOpen,
  name: "Catalog assistant answer",
  play: steps([click(".mh-assistant__suggestions button")], ".mh-assistant__feed .mh-assistant__answer"),
};

export const MarketingCockpitCopilotOpen = copilotState("Report Copilot open");
export const MarketingCockpitCopilotRecommendationsExpanded = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot recommendations expanded",
  play: steps([click(".mh-copilot__view-more")], ".mh-copilot__recs.is-show-all"),
};
export const MarketingCockpitCopilotAnswer = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot contextual answer",
  play: steps([click(".mh-copilot__rec:nth-child(2)")], ".mh-copilot__answer"),
};
export const MarketingCockpitCopilotHolistic = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot holistic analysis",
  play: async (context) => {
    await steps([click(".mh-copilot__rec:first-child")], ".mh-holistic .mh-stream-block")(context);
    const doc = context.canvasElement.ownerDocument;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const report = doc.querySelector(".mh-holistic");
      if (report?.textContent.includes("Executive Summary") && report.textContent.includes("City-Level Breakdown")) return;
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    throw new Error("Holistic report did not finish streaming");
  },
};
export const MarketingCockpitCopilotChat = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot question answer",
  play: steps([fill(".mh-copilot__command-box textarea", "What changed this week?"), click(".mh-copilot__send")], ".mh-copilot__thread .mh-copilot__entry"),
};
export const MarketingCockpitCopilotRichChat = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot rich sales answer",
  play: steps([fill(".mh-copilot__command-box textarea", "How was pilot city sales performance last month?"), click(".mh-copilot__send")], ".mh-copilot__card--rich"),
};
export const MarketingCockpitCopilotChatAppend = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot follow-up beside contextual answer",
  play: steps([click(".mh-copilot__rec:nth-child(2)"), fill(".mh-copilot__command-box textarea", "Any follow-up?"), click(".mh-copilot__send")], ".mh-copilot__answer:not(.is-chat-mode) .mh-copilot__entry"),
};
export const MarketingCockpitCopilotContextDock = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot answer context dock",
  play: steps([click(".mh-copilot__rec:nth-child(2)"), click(".mh-copilot__tool:first-child")], ".mh-copilot__dock .mh-copilot__section--docked"),
};
export const MarketingCockpitCopilotHistory = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot history",
  play: steps([click("button[aria-label='History']")], ".mh-copilot__history"),
};
export const MarketingCockpitCopilotSkills = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot skill menu",
  play: steps([click(".mh-copilot__command-actions .mh-assistant__skill"), click(".mh-skill__category:nth-child(2)")], ".mh-skill__detail"),
};
export const MarketingCockpitCopilotSkillsEmpty = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot no matching models",
  play: steps([click(".mh-copilot__command-actions .mh-assistant__skill"), click(".mh-skill__category:nth-child(2)"), fill(".mh-skill__search input", "no matching model")], ".mh-skill__empty"),
};
export const MarketingCockpitCopilotSkillPicked = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot model selected in composer",
  play: async (context) => {
    await steps([click(".mh-copilot__command-actions .mh-assistant__skill"), click(".mh-skill__category:nth-child(2)"), click(".mh-skill__option:first-child")], ".mh-copilot__command-box textarea")(context);
    const doc = context.canvasElement.ownerDocument;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (/^Use .+ to interpret this report\.$/.test(doc.querySelector(".mh-copilot__command-box textarea")?.value || "")) return;
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    throw new Error("Selected model did not fill the composer");
  },
};
const modelActions = [click(".mh-copilot__command-actions .mh-assistant__skill"), click(".mh-skill__category:nth-child(2)"), click(".mh-skill__action:first-child")];
export const MarketingCockpitCopilotModelHistory = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot model from history",
  play: steps(modelActions, ".mh-flow__card--history"),
};
export const MarketingCockpitCopilotModelEmpty = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot requires a selected message",
  play: async (context) => {
    await steps(modelActions, ".mh-flow__card--history")(context);
    const doc = context.canvasElement.ownerDocument;
    doc.querySelectorAll(".mh-flow__msg input:checked").forEach((input) => input.click());
    await new Promise((resolve) => setTimeout(resolve, 0));
    (await waitFor(doc, ".mh-flow__foot .mh-flow__btn--primary")).click();
    await waitFor(doc, ".mh-flow__error:not([hidden])");
  },
};
export const MarketingCockpitCopilotModelGenerated = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot generated model",
  play: steps([...modelActions, click(".mh-flow__btn--primary")], ".mh-flow__card--form"),
};
export const MarketingCockpitCopilotModelManual = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot manual model form",
  play: steps([click(".mh-copilot__command-actions .mh-assistant__skill"), click(".mh-skill__category:nth-child(2)"), click(".mh-skill__action:nth-child(2)")], ".mh-flow__card--form"),
};
export const MarketingCockpitCopilotModelRequired = {
  ...MarketingCockpitCopilotModelManual,
  name: "Report Copilot manual model required fields",
  play: steps([click(".mh-copilot__command-actions .mh-assistant__skill"), click(".mh-skill__category:nth-child(2)"), click(".mh-skill__action:nth-child(2)"), click(".mh-flow__foot .mh-flow__btn--primary")], ".mh-flow__field-error"),
};
export const MarketingCockpitCopilotFeedback = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot helpful feedback",
  play: steps([click(".mh-copilot__rec:nth-child(2)"), click(".mh-copilot__feedback button:first-child")], ".mh-copilot__feedback-status"),
};
export const MarketingCockpitCopilotMaximized = {
  ...MarketingCockpitCopilotOpen,
  name: "Report Copilot maximized",
  play: steps([click("button[aria-label='Maximize']")], ".mh-copilot--expanded"),
};
