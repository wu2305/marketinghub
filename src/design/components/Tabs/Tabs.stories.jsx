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
        component: bi("Tab strip (role=tablist). Items may be disabled.", "标签页条（role=tablist）。条目可以禁用。"),
      },
    },
  },
  args: { label: "Data view mode", items: ITEMS, value: "analysis", variant: "underline" },
  argTypes: {
    label: prop("string", { description: bi("tablist aria-label.", "tablist 的 aria-label。") }),
    items: prop("Array<{ id: string, label: string, disabled?: boolean, title?: string }>", {
      defaultValue: [],
      description: bi("Tab entries.", "标签页条目。"),
    }),
    value: prop("string", { description: bi("id of the selected tab.", "当前选中标签页的 id。"), control: "select", options: ITEMS.map((item) => item.id) }),
    variant: enumProp(tabsVariants, "underline", bi("Visual variant.", "视觉变体。"), "inline-radio"),
    onChange: callbackProp(
      "onChange",
      "(event: { id: string, label: string }) => void",
      { id: "upload", label: "Data Upload" },
      bi("Fired when a tab is clicked.", "点击标签页时触发。"),
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
