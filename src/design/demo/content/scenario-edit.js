import { LOGO, NAV, LITE_ASSISTANT, MODEL_FLOW, buildLiteAssistantAnswer, buildModelDraft } from "../../content.js";
import { demoImage } from "../images.js";

/** The twelve visible source report choices retain their original destination parameters. */
export const SCENARIO_EDIT_REPORTS = [
  ["Invest City Strategy Analysis", "city", 0],
  ["City Analysis Dashboard", "city", 1],
  ["4P Executive Overview", "fourp", 0],
  ["Promotion Lift Analysis", "fourp", 1],
  ["Customer Daily Pulse", "customer", 0],
  ["Customer Funnel Watch", "customer", 1],
  ["Audience Build Overview", "abo", 0],
  ["Campaign Quality Watch", "abo", 1],
  ["Rednote Media Tracking", "rednote", 0],
  ["Creative Quality Monitor", "rednote", 1],
  ["OTT / OLV Exposure Tracking", "ottolv", 0],
  ["Source Integrity Monitor", "ottolv", 1],
].map(([label, project, dashboard]) => ({ label, value: label, project, dashboard, href: `reports.html?project=${project}&dashboard=${dashboard}` }));

export const SCENARIO_EDIT = {
  hero: {
    image: demoImage("assets/images/project-ottolv-tabby.png"),
    eyebrow: "KNOWLEDGE MANAGEMENT",
    title: "Edit Scenario",
    description: "Edit scenario structure, preview example output, and manage governance.",
    asideLabel: "Edit scenario summary",
    stats: [
      { key: "status", label: "STATUS", value: "Draft", caption: "unsaved changes" },
      { key: "version", label: "VERSION", value: "v1.4", caption: "next iteration" },
      { key: "check", label: "AI CHECK", value: "Pending", caption: "awaiting review" },
    ],
  },
  sidebar: [
    { id: "interpreter", icon: "book-open", label: "Knowledge Management", href: "knowledge.html" },
    { id: "review-center", icon: "check-circle", label: "Review Center", href: "review-center.html" },
    { id: "scenario-library", icon: "grid-four", label: "Skill Library", href: "scenario-library.html" },
    { id: "feedback-quality", icon: "star-outline", label: "Feedback & Quality", href: "feedback-quality.html" },
  ],
  scopes: ["Global", "Campaign", "Customer", "Audience", "Market"].map((value) => ({ value, label: value })),
  reports: SCENARIO_EDIT_REPORTS,
  attachments: ["City strategy brief.pdf", "sample-dashboard.png"],
  attachmentAccept: ".doc,.docx,.pdf,.ppt,.pptx,.png,.jpg,.jpeg,.webp",
  defaults: {
    name: "City Comparison Analysis",
    purpose: "Compare media investment performance across multiple cities to identify performance gaps, growth opportunities, and areas requiring further optimization.",
    scope: "Global",
    owner: "Sarah Chen",
    report: "Invest City Strategy Analysis",
    logic: "Unified Dimension → City Ranking → Metric Decomposition → Anomaly Detection → Driver Analysis",
    output: "City Performance Overview, Key Insights, Opportunity Recommendations",
    question: "Compare media investment performance between Shanghai and Beijing for Q2 2026",
  },
  labels: {
    navigationAria: "Knowledge navigation", categoriesAria: "Knowledge categories",
    formTitle: "Scenario Configuration", saved: "Auto-saved · Just now", name: "Scenario Name", namePlaceholder: "Enter scenario name...",
    purpose: "Purpose", purposePlaceholder: "Describe the scenario purpose...", scope: "Scope", owner: "Owner", ownerPlaceholder: "Enter owner...",
    structure: "Scenario Structure", report: "Report", selectReport: "Select a report", openReportPrefix: "Open ",
    logic: "Analysis Logic", logicPlaceholder: "Describe the analysis logic flow...", output: "Output", outputPlaceholder: "What output does this scenario produce?",
    autoFill: "AI Auto-fill", materials: "Reference Materials", upload: "Upload supporting files to guide the analysis", uploadHint: "Use screenshots and reference docs to show what kind of analysis is wanted.",
    preview: "Preview Example Output", runPreview: "Run Preview", question: "Example Question", questionPlaceholder: "Enter an example question to preview...",
    previewEmpty: "Please enter an example question first.",
    cancel: "Cancel", saveDraft: "Save Draft", submit: "Submit for Review", required: "Cannot be empty", submitted: "Scenario submitted for review successfully!",
  },
};

export const SCENARIO_EDIT_SHELL = { logo: LOGO, navigation: NAV, assistant: LITE_ASSISTANT, modelFlow: MODEL_FLOW, answerFor: buildLiteAssistantAnswer, modelDraftFor: buildModelDraft };
