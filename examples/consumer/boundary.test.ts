/* The consumer app may use only what any package consumer has: the package
 * entries, React and its own files. From "marketing-hub/demo" it takes content
 * constants (UPPER_CASE) only, never demo hooks or helpers. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const dir = path.dirname(fileURLToPath(import.meta.url));
const sources = fs.readdirSync(dir).filter((file) => /\.(tsx?|jsx?)$/.test(file) && !/\.(test|stories)\./.test(file));

describe("examples/consumer import boundary", () => {
  it.each(sources)("%s imports only public entries", (file) => {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    const imports = [...text.matchAll(/import\s+([\s\S]*?)\s+from\s+"([^"]+)"/g)].map(([, names, from]) => ({ names, from }));
    const problems = imports.flatMap(({ names, from }) => {
      if (from === "react" || from === "marketing-hub" || from.startsWith("./")) return [];
      if (from === "marketing-hub/demo") {
        const bad = names.replace(/[{}]/g, "").split(",").map((name) => name.trim().split(/\s+as\s+/)[0]).filter((name) => name && !/^[A-Z][A-Z0-9_]*$/.test(name));
        return bad.map((name) => `${name} from marketing-hub/demo (content constants only)`);
      }
      return [`${from} is not a public entry`];
    });
    expect(problems).toEqual([]);
  });
});
