import { REVIEW_CENTER } from "../../demo/content/review-center.js";
import { GovernanceNav } from "./index.jsx";
import { callbackProp } from "../../lib/story-helpers.js";

export default { title: "Organisms/Governance Nav", component: GovernanceNav, tags: ["autodocs"], parameters: { docs: { description: { component: "Four source-visible governance destinations as real anchors, shared by Review Center and Feedback & Quality." } } }, argTypes: { items: { control: "object" }, current: { control: "text" }, navigationAria: { control: "text" }, categoriesAria: { control: "text" }, onNavigate: callbackProp("onNavigate", "({id,params,href,label}) => void", { id: "review-center", params: {}, href: "review-center.html", label: "Review Center" }) } };
export const Feedback = { args: { items: REVIEW_CENTER.sidebar, current: "feedback-quality", navigationAria: "Knowledge navigation", categoriesAria: "Knowledge categories" } };
