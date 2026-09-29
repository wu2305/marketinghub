// Sample content for the Organisms/Library stories (patterns/library.md §4).
import { governedActions } from "../lib/governance.js";

export const me = "Current User";
export const records = [
  { id: "gmv", title: "GMV", description: "Gross merchandise value across all channels, before returns and discounts.", creator: me, status: "Disable", domain: "Sales" },
  { id: "aov", title: "Average order value", description: "GMV divided by the number of paid orders in the period.", creator: me, status: "Enable", domain: "Sales" },
  { id: "draft", title: "Member reactivation", description: "A lapsed member who purchases again within the campaign window.", creator: me, status: "Enable", stage: "Draft", domain: "CRM" },
  { id: "other", title: "Store traffic", description: "Visits counted by door sensors in owned stores.", creator: "Emily Wang", status: "Enable", domain: "Retail" },
];

export const toItem = (record) => ({
  id: record.id,
  title: record.title,
  description: record.description,
  draft: record.stage === "Draft",
  status: record.stage === "Draft" || record.status === "Disable"
    ? { status: "disabled", label: "Disabled" }
    : { status: "enabled", label: "Enabled" },
  meta: [
    { label: "Domain", value: record.domain },
    { label: "Creator", value: record.creator },
  ],
  actions: { actions: governedActions(record, { currentUser: me }) },
});
