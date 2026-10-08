/**
 * Every stylesheet that plays an animation must switch it off under
 * prefers-reduced-motion (the long-travel drawer slide, toast rise and
 * blinking cursor included). Per file, not per rule: a new animated component
 * needs its own guard in its own CSS.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cssFiles, withoutComments } from "../../scripts/css-metrics.mjs";

const ROOT = path.resolve(__dirname);
const read = (file) => withoutComments(fs.readFileSync(file, "utf8"));
const animated = (css) => /(^|[\s;{])animation(-name)?:\s*(?!none\b)[^;}]+/m.test(css);
const guarded = (css) => /@media\s*\(prefers-reduced-motion:\s*reduce\)[^{]*\{[\s\S]*?animation:\s*none/.test(css);

describe("reduced motion", () => {
  it("every animated stylesheet has an animation: none guard", () => {
    const missing = cssFiles(ROOT)
      .filter((file) => animated(read(file)) && !guarded(read(file)));
    expect(missing).toEqual([]);
  });
});
