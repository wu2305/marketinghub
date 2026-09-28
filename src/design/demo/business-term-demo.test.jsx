import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BusinessTermView } from "../features/interpreter/BusinessTermView/index.jsx";
import { useBusinessTermDemo } from "./business-term-demo.js";
import { INTERPRETER } from "../content.js";
import { ALT_BUSINESS_TERMS } from "./__fixtures__/alt-business-terms.js";

function Harness(props) {
  return <BusinessTermView {...useBusinessTermDemo(props)} />;
}

const bundle = INTERPRETER.businessTermLibrary;
const gmv = "GMV (Gross Merchandise Value)";

function renderView(props = {}) {
  return render(<Harness {...bundle} {...props} />);
}

const list = () => screen.getByRole("list", { name: "Business terms" });
const cards = () => [...document.querySelectorAll(".mh-btview .mh-library-item")];
const cardTitles = () => cards().map((card) => card.querySelector(".mh-library-item__title button").textContent);
/* the drawer footer repeats the actions — scope to the list */
const cardAction = (name) => within(list()).getByRole("button", { name });
const cardStatus = (title) => cards().find((card) => card.textContent.includes(title)).querySelector(".mh-library-item__head > .mh-badge").textContent;
const toast = () => document.querySelector(".mh-toast");

describe("useBusinessTermDemo", () => {
  it("filters OR within a facet and AND across facets, with an always-visible count", () => {
    renderView();
    expect(cards().length).toBe(6);
    expect(screen.getByText("Showing 6 of 6 terms")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Enabled"));
    expect(screen.getByText("1 selected")).toBeTruthy();
    expect(cards().length).toBe(6);
    fireEvent.click(screen.getByLabelText("Enabled"));
    fireEvent.click(screen.getByLabelText("Disabled"));
    expect(cards().length).toBe(0);
    expect(screen.getByText("No matching records")).toBeTruthy();
    expect(screen.getByText("Showing 0 of 6 terms")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Disabled"));
    fireEvent.click(screen.getByLabelText("Current User"));
    expect(cardTitles()).toEqual(expect.arrayContaining([expect.stringContaining("GMV"), expect.stringContaining("Revenue")]));
    expect(cards().length).toBe(2);
  });

  it("clears search and facets from the no-results state", () => {
    renderView({ query: "zzzz" });
    expect(cards().length).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(cards().length).toBe(6);
    expect(screen.getByLabelText("Search knowledge").value).toBe("");
  });

  it("searches title, description, synonyms, scope and creator", () => {
    renderView();
    const search = screen.getByLabelText("Search knowledge");
    fireEvent.change(search, { target: { value: "turnover" } });
    expect(cardTitles()).toEqual([expect.stringContaining("Revenue")]);
    fireEvent.change(search, { target: { value: "Customer 360" } });
    expect(cardTitles()).toEqual([expect.stringContaining("Paid Customer")]);
    fireEvent.change(search, { target: { value: "emily" } });
    expect(cardTitles()).toEqual([expect.stringContaining("Paid Customer")]);
    fireEvent.change(search, { target: { value: "qualified visit" } });
    expect(cardTitles()).toEqual([expect.stringContaining("Active Member")]);
  });

  it("marks blocked actions but keeps them operable, with one permission message", () => {
    renderView({ drafts: [{ id: "t-draft", title: "Own Draft", status: "Enable", stage: "Draft", creator: "Current User", synonyms: [] }] });
    const edit = cardAction(`Edit ${gmv}`);
    expect(edit.getAttribute("aria-disabled")).toBe("true");
    expect(edit.hasAttribute("disabled")).toBe(false);
    expect(edit.getAttribute("title")).toBe("Disable knowledge first");
    expect(cardAction(`Disable ${gmv}`).hasAttribute("aria-disabled")).toBe(false);
    expect(cardAction("Edit Paid Customer").getAttribute("title")).toBe("Knowledge created by others cannot be operated.");
    /* R3: a draft is offline even when stored as Enable — edit is allowed, disable is not. */
    expect(cardAction("Edit Own Draft").hasAttribute("aria-disabled")).toBe(false);
    expect(cardAction("Disable Own Draft").getAttribute("title")).toBe("This knowledge is already disabled.");
    expect(cardStatus("Own Draft")).toBe("Disabled");
  });

  it("disable confirms, flips the status and shows a success toast", () => {
    vi.useFakeTimers();
    renderView();
    fireEvent.click(cardAction(`Disable ${gmv}`));
    expect(screen.getByText("Please confirm whether to offline this knowledge.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Offline" }));
    expect(cardStatus("GMV")).toBe("Disabled");
    expect(toast().hidden).toBe(false);
    expect(toast().textContent).toBe("Disabled successfully");
    act(() => vi.advanceTimersByTime(3100));
    expect(toast().hidden).toBe(true);
    vi.useRealTimers();
  });

  it("edit on an enabled term offers to take it offline, then continues to edit", () => {
    const onNavigate = vi.fn();
    renderView({ onNavigate });
    fireEvent.click(cardAction(`Edit ${gmv}`));
    expect(screen.getByText("Please take the knowledge offline first")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Go Offline" }));
    expect(cardStatus("GMV")).toBe("Disabled");
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ href: "knowledge-create.html?type=Business%20Term&mode=edit&id=business-term-gmv", id: "business-term-gmv" }));
  });

  it("delete on an enabled term goes offline first, then asks to delete and removes it", () => {
    renderView({ detail: "business-term-gmv" });
    fireEvent.click(cardAction(`Delete ${gmv}`));
    fireEvent.click(screen.getByRole("button", { name: "Go Offline" }));
    expect(screen.getByText("Please confirm whether to delete this knowledge. Deletion cannot be undone.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete" }));
    expect(cards().length).toBe(5);
    expect(cardTitles().every((title) => !title.includes("GMV"))).toBe(true);
    expect(screen.getByText("5 records")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(toast().textContent).toBe("Deleted successfully");
  });

  it("explains a permission block and an already-disabled block", () => {
    renderView();
    fireEvent.click(cardAction("Edit Paid Customer"));
    let dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Permission denied")).toBeTruthy();
    expect(within(dialog).getByText("Knowledge created by others cannot be operated.")).toBeTruthy();
    fireEvent.click(within(dialog).getByText("Close"));
    fireEvent.click(cardAction(`Disable ${gmv}`));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Offline" }));
    fireEvent.click(cardAction(`Disable ${gmv}`));
    dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Knowledge already disabled")).toBeTruthy();
    fireEvent.click(within(dialog).getByText("Close"));
    expect(cards().length).toBe(6);
  });

  it("paginates at 5 per page, moves to page 2 and clamps after delete", () => {
    const own = (id) => ({ id, title: `Term ${id}`, description: `Desc ${id}`, synonyms: [], scope: [], kind: "Business Term", creator: "Current User", status: "Disable" });
    renderView({ records: ["a", "b", "c", "d", "e", "f"].map(own), pageSize: 5, drafts: [] });
    expect(cards().length).toBe(5);
    expect(screen.getByText("1 / 2")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(cardTitles()).toEqual(["Term f"]);
    fireEvent.click(cardAction("Delete Term f"));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete" }));
    expect(screen.getByText("1 / 1")).toBeTruthy();
    expect(cards().length).toBe(5);
  });

  it("shows own drafts first with the Draft marker and hides every other user's draft", () => {
    renderView({
      drafts: [
        { id: "d-own", title: "My Staged Term", status: "Disable", stage: "Draft", creator: "Current User", synonyms: [] },
        { id: "d-other", title: "Other Staged Term", status: "Disable", stage: "Draft", creator: "Emily Wang", synonyms: [] },
        { id: "d-other-stageless", title: "Stageless Theirs", status: "Disable", creator: "Emily Wang", synonyms: [] },
      ],
    });
    expect(cardTitles()[0]).toBe("My Staged Term");
    expect(cards()[0].querySelector(".mh-library-item__draft").textContent).toBe("Draft");
    expect(cardTitles().some((title) => title.includes("Other Staged") || title.includes("Stageless"))).toBe(false);
    expect(cards().length).toBe(7);
  });

  it("shows three synonyms and counts the rest", () => {
    renderView({ records: [{ id: "s", title: "Many", description: "d", synonyms: ["a", "b", "c", "d", "e"], scope: [], kind: "Business Term", creator: "Current User", status: "Enable" }], drafts: [] });
    const chips = [...cards()[0].querySelectorAll(".mh-chip-list li")].map((li) => li.textContent);
    expect(chips).toEqual(["a", "b", "c", "+2"]);
  });

  it("opens the drawer from the title and closes on Escape", () => {
    renderView();
    fireEvent.click(within(list()).getByRole("button", { name: gmv }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Business Term", { selector: ".mh-modal__eyebrow" })).toBeTruthy();
    expect(within(dialog).getByText("Term Type")).toBeTruthy();
    expect(within(dialog).getByText("D2C Insight")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders only injected content and keeps two instances independent", () => {
    render(
      <>
        <div data-testid="a"><Harness {...bundle} /></div>
        <div data-testid="b"><Harness {...ALT_BUSINESS_TERMS} /></div>
      </>,
    );
    const a = screen.getByTestId("a");
    const b = screen.getByTestId("b");
    expect(within(b).getByText("Alt Alpha Metric")).toBeTruthy();
    expect(within(b).queryByText(gmv)).toBeNull();
    expect(within(b).getByText("Add Alt Term")).toBeTruthy();
    expect(b.querySelector(".mh-library-item__title button").textContent).toBe("Alt Draft Term");
    fireEvent.click(within(a).getByRole("button", { name: `Disable ${gmv}` }));
    fireEvent.click(within(a).getByRole("button", { name: "Confirm Offline" }));
    expect(within(b).queryByRole("dialog")).toBeNull();
    expect(within(b).getAllByText("Alt Off").length).toBe(2);
    expect(within(b).getAllByText("Alt On").length).toBe(1);
    fireEvent.change(within(b).getByLabelText("Alt search"), { target: { value: "beta" } });
    expect(b.querySelectorAll(".mh-library-item").length).toBe(1);
    expect(a.querySelectorAll(".mh-library-item").length).toBe(6);
  });
});
