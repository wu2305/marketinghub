/* Vite config for customer demo sites. `scripts/demo.mjs` sets MH_DEMO to the
 * demo's folder name; the demo is served or built from that folder alone.
 *
 * The build is a single self-contained HTML file (scripts/demo.mjs inlines the
 * script and styles afterwards), so it opens from a double click, an email
 * attachment or any static host. `base: "./"` keeps asset URLs relative. */
import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const slug = process.env.MH_DEMO;
if (!slug) throw new Error("MH_DEMO is not set; run `npm run demo dev <name>` or `npm run demo build <name>`");

export default defineConfig({
  root: path.join(here, slug),
  base: "./",
  publicDir: false,
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^marketing-hub$/, replacement: path.join(root, "src/design/index.js") },
      { find: /^marketing-hub\/demo$/, replacement: path.join(root, "src/design/demo/index.js") },
    ],
  },
  server: { host: "127.0.0.1", port: 5180, strictPort: false },
  build: {
    outDir: path.join(root, "demo-dist", slug),
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    modulePreload: false,
    chunkSizeWarningLimit: 10_000,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
