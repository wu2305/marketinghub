import { Tabs, tabsVariants } from "../../molecules.jsx";
import { callbackProp, enumProp, prop, useSynced } from "../story-helpers.js";

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
        component: "Tab strip (role=tablist). Items may be disabled.",
      },
    },
  },
  args: { label: "Data view mode", items: ITEMS, value: "analysis", variant: "underline" },
  argTypes: {
    label: prop("string", { description: "tablist aria-label." }),
    items: prop("Array<{ id: string, label: string, disabled?: boolean, title?: string }>", {
      defaultValue: [],
      description: "Tab entries.",
    }),
    value: prop("string", { description: "id of the selected tab.", control: "select", options: ITEMS.map((item) => item.id) }),
    variant: enumProp(tabsVariants, "underline", "Visual variant.", "inline-radio"),
    onChange: callbackProp(
      "onChange",
      "(event: { id: string, label: string }) => void",
      { id: "upload", label: "Data Upload" },
      "Fired when a tab is clicked.",
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
