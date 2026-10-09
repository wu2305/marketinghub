/**
 * Every rule that plays an animation must have a matching
 * `animation: none` rule inside a prefers-reduced-motion block in the same
 * stylesheet (the long-travel drawer slide, toast rise and blinking cursor
 * included). Rules are matched per element: the last compound selector, so
 * `.a .b` and `.a--x .b` are covered by a guard on `.b`.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cssFiles, withoutComments } from "../../scripts/css-metrics.mjs";

const ROOT = path.resolve(__dirname);

/** Flat list of { selectors, body, reduced } for every rule, nesting-aware. */
function rulesOf(css) {
  const rules = [];
  const stack = [];
  let start = 0;
  for (let i = 0; i < css.length; i += 1) {
    if (css[i] === "{") {
      stack.push({ head: css.slice(start, i).trim(), bodyStart: i + 1 });
      start = i + 1;
    } else if (css[i] === "}") {
      const open = stack.pop();
      if (open && !open.head.startsWith("@")) {
        const reduced = stack.some((outer) => /^@media[^{]*prefers-reduced-motion:\s*reduce/.test(outer.head));
        const inKeyframes = stack.some((outer) => /^@(-\w+-)?keyframes/.test(outer.head));
        if (!inKeyframes) rules.push({ selectors: open.head.split(",").map((item) => item.trim()), body: css.slice(open.bodyStart, i), reduced });
      }
      start = i + 1;
    } else if (css[i] === ";" && stack.length === 0) {
      start = i + 1;
    }
  }
  return rules;
}

const target = (selector) => selector.split(/\s+|>|\+|~/).filter(Boolean).pop();
const playsAnimation = (body) => /(^|[\s;])animation(-name)?:\s*(?!none\b)[^;]+/.test(body);
const stopsAnimation = (body) => /(^|[\s;])animation(-name)?:\s*none\b/.test(body);

describe("reduced motion", () => {
  it("every animated element has an animation: none guard in prefers-reduced-motion", () => {
    const missing = [];
    for (const file of cssFiles(ROOT)) {
      const rules = rulesOf(withoutComments(fs.readFileSync(file, "utf8")));
      const guarded = new Set(rules.filter((rule) => rule.reduced && stopsAnimation(rule.body)).flatMap((rule) => rule.selectors.map(target)));
      for (const rule of rules) {
        if (rule.reduced || !playsAnimation(rule.body)) continue;
        for (const selector of rule.selectors) {
          if (!guarded.has(target(selector))) missing.push(`${path.relative(ROOT, file)}: ${selector}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
