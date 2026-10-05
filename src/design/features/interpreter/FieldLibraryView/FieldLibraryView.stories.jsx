import { INTERPRETER } from "../../../content.js";
import { FieldLibraryView, fieldLibraryTypes } from "./index.jsx";
import { useFieldLibraryDemo } from "../../../demo/field-library-demo.js";
import { callbackProp, enumProp, prop, bi } from "../../../lib/story-helpers.js";

const bundle = INTERPRETER.fieldLibrary;
const AM_ID = "playbook-opportunity-scan";

export default {
  title: "Features/Interpreter/Field library view",
  component: FieldLibraryView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          bi("This component shows four knowledge libraries on AI Interpreter. The types are Report Context, Metric Dictionary, Analytical Model, and Email Reports. Analytical Model has Edit, Delete, and Disable. A blocked action stays clickable. The result has `reason`. Disable knowledge before you edit or delete it. Only knowledge created by you can be managed. Report Context can edit the description without that gate. This view is not Scenario Reports and not Skill Library.", "这个组件显示 AI Interpreter 上的四个知识库。类型是 Report Context、Metric Dictionary、Analytical Model 和 Email Reports。Analytical Model 有 Edit、Delete 和 Disable。被阻止的操作仍可点击。结果里有 `reason`。编辑或删除前要先 Disable。只有你自己创建的知识才能管理。Report Context 编辑描述不受这个限制。这个视图不是 Scenario Reports，也不是 Skill Library。"),
      },
    },
  },
  args: {
    ...bundle,
    type: "Report Context",
    records: INTERPRETER.records,
    query: "",
    selected: {},
    page: 1,
    pageSize: 10,
    detail: null,
    descriptionEdit: null,
    dialog: null,
  },
  argTypes: {
    type: enumProp(fieldLibraryTypes, "Report Context", bi("Active knowledge type — switches the card composition, filters, drawer sections and available actions.", "当前知识类型：切换卡片组成、筛选、抽屉区块与可用操作。")),
    records: prop("Array<AssetRecord>", {
      description: bi("All page records — fm types are normalized by the container (`normalizeFieldRecord`); Scenario Reporting records resolve the RC drawer's linked-scenario chips.", "全部页面记录：fm 类型由容器规范化（`normalizeFieldRecord`）；Scenario Reporting 记录用于解析 RC 抽屉中的关联场景标签。"),
      control: false,
    }),
    currentUser: prop("string", { defaultValue: "Current User", description: bi("Identity constant — only own Analytical Model records can be managed.", "身份常量：只能管理自己的 Analytical Model 记录。") }),
    strings: prop("object", { description: bi("All copy: search/filter labels, card labels, drawer section headings, dialog text, tooltips.", "全部文案：搜索/筛选标签、卡片标签、抽屉区块标题、对话框文字、提示。"), control: false }),
    createHref: prop("string", { description: bi("Add Analytical Model link target. The link opens Knowledge create.", "Add Analytical Model 的链接目标。链接会打开 Knowledge create。") }),
    editHref: prop("(id: string) => string", { description: bi("AM edit target — emitted via onNavigate.", "AM 编辑目标，通过 onNavigate 触发。"), control: false }),
    dashboardHref: prop("string", { description: bi("RC drawer \"Open Dashboard\" link target.", "RC 抽屉中 \"Open Dashboard\" 的链接目标。") }),
    scenarioHref: prop("(id: string) => string", { description: bi("RC drawer linked-scenario chip href builder.", "RC 抽屉中关联场景标签的 href 生成函数。"), control: false }),
    query: prop("string", { defaultValue: "", description: bi("Initial search text (whole-record substring match, like the original).", "初始搜索文字（对整条记录做子串匹配，与原始 Demo 一致）。") }),
    selected: prop("{ filterId: string[] }", { description: bi("Initial filter selections — OR within a filter, AND across.", "初始筛选选择：同一筛选内为 OR，不同筛选之间为 AND。"), control: false }),
    page: prop("number", { defaultValue: 1 }),
    pageSize: prop("number", { defaultValue: 10, control: "inline-radio", options: [5, 10, 20] }),
    pageSizes: prop("Array<number>", { defaultValue: [5, 10, 20] }),
    detail: prop("string | null", { defaultValue: null, description: bi("Record id opened in the detail drawer (the `?detail=` deep link).", "在详情抽屉中打开的记录 id（即 `?detail=` 深链接）。") }),
    descriptionEdit: prop("string | null", { defaultValue: null, description: bi("Record id with the Report Description edit dialog open.", "打开了 Report Description 编辑对话框的记录 id。"), control: false }),
    dialog: prop('{ kind: "disable-confirm" | "delete-confirm" | "delete-blocked", id: string } | null', { defaultValue: null, description: bi("Seeds an open confirm/info dialog (stories only — normally opened via the AM action buttons).", "预置一个已打开的确认/通知对话框（仅用于故事；正常情况下通过 AM 操作按钮打开）。"), control: false }),
    totals: prop("{ shown: number, total: number }", { description: bi("Result count shown in the toolbar.", "工具栏中显示的结果数量。"), control: false }),
    toast: prop("string", { description: bi("Success message after disable/delete; empty = hidden.", "停用/删除后的成功消息；为空则隐藏。"), control: false }),
    filters: prop("Array<FilterDef>", { description: bi("Checkbox disclosure descriptors computed by the container (per type).", "由容器按类型计算出的复选框展开式筛选描述。"), control: false }),
    searchRef: prop("React.Ref", { description: bi("Forwarded to the search input so page-level '/' and Cmd/Ctrl+K shortcuts focus it.", "转发给搜索输入框，使页面级的 '/' 与 Cmd/Ctrl+K 快捷键可以聚焦它。"), control: false }),
    onQueryChange: callbackProp("onQueryChange", "(event: { name, value }) => void", { name: "search", value: "gmv" }, bi("Search input change; resets to page 1.", "搜索输入变化；重置到第 1 页。")),
    onFilterToggle: callbackProp("onFilterToggle", "(event: { id, value, checked }) => void", { id: "status", value: "Disable", checked: true }, bi("Checkbox toggle inside a filter disclosure; resets to page 1.", "筛选展开区内的复选框切换；重置到第 1 页。")),
    onPage: callbackProp("onPage", "(event: { page: number }) => void", { page: 2 }, bi("Previous/Next page.", "上一页/下一页。")),
    onPageSize: callbackProp("onPageSize", "(event: { pageSize: number }) => void", { pageSize: 20 }, bi("Rows-per-page change; resets to page 1.", "每页条数变化；重置到第 1 页。")),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "city-report-context" }, bi("Title button or card click opens the detail drawer.", "点击标题按钮或卡片会打开详情抽屉。")),
    onAction: callbackProp("onAction", "(event: { action, id, blocked?, reason? }) => void", { action: "edit", id: AM_ID, blocked: false, reason: null }, bi("The function runs on an Analytical Model action. It also runs on the Report Context pencil. That pencil action is `edit-description`. A blocked click still runs.", "Analytical Model 的操作会调用这个函数。Report Context 的铅笔按钮也会调用。那个操作名是 `edit-description`。被阻止的点击也会调用。")),
    onClearFilters: callbackProp("onClearFilters", "(event: { reason }) => void", { reason: "empty-state" }, bi("Clear filters from the no-results state.", "在无结果状态下清除筛选。")),
    onCloseDetail: callbackProp("onCloseDetail", "(event: { reason }) => void", { reason: "button" }, bi("Detail drawer dismissed (×, scrim, Escape, Close button).", "详情抽屉被关闭（×、遮罩、Escape、Close 按钮）。")),
    onDialogConfirm: callbackProp("onDialogConfirm", "(event: { confirmed: true }) => void", { confirmed: true }, bi("Confirm dialog's primary action — runs the pending operation.", "确认对话框的主操作：执行待处理的操作。")),
    onDialogCancel: callbackProp("onDialogCancel", "(event: { reason }) => void", { reason: "cancel" }, bi("Confirm/info dialog dismissed.", "确认/通知对话框被关闭。")),
    onDescriptionChange: callbackProp("onDescriptionChange", "(event: { value }) => void", { value: "Updated description." }, bi("Textarea input in the RC description dialog; Confirm enables once the value differs.", "RC 描述对话框中的文本域输入；值与原值不同后 Confirm 才可用。")),
    onDescriptionConfirm: callbackProp("onDescriptionConfirm", "(event: { id }) => void", { id: "city-report-context" }, bi("Description dialog Confirm — writes the new text and appends the history entry.", "描述对话框的 Confirm：写入新文字并追加历史记录。")),
    onDescriptionCancel: callbackProp("onDescriptionCancel", "(event: { reason }) => void", { reason: "cancel" }, bi("Description dialog dismissed.", "描述对话框被关闭。")),
    onCreate: callbackProp("onCreate", "(event: { href }) => void", { href: bundle.createHref }, bi("Add Analytical Model link activated.", "点击 Add Analytical Model 链接。")),
    onNavigate: callbackProp("onNavigate", "(event: { href, id? }) => void", { href: "knowledge-create.html?type=Analytical%20Model&mode=edit&id=" + AM_ID, id: AM_ID }, bi("AM edit action navigates to the create page in edit mode.", "AM 编辑操作会跳转到处于编辑模式的创建页。")),
  },
  render: function FieldLibraryStory(args) {
    const viewProps = useFieldLibraryDemo(args);
    return <FieldLibraryView {...viewProps} />;
  },
};

