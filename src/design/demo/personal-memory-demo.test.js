import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { PERSONAL_MEMORY } from "./content/personal-memory.js";
import { usePersonalMemoryDemo } from "./personal-memory-demo.js";

describe("Personal Memory demo composition", () => {
  it("preserves selection while deleting another card and isolates a replacement fixture", () => {
    const initial = { selectedId: "mem-analysis-1" };
    const first = renderHook(({ records }) => usePersonalMemoryDemo({ content: PERSONAL_MEMORY, records, initial }), { initialProps: { records: PERSONAL_MEMORY.records } });
    const second = renderHook(() => usePersonalMemoryDemo({ content: PERSONAL_MEMORY, records: PERSONAL_MEMORY.records }));
    act(() => first.result.current.memory.onDelete({ id: "mem-meeting-1" }));
    expect(first.result.current.memory.selected.id).toBe("mem-analysis-1");
    expect(first.result.current.deletion.target.id).toBe("mem-meeting-1");
    act(() => first.result.current.deletion.onConfirm());
    expect(first.result.current.memory.selected.id).toBe("mem-analysis-1");
    expect(first.result.current.memory.counts.all).toBe(17);
    expect(second.result.current.memory.counts.all).toBe(18);
    first.rerender({ records: [{ ...PERSONAL_MEMORY.records[0], id: "replacement", title: "Host memory" }] });
    expect(first.result.current.memory.items[0].title).toBe("Host memory");
    expect(first.result.current.memory.selected).toBeNull();
    first.unmount(); second.unmount();
  });

  it("keeps the active filter when creating elsewhere, and clears errors on a fresh drawer", () => {
    const initial = { category: "reference" };
    const { result, unmount } = renderHook(() => usePersonalMemoryDemo({ content: PERSONAL_MEMORY, records: PERSONAL_MEMORY.records, initial }));
    act(() => result.current.create.onOpen());
    act(() => result.current.create.onSave());
    expect(result.current.create.errors).toEqual({ title: true, description: true });
    act(() => result.current.create.onClose({ reason: "cancel" }));
    act(() => result.current.create.onOpen());
    expect(result.current.create.errors).toEqual({});
    act(() => result.current.create.onChange({ field: "title", value: "New analysis" }));
    act(() => result.current.create.onChange({ field: "description", value: "Recorded locally" }));
    act(() => result.current.create.onSave());
    expect(result.current.memory.category).toBe("reference");
    expect(result.current.memory.items).toHaveLength(3);
    expect(result.current.memory.selected.title).toBe("New analysis");
    expect(result.current.memory.counts.all).toBe(19);
    unmount();
  });

  it("fills the description from AI Auto-fill without touching the title, and clears its error", () => {
    const { result, unmount } = renderHook(() => usePersonalMemoryDemo({ content: PERSONAL_MEMORY, records: PERSONAL_MEMORY.records }));
    act(() => result.current.create.onOpen());
    act(() => result.current.create.onChange({ field: "title", value: "Typed title" }));
    act(() => result.current.create.onSave());
    expect(result.current.create.errors.description).toBe(true);
    act(() => result.current.create.onAutoFill({ field: "description" }));
    expect(result.current.create.draft.description).toBe(PERSONAL_MEMORY.labels.autoFillText);
    expect(result.current.create.draft.title).toBe("Typed title");
    expect(result.current.create.errors.description).toBe(false);
    unmount();
  });

  it("shows the delete toast only after confirming, not on cancel", () => {
    const { result, unmount } = renderHook(() => usePersonalMemoryDemo({ content: PERSONAL_MEMORY, records: PERSONAL_MEMORY.records }));
    act(() => result.current.memory.onDelete({ id: "mem-meeting-1" }));
    act(() => result.current.deletion.onCancel());
    expect(result.current.toast).toBe("");
    act(() => result.current.memory.onDelete({ id: "mem-meeting-1" }));
    act(() => result.current.deletion.onConfirm());
    expect(result.current.toast).toBe("Deleted successfully");
    unmount();
  });
});
