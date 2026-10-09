import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LibraryItem } from "./index.jsx";

const meta = [
  { label: "Synonyms", value: "revenue, sales" },
  { label: "Unit", value: "USD", secondary: { label: "Type", value: "Metric" } },
  { label: "Creator", value: "Current User" },
];
const actions = { actions: [{ id: "edit", label: "Edit" }] };

/** HTML content model for <dl>: dt/dd, or <div> wrappers holding only dt/dd; nothing else. */
function descriptionListProblems(root) {
  const problems = [];
  for (const dl of root.querySelectorAll("dl")) {
    for (const child of dl.children) {
      if (["DT", "DD"].includes(child.tagName)) continue;
      if (child.tagName !== "DIV") {
        problems.push(`<dl> holds <${child.tagName.toLowerCase()}>`);
        continue;
      }
      for (const inner of child.children) {
        if (!["DT", "DD"].includes(inner.tagName)) problems.push(`<dl> > <div> holds <${inner.tagName.toLowerCase()}>`);
      }
    }
  }
  for (const term of root.querySelectorAll("dt, dd")) {
    const parent = term.parentElement;
    const grand = parent.parentElement;
    if (!(parent.tagName === "DL" || (parent.tagName === "DIV" && grand.tagName === "DL"))) problems.push(`<${term.tagName.toLowerCase()}> is not directly in a <dl> or <dl> > <div>`);
  }
  return problems;
}

describe("LibraryItem metadata markup", () => {
  for (const variant of ["default", "knowledge"]) {
    it(`${variant}: every dt/dd sits directly in a <dl> (optionally one <div> deep)`, () => {
      const { container } = render(<LibraryItem variant={variant} id="a" title="Net revenue" description="d" meta={meta} actions={actions} />);
      expect(container.querySelectorAll("dt")).toHaveLength(4);
      expect(descriptionListProblems(container)).toEqual([]);
    });
  }

  it("keeps the actions beside the last row, outside the description lists", () => {
    const { container } = render(<LibraryItem variant="knowledge" id="a" title="Net revenue" meta={meta} actions={actions} />);
    const last = container.querySelector(".mh-library-item__row:last-child");
    expect(last.querySelector(".mh-item-actions")).toBeTruthy();
    expect(last.querySelector("dl .mh-item-actions")).toBeNull();
    expect(container.querySelector(".mh-library-item__row--pair").querySelectorAll("dt")).toHaveLength(2);
  });

  it("checker flags the two-wrapper nesting that used to be here", () => {
    const wrong = document.createElement("div");
    wrong.innerHTML = '<dl><div><div><dt>a</dt><dd>b</dd></div></div></dl>';
    expect(descriptionListProblems(wrong).length).toBeGreaterThan(0);
  });
});
