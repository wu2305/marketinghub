import { FormField, formFieldControls } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Form field",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Labelled form control wrapping TextInput / TextArea / Select.\n\n**When to use.** Any labelled form control: it wraps TextInput, TextArea or Select with the label, required marker, hint and error state, so pages never style these themselves. **Used in:** Media Tracking Detail, Campaign, Data Upload and the Business Term form.", "带标签的表单控件，包裹 TextInput / TextArea / Select。\n\n**何时使用。** 任何带标签的表单控件：它用标签、必填标记、提示与错误状态包裹 TextInput、TextArea 或 Select，页面无需自行设置这些样式。**使用位置：** Media Tracking Detail、Campaign、Data Upload 与 Business Term 表单。"),
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
    label: prop("string", { description: bi("Field label.", "字段标签。") }),
    name: prop("string", { description: bi("Field name echoed in the onChange payload.", "字段名，会回传在 onChange 的载荷中。") }),
    control: enumProp(formFieldControls, "text", bi("Which control renders.", "渲染哪种控件。"), "inline-radio"),
    required: prop("boolean", { defaultValue: false, description: bi("Renders the required marker.", "显示必填标记。") }),
    invalid: prop("boolean", { defaultValue: false, description: bi("Error styling on the wrapper and control.", "在外层和控件上显示错误样式。") }),
    hint: prop("string", { description: bi("Hint line under the control.", "控件下方的提示行。") }),
    value: prop("string", { description: bi("Controlled value — omit for uncontrolled.", "受控值；不传则为非受控。") }),
    defaultValue: prop("string", { description: bi("Initial value when uncontrolled.", "非受控时的初始值。") }),
    placeholder: prop("string", { description: bi("Placeholder text (leading option for select).", "占位文字（select 时为首个引导选项）。") }),
    autoComplete: prop("string", { description: bi("Native autocomplete attribute.", "原生 autocomplete 属性。") }),
    options: prop('Array<{ id?: string, value?: string, label: string } | string>', {
      description: bi("Select only — the option list.", "仅 select 使用：选项列表。"),
    }),
    rows: prop("number", { description: bi("Textarea only — visible row count.", "仅 textarea 使用：可见行数。") }),
    className: prop("string", { description: bi("Extra class on the field wrapper.", "附加在字段外层上的额外 class。") }),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "title", value: "Share of search" },
      bi("Fired on every edit, whichever control is active.", "任何一种控件被编辑时都会触发。"),
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
