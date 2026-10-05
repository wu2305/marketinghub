import React from "react";
import { SCENARIO_DETAIL, SCENARIO_DETAIL_SHELL } from "../../demo/content/scenario-detail.js";
import { SKILL_RECORDS } from "../../demo/content/skill-records.js";
import { useScenarioDetailDemo } from "../../demo/scenario-detail-demo.js";
import { enumProp, callbackProp, bi } from "../../lib/story-helpers.js";
import { ScenarioDetailPage, scenarioDetailTabs } from "./index.jsx";

const flowThreads = () => SCENARIO_DETAIL_SHELL.modelFlow.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) }));
const checkedMessages = () => flowThreads().flatMap((thread, threadIndex) => thread.messages.flatMap((message) => message.checked ? [{ ...message, threadIndex, conversation: thread.title }] : []));

export default { title: "Pages", component: ScenarioDetailPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: bi("This page is Scenario Detail. It shows one skill record in six tabs. The tabs are Content, Related Objects, AI Check, Usage & Feedback, Version History, and Activity Log. To build this page, set `detail.record` and the tab. Set `previewOpen` to show the example question and output on Content. This page is not Skill Library, Skill Edit, or Scenario Reports.", "这是 Scenario Detail 页面。它用六个标签显示一条技能记录。标签是 Content、Related Objects、AI Check、Usage & Feedback、Version History 和 Activity Log。组合页面时，设置 `detail.record` 和当前标签。用 `previewOpen` 在 Content 上显示示例问题和输出。本页不是 Skill Library、Skill Edit 或 Scenario Reports。") } } } };

export const ScenarioDetail = {
  name: "Scenario Detail",
  args: { content: SCENARIO_DETAIL, records: SKILL_RECORDS, shell: SCENARIO_DETAIL_SHELL, initial: {}, tab: "content", previewOpen: false },
  argTypes: {
    content: { control: "object", description: bi("Visible copy, navigation, and static panel content.", "可见文案、导航和静态面板内容。") },
    records: { control: "object", description: bi("Skill records. A host can replace this list.", "技能记录。宿主可以替换这份列表。") },
    shell: { control: "object", description: bi("Lite assistant copy, skills, and model data.", "轻量助手的文案、技能和模型数据。") },
    initial: { control: "object", description: bi("Initial URL id and assistant state.", "初始的 URL id 和助手状态。") },
    tab: enumProp(scenarioDetailTabs, "content", bi("One of the six visible detail panels.", "六个可见详情面板之一。")),
    previewOpen: { control: "boolean", description: bi("Set true to show the example question and output on Content.", "设为 true 时，在 Content 上显示示例问题和输出。") },
    onTabChange: callbackProp("onTabChange", "({value:string}) => void", { value: "related" }, bi("The function runs when the user selects a detail tab. The result has `value`.", "用户选择详情标签时，会调用这个函数。结果里有 `value`。")),
    onTogglePreview: callbackProp("onTogglePreview", "({open:boolean}) => void", { open: true }, bi("The function runs when the user opens or closes the example preview. The result has `open`.", "用户打开或关闭示例预览时，会调用这个函数。结果里有 `open`。")),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "scenario-edit", params: { id: "city-comparison" }, href: "/assets/pages/scenario-edit.html?id=city-comparison", label: "Edit Scenario" }, bi("The function runs when a link opens another page. The result has `id`, `params`, `href`, and `label`.", "链接要打开另一页时，会调用这个函数。结果里有 `id`、`params`、`href` 和 `label`。")),
    onAssistantSubmit: callbackProp("onAssistantSubmit", "({prompt:string}) => void", { prompt: "Compare Shanghai and Beijing" }, bi("The function runs when the user sends an assistant prompt. The result has `prompt`.", "用户发送助手提示时，会调用这个函数。结果里有 `prompt`。")),
  },
  render: function ScenarioDetailStory(args) {
    const initial = React.useMemo(() => ({ ...args.initial, tab: args.tab, previewOpen: args.previewOpen }), [args.initial, args.tab, args.previewOpen]);
    const page = useScenarioDetailDemo({ ...args, initial, hrefFor: (id, params = {}) => {
      const path = ({ home: "/index.html", cockpit: "/assets/pages/reports.html", interpreter: "/assets/pages/knowledge.html", "review-center": "/assets/pages/review-center.html", "scenario-library": "/assets/pages/scenario-library.html", "feedback-quality": "/assets/pages/feedback-quality.html", "scenario-edit": "/assets/pages/scenario-edit.html" })[id];
      const query = new URLSearchParams(params).toString();
      return path && query ? `${path}?${query}` : path;
    } });
    return <ScenarioDetailPage {...page} />;
  },
};

