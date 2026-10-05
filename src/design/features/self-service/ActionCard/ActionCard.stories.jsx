import { ActionCard } from "./index.jsx";
import { demoHrefFor } from "../../../demo/navigation.js";
import { bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Self-Service/Action card",
  component: ActionCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is an entry card on Self-Service Center. It shows a title, a description, and one action. Set `href` if the action opens a page. The action then becomes a link. If `history` is set, a history button appears next to the title. The function `onOpen` runs when the user uses the action. The function `onShowHistory` runs when the user clicks the history button.", "这是 Self-Service Center 上的入口卡片。它显示标题、说明和一个操作。如果这个操作会打开页面，就设置 `href`。操作会变成链接。设置了 `history` 时，标题旁会出现历史按钮。用户使用该操作时会调用 `onOpen`。用户点击历史按钮时会调用 `onShowHistory`。"),
      },
    },
  },
  args: {
    title: "MZ Tracking Detail",
    description: "Miaozhen OTV/OLV media monitoring self-analysis.",
    actionLabel: "Open data view",
    href: demoHrefFor("media-tracking-detail"),
    history: undefined,
  },
  argTypes: {
    onOpen: { action: "onOpen" },
    onShowHistory: { action: "onShowHistory" },
  },
  render: (args) => <ActionCard {...args} />,
};

export const Default = {};
