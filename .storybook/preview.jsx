import React from "react";
import { DocsPage, useOf } from "@storybook/blocks";
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

const pageNames = Object.keys(import.meta.glob("../src/design/pages/*/*.docs.mdx"))
  .map((file) => file.split("/").at(-2)).sort();

// Shared Pages metadata has one automatic docs id. Keep that stable entry as
// an index; each attached MDX page documents its own module and existing story.
function DocumentationPage() {
  const { preparedMeta } = useOf("meta", ["meta"]);
  if (preparedMeta.title !== "Pages") return <DocsPage />;
  return <><h1>Page components</h1><p>Open a page to inspect its inputs, callbacks and working preview. Named states remain in the Pages story list.</p><ul>{pageNames.map((name) => <li key={name}><a href={`./?path=/docs/pages--${name.toLowerCase()}`} target="_top">{name}</a></li>)}</ul></>;
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [(Story) => <DemoLinkGuard><Story /></DemoLinkGuard>],
  parameters: {
    layout: "padded",
    docs: { page: DocumentationPage },
    controls: { expanded: true, matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: ["Foundations", "Atoms", "Molecules", "Organisms", "Features", "Pages"],
      },
    },
    backgrounds: {
      default: "workspace",
      values: [{ name: "workspace", value: "#f4f6f8" }],
    },
  },
};

export default preview;
