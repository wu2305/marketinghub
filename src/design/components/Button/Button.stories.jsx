import { Button, buttonTypes, buttonVariants, controlSizes } from "./index.jsx";
import { iconNames } from "../../icons.jsx";
import { callbackProp, enumProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Action button. Renders `<button type=\"button\">`; with `href` it renders a link with the same look, for actions that navigate.",
      },
    },
  },
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    children: "Create Campaign Task",
  },
  argTypes: {
    variant: enumProp(buttonVariants, "primary", "Visual treatment.", "select"),
    size: enumProp(controlSizes, "md", "Control height.", "inline-radio"),
    type: enumProp(buttonTypes, "button", 'Native type — pass "submit" inside a form.', "inline-radio"),
    disabled: prop("boolean", { defaultValue: false, description: "Disables the button." }),
    icon: enumProp(iconNames, undefined, "Optional icon rendered before the label."),
    label: prop("string", { description: "aria-label override when the visible text isn't the right accessible name." }),
    children: prop("React.ReactNode", { description: "Visible button label.", control: "text" }),
    href: prop("string", { description: "Navigation target. Renders `<a href>` with the same look; with `disabled` the link has no href and is `aria-disabled`.", control: "text" }),
    onClick: callbackProp(
      "onClick",
      "(event: { label: string }) => void",
      { label: "Create Campaign Task" },
      "Fired on click. `label` is the `label` prop when set, otherwise the trimmed visible text.",
    ),
  },
  render: (args) => <Button {...args} />,
};

export const Default = {};

export const AsLink = {
  args: { href: "#knowledge-create", children: "Add Business Term", variant: "gold" },
};
