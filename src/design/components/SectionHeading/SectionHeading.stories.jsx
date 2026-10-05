import React from "react";
import { Button } from "../Button/index.jsx";
import { SectionHeading, headingLevels, sectionHeadingVariants } from "./index.jsx";
import { enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Section heading",
  component: SectionHeading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("This component is a section heading. It can show an eyebrow, a title, a description, and trailing content. `home` puts the description on the right, or stacks it. `view` puts the description under the title, adds a bottom border, and shows `children` as trailing actions.\n\n**When to use.** Use this component as the heading above a block of content. Use `home` for a landing section. Use `view` for a page view that also carries actions or Tabs. **Used in:** Home and Campaign.", "这个组件是区块标题。它可以显示眉标、标题、描述和尾部内容。`home` 把描述放在右侧，或上下堆叠。`view` 把描述放在标题下方，加上底部边框，并把 `children` 显示为尾部操作。\n\n**何时使用。** 用在内容区块上方的标题。落地页区块用 `home`。同时还带操作或 Tabs 的页面视图用 `view`。**使用位置：** Home 与 Campaign。"),
      },
    },
  },
  args: {
    variant: "home",
    eyebrow: "Workspaces",
    title: "Enter the work that matters",
    description: "Start from execution, reports, or the knowledge behind every answer.",
  },
  argTypes: {
    variant: enumProp(sectionHeadingVariants, "home", bi("`home` puts the description on the right. `view` adds a bottom border and a trailing action slot.", "`home` 把描述放在右侧。`view` 增加底部边框与尾部操作插槽。"), "inline-radio"),
    eyebrow: prop("string", { description: bi("Small line of text above the title.", "标题上方的小字眉标。") }),
    title: prop("React.ReactNode", { description: bi("Heading text.", "标题文字。"), control: "text" }),
    description: prop("React.ReactNode", { description: bi("Description paragraph. On `home` it sits on the right. On `view` it sits under the title.", "描述段落。在 `home` 中放在右侧。在 `view` 中放在标题下方。"), control: "text" }),
    as: enumProp(headingLevels, "h2", bi("Heading level element.", "标题所用的层级元素。"), "inline-radio"),
    children: prop("React.ReactNode", { description: bi("Optional trailing action slot. The `view` variant can hold a Button or Tabs.", "可选的尾部操作插槽。`view` 变体可放 Button 或 Tabs。"), control: false }),
  },
  render: (args) => <SectionHeading {...args} />,
};

export const Default = {};

/* The "view" form as used by the Campaign page: description under the
   title, bottom border, and a trailing action. */
export const View = {
  args: {
    variant: "view",
    eyebrow: "Campaign workspace / Overview",
    title: "Overview Dashboard",
    description: "Monitor automated media operations across accounts, plans, units, and creative assets.",
  },
  render: (args) => (
    <SectionHeading {...args}>
      <Button variant="primary" size="sm">Create Campaign Task</Button>
    </SectionHeading>
  ),
};
