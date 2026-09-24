import reactHooks from "eslint-plugin-react-hooks";

/* R5(a): parse JSX, flag unused vars/imports, and enforce the two classic
   react-hooks rules. No stylistic rules — this config is a boundary/dead-code
   guard, not a formatter. */
export default [
  {
    files: ["src/design/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        location: "readonly",
        navigator: "readonly",
        fetch: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        FormData: "readonly",
        File: "readonly",
        FileReader: "readonly",
        Blob: "readonly",
        Image: "readonly",
        HTMLElement: "readonly",
        Element: "readonly",
        Node: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        MutationObserver: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        matchMedia: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        history: "readonly",
        sessionStorage: "readonly",
        crypto: "readonly",
        Intl: "readonly",
      },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^(_|React$)" }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
