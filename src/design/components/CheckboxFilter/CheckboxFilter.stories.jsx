import { CheckboxFilter } from "./index.jsx";
import { callbackProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

const OPTIONS = [
  { id: "Role", label: "Role" },
  { id: "Strict Restrictions", label: "Strict Restrictions" },
  { id: "System", label: "System" },
  { id: "Doing tasks", label: "Doing tasks" },
  { id: "Tone and style", label: "Tone and style" },
];

export default {
  title: "Molecules/Checkbox filter",
  component: CheckboxFilter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("This component is a multi-select filter. It has a field label and a disclosure that holds checkbox options.\n\n**When to use.** Use this component when the user can check more than one option, such as status, creator, or category. For a single choice, use Select or FilterPills. **Used in:** Principles, Business Term library, Report Context, Metric Dictionary, Analytical Model, and Email Reports.", "这个组件是多选筛选。它有字段标签，以及一个装着复选框选项的展开区。\n\n**何时使用。** 用户可以同时勾选多项时使用，例如状态、创建人、分类。只能单选时，请用 Select 或 FilterPills。**使用位置：** Principles、Business Term library、Report Context、Metric Dictionary、Analytical Model 与 Email Reports。"),
      },
    },
  },
  args: {
    label: "Category",
    allLabel: "All categories",
    selectedLabel: "{count} selected",
    options: OPTIONS,
    selected: [],
  },
  argTypes: {
    label: prop("string", { description: bi("Field label, for example Category.", "字段标签，例如 Category。") }),
    allLabel: prop("string", { defaultValue: "All", description: bi("Summary text when nothing is selected.", "未选择任何项时的摘要文字。") }),
    selectedLabel: prop("string", { defaultValue: "{count} selected", description: bi("Summary template after options are checked. `{count}` becomes the number of selected options. `{labels}` becomes the selected labels, joined with a comma.", "勾选选项后的摘要模板。`{count}` 会换成已选项的数量。`{labels}` 会换成已选标签，用逗号连接。") }),
    options: prop("Array<{ id: string, label: string }>", { defaultValue: [], description: bi("Checkbox options. Each option has `id` and `label`.", "复选框选项。每个选项有 `id` 和 `label`。") }),
    selected: prop("Array<string>", {
      defaultValue: [],
      description: bi("`id` values of the checked options.", "已勾选选项的 `id`。"),
      control: "check",
      options: OPTIONS.map((option) => option.id),
    }),
    onToggle: callbackProp(
      "onToggle",
      "(event: { id: string, checked: boolean }) => void",
      { id: "Role", checked: true },
      bi("The function runs when the user checks or unchecks an option. The result has `id` and `checked`.", "用户勾选或取消勾选某个选项时会调用这个函数。结果里带有 `id` 和 `checked`。"),
    ),
  },
  render: function CheckboxFilterStory(args) {
    const [selected, setSelected] = useSynced(args.selected);
    return (
      <div style={{ padding: 24 }}>
        <CheckboxFilter
          {...args}
          selected={selected}
          onToggle={(event) => {
            setSelected(event.checked ? [...selected, event.id] : selected.filter((id) => id !== event.id));
            args.onToggle?.(event);
          }}
        />
      </div>
    );
  },
};

export const Default = {};
