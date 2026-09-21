import React from "react";
import { PortalDocument } from "./PortalDocument.jsx";

export function pageStory(doc) {
  return {
    name: doc.name,
    render: () => <PortalDocument src={doc.src} title={doc.name} />,
    parameters: { reference: doc.src },
  };
}
