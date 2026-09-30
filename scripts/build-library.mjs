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

/* A TypeScript consumer compiled against the emitted declarations: emitting
 * them is not proof they accept real usage (a forwardRef without a typed
 * props object compiled to `RefAttributes<any>` and rejected every prop). */
const consumerFiles = [
  path.join(root, "examples", "types", "consumer.tsx"),
  path.join(root, "examples", "consumer", "BusinessTermApp.tsx"),
  path.join(root, "examples", "consumer", "CockpitApp.tsx"),
];
const consumer = ts.createProgram(consumerFiles, {
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  target: ts.ScriptTarget.ES2020,
  lib: ["lib.es2020.d.ts", "lib.dom.d.ts"],
  baseUrl: root,
  paths: {
    "marketing-hub": ["dist/types/index.d.ts"],
    "marketing-hub/demo": ["dist/types/demo/index.d.ts"],
  },
});
const consumerErrors = ts.getPreEmitDiagnostics(consumer).filter((item) => item.category === ts.DiagnosticCategory.Error);
if (consumerErrors.length) {
  console.error("The TypeScript consumers in examples/ do not type-check against dist/types:");
  console.error(ts.formatDiagnostics(consumerErrors, {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => root,
    getNewLine: () => "\n",
  }));
  process.exit(1);
}
/* The consumer-built pages must also run on the build, not only on the source
 * entries `npm test` uses. */
const consumerRun = spawnSync(process.execPath, [path.join(root, "node_modules", "vitest", "vitest.mjs"), "run", "examples/consumer"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "test", MH_PACKAGE: "dist" },
});
if (consumerRun.status !== 0) process.exit(consumerRun.status ?? 1);
console.log("dist/ ESM, CSS and declarations built; TypeScript consumers type-check; consumer pages pass on dist/");
