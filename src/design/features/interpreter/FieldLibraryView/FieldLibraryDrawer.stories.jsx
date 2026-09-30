import { INTERPRETER } from "../../../content.js";
import { useFieldLibraryDemo } from "../../../demo/field-library-demo.js";
import { callbackProp, prop, bi } from "../../../lib/story-helpers.js";
import { FieldLibraryDrawer } from "./index.jsx";

const bundle = INTERPRETER.fieldLibrary;

export default {
  title: "Features/Interpreter/Field library drawer",
  component: FieldLibraryDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          bi("The fm detail drawer + dialogs as a standalone layer: field-library.js listens for the page-level `reportcontext:view` event (fired by the Data Model related-report buttons and the generic asset list) and opens the Report Context drawer over the *current* type page without switching to it. The page composes this component from the `peek` payload `useFieldLibraryDemo` returns; the Record Detail / Description edit dialogs work the same as inside the full view.", "作为独立层的 fm 详情抽屉与对话框：field-library.js 监听页面级的 `reportcontext:view` 事件（由 Data Model 关联报表按钮和通用资产列表触发），在*当前*类型页之上打开 Report Context 抽屉而不切换页面。页面用 `useFieldLibraryDemo` 返回的 `peek` 载荷组合此组件；Record Detail / Description 编辑对话框的行为与完整视图内一致。"),
      },
    },
  },
  args: {
    ...bundle,
    records: INTERPRETER.records,
    peek: "city-report-context",
  },
  argTypes: {
    records: prop("Array<AssetRecord>", {
      description: bi("All page records — the peeked record normalizes via `normalizeFieldRecord` like any fm record.", "全部页面记录：被查看的记录与任何 fm 记录一样通过 `normalizeFieldRecord` 规范化。"),
      control: false,
    }),
    peek: prop("string | null", {
      defaultValue: "city-report-context",
      description: bi("Record id to peek — resolves across all fm types regardless of the active page type.", "要查看的记录 id：无论当前页面类型如何，都会在所有 fm 类型中解析。"),
    }),
    strings: prop("object", { description: bi("Same copy bundle as FieldLibraryView.", "与 FieldLibraryView 相同的文案集合。"), control: false }),
    scenarioHref: prop("(id: string) => string", { description: bi("Linked-scenario chip href builder.", "关联场景标签的 href 生成函数。"), control: false }),
    dashboardHref: prop("string", { description: bi("\"Open Dashboard\" link target.", "\"Open Dashboard\" 的链接目标。") }),
    onAction: callbackProp("onAction", "(event: { action, id }) => void", { action: "edit-description", id: "city-report-context" }, bi("The drawer's edit-description pencil.", "抽屉中的 \"编辑描述\" 铅笔按钮。")),
    onCloseDetail: callbackProp("onCloseDetail", "(event: { reason }) => void", { reason: "scrim" }, bi("Drawer dismissed — the host clears the peek.", "抽屉被关闭：宿主清除当前查看的记录（peek）。")),
    onDescriptionChange: callbackProp("onDescriptionChange", "(event: { value }) => void", { value: "Edited" }),
    onDescriptionConfirm: callbackProp("onDescriptionConfirm", "(event: { id }) => void", { id: "city-report-context" }),
    onDescriptionCancel: callbackProp("onDescriptionCancel", "(event: { reason }) => void", { reason: "escape" }),
  },
  render: function FieldLibraryDrawerStory(args) {
    const viewProps = useFieldLibraryDemo(args);
    const peek = viewProps.peek;
    return peek ? <FieldLibraryDrawer {...viewProps} type={peek.type} detail={peek.detail} /> : null;
  },
};

/** The RC drawer peeked from a non-fm page (e.g. the Data Model related-report
    buttons) — same thumbnail/overview/linked-scenario/scope layout. */
export const ReportContextPeek = {};
