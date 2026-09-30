import { INTERPRETER } from "../../../content.js";
import { useScenarioDemo } from "../../../demo/scenario-demo.js";
import { callbackProp, prop, bi } from "../../../lib/story-helpers.js";
import { ScenarioReportsView } from "./index.jsx";

const bundle = INTERPRETER.scenarioReports;

export default {
  title: "Features/Interpreter/Scenario reports view",
  component: ScenarioReportsView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          bi("Scenario Reporting knowledge type (scenario-reports.js `#scenarioReportOverview`): unified toolbar with Status and Process filters, the gold search pill, the result count and the right-aligned create link, a three-column card grid carrying the Enabled/Disabled pill, both workflow axes and the governed icon actions, and the shared `#knowledgeDetail` slide-in drawer with the availability/workflow title pills and the icon-action footer. The seeded records are all owned by other users, so the action buttons are blocked but remain operable for the permission explanation; with an owned record the disable-first/delete/disable confirm flows become reachable. Driven by `useScenarioDemo` so canvas interactions are live.", "Scenario Reporting 知识类型（scenario-reports.js 的 `#scenarioReportOverview`）：统一工具栏含 Status 与 Process 筛选、金色搜索胶囊、结果数量和右对齐的创建链接；三列卡片网格，带 Enabled/Disabled 胶囊、两条工作流轴和受治理的图标操作；以及共用的 `#knowledgeDetail` 滑入抽屉，含可用性/工作流标题胶囊和图标操作页脚。预置记录都归属其他用户，所以操作按钮被阻止但仍可点击以查看权限说明；对自己名下的记录，则可触达先停用/删除/停用的确认流程。由 `useScenarioDemo` 驱动，因此画布交互是实时的。"),
      },
    },
  },
  args: {
    ...bundle,
    query: "",
    filterValues: {},
    page: 1,
    pageSize: 10,
    detail: null,
    dialog: null,
  },
  argTypes: {
    records: prop("Array<ScenarioRecord>", {
      description: bi("Seeded scenarios — normalized by the container (`normalizeScenarioRecord`).", "预置场景：由容器规范化（`normalizeScenarioRecord`）。"),
      control: false,
    }),
    currentUser: prop("string", { defaultValue: "Current User", description: bi("Identity constant — only own scenarios can be managed.", "身份常量：只能管理自己的场景。") }),
    strings: prop("object", { description: bi("All copy: filters, sections, dialog text, tooltips.", "全部文案：筛选、区块、对话框文字、提示。"), control: false }),
    createHref: prop("string", { description: bi("\"Add Scenario reporting\" link target (knowledge-create.html, M5 — not built).", "\"Add Scenario reporting\" 的链接目标（knowledge-create.html，M5，尚未构建）。") }),
    query: prop("string", { defaultValue: "", description: bi("Initial search text.", "初始搜索文字。") }),
    filterValues: prop("{ status?: string, process?: string }", { description: bi("Initial select values — single option per filter, like the original `<select>`.", "初始选择值：每个筛选只选一项，与原始的 `<select>` 一致。") }),
    page: prop("number", { defaultValue: 1 }),
    pageSize: prop("number", { defaultValue: 10, control: "inline-radio", options: [5, 10, 20] }),
    detail: prop("string | null", { defaultValue: null, description: bi("Record id opened in the drawer (the `?detail=` deep link the RC scenario chips point at).", "在抽屉中打开的记录 id（RC 场景标签所指向的 `?detail=` 深链接）。") }),
    dialog: prop('{ kind: "disable-first" | "delete-confirm" | "disable-confirm", record: { id } } | null', { defaultValue: null, description: bi("Seeds an open confirm dialog (stories only — reachable for owned records).", "预置一个已打开的确认对话框（仅用于故事；对自己名下的记录可触达）。"), control: false }),
    onQueryChange: callbackProp("onQueryChange", "(event: { name, value }) => void", { name: "search", value: "city" }, bi("Search input change; resets to page 1.", "搜索输入变化；重置到第 1 页。")),
    onFilterChange: callbackProp("onFilterChange", "(event: { id, value }) => void", { id: "process", value: "Published" }, bi("Select filter change; resets to page 1.", "下拉筛选变化；重置到第 1 页。")),
    onPage: callbackProp("onPage", "(event: { page }) => void", { page: 2 }, bi("Previous/Next page.", "上一页/下一页。")),
    onPageSize: callbackProp("onPageSize", "(event: { pageSize }) => void", { pageSize: 20 }, bi("Rows-per-page change; resets to page 1.", "每页条数变化；重置到第 1 页。")),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "scenario-channel-performance" }, bi("Card title activation opens the detail drawer.", "点击卡片标题会打开详情抽屉。")),
    onCloseDetail: callbackProp("onCloseDetail", "(event: { reason }) => void", { reason: "button" }, bi("Drawer dismissed (×, scrim, Escape).", "抽屉被关闭（×、遮罩、Escape）。")),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "disable", id: "scenario-channel-performance", blocked: true, reason: "permission" }, bi("Edit/delete/disable action reports its governance result.", "编辑/删除/停用操作会回报其治理结果。")),
    onDialogConfirm: callbackProp("onDialogConfirm", "(event: { confirmed: true }) => void", { confirmed: true }, bi("Confirm dialog's primary action — runs the pending operation.", "确认对话框的主操作：执行待处理的操作。")),
    onDialogCancel: callbackProp("onDialogCancel", "(event: { reason }) => void", { reason: "cancel" }, bi("Confirm dialog dismissed.", "确认对话框被关闭。")),
    onCreate: callbackProp("onCreate", "(event: { href }) => void", { href: "knowledge-create.html?type=Scenario%20Reporting" }, bi("Add Scenario reporting link activated.", "点击 Add Scenario reporting 链接。")),
    onNavigate: callbackProp("onNavigate", "(event: { href, id }) => void", { href: "knowledge-create.html?type=Scenario%20Reporting&mode=edit&id=...", id: "scenario-channel-performance" }, bi("Edit action navigates to the create page in edit mode.", "编辑操作会跳转到处于编辑模式的创建页。")),
  },
  render: function ScenarioReportsStory(args) {
    const viewProps = useScenarioDemo(args);
    return <ScenarioReportsView {...viewProps} />;
  },
};

