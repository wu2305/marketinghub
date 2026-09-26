import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { makeFeedbackRecords } from "./content/feedback-quality.js";
import { filterFeedback, useFeedbackQualityDemo } from "./feedback-quality-demo.js";

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

  it("keeps two host instances independent and accepts an explicit record replacement", () => {
    const initial = { selectedId: "fb-1" };
    const first = renderHook(({ rows }) => useFeedbackQualityDemo({ records: rows, now, initial }), { initialProps: { rows: records } });
    const second = renderHook(() => useFeedbackQualityDemo({ records, now }));
    act(() => first.result.current.filters.onTypeChange({ value: "thumbs-down" }));
    expect(first.result.current.list.items).toHaveLength(5);
    expect(second.result.current.list.items).toHaveLength(15);
    first.rerender({ rows: [{ ...records[0], id: "replacement", question: "Alternate host question" }] });
    expect(first.result.current.list.items).toHaveLength(0);
    expect(first.result.current.detail.selected).toBeNull();
    act(() => first.result.current.filters.onTypeChange({ value: "all" }));
    expect(first.result.current.list.items[0].question).toBe("Alternate host question");
    first.unmount(); second.unmount();
  });
});
