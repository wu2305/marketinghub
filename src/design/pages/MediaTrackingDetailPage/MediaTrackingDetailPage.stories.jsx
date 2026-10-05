import { LITE_ASSISTANT, MEDIA_TRACKING } from "../../content.js";
import { useMediaTrackingDemo } from "../../demo/media-tracking-demo.js";
import { enumProp, pageShell, bi } from "../../lib/story-helpers.js";
import { MediaTrackingDetailPage, mediaTrackingPeriods } from "./index.jsx";

export default {
  title: "Pages",
  component: MediaTrackingDetailPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: bi("This page is Media Tracking Detail. It sits under Self-Service Center. To build this page, set the period tabs, the filter grid, the notes, and the data table. The period tab does not filter the static table. The assistant is the lite drawer.", "这是 Media Tracking Detail 页面，位于 Self-Service Center 之下。组合页面时，设置周期标签、筛选网格、说明和数据表。周期标签不会筛选这张静态表。助手是轻量抽屉。") } },
  },
};

export const MediaTrackingDetail = {
  name: "Media Tracking Detail",
  args: {
    ...pageShell,
    current: "self-service",
    toolbar: MEDIA_TRACKING.toolbar,
    labels: MEDIA_TRACKING.labels,
    head: MEDIA_TRACKING.head,
    periods: MEDIA_TRACKING.periods,
    period: "monthly",
    filters: MEDIA_TRACKING.filters,
    notes: MEDIA_TRACKING.notes,
    table: MEDIA_TRACKING.table,
    assistant: LITE_ASSISTANT,
    assistantOpen: false,
    prompt: "",
  },
  argTypes: {
    period: enumProp(mediaTrackingPeriods, "monthly", bi("Active report period. The tab changes. The static table does not filter.", "当前报表周期。标签会切换。静态表不会筛选。"), "inline-radio"),
    assistantOpen: { control: "boolean", description: bi("Set true to open the lite assistant.", "设为 true 时打开轻量助手。") },
    prompt: { control: "text", description: bi("Initial assistant composer text.", "助手输入框的初始文字。") },
    onNavigate: { action: "onNavigate", description: bi("The function runs when Back or a nav link opens another page. The result has `href`.", "Back 或导航要打开另一页时，会调用这个函数。结果里有 `href`。") },
    onPeriodChange: { action: "onPeriodChange", description: bi("The function runs when the user selects a period tab. The result has `id` and `label`.", "用户选择周期标签时，会调用这个函数。结果里有 `id` 和 `label`。") },
    onFilterChange: { action: "onFilterChange", description: bi("The function runs at each filter change. The result has `name` and `value`.", "每个筛选每次变化都会调用这个函数。结果里有 `name` 和 `value`。") },
    onOpenAssistant: { action: "onOpenAssistant", description: bi("The function runs when the user opens the assistant. The result has `reason: \"open\"`.", "用户打开助手时，会调用这个函数。结果里的 `reason` 是 `\"open\"`。") },
    onCloseAssistant: { action: "onCloseAssistant", description: bi("The function runs when the user closes the assistant. The result has `reason`.", "用户关闭助手时，会调用这个函数。结果里有 `reason`。") },
    onPromptChange: { action: "onPromptChange", description: bi("The function runs at each change in the composer. The result has `name` and `value`.", "输入框每次变化都会调用这个函数。结果里有 `name` 和 `value`。") },
    onSubmit: { action: "onSubmit", description: bi("The function runs when the user sends a prompt. The result has `prompt`.", "用户发送提示时，会调用这个函数。结果里有 `prompt`。") },
    onSuggestion: { action: "onSuggestion", description: bi("The function runs when the user selects a suggestion. The result has `prompt`.", "用户选择一条建议时，会调用这个函数。结果里有 `prompt`。") },
    onNewSession: { action: "onNewSession", description: bi("The function runs when the user starts a new chat.", "用户开始新对话时，会调用这个函数。") },
    onMaximize: { action: "onMaximize", description: bi("The function runs when the user expands or restores the assistant. The result has `expanded`.", "用户展开或还原助手时，会调用这个函数。结果里有 `expanded`。") },
    onHistory: { action: "onHistory", description: bi("The function runs when the user opens or closes Recent Chats. The result has `open`.", "用户打开或关闭 Recent Chats 时，会调用这个函数。结果里有 `open`。") },
    onHistorySelect: { action: "onHistorySelect", description: bi("The function runs when the user selects a recent chat. The result has `label` and `prompt`.", "用户选择一条最近对话时，会调用这个函数。结果里有 `label` 和 `prompt`。") },
    onAttach: { action: "onAttach", description: bi("The function runs after the user picks files in Upload File. The result has `names`.", "用户在 Upload File 里选完文件后，会调用这个函数。结果里有 `names`。") },
    onSelectSkill: { action: "onSelectSkill", description: bi("The function runs when the user selects a skill. The result has `type` and `title`. `id` is present when the skill has one.", "用户选择一项技能时，会调用这个函数。结果里有 `type` 和 `title`。技能有 `id` 时，结果里也会带上。") },
    onClearSkill: { action: "onClearSkill", description: bi("The function runs when the user clears the selected skill.", "用户清除已选技能时，会调用这个函数。") },
    onSkillAction: { action: "onSkillAction", description: bi("The function runs when the user starts a model action. The result has `action`: `\"history\"` or `\"manual\"`.", "用户启动一项建模操作时，会调用这个函数。结果里的 `action` 是 `\"history\"` 或 `\"manual\"`。") },
    onFlowSave: { action: "onFlowSave", description: bi("The function runs when the user saves a model draft. The result has `values`.", "用户保存模型草稿时，会调用这个函数。结果里有 `values`。") },
    onFlowSubmit: { action: "onFlowSubmit", description: bi("The function runs when the user submits a model. The result has `values`.", "用户提交模型时，会调用这个函数。结果里有 `values`。") },
  },
  render: function MediaTrackingStory(args) {
    return <MediaTrackingDetailPage {...useMediaTrackingDemo(args)} />;
  },
};

