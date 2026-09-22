import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import * as esbuild from "esbuild";

const jobsPath = process.argv[2];
const jobs = JSON.parse(await readFile(jobsPath, "utf8"));
await esbuild.build({
  entryPoints: ["scripts/ablate-render-entry.jsx"],
  bundle: true,
  format: "cjs",
  platform: "node",
  outfile: "node_modules/.cache/portal-ablate.cjs",
  jsx: "automatic",
  external: ["react", "react-dom", "react-dom/server"],
  logLevel: "silent",
});
const require = createRequire(import.meta.url);
const { renderJob } = require("../node_modules/.cache/portal-ablate.cjs");
for (const job of jobs) {
  await mkdir(job.html, { recursive: true });
  const pages = renderJob(job.trees, job.manifest);
  await Promise.all(Object.entries(pages).map(([id, html]) => writeFile(`${job.html}/${id}.html`, html)));
  console.log(`rendered ${job.name} (${Object.keys(pages).length})`);
}
