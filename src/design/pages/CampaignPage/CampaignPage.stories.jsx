import { CAMPAIGN, MODEL_FLOW, buildModelDraft } from "../../content.js";
import { useCampaignDemo } from "../../demo/campaign-demo.js";
import { enumProp, pageShell, bi } from "../../lib/story-helpers.js";
import { CampaignPage, campaignChannels, campaignSections } from "./index.jsx";

export default {
  title: "Pages",
  component: CampaignPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi("This page is Campaign. It is the RedNote Campaign Tool. Five sections are overview, execution, assets, analytics, and accounts. A composing engineer sets the rail, the section data, the Create Campaign Task dialog, and the assistant. Set `section` to show one workspace. Set `channel` for the overview tabs. Douyin stays disabled. Set `onCreateTask` to open the task dialog. Set `onSubmitTask` when the user submits a task. The assistant is one `assistant` object.", "这是 Campaign 页面，也就是 RedNote Campaign Tool。五个分区是 overview、execution、assets、analytics 和 accounts。组合页面时，设置侧栏、各分区数据、Create Campaign Task 对话框和助手。用 `section` 显示一个工作区。用 `channel` 切换概览里的渠道标签。Douyin 保持禁用。用 `onCreateTask` 打开任务对话框。用户提交任务时，设置 `onSubmitTask`。助手的内容放在一个 `assistant` 对象里。"),
      },
    },
  },
};

