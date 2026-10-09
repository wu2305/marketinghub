import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import { retiredPages } from "./retired-pages.js";

const entry = (file) => fileURLToPath(new URL(file, import.meta.url));

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [`../src/design/**/!(${retiredPages.join("|")}).stories.jsx`, `../src/design/**/!(${retiredPages.join("|")}).docs.mdx`, "../examples/consumer/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [{ from: "../assets", to: "/assets" }],
  async viteFinal(config) {
    // Storybook's Vite builder compiles JSX with the classic runtime
    // (React.createElement) and does not register @vitejs/plugin-react, so
    // stories that use JSX without importing React throw "React is not defined".
    return mergeConfig(config, {
      /* examples/consumer imports the package by name, as any consumer would. */
      resolve: {
        alias: [
          { find: /^marketing-hub$/, replacement: entry("../src/design/index.js") },
          { find: /^marketing-hub\/demo$/, replacement: entry("../src/design/demo/index.js") },
        ],
      },
      oxc: { jsx: { runtime: "automatic" } },
      optimizeDeps: { rolldownOptions: { transform: { jsx: { runtime: "automatic" } } } },
    });
  },
};

export default config;
