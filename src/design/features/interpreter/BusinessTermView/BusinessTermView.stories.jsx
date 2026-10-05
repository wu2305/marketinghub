import { INTERPRETER } from "../../../content.js";
import { BusinessTermView } from "./index.jsx";
import { useBusinessTermDemo } from "../../../demo/business-term-demo.js";
import { callbackProp, prop, bi } from "../../../lib/story-helpers.js";

const bundle = INTERPRETER.businessTermLibrary;

export default {
  title: "Features/Interpreter/Business term view",
  component: BusinessTermView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          bi("This component is the Business Term library on AI Interpreter. Open it with `?type=Business Term`. It has search, Status and Creator filters, a count, and Add Business Term. Cards show three synonym chips. Other synonyms are counted in a \"+N\" chip. Disable knowledge before you edit or delete it. Only knowledge created by you can be managed. Disabled knowledge is unavailable for AI use and can be enabled again. Deletion is permanent and cannot be undone. This library is not Skill Library and not Scenario Reports.", "这是 AI Interpreter 上的 Business Term 库。用 `?type=Business Term` 打开。它有搜索、Status 和 Creator 筛选、数量，以及 Add Business Term。卡片显示三个同义词标签。其余同义词记在 \"+N\" 标签里。编辑或删除前要先 Disable。只有你自己创建的知识才能管理。Disable 后的知识不能给 AI 用，也可以再启用。删除后不能恢复。这个库不是 Skill Library，也不是 Scenario Reports。"),
      },
    },
  },
  args: {
    ...bundle,
    drafts: [],
    query: "",
    selected: { status: [], creator: [] },
    page: 1,
    pageSize: 10,
    detail: null,
  },
  argTypes: {
    records: prop("Array<BusinessTermRecord>", {
      description: bi("Seed records (id, title, description, synonyms, scope, kind, creator, status, stage).", "种子记录（id、title、description、synonyms、scope、kind、creator、status、stage）。"),
      detail: "status: \"Enable\" | \"Disable\"; stage: \"Draft\" adds the superscript Draft badge.",
    }),
    drafts: prop("Array<object>", {
      defaultValue: [],
      description: bi("localStorage-style drafts — unshifted ahead of records when `stage !== \"Draft\" || creator === currentUser` (the M5 create page writes these).", "localStorage 风格的草稿：当 `stage !== \"Draft\" || creator === currentUser` 时排在记录之前（M5 创建页会写入这些草稿）。"),
    }),
    currentUser: prop("string", { defaultValue: "Current User", description: bi("Identity constant — only own records can be managed.", "身份常量：只能管理自己的记录。") }),
    strings: prop("object", { description: bi("All copy: labels, tooltips, dialog text, detail section headings.", "全部文案：标签、提示、对话框文字、详情区块标题。"), control: false }),
    createHref: prop("string", { description: bi("Add Business Term link target. The link opens Knowledge create.", "Add Business Term 的链接目标。链接会打开 Knowledge create。") }),
    editHref: prop("(id: string) => string", { description: bi("Edit target for a disabled record. The click runs `onNavigate`.", "被停用记录的编辑目标。点击会调用 `onNavigate`。"), control: false }),
    query: prop("string", { defaultValue: "", description: bi("Initial search text (trimmed lowercase substring over title/description/synonyms/scope/creator).", "初始搜索文字（对 title/description/synonyms/scope/creator 做去空白、小写的子串匹配）。") }),
    selected: prop("{ status: string[], creator: string[] }", { description: bi("Initial filter selections — OR within a filter, AND across.", "初始筛选选择：同一筛选内为 OR，不同筛选之间为 AND。"), control: false }),
    page: prop("number", { defaultValue: 1, description: bi("Initial page (clamped after deletes).", "初始页码（删除后会被限制在有效范围内）。") }),
    pageSize: prop("number", { defaultValue: 10, description: bi("Initial rows per page.", "初始每页条数。"), control: "inline-radio", options: [5, 10, 20] }),
    pageSizes: prop("Array<number>", { defaultValue: [5, 10, 20], description: bi("Rows-per-page options.", "每页条数选项。") }),
    detail: prop("string | null", { defaultValue: null, description: bi("Record id to open in the detail drawer.", "要在详情抽屉中打开的记录 id。"), control: false }),
    totals: prop("{ shown: number, total: number }", { description: bi("Result count shown in the toolbar.", "工具栏中显示的结果数量。"), control: false }),
    toast: prop("string", { description: bi("Success message after disable/delete; empty = hidden.", "停用/删除后的成功消息；为空则隐藏。"), control: false }),
    filters: prop("Array<FilterDef>", { description: bi("Checkbox disclosure filters computed by the container (Status, Creator).", "由容器计算出的复选框展开式筛选（Status、Creator）。"), control: false }),
    searchRef: prop("React.Ref", { description: bi("Forwarded to the search input so page-level '/' and Cmd/Ctrl+K shortcuts focus it.", "转发给搜索输入框，使页面级的 '/' 与 Cmd/Ctrl+K 快捷键可以聚焦它。"), control: false }),
    dialog: prop("object | null", { description: bi("ConfirmDialog content ({ purpose, title, message, labels }) driven by the container; null = closed.", "由容器驱动的 ConfirmDialog 内容（{ purpose, title, message, labels }）；null 表示关闭。"), control: false }),
    onQueryChange: callbackProp("onQueryChange", "(event: { name, value }) => void", { name: "search", value: "gmv" }, bi("Search input change; also resets to page 1.", "搜索输入变化；同时重置到第 1 页。")),
    onFilterToggle: callbackProp("onFilterToggle", "(event: { id, value, checked }) => void", { id: "status", value: "Disable", checked: true }, bi("Checkbox toggle inside a filter disclosure (stays open); resets to page 1.", "筛选展开区内的复选框切换（保持展开）；重置到第 1 页。")),
    onPage: callbackProp("onPage", "(event: { page: number }) => void", { page: 2 }, bi("Previous/Next page.", "上一页/下一页。")),
    onPageSize: callbackProp("onPageSize", "(event: { pageSize: number }) => void", { pageSize: 20 }, bi("Rows-per-page change; resets to page 1.", "每页条数变化；重置到第 1 页。")),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "business-term-gmv" }, bi("Title button or card click opens the detail drawer.", "点击标题按钮或卡片会打开详情抽屉。")),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "edit", id: "business-term-gmv", blocked: true, reason: "disable-first" }, bi("The function runs on every action click. A blocked click still runs. The result has `reason`.", "每次操作点击都会调用这个函数。被阻止的点击也会调用。结果里有 `reason`。")),
    onClearFilters: callbackProp("onClearFilters", "(event: { reason }) => void", { reason: "empty-state" }, bi("Clear filters from the no-results state.", "在无结果状态下清除筛选。")),
    onCloseDetail: callbackProp("onCloseDetail", "(event: { reason }) => void", { reason: "button" }, bi("Detail drawer dismissed (×, scrim, Escape).", "详情抽屉被关闭（×、遮罩、Escape）。")),
    onDialogConfirm: callbackProp("onDialogConfirm", "(event: { confirmed: true }) => void", { confirmed: true }, bi("Confirm dialog's primary action — runs the pending operation.", "确认对话框的主操作：执行待处理的操作。")),
    onDialogCancel: callbackProp("onDialogCancel", "(event: { reason }) => void", { reason: "cancel" }, bi("Confirm/info dialog dismissed.", "确认/通知对话框被关闭。")),
    onCreate: callbackProp("onCreate", "(event: { href }) => void", { href: "knowledge-create.html?type=Business%20Term" }, bi("Add Business Term link activated.", "点击 Add Business Term 链接。")),
  },
  render: function BusinessTermStory(args) {
    const viewProps = useBusinessTermDemo(args);
    return <BusinessTermView {...viewProps} />;
  },
};

