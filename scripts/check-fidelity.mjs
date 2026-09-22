import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import * as esbuild from "esbuild";

const outdir = "/tmp/portal-fidelity";
await mkdir(outdir, { recursive: true });
await esbuild.build({
  entryPoints: ["src/assembled/render-entry.jsx"],
  bundle: true,
  format: "cjs",
  platform: "node",
  outfile: "node_modules/.cache/portal-render.cjs",
  jsx: "automatic",
  external: ["react", "react-dom", "react-dom/server"],
  logLevel: "silent",
});
const require = createRequire(import.meta.url);
const { renderAll } = require("../node_modules/.cache/portal-render.cjs");
const pages = renderAll();
await Promise.all(
  Object.entries(pages).map(([id, html]) => writeFile(`${outdir}/${id}.html`, html)),
);
console.log(`rendered ${Object.keys(pages).length} pages`);
