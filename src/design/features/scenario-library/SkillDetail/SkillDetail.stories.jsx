import React from "react";
import { SKILL_LIBRARY } from "../../../demo/content/skill-library.js";
import { callbackProp } from "../../../lib/story-helpers.js";
import { SkillDetail } from "./index.jsx";

export default { title: "Features/ScenarioLibrary/SkillDetail", component: SkillDetail, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: "Skill detail drawer containing governance, five structure blocks, example preview and source-visible actions." } } } };
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
