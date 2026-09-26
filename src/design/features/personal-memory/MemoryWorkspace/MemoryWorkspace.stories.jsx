import { PERSONAL_MEMORY } from "../../../demo/content/personal-memory.js";
import { callbackProp } from "../../../lib/story-helpers.js";
import { MemoryWorkspace } from "./index.jsx";

export default { title: "Features/PersonalMemory/MemoryWorkspace", component: MemoryWorkspace, tags: ["autodocs"], parameters: { docs: { description: { component: "Source-backed personal-memory cards and inline detail with controlled selection, per-card actions, edit draft and named callbacks." } } } };
export const CardsAndDetail = { args: { items: PERSONAL_MEMORY.records.slice(0, 3), selected: PERSONAL_MEMORY.records[0], labels: PERSONAL_MEMORY.labels, menuId: null, editing: false, onSelect: () => {}, onToggleMenu: () => {}, onEdit: () => {}, onDelete: () => {} }, argTypes: { onSelect: callbackProp("onSelect", "({id:string}) => void", { id: "mem-analysis-1" }), onToggleMenu: callbackProp("onToggleMenu", "({id:string}) => void", { id: "mem-analysis-1" }), onEdit: callbackProp("onEdit", "({id:string}) => void", { id: "mem-analysis-1" }), onDelete: callbackProp("onDelete", "({id:string}) => void", { id: "mem-analysis-1" }) } };
