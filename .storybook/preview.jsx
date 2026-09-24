import React from "react";
import "../src/design/tokens.css";

/**
 * Explicit navigation adapter for stories: components render real
 * `<a href>`s that point at original-demo routes (`/index.html`,
 * `/assets/pages/...`). A plain left click must not leave the story iframe —
 * the story's own callbacks already update state — so this delegated listener
 * swallows only those navigations. Modifier/middle clicks keep native
 * behaviour; components never call preventDefault themselves.
 */
function DemoLinkGuard({ children }) {
  React.useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === "/index.html" || url.pathname.startsWith("/assets/pages/")) {
        event.preventDefault();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return children;
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [(Story) => <DemoLinkGuard><Story /></DemoLinkGuard>],
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
