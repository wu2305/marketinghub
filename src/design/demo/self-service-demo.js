import React from "react";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

/** Deterministic replacement for flexible.html's createAnswer(). */
export function buildSelfServiceAnswer(query) {
  return {
    query,
    variant: "workspace",
    banner: "AI Response",
    context: "Context: Reports",
    body: "Based on current report data and flexible analysis views, here are the key findings.",
    findings: [
      { label: "Media Monitoring", detail: "DG MZ data shows consistent channel performance with Rednote leading in engagement metrics." },
      { label: "Data Upload Status", detail: "Last offline data upload was validated successfully — 341 records processed." },
      { label: "Cross-Channel Comparison", detail: "City Strategy reports show 10% traffic uplift in invest cities across all monitored channels." },
    ],
    sources: [
      "Flexible Analysis / DG MZ Data",
      "Performance Tracking / City Strategy",
      "Data Upload / Validated Records",
    ],
  };
}

/**
 * Self-Service's local demo flow, shared by Storybook and independent hosts.
 * The original page keeps one answer at a time, auto-submits suggestions,
 * and only fills the composer when a recent chat is selected.
 * @param {object} props SelfServicePage data, initial state and callbacks
 * @param {{ answerFor?: (query: string) => object, modelFlow?: object, modelDraftFor?: (messages: object[], rule: string) => object }} [props.demo]
 * @returns {object} fully wired SelfServicePage props
 */
export function useSelfServiceDemo(props) {
  const [tab, setTab] = React.useState(props.tab || "analysis");
  const [categories, setCategories] = React.useState({ analysis: props.category || "all", upload: "all" });
  const [historyItem, setHistoryItem] = React.useState(null);
  React.useEffect(() => setTab(props.tab || "analysis"), [props.tab]);
  React.useEffect(() => setCategories((current) => ({ ...current, analysis: props.category || "all" })), [props.category]);

  const workspace = useWorkspaceAssistantDemo({
    ...props,
    demo: { ...props.demo, answerFor: props.demo?.answerFor || buildSelfServiceAnswer },
  });
  return {
    ...props,
    ...workspace,
    tab,
    category: categories[tab] || "all",
    uploadHistory: { ...props.uploadHistory, ...(historyItem || {}) },
    onTabChange: (event) => {
      setTab(event.id);
      props.onTabChange?.(event);
    },
    onCategoryChange: (event) => {
      setCategories((current) => ({ ...current, [tab]: event.id }));
      props.onCategoryChange?.(event);
    },
    onOpenHistory: ({ item }) => {
      setHistoryItem({ open: true, rows: item.history || [] });
      props.onOpenHistory?.({ item });
    },
    onCloseHistory: (event) => {
      setHistoryItem((current) => ({ ...(current || {}), open: false }));
      props.onCloseHistory?.(event);
    },
  };
}
