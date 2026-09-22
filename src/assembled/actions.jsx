import React from "react";

export const PortalActions = React.createContext({
  onNavigate() {},
  onClick() {},
  onOpen() {},
  onSelect() {},
  onChange() {},
  onSubmit() {},
  onSave() {},
  onCancel() {},
});

export function usePortalActions() {
  return React.useContext(PortalActions);
}
