import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { AssembledPage } from "../src/assembled/AssembledPage.jsx";

export function renderJob(treeDir, manifestPath) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  return Object.fromEntries(
    manifest.map((doc) => {
      const nodes = JSON.parse(readFileSync(`${treeDir}/${doc.id}.json`, "utf8"));
      try {
        return [doc.id, renderToStaticMarkup(<AssembledPage nodes={nodes} bodyClass={doc.bodyClass} />)];
      } catch (error) {
        return [doc.id, `<!-- render-error: ${error.message} -->`];
      }
    }),
  );
}
