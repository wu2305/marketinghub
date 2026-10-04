import { BusinessTermApp, seedTerms } from "./BusinessTermApp.tsx";
import { bi } from "../../src/design/lib/story-helpers.js";

export default {
  title: "Examples/Consumer business term",
  component: BusinessTermApp,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi(
          "This example is a Business Term workspace. A composing engineer builds it from public package exports only. Components and `governedActions` come from `marketing-hub`. Copy and seed records come from `marketing-hub/demo`. State and rules live in the app itself. Cancel does not save. Cancel returns to the Business Term list. Save sets Disabled and Draft. Submit publishes the term for AI use. Submit sets Enabled and Published. The running example still sends Under Review. That conflict is listed on the pull request.",
          "这是一个 Business Term 工作区示例。组合页面时，只使用包的公开导出。组件和 `governedActions` 来自 `marketing-hub`。文案和种子记录来自 `marketing-hub/demo`。状态和规则都写在这个应用里。Cancel 不保存，并返回 Business Term 列表。Save 写成 Disabled 和 Draft。Submit 会发布词条，供 AI 使用，并把 status 设为 Enabled、stage 设为 Published。正在运行的示例仍会发出 Under Review。这个冲突写在 pull request 说明里。",
        ),
      },
    },
  },
  argTypes: {
    currentUser: {
      control: "select",
      options: [...new Set(seedTerms.map((term) => term.creator))],
      description: bi("Acting user for ownership and governed actions.", "用于所有权和受治理操作的当前用户。"),
    },
  },
};

export const Workspace = {};
