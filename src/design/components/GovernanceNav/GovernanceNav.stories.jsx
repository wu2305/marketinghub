import { REVIEW_CENTER } from "../../demo/content/review-center.js";
import { GovernanceNav } from "./index.jsx";
import { callbackProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Governance Nav",
  component: GovernanceNav,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component shows four governance links. The links are real anchors. Review Center, Feedback & Quality, Personal Memory, Skill Library, Scenario Detail, and Skill Edit use the same links.", "这个组件显示四个治理链接。这些链接是真实锚点。Review Center、Feedback & Quality、Personal Memory、Skill Library、Scenario Detail 和 Skill Edit 使用同一组链接。"),
      },
    },
  },
  argTypes: {
    items: prop("Array<{id,icon,label,href}>", { description: bi("Link items. Each item has `id`, `icon`, `label`, and `href`.", "链接项。每项有 `id`、`icon`、`label` 和 `href`。"), control: "object" }),
    current: prop("string", { description: bi("`id` of the current page. That link has `aria-current=\"page\"`.", "当前页的 `id`。该链接带有 `aria-current=\"page\"`。"), control: "text" }),
    navigationAria: prop("string", { description: bi("Accessible name of the aside.", "侧栏的无障碍名称。"), control: "text" }),
    categoriesAria: prop("string", { description: bi("Accessible name of the navigation list.", "导航列表的无障碍名称。"), control: "text" }),
    onNavigate: callbackProp(
      "onNavigate",
      "({id,params,href,label}) => void",
      { id: "review-center", params: {}, href: "review-center.html", label: "Review Center" },
      bi("The function runs when a link is clicked. The result has `id`, `params`, `href`, and `label`. `params` is an empty object.", "点击链接时调用这个函数。结果里带有 `id`、`params`、`href` 和 `label`。`params` 是空对象。"),
    ),
  },
};

export const Feedback = { args: { items: REVIEW_CENTER.sidebar, current: "feedback-quality", navigationAria: "Knowledge navigation", categoriesAria: "Knowledge categories" } };
