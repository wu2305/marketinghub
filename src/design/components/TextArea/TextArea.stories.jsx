import { TextArea } from "./index.jsx";
import { callbackProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Atoms/Text area",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component shows more than one line of text. Set `value` if the page controls the text. If you do not set `value`, the field holds the text.", "这个组件显示多行文字。如果页面要控制文字，就设置 `value`。如果不设置 `value`，输入框自己保存文字。"),
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
    label: prop("string", { description: bi("Accessible label (visually hidden).", "无障碍标签（视觉上隐藏）。") }),
    name: prop("string", { description: bi("Field name echoed in the onChange payload.", "字段名，会回传在 onChange 的载荷中。") }),
    value: prop("string", { description: bi("Controlled value — omit for uncontrolled.", "受控值；不传则为非受控。") }),
    defaultValue: prop("string", { defaultValue: "", description: bi("Initial value when uncontrolled.", "非受控时的初始值。") }),
    placeholder: prop("string", { description: bi("Placeholder text.", "占位文字。") }),
    autoComplete: prop("string", { description: bi("Native autocomplete attribute.", "原生 autocomplete 属性。") }),
    rows: prop("number", { defaultValue: 4, description: bi("Visible row count.", "可见行数。") }),
    disabled: prop("boolean", { defaultValue: false, description: bi("Disables the field.", "禁用该字段。") }),
    invalid: prop("boolean", { defaultValue: false, description: bi("Adds aria-invalid and error styling.", "添加 aria-invalid 与错误样式。") }),
    required: prop("boolean", { defaultValue: false, description: bi("Native required attribute.", "原生 required 属性。") }),
    ref: prop("React.Ref<HTMLTextAreaElement>", { description: bi("Forwarded to the textarea element.", "转发给 textarea 元素。"), control: false }),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "description", value: "Share of search" },
      bi("The function runs at each change. If you do not set `name`, `name` in the result is empty.", "每次变化都会调用这个函数。如果没有设置 `name`，结果里的 `name` 是空的。"),
    ),
    onKeyDown: prop("React.KeyboardEventHandler<HTMLTextAreaElement>", {
      description: bi("Native keydown handler — receives the React keyboard event, not a named payload (used by the assistant composer for Enter-to-submit).", "原生 keydown 处理函数：接收 React 键盘事件，而不是具名载荷（助手输入框用它实现 Enter 提交）。"),
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
