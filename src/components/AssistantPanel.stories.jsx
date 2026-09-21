import React from "react";
import { AssistantPanel } from "./AssistantPanel.jsx";

export default {
  title: "Components/AI Interpreter Assistant",
  component: AssistantPanel,
  parameters: { reference: "/original/index.html" },
};

export const LauncherAndPanel = {
  render: () => (
    <div className="experience-shell home-v4" style={{ minHeight: "100vh" }}>
      <AssistantPanel />
    </div>
  ),
};
