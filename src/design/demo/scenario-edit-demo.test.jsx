import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { SCENARIO_EDIT } from "./content/scenario-edit.js";
import { useScenarioEditDemo } from "./scenario-edit-demo.js";

const props = (extra = {}) => ({ content: SCENARIO_EDIT, ...extra });

describe("Scenario Edit demo stubs", () => {
  it("AI Auto-fill replaces only the pressed field and reports it", () => {
    const onAutoFill = vi.fn();
    const { result, unmount } = renderHook(() => useScenarioEditDemo(props({ onAutoFill })));
    const before = result.current.form.values;
    act(() => result.current.form.onAutoFill({ field: "output" }));
    expect(result.current.form.values.output).toBe(SCENARIO_EDIT.labels.autoFillText.output);
    expect(result.current.form.values.logic).toBe(before.logic);
    expect(onAutoFill).toHaveBeenCalledExactlyOnceWith({ field: "output" });
    unmount();
  });

  it("Save Draft acknowledges with a toast without validating a partial form", () => {
    const onSaveDraft = vi.fn();
    const initial = { values: { name: "", purpose: "", scope: "", owner: "", report: "" } };
    const { result, unmount } = renderHook(() => useScenarioEditDemo(props({ onSaveDraft, initial })));
    act(() => result.current.form.onSaveDraft());
    expect(result.current.toast).toBe("Draft saved");
    expect(result.current.form.errors).toEqual({});
    expect(onSaveDraft).toHaveBeenCalledExactlyOnceWith({ id: null, status: "Draft", values: expect.objectContaining({ name: "" }) });
    unmount();
  });
});
