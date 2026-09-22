import React from "react";
import { action } from "@storybook/addon-actions";
import { trees } from "../assembled/registry.js";
import { findComponent } from "../assembled/find.js";
import { withPortalActions } from "../assembled/story-actions.jsx";
import {
  AiLauncher,
  AssistantPanel,
  CommandHero,
  KnowledgeSidebar,
  LibraryToolbar,
  ManagementRules,
  PageHead,
  SiteHeader,
  WorkspaceGrid,
  WorkspaceHeader,
  markupProps,
} from "../assembled/ui.jsx";
import { AnalyticalModelForm, BusinessTermForm } from "./forms.jsx";

export default {
  title: "Components/Organisms",
  decorators: [withPortalActions],
};

const header = findComponent(trees.home, "SiteHeader")[0];
const workspaceHeader = findComponent(trees["metric-dictionary"], "WorkspaceHeader")[0];
const hero = findComponent(trees.home, "CommandHero")[0];
const knowledgeHero = findComponent(trees.knowledge, "CommandHero")[0];
const grid = findComponent(trees.home, "WorkspaceGrid")[0];
const sidebar = findComponent(trees.knowledge, "KnowledgeSidebar")[0];
const toolbar = findComponent(trees.knowledge, "LibraryToolbar")[0];
const pageHead = findComponent(trees["knowledge-create"], "PageHead")[0];
const launcher = findComponent(trees.home, "AiLauncher")[0];
const assistant = findComponent(trees.home, "AssistantPanel")[0];

export const PortalHeader = {
  name: "Site header",
  args: { ...header, current: "Home" },
  argTypes: {
    current: {
      control: "select",
      options: header.items.map((item) => item.label),
    },
    onNavigate: { action: "onNavigate" },
  },
  render: (args) => (
    <SiteHeader
      {...args}
      items={args.items.map((item) => ({ ...item, current: item.label === args.current }))}
      onNavigate={args.onNavigate || action("onNavigate")}
    />
  ),
};

export const MetricHeader = {
  name: "Workspace header",
  args: workspaceHeader,
  render: (args) => <WorkspaceHeader {...args} onNavigate={action("onNavigate")} />,
};

export const HomeHero = {
  name: "Command hero",
  args: { title: hero.title, description: hero.description },
  render: (args) => <CommandHero {...hero} {...args} />,
};

export const KnowledgeHero = {
  name: "Knowledge hero",
  args: { title: knowledgeHero.title, description: knowledgeHero.description, showRules: true },
  render: (args) => (
    <div className="knowledge-v4">
      <CommandHero {...knowledgeHero} title={args.title} description={args.description} />
      {args.showRules ? (
        <div className="knowledge-hero-stats" style={{ position: "relative", minHeight: 160, margin: "0 24px" }}>
          <ManagementRules />
        </div>
      ) : null}
    </div>
  ),
};

export const Workspaces = {
  name: "Workspace grid",
  args: grid,
  render: (args) => (
    <div style={{ padding: 24 }}>
      <WorkspaceGrid {...args} onOpen={action("onOpen")} onNavigate={action("onNavigate")} />
    </div>
  ),
};

export const InterpreterSidebar = {
  name: "Knowledge sidebar",
  args: sidebar,
  render: (args) => (
    <div style={{ width: 280 }}>
      <KnowledgeSidebar {...markupProps(args)} />
    </div>
  ),
};

export const KnowledgeToolbar = {
  name: "Library toolbar",
  args: toolbar,
  render: (args) => (
    <div className="knowledge-library" style={{ padding: 24 }}>
      <LibraryToolbar {...markupProps(args)} />
    </div>
  ),
};

export const CreatePageHead = {
  name: "Page head",
  args: { ...pageHead, statusText: pageHead.status.text },
  render: (args) => (
    <div className="v20-page" style={{ padding: 24 }}>
      <PageHead {...args} status={{ ...args.status, text: args.statusText }} onNavigate={action("onNavigate")} />
    </div>
  ),
};

export const Launcher = {
  name: "AI launcher",
  args: launcher,
  render: (args) => (
    <div style={{ minHeight: 120 }}>
      <AiLauncher {...args} onOpen={action("onOpen")} />
    </div>
  ),
};

export const AskPanel = {
  name: "Assistant panel",
  args: { open: true },
  render: (args) => {
    const attrs = { ...assistant.attrs };
    if (args.open) delete attrs.hidden;
    else attrs.hidden = "";
    return <AssistantPanel attrs={attrs} nodes={assistant.children} />;
  },
};

export const BusinessTerm = {
  name: "Business Term form",
  args: { title: "", kind: "Business Term", description: "", synonyms: "", invalid: false },
  argTypes: { kind: { control: "select", options: ["Business Term", "Global Synonym"] } },
  render: (args) => (
    <div className="v20-shell" style={{ padding: 24 }}>
      <BusinessTermForm {...args} onChange={action("onChange")} onCancel={action("onCancel")} onSave={action("onSave")} onSubmit={action("onSubmit")} />
    </div>
  ),
};

export const AnalyticalModel = {
  name: "Analytical Model form",
  args: { analysisName: "", description: "", triggerWhen: "", constraints: "", invalid: false },
  render: (args) => (
    <div className="v20-shell" style={{ padding: 24 }}>
      <AnalyticalModelForm {...args} onChange={action("onChange")} onCancel={action("onCancel")} onSave={action("onSave")} onSubmit={action("onSubmit")} />
    </div>
  ),
};
