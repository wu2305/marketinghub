import React from "react";
import { KnowledgeCreatePage } from "./index.jsx";
import { KNOWLEDGE_CREATE } from "../../demo/content/knowledge-create.js";
import { useKnowledgeCreateDemo } from "../../demo/knowledge-create-demo.js";
import { knowledgeCreateTypes, knowledgeCreateModes } from "../../knowledge-create-options.js";
import { callbackProp, enumProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Pages", component: KnowledgeCreatePage, tags: ["autodocs"], parameters: { layout: "fullscreen" },
  args: { type: "Business Term", mode: "create", id: "", initial: {}, state: {} },
  argTypes: {
    type: enumProp(knowledgeCreateTypes, "Business Term", "Selected P08 knowledge form."),
    mode: enumProp(knowledgeCreateModes, "create", "Create, edit, or copy flow."),
    id: prop("string", { description: "Fixture record id for edit/copy." }),
    initial: prop("object", { description: "Starting controlled form values." }),
    state: prop("object", { description: "Starting result, dialog, menu, and validation state." }),
    onNavigate: callbackProp("onNavigate", "({id, params, href}) => void", { id: "interpreter", params: {}, href: "/assets/pages/knowledge.html" }),
    onTypeChange: callbackProp("onTypeChange", "({value}) => void", { value: "Data Model" }),
    onChange: callbackProp("onChange", "({name, value}) => void", { name: "title", value: "New term" }),
    onSave: callbackProp("onSave", "({type, mode, id, values, stage?}) => void", { type: "Business Term", mode: "create", values: { title: "New term" }, stage: "Draft" }),
    onSubmit: callbackProp("onSubmit", "({type, mode, id, values, stage?}) => void", { type: "Business Term", mode: "create", values: { title: "New term" }, stage: "Published" }),
    onCancel: callbackProp("onCancel", "({type}) => void", { type: "Business Term" }),
    onDialog: callbackProp("onDialog", "({kind}) => void", { kind: "guidance" }),
    onDialogClose: callbackProp("onDialogClose", "({reason}) => void", { reason: "close" }),
    onResultClose: callbackProp("onResultClose", "({reason}) => void", { reason: "close" }),
    onMenu: callbackProp("onMenu", "({name}) => void", { name: "businessDomain" }),
  },
  render: (args) => <Demo key={`${args.type}:${args.mode}:${args.id}:${JSON.stringify(args.initial)}:${JSON.stringify(args.state)}`} args={args} />,
};

function Demo({ args }) {
  const props = useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: args.type, mode: args.mode, id: args.id || undefined, initial: args.initial, state: args.state,
    onNavigate: args.onNavigate, onSave: args.onSave, onSubmit: args.onSubmit });
  return <KnowledgeCreatePage {...props} onTypeChange={(event) => { props.onTypeChange(event); args.onTypeChange?.(event); }} onChange={(event) => { props.onChange(event); args.onChange?.(event); }} onCancel={() => { props.onCancel(); args.onCancel?.({ type: props.type }); }} onDialog={(event) => { props.onDialog(event); args.onDialog?.(event); }} onDialogClose={(event) => { props.onDialogClose(event); args.onDialogClose?.(event); }} onResultClose={(event) => { props.onResultClose(event); args.onResultClose?.(event); }} onMenu={(event) => { props.onMenu(event); args.onMenu?.(event); }} />;
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
export const KnowledgeCreateAnalysisRequired = { name: "P08 · Analytical Model required errors", args: { type: "Analytical Model", state: { invalid: ["analysis_name", "trigger_when", "output_requirements"] } } };
export const KnowledgeCreateAnalysisGuidance = { name: "P08 · Analytical Model guidance", args: { type: "Analytical Model" }, play: async ({ canvasElement }) => { canvasElement.querySelector(".mh-kcf__help")?.focus(); } };
export const KnowledgeCreateAnalysisEdit = { name: "P08 · Analytical Model edit", args: { type: "Analytical Model", mode: "edit", id: "playbook-opportunity-scan" } };
export const KnowledgeCreateScenario = { name: "P08 · Scenario Reporting create", args: { type: "Scenario Reporting" } };
export const KnowledgeCreateScenarioGuidance = { name: "P08 · Scenario Reporting guidance", args: { type: "Scenario Reporting" }, play: async ({ canvasElement }) => { canvasElement.querySelector(".mh-kcf__help")?.focus(); } };
export const KnowledgeCreateScenarioRequired = { name: "P08 · Scenario Reporting required errors", args: { type: "Scenario Reporting", state: { invalid: ["scenario_report_title", "scenario_report_linked", "scenario_report_description", "scenario_report_blueprint"] } } };
export const KnowledgeCreateScenarioAttachment = { name: "P08 · Scenario Reporting attachment", args: { type: "Scenario Reporting", initial: { attachments: ["channel-report.pdf"] } } };
export const KnowledgeCreateScenarioEdit = { name: "P08 · Scenario Reporting edit with attachment", args: { type: "Scenario Reporting", mode: "edit", id: "scenario-channel-performance" } };
export const KnowledgeCreateSaved = { name: "P08 · Saved result", args: { type: "Principles", state: { result: { action: "save" } } } };
export const KnowledgeCreateSubmitted = { name: "P08 · Submitted result", args: { type: "Principles", state: { result: { action: "submit" } } } };
