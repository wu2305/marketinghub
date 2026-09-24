import { UploadHistory } from "./index.jsx";
import { SELF_SERVICE } from "../../../content.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Self-Service/Upload history",
  component: UploadHistory,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Upload-history dialog: table of file/uploader/time rows with per-row Preview and Download actions, or an empty-state message. Built on Modal.",
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
