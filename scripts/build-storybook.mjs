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
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT, gitInfo, sourceFingerprint } from "./fingerprint.mjs";

const STATIC = path.join(ROOT, "storybook-static");
const args = process.argv.slice(2);
const command = ["storybook", "build", "-o", "storybook-static", ...args].join(" ");

const before = sourceFingerprint();
const bin = path.join(ROOT, "node_modules", "storybook", "bin", "index.cjs");
if (!existsSync(bin)) {
  console.error("storybook package not installed — run npm install first");
  process.exit(1);
}
const result = spawnSync(process.execPath, [bin, "build", "-o", "storybook-static", ...args], {
  cwd: ROOT,
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

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
