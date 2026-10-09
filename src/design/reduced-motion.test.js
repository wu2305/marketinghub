/**
 * Every rule that plays an animation must have a matching rule inside a
 * prefers-reduced-motion block in the same stylesheet that either sets
 * `animation: none` or swaps in an opacity-only keyframe (the long-travel
 * drawer slide, toast rise and blinking cursor included). Rules are matched
 * per element: the last compound selector, so a guard on `.b` covers `.a .b`
 * only if it is at least as specific (a `.b` guard loses to `.a--x .b` at 0,2,0)
 * and, when equally specific, comes later in the file.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cssFiles, withoutComments } from "../../scripts/css-metrics.mjs";

const ROOT = path.resolve(__dirname);

/**
 * Flat list of { selectors, body, reduced } for every rule. Native CSS nesting is resolved: a nested
 * rule's selectors have `&` replaced by (or are prefixed with) the enclosing selectors, `body` holds only
 * the rule's own declarations, and declarations inside an at-rule nested in a rule (`@media`, `@supports`)
 * count as that rule's, reduced-motion ones as its reduced-motion declarations.
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
    return { head, selectors, direct: "", from: bodyStart, at: start };
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
      if (!inKeyframes && owner && (open.selectors || open.head.startsWith("@"))) {
        rules.push({ selectors: owner.selectors, body: open.direct, reduced, at: open.at });
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

const splitTop = (text) => {
  const parts = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "(") depth += 1;
    else if (text[i] === ")") depth -= 1;
    else if (text[i] === "," && depth === 0) {
      parts.push(text.slice(from, i));
      from = i + 1;
    }
  }
  return [...parts, text.slice(from)].map((part) => part.trim()).filter(Boolean);
};

/** [ids, classes/attributes/pseudo-classes, elements/pseudo-elements] of a complex selector. */
function specificity(selector) {
  const compare = (x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  let rest = selector;
  const total = [0, 0, 0];
  for (;;) {
    const match = /:(where|is|not|has|matches)\(/.exec(rest);
    if (!match) break;
    const innerFrom = match.index + match[0].length;
    let depth = 1;
    let end = innerFrom;
    for (; end < rest.length && depth; end += 1) depth += rest[end] === "(" ? 1 : rest[end] === ")" ? -1 : 0;
    if (match[1] !== "where") {
      const widest = splitTop(rest.slice(innerFrom, end - 1)).map(specificity).sort(compare).at(-1) || [0, 0, 0];
      widest.forEach((count, at) => { total[at] += count; });
    }
    rest = rest.slice(0, match.index) + rest.slice(end);
  }
  rest = rest.replace(/\[[^\]]*\]/g, () => { total[1] += 1; return ""; });
  rest = rest.replace(/::?[\w-]+(\([^)]*\))?/g, (found) => {
    total[found.startsWith("::") || /^:(before|after|first-line|first-letter)$/.test(found) ? 2 : 1] += 1;
    return "";
  });
  rest = rest.replace(/#[\w-]+/g, () => { total[0] += 1; return ""; });
  rest = rest.replace(/\.[\w-]+/g, () => { total[1] += 1; return ""; });
  total[2] += (rest.match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) || []).length;
  return total;
}
const compareSpecificity = (x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];

const TIMING_WORDS = new Set(["ease", "ease-in", "ease-out", "ease-in-out", "linear", "infinite", "normal", "reverse", "alternate", "alternate-reverse", "forwards", "backwards", "both", "none", "running", "paused", "step-start", "step-end"]);

/** Every keyframe name an `animation` / `animation-name` declaration in `body` plays, across comma-separated lists. */
function animationNames(body) {
  const names = [];
  for (const match of body.matchAll(/(^|[\s;])animation(?:-name)?:\s*([^;]+)/g)) {
    for (const item of splitTop(match[2])) {
      for (const token of item.replace(/\([^)]*\)/g, "").split(/\s+/)) {
        if (/^[a-zA-Z_][\w-]*$/.test(token) && !TIMING_WORDS.has(token)) names.push(token);
      }
    }
  }
  return names;
}

/** Keyframe names whose every definition only touches opacity: the reduced-motion replacement for a movement animation. */
function fadeOnlyKeyframes(css) {
  const verdicts = new Map();
  for (const match of css.matchAll(/@(?:-\w+-)?keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g)) {
    const declared = [...match[2].matchAll(/([\w-]+)\s*:/g)].map((item) => item[1]);
    verdicts.set(match[1], (verdicts.get(match[1]) ?? true) && declared.length > 0 && declared.every((property) => property === "opacity"));
  }
  return new Set([...verdicts].filter(([, fadeOnly]) => fadeOnly).map(([name]) => name));
}

