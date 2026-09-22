import React from "react";
import { action } from "@storybook/addon-actions";
import { PortalActions } from "./actions.jsx";

export const portalActions = {
  onNavigate: action("onNavigate"),
  onClick: action("onClick"),
  onOpen: action("onOpen"),
  onSelect: action("onSelect"),
  onChange: action("onChange"),
  onSubmit: action("onSubmit"),
  onSave: action("onSave"),
  onCancel: action("onCancel"),
};

export function withPortalActions(Story) {
  return (
    <PortalActions.Provider value={portalActions}>
      <Story />
    </PortalActions.Provider>
  );
}
