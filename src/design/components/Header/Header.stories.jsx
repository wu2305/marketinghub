import { Header, headerDensities, headerPositions } from "./index.jsx";
import { LOGO, NAV } from "../../content.js";
import { callbackProp, enumProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Global site header with logo and top navigation.", "全站页头，包含 Logo 与顶部导航。"),
      },
    },
  },
  args: { current: "home", highlightCurrent: false, density: "compact", position: "fixed", navigationAriaLabel: "Marketing Portal navigation", logoAriaLabel: "Tapestry Marketing Portal home" },
  argTypes: {
    logo: prop("{ src: string, alt?: string, href?: string }", { description: bi("Brand lockup.", "品牌 Logo 组合。"), control: false }),
    items: prop("Array<{ id: string, label: string, href: string }>", { defaultValue: [], description: bi("Nav items.", "导航项。"), control: false }),
    navigationAriaLabel: prop("string", { defaultValue: "Marketing Portal navigation", description: bi("Accessible name for the navigation region.", "导航区域的无障碍名称。"), control: "text" }),
    logoAriaLabel: prop("string", { defaultValue: "Tapestry Marketing Portal home", description: bi("Accessible name for the logo link.", "Logo 链接的无障碍名称。"), control: "text" }),
    current: prop("string", {
      description: bi("id of the active nav item; always carries aria-current=\"page\".", "当前导航项的 id；始终带有 aria-current=\"page\"。"),
      control: "select",
      options: NAV.map((item) => item.id),
    }),
    highlightCurrent: prop("boolean", {
      defaultValue: true,
      description: bi("Render the visual underline; some original pages mark the item semantically but style it identically to the rest.", "是否渲染可见下划线；部分原始页面在语义上标记了当前项，但样式与其他项相同。"),
    }),
    density: enumProp(headerDensities, "compact", bi("Navigation density: 48px or 56px links within the 56px header.", "导航密度：在 56px 页头内使用 48px 或 56px 的链接高度。"), "inline-radio"),
    position: enumProp(headerPositions, "fixed", bi("Placement in the page flow.", "在页面流中的定位方式。"), "inline-radio"),
    onNavigate: callbackProp(
      "onNavigate",
      "(target: { id: string, href?: string, label: string }) => void",
      { id: "cockpit", href: "/assets/pages/reports.html", label: "Marketing Cockpit" },
      bi("Fired when a nav item or the logo is clicked.", "点击导航项或 Logo 时触发。"),
    ),
  },
  render: function HeaderStory(args) {
    const [current, setCurrent] = useSynced(args.current);
    return (
      <div style={{ minHeight: 120, background: "#f4f6f8" }}>
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