export const ReportContext = {};

export const MetricDictionary = {
  args: { type: "Metric Dictionary" },
};

export const AnalyticalModel = {
  args: { type: "Analytical Model" },
};

export const EmailReports = {
  args: { type: "Email Reports" },
};

export const ReportContextDetail = {
  args: { type: "Report Context", detail: "city-report-context" },
};

export const ReportContextDescriptionEdit = {
  args: { type: "Report Context", detail: "city-report-context", descriptionEdit: "city-report-context" },
};

export const MetricDictionaryDetail = {
  args: { type: "Metric Dictionary", detail: "metric-dictionary-member-conversion" },
};

export const AnalyticalModelDetail = {
  args: { type: "Analytical Model", detail: AM_ID },
};

/* The seeded model is a draft, so it is offline (R3). These two stories use
   a published copy to show the enabled → disabled flow. */
const published = (status) => INTERPRETER.records.map((record) => (record.id === AM_ID ? { ...record, stage: "Published", status } : record));

export const AnalyticalModelDisabled = {
  args: { type: "Analytical Model", records: published("Disable") },
};

export const AnalyticalModelDisableConfirm = {
  args: { type: "Analytical Model", records: published("Enable"), dialog: { kind: "disable-confirm", id: AM_ID } },
};

export const AnalyticalModelDeleteBlocked = {
  args: { type: "Analytical Model", detail: AM_ID, dialog: { kind: "delete-blocked", id: AM_ID } },
};

export const EmailReportsDetail = {
  args: { type: "Email Reports", detail: "email-report-weekly-performance" },
};

export const FilteredEmpty = {
  args: { query: "zzzzz" },
};
