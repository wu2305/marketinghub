import { FormField, formFieldControls } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Form field",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is a labelled form field. It can show TextInput, TextArea, or Select. The field has a label. It can also show a required mark, a hint, and an error state.\n\n**When to use.** Use this component for any labelled form field. Pages do not style the label, the required mark, the hint, or the error state themselves. **Used in:** Media Tracking Detail, Campaign, Data Upload, and Knowledge create.", "这个组件是带标签的表单字段。它可以显示 TextInput、TextArea 或 Select。字段有标签，还可以有必填标记、提示和错误状态。\n\n**何时使用。** 任何带标签的表单字段都用这个组件。页面不必自己设置标签、必填标记、提示或错误状态的样式。**使用位置：** Media Tracking Detail、Campaign、Data Upload 与 Knowledge create。"),
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
    label: prop("string", { description: bi("Visible field label.", "字段上显示的标签。") }),
    name: prop("string", { description: bi("Field name in the `onChange` result.", "字段名会出现在 `onChange` 的结果里。") }),
    control: enumProp(formFieldControls, "text", bi("Which control to show: `text`, `textarea`, or `select`.", "显示哪种控件：`text`、`textarea` 或 `select`。"), "inline-radio"),
    required: prop("boolean", { defaultValue: false, description: bi("Shows the required mark after the label.", "在标签后显示必填标记。") }),
    invalid: prop("boolean", { defaultValue: false, description: bi("Shows the error style on the field and the control.", "在字段和控件上显示错误样式。") }),
    hint: prop("string", { description: bi("Hint line under the control.", "控件下方的提示行。") }),
    value: prop("string", { description: bi("Set `value` if the page controls the text. If you do not set `value`, the field holds the text.", "如果页面要控制文字，就设置 `value`。如果不设置 `value`，输入框自己保存文字。") }),
    defaultValue: prop("string", { description: bi("Initial value when the page does not set `value`.", "页面没有设置 `value` 时的初始值。") }),
    placeholder: prop("string", { description: bi("Hint text inside the control. For `select`, the value of the first option is this text.", "控件内的提示文字。`select` 时，第一项的值就是这段文字。") }),
    autoComplete: prop("string", { description: bi("HTML autocomplete attribute.", "HTML 的 autocomplete 属性。") }),
    options: prop('Array<{ id?: string, value?: string, label: string } | string>', {
      description: bi("Option list. Use this only when `control` is `select`.", "选项列表。仅在 `control` 为 `select` 时使用。"),
    }),
    rows: prop("number", { description: bi("Visible row count. Use this only when `control` is `textarea`.", "可见行数。仅在 `control` 为 `textarea` 时使用。") }),
    className: prop("string", { description: bi("Extra class on the field wrapper.", "加在字段外层上的额外 class。") }),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "title", value: "Share of search" },
      bi("The function runs at each change. If you do not set `name`, `name` in the result is empty.", "每次变化都会调用这个函数。如果没有设置 `name`，结果里的 `name` 是空的。"),
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
