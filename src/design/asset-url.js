/**
 * Resolve an `assets/...` path against the bundler base so the design system
 * works under a non-root mount. In Storybook `import.meta.env.BASE_URL` is
 * `"./"` (iframe base); in the standalone host it is `/mh-host/`; under vitest
 * it falls back to `/`.
 *
 * The result is always absolute: root-absolute when the base is root-absolute,
 * otherwise resolved against `document.baseURI`. A relative result would break
 * inside `url()` custom properties, which resolve against the consuming
 * stylesheet rather than the page.
 * @param {string} path an `assets/...` path, with or without a leading slash
 * @returns {string} absolute URL honoring the current base
 */
export function assetUrl(path) {
  const base = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";
  const rel = String(path).replace(/^\/+/, "");
  const joined = base.endsWith("/") ? base + rel : `${base}/${rel}`;
  if (joined.startsWith("/")) return joined;
  if (typeof document !== "undefined" && document.baseURI) {
    return new URL(joined, document.baseURI).href;
  }
  return joined;
}
