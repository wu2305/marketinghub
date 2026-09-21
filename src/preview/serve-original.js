import sirv from "sirv";

/** Serves the repository HTML on /original inside the Storybook dev server. */
export function originalPagesPlugin(root) {
  const serve = sirv(root, { dev: true, etag: true, single: false });
  const mount = (server) => {
    server.middlewares.use("/original", (req, res, next) => {
      serve(req, res, next);
    });
  };
  return {
    name: "original-pages",
    configureServer: mount,
    configurePreviewServer: mount,
  };
}
