import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./index.jsx";

const items = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta", disabled: true },
  { id: "c", label: "Gamma" },
];

describe("Tabs keyboard model", () => {
  it("makes only the selected tab a Tab stop", () => {
    render(<Tabs label="Sections" items={items} value="c" />);
    expect(screen.getAllByRole("tab").map((tab) => tab.tabIndex)).toEqual([-1, -1, 0]);
  });

  it("falls back to the first enabled tab when nothing is selected", () => {
    render(<Tabs label="Sections" items={items} />);
    expect(screen.getAllByRole("tab").map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
  });

  it("falls back to the first enabled tab when the selected tab is disabled", () => {
    const { rerender } = render(<Tabs label="Sections" items={items} value="c" />);
    expect(screen.getAllByRole("tab").map((tab) => tab.tabIndex)).toEqual([-1, -1, 0]);
    rerender(<Tabs label="Sections" items={items.map((item) => (item.id === "c" ? { ...item, disabled: true } : item))} value="c" />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
    // the Tab stop is something the keyboard can actually reach
    expect(tabs.filter((tab) => tab.tabIndex === 0 && !tab.disabled)).toHaveLength(1);
  });

  it("moves focus and selection with arrows, skipping disabled tabs and wrapping", () => {
    const onChange = vi.fn();
    render(<Tabs label="Sections" items={items} value="a" onChange={onChange} />);
    const [alpha, , gamma] = screen.getAllByRole("tab");
    fireEvent.keyDown(alpha, { key: "ArrowRight" });
    expect(document.activeElement).toBe(gamma);
    expect(onChange).toHaveBeenLastCalledWith({ id: "c", label: "Gamma" });
    fireEvent.keyDown(gamma, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith({ id: "a", label: "Alpha" });
    fireEvent.keyDown(alpha, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith({ id: "c", label: "Gamma" });
  });

  it("jumps to the first and last enabled tab with Home and End", () => {
    const onChange = vi.fn();
    render(<Tabs label="Sections" items={items} value="a" onChange={onChange} />);
    const [alpha, , gamma] = screen.getAllByRole("tab");
    fireEvent.keyDown(alpha, { key: "End" });
    expect(document.activeElement).toBe(gamma);
    fireEvent.keyDown(gamma, { key: "Home" });
    expect(document.activeElement).toBe(alpha);
    expect(onChange).toHaveBeenLastCalledWith({ id: "a", label: "Alpha" });
  });
});