const state = (name, initial, overrides = {}) => ({ ...ScenarioDetail, name, args: { ...ScenarioDetail.args, ...overrides, initial, tab: initial.tab || "content", previewOpen: Boolean(initial.previewOpen) } });
const playClicks = (...selectors) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  const frame = () => new Promise((resolve) => doc.defaultView.requestAnimationFrame(resolve));
  await frame(); await frame();
  for (const selector of selectors) {
    let node;
    for (let i = 0; i < 30; i += 1) {
      node = canvasElement.querySelector(selector) || doc.querySelector(selector);
      if (node) break;
      await frame();
    }
    if (!node) throw new Error(`Scenario Detail story control missing: ${selector}`);
    node.click(); await frame();
  }
};

export const ScenarioDetailKnown = state("Scenario Detail · Campaign Review record", { id: "scenario-campaign-review" });
export const ScenarioDetailUnknown = state("Scenario Detail · Unknown ID falls back to first skill", { id: "no-such-skill" });
export const ScenarioDetailRelated = state("Scenario Detail · Related Objects", { tab: "related" });
export const ScenarioDetailAiCheck = state("Scenario Detail · AI Check", { tab: "ai-check" });
export const ScenarioDetailUsage = state("Scenario Detail · Usage & Feedback", { tab: "usage" });
export const ScenarioDetailVersion = state("Scenario Detail · Version History", { tab: "version" });
export const ScenarioDetailActivity = state("Scenario Detail · Activity Log", { tab: "activity" });
export const ScenarioDetailPreview = state("Scenario Detail · Preview example output", { previewOpen: true });
export const ScenarioDetailAssistant = state("Scenario Detail · Assistant open", { assistantOpen: true });
export const ScenarioDetailAssistantFilled = state("Scenario Detail · Suggestion fills prompt", { assistantOpen: true, assistantPrompt: "Definition of Attributed ROI" });
export const ScenarioDetailAssistantAnswer = state("Scenario Detail · Assistant answer", { assistantOpen: true, assistantAnswers: [SCENARIO_DETAIL_SHELL.answerFor("Definition of Attributed ROI")] });
export const ScenarioDetailAssistantHistory = state("Scenario Detail · Recent chats", { assistantOpen: true });
ScenarioDetailAssistantHistory.play = playClicks('.mh-assistant__history .mh-assistant__icon');
export const ScenarioDetailAssistantMaximized = state("Scenario Detail · Assistant maximized", { assistantOpen: true });
ScenarioDetailAssistantMaximized.play = playClicks('button[aria-label="Maximize"]');
export const ScenarioDetailAssistantSkills = state("Scenario Detail · Skill menu", { assistantOpen: true });
ScenarioDetailAssistantSkills.play = playClicks('.mh-assistant__skill');
export const ScenarioDetailAssistantSkillSearch = state("Scenario Detail · Skill search with no match", { assistantOpen: true });
ScenarioDetailAssistantSkillSearch.play = async (context) => {
  await playClicks('.mh-assistant__skill', '.mh-skill__category:nth-child(2)')(context);
  const field = context.canvasElement.querySelector('.mh-skill__search input');
  if (!field) throw new Error("Scenario Detail skill search missing");
  Object.getOwnPropertyDescriptor(field.ownerDocument.defaultView.HTMLInputElement.prototype, "value").set.call(field, "no matching model");
  field.dispatchEvent(new field.ownerDocument.defaultView.Event("input", { bubbles: true }));
};
export const ScenarioDetailAssistantSelected = state("Scenario Detail · Selected model", { assistantOpen: true, selectedSkill: { id: "roi-diagnosis", type: "Analytical Model", title: "ROI diagnosis model" } });
export const ScenarioDetailModelHistory = state("Scenario Detail · Model chat history", { assistantOpen: true, flow: { step: "history", threads: flowThreads(), rule: "", draft: {} } });
export const ScenarioDetailModelManual = state("Scenario Detail · Manual model", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
export const ScenarioDetailModelGenerated = state("Scenario Detail · Generated model", { assistantOpen: true, flow: { step: "generated", threads: flowThreads(), rule: "", draft: SCENARIO_DETAIL_SHELL.modelDraftFor(checkedMessages(), "") } });
export const ScenarioDetailModelError = state("Scenario Detail · Model required fields", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
ScenarioDetailModelError.play = playClicks('.mh-flow__foot .mh-flow__btn--primary');
export const ScenarioDetailModelEmpty = state("Scenario Detail · Model needs a selected message", { assistantOpen: true, flow: { step: "history", threads: flowThreads().map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message, checked: false })) })), rule: "", draft: {} } });
ScenarioDetailModelEmpty.play = playClicks('.mh-flow__foot .mh-flow__btn--primary');
