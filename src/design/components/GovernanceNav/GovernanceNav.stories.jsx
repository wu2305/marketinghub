import { REVIEW_CENTER } from "../../demo/content/review-center.js";
import { GovernanceNav } from "./index.jsx";
import { callbackProp, bi } from "../../lib/story-helpers.js";

export default { title: "Organisms/Governance Nav", component: GovernanceNav, tags: ["autodocs"], parameters: { docs: { description: { component: bi("Four source-visible governance destinations as real anchors, shared by Review Center and Feedback & Quality.", "四个在源页面中可见的治理入口（真实锚点链接），由 Review Center 与 Feedback & Quality 共用。") } } }, argTypes: { items: { control: "object" }, current: { control: "text" }, navigationAria: { control: "text" }, categoriesAria: { control: "text" }, onNavigate: callbackProp("onNavigate", "({id,params,href,label}) => void", { id: "review-center", params: {}, href: "review-center.html", label: "Review Center" }) } };
export const Feedback = { args: { items: REVIEW_CENTER.sidebar, current: "feedback-quality", navigationAria: "Knowledge navigation", categoriesAria: "Knowledge categories" } };
