import { ASSISTANT_SKILL_MENU, MODEL_FLOW, SELF_SERVICE, buildModelDraft } from "../../content.js";
import { buildSelfServiceAnswer, useSelfServiceDemo } from "../../demo/self-service-demo.js";
import { enumProp, pageShell } from "../../lib/story-helpers.js";
import { SelfServicePage } from "./index.jsx";

export default {
  title: "Pages",
  component: SelfServicePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export const SelfService = {
  name: "Self-Service Center",
  args: {
    tab: "analysis",
    category: "all",
    ...pageShell,
    hero: SELF_SERVICE.hero,
    tabs: SELF_SERVICE.tabs,
    filters: SELF_SERVICE.filters,
    reports: SELF_SERVICE.reports,
    uploads: SELF_SERVICE.uploads,
    uploadHistory: SELF_SERVICE.uploadHistory,
    assistant: { ...SELF_SERVICE.assistant, skillMenu: ASSISTANT_SKILL_MENU, open: false, prompt: "" },
  },
  argTypes: {
    tab: enumProp(SELF_SERVICE.tabs.map(({ id }) => id), "analysis", "Active Self-Service section.", "inline-radio"),
    category: { control: "inline-radio", options: ["all", "dg", "dc"] },
    onNavigate: { action: "onNavigate" },
    onTabChange: { action: "onTabChange" },
    onCategoryChange: { action: "onCategoryChange" },
    onOpen: { action: "onOpen" },
    onOpenHistory: { action: "onOpenHistory" },
    onCloseHistory: { action: "onCloseHistory" },
    onPreviewFile: { action: "onPreviewFile" },
    onDownloadFile: { action: "onDownloadFile" },
    assistant: { control: "object", description: "Grouped AssistantPanel content, state and callback contract; launch, submit and skill actions run in useSelfServiceDemo." },
  },
  render: function SelfServiceStory(args) {
    const props = useSelfServiceDemo({
      ...args,
      demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, answerFor: buildSelfServiceAnswer },
    });
    return <SelfServicePage {...props} />;
  },
};

export const SelfServiceAssistant = {
  ...SelfService,
  name: "Self-Service assistant",
  args: { ...SelfService.args, assistant: { ...SelfService.args.assistant, open: true } },
};

export const SelfServiceAssistantAnswer = {
  ...SelfService,
  name: "Self-Service assistant answer",
  args: {
    ...SelfService.args,
    assistant: {
      ...SelfService.args.assistant,
      open: true,
      answers: [buildSelfServiceAnswer("Compare channel performance for the last 3 campaigns and identify top performers.")],
    },
  },
};

// Storybook runs these same visible controls that a user reaches from the page.
// This keeps transient menu and overlay states inspectable without expanding
// the page component's public props for Storybook alone.
const playClicks = (...selectors) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  for (const selector of selectors) {
    const control = doc.querySelector(selector);
    if (!control) throw new Error(`Self-Service story control missing: ${selector}`);
    control.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};

export const SelfServiceUpload = {
  ...SelfService,
  name: "Self-Service data upload",
  args: { ...SelfService.args, tab: "upload" },
};

export const SelfServiceUploadHistory = {
  ...SelfServiceUpload,
  name: "Self-Service upload history",
  play: async (context) => {
    await playClicks(".mh-page__cards--upload .mh-action-card__history")(context);
    if (!context.canvasElement.ownerDocument.querySelector(".mh-modal .mh-upload-history__table")) {
      throw new Error("Self-Service upload history did not open");
    }
  },
};

export const SelfServiceAssistantHistory = {
  ...SelfServiceAssistant,
  name: "Self-Service assistant recent chats",
  play: playClicks(".mh-assistant__history .mh-assistant__icon"),
};

export const SelfServiceAssistantHistoryFilled = {
  ...SelfServiceAssistant,
  name: "Self-Service assistant history fills prompt",
  play: playClicks(".mh-assistant__history .mh-assistant__icon", ".mh-assistant__history-item:first-child"),
};

export const SelfServiceAssistantMaximized = {
  ...SelfServiceAssistant,
  name: "Self-Service assistant maximized",
  play: playClicks("button[aria-label='Maximize AI Interpreter panel']"),
};

export const SelfServiceAssistantSkillMenu = {
  ...SelfServiceAssistant,
  name: "Self-Service assistant skills",
  play: playClicks(".mh-assistant__skill"),
};

export const SelfServiceAssistantSkillSearch = {
  ...SelfServiceAssistant,
  name: "Self-Service assistant skill search empty",
  play: async (context) => {
    await playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)")(context);
    const input = context.canvasElement.ownerDocument.querySelector(".mh-skill__search input");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, "no matching model");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  },
};

export const SelfServiceAssistantSelectedSkill = {
  ...SelfServiceAssistant,
  name: "Self-Service assistant selected model",
  play: playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)", ".mh-skill__option:nth-child(2)"),
};

export const SelfServiceAssistantModelHistory = {
  ...SelfServiceAssistant,
  name: "Self-Service assistant model from chats",
  play: playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)", ".mh-skill__action:first-child"),
};

export const SelfServiceAssistantModelEmptySelection = {
  ...SelfServiceAssistantModelHistory,
  name: "Self-Service assistant model requires a message",
  play: async (context) => {
    await SelfServiceAssistantModelHistory.play(context);
    const doc = context.canvasElement.ownerDocument;
    const selected = [...doc.querySelectorAll(".mh-flow__msg input:checked")];
    if (selected.length === 0) throw new Error("Model history story has no selected messages");
    selected.forEach((input) => input.click());
    await playClicks(".mh-flow__foot .mh-flow__btn--primary")(context);
  },
};

export const SelfServiceAssistantModelGenerated = {
  ...SelfServiceAssistant,
  name: "Self-Service assistant generated model",
  play: playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)", ".mh-skill__action:first-child", ".mh-flow__foot .mh-flow__btn--primary"),
};

export const SelfServiceAssistantModelManual = {
  ...SelfServiceAssistant,
  name: "Self-Service assistant manual model",
  play: playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)", ".mh-skill__action:nth-child(2)"),
};

export const SelfServiceAssistantModelError = {
  ...SelfServiceAssistantModelManual,
  name: "Self-Service assistant model required fields",
  play: playClicks(".mh-assistant__skill", ".mh-skill__category:nth-child(2)", ".mh-skill__action:nth-child(2)", ".mh-flow__foot .mh-flow__btn--primary"),
};

export const SelfServiceAssistantFeedback = {
  ...SelfServiceAssistantAnswer,
  name: "Self-Service assistant helpful feedback",
  play: playClicks(".mh-assistant__feedback button[data-kind='helpful']"),
};
