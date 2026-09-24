import { FormField, formFieldControls } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Form field",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Labelled form control wrapping TextInput / TextArea / Select.",
      },
    },
  },
  args: {
    label: "Title",
    name: "title",
    value: "",
    placeholder: "Enter the business term title.",
    required: true,
    invalid: false,
    control: "text",
    hint: "",
    options: ["Business Term", "Global Synonym"],
  },
  argTypes: {
    label: prop("string", { description: "Field label." }),
    name: prop("string", { description: "Field name echoed in the onChange payload." }),
    control: enumProp(formFieldControls, "text", "Which control renders.", "inline-radio"),
    required: prop("boolean", { defaultValue: false, description: "Renders the required marker." }),
    invalid: prop("boolean", { defaultValue: false, description: "Error styling on the wrapper and control." }),
    hint: prop("string", { description: "Hint line under the control." }),
    value: prop("string", { description: "Controlled value — omit for uncontrolled." }),
    defaultValue: prop("string", { description: "Initial value when uncontrolled." }),
    placeholder: prop("string", { description: "Placeholder text (leading option for select)." }),
    autoComplete: prop("string", { description: "Native autocomplete attribute." }),
    options: prop('Array<{ id?: string, value?: string, label: string } | string>', {
      description: "Select only — the option list.",
    }),
    rows: prop("number", { description: "Textarea only — visible row count." }),
    className: prop("string", { description: "Extra class on the field wrapper." }),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "title", value: "Share of search" },
      "Fired on every edit, whichever control is active.",
    ),
  },
  render: function FormFieldStory(args) {
    const [value, setValue] = useSynced(args.value);
    return (
      <div style={{ width: 420 }}>
        <FormField
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
