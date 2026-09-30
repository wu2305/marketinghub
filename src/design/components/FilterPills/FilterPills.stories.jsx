import { FilterPills } from "./index.jsx";
import { callbackProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

const ITEMS = [
  { id: "all", label: "All" },
  { id: "dg", label: "DG" },
  { id: "dc", label: "DC" },
];

export default {
  title: "Molecules/Filter pills",
  component: FilterPills,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Single-select pill filter group.\n\n**When to use.** A short, always-visible choice that filters what is shown (one pill active at a time). For longer option lists or multi-select use CheckboxFilter. **Used in:** Self-Service (analysis and upload filters).", "单选胶囊筛选组。\n\n**何时使用。** 用于筛选当前显示内容的、简短且始终可见的单选项（同一时间只有一个胶囊处于激活）。选项较多或需要多选时请用 CheckboxFilter。**使用位置：** Self-Service（分析与上传筛选）。"),
      },
    },
  },
  args: { label: "Filter reports", items: ITEMS, value: "all" },
  argTypes: {
    label: prop("string", { defaultValue: "Filters", description: bi("Group aria-label.", "分组的 aria-label。") }),
    items: prop("Array<{ id: string, label: string }>", { defaultValue: [], description: bi("Pill entries.", "胶囊条目。") }),
    value: prop("string", { description: bi("id of the active pill.", "当前选中胶囊的 id。"), control: "inline-radio", options: ITEMS.map((item) => item.id) }),
    onChange: callbackProp(
      "onChange",
      "(event: { id: string, label: string }) => void",
      { id: "dg", label: "DG" },
      bi("Fired when a pill is clicked.", "点击胶囊时触发。"),
    ),
  },
  render: function FilterPillsStory(args) {
    const [value, setValue] = useSynced(args.value);
    return (
      <FilterPills
        {...args}
        value={value}
        onChange={(event) => {
          setValue(event.id);
          args.onChange?.(event);
        }}
      />
    );
  },
};

export const Default = {};
