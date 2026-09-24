#!/usr/bin/env node
/**
 * Stamped standalone-host build.
 *
 * 1. Copies the original demo's binary assets (`assets/images`,
 *    `assets/fonts`) into `examples/host/public/assets/` so `assetUrl()`
 *    resolves under `/mh-host/` — the copies are generated, never committed.
 * 2. Runs `vite build` on `examples/host` (base `/mh-host/`).
 * 3. Writes `dist/mh-host-stamp.json` — `scripts/host-check.mjs` requires the
 *    stamp to match the current source fingerprint before it will run.
 *
 * Usage: npm run build:host
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT, gitInfo, sourceFingerprint } from "./fingerprint.mjs";

const HOST = path.join(ROOT, "examples", "host");
const PUBLIC = path.join(HOST, "public");
const DIST = path.join(HOST, "dist");
const HOST_PATHS = ["src/design", "examples/host", "package.json", "package-lock.json"];
const command = "vite build --config examples/host/vite.config.js";

const before = sourceFingerprint(HOST_PATHS);

const viteBin = path.join(ROOT, "node_modules", "vite", "bin", "vite.js");
if (!existsSync(viteBin)) {
  console.error("vite not installed — run npm install first");
  process.exit(1);
}

rmSync(path.join(PUBLIC, "assets"), { recursive: true, force: true });
mkdirSync(path.join(PUBLIC, "assets"), { recursive: true });
for (const dir of ["images", "fonts"]) {
  cpSync(path.join(ROOT, "assets", dir), path.join(PUBLIC, "assets", dir), { recursive: true });
}

const result = spawnSync(process.execPath, [viteBin, "build", "--config", path.join("examples", "host", "vite.config.js")], {
  cwd: ROOT,
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const after = sourceFingerprint(HOST_PATHS);
if (after.hash !== before.hash) {
  console.error("sources changed during the build — refusing to stamp; rebuild on a quiet tree");
  process.exit(1);
}

const { head, dirtyPaths } = gitInfo(HOST_PATHS);
const stamp = { sourceHash: after.hash, head, dirtyPaths, builtAt: new Date().toISOString(), command };
writeFileSync(path.join(DIST, "mh-host-stamp.json"), JSON.stringify(stamp, null, 2) + "\n");
console.log(`stamped examples/host/dist (sourceHash ${after.hash.slice(0, 12)}, head ${head.slice(0, 7)}${dirtyPaths.length ? `, ${dirtyPaths.length} dirty` : ""})`);
