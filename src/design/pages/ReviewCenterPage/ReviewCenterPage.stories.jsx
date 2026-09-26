import React from "react";
import { REVIEW_CENTER, REVIEW_SHELL } from "../../demo/content/review-center.js";
import { useReviewCenterDemo } from "../../demo/review-center-demo.js";
import { enumProp, callbackProp } from "../../lib/story-helpers.js";
import { ReviewCenterPage, reviewTabs, reviewTypes, reviewTimes, reviewPanels } from "./index.jsx";

const restoration = { id: "restore-warning", title: "Restored validation item", summary: "Restoration awaiting governance review.", type: "Data Model", source: "Shared", submittedBy: "Current User", submitted: "Today", status: "pending", aiCheck: "Warning", warning: "Check the restored lineage before approval." };
const passRestoration = { ...restoration, id: "restore-pass", title: "Restored checked item", aiCheck: "Pass", warning: "" };
const missingSuggestion = { ...restoration, id: "restore-fallback", title: "Restored item without suggestions", aiCheck: "Reviewing", warning: "" };
const flowThreads = () => REVIEW_SHELL.modelFlow.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) }));

export default { title: "Pages", component: ReviewCenterPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: "Controlled Review Center page with source-backed Pending and Approved queues, detail and decision overlays, and the lite AI assistant. The private demo hook drives Storybook and the standalone host." } } } };

export const ReviewCenter = {
  name: "Review Center",
  args: { content: REVIEW_CENTER, records: REVIEW_CENTER.records, suggestions: REVIEW_CENTER.suggestions, fallbackSuggestions: REVIEW_CENTER.fallbackSuggestions, restorations: [], initial: { selectedId: "pending-1" }, tab: "pending", type: "all", time: "all", panel: "none", ...REVIEW_SHELL },
  argTypes: {
    initial: { control: "object", description: "Initial page and assistant state for the deterministic workflow." },
    records: { control: "object", description: "Source-backed review fixtures; replaceable by a host." },
    restorations: { control: "object", description: "One-time records merged by id, without localStorage." },
    tab: enumProp(reviewTabs, "pending", "Review tab (the demo hook owns interactive state)."),
    type: enumProp(reviewTypes, "all", "Source type filter."),
    time: enumProp(reviewTimes, "all", "Visible Submitted selection; source does not filter rows by time."),
    panel: enumProp(reviewPanels, "none", "Selected review overlay; choose an item in initial.selectedId."),
    onTabChange: callbackProp("onTabChange", "({value:string}) => void", { value: "approved" }),
    onSearchChange: callbackProp("onSearchChange", "({value:string}) => void", { value: "Campaign ROI" }),
    onTypeChange: callbackProp("onTypeChange", "({value:string}) => void", { value: "Data Model" }),
    onTimeChange: callbackProp("onTimeChange", "({value:string}) => void", { value: "today" }),
    onOpenDetail: callbackProp("onOpenDetail", "({id:string}) => void", { id: "pending-1" }),
    onReviewAction: callbackProp("onReviewAction", "({id:string,action:string}) => void", { id: "pending-1", action: "reject" }),
    onClosePanel: callbackProp("onClosePanel", "({panel:string,reason:string}) => void", { panel: "detail", reason: "escape" }),
    onConfirmReject: callbackProp("onConfirmReject", "({id:string,reason:string}) => void", { id: "pending-1", reason: "" }),
    onConfirmApprove: callbackProp("onConfirmApprove", "({id:string}) => void", { id: "pending-1" }),
    onNavigate: callbackProp("onNavigate", "({id:string,href:string,label:string}) => void", { id: "interpreter", href: "/assets/pages/knowledge.html", label: "Knowledge Management" }),
    onAssistantSubmit: callbackProp("onAssistantSubmit", "({prompt:string}) => void", { prompt: "Definition of Attributed ROI" }),
  },
  render: function ReviewCenterStory(args) {
    const initial = React.useMemo(() => ({ ...args.initial, tab: args.tab, type: args.type, time: args.time, panel: args.panel === "none" ? null : args.panel }), [args.initial, args.tab, args.type, args.time, args.panel]);
    const page = useReviewCenterDemo({ ...args, initial, hrefFor: (id, params = {}) => {
      const path = ({ interpreter: "/assets/pages/knowledge.html", "review-center": "/assets/pages/review-center.html", "scenario-library": "/assets/pages/scenario-library.html", "feedback-quality": "/assets/pages/feedback-quality.html" })[id];
      const query = new URLSearchParams(params).toString();
      return path && query ? `${path}?${query}` : path;
    } });
    return <ReviewCenterPage {...page} />;
  },
};

