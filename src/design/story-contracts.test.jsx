/**
 * Story-level contracts that a docs-only or args-only slip would break without
 * any component test noticing: Tabs documents every way onChange fires, and the
 * leading-badge example does not inherit the knowledge variant, whose column
 * layout has no place for a left badge.
 */
import { composeStories } from "@storybook/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import tabsMeta from "./components/Tabs/Tabs.stories.jsx";
import * as libraryItemStories from "./components/LibraryItem/LibraryItem.stories.jsx";
import * as knowledgeCreateStories from "./pages/KnowledgeCreatePage/KnowledgeCreatePage.stories.jsx";

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

  it("the Knowledge Create story host hands onCancel the page's own payload", () => {
    const { KnowledgeCreate } = composeStories(knowledgeCreateStories);
    const onCancel = vi.fn();
    render(<KnowledgeCreate onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onCancel.mock.calls[0][0]).toEqual({ type: "Business Term", mode: "create", values: expect.any(Object) });
  });
});
