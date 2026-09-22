import React from "react";
import { AiInterpreterPage, CampaignPage, HomePage, MarketingCockpitPage, SelfServicePage } from "./pages.jsx";

export default {
  title: "Pages",
  parameters: { layout: "fullscreen" },
};

function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}

export const Home = {
  name: "Home",
  args: { assistantOpen: false, prompt: "", scope: "All" },
  argTypes: {
    scope: { control: "select", options: ["All", "Campaigns", "Dashboards", "Knowledge"] },
    onNavigate: { action: "onNavigate" },
    onOpen: { action: "onOpen" },
    onOpenAssistant: { action: "onOpenAssistant" },
    onCloseAssistant: { action: "onCloseAssistant" },
    onSubmit: { action: "onSubmit" },
    onSuggestion: { action: "onSuggestion" },
    onScopeChange: { action: "onScopeChange" },
    onPromptChange: { action: "onPromptChange" },
  },
  render: function HomeStory(args) {
    const [open, setOpen] = useSynced(args.assistantOpen);
    const [prompt, setPrompt] = useSynced(args.prompt);
    const [scope, setScope] = useSynced(args.scope);
    return (
      <HomePage
        assistantOpen={open}
        prompt={prompt}
        scope={scope}
        onNavigate={args.onNavigate}
        onOpen={args.onOpen}
        onOpenAssistant={() => {
          setOpen(true);
          args.onOpenAssistant?.();
        }}
        onCloseAssistant={() => {
          setOpen(false);
          args.onCloseAssistant?.();
        }}
        onPromptChange={(event) => {
          setPrompt(event.value);
          args.onPromptChange?.(event);
        }}
        onSuggestion={(event) => {
          setPrompt(event.prompt);
          args.onSuggestion?.(event);
        }}
        onScopeChange={(event) => {
          setScope(event.scope);
          args.onScopeChange?.(event);
        }}
        onSubmit={args.onSubmit}
      />
    );
  },
};

export const MarketingCockpit = {
  name: "Marketing Cockpit",
  args: { query: "" },
  argTypes: {
    onNavigate: { action: "onNavigate" },
    onOpen: { action: "onOpen" },
    onQueryChange: { action: "onQueryChange" },
  },
  render: function CockpitStory(args) {
    const [query, setQuery] = useSynced(args.query);
    return (
      <MarketingCockpitPage
        query={query}
        onNavigate={args.onNavigate}
        onOpen={args.onOpen}
        onQueryChange={(event) => {
          setQuery(event.value);
          args.onQueryChange?.(event);
        }}
      />
    );
  },
};

export const SelfService = {
  name: "Self-Service Center",
  args: { tab: "analysis", category: "all" },
  argTypes: {
    tab: { control: "inline-radio", options: ["analysis", "upload"] },
    category: { control: "inline-radio", options: ["all", "dg", "dc"] },
    onNavigate: { action: "onNavigate" },
    onTabChange: { action: "onTabChange" },
    onCategoryChange: { action: "onCategoryChange" },
    onOpen: { action: "onOpen" },
  },
  render: function SelfServiceStory(args) {
    const [tab, setTab] = useSynced(args.tab);
    const [category, setCategory] = useSynced(args.category);
    return (
      <SelfServicePage
        tab={tab}
        category={category}
        onNavigate={args.onNavigate}
        onOpen={args.onOpen}
        onTabChange={(event) => {
          setTab(event.id);
          setCategory("all");
          args.onTabChange?.(event);
        }}
        onCategoryChange={(event) => {
          setCategory(event.id);
          args.onCategoryChange?.(event);
        }}
      />
    );
  },
};

export const Interpreter = {
  name: "AI Interpreter",
  args: { activeType: "overview", query: "", status: "All statuses" },
  argTypes: {
    activeType: {
      control: "select",
      options: ["overview", "principles", "context", "model", "metrics", "terms", "analytical", "scenario", "email"],
    },
    status: { control: "select", options: ["All statuses", "Draft", "Under Review", "Published"] },
    onNavigate: { action: "onNavigate" },
    onSelectType: { action: "onSelectType" },
    onQueryChange: { action: "onQueryChange" },
    onStatusChange: { action: "onStatusChange" },
    onCreate: { action: "onCreate" },
    onSelectAsset: { action: "onSelectAsset" },
  },
  render: function InterpreterStory(args) {
    const [activeType, setActiveType] = useSynced(args.activeType);
    const [query, setQuery] = useSynced(args.query);
    const [status, setStatus] = useSynced(args.status);
    return (
      <AiInterpreterPage
        activeType={activeType}
        query={query}
        status={status}
        onNavigate={args.onNavigate}
        onSelectType={(event) => {
          setActiveType(event.id);
          args.onSelectType?.(event);
        }}
        onQueryChange={(event) => {
          setQuery(event.value);
          args.onQueryChange?.(event);
        }}
        onStatusChange={(event) => {
          setStatus(event.value);
          args.onStatusChange?.(event);
        }}
        onCreate={args.onCreate}
        onSelectAsset={args.onSelectAsset}
      />
    );
  },
};

export const Campaign = {
  name: "RedNote Campaign Tool",
  args: { section: "overview", channel: "rednote", query: "", assistantOpen: false, prompt: "" },
  argTypes: {
    section: { control: "select", options: ["overview", "execution", "assets", "analytics", "accounts"] },
    channel: { control: "inline-radio", options: ["rednote", "douyin"] },
    onNavigate: { action: "onNavigate" },
    onSectionChange: { action: "onSectionChange" },
    onChannelChange: { action: "onChannelChange" },
    onQueryChange: { action: "onQueryChange" },
    onFilter: { action: "onFilter" },
    onReset: { action: "onReset" },
    onCreateTask: { action: "onCreateTask" },
    onBindAccount: { action: "onBindAccount" },
    onSubmit: { action: "onSubmit" },
  },
  render: function CampaignStory(args) {
    const [section, setSection] = useSynced(args.section);
    const [channel, setChannel] = useSynced(args.channel);
    const [query, setQuery] = useSynced(args.query);
    const [open, setOpen] = useSynced(args.assistantOpen);
    const [prompt, setPrompt] = useSynced(args.prompt);
    return (
      <CampaignPage
        section={section}
        channel={channel}
        query={query}
        assistantOpen={open}
        prompt={prompt}
        onNavigate={args.onNavigate}
        onSectionChange={(event) => {
          setSection(event.id);
          args.onSectionChange?.(event);
        }}
        onChannelChange={(event) => {
          setChannel(event.id);
          args.onChannelChange?.(event);
        }}
        onQueryChange={(event) => {
          setQuery(event.value);
          args.onQueryChange?.(event);
        }}
        onFilter={args.onFilter}
        onReset={() => {
          setQuery("");
          args.onReset?.();
        }}
        onCreateTask={args.onCreateTask}
        onBindAccount={args.onBindAccount}
        onOpenAssistant={() => setOpen(true)}
        onCloseAssistant={() => setOpen(false)}
        onPromptChange={(event) => setPrompt(event.value)}
        onSubmit={args.onSubmit}
      />
    );
  },
};
