import React from "react";
import { FEEDBACK_QUALITY, makeFeedbackRecords } from "../../demo/content/feedback-quality.js";
import { useFeedbackQualityDemo } from "../../demo/feedback-quality-demo.js";
import { callbackProp, enumProp } from "../../lib/story-helpers.js";
import { FeedbackQualityPage, feedbackFilterTypes, feedbackFilterTimes, feedbackTabs } from "./index.jsx";

const NOW = Date.UTC(2026, 8, 26, 12);
const records = makeFeedbackRecords(NOW - 1000);
const hrefFor = (id, params = {}) => {
  const path = ({ interpreter: "/assets/pages/knowledge.html", "review-center": "/assets/pages/review-center.html", "scenario-library": "/assets/pages/scenario-library.html", "feedback-quality": "/assets/pages/feedback-quality.html" })[id];
  const query = new URLSearchParams(params).toString();
  return path && query ? `${path}?${query}` : path;
};

export default { title: "Pages", component: FeedbackQualityPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: "Controlled Feedback & Quality page on the governed-library table pattern: All / Thumbs Up / Thumbs Down tabs, search, Type and Time facets, the feedback table and its detail drawer. List states (filtered, empty) are shown by the Organisms/Library stories. The page is controlled; the private flow is shared with the standalone host. The original P13 launcher is inert because portal.js requires a missing subtitle; this story restores its intended assistant behavior." } } } };

export const FeedbackQuality = {
  name: "Feedback & Quality",
  args: { content: FEEDBACK_QUALITY, records, now: NOW, initial: {}, type: "all", time: "all", search: "" },
  argTypes: {
    records: { control: "object", description: "Replaceable source feedback fixtures." },
    now: { control: "date", description: "One clock for all time thresholds." },
    initial: { control: "object", description: "Initial selected detail and assistant state." },
    type: enumProp(feedbackFilterTypes, "all", "Visible feedback type select and All Feedback tab state."),
    time: enumProp(feedbackFilterTimes, "all", "Source time filter."),
    tabs: { control: "check", options: feedbackTabs, description: "Visible tabs; each one can be turned off separately." },
    search: { control: "text" },
    onTypeChange: callbackProp("onTypeChange", "({value:string}) => void", { value: "thumbs-up" }),
    onTimeChange: callbackProp("onTimeChange", "({value:string}) => void", { value: "week" }),
    onSearchChange: callbackProp("onSearchChange", "({value:string}) => void", { value: "loyalty" }),
    onClearFilters: callbackProp("onClearFilters", "({kind:string}) => void", { kind: "no-results" }),
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
export const FeedbackQualityEmpty = state("Feedback & Quality · No matching feedback", { search: "no matching feedback" });
export const FeedbackQualityNegativeDetail = state("Feedback & Quality · Negative feedback detail", { selectedId: "fb-3" });
export const FeedbackQualityPositiveDetail = state("Feedback & Quality · Positive feedback detail", { selectedId: "fb-1" });

const flowThreads = () => FEEDBACK_QUALITY.modelFlow.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) }));
const checkedMessages = () => flowThreads().flatMap((thread, threadIndex) => thread.messages.flatMap((message) => message.checked ? [{ ...message, threadIndex, conversation: thread.title }] : []));
const playClicks = (...selectors) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  const frame = () => new Promise((resolve) => doc.defaultView.requestAnimationFrame(resolve));
  await frame(); await frame();
  for (const selector of selectors) {
    let node;
    for (let count = 0; count < 30; count += 1) {
      node = canvasElement.querySelector(selector) || doc.querySelector(selector);
      if (node) break;
      await frame();
    }
    if (!node) throw new Error(`Feedback & Quality story control missing: ${selector}`);
    node.click(); await frame();
  }
};
export const FeedbackQualityAssistant = state("Feedback & Quality · Assistant open (restored)", { assistantOpen: true });
export const FeedbackQualityAssistantFilled = state("Feedback & Quality · Suggestion fills prompt (restored)", { assistantOpen: true, assistantPrompt: FEEDBACK_QUALITY.assistant.suggestions[0].prompt });
export const FeedbackQualityAssistantAnswer = state("Feedback & Quality · Grounded assistant answer (restored)", { assistantOpen: true, assistantAnswers: [FEEDBACK_QUALITY.answerFor("Definition of Attributed ROI")] });
export const FeedbackQualityAssistantHistory = state("Feedback & Quality · Recent chats (restored)", { assistantOpen: true });
FeedbackQualityAssistantHistory.play = playClicks('.mh-assistant__history .mh-assistant__icon');
export const FeedbackQualityAssistantMaximized = state("Feedback & Quality · Assistant maximized (restored)", { assistantOpen: true });
FeedbackQualityAssistantMaximized.play = playClicks('button[aria-label="Maximize"]');
export const FeedbackQualityAssistantSkills = state("Feedback & Quality · Assistant skills (restored)", { assistantOpen: true });
FeedbackQualityAssistantSkills.play = playClicks('.mh-assistant__skill');
export const FeedbackQualityAssistantSkillSearch = state("Feedback & Quality · Skill search empty (restored)", { assistantOpen: true });
FeedbackQualityAssistantSkillSearch.play = async (context) => {
  await playClicks('.mh-assistant__skill', '.mh-skill__category:nth-child(2)')(context);
  const field = context.canvasElement.querySelector('.mh-skill__search input');
  if (!field) throw new Error('Feedback & Quality skill search missing');
  Object.getOwnPropertyDescriptor(field.ownerDocument.defaultView.HTMLInputElement.prototype, 'value').set.call(field, 'no matching model');
  field.dispatchEvent(new field.ownerDocument.defaultView.Event('input', { bubbles: true }));
};
export const FeedbackQualityAssistantSelected = state("Feedback & Quality · Selected model skill (restored)", { assistantOpen: true, selectedSkill: { id: "roi-diagnosis", type: "Analytical Model", title: "ROI diagnosis model" } });
export const FeedbackQualityModelHistory = state("Feedback & Quality · Model chat history (restored)", { assistantOpen: true, flow: { step: "history", threads: flowThreads(), rule: "", draft: {} } });
export const FeedbackQualityModelManual = state("Feedback & Quality · Manual model (restored)", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
export const FeedbackQualityModelGenerated = state("Feedback & Quality · Generated model (restored)", { assistantOpen: true, flow: { step: "generated", threads: flowThreads(), rule: "", draft: FEEDBACK_QUALITY.modelDraftFor(checkedMessages(), "") } });
export const FeedbackQualityModelError = state("Feedback & Quality · Model required fields (restored)", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
FeedbackQualityModelError.play = playClicks('.mh-flow__foot .mh-flow__btn--primary');
export const FeedbackQualityModelEmpty = state("Feedback & Quality · Model needs selected message (restored)", { assistantOpen: true, flow: { step: "history", threads: flowThreads().map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message, checked: false })) })), rule: "", draft: {} } });
FeedbackQualityModelEmpty.play = playClicks('.mh-flow__foot .mh-flow__btn--primary');
