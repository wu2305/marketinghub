import { FileDropzone } from "./index.jsx";
import { callbackProp, prop, useSynced } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/File dropzone",
  component: FileDropzone,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Clickable / drag-and-drop file target. Clicking opens the native file picker; dragover adds the `is-dragover` visual state; selecting or dropping a file calls `onSelect` with the file name. `fileName` switches the hint to the selected-file message.",
      },
    },
  },
  args: {
    title: "Click or drag a file to upload here",
    hint: "Supports .xlsx and .xls files only",
    selectedPrefix: "Selected:",
    accept: ".xlsx,.xls",
  },
  argTypes: {
    title: prop("string", { defaultValue: "Click or drag a file to upload here", description: "Headline inside the dropzone." }),
    hint: prop("string", { description: "Hint line shown until a file is selected." }),
    selectedPrefix: prop("string", { defaultValue: "Selected:", description: "Prefix before the chosen file name." }),
    fileName: prop("string", { description: "Selected file name — switches the hint to the selected message.", control: "text" }),
    accept: prop("string", { defaultValue: ".xlsx,.xls", description: "Native file-input accept list." }),
    onSelect: callbackProp(
      "onSelect",
      "(file: { name: string }) => void",
      { name: "finance_pilot_city_2026Q3.xlsx" },
      "Fired when a file is picked or dropped; carries the file name.",
    ),
  },
  render: function FileDropzoneStory(args) {
    const [fileName, setFileName] = useSynced(args.fileName);
    return (
      <div style={{ padding: 24, maxWidth: 480 }}>
        <FileDropzone
          {...args}
          fileName={fileName}
          onSelect={(file) => {
            setFileName(file.name);
            args.onSelect?.(file);
          }}
        />
      </div>
    );
  },
};

export const Default = {};
