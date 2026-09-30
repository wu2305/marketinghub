import { LibraryList } from "../../../components/LibraryList/index.jsx";
import { PERSONAL_MEMORY } from "../../../demo/content/personal-memory.js";
import { callbackProp, bi } from "../../../lib/story-helpers.js";
import { MemoryWorkspace } from "./index.jsx";

const { labels, records } = PERSONAL_MEMORY;
const items = records.slice(0, 3).map((item, index) => ({ id: item.id, title: item.title, description: item.description, selected: index === 0, meta: [{ label: labels.source, value: item.source }, { label: labels.updated, value: item.updated }] }));

export default { title: "Features/PersonalMemory/MemoryWorkspace", component: MemoryWorkspace, tags: ["autodocs"], parameters: { docs: { description: { component: bi("Personal Memory split layout: the list column is a governed LibraryList passed as children, the detail aside is controlled by the page with edit draft and named callbacks.", "Personal Memory 分栏布局：列表栏是作为 children 传入的受治理 LibraryList，详情侧栏由页面控制，带编辑草稿和具名回调。") } } } };
export const CardsAndDetail = {
  args: { selected: records[0], labels, editing: false, draft: {}, onEdit: () => {}, onDelete: () => {}, onShare: () => {}, children: <LibraryList label={labels.listAria} layout="cards" items={items} /> },
  argTypes: { children: { control: false, description: bi("List column, normally a LibraryList.", "列表栏，通常是 LibraryList。") }, onEdit: callbackProp("onEdit", "({id:string}) => void", { id: "mem-analysis-1" }), onDelete: callbackProp("onDelete", "({id:string}) => void", { id: "mem-analysis-1" }), onShare: callbackProp("onShare", "({id:string}) => void", { id: "mem-analysis-1" }) },
};
