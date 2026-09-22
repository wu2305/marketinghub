import {
  CategoryHeading,
  ColumnChart,
  DataTable,
  FilterPills,
  FormField,
  MetricStat,
  ProgressList,
  ScopeOption,
  SearchField,
  searchIconPositions,
  SectionHeading,
  SidebarItem,
  Suggestion,
  Tabs,
  ViewHeading,
} from "./molecules.jsx";
import { Button } from "./atoms.jsx";

export default { title: "Molecules" };

export const Search = {
  name: "Search field",
  args: { label: "Search dashboards", placeholder: "Search dashboards", value: "", size: "lg", variant: "field", icon: "end" },
  argTypes: {
    variant: { control: "inline-radio", options: ["field", "plain"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    icon: { control: "inline-radio", options: searchIconPositions },
    onChange: { action: "onChange" },
  },
  render: (args) => (
    <div style={{ width: args.variant === "plain" ? 520 : 360 }}>
      <SearchField {...args} />
    </div>
  ),
};

export const Signal = {
  name: "Metric stat",
  args: {
    label: "Report center",
    value: "12",
    caption: "governed reports ready to review",
    variant: "glass",
    accent: "gold",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["glass", "card"] },
    accent: { control: "select", options: ["gold", "green", "amber", "blue", "red"] },
  },
  render: (args) => (
    <div style={{ width: 240, padding: 12, background: args.variant === "glass" ? "#3a2a22" : "transparent" }}>
      <MetricStat {...args} />
    </div>
  ),
};

export const Heading = {
  name: "Section heading",
  args: {
    eyebrow: "Workspaces",
    title: "Enter the work that matters",
    description: "Start from execution, reports, or the knowledge behind every answer.",
  },
  render: (args) => <SectionHeading {...args} />,
};

export const Category = {
  name: "Category heading",
  args: { title: "D2C Insight" },
  render: (args) => <CategoryHeading {...args} />,
};

export const CampaignHeading = {
  name: "View heading",
  args: {
    eyebrow: "Campaign workspace / Overview",
    title: "Overview Dashboard",
    description: "Monitor automated media operations across accounts, plans, units, and creative assets.",
  },
  render: (args) => (
    <ViewHeading {...args}>
      <Button variant="primary" size="sm">Create Campaign Task</Button>
    </ViewHeading>
  ),
};

export const UnderlineTabs = {
  name: "Tabs",
  args: { value: "analysis", variant: "underline" },
  argTypes: {
    variant: { control: "inline-radio", options: ["underline", "segmented"] },
    value: { control: "select", options: ["analysis", "upload"] },
    onChange: { action: "onChange" },
  },
  render: (args) => (
    <Tabs
      {...args}
      label="Data view mode"
      items={[
        { id: "analysis", label: "Self-Service Analysis" },
        { id: "upload", label: "Data Upload" },
      ]}
    />
  ),
};

export const Pills = {
  name: "Filter pills",
  args: { value: "all" },
  argTypes: {
    value: { control: "inline-radio", options: ["all", "dg", "dc"] },
    onChange: { action: "onChange" },
  },
  render: (args) => (
    <FilterPills
      {...args}
      label="Filter reports"
      items={[
        { id: "all", label: "All" },
        { id: "dg", label: "DG" },
        { id: "dc", label: "DC" },
      ]}
    />
  ),
};

export const Field = {
  name: "Form field",
  args: {
    label: "Title",
    name: "title",
    value: "",
    placeholder: "Enter the business term title.",
    required: true,
    invalid: false,
    control: "text",
    hint: "",
  },
  argTypes: {
    control: { control: "inline-radio", options: ["text", "textarea", "select"] },
    onChange: { action: "onChange" },
  },
  render: (args) => (
    <div style={{ width: 420 }}>
      <FormField {...args} options={["Business Term", "Global Synonym"]} />
    </div>
  ),
};

export const AskSuggestion = {
  name: "Suggestion",
  args: { children: "What's the ROI trend across my active campaigns?" },
  argTypes: { children: { control: "text" }, onSelect: { action: "onSelect" } },
  render: (args) => <Suggestion {...args} />,
};

export const Scope = {
  name: "Scope option",
  args: { label: "Campaigns", pressed: false },
  argTypes: { onChange: { action: "onChange" } },
  render: (args) => <ScopeOption {...args} />,
};

export const Distribution = {
  name: "Progress list",
  render: () => (
    <div style={{ width: 460 }}>
      <ProgressList
        items={[
          { label: "Feed promotion", value: "282", percent: 86 },
          { label: "Search promotion", value: "43", percent: 24 },
          { label: "Full-site promotion", value: "16", percent: 10 },
        ]}
      />
    </div>
  ),
};

export const Objectives = {
  name: "Column chart",
  render: () => (
    <ColumnChart
      label="Marketing objective distribution"
      items={[
        { label: "Product seeding", value: "329", height: 88 },
        { label: "Direct seeding", value: "9", height: 11 },
        { label: "Lead capture", value: "3", height: 7 },
      ]}
    />
  ),
};

export const Accounts = {
  name: "Data table",
  render: () => (
    <DataTable
      caption="3 accounts shown"
      columns={[
        { key: "name", header: "Account Name" },
        { key: "feed", header: "Feed" },
        { key: "total", header: "Total Plans" },
      ]}
      rows={[
        { id: "1", name: "Coach_XHS_01", feed: "82", total: "99" },
        { id: "2", name: "Coach_XHS_02", feed: "61", total: "73" },
      ]}
    />
  ),
};

export const NavItem = {
  name: "Sidebar item",
  args: { label: "Overview", active: true, badge: "", count: "35" },
  argTypes: { onSelect: { action: "onSelect" } },
  render: (args) => (
    <div style={{ width: 240, background: "#f9f7f5" }}>
      <SidebarItem {...args} badge={args.badge || undefined} />
    </div>
  ),
};
