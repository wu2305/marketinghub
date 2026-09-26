#!/usr/bin/env node
/** Build the installable ESM/CSS package and declarations from JSDoc. */
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
const build = spawnSync(process.execPath, [viteBin, "build", "--config", "vite.library.config.js"], {
  cwd: root,
  stdio: "inherit",
});
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

const dist = path.join(root, "dist");
if (!existsSync(path.join(dist, "index.css"))) throw new Error("Library CSS was not emitted");
/* Vite's library mode extracts CSS. The component entry loads it for normal
 * package consumers, while ./style.css remains an explicit stylesheet path. */
appendFileSync(path.join(dist, "index.js"), '\nimport "./index.css";\n');

const options = {
  allowJs: true,
  checkJs: false,
  declaration: true,
  emitDeclarationOnly: true,
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  target: ts.ScriptTarget.ES2020,
  skipLibCheck: true,
  outDir: path.join(dist, "types"),
  rootDir: path.join(root, "src", "design"),
};
const entries = ["src/design/index.js", "src/design/demo/index.js"].map((entry) => path.join(root, entry));
const program = ts.createProgram(entries, options);
mkdirSync(path.join(dist, "types"), { recursive: true });
const result = program.emit();
const errors = result.diagnostics.filter((item) => item.category === ts.DiagnosticCategory.Error);
if (errors.length) {
  console.error(ts.formatDiagnostics(errors, {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => root,
    getNewLine: () => "\n",
  }));
  process.exit(1);
}
console.log("dist/ ESM, CSS and declarations built");
