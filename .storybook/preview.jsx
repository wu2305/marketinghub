import "../src/design/tokens.css";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    layout: "padded",
    controls: { expanded: true, matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: ["Foundations", "Atoms", "Molecules", "Organisms", "Pages"],
      },
    },
    backgrounds: {
      default: "workspace",
      values: [{ name: "workspace", value: "#f4f6f8" }],
    },
  },
};

export default preview;
