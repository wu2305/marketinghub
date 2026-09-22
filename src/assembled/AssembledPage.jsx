import React from "react";
import { Nodes } from "./ui.jsx";

export function AssembledPage({ nodes, bodyClass = "" }) {
  const className = ["portal-assembled", bodyClass].filter(Boolean).join(" ");
  return (
    <div className={className} data-assembled-root="true">
      <Nodes nodes={nodes} />
    </div>
  );
}
