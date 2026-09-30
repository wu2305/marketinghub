import { Button, buttonTypes, buttonVariants, controlSizes } from "./index.jsx";
import { iconNames } from "../../icons.jsx";
import { callbackProp, enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Action button. Renders `<button type=\"button\">`; with `href` it renders a link with the same look, for actions that navigate.", "操作按钮。渲染为 `<button type=\"button\">`；传入 `href` 时渲染为外观相同的链接，用于导航类操作。"),
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
    variant: enumProp(buttonVariants, "primary", bi("Visual treatment.", "视觉样式。"), "select"),
    size: enumProp(controlSizes, "md", bi("Control height.", "控件高度。"), "inline-radio"),
    type: enumProp(buttonTypes, "button", bi("Native type — pass \"submit\" inside a form.", "原生 type 属性：在表单内使用时传 \"submit\"。"), "inline-radio"),
    disabled: prop("boolean", { defaultValue: false, description: bi("Disables the button.", "禁用按钮。") }),
    icon: enumProp(iconNames, undefined, bi("Optional icon rendered before the label.", "显示在文字前的可选图标。")),
    expanded: prop("boolean", { description: bi("Disclosure state; renders aria-expanded. Leave unset for ordinary actions.", "展开/收起状态，渲染 aria-expanded。普通操作不要设置。"), control: "boolean" }),
    label: prop("string", { description: bi("aria-label override when the visible text isn't the right accessible name.", "覆盖 aria-label；当可见文字不适合作为无障碍名称时使用。") }),
    children: prop("React.ReactNode", { description: bi("Visible button label.", "按钮上显示的文字。"), control: "text" }),
    href: prop("string", { description: bi("Navigation target. Renders `<a href>` with the same look; with `disabled` the link has no href and is `aria-disabled`.", "导航目标。渲染为外观相同的 `<a href>`；设置 `disabled` 时链接没有 href，并带 `aria-disabled`。"), control: "text" }),
    onClick: callbackProp(
      "onClick",
      "(event: { label: string }) => void",
      { label: "Create Campaign Task" },
      bi("Fired on click. `label` is the `label` prop when set, otherwise the trimmed visible text.", "点击时触发。`label` 在设置了 `label` 属性时取该值，否则取去除首尾空白的可见文字。"),
    ),
  },
  render: (args) => <Button {...args} />,
};

export const Default = {};

export const AsLink = {
  args: { href: "#knowledge-create", children: "Add Business Term", variant: "gold" },
};
