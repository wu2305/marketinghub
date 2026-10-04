import React from "react";
import { SKILL_LIBRARY } from "../../../demo/content/skill-library.js";
import { callbackProp, bi } from "../../../lib/story-helpers.js";
import { SkillDetail } from "./index.jsx";

export default { title: "Features/ScenarioLibrary/SkillDetail", component: SkillDetail, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: bi("This component is the skill detail drawer on Skill Library. It shows status, scope, version, purpose, governance, five structure blocks, and an example preview. The footer has Edit Scenario and Delete. Set `skill` to open the drawer. Set `skill` to `null` to close it. The function `onCancel` runs when the drawer closes. The function `onOpen` runs when the user clicks Edit Scenario. The function `onClick` runs when the user clicks Delete. The page confirms the delete.", "这是 Skill Library 上的技能详情抽屉。它显示状态、范围、版本、用途、治理信息、五个结构块和示例预览。页脚有 Edit Scenario 和 Delete。设置 `skill` 会打开抽屉。把 `skill` 设为 `null` 会关闭抽屉。抽屉关闭时会调用 `onCancel`。用户点击 Edit Scenario 时会调用 `onOpen`。用户点击 Delete 时会调用 `onClick`。删除确认由页面完成。") } } } };
export const Default = {
  args: { skill: SKILL_LIBRARY.records[0], labels: SKILL_LIBRARY.labels, previewOpen: false },
  argTypes: {
    skill: { control: "object" },
    previewOpen: { control: "boolean" },
    onCancel: callbackProp("onCancel", "({reason:'scrim'|'escape'|'button'}) => void", { reason: "button" }),
    onChange: callbackProp("onChange", "({value:boolean}) => void", { value: true }),
    onOpen: callbackProp("onOpen", "({id:string}) => void", { id: "scenario-channel-performance" }),
    onClick: callbackProp("onClick", "({id:string,action:'delete'}) => void", { id: "scenario-channel-performance", action: "delete" }),
  },
  render: function SkillDetailStory(args) {
    const [previewOpen, setPreviewOpen] = React.useState(args.previewOpen);
    const [open, setOpen] = React.useState(true);
    React.useEffect(() => setPreviewOpen(args.previewOpen), [args.previewOpen]);
    return <><button type="button" onClick={() => setOpen(true)}>Open detail</button><SkillDetail {...args} skill={open ? args.skill : null} previewOpen={previewOpen} onChange={(event) => { setPreviewOpen(event.value); args.onChange?.(event); }} onCancel={(event) => { setOpen(false); args.onCancel?.(event); }} /></>;
  },
};