export const Default = {};

/* Card title activation opens the shared knowledge-detail drawer: SCENARIO REPORTING
   label + title + Enabled/Disabled + workflow pills, Related Report link,
   Description, Structure & Guidance, Supporting Files, the AI-enable note
   (shown only when disabled and not yet Published) and the meta footer. */
export const DetailOpen = {
  args: { detail: "scenario-channel-performance" },
};

/** An owned + enabled scenario exposes Disable while Edit/Delete explain that
    the record must go offline first — the "Confirm Operation" dialog shown here. */
export const OwnRecordDisableConfirm = {
  args: {
    records: [
      {
        id: "scenario-own-baseline",
        title: "Baseline Review Scenario",
        description: "Owned scenario used to demonstrate the enabled action gate.",
        report: "Invest City Strategy Analysis",
        creator: "Current User",
        owner: "Current User",
        workflow_status: "Published",
        ai_interpreter_enabled: true,
      },
    ],
    dialog: { kind: "disable-confirm", record: { id: "scenario-own-baseline" } },
  },
};

/** An owned + disabled scenario exposes Delete and its destructive confirmation. */
export const OwnRecordDeleteConfirm = {
  args: {
    records: [
      {
        id: "scenario-own-disabled",
        title: "Owned Disabled Scenario",
        description: "Owned scenario ready for deletion.",
        report: "Invest City Strategy Analysis",
        creator: "Current User",
        owner: "Current User",
        workflow_status: "Draft",
        ai_interpreter_enabled: false,
      },
    ],
    dialog: { kind: "delete-confirm", record: { id: "scenario-own-disabled" } },
  },
};

export const FilteredEmpty = {
  args: { query: "no such scenario" },
};
