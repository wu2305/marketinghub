import { LOGO, NAV, ASSISTANT_SKILL_MENU, MODEL_FLOW, buildAssistantAnswer, buildModelDraft } from "../../content.js";
import { demoImage } from "../images.js";

/** Source-backed private fixture. Timestamps derive from one injected clock. */
const SOURCE_RECORDS = [
  {
    "id": "fb-1",
    "question": "What is the conversion rate for the Q3 campaign?",
    "answer": "The Q3 campaign conversion rate is 4.2%, which is 0.8% higher than Q2. The primary driver is the new email sequence targeting returning customers.",
    "type": "thumbs-up",
    "reason": "",
    "feedbackBy": "Sarah Chen",
    "feedbackByInitials": "SC",
    "time": "2 hours ago",
    "ageHours": 2
  },
  {
    "id": "fb-2",
    "question": "How do I segment customers by LTV?",
    "answer": "You can segment customers by LTV using the Customer Segmentation model in the Data Model library. The model defines High LTV as customers with >$500 lifetime value.",
    "type": "thumbs-up",
    "reason": "",
    "feedbackBy": "Mike Ross",
    "feedbackByInitials": "MR",
    "time": "Today",
    "ageHours": 4
  },
  {
    "id": "fb-3",
    "question": "What is the best time to send promotional emails?",
    "answer": "The optimal time to send promotional emails is between 10 AM and 2 PM on weekdays, based on open rate analysis from the past 6 months.",
    "type": "thumbs-down",
    "reason": "The answer is too generic and doesn't account for different audience segments. Weekend campaigns for our fashion line actually perform better.",
    "feedbackBy": "Emily Zhang",
    "feedbackByInitials": "EZ",
    "time": "Today",
    "ageHours": 6
  },
  {
    "id": "fb-4",
    "question": "Can you explain the ROAS calculation for the new channel?",
    "answer": "ROAS (Return on Ad Spend) is calculated as Revenue / Ad Spend. For the new TikTok channel, the ROAS is 3.5x, meaning every $1 spent generates $3.50 in revenue.",
    "type": "thumbs-up",
    "reason": "",
    "feedbackBy": "David Kim",
    "feedbackByInitials": "DK",
    "time": "Yesterday",
    "ageHours": 24
  },
  {
    "id": "fb-5",
    "question": "Which metrics should I track for the loyalty program?",
    "answer": "Key metrics for the loyalty program include: enrollment rate, active member rate, redemption rate, and average points per member.",
    "type": "thumbs-up",
    "reason": "",
    "feedbackBy": "Lisa Wang",
    "feedbackByInitials": "LW",
    "time": "Yesterday",
    "ageHours": 26
  },
  {
    "id": "fb-6",
    "question": "How does the attribution model work for multi-touch campaigns?",
    "answer": "We use a last-touch attribution model by default. For multi-touch campaigns, you can switch to linear or time-decay attribution in the campaign settings.",
    "type": "thumbs-down",
    "reason": "The answer is incorrect. We actually switched to a data-driven attribution model last quarter. The information is outdated.",
    "feedbackBy": "James Liu",
    "feedbackByInitials": "JL",
    "time": "2 days ago",
    "ageHours": 48
  },
  {
    "id": "fb-7",
    "question": "What is the average order value for the handbag category?",
    "answer": "The average order value for the handbag category is $285, with a median of $220. Premium leather bags have the highest AOV at $450.",
    "type": "thumbs-up",
    "reason": "",
    "feedbackBy": "Anna Patel",
    "feedbackByInitials": "AP",
    "time": "2 days ago",
    "ageHours": 50
  },
  {
    "id": "fb-8",
    "question": "Can you generate a report on competitor pricing?",
    "answer": "I can help you analyze competitor pricing data. However, I need you to specify which competitors and product categories you want to compare.",
    "type": "thumbs-down",
    "reason": "The response asks for clarification instead of providing the report. The system should have enough context to generate the report based on our tracked competitors.",
    "feedbackBy": "Tom Harris",
    "feedbackByInitials": "TH",
    "time": "3 days ago",
    "ageHours": 72
  },
  {
    "id": "fb-9",
    "question": "What is the churn rate for the subscription service?",
    "answer": "The monthly churn rate for the subscription service is 5.2%, which is below the industry average of 7%. The primary retention driver is the personalized onboarding flow.",
    "type": "thumbs-up",
    "reason": "",
    "feedbackBy": "Rachel Green",
    "feedbackByInitials": "RG",
    "time": "3 days ago",
    "ageHours": 74
  },
  {
    "id": "fb-10",
    "question": "How do I set up an A/B test for the new landing page?",
    "answer": "To set up an A/B test, go to Campaign Execution > Experiments > Create New. Select your landing page variant and set the traffic split to 50/50.",
    "type": "thumbs-up",
    "reason": "",
    "feedbackBy": "Chris Martin",
    "feedbackByInitials": "CM",
    "time": "4 days ago",
    "ageHours": 96
  },
  {
    "id": "fb-11",
    "question": "What is the customer acquisition cost for social media?",
    "answer": "The CAC for social media channels is $45, which is 20% lower than the overall average CAC of $56. Instagram has the lowest CAC at $38.",
    "type": "thumbs-up",
    "reason": "",
    "feedbackBy": "Nina Patel",
    "feedbackByInitials": "NP",
    "time": "5 days ago",
    "ageHours": 120
  },
  {
    "id": "fb-12",
    "question": "Can you summarize the Q3 performance report?",
    "answer": "Q3 performance exceeded targets by 12%. Revenue grew 18% YoY, driven by the new product launch and expanded digital marketing efforts.",
    "type": "thumbs-down",
    "reason": "The summary is too brief and misses key details about regional performance and channel breakdown that were in the original report.",
    "feedbackBy": "Kevin Zhao",
    "feedbackByInitials": "KZ",
    "time": "5 days ago",
    "ageHours": 122
  },
  {
    "id": "fb-13",
    "question": "What are the top 3 performing products this month?",
    "answer": "The top 3 products are: 1) Classic Leather Tote ($1.2M revenue), 2) Crossbody Mini Bag ($890K), 3) Canvas Backpack ($650K).",
    "type": "thumbs-up",
    "reason": "",
    "feedbackBy": "Olivia Brown",
    "feedbackByInitials": "OB",
    "time": "6 days ago",
    "ageHours": 144
  },
  {
    "id": "fb-14",
    "question": "How do I calculate the net promoter score?",
    "answer": "NPS is calculated by subtracting the percentage of detractors (0-6) from the percentage of promoters (9-10). Passives (7-8) are excluded from the calculation.",
    "type": "thumbs-up",
    "reason": "",
    "feedbackBy": "Daniel Lee",
    "feedbackByInitials": "DL",
    "time": "1 week ago",
    "ageHours": 168
  },
  {
    "id": "fb-15",
    "question": "What is the return rate for online orders?",
    "answer": "The return rate for online orders is 8.5%, which is slightly higher than the in-store return rate of 5.2%. The main reason is size/fit issues.",
    "type": "thumbs-down",
    "reason": "The answer doesn't include the trend over time or comparison with industry benchmarks, which would be more useful for decision making.",
    "feedbackBy": "Sophie Turner",
    "feedbackByInitials": "ST",
    "time": "1 week ago",
    "ageHours": 170
  }
];