export const Default = {};

export const WithDraft = {
  args: {
    drafts: [
      {
        id: "story-draft",
        title: "Draft Term Example",
        description: "A staged business term drafted in the create page.",
        synonyms: ["Staged Term"],
        status: "Disable",
        stage: "Draft",
        creator: "Current User",
      },
    ],
  },
};

export const FilteredEmpty = {
  args: { query: "zzzzz" },
};

export const DetailOpen = {
  args: { detail: "business-term-gmv" },
};

const openAction = (selector, expectedText) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  const button = doc.querySelector(selector);
  if (!button) throw new Error(`Business Term action missing: ${selector}`);
  button.click();
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (doc.querySelector(".mh-confirm")?.textContent.includes(expectedText)) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`Business Term dialog missing: ${expectedText}`);
};

export const DisableConfirmation = {
  name: "Confirm disabling own term",
  play: openAction(".mh-btview [aria-label='Disable GMV (Gross Merchandise Value)']", "Confirm Offline"),
};

export const PermissionDenied = {
  name: "Cannot edit another creator's term",
  play: openAction(".mh-btview [aria-label='Edit Paid Customer']", "Permission denied"),
};

export const OfflineFirst = {
  name: "Edit an enabled term: take it offline first",
  play: openAction(".mh-btview [aria-label='Edit GMV (Gross Merchandise Value)']", "Go Offline"),
};
