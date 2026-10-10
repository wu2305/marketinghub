import { ReportCopilotApp } from "./ReportCopilotApp.tsx";
import { demoData, type CockpitData } from "./CockpitApp.tsx";
import { ALT_COPILOT, ALT_GROUPS, ALT_KNOWLEDGE, ALT_PROJECTS } from "../../src/design/demo/__fixtures__/alt-cockpit.js";
import { bi } from "../../src/design/lib/story-helpers.js";

export default {
  title: "Examples/Consumer report copilot",
  component: ReportCopilotApp,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi(
          "This example is a report desk with its own layout, not a page. An engineer builds it from public package exports. It mounts `ReportCopilot` next to a report picker. The app owns all state: the selected report, whether the drawer is open, the composer text, the open answer, and the chat. A thread belongs to one report. When the picker changes, the app empties the thread in the same render. Close and reopen on the same report keeps the thread. Set `data` to supply projects, knowledge, and Copilot copy.",
          "这是一个有自己布局的报表工作台示例，不是页面。组合时，使用包的公开导出。它把 `ReportCopilot` 放在报表选择器旁边。所有状态都在应用里：选中的报表、抽屉是否打开、输入框文字、当前回答和聊天。一个会话属于一份报表。切换选择器时，应用会在同一次渲染里清空会话。在同一份报表上关闭再打开，会话保留。通过 `data` 传入项目、知识和 Copilot 文案。",
        ),
      },
    },
  },
  args: { data: demoData },
  argTypes: {
    data: {
      control: false,
      description: bi("Catalog, knowledge, and Copilot copy for this app. Swap this object to change the reports in the picker and the answers. The layout stays the same.", "这个应用的目录、知识和 Copilot 文案。替换这个对象会改变选择器里的报表和回答。布局不变。"),
    },
  },
};

export const ReportDesk = {
  parameters: {
    docs: {
      description: {
        story: bi("The Demo catalog. Pick a report, open the Copilot, choose a suggested question, then change the report to see the thread start over.", "Demo 自带的目录。选一份报表，打开 Copilot，选一个推荐问题，然后切换报表，会话会重新开始。"),
      },
    },
  },
};

export const ReplacementData = {
  args: { data: { projects: ALT_PROJECTS, groups: ALT_GROUPS, knowledge: ALT_KNOWLEDGE, detailsSections: [], copilot: ALT_COPILOT } as unknown as CockpitData },
  parameters: {
    docs: {
      description: {
        story: bi("Replacement data. The reports, sources, and Copilot text are different. The desk and the interactions stay the same.", "替换后的数据。报表、来源和 Copilot 文案不同。工作台和交互不变。"),
      },
    },
  },
};
