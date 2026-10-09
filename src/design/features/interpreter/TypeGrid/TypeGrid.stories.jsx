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
        component: bi("This component is the overview grid on AI Interpreter. Cards are 171px tall with 12px radius and gaps; widths follow the container columns. Titles are 18px, summaries 14px, counts/actions 12px. Title and count centers align in a 26px heading row. It shows one `TypeCard` for each of the eight knowledge types. Set `activeId` for the selected type. The function `onSelect` runs when the user clicks a card. The result has `id` and `title`.", "这是 AI Interpreter 上的概览网格。卡片高度 171px、圆角 12px、间距 12px，宽度随容器分列；标题 18px、描述 14px、统计标签及入口 12px，标题与统计标签在 26px 标题行内垂直居中。八种知识类型各显示一张 `TypeCard`。用 `activeId` 设置当前选中的类型。用户点击卡片时会调用 `onSelect`。结果里带有 `id` 和 `title`。"),
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
