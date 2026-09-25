import { LOGO, NAV } from "../../content.js";
import { DATA_MODEL_DOMAINS } from "../data-model-domains.js";
import { DATA_MODEL_STRINGS } from "../data-model-demo.js";

/** Source-backed standalone P11 defaults. Replace this whole object in a host. */
export const DATA_MODEL_PAGE = {
  logo: LOGO,
  navigation: NAV,
  domains: DATA_MODEL_DOMAINS,
  strings: DATA_MODEL_STRINGS,
};
