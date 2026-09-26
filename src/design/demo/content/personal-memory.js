import { LOGO, NAV, LITE_ASSISTANT, MODEL_FLOW, buildLiteAssistantAnswer, buildModelDraft } from "../../content.js";
import { assetUrl } from "../../asset-url.js";
import { PERSONAL_MEMORY_RECORDS } from "./personal-memory-records.js";

/** Visible P14 copy and deterministic source records for stories and host. */
export const PERSONAL_MEMORY = {
  hero: { image: assetUrl("assets/images/knowledge-hero.jpg"), eyebrow: "KNOWLEDGE MANAGEMENT", title: "Personal Memory", description: "Manage your personal memories with AI assistance and easy retrieval." },
  sidebar: [
    { id: "interpreter", icon: "book-open", label: "Knowledge Management", href: "knowledge.html" },
    { id: "review-center", icon: "check-circle", label: "Review Center", href: "review-center.html" },
    { id: "scenario-library", icon: "grid-four", label: "Skill Library", href: "scenario-library.html" },
    { id: "feedback-quality", icon: "star-outline", label: "Feedback & Quality", href: "feedback-quality.html" },
  ],
  categories: [
    { value: "all", label: "All" },
    { value: "analysis", label: "Analysis Preference", tag: "Analysis", avatar: "purple" },
    { value: "meeting", label: "Data Interpretation", tag: "Meeting Notes", avatar: "gold" },
    { value: "findings", label: "Presentation Preference", tag: "Key Findings", avatar: "pink" },
    { value: "reference", label: "Others", tag: "Reference", avatar: "teal" },
  ],
  labels: {
    navigationAria: "Knowledge navigation", categoriesAria: "Knowledge categories", listAria: "Personal memories", detailAria: "Memory details",
    bannerTitle: "AI-powered Memory Assistant", bannerDescription: "AI will automatically organize and summarize your memories for quick retrieval and deeper insights.", closeBanner: "Close AI banner",
    newMemory: "New Memory", emptyList: "No memories in this category", emptyListPrompt: "Add your first memory", emptyDetail: "Select a memory to view details",
    moreActions: "More actions", edit: "Edit", delete: "Delete", description: "Description", source: "Source", updated: "Last Updated", used: "Used",
    share: "Share to Public Library", deleteMemory: "Delete Memory", title: "Title", cancel: "Cancel", saveChanges: "Save Changes", justNow: "Just now",
    createEyebrow: "New Memory", createTitle: "Create a new personal memory", closeCreate: "Close create panel", category: "Category", titlePlaceholder: "Enter memory title...", descriptionPlaceholder: "Describe your memory...", autoFill: "AI Auto-fill", saveMemory: "Save Memory", cannotBeEmpty: "Cannot be empty", personalSource: "Personal Memory", never: "Never",
    deleteTitle: "Delete Memory", deleteBefore: "Are you sure you want to delete \"", deleteAfter: "\"? This action cannot be undone.",
  },
  records: PERSONAL_MEMORY_RECORDS,
};

export const PERSONAL_MEMORY_SHELL = { logo: LOGO, navigation: NAV, assistant: LITE_ASSISTANT, modelFlow: MODEL_FLOW, answerFor: buildLiteAssistantAnswer, modelDraftFor: buildModelDraft };
