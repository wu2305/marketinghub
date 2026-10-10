import { LibraryList } from "../../../components/LibraryList/index.jsx";
import { PERSONAL_MEMORY } from "../../../demo/content/personal-memory.js";
import { callbackProp, bi } from "../../../lib/story-helpers.js";
import { MemoryWorkspace } from "./index.jsx";

const { labels, records } = PERSONAL_MEMORY;
const items = records.slice(0, 3).map((item, index) => ({ id: item.id, title: item.title, description: item.description, selected: index === 0, meta: [{ label: labels.source, value: item.source }, { label: labels.updated, value: item.updated }] }));

export default { title: "Features/PersonalMemory/MemoryWorkspace", component: MemoryWorkspace, tags: ["autodocs"], parameters: { docs: { description: { component: bi("This component is the split workspace on Personal Memory. Pass the list as `children`. The list is usually a `LibraryList`. The right side shows the selected memory. Set `editing` to show the title and description fields. The functions `onEdit`, `onDelete`, and `onShare` run from the detail actions. Each result has `id`.", "这是 Personal Memory 上的分栏工作区。把列表作为 `children` 传入。列表通常是 `LibraryList`。右侧显示当前选中的记忆。设置 `editing` 会显示标题和说明字段。详情里的操作会调用 `onEdit`、`onDelete` 和 `onShare`。每个结果里都带有 `id`。") } } } };
export const CardsAndDetail = {
  args: { selected: records[0], labels, editing: false, draft: {}, onEdit: () => {}, onDelete: () => {}, onShare: () => {}, children: <LibraryList label={labels.listAria} layout="cards" items={items} /> },
  argTypes: { errors: { control: "object", description: bi("Fields the last Save Changes refused as empty, for example `{ title: true }`. Each shows its message under the field and the first one is focused. Send a new object for each failed save and drop a field when it changes.", "上一次保存修改时因为为空而被拒绝的字段，例如 `{ title: true }`。每个字段在下方显示自己的消息，第一个会获得焦点。每次保存失败都传一个新对象；字段一变化就去掉它。") }, children: { control: false, description: bi("List column. Pass a `LibraryList`.", "列表栏。传入 `LibraryList`。") }, onEdit: callbackProp("onEdit", "({id:string}) => void", { id: "mem-analysis-1" }), onDelete: callbackProp("onDelete", "({id:string}) => void", { id: "mem-analysis-1" }), onShare: callbackProp("onShare", "({id:string}) => void", { id: "mem-analysis-1" }) },
};
