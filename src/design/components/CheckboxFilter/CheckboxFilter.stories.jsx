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
          bi("Multi-select dropdown filter — a field label plus a `<details>`/`<summary>` disclosure holding checkbox options. Mirrors the shared `.business-filter-field` / `.fm-options` control used for status, data-model and category filters in the original knowledge libraries.\n\n**When to use.** A filter with several options where more than one can be checked (status, creator, category). For one-of choices use Select or FilterPills. **Used in:** LibraryToolbar (so every governed library) and the field-mapping libraries.", "多选下拉筛选：字段标签加一个 `<details>`/`<summary>` 展开区，内含复选框选项。对应原始知识库中用于状态、数据模型和分类筛选的共享 `.business-filter-field` / `.fm-options` 控件。\n\n**何时使用。** 有多个选项且可同时勾选多项的筛选（状态、创建人、分类）。只能单选时请用 Select 或 FilterPills。**使用位置：** LibraryToolbar（即所有受治理库）与字段映射类库。"),
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
    label: prop("string", { description: bi("Field label, e.g. \"Category\".", "字段标签，例如 \"Category\"。") }),
    allLabel: prop("string", { defaultValue: "All", description: bi("Summary text when nothing is selected.", "未选择任何项时的摘要文字。") }),
    selectedLabel: prop("string", { defaultValue: "{count} selected", description: bi("Summary template once options are checked — `{count}` is replaced.", "勾选选项后的摘要模板，其中的 `{count}` 会被替换为数量。") }),
    options: prop("Array<{ id: string, label: string }>", { defaultValue: [], description: bi("Checkbox options.", "复选框选项。") }),
    selected: prop("Array<string>", {
      defaultValue: [],
      description: bi("Checked option ids.", "已勾选选项的 id。"),
      control: "check",
      options: OPTIONS.map((option) => option.id),
    }),
    onToggle: callbackProp(
      "onToggle",
      "(event: { id: string, checked: boolean }) => void",
      { id: "Role", checked: true },
      bi("Fired when an option is checked or unchecked.", "勾选或取消勾选某个选项时触发。"),
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
