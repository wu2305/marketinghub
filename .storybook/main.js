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
    config.server = {
      ...config.server,
      hmr: {
        ...(typeof config.server?.hmr === "object" ? config.server.hmr : {}),
        overlay: true,
      },
      watch: {
        ...config.server?.watch,
        usePolling: true,
        interval: 200,
      },
    };
    return config;
  },
};

export default config;
