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

/**
 * Flat list of { selectors, body, reduced } for every rule. Native CSS nesting is resolved: a nested
 * rule's selectors have `&` replaced by (or are prefixed with) the enclosing selectors, `body` holds only
 * the rule's own declarations, and declarations inside a `@media (prefers-reduced-motion)` nested in a
 * rule count as that rule's reduced-motion declarations.
 */
function rulesOf(css) {
  const rules = [];
  const stack = [];
  let start = 0;
  const frame = (head, bodyStart) => {
    const outer = [...stack].reverse().find((item) => item.selectors);
    const selectors = head.startsWith("@") ? null : head.split(",").map((item) => item.trim()).flatMap((part) => (
      outer ? outer.selectors.map((parent) => (part.includes("&") ? part.replaceAll("&", parent) : `${parent} ${part}`)) : [part]
    ));
    return { head, selectors, direct: "", from: bodyStart };
  };
  for (let i = 0; i < css.length; i += 1) {
    if (css[i] === "{") {
      const top = stack.at(-1);
      if (top) top.direct += css.slice(top.from, start);
      stack.push(frame(css.slice(start, i).trim(), i + 1));
      start = i + 1;
    } else if (css[i] === "}") {
      const open = stack.pop();
      open.direct += css.slice(open.from, i);
      const reducedAt = (item) => /^@media[^{]*prefers-reduced-motion:\s*reduce/.test(item.head);
      const reduced = reducedAt(open) || stack.some(reducedAt);
      const inKeyframes = stack.some((outer) => /^@(-\w+-)?keyframes/.test(outer.head)) || /^@(-\w+-)?keyframes/.test(open.head);
      const owner = open.selectors ? open : [...stack].reverse().find((item) => item.selectors);
      if (!inKeyframes && owner && (open.selectors || reducedAt(open))) {
        rules.push({ selectors: owner.selectors, body: open.direct, reduced });
      }
      const top = stack.at(-1);
      if (top) top.from = i + 1;
      start = i + 1;
    } else if (css[i] === ";") {
      start = i + 1;
    }
  }
  return rules;
}

const target = (selector) => selector.split(/\s+|>|\+|~/).filter(Boolean).pop();
const playsAnimation = (body) => /(^|[\s;])animation(-name)?:\s*(?!none\b)[^;]+/.test(body);
const stopsAnimation = (body) => /(^|[\s;])animation(-name)?:\s*none\b/.test(body);

/** Selectors that play an animation but have no `animation: none` guard under prefers-reduced-motion. */
function unguarded(css) {
  const rules = rulesOf(css);
  const guarded = new Set(rules.filter((rule) => rule.reduced && stopsAnimation(rule.body)).flatMap((rule) => rule.selectors.map(target)));
  return rules
    .filter((rule) => !rule.reduced && playsAnimation(rule.body))
    .flatMap((rule) => rule.selectors)
    .filter((selector) => !guarded.has(target(selector)));
}

describe("reduced motion", () => {
  it("every animated element has an animation: none guard in prefers-reduced-motion", () => {
    const missing = [];
    for (const file of cssFiles(ROOT)) {
      for (const selector of unguarded(withoutComments(fs.readFileSync(file, "utf8")))) missing.push(`${path.relative(ROOT, file)}: ${selector}`);
    }
    expect(missing).toEqual([]);
  });

  it("follows native CSS nesting", () => {
    const guard = "@media (prefers-reduced-motion: reduce) { .a::after { animation: none; } }";
    // a nested animated rule is attributed to its resolved selector, not to the parent that merely contains it
    expect(unguarded(".a { color: red; &::after { animation: spin 1s infinite; } }")).toEqual([".a::after"]);
    expect(unguarded(`.a { color: red; &::after { animation: spin 1s infinite; } } ${guard}`)).toEqual([]);
    expect(unguarded(`.a { .b { animation: spin 1s; } } @media (prefers-reduced-motion: reduce) { .a { .b { animation: none; } } }`)).toEqual([]);
    // a guard nested inside the rule counts for that rule
    expect(unguarded(".a { animation: spin 1s; @media (prefers-reduced-motion: reduce) { animation: none; } }")).toEqual([]);
    // keyframe steps are not rules
    expect(unguarded("@keyframes spin { 50% { opacity: 0; } to { animation-name: x; } }")).toEqual([]);
  });
});
