import { AutoFillTextarea } from "./index.jsx";
import { callbackProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/AutoFillTextarea",
  component: AutoFillTextarea,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { description: { component: bi("Textarea with an AI Auto-fill pill in its corner. Typing writes back; pressing the pill only reports `onAutoFill`, and the container decides what it fills in.\n\n**When to use.** A multi-line field where the assistant can propose text; the button only reports the request and the page supplies the text. **Used in:** Personal Memory and the SkillForm structure cards.", "右下角带 AI Auto-fill 按钮的文本域。输入会回写；点击按钮只会触发 `onAutoFill`，具体填充什么由容器决定。\n\n**何时使用。** 助手可以建议文字的多行字段；按钮只回报请求，文字由页面提供。**使用位置：** Personal Memory 与 SkillForm 的结构卡片。") } } },
};

export const Default = {
  args: { label: "Analysis Logic", value: "", placeholder: "Describe the analysis logic flow...", autoFillLabel: "AI Auto-fill", rows: 2, invalid: false },
  argTypes: {
    value: prop("string", { defaultValue: "", description: bi("Controlled text.", "受控文本。"), control: "text" }),
    invalid: prop("boolean", { defaultValue: false, description: bi("Danger border and aria-invalid.", "危险态边框，并设置 aria-invalid。"), control: "boolean" }),
    onChange: callbackProp("onChange", "({value:string}) => void", { value: "Compare periods" }),
    onAutoFill: callbackProp("onAutoFill", "() => void"),
  },
  render: function AutoFillTextareaStory(args) {
    const [value, setValue] = useSynced(args.value);
    return <AutoFillTextarea {...args} value={value} onChange={(event) => { setValue(event.value); args.onChange?.(event); }} onAutoFill={() => { setValue("Confirm report context -> Compare periods -> Explain exceptions"); args.onAutoFill?.(); }} />;
  },
};
