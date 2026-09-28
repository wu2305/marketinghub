import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ItemActions } from "../ItemActions/index.jsx";
import { LibraryEmpty } from "../LibraryEmpty/index.jsx";
import { LibraryItem } from "../LibraryItem/index.jsx";
import { LibraryList } from "./index.jsx";
import { LibraryToolbar } from "../LibraryToolbar/index.jsx";
import { governedActions } from "../../lib/governance.js";

const me = "Current User";

describe("ItemActions", () => {
  it("keeps blocked actions operable and reports the reason", () => {
    const onAction = vi.fn();
    render(<ItemActions id="x" name="GMV" actions={governedActions({ creator: me, status: "Enable" }, { currentUser: me })} onAction={onAction} />);
    const edit = screen.getByRole("button", { name: "Edit GMV" });
    expect(edit.getAttribute("aria-disabled")).toBe("true");
    expect(edit.hasAttribute("disabled")).toBe(false);
    expect(edit.getAttribute("title")).toBe("Disable knowledge first");
    fireEvent.click(edit);
    expect(onAction).toHaveBeenCalledWith({ action: "edit", id: "x", blocked: true, reason: "disable-first" });
    expect(screen.getByRole("button", { name: "Disable GMV" }).hasAttribute("aria-disabled")).toBe(false);
  });
});

describe("LibraryItem", () => {
  it("opens from the title or the card, not from its actions", () => {
    const onOpen = vi.fn();
    const onAction = vi.fn();
    const { container } = render(
      <LibraryItem id="x" title="GMV" draft description="Gross value" meta={[{ label: "Domain", value: "Sales" }]}
        actions={{ actions: governedActions({ creator: me, status: "Disable" }, { currentUser: me }) }}
        onOpen={onOpen} onAction={onAction} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "GMV" }));
    fireEvent.click(container.querySelector(".mh-library-item__description"));
    expect(onOpen).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole("button", { name: "Delete GMV" }));
    expect(onOpen).toHaveBeenCalledTimes(2);
    expect(onAction).toHaveBeenCalledWith({ action: "delete", id: "x", blocked: false, reason: null });
    expect(screen.getByText("Draft")).toBeTruthy();
    expect(screen.getByText("Domain")).toBeTruthy();
  });

  it("marks the selected item on its title button", () => {
    const { container, rerender } = render(<LibraryItem id="x" title="GMV" />);
    expect(screen.getByRole("button", { name: "GMV" }).hasAttribute("aria-current")).toBe(false);
    rerender(<LibraryItem id="x" title="GMV" selected />);
    expect(screen.getByRole("button", { name: "GMV" }).getAttribute("aria-current")).toBe("true");
    expect(container.querySelector(".mh-library-item--selected")).toBeTruthy();
  });
});

describe("LibraryList", () => {
  it("gives an expanded card the full row without passing the flag on", () => {
    render(<LibraryList label="Principles" items={[{ id: "a", title: "Alpha" }, { id: "b", title: "Beta", expanded: true }]} />);
    const [first, second] = within(screen.getByRole("list", { name: "Principles" })).getAllByRole("listitem");
    expect(first.className).toBe("");
    expect(second.className).toBe("mh-library-list__item--expanded");
    expect(second.querySelector("[expanded]")).toBeNull();
  });

  it("renders cards, a table, or the empty state with its clear action", () => {
    const onClear = vi.fn();
    const { rerender } = render(<LibraryList label="Terms" items={[{ id: "a", title: "Alpha" }]} />);
    expect(within(screen.getByRole("list", { name: "Terms" })).getAllByRole("listitem")).toHaveLength(1);
    rerender(<LibraryList label="Models" layout="table" columns={[{ key: "title", header: "Name" }]} rows={[{ id: "a", title: "Alpha" }]} />);
    expect(screen.getByRole("table")).toBeTruthy();
    rerender(<LibraryList label="Terms" items={[]} empty={{ title: "No matching terms" }} onClear={onClear} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onClear).toHaveBeenCalledWith({ kind: "no-results" });
  });
});

describe("LibraryEmpty", () => {
  it("hides the clear action when the collection is simply empty", () => {
    render(<LibraryEmpty kind="empty" title="Nothing yet" onClear={() => {}} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("LibraryToolbar", () => {
  it("reports search, facets and tabs through one onChange and always shows the count", () => {
    const onChange = vi.fn();
    render(
      <LibraryToolbar
        search={{ label: "Search terms", value: "" }}
        facets={[{ id: "type", label: "Type", kind: "single", options: [{ id: "PR", label: "Principles" }], selected: "" }]}
        tabs={{ label: "Review status", value: "pending", items: [{ id: "pending", label: "Pending" }, { id: "rejected", label: "Rejected" }] }}
        count="6 items"
        create={{ label: "Add term", href: "#create" }}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByRole("searchbox", { name: "Search terms" }), { target: { value: "gmv" } });
    expect(onChange).toHaveBeenLastCalledWith({ field: "search", value: "gmv" });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "PR" } });
    expect(onChange).toHaveBeenLastCalledWith({ field: "type", value: "PR" });
    fireEvent.click(screen.getByRole("tab", { name: "Rejected" }));
    expect(onChange).toHaveBeenLastCalledWith({ field: "tab", value: "rejected" });
    expect(screen.getByText("6 items")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Add term" }).getAttribute("href")).toBe("#create");
  });
});
