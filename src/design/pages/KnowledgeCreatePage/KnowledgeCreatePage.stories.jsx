import React from "react";
import { KnowledgeCreatePage } from "./index.jsx";
import { KNOWLEDGE_CREATE } from "../../demo/content/knowledge-create.js";
import { useKnowledgeCreateDemo } from "../../demo/knowledge-create-demo.js";
import { knowledgeCreateTypes, knowledgeCreateModes } from "../../knowledge-create-options.js";
import { callbackProp, enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Pages", component: KnowledgeCreatePage, tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi("This page creates or edits one knowledge record. Set `type` to choose the form. Cancel does not save. It returns to the list. If there are unsaved changes, Cancel first asks whether to discard them.\n\n**Business Term.** The buttons are Save and Submit. The form has no Enable or Disable switch. Required fields are Title, Term Type, and Description. An empty required field shows a red border and \"This field is required.\"\n- Save sets status and `enabled` to false, and stage to Draft.\n- Submit keeps the form's availability and sets stage to Under Review. The page then returns to the list with `notice=submitted`.\n\n**Analytical Model.** The buttons are Save Draft and Publish & Enable. Required fields are Analysis Name, Business Domain, Trigger When, and Output Requirements.\n- Save Draft sets status and `enabled` to false, and stage to Draft.\n- Publish & Enable sets status and `enabled` to true, and stage to Published.\n- Both open a result dialog. Closing the dialog returns to the list.\n\n**Scenario Reporting.** Submit sets status and `enabled` to false, and stage to Queued.\n\n**Other types.** Submit sets stage to Under Review. Report Context description editing updates an existing record and does not add a stage.\n\nThis story uses `useKnowledgeCreateDemo`.", "这个页面用来创建或编辑一条知识。用 `type` 选择表单。Cancel 不保存，并返回列表。如果有未保存的更改，Cancel 会先询问是否放弃。\n\n**Business Term。** 按钮是 Save 和 Submit。表单没有 Enable 或 Disable 开关。必填字段是 Title、Term Type 和 Description。空的必填字段会显示红色边框和 \"This field is required.\"。\n- Save 把 status 和 `enabled` 设为 false，把 stage 设为 Draft。\n- Submit 保留表单当前的可用性，并把 stage 设为 Under Review。然后页面带着 `notice=submitted` 返回列表。\n\n**Analytical Model。** 按钮是 Save Draft 和 Publish & Enable。必填字段是 Analysis Name、Business Domain、Trigger When 和 Output Requirements。\n- Save Draft 把 status 和 `enabled` 设为 false，把 stage 设为 Draft。\n- Publish & Enable 把 status 和 `enabled` 设为 true，把 stage 设为 Published。\n- 两者都会打开结果对话框。关闭对话框后返回列表。\n\n**Scenario Reporting。** Submit 把 status 和 `enabled` 设为 false，把 stage 设为 Queued。\n\n**其他类型。** Submit 把 stage 设为 Under Review。Report Context 描述编辑会更新已有记录，不会新增 stage。\n\n这个故事使用 `useKnowledgeCreateDemo`。"),
      },
    },
  },
  args: { type: "Business Term", mode: "create", id: "", initial: {}, state: {} },
  argTypes: {
    type: enumProp(knowledgeCreateTypes, "Business Term", bi("Knowledge form on this page.", "本页当前的知识表单。")),
    mode: enumProp(knowledgeCreateModes, "create", bi("Create, edit, or copy.", "创建、编辑或复制。")),
    id: prop("string", { description: bi("Record id for edit or copy.", "用于编辑或复制的记录 id。") }),
    initial: prop("object", { description: bi("Starting field values.", "起始字段值。") }),
    state: prop("object", { description: bi("Starting result, dialog, menu, and validation state.", "起始的结果、对话框、菜单与校验状态。") }),
    onNavigate: callbackProp("onNavigate", "({id, params, href}) => void", { id: "interpreter", params: {}, href: "/assets/pages/knowledge.html" }, bi("The function runs when a link opens another page. The result has `id`, `params`, and `href`.", "链接要打开另一页时会调用这个函数。结果里有 `id`、`params` 和 `href`。")),
    onTypeChange: callbackProp("onTypeChange", "({value}) => void", { value: "Data Model" }, bi("The function runs when the knowledge type changes. The result has `value`.", "知识类型变化时会调用这个函数。结果里有 `value`。")),
    onChange: callbackProp("onChange", "({name, value}) => void", { name: "title", value: "New term" }, bi("The function runs at each field change. The result has `name` and `value`.", "每次字段变化都会调用这个函数。结果里有 `name` 和 `value`。")),
    onSave: callbackProp("onSave", "({type, mode, id, values, stage?}) => void", { type: "Business Term", mode: "create", id: "", values: { title: "New term" }, stage: "Draft" }, bi("The function runs on Save. The page sends `{type, mode, values}`. The demo hook adds `id` and `stage`. Save on Business Term and Analytical Model sets Disabled and Draft.", "点击 Save 时会调用这个函数。页面发出 `{type, mode, values}`。demo hook 再补上 `id` 和 `stage`。Business Term 和 Analytical Model 的 Save 会写成 Disabled 和 Draft。")),
    onSubmit: callbackProp("onSubmit", "({type, mode, id, values, stage?}) => void", { type: "Business Term", mode: "create", id: "", values: { title: "New term" }, stage: "Under Review" }, bi("The function runs on Submit. The page sends `{type, mode, values}`. The demo hook adds `id` and `stage`. Business Term Submit keeps the form's availability and sets Under Review. Analytical Model Publish & Enable sets Enabled and Published. Scenario Reporting Submit sets Queued. Other create flows set Under Review. Report Context description editing does not add a stage.", "点击 Submit 时会调用这个函数。页面发出 `{type, mode, values}`。demo hook 再补上 `id` 和 `stage`。Business Term 的 Submit 会保留表单当前的可用性，并把 stage 设为 Under Review。Analytical Model 的 Publish & Enable 会写成 Enabled 和 Published。Scenario Reporting 的 Submit 会写成 Queued。其他创建流程写成 Under Review。Report Context 描述编辑不会新增 stage。")),
    onCancel: callbackProp("onCancel", "({type}) => void", { type: "Business Term" }, bi("The function runs on Cancel. Cancel does not save. Cancel returns to the list.", "点击 Cancel 时会调用这个函数。Cancel 不保存，并返回列表。")),
    onDiscard: callbackProp("onDiscard", "({type, mode, values}) => void", { type: "Analytical Model", mode: "create", values: { analysis_name: "Draft analysis" } }, bi("The function runs after Discard on Analytical Model. That happens when Cancel runs with unsaved changes.", "Analytical Model 确认 Discard 后会调用这个函数。有未保存更改时点击 Cancel 就会走到这一步。")),
    onDialog: callbackProp("onDialog", "({kind}) => void", { kind: "guidance" }, bi("The function runs when a dialog opens. The result has `kind`.", "对话框打开时会调用这个函数。结果里有 `kind`。")),
    onDialogClose: callbackProp("onDialogClose", "({reason}) => void", { reason: "close" }, bi("The function runs when a dialog closes. The result has `reason`.", "对话框关闭时会调用这个函数。结果里有 `reason`。")),
    onResultClose: callbackProp("onResultClose", "({reason}) => void", { reason: "close" }, bi("The function runs when the result dialog closes. The result has `reason`.", "结果对话框关闭时会调用这个函数。结果里有 `reason`。")),
    onMenu: callbackProp("onMenu", "({name}) => void", { name: "businessDomain" }, bi("The function runs when a picker opens or closes. The result has `name`.", "选择器打开或关闭时会调用这个函数。结果里有 `name`。")),
  },
  render: (args) => <Demo key={`${args.type}:${args.mode}:${args.id}:${JSON.stringify(args.initial)}:${JSON.stringify(args.state)}`} args={args} />,
};

