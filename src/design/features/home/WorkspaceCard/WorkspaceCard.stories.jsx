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
        component: bi("This component is a workspace card on Home. It shows an image, a title, a description, and capability links. A full-card link opens the workspace. Set `href` for that link. The function `onOpen` runs when the user clicks the card. The result has `title` and `href`. The function `onNavigate` runs when the user clicks a capability link. The result has `id`, `href`, and `label`.", "这是 Home 上的工作区卡片。它显示图片、标题、说明和能力链接。整张卡片上的链接会打开该工作区。用 `href` 设置这个链接。用户点击卡片时会调用 `onOpen`。结果里带有 `title` 和 `href`。用户点击能力链接时会调用 `onNavigate`。结果里带有 `id`、`href` 和 `label`。"),
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
