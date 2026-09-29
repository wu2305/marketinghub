import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { SKILL_LIBRARY } from "./content/skill-library.js";
import { filterSkills, useSkillLibraryDemo } from "./skill-library-demo.js";

const records = SKILL_LIBRARY.records;
/* The hook re-syncs on a new `initial` object, so tests keep them stable. */
const DETAIL_OPEN = { selectedId: "scenario-channel-performance" };
const NO_MATCH = { search: "no matching scenario", status: "Draft" };

describe("Skill Library filters", () => {
  it("searches name, purpose and owner and filters status exactly", () => {
    expect(filterSkills(records, { search: "Emily Wang" })).toHaveLength(2);
    expect(filterSkills(records, { status: "Draft" }).map((skill) => skill.name)).toEqual(["Competitive Media Analysis"]);
    expect(filterSkills(records, { search: "no matching scenario" })).toHaveLength(0);
  });
});

describe("useSkillLibraryDemo delete flow (D10)", () => {
  it("confirms, removes the skill, closes the drawer and shows the toast", () => {
    const onClick = vi.fn();
    const hook = renderHook(() => useSkillLibraryDemo({ initial: DETAIL_OPEN, onClick }));
    expect(hook.result.current.dialog).toBeNull();
    act(() => hook.result.current.detail.onClick({ id: "scenario-channel-performance", action: "delete" }));
    expect(onClick).toHaveBeenCalledWith({ id: "scenario-channel-performance", action: "delete" });
    expect(hook.result.current.dialog.purpose).toBe("danger");
    expect(hook.result.current.library.items).toHaveLength(9);
    act(() => hook.result.current.dialog.onConfirm());
    expect(hook.result.current.library.items).toHaveLength(8);
    expect(hook.result.current.library.items.some((skill) => skill.id === "scenario-channel-performance")).toBe(false);
    expect(hook.result.current.detail.skill).toBeNull();
    expect(hook.result.current.dialog).toBeNull();
    expect(hook.result.current.toast).toBe("Deleted successfully");
    hook.unmount();
  });

  it("keeps the skill when the confirmation is cancelled", () => {
    const hook = renderHook(() => useSkillLibraryDemo({ initial: DETAIL_OPEN }));
    act(() => hook.result.current.detail.onClick({ id: "scenario-channel-performance", action: "delete" }));
    act(() => hook.result.current.dialog.onCancel());
    expect(hook.result.current.library.items).toHaveLength(9);
    expect(hook.result.current.detail.skill.id).toBe("scenario-channel-performance");
    expect(hook.result.current.toast).toBe("");
    hook.unmount();
  });

  it("clears search and status from the no-results state", () => {
    const hook = renderHook(() => useSkillLibraryDemo({ initial: NO_MATCH }));
    expect(hook.result.current.library.items).toHaveLength(0);
    act(() => hook.result.current.library.onClear({ kind: "no-results" }));
    expect(hook.result.current.library.items).toHaveLength(9);
    hook.unmount();
  });
});
