import { DATA_UPLOAD, SELF_SERVICE } from "../../content.js";
import { useDataUploadDemo } from "../../demo/data-upload-demo.js";
import { callbackProp, pageShell, prop } from "../../lib/story-helpers.js";
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
  parameters: { layout: "fullscreen" },
};

export const DataUpload = {
  name: "Data Upload",
  args: {
    ...pageShell,
    hero: SELF_SERVICE.hero,
    toolbar: DATA_UPLOAD.toolbar,
    fields: DATA_UPLOAD.fields,
    bulkImport: DATA_UPLOAD.bulkImport,
    submitLabel: "Submit",
    submittingLabel: "Submitted",
    submitting: false,
    bulkImportOpen: false,
    selectedFile: undefined,
  },
  argTypes: {
    submitting: prop("boolean", { control: "boolean", defaultValue: false, description: "Source 1500ms submit feedback; the demo hook restores false." }),
    bulkImportOpen: prop("boolean", { control: "boolean", defaultValue: false, description: "Template Import dialog visibility." }),
    selectedFile: prop("string | undefined", { control: "text", description: "Selected file name displayed in the dropzone." }),
    onNavigate: callbackProp("onNavigate", "({ href: string }) => void", { href: "/assets/pages/flexible.html?tab=upload" }),
    onOpenImport: callbackProp("onOpenImport", "({ label: string }) => void", { label: "Template Import" }),
    onCloseImport: callbackProp("onCloseImport", "({ reason: string }) => void", { reason: "escape" }),
    onSelectFile: callbackProp("onSelectFile", "({ name: string }) => void", { name: "city-sales.xlsx" }),
    onDownloadTemplate: callbackProp("onDownloadTemplate", "({ href: string }) => void", { href: "#" }),
    onSubmitForm: callbackProp("onSubmitForm", "({ values: Record<string, string> }) => void", { values: { year: "2026" } }),
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
