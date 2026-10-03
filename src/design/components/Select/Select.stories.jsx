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
        component: bi("This component is a standard selection list. An option can be a text string. An option can also be an object. The object has `label`, and `id` or `value`.", "这是一个标准下拉列表。选项可以是一段文字，也可以是一个对象。对象里有 `label`，以及 `id` 或 `value`。"),
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
      description: bi("The value of the first option is the option text. This agrees with the Demo.", "第一项的值就是这段文字，和 Demo 里的写法一样。"),
    }),
    autoComplete: prop("string", { description: bi("Native autocomplete attribute.", "原生 autocomplete 属性。") }),
    disabled: prop("boolean", { defaultValue: false, description: bi("Disables the field.", "禁用该字段。") }),
    invalid: prop("boolean", { defaultValue: false, description: bi("Adds aria-invalid and error styling.", "添加 aria-invalid 与错误样式。") }),
    size: enumProp(controlSizes, "md", bi("Control height.", "控件高度。"), "inline-radio"),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "kind", value: "Global Synonym" },
      bi("The function runs at each change. If you do not set `name`, `name` in the result is empty.", "每次变化都会调用这个函数。如果没有设置 `name`，结果里的 `name` 是空的。"),
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
