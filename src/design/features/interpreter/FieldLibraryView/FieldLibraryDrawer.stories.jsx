import { Button } from "../../../components/Button/index.jsx";
import { INTERPRETER } from "../../../content.js";
import { useFieldLibraryDemo } from "../../../demo/field-library-demo.js";
import { callbackProp, prop, useSynced, bi } from "../../../lib/story-helpers.js";
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
          bi("This component is the Report Context drawer. It can open over another knowledge type. It does not switch the type. Data Model related-report links open this drawer. The description editor works the same as in the full Report Context library. In this story the story host owns `peek` (the record id to show). Close, Escape, or the dimmed area clears it, and a Reopen button sets it again.", "这个组件是 Report Context 抽屉。它可以叠在另一种知识类型上面打开。它不会切换类型。Data Model 的关联报表链接会打开这个抽屉。描述编辑器和完整的 Report Context 库里一样。在本故事里，由故事宿主持有 `peek`（要显示的记录 id）。点击关闭、按 Escape 或点击遮罩都会清除它，之后可用 Reopen 按钮重新打开。"),
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
    /* The host owns which record is peeked. Closing the drawer clears it and
       the button below sets it again. */
    const [peekId, setPeekId] = useSynced(args.peek);
    const viewProps = useFieldLibraryDemo({
      ...args,
      peek: peekId,
      onCloseDetail: (event) => {
        setPeekId(null);
        args.onCloseDetail?.(event);
      },
    });
    const peek = viewProps.peek;
    return peek ? <FieldLibraryDrawer {...viewProps} type={peek.type} detail={peek.detail} /> : <Button variant="secondary" onClick={() => setPeekId(args.peek)}>Reopen drawer</Button>;
  },
};

/** The RC drawer peeked from a non-fm page (e.g. the Data Model related-report
    buttons) — same thumbnail/overview/linked-scenario/scope layout. */
export const ReportContextPeek = {};
