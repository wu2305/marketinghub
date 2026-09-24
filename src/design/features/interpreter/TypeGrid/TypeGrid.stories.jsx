import { TypeGrid } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Organisms/Type grid",
  component: TypeGrid,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Overview grid of TypeCard for the eight knowledge types.",
      },
    },
  },
  args: { activeId: "overview" },
  argTypes: {
    activeId: { control: "select", options: ["overview", ...INTERPRETER.types.map((type) => type.id)] },
    onSelect: { action: "onSelect" },
  },
  render: function TypeGridStory(args) {
    const [activeId, setActiveId] = useSynced(args.activeId);
    return (
      <TypeGrid
        items={INTERPRETER.types}
        {...args}
        activeId={activeId}
        onSelect={(event) => {
          setActiveId(event.id);
          args.onSelect?.(event);
        }}
      />
    );
  },
};

export const Default = {};
