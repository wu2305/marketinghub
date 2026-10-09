import React from "react";
import { COCKPIT, COCKPIT_SKILL_MENU, MODEL_FLOW, buildReportAssistantAnswer } from "../../content.js";
import { useCockpitDemo } from "../../demo/cockpit-demo.js";
import { cityInvestScenarioSource } from "../../demo/report-demo.js";
import { CITY_INVEST, COPILOT, KNOWLEDGE_ASSETS } from "../../demo/report-fixtures.js";
import { enumProp, pageShell, bi } from "../../lib/story-helpers.js";
import { MarketingCockpitPage, cockpitViews } from "./index.jsx";

/* CityInvestDashboard arg data: the component never reads `baseline` — only the
   getScenario source built from it does. */
const { baseline: _baseline, ...CITY_INVEST_VIEW } = CITY_INVEST;

export default {
  title: "Pages",
  component: MarketingCockpitPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi("This page is Marketing Cockpit. It lists project cards in groups. Open a project to see its reports. Open a live report to see the dashboard. To build this page, set `projects`, `groups`, `knowledge`, and copy. Set `cityInvest` for the City Invest dashboard. Two assistants can be on this page. The corner assistant is the workspace assistant. A live report also has Report Copilot. Set `hrefFor` to turn a route id into an href.", "这是 Marketing Cockpit 页面。它按分组列出项目卡片。打开一个项目可以看到它的报表。打开实时报表可以看到仪表盘。组合页面时，设置 `projects`、`groups`、`knowledge` 和文案。City Invest 仪表盘需要设置 `cityInvest`。同一页可以有两个助手。角落里的是工作区助手。实时报表上还有 Report Copilot。用 `hrefFor` 把路由 id 转成 href。"),
      },
    },
  },
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
    copy: COCKPIT.copy,
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
    hrefFor: { control: false, description: bi("Set `hrefFor` to turn a route id into an href. The story and the host each supply this function.", "用 `hrefFor` 把路由 id 转成 href。故事和宿主各自提供这个函数。") },
    project: { control: "select", options: ["all", ...Object.keys(args.projects)], description: bi("Active catalog project id, or `\"all\"` for the grouped catalog.", "当前目录项目的 id。分组目录用 `\"all\"`。") },
    view: enumProp(cockpitViews, "catalog", bi("Not read by the page. The live report opens whenever `dashboard` is set, as in the original `?dashboard=` URL, so change `dashboard` to switch views. A host may still pass the URL's `view` value through.", "页面不读取这个值。只要设置了 `dashboard` 就会打开实时报表，和原页面的 `?dashboard=` 一致，所以要切换视图请改 `dashboard`。宿主仍可透传 URL 里的 `view`。"), false),
    dashboard: { control: { type: "number", min: 0, max: 1 }, description: bi("Live report index. When this value is set, the live view opens.", "实时报表索引。设置了这个值就会打开实时视图。") },
    knowledge: { control: false, description: bi("Knowledge assets used for counts, search text, and context links.", "用于计数、搜索文字和上下文链接的知识资产。") },
    cityInvest: { control: false, description: bi("City Invest dashboard data. Required for reports with `embed: \"city-invest\"`.", "City Invest 仪表盘数据。带 `embed: \"city-invest\"` 的报表需要它。") },
    demo: { control: false, description: bi("Demo simulators for Copilot answers and the model dialog. Hosts can omit this and supply their own state.", "Copilot 回答和建模对话框的演示模拟。宿主可以不传，改用自己的状态。") },
    onFiltersChange: { action: "onFiltersChange", description: bi("The function runs when City Invest filters change.", "City Invest 的筛选变化时，会调用这个函数。") },
    onNavigate: { action: "onNavigate", description: bi("The function runs when a link opens another page. The result has `id`, `params`, and `href`.", "链接要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。") },
    onQueryChange: { action: "onQueryChange", description: bi("The function runs at each change in catalog search. The result has `name` and `value`.", "目录搜索每次变化都会调用这个函数。结果里有 `name` 和 `value`。") },
    onOpenProject: { action: "onOpenProject", description: bi("The function runs when the user opens a project directory. The result has `id` and `href`.", "用户打开项目目录时，会调用这个函数。结果里有 `id` 和 `href`。") },
    onOpenReport: { action: "onOpenReport", description: bi("The function runs when the user opens a live report. The result has `project`, `index`, and `href`.", "用户打开实时报表时，会调用这个函数。结果里有 `project`、`index` 和 `href`。") },
    onOpenDetails: { action: "onOpenDetails", description: bi("The function runs when the user opens the report details drawer. The result has `project`, `index`, and `href`.", "用户打开报表详情抽屉时，会调用这个函数。结果里有 `project`、`index` 和 `href`。") },
    onCloseDetails: { action: "onCloseDetails", description: bi("The function runs when the user closes the details drawer. The result has `reason`.", "用户关闭详情抽屉时，会调用这个函数。结果里有 `reason`。") },
    onOpenLive: { action: "onOpenLive", description: bi("The function runs when the details drawer opens the live report. The result may have `href`.", "详情抽屉要打开实时报表时，会调用这个函数。结果里可能有 `href`。") },
    onBack: { action: "onBack", description: bi("The function runs when the live view returns to the catalog. The result has `project` and `href`.", "实时视图返回目录时，会调用这个函数。结果里有 `project` 和 `href`。") },
    onOpenWorkspace: { action: "onOpenWorkspace", description: bi("The function runs when the user opens Report Copilot. The result has `reason: \"open\"`.", "用户打开 Report Copilot 时，会调用这个函数。结果里的 `reason` 是 `\"open\"`。") },
    onWorkspaceClose: { action: "onWorkspaceClose", description: bi("The function runs when the user closes Report Copilot. The result has `reason`.", "用户关闭 Report Copilot 时，会调用这个函数。结果里有 `reason`。") },
    onWorkspaceBack: { action: "onWorkspaceBack", description: bi("The function runs when Report Copilot returns to the start view. The result has `reason: \"back\"`.", "Report Copilot 返回起始视图时，会调用这个函数。结果里的 `reason` 是 `\"back\"`。") },
    onWorkspaceRecommendation: { action: "onWorkspaceRecommendation", description: bi("The function runs when the user selects a Copilot recommendation. The result has `index`.", "用户选择一条 Copilot 建议时，会调用这个函数。结果里有 `index`。") },
    onWorkspaceAsk: { action: "onWorkspaceAsk", description: bi("The function runs when the user sends a Copilot question. The result has `question`.", "用户发送 Copilot 问题时，会调用这个函数。结果里有 `question`。") },
    onWorkspacePromptChange: { action: "onWorkspacePromptChange", description: bi("The function runs at each change in the Copilot composer. The result has `value`.", "Copilot 输入框每次变化都会调用这个函数。结果里有 `value`。") },
    onWorkspaceExplore: { action: "onWorkspaceExplore", description: bi("The function runs when the user selects an explore option on a rich answer. The result has `question`.", "用户在富文本回答上选择探索项时，会调用这个函数。结果里有 `question`。") },
    onChatFeedback: { action: "onChatFeedback", description: bi("The function runs when the user marks a Copilot chat entry. The result has `id` and `value`.", "用户给 Copilot 对话条目打标时，会调用这个函数。结果里有 `id` 和 `value`。") },
    onCopy: { action: "onCopy", description: bi("The function runs when the user copies a Copilot chat entry. The result has `id`.", "用户复制 Copilot 对话条目时，会调用这个函数。结果里有 `id`。") },
    onOpenAssistant: { action: "onOpenAssistant", description: bi("The function runs when the user opens the corner assistant. The result has `reason: \"open\"`.", "用户打开角落助手时，会调用这个函数。结果里的 `reason` 是 `\"open\"`。") },
    onCloseAssistant: { action: "onCloseAssistant", description: bi("The function runs when the user closes the corner assistant. The result has `reason`.", "用户关闭角落助手时，会调用这个函数。结果里有 `reason`。") },
    onPromptChange: { action: "onPromptChange", description: bi("The function runs at each change in the corner composer. The result has `name` and `value`.", "角落助手输入框每次变化都会调用这个函数。结果里有 `name` 和 `value`。") },
    onSubmit: { action: "onSubmit", description: bi("The function runs when the user sends a corner-assistant prompt. The result has `prompt`.", "用户发送角落助手提示时，会调用这个函数。结果里有 `prompt`。") },
    onSuggestion: { action: "onSuggestion", description: bi("The function runs when the user selects a suggestion. The result has `prompt`.", "用户选择一条建议时，会调用这个函数。结果里有 `prompt`。") },
    onNewSession: { action: "onNewSession", description: bi("The function runs when the user starts a new chat.", "用户开始新对话时，会调用这个函数。") },
    onMaximize: { action: "onMaximize", description: bi("The function runs when the user expands or restores an assistant. The result has `expanded`.", "用户展开或还原助手时，会调用这个函数。结果里有 `expanded`。") },
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
