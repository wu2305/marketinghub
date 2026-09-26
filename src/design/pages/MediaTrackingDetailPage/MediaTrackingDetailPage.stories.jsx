import { LITE_ASSISTANT, MEDIA_TRACKING } from "../../content.js";
import { useMediaTrackingDemo } from "../../demo/media-tracking-demo.js";
import { enumProp, pageShell } from "../../lib/story-helpers.js";
import { MediaTrackingDetailPage, mediaTrackingPeriods } from "./index.jsx";

export default {
  title: "Pages",
  component: MediaTrackingDetailPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: "Media Tracking's report and lite assistant. The private demo hook drives both these states and the standalone host." } },
  },
};

export const MediaTrackingDetail = {
  name: "Media Tracking Detail",
  args: {
    ...pageShell,
    current: "self-service",
    toolbar: MEDIA_TRACKING.toolbar,
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
    period: enumProp(mediaTrackingPeriods, "monthly", "Active report period; the source changes the tab without filtering the static table.", "inline-radio"),
    assistantOpen: { control: "boolean", description: "Initial lite assistant visibility." },
    prompt: { control: "text", description: "Initial assistant composer text." },
    onNavigate: { action: "onNavigate" },
    onPeriodChange: { action: "onPeriodChange" },
    onFilterChange: { action: "onFilterChange" },
    onOpenAssistant: { action: "onOpenAssistant" },
    onCloseAssistant: { action: "onCloseAssistant" },
    onPromptChange: { action: "onPromptChange" },
    onSubmit: { action: "onSubmit" },
    onSuggestion: { action: "onSuggestion" },
    onNewSession: { action: "onNewSession" },
    onMaximize: { action: "onMaximize" },
    onHistory: { action: "onHistory" },
    onHistorySelect: { action: "onHistorySelect" },
    onAttach: { action: "onAttach" },
    onSelectSkill: { action: "onSelectSkill" },
    onClearSkill: { action: "onClearSkill" },
    onSkillAction: { action: "onSkillAction" },
    onFlowSave: { action: "onFlowSave" },
    onFlowSubmit: { action: "onFlowSubmit" },
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
