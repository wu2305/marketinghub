// Library build used only by design-sync (claude.ai/design upload).
// The repo ships no compiled package; this emits the shape the converter
// expects from src/design/index.js:
//   dist/index.js        ESM, react/react-dom external
//   dist/index.css       every component stylesheet + tokens (fonts copied beside it)
//   dist/types/*.d.ts    declarations generated from the components' JSDoc
// Tooling comes from .ds-sync/node_modules (esbuild, typescript) so the repo's
// own lockfile stays untouched. Run from the repo root:
//   node .design-sync/build-dist.mjs
import { createRequire } from "node:module";
import { rmSync, mkdirSync, readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const req = createRequire(resolve(root, ".ds-sync/package.json"));
const esbuild = req("esbuild");
const ts = req("typescript");
const out = resolve(root, "dist");

// claude.ai/design serves no /assets tree, so the library build embeds every
// image src/design references as a data URL. assetUrl() keeps its signature;
// unknown paths fall back to the root-absolute URL. Images over 300 KB are
// downscaled (macOS `sips`, 800px long edge) into .design-sync/.cache/img.
const srcDir = resolve(root, "src/design");
const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? walk(p) : /\.(jsx?|css)$/.test(n) ? [p] : [];
});
const referenced = new Set();
for (const f of walk(srcDir)) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(/assets\/images\/[A-Za-z0-9_.\/-]+\.(?:png|jpe?g|svg|webp|gif)/g)) referenced.add(m[0]);
  // Templated series like `knowledge-card-icons/layer-${index}.png`.
  for (const m of text.matchAll(/(assets\/images\/[A-Za-z0-9_\/-]+)\$\{[^}]+\}(\.(?:png|jpe?g|svg|webp))/g)) {
    const dir = resolve(root, m[1]).replace(/\/[^/]*$/, "");
    const stem = m[1].split("/").pop();
    for (const n of readdirSync(dir)) if (n.startsWith(stem) && n.endsWith(m[2])) referenced.add(`${m[1].replace(/[^/]*$/, "")}${n}`);
  }
}
const imgCache = resolve(root, ".design-sync/.cache/img");
mkdirSync(imgCache, { recursive: true });
const assetEntries = [...referenced].sort().filter((rel) => existsSync(resolve(root, rel))).map((rel, i) => {
  let file = resolve(root, rel);
  if (statSync(file).size > 300 * 1024 && /\.(png|jpe?g)$/.test(rel)) {
    const small = join(imgCache, rel.replace(/\//g, "__").replace(/\.png$/, ".jpg"));
    if (!existsSync(small)) execFileSync("sips", ["-Z", "800", "-s", "format", "jpeg", "-s", "formatOptions", "80", file, "--out", small], { stdio: "ignore" });
    file = small;
  }
  return { rel, file, id: `a${i}` };
});
const assetUrlModule = [
  ...assetEntries.map((a) => `import ${a.id} from ${JSON.stringify(a.file)};`),
  `const EMBEDDED = {${assetEntries.map((a) => `${JSON.stringify(a.rel)}: ${a.id}`).join(", ")}};`,
  "export function assetUrl(path) {",
  '  const rel = String(path).replace(/^\\/+/, "");',
  '  return EMBEDDED[rel] ?? `/${rel}`;',
  "}",
].join("\n");
const embedAssets = {
  name: "embed-assets",
  setup(b) {
    b.onResolve({ filter: /asset-url\.js$/ }, () => ({ path: "asset-url", namespace: "embed" }));
    b.onLoad({ filter: /.*/, namespace: "embed" }, () => ({ contents: assetUrlModule, loader: "js", resolveDir: root }));
  },
};

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

await esbuild.build({
  // tokens.css is loaded by .storybook/preview (and by hosts) rather than by
  // index.js; the library build pulls it in so dist/index.css is complete.
  stdin: {
    contents: 'import "./tokens.css";\nexport * from "./index.js";\n',
    resolveDir: resolve(root, "src/design"),
    sourcefile: "dist-entry.js",
    loader: "js",
  },
  outfile: resolve(out, "index.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  loader: {
    ".js": "jsx", ".woff2": "file", ".woff": "file", ".otf": "file", ".ttf": "file",
    ".png": "dataurl", ".jpg": "dataurl", ".jpeg": "dataurl", ".svg": "dataurl", ".webp": "dataurl", ".gif": "dataurl",
  },
  plugins: [embedAssets],
  assetNames: "fonts/[name]",
  external: ["react", "react-dom", "react/jsx-runtime"],
  logLevel: "warning",
});

const program = ts.createProgram([resolve(root, "src/design/index.js")], {
  allowJs: true,
  checkJs: false,
  declaration: true,
  emitDeclarationOnly: true,
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  target: ts.ScriptTarget.ES2020,
  skipLibCheck: true,
  outDir: resolve(out, "types"),
  rootDir: resolve(root, "src/design"),
  typeRoots: [resolve(root, ".ds-sync/node_modules/@types")],
});
const result = program.emit();
const errors = result.diagnostics.filter((d) => d.category === ts.DiagnosticCategory.Error);
if (errors.length) {
  console.error(ts.formatDiagnostics(errors, { getCanonicalFileName: (f) => f, getCurrentDirectory: () => root, getNewLine: () => "\n" }));
  process.exit(1);
}
console.log("dist/ built");
