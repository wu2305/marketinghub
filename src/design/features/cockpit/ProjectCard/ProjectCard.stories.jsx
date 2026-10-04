import { ProjectCard } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { bi } from "../../../lib/story-helpers.js";

const cityProject = COCKPIT.projects.city;

export default {
  title: "Features/Cockpit/Project card",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is one project card on Marketing Cockpit. It shows an image, a kicker, the title, a short description, and a View Dashboards link. The image, title, and action are `<a href>`. The function `onOpen` runs when the user clicks one of those three parts. The result has `title`, `href`, and `part`. `part` is `image`, `title`, or `action`.", "这是 Marketing Cockpit 上的一张项目卡片。它显示图片、眉标、标题、简短说明和 View Dashboards 链接。图片、标题和操作都是 `<a href>`。用户点击这三处之一时会调用 `onOpen`。结果里带有 `title`、`href` 和 `part`。`part` 为 `image`、`title` 或 `action`。"),
      },
    },
  },
  args: { title: cityProject.title, description: cityProject.description },
  argTypes: { onOpen: { action: "onOpen" } },
  render: (args) => (
    <div style={{ width: 360 }}>
      <ProjectCard
        title={cityProject.title}
        kicker={cityProject.kicker}
        image={cityProject.image}
        updated={cityProject.sourceStrip[0]}
        href="/assets/pages/reports.html?project=city"
        {...args}
      />
    </div>
  ),
};

export const Default = {};
