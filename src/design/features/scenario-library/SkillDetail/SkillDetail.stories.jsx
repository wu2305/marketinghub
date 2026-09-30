import React from "react";
import { SKILL_LIBRARY } from "../../../demo/content/skill-library.js";
import { callbackProp, bi } from "../../../lib/story-helpers.js";
import { SkillDetail } from "./index.jsx";

export default { title: "Features/ScenarioLibrary/SkillDetail", component: SkillDetail, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: bi("Skill detail drawer containing governance, five structure blocks, example preview and source-visible actions.", "Skill 详情抽屉：包含治理信息、五个结构块、示例预览以及源页面可见的操作。") } } } };
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
