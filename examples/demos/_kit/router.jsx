/* Tiny hash router for customer demo sites. Every demo under examples/demos/
 * uses it so that a built demo is one static file: no server, no base path,
 * and "back" / reload work. Pages never see it; they get `hrefFor` and
 * `onNavigate` like in any host.
 *
 * Route ids are the page ids of the design system (home, cockpit,
 * self-service, interpreter, ...). URLs look like `#/cockpit?project=city`.
 */
import React from "react";
import { LOGO, NAV, demoTargetForHref, normalizeRouteTarget } from "marketing-hub/demo";

const RouterContext = React.createContext(null);

/** `{ id, params, has, hrefFor, navigate, navigation, logo }` for the route components; `has(id)` tells whether a page is in this demo. */
export const useRouter = () => React.useContext(RouterContext);

function parse(hash) {
  const [path, search = ""] = hash.replace(/^#\/?/, "").split("?");
  return { id: path || "home", params: Object.fromEntries(new URLSearchParams(search)) };
}

export function hrefFor(id, params = {}) {
  const target = normalizeRouteTarget(id, params);
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(target.params)) {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  }
  return `#/${target.id}${query.size ? `?${query}` : ""}`;
}

function NotIncluded({ id }) {
  const router = useRouter();
  return (
    <main style={{ fontFamily: "var(--mh-font-sans, sans-serif)", padding: "64px 24px", textAlign: "center" }}>
      <h1>This page is not part of this demo</h1>
      <p>“{id}” has not been added to this demo site.</p>
      <p><a href={router.hrefFor("home")}>Back to the start</a></p>
    </main>
  );
}

/**
 * @param {object} props
 * @param {Record<string, React.ComponentType<{params: Record<string,string>}>>} props.routes route id → page component
 * @param {{logo?: object, title?: string, navigation?: {id: string, label: string}[]}} [props.brand]
 *   logo (`{ src, alt }`), browser tab title, and the top navigation (defaults to the product's; items whose page is
 *   not in `routes` are dropped)
 */
export function DemoSite({ routes, brand = {} }) {
  const [hash, setHash] = React.useState(() => window.location.hash);
  const location = React.useMemo(() => parse(hash), [hash]);

  const navigate = React.useCallback(({ id, params, href } = {}) => {
    const target = id ? { id, params } : demoTargetForHref(href);
    if (target) window.location.hash = hrefFor(target.id, target.params);
  }, []);

  React.useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
      window.scrollTo?.(0, 0);
    };
    /* Links in the product's sample content still point at the original demo
       pages (`/assets/pages/reports.html?...`). Turn a plain click on one into
       a route change; anything else stays native. */
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#")) return;
      const target = demoTargetForHref(raw);
      if (!target) return;
      event.preventDefault();
      navigate(target);
    };
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, [navigate]);

  React.useEffect(() => {
    if (brand.title) document.title = brand.title;
  }, [brand.title]);

  const navigation = (brand.navigation || NAV)
    .filter((item) => Object.hasOwn(routes, item.id))
    .map((item) => ({ ...item, href: hrefFor(item.id) }));
  const logo = { ...(brand.logo || LOGO), href: hrefFor("home") };
  const has = (id) => Object.hasOwn(routes, id);
  const value = { ...location, has, hrefFor, navigate, navigation, logo };
  const Page = Object.hasOwn(routes, location.id) ? routes[location.id] : null;

  /* `key`: every navigation starts the page fresh (assistants closed, forms empty). */
  return (
    <RouterContext.Provider value={value}>
      {Page ? <Page key={hash} params={location.params} /> : <NotIncluded id={location.id} />}
    </RouterContext.Provider>
  );
}
