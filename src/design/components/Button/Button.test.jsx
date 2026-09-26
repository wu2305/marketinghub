import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./index.jsx";

describe("Button as link", () => {
  it("renders a link that still reports clicks", () => {
    const onClick = vi.fn();
    render(<Button href="#create" onClick={onClick}>Add term</Button>);
    const link = screen.getByRole("link", { name: "Add term" });
    expect(link.getAttribute("href")).toBe("#create");
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledWith({ label: "Add term" });
  });

  it("drops the href and the callback when disabled", () => {
    const onClick = vi.fn();
    const { container } = render(<Button href="#create" disabled onClick={onClick}>Add term</Button>);
    const link = container.querySelector("a");
    expect(link.hasAttribute("href")).toBe(false);
    expect(link.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});
