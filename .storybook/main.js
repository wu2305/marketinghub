/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../src/design/**/*.stories.jsx"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [{ from: "../assets", to: "/assets" }],
};

export default config;
