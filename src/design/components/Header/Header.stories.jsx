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
        component: bi("This component is the site header. It shows the logo and the top navigation.", "这个组件是站点页头。它显示 Logo 和顶部导航。"),
      },
    },
  },
  args: { current: "home", highlightCurrent: false, density: "compact", position: "fixed", navigationAriaLabel: "Marketing Portal navigation", logoAriaLabel: "Tapestry Marketing Portal home" },
  argTypes: {
    logo: prop("{ src: string, alt?: string, href?: string }", { description: bi("Logo image, optional `alt`, and optional `href`.", "Logo 图片，以及可选的 `alt` 和 `href`。"), control: false }),
    items: prop("Array<{ id: string, label: string, href: string }>", { defaultValue: [], description: bi("Navigation items. Each item has `id`, `label`, and `href`.", "导航项。每项有 `id`、`label` 和 `href`。"), control: false }),
    navigationAriaLabel: prop("string", { defaultValue: "Marketing Portal navigation", description: bi("Accessible name of the navigation region.", "导航区域的无障碍名称。"), control: "text" }),
    logoAriaLabel: prop("string", { defaultValue: "Tapestry Marketing Portal home", description: bi("Accessible name of the logo link.", "Logo 链接的无障碍名称。"), control: "text" }),
    current: prop("string", {
      description: bi("`id` of the current navigation item. That item always has `aria-current=\"page\"`.", "当前导航项的 `id`。该项始终带有 `aria-current=\"page\"`。"),
      control: "select",
      options: NAV.map((item) => item.id),
    }),
    highlightCurrent: prop("boolean", {
      defaultValue: true,
      description: bi("Set this if the current item shows an underline. Some pages mark the current item for assistive tech only.", "如果当前项要显示下划线，就设置这个值。有些页面只为辅助技术标记当前项。"),
    }),
    density: enumProp(headerDensities, "compact", bi("Height of the navigation links. `compact` is 48px. `comfortable` is 56px. The header is 56px.", "导航链接的高度。`compact` 是 48px。`comfortable` 是 56px。页头高度是 56px。"), "inline-radio"),
    position: enumProp(headerPositions, "fixed", bi("How the header sits in the page.", "页头在页面中的定位方式。"), "inline-radio"),
    onNavigate: callbackProp(
      "onNavigate",
      "(target: { id: string, href?: string, label: string }) => void",
      { id: "cockpit", href: "/assets/pages/reports.html", label: "Marketing Cockpit" },
      bi("The function runs when a navigation item or the logo is clicked. The logo result has `id` `home` and `label` `Home`. A navigation item result has that item's `id`, `href`, and `label`.", "点击导航项或 Logo 时调用这个函数。Logo 的结果里 `id` 是 `home`，`label` 是 `Home`。导航项的结果带有该项的 `id`、`href` 和 `label`。"),
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
