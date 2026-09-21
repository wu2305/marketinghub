import "../src/styles/portal.css";
import "../src/preview/compare.css";
import { CompareDecorator } from "../src/preview/CompareFrame.jsx";

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [CompareDecorator],
  initialGlobals: {
    compare: "off",
  },
  globalTypes: {
    compare: {
      description: "Place the original HTML page beside this story",
      toolbar: {
        title: "Compare",
        icon: "mirror",
        items: [
          { value: "off", title: "Component only" },
          { value: "on", title: "Beside original HTML" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "fullscreen",
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: ["Foundations", "Components", "Pages", "Reference"],
      },
    },
  },
};

export default preview;
