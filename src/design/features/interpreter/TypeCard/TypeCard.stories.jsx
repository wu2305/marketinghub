import { TypeCard } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Organisms/Type card",
  component: TypeCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Knowledge-type card in the overview grid. `manageable` flips read-only vs manage styling; `art` picks one of 8 baked background images (0–7).",
      },
    },
  },
  args: { ...INTERPRETER.types[0], count: "10 principles", active: false, manageable: false, art: 0 },
  argTypes: {
    manageable: { control: "boolean" },
    onSelect: { action: "onSelect" },
  },
  render: function TypeCardStory(args) {
    const [active, setActive] = useSynced(args.active);
    return (
      <TypeCard
        {...args}
        active={active}
        onSelect={(event) => {
          setActive(true);
          args.onSelect?.(event);
        }}
      />
    );
  },
};

export const Default = {};
