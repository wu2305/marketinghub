import { defineConfig } from "vite";

/** Serves the existing static HTML so Storybook stories can be compared with the original pages. */
export default defineConfig({
  root: ".",
  publicDir: false,
  server: {
    port: 4173,
    strictPort: true,
  },
});
