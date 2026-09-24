import React from "react";
import { DATA_UPLOAD, SELF_SERVICE } from "../../content.js";
import { pageShell, useSynced } from "../../lib/story-helpers.js";
import { DataUploadPage } from "./index.jsx";

export default {
  title: "Pages",
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
    submitting: { control: "boolean" },
    bulkImportOpen: { control: "boolean" },
    onNavigate: { action: "onNavigate" },
    onOpenImport: { action: "onOpenImport" },
    onCloseImport: { action: "onCloseImport" },
    onSelectFile: { action: "onSelectFile" },
    onDownloadTemplate: { action: "onDownloadTemplate" },
    onSubmitForm: { action: "onSubmitForm" },
  },
  render: function DataUploadStory(args) {
    const [importOpen, setImportOpen] = useSynced(args.bulkImportOpen);
    const [submitting, setSubmitting] = useSynced(args.submitting);
    const [selectedFile, setSelectedFile] = useSynced(args.selectedFile);
    const submitTimer = React.useRef(null);
    React.useEffect(() => () => clearTimeout(submitTimer.current), []);
    return (
      <DataUploadPage
        {...args}
        bulkImportOpen={importOpen}
        submitting={submitting}
        selectedFile={selectedFile}
        onNavigate={args.onNavigate}
        onOpenImport={() => {
          setImportOpen(true);
          args.onOpenImport?.();
        }}
        onCloseImport={() => {
          setImportOpen(false);
          args.onCloseImport?.();
        }}
        onSelectFile={(file) => {
          setSelectedFile(file.name);
          args.onSelectFile?.(file);
        }}
        onDownloadTemplate={args.onDownloadTemplate}
        onSubmitForm={(values) => {
          clearTimeout(submitTimer.current);
          setSubmitting(true);
          submitTimer.current = setTimeout(() => setSubmitting(false), 1500);
          args.onSubmitForm?.(values);
        }}
      />
    );
  },
};
