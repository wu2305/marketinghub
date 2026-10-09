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
        component: bi("This component is a group of filter pills. The user can select one pill.\n\n**When to use.** Use this component for a short, always-visible choice that filters what is shown. One pill is active at a time. For a longer single-choice list, use Select. When users may select several options, use CheckboxFilter. **Used in:** Self-Service Center.", "这个组件是一组筛选胶囊。用户只能选中其中一个。\n\n**何时使用。** 用于筛选当前显示内容的、简短且始终可见的单选项。同一时间只有一个胶囊处于选中。单选项较多时用 Select；允许同时选择多项时用 CheckboxFilter。**使用位置：** Self-Service Center。"),
      },
    },
  },
  args: { label: "Filter reports", items: ITEMS, value: "all" },
  argTypes: {
    label: prop("string", { defaultValue: "Filters", description: bi("Accessible name of the group.", "分组的无障碍名称。") }),
    items: prop("Array<{ id: string, label: string }>", { defaultValue: [], description: bi("Pills to show. Each pill has `id` and `label`.", "要显示的胶囊。每个胶囊有 `id` 和 `label`。") }),
    value: prop("string", { description: bi("`id` of the selected pill.", "当前选中胶囊的 `id`。"), control: "inline-radio", options: ITEMS.map((item) => item.id) }),
    onChange: callbackProp(
      "onChange",
      "(event: { id: string, label: string }) => void",
      { id: "dg", label: "DG" },
      bi("The function runs when the user clicks a pill. The result has `id` and `label`.", "用户点击胶囊时会调用这个函数。结果里带有 `id` 和 `label`。"),
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
