import path from "node:path";
import { fileURLToPath } from "node:url";
import { originalPagesPlugin } from "../src/preview/serve-original.js";

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../src/**/*.stories.jsx"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [{ from: "../assets", to: "/assets" }],
  async viteFinal(config) {
    config.plugins = config.plugins || [];
    config.plugins.push(originalPagesPlugin(path.resolve(root, "..")));
    return config;
  },
};

export default config;
