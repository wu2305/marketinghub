import { ASSISTANT_SKILL_MENU, MODEL_FLOW, SELF_SERVICE, buildModelDraft } from "../../content.js";
import { buildSelfServiceAnswer, useSelfServiceDemo } from "../../demo/self-service-demo.js";
import { enumProp, pageShell, bi } from "../../lib/story-helpers.js";
import { SelfServicePage } from "./index.jsx";

export default {
  title: "Pages",
  component: SelfServicePage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi("This page is Self-Service Center. It has Analysis and Data Upload tabs. To build this page, set the header image area, the tabs, the filter pills, and the action cards. Upload cards can open an upload-history dialog. Set `tab` to show Analysis or Data Upload. Set `onOpen` when a card opens a destination. The assistant is one `assistant` object.", "这是 Self-Service Center 页面。它有 Analysis 和 Data Upload 两个标签。组合页面时，设置头图区、标签、筛选胶囊和入口卡片。上传卡片可以打开上传历史对话框。用 `tab` 显示 Analysis 或 Data Upload。卡片要打开目的地时，设置 `onOpen`。助手的内容放在一个 `assistant` 对象里。"),
      },
    },
  },
};

export const SelfService = {
  name: "Self-Service Center",
  args: {
    tab: "analysis",
    category: "all",
    ...pageShell,
    hero: SELF_SERVICE.hero,
    labels: SELF_SERVICE.labels,
    tabs: SELF_SERVICE.tabs,
    filters: SELF_SERVICE.filters,
    reports: SELF_SERVICE.reports,
    uploads: SELF_SERVICE.uploads,
    uploadHistory: SELF_SERVICE.uploadHistory,
    assistant: { ...SELF_SERVICE.assistant, skillMenu: ASSISTANT_SKILL_MENU, open: false, prompt: "" },
  },
  argTypes: {
    hrefFor: { control: false, description: bi("Set `hrefFor` to turn a route id into an href. The story and the host each supply this function.", "用 `hrefFor` 把路由 id 转成 href。故事和宿主各自提供这个函数。") },
    tab: enumProp(SELF_SERVICE.tabs.map(({ id }) => id), "analysis", bi("Active section. Values are analysis and upload.", "当前分区。取值是 analysis 和 upload。"), "inline-radio"),
    category: { control: "inline-radio", options: ["all", "dg", "dc"], description: bi("Active filter pill. `all` shows every card in the tab. In this story the arg sets the Analysis tab only. The Upload tab keeps its own filter, which starts at `all`.", "当前筛选胶囊。`all` 显示该标签下的全部卡片。本故事里这个 arg 只设置 Analysis 标签；Upload 标签有自己的筛选，初始为 `all`。") },
    onNavigate: { action: "onNavigate", description: bi("The function runs when a link opens another page. The result has `id`, `params`, and `href`.", "链接要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。") },
    onTabChange: { action: "onTabChange", description: bi("The function runs when the user selects Analysis or Data Upload. The result has `id` and `label`.", "用户选择 Analysis 或 Data Upload 时，会调用这个函数。结果里有 `id` 和 `label`。") },
    onCategoryChange: { action: "onCategoryChange", description: bi("The function runs when the user selects a filter pill. The result has `id` and `label`.", "用户选择筛选胶囊时，会调用这个函数。结果里有 `id` 和 `label`。") },
    onOpen: { action: "onOpen", description: bi("The function runs when a card opens a destination. The result has `title` and may have `href`.", "卡片要打开目的地时，会调用这个函数。结果里有 `title`，也可能有 `href`。") },
    onOpenHistory: { action: "onOpenHistory", description: bi("The function runs when the user opens upload history. The result has `item`.", "用户打开上传历史时，会调用这个函数。结果里有 `item`。") },
    onCloseHistory: { action: "onCloseHistory", description: bi("The function runs when the user closes upload history. The result has `reason`.", "用户关闭上传历史时，会调用这个函数。结果里有 `reason`。") },
    onPreviewFile: { action: "onPreviewFile", description: bi("The function runs when the user previews a history file. The result is the row.", "用户预览历史上的文件时，会调用这个函数。结果就是该行。") },
    onDownloadFile: { action: "onDownloadFile", description: bi("The function runs when the user downloads a history file. The result is the row.", "用户下载历史上的文件时，会调用这个函数。结果就是该行。") },
    assistant: { control: "object", description: bi("Assistant copy, state, and callbacks. Launch, submit, and skill actions run in `useSelfServiceDemo`.", "助手的文案、状态和回调。启动、提交和技能操作由 `useSelfServiceDemo` 执行。") },
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

export const SelfServiceDgReports = {
  ...SelfService,
  name: "Self-Service DG reports",
  play: async (context) => {
    const win = context.canvasElement.ownerDocument.defaultView;
    await new Promise((resolve) => win.requestAnimationFrame(() => win.requestAnimationFrame(resolve)));
    await playClicks(".mh-pills[aria-label='Filter reports'] button:nth-child(2)")(context);
  },
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
