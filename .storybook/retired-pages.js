// Pages explicitly retired by the product owner on 2026-10-09.
export const retiredPages = [
  "MetricDictionaryPage",
  "PersonalMemoryPage",
  "ReviewCenterPage",
  "ScenarioDetailPage",
  "ScenarioEditPage",
  "ScenarioLibraryPage",
  "KnowledgeViewPage",
  "FeedbackQualityPage"
];

// Story ids of a retired page: `pages--metric-dictionary` and every state
// `pages--metric-dictionary-<state>`, plus the autodocs entry written from the
// component name (`pages--metricdictionarypage`).
const kebab = (name) => name.replace(/Page$/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const retiredPrefixes = retiredPages.map((name) => `pages--${kebab(name)}`);
const retiredDocsIds = retiredPages.map((name) => `pages--${name.toLowerCase()}`);

export function isRetiredStoryId(id) {
  return retiredDocsIds.includes(id) || retiredPrefixes.some((prefix) => id === prefix || id.startsWith(`${prefix}-`));
}