function Demo({ args }) {
  const props = useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: args.type, mode: args.mode, id: args.id || undefined, initial: args.initial, state: args.state,
    onNavigate: args.onNavigate, onSave: args.onSave, onSubmit: args.onSubmit });
  return <KnowledgeCreatePage {...props} onTypeChange={(event) => { props.onTypeChange(event); args.onTypeChange?.(event); }} onChange={(event) => { props.onChange(event); args.onChange?.(event); }} onCancel={() => { props.onCancel(); args.onCancel?.({ type: props.type }); }} onDiscard={(event) => { props.onDiscard(event); args.onDiscard?.(event); }} onDialog={(event) => { props.onDialog(event); args.onDialog?.(event); }} onDialogClose={(event) => { props.onDialogClose(event); args.onDialogClose?.(event); }} onResultClose={(event) => { props.onResultClose(event); args.onResultClose?.(event); }} onMenu={(event) => { props.onMenu(event); args.onMenu?.(event); }} />;
}

export const KnowledgeCreate = { name: "P08 · Business Term create" };
export const KnowledgeCreateScope = { name: "P08 · Business Term Data Model link", args: { initial: { scope: ["Marketing"] } } };
export const KnowledgeCreateGlobalSynonym = { name: "P08 · Global Synonym", args: { initial: { kind: "Global Synonym" } } };
export const KnowledgeCreateBusinessEdit = { name: "P08 · Business Term edit", args: { mode: "edit", id: "business-term-gmv" } };
export const KnowledgeCreateRequired = { name: "P08 · Required field errors", args: { state: { invalid: ["title", "description"] } } };
export const KnowledgeCreatePrinciples = { name: "P08 · Principles", args: { type: "Principles" } };
export const KnowledgeCreatePrinciplesEdit = { name: "P08 · Principles edit", args: { type: "Principles", mode: "edit", id: "investment-principles" } };
export const KnowledgeCreatePrinciplesCopy = { name: "P08 · Principles copy", args: { type: "Principles", mode: "copy", id: "investment-principles" } };
export const KnowledgeCreateReportContext = { name: "P08 · Report Context", args: { type: "Report Context" } };
export const KnowledgeCreateReportAiOff = { name: "P08 · Report Context AI Overview off", args: { type: "Report Context", initial: { aiOverview: false } } };
export const KnowledgeCreateReportEdit = { name: "P08 · Report Context edit locked", args: { type: "Report Context", mode: "edit", id: "city-report-context" } };
export const KnowledgeCreateReportUnknownEdit = { name: "P08 · Report Context unknown edit", args: { type: "Report Context", mode: "edit", id: "missing-report-context" } };
export const KnowledgeCreateReportUnlocked = { name: "P08 · Report description unlocked", args: { type: "Report Context", mode: "edit", id: "city-report-context", initial: { unlocked: true } } };
export const KnowledgeCreateReportHistory = { name: "P08 · Report description history", args: { type: "Report Context", mode: "edit", id: "city-report-context", state: { dialog: "history" } } };
export const KnowledgeCreateReportConfirm = { name: "P08 · Report description confirmation", args: { type: "Report Context", mode: "edit", id: "city-report-context", initial: { unlocked: true, description: "Updated city strategy report description." }, state: { dialog: "confirm" } } };
export const KnowledgeCreateDataModel = { name: "P08 · Data Model field configuration", args: { type: "Data Model" } };
export const KnowledgeCreateDataModelRequired = { name: "P08 · Data Model required name", args: { type: "Data Model", state: { invalid: ["modelName"] } } };
export const KnowledgeCreateDataModelBasic = { name: "P08 · Data Model basic information", args: { type: "Data Model", initial: { modelTab: "basic" } } };
export const KnowledgeCreateDataModelSecondBasic = { name: "P08 · Selected model table basic information", args: { type: "Data Model", initial: { modelTable: "dim_customer", modelTab: "basic" } } };
export const KnowledgeCreateDataModelEvent = { name: "P08 · Data Model event table", args: { type: "Data Model", initial: { modelGroup: "event", modelTable: "fact_media_performance" } } };
export const KnowledgeCreateDataModelSynonym = { name: "P08 · Data Model field synonym", args: { type: "Data Model", initial: { synonymEditing: "dim_channel:channel_id" } } };
export const KnowledgeCreateDataModelPreview = { name: "P08 · Data Model preview result", args: { type: "Data Model", state: { dialog: "preview" } } };
export const KnowledgeCreateDataModelSearchEmpty = { name: "P08 · Data Model search empty", args: { type: "Data Model", initial: { tableSearch: "zzzz" } } };
export const KnowledgeCreateDataModelSynonymSaved = { name: "P08 · Data Model added synonym", args: { type: "Data Model", initial: { "table:dim_channel:field:channel_id:synonyms": ["Customer Channel"] } } };
export const KnowledgeCreateDataModelSmart = { name: "P08 · Smart Modeling result", args: { type: "Data Model", state: { dialog: "smart" } } };
export const KnowledgeCreateMetric = { name: "P08 · Metric Dictionary formula", args: { type: "Metric Dictionary" } };
export const KnowledgeCreateMetricTest = { name: "P08 · Metric Test success", args: { type: "Metric Dictionary", initial: { metricTokens: [{ kind: "metric", value: "Visit Count" }], metricFormula: "Visit Count" }, state: { dialog: "test" } } };
export const KnowledgeCreateMetricRequired = { name: "P08 · Metric required name and formula", args: { type: "Metric Dictionary", state: { invalid: ["metricName", "metricFormula"] } } };
export const KnowledgeCreateMetricTestEmpty = { name: "P08 · Metric Test formula required", args: { type: "Metric Dictionary", state: { dialog: "test", invalid: ["metricFormula"] } } };
export const KnowledgeCreateMetricToken = { name: "P08 · Metric locked formula token", args: { type: "Metric Dictionary", initial: { metricTokens: [{ kind: "metric", value: "Visit Count" }], metricFormula: "Visit Count" } } };
export const KnowledgeCreateSynonyms = { name: "P08 · Synonym Management", args: { type: "Synonyms" } };
export const KnowledgeCreateSynonymRequired = { name: "P08 · Synonym row required errors", args: { type: "Synonyms", initial: { synonymRows: [{ term: "", synonym: "", kind: "", domain: [], reports: [], dataset: [], status: "Enabled" }] }, state: { invalid: ["synonymRows"] } } };
export const KnowledgeCreateSynonymRow = { name: "P08 · New synonym row", args: { type: "Synonyms", initial: { synonymRows: [{ term: "", synonym: "", kind: "", domain: [], reports: [], dataset: [], status: "Enabled" }] } } };
export const KnowledgeCreateAnalysis = { name: "P08 · Analytical Model create", args: { type: "Analytical Model" } };
export const KnowledgeCreateAnalysisRequired = { name: "P08 · Analytical Model required errors", args: { type: "Analytical Model", state: { invalid: ["analysis_name", "businessDomain", "trigger_when", "output_requirements"] } } };
export const KnowledgeCreateAnalysisGuidance = { name: "P08 · Analytical Model guidance", args: { type: "Analytical Model" }, play: async ({ canvasElement }) => { canvasElement.querySelector(".mh-kcf__help[aria-label='About Analysis Logic']")?.focus(); } };
export const KnowledgeCreateAnalysisDomains = { name: "P08 · Analytical Model business domain menu", args: { type: "Analytical Model", initial: { businessDomain: ["City Strategy", "4P"] }, state: { menu: "businessDomain" } } };
export const KnowledgeCreateAnalysisMetrics = { name: "P08 · Analytical Model metrics for chosen domains", args: { type: "Analytical Model", initial: { businessDomain: ["City Strategy", "4P"], metrics: ["Campaign ROI"] }, state: { menu: "metrics" } } };
export const KnowledgeCreateAnalysisNoMetrics = { name: "P08 · Analytical Model domain without metrics", args: { type: "Analytical Model", initial: { businessDomain: ["Marketing"] }, state: { menu: "metrics" } } };
export const KnowledgeCreateAnalysisDiscard = { name: "P08 · Analytical Model discard changes", args: { type: "Analytical Model", initial: { analysis_name: "Draft analysis" }, state: { dialog: "discard" } } };
export const KnowledgeCreateAnalysisSaved = { name: "P08 · Analytical Model draft saved", args: { type: "Analytical Model", state: { result: { action: "save" } } } };
export const KnowledgeCreateAnalysisPublished = { name: "P08 · Analytical Model published and enabled", args: { type: "Analytical Model", state: { result: { action: "submit" } } } };
export const KnowledgeCreateAnalysisEdit = { name: "P08 · Analytical Model edit", args: { type: "Analytical Model", mode: "edit", id: "playbook-opportunity-scan" } };
export const KnowledgeCreateAnalysisUnavailable = { name: "P08 · Analytical Model edit unavailable", args: { type: "Analytical Model", mode: "edit", id: "missing-analysis" } };
export const KnowledgeCreateScenario = { name: "P08 · Scenario Reporting create", args: { type: "Scenario Reporting" } };
export const KnowledgeCreateScenarioGuidance = { name: "P08 · Scenario Reporting guidance", args: { type: "Scenario Reporting" }, play: async ({ canvasElement }) => { canvasElement.querySelector(".mh-kcf__help")?.focus(); } };
export const KnowledgeCreateScenarioRequired = { name: "P08 · Scenario Reporting required errors", args: { type: "Scenario Reporting", state: { invalid: ["scenario_report_title", "scenario_report_linked", "scenario_report_description", "scenario_report_blueprint"] } } };
export const KnowledgeCreateScenarioAttachment = { name: "P08 · Scenario Reporting attachment", args: { type: "Scenario Reporting", initial: { attachments: ["channel-report.pdf"] } } };
export const KnowledgeCreateScenarioEdit = { name: "P08 · Scenario Reporting edit with attachment", args: { type: "Scenario Reporting", mode: "edit", id: "scenario-channel-performance" } };
export const KnowledgeCreateSaved = { name: "P08 · Saved result", args: { type: "Principles", state: { result: { action: "save" } } } };
export const KnowledgeCreateSubmitted = { name: "P08 · Submitted result", args: { type: "Principles", state: { result: { action: "submit" } } } };
