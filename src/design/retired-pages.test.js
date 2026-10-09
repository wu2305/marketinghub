import { describe, expect, it } from "vitest";
import { isRetiredStoryId, retiredPages } from "../../.storybook/retired-pages.js";
import scenarios from "../../scripts/visual-check.config.mjs";
import negatives from "../../scripts/visual-check.negative.mjs";
import { splitRetired } from "../../scripts/visual-check-select.mjs";

describe("retired pages and the visual-check scenarios", () => {
  it("recognises every state of a retired page but no active page", () => {
    expect(isRetiredStoryId("pages--metric-dictionary")).toBe(true);
    expect(isRetiredStoryId("pages--metric-dictionary-add-derived")).toBe(true);
    expect(isRetiredStoryId("pages--metricdictionarypage")).toBe(true);
    expect(isRetiredStoryId("pages--knowledge-view-data-model-preview")).toBe(true);
    expect(isRetiredStoryId("pages--scenario-library-edit")).toBe(true);
    for (const id of ["pages--home", "pages--interpreter", "pages--knowledge-create", "pages--knowledge-create-analysis", "pages--data-model-default", "pages--marketing-cockpit"]) {
      expect(isRetiredStoryId(id), id).toBe(false);
    }
    expect(retiredPages).toHaveLength(8);
  });

  it("drops only scenarios whose story belongs to a retired page", () => {
    const { scenarios: kept, negatives: keptNegatives, skipped } = splitRetired(scenarios, negatives);
    expect(skipped.scenarios.length).toBeGreaterThan(0);
    expect(skipped.negatives.length).toBeGreaterThan(0);
    expect(kept.length + skipped.scenarios.length).toBe(scenarios.length);
    expect(keptNegatives.length + skipped.negatives.length).toBe(negatives.length);
    for (const s of kept) expect(isRetiredStoryId(s.story.id), s.id).toBe(false);
    // Every kept negative still has its base scenario, so --negative never throws.
    for (const n of keptNegatives) expect(kept.some((s) => s.id === n.base), n.id).toBe(true);
  });

  it("keeps a scenario with an unknown story id, so a missing story still fails the run", () => {
    const typo = { id: "px-typo", story: { id: "pages--no-such-page" } };
    const { scenarios: kept } = splitRetired([typo], []);
    expect(kept).toEqual([typo]);
  });
});
