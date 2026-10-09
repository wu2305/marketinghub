import { describe, expect, it } from "vitest";
import { confirmDialogTokens, confirmDialogVariants } from "./confirm-dialog-tokens.js";

const channel = (hex, at) => parseInt(hex.slice(at, at + 2), 16) / 255;
const linear = (value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
const luminance = (hex) => 0.2126 * linear(channel(hex, 1)) + 0.7152 * linear(channel(hex, 3)) + 0.0722 * linear(channel(hex, 5));
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("ConfirmDialog palette contrast", () => {
  it("parses a known pair", () => {
    expect(contrast("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
    // the first-approved gold failed: guard the checker itself
    expect(contrast("#FFFFFF", "#CF8A20")).toBeLessThan(4.5);
  });

  for (const [variant, colors] of Object.entries(confirmDialogVariants)) {
    it(`${variant}: confirm label is at least 4.5:1 on its button (14px bold is not large text)`, () => {
      expect(contrast(colors.confirmColor, colors.confirmBackground)).toBeGreaterThanOrEqual(4.5);
    });

    it(`${variant}: icon is at least 3:1 on its wash`, () => {
      expect(contrast(colors.iconColor, colors.iconBackground)).toBeGreaterThanOrEqual(3);
    });
  }

  it("Cancel label and body text clear 4.5:1 on white", () => {
    expect(contrast(confirmDialogTokens.cancelButton.color, confirmDialogTokens.cancelButton.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(confirmDialogTokens.title.color, confirmDialogTokens.dialog.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(confirmDialogTokens.description.color, confirmDialogTokens.dialog.background)).toBeGreaterThanOrEqual(4.5);
  });
});