// Interactions establish transient page states through the same callbacks a
// user reaches. The final selector makes every named story self-checking.
const playClicks = (expected, ...selectors) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  const frame = () => new Promise((resolve) => doc.defaultView.requestAnimationFrame(resolve));
  await frame();
  await frame();
  for (const selector of selectors) {
    let control;
    for (let i = 0; i < 40; i += 1) {
      control = doc.querySelector(selector);
      if (control) break;
      await frame();
    }
    if (!control) throw new Error(`Media Tracking control missing: ${selector}`);
    control.click();
    await frame();
  }
  let node;
  for (let i = 0; i < 40; i += 1) {
    node = doc.querySelector(expected);
    if (node && node.getBoundingClientRect().height > 0 && getComputedStyle(node).visibility !== "hidden") return;
    await frame();
  }
  throw new Error(`Media Tracking state not visible: ${expected}`);
};

const state = (name, args = {}, play) => ({
  ...MediaTrackingDetail,
  name,
  args: { ...MediaTrackingDetail.args, ...args },
  ...(play ? { play } : {}),
});
const open = { assistantOpen: true };
const modelMenu = [".mh-assistant__skill", ".mh-skill__category:nth-child(2)"];

export const MediaTrackingDetailDaily = state("Media Tracking Detail · Daily", { period: "daily" });
export const MediaTrackingDetailAssistantOpen = state("Media Tracking Detail · Assistant open", open);
export const MediaTrackingDetailAssistantAnswer = state(
  "Media Tracking Detail · Assistant answer",
  { ...open, prompt: "Summarize the latest media tracking performance." },
  playClicks(".mh-assistant__answer--simple", ".mh-assistant__send .mh-button"),
);
export const MediaTrackingDetailAssistantHistory = state("Media Tracking Detail · Recent chats", open, playClicks(".mh-assistant__history-pop", ".mh-assistant__history .mh-assistant__icon"));
export const MediaTrackingDetailAssistantHistoryFilled = state("Media Tracking Detail · Recent chat fills prompt", open, playClicks(".mh-assistant__send .mh-button:not([disabled])", ".mh-assistant__history .mh-assistant__icon", ".mh-assistant__history-item:first-child"));
export const MediaTrackingDetailAssistantMaximized = state("Media Tracking Detail · Assistant maximized", open, playClicks(".mh-assistant--expanded", "button[aria-label='Maximize']"));
export const MediaTrackingDetailAssistantSkills = state("Media Tracking Detail · Skill menu", open, playClicks(".mh-skill", ".mh-assistant__skill"));
export const MediaTrackingDetailAssistantSkillSearchEmpty = state("Media Tracking Detail · No matching models", open, async (context) => {
  await playClicks(".mh-skill__search input", ...modelMenu)(context);
  const doc = context.canvasElement.ownerDocument;
  const input = doc.querySelector(".mh-skill__search input");
  Object.getOwnPropertyDescriptor(doc.defaultView.HTMLInputElement.prototype, "value").set.call(input, "no matching model");
  input.dispatchEvent(new doc.defaultView.Event("input", { bubbles: true }));
  for (let i = 0; i < 40; i += 1) {
    if (doc.querySelector(".mh-skill__empty")?.getBoundingClientRect().height) return;
    await new Promise((resolve) => doc.defaultView.requestAnimationFrame(resolve));
  }
  throw new Error("Media Tracking no-results state did not appear");
});
export const MediaTrackingDetailAssistantSelectedSkill = state("Media Tracking Detail · Selected model", open, playClicks(".mh-assistant__chip", ...modelMenu, ".mh-skill__option:nth-child(2)"));
export const MediaTrackingDetailModelHistory = state("Media Tracking Detail · Model chat history", open, playClicks(".mh-flow__card--history", ...modelMenu, ".mh-skill__action:first-child"));
export const MediaTrackingDetailModelEmptySelection = state("Media Tracking Detail · Model requires a message", open, async (context) => {
  await MediaTrackingDetailModelHistory.play(context);
  const doc = context.canvasElement.ownerDocument;
  const selected = [...doc.querySelectorAll(".mh-flow__msg input:checked")];
  if (!selected.length) throw new Error("Media Tracking history has no selected messages");
  selected.forEach((input) => input.click());
  await playClicks(".mh-flow__error:not([hidden])", ".mh-flow__foot .mh-flow__btn--primary")(context);
  if (doc.querySelector(".mh-flow__msg input:checked")) throw new Error("Media Tracking history still has a selected message");
});
export const MediaTrackingDetailModelGenerated = state("Media Tracking Detail · Generated model", open, playClicks(".mh-flow__card--form", ...modelMenu, ".mh-skill__action:first-child", ".mh-flow__foot .mh-flow__btn--primary"));
export const MediaTrackingDetailModelManual = state("Media Tracking Detail · Manual model", open, playClicks(".mh-flow__card--form", ...modelMenu, ".mh-skill__action:nth-child(2)"));
export const MediaTrackingDetailModelManualError = state("Media Tracking Detail · Manual required fields", open, playClicks(".mh-flow__field-error", ...modelMenu, ".mh-skill__action:nth-child(2)", ".mh-flow__foot .mh-flow__btn--primary"));
