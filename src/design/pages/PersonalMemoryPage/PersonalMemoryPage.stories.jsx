import React from "react";
import { PERSONAL_MEMORY, PERSONAL_MEMORY_SHELL } from "../../demo/content/personal-memory.js";
import { usePersonalMemoryDemo } from "../../demo/personal-memory-demo.js";
import { enumProp, callbackProp } from "../../lib/story-helpers.js";
import { PersonalMemoryPage, memoryCategories } from "./index.jsx";

const routes = { interpreter: "/assets/pages/knowledge.html", "review-center": "/assets/pages/review-center.html", "scenario-library": "/assets/pages/scenario-library.html", "feedback-quality": "/assets/pages/feedback-quality.html" };
const hrefFor = (id, params = {}) => { const path = routes[id]; const query = new URLSearchParams(params).toString(); return query && path ? `${path}?${query}` : path; };
const flowThreads = () => PERSONAL_MEMORY_SHELL.modelFlow.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) }));
const checkedMessages = () => flowThreads().flatMap((thread, threadIndex) => thread.messages.flatMap((message) => message.checked ? [{ ...message, threadIndex, conversation: thread.title }] : []));

export default { title: "Pages", component: PersonalMemoryPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: "Controlled Personal Memory page, composed from the reusable governance navigation, card/detail workspace, overlay shell and lite assistant. The demo hook drives Storybook and the standalone host." } } } };
export const PersonalMemory = {
  name: "Personal Memory",
  args: { content: PERSONAL_MEMORY, records: PERSONAL_MEMORY.records, initial: {}, category: "all", ...PERSONAL_MEMORY_SHELL },
  argTypes: {
    category: enumProp(memoryCategories, "all", "Active memory category, driven by the private demo hook."),
    records: { control: "object", description: "Replaceable personal-memory fixtures." },
    initial: { control: "object", description: "Initial page, assistant, and model-flow state." },
    onCategoryChange: callbackProp("onCategoryChange", "({value:string}) => void", { value: "analysis" }),
    onSelectMemory: callbackProp("onSelectMemory", "({id:string}) => void", { id: "mem-analysis-1" }),
    onEditMemory: callbackProp("onEditMemory", "({id:string}) => void", { id: "mem-analysis-1" }),
    onSaveEdit: callbackProp("onSaveEdit", "({id:string,title:string,description:string}) => void", { id: "mem-analysis-1", title: "Updated", description: "Updated note" }),
    onDeleteMemory: callbackProp("onDeleteMemory", "({id:string}) => void", { id: "mem-analysis-1" }),
    onConfirmDelete: callbackProp("onConfirmDelete", "({id:string}) => void", { id: "mem-analysis-1" }),
    onSaveMemory: callbackProp("onSaveMemory", "({item:object}) => void", { item: PERSONAL_MEMORY.records[0] }),
    onShare: callbackProp("onShare", "({id:string}) => void; source action has no resulting flow", { id: "mem-analysis-1" }),
    onAutoFill: callbackProp("onAutoFill", "({field:\"description\"}) => void", { field: "description" }),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "interpreter", params: {}, href: routes.interpreter, label: "Knowledge Management" }),
    onAssistantSubmit: callbackProp("onAssistantSubmit", "({prompt:string}) => void", { prompt: "Definition of Attributed ROI" }),
  },
  render: function PersonalMemoryStory(args) {
    const initial = React.useMemo(() => ({ ...args.initial, category: args.category }), [args.initial, args.category]);
    const page = usePersonalMemoryDemo({ ...args, initial, hrefFor });
    return <PersonalMemoryPage {...page} />;
  },
};
const state = (name, initial, overrides = {}) => ({ ...PersonalMemory, name, args: { ...PersonalMemory.args, ...overrides, initial, category: initial.category || "all" } });
const click = (...selectors) => async ({ canvasElement }) => { const doc = canvasElement.ownerDocument; const frame = () => new Promise((resolve) => doc.defaultView.requestAnimationFrame(resolve)); await frame(); await frame(); for (const selector of selectors) { let node; for (let i = 0; i < 30; i += 1) { node = canvasElement.querySelector(selector) || doc.querySelector(selector); if (node) break; await frame(); } if (!node) throw new Error(`Personal Memory control missing: ${selector}`); node.click(); await frame(); } };

