import React from "react";
import { SCENARIO_EDIT, SCENARIO_EDIT_SHELL } from "../../demo/content/scenario-edit.js";
import { SKILL_RECORDS } from "../../demo/content/skill-records.js";
import { useScenarioEditDemo, scenarioEditPreviewFor } from "../../demo/scenario-edit-demo.js";
import { callbackProp, bi } from "../../lib/story-helpers.js";
import { ScenarioEditPage } from "./index.jsx";

const routes = { interpreter: "/assets/pages/knowledge.html", "review-center": "/assets/pages/review-center.html", "scenario-library": "/assets/pages/scenario-library.html", "feedback-quality": "/assets/pages/feedback-quality.html", cockpit: "/assets/pages/reports.html" };
const hrefFor = (id, params = {}) => { const path = routes[id]; const query = new URLSearchParams(params).toString(); return path && query ? `${path}?${query}` : path; };
const flowThreads = () => SCENARIO_EDIT_SHELL.modelFlow.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) }));
const checkedMessages = () => flowThreads().flatMap((thread, threadIndex) => thread.messages.flatMap((message) => message.checked ? [{ ...message, threadIndex, conversation: thread.title }] : []));
const afterFrames = (selector) => async ({ canvasElement }) => { const doc = canvasElement.ownerDocument; await new Promise((resolve) => doc.defaultView.requestAnimationFrame(() => doc.defaultView.requestAnimationFrame(resolve))); const control = canvasElement.querySelector(selector) || doc.querySelector(selector); if (!control) throw new Error(`Scenario Edit control missing: ${selector}`); control.click(); };

export default { title: "Pages", component: ScenarioEditPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: bi("This page is Skill Edit. It edits one skill on a full page. To build this page, set the header image area, the metric blocks, the form, and the assistant. Set `onSaveDraft` to keep a Draft. Set `onSubmit` to send the skill for review. The Demo then opens Skill Library with `?notice=submitted`. An empty or unknown id keeps the City Comparison defaults. This page is not Skill Library, Scenario Detail, or Scenario Reports.", "这是 Skill Edit 页面。它在整页上编辑一项技能。组合页面时，设置头图区、指标块、表单和助手。用 `onSaveDraft` 保存 Draft。用 `onSubmit` 把技能送去审核。Demo 随后会打开 Skill Library，并带上 `?notice=submitted`。空的或未知的 id 会保留 City Comparison 的默认值。本页不是 Skill Library、Scenario Detail 或 Scenario Reports。") } } } };
export const ScenarioEdit = {
  name: "Scenario Edit",
  args: { content: SCENARIO_EDIT, records: SKILL_RECORDS, scenarioId: "", initial: {}, ...SCENARIO_EDIT_SHELL },
  argTypes: {
    scenarioId: { control: "text", description: bi("Known record id. Empty or unknown keeps the City Comparison defaults.", "已知记录的 id。为空或未知时，保留 City Comparison 的默认值。") },
    initial: { control: "object", description: bi("Initial values, preview, validation, assistant, and model state.", "初始值、预览、校验、助手和建模状态。") },
    records: { control: "object", description: bi("Skill Library records. A host can replace this list.", "Skill Library 记录。宿主可以替换这份列表。") },
    onChange: callbackProp("onChange", "({field:string,value:string}) => void", { field: "scope", value: "Global" }, bi("The function runs at each form change. The result has `field` and `value`.", "表单每次变化都会调用这个函数。结果里有 `field` 和 `value`。")),
    onRunPreview: callbackProp("onRunPreview", "({question:string,output:string}) => void", { question: "Compare cities", output: "Generating preview..." }, bi("The function runs when the user runs the example preview. The result has `question` and `output`.", "用户运行示例预览时，会调用这个函数。结果里有 `question` 和 `output`。")),
    onValidation: callbackProp("onValidation", "({firstInvalid:string,errors:object}) => void", { firstInvalid: "name", errors: { name: true } }, bi("The function runs when Submit finds a required field empty. The result has `firstInvalid` and `errors`.", "Submit 发现必填字段为空时，会调用这个函数。结果里有 `firstInvalid` 和 `errors`。")),
    onSubmit: callbackProp("onSubmit", "({id:string|null,status:'Under Review',values:object}) => void; the demo then navigates to the Skill Library with ?notice=submitted", { id: "scenario-campaign-review", values: SCENARIO_EDIT.defaults }, bi("The function runs when the user submits the skill. The result has `id`, `status: \"Under Review\"`, and `values`. The demo then opens Skill Library with `?notice=submitted`.", "用户提交技能时，会调用这个函数。结果里有 `id`、`status: \"Under Review\"` 和 `values`。demo 随后会打开 Skill Library，并带上 `?notice=submitted`。")),
    onAutoFill: callbackProp("onAutoFill", "({field:'logic'|'output'}) => void; the demo fills the field with deterministic text", { field: "logic" }, bi("The function runs when the user presses AI Auto-fill. The result has `field`: `\"logic\"` or `\"output\"`. The demo fills that field with fixed text.", "用户按下 AI Auto-fill 时，会调用这个函数。结果里的 `field` 是 `\"logic\"` 或 `\"output\"`。demo 会用固定文字填入该字段。")),
    onSaveDraft: callbackProp("onSaveDraft", "({id:string|null,status:'Draft',values:object}) => void; the demo shows a Draft saved toast", { id: null, status: "Draft", values: SCENARIO_EDIT.defaults }, bi("The function runs when the user saves a draft. The result has `id`, `status: \"Draft\"`, and `values`. The demo shows a Draft saved toast.", "用户保存草稿时，会调用这个函数。结果里有 `id`、`status: \"Draft\"` 和 `values`。demo 会显示 Draft saved Toast。")),
    onSelectFiles: callbackProp("onSelectFiles", "({files:string[]}) => void", { files: ["brief.pdf"] }, bi("The function runs when the user picks files. The result has `files`.", "用户选择文件时，会调用这个函数。结果里有 `files`。")),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "cockpit", params: { project: "city", dashboard: 0 }, href: "/assets/pages/reports.html?project=city&dashboard=0", label: "Open Invest City Strategy Analysis" }, bi("The function runs when a link opens another page. The result has `id`, `params`, `href`, and `label`.", "链接要打开另一页时，会调用这个函数。结果里有 `id`、`params`、`href` 和 `label`。")),
    onAssistantSubmit: callbackProp("onAssistantSubmit", "({prompt:string}) => void", { prompt: "Definition of Attributed ROI" }, bi("The function runs when the user sends an assistant prompt. The result has `prompt`.", "用户发送助手提示时，会调用这个函数。结果里有 `prompt`。")),
  },
  render: function ScenarioEditStory(args) { const page = useScenarioEditDemo({ ...args, hrefFor }); return <ScenarioEditPage {...page} />; },
};

