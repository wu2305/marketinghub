import { FileDropzone } from "./index.jsx";
import { callbackProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/File dropzone",
  component: FileDropzone,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("Clickable / drag-and-drop file target. Clicking opens the native file picker; dragover adds the `is-dragover` visual state; selecting or dropping a file calls `onSelect` with the file name. `fileName` switches the hint to the selected-file message.", "可点击或拖放的文件目标区。点击会打开系统文件选择器；拖入时加上 `is-dragover` 视觉状态；选择或放入文件会以文件名调用 `onSelect`。传入 `fileName` 后提示文字切换为已选文件的消息。"),
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
    title: prop("string", { defaultValue: "Click or drag a file to upload here", description: bi("Headline inside the dropzone.", "拖放区内的标题文字。") }),
    hint: prop("string", { description: bi("Hint line shown until a file is selected.", "未选择文件时显示的提示行。") }),
    selectedPrefix: prop("string", { defaultValue: "Selected:", description: bi("Prefix before the chosen file name.", "显示在所选文件名之前的前缀。") }),
    fileName: prop("string", { description: bi("Selected file name — switches the hint to the selected message.", "已选文件名；会将提示切换为已选择状态的消息。"), control: "text" }),
    accept: prop("string", { defaultValue: ".xlsx,.xls", description: bi("Native file-input accept list.", "原生文件输入的 accept 列表。") }),
    onSelect: callbackProp(
      "onSelect",
      "(file: { name: string }) => void",
      { name: "finance_pilot_city_2026Q3.xlsx" },
      bi("Fired when a file is picked or dropped; carries the file name.", "选中或放入文件时触发，携带文件名。"),
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
