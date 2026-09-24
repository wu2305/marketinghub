/**
 * Scenario config for scripts/visual-check.mjs.
 *
 * Each scenario pairs one original demo page state (repo-root URL, optional
 * seeded localStorage / actions) with one Storybook story state (iframe id +
 * args). `expect` entries must be visible before screenshots; missing ones fail
 * the scenario. Only describe URLs, actions and expectations — no DOM dumps.
 */
export const BASELINE = { width: 1440, height: 1400 };

/**
 * Console errors that are allowed to fail-open. Each entry needs a precise
 * reason citing the original-demo defect (file/line). Story-side console
 * errors must never be allowed here — report them instead.
 * { side: "original"|"story", scenario?: "<id>", pattern: "<RegExp source>", reason }
 */
export const CONSOLE_ALLOW = [
  // Original demo defect: shrinking the live chart range to a single period
  // (end = FY25 P11 while hovered) makes scDrawChart divide by
  // `labels.length - 1` = 0 — assets/js/reports/report-core.js ~L3773
  // (`const X = function (i) { ... i / (labels.length - 1) }`), so the
  // polyline (~L3793) and x-axis labels (~L3788) emit NaN coordinates.
  {
    side: "original",
    scenario: "p02-live-city-hover-shrink",
    pattern: "^Error: <text> attribute x: Expected length",
    reason: "single-period chart emits NaN label x — report-core.js scDrawChart labels.length-1 division",
  },
  {
    side: "original",
    scenario: "p02-live-city-hover-shrink",
    pattern: "^Error: <polyline> attribute points: Expected number",
    reason: "single-period chart emits NaN polyline points — report-core.js scDrawChart labels.length-1 division",
  },
];
