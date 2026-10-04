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
          "This example is a Business Term workspace. A composing engineer builds it from public package exports only. Components and `governedActions` come from `marketing-hub`. Copy and seed records come from `marketing-hub/demo`. State and rules live in the app itself. You can add a term, save it, submit it, edit it, disable it, or delete it. Cancel does not save. Cancel returns to the Business Term list. Save writes a draft. Submit in this example sets stage to Under Review. The screens match the Demo Business Term library and form.",
          "这是一个 Business Term 工作区示例。组合页面时，只使用包的公开导出。组件和 `governedActions` 来自 `marketing-hub`。文案和种子记录来自 `marketing-hub/demo`。状态和规则都写在这个应用里。你可以新增词条、保存、提交、编辑、停用或删除。Cancel 不保存，并返回 Business Term 列表。Save 写成草稿。这个示例里的 Submit 会把 stage 设为 Under Review。界面与 Demo 的 Business Term 库和表单一致。",
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
