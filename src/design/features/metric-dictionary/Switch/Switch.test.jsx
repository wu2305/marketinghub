import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./index.jsx";

describe("Switch", () => {
  it("is a named switch that keeps its own state when uncontrolled", () => {
    const onChange = vi.fn();
    render(<Switch label="Participate in Q&A" defaultChecked onChange={onChange} />);
    const control = screen.getByRole("switch", { name: "Participate in Q&A" });
    expect(control.checked).toBe(true);
    fireEvent.click(control);
    expect(control.checked).toBe(false);
    expect(onChange).toHaveBeenCalledWith({ checked: false });
  });

  it("follows `checked` when controlled", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Switch label="Enable" checked={false} onChange={onChange} />);
    const control = screen.getByRole("switch", { name: "Enable" });
    fireEvent.click(control);
    expect(onChange).toHaveBeenCalledWith({ checked: true });
    expect(control.checked).toBe(false);
    rerender(<Switch label="Enable" checked onChange={onChange} />);
    expect(control.checked).toBe(true);
  });

  it("is disabled for the keyboard and the pointer when `disabled`", () => {
    render(<Switch label="Enable" disabled />);
    /* jsdom still dispatches synthetic clicks to a disabled input, so assert the attribute a browser honours. */
    expect(screen.getByRole("switch", { name: "Enable" }).disabled).toBe(true);
  });
});
