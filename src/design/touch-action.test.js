/**
 * Tap controls inside any mh- component use `touch-action: manipulation`, and so
 * does a component whose own root is the control (a standalone Button or Link).
 * A descendant-only selector (`:is(button, a)` inside `@scope`) misses the root,
 * so the rule has to name `:scope` too. This reads the stylesheet, so it cannot
 * show the computed value; the PR that added it checked Atoms/Button in a browser.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { withoutComments } from "../../scripts/css-metrics.mjs";

const tokens = withoutComments(fs.readFileSync(path.resolve(__dirname, "tokens.css"), "utf8"));

/** Selector lists of every rule in tokens.css that sets touch-action: manipulation. */
function selectorsSettingManipulation(css) {
  return [...css.matchAll(/([^{}]+)\{([^{}]*touch-action:\s*manipulation[^{}]*)\}/g)].map((match) => match[1].trim());
}

describe("touch-action: manipulation", () => {
  const selectors = selectorsSettingManipulation(tokens);

  it("is set by exactly one rule in tokens.css", () => {
    expect(selectors).toHaveLength(1);
  });

  it("covers the component root as well as its descendants", () => {
    const [selector] = selectors;
    expect(selector).toMatch(/:scope(?![\w-])\s*,/); // the root itself, not only `:scope *`
    expect(selector).toContain(":scope *");
  });

  it("covers buttons, links and text controls", () => {
    const [selector] = selectors;
    for (const element of ["button", "input", "select", "textarea", "a"]) expect(selector).toMatch(new RegExp(`[(\\s,]${element}[,)\\s]`));
  });

  it("is not set only on descendants (the old shape that missed standalone controls)", () => {
    // a bare `:is(button, ...) { touch-action }` or `a { touch-action }` rule is the regression
    expect(tokens).not.toMatch(/(^|\n)\s*(a|:is\(button[^)]*\))\s*\{[^}]*touch-action/);
  });
});
