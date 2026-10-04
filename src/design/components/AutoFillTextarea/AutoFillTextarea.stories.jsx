import { AutoFillTextarea } from "./index.jsx";
import { callbackProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/AutoFillTextarea",
  component: AutoFillTextarea,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { description: { component: bi("This component is a text area with an AI Auto-fill pill in the corner. Typing calls `onChange`. Pressing the pill calls `onAutoFill`. The page decides what text to put in the field.\n\n**When to use.** Use this component for a multi-line field where the assistant can propose text. The button only sends the request. The page supplies the text. **Used in:** Personal Memory, Skill Library, and Skill Edit.", "这个组件是文本域，右下角有 AI Auto-fill 按钮。输入时会调用 `onChange`。按下按钮会调用 `onAutoFill`。填入什么文字由页面决定。\n\n**何时使用。** 助手可以建议文字的多行字段用这个组件。按钮只发出请求，文字由页面提供。**使用位置：** Personal Memory、Skill Library 与 Skill Edit。") } } },
};

export const Default = {
  args: { label: "Analysis Logic", value: "", placeholder: "Describe the analysis logic flow...", autoFillLabel: "AI Auto-fill", rows: 2, invalid: false },
  argTypes: {
    value: prop("string", { defaultValue: "", description: bi("Set `value` if the page controls the text.", "如果页面要控制文字，就设置 `value`。"), control: "text" }),
    invalid: prop("boolean", { defaultValue: false, description: bi("Shows the error border and sets aria-invalid.", "显示错误边框，并设置 aria-invalid。"), control: "boolean" }),
    onChange: callbackProp("onChange", "({value:string}) => void", { value: "Compare periods" }, bi("The function runs at each change. The result has `value`.", "每次变化都会调用这个函数。结果里带有 `value`。")),
    onAutoFill: callbackProp("onAutoFill", "() => void", undefined, bi("The function runs when the user presses AI Auto-fill. The function has no arguments.", "用户按下 AI Auto-fill 时会调用这个函数。这个函数没有参数。")),
  },
  render: function AutoFillTextareaStory(args) {
    const [value, setValue] = useSynced(args.value);
    return <AutoFillTextarea {...args} value={value} onChange={(event) => { setValue(event.value); args.onChange?.(event); }} onAutoFill={() => { setValue("Confirm report context -> Compare periods -> Explain exceptions"); args.onAutoFill?.(); }} />;
  },
};
