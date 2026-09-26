import React from "react";
import { SKILL_LIBRARY } from "../../../demo/content/skill-library.js";
import { filterSkills } from "../../../demo/skill-library-demo.js";
import { callbackProp, enumProp } from "../../../lib/story-helpers.js";
import { SkillLibrary, skillStatuses } from "./index.jsx";

export default { title: "Features/ScenarioLibrary/SkillLibrary", component: SkillLibrary, tags: ["autodocs"], parameters: { layout: "padded", docs: { description: { component: "Semantic source-backed Skill Library table with search, status selection, row detail and stage advance callbacks." } } } };
export const Default = {
  args: { labels: SKILL_LIBRARY.labels, items: SKILL_LIBRARY.records, totalCount: SKILL_LIBRARY.records.length, search: "", status: "all" },
  argTypes: {
    status: enumProp(skillStatuses, "all", "Exact source status filter."),
    search: { control: "text" },
    items: { control: "object" },
    onChange: callbackProp("onChange", "({value:string}) => void", { value: "Emily Wang" }),
    onSelect: callbackProp("onSelect", "({value:string}) => void", { value: "Draft" }),
    onOpen: callbackProp("onOpen", "({id:string}) => void", { id: "city-comparison" }),
    onAdvance: callbackProp("onAdvance", "({id:string}) => void", { id: "funnel-optimization" }),
    onClick: callbackProp("onClick", "({action:'create'}) => void", { action: "create" }),
  },
  render: function SkillLibraryStory(args) {
    const [search, setSearch] = React.useState(args.search);
    const [status, setStatus] = React.useState(args.status);
    const [items, setItems] = React.useState(args.items);
    React.useEffect(() => setSearch(args.search), [args.search]);
    React.useEffect(() => setStatus(args.status), [args.status]);
    React.useEffect(() => setItems(args.items), [args.items]);
    return <SkillLibrary {...args} items={filterSkills(items, { search, status })} totalCount={items.length} search={search} status={status} onChange={(event) => { setSearch(event.value); args.onChange?.(event); }} onSelect={(event) => { setStatus(event.value); args.onSelect?.(event); }} onAdvance={(event) => { setItems((current) => current.map((item) => item.id === event.id ? { ...item, status: item.status === "Under Review" ? "In Development" : "Published" } : item)); args.onAdvance?.(event); }} />;
  },
};
