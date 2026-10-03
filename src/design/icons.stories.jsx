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
          bi("The icon size is 24 by 24 pixels. The line color is the same as the current text color (`currentColor`). Set `path` to show a different icon. `path` has priority over `name`. If `name` is not in the list, the component shows no icon.", "图标尺寸是 24×24。线条颜色和当前文字颜色相同（`currentColor`）。要显示一个不在列表里的图标，就设置 `path`。`path` 优先于 `name`。如果 `name` 不在列表里，组件不会显示图标。"),
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