const state = (name, initial, overrides = {}) => ({ ...ReviewCenter, name, args: { ...ReviewCenter.args, ...overrides, initial, tab: initial.tab || "pending", type: initial.type || "all", time: initial.time || "all", panel: initial.panel || "none" } });
const playClicks = (...selectors) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  const frame = () => new Promise((resolve) => doc.defaultView.requestAnimationFrame(resolve));
  // Storybook may call play before React has flushed initial overlay effects.
  await frame();
  await frame();
  for (const selector of selectors) {
    let node;
    for (let frameCount = 0; frameCount < 30; frameCount += 1) {
      node = canvasElement.querySelector(selector) || doc.querySelector(selector);
      if (node) break;
      await frame();
    }
    if (!node) throw new Error(`Review Center story control missing: ${selector}`);
    node.click();
    await frame();
  }
};
export const ReviewCenterApproved = state("Review Center · Approved", { tab: "approved" });
export const ReviewCenterSearch = state("Review Center · Search hit", { search: "Campaign ROI" });
export const ReviewCenterEmpty = state("Review Center · No matching items", { search: "no matching review" });
export const ReviewCenterType = state("Review Center · Type filtered", { type: "Data Model" });
export const ReviewCenterTime = state("Review Center · Submitted Today selection", { time: "today" });
export const ReviewCenterPendingDetail = state("Review Center · Pending detail and warning", { selectedId: "pending-1", panel: "detail" });
export const ReviewCenterPendingPlain = state("Review Center · Pending detail without AI notes", { selectedId: "restore-fallback", panel: "detail" }, { restorations: [missingSuggestion] });
export const ReviewCenterApprovedDetail = state("Review Center · Approved detail", { tab: "approved", selectedId: "approved-1", panel: "detail" });
export const ReviewCenterReject = state("Review Center · Reject with AI suggestions", { selectedId: "pending-1", panel: "reject" });
export const ReviewCenterRejectFallback = state("Review Center · Reject fallback suggestions", { selectedId: "restore-fallback", panel: "reject" }, { restorations: [missingSuggestion] });
export const ReviewCenterRiskReviewing = state("Review Center · AI review in progress", { selectedId: "pending-3", panel: "risk" });
export const ReviewCenterRiskWarning = state("Review Center · AI warning", { selectedId: "restore-warning", panel: "risk" }, { restorations: [restoration] });
export const ReviewCenterDirectPass = state("Review Center · Direct approval after Pass", {}, { records: [...REVIEW_CENTER.records, { ...passRestoration, status: "approved" }] });
export const ReviewCenterRejectedResult = state("Review Center · Empty-reason rejection result", {});
ReviewCenterRejectedResult.play = playClicks('[data-review-id="pending-1"] .mh-review-queue__reject', '.mh-review-page__reject-actions button:last-child');
export const ReviewCenterAssistant = state("Review Center · Assistant open", { assistantOpen: true });
export const ReviewCenterAssistantFilled = state("Review Center · Suggestion fills prompt", { assistantOpen: true, assistantPrompt: "Definition of Attributed ROI" });
export const ReviewCenterAssistantAnswer = state("Review Center · Simple assistant answer", { assistantOpen: true, assistantAnswers: [REVIEW_SHELL.answerFor("Definition of Attributed ROI")] });
export const ReviewCenterAssistantHistory = state("Review Center · Recent chats", { assistantOpen: true });
ReviewCenterAssistantHistory.play = playClicks('.mh-assistant__history .mh-assistant__icon');
export const ReviewCenterAssistantMaximized = state("Review Center · Assistant maximized", { assistantOpen: true });
ReviewCenterAssistantMaximized.play = playClicks('button[aria-label="Maximize"]');
export const ReviewCenterAssistantSkills = state("Review Center · Assistant skill menu", { assistantOpen: true });
ReviewCenterAssistantSkills.play = playClicks('.mh-assistant__skill');
export const ReviewCenterAssistantSkillSearch = state("Review Center · Skill search has no match", { assistantOpen: true });
ReviewCenterAssistantSkillSearch.play = async (context) => {
  await playClicks('.mh-assistant__skill', '.mh-skill__category:nth-child(2)')(context);
  const field = context.canvasElement.querySelector('.mh-skill__search input');
  if (!field) throw new Error('Review Center skill search missing');
  Object.getOwnPropertyDescriptor(field.ownerDocument.defaultView.HTMLInputElement.prototype, 'value').set.call(field, 'no matching model');
  field.dispatchEvent(new field.ownerDocument.defaultView.Event('input', { bubbles: true }));
};
export const ReviewCenterAssistantSelected = state("Review Center · Assistant selected model", { assistantOpen: true, selectedSkill: { id: "roi-diagnosis", type: "Analytical Model", title: "ROI diagnosis model" } });
export const ReviewCenterModelHistory = state("Review Center · Model chat history", { assistantOpen: true, flow: { step: "history", threads: flowThreads(), rule: "", draft: {} } });
export const ReviewCenterModelManual = state("Review Center · Manual model", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
export const ReviewCenterModelGenerated = state("Review Center · Generated model", { assistantOpen: true, flow: { step: "generated", threads: flowThreads(), rule: "Use checked context", draft: REVIEW_SHELL.modelDraftFor([], "Use checked context") } });
export const ReviewCenterModelError = state("Review Center · Model required fields", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
ReviewCenterModelError.play = playClicks('.mh-flow__foot .mh-flow__btn--primary');
export const ReviewCenterModelEmpty = state("Review Center · Model needs a selected message", { assistantOpen: true, flow: { step: "history", threads: flowThreads().map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message, checked: false })) })), rule: "", draft: {} } });
ReviewCenterModelEmpty.play = playClicks('.mh-flow__foot .mh-flow__btn--primary');
