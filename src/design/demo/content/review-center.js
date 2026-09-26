import { LOGO, NAV, LITE_ASSISTANT, MODEL_FLOW, buildLiteAssistantAnswer, buildModelDraft } from "../../content.js";
import { assetUrl } from "../../asset-url.js";

/** Source-backed P12 fixtures and visible copy for Storybook and the host. */
export const REVIEW_CENTER = {
  "hero": {
    "image": "assets/images/knowledge-hero.jpg",
    "eyebrow": "KNOWLEDGE MANAGEMENT",
    "title": "Review Center",
    "description": "Review and approve knowledge assets before they are published for AI use.",
    "stats": [
      {
        "key": "pending",
        "label": "PENDING REVIEW",
        "caption": "assets awaiting your approval"
      },
      {
        "key": "approved",
        "label": "APPROVED THIS WEEK",
        "caption": "assets published recently"
      },
      {
        "key": "rejected",
        "label": "REJECTED THIS WEEK",
        "caption": "assets sent back for revision"
      }
    ]
  },
  "sidebar": [
    {
      "id": "interpreter",
      "label": "Knowledge Management",
      "href": "knowledge.html"
    },
    {
      "id": "review-center",
      "label": "Review Center",
      "href": "review-center.html"
    },
    {
      "id": "scenario-library",
      "label": "Skill Library",
      "href": "scenario-library.html"
    },
    {
      "id": "feedback-quality",
      "label": "Feedback & Quality",
      "href": "feedback-quality.html"
    }
  ],
  "labels": {
    "summaryAria": "Review Center summary",
    "navigationAria": "Knowledge navigation",
    "categoriesAria": "Knowledge categories",
    "tabsAria": "Review tabs",
    "itemsAria": "Review items",
    "searchAria": "Search review items",
    "itemSingular": "item",
    "itemPlural": "items",
    "closeDetail": "Close review details",
    "closeReject": "Close reject panel",
    "tabs": {
      "pending": "Pending Review",
      "approved": "Approved"
    },
    "search": "Search review items...",
    "type": "Type",
    "submitted": "Submitted",
    "allTypes": "All types",
    "types": [
      "Principles",
      "Report Context",
      "Data Model",
      "Metric Dictionary",
      "Business Term",
      "Analytical Model"
    ],
    "timeOptions": [
      {
        "value": "all",
        "label": "All time"
      },
      {
        "value": "today",
        "label": "Today"
      },
      {
        "value": "week",
        "label": "This week"
      },
      {
        "value": "month",
        "label": "This month"
      }
    ],
    "columns": [
      "Knowledge Title",
      "Type",
      "Submitted By",
      "Submitted",
      "Status",
      "AI Check",
      "Actions"
    ],
    "emptyTitle": "No matching items",
    "emptyDescription": "Change the tab, filter, or search.",
    "reviewItem": "REVIEW ITEM",
    "submittedBy": "Submitted By",
    "status": "Status",
    "aiCheck": "AI Check",
    "warning": "Warning",
    "aiSuggestions": "AI Suggestions",
    "approve": "Approve",
    "reject": "Reject",
    "view": "View",
    "viewKnowledge": "View in Knowledge Base",
    "rejectReview": "Reject Review",
    "rejectPrefix": "Reject:",
    "restore": "Restore",
    "pending": "Pending",
    "approved": "Approved",
    "aiSuggestion": "AI Suggestion",
    "rejectionReason": "Rejection Reason",
    "rejectionPlaceholder": "Describe why this item is being rejected...",
    "cancel": "Cancel",
    "confirmReject": "Confirm Reject",
    "approveAnyway": "Approve Anyway",
    "warningTitle": "AI Warning Detected",
    "reviewingTitle": "AI Review In Progress",
    "warningMessage": "This item has an AI Warning. Approving it may introduce inaccurate or incomplete data into the knowledge base. Are you sure you want to proceed?",
    "reviewingMessage": "AI is still reviewing this item. The analysis may be incomplete. Approving now could result in publishing unverified content. Are you sure you want to proceed?"
  },
  "records": [
    {
      "id": "pending-1",
      "title": "Campaign investment decision principles",
      "summary": "Shared guardrails for evaluating investment pressure and conversion efficiency.",
      "type": "Principles",
      "mark": "PR",
      "source": "Shared",
      "submittedBy": "Sarah Chen",
      "submitterInitials": "",
      "submitted": "2 hours ago",
      "status": "pending",
      "aiCheck": "Reviewing",
      "stage": "solidify",
      "warning": "AI flagged potential accuracy and compliance concerns. Please review the linked reports and source data before approval. Approval may impact downstream metrics and dashboards."
    },
    {
      "id": "pending-2",
      "title": "City Strategy report context",
      "summary": "Purpose, audience, comparison logic for City Strategy reporting workspace.",
      "type": "Report Context",
      "mark": "RC",
      "source": "Shared",
      "submittedBy": "Emily Wang",
      "submitterInitials": "",
      "submitted": "Today",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "solidify"
    },
    {
      "id": "pending-3",
      "title": "Commerce performance model",
      "summary": "Governed daily model connecting channel, product, customer, price, promotion.",
      "type": "Data Model",
      "mark": "DM",
      "source": "Shared",
      "submittedBy": "Michael Liu",
      "submitterInitials": "",
      "submitted": "Yesterday",
      "status": "pending",
      "aiCheck": "Reviewing",
      "stage": "co-build"
    },
    {
      "id": "pending-4",
      "title": "Member conversion",
      "summary": "Share of identified member visits that result in a qualified transaction.",
      "type": "Metric Dictionary",
      "mark": "MT",
      "source": "Shared",
      "submittedBy": "Jessica Li",
      "submitterInitials": "",
      "submitted": "3 days ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "calibrate"
    },
    {
      "id": "pending-5",
      "title": "Weekly city performance readout",
      "summary": "Repeatable path for identifying material city movement and preparing narrative.",
      "type": "Analytical Model",
      "mark": "AP",
      "source": "Shared",
      "submittedBy": "Emily Wang",
      "submitterInitials": "",
      "submitted": "Today",
      "status": "pending",
      "aiCheck": "Reviewing",
      "stage": "solidify",
      "warning": "AI flagged potential accuracy and compliance concerns. Please review the linked reports and source data before approval. Approval may impact downstream metrics and dashboards."
    },
    {
      "id": "pending-6",
      "title": "4P performance context",
      "summary": "Approved interpretation of Place, Product, People, and Price movement.",
      "type": "Report Context",
      "mark": "RC",
      "source": "Shared",
      "submittedBy": "David Zhang",
      "submitterInitials": "",
      "submitted": "2 days ago",
      "status": "pending",
      "aiCheck": "Reviewing",
      "stage": "co-build"
    },
    {
      "id": "pending-7",
      "title": "ABO activation model",
      "summary": "Cross-platform campaign model joining audience packages and delivery.",
      "type": "Data Model",
      "mark": "DM",
      "source": "Shared",
      "submittedBy": "Michael Liu",
      "submitterInitials": "",
      "submitted": "4 hours ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "co-build"
    },
    {
      "id": "pending-8",
      "title": "Campaign ROI",
      "summary": "Attributed campaign revenue divided by governed media spend.",
      "type": "Metric Dictionary",
      "mark": "MT",
      "source": "Shared",
      "submittedBy": "James Brown",
      "submitterInitials": "",
      "submitted": "Yesterday",
      "status": "pending",
      "aiCheck": "Reviewing",
      "stage": "solidify",
      "warning": "AI flagged potential accuracy and compliance concerns. Please review the linked reports and source data before approval. Approval may impact downstream metrics and dashboards."
    },
    {
      "id": "pending-9",
      "title": "Effective traffic",
      "summary": "Visits that satisfy governed engagement and identity conditions.",
      "type": "Business Term",
      "mark": "BT",
      "source": "Shared",
      "submittedBy": "Jessica Li",
      "submitterInitials": "",
      "submitted": "Today",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "co-build"
    },
    {
      "id": "pending-10",
      "title": "Customer journey context",
      "summary": "Business intent, funnel stages, and known latency notes for customer reporting.",
      "type": "Report Context",
      "mark": "RC",
      "source": "Shared",
      "submittedBy": "Jessica Li",
      "submitterInitials": "",
      "submitted": "5 hours ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "solidify"
    },
    {
      "id": "pending-11",
      "title": "Rednote tracking model",
      "summary": "Content and media model covering creative, placement, engagement signals.",
      "type": "Data Model",
      "mark": "DM",
      "source": "Shared",
      "submittedBy": "Michael Liu",
      "submitterInitials": "",
      "submitted": "3 hours ago",
      "status": "pending",
      "aiCheck": "Reviewing",
      "stage": "co-build"
    },
    {
      "id": "pending-12",
      "title": "4P opportunity scan",
      "summary": "Structured sequence for separating 4P effects before prioritizing opportunity.",
      "type": "Analytical Model",
      "mark": "AP",
      "source": "Shared",
      "submittedBy": "David Zhang",
      "submitterInitials": "",
      "submitted": "Today",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "co-build"
    },
    {
      "id": "approved-1",
      "title": "Trusted analysis guardrails",
      "summary": "Minimum checks for freshness, metric consistency, and business context.",
      "type": "Principles",
      "mark": "PR",
      "source": "Shared",
      "submittedBy": "Linda Park",
      "submitterInitials": "",
      "submitted": "Yesterday",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "calibrate"
    },
    {
      "id": "approved-2",
      "title": "City media performance model",
      "summary": "Curated weekly city model joining investment, exposure, customer traffic.",
      "type": "Data Model",
      "mark": "DM",
      "source": "Shared",
      "submittedBy": "Michael Liu",
      "submitterInitials": "",
      "submitted": "2 days ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "calibrate"
    },
    {
      "id": "approved-3",
      "title": "Promotion lift",
      "summary": "Incremental performance versus approved baseline after controlling for channel.",
      "type": "Metric Dictionary",
      "mark": "MT",
      "source": "Shared",
      "submittedBy": "David Zhang",
      "submitterInitials": "",
      "submitted": "3 days ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "co-build"
    },
    {
      "id": "approved-4",
      "title": "Invested city",
      "summary": "A city included in approved paid media investment plan.",
      "type": "Business Term",
      "mark": "BT",
      "source": "Shared",
      "submittedBy": "Emily Wang",
      "submitterInitials": "",
      "submitted": "5 days ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "solidify"
    },
    {
      "id": "approved-5",
      "title": "Customer funnel drop review",
      "summary": "Investigation path for locating material funnel loss.",
      "type": "Analytical Model",
      "mark": "AP",
      "source": "Shared",
      "submittedBy": "Jessica Li",
      "submitterInitials": "",
      "submitted": "Yesterday",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "solidify"
    },
    {
      "id": "approved-6",
      "title": "ABO campaign quality context",
      "summary": "Business intent for audience build, campaign quality, and ROI movement.",
      "type": "Report Context",
      "mark": "RC",
      "source": "Shared",
      "submittedBy": "Rachel Kim",
      "submitterInitials": "",
      "submitted": "4 days ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "co-build"
    },
    {
      "id": "approved-7",
      "title": "OTT and OLV reach model",
      "summary": "Campaign-level exposure model for impressions and deduplicated reach.",
      "type": "Data Model",
      "mark": "DM",
      "source": "Shared",
      "submittedBy": "Michael Liu",
      "submitterInitials": "",
      "submitted": "Today",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "calibrate"
    },
    {
      "id": "approved-8",
      "title": "Qualified reach rate",
      "summary": "Qualified deduplicated audience reach divided by governed target audience.",
      "type": "Metric Dictionary",
      "mark": "MT",
      "source": "Shared",
      "submittedBy": "Tom Anderson",
      "submitterInitials": "",
      "submitted": "2 days ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "solidify"
    },
    {
      "id": "approved-9",
      "title": "Quality reach",
      "summary": "Qualified audience reach after applying viewability and frequency rules.",
      "type": "Business Term",
      "mark": "BT",
      "source": "Shared",
      "submittedBy": "Rachel Kim",
      "submitterInitials": "",
      "submitted": "6 days ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "co-build"
    },
    {
      "id": "approved-10",
      "title": "Campaign anomaly review",
      "summary": "Investigation sequence for separating true movement from delayed data.",
      "type": "Analytical Model",
      "mark": "AP",
      "source": "Shared",
      "submittedBy": "James Brown",
      "submitterInitials": "",
      "submitted": "3 days ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "calibrate"
    },
    {
      "id": "approved-11",
      "title": "Rednote reporting context",
      "summary": "Campaign, content, audience notes for Rednote media performance.",
      "type": "Report Context",
      "mark": "RC",
      "source": "Shared",
      "submittedBy": "Rachel Kim",
      "submitterInitials": "",
      "submitted": "Yesterday",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "co-build"
    },
    {
      "id": "approved-12",
      "title": "Source integrity review",
      "summary": "Repeatable checks for freshness, completeness, campaign mapping.",
      "type": "Analytical Model",
      "mark": "AP",
      "source": "Shared",
      "submittedBy": "Linda Park",
      "submitterInitials": "",
      "submitted": "Today",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "calibrate"
    },
    {
      "id": "approved-13",
      "title": "OTT and OLV measurement context",
      "summary": "Measurement scope and deduplication assumptions for OTT and OLV.",
      "type": "Report Context",
      "mark": "RC",
      "source": "Shared",
      "submittedBy": "Tom Anderson",
      "submitterInitials": "",
      "submitted": "2 days ago",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "solidify"
    },
    {
      "id": "approved-14",
      "title": "Personal campaign notes",
      "summary": "Personal observations and decision cues from recent campaign reviews.",
      "type": "Personal Memory",
      "mark": "ME",
      "source": "Personal",
      "submittedBy": "Ryan Miller",
      "submitterInitials": "",
      "submitted": "Today",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "co-build"
    },
    {
      "id": "approved-15",
      "title": "Morning performance routine",
      "summary": "Preferred order for reviewing city movement and customer conversion.",
      "type": "Personal Memory",
      "mark": "ME",
      "source": "Personal",
      "submittedBy": "Ryan Miller",
      "submitterInitials": "",
      "submitted": "Yesterday",
      "status": "approved",
      "aiCheck": "Pass",
      "stage": "solidify"
    }
  ],
  "suggestions": {
    "pending-1": [
      "The investment pressure thresholds are not aligned with the latest Q3 governance framework.",
      "Conversion efficiency benchmarks reference an outdated fiscal year.",
      "Consider adding a cross-channel consistency check before approval."
    ],
    "pending-3": [
      "Data lineage for the customer segment is incomplete.",
      "Promotion mapping table has not been validated since last schema change.",
      "AI review is still in progress — manual verification recommended."
    ],
    "pending-5": [
      "City movement narrative lacks a defined statistical significance threshold.",
      "The repeatable path references a deprecated reporting template.",
      "Consider adding automated anomaly detection as a prerequisite."
    ],
    "pending-6": [
      "AI review is still in progress — manual verification recommended.",
      "4P interpretation may conflict with the latest product taxonomy update.",
      "Business Planning sign-off is missing from the approval chain."
    ],
    "pending-8": [
      "Attribution window definition differs from the current media governance policy.",
      "Governed media spend figure may include non-approved vendor costs.",
      "Consider clarifying the difference between attributed and incremental revenue."
    ],
    "pending-11": [
      "AI review is still in progress — manual verification recommended.",
      "Engagement signal definitions are not yet aligned with the Rednote API v2.",
      "Creative taxonomy mapping is incomplete for 3 of the 12 content categories."
    ]
  },
  "fallbackSuggestions": [
    "No specific AI suggestions available for this item.",
    "Please review the content carefully before rejecting."
  ]
};

export const REVIEW_SHELL = { logo: LOGO, navigation: NAV, assistant: LITE_ASSISTANT, modelFlow: MODEL_FLOW, answerFor: buildLiteAssistantAnswer, modelDraftFor: buildModelDraft, image: assetUrl("assets/images/knowledge-hero.jpg") };
