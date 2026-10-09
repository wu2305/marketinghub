import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./index.jsx";

const items = [
  { id: "a", label: "A" },
  { id: "b", label: "B", disabled: true },
  { id: "c", label: "C" },
];

describe("Tabs keyboard", () => {
  it("makes the selected tab the only Tab stop", () => {
    render(<Tabs label="Views" items={items} value="c" />);
    expect(screen.getAllByRole("tab").map((tab) => tab.tabIndex)).toEqual([-1, -1, 0]);
  });

  it("falls back to the first enabled tab when nothing is selected", () => {
    render(<Tabs label="Views" items={items} />);
    expect(screen.getAllByRole("tab").map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
  });

  it("moves focus and selection with arrows, skipping disabled tabs and wrapping", () => {
    const onChange = vi.fn();
    render(<Tabs label="Views" items={items} value="a" onChange={onChange} />);
    const [a, , c] = screen.getAllByRole("tab");
    a.focus();
    fireEvent.keyDown(a, { key: "ArrowRight" });
    expect(document.activeElement).toBe(c);
    expect(onChange).toHaveBeenLastCalledWith({ id: "c", label: "C" });
    fireEvent.keyDown(c, { key: "ArrowRight" });
    expect(document.activeElement).toBe(a);
    fireEvent.keyDown(a, { key: "End" });
    expect(document.activeElement).toBe(c);
    fireEvent.keyDown(c, { key: "Home" });
    expect(document.activeElement).toBe(a);
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it("leaves other keys alone", () => {
    const onChange = vi.fn();
    render(<Tabs label="Views" items={items} value="a" onChange={onChange} />);
    fireEvent.keyDown(screen.getAllByRole("tab")[0], { key: "ArrowDown" });
    expect(onChange).not.toHaveBeenCalled();
  });
});
