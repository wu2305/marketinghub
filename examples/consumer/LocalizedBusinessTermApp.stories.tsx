import { LocalizedBusinessTermApp } from "./LocalizedBusinessTermApp.tsx";
import { bi } from "../../src/design/lib/story-helpers.js";

export default {
  title: "Examples/Localized business term",
  component: LocalizedBusinessTermApp,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi(
          "This example is the Business Term workspace with an English and 中文 switch at the bottom left. The switch is a public `FilterPills` and the language is host state. The app gets one of two content objects, so there is no i18n provider and no change inside the components. Each visible text already arrives as a prop with an English default. Records are data and keep the language they were written in. Page and form copy change at once, and nothing typed is lost. The 中文 wording is a draft for review by a native speaker. Data Model names, people and brand names stay as they are.",
          "这个示例是带 English / 中文 切换的 Business Term 工作区，切换在左下角。切换用公开的 `FilterPills`，语言是宿主自己的状态。应用拿到两份内容对象中的一份，所以不需要 i18n provider，组件内部也不用改。每一处可见文字本来就以带英文默认值的 prop 传入。记录是数据，保持写入时的语言。页面和表单文案立即切换，已输入的内容不会丢失。中文措辞是草稿，需要母语者审阅。Data Model 名称、人名和品牌名保持原样。",
        ),
      },
    },
  },
  argTypes: {
    initialLocale: {
      control: "inline-radio",
      options: ["en", "zh"],
      description: bi(
        "Language shown first. It also picks the language of the seed records. The switch changes the page language after that, and the records stay as they are.",
        "最先显示的语言。它也决定初始记录使用的语言。之后切换只改变页面语言，记录保持不变。",
      ),
    },
  },
};

export const English = {
  args: { initialLocale: "en" },
  parameters: {
    docs: {
      description: {
        story: bi("Starts in English. Choose 中文 at the bottom left to switch the page and form copy.", "从英文开始。点击左下角的 中文，页面和表单文案随之切换。"),
      },
    },
  },
};

export const Chinese = {
  args: { initialLocale: "zh" },
  parameters: {
    docs: {
      description: {
        story: bi("Starts in 中文 with Chinese seed records. Choose English at the bottom left to switch back.", "从中文开始，初始记录也是中文。点击左下角的 English 切回英文。"),
      },
    },
  },
};
