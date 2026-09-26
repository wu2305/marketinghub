/**
 * Scenario config for scripts/visual-check.mjs.
 *
 * The scenarios themselves live in scripts/visual-check/scenarios/p0x.mjs,
 * one module per original page (p08+ follow the same rule). Shared exports
 * (BASELINE, CONSOLE_ALLOW) live in scripts/visual-check/common.mjs. This
 * module only aggregates them, preserving the original array order.
 */
export { BASELINE, CONSOLE_ALLOW } from "./visual-check/common.mjs";

import p01 from "./visual-check/scenarios/p01.mjs";
import p02 from "./visual-check/scenarios/p02.mjs";
import p03 from "./visual-check/scenarios/p03.mjs";
import p04 from "./visual-check/scenarios/p04.mjs";
import p05 from "./visual-check/scenarios/p05.mjs";
import p06 from "./visual-check/scenarios/p06.mjs";
import p07 from "./visual-check/scenarios/p07.mjs";
import p11 from "./visual-check/scenarios/p11.mjs";
import p08 from "./visual-check/scenarios/p08.mjs";
import p10 from "./visual-check/scenarios/p10.mjs";
import p09 from "./visual-check/scenarios/p09.mjs";
import p12 from "./visual-check/scenarios/p12.mjs";
import p13 from "./visual-check/scenarios/p13.mjs";
import p14 from "./visual-check/scenarios/p14.mjs";
import p15 from "./visual-check/scenarios/p15.mjs";
import p16 from "./visual-check/scenarios/p16.mjs";
import p17 from "./visual-check/scenarios/p17.mjs";

export default [
  ...p01,
  ...p02,
  ...p03,
  ...p04,
  ...p05,
  ...p06,
  ...p07,
  ...p09,
  ...p11,
  ...p08,
  ...p10,
  ...p12,
  ...p13,
  ...p14,
  ...p15,
  ...p16,
  ...p17,
];
