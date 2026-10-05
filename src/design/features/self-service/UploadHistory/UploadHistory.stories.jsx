import { UploadHistory } from "./index.jsx";
import { SELF_SERVICE } from "../../../content.js";
import { useSynced, bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Self-Service/Upload history",
  component: UploadHistory,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          bi("This component is the upload history dialog on Self-Service Center. It uses Modal. When `rows` has items, it shows a table with File Name, Uploader, Upload Time, and Action. Each row has Preview and Download. When `rows` is empty, it shows `emptyMessage`.", "这是 Self-Service Center 上的上传历史对话框。它使用 Modal。`rows` 有内容时，显示 File Name、Uploader、Upload Time 和 Action 表格。每行有 Preview 和 Download。`rows` 为空时显示 `emptyMessage`。"),
      },
    },
  },
  args: {
    open: true,
    title: SELF_SERVICE.uploadHistory.title,
    rows: SELF_SERVICE.uploads[0].history,
    emptyMessage: SELF_SERVICE.uploadHistory.emptyMessage,
  },
  argTypes: {
    open: { control: "boolean" },
    onClose: { action: "onClose" },
    onPreview: { action: "onPreview" },
    onDownload: { action: "onDownload" },
  },
  render: function UploadHistoryStory(args) {
    const [open, setOpen] = useSynced(args.open);
    return (
      <UploadHistory
        {...args}
        open={open}
        onClose={(event) => {
          setOpen(false);
          args.onClose?.(event);
        }}
      />
    );
  },
};

export const Default = {};
