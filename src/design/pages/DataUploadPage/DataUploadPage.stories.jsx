import { DATA_UPLOAD, SELF_SERVICE } from "../../content.js";
import { useDataUploadDemo } from "../../demo/data-upload-demo.js";
import { callbackProp, pageShell, prop, bi } from "../../lib/story-helpers.js";
import { DataUploadPage } from "./index.jsx";

const assertState = (selector, value) => async ({ canvasElement }) => {
  const node = canvasElement.ownerDocument.querySelector(selector);
  if (!node || (value && !node.textContent.includes(value))) {
    throw new Error(`Data Upload state missing: ${selector}${value ? ` containing ${value}` : ""}`);
  }
};

export default {
  title: "Pages",
  component: DataUploadPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: bi("This page is Data Upload. It sits under Self-Service Center. To build this page, set the header image area, the toolbar, the form fields, and the Template Import dialog. Submit disables the button and shows `submittingLabel`. The demo hook restores `submitting` after a short wait. Set `onSubmitForm` to receive the field values. Set `onOpenImport` to open Template Import.", "这是 Data Upload 页面，位于 Self-Service Center 之下。组合页面时，设置头图区、工具栏、表单字段和 Template Import 对话框。Submit 会禁用按钮，并显示 `submittingLabel`。demo hook 会在短暂等待后把 `submitting` 恢复为 false。用 `onSubmitForm` 接收字段值。用 `onOpenImport` 打开 Template Import。"),
      },
    },
  },
};

export const DataUpload = {
  name: "Data Upload",
  args: {
    ...pageShell,
    hero: SELF_SERVICE.hero,
    toolbar: DATA_UPLOAD.toolbar,
    fields: DATA_UPLOAD.fields,
    bulkImport: DATA_UPLOAD.bulkImport,
    submitLabel: DATA_UPLOAD.submitLabel,
    submittingLabel: DATA_UPLOAD.submittingLabel,
    submitting: false,
    bulkImportOpen: false,
    selectedFile: undefined,
  },
  argTypes: {
    submitting: prop("boolean", { control: "boolean", defaultValue: false, description: bi("Set true to show the submitted button state. The demo hook restores false after a short wait.", "设为 true 时显示已提交的按钮状态。demo hook 会在短暂等待后恢复为 false。") }),
    bulkImportOpen: prop("boolean", { control: "boolean", defaultValue: false, description: bi("Set true to open the Template Import dialog.", "设为 true 时打开 Template Import 对话框。") }),
    selectedFile: prop("string | undefined", { control: "text", description: bi("Selected file name shown in the dropzone.", "显示在拖放区中的已选文件名。") }),
    onNavigate: callbackProp("onNavigate", "({ href: string }) => void", { href: "/assets/pages/flexible.html?tab=upload" }, bi("The function runs when Back opens Self-Service Center. The result has `href`.", "点击 Back 打开 Self-Service Center 时，会调用这个函数。结果里有 `href`。")),
    onOpenImport: callbackProp("onOpenImport", "({ label: string }) => void", { label: "Template Import" }, bi("The function runs when the user opens Template Import. The result has `label`.", "用户打开 Template Import 时，会调用这个函数。结果里有 `label`。")),
    onCloseImport: callbackProp("onCloseImport", "({ reason: string }) => void", { reason: "escape" }, bi("The function runs when the user closes Template Import. The result has `reason`.", "用户关闭 Template Import 时，会调用这个函数。结果里有 `reason`。")),
    onSelectFile: callbackProp("onSelectFile", "({ name: string }) => void", { name: "city-sales.xlsx" }, bi("The function runs when the user picks a file. The result has `name`.", "用户选择文件时，会调用这个函数。结果里有 `name`。")),
    onDownloadTemplate: callbackProp("onDownloadTemplate", "({ href: string }) => void", { href: "#" }, bi("The function runs when the user downloads the template. The result has `href`.", "用户下载模板时，会调用这个函数。结果里有 `href`。")),
    onSubmitForm: callbackProp("onSubmitForm", "({ values: Record<string, string> }) => void", { values: { year: "2026" } }, bi("The function runs when the user submits the form. The result has `values`.", "用户提交表单时，会调用这个函数。结果里有 `values`。")),
  },
  render: function DataUploadStory(args) {
    const page = useDataUploadDemo(args);
    return <DataUploadPage {...page} />;
  },
};

export const DataUploadSubmitted = {
  ...DataUpload,
  name: "Data Upload · Submitted",
  args: { ...DataUpload.args, submitting: true },
  play: assertState(".mh-upload__form .mh-button--gold:disabled", "Submitted"),
};

export const DataUploadImportOpen = {
  ...DataUpload,
  name: "Data Upload · Template Import open",
  args: { ...DataUpload.args, bulkImportOpen: true },
  play: assertState(".mh-modal .mh-dropzone", "Click or drag a file"),
};

export const DataUploadImportFileSelected = {
  ...DataUpload,
  name: "Data Upload · Template file selected",
  args: { ...DataUpload.args, bulkImportOpen: true, selectedFile: "city-sales.xlsx" },
  play: assertState(".mh-modal .mh-dropzone__hint", "Selected: city-sales.xlsx"),
};
