import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/* examples/consumer imports the package by name. `npm test` points the name at
   the source entries; build:lib sets MH_PACKAGE=dist to run it on the build. */
const entry = (file) => fileURLToPath(new URL(file, import.meta.url));
const pkg = process.env.MH_PACKAGE === "dist"
  ? { main: entry("./dist/index.js"), demo: entry("./dist/demo.js") }
  : { main: entry("./src/design/index.js"), demo: entry("./src/design/demo/index.js") };

/* React's act() does not exist in production builds; a shell that exports
   NODE_ENV=production (common on deploy hosts) would fail almost every test. */
process.env.NODE_ENV = "test";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^marketing-hub$/, replacement: pkg.main },
      { find: /^marketing-hub\/demo$/, replacement: pkg.demo },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{js,jsx}", "examples/**/*.test.{js,jsx,ts,tsx}"],
  },
});
