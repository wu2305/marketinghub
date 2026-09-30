import React from "react";
import { SKILL_LIBRARY, SKILL_LIBRARY_SHELL } from "../../demo/content/skill-library.js";
import { useSkillLibraryDemo } from "../../demo/skill-library-demo.js";
import { callbackProp, enumProp, bi } from "../../lib/story-helpers.js";
import { ScenarioLibraryPage, skillLibraryModes, skillStatuses } from "./index.jsx";

const hrefFor = (id, params = {}) => {
  const path = ({ interpreter: "/assets/pages/knowledge.html", "review-center": "/assets/pages/review-center.html", "scenario-library": "/assets/pages/scenario-library.html", "feedback-quality": "/assets/pages/feedback-quality.html" })[id];
  const query = new URLSearchParams(params).toString();
  return path && query ? `${path}?${query}` : path;
};

export default { title: "Pages", component: ScenarioLibraryPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: bi("P15 Skill Library. Semantic page props are driven by the same private deterministic hook in Storybook and the independent host. The inline form intentionally accepts blank Submit, matching the source's novalidate behavior.", "P15 Skill Library。语义化的页面 props 由 Storybook 与独立宿主共用的同一个私有确定性 hook 驱动。页内表单有意接受空白提交，与源页面的 novalidate 行为一致。") } } } };

export const ScenarioLibrary = {
  name: "Skill Library",
  args: { content: SKILL_LIBRARY, records: SKILL_LIBRARY.records, shell: SKILL_LIBRARY_SHELL, search: "", status: "all", mode: "list", initial: {} },
  argTypes: {
    records: { control: "object", description: bi("Replaceable source-backed skill fixture.", "可替换的、以源页面为依据的技能夹具。") },
    initial: { control: "object", description: bi("Selected id, preview, form and assistant starting state.", "选中 id、预览、表单与助手的起始状态。") },
    status: enumProp(skillStatuses, "all", bi("Status filter controlled by the private demo hook.", "由私有 demo hook 控制的状态筛选。")),
    mode: enumProp(skillLibraryModes, "list", bi("List, fresh create or populated inline edit.", "列表、全新创建或已填充的页内编辑。")),
    search: { control: "text" },
    onChange: callbackProp("onChange", "({key:string,value:string|boolean}) => void", { key: "search", value: "Emily Wang" }),
    onSelect: callbackProp("onSelect", "({value:string}) => void", { value: "Draft" }),
    onOpen: callbackProp("onOpen", "({id:string,action?:'edit'}) => void", { id: "city-comparison" }),
    onClick: callbackProp("onClick", "({action:'create'|'delete',id?:string}) => void", { action: "create" }),
    onAutoFill: callbackProp("onAutoFill", "({field:string}) => void; the demo fills the field with deterministic text", { field: "logic" }),
    onRunPreview: callbackProp("onRunPreview", "({question:string,output:string}) => void", { question: "Explain the largest channel movement", output: "" }),
    onSaveDraft: callbackProp("onSaveDraft", "({id:string,status:'Draft',values:object}) => void; the demo saves a Draft row and shows a Draft saved toast", { id: "skill-draft-1", status: "Draft", values: { name: "New scenario" } }),
    onSubmit: callbackProp("onSubmit", "({id:string,status:'Under Review',values:object}) => void; the demo saves the skill as Under Review and shows a Submitted for review toast", { id: "skill-draft-1", status: "Under Review", values: { name: "" } }),
    onCancel: callbackProp("onCancel", "({reason:string}) => void", { reason: "cancel" }),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "interpreter", params: {}, href: "/assets/pages/knowledge.html", label: "Knowledge Management" }),
  },
  render: function SkillLibraryStory(args) {
    const initial = React.useMemo(() => ({ ...args.initial, search: args.search, status: args.status, mode: args.mode }), [args.initial, args.search, args.status, args.mode]);
    const page = useSkillLibraryDemo({ ...args, initial, hrefFor });
    return <ScenarioLibraryPage {...page} />;
  },
};

const state = (name, values = {}) => ({ ...ScenarioLibrary, name, args: { ...ScenarioLibrary.args, ...values, initial: values.initial || {}, search: values.search || "", status: values.status || "all", mode: values.mode || "list" } });
const click = (...selectors) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  const frame = () => new Promise((resolve) => doc.defaultView.requestAnimationFrame(resolve));
  await frame(); await frame();
  for (const selector of selectors) {
    let node;
    for (let n = 0; n < 30; n += 1) { node = canvasElement.querySelector(selector) || doc.querySelector(selector); if (node) break; await frame(); }
    if (!node) throw new Error(`Skill Library story control missing: ${selector}`);
    node.click(); await frame();
  }
};

export const ScenarioLibraryOwnerSearch = state("Skill Library · Owner search", { search: "Emily Wang" });
export const ScenarioLibraryEmpty = state("Skill Library · No matching scenarios", { search: "no matching scenario" });
export const ScenarioLibraryDetail = state("Skill Library · Detail", { initial: { selectedId: "scenario-channel-performance" } });
export const ScenarioLibraryDraftDetail = state("Skill Library · Draft detail", { initial: { selectedId: "competitive-analysis" } });
export const ScenarioLibraryPreview = state("Skill Library · Example preview", { initial: { selectedId: "scenario-channel-performance", previewOpen: true } });
export const ScenarioLibraryDeleteConfirm = state("Skill Library · Delete confirmation", { initial: { selectedId: "scenario-channel-performance", deletingId: "scenario-channel-performance" } });
export const ScenarioLibraryCreate = state("Skill Library · Fresh create", { mode: "create" });
export const ScenarioLibraryEdit = state("Skill Library · Inline edit", { mode: "edit", initial: { selectedId: "scenario-channel-performance" } });
export const ScenarioLibraryCreateAfterEdit = state("Skill Library · New form clears prior edit");
ScenarioLibraryCreateAfterEdit.play = click('.mh-skill-page tbody tr:first-child', '.mh-skill-detail__actions button:first-child', '.mh-skill-form__footer button:first-child', '.mh-library-toolbar__create button');
export const ScenarioLibraryBlankSubmit = state("Skill Library · Blank Submit sends to review", { mode: "create" });
ScenarioLibraryBlankSubmit.play = click('.mh-skill-form__submit');
export const ScenarioLibraryAssistant = state("Skill Library · Assistant open", { initial: { assistantOpen: true } });
export const ScenarioLibraryAssistantAnswer = state("Skill Library · Assistant answer", { initial: { assistantOpen: true, assistantAnswers: [SKILL_LIBRARY_SHELL.answerFor("Definition of Attributed ROI")] } });
export const ScenarioLibraryAssistantHistory = state("Skill Library · Assistant recent chats", { initial: { assistantOpen: true } });
ScenarioLibraryAssistantHistory.play = click('.mh-assistant__history .mh-assistant__icon');
export const ScenarioLibraryAssistantSkills = state("Skill Library · Assistant skill menu", { initial: { assistantOpen: true } });
ScenarioLibraryAssistantSkills.play = click('.mh-assistant__skill');
export const ScenarioLibraryModelHistory = state("Skill Library · Model chat history", { initial: { assistantOpen: true, flow: { step: "history", threads: SKILL_LIBRARY_SHELL.modelFlow.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) })), rule: "", draft: {} } } });
