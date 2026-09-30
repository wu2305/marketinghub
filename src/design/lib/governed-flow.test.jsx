import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { governanceMessages } from "./governance.js";
import { useGovernedFlow } from "./governed-flow.js";

const records = { a: { id: "a", title: "Alpha", status: "Enable" }, b: { id: "b", title: "Beta", status: "Disable" } };
const setup = (extra = {}) => {
  const calls = { onDisable: vi.fn(), onDelete: vi.fn(), onEdit: vi.fn() };
  const hook = renderHook(() => useGovernedFlow({ find: (id) => records[id], ...calls, ...extra }));
  return { ...hook, calls };
};

describe("useGovernedFlow", () => {
  it("explains a blocked action with an info dialog and changes nothing", () => {
    const { result, calls } = setup();
    act(() => result.current.onAction({ action: "edit", id: "a", reason: "permission" }));
    expect(result.current.dialog).toMatchObject({ purpose: "info", title: "Permission denied", message: governanceMessages.permission, closeLabel: "Close" });
    act(() => result.current.onDialogConfirm());
    expect(result.current.dialog).toBeNull();
    expect(calls.onDisable).not.toHaveBeenCalled();
    expect(calls.onEdit).not.toHaveBeenCalled();
  });

  it("asks before disabling and deleting; cancel changes nothing", () => {
    const { result, calls } = setup();
    act(() => result.current.onAction({ action: "disable", id: "a" }));
    expect(result.current.dialog).toMatchObject({ purpose: "warning", confirmLabel: "Confirm Offline" });
    act(() => result.current.onDialogCancel());
    expect(result.current.dialog).toBeNull();
    expect(calls.onDisable).not.toHaveBeenCalled();
    act(() => result.current.onAction({ action: "disable", id: "a" }));
    act(() => result.current.onDialogConfirm());
    expect(calls.onDisable).toHaveBeenCalledWith(records.a);
    act(() => result.current.onAction({ action: "delete", id: "b" }));
    expect(result.current.dialog).toMatchObject({ purpose: "danger", confirmLabel: "Confirm Delete" });
    act(() => result.current.onDialogConfirm());
    expect(calls.onDelete).toHaveBeenCalledWith(records.b);
  });

  it("opens the editor directly when nothing blocks it", () => {
    const { result, calls } = setup();
    act(() => result.current.onAction({ action: "edit", id: "b" }));
    expect(calls.onEdit).toHaveBeenCalledWith(records.b);
    expect(result.current.dialog).toBeNull();
  });

  it("disable first: confirm takes it offline, then continues the requested action with the updated record", () => {
    const offline = { ...records.a, status: "Disable", updated: true };
    const { result, calls } = setup({ onDisable: vi.fn(() => offline) });
    act(() => result.current.onAction({ action: "edit", id: "a", reason: "disable-first" }));
    expect(result.current.dialog).toMatchObject({ purpose: "warning", confirmLabel: "Go Offline" });
    act(() => result.current.onDialogConfirm());
    expect(calls.onEdit).toHaveBeenCalledWith(offline);
    act(() => result.current.onAction({ action: "delete", id: "a", reason: "disable-first" }));
    act(() => result.current.onDialogConfirm());
    expect(result.current.dialog).toMatchObject({ purpose: "danger" });
    act(() => result.current.onDialogConfirm());
    expect(calls.onDelete).toHaveBeenCalledWith(offline);
  });

  it("shows a delete-blocked explanation instead of the delete confirm", () => {
    const { result, calls } = setup({ deleteBlocked: (record) => (record.id === "b" ? { message: "Beta is referenced." } : null) });
    act(() => result.current.onAction({ action: "delete", id: "b" }));
    expect(result.current.dialog).toMatchObject({ purpose: "info", title: "Deletion blocked", message: "Beta is referenced." });
    act(() => result.current.onDialogConfirm());
    expect(calls.onDelete).not.toHaveBeenCalled();
  });

  it("uses injected copy and ignores unknown ids", () => {
    const { result } = setup({ copy: { confirmTitle: "Sure?", deleteConfirm: "Remove it" } });
    act(() => result.current.onAction({ action: "delete", id: "missing" }));
    expect(result.current.dialog).toBeNull();
    act(() => result.current.onAction({ action: "delete", id: "a" }));
    expect(result.current.dialog).toMatchObject({ title: "Sure?", confirmLabel: "Remove it" });
  });

  it("can open a confirmation on first render, and a blocked delete opens its explanation", () => {
    const { result } = setup({ initial: { kind: "disable", record: records.a } });
    expect(result.current.dialog).toMatchObject({ purpose: "warning", confirmLabel: "Confirm Offline" });
    const blocked = setup({ initial: { kind: "delete", record: records.b }, deleteBlocked: () => ({ message: "In use." }) });
    expect(blocked.result.current.dialog).toMatchObject({ purpose: "info", message: "In use." });
  });
});
