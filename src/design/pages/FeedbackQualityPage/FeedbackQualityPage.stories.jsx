import React from "react";
import { FEEDBACK_QUALITY, makeFeedbackRecords } from "../../demo/content/feedback-quality.js";
import { useFeedbackQualityDemo } from "../../demo/feedback-quality-demo.js";
import { callbackProp, enumProp, bi } from "../../lib/story-helpers.js";
import { FeedbackQualityPage, feedbackFilterTypes, feedbackFilterTimes, feedbackTabs } from "./index.jsx";

const NOW = Date.UTC(2026, 8, 26, 12);
const records = makeFeedbackRecords(NOW - 1000);
const hrefFor = (id, params = {}) => {
  const path = ({ interpreter: "/assets/pages/knowledge.html", "review-center": "/assets/pages/review-center.html", "scenario-library": "/assets/pages/scenario-library.html", "feedback-quality": "/assets/pages/feedback-quality.html" })[id];
  const query = new URLSearchParams(params).toString();
  return path && query ? `${path}?${query}` : path;
};

export default { title: "Pages", component: FeedbackQualityPage, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: bi("This page is Feedback & Quality. It lists assistant feedback. Tabs are All, Thumbs Up, and Thumbs Down. Feedback rows have no actions. They cannot change. To build this page, set the filters, the table, and the detail drawer. The original launcher did not open because a subtitle was missing. This page restores the intended assistant.", "这是 Feedback & Quality 页面。它列出助手反馈。标签是 All、Thumbs Up 和 Thumbs Down。反馈行没有操作，也不能改。组合页面时，设置筛选、表格和详情抽屉。原始启动器因为缺少 subtitle 而打不开。本页恢复了本应有的助手。") } } } };

export const FeedbackQuality = {
  name: "Feedback & Quality",
  args: { content: FEEDBACK_QUALITY, records, now: NOW, initial: {}, type: "all", time: "all", search: "" },
  argTypes: {
    records: { control: "object", description: bi("Feedback records. A host can replace this list.", "反馈记录。宿主可以替换这份列表。") },
    now: { control: "date", description: bi("One clock for all time thresholds.", "所有时间阈值共用的一个时钟。") },
    initial: { control: "object", description: bi("Initial selected detail and assistant state.", "初始选中的详情和助手状态。") },
    type: enumProp(feedbackFilterTypes, "all", bi("Visible type select and All Feedback tab.", "可见的类型下拉和 All Feedback 标签。")),
    time: enumProp(feedbackFilterTimes, "all", bi("Time filter.", "时间筛选。")),
    tabs: { control: "check", options: feedbackTabs, description: bi("Visible tabs. Each tab can be turned off.", "可见的标签。每个标签都可以单独关掉。") },
    search: { control: "text", description: bi("Search text.", "搜索文字。") },
    onTypeChange: callbackProp("onTypeChange", "({value:string}) => void", { value: "thumbs-up" }, bi("The function runs when the user selects a type filter. The result has `value`.", "用户选择类型筛选时，会调用这个函数。结果里有 `value`。")),
    onTimeChange: callbackProp("onTimeChange", "({value:string}) => void", { value: "week" }, bi("The function runs when the user selects a time filter. The result has `value`.", "用户选择时间筛选时，会调用这个函数。结果里有 `value`。")),
    onSearchChange: callbackProp("onSearchChange", "({value:string}) => void", { value: "loyalty" }, bi("The function runs at each search change. The result has `value`.", "搜索每次变化都会调用这个函数。结果里有 `value`。")),
    onClearFilters: callbackProp("onClearFilters", "({kind:string}) => void", { kind: "no-results" }, bi("The function runs when the user clears filters from the empty state. The result has `kind`.", "用户从空状态清除筛选时，会调用这个函数。结果里有 `kind`。")),
    onOpen: callbackProp("onOpen", "({id:string}) => void", { id: "fb-3" }, bi("The function runs when the user opens a feedback row. The result has `id`.", "用户打开一条反馈时，会调用这个函数。结果里有 `id`。")),
    onCloseDetail: callbackProp("onCloseDetail", "({reason:string}) => void", { reason: "escape" }, bi("The function runs when the user closes the detail drawer. The result has `reason`.", "用户关闭详情抽屉时，会调用这个函数。结果里有 `reason`。")),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "review-center", params: {}, href: "/assets/pages/review-center.html", label: "Review Center" }, bi("The function runs when a nav link opens another page. The result has `id`, `params`, `href`, and `label`.", "导航要打开另一页时，会调用这个函数。结果里有 `id`、`params`、`href` 和 `label`。")),
    onAssistantSubmit: callbackProp("onAssistantSubmit", "({prompt:string}) => void", { prompt: "Definition of Attributed ROI" }, bi("The function runs when the user sends an assistant prompt. The result has `prompt`.", "用户发送助手提示时，会调用这个函数。结果里有 `prompt`。")),
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
