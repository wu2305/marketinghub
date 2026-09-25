import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BusinessTermView } from "../features/interpreter/BusinessTermView/index.jsx";
import { useBusinessTermDemo } from "./business-term-demo.js";
import { INTERPRETER } from "../content.js";
import { ALT_BUSINESS_TERMS } from "./__fixtures__/alt-business-terms.js";

/* jsdom has no ResizeObserver — SynonymClamp measures on it. */
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

function Harness(props) {
  return <BusinessTermView {...useBusinessTermDemo(props)} />;
}

const bundle = INTERPRETER.businessTermLibrary;

function renderView(props = {}) {
  return render(<Harness {...bundle} {...props} />);
}

const cards = () => [...document.querySelectorAll(".mh-btview__card")];
const cardTitles = () => cards().map((card) => card.querySelector("h3").textContent);
/* the detail drawer footer renders the same three actions — scope to cards */
const cardNamed = (name) => within(document.querySelector(".mh-btview__cards")).getByRole("button", { name });
const statePill = (card) => card.querySelector(".mh-badge--knowledge").textContent;

describe("useBusinessTermDemo", () => {
  it("filters OR within a filter, AND across filters, with summary labels", () => {
    renderView();
    expect(cards().length).toBe(6);
    expect(screen.getByText("All statuses")).toBeTruthy();
    expect(screen.getByText("All creators")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Enabled"));
    expect(screen.getByText("1 selected")).toBeTruthy();
    expect(cards().length).toBe(6); // all seeds are Enabled

    /* status OR semantics: a "Draft" selection matches stage, not status —
       business-term-library.js checks [status, stage==="Draft" && "Draft"]. */
    fireEvent.click(screen.getByLabelText("Enabled")); // uncheck
    fireEvent.click(screen.getByLabelText("Disabled"));
    expect(cards().length).toBe(0);
    expect(screen.getByText("No matching records")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Disabled")); // uncheck → all back
    fireEvent.click(screen.getByLabelText("Enabled"));
    fireEvent.click(screen.getByLabelText("Current User"));
    expect(cards().length).toBe(2); // GMV + Revenue are the Current User rows
    expect(cardTitles()).toEqual(
      expect.arrayContaining([expect.stringContaining("GMV"), expect.stringContaining("Revenue")]),
    );
  });

  it("searches title, description, synonyms, scope and creator", () => {
    renderView();
    const search = screen.getByLabelText("Search knowledge");
    fireEvent.change(search, { target: { value: "turnover" } }); // synonym
    expect(cardTitles()).toEqual([expect.stringContaining("Revenue")]);

    fireEvent.change(search, { target: { value: "Customer 360" } }); // scope
    expect(cardTitles()).toEqual([expect.stringContaining("Paid Customer")]);

    fireEvent.change(search, { target: { value: "emily" } }); // creator
    expect(cardTitles()).toEqual([expect.stringContaining("Paid Customer")]);

    fireEvent.change(search, { target: { value: "qualified visit" } }); // description
    expect(cardTitles()).toEqual([expect.stringContaining("Active Member")]);
  });

  it("computes the action matrix and tooltips for own/other/enabled/disabled/draft", () => {
    renderView({
      drafts: [{ id: "t-draft", title: "Own Draft", status: "Disable", stage: "Draft", creator: "Current User", synonyms: [] }],
    });
    const gmv = "GMV (Gross Merchandise Value)";
    const paid = "Paid Customer";

    const edit = cardNamed(`Edit ${gmv}`);
    expect(edit.getAttribute("aria-disabled")).toBe("true");
    expect(edit.getAttribute("title")).toBe("Disable knowledge first");
    expect(cardNamed(`Delete ${gmv}`).getAttribute("title")).toBe("Disable knowledge first");
    const disable = cardNamed(`Disable ${gmv}`);
    expect(disable.getAttribute("aria-disabled")).toBe("false");
    expect(disable.getAttribute("title")).toBe("Disable");

    /* Other user's record: every action disabled with the permission tooltip. */
    expect(cardNamed(`Edit ${paid}`).getAttribute("title")).toBe(
      "You do not have permission to edit knowledge created by another user.",
    );
    expect(cardNamed(`Disable ${paid}`).getAttribute("aria-disabled")).toBe("true");

    /* Own draft: disable is already disabled, edit/delete are available. */
    const draftDisable = cardNamed("Disable Own Draft");
    expect(draftDisable.getAttribute("aria-disabled")).toBe("true");
    expect(draftDisable.getAttribute("title")).toBe("Draft knowledge is already disabled.");
    expect(cardNamed("Edit Own Draft").getAttribute("aria-disabled")).toBe("false");
  });

  it("confirm-offline flow via edit and via disable flips the status pill", () => {
    renderView();
    const gmv = "GMV (Gross Merchandise Value)";
    fireEvent.click(cardNamed(`Edit ${gmv}`));
    expect(screen.getByText("Confirm Operation")).toBeTruthy();
    expect(screen.getByText("Please confirm whether to offline this knowledge.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Offline" }));
    expect(screen.queryByText("Confirm Operation")).toBeNull();
    expect(statePill(cards().find((c) => c.querySelector("h3").textContent.includes("GMV")))).toBe("Disabled");
    /* No toast — the original calls window.showKnowledgeSuccessToast which is
       undefined there, so nothing is shown. */
    expect(document.querySelector(".mh-toast")).toBeNull();
  });

  it("delete removes the record, closes its detail and updates the count", () => {
    renderView({ detail: "business-term-gmv" });
    const gmv = "GMV (Gross Merchandise Value)";
    fireEvent.click(cardNamed(`Disable ${gmv}`));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Offline" }));
    /* detail drawer stays open and refreshes to the Disabled pill */
    expect(within(screen.getByRole("dialog")).getByText("Disabled")).toBeTruthy();
    fireEvent.click(cardNamed(`Delete ${gmv}`));
    expect(screen.getByText("Please confirm whether to delete this knowledge. Deletion cannot be undone.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete" }));
    expect(cards().length).toBe(5);
    expect(cardTitles().every((t) => !t.includes("GMV"))).toBe(true);
    expect(screen.getByText("5 records")).toBeTruthy();
    /* the drawer closed because its record was deleted */
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.querySelector(".mh-toast")).toBeNull();
  });

  it("shows the permission-denied info dialog for another user's record", () => {
    renderView();
    fireEvent.click(cardNamed("Edit Paid Customer"));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Permission denied")).toBeTruthy();
    expect(within(dialog).getByText("You do not have permission to edit knowledge created by another user.")).toBeTruthy();
    fireEvent.click(within(dialog).getByText("Close"));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(cards().length).toBe(6);
  });

  it("shows the already-disabled info dialog when disabling twice", () => {
    renderView();
    const gmv = "GMV (Gross Merchandise Value)";
    fireEvent.click(cardNamed(`Disable ${gmv}`));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Offline" }));
    fireEvent.click(cardNamed(`Disable ${gmv}`));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Knowledge already disabled")).toBeTruthy();
    expect(within(dialog).getByText("This knowledge is already disabled.")).toBeTruthy();
    fireEvent.click(within(dialog).getByText("Close"));
  });

  it("edit on a disabled record emits the edit href through onNavigate", () => {
    const onNavigate = vi.fn();
    renderView({ onNavigate });
    const gmv = "GMV (Gross Merchandise Value)";
    fireEvent.click(cardNamed(`Disable ${gmv}`));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Offline" }));
    fireEvent.click(cardNamed(`Edit ${gmv}`));
    expect(onNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ href: "knowledge-create.html?type=Business%20Term&mode=edit&id=business-term-gmv", id: "business-term-gmv" }),
    );
  });

  it("paginates at 5 per page, moves to page 2 and clamps after delete", () => {
    const own = (id) => ({
      id,
      title: `Term ${id}`,
      description: `Desc ${id}`,
      synonyms: [],
      scope: [],
      kind: "Business Term",
      creator: "Current User",
      status: "Enable",
    });
    renderView({ records: ["a", "b", "c", "d", "e", "f"].map(own), pageSize: 5, drafts: [] });
    expect(cards().length).toBe(5);
    expect(screen.getByText("1 / 2")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("2 / 2")).toBeTruthy();
    expect(cards().length).toBe(1);
    expect(cardTitles()[0]).toBe("Term f");

    fireEvent.click(cardNamed("Disable Term f"));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Offline" }));
    fireEvent.click(cardNamed("Delete Term f"));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete" }));
    expect(screen.getByText("1 / 1")).toBeTruthy(); // clamped back to page 1
    expect(cards().length).toBe(5);
  });

  it("unshifts own drafts with the Draft badge and hides other users' drafts", () => {
    renderView({
      drafts: [
        { id: "d-own", title: "My Staged Term", status: "Disable", stage: "Draft", creator: "Current User", synonyms: [] },
        { id: "d-other", title: "Other Staged Term", status: "Disable", stage: "Draft", creator: "Emily Wang", synonyms: [] },
      ],
    });
    expect(cardTitles()[0]).toContain("My Staged Term");
    expect(cards()[0].querySelector(".mh-btview__draft").textContent).toBe("Draft");
    expect(cardTitles().every((t) => !t.includes("Other Staged Term"))).toBe(true);
    expect(cards().length).toBe(7);
  });

  it("normalises stage-less drafts: status Disable becomes Draft, and a stage-less other-user draft stays visible", () => {
    /* The original's visibility check runs on the RAW draft
       (`item.stage !== "Draft" || creator === "Current User"`), so an
       other-user draft with no stage is shown; normalisation then derives
       stage "Draft" from status "Disable". */
    renderView({
      drafts: [
        { id: "d-nostage", title: "Stageless Mine", status: "Disable", creator: "Current User", synonyms: [] },
        { id: "d-nostage-other", title: "Stageless Theirs", status: "Disable", creator: "Emily Wang", synonyms: [] },
      ],
    });
    const titles = cardTitles();
    expect(titles[0]).toContain("Stageless Mine");
    expect(titles[1]).toContain("Stageless Theirs");
    expect(cards()[0].querySelector(".mh-btview__draft").textContent).toBe("Draft");
    expect(cards()[1].querySelector(".mh-btview__draft").textContent).toBe("Draft");
    expect(cards().length).toBe(8);
  });

  it("opens the detail drawer on Enter and closes on Escape", () => {
    renderView();
    const card = cards()[0];
    fireEvent.keyDown(card, { key: "Enter" });
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Business Term", { selector: ".mh-modal__eyebrow" })).toBeTruthy();
    expect(within(dialog).getByText("Term Type")).toBeTruthy();
    expect(within(dialog).getByText("D2C Insight")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps the filter disclosure open after toggling", () => {
    renderView();
    const summary = screen.getByText("All statuses");
    fireEvent.click(summary);
    const details = summary.closest("details");
    expect(details.open).toBe(true);
    fireEvent.click(screen.getByLabelText("Disabled"));
    expect(details.open).toBe(true);
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
    expect(within(b).queryByText("GMV (Gross Merchandise Value)")).toBeNull();
    expect(within(b).queryByText("Add Business Term")).toBeNull();
    expect(within(b).getByText("Add Alt Term")).toBeTruthy();
    /* the alt draft is unshifted ahead of its records */
    expect(b.querySelector(".mh-btview__card h3").textContent).toContain("Alt Draft Term");

    /* Disable a term in A — B's rows and pills stay untouched. */
    fireEvent.click(within(a).getByRole("button", { name: "Disable GMV (Gross Merchandise Value)" }));
    fireEvent.click(within(a).getByRole("button", { name: "Confirm Offline" }));
    expect(within(b).queryByRole("dialog")).toBeNull();
    expect(within(b).getAllByText("Alt Off").length).toBe(2); // alt-beta + the alt draft are both disabled
    expect(within(b).getAllByText("Alt On").length).toBe(1); // alt-alpha still enabled

    /* Search in B does not change A. */
    fireEvent.change(within(b).getByLabelText("Alt search"), { target: { value: "beta" } });
    expect(within(b).getAllByRole("article").length).toBe(1);
    expect(within(a).getAllByRole("article").length).toBe(6);
  });
});
