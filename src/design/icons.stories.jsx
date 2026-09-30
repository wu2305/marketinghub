import { Icon, iconNames } from "./icons.jsx";
import { enumProp, prop, bi } from "./lib/story-helpers.js";

export default {
  title: "Atoms/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("Inline SVG icon (24×24, currentColor stroke). `path` renders raw SVG path data and takes precedence over `name`; unknown names render nothing.", "内联 SVG 图标（24×24，描边取 currentColor）。`path` 直接渲染 SVG 路径数据，优先于 `name`；未知名称不渲染任何内容。"),
      },
    },
  },
  args: { name: "search" },
  argTypes: {
    name: enumProp(iconNames, undefined, bi("Registered icon name.", "已注册的图标名称。")),
    path: prop("string", { description: bi("Raw SVG path data for one-off icons — overrides `name`.", "一次性图标的原始 SVG 路径数据，会覆盖 `name`。") }),
    className: prop("string", { description: bi("Class on the svg element.", "加在 svg 元素上的 class。") }),
  },
  render: (args) => (
    <span style={{ display: "inline-flex", width: 24, height: 24 }}>
      <Icon {...args} />
    </span>
  ),
};

export const Default = {};
