import { ScopeOption } from "../../molecules.jsx";
import { callbackProp, prop, useSynced } from "../story-helpers.js";

export default {
  title: "Molecules/Scope option",
  component: ScopeOption,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Toggleable scope option inside the assistant ask box.",
      },
    },
  },
  args: { label: "Campaigns", pressed: false },
  argTypes: {
    label: prop("string", { description: "Option label — echoed back in the onChange payload." }),
    pressed: prop("boolean", { defaultValue: false, description: "Controlled pressed state (aria-pressed)." }),
    onChange: callbackProp(
      "onChange",
      "(event: { label: string, pressed: boolean }) => void",
      { label: "Campaigns", pressed: true },
      "Fired on click; `pressed` is the next state.",
    ),
  },
  render: function ScopeOptionStory(args) {
    const [pressed, setPressed] = useSynced(args.pressed);
    return (
      <ScopeOption
        {...args}
        pressed={pressed}
        onChange={(event) => {
          setPressed(event.pressed);
          args.onChange?.(event);
        }}
      />
    );
  },
};

export const Default = {};
