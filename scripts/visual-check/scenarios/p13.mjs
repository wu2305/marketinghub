/** P13 Feedback & Quality: actual source-reachable table/detail states.
 * The list is the governed-library table pattern (dispositions.md "Feedback &
 * Quality — WP7g"); filtered states are reached from the default story with
 * `actions`. */
const url = "/assets/pages/feedback-quality.html";
const story = (id, expect, actions = []) => ({ id: `pages--feedback-quality${id ? `-${id}` : ""}`, expect, actions });
const typeFacet = '.mh-library-toolbar__facet:has-text("Feedback Type") select';
const timeFacet = '.mh-library-toolbar__facet:has-text("Time") select';
const rows = ".mh-feedback-page tbody tr:not(.mh-table__empty-row)";
export default [
  { id: "p13-default", original: { url, expect: [{ sel: ".feedback-card", count: 15 }, { sel: "#totalFeedbackCount", text: "15" }, { sel: "#thumbsUpCount", text: "10" }, { sel: "#thumbsDownCount", text: "5" }] }, story: story("", [
    { sel: rows, count: 15 },
    { sel: ".mh-feedback-page .mh-table th", count: 6 },
    { sel: ".mh-feedback-page__stats article:first-child strong", text: "15" },
    { sel: ".mh-feedback-page__stats article:last-child strong", text: "5" },
    { sel: ".mh-feedback-page .mh-tabs__tab", count: 3 },
    { sel: ".mh-feedback-page .mh-tabs__tab[aria-selected='true']", text: "All Feedback 15" },
    { sel: ".mh-feedback-page .mh-library-toolbar__count", text: "15 records" },
  ]) },
  { id: "p13-up", original: { url, actions: [{ select: ["#feedbackTypeFilter", "thumbs-up"] }], expect: [{ sel: ".feedback-card", count: 10 }] }, story: story("", [
    { sel: rows, count: 10 },
    { sel: ".mh-feedback-page .mh-tabs__tab[aria-selected='true']", text: "Thumbs Up" },
  ], [{ select: [typeFacet, "thumbs-up"] }]) },
  { id: "p13-down", original: { url, actions: [{ select: ["#feedbackTypeFilter", "thumbs-down"] }], expect: [{ sel: ".feedback-card", count: 5 }] }, story: story("", [
    { sel: rows, count: 5 },
    { sel: ".mh-feedback-page .mh-tabs__tab[aria-selected='true']", text: "Thumbs Down" },
  ], [{ select: [typeFacet, "thumbs-down"] }]) },
  { id: "p13-all-reset", original: { url, actions: [{ select: ["#feedbackTypeFilter", "thumbs-down"] }, { click: ".feedback-tab[data-tab='all']" }], expect: [{ sel: ".feedback-card", count: 15 }, { sel: ".feedback-tab.active", text: "All Feedback" }] }, story: story("", [
    { sel: rows, count: 15 },
    { sel: ".mh-feedback-page .mh-tabs__tab[aria-selected='true']", text: "All Feedback" },
  ], [{ select: [typeFacet, "thumbs-down"] }, { click: ".mh-feedback-page .mh-tabs__tab:has-text('All Feedback')" }]) },
  { id: "p13-today", original: { url, actions: [{ select: ["#feedbackTimeFilter", "today"] }], expect: [{ sel: '.feedback-card[data-id="fb-1"]', text: "Q3 campaign" }, { sel: '.feedback-card[data-id="fb-5"]', count: 0, state: "detached" }] }, story: story("", [
    { sel: rows, count: 3 },
    { sel: `${rows}:first-child`, text: "Q3 campaign" },
  ], [{ select: [timeFacet, "today"] }]) },
  { id: "p13-week", original: { url, actions: [{ select: ["#feedbackTimeFilter", "week"] }], expect: [{ sel: '.feedback-card[data-id="fb-13"]', text: "top 3 performing products" }, { sel: '.feedback-card[data-id="fb-15"]', count: 0, state: "detached" }] }, story: story("", [
    { sel: rows, count: 13 },
    { sel: `${rows}:last-child`, text: "top 3 performing products" },
  ], [{ select: [timeFacet, "week"] }]) },
  { id: "p13-month", original: { url, actions: [{ select: ["#feedbackTimeFilter", "month"] }], expect: [{ sel: ".feedback-card", count: 15 }, { sel: "#feedbackTimeFilter" }] }, story: story("", [
    { sel: rows, count: 15 },
  ], [{ select: [timeFacet, "month"] }]) },
  { id: "p13-search", original: { url, actions: [{ fill: ["#feedbackSearch", "loyalty program"] }], expect: [{ sel: ".feedback-card", count: 1, text: "loyalty program" }] }, story: story("", [{ sel: rows, count: 1, text: "loyalty program" }, { sel: ".mh-library-toolbar__count", text: "1 record" }], [{ fill: [".mh-library-toolbar input[type='search']", "loyalty program"] }]) },
  { id: "p13-empty", original: { url, actions: [{ fill: ["#feedbackSearch", "no matching feedback"] }], expect: [{ sel: "#feedbackEmptyState:not([hidden])", text: "No matching feedback" }, { sel: ".feedback-card", count: 0, state: "detached" }] }, story: story("empty", [{ sel: ".mh-feedback-page .mh-library-empty", text: "No matching feedback" }, { sel: rows, count: 0, state: "detached" }]) },
  { id: "p13-negative-detail", original: { url, actions: [{ click: '.feedback-card[data-id="fb-3"] .feedback-view-btn' }], expect: [{ sel: ".feedback-detail-panel.open", text: "What is the best time to send promotional emails?" }, { sel: "#feedbackDetailReasonSection:not([hidden])", text: "too generic" }, { sel: "#feedbackDetailAnswer", text: "10 AM and 2 PM" }] }, story: story("negative-detail", [{ sel: ".mh-modal--drawer", text: "What is the best time to send promotional emails?" }, { sel: ".mh-feedback-page__detail-reason", text: "too generic" }, { sel: ".mh-feedback-page__detail-answer", text: "10 AM and 2 PM" }]) },
  { id: "p13-positive-detail", original: { url, actions: [{ click: '.feedback-card[data-id="fb-1"] .feedback-view-btn' }], expect: [{ sel: ".feedback-detail-panel.open", text: "conversion rate for the Q3 campaign" }, { sel: "#feedbackDetailReasonSection", state: "hidden" }] }, story: story("positive-detail", [{ sel: ".mh-modal--drawer", text: "conversion rate for the Q3 campaign" }, { sel: ".mh-feedback-page__detail-reason", count: 0, state: "detached" }]) },
  { id: "p13-detail-escape", original: { url, actions: [{ click: '.feedback-card[data-id="fb-3"] .feedback-view-btn' }, { press: ["body", "Escape"] }], expect: [{ sel: ".feedback-detail-panel:not(.open)", attr: { name: "aria-hidden", value: "true" } }, { sel: "#feedbackDetailScrim[hidden]", state: "attached", attr: { name: "hidden", value: "" } }] }, story: story("negative-detail", [{ sel: ".mh-modal--drawer", count: 0, state: "detached" }, { sel: rows, count: 15 }], [{ press: ["body", "Escape"] }]) },
  { id: "p13-bottom", original: { url, actions: [{ eval: "window.scrollTo(0, document.body.scrollHeight)" }, { waitMs: 200 }], expect: [{ sel: ".feedback-card", count: 15 }, { sel: ".feedback-card:last-child", text: "return rate for online orders" }] }, story: story("", [{ sel: rows, count: 15 }, { sel: `${rows}:last-child`, text: "return rate for online orders" }], [{ eval: "window.scrollTo(0, document.body.scrollHeight)" }, { waitMs: 200 }]) },
  { id: "p13-narrow", viewport: { width: 390, height: 844 }, original: { url, expect: [{ sel: ".feedback-card", count: 15 }, { sel: '.feedback-card[data-id="fb-1"]', text: "conversion rate for the Q3 campaign" }] }, story: story("", [{ sel: rows, count: 15 }, { sel: `${rows}:first-child`, text: "conversion rate for the Q3 campaign" }]) },
  { id: "p13-assistant-guard-correction", original: { url, actions: [{ click: "#aiEntry" }], expect: [{ sel: "#assistantPanel[hidden]", state: "attached", attr: { name: "hidden", value: "" } }, { sel: "#aiEntry", text: "AI Interpreter" }] }, story: story("assistant", [{ sel: ".mh-assistant", text: "Ask AI Interpreter" }, { sel: ".mh-launcher", count: 1, state: "hidden" }]) },
];
