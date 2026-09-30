import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeedbackQualityPage } from "./index.jsx";
import { useFeedbackQualityDemo } from "../../demo/feedback-quality-demo.js";

const NOW = Date.UTC(2026, 8, 26, 12);
const hrefFor = () => "#";

function Host({ tabs }) {
  const props = useFeedbackQualityDemo({ now: NOW, tabs });
  return <FeedbackQualityPage {...props} hrefFor={hrefFor} />;
}

const tabLabels = () => screen.queryAllByRole("tab").map((tab) => tab.textContent.replace(/\s*\d+$/, ""));

describe("FeedbackQualityPage visible tabs (FQ-01a)", () => {
  it("shows all three tabs by default", () => {
    render(<Host />);
    expect(tabLabels()).toHaveLength(3);
  });

  it("renders only the listed tabs", () => {
    render(<Host tabs={["all", "thumbs-down"]} />);
    const labels = tabLabels();
    expect(labels).toHaveLength(2);
    expect(labels.join(" ")).not.toMatch(/up/i);
  });

  it("drops the tab row when none is left", () => {
    render(<Host tabs={[]} />);
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(screen.queryByRole("tablist")).toBeNull();
  });
});
