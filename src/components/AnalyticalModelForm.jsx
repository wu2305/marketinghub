import React, { useState } from "react";
import { domainSuggestions, guidancePrompt, metricOptions } from "../data/catalog.js";
import { MultiSelect } from "./MultiSelect.jsx";
import { SiteHeader } from "./SiteHeader.jsx";
import { useDocumentClass } from "./useDocumentClass.js";

const empty = {
  analysis_name: "",
  applicable_scenarios: "",
  trigger_when: "",
  business_domain: [],
  referenced_metrics: [],
  output_requirements: "",
  analysis_constraints: "",
};

function splitTags(value) {
  return value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AnalyticalModelForm({ initial, onDone }) {
  useDocumentClass("v20-page unified-knowledge-create analytical-model-create");
  const [values, setValues] = useState({ ...empty, ...initial });
  const [tagDraft, setTagDraft] = useState("");
  const [invalid, setInvalid] = useState({});
  const [notice, setNotice] = useState("");

  const setField = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setInvalid((current) => ({ ...current, [key]: false }));
  };

  const validate = () => {
    const next = {
      analysis_name: !values.analysis_name.trim(),
      trigger_when: !values.trigger_when.trim(),
      output_requirements: !values.output_requirements.trim(),
    };
    setInvalid(next);
    const first = Object.keys(next).find((key) => next[key]);
    if (first) document.querySelector(`[name="${first}"]`)?.focus();
    return !first;
  };

  const addTags = () => {
    const next = [...new Set([...values.business_domain, ...splitTags(tagDraft)])];
    setField("business_domain", next);
    setTagDraft("");
  };

  const persist = (isSubmit) => {
    if (!validate()) return;
    const record = {
      id: initial?.id || `analysis-${Date.now()}`,
      type: "Analytical Model",
      mark: "AM",
      title: values.analysis_name.trim() || "Untitled analysis",
      summary: values.applicable_scenarios.trim(),
      owner: "Current User",
      scope: "Personal",
      status: isSubmit ? "Published" : "Draft",
      usage: "0",
      created: "Today",
      aiStatus: isSubmit ? "Enable" : "Disable",
      stage: isSubmit ? "Published" : "Draft",
    };
    setNotice(
      isSubmit
        ? "Submitted. Stage is Published and AI Interpreter status is Enable."
        : "Saved. Status is forced to Disable and stage is Draft.",
    );
    onDone?.(record);
  };

  const fieldClass = (key, full = true) => `fm-field${full ? " full" : ""}${invalid[key] ? " is-invalid" : ""}`;

  return (
    <>
      <SiteHeader current="AI Interpreter" />
      <main className="v20-shell">
        <div className="fm-editor">
          <nav className="fm-breadcrumb" aria-label="Breadcrumb">
            <a href="/original/index.html">Home</a>
            <span>/</span>
            <a href="/original/assets/pages/knowledge.html">AI Interpreter</a>
            <span>/</span>
            <a href="/original/assets/pages/knowledge.html">Knowledge Management</a>
            <span>/</span>
            <a href="/original/assets/pages/knowledge.html?type=Analytical%20Model">Analytical Model</a>
            <span>/</span>
            <span>{initial?.title || "Create Analysis"}</span>
          </nav>
          <header className="fm-editor-head">
            <div>
              <p className="fm-editor-eyebrow">KNOWLEDGE MANAGEMENT</p>
              <h1>{initial?.title ? "Edit Analysis" : "Create Analysis"}</h1>
              <p>Describe a reusable analysis framework.</p>
            </div>
          </header>
          <form
            id="fmAnalysisForm"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              persist(true);
            }}
          >
            <section className="fm-section">
              <h3>Basic Information</h3>
              <div className="fm-grid">
                <label className={fieldClass("analysis_name")}>
                  <span>
                    Analysis Name <i className="unified-required">*</i>
                  </span>
                  <input
                    name="analysis_name"
                    placeholder="Enter a name for this new analysis."
                    value={values.analysis_name}
                    onChange={(event) => setField("analysis_name", event.target.value)}
                  />
                  {invalid.analysis_name ? <span className="fm-field-error">This field is required.</span> : null}
                </label>
                <label className="fm-field full">
                  <span>Description</span>
                  <textarea
                    name="applicable_scenarios"
                    placeholder="Briefly state the business goal, decision to support, and expected insight. Do not list analysis steps here."
                    value={values.applicable_scenarios}
                    onChange={(event) => setField("applicable_scenarios", event.target.value)}
                  />
                </label>
                <label className={fieldClass("trigger_when")}>
                  <span>
                    Trigger When <i className="unified-required">*</i>
                  </span>
                  <textarea
                    name="trigger_when"
                    placeholder="Describe the user questions, business events, or conditions that should trigger this analysis."
                    value={values.trigger_when}
                    onChange={(event) => setField("trigger_when", event.target.value)}
                  />
                  {invalid.trigger_when ? <span className="fm-field-error">This field is required.</span> : null}
                </label>
              </div>
            </section>
            <section className="fm-section fm-metrics-section">
              <h3>Metrics</h3>
              <div className="fm-grid">
                <div className="fm-field">
                  <span>Business Domain</span>
                  <div className="fm-tag-editor">
                    <div className="fm-tags">
                      {values.business_domain.map((tag) => (
                        <span className="fm-chip" key={tag}>
                          {tag}
                          <button
                            type="button"
                            aria-label={`Remove ${tag}`}
                            onClick={() =>
                              setField(
                                "business_domain",
                                values.business_domain.filter((item) => item !== tag),
                              )
                            }
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="fm-tag-entry">
                      <input
                        aria-label="Business Domain"
                        placeholder="Type and press Enter; use semicolons for multiple values"
                        list="fm-business-domain"
                        value={tagDraft}
                        onChange={(event) => setTagDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addTags();
                          }
                        }}
                      />
                      <datalist id="fm-business-domain">
                        {domainSuggestions.map((item) => (
                          <option key={item} value={item} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>
                <div className="fm-field">
                  <span id="fmMetricsLabel">Referenced Metrics</span>
                  <MultiSelect
                    id="fmMetrics"
                    label="Referenced Metrics"
                    options={metricOptions}
                    value={values.referenced_metrics}
                    onChange={(metrics) => setField("referenced_metrics", metrics)}
                  />
                </div>
              </div>
            </section>
            <section className="fm-section">
              <h3>
                Structure & Guidance <i className="unified-required">*</i>
              </h3>
              <div className="fm-grid">
                <label className={`${fieldClass("output_requirements")} fm-guidance-field`}>
                  <span>
                    Structure & Guidance <i className="unified-required">*</i>
                    <span className="fm-guidance-tooltip-wrap">
                      <button className="fm-guidance-tooltip-trigger" type="button" aria-label="Show Structure and Guidance prompt">
                        ?
                      </button>
                      <span className="fm-guidance-tooltip" role="tooltip">
                        <span className="fm-guidance-tooltip-copy">{guidancePrompt}</span>
                      </span>
                    </span>
                  </span>
                  <textarea
                    name="output_requirements"
                    placeholder={guidancePrompt}
                    value={values.output_requirements}
                    onChange={(event) => setField("output_requirements", event.target.value)}
                  />
                  {invalid.output_requirements ? <span className="fm-field-error">This field is required.</span> : null}
                </label>
              </div>
            </section>
            <section className="fm-section">
              <h3>Constraints</h3>
              <div className="fm-grid">
                <label className="fm-field full">
                  <span>Prohibited Analysis Directions</span>
                  <textarea
                    name="analysis_constraints"
                    placeholder="State unsupported dimensions, missing data and conclusions AI must avoid."
                    value={values.analysis_constraints}
                    onChange={(event) => setField("analysis_constraints", event.target.value)}
                  />
                </label>
              </div>
            </section>
            <footer className="fm-editor-footer">
              <div>
                <button
                  className="fm-button"
                  id="fmCancel"
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
                <button className="fm-button" id="fmSave" type="button" onClick={() => persist(false)}>
                  Save
                </button>
                <button className="fm-button primary" type="submit">
                  Submit
                </button>
              </div>
            </footer>
            <p className="knowledge-operation-reminder">
              <span aria-hidden="true">i</span>
              <span>Operation reminder: Save keeps this model disabled. Submit publishes it using the selected AI Interpreter Status.</span>
            </p>
            {notice ? (
              <p className="fm-feedback" id="fmFormFeedback" role="status">
                {notice}
              </p>
            ) : null}
          </form>
        </div>
      </main>
    </>
  );
}