const state = (name, initial = {}, overrides = {}) => ({ ...ScenarioEdit, name, args: { ...ScenarioEdit.args, ...overrides, initial } });
export const ScenarioEditKnown = state("Scenario Edit · Existing campaign scenario", {}, { scenarioId: "scenario-campaign-review" });
export const ScenarioEditReportChanged = state("Scenario Edit · Different report link", { values: { report: "Creative Quality Monitor" } });
export const ScenarioEditReportEmpty = state("Scenario Edit · No linked report", { values: { report: "" } });
export const ScenarioEditPreview = state("Scenario Edit · Generated preview", { preview: scenarioEditPreviewFor(SCENARIO_EDIT.defaults, SCENARIO_EDIT.labels) });
export const ScenarioEditPreviewEmpty = state("Scenario Edit · Empty preview question", { values: { question: "" }, preview: SCENARIO_EDIT.labels.previewEmpty });
export const ScenarioEditRequired = state("Scenario Edit · Required fields", { values: { name: "", purpose: "", scope: "", owner: "", report: "" } }, { scenarioId: "scenario-campaign-review" });
ScenarioEditRequired.play = afterFrames('.mh-skill-form__submit');
export const ScenarioEditAssistant = state("Scenario Edit · Assistant open", { assistantOpen: true });
export const ScenarioEditAssistantFilled = state("Scenario Edit · Suggestion fills prompt", { assistantOpen: true, assistantPrompt: "Definition of Attributed ROI" });
export const ScenarioEditAssistantAnswer = state("Scenario Edit · Assistant answer", { assistantOpen: true, assistantAnswers: [SCENARIO_EDIT_SHELL.answerFor("Definition of Attributed ROI")] });
export const ScenarioEditAssistantHistory = state("Scenario Edit · Recent chats", { assistantOpen: true });
ScenarioEditAssistantHistory.play = afterFrames(".mh-assistant__history .mh-assistant__icon");
export const ScenarioEditAssistantMaximized = state("Scenario Edit · Assistant maximized", { assistantOpen: true });
ScenarioEditAssistantMaximized.play = afterFrames('button[aria-label="Maximize"]');
export const ScenarioEditAssistantSkills = state("Scenario Edit · Skill menu", { assistantOpen: true });
ScenarioEditAssistantSkills.play = afterFrames(".mh-assistant__skill");
export const ScenarioEditAssistantSkillSearch = state("Scenario Edit · Skill search empty", { assistantOpen: true });
ScenarioEditAssistantSkillSearch.play = async (context) => { await afterFrames(".mh-assistant__skill")(context); const doc = context.canvasElement.ownerDocument; const frame = () => new Promise((resolve) => doc.defaultView.requestAnimationFrame(resolve)); const category = context.canvasElement.querySelector(".mh-skill__category:nth-child(2)") || doc.querySelector(".mh-skill__category:nth-child(2)"); if (!category) throw new Error("Analytical Model category missing"); category.click(); let field; for (let i = 0; i < 30; i += 1) { field = context.canvasElement.querySelector(".mh-skill__search input") || doc.querySelector(".mh-skill__search input"); if (field) break; await frame(); } if (!field) throw new Error("Skill search missing"); Object.getOwnPropertyDescriptor(doc.defaultView.HTMLInputElement.prototype, "value").set.call(field, "no matching model"); field.dispatchEvent(new doc.defaultView.Event("input", { bubbles: true })); };
export const ScenarioEditAssistantSelected = state("Scenario Edit · Selected model", { assistantOpen: true, selectedSkill: { id: "roi-diagnosis", type: "Analytical Model", title: "ROI diagnosis model" } });
export const ScenarioEditModelHistory = state("Scenario Edit · Model chat history", { assistantOpen: true, flow: { step: "history", threads: flowThreads(), rule: "", draft: {} } });
export const ScenarioEditModelManual = state("Scenario Edit · Manual model", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
export const ScenarioEditModelGenerated = state("Scenario Edit · Generated model", { assistantOpen: true, flow: { step: "generated", threads: flowThreads(), rule: "", draft: SCENARIO_EDIT_SHELL.modelDraftFor(checkedMessages(), "") } });
export const ScenarioEditModelError = state("Scenario Edit · Model required fields", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
ScenarioEditModelError.play = afterFrames(".mh-flow__foot .mh-flow__btn--primary");
export const ScenarioEditModelEmpty = state("Scenario Edit · Model needs a message", { assistantOpen: true, flow: { step: "history", threads: flowThreads().map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message, checked: false })) })), rule: "", draft: {} } });
ScenarioEditModelEmpty.play = afterFrames(".mh-flow__foot .mh-flow__btn--primary");
