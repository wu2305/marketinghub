/**
 * Story-level contracts that a docs-only or args-only slip would break without
 * any component test noticing: Tabs documents every way onChange fires, and the
 * leading-badge example does not inherit the knowledge variant, whose column
 * layout has no place for a left badge.
 */
import { describe, expect, it } from "vitest";
import tabsMeta from "./components/Tabs/Tabs.stories.jsx";
import * as libraryItemStories from "./components/LibraryItem/LibraryItem.stories.jsx";

describe("story contracts", () => {
  it("Tabs onChange says it fires on keyboard moves too, in both languages", () => {
    const description = tabsMeta.argTypes.onChange.description;
    expect(description).toMatch(/arrow keys/);
    expect(description).toMatch(/Home and End/);
    expect(description).toMatch(/方向键/);
    expect(description).not.toMatch(/when the user clicks a tab/);
  });

  it("every LibraryItem story with a leading badge renders the default variant", () => {
    const { default: meta, ...stories } = libraryItemStories;
    const withLeading = Object.entries(stories).filter(([, story]) => story.args && "leading" in story.args);
    expect(withLeading.map(([name]) => name)).toContain("WithLeadingBadge");
    for (const [name, story] of withLeading) {
      expect({ story: name, variant: { ...meta.args, ...story.args }.variant }).toEqual({ story: name, variant: "default" });
    }
  });
});
