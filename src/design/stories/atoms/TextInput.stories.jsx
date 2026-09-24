import { TextInput, controlSizes } from "../../atoms.jsx";
import { callbackProp, enumProp, prop, useSynced } from "../story-helpers.js";

export default {
  title: "Atoms/Text input",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Single-line input. Controlled when `value` is passed, uncontrolled otherwise.",
      },
    },
  },
  args: {
    label: "Search dashboards",
    placeholder: "Search dashboards",
    value: "",
    size: "lg",
    disabled: false,
    invalid: false,
  },
  argTypes: {
    label: prop("string", { description: "Accessible label (visually hidden)." }),
    name: prop("string", { description: "Field name echoed in the onChange payload." }),
    type: prop("string", { defaultValue: "text", description: "Native input type (text, search, …)." }),
    value: prop("string", { description: "Controlled value — omit for uncontrolled." }),
    defaultValue: prop("string", { defaultValue: "", description: "Initial value when uncontrolled." }),
    placeholder: prop("string", { description: "Placeholder text." }),
    autoComplete: prop("string", { description: "Native autocomplete attribute." }),
    disabled: prop("boolean", { defaultValue: false, description: "Disables the field." }),
    invalid: prop("boolean", { defaultValue: false, description: "Adds aria-invalid and error styling." }),
    size: enumProp(controlSizes, "md", "Control height.", "inline-radio"),
    inputRef: prop("React.Ref<HTMLInputElement>", { description: "Forwarded to the input element.", control: false }),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "title", value: "AUDIT" },
      "Fired on every edit; `name` is empty when the prop is unset.",
    ),
  },
  render: function TextInputStory(args) {
    const [value, setValue] = useSynced(args.value);
    return (
      <div style={{ width: 360 }}>
        <TextInput
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
