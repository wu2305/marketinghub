import { REVIEW_CENTER } from "../../../demo/content/review-center.js";
import { ReviewQueue } from "./index.jsx";

export default { title: "Features/Review Center/Review Queue", component: ReviewQueue, tags: ["autodocs"], parameters: { layout: "padded", docs: { description: { component: "Seven-column Review Center queue with keyboard-accessible titles and independent review actions. The page controls its filtered records and decisions." } } }, argTypes: { items: { control: "object" }, columns: { control: "object" }, labels: { control: "object" }, onOpenDetail: { action: "onOpenDetail" }, onReviewAction: { action: "onReviewAction" } } };
export const Pending = { args: { items: REVIEW_CENTER.records.filter((item) => item.status === "pending"), columns: REVIEW_CENTER.labels.columns, labels: REVIEW_CENTER.labels } };
