import React from "react";
import { SiteHeader } from "./SiteHeader.jsx";

export default {
  title: "Components/Site Header",
  component: SiteHeader,
};

const shell = (args) => (
  <div className="experience-shell" style={{ minHeight: 180 }}>
    <SiteHeader {...args} />
  </div>
);

export const Home = { args: { current: "Home" }, render: shell };
export const AIInterpreter = { args: { current: "AI Interpreter" }, render: shell };
