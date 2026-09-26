import { describe, expect, it } from "vitest";
import { makeFeedbackRecords } from "./content/feedback-quality.js";
import { filterFeedback } from "./feedback-quality-demo.js";

const now = Date.UTC(2026, 8, 26, 12);
const records = makeFeedbackRecords(now);

describe("Feedback & Quality source filters", () => {
  it("uses a single clock and the source's strict day thresholds", () => {
    const boundary = (days) => [
      { ...records[0], id: `at-${days}`, timestamp: new Date(now - days * 86400000).toISOString() },
      { ...records[0], id: `over-${days}`, timestamp: new Date(now - days * 86400000 - 1).toISOString() },
    ];
    for (const [time, days] of [["today", 1], ["week", 7], ["month", 30]]) {
      expect(filterFeedback(boundary(days), { time }, now).map((item) => item.id)).toEqual([`at-${days}`]);
    }
  });

  it("searches question, answer, feedback author and reason while Type remains independent", () => {
    for (const term of ["conversion rate", "email sequence", "Sarah Chen", "Returning Customers"]) {
      expect(filterFeedback(records, { search: term }, now)[0]?.id).toBe("fb-1");
    }
    expect(filterFeedback(records, { type: "thumbs-down" }, now)).toHaveLength(5);
    expect(filterFeedback(records, { search: "too generic" }, now)[0]?.id).toBe("fb-3");
  });
});
