import React, { useState } from "react";
import { dataModelOptions } from "../data/catalog.js";
import { MultiSelect } from "./MultiSelect.jsx";
import { SiteHeader } from "./SiteHeader.jsx";
import { useDocumentClass } from "./useDocumentClass.js";

const empty = {
  title: "",
  kind: "Business Term",
  description: "",
  synonyms: "",
  scope: [],
};

function RequiredMark() {
  return (
    <i className="unified-required" aria-hidden="true">
      *
    </i>
  );
}

export function BusinessTermForm({ initial, onDone }) {
  useDocumentClass("v20-page unified-knowledge-create business-term-create");
  const [values, setValues] = useState({ ...empty, ...initial });
  const [invalid, setInvalid] = useState({});
  const [notice, setNotice] = useState("");

  const setField = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setInvalid((current) => ({ ...current, [key]: false }));
  };

  const validate = () => {
    const next = {
      title: !values.title.trim(),
      kind: !values.kind.trim(),
      description: !values.description.trim(),
    };
    setInvalid(next);
    return !Object.values(next).some(Boolean);
  };

  const persist = (isSubmit) => {
    if (!validate()) return;
    const record = {
      id: initial?.id || `business-term-draft-${Date.now()}`,
      type: "Business Term",
      mark: "BT",
      title: values.title.trim(),
      summary: values.description.trim(),
      description: values.description.trim(),
      synonyms: values.synonyms,
      kind: values.kind,
      scope: values.kind === "Global Synonym" ? "Global" : values.scope.join(", ") || "Global",
      owner: "Current User",
      status: isSubmit ? "Published" : "Draft",
      usage: "0",
      created: "Today",
      aiStatus: isSubmit ? "Enable" : "Disable",
      stage: isSubmit ? "Published" : "Draft",
    };
    setNotice(
      isSubmit
        ? "Submitted. Status is Enable and stage is Published."
        : "Saved. Status is Disable and stage is Draft.",
    );
    onDone?.(record);
  };

  const fieldClass = (key) => `bt-field span-2${invalid[key] ? " is-invalid" : ""}`;

  return (
    <>
      <SiteHeader current="AI Interpreter" />
      <main className="v20-shell">
        <header className="v20-page-head">
          <div>
            <div className="bt-breadcrumb">
              <a href="/original/index.html">Home</a>
              <span>/</span>
              <a href="/original/assets/pages/knowledge.html">AI Interpreter</a>
              <span>/</span>
              <a href="/original/assets/pages/knowledge.html">Knowledge Management</a>
              <span>/</span>
              <a href="/original/assets/pages/knowledge.html?type=Business%20Term">Business Term</a>
              <span>/</span>
              <b>{initial?.title ? `Edit ${initial.title}` : "Create Business Term"}</b>
            </div>
            <p className="v20-eyebrow">KNOWLEDGE MANAGEMENT</p>
            <h1>{initial?.title ? `Edit ${initial.title}` : "Create Business Term"}</h1>
          </div>
        </header>
        <section className="v20-form-card bt-create-shell">
          <form
            className="bt-edit-form bt-business-term-form unified-knowledge-form"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              persist(true);
            }}
          >
            <div className="bt-business-term-panel">
              <aside className="bt-form-guidance" aria-label="Business term guidance">
                <span className="bt-guidance-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18h6" />
                    <path d="M10 21h4" />
                    <path d="M8.7 14.6A6.5 6.5 0 1 1 15.3 14.6c-.8.7-1.3 1.6-1.3 2.6h-4c0-1-.5-1.9-1.3-2.6Z" />
                  </svg>
                </span>
                <div>
                  <strong>Build a common language</strong>
                  <p>Clearly define the meaning, usage, and boundaries of this business term to help teams talk about data consistently.</p>
                </div>
              </aside>
              <div className="bt-basic-grid bt-business-term-grid">
                <label className={fieldClass("title")}>
                  <span>
                    Title <RequiredMark />
                  </span>
                  <input
                    name="title"
                    required
                    placeholder="Enter the business term title."
                    value={values.title}
                    onChange={(event) => setField("title", event.target.value)}
                  />
                  {invalid.title ? <span className="fm-field-error">This field is required.</span> : null}
                </label>
                <label className={fieldClass("kind")}>
                  <span>
                    Term Type <RequiredMark />
                  </span>
                  <select name="kind" required value={values.kind} onChange={(event) => setField("kind", event.target.value)}>
                    <option value="Business Term">Business Term</option>
                    <option value="Global Synonym">Global Synonym</option>
                  </select>
                  {invalid.kind ? <span className="fm-field-error">This field is required.</span> : null}
                </label>
                <label className={fieldClass("description")}>
                  <span>
                    Description <RequiredMark />
                  </span>
                  <textarea
                    name="description"
                    required
                    placeholder="Explain the meaning, usage, and boundary of this term."
                    value={values.description}
                    onChange={(event) => setField("description", event.target.value)}
                  />
                  {invalid.description ? <span className="fm-field-error">This field is required.</span> : null}
                </label>
                <label className="bt-field span-2">
                  <span>Synonyms</span>
                  <input
                    name="synonyms"
                    placeholder="Add aliases, abbreviations, or equivalent terms, separated by commas."
                    value={values.synonyms}
                    onChange={(event) => setField("synonyms", event.target.value)}
                  />
                </label>
                {values.kind === "Business Term" ? (
                  <div className="bt-field span-2">
                    <span>Data Model</span>
                    <MultiSelect
                      label="Data Model"
                      options={dataModelOptions}
                      value={values.scope}
                      onChange={(scope) => setField("scope", scope)}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <footer className="v20-form-footer">
              <span />
              <div className="bt-form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setValues({ ...empty, ...initial });
                    setInvalid({});
                    setNotice("Changes were not saved.");
                    onDone?.(null);
                  }}
                >
                  Cancel
                </button>
                <button type="button" onClick={() => persist(false)}>
                  Save
                </button>
                <button type="submit" className="primary">
                  Submit
                </button>
              </div>
              <p className="knowledge-operation-reminder">
                <span aria-hidden="true">i</span>
                <span>Operation reminder: Save keeps this term in Draft. Submit publishes it for AI use.</span>
              </p>
              {notice ? (
                <p className="fm-feedback" role="status">
                  {notice}
                </p>
              ) : null}
            </footer>
          </form>
        </section>
      </main>
    </>
  );
}
