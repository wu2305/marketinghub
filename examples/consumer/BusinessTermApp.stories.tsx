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
          "This example is a Business Term workspace. An engineer builds it from public package exports only. Components and `governedActions` come from `marketing-hub`. Copy and seed records come from `marketing-hub/demo`. State and rules live in the app itself. Cancel does not save. Cancel returns to the Business Term list. Save Draft sets status to Disable and stage to Draft. Publish & Enable sets status to Enable and stage to Published. Publish & Enable shows the toast Published and enabled.",
          "这是一个 Business Term 工作区示例。组合页面时，只使用包的公开导出。组件和 `governedActions` 来自 `marketing-hub`。文案和种子记录来自 `marketing-hub/demo`。状态和规则都写在这个应用里。Cancel 不保存，并返回 Business Term 列表。Save Draft 把 status 设为 Disable，把 stage 设为 Draft。Publish & Enable 把 status 设为 Enable，把 stage 设为 Published。Publish & Enable 会显示 toast Published and enabled。",
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

export const Workspace = {
  parameters: {
    docs: {
      description: {
        story: bi(
          "The seed terms from `marketing-hub/demo` and this app's own Save Draft, Publish & Enable, and governed actions.",
          "种子词条来自 `marketing-hub/demo`。Save Draft、Publish & Enable 和受治理操作都写在这个应用里。",
        ),
      },
    },
  },
};
