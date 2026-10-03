#!/usr/bin/env node
/**
 * Stamped `storybook build` wrapper.
 *
 * Computes the source fingerprint before and after the build; if sources were
 * modified mid-build the output is untrustworthy and no stamp is written.
 * On success writes storybook-static/mh-build-stamp.json, which
 * scripts/visual-check.mjs requires before it will run — a stale or missing
 * stamp means "rebuild first".
 *
 * Usage: npm run build-storybook -- [--disable-telemetry ...]
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT, gitInfo, sourceFingerprint } from "./fingerprint.mjs";

const STATIC = path.join(ROOT, "storybook-static");
const args = process.argv.slice(2);
const command = ["storybook", "build", "-o", "storybook-static", ...args].join(" ");

const before = sourceFingerprint();
// The CLI entry moved between majors (8: bin/index.cjs, 10: dist/bin/dispatcher.js), so read it from the package.
const pkgFile = path.join(ROOT, "node_modules", "storybook", "package.json");
const binField = existsSync(pkgFile) ? JSON.parse(readFileSync(pkgFile, "utf8")).bin : null;
const bin = binField && path.join(path.dirname(pkgFile), typeof binField === "string" ? binField : binField.storybook ?? Object.values(binField)[0]);
if (!bin || !existsSync(bin)) {
  console.error("storybook package not installed — run npm install first");
  process.exit(1);
}
const result = spawnSync(process.execPath, [bin, "build", "-o", "storybook-static", ...args], {
  cwd: ROOT,
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// AGENTS 4.1: the story count must not shrink. The floor lives in
// src/design/storybook-budget.json; raise it when stories are added, and lower it
// only for a deletion the handover lists (duplicate or unused stories, 3.4).
const index = JSON.parse(readFileSync(path.join(STATIC, "index.json"), "utf8"));
const counts = { stories: 0, docs: 0 };
for (const entry of Object.values(index.entries)) counts[entry.type === "docs" ? "docs" : "stories"] += 1;
const floor = JSON.parse(readFileSync(path.join(ROOT, "src/design/storybook-budget.json"), "utf8"));
if (counts.stories < floor.minStories || counts.docs < floor.minDocs) {
  console.error(`story count fell: ${counts.stories} stories (floor ${floor.minStories}), ${counts.docs} docs (floor ${floor.minDocs}). Restore them, or lower src/design/storybook-budget.json and list the removed story ids in handover/README.md (AGENTS 4.1).`);
  process.exit(1);
}

const after = sourceFingerprint();
if (after.hash !== before.hash) {
  console.error("sources changed during the build — refusing to stamp; rebuild on a quiet tree");
  process.exit(1);
}

const { head, dirtyPaths } = gitInfo();
mkdirSync(STATIC, { recursive: true });
const stamp = { sourceHash: after.hash, head, dirtyPaths, builtAt: new Date().toISOString(), command };
writeFileSync(path.join(STATIC, "mh-build-stamp.json"), JSON.stringify(stamp, null, 2) + "\n");
console.log(`stamped storybook-static (sourceHash ${after.hash.slice(0, 12)}, head ${head.slice(0, 7)}${dirtyPaths.length ? `, ${dirtyPaths.length} dirty` : ""})`);
