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

const ROOT = path.resolve(__dirname);
const TOKENS = path.join(ROOT, "tokens.css");

// This fixed WP0 set is the ceiling for css-budget.json's live exemption
// snapshot. Removing a legacy token also requires removing it from the JSON;
// adding a new name to that JSON cannot make a component token legal.
const BASELINE_PREFIX_EXEMPTIONS = new Set(`
  --mh-header
  --mh-drawer-shadow
  --mh-popover-shadow
  --mh-modal-shadow
  --mh-toast-bg
  --mh-toast-shadow
  --mh-modal-shadow-soft
  --mh-control-line
  --mh-launcher-line
  --mh-launcher-bg
  --mh-launcher-bg-hover
  --mh-launcher-aura
  --mh-launcher-shadow
  --mh-launcher-shadow-hover
  --mh-launcher-focus
  --mh-launcher-orb-ink
  --mh-ai-feedback-line
  --mh-ai-chip-line
  --mh-ai-chip-copy
  --mh-ai-chip-hover-line
  --mh-ai-chip-pos
  --mh-ai-chip-pos-bg
  --mh-ai-chip-neg
  --mh-ai-chip-neg-bg
  --mh-composer-shadow
  --mh-composer-focus
  --mh-chip-line
  --mh-chip-bg
  --mh-chip-ink
  --mh-chip-icon
  --mh-chip-hover
  --mh-flow-shadow
  --mh-reports-bg
  --mh-reports-line
  --mh-reports-surface-soft
  --mh-reports-ink
  --mh-reports-copy
  --mh-reports-muted
  --mh-reports-blue
  --mh-reports-blue-soft
  --mh-reports-green
  --mh-reports-shadow
  --mh-reports-card-shadow
  --mh-reports-card-shadow-hover
  --mh-reports-row-shadow
  --mh-reports-row-shadow-hover
  --mh-reports-card-edge
  --mh-reports-gold-btn
  --mh-reports-badge-bg
  --mh-reports-badge-ink
  --mh-reports-pill-bg
  --mh-reports-pill-ink
  --mh-reports-pill-hover-bg
  --mh-reports-pill-hover-ink
  --mh-reports-hover-line
  --mh-reports-title-hover
  --mh-reports-scrim
  --mh-reports-thumb-bg
  --mh-reports-footer-bg
  --mh-reports-media-bg
  --mh-reports-filter
  --mh-live-toolbar-bg
  --mh-live-line
  --mh-live-inkline
  --mh-live-chart-bg
  --mh-live-back-hover
  --mh-live-back-hover-line
  --mh-live-back-hover-bg
  --mh-live-bar
  --mh-live-bar-alt
  --mh-live-faint
  --mh-live-shadow
  --mh-sc-bg
  --mh-sc-ink
  --mh-sc-label
  --mh-sc-faint
  --mh-sc-note
  --mh-sc-line
  --mh-sc-line-strong
  --mh-sc-field-bg
  --mh-sc-static-bg
  --mh-sc-static-line
  --mh-sc-static-ink
  --mh-sc-row-hover
  --mh-sc-head-line
  --mh-sc-link
  --mh-sc-pos
  --mh-sc-neg
  --mh-sc-noninvest
  --mh-sc-invest
  --mh-sc-axis
  --mh-sc-gridline
  --mh-sc-panel-shadow
  --mh-sc-tip-shadow
  --mh-sc-canvas-shadow
  --mh-copilot-line
  --mh-copilot-line-strong
  --mh-copilot-ink
  --mh-copilot-copy
  --mh-copilot-muted
  --mh-copilot-head-bg
  --mh-copilot-hover-bg
  --mh-copilot-tool-bg
  --mh-copilot-shadow-expanded
  --mh-copilot-gold-wash
  --mh-copilot-metric-pos
  --mh-copilot-metric-neg
  --mh-copilot-box-line
  --mh-copilot-send-ink
  --mh-copilot-upload-line
  --mh-copilot-upload-hover-line
  --mh-copilot-upload-hover-bg
  --mh-copilot-card-line
  --mh-copilot-card-faint
  --mh-copilot-card-ink
  --mh-copilot-card-copy
  --mh-copilot-card-action-ink
  --mh-copilot-chip-bg
  --mh-copilot-action-bg
  --mh-copilot-fb-hover-line
  --mh-copilot-fb-hover-bg
  --mh-copilot-fb-pressed-line
  --mh-copilot-fb-pressed-bg
  --mh-copilot-placeholder
  --mh-copilot-popup-line
  --mh-copilot-popup-shadow
  --mh-copilot-popup-icon
  --mh-copilot-footer-icon
  --mh-copilot-faint
  --mh-copilot-hint
  --mh-copilot-gold-from
  --mh-copilot-gold-to
  --mh-copilot-send-disabled-bg
  --mh-copilot-send-disabled-ink
  --mh-hr-ink
  --mh-hr-muted
  --mh-hr-mid
  --mh-hr-index
  --mh-hr-note
  --mh-hr-line
  --mh-hr-surface
  --mh-hr-card-line
  --mh-hr-gridline
  --mh-hr-grid-zero
  --mh-hr-axis
  --mh-hr-th-line
  --mh-hr-td-line
  --mh-hr-dot-pos
  --mh-hr-dot-warn
  --mh-hr-dot-neg
  --mh-hr-pos
  --mh-hr-neg
  --mh-hr-insight-line
  --mh-hr-insight-bg
  --mh-hr-insight-ink
  --mh-hr-cursor
  --mh-ra-ink
  --mh-ra-up
  --mh-ra-down
  --mh-ra-badge-up-bg
  --mh-ra-badge-down-bg
  --mh-ra-line
  --mh-ra-card-line
  --mh-ra-muted
  --mh-ra-name
  --mh-ra-stat-line
  --mh-ra-icon-retail-bg
  --mh-ra-icon-retail
  --mh-ra-icon-outlet-bg
  --mh-ra-icon-outlet
  --mh-ra-insight-line
  --mh-ra-insight-bg
  --mh-ra-insight-ink
  --mh-ra-option-icon-bg
  --mh-ra-option-hover-line
  --mh-ra-option-hover-bg
  --mh-ra-source-chip-line
  --mh-ra-source-chip-bg
  --mh-ra-source-chip-ink
  --mh-check-filter-line
  --mh-check-filter-label
  --mh-check-filter-ink
  --mh-check-filter-option
  --mh-check-filter-checked-bg
  --mh-check-filter-checked-ink
  --mh-check-filter-shadow
  --mh-principle-line
  --mh-principle-shadow
  --mh-principle-number-bg
  --mh-principle-number-ink
  --mh-principle-badge-bg
  --mh-principle-badge-ink
  --mh-principle-title
  --mh-principle-copy
  --mh-principle-toggle
  --mh-principle-toggle-hover
  --mh-principle-focus-ring
  --mh-principle-empty-line
  --mh-principle-empty-ink
  --mh-principle-search-ink
  --mh-principle-search-placeholder
  --mh-pagination-line
  --mh-pagination-ink
  --mh-pagination-btn-line
  --mh-pagination-btn-ink
  --mh-pagination-active
  --mh-pagination-hover-line
  --mh-pagination-hover-bg
  --mh-pagination-select-line
  --mh-pagination-select-ink
  --mh-bt-title
  --mh-bt-copy
  --mh-bt-label
  --mh-bt-tag-bg
  --mh-bt-state-bg
  --mh-bt-state-ink
  --mh-bt-state-off-bg
  --mh-bt-state-off-ink
  --mh-bt-action
  --mh-bt-action-disabled
  --mh-bt-action-hover-bg
  --mh-bt-search-line
  --mh-bt-search-focus
  --mh-bt-search-icon
  --mh-bt-search-shadow
  --mh-bt-countline
  --mh-bt-empty
  --mh-bt-draft-bg
  --mh-bt-draft-ink
  --mh-bt-create-from
  --mh-bt-create-to
  --mh-bt-create-from-hover
  --mh-bt-create-to-hover
  --mh-bt-create-shadow
  --mh-bt-drawer-bg
  --mh-bt-drawer-line
  --mh-bt-drawer-eyebrow
  --mh-bt-drawer-title
  --mh-bt-drawer-shadow
  --mh-bt-drawer-scrim
  --mh-bt-status-on-bg
  --mh-bt-status-on-ink
  --mh-bt-status-on-dot
  --mh-bt-status-off-bg
  --mh-bt-status-off-ink
  --mh-bt-status-off-dot
  --mh-bt-section-title
  --mh-bt-section-copy
  --mh-bt-chip-bg
  --mh-bt-chip-ink
  --mh-bt-scope-bg
  --mh-bt-scope-ink
  --mh-bt-dialog-line
  --mh-bt-dialog-ink
  --mh-bt-dialog-scrim
  --mh-bt-confirm-scrim
  --mh-bt-confirm-icon-bg
  --mh-bt-confirm-icon
  --mh-bt-confirm-title
  --mh-bt-confirm-copy
  --mh-bt-confirm-btn-line
  --mh-bt-confirm-btn-ink
  --mh-bt-confirm-primary
  --mh-bt-pag-ink
  --mh-fl-title
  --mh-fl-empty
  --mh-fl-empty-rc
  --mh-fl-empty-line
  --mh-fl-rc-line
  --mh-fl-rc-hover-line
  --mh-fl-rc-hover-shadow
  --mh-fl-rc-focus-shadow
  --mh-fl-card-hover-line
  --mh-fl-card-hover-shadow
  --mh-fl-er-hover-line
  --mh-fl-er-hover-shadow
  --mh-fl-domain-line
  --mh-fl-action-off
  --mh-fl-recipient-bg
  --mh-fl-recipient-ink
  --mh-fl-meta-label
  --mh-fl-state-ink
  --mh-fl-desc-copy
  --mh-fl-thumb-line
  --mh-fl-overview-line
  --mh-fl-edit-bg
  --mh-fl-edit-ink
  --mh-fl-edit-hover-bg
  --mh-fl-edit-hover-ink
  --mh-fl-scenario-hover-bg
  --mh-fl-scenario-hover-ink
  --mh-fl-scenario-hover-line
  --mh-fl-scenario-focus
  --mh-fl-btn-line
  --mh-fl-btn-ink
  --mh-fl-dash-bg
  --mh-fl-dash-line
  --mh-fl-dash-ink
  --mh-fl-dash-hover-bg
  --mh-fl-dash-hover-line
  --mh-fl-dialog-eyebrow
  --mh-fl-dialog-title
  --mh-fl-dialog-label
  --mh-fl-dialog-area-line
  --mh-fl-dialog-area-ink
  --mh-fl-dialog-area-focus
  --mh-fl-dialog-head-line
  --mh-fl-dialog-close-line
  --mh-fl-dialog-bg
  --mh-fl-dialog-shadow
  --mh-fl-dialog-btn-bg
  --mh-fl-dialog-btn-line
  --mh-fl-dialog-btn-hover
  --mh-fl-dialog-btn-hover-line
  --mh-fl-dialog-btn-off-bg
  --mh-fl-dialog-btn-off-line
`.trim().split(/\s+/));

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

function withoutComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function* cssFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* cssFiles(full);
    else if (entry.isFile() && entry.name.endsWith(".css") && full !== TOKENS) yield full;
  }
}

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

// Phase 2 WP3 ratchet: distinct raw foundation values outside tokens.css, same
// definitions as scripts/concept-count.mjs. Files a WP7 package will replace are
// listed in css-budget.json `pendingMigration` and skipped until migrated.
function rawFoundationValues() {
  const pending = (budget.pendingMigration || []).map((prefix) => path.join(ROOT, prefix));
  const sets = { fontSize: new Set(), fontWeight: new Set(), radius: new Set(), shadow: new Set(), color: new Set() };
  for (const file of cssFiles(ROOT)) {
    if (pending.some((prefix) => file.startsWith(prefix))) continue;
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
  const currentNames = new Set(names);
  const prefixes = reservedPrefixes();

  it("recognizes declarations after braces and other declarations on one line", () => {
    expect(tokens(":root { --mh-fl-x: #fff; --mh-ink-x: #123; }").map(({ name }) => name))
      .toEqual(["--mh-fl-x", "--mh-ink-x"]);
  });

  it("does not add raw hex colors outside tokens.css", () => {
    expect(rawHexCount()).toBeLessThanOrEqual(budget.maxRawHexColors);
  });

  it("ratchets raw font-size, weight, radius, shadow and colour values toward zero", () => {
    const counts = rawFoundationValues();
    for (const [key, limit] of Object.entries(budget.maxRawFoundationValues)) {
      expect(counts[key], `raw ${key} values`).toBeLessThanOrEqual(limit);
    }
    for (const prefix of budget.pendingMigration) {
      expect(fs.existsSync(path.join(ROOT, prefix)), `pendingMigration path ${prefix}`).toBe(true);
    }
  });

  it("does not add token definitions or duplicate-valued token groups", () => {
    expect(definitions.length).toBeLessThanOrEqual(budget.maxTokenDefinitions);
    expect(new Set(names).size).toBe(definitions.length);
    expect(duplicateValueGroups(definitions)).toBeLessThanOrEqual(budget.maxDuplicateValues);
  });

  it("keeps legacy prefix exemptions as an exact, shrinking WP0 subset", () => {
    const exemptions = budget.legacyPrefixExemptions;
    expect(new Set(exemptions).size).toBe(exemptions.length);
    expect(exemptions.filter((name) => !BASELINE_PREFIX_EXEMPTIONS.has(name))).toEqual([]);
    expect(exemptions.filter((name) => !currentNames.has(name))).toEqual([]);
    expect(exemptions.filter((name) => !forbiddenPrefix(name, prefixes))).toEqual([]);
  });

  it("rejects every new component or page token prefix", () => {
    const exempted = new Set(budget.legacyPrefixExemptions);
    const newPrefixed = names.filter((name) => forbiddenPrefix(name, prefixes) && !exempted.has(name));
    expect(newPrefixed, `new component/page-prefixed tokens: ${newPrefixed.join(", ")}`).toEqual([]);
  });
});
