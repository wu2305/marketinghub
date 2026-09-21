import React, { useState } from "react";
import { referencePages } from "../data/catalog.js";

export function OriginalCatalog() {
  const [current, setCurrent] = useState(referencePages[0]);
  return (
    <div className="mh-reference">
      <nav aria-label="Original pages">
        {referencePages.map((page) => (
          <button key={page.id} type="button" aria-current={page.id === current.id} onClick={() => setCurrent(page)}>
            {page.label}
          </button>
        ))}
      </nav>
      <iframe title={current.label} src={current.src} />
    </div>
  );
}
