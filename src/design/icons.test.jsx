import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon, iconNames } from "./icons.jsx";

describe("Icon registry", () => {
  it.each(iconNames)("%s renders an svg", (name) => {
    const { container } = render(<Icon name={name} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders nothing for an unregistered name", () => {
    const { container } = render(<Icon name="no-such-icon" />);
    expect(container.querySelector("svg")).toBeNull();
  });
});
