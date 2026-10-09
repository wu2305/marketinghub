/* The showcase demo is the whole product in one site, so this is the click-through
 * that catches a page that crashes on open or after one click (the Data Models
 * view once crashed only when the example page was used, not in a story). */
import React from "react";
import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { INTERPRETER, REPORT_PROJECTS } from "marketing-hub/demo";
import { App } from "./App.jsx";

const go = async (hash) => {
  await act(async () => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
};

let errors;
beforeEach(() => {
  window.scrollTo = () => {};
  Element.prototype.scrollTo = () => {}; /* jsdom has no element scrolling; the assistant scrolls its thread */
  window.location.hash = "";
  errors = vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  /* React logs "The above error occurred" for a render that threw; a missing key or act warning is not a crash. */
  const crashed = errors.mock.calls.filter((call) => /error occurred|Uncaught|Cannot read|is not a function|undefined is not/i.test(String(call[0])));
  errors.mockRestore();
  cleanup();
  expect(crashed).toEqual([]);
});

const heading = (container) => container.querySelector("h1")?.textContent ?? "";

/* One URL per page, with the parameters its links use. */
const PAGES = [
  ["home", "#/home"],
  ["cockpit", "#/cockpit"],
  ["self-service", "#/self-service"],
  ["self-service upload tab", "#/self-service?tab=upload"],
  ["data-upload", "#/data-upload"],
  ["media-tracking-detail", "#/media-tracking-detail"],
  ["campaign", "#/campaign"],
  ["interpreter", "#/interpreter"],
  ["knowledge-create", "#/knowledge-create"],
  ["knowledge-view", "#/knowledge-view"],
  ["metric-dictionary", "#/metric-dictionary"],
  ["data-model", "#/data-model"],
  ["review-center", "#/review-center"],
  ["feedback-quality", "#/feedback-quality"],
  ["personal-memory", "#/personal-memory"],
  ["scenario-library", "#/scenario-library"],
  ["scenario-detail", "#/scenario-detail"],
  ["scenario-edit", "#/scenario-edit"],
];

describe("showcase demo", () => {
  it.each(PAGES)("opens %s", async (_name, hash) => {
    const { container } = render(<App />);
    await go(hash);
    expect(container.textContent).not.toContain("not part of this demo");
    expect(container.querySelector("main, h1")).toBeTruthy();
    expect(container.textContent.length).toBeGreaterThan(200);
  });

  it("opens every report project and dashboard in the Cockpit", async () => {
    const { container } = render(<App />);
    for (const [project, entry] of Object.entries(REPORT_PROJECTS)) {
      await go(`#/cockpit?project=${project}`);
      expect(heading(container), project).toBeTruthy();
      for (let index = 0; index < (entry.reports?.length ?? 0); index += 1) {
        await go(`#/cockpit?project=${project}&view=live&dashboard=${index}`);
        expect(container.textContent.length, `${project} dashboard ${index}`).toBeGreaterThan(200);
      }
    }
  });

  it("opens every knowledge type from the Interpreter sidebar", async () => {
    const { container } = render(<App />);
    await go("#/interpreter");
    for (const type of INTERPRETER.types) {
      const link = [...container.querySelectorAll("a, button")].find((el) => el.textContent.trim().startsWith(type.label ?? type.title ?? type.id));
      expect(link, type.id).toBeTruthy();
      await act(async () => {
        fireEvent.click(link);
      });
      expect(container.textContent.length, type.id).toBeGreaterThan(200);
    }
  });

  it("opens every knowledge type in the create form", async () => {
    const { container } = render(<App />);
    for (const type of INTERPRETER.types.map((entry) => entry.id).filter((id) => id !== "overview")) {
      await go(`#/knowledge-create?type=${encodeURIComponent(type)}`);
      expect(container.textContent.length, type).toBeGreaterThan(200);
    }
  });

  it("answers a question in the Home assistant", async () => {
    const { container } = render(<App />);
    await go("#/home");
    await act(async () => {
      fireEvent.click(container.querySelector(".mh-launcher"));
    });
    const panel = container.querySelector(".mh-assistant");
    expect(panel).toBeTruthy();
    const box = panel.querySelector("textarea");
    await act(async () => {
      fireEvent.change(box, { target: { value: "What drives ROI this quarter?" } });
    });
    await act(async () => {
      fireEvent.click(panel.querySelector(".mh-assistant__send button"));
    });
    expect(panel.textContent).toContain("What drives ROI this quarter?");
    expect(panel.querySelectorAll(".mh-assistant__answer, [class*='answer']").length).toBeGreaterThan(0);
  });

  it("opens a scenario drawer in the Skill Library and its full editor", async () => {
    const { container } = render(<App />);
    await go("#/scenario-library");
    const row = container.querySelector("tbody tr button, tbody tr a, [class*='library-item'] button, [class*='skill'] tbody tr");
    expect(row).toBeTruthy();
    await act(async () => {
      fireEvent.click(row);
    });
    expect(container.ownerDocument.querySelector("[role='dialog']")).toBeTruthy();
    await go("#/scenario-edit");
    expect(container.textContent).toMatch(/Scenario Name/);
    expect(within(container).getAllByRole("textbox").length).toBeGreaterThan(0);
  });
});
