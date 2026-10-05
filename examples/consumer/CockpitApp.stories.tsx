import { CockpitApp, demoData, type CockpitData } from "./CockpitApp.tsx";
import { ALT_COPILOT, ALT_GROUPS, ALT_KNOWLEDGE, ALT_PROJECTS } from "../../src/design/demo/__fixtures__/alt-cockpit.js";
import { bi } from "../../src/design/lib/story-helpers.js";

export default {
  title: "Examples/Consumer cockpit",
  component: CockpitApp,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi(
          "This example is a Marketing Cockpit. An engineer builds it from public package exports. The page is `MarketingCockpitPage`. State lives in the app. Two assistants can be on one page. The corner assistant is the workspace assistant. A live report also has Report Copilot. Each assistant has its own answers. Set `data` to supply projects, groups, knowledge, and Copilot copy.",
          "这是一个 Marketing Cockpit 示例。组合页面时，使用包的公开导出。页面是 `MarketingCockpitPage`。状态写在这个应用里。同一页可以有两个助手。角落里的是工作区助手。实时报表上还有 Report Copilot。两个助手各自有自己的回答。通过 `data` 传入项目、分组、知识和 Copilot 文案。",
        ),
      },
    },
  },
  args: { data: demoData },
  argTypes: {
    data: {
      control: false,
      description: bi("Catalog, knowledge, and Copilot copy for this app. Swap this object to change listed projects and answers. The page layout stays the same.", "这个应用的目录、知识和 Copilot 文案。替换这个对象会改变列出的项目和回答。页面布局不变。"),
    },
  },
};

export const Workspace = {
  parameters: {
    docs: {
      description: {
        story: bi("The Demo catalog and Copilot copy.", "Demo 自带的目录和 Copilot 文案。"),
      },
    },
  },
};

export const ReplacementData = {
  args: { data: { projects: ALT_PROJECTS, groups: ALT_GROUPS, knowledge: ALT_KNOWLEDGE, detailsSections: [], copilot: ALT_COPILOT } as unknown as CockpitData },
  parameters: {
    docs: {
      description: {
        story: bi("Replacement data. The catalog, knowledge, and Copilot text are different. The page and the interactions stay the same.", "替换后的数据。目录、知识和 Copilot 文案不同。页面和交互不变。"),
      },
    },
  },
};
