import { controlSizes } from "../Button/index.jsx";
import { TextInput } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Atoms/Text input",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Single-line input. Controlled when `value` is passed, uncontrolled otherwise.", "单行输入。传入 `value` 时为受控，否则为非受控。"),
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
    label: prop("string", { description: bi("Accessible label (visually hidden).", "无障碍标签（视觉上隐藏）。") }),
    name: prop("string", { description: bi("Field name echoed in the onChange payload.", "字段名，会回传在 onChange 的载荷中。") }),
    type: prop("string", { defaultValue: "text", description: bi("Native input type (text, search, …).", "原生 input type（text、search 等）。") }),
    value: prop("string", { description: bi("Controlled value — omit for uncontrolled.", "受控值；不传则为非受控。") }),
    defaultValue: prop("string", { defaultValue: "", description: bi("Initial value when uncontrolled.", "非受控时的初始值。") }),
    placeholder: prop("string", { description: bi("Placeholder text.", "占位文字。") }),
    autoComplete: prop("string", { description: bi("Native autocomplete attribute.", "原生 autocomplete 属性。") }),
    disabled: prop("boolean", { defaultValue: false, description: bi("Disables the field.", "禁用该字段。") }),
    invalid: prop("boolean", { defaultValue: false, description: bi("Adds aria-invalid and error styling.", "添加 aria-invalid 与错误样式。") }),
    size: enumProp(controlSizes, "md", bi("Control height.", "控件高度。"), "inline-radio"),
    inputRef: prop("React.Ref<HTMLInputElement>", { description: bi("Forwarded to the input element.", "转发给输入元素。"), control: false }),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "title", value: "AUDIT" },
      bi("Fired on every edit; `name` is empty when the prop is unset.", "每次编辑时触发；未设置 `name` 时其值为空。"),
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
