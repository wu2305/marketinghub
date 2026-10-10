import React from "react";
import { CurrentPagesSite, currentRoutes } from "../demos/showcase/App.jsx";
import { bi } from "../../src/design/lib/story-helpers.js";

type PageId = keyof typeof currentRoutes;

/* The site starts on `page` and then behaves like the product: the top navigation, cards and links
   open the other pages. `key` restarts it when the Controls change the start page. */
function Walkthrough({ page }: { page: PageId }) {
  const [started] = React.useState(() => {
    window.location.hash = `#/${page}`;
    return page;
  });
  return <CurrentPagesSite key={started} />;
}

export default {
  title: "Examples/Product walkthrough",
  component: Walkthrough,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    /* A whole site, not one component: the acceptance suite treats it like a page story. */
    wholeSite: true,
    docs: {
      story: { inline: false, iframeHeight: 720 },
      description: {
        component: bi(
          "This example is the whole current product in one click-through site. It has the nine pages the product still has: Home, Marketing Cockpit, Self-Service Center, Data Upload, Media Tracking Detail, RedNote Campaign Tool, AI Interpreter, Knowledge Create, and Data Model. Each story starts on one page. From there the top navigation, the workspace cards, and the links open the other pages, as in the product. The pages are the same components as the Pages stories, linked by a small hash router. The assistants, forms, and dialogs work with fixed local answers. Nothing is saved. This example uses the demo hooks from `marketing-hub/demo`. It is not a consumer-only example like the other Examples stories. The eight pages retired on 2026-10-09 are not part of it.",
          "这个示例把当前产品完整地放在一个可点击的站点里。它包含产品仍有的九个页面：Home、Marketing Cockpit、Self-Service Center、Data Upload、Media Tracking Detail、RedNote Campaign Tool、AI Interpreter、Knowledge Create 和 Data Model。每个故事从一个页面开始。之后顶部导航、工作区卡片和链接会像产品一样打开其他页面。页面与 Pages 故事用的是同一批组件，只是用一个小型 hash 路由连起来。助手、表单和对话框使用固定的本地回答，不保存任何内容。这个示例使用 `marketing-hub/demo` 的 demo hook，所以不属于其他 Examples 故事那种只用公开导出的使用方示例。2026-10-09 撤下的八个页面不在其中。",
        ),
      },
    },
  },
  argTypes: {
    page: {
      control: "select",
      options: Object.keys(currentRoutes),
      description: bi(
        "The page the site starts on. Changing it restarts the site on that page.",
        "站点起始的页面。修改它会让站点从该页面重新开始。",
      ),
    },
  },
};

const startAt = (page: PageId, en: string, zh: string) => ({
  args: { page },
  parameters: { docs: { description: { story: bi(en, zh) } } },
});

export const Home = startAt("home", "The site starts on Home, the portal entry. The cards open the other workspaces.", "站点从 Home 门户入口开始。卡片会打开其他工作区。");
export const MarketingCockpit = startAt("cockpit", "The site starts on Marketing Cockpit, the report catalog. A report opens its live view and Report Copilot.", "站点从报表目录 Marketing Cockpit 开始。打开一份报表会进入实时视图和 Report Copilot。");
export const SelfServiceCenter = startAt("self-service", "The site starts on Self-Service Center. The Upload tab leads to Data Upload and Media Tracking Detail.", "站点从 Self-Service Center 开始。Upload 标签通向 Data Upload 和 Media Tracking Detail。");
export const DataUpload = startAt("data-upload", "The site starts on Data Upload, the upload form. Back returns to the Self-Service upload tab.", "站点从上传表单 Data Upload 开始。Back 返回 Self-Service 的 Upload 标签。");
export const MediaTrackingDetail = startAt("media-tracking-detail", "The site starts on Media Tracking Detail. Back returns to Self-Service Center.", "站点从 Media Tracking Detail 开始。Back 返回 Self-Service Center。");
export const RedNoteCampaignTool = startAt("campaign", "The site starts on the RedNote Campaign Tool with its five sections.", "站点从 RedNote Campaign Tool 的五个分区开始。");
export const AiInterpreter = startAt("interpreter", "The site starts on the AI Interpreter overview. Each knowledge type opens its own view, and Create opens Knowledge Create.", "站点从 AI Interpreter 概览开始。每种知识类型会打开各自的视图，Create 打开 Knowledge Create。");
export const KnowledgeCreate = startAt("knowledge-create", "The site starts on Knowledge Create, the form for a new knowledge item.", "站点从新建知识条目的表单 Knowledge Create 开始。");
export const DataModel = startAt("data-model", "The site starts on Data Model, the model browser.", "站点从模型浏览器 Data Model 开始。");
