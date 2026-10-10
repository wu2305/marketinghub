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
          bi("This component is the Scenario Reports library on AI Interpreter. It is a knowledge type. It is not Skill Library, Scenario Detail, or Skill Edit. It has Status and Process filters, search, a count, and Add. Cards show Enabled or Disabled. Disable knowledge before you edit or delete it. Only knowledge created by you can be managed. Seeded records in this story belong to other users. Their actions stay clickable. The click explains the permission.", "这是 AI Interpreter 上的 Scenario Reports 库。它是一种知识类型。它不是 Skill Library、Scenario Detail 或 Skill Edit。它有 Status 和 Process 筛选、搜索、数量和 Add。卡片显示 Enabled 或 Disabled。编辑或删除前要先 Disable。只有你自己创建的知识才能管理。本故事里的预置记录属于其他用户。操作仍可点击。点击后会说明权限原因。"),
      },
    },
  },
  args: {
    ...bundle,
    query: "",
    filterValues: {},
    page: 1,
    pageSize: 6,
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
    createHref: prop("string", { description: bi("Add Scenario reporting link target. The link opens Knowledge create.", "Add Scenario reporting 的链接目标。链接会打开 Knowledge create。") }),
    query: prop("string", { defaultValue: "", description: bi("Initial search text.", "初始搜索文字。") }),
    filterValues: prop("{ status?: string, process?: string }", { description: bi("Initial select values — single option per filter, like the original `<select>`.", "初始选择值：每个筛选只选一项，与原始的 `<select>` 一致。") }),
    page: prop("number", { defaultValue: 1 }),
    pageSize: prop("number", { defaultValue: 6, control: "inline-radio", options: [6, 12, 24] }),
    detail: prop("string | null", { defaultValue: null, description: bi("Record id opened in the drawer (the `?detail=` deep link the RC scenario chips point at).", "在抽屉中打开的记录 id（RC 场景标签所指向的 `?detail=` 深链接）。") }),
    dialog: prop('{ kind: "disable-first" | "delete-confirm" | "disable-confirm", record: { id } } | null', { defaultValue: null, description: bi("Seeds an open confirm dialog (stories only — reachable for owned records).", "预置一个已打开的确认对话框（仅用于故事；对自己名下的记录可触达）。"), control: false }),
    onQueryChange: callbackProp("onQueryChange", "(event: { name, value }) => void", { name: "search", value: "city" }, bi("Search input change; resets to page 1.", "搜索输入变化；重置到第 1 页。")),
    onFilterChange: callbackProp("onFilterChange", "(event: { id, value }) => void", { id: "process", value: "Published" }, bi("Select filter change; resets to page 1.", "下拉筛选变化；重置到第 1 页。")),
    onPage: callbackProp("onPage", "(event: { page }) => void", { page: 2 }, bi("Previous/Next page.", "上一页/下一页。")),
    onPageSize: callbackProp("onPageSize", "(event: { pageSize }) => void", { pageSize: 20 }, bi("Rows-per-page change; resets to page 1.", "每页条数变化；重置到第 1 页。")),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "scenario-channel-performance" }, bi("Card title activation opens the detail drawer.", "点击卡片标题会打开详情抽屉。")),
    onCloseDetail: callbackProp("onCloseDetail", "(event: { reason }) => void", { reason: "button" }, bi("Drawer dismissed (×, scrim, Escape).", "抽屉被关闭（×、遮罩、Escape）。")),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "disable", id: "scenario-channel-performance", blocked: true, reason: "permission" }, bi("The function runs on Edit, Delete, or Disable. A blocked click still runs. The result has `reason`.", "Edit、Delete 或 Disable 时会调用这个函数。被阻止的点击也会调用。结果里有 `reason`。")),
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
