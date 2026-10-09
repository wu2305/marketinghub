import { Tabs, tabsVariants } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

const ITEMS = [
  { id: "analysis", label: "Self-Service Analysis" },
  { id: "upload", label: "Data Upload" },
];

export default {
  title: "Molecules/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is a tab strip. The element has role `tablist`. A tab can be disabled. The selected tab is the only Tab stop; the arrow keys, Home and End move between tabs and select them.\n\n**When to use.** Use this component to switch between sibling views on the same page. Exactly one view is visible at a time. To filter a list by one choice, use FilterPills. **Used in:** Media Tracking Detail, Campaign, and Self-Service Center. **Retired pages (source kept, not in Storybook):** Review Center and Feedback & Quality.", "这个组件是标签页条。元素的 role 是 `tablist`。标签页可以禁用。已选中的标签页是唯一的 Tab 停靠点；方向键、Home 和 End 在标签页之间移动并选中它们。\n\n**何时使用。** 在同一页面的并列视图之间切换，同一时间只显示一个视图。若只是按单一选项筛选列表，请用 FilterPills。**使用位置：** Media Tracking Detail、Campaign 与 Self-Service Center。**已撤下的页面（源码保留，不在 Storybook 中）：**Review Center 与 Feedback & Quality。"),
      },
    },
  },
  args: { label: "Data view mode", items: ITEMS, value: "analysis", variant: "underline" },
  argTypes: {
    label: prop("string", { description: bi("Accessible name of the tab list.", "标签页列表的无障碍名称。") }),
    items: prop("Array<{ id: string, label: string, disabled?: boolean, title?: string }>", {
      defaultValue: [],
      description: bi("Tabs to show. Each tab has `id` and `label`. A tab can be `disabled`.", "要显示的标签页。每个标签页有 `id` 和 `label`。标签页可以 `disabled`。"),
    }),
    value: prop("string", { description: bi("`id` of the selected tab.", "当前选中标签页的 `id`。"), control: "select", options: ITEMS.map((item) => item.id) }),
    variant: enumProp(tabsVariants, "underline", bi("Appearance: `underline` or `segmented`.", "外观：`underline` 或 `segmented`。"), "inline-radio"),
    onChange: callbackProp(
      "onChange",
      "(event: { id: string, label: string }) => void",
      { id: "upload", label: "Data Upload" },
      bi("The function runs when a tab becomes selected: a click (or Enter or Space on the focused tab), or a keyboard move: the arrow keys, Home and End select the tab they land on and skip disabled tabs. The result has `id` and `label`.", "标签页被选中时会调用这个函数：点击（或在获得焦点的标签页上按 Enter 或空格），或键盘移动：方向键、Home 和 End 会选中落到的标签页，并跳过禁用的标签页。结果里带有 `id` 和 `label`。"),
    ),
  },
  render: function TabsStory(args) {
    const [value, setValue] = useSynced(args.value);
    return (
      <Tabs
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
