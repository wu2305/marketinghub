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

export default { title: "Pages", component: ScenarioLibraryPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: bi("This page is Skill Library. It lists skills in a table. To build this page, set search, status, the selected skill, and the inline create or edit form. Set `onClick` with `action: \"create\"` to open a blank form. The form accepts a blank Submit. That matches the Demo. Submit in this Demo saves the skill as Under Review. This page is not Scenario Detail, Skill Edit, or Scenario Reports.", "这是 Skill Library 页面。它用表格列出技能。组合页面时，设置搜索、状态、当前技能，以及页内创建或编辑表单。用 `onClick` 并带上 `action: \"create\"` 打开空白表单。表单接受空白 Submit，这与 Demo 一致。这个 Demo 里的 Submit 会把技能存成 Under Review。本页不是 Scenario Detail、Skill Edit 或 Scenario Reports。") } } } };

export const ScenarioLibrary = {
  name: "Skill Library",
  args: { content: SKILL_LIBRARY, records: SKILL_LIBRARY.records, shell: SKILL_LIBRARY_SHELL, search: "", status: "all", mode: "list", initial: {} },
  argTypes: {
    records: { control: "object", description: bi("Skill records. A host can replace this list.", "技能记录。宿主可以替换这份列表。") },
    initial: { control: "object", description: bi("Selected id, preview, form, and assistant starting state.", "选中 id、预览、表单和助手的起始状态。") },
    status: enumProp(skillStatuses, "all", bi("Status filter.", "状态筛选。")),
    mode: enumProp(skillLibraryModes, "list", bi("Page mode. Values are list, create, and edit.", "页面模式。取值是 list、create 和 edit。")),
    search: { control: "text", description: bi("Search text.", "搜索文字。") },
    onChange: callbackProp("onChange", "({key:string,value:string|boolean}) => void", { key: "search", value: "Emily Wang" }, bi("The function runs at each search change. The result has `key` and `value`.", "搜索每次变化都会调用这个函数。结果里有 `key` 和 `value`。")),
    onSelect: callbackProp("onSelect", "({value:string}) => void", { value: "Draft" }, bi("The function runs when the user selects a status filter. The result has `value`.", "用户选择状态筛选时，会调用这个函数。结果里有 `value`。")),
    onOpen: callbackProp("onOpen", "({id:string,action?:'edit'}) => void", { id: "city-comparison" }, bi("The function runs when the user opens a skill. The result has `id`. Edit also has `action: \"edit\"`.", "用户打开一项技能时，会调用这个函数。结果里有 `id`。编辑时还会有 `action: \"edit\"`。")),
    onClick: callbackProp("onClick", "({action:'create'|'delete',id?:string}) => void", { action: "create" }, bi("The function runs for Create New Scenario or Delete. The result has `action`. Delete also has `id`.", "Create New Scenario 或 Delete 时，会调用这个函数。结果里有 `action`。删除时还会有 `id`。")),
    onAutoFill: callbackProp("onAutoFill", "({field:string}) => void; the demo fills the field with deterministic text", { field: "logic" }, bi("The function runs when the user presses AI Auto-fill. The result has `field`. The demo fills that field with fixed text.", "用户按下 AI Auto-fill 时，会调用这个函数。结果里有 `field`。demo 会用固定文字填入该字段。")),
    onRunPreview: callbackProp("onRunPreview", "({question:string,output:string}) => void", { question: "Explain the largest channel movement", output: "" }, bi("The function runs when the user runs the example preview. The result has `question` and `output`.", "用户运行示例预览时，会调用这个函数。结果里有 `question` 和 `output`。")),
    onSaveDraft: callbackProp("onSaveDraft", "({id:string,status:'Draft',values:object}) => void; the demo saves a Draft row and shows a Draft saved toast", { id: "skill-draft-1", status: "Draft", values: { name: "New scenario" } }, bi("The function runs when the user saves a draft. The result has `id`, `status: \"Draft\"`, and `values`. The demo shows a Draft saved toast.", "用户保存草稿时，会调用这个函数。结果里有 `id`、`status: \"Draft\"` 和 `values`。demo 会显示 Draft saved Toast。")),
    onSubmit: callbackProp("onSubmit", "({id:string,status:'Under Review',values:object}) => void; the demo saves the skill as Under Review and shows a Submitted for review toast", { id: "skill-draft-1", status: "Under Review", values: { name: "" } }, bi("The function runs when the user submits a skill. The result has `id`, `status: \"Under Review\"`, and `values`. The demo shows a Submitted for review toast.", "用户提交技能时，会调用这个函数。结果里有 `id`、`status: \"Under Review\"` 和 `values`。demo 会显示 Submitted for review Toast。")),
    onCancel: callbackProp("onCancel", "({reason:string}) => void", { reason: "cancel" }, bi("The function runs when the user cancels the inline form. The result has `reason`.", "用户取消页内表单时，会调用这个函数。结果里有 `reason`。")),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "interpreter", params: {}, href: "/assets/pages/knowledge.html", label: "Knowledge Management" }, bi("The function runs when a nav link opens another page. The result has `id`, `params`, `href`, and `label`.", "导航要打开另一页时，会调用这个函数。结果里有 `id`、`params`、`href` 和 `label`。")),
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