/** Selectors that play an animation but have neither `animation: none` nor an opacity-only replacement, at least as specific, under prefers-reduced-motion. */
function unguarded(css) {
  const rules = rulesOf(css);
  const fades = fadeOnlyKeyframes(css);
  const fadesOnly = (body) => {
    const names = animationNames(body);
    return names.length > 0 && names.every((name) => fades.has(name));
  };
  const guards = rules
    .filter((rule) => rule.reduced && (stopsAnimation(rule.body) || fadesOnly(rule.body)))
    .flatMap((rule) => rule.selectors.map((selector) => ({ target: target(selector), specificity: specificity(selector), at: rule.at })));
  return rules
    .filter((rule) => !rule.reduced && playsAnimation(rule.body))
    .flatMap((rule) => rule.selectors.map((selector) => ({ selector, specificity: specificity(selector), at: rule.at })))
    .filter((animated) => !guards.some((guard) => {
      if (guard.target !== target(animated.selector)) return false;
      const order = compareSpecificity(guard.specificity, animated.specificity);
      return order > 0 || (order === 0 && guard.at > animated.at);
    }))
    .map((animated) => animated.selector);
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
    // an animation inside any nested conditional counts, not only inside a reduced-motion one
    expect(unguarded(".a { @media (min-width: 1px) { animation: spin 1s; } }")).toEqual([".a"]);
    expect(unguarded(`.a { @media (min-width: 1px) { animation: spin 1s; } } @media (prefers-reduced-motion: reduce) { .a { animation: none; } }`)).toEqual([]);
    // an opacity-only keyframe is an accepted replacement; one that still moves is not
    const fade = "@keyframes fade { from { opacity: 0; } } @keyframes slide { from { transform: translateX(9px); } }";
    expect(unguarded(`${fade} .a { animation: slide 1s; } @media (prefers-reduced-motion: reduce) { .a { animation: fade 1s ease; } }`)).toEqual([]);
    expect(unguarded(`${fade} .a { animation: slide 1s; } @media (prefers-reduced-motion: reduce) { .a { animation: slide 1s; } }`)).toEqual([".a"]);
    // a replacement list that still plays a moving keyframe is not an opacity-only replacement
    expect(unguarded(`${fade} .a { animation: slide 1s; } @media (prefers-reduced-motion: reduce) { .a { animation: fade 1s, slide 1s; } }`)).toEqual([".a"]);
    expect(unguarded(`${fade} .a { animation: slide 1s; } @media (prefers-reduced-motion: reduce) { .a { animation-name: slide, fade; } }`)).toEqual([".a"]);
    expect(unguarded(`${fade} .a { animation: slide 1s; } @media (prefers-reduced-motion: reduce) { .a { animation: fade 1s ease-out 50ms both; } }`)).toEqual([]);
    // a keyframe is fade-only only if every definition of that name is
    expect(unguarded(`${fade} @keyframes fade { to { transform: scale(2); } } .a { animation: slide 1s; } @media (prefers-reduced-motion: reduce) { .a { animation: fade 1s; } }`)).toEqual([".a"]);
    // keyframe steps are not rules
    expect(unguarded("@keyframes spin { 50% { opacity: 0; } to { animation-name: x; } }")).toEqual([]);
  });

  it("a guard must be at least as specific as the animation it stops", () => {
    const guard = (selector) => `@media (prefers-reduced-motion: reduce) { ${selector} { animation: none; } }`;
    // the modal drawer variant (0,2,0) beats a plain .dialog guard (0,1,0), so it still slides in
    expect(unguarded(`.dialog { animation: in 1s; } .modal--drawer .dialog { animation: slide 1s; } ${guard(".dialog")}`)).toEqual([".modal--drawer .dialog"]);
    expect(unguarded(`.dialog { animation: in 1s; } .modal--drawer .dialog { animation: slide 1s; } ${guard(".dialog, .modal--drawer .dialog")}`)).toEqual([]);
    expect(unguarded(`.modal .dialog { animation: in 1s; } ${guard(".modal .dialog")}`)).toEqual([]);
    // an equally specific guard has to come after the animation to win
    expect(unguarded(`${guard(".a")} .a { animation: in 1s; }`)).toEqual([".a"]);
    // pseudo-classes and attributes count, :where() does not
    expect(unguarded(`.a:hover { animation: in 1s; } ${guard(".a")}`)).toEqual([".a:hover"]);
    expect(unguarded(`.a[open] { animation: in 1s; } ${guard(".a")}`)).toEqual([".a[open]"]);
    expect(unguarded(`:where(.x) .a { animation: in 1s; } ${guard(".a")}`)).toEqual([]);
    expect(unguarded(`.a { animation: in 1s; } ${guard(":where(.x) .a")}`)).toEqual([]);
    expect(unguarded(`.a { animation: in 1s; } ${guard(":is(.x, #y) .a")}`)).toEqual([]);
    // an id beats any number of classes
    expect(unguarded(`#root .a { animation: in 1s; } ${guard(".a.b.c")}`)).toEqual(["#root .a"]);
  });

  it("computes selector specificity", () => {
    expect(specificity(".a")).toEqual([0, 1, 0]);
    expect(specificity(".a .b > .c:hover::before")).toEqual([0, 4, 1]);
    expect(specificity("#x .a[open] button")).toEqual([1, 2, 1]);
    expect(specificity(":where(.x) .a")).toEqual([0, 1, 0]);
    expect(specificity(":is(.x, #y .z) .a")).toEqual([1, 2, 0]);
    expect(specificity(".a:not(.b, .c)")).toEqual([0, 2, 0]);
  });
});
