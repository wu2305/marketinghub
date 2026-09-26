import { FEEDBACK_QUALITY, makeFeedbackRecords } from "../../../demo/content/feedback-quality.js";
import { FeedbackList } from "./index.jsx";

export default { title: "Features/Feedback Quality/Feedback List", component: FeedbackList, tags: ["autodocs"], parameters: { layout: "padded", docs: { description: { component: "Seven-column source feedback list with truncated previews, full-text titles, type badges, user avatars and View actions." } } }, argTypes: { items: { control: "object" }, columns: { control: "object" }, labels: { control: "object" }, onOpen: { action: "onOpen" } } };
export const Records = { args: { items: makeFeedbackRecords(Date.UTC(2026, 8, 26, 12)), columns: FEEDBACK_QUALITY.labels.columns, labels: FEEDBACK_QUALITY.labels } };
