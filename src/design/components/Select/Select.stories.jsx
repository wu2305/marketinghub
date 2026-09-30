import { controlSizes } from "../Button/index.jsx";
import { Select } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Atoms/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Native select. `options` accept `{ id|value, label }` or plain strings.", "原生下拉选择。`options` 可为 `{ id|value, label }` 或纯字符串。"),
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
    label: prop("string", { description: bi("Accessible label (visually hidden).", "无障碍标签（视觉上隐藏）。") }),
    name: prop("string", { description: bi("Field name echoed in the onChange payload.", "字段名，会回传在 onChange 的载荷中。") }),
    value: prop("string", { description: bi("Controlled value — omit for uncontrolled.", "受控值；不传则为非受控。") }),
    defaultValue: prop("string", { defaultValue: "", description: bi("Initial value when uncontrolled.", "非受控时的初始值。") }),
    options: prop('Array<{ id?: string, value?: string, label: string } | string>', {
      defaultValue: [],
      description: bi("Options — objects or plain strings.", "选项：对象或纯字符串。"),
    }),
    placeholder: prop("string", {
      description: bi("Renders a leading placeholder option (implicit value = its text, matching the demo markup).", "渲染一个前置的占位选项（隐含值为其文字，与 Demo 标记一致）。"),
    }),
    autoComplete: prop("string", { description: bi("Native autocomplete attribute.", "原生 autocomplete 属性。") }),
    disabled: prop("boolean", { defaultValue: false, description: bi("Disables the field.", "禁用该字段。") }),
    invalid: prop("boolean", { defaultValue: false, description: bi("Adds aria-invalid and error styling.", "添加 aria-invalid 与错误样式。") }),
    size: enumProp(controlSizes, "md", bi("Control height.", "控件高度。"), "inline-radio"),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "kind", value: "Global Synonym" },
      bi("Fired when the selection changes.", "选择变化时触发。"),
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