export const PersonalMemoryCategory = state("Personal Memory · Analysis category", { category: "analysis" });
export const PersonalMemoryEmpty = state("Personal Memory · Empty category", { category: "reference" }, { records: PERSONAL_MEMORY.records.filter((item) => item.category !== "reference") });
export const PersonalMemoryBannerClosed = state("Personal Memory · AI banner dismissed", { bannerOpen: false });
export const PersonalMemoryDetail = state("Personal Memory · Selected detail", { selectedId: "mem-analysis-1" });
export const PersonalMemoryEdit = state("Personal Memory · Editing detail", { selectedId: "mem-analysis-1", editing: true, editDraft: { title: PERSONAL_MEMORY.records[0].title, description: PERSONAL_MEMORY.records[0].description } });
export const PersonalMemoryCreate = state("Personal Memory · New memory drawer", { createOpen: true });
export const PersonalMemoryAutoFilled = state("Personal Memory · AI Auto-fill", { createOpen: true });
PersonalMemoryAutoFilled.play = click(".mh-memory-page__textarea button");
export const PersonalMemoryCreateErrors = state("Personal Memory · Required create fields", { createOpen: true });
PersonalMemoryCreateErrors.play = click(".mh-memory-page__create-actions button:last-child");
export const PersonalMemoryCrossCategory = state("Personal Memory · New detail outside active category", { category: "reference", createOpen: true, createDraft: { title: "Cross-category analysis", category: "analysis", description: "New analysis while Others remains selected." } });
PersonalMemoryCrossCategory.play = click(".mh-memory-page__create-actions button:last-child");
export const PersonalMemoryDeleteConfirm = state("Personal Memory · Delete another card", { selectedId: "mem-analysis-1", deleteId: "mem-meeting-1" });
export const PersonalMemoryAssistant = state("Personal Memory · Assistant open", { assistantOpen: true });
export const PersonalMemoryAssistantFilled = state("Personal Memory · Suggestion fills prompt", { assistantOpen: true, assistantPrompt: "Definition of Attributed ROI" });
export const PersonalMemoryAssistantAnswer = state("Personal Memory · Assistant answer", { assistantOpen: true, assistantAnswers: [PERSONAL_MEMORY_SHELL.answerFor("Definition of Attributed ROI")] });
export const PersonalMemoryAssistantHistory = state("Personal Memory · Recent chats", { assistantOpen: true });
PersonalMemoryAssistantHistory.play = click(".mh-assistant__history .mh-assistant__icon");
export const PersonalMemoryAssistantMaximized = state("Personal Memory · Assistant maximized", { assistantOpen: true });
PersonalMemoryAssistantMaximized.play = click('button[aria-label="Maximize"]');
export const PersonalMemoryAssistantSkills = state("Personal Memory · Skill menu", { assistantOpen: true });
PersonalMemoryAssistantSkills.play = click(".mh-assistant__skill");
export const PersonalMemoryAssistantSkillSearch = state("Personal Memory · Skill search empty", { assistantOpen: true });
PersonalMemoryAssistantSkillSearch.play = async (context) => { await click(".mh-assistant__skill", ".mh-skill__category:nth-child(2)")(context); const field = context.canvasElement.querySelector(".mh-skill__search input"); if (!field) throw new Error("Skill search missing"); Object.getOwnPropertyDescriptor(field.ownerDocument.defaultView.HTMLInputElement.prototype, "value").set.call(field, "no matching model"); field.dispatchEvent(new field.ownerDocument.defaultView.Event("input", { bubbles: true })); };
export const PersonalMemoryAssistantSelected = state("Personal Memory · Selected model", { assistantOpen: true, selectedSkill: { id: "roi-diagnosis", type: "Analytical Model", title: "ROI diagnosis model" } });
export const PersonalMemoryModelHistory = state("Personal Memory · Model chat history", { assistantOpen: true, flow: { step: "history", threads: flowThreads(), rule: "", draft: {} } });
export const PersonalMemoryModelManual = state("Personal Memory · Manual model", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
export const PersonalMemoryModelGenerated = state("Personal Memory · Generated model", { assistantOpen: true, flow: { step: "generated", threads: flowThreads(), rule: "", draft: PERSONAL_MEMORY_SHELL.modelDraftFor(checkedMessages(), "") } });
export const PersonalMemoryModelError = state("Personal Memory · Model required fields", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
PersonalMemoryModelError.play = click(".mh-flow__foot .mh-flow__btn--primary");
export const PersonalMemoryModelEmpty = state("Personal Memory · Model needs a message", { assistantOpen: true, flow: { step: "history", threads: flowThreads().map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message, checked: false })) })), rule: "", draft: {} } });
PersonalMemoryModelEmpty.play = click(".mh-flow__foot .mh-flow__btn--primary");
