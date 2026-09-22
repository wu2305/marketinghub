import React from "react";
import { action } from "@storybook/addon-actions";
import { trees } from "../assembled/registry.js";
import { findComponent } from "../assembled/find.js";
import { withPortalActions } from "../assembled/story-actions.jsx";
import { Button, Link, ScopeOption, Select, StatusBadge, Suggestion, TextArea, TextInput } from "../assembled/ui.jsx";

export default {
  title: "Components/Atoms",
  decorators: [withPortalActions],
};

const button = findComponent(trees["knowledge-create"], "Button").find((props) => props.attrs.class === "v20-primary");
const link = findComponent(trees.home, "Link")[0];
const field = findComponent(trees.home, "TextInput")[0];
const area = findComponent(trees.home, "TextArea")[0];
const select = findComponent(trees["knowledge-create"], "Select")[0];
const suggestion = findComponent(trees.home, "Suggestion")[0];
const scope = findComponent(trees.home, "ScopeOption")[0];

export const PrimaryButton = {
  name: "Primary button",
  args: { label: "Submit", variant: "primary", disabled: false },
  argTypes: {
    variant: { control: "select", options: ["secondary", "primary", "danger", "page-primary", "page-secondary"] },
    onClick: { action: "onClick" },
  },
  render: (args) => (
    <div style={{ padding: 24 }}>
      <Button
        attrs={{
          class:
            args.variant === "primary"
              ? "fm-button primary"
              : args.variant === "danger"
                ? "fm-button danger"
                : args.variant === "page-primary"
                  ? "v20-primary"
                  : args.variant === "page-secondary"
                    ? "v20-secondary"
                    : "fm-button",
          type: "button",
          ...(args.disabled ? { disabled: "" } : {}),
        }}
        onClick={args.onClick || action("onClick")}
      >
        {[{ kind: "text", value: args.label }]}
      </Button>
    </div>
  ),
};

export const CreateSubmit = {
  name: "Create submit",
  render: () => (
    <div style={{ padding: 24 }}>
      <Button {...button} onClick={action("onClick")} />
    </div>
  ),
};

export const TextLink = {
  name: "Link",
  args: { ...(link || { attrs: { href: "/original/index.html" }, children: [{ kind: "text", value: "Home" }] }) },
  render: (args) => (
    <div style={{ padding: 24 }}>
      <Link {...args} onNavigate={action("onNavigate")} />
    </div>
  ),
};

export const SearchInput = {
  name: "Text input",
  args: { ...(field || { attrs: { type: "search", placeholder: "Search knowledge..." } }) },
  render: (args) => (
    <div style={{ padding: 24 }}>
      <TextInput {...args} onChange={action("onChange")} />
    </div>
  ),
};

export const Multiline = {
  name: "Text area",
  args: area || { attrs: { rows: "6", placeholder: "Type or describe what you want to add..." }, children: [] },
  render: (args) => (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <TextArea {...args} onChange={action("onChange")} />
    </div>
  ),
};

export const KnowledgeType = {
  name: "Select",
  args: select,
  render: (args) => (
    <div style={{ padding: 24 }}>
      <Select {...args} onChange={action("onChange")} />
    </div>
  ),
};

export const DraftBadge = {
  name: "Status badge",
  args: { text: "Draft", status: "Draft", kind: "page" },
  argTypes: {
    kind: { control: "inline-radio", options: ["page", "asset"] },
    status: { control: "select", options: ["Draft", "Under Review", "Published", "Pending Review"] },
  },
  render: (args) => (
    <div style={{ padding: 24 }}>
      <StatusBadge
        className={args.kind === "asset" ? "asset-status" : "v20-status"}
        status={args.kind === "asset" ? args.status : ""}
        text={args.kind === "asset" ? args.status : args.text}
      />
    </div>
  ),
};

export const AskSuggestion = {
  name: "Suggestion",
  args: suggestion,
  render: (args) => (
    <div style={{ padding: 24 }}>
      <Suggestion {...args} onSelect={action("onSelect")} />
    </div>
  ),
};

export const ResponseScope = {
  name: "Scope option",
  args: scope,
  render: (args) => (
    <div style={{ padding: 24 }}>
      <ScopeOption {...args} onChange={action("onChange")} />
    </div>
  ),
};
