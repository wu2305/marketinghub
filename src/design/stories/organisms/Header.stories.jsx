import { Header, headerPositions, headerTones } from "../../organisms.jsx";
import { LOGO, NAV } from "../../content.js";
import { callbackProp, enumProp, prop, useSynced } from "../story-helpers.js";

export default {
  title: "Organisms/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Global site header with logo and top navigation.",
      },
    },
  },
  args: { current: "home", tone: "solid", position: "sticky" },
  argTypes: {
    logo: prop("{ src: string, alt?: string, href?: string }", { description: "Brand lockup.", control: false }),
    items: prop("Array<{ id: string, label: string, href: string }>", { defaultValue: [], description: "Nav items.", control: false }),
    current: prop("string", {
      description: 'id of the active nav item; always carries aria-current="page".',
      control: "select",
      options: NAV.map((item) => item.id),
    }),
    highlightCurrent: prop("boolean", {
      defaultValue: true,
      description: "Render the visual underline; some original pages mark the item semantically but style it identically to the rest.",
    }),
    tone: enumProp(headerTones, "solid", '"overlay" is transparent with light links, for hero-covered pages.', "inline-radio"),
    position: enumProp(headerPositions, "sticky", "Positioning mode.", "inline-radio"),
    onNavigate: callbackProp(
      "onNavigate",
      "(target: { id: string, href?: string, label: string }) => void",
      { id: "cockpit", href: "/assets/pages/reports.html", label: "Marketing Cockpit" },
      "Fired when a nav item or the logo is clicked.",
    ),
  },
  render: function HeaderStory(args) {
    const [current, setCurrent] = useSynced(args.current);
    return (
      <div style={{ minHeight: 120, background: args.tone === "overlay" ? "#2a211c" : "#f4f6f8" }}>
        <Header
          logo={LOGO}
          items={NAV}
          {...args}
          current={current}
          onNavigate={(event) => {
            if (NAV.some((item) => item.id === event.id)) setCurrent(event.id);
            args.onNavigate?.(event);
          }}
        />
      </div>
    );
  },
};

export const Default = {};
