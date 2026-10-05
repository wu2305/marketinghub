import { controlSizes } from "../Button/index.jsx";
import { SearchField, searchIconPositions, searchVariants } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Search field",
  component: SearchField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is a labelled search field. The icon can sit at the start, at the end, or be omitted.\n\n**When to use.** Use this component for free-text search over a list or a page. The container filters the data at each change. **Used in:** Marketing Cockpit, Campaign, Metric Dictionary, Data Model, Knowledge View, Review Center, Feedback & Quality, Skill Library, and the knowledge libraries on AI Interpreter.", "这个组件是带标签的搜索框。图标可以放在前面、后面，也可以不显示。\n\n**何时使用。** 对列表或页面做自由文本搜索。容器在每次变化时过滤数据。**使用位置：** Marketing Cockpit、Campaign、Metric Dictionary、Data Model、Knowledge View、Review Center、Feedback & Quality、Skill Library，以及 AI Interpreter 上的各知识库。"),
      },
    },
  },
  args: { label: "Search dashboards", placeholder: "Search dashboards", value: "", size: "lg", variant: "field", icon: "end" },
  argTypes: {
    label: prop("string", { defaultValue: "Search", description: bi("Accessible label (visually hidden).", "无障碍标签（视觉上隐藏）。") }),
    name: prop("string", { description: bi("Field name in the `onChange` result.", "字段名会出现在 `onChange` 的结果里。") }),
    value: prop("string", { description: bi("Set `value` if the page controls the text. If you do not set `value`, the field holds the text.", "如果页面要控制文字，就设置 `value`。如果不设置 `value`，输入框自己保存文字。") }),
    placeholder: prop("string", { defaultValue: "Search", description: bi("Hint text inside the field.", "输入框内的提示文字。") }),
    size: enumProp(controlSizes, "md", bi("Control height.", "控件高度。"), "inline-radio"),
    variant: enumProp(searchVariants, "field", bi("`field` is the standard search field. `plain` is the gold pill used on knowledge libraries.", "`field` 是标准搜索框。`plain` 是知识库上使用的金色胶囊。"), "inline-radio"),
    icon: enumProp(searchIconPositions, "start", bi("Icon position, or none.", "图标位置，或不显示。"), "inline-radio"),
    inputRef: prop("React.Ref<HTMLInputElement>", { description: bi("Forwarded to the input element.", "转发给输入元素。"), control: false }),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "query", value: "AUDIT" },
      bi("The function runs at each change. If you do not set `name`, `name` in the result is empty.", "每次变化都会调用这个函数。如果没有设置 `name`，结果里的 `name` 是空的。"),
    ),
  },
  render: function SearchFieldStory(args) {
    const [value, setValue] = useSynced(args.value);
    return (
      <div style={{ width: args.variant === "plain" ? 520 : 360 }}>
        <SearchField
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
