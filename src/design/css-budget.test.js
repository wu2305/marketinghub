/**
 * WP1 CSS debt ratchet. Counts live declarations, not comments, and keeps the
 * pre-existing component/page token aliases in a shrinking exception list.
 * New token families must be semantic. When a new semantic family is needed,
 * add it to SEMANTIC_FAMILIES with a reviewable explanation.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import budget from "./css-budget.json";
import { cssFiles, mediaWidths, rawFoundationValues, withoutComments } from "../../scripts/css-metrics.mjs";

const ROOT = path.resolve(__dirname);
const TOKENS = path.join(ROOT, "tokens.css");

// These are design concepts, not names of a page or a component. A future
// semantic family can be added deliberately; an unknown root cannot silently
// become a new component alias such as --mh-new-widget-*.
// WP2 maps existing colors: indicator = status dots, shadow = elevation,
// stroke = graph lines, radius = shared control corners. These roles are
// independent of the consuming page.
const SEMANTIC_FAMILIES = new Set(`
  amber bg blue bubble copy danger disabled display empty eyebrow faint field
  fill focus font gold green hover icon index indicator info ink kicker line muted page
  placeholder radius red required row scrim search shadow slate stroke subtle surface tooltip warn z
  text accent success warning data space layout
`.trim().split(/\s+/));

// Historical short aliases are reserved even when they do not resemble the
// current directory name. Directory-derived names below cover newly added
// components and pages, including their full names and initials.
const RESERVED_ALIASES = `
  ai bt check composer copilot drawer fl flow hr launcher live modal pagination
  popover principle ra reports sc sr dm toast
`.trim().split(/\s+/);

// Require the whole CSS hex literal, so a selector or a longer identifier
// cannot contribute a partial match. 3/4/6/8 digits are the CSS color forms.
const HEX_COLOR = /(?:^|[^a-z\d_-])#(?:[a-f\d]{8}|[a-f\d]{6}|[a-f\d]{4}|[a-f\d]{3})(?![a-z\d_-])/gi;

function rawHexCount() {
  let total = 0;
  for (const file of cssFiles(ROOT)) {
    total += [...withoutComments(fs.readFileSync(file, "utf8")).matchAll(HEX_COLOR)].length;
  }
  return total;
}

function tokens(source = fs.readFileSync(TOKENS, "utf8")) {
  const css = withoutComments(source);
  const definitions = [];
  for (const match of css.matchAll(/--mh-[a-z\d-]+\s*:/gim)) {
    // A declaration can follow an opening brace or another declaration on
    // the same line. A line-start regex misses `:root { --mh-fl-x: #fff; }`.
    const before = css.slice(0, match.index).trimEnd().at(-1);
    if (before !== "{" && before !== ";") continue;
    const end = css.indexOf(";", match.index + match[0].length);
    if (end < 0 || css.slice(match.index, end).includes("}")) {
      throw new Error(`unterminated token declaration: ${match[0]}`);
    }
    definitions.push({
      name: match[0].slice(0, match[0].indexOf(":")).trim(),
      value: css.slice(match.index + match[0].length, end).trim(),
    });
  }
  return definitions;
}

function canonicalValue(value) {
  return value
    .toLowerCase()
    .replace(/#[a-f\d]{3,8}(?![a-z\d])/g, (hex) => {
      const digits = hex.slice(1);
      return digits.length === 3 || digits.length === 4
        ? `#${[...digits].map((digit) => digit + digit).join("")}`
        : hex;
    })
    .replace(/\s*([(),])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function duplicateValueGroups(definitions) {
  const byValue = new Map();
  for (const { name, value } of definitions) {
    const canonical = canonicalValue(value);
    if (!byValue.has(canonical)) byValue.set(canonical, new Set());
    byValue.get(canonical).add(name);
  }
  return [...byValue.values()].filter((names) => names.size > 1).length;
}

function slugWords(name) {
  return name.replace(/([a-z\d])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase().split(/[^a-z\d]+/).filter(Boolean);
}

function reservedPrefixes() {
  const names = new Set(RESERVED_ALIASES);
  const dirs = [path.join(ROOT, "components"), path.join(ROOT, "pages")];
  const features = path.join(ROOT, "features");
  for (const owner of fs.readdirSync(features, { withFileTypes: true })) {
    if (owner.isDirectory()) {
      dirs.push(path.join(features, owner.name));
      names.add(owner.name);
    }
  }
  for (const dir of dirs) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const words = slugWords(entry.name);
      const stripped = [...words];
      if (["view", "page", "dialog", "dashboard"].includes(stripped.at(-1)) && stripped.length > 1) stripped.pop();
      for (const parts of [words, stripped]) {
        names.add(parts.join("-"));
        if (parts.length > 1) names.add(parts.map((word) => word[0]).join(""));
      }
    }
  }
  return [...names].filter(Boolean);
}

function forbiddenPrefix(name, prefixes) {
  const body = name.slice("--mh-".length);
  const root = body.split("-")[0];
  return prefixes.find((prefix) => body === prefix || body.startsWith(`${prefix}-`))
    || (!SEMANTIC_FAMILIES.has(root) ? root : null);
}

describe("src/design CSS budget (WP1)", () => {
  const definitions = tokens();
  const names = definitions.map(({ name }) => name);
  const prefixes = reservedPrefixes();

  it("recognizes declarations after braces and other declarations on one line", () => {
    expect(tokens(":root { --mh-fl-x: #fff; --mh-ink-x: #123; }").map(({ name }) => name))
      .toEqual(["--mh-fl-x", "--mh-ink-x"]);
  });

  it("does not add raw hex colors outside tokens.css", () => {
    expect(rawHexCount()).toBeLessThanOrEqual(budget.maxRawHexColors);
  });

  it("ratchets raw font-size, weight, radius, shadow and colour values toward zero", () => {
    const counts = rawFoundationValues(ROOT);
    for (const [key, limit] of Object.entries(budget.maxRawFoundationValues)) {
      expect(counts[key], `raw ${key} values`).toBeLessThanOrEqual(limit);
    }
  });

  it("does not add token definitions or duplicate-valued token groups", () => {
    expect(definitions.length).toBeLessThanOrEqual(budget.maxTokenDefinitions);
    expect(new Set(names).size).toBe(definitions.length);
    expect(duplicateValueGroups(definitions)).toBeLessThanOrEqual(budget.maxDuplicateValues);
  });

  it("uses only the three documented width breakpoints", () => {
    // foundations.md §3.3: 1180 · 900 · 760. Height and prefers-* queries are not counted.
    const widths = mediaWidths(ROOT);
    expect(widths.length).toBeLessThanOrEqual(budget.maxMediaWidths);
    expect(widths.filter((w) => ![760, 900, 1180].includes(w))).toEqual([]);
  });

  it("has no legacy prefix exemptions left", () => {
    // The WP0 exemption list was drained to zero; a name added here would
    // legalise a component- or page-named token, so the list must stay empty.
    expect(budget.legacyPrefixExemptions).toEqual([]);
  });

  it("rejects every new component or page token prefix", () => {
    const exempted = new Set(budget.legacyPrefixExemptions);
    const newPrefixed = names.filter((name) => forbiddenPrefix(name, prefixes) && !exempted.has(name));
    expect(newPrefixed, `new component/page-prefixed tokens: ${newPrefixed.join(", ")}`).toEqual([]);
  });
});

/* Token references must resolve. The ratchets above count raw values; nothing
 * else notices a `var(--mh-x)` whose token was deleted or never defined (the
 * declaration silently falls back to inherit/transparent), or a custom property
 * that names itself (a cycle is invalid at computed-value time). */
