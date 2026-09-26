import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "./index.jsx";

const columns = [{ key: "name", header: "Name" }, { key: "action", header: "Action" }];
const rows = [{ id: "a", name: "Alpha", action: <button type="button">Delete</button> }];

describe("DataTable", () => {
  it("opens a row from its title button or the row, but not from other controls", () => {
    const onOpen = vi.fn();
    render(<DataTable columns={columns} rows={rows} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: "Alpha" }));
    expect(onOpen).toHaveBeenLastCalledWith({ id: "a" });
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onOpen).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getAllByRole("row")[1]);
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it("labels cells for the stacked narrow layout and shows the empty state", () => {
    const { container, rerender } = render(<DataTable columns={columns} rows={rows} />);
    expect(container.querySelector("td").dataset.label).toBe("Name");
    expect(screen.queryByRole("button", { name: "Alpha" })).toBeNull();
    rerender(<DataTable columns={columns} rows={[]} emptyState="Nothing here" />);
    expect(screen.getByText("Nothing here").getAttribute("colspan")).toBe("2");
  });
});
