import React from "react";
import { FEEDBACK_QUALITY, makeFeedbackRecords } from "../../demo/content/feedback-quality.js";
import { useFeedbackQualityDemo } from "../../demo/feedback-quality-demo.js";
import { callbackProp, enumProp } from "../../lib/story-helpers.js";
import { FeedbackQualityPage, feedbackFilterTypes, feedbackFilterTimes } from "./index.jsx";

const NOW = Date.UTC(2026, 8, 26, 12);
const records = makeFeedbackRecords(NOW);
const hrefFor = (id, params = {}) => {
  const path = ({ interpreter: "/assets/pages/knowledge.html", "review-center": "/assets/pages/review-center.html", "scenario-library": "/assets/pages/scenario-library.html", "feedback-quality": "/assets/pages/feedback-quality.html" })[id];
  const query = new URLSearchParams(params).toString();
  return path && query ? `${path}?${query}` : path;
};

export default { title: "Pages", component: FeedbackQualityPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: "Source-backed feedback table, filters and detail panel. The page is controlled; the private flow is shared with the standalone host. The original P13 launcher is inert because portal.js requires a missing subtitle; this story restores its intended assistant behavior." } } } };

export const FeedbackQuality = {
  name: "Feedback & Quality",
  args: { content: FEEDBACK_QUALITY, records, now: NOW, initial: {}, type: "all", time: "all", search: "" },
  argTypes: {
    records: { control: "object", description: "Replaceable source feedback fixtures." },
    now: { control: "date", description: "One clock for all time thresholds." },
    initial: { control: "object", description: "Initial selected detail and assistant state." },
    type: enumProp(feedbackFilterTypes, "all", "Visible feedback type select and All Feedback tab state."),
    time: enumProp(feedbackFilterTimes, "all", "Source time filter."),
    search: { control: "text" },
    onTypeChange: callbackProp("onTypeChange", "({value:string}) => void", { value: "thumbs-up" }),
    onTimeChange: callbackProp("onTimeChange", "({value:string}) => void", { value: "week" }),
    onSearchChange: callbackProp("onSearchChange", "({value:string}) => void", { value: "loyalty" }),
    onOpen: callbackProp("onOpen", "({id:string}) => void", { id: "fb-3" }),
    onCloseDetail: callbackProp("onCloseDetail", "({reason:string}) => void", { reason: "escape" }),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "review-center", params: {}, href: "/assets/pages/review-center.html", label: "Review Center" }),
    onAssistantSubmit: callbackProp("onAssistantSubmit", "({prompt:string}) => void", { prompt: "Definition of Attributed ROI" }),
  },
  render: function FeedbackQualityStory(args) {
    const initial = React.useMemo(() => ({ ...args.initial, type: args.type, time: args.time, search: args.search }), [args.initial, args.type, args.time, args.search]);
    const page = useFeedbackQualityDemo({ ...args, initial });
    return <FeedbackQualityPage {...page} hrefFor={hrefFor} />;
  },
};

const state = (name, initial = {}) => ({ ...FeedbackQuality, name, args: { ...FeedbackQuality.args, initial, type: initial.type || "all", time: initial.time || "all", search: initial.search || "" } });
export const FeedbackQualityUp = state("Feedback & Quality · Thumbs Up", { type: "thumbs-up" });
export const FeedbackQualityDown = state("Feedback & Quality · Thumbs Down", { type: "thumbs-down" });
export const FeedbackQualityToday = state("Feedback & Quality · Today", { time: "today" });
export const FeedbackQualityWeek = state("Feedback & Quality · This week", { time: "week" });
export const FeedbackQualityMonth = state("Feedback & Quality · This month", { time: "month" });
export const FeedbackQualitySearch = state("Feedback & Quality · Search result", { search: "loyalty program" });
export const FeedbackQualityEmpty = state("Feedback & Quality · No matching feedback", { search: "no matching feedback" });
export const FeedbackQualityNegativeDetail = state("Feedback & Quality · Negative feedback detail", { selectedId: "fb-3" });
export const FeedbackQualityPositiveDetail = state("Feedback & Quality · Positive feedback detail", { selectedId: "fb-1" });
