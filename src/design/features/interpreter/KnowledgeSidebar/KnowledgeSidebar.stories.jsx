import { KnowledgeSidebar } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Organisms/Knowledge sidebar",
  component: KnowledgeSidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "AI Interpreter sidebar: brand, overview entry, and the 8-type navigation.",
      },
    },
  },
  args: { active: "overview" },
  argTypes: {
    active: { control: "select", options: ["overview", ...INTERPRETER.types.map((type) => type.id)] },
    onSelect: { action: "onSelect" },
  },
  render: function KnowledgeSidebarStory(args) {
    const [active, setActive] = useSynced(args.active);
    return (
      <div style={{ width: 240 }}>
        <KnowledgeSidebar
          overview={INTERPRETER.overview}
          title={INTERPRETER.sidebarTitle}
          types={INTERPRETER.types}
          activeId={active}
          onSelect={(event) => {
            setActive(event.id);
            args.onSelect?.(event);
          }}
        />
      </div>
    );
  },
};

export const Default = {};
