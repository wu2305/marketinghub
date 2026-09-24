import { Icon, iconNames } from "./icons.jsx";
import { enumProp, prop } from "./lib/story-helpers.js";

export default {
  title: "Atoms/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Inline SVG icon (24×24, currentColor stroke). `path` renders raw SVG path data and takes precedence over `name`; unknown names render nothing.",
      },
    },
  },
  args: { name: "search" },
  argTypes: {
    name: enumProp(iconNames, undefined, "Registered icon name."),
    path: prop("string", { description: "Raw SVG path data for one-off icons — overrides `name`." }),
    className: prop("string", { description: "Class on the svg element." }),
  },
  render: (args) => (
    <span style={{ display: "inline-flex", width: 24, height: 24 }}>
      <Icon {...args} />
    </span>
  ),
};

export const Default = {};