function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(css|jsx|js)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [full] : [];
  });
}

export function tokenReferences(sources, tokenNames) {
  const defined = new Set(tokenNames);
  const referenced = new Map();
  const cycles = [];
  for (const [file, raw] of sources) {
    const text = file.endsWith(".css") ? withoutComments(raw) : raw;
    // Custom properties a component sets itself: `--mh-x: …;` in CSS, or a JSX
    // style key such as `{ "--mh-art": … }`.
    for (const [, name] of text.matchAll(/(--mh-[a-z0-9-]+)\s*:/g)) defined.add(name);
    for (const [, name] of text.matchAll(/["'`](--mh-[a-z0-9-]+)["'`]\s*:/g)) defined.add(name);
    for (const [, name] of text.matchAll(/(--mh-[a-z0-9-]+)\s*:\s*var\(\s*\1\s*[,)]/g)) cycles.push(`${file}: ${name}`);
    // A trailing dash marks a name assembled at runtime (`var(--mh-space-${n})`).
    for (const [, name] of text.matchAll(/var\(\s*(--mh-[a-z0-9-]+)/g)) {
      if (!name.endsWith("-") && !referenced.has(name)) referenced.set(name, file);
    }
  }
  return {
    dangling: [...referenced].filter(([name]) => !defined.has(name)).map(([name, file]) => `${name} (${file})`),
    cycles,
  };
}

describe("token references", () => {
  const sources = sourceFiles(ROOT).map((file) => [path.relative(ROOT, file), fs.readFileSync(file, "utf8")]);
  const tokenNames = tokens().map(({ name }) => name);

  it("resolves every var(--mh-*) under src/design to a defined custom property", () => {
    expect(tokenReferences(sources, tokenNames).dangling).toEqual([]);
  });

  it("never defines a custom property in terms of itself", () => {
    expect(tokenReferences(sources, tokenNames).cycles).toEqual([]);
  });

  it("only names tokens that exist in the design-sync conventions handed to consumers", () => {
    const conventions = fs.readFileSync(path.resolve(ROOT, "../../.design-sync/conventions.md"), "utf8");
    const named = [...new Set(conventions.match(/--mh-[a-z0-9]+(?:-[a-z0-9]+)*/g))];
    expect(named.filter((name) => !tokenNames.includes(name))).toEqual([]);
  });

  it("detects a deleted token and a self-reference", () => {
    const probe = tokenReferences(
      [["a.css", ".x { color: var(--mh-gone); --mh-loop: var(--mh-loop); }"], ["b.jsx", 'const s = { "--mh-art": 1 }; const c = "var(--mh-art)";']],
      ["--mh-text"],
    );
    expect(probe.dangling).toEqual(["--mh-gone (a.css)"]);
    expect(probe.cycles).toEqual(["a.css: --mh-loop"]);
  });
});
