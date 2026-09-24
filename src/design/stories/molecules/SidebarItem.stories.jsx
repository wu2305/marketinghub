import { SidebarItem } from "../../molecules.jsx";
import { callbackProp, prop, useSynced } from "../story-helpers.js";

export default {
  title: "Molecules/Sidebar item",
  component: SidebarItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Sidebar navigation entry with optional icon, badge, and count.",
      },
    },
  },
  args: { label: "Overview", active: true, badge: "", count: 35 },
  argTypes: {
    label: prop("string", { description: "Item label — echoed in the onSelect payload and the tooltip." }),
    icon: prop("string", { description: "SVG path data (not an icon name) for the leading icon." }),
    active: prop("boolean", { defaultValue: false, description: "Selected state — sets aria-current and the active styling." }),
    badge: prop("React.ReactNode", { description: "Small badge after the label.", control: "text" }),
    count: prop("number", { description: "Count chip at the trailing edge; also appended to the tooltip." }),
    onSelect: callbackProp(
      "onSelect",
      "(event: { label: string }) => void",
      { label: "Overview" },
      "Fired on click.",
    ),
  },
  render: function SidebarItemStory(args) {
    const [active, setActive] = useSynced(args.active);
    return (
      <div style={{ width: 240, background: "#f9f7f5" }}>
        <SidebarItem
          {...args}
          badge={args.badge || undefined}
          active={active}
          onSelect={(event) => {
            setActive(true);
            args.onSelect?.(event);
          }}
        />
      </div>
    );
  },
};

export const Default = {};
