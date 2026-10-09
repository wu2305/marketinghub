import { TypeCard } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { useSynced, bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Interpreter/Type card",
  component: TypeCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("This component is one knowledge-type card on the AI Interpreter overview. It shows a title, a count, a summary, and an action line. The static Demo rhythm is 171px height, 12px radius, 24px left inset, 18px title and 14px summary. Title and count align vertically at their centers in a 26px heading row; long titles truncate without overlapping the count. Set `manageable` for the manage style. If you do not set `manageable`, the card uses the read-only style. Set `art` to pick one of eight background images (0–7). The function `onSelect` runs when the user clicks the card. The result has `title`.", "这是 AI Interpreter 概览里的一张知识类型卡片。它显示标题、数量、摘要和一行操作。参照静态 Demo：高度 171px、圆角 12px、左边距 24px、标题 18px、摘要 14px。标题与统计标签在 26px 标题行内按中心线对齐，超长标题省略且不遮挡统计标签。设置 `manageable` 会使用可管理样式。不设置 `manageable` 时使用只读样式。用 `art` 选择八张背景图之一（0–7）。用户点击卡片时会调用 `onSelect`。结果里带有 `title`。"),
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
      <div style={{ width: 323, maxWidth: "100%" }}>
      <TypeCard
        {...args}
        active={active}
        onSelect={(event) => {
          setActive(true);
          args.onSelect?.(event);
        }}
      />
      </div>
    );
  },
};

export const Default = {};

export const CompactWidth = {
  name: "Overview column: 219px",
  args: { ...INTERPRETER.types[3], count: "3 metrics", art: 3 },
  render: args => <div style={{ width: 219, maxWidth: "100%" }}><TypeCard {...args} /></div>,
  parameters: { docs: { description: { story: bi("Matches a narrow four-column Overview card; the title and count centers stay aligned and do not overlap.", "模拟窄版四列 Overview 中的卡片；标题与数量标签中心对齐，互不遮挡。") } } },
};
