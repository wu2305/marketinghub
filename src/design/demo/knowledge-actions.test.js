import { describe, expect, it } from "vitest";
import { knowledgeActions, knowledgeStatus } from "./knowledge-actions.js";

describe("P07 knowledge action rules", () => {
  const owner = "Current User";
  const actions = (record, strings) => knowledgeActions(record, { currentUser: owner, strings });
  it("normalizes the three source availability encodings", () => {
    expect(knowledgeStatus({ status: "Disabled" })).toBe("Disable");
    expect(knowledgeStatus({ usage_status: "Disabled" })).toBe("Disable");
    expect(knowledgeStatus({ ai_interpreter_enabled: false })).toBe("Disable");
    expect(knowledgeStatus({ status: "Enable" })).toBe("Enable");
  });
  it("gates by owner and availability while retaining a clickable referenced delete", () => {
    expect(actions({ creator: "Someone Else", status: "Enable" }).every((a) => a.disabled)).toBe(true);
    const enabled = actions({ creator: owner, status: "Enable" });
    expect(enabled.map((a) => a.disabled)).toEqual([true, true, false]);
    const offline = actions({ created_by: owner, status: "Disable", references: ["Report A"] });
    expect(offline.map((a) => a.disabled)).toEqual([false, false, true]);
  });
  it("preserves Business Term's Draft disable rule and the field/scenario difference", () => {
    const draft = { creator: owner, status: "Enable", stage: "Draft" };
    expect(actions(draft)[2].disabled).toBe(true);
    expect(actions(draft, { draftCannotDisable: false })[2].disabled).toBe(false);
  });
});
