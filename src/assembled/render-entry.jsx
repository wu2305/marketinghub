import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import manifest from "./manifest.json";
import { trees } from "./registry.js";
import { AssembledPage } from "./AssembledPage.jsx";

export function renderAll() {
  return Object.fromEntries(
    manifest.map((doc) => [
      doc.id,
      renderToStaticMarkup(<AssembledPage nodes={trees[doc.id]} bodyClass={doc.bodyClass} />),
    ]),
  );
}
