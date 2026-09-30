// Concept counts for handover/design-intent/occam-baseline.md. Every Phase 2 PR
// runs this before and after its change and pastes both outputs.
//   node scripts/concept-count.mjs                     # whole src/design
//   node scripts/concept-count.mjs --props <file.jsx>  # also count props of one component
// Only reads files. Counts are distinct values unless the label says "uses".
import fs from "node:fs";
import path from "node:path";
import { mediaWidths, rawFoundationValues } from "./css-metrics.mjs";

const ROOT = path.resolve("src/design");
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
const files = walk(ROOT);
const read = (file) => fs.readFileSync(file, "utf8");
const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, "");
const rel = (file) => path.relative(ROOT, file);

const tokensCss = stripComments(read(path.join(ROOT, "tokens.css")));
const rootBlock = tokensCss.slice(tokensCss.indexOf(":root {"));
const tokenCount = [...rootBlock.matchAll(/(--mh-[a-z0-9-]+)\s*:/g)].length;
const budget = JSON.parse(read(path.join(ROOT, "css-budget.json")));

const labels = { fontSize: "font-size", fontWeight: "font-weight", radius: "border-radius", shadow: "box-shadow", color: "color literal" };
const pending = budget.pendingMigration || [];
const gated = rawFoundationValues(ROOT, pending);
const all = rawFoundationValues(ROOT);

const uiJsx = files.filter((f) => /^(features|pages)\//.test(rel(f)) && f.endsWith("index.jsx"));
const uses = (re) => uiJsx.reduce((n, f) => n + (read(f).match(re) || []).length, 0);
const stubs = files
  .filter((f) => f.endsWith("index.jsx"))
  .flatMap((f) => read(f).split("\n").filter((l) => /@param/.test(l) && /no-op|no resulting behavior/i.test(l)).map(() => rel(f)));

const pageStories = {};
for (const dir of fs.readdirSync(path.join(ROOT, "pages"))) {
  const file = path.join(ROOT, "pages", dir, `${dir}.stories.jsx`);
  if (fs.existsSync(file)) pageStories[dir] = (read(file).match(/^export const [A-Z]\w*/gm) || []).length;
}
const allStories = files.filter((f) => f.endsWith(".stories.jsx")).reduce((n, f) => n + (read(f).match(/^export const [A-Z]\w*/gm) || []).length, 0);

const rows = [
  ["tokens", tokenCount],
  ["legacy-named tokens (css-budget exemptions)", budget.legacyPrefixExemptions.length],
  // Same numbers the CSS budget test enforces; files still in pendingMigration add the rest.
  ...Object.entries(labels).map(([k, label]) => [`raw ${label} values outside tokens.css${all[k] > gated[k] ? ` (+${all[k] - gated[k]} in pendingMigration)` : ""}`, gated[k]]),
  ["distinct @media width values", mediaWidths(ROOT).length],
  ["raw <button> uses in features/pages", uses(/<button\b/g)],
  ["raw <select> uses in features/pages", uses(/<select\b/g)],
  ["raw <input> uses in features/pages", uses(/<input\b/g)],
  ["stub callbacks (JSDoc says no-op)", stubs.length],
  ["stories, total", allStories],
  ["page stories, total", Object.values(pageStories).reduce((a, b) => a + b, 0)],
];
for (const [label, n] of rows) console.log(`${String(n).padStart(5)}  ${label}`);
console.log("\npage stories:", Object.entries(pageStories).map(([k, v]) => `${k} ${v}`).join(", "));

const propsIndex = process.argv.indexOf("--props");
if (propsIndex > 0) {
  const target = process.argv[propsIndex + 1];
  const params = new Set([...read(target).matchAll(/@param\b.*?\s\[?props\.([A-Za-z]+)/g)].map((m) => m[1]));
  console.log(`\nprops in ${target}: ${params.size}`);
}
