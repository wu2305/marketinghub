import React from "react";
import { SCENARIO_EDIT, SCENARIO_EDIT_SHELL } from "../../demo/content/scenario-edit.js";
import { SKILL_RECORDS } from "../../demo/content/skill-records.js";
import { useScenarioEditDemo, scenarioEditPreviewFor } from "../../demo/scenario-edit-demo.js";
import { callbackProp } from "../../lib/story-helpers.js";
import { ScenarioEditPage } from "./index.jsx";

const routes = { interpreter: "/assets/pages/knowledge.html", "review-center": "/assets/pages/review-center.html", "scenario-library": "/assets/pages/scenario-library.html", "feedback-quality": "/assets/pages/feedback-quality.html", cockpit: "/assets/pages/reports.html" };
const hrefFor = (id, params = {}) => { const path = routes[id]; const query = new URLSearchParams(params).toString(); return path && query ? `${path}?${query}` : path; };
const flowThreads = () => SCENARIO_EDIT_SHELL.modelFlow.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) }));
const checkedMessages = () => flowThreads().flatMap((thread, threadIndex) => thread.messages.flatMap((message) => message.checked ? [{ ...message, threadIndex, conversation: thread.title }] : []));
const afterFrames = (selector) => async ({ canvasElement }) => { const doc = canvasElement.ownerDocument; await new Promise((resolve) => doc.defaultView.requestAnimationFrame(() => doc.defaultView.requestAnimationFrame(resolve))); const control = canvasElement.querySelector(selector) || doc.querySelector(selector); if (!control) throw new Error(`Scenario Edit control missing: ${selector}`); control.click(); };

export default { title: "Pages", component: ScenarioEditPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: "Full Skill Edit page composed from semantic governance navigation, Hero metrics, a controlled scenario form and the existing lite assistant/model flow. Source-backed demo state runs in Storybook and the standalone host." } } } };
export const ScenarioEdit = {
  name: "Scenario Edit",
  args: { content: SCENARIO_EDIT, records: SKILL_RECORDS, scenarioId: "", initial: {}, ...SCENARIO_EDIT_SHELL },
  argTypes: {
    scenarioId: { control: "text", description: "Known source record id; empty or unknown retains the HTML City Comparison defaults." },
    initial: { control: "object", description: "Initial editable values, preview, validation, assistant and model state." },
    records: { control: "object", description: "Replaceable source Skill Library records." },
    onChange: callbackProp("onChange", "({field:string,value:string}) => void", { field: "scope", value: "Global" }),
    onRunPreview: callbackProp("onRunPreview", "({question:string,output:string}) => void", { question: "Compare cities", output: "Generating preview..." }),
    onValidation: callbackProp("onValidation", "({firstInvalid:string,errors:object}) => void", { firstInvalid: "name", errors: { name: true } }),
    onSubmit: callbackProp("onSubmit", "({id:string|null,values:object}) => void", { id: "scenario-campaign-review", values: SCENARIO_EDIT.defaults }),
    onAutoFill: callbackProp("onAutoFill", "({field:'logic'|'output'}) => void; the demo fills the field with deterministic text", { field: "logic" }),
    onSaveDraft: callbackProp("onSaveDraft", "({id:string|null,status:'Draft',values:object}) => void; the demo shows a Draft saved toast", { id: null, status: "Draft", values: SCENARIO_EDIT.defaults }),
    onSelectFiles: callbackProp("onSelectFiles", "({files:string[]}) => void", { files: ["brief.pdf"] }),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "cockpit", params: { project: "city", dashboard: 0 }, href: "/assets/pages/reports.html?project=city&dashboard=0", label: "Open Invest City Strategy Analysis" }),
    onAssistantSubmit: callbackProp("onAssistantSubmit", "({prompt:string}) => void", { prompt: "Definition of Attributed ROI" }),
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
ScenarioEditRequired.play = afterFrames('.mh-scenario-edit-form__actions button[type="submit"]');
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
