import React from "react";
import { SELF_SERVICE } from "../../content.js";
import { pageShell, useSynced } from "../../lib/story-helpers.js";
import { SelfServicePage } from "./index.jsx";

export default {
  title: "Pages",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export const SelfService = {
  name: "Self-Service Center",
  args: {
    tab: "analysis",
    category: "all",
    ...pageShell,
    hero: SELF_SERVICE.hero,
    tabs: SELF_SERVICE.tabs,
    filters: SELF_SERVICE.filters,
    reports: SELF_SERVICE.reports,
    uploads: SELF_SERVICE.uploads,
    uploadHistory: SELF_SERVICE.uploadHistory,
  },
  argTypes: {
    tab: { control: "inline-radio", options: ["analysis", "upload"] },
    category: { control: "inline-radio", options: ["all", "dg", "dc"] },
    onNavigate: { action: "onNavigate" },
    onTabChange: { action: "onTabChange" },
    onCategoryChange: { action: "onCategoryChange" },
    onOpen: { action: "onOpen" },
    onOpenHistory: { action: "onOpenHistory" },
    onCloseHistory: { action: "onCloseHistory" },
    onPreviewFile: { action: "onPreviewFile" },
    onDownloadFile: { action: "onDownloadFile" },
  },
  render: function SelfServiceStory(args) {
    const [tab, setTab] = useSynced(args.tab);
    const [categories, setCategories] = React.useState({ analysis: args.category, upload: "all" });
    const [history, setHistory] = React.useState(null);
    const uploadHistory = { ...args.uploadHistory, ...(history || {}) };
    return (
      <SelfServicePage
        {...args}
        tab={tab}
        category={categories[tab] || "all"}
        uploadHistory={uploadHistory}
        onNavigate={args.onNavigate}
        onOpen={args.onOpen}
        onOpenHistory={({ item }) => {
          setHistory({ open: true, rows: item.history || [] });
          args.onOpenHistory?.({ item });
        }}
        onCloseHistory={() => {
          setHistory((current) => ({ ...(current || {}), open: false }));
          args.onCloseHistory?.();
        }}
        onPreviewFile={args.onPreviewFile}
        onDownloadFile={args.onDownloadFile}
        onTabChange={(event) => {
          setTab(event.id);
          args.onTabChange?.(event);
        }}
        onCategoryChange={(event) => {
          setCategories((current) => ({ ...current, [tab]: event.id }));
          args.onCategoryChange?.(event);
        }}
      />
    );
  },
};
