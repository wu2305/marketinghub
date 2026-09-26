import { CAMPAIGN, MODEL_FLOW, buildModelDraft } from "../../content.js";
import { useCampaignDemo } from "../../demo/campaign-demo.js";
import { enumProp, pageShell } from "../../lib/story-helpers.js";
import { CampaignPage, campaignChannels, campaignSections } from "./index.jsx";

export default {
  title: "Pages",
  component: CampaignPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

const args = {
  ...pageShell,
  section: "overview",
  channel: "rednote",
  query: "",
  assistantOpen: false,
  prompt: "",
  assistant: CAMPAIGN.assistant,
  rail: CAMPAIGN.rail,
  channels: CAMPAIGN.channels,
  metrics: CAMPAIGN.metrics,
  distribution: CAMPAIGN.distribution,
  objectives: CAMPAIGN.objectives,
  accountColumns: CAMPAIGN.accountColumns,
  accountRows: CAMPAIGN.accountRows,
  headings: CAMPAIGN.headings,
  panels: CAMPAIGN.panels,
  executionSummary: CAMPAIGN.executionSummary,
  taskQueue: CAMPAIGN.taskQueue,
  actionLog: CAMPAIGN.actionLog,
  creativeColumns: CAMPAIGN.creativeColumns,
  creatives: CAMPAIGN.creatives,
  efficiency: CAMPAIGN.efficiency,
  recommendations: CAMPAIGN.recommendations,
  bindingColumns: CAMPAIGN.bindingColumns,
  accounts: CAMPAIGN.accounts,
  taskDialog: CAMPAIGN.taskDialog,
  taskDialogOpen: false,
  toast: { open: false, message: "" },
};

export const Campaign = {
  name: "RedNote Campaign Tool",
  args,
  argTypes: {
    section: enumProp(campaignSections, "overview", "Active campaign workspace section"),
    channel: enumProp(campaignChannels, "rednote", "Source channel; Douyin remains disabled"),
    assistantOpen: { control: "boolean" },
    taskDialogOpen: { control: "boolean" },
    taskDraft: { control: "object", description: "Controlled task values retained when the dialog closes and reopens." },
    assistant: { control: "object", description: "Assistant content; the demo hook owns answer, skill and model state." },
    onNavigate: { action: "onNavigate" },
    onSectionChange: { action: "onSectionChange" },
    onChannelChange: { action: "onChannelChange" },
    onQueryChange: { action: "onQueryChange" },
    onFilter: { action: "onFilter" },
    onReset: { action: "onReset" },
    onCreateTask: { action: "onCreateTask" },
    onBindAccount: { action: "onBindAccount" },
    onTaskDraftChange: { action: "onTaskDraftChange" },
    onCloseTask: { action: "onCloseTask" },
    onSubmitTask: { action: "onSubmitTask" },
    onOpenAssistant: { action: "onOpenAssistant" },
    onCloseAssistant: { action: "onCloseAssistant" },
    onPromptChange: { action: "onPromptChange" },
    onSubmit: { action: "onSubmit" },
    onSuggestion: { action: "onSuggestion" },
    onNewSession: { action: "onNewSession" },
    onMaximize: { action: "onMaximize" },
    onHistorySelect: { action: "onHistorySelect" },
    onFeedback: { action: "onFeedback" },
    onAttach: { action: "onAttach" },
    onSelectSkill: { action: "onSelectSkill" },
    onClearSkill: { action: "onClearSkill" },
    onSkillAction: { action: "onSkillAction" },
    onFlowSave: { action: "onFlowSave" },
    onFlowSubmit: { action: "onFlowSubmit" },
  },
  render: function CampaignStory(storyArgs) {
    const props = useCampaignDemo({
      ...storyArgs,
      demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, toasts: CAMPAIGN.toasts },
    });
    return <CampaignPage {...props} />;
  },
};

const sectionStory = (section, name) => ({
  ...Campaign,
  name,
  args: { ...args, section },
});

export const CampaignExecution = sectionStory("execution", "Campaign execution");
export const CampaignAssets = sectionStory("assets", "Creative assets");
export const CampaignAnalytics = sectionStory("analytics", "Campaign analytics");
export const CampaignAccounts = sectionStory("accounts", "Account binding");

export const CampaignAccountFiltered = {
  ...Campaign,
  name: "Filtered account operations",
  args: { ...args, query: "Coach_XHS_02" },
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll(".mh-campaign__table tbody tr");
    if (rows.length !== 1 || !rows[0].textContent.includes("Coach_XHS_02")) throw new Error("Campaign account filter did not show the selected account");
  },
};

export const CampaignAccountEmpty = {
  ...Campaign,
  name: "No matching account operations",
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    await new Promise((resolve) => doc.defaultView.requestAnimationFrame(() => doc.defaultView.requestAnimationFrame(resolve)));
    const input = doc.querySelector(".mh-campaign__tools input");
    if (!input) throw new Error("Campaign account search is missing");
    Object.getOwnPropertyDescriptor(doc.defaultView.HTMLInputElement.prototype, "value").set.call(input, "no matching account");
    input.dispatchEvent(new doc.defaultView.Event("input", { bubbles: true }));
    for (let attempt = 0; attempt < 50; attempt += 1) {
      if (doc.querySelector(".mh-campaign__table")?.textContent.includes("0 accounts shown") && !doc.querySelector(".mh-campaign__table tbody tr")) return;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    throw new Error("Campaign account search did not show the empty result");
  },
};

async function click(doc, selector, index = 0) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const target = doc.querySelectorAll(selector)[index];
    if (target) {
      target.click();
      await new Promise((resolve) => setTimeout(resolve, 0));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`Campaign story control missing: ${selector} [${index}]`);
}

