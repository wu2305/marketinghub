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
          bi("Section heading: eyebrow + title + optional description and trailing content. `variant=\"home\"` right-aligns (or stacks) the description; `variant=\"view\"` puts the description under the title, adds a bottom border and renders `children` as trailing actions.\n\n**When to use.** The heading above a block of content: `home` for a landing section, `view` for a page view that also carries actions or Tabs. **Used in:** Home and Campaign.", "区块标题：眉标 + 标题 + 可选描述与尾部内容。`variant=\"home\"` 将描述右对齐（或堆叠）；`variant=\"view\"` 将描述放在标题下方，添加底部边框，并把 `children` 渲染为尾部操作。\n\n**何时使用。** 内容区块上方的标题：`home` 用于落地页区块，`view` 用于同时带有操作或 Tabs 的页面视图。**使用位置：** Home 与 Campaign。"),
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
    variant: enumProp(sectionHeadingVariants, "home", bi("Layout variant: \"home\" right-aligns the description; \"view\" adds a bottom border and a trailing action slot.", "布局变体：\"home\" 右对齐描述；\"view\" 增加底部边框与尾部操作插槽。"), "inline-radio"),
    eyebrow: prop("string", { description: bi("Small kicker above the title.", "标题上方的小字眉标。") }),
    title: prop("React.ReactNode", { description: bi("Heading text.", "标题文字。"), control: "text" }),
    description: prop("React.ReactNode", { description: bi("Description paragraph — right-aligned in \"home\", under the title in \"view\".", "描述段落：在 \"home\" 中右对齐，在 \"view\" 中位于标题下方。"), control: "text" }),
    as: enumProp(headingLevels, "h2", bi("Heading level element.", "标题所用的层级元素。"), "inline-radio"),
    children: prop("React.ReactNode", { description: bi("Optional trailing action slot (view variant carries e.g. a Button or Tabs).", "可选的尾部操作插槽（view 变体可放 Button 或 Tabs 等）。"), control: false }),
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
