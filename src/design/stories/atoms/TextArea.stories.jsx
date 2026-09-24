import { TextArea } from "../../atoms.jsx";
import { callbackProp, prop, useSynced } from "../story-helpers.js";

export default {
  title: "Atoms/Text area",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Multi-line input. Controlled when `value` is passed, uncontrolled otherwise.",
      },
    },
  },
  args: {
    label: "Description",
    placeholder: "Explain the meaning, usage, and boundary of this term.",
    value: "",
    rows: 4,
    invalid: false,
    disabled: false,
  },
  argTypes: {
    label: prop("string", { description: "Accessible label (visually hidden)." }),
    name: prop("string", { description: "Field name echoed in the onChange payload." }),
    value: prop("string", { description: "Controlled value — omit for uncontrolled." }),
    defaultValue: prop("string", { defaultValue: "", description: "Initial value when uncontrolled." }),
    placeholder: prop("string", { description: "Placeholder text." }),
    autoComplete: prop("string", { description: "Native autocomplete attribute." }),
    rows: prop("number", { defaultValue: 4, description: "Visible row count." }),
    disabled: prop("boolean", { defaultValue: false, description: "Disables the field." }),
    invalid: prop("boolean", { defaultValue: false, description: "Adds aria-invalid and error styling." }),
    required: prop("boolean", { defaultValue: false, description: "Native required attribute." }),
    ref: prop("React.Ref<HTMLTextAreaElement>", { description: "Forwarded to the textarea element.", control: false }),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "description", value: "Share of search" },
      "Fired on every edit.",
    ),
    onKeyDown: prop("React.KeyboardEventHandler<HTMLTextAreaElement>", {
      description: "Native keydown handler — receives the React keyboard event, not a named payload (used by the assistant composer for Enter-to-submit).",
      detail: "Payload: the native React KeyboardEvent for the textarea.",
      action: "onKeyDown",
      control: false,
    }),
  },
  render: function TextAreaStory(args) {
    const [value, setValue] = useSynced(args.value);
    return (
      <div style={{ width: 480 }}>
        <TextArea
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
