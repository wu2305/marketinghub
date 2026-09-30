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
        component: bi("Labeled search input with an icon that can lead, trail, or be omitted.\n\n**When to use.** Free-text search over a list or page. The container filters the data on every change. **Used in:** LibraryToolbar (every governed library), Campaign, Marketing Cockpit, Metric Dictionary, Data Model and Knowledge View.", "带图标的搜索输入框，图标可放在前面、后面或省略。\n\n**何时使用。** 对列表或页面做自由文本搜索，容器在每次变化时过滤数据。**使用位置：** LibraryToolbar（所有受治理库）、Campaign、Marketing Cockpit、Metric Dictionary、Data Model 与 Knowledge View。"),
      },
    },
  },
  args: { label: "Search dashboards", placeholder: "Search dashboards", value: "", size: "lg", variant: "field", icon: "end" },
  argTypes: {
    label: prop("string", { defaultValue: "Search", description: bi("Accessible label (visually hidden).", "无障碍标签（视觉上隐藏）。") }),
    name: prop("string", { description: bi("Field name echoed in the onChange payload.", "字段名，会回传在 onChange 的载荷中。") }),
    value: prop("string", { description: bi("Controlled value — omit for uncontrolled.", "受控值；不传则为非受控。") }),
    placeholder: prop("string", { defaultValue: "Search", description: bi("Placeholder text.", "占位文字。") }),
    size: enumProp(controlSizes, "md", bi("Control height.", "控件高度。"), "inline-radio"),
    variant: enumProp(searchVariants, "field", bi("\"plain\" is the original `.overview-global-search` gold pill.", "\"plain\" 对应原始的 `.overview-global-search` 金色胶囊。"), "inline-radio"),
    icon: enumProp(searchIconPositions, "start", bi("Icon position, or none.", "图标位置，或不显示。"), "inline-radio"),
    inputRef: prop("React.Ref<HTMLInputElement>", { description: bi("Forwarded to the input element.", "转发给输入元素。"), control: false }),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "query", value: "AUDIT" },
      bi("Fired on every edit.", "每次编辑时触发。"),
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
