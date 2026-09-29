/** Deterministic AI Auto-fill text for the scenario structure fields (D11); both skill forms use it. */
export const SKILL_AUTOFILL_TEXT = {
  triggerWhen: "When users ask why a metric moved between two periods and need the drivers explained before choosing a next action.",
  input: "Report, City, Channel, Date Range, Traffic, Sales and Conversion metrics from the approved report context.",
  logic: "Confirm report context -> Compare periods -> Decompose drivers -> Explain exceptions -> Recommend next actions",
  output: "Summary of the movement, ranked drivers, flagged exceptions and recommended next actions.",
  boundary: "Incomplete reporting periods or ungoverned metric definitions must be flagged before any recommendation is made.",
};
