import { describe, expect, it } from "vitest";
import { availabilityOf, governanceMessages, governedActions } from "./governance.js";

const me = "Current User";
const states = {
  enabled: { status: "Enable" },
  disabled: { status: "Disable" },
  draft: { status: "Enable", stage: "Draft" },
};
// [creator, state, action] -> reason (null = allowed). domain-model.md R1-R3, pattern B6.
const table = [
  ["me", "enabled", "edit", "disable-first"],
  ["me", "enabled", "delete", "disable-first"],
  ["me", "enabled", "disable", null],
  ["me", "disabled", "edit", null],
  ["me", "disabled", "delete", null],
  ["me", "disabled", "disable", "already-disabled"],
  ["me", "draft", "edit", null],
  ["me", "draft", "delete", null],
  ["me", "draft", "disable", "already-disabled"],
  ["other", "enabled", "edit", "permission"],
  ["other", "enabled", "delete", "permission"],
  ["other", "enabled", "disable", "permission"],
  ["other", "disabled", "edit", "permission"],
  ["other", "disabled", "delete", "permission"],
  ["other", "disabled", "disable", "permission"],
  ["other", "draft", "edit", "permission"],
  ["other", "draft", "delete", "permission"],
  ["other", "draft", "disable", "permission"],
];

describe("governedActions", () => {
  it.each(table)("creator %s, %s, %s -> %s", (who, state, action, reason) => {
    const record = { ...states[state], creator: who === "me" ? me : "Emily Wang" };
    const result = governedActions(record, { currentUser: me }).find((item) => item.action === action);
    expect(result).toEqual({ action, blocked: reason !== null, reason });
  });

  it("returns edit, delete, disable in order and reads created_by before creator", () => {
    const result = governedActions({ created_by: me, creator: "Someone", status: "Disable" }, { currentUser: me });
    expect(result.map((item) => item.action)).toEqual(["edit", "delete", "disable"]);
    expect(result[0].blocked).toBe(false);
  });

  it("never treats the owning team as the creator", () => {
    expect(governedActions({ owner: me, status: "Disable" }, { currentUser: me })[0].reason).toBe("permission");
  });
});

describe("availabilityOf", () => {
  it.each([
    [{ status: "Enable" }, "enabled"],
    [{ status: "Disable" }, "disabled"],
    [{ status: "enable" }, "enabled"],
    [{ status: "Disabled" }, "disabled"],
    [{ usage_status: "Disabled" }, "disabled"],
    [{ availability: "enabled" }, "enabled"],
    [{ ai_interpretation_enabled: false }, "disabled"],
    [{ ai_interpretation_enabled: true }, "enabled"],
    [{ ai_interpreter_enabled: false }, "disabled"],
    [{ isDisabled: true }, "disabled"],
    [{ status: "Enable", stage: "Draft" }, "disabled"],
    [{}, "enabled"],
  ])("%j -> %s", (record, expected) => {
    expect(availabilityOf(record)).toBe(expected);
  });
});

describe("governanceMessages", () => {
  it("has a tooltip and a dialog for every reason", () => {
    for (const reason of ["permission", "disable-first", "already-disabled"]) {
      expect(governanceMessages[reason]).toBeTruthy();
      expect(governanceMessages.dialogs[reason].title).toBeTruthy();
    }
  });
});
