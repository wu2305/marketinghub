import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  oxc: { jsx: { runtime: "automatic" } },
  build: {
    lib: {
      entry: { index: "src/design/index.js", demo: "src/design/demo/index.js" },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
      cssFileName: "index",
    },
    cssCodeSplit: false,
    rolldownOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client"],
    },
  },
});
