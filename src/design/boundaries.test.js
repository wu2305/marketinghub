/**
 * R5(a) import-boundary guard. Parses every non-story, non-test module under
 * src/design and asserts the layering rules from handover/structural-review.md:
 *
 * - components/  may not import features/, pages/, demo/, content.js,
 *   report-logic.js or report-routes.js (they are the reusable leaf layer).
 * - features/<page>/ may not import a different features/<page>/ subtree,
 *   nor demo/ or content.js (per-page modules stay page-scoped; shared code
 *   belongs in components/ or lib/).
 * - pages/ may not import demo/ or content.js (pages receive data via props;
 *   only stories and hosts may pull fixture content).
 *
 * Existing violations must be fixed, or added to WHITELIST with a reason and
 * registered in handover/README.md §4. The whitelist is keyed
 * "importer:specifier-prefix" and every entry needs `reason`.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname);
const SKIP = /(\.stories\.jsx|\.test\.jsx?|stories\.test\.jsx)$/;
const IMPORT_RE = /(?:import|export)\s[^"']*?from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']/g;

/** Explicitly allowed violations — each entry must say why and be registered
   in handover §4. Keep empty by default: fix the layering, don't whitelist. */
const WHITELIST = [
  // { file: "features/cockpit/CityInvestDashboard/index.jsx", specifier: "../../report-logic.js", reason: "..." },
];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jsx?|tsx?)$/.test(entry.name) && !SKIP.test(entry.name)) yield full;
  }
}

function importsOf(file) {
  const src = fs.readFileSync(file, "utf8");
  const specs = [];
  for (const match of src.matchAll(IMPORT_RE)) {
    const spec = match[1] || match[2] || match[3];
    if (spec && spec.startsWith(".")) specs.push(spec);
  }
  return specs;
}

/** Resolve a relative specifier to a path inside src/design, or null when it
   lands outside (bare packages and aliases are ignored by the rules). */
function resolveInside(file, spec) {
  const base = path.resolve(path.dirname(file), spec);
  const candidates = [base, `${base}.js`, `${base}.jsx`, path.join(base, "index.js"), path.join(base, "index.jsx")];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const rel = path.relative(ROOT, candidate);
      return rel.startsWith("..") ? null : rel;
    }
  }
  return null;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function whitelisted(file, spec) {
  const r = rel(file);
  return WHITELIST.some((entry) => r === entry.file && spec.startsWith(entry.specifier));
}

function violations() {
  const found = [];
  for (const file of walk(ROOT)) {
    const r = rel(file);
    const layer = r.split("/")[0];
    for (const spec of importsOf(file)) {
      if (whitelisted(file, spec)) continue;
      const target = resolveInside(file, spec);
      if (!target) continue;
      const t = target.split(path.sep).join("/");
      const tLayer = t.split("/")[0];
      const base = path.basename(t);
      if (layer === "components") {
        if (["features", "pages", "demo"].includes(tLayer) || ["content.js", "report-logic.js", "report-routes.js"].includes(base)) {
          found.push(`${r} -> ${spec} (${t})`);
        }
      } else if (layer === "features") {
        const owner = r.split("/")[1];
        const tOwner = t.split("/")[1];
        if ((tLayer === "features" && tOwner !== owner) || tLayer === "demo" || base === "content.js") {
          found.push(`${r} -> ${spec} (${t})`);
        }
      } else if (layer === "pages") {
        if (tLayer === "demo" || base === "content.js") {
          found.push(`${r} -> ${spec} (${t})`);
        }
      }
    }
  }
  return found;
}

describe("src/design import boundaries (R5a)", () => {
  it("components/features/pages only import across allowed layers", () => {
    expect(violations()).toEqual([]);
  });
});
