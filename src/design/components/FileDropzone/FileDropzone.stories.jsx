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
          bi("This component is a file target. The user can click it or drop a file on it. A click opens the file picker. A drag over the target adds the `is-dragover` state. When the user selects or drops a file, `onSelect` runs. The result has `name`. Set `fileName` to show the selected-file message.\n\n**When to use.** Use this component when the user must pick a file to upload. The component only sends the file name. The page decides what to do with the file. **Used in:** Data Upload.", "这个组件是文件投放区。用户可以点击，也可以把文件拖进去。点击会打开文件选择器。拖到投放区时会加上 `is-dragover` 状态。用户选中或放入文件时，会调用 `onSelect`。结果里带有 `name`。设置 `fileName` 后，提示会改成已选文件的消息。\n\n**何时使用。** 需要用户选择文件上传时使用。组件只发出文件名，如何处理由页面决定。**使用位置：** Data Upload。"),
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
    title: prop("string", { defaultValue: "Click or drag a file to upload here", description: bi("Headline inside the dropzone.", "投放区内的标题文字。") }),
    hint: prop("string", { description: bi("Hint line shown until a file is selected.", "未选择文件时显示的提示行。") }),
    selectedPrefix: prop("string", { defaultValue: "Selected:", description: bi("Text before the chosen file name.", "显示在所选文件名之前的文字。") }),
    fileName: prop("string", { description: bi("Selected file name. Set this to show the selected-file message.", "已选文件名。设置后会显示已选文件的消息。"), control: "text" }),
    accept: prop("string", { defaultValue: ".xlsx,.xls", description: bi("HTML file-input accept list.", "HTML 文件输入的 accept 列表。") }),
    onSelect: callbackProp(
      "onSelect",
      "(file: { name: string }) => void",
      { name: "finance_pilot_city_2026Q3.xlsx" },
      bi("The function runs when the user picks or drops a file. The result has `name`. The result does not include the file object.", "用户选中或放入文件时会调用这个函数。结果里带有 `name`。结果里没有文件对象。"),
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
