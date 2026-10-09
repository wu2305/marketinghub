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

/* Same for the shared overlays (`ModelFlowDialog`, skill menu): the paired `p02-copilot-skill-flow-mobile`
   scenario measures them at 390px; these keep the two rules it depends on. */
const flowCss = withoutComments(fs.readFileSync(path.resolve(__dirname, "components/ModelFlowDialog/ModelFlowDialog.css"), "utf8")).replace(/\s+/g, " ");
const skillCss = withoutComments(fs.readFileSync(path.resolve(__dirname, "lib/SkillMenu/SkillMenu.css"), "utf8")).replace(/\s+/g, " ");

describe("Model dialog and skill menu at phone width", () => {
  it("sizes the dialog card's single column to the card, not to its widest button row", () => {
    expect(flowCss).toMatch(/\.mh-flow__card \{[^{}]*?grid-template-columns: minmax\(0, 1fr\);/);
  });

  it("lets the dialog footer buttons wrap", () => {
    expect(flowCss).toMatch(/\.mh-flow__foot \{[^{}]*?flex-wrap: wrap;/);
  });

  it("lets the skill menu footer actions shrink to the panel", () => {
    expect(skillCss).toMatch(/\.mh-skill__footer \{[^{}]*?grid-template-columns: minmax\(0, 1fr\);/);
  });
});
