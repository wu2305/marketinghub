import { Link } from "./index.jsx";
import { callbackProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Atoms/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Navigation link. Renders `<a href>`; the host decides routing via `onNavigate`.",
      },
    },
  },
  args: { href: "/assets/pages/knowledge.html", children: "Explore full AI Interpreter" },
  argTypes: {
    href: prop("string", { defaultValue: "#", description: "Link target." }),
    children: prop("React.ReactNode", { description: "Visible link text.", control: "text" }),
    onNavigate: callbackProp(
      "onNavigate",
      "(target: { href: string, label: string }) => void",
      { href: "/assets/pages/knowledge.html", label: "Explore full AI Interpreter" },
      "Fired on click — does not prevent default navigation.",
    ),
  },
  render: (args) => <Link {...args} />,
};

export const Default = {};
