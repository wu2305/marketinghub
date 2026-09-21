import React from "react";

/** Renders one original portal document in full: markup, stylesheets, and scripts. */
export function PortalDocument({ src, title }) {
  return <iframe className="portal-document" title={title} src={src} />;
}
