import React from "react";
import { Switch } from "./index.jsx";
import { prop, callbackProp, bi } from "../../lib/story-helpers.js";

export default {
  title: "Atoms/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi(
          "A switch turns one setting on or off, and the change applies right away. It is a native checkbox with a switch track on top, so the keyboard and screen readers work as they do for any checkbox. The visible text sits next to the switch in your own markup. Pass `label` for the accessible name.\n\n**When to use.** Use it for a setting such as \"Participate in Q&A\" or \"Enable Metric\". Use a checkbox when the choice only counts after a Submit. **Used in:** Metric Dictionary and the Derived Metric drawer.",
          "开关用来打开或关闭一项设置，改变立即生效。它是原生复选框，上面叠了一层开关轨道，所以键盘和读屏行为与普通复选框一致。可见文字由你自己的标记放在开关旁边，用 `label` 提供可访问名称。\n\n**何时使用。** 用于“Participate in Q&A”“Enable Metric”这类设置。如果选择要提交后才生效，请用复选框。**使用位置：** Metric Dictionary 与 Derived Metric 抽屉。",
        ),
      },
    },
  },
  args: { label: "Participate in Q&A", defaultChecked: true },
  argTypes: {
    label: prop("string", { defaultValue: "", description: bi("Accessible name of the switch.", "开关的可访问名称。") }),
    checked: prop("boolean", { defaultValue: undefined, description: bi("Pass it to control the switch. Leave it out to let the switch keep its own state.", "传入后由调用方控制开关。不传则开关自己保存状态。"), control: "boolean" }),
    defaultChecked: prop("boolean", { defaultValue: false, description: bi("Initial state when the switch is not controlled.", "开关不受控时的初始状态。"), control: "boolean" }),
    disabled: prop("boolean", { defaultValue: false, description: bi("Stops changes and dims the track.", "禁止修改并让轨道变淡。"), control: "boolean" }),
    onChange: callbackProp("onChange", "(event: { checked: boolean }) => void", { checked: true }, bi("Fires when the switch is turned on or off.", "开关被打开或关闭时触发。")),
  },
};

function ControlledSwitch(args) {
  const [checked, setChecked] = React.useState(true);
  return <Switch {...args} checked={checked} onChange={(event) => { setChecked(event.checked); args.onChange?.(event); }} />;
}

export const Default = {};

export const Off = { args: { defaultChecked: false } };

export const Disabled = { args: { disabled: true } };

export const Controlled = {
  args: { defaultChecked: undefined },
  render: (args) => <ControlledSwitch {...args} />,
};
