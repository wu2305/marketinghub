import React from "react";
import { FormActions, FormField, OperationReminder } from "../assembled/ui.jsx";

export const BUSINESS_TERM_SCOPES = [
  "Marketing",
  "Customer",
  "Retail Operations",
  "Data Governance",
  "City Strategy",
  "Commerce",
  "Revenue Dashboard",
  "Sales Performance",
  "Sales Performance Report",
  "Customer 360",
  "Conversion Overview",
  "Member Performance",
  "4P Report",
  "Customer Daily Tracking",
  "ABO",
  "Rednote Tracking",
  "OTT/OLV Media Data Tracking",
  "Global",
  "All reports",
];

export const GUIDANCE_TEXT = [
  "Describe the analysis logic and reasoning path. Focus on how to analyze the question and what final result should be returned. Do not ask AI to create charts or extra report sections.",
  "",
  "For example:",
  "1. Confirm the user's business question, analysis period, target scope and comparison baseline.",
  "2. Check whether the selected metrics changed materially, and identify the main direction of the change.",
  "3. Compare related dimensions or segments to locate the most likely driver of the change.",
  "4. Judge whether the evidence supports a clear cause. If not, explain the limitation.",
  "5. Return one concise analysis result with the key finding, reason and recommended next action.",
].join("\n");

export function useBodyClass(className) {
  React.useEffect(() => {
    const names = className.split(/\s+/).filter(Boolean);
    document.body.classList.add(...names);
    return () => document.body.classList.remove(...names);
  }, [className]);
}

export function BusinessTermForm({
  title = "",
  kind = "Business Term",
  description = "",
  synonyms = "",
  invalid = false,
  onChange,
  onCancel,
  onSave,
  onSubmit,
}) {
  useBodyClass("unified-knowledge-create business-term-create");
  const showDataModel = kind === "Business Term";
  return (
    <div className="bt-edit-form bt-business-term-form unified-knowledge-form">
      <div className="bt-business-term-panel">
        <aside className="bt-form-guidance" aria-label="Business term guidance">
          <span className="bt-guidance-icon" aria-hidden="true">
            i
          </span>
          <div>
            <strong>Build a common language</strong>
            <p>Clearly define the meaning, usage, and boundaries of this business term to help teams talk about data consistently.</p>
          </div>
        </aside>
        <div className="bt-basic-grid bt-business-term-grid">
          <FormField className="bt-field span-2" label="Title" name="title" required invalid={invalid && !title.trim()} value={title} placeholder="Enter the business term title." onChange={onChange} />
          <FormField
            className="bt-field span-2"
            label="Term Type"
            name="kind"
            control="select"
            required
            invalid={invalid && !kind.trim()}
            value={kind}
            options={["Business Term", "Global Synonym"]}
            onChange={onChange}
          />
          <FormField
            className="bt-field span-2"
            label="Description"
            name="description"
            control="textarea"
            required
            invalid={invalid && !description.trim()}
            value={description}
            placeholder="Explain the meaning, usage, and boundary of this term."
            onChange={onChange}
          />
          <FormField className="bt-field span-2" label="Synonyms" name="synonyms" value={synonyms} placeholder="Add aliases, abbreviations, or equivalent terms, separated by commas." onChange={onChange} />
          {showDataModel ? (
            <label className="bt-field span-2" id="businessTermScopeField">
              <span>Data Model</span>
              <select name="scope" id="businessTermScope" multiple className="bt-multi-select" defaultValue={[]}>
                {BUSINESS_TERM_SCOPES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>
      <FormActions variant="term" onCancel={onCancel} onSave={onSave} onSubmit={onSubmit} />
      <OperationReminder>Operation reminder: Save keeps this term in Draft. Submit publishes it for AI use.</OperationReminder>
    </div>
  );
}

export function AnalyticalModelForm({
  analysisName = "",
  description = "",
  triggerWhen = "",
  guidance = GUIDANCE_TEXT,
  constraints = "",
  invalid = false,
  onChange,
  onCancel,
  onSave,
  onSubmit,
}) {
  useBodyClass("analytical-model-create");
  return (
    <form id="fmAnalysisForm" noValidate onSubmit={(event) => event.preventDefault()}>
      <section className="fm-section">
        <h3>Basic Information</h3>
        <div className="fm-grid">
          <FormField className="fm-field full" label="Analysis Name" name="analysis_name" required invalid={invalid && !analysisName.trim()} value={analysisName} placeholder="Enter a name for this new analysis." onChange={onChange} />
          <FormField className="fm-field full" label="Description" name="applicable_scenarios" control="textarea" value={description} placeholder="Briefly state the business goal, decision to support, and expected insight. Do not list analysis steps here." onChange={onChange} />
          <FormField className="fm-field full" label="Trigger When" name="trigger_when" control="textarea" required invalid={invalid && !triggerWhen.trim()} value={triggerWhen} placeholder="Describe the user questions, business events, or conditions that should trigger this analysis." onChange={onChange} />
        </div>
      </section>
      <section className="fm-section fm-metrics-section">
        <h3>Metrics</h3>
        <div className="fm-grid">
          <div className="fm-field">
            <span>Business Domain</span>
            <div className="fm-tag-editor" data-tags="business_domain">
              <div className="fm-tags"></div>
              <div className="fm-tag-entry">
                <input aria-label="Business Domain" placeholder="Type and press Enter; use semicolons for multiple values" onChange={(event) => onChange?.({ name: "business_domain", value: event.target.value })} />
              </div>
            </div>
          </div>
          <div className="fm-field">
            <span id="fmMetricsLabel">Referenced Metrics</span>
            <div className="v20-multi" id="fmMetrics">
              <button type="button" className="v20-multi-display" aria-labelledby="fmMetricsLabel" aria-expanded="false" aria-controls="fmMetricsMenu">
                <em>Select one or more</em>
              </button>
              <div className="v20-multi-menu" id="fmMetricsMenu">
                {["Member conversion", "Campaign ROI", "Promotion lift"].map((metric) => (
                  <label key={metric}>
                    <input type="checkbox" value={metric} onChange={(event) => onChange?.({ name: "referenced_metrics", value: metric, checked: event.target.checked })} />
                    {metric}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="fm-section">
        <h3>
          Structure & Guidance <i className="unified-required" aria-hidden="true">*</i>
        </h3>
        <div className="fm-grid">
          <FormField className="fm-field full fm-guidance-field" label="Structure & Guidance" name="output_requirements" control="textarea" required invalid={invalid && !guidance.trim()} value={guidance} placeholder={GUIDANCE_TEXT} onChange={onChange} />
        </div>
      </section>
      <section className="fm-section">
        <h3>Constraints</h3>
        <div className="fm-grid">
          <FormField className="fm-field full" label="Prohibited Analysis Directions" name="analysis_constraints" control="textarea" value={constraints} placeholder="State unsupported dimensions, missing data and conclusions AI must avoid." onChange={onChange} />
        </div>
      </section>
      <FormActions variant="model" onCancel={onCancel} onSave={onSave} onSubmit={onSubmit} />
      <OperationReminder>Operation reminder: Save keeps this model disabled. Submit publishes it using the selected AI Interpreter Status.</OperationReminder>
      <p className="fm-feedback" id="fmFormFeedback" role="status" aria-live="polite"></p>
    </form>
  );
}
