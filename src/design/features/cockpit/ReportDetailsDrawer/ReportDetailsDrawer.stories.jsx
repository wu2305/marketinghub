import { ReportDetailsDrawer } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { useSynced, bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Cockpit/Report details drawer",
  component: ReportDetailsDrawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("This component is the report details drawer on Marketing Cockpit. It shows a thumbnail, meta, knowledge pills, and AI analysis scenarios. The first three scenarios are visible. The user can click view more to show the rest. Fullscreen, the selected scenario, and view more reset when `resetKey` changes. The function `onClose` runs when the drawer closes. The function `onOpenLive` runs when the user clicks Open Dashboard.", "这是 Marketing Cockpit 上的报表详情抽屉。它显示缩略图、元信息、知识标签和 AI 分析场景。默认可见前三个场景。用户点击 view more 会显示其余场景。全屏、选中场景和 view more 会在 `resetKey` 变化时重置。抽屉关闭时会调用 `onClose`。用户点击 Open Dashboard 时会调用 `onOpenLive`。"),
      },
    },
  },
  args: { open: true },
  argTypes: {
    open: { control: "boolean" },
    onClose: { action: "onClose" },
    onOpenLive: { action: "onOpenLive" },
  },
  render: function ReportDetailsDrawerStory(args) {
    const [open, setOpen] = useSynced(args.open);
    const report = COCKPIT.projects.city.reports[0];
    return (
      <div style={{ minHeight: 480, background: "#f3f5f7" }}>
        <ReportDetailsDrawer
          {...args}
          open={open}
          onClose={(event) => {
            setOpen(false);
            args.onClose?.(event);
          }}
          projectLabel={COCKPIT.projects.city.title}
          image={COCKPIT.projects.city.image}
          imageAlt="City Strategy report preview"
          hierarchy={`${COCKPIT.projects.city.category} / ${COCKPIT.projects.city.title} / ${report.type}`}
          title={report.title}
          explanation={report.description}
          meta={[
            { label: "Owner", value: report.owner },
            { label: "Cadence", value: report.cadence },
            { label: "Updated", value: report.updated },
          ]}
          sections={COCKPIT.detailsSections}
          scenarios={report.recommendations.map((item) => ({ title: item.title, meta: item.meta }))}
          liveHref="/assets/pages/reports.html?project=city&dashboard=0&view=live"
          resetKey="city:0"
        />
      </div>
    );
  },
};

export const Default = {};