export function makeFeedbackRecords(now = Date.now()) {
  const time = Number(new Date(now));
  return SOURCE_RECORDS.map(({ ageHours, ...record }) => ({
    ...record,
    timestamp: new Date(time - ageHours * 60 * 60 * 1000).toISOString(),
  }));
}

export const FEEDBACK_QUALITY = {
  logo: LOGO,
  navigation: NAV,
  hero: {
    image: demoImage("assets/images/knowledge-hero.jpg"),
    eyebrow: "KNOWLEDGE MANAGEMENT",
    title: "Feedback & Quality",
    description: "User feedback records for thumbs-up and thumbs-down interactions.",
    summaryAria: "Feedback summary",
    stats: [
      { key: "total", label: "TOTAL FEEDBACK", caption: "thumbs-up and thumbs-down records" },
      { key: "up", label: "THUMBS UP", caption: "positive feedback this month" },
      { key: "down", label: "THUMBS DOWN", caption: "negative feedback with reasons" },
    ],
  },
  sidebar: [
    { id: "interpreter", icon: "book-open", label: "Knowledge Management", href: "knowledge.html" },
    { id: "review-center", icon: "check-circle", label: "Review Center", href: "review-center.html" },
    { id: "scenario-library", icon: "grid-four", label: "Skill Library", href: "scenario-library.html" },
    { id: "feedback-quality", icon: "star-outline", label: "Feedback & Quality", href: "feedback-quality.html" },
  ],
  labels: {
    navigationAria: "Knowledge navigation", categoriesAria: "Knowledge categories",
    tabsAria: "Feedback tabs", tab: "All Feedback", itemsAria: "Feedback records",
    searchAria: "Search feedback", search: "Search feedback...",
    type: "Feedback Type", time: "Time",
    typeOptions: [{ value: "all", label: "All types" }, { value: "thumbs-up", label: "Thumbs Up" }, { value: "thumbs-down", label: "Thumbs Down" }],
    timeOptions: [{ value: "all", label: "All time" }, { value: "today", label: "Today" }, { value: "week", label: "This week" }, { value: "month", label: "This month" }],
    columns: ["User Question", "Answer Content", "Type", "Reason", "Feedback By", "Time", "Actions"],
    emptyTitle: "No matching feedback", emptyDescription: "Change the tab, filter, or search.",
    up: "Thumbs Up", down: "Thumbs Down", reasonNone: "—", view: "View",
    detailEyebrow: "FEEDBACK RECORD", detailTitle: "Feedback details", closeDetail: "Close feedback details",
    answer: "Answer Content", downReason: "Thumbs Down Reason", feedbackBy: "Feedback By", operationTime: "Operation Time",
  },
  assistant: {
    launcherLabel: "AI Interpreter", title: "Ask AI Interpreter", headline: "Ask a question",
    description: "Your AI partner for every marketing task", historyTitle: "Recent Chats",
    suggestions: [
      { label: "Definition of Attributed ROI", prompt: "What is the governed definition of 'Attributed ROI' and which reports use it?" },
      { label: "City investment strategy knowledge", prompt: "Show me knowledge assets related to city investment strategy." },
      { label: "Metrics with data quality issues", prompt: "Which metrics have incomplete backflow and need data quality review?" },
    ],
    history: [
      { id: "campaign-roi", title: "Campaign ROI decline", label: "Why did campaign ROI decline last week?", prompt: "Why did campaign ROI decline last week?" },
      { id: "conversion", title: "Conversion drop", label: "Analyze conversion drop by customer segment.", prompt: "Analyze conversion drop by customer segment." },
      { id: "quality", title: "Data quality issues", label: "Summarize metrics with data quality issues.", prompt: "Summarize metrics with data quality issues." },
    ],
    skillMenu: ASSISTANT_SKILL_MENU,
  },
  modelFlow: MODEL_FLOW,
  answerFor: (query) => buildAssistantAnswer(query, "knowledge"),
  modelDraftFor: buildModelDraft,
};
