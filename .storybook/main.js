import { mergeConfig } from "vite";

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../src/design/**/*.stories.jsx"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [{ from: "../assets", to: "/assets" }],
  async viteFinal(config) {
    // Storybook's Vite builder compiles JSX with esbuild's classic runtime
    // (React.createElement) and does not register @vitejs/plugin-react, so
    // stories that use JSX without importing React throw "React is not defined".
    return mergeConfig(config, {
      esbuild: { jsx: "automatic" },
      optimizeDeps: { esbuildOptions: { jsx: "automatic" } },
    });
  },
};

export default config;
