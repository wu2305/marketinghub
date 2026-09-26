import React from "react";

/**
 * Local data-upload.html flow for Storybook and standalone hosts. The source
 * flashes Submitted for 1500ms, while the import dialog and selected file
 * remain local until the user changes them.
 * @param {object} props DataUploadPage content, initial state and callbacks
 * @returns {object} fully wired DataUploadPage props
 */
export function useDataUploadDemo(props) {
  const [bulkImportOpen, setBulkImportOpen] = React.useState(Boolean(props.bulkImportOpen));
  const [submitting, setSubmitting] = React.useState(Boolean(props.submitting));
  const [selectedFile, setSelectedFile] = React.useState(props.selectedFile);
  const submitTimer = React.useRef(null);

  React.useEffect(() => setBulkImportOpen(Boolean(props.bulkImportOpen)), [props.bulkImportOpen]);
  React.useEffect(() => setSubmitting(Boolean(props.submitting)), [props.submitting]);
  React.useEffect(() => setSelectedFile(props.selectedFile), [props.selectedFile]);
  React.useEffect(() => () => clearTimeout(submitTimer.current), []);

  return {
    ...props,
    bulkImportOpen,
    submitting,
    selectedFile,
    onOpenImport: (event) => {
      setBulkImportOpen(true);
      props.onOpenImport?.(event);
    },
    onCloseImport: (event) => {
      setBulkImportOpen(false);
      props.onCloseImport?.(event);
    },
    onSelectFile: (file) => {
      setSelectedFile(file.name);
      props.onSelectFile?.(file);
    },
    onSubmitForm: ({ values }) => {
      clearTimeout(submitTimer.current);
      setSubmitting(true);
      submitTimer.current = setTimeout(() => setSubmitting(false), 1500);
      props.onSubmitForm?.({ values });
    },
  };
}
