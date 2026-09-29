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

const CREATE = { mode: "create" };
const EDIT = { mode: "edit", selectedId: "scenario-channel-performance" };

describe("useSkillLibraryDemo form stubs (D11, D13, D14)", () => {
  it("AI Auto-fill replaces only the pressed field", () => {
    const onAutoFill = vi.fn();
    const hook = renderHook(() => useSkillLibraryDemo({ initial: CREATE, onAutoFill }));
    act(() => hook.result.current.form.onChange({ key: "name", value: "Typed name" }));
    act(() => hook.result.current.form.onAutoFill({ field: "boundary" }));
    expect(hook.result.current.form.values.boundary).toBe(SKILL_LIBRARY.labels.autoFillText.boundary);
    expect(hook.result.current.form.values.name).toBe("Typed name");
    expect(hook.result.current.form.values.logic).toBe("");
    expect(onAutoFill).toHaveBeenCalledExactlyOnceWith({ field: "boundary" });
    hook.unmount();
  });

  it("Run Preview answers a blank question with the prompt and a typed one with the simulated result", () => {
    const hook = renderHook(() => useSkillLibraryDemo({ initial: CREATE }));
    expect(hook.result.current.form.preview).toBeNull();
    act(() => hook.result.current.form.onRunPreview({ question: "  " }));
    expect(hook.result.current.form.preview).toBe(SKILL_LIBRARY.labels.previewEmpty);
    act(() => hook.result.current.form.onChange({ key: "question", value: "Why did Shanghai drop?" }));
    act(() => hook.result.current.form.onRunPreview({ question: "Why did Shanghai drop?" }));
    expect(hook.result.current.form.preview).toContain('Generating preview for: "Why did Shanghai drop?"');
    hook.unmount();
  });

  it("edit starts the example question from the record", () => {
    const hook = renderHook(() => useSkillLibraryDemo({ initial: EDIT }));
    expect(hook.result.current.form.values.question).toBe(records[0].previewQuestion);
    hook.unmount();
  });

  it("Save Draft adds one Draft row on create, then updates that row, and acknowledges each save", () => {
    const onSaveDraft = vi.fn();
    const hook = renderHook(() => useSkillLibraryDemo({ initial: CREATE, onSaveDraft }));
    act(() => hook.result.current.form.onSaveDraft());
    expect(hook.result.current.library.items).toHaveLength(10);
    expect(hook.result.current.library.items[0]).toMatchObject({ name: "Untitled scenario", status: "Draft" });
    expect(hook.result.current.toast).toBe("Draft saved");
    act(() => hook.result.current.form.onChange({ key: "name", value: "Renamed draft" }));
    act(() => hook.result.current.form.onSaveDraft());
    expect(hook.result.current.library.items).toHaveLength(10);
    expect(hook.result.current.library.items[0].name).toBe("Renamed draft");
    expect(onSaveDraft).toHaveBeenLastCalledWith(expect.objectContaining({ id: hook.result.current.library.items[0].id, status: "Draft" }));
    hook.unmount();
  });

  it("Save Draft on an edited skill keeps its record and sets it to Draft", () => {
    const hook = renderHook(() => useSkillLibraryDemo({ initial: EDIT }));
    act(() => hook.result.current.form.onSaveDraft());
    expect(hook.result.current.library.items).toHaveLength(9);
    const saved = hook.result.current.library.items.find((skill) => skill.id === "scenario-channel-performance");
    expect(saved.status).toBe("Draft");
    expect(saved.callCount).toBe(records[0].callCount);
    hook.unmount();
  });

  it("a new create form does not keep the previous draft target", () => {
    const hook = renderHook(() => useSkillLibraryDemo({ initial: CREATE }));
    act(() => hook.result.current.form.onSaveDraft());
    act(() => hook.result.current.form.onCancel({ reason: "cancel" }));
    act(() => hook.result.current.library.onClick({ action: "create" }));
    act(() => hook.result.current.form.onSaveDraft());
    expect(hook.result.current.library.items).toHaveLength(11);
    hook.unmount();
  });
});
