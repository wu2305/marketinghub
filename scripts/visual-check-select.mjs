// Splits the scenario and negative lists into those that target registered
// stories and those that target a page the product owner retired
// (.storybook/retired-pages.js). Retired scenarios are skipped on purpose and
// reported by name; any other story id missing from the Storybook index still
// fails the run in visual-check.mjs.
import { isRetiredStoryId } from "../.storybook/retired-pages.js";

export function splitRetired(scenarios, negatives) {
  const retiredScenarios = scenarios.filter((s) => isRetiredStoryId(s.story.id));
  const retiredIds = new Set(retiredScenarios.map((s) => s.id));
  const scenarioById = new Map(scenarios.map((s) => [s.id, s]));
  // A negative is retired when its base scenario or the story it swaps in is.
  const retiredNegative = (n) => retiredIds.has(n.base) || isRetiredStoryId(n.story?.id ?? scenarioById.get(n.base)?.story.id ?? "");
  return {
    scenarios: scenarios.filter((s) => !retiredIds.has(s.id)),
    negatives: negatives.filter((n) => !retiredNegative(n)),
    skipped: {
      scenarios: retiredScenarios.map((s) => s.id),
      negatives: negatives.filter(retiredNegative).map((n) => n.id),
    },
  };
}
