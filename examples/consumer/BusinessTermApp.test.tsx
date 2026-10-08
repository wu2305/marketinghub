/* Drives the consumer-built Business Term workspace through the demo's visible
 * behaviour (WP5 item 1). `npm test` resolves "marketing-hub" to the source
 * entries; `build:lib` re-runs this file against dist/. */
import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BusinessTermApp } from "./BusinessTermApp.tsx";

window.HTMLElement.prototype.scrollTo ??= () => {};

const cards = (root: HTMLElement = document.body) => [...root.querySelectorAll(".mh-btview .mh-library-item")] as HTMLElement[];
const titles = (root?: HTMLElement) => cards(root).map((card) => card.querySelector(".mh-library-item__title button")?.textContent);
const card = (title: string, root?: HTMLElement) => {
  const found = cards(root).find((item) => item.querySelector(".mh-library-item__title button")?.textContent === title);
  if (!found) throw new Error(`no card "${title}" in ${JSON.stringify(titles(root))}`);
  return found;
};
const toast = (root: HTMLElement = document.body) => [...root.querySelectorAll(".mh-toast:not([hidden])")].map((node) => node.textContent).join(" | ");
const dialog = () => screen.getByRole("dialog");
const press = (name: string | RegExp, root: HTMLElement = document.body) => fireEvent.click(within(root).getByRole("button", { name }));
const addTerm = () => fireEvent.click(screen.getByRole("link", { name: /Add Business Term/ }));
const fill = (name: string, value: string) => {
  const field = document.querySelector(`[name="${name}"]`) as HTMLInputElement;
  fireEvent.change(field, { target: { value } });
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("consumer-built Business Term workspace", () => {
  it("renders the demo's library: seed cards, count, filters and the Add link", () => {
    render(<BusinessTermApp />);
    expect(titles()).toHaveLength(6);
    expect(document.querySelector(".mh-btview")?.textContent).toContain("Showing 6 of 6 terms");
    expect(screen.getByRole("link", { name: /Add Business Term/ })).toBeTruthy();
  });

  it("opens other knowledge types without crashing, including Data Models", () => {
    render(<BusinessTermApp />);
    for (const name of [/Principles/, /Data Models/, /Metric Dictionary/]) {
      fireEvent.click(screen.getByRole("button", { name }));
      expect(document.querySelector(".mh-interpreter__main--type")).toBeTruthy();
    }
  });

  it("searches and filters like the demo", () => {
    render(<BusinessTermApp />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "turnover" } });
    expect(titles()).toEqual(["Revenue"]);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("checkbox", { name: "Emily Wang" }));
    expect(titles()).toEqual(["Paid Customer"]);
  });

  it("opens the detail drawer from a card", () => {
    render(<BusinessTermApp />);
    press("Paid Customer", card("Paid Customer"));
    expect(within(dialog()).getByText("A customer who completed at least one valid paid order during the selected period.")).toBeTruthy();
    press(/Close details/, dialog());
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("explains a blocked action instead of doing it", () => {
    render(<BusinessTermApp />);
    press("Delete Paid Customer");
    expect(within(dialog()).getByText("Permission denied")).toBeTruthy();
    fireEvent.click(within(dialog()).getByText("Close", { selector: "button" }));
    expect(titles()).toContain("Paid Customer");
  });

  it("disables after confirmation, then shows the toast and the Disabled pill", () => {
    render(<BusinessTermApp />);
    press("Disable GMV (Gross Merchandise Value)");
    expect(within(dialog()).getByText("Please confirm whether to offline this knowledge.")).toBeTruthy();
    press("Confirm Offline", dialog());
    expect(toast()).toContain("Disabled successfully");
    expect(card("GMV (Gross Merchandise Value)").textContent).toContain("Disabled");
    act(() => vi.advanceTimersByTime(3000));
    expect(toast()).toBe("");
  });

  it("deletes an enabled term through Go Offline then Confirm Delete", () => {
    render(<BusinessTermApp />);
    press("Delete Revenue");
    press("Go Offline", dialog());
    expect(within(dialog()).getByText(/Deletion cannot be undone/)).toBeTruthy();
    press("Confirm Delete", dialog());
    expect(titles()).not.toContain("Revenue");
    expect(toast()).toContain("Deleted successfully");
  });

  it("Add → Save validates, then shows the new card first with its Draft badge", () => {
    render(<BusinessTermApp />);
    addTerm();
    expect(document.querySelector('.mh-kcreate[data-kc-type="Business Term"][data-kc-mode="create"]')).toBeTruthy();
    press("Save");
    expect(document.querySelectorAll('[aria-invalid="true"]').length).toBe(2);
    fill("title", "Repeat Buyer");
    fill("description", "A customer with two or more paid orders in the period.");
    fill("synonyms", "Returning Customer, Loyal Buyer");
    press("Save");
    expect(titles()[0]).toBe("Repeat Buyer");
    expect(card("Repeat Buyer").querySelector(".mh-library-item__draft")?.textContent).toBe("Draft");
    expect(card("Repeat Buyer").textContent).toContain("Returning Customer");
    expect(titles()).toHaveLength(7);
  });

  it("Edit → Save updates that card without duplicating it", () => {
    render(<BusinessTermApp />);
    press("Disable GMV (Gross Merchandise Value)");
    press("Confirm Offline", dialog());
    press("Edit GMV (Gross Merchandise Value)");
    const title = document.querySelector('[name="title"]') as HTMLInputElement;
    expect(title.value).toBe("GMV (Gross Merchandise Value)");
    expect((document.querySelector('[name="synonyms"]') as HTMLInputElement).value).toBe("Gross Sales, Merchandise Value, Gross Merchandise Sales");
    fill("description", "Edited description.");
    press("Save");
    expect(titles()).toHaveLength(6);
    expect(titles().filter((item) => item === "GMV (Gross Merchandise Value)")).toHaveLength(1);
    expect(card("GMV (Gross Merchandise Value)").textContent).toContain("Edited description.");
  });

  it("Cancel leaves the library unchanged", () => {
    render(<BusinessTermApp />);
    const before = titles();
    addTerm();
    fill("title", "Never saved");
    press("Cancel");
    expect(titles()).toEqual(before);
  });

  it("Submit keeps the record and announces the review", () => {
    render(<BusinessTermApp />);
    addTerm();
    fill("title", "Submitted term");
    fill("description", "Goes to review.");
    press("Submit");
    expect(titles()).toContain("Submitted term");
    expect(toast()).toContain("Submitted for review");
  });

  it("keeps two instances independent", () => {
    const { container: first } = render(<BusinessTermApp />);
    const { container: second } = render(<BusinessTermApp terms={[]} />);
    expect(titles(first)).toHaveLength(6);
    expect(titles(second)).toHaveLength(0);
    press("Disable GMV (Gross Merchandise Value)", first);
    press("Confirm Offline", dialog());
    expect(card("GMV (Gross Merchandise Value)", first).textContent).toContain("Disabled");
    expect(toast(second)).toBe("");
  });
});