const args = {
  ...pageShell,
  section: "overview",
  channel: "rednote",
  query: "",
  assistantOpen: false,
  prompt: "",
  assistant: CAMPAIGN.assistant,
  labels: CAMPAIGN.labels,
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
    section: enumProp(campaignSections, "overview", bi("Active campaign workspace. Values are overview, execution, assets, analytics, and accounts.", "当前的 Campaign 工作区。取值是 overview、execution、assets、analytics 和 accounts。")),
    channel: enumProp(campaignChannels, "rednote", bi("Source channel on overview. Douyin stays disabled.", "概览上的来源渠道。Douyin 保持禁用。")),
    assistantOpen: { control: "boolean", description: bi("Set true to open the assistant.", "设为 true 时打开助手。") },
    taskDialogOpen: { control: "boolean", description: bi("Set true to open the Create Campaign Task dialog.", "设为 true 时打开 Create Campaign Task 对话框。") },
    taskDraft: { control: "object", description: bi("Controlled task values. The values stay when the dialog closes and opens again.", "受控的任务值。对话框关闭后再打开，这些值仍会保留。") },
    assistant: { control: "object", description: bi("Assistant copy. The demo hook owns answer, skill, and model state.", "助手文案。回答、技能和模型状态由 demo hook 负责。") },
    onNavigate: { action: "onNavigate", description: bi("The function runs when a nav link opens another page. The result has `id`, `params`, and `href`.", "导航要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。") },
    onSectionChange: { action: "onSectionChange", description: bi("The function runs when the user selects a rail section. The result has `id` and `label`.", "用户选择侧栏分区时，会调用这个函数。结果里有 `id` 和 `label`。") },
    onChannelChange: { action: "onChannelChange", description: bi("The function runs when the user selects a channel tab. The result has `id` and `label`.", "用户选择渠道标签时，会调用这个函数。结果里有 `id` 和 `label`。") },
    onQueryChange: { action: "onQueryChange", description: bi("The function runs at each change in the account search. The result has `name` and `value`.", "账户搜索每次变化都会调用这个函数。结果里有 `name` 和 `value`。") },
    onFilter: { action: "onFilter", description: bi("The function runs when the user submits the account search. The result has `query`.", "用户提交账户搜索时，会调用这个函数。结果里有 `query`。") },
    onReset: { action: "onReset", description: bi("The function runs when the user resets the account search. The result has `reason: \"button\"`.", "用户重置账户搜索时，会调用这个函数。结果里的 `reason` 是 `\"button\"`。") },
    onCreateTask: { action: "onCreateTask", description: bi("The function runs when the user opens Create Campaign Task. The result has `reason: \"button\"`.", "用户打开 Create Campaign Task 时，会调用这个函数。结果里的 `reason` 是 `\"button\"`。") },
    onBindAccount: { action: "onBindAccount", description: bi("The function runs when the user starts Bind Account. The result has `reason: \"button\"`.", "用户启动 Bind Account 时，会调用这个函数。结果里的 `reason` 是 `\"button\"`。") },
    onTaskDraftChange: { action: "onTaskDraftChange", description: bi("The function runs at each change in the task dialog. The result has `name`, `value`, and the next full `draft`.", "任务对话框每次变化都会调用这个函数。结果里有 `name`、`value`，以及下一版完整的 `draft`。") },
    onCloseTask: { action: "onCloseTask", description: bi("The function runs when the user closes the task dialog. The result has `reason`.", "用户关闭任务对话框时，会调用这个函数。结果里有 `reason`。") },
    onSubmitTask: { action: "onSubmitTask", description: bi("The function runs when the user submits a task. The result has `action`, `platform`, `account`, and `object`.", "用户提交任务时，会调用这个函数。结果里有 `action`、`platform`、`account` 和 `object`。") },
    onOpenAssistant: { action: "onOpenAssistant", description: bi("The function runs when the user opens the assistant. The result has `reason: \"open\"`.", "用户打开助手时，会调用这个函数。结果里的 `reason` 是 `\"open\"`。") },
    onCloseAssistant: { action: "onCloseAssistant", description: bi("The function runs when the user closes the assistant. The result has `reason`.", "用户关闭助手时，会调用这个函数。结果里有 `reason`。") },
    onPromptChange: { action: "onPromptChange", description: bi("The function runs at each change in the composer. The result has `name` and `value`.", "输入框每次变化都会调用这个函数。结果里有 `name` 和 `value`。") },
    onSubmit: { action: "onSubmit", description: bi("The function runs when the user sends a prompt. The result has `prompt`.", "用户发送提示时，会调用这个函数。结果里有 `prompt`。") },
    onSuggestion: { action: "onSuggestion", description: bi("The function runs when the user selects a suggestion. The result has `prompt`.", "用户选择一条建议时，会调用这个函数。结果里有 `prompt`。") },
    onNewSession: { action: "onNewSession", description: bi("The function runs when the user starts a new chat.", "用户开始新对话时，会调用这个函数。") },
    onMaximize: { action: "onMaximize", description: bi("The function runs when the user expands or restores the assistant. The result has `expanded`.", "用户展开或还原助手时，会调用这个函数。结果里有 `expanded`。") },
    onHistorySelect: { action: "onHistorySelect", description: bi("The function runs when the user selects a recent chat. The result has `label` and `prompt`.", "用户选择一条最近对话时，会调用这个函数。结果里有 `label` 和 `prompt`。") },
    onFeedback: { action: "onFeedback", description: bi("The function runs when the user marks an answer. The result has `query` and `feedback`.", "用户给回答打标时，会调用这个函数。结果里有 `query` 和 `feedback`。") },
    onAttach: { action: "onAttach", description: bi("The function runs after the user picks files in Upload File. The result has `names`.", "用户在 Upload File 里选完文件后，会调用这个函数。结果里有 `names`。") },
    onSelectSkill: { action: "onSelectSkill", description: bi("The function runs when the user selects a skill. The result has `type` and `title`. `id` is present when the skill has one.", "用户选择一项技能时，会调用这个函数。结果里有 `type` 和 `title`。技能有 `id` 时，结果里也会带上。") },
    onClearSkill: { action: "onClearSkill", description: bi("The function runs when the user clears the selected skill.", "用户清除已选技能时，会调用这个函数。") },
    onSkillAction: { action: "onSkillAction", description: bi("The function runs when the user starts a model action. The result has `action`: `\"history\"` or `\"manual\"`.", "用户启动一项建模操作时，会调用这个函数。结果里的 `action` 是 `\"history\"` 或 `\"manual\"`。") },
    onFlowSave: { action: "onFlowSave", description: bi("The function runs when the user saves a model draft. The result has `values`.", "用户保存模型草稿时，会调用这个函数。结果里有 `values`。") },
    onFlowSubmit: { action: "onFlowSubmit", description: bi("The function runs when the user submits a model. The result has `values`.", "用户提交模型时，会调用这个函数。结果里有 `values`。") },
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
