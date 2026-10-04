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
        component: bi("This component is the overview grid on AI Interpreter. It shows one `TypeCard` for each of the eight knowledge types. Set `activeId` for the selected type. The function `onSelect` runs when the user clicks a card. The result has `id` and `title`.", "这是 AI Interpreter 上的概览网格。八种知识类型各显示一张 `TypeCard`。用 `activeId` 设置当前选中的类型。用户点击卡片时会调用 `onSelect`。结果里带有 `id` 和 `title`。"),
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
