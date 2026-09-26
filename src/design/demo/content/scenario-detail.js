import { LOGO, NAV, LITE_ASSISTANT, MODEL_FLOW, buildLiteAssistantAnswer, buildModelDraft } from "../../content.js";
import { demoImage } from "../images.js";
import { REVIEW_CENTER } from "./review-center.js";

/** Source-visible copy. The content and record are supplied separately to the page. */
export const SCENARIO_DETAIL = {
  logo: LOGO,
  navigation: NAV,
  hero: {
    image: demoImage("assets/images/project-ottolv-tabby.png"),
    eyebrow: "KNOWLEDGE MANAGEMENT",
    title: "Scenario Detail",
    description: "View scenario structure, governance info, and preview example outputs.",
    summaryAria: "Scenario detail summary",
    stats: [
      { key: "status", label: "STATUS", caption: "current scenario state" },
      { key: "version", label: "VERSION", caption: "latest iteration" },
      { key: "likeRate", label: "LIKE RATE", caption: "user satisfaction" },
    ],
  },
  sidebar: REVIEW_CENTER.sidebar,
  labels: {
    navigationAria: "Knowledge navigation",
    categoriesAria: "Knowledge categories",
    tabsAria: "Scenario detail tabs",
    tabs: [
      { value: "content", label: "Knowledge Content" },
      { value: "related", label: "Related Objects" },
      { value: "ai-check", label: "AI Check" },
      { value: "usage", label: "Usage & Feedback" },
      { value: "version", label: "Version History" },
      { value: "activity", label: "Activity Log" },
    ],
    edit: "Edit Scenario",
    structure: [
      { key: "triggerWhen", label: "Trigger When", icon: "clock", tone: "when" },
      { key: "input", label: "Input", icon: "table", tone: "input" },
      { key: "logic", label: "Analysis Logic", icon: "bulb", tone: "logic" },
      { key: "output", label: "Output", icon: "arrow-left", tone: "output" },
      { key: "boundary", label: "Boundary", icon: "warning", tone: "boundary" },
    ],
    governance: "Governance Info",
    userFallback: "Marketing Strategy Team",
    governanceFields: [
      { key: "knowledgeId", label: "Knowledge ID", icon: "file" },
      { key: "owner", label: "Owner", icon: "user" },
      { key: "source", label: "Source", icon: "layers" },
      { key: "version", label: "Version", icon: "clock" },
      { key: "reviewStatus", label: "Review Status", icon: "check-circle" },
      { key: "usageCount", label: "Usage Count", icon: "chart" },
      { key: "accuracy", label: "Accuracy Score", icon: "file-text" },
      { key: "updated", label: "Last Updated", icon: "clock" },
      { key: "user", label: "User", icon: "user" },
    ],
    preview: "Preview Example Output",
    showPreview: "Show Preview",
    hidePreview: "Hide Preview",
    exampleQuestion: "Example Question",
    usageLink: "Used in {reports} Reports / {scenarios} Scenarios",
    relatedTitle: "Related Objects",
    related: [
      { id: "report-city-invest", title: "Invest City Strategy Analysis", kind: "Report", routeId: "cockpit", href: "reports.html", icon: "table" },
      { id: "metric-city-performance", title: "City Media Performance", kind: "Metric", routeId: "cockpit", href: "reports.html", icon: "chart" },
      { id: "knowledge-city-context", title: "City Strategy Report Context", kind: "Knowledge", routeId: "interpreter", href: "knowledge.html", icon: "file-text" },
      { id: "knowledge-weekly-readout", title: "Weekly City Performance Readout", kind: "Playbook", routeId: "interpreter", href: "knowledge.html", icon: "layers" },
    ],
    aiCheck: {
      title: "AI Review",
      status: "AI Checked — Analysis Scenario",
      completeness: "Completeness",
      score: "8 / 10 fields",
      percent: 80,
      fields: [
        { label: "Scenario Name", state: "filled" },
        { label: "Trigger When", state: "filled" },
        { label: "Input Definition", state: "filled" },
        { label: "Analysis Logic", state: "filled" },
        { label: "Output Format", state: "filled" },
        { label: "Boundary Conditions", state: "filled" },
        { label: "Owner Assignment", state: "filled" },
        { label: "Usage Tracking", state: "filled" },
        { label: "Review Cycle", state: "missing" },
        { label: "Deprecation Policy", state: "missing" },
      ],
    },
    usage: {
      title: "Usage & Feedback",
      fields: [
        { label: "Total Calls", value: "386 / 30 days", icon: "chart" },
        { label: "Like Rate", value: "89%", icon: "heart" },
        { label: "Used in Reports", value: "42", icon: "file-text" },
        { label: "Used in Scenarios", value: "6", icon: "grid-four" },
      ],
    },
    version: {
      title: "Version History",
      items: [
        { version: "v1.3", title: "Added anomaly detection step", meta: "Updated 2026-07-11 by Marketing Analytics", status: "Published", current: true },
        { version: "v1.2", title: "Expanded city coverage to 15 cities", meta: "Updated 2026-06-28 by Marketing Analytics", status: "Published" },
        { version: "v1.1", title: "Added boundary conditions", meta: "Updated 2026-06-15 by Marketing Analytics", status: "Published" },
        { version: "v1.0", title: "Initial scenario creation", meta: "Created 2026-06-01 by Marketing Analytics", status: "Published" },
      ],
    },
    activity: [
      { initials: "MA", title: "Scenario updated to v1.3", detail: "Added anomaly detection step to analysis logic", time: "2026-07-11" },
      { initials: "MA", title: "AI review passed", detail: "Completeness score: 8/10, No conflicts found", time: "2026-07-10" },
      { initials: "MA", title: "Scenario updated to v1.2", detail: "Expanded city coverage from 10 to 15 cities", time: "2026-06-28" },
      { initials: "MA", title: "Scenario published", detail: "Initial version v1.0 released to production", time: "2026-06-01" },
    ],
  },
};

export const SCENARIO_DETAIL_SHELL = {
  assistant: { ...LITE_ASSISTANT, launcherLabel: "AI Interpreter" },
  answerFor: buildLiteAssistantAnswer,
  modelFlow: MODEL_FLOW,
  modelDraftFor: buildModelDraft,
};
