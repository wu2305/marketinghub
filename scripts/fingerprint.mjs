/**
 * Source fingerprinting for the visual-check pipeline.
 *
 * `sourceFingerprint()` hashes every file that can change the built stories —
 * `src/design`, `examples/consumer`, `.storybook`, `assets`, `package.json`, `package-lock.json` — listing
 * them with `git ls-files -co --exclude-standard` so both tracked and
 * untracked-but-not-ignored files count (gitignored output such as
 * storybook-static never does). The hash covers sorted `path\0content\0`
 * pairs, so it changes on any add/delete/edit/rename.
 *
 * `gitInfo()` returns the current HEAD and the same-paths porcelain list, so
 * build stamps and run records can prove exactly which tree produced them.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// `assets` is the reference demo, but Storybook copies it into storybook-static/assets
// (staticDirs), so a changed image or font makes a built Storybook stale too.
export const SOURCE_PATHS = ["src/design", "examples/consumer", ".storybook", "assets", "package.json", "package-lock.json"];

function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });
}

export function sourceFiles(paths = SOURCE_PATHS) {
  const out = git(["ls-files", "-co", "--exclude-standard", "--", ...paths]);
  // ls-files -c lists index entries, including tracked files deleted in the
  // working tree — those are covered by the hash via their absence from the
  // list, and reading them would crash.
  return out
    .split("\n")
    .filter(Boolean)
    .filter((file) => existsSync(path.join(ROOT, file)))
    .sort();
}

export function sourceFingerprint(paths = SOURCE_PATHS) {
  const files = sourceFiles(paths);
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(file);
    hash.update("\0");
    hash.update(readFileSync(path.join(ROOT, file)));
    hash.update("\0");
  }
  return { hash: hash.digest("hex"), files };
}

export function gitInfo(paths = SOURCE_PATHS) {
  const head = git(["rev-parse", "HEAD"]).trim();
  const out = git(["status", "--porcelain", "--", ...paths]);
  const dirtyPaths = out
    .split("\n")
    .filter(Boolean)
    .map((line) => line.slice(3));
  return { head, dirtyPaths };
}
