import { describe, expect, it } from "vitest";
import { demoHrefFor, demoTargetForHref, normalizeRouteTarget } from "./navigation.js";

describe("semantic demo navigation adapter", () => {
  it("has an original-page link for every rebuilt page", () => {
    const ids = ["home", "cockpit", "self-service", "data-upload", "media-tracking-detail", "campaign", "interpreter", "knowledge-create", "knowledge-view", "metric-dictionary", "data-model", "review-center", "feedback-quality", "personal-memory", "scenario-library", "scenario-detail", "scenario-edit"];
    for (const id of ids) expect(demoTargetForHref(demoHrefFor(id))).toEqual({ id, params: {} });
  });

  it("keeps project, dashboard, knowledge type, and record identity", () => {
    expect(normalizeRouteTarget("cockpit-live", { project: "city", dashboard: 0 })).toEqual({ id: "cockpit", params: { project: "city", dashboard: 0, view: "live" } });
    expect(demoTargetForHref(demoHrefFor("cockpit-live", { project: "city", dashboard: 0 }))).toEqual({ id: "cockpit", params: { project: "city", dashboard: "0", view: "live" } });
    expect(demoTargetForHref(demoHrefFor("interpreter-type", { typeId: "Report Context", detail: "city-context" }))).toEqual({ id: "interpreter", params: { type: "Report Context", detail: "city-context" } });
    expect(demoTargetForHref(demoHrefFor("scenario-edit", { id: "scenario-city" }))).toEqual({ id: "scenario-edit", params: { id: "scenario-city" } });
  });
});
