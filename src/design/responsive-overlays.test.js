/**
 * jsdom has no layout, so the phone-width geometry of the Report Copilot is asserted in the paired
 * visual-check scenario `p02-copilot-mobile` (390px). This guards the three rules that scenario relies on,
 * so a stylesheet edit cannot drop them unnoticed between browser runs.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { withoutComments } from "../../scripts/css-metrics.mjs";

const css = withoutComments(fs.readFileSync(path.resolve(__dirname, "features/cockpit/ReportCopilot/ReportCopilot.css"), "utf8")).replace(/\s+/g, " ");

describe("Report Copilot at phone width", () => {
  it("docks full-screen under 760px", () => {
    expect(css).toMatch(/\.mh-copilot \{[^{}]*?width: min\(40vw, 576px, calc\(100vw - 80px\)\);[\s\S]*?@media \(max-width: 760px\) \{ width: 100vw; max-width: 100vw; border-left: 0; \}/);
  });

  it("keeps the recent-chats popup inside the screen", () => {
    expect(css).toMatch(/\.mh-copilot__history \{[\s\S]*?@media \(max-width: 760px\) \{ right: 0; width: min\(360px, calc\(100vw - 48px\)\); \}/);
  });

  it("lets the composer textarea shrink below 380px", () => {
    expect(css).toContain("min-width: min(380px, 100%);");
    expect(css).not.toContain("min-width: 380px;");
  });
});
