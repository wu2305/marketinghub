export default [
  {
    id: "p04-data-upload",
    original: {
      url: "/assets/pages/data-upload.html",
      actions: [{ click: "#dataUploadForm .submit-btn" }],
      expect: [
        { sel: "#dataUploadForm .submit-btn", text: "Submitted" },
        { sel: ".data-upload-form-card" },
        { sel: ".form-grid", text: "Sales LY" },
      ],
    },
    story: {
      id: "pages--data-upload",
      actions: [{ click: ".mh-upload__form .mh-button--gold" }],
      expect: [
        { sel: ".mh-upload__form .mh-button--gold", text: "Submitted" },
        { sel: ".mh-upload__card" },
        { sel: ".mh-upload__grid", text: "Sales LY" },
      ],
    },
  },
  {
    id: "p04-data-upload-import",
    original: {
      url: "/assets/pages/data-upload.html",
      actions: [
        { click: "#bulkImportBtn" },
        { wait: "#bulkImportModal:not([hidden])" },
      ],
      expect: [
        { sel: "#bulkImportModal", text: "Template Import" },
        { sel: ".bulk-import-dropzone-title", text: "Click or drag a file to upload here" },
        { sel: ".bulk-import-template-link", text: "Download template" },
        { sel: ".bulk-import-tips", text: "500,000" },
      ],
    },
    story: {
      id: "pages--data-upload",
      actions: [
        { click: ".mh-upload__toolbar .mh-button--secondary" },
        { wait: ".mh-modal .mh-dropzone" },
      ],
      expect: [
        { sel: ".mh-modal", text: "Template Import" },
        { sel: ".mh-dropzone__title", text: "Click or drag a file to upload here" },
        { sel: ".mh-bulk-import__template", text: "Download template" },
        { sel: ".mh-bulk-import__tips", text: "500,000" },
      ],
    },
  },
  {
    id: "p04-data-upload-close",
    original: {
      url: "/assets/pages/data-upload.html",
      actions: [
        { click: "#bulkImportBtn" },
        { wait: "#bulkImportModal:not([hidden])" },
        { press: ["body", "Escape"] },
      ],
      expect: [
        { sel: "#bulkImportModal", state: "hidden" },
        { sel: "h1", text: "Self-Service Center" },
      ],
    },
    story: {
      id: "pages--data-upload",
      args: { bulkImportOpen: true },
      actions: [
        { wait: ".mh-modal .mh-dropzone" },
        { press: ["body", "Escape"] },
      ],
      expect: [
        { sel: ".mh-modal", state: "detached" },
        { sel: "#storybook-root h1", text: "Self-Service Center" },
      ],
    },
  },
  {
    id: "p04-data-upload-drop",
    original: {
      url: "/assets/pages/data-upload.html",
      actions: [
        { click: "#bulkImportBtn" },
        { wait: "#bulkImportModal:not([hidden])" },
        {
          upload: [
            "#bulkImportFile",
            { name: "city-sales.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", content: "demo" },
          ],
        },
      ],
      expect: [{ sel: ".bulk-import-dropzone-hint", text: "Selected: city-sales.xlsx" }],
    },
    story: {
      id: "pages--data-upload",
      args: { bulkImportOpen: true },
      actions: [
        { wait: ".mh-modal .mh-dropzone" },
        { click: ".mh-dropzone" },
        {
          upload: [
            ".mh-dropzone__input",
            { name: "city-sales.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", content: "demo" },
          ],
        },
      ],
      expect: [{ sel: ".mh-dropzone__hint", text: "Selected: city-sales.xlsx" }],
    },
  }
];
