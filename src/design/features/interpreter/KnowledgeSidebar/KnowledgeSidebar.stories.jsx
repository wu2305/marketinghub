import { KnowledgeSidebar } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { useSynced, bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Interpreter/Knowledge sidebar",
  component: KnowledgeSidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is the left sidebar on AI Interpreter. It shows the brand, an Overview entry, and navigation for the eight knowledge types. Set `activeId` to `overview` or a type `id`. A manageable type shows a Manage badge. The function `onSelect` runs when the user selects Overview or a type. The result has `id` and `label`.", "这是 AI Interpreter 的左侧栏。它显示品牌名、Overview 入口，以及八种知识类型的导航。把 `activeId` 设为 `overview` 或某个类型的 `id`。可管理的类型会显示 Manage 标记。用户选择 Overview 或某个类型时会调用 `onSelect`。结果里带有 `id` 和 `label`。"),
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
