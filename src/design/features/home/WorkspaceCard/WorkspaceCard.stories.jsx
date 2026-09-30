import { WorkspaceCard } from "./index.jsx";
import { HOME } from "../../../content.js";
import { demoHrefFor } from "../../../demo/navigation.js";
import { bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Home/Workspace card",
  component: WorkspaceCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Home workspace card: image, description, capability links, full-card opener.", "Home 工作区卡片：图片、描述、能力链接，整张卡片可点击打开。"),
      },
    },
  },
  args: { title: HOME.cards[0].title, description: HOME.cards[0].description },
  argTypes: {
    onOpen: { action: "onOpen" },
    onNavigate: { action: "onNavigate" },
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <WorkspaceCard
        {...HOME.cards[0]}
        href={demoHrefFor(HOME.cards[0].target.id, HOME.cards[0].target.params)}
        links={HOME.cards[0].links.map((link) => ({ ...link, href: demoHrefFor(link.target.id, link.target.params) }))}
        {...args}
      />
    </div>
  ),
};

export const Default = {};
