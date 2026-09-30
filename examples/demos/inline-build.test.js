import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { inlineBuild } from "../../scripts/demo.mjs";

describe("demo build inlining", () => {
  it("puts the script and styles into index.html, escaping a closing script tag", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "demo-inline-"));
    fs.mkdirSync(path.join(dir, "assets"));
    fs.writeFileSync(path.join(dir, "assets", "app.js"), 'document.title = "</script><b>";');
    fs.writeFileSync(path.join(dir, "assets", "app.css"), "body{margin:0}");
    fs.writeFileSync(
      path.join(dir, "index.html"),
      '<html><head><script type="module" crossorigin src="./assets/app.js"></script><link rel="stylesheet" crossorigin href="./assets/app.css"></head><body><div id="root"></div></body></html>',
    );
    const html = fs.readFileSync(inlineBuild(dir), "utf8");
    expect(html).toContain("<style>body{margin:0}</style>");
    expect(html).toContain('<script type="module">document.title = "<\\/script><b>";</script>');
    expect(html).not.toMatch(/src="\.\/assets|href="\.\/assets/);
    expect(html.indexOf('<script type="module">')).toBeGreaterThan(html.indexOf('<div id="root">'));
  });
});
