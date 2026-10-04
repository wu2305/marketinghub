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
          bi("This component is one knowledge-type card on the AI Interpreter overview. It shows a title, a count, a summary, and an action line. Set `manageable` for the manage style. If you do not set `manageable`, the card uses the read-only style. Set `art` to pick one of eight background images (0–7). The function `onSelect` runs when the user clicks the card. The result has `title`.", "这是 AI Interpreter 概览里的一张知识类型卡片。它显示标题、数量、摘要和一行操作。设置 `manageable` 会使用可管理样式。不设置 `manageable` 时使用只读样式。用 `art` 选择八张背景图之一（0–7）。用户点击卡片时会调用 `onSelect`。结果里带有 `title`。"),
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
