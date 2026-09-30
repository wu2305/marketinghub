// One definition of "raw foundation value" for both the CSS budget test
// (src/design/css-budget.test.js, the gate) and scripts/concept-count.mjs (the
// PR report), so the number a PR quotes is the number the gate enforces.
import fs from "node:fs";
import path from "node:path";

export const withoutComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Every component/page CSS file under `root`, excluding tokens.css. */
export function cssFiles(root) {
  const tokens = path.join(root, "tokens.css");
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".css") && full !== tokens ? [full] : [];
  });
  return walk(root);
}

/**
 * Distinct raw font-size, font-weight, radius, shadow and colour values outside
 * tokens.css. Files under `skip` (css-budget.json `pendingMigration`) are left
 * out; they are counted separately by the report.
 * @returns {{fontSize:number,fontWeight:number,radius:number,shadow:number,color:number}}
 */
export function rawFoundationValues(root, skip = []) {
  const skipped = skip.map((prefix) => path.join(root, prefix));
  const sets = { fontSize: new Set(), fontWeight: new Set(), radius: new Set(), shadow: new Set(), color: new Set() };
  for (const file of cssFiles(root)) {
    if (skipped.some((prefix) => file.startsWith(prefix))) continue;
    const css = withoutComments(fs.readFileSync(file, "utf8"));
    for (const [, prop, raw] of css.matchAll(/([a-z-]+)\s*:\s*([^;{}]+);/g)) {
      const value = raw.replace(/!important/, "").trim();
      if (value.startsWith("var(") || ["inherit", "0", "none", "initial", "unset"].includes(value)) continue;
      if (prop === "font-size") sets.fontSize.add(value);
      if (prop === "font-weight") sets.fontWeight.add(value);
      // Composite values count only when they still hold a literal: a shadow built
      // from color-mix()/var() or a per-corner radius of var()s is tokenised.
      if (prop.endsWith("radius") && !["50%", "999px"].includes(value) && /(^|[\s(])[1-9][\d.]*(px|%|rem|em)/.test(value.replace(/var\([^)]*\)/g, ""))) sets.radius.add(value);
      if (prop === "box-shadow" && /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(value)) sets.shadow.add(value);
      for (const color of value.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi) || []) {
        sets.color.add(color.toLowerCase().replace(/\s/g, ""));
      }
    }
  }
  return Object.fromEntries(Object.entries(sets).map(([key, set]) => [key, set.size]));
}

/**
 * Distinct `@media` width values (px) across component/page CSS, sorted. Height
 * queries and `prefers-*` queries are not counted. Used by the budget test
 * (css-budget.json `maxMediaWidths`) and concept-count.mjs.
 * @returns {number[]}
 */
export function mediaWidths(root) {
  const widths = new Set();
  for (const file of cssFiles(root)) {
    const css = withoutComments(fs.readFileSync(file, "utf8"));
    for (const [, query] of css.matchAll(/@media\s*([^{]+)\{/g)) {
      for (const [, px] of query.matchAll(/width\s*[:<>=]+\s*(\d+)px/g)) widths.add(Number(px));
    }
  }
  return [...widths].sort((a, b) => a - b);
}
