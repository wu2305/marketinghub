import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { COCKPIT } from "../content.js";
import { loadStories, mountStory } from "./harness.jsx";
import { controls } from "./dom.js";

/* Flows that cross a Controls change: the host changes an input after the user
   has already done something, which a render-and-click sweep cannot reach.
   Each uses the real story, so the story's own wiring is under test too. */

const stories = loadStories();
const find = (title, name) => {
  const found = stories.find((story) => story.title === title && story.name === name);
  if (!found) throw new Error(`no story ${title} / ${name}`);
  return found;
};

describe("Report Copilot workspace story", () => {
  const story = find("Features/Cockpit/Report Copilot workspace", "Default");
  const [first, second] = COCKPIT.projects.city.reports;
  const startView = (report) => screen.queryByRole("button", { name: new RegExp(report.recommendations[0].title.slice(0, 30)) });

  function openAnswer(run) {
    fireEvent.click(startView(first));
    expect(startView(first), "the recommendation opens an answer view").toBeNull();
    return run;
  }

  it("starts over when the Controls switch to another report", () => {
    const run = mountStory(story, { stream: false });
    try {
      openAnswer(run);
      run.rerender({ index: 1 });
      expect(startView(second), "the new report's start view is shown").not.toBeNull();
    } finally {
      run.stop();
    }
  });

  it("starts over when the Controls switch to another project", () => {
    const other = Object.keys(COCKPIT.projects).find((id) => id !== "city");
    const run = mountStory(story, { stream: false });
    try {
      openAnswer(run);
      run.rerender({ project: other, index: 0 });
      expect(startView(COCKPIT.projects[other].reports[0]), "the other project's start view is shown").not.toBeNull();
    } finally {
      run.stop();
    }
  });

  it("keeps the thread when the same report is closed and opened again", () => {
    const run = mountStory(story, { stream: false });
    try {
      openAnswer(run);
      run.rerender({ open: false });
      run.rerender({ open: true });
      expect(startView(first), "same report: the answer is still open").toBeNull();
    } finally {
      run.stop();
    }
  });

  it("keeps what the user typed out of another report's composer", () => {
    const run = mountStory(story, { stream: false });
    try {
      const box = screen.getByRole("textbox", { name: /ask/i });
      fireEvent.change(box, { target: { value: "half a question" } });
      expect(box.value).toBe("half a question");
      run.rerender({ index: 1 });
      expect(screen.getByRole("textbox", { name: /ask/i }).value).toBe("");
    } finally {
      run.stop();
    }
  });
});

describe("Tabs story", () => {
  const story = find("Molecules/Tabs", "Default");
  const tabStops = () => controls(document.body).filter((tab) => tab.getAttribute("role") === "tab" && tab.tabIndex >= 0);

  it("keeps a Tab stop when the selected tab is disabled after it rendered", () => {
    const run = mountStory(story);
    try {
      expect(tabStops()).toHaveLength(1);
      const items = story.Story.args.items.map((item) => (item.id === story.Story.args.value ? { ...item, disabled: true } : item));
      run.rerender({ items });
      const [stop] = tabStops();
      expect(stop, "an enabled tab can be reached with Tab").toBeTruthy();
      expect(within(document.body).getByRole("tab", { name: items[0].label }).disabled).toBe(true);
    } finally {
      run.stop();
    }
  });

  it("selects with the arrow keys and skips a disabled tab", () => {
    const items = [{ id: "a", label: "A" }, { id: "b", label: "B", disabled: true }, { id: "c", label: "C" }];
    const run = mountStory(story, { items, value: "a" });
    try {
      fireEvent.keyDown(screen.getByRole("tab", { name: "A" }), { key: "ArrowRight" });
      expect(run.calls.at(-1)).toMatchObject({ name: "onChange", args: [{ id: "c", label: "C" }] });
    } finally {
      run.stop();
    }
  });
});
