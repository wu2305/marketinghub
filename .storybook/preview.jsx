import React from "react";
import { DocsPage, useOf } from "@storybook/addon-docs/blocks";
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

/**
 * Storybook 10 skips inferring an arg's type from its story args whenever docgen already
 * supplied a `type` (it does for every prop here, as `{ required }` only). The type then has no
 * `name`, so Controls pick the JSON editor for booleans and numbers, and URL args
 * (`&args=view:live`, used by visual-check) are dropped as incompatible. Restore the name
 * from the story's args, as Storybook 8 did (same shapes as its `inferArgTypes`).
 */
const inferTypeName = (value) => {
  if (["boolean", "string", "number", "function", "symbol"].includes(typeof value)) return { name: typeof value };
  if (!value) return { name: "object", value: {} };
  if (Array.isArray(value)) return { name: "array", value: value.length ? inferTypeName(value[0]) : { name: "other", value: "unknown" } };
  return { name: "object", value: Object.fromEntries(Object.entries(value).map(([key, field]) => [key, inferTypeName(field)])) };
};
const restoreInferredTypes = ({ argTypes, initialArgs = {} }) => Object.fromEntries(Object.entries(argTypes).map(([key, argType]) => [
  key,
  argType.type && !argType.type.name && key in initialArgs ? { ...argType, type: { ...inferTypeName(initialArgs[key]), ...argType.type } } : argType,
]));
restoreInferredTypes.secondPass = true;

const pageNames = Object.keys(import.meta.glob("../src/design/pages/*/*.docs.mdx"))
  .map((file) => file.split("/").at(-2)).sort();

// Shared Pages metadata has one automatic docs id. Keep that stable entry as
// an index; each attached MDX page documents its own module and existing story.
function DocumentationPage() {
  const { preparedMeta } = useOf("meta", ["meta"]);
  if (preparedMeta.title !== "Pages") return <DocsPage />;
  return <><h1>Page components · 页面组件</h1><p>Open a page to see its inputs, callbacks, and a working preview. Named states stay in the Pages story list.</p><p>打开一个页面，查看它的输入、回调和可运行的预览。各命名状态仍在 Pages 故事列表中。</p><ul>{pageNames.map((name) => <li key={name}><a href={`./?path=/docs/pages--${name.toLowerCase()}`} target="_top">{name}</a></li>)}</ul></>;
}

/** @type { import('@storybook/react-vite').Preview } */
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
      options: {
        workspace: { name: "workspace", value: "#f4f6f8" },
      },
    },
  },
  argTypesEnhancers: [restoreInferredTypes],
  initialGlobals: { backgrounds: { value: "workspace" } },
};

export default preview;
