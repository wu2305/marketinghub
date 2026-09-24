import { CheckboxFilter } from "../../molecules.jsx";
import { callbackProp, prop, useSynced } from "../story-helpers.js";

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
          "Multi-select dropdown filter — a field label plus a `<details>`/`<summary>` disclosure holding checkbox options. Mirrors the shared `.business-filter-field` / `.fm-options` control used for status, data-model and category filters in the original knowledge libraries.",
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
    label: prop("string", { description: 'Field label, e.g. "Category".' }),
    allLabel: prop("string", { defaultValue: "All", description: "Summary text when nothing is selected." }),
    selectedLabel: prop("string", { defaultValue: "{count} selected", description: "Summary template once options are checked — `{count}` is replaced." }),
    options: prop("Array<{ id: string, label: string }>", { defaultValue: [], description: "Checkbox options." }),
    selected: prop("Array<string>", {
      defaultValue: [],
      description: "Checked option ids.",
      control: "check",
      options: OPTIONS.map((option) => option.id),
    }),
    onToggle: callbackProp(
      "onToggle",
      "(event: { id: string, checked: boolean }) => void",
      { id: "Role", checked: true },
      "Fired when an option is checked or unchecked.",
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