async function expectState(doc, selector) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (doc.querySelector(selector)) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`Campaign story state missing: ${selector}`);
}

function play(steps, expected) {
  return async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    // Let mount effects settle before dispatching a user action.
    await new Promise((resolve) => doc.defaultView.requestAnimationFrame(() => doc.defaultView.requestAnimationFrame(resolve)));
    for (const step of steps) {
      const [selector, index] = Array.isArray(step) ? step : [step, 0];
      await click(doc, selector, index);
    }
    await expectState(doc, expected);
  };
}

export const CampaignTaskDialog = {
  ...CampaignExecution,
  name: "Create campaign task",
  play: play([".mh-heading--view .mh-button--primary"], ".mh-task-dialog__form"),
};

export const CampaignTaskSubmitted = {
  ...CampaignExecution,
  name: "Campaign task submitted",
  play: play([".mh-heading--view .mh-button--primary", ".mh-task-dialog__footer .mh-button--primary"], ".mh-toast:not([hidden])"),
};

const assistantStory = (name) => ({
  ...Campaign,
  name,
  args: { ...args, assistantOpen: true },
});

export const CampaignAssistantOpen = assistantStory("Campaign assistant open");

export const CampaignAssistantAnswer = {
  ...assistantStory("Campaign assistant answer"),
  play: play([".mh-assistant__suggestions button"], ".mh-assistant__answer--workspace"),
};

export const CampaignAssistantFeedback = {
  ...assistantStory("Campaign assistant helpful feedback"),
  play: play([".mh-assistant__suggestions button", ".mh-assistant__feedback button[data-kind='helpful']"], ".mh-assistant__feedback button[data-kind='helpful'][aria-pressed='true']"),
};

export const CampaignAssistantHistory = {
  ...assistantStory("Campaign assistant recent chats"),
  play: play(["button[aria-label='History']"], ".mh-assistant__history-pop"),
};

export const CampaignAssistantHistoryFilled = {
  ...assistantStory("Campaign assistant history fills prompt"),
  play: async (context) => {
    await play(["button[aria-label='History']", [".mh-assistant__history-item", 0]], ".mh-assistant__box textarea")(context);
    const doc = context.canvasElement.ownerDocument;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      if (doc.querySelector(".mh-assistant__box textarea")?.value === "Why did campaign ROI decline last week?") return;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    throw new Error("Campaign history did not fill the composer");
  },
};

export const CampaignAssistantMaximized = {
  ...assistantStory("Campaign assistant maximized"),
  play: play(["button[aria-label='Maximize AI Interpreter panel']"], ".mh-assistant--expanded"),
};

export const CampaignAssistantSkills = {
  ...assistantStory("Campaign assistant skill menu"),
  play: play([".mh-assistant__skill"], ".mh-skill"),
};

export const CampaignAssistantSelectedSkill = {
  ...assistantStory("Campaign assistant selected model"),
  play: play([".mh-assistant__skill", [".mh-skill__category", 1], [".mh-skill__option", 1]], ".mh-assistant__chip"),
};

const modelSteps = [".mh-assistant__skill", [".mh-skill__category", 1]];

export const CampaignAssistantSkillSearchEmpty = {
  ...assistantStory("Campaign assistant skill search empty"),
  play: async (context) => {
    await play(modelSteps, ".mh-skill__search input")(context);
    const doc = context.canvasElement.ownerDocument;
    const input = doc.querySelector(".mh-skill__search input");
    Object.getOwnPropertyDescriptor(doc.defaultView.HTMLInputElement.prototype, "value").set.call(input, "no matching model");
    input.dispatchEvent(new doc.defaultView.Event("input", { bubbles: true }));
    await expectState(doc, ".mh-skill__empty");
    if (doc.querySelectorAll(".mh-skill__option").length) throw new Error("Campaign skill search still has matching options");
  },
};

export const CampaignModelHistory = {
  ...assistantStory("Campaign model from chat history"),
  play: play([...modelSteps, [".mh-skill__action", 0]], ".mh-flow__card--history"),
};

export const CampaignModelEmptySelection = {
  ...assistantStory("Campaign model requires a selected message"),
  play: async (context) => {
    await CampaignModelHistory.play(context);
    const doc = context.canvasElement.ownerDocument;
    doc.querySelectorAll(".mh-flow__msg input:checked").forEach((input) => input.click());
    await click(doc, ".mh-flow__foot .mh-flow__btn--primary");
    await expectState(doc, ".mh-flow__error:not([hidden])");
    if (!doc.querySelector(".mh-flow__card--history")) throw new Error("Campaign model history closed after empty Generate");
  },
};

export const CampaignModelGenerated = {
  ...assistantStory("Campaign generated model"),
  play: play([...modelSteps, [".mh-skill__action", 0], ".mh-flow__foot .mh-flow__btn--primary"], ".mh-flow__card--form"),
};

export const CampaignModelManual = {
  ...assistantStory("Campaign manual model form"),
  play: async (context) => {
    await play([...modelSteps, [".mh-skill__action", 1]], ".mh-flow__card--form")(context);
    const doc = context.canvasElement.ownerDocument;
    if (!doc.querySelector(".mh-flow__card--form header strong")?.textContent.includes("Create Analytical Model Manually") || doc.querySelector(".mh-flow__field-error")) {
      throw new Error("Campaign manual form did not open before validation");
    }
  },
};

export const CampaignModelManualError = {
  ...assistantStory("Campaign manual model required fields"),
  play: play([...modelSteps, [".mh-skill__action", 1], ".mh-flow__foot .mh-flow__btn--primary"], ".mh-flow__field-error"),
};
