import { ReportDetailsDrawer } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Organisms/Report details drawer",
  component: ReportDetailsDrawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Report details drawer: right-side panel with thumbnail, meta, knowledge pills and the report's AI analysis scenarios. Internal state (fullscreen, selected scenario, view-more expansion) resets per `resetKey`.",
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
