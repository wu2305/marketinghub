import { Select, controlSizes } from "../../atoms.jsx";
import { callbackProp, enumProp, prop, useSynced } from "../story-helpers.js";

export default {
  title: "Atoms/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Native select. `options` accept `{ id|value, label }` or plain strings.",
      },
    },
  },
  args: {
    label: "Term type",
    value: "Business Term",
    placeholder: "Select a type",
    options: ["Business Term", "Global Synonym"],
    disabled: false,
    invalid: false,
  },
  argTypes: {
    label: prop("string", { description: "Accessible label (visually hidden)." }),
    name: prop("string", { description: "Field name echoed in the onChange payload." }),
    value: prop("string", { description: "Controlled value — omit for uncontrolled." }),
    defaultValue: prop("string", { defaultValue: "", description: "Initial value when uncontrolled." }),
    options: prop('Array<{ id?: string, value?: string, label: string } | string>', {
      defaultValue: [],
      description: "Options — objects or plain strings.",
    }),
    placeholder: prop("string", {
      description: "Renders a leading placeholder option (implicit value = its text, matching the demo markup).",
    }),
    autoComplete: prop("string", { description: "Native autocomplete attribute." }),
    disabled: prop("boolean", { defaultValue: false, description: "Disables the field." }),
    invalid: prop("boolean", { defaultValue: false, description: "Adds aria-invalid and error styling." }),
    size: enumProp(controlSizes, "md", "Control height.", "inline-radio"),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "kind", value: "Global Synonym" },
      "Fired when the selection changes.",
    ),
  },
  render: function SelectStory(args) {
    const [value, setValue] = useSynced(args.value);
    return (
      <div style={{ width: 280 }}>
        <Select
          {...args}
          value={value}
          onChange={(event) => {
            setValue(event.value);
            args.onChange?.(event);
          }}
        />
      </div>
    );
  },
};

export const Default = {};
