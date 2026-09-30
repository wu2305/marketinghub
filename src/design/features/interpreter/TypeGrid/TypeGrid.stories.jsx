import { TypeGrid } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { useSynced, bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Interpreter/Type grid",
  component: TypeGrid,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Overview grid of TypeCard for the eight knowledge types.", "概览网格，包含八种知识类型的 TypeCard。"),
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
