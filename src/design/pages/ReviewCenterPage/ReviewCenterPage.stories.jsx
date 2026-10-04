import React from "react";
import { REVIEW_CENTER, REVIEW_SHELL } from "../../demo/content/review-center.js";
import { useReviewCenterDemo } from "../../demo/review-center-demo.js";
import { enumProp, callbackProp, bi } from "../../lib/story-helpers.js";
import { ReviewCenterPage, reviewTabs, reviewTypes, reviewTimes, reviewPanels } from "./index.jsx";

const restoration = { id: "restore-warning", title: "Restored validation item", summary: "Restoration awaiting governance review.", type: "Data Model", source: "Shared", submittedBy: "Current User", submitted: "Today", status: "pending", aiCheck: "Warning", warning: "Check the restored lineage before approval." };
const passRestoration = { ...restoration, id: "restore-pass", title: "Restored checked item", aiCheck: "Pass", warning: "" };
const missingSuggestion = { ...restoration, id: "restore-fallback", title: "Restored item without suggestions", aiCheck: "Reviewing", warning: "" };
const flowThreads = () => REVIEW_SHELL.modelFlow.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) }));
const selectedFlowMessages = () => flowThreads().flatMap((thread, threadIndex) => thread.messages.flatMap((message) => message.checked ? [{ ...message, threadIndex, conversation: thread.title }] : []));

export default { title: "Pages", component: ReviewCenterPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: bi("This page is Review Center. It is a review queue. Tabs are Pending, Approved, and Rejected. A composing engineer sets the filters, the queue, the decision overlays, and the assistant. Set `onConfirmApprove` and `onConfirmReject` to finish a decision. A success toast shows after a decision.", "这是 Review Center 页面，也就是审核队列。标签是 Pending、Approved 和 Rejected。组合页面时，设置筛选、队列、决策覆盖层和助手。用 `onConfirmApprove` 和 `onConfirmReject` 完成一次决策。决策后会显示成功 Toast。") } } } };

