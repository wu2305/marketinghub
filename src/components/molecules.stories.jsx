import React from "react";
import { action } from "@storybook/addon-actions";
import { trees } from "../assembled/registry.js";
import { findComponent } from "../assembled/find.js";
import { withPortalActions } from "../assembled/story-actions.jsx";
import {
  AddButton,
  AssetRow,
  Breadcrumb,
  FormField,
  HeroStat,
  SearchField,
  SectionHeading,
  SidebarItem,
  Signal,
  TypeStatCard,
  WorkspaceCard,
  markupProps,
} from "../assembled/ui.jsx";

export default {
  title: "Components/Molecules",
  decorators: [withPortalActions],
};

const hero = findComponent(trees.home, "CommandHero")[0];
const knowledgeHero = findComponent(trees.knowledge, "CommandHero")[0];
const heading = findComponent(trees.home, "SectionHeading")[0];
const card = findComponent(trees.home, "WorkspaceGrid")[0].cards[0];
const search = findComponent(trees.knowledge, "SearchField")[0];
const sidebar = findComponent(trees.knowledge, "SidebarItem")[0];
const crumb = findComponent(trees["knowledge-create"], "PageHead")[0].breadcrumb;
const add = findComponent(trees.knowledge, "AddButton")[0];

export const HomeSignal = {
  name: "Signal",
  args: { ...hero.signals[0] },
  render: (args) => (
    <div className="home-signal-grid" style={{ padding: 24, maxWidth: 280 }}>
      <Signal {...args} />
    </div>
  ),
};

export const PublishedKnowledge = {
  name: "Hero stat",
  args: { ...knowledgeHero.stats[0] },
  render: (args) => (
    <div className="knowledge-v4" style={{ padding: 24, background: "#3a2418" }}>
      <HeroStat {...args} />
    </div>
  ),
};

export const WorkspacesHeading = {
  name: "Section heading",
  args: heading,
  render: (args) => (
    <div style={{ padding: 24 }}>
      <SectionHeading {...args} />
    </div>
  ),
};

export const MarketingCockpitCard = {
  name: "Workspace card",
  args: { title: card.title, description: card.description },
  render: (args) => (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <WorkspaceCard {...card} {...args} onOpen={action("onOpen")} onNavigate={action("onNavigate")} />
    </div>
  ),
};

export const KnowledgeSearch = {
  name: "Search field",
  args: { ...search, query: "" },
  render: (args) => (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <SearchField
        {...args}
        input={{ ...args.input, value: args.query }}
        onChange={action("onChange")}
      />
    </div>
  ),
};

export const OverviewItem = {
  name: "Sidebar item",
  args: { label: sidebar.label, active: false },
  render: (args) => (
    <div style={{ width: 280, padding: 12 }}>
      <SidebarItem
        {...sidebar}
        label={args.label}
        attrs={{ ...sidebar.attrs, class: `sidebar-item${args.active ? " active" : ""}` }}
        onSelect={action("onSelect")}
      />
    </div>
  ),
};

export const CreateBreadcrumb = {
  name: "Breadcrumb",
  args: crumb,
  render: (args) => (
    <div style={{ padding: 24 }}>
      <Breadcrumb {...args} onNavigate={action("onNavigate")} />
    </div>
  ),
};

export const CreateKnowledge = {
  name: "Add button",
  args: add,
  render: (args) => (
    <div style={{ padding: 24 }}>
      <AddButton {...markupProps(args)} onClick={action("onClick")} />
    </div>
  ),
};

export const RequiredField = {
  name: "Form field",
  args: { label: "Title", value: "", invalid: false, required: true },
  render: (args) => (
    <div className="unified-knowledge-create business-term-create" style={{ padding: 24, maxWidth: 560 }}>
      <FormField
        className="bt-field span-2"
        label={args.label}
        name="title"
        required={args.required}
        invalid={args.invalid}
        value={args.value}
        placeholder="Enter the business term title."
        onChange={action("onChange")}
      />
    </div>
  ),
};

export const KnowledgeAsset = {
  name: "Asset row",
  args: {
    id: "business-term-gmv",
    mark: "BT",
    title: "GMV (Gross Merchandise Value)",
    summary: "Total value of merchandise sold through the platform before deductions.",
    type: "Business Term",
    scope: "Global",
    owner: "Current User",
    status: "Published",
    usage: "432",
    created: "Jul 12, 2026",
    active: false,
    menuOpen: false,
  },
  render: (args) => (
    <div className="asset-list" style={{ padding: 12 }}>
      <AssetRow {...args} onSelect={action("onSelect")} onAction={action("onAction")} />
    </div>
  ),
};

export const BusinessTermsStat = {
  name: "Type stat card",
  args: { type: "Business Term", label: "Business Terms", count: "6", active: false },
  render: (args) => (
    <div style={{ width: 240, padding: 12 }}>
      <TypeStatCard {...args} onSelect={action("onSelect")} />
    </div>
  ),
};
