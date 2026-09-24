import { FilterPills } from "../../molecules.jsx";
import { callbackProp, prop, useSynced } from "../story-helpers.js";

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
        component: "Single-select pill filter group.",
      },
    },
  },
  args: { label: "Filter reports", items: ITEMS, value: "all" },
  argTypes: {
    label: prop("string", { defaultValue: "Filters", description: "Group aria-label." }),
    items: prop("Array<{ id: string, label: string }>", { defaultValue: [], description: "Pill entries." }),
    value: prop("string", { description: "id of the active pill.", control: "inline-radio", options: ITEMS.map((item) => item.id) }),
    onChange: callbackProp(
      "onChange",
      "(event: { id: string, label: string }) => void",
      { id: "dg", label: "DG" },
      "Fired when a pill is clicked.",
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
