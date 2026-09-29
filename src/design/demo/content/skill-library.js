import { demoImage } from "../images.js";
import { LOGO, NAV, LITE_ASSISTANT, MODEL_FLOW, buildLiteAssistantAnswer, buildModelDraft } from "../../content.js";
import { SKILL_AUTOFILL_TEXT } from "./skill-autofill.js";
import { SKILL_RECORDS } from "./skill-records.js";

/** Fields a scenario saved from the inline form starts with (the form itself collects name, purpose, scope, owner and the five structure fields). */
const DRAFT_DEFAULTS = {
  category: "", callCount: 0, callPeriod: "30 days", likeRate: 0, ownerAvatar: "", user: "", version: "v0.1", tags: [], updated: "Just now",
  knowledgeId: "-", source: "Team Created", reviewStatus: "Draft", accuracyScore: 0, usedInReports: 0, usedInScenarios: 0, previewOutput: "",
};

/** Private P15 fixture. Hero summary intentionally retains the source's six/1,353/89% copy. */
export const SKILL_LIBRARY = {
  hero: { image: demoImage("assets/images/knowledge-hero.jpg"), eyebrow: "KNOWLEDGE MANAGEMENT", title: "Skill Library", description: "A modular set of AI skills to decode marketing performance outputs into actionable business insights.", stats: [
    { label: "ACTIVE SCENARIOS", value: "6", caption: "published scenarios ready for use" },
    { label: "TOTAL CALLS", value: "1,353", caption: "invocations in the last 30 days" },
    { label: "AVG LIKE RATE", value: "89%", caption: "user satisfaction across scenarios" },
  ] },
  sidebar: [
    { id: "interpreter", icon: "book-open", label: "Knowledge Management", href: "knowledge.html" },
    { id: "review-center", icon: "check-circle", label: "Review Center", href: "review-center.html" },
    { id: "scenario-library", icon: "grid-four", label: "Skill Library", href: "scenario-library.html" },
    { id: "feedback-quality", icon: "star-outline", label: "Feedback & Quality", href: "feedback-quality.html" },
  ],
  labels: {
    summaryAria: "Scenario library summary", navigationAria: "Knowledge navigation", categoriesAria: "Knowledge categories",
    listAria: "Scenarios", searchAria: "Search scenarios", searchPlaceholder: "Search scenarios...", statusLabel: "Status", create: "Create New Scenario",
    statusOptions: [ { value: "all", label: "All statuses" }, { value: "Draft", label: "Draft" }, { value: "Under Review", label: "Under Review" }, { value: "In Development", label: "In Development" }, { value: "Published", label: "Published" } ],
    columns: ["Scenario Name", "Purpose", "Calls", "Like Rate", "Status", "Owner"],
    emptyTitle: "No matching scenarios", emptyHelp: "Change the status or search.", clearFilters: "Clear filters", scenarioSingular: "scenario", scenarioPlural: "scenarios",
    detailEyebrow: "SCENARIO DETAIL", detailTitle: "Scenario details", detailAria: "Selected scenario details", closeDetail: "Close scenario detail", governance: "Governance Info",
    governanceFields: [ { key: "knowledgeId", label: "Knowledge ID" }, { key: "owner", label: "Owner" }, { key: "source", label: "Source" }, { key: "version", label: "Version" }, { key: "reviewStatus", label: "Review Status" }, { key: "usageCount", label: "Usage Count" }, { key: "accuracyScore", label: "Accuracy Score" }, { key: "updated", label: "Last Updated" }, { key: "user", label: "User" } ],
    structure: "Scenario Structure", structureFields: [ { key: "triggerWhen", label: "Trigger When", icon: "clock", placeholder: "When should this scenario be triggered?" }, { key: "input", label: "Input", icon: "grid-four", placeholder: "What inputs does this scenario require?" }, { key: "logic", label: "Analysis Logic", icon: "lightbulb", placeholder: "Describe the analysis logic flow..." }, { key: "output", label: "Output", icon: "arrow-right", placeholder: "What output does this scenario produce?" }, { key: "boundary", label: "Boundary", icon: "alert-triangle", placeholder: "What are the boundary conditions?" } ],
    preview: "Preview Example Output", showPreview: "Show Preview", hidePreview: "Hide Preview", exampleQuestion: "Example Question", usagePrefix: "Used in", reports: "Reports", scenarios: "Scenarios", edit: "Edit Scenario", delete: "Delete",
    deleteDialog: { title: "Confirm Operation", message: "Please confirm whether to delete this knowledge. Deletion cannot be undone.", confirmLabel: "Confirm Delete", cancelLabel: "Cancel" }, deletedToast: "Deleted successfully",
    formTitle: "Scenario Configuration", autosaved: "Auto-saved · Just now", name: "Scenario Name", namePlaceholder: "Enter scenario name...", purpose: "Purpose", purposePlaceholder: "Describe the scenario purpose...", scope: "Scope", owner: "Owner", ownerPlaceholder: "Enter owner...", selectScope: "Select scope", scopeOptions: ["Global", "Campaign", "Customer", "Audience", "Market"], autoFill: "AI Auto-fill", runPreview: "Run Preview", cancel: "Cancel", saveDraft: "Save Draft", submit: "Submit for Review", submittedToast: "Submitted for review", draftSaved: "Draft saved", untitled: "Untitled scenario", autoFillText: SKILL_AUTOFILL_TEXT,
    questionPlaceholder: "Enter an example question to preview...", previewEmpty: "Please enter an example question first.",
  },
  draftDefaults: DRAFT_DEFAULTS,
  records: SKILL_RECORDS,
};

export const SKILL_LIBRARY_SHELL = {
  logo: LOGO, navigation: NAV, assistant: LITE_ASSISTANT, modelFlow: MODEL_FLOW,
  answerFor: buildLiteAssistantAnswer, modelDraftFor: buildModelDraft,
};