export const ReviewCenter = {
  name: "Review Center",
  args: { content: REVIEW_CENTER, records: REVIEW_CENTER.records, suggestions: REVIEW_CENTER.suggestions, fallbackSuggestions: REVIEW_CENTER.fallbackSuggestions, restorations: [], initial: { selectedId: "pending-1" }, tab: "pending", type: "all", time: "all", panel: "none", ...REVIEW_SHELL },
  argTypes: {
    initial: { control: "object", description: bi("Initial page and assistant state for the review flow.", "审核流程的初始页面和助手状态。") },
    records: { control: "object", description: bi("Review records. A host can replace this list.", "审核记录。宿主可以替换这份列表。") },
    restorations: { control: "object", description: bi("One-time records merged by id. They do not use localStorage.", "按 id 合并的一次性记录。不使用 localStorage。") },
    tab: enumProp(reviewTabs, "pending", bi("Review tab. Values are pending, approved, and rejected.", "审核标签。取值是 pending、approved 和 rejected。")),
    type: enumProp(reviewTypes, "all", bi("Type filter.", "类型筛选。")),
    time: enumProp(reviewTimes, "all", bi("Submitted window. Values are today, this week, or this month.", "提交时间窗口。取值是今天、本周或本月。")),
    panel: enumProp(reviewPanels, "none", bi("Open review overlay. Choose an item with `initial.selectedId`.", "打开的审核覆盖层。用 `initial.selectedId` 选择条目。")),
    onTabChange: callbackProp("onTabChange", "({value:string}) => void", { value: "approved" }, bi("The function runs when the user selects a review tab. The result has `value`.", "用户选择审核标签时，会调用这个函数。结果里有 `value`。")),
    onSearchChange: callbackProp("onSearchChange", "({value:string}) => void", { value: "Campaign ROI" }, bi("The function runs at each search change. The result has `value`.", "搜索每次变化都会调用这个函数。结果里有 `value`。")),
    onTypeChange: callbackProp("onTypeChange", "({value:string}) => void", { value: "Data Model" }, bi("The function runs when the user selects a type filter. The result has `value`.", "用户选择类型筛选时，会调用这个函数。结果里有 `value`。")),
    onTimeChange: callbackProp("onTimeChange", "({value:string}) => void", { value: "today" }, bi("The function runs when the user selects a submitted window. The result has `value`.", "用户选择提交时间窗口时，会调用这个函数。结果里有 `value`。")),
    onClearFilters: callbackProp("onClearFilters", "({kind:string}) => void", { kind: "no-results" }, bi("The function runs when the user clears filters from the empty state. The result has `kind`.", "用户从空状态清除筛选时，会调用这个函数。结果里有 `kind`。")),
    onOpenDetail: callbackProp("onOpenDetail", "({id:string}) => void", { id: "pending-1" }, bi("The function runs when the user opens a review item. The result has `id`.", "用户打开一条审核条目时，会调用这个函数。结果里有 `id`。")),
    onReviewAction: callbackProp("onReviewAction", "({id:string,action:string}) => void", { id: "pending-1", action: "reject" }, bi("The function runs when the user starts approve, reject, or risk review. The result has `id` and `action`.", "用户开始通过、拒绝或风险审核时，会调用这个函数。结果里有 `id` 和 `action`。")),
    onClosePanel: callbackProp("onClosePanel", "({panel:string,reason:string}) => void", { panel: "detail", reason: "escape" }, bi("The function runs when the user closes an overlay. The result has `panel` and `reason`.", "用户关闭覆盖层时，会调用这个函数。结果里有 `panel` 和 `reason`。")),
    onConfirmReject: callbackProp("onConfirmReject", "({id:string,reason:string}) => void", { id: "pending-1", reason: "" }, bi("The function runs when the user confirms reject. The result has `id` and `reason`.", "用户确认拒绝时，会调用这个函数。结果里有 `id` 和 `reason`。")),
    onConfirmApprove: callbackProp("onConfirmApprove", "({id:string}) => void", { id: "pending-1" }, bi("The function runs when the user confirms approve. The result has `id`.", "用户确认通过时，会调用这个函数。结果里有 `id`。")),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "interpreter", params: {}, href: "/assets/pages/knowledge.html", label: "Knowledge Management" }, bi("The function runs when a nav link opens another page. The result has `id`, `params`, `href`, and `label`.", "导航要打开另一页时，会调用这个函数。结果里有 `id`、`params`、`href` 和 `label`。")),
    onAssistantSubmit: callbackProp("onAssistantSubmit", "({prompt:string}) => void", { prompt: "Definition of Attributed ROI" }, bi("The function runs when the user sends an assistant prompt. The result has `prompt`.", "用户发送助手提示时，会调用这个函数。结果里有 `prompt`。")),
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
export const ReviewCenterEmpty = state("Review Center · No matching items", { search: "no matching review" });
export const ReviewCenterDirectPass = state("Review Center · Pending Pass approves directly", { selectedId: "restore-pass" }, { restorations: [passRestoration] });
export const ReviewCenterPendingDetail = state("Review Center · Pending detail and warning", { selectedId: "pending-1", panel: "detail" });
export const ReviewCenterPendingPlain = state("Review Center · Pending detail without AI notes", { selectedId: "restore-fallback", panel: "detail" }, { restorations: [missingSuggestion] });
export const ReviewCenterApprovedDetail = state("Review Center · Approved detail", { tab: "approved", selectedId: "approved-1", panel: "detail" });
export const ReviewCenterReject = state("Review Center · Reject with AI suggestions", { selectedId: "pending-1", panel: "reject" });
export const ReviewCenterRejectFallback = state("Review Center · Reject fallback suggestions", { selectedId: "restore-fallback", panel: "reject" }, { restorations: [missingSuggestion] });
export const ReviewCenterRiskReviewing = state("Review Center · AI review in progress", { selectedId: "pending-3", panel: "risk" });
export const ReviewCenterRiskWarning = state("Review Center · AI warning", { selectedId: "restore-warning", panel: "risk" }, { restorations: [restoration] });
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
export const ReviewCenterModelGenerated = state("Review Center · Generated model", { assistantOpen: true, flow: { step: "generated", threads: flowThreads(), rule: "", draft: REVIEW_SHELL.modelDraftFor(selectedFlowMessages(), "") } });
export const ReviewCenterModelError = state("Review Center · Model required fields", { assistantOpen: true, flow: { step: "manual", threads: flowThreads(), rule: "", draft: {} } });
ReviewCenterModelError.play = playClicks('.mh-flow__foot .mh-flow__btn--primary');
export const ReviewCenterModelEmpty = state("Review Center · Model needs a selected message", { assistantOpen: true, flow: { step: "history", threads: flowThreads().map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message, checked: false })) })), rule: "", draft: {} } });
ReviewCenterModelEmpty.play = playClicks('.mh-flow__foot .mh-flow__btn--primary');
