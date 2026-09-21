import React, { useMemo, useState } from "react";
import { documents } from "../pages/documents.js";

export function OriginalCatalog() {
  const [currentId, setCurrentId] = useState(documents[0].id);
  const current = documents.find((doc) => doc.id === currentId) || documents[0];
  const sections = useMemo(() => {
    const grouped = [];
    documents.forEach((doc) => {
      const section = grouped.find((item) => item.section === doc.section);
      if (section) section.docs.push(doc);
      else grouped.push({ section: doc.section, docs: [doc] });
    });
    return grouped;
  }, []);

  return (
    <div className="mh-reference">
      <nav aria-label="Original pages">
        {sections.map((section) => (
          <div key={section.section}>
            <strong>{section.section}</strong>
            {section.docs.map((doc) => (
              <button
                key={doc.id}
                type="button"
                aria-current={doc.id === current.id}
                onClick={() => setCurrentId(doc.id)}
              >
                {doc.name}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <iframe title={current.name} src={current.src} />
    </div>
  );
}
