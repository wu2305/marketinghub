#!/usr/bin/env python3
"""Leave-one-out ablation of the assembled portal components.

Substitution: skip one matcher and fall back to the original markup, then
compare the render with the original HTML.

Removal: delete one component from the assembled tree and measure the text
and elements that disappear. Nested components inside the deleted node are
included in that loss.
"""

import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import compose_portal as compose
from compare_fidelity import assembled_children, diff, normalize

ROOT = Path(__file__).resolve().parents[1]
OUT = Path("/tmp/ablation")
REPORT = ROOT / "handover" / "ablation.md"
DATA = ROOT / "handover" / "ablation.json"

CONDITIONS = [
    ("WorkspaceHeader", "match_workspace_header"),
    ("SiteHeader", "match_site_header"),
    ("CommandHero", "match_command_hero"),
    ("WorkspaceGrid", "match_workspace_grid"),
    ("WorkspaceCard", "match_workspace_card"),
    ("SectionHeading", "match_section_heading"),
    ("AssistantPanel", "match_assistant"),
    ("LibraryToolbar", "match_library_toolbar"),
    ("KnowledgeSidebar", "match_sidebar"),
    ("PageHead", "match_page_head"),
    ("AiLauncher", "match_ai_launcher"),
    ("Signal", "match_signal"),
    ("HeroStat", "match_hero_stat"),
    ("SearchField", "match_search_field"),
    ("SidebarItem", "match_sidebar_item"),
    ("Breadcrumb", "match_breadcrumb"),
    ("StatusBadge", "match_status_badge"),
    ("AddButton", "match_add_button"),
    ("Suggestion", "match_suggestion"),
    ("ScopeOption", "match_scope_option"),
    ("Button", "match_button"),
    ("Link", "match_link"),
    ("TextInput", "match_input"),
    ("TextArea", "match_textarea"),
    ("Select", "match_select"),
]

LAYERS = {
    "Atoms": ["Button", "Link", "TextInput", "TextArea", "Select", "StatusBadge", "Suggestion", "ScopeOption"],
    "Molecules": ["Signal", "HeroStat", "SearchField", "SidebarItem", "Breadcrumb", "SectionHeading", "WorkspaceCard", "AddButton"],
    "Organisms": [
        "SiteHeader",
        "WorkspaceHeader",
        "CommandHero",
        "WorkspaceGrid",
        "KnowledgeSidebar",
        "LibraryToolbar",
        "PageHead",
        "AiLauncher",
        "AssistantPanel",
    ],
}

ABSORBED = [
    ("Signal", "CommandHero", "signals"),
    ("HeroStat", "CommandHero", "stats"),
    ("WorkspaceCard", "WorkspaceGrid", "cards"),
    ("StatusBadge", "PageHead", "status"),
    ("Breadcrumb", "PageHead", "breadcrumb"),
]


def documents():
    found = []
    for doc_id, path, file_dir in compose.documents():
        found.append((doc_id, path, file_dir))
    return found


def compose_all(docs):
    trees = {}
    manifest = []
    for doc_id, path, file_dir in docs:
        tree, body_class, _errors = compose.compose_body(path, file_dir)
        trees[doc_id] = tree
        manifest.append({"id": doc_id, "bodyClass": body_class, "fileDir": file_dir})
    return trees, manifest


def write_trees(folder, trees):
    folder.mkdir(parents=True, exist_ok=True)
    for doc_id, tree in trees.items():
        (folder / f"{doc_id}.json").write_text(json.dumps(tree, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def drop_names(node, names):
    if isinstance(node, list):
        kept = []
        for child in node:
            nxt = drop_names(child, names)
            if nxt is not None:
                kept.append(nxt)
        return kept
    if not isinstance(node, dict):
        return node
    if node.get("kind") == "comp" and node.get("name") in names:
        return None
    return {key: drop_names(value, names) if isinstance(value, (list, dict)) else value for key, value in node.items()}


def clear_slot(node, comp_name, prop):
    if isinstance(node, list):
        return [clear_slot(child, comp_name, prop) for child in node]
    if not isinstance(node, dict):
        return node
    copied = {key: clear_slot(value, comp_name, prop) if isinstance(value, (list, dict)) else value for key, value in node.items()}
    if copied.get("kind") == "comp" and copied.get("name") == comp_name:
        props = dict(copied.get("props") or {})
        if prop in props and props[prop] is not None:
            props[prop] = [] if isinstance(props[prop], list) else None
        copied["props"] = props
    return copied


def count_nodes(node, counts):
    if isinstance(node, list):
        for child in node:
            count_nodes(child, counts)
        return
    if not isinstance(node, dict):
        return
    if node.get("kind") == "comp":
        counts[node["name"]] = counts.get(node["name"], 0) + 1
    for value in node.values():
        if isinstance(value, (list, dict)):
            count_nodes(value, counts)


def measure(html, file_dir):
    if html.startswith("<!-- render-error:"):
        return None
    elements = 0
    texts = []

    def walk(node):
        nonlocal elements
        if node["kind"] == "text":
            texts.append(node["value"])
            return
        elements += 1
        for child in node["children"]:
            walk(child)

    nodes = []
    for child in assembled_children(html):
        item = normalize(child, file_dir, False)
        if item:
            nodes.append(item)
            walk(item)
    return {"elements": elements, "tokens": Counter(re.findall(r"\S+", " ".join(texts)))}


def fidelity_issues(html, doc):
    if html.startswith("<!-- render-error:"):
        return [html.strip()]
    source = (ROOT / ("index.html" if doc["id"] == "home" else f"assets/pages/{doc['id']}.html")).read_text(encoding="utf-8")
    root, _errors = compose.parse_html(source)
    body = compose.strip_skipped(compose.body_of(root))
    original = []
    for child in body["children"]:
        item = normalize(child, doc["fileDir"], True)
        if item:
            original.append(item)
    rendered = []
    for child in assembled_children(html):
        item = normalize(child, doc["fileDir"], False)
        if item:
            rendered.append(item)
    issues = []
    if len(original) != len(rendered):
        issues.append(f"root children {len(original)} != {len(rendered)}")
    for index, (left, right) in enumerate(zip(original, rendered)):
        diff(left, right, f"[{index}]", issues)
    return issues


def loss_against(baseline, current, manifest):
    pages = []
    token_loss = 0
    element_loss = 0
    samples = []
    for doc in manifest:
        doc_id = doc["id"]
        before = baseline[doc_id]
        after = current[doc_id]
        if before is None or after is None:
            pages.append(doc_id)
            continue
        lost = before["tokens"] - after["tokens"]
        dropped = sum(lost.values())
        elements = before["elements"] - after["elements"]
        if dropped or elements:
            pages.append(doc_id)
            token_loss += dropped
            element_loss += elements
            if len(samples) < 8:
                samples.extend(list(lost.elements())[: 8 - len(samples)])
    return {
        "pages": pages,
        "tokenLoss": token_loss,
        "elementLoss": element_loss,
        "sample": " ".join(samples),
    }


def md_table(headers, rows):
    lines = ["| " + " | ".join(headers) + " |", "| " + " | ".join("---" for _ in headers) + " |"]
    for row in rows:
        lines.append("| " + " | ".join(str(cell) for cell in row) + " |")
    return "\n".join(lines)


def main():
    docs = documents()
    compose.SKIP_MATCHERS.clear()
    baseline_trees, manifest = compose_all(docs)
    base_counts = {}
    for tree in baseline_trees.values():
        count_nodes(tree, base_counts)

    jobs = []
    variants = {}

    def add_variant(name, trees):
        tree_dir = OUT / name / "trees"
        html_dir = OUT / name / "html"
        write_trees(tree_dir, trees)
        jobs.append(
            {
                "name": name,
                "trees": str(tree_dir),
                "html": str(html_dir),
                "manifest": str(OUT / "manifest.json"),
            }
        )
        variants[name] = html_dir

    (OUT).mkdir(parents=True, exist_ok=True)
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    add_variant("baseline", baseline_trees)

    substitution = []
    for label, matcher_name in CONDITIONS:
        compose.SKIP_MATCHERS.clear()
        compose.SKIP_MATCHERS.add(matcher_name)
        trees, _manifest = compose_all(docs)
        compose.SKIP_MATCHERS.clear()
        changed = json.dumps(trees, ensure_ascii=False) != json.dumps(baseline_trees, ensure_ascii=False)
        key = f"sub-{label}"
        if changed:
            add_variant(key, trees)
        substitution.append({"component": label, "matcher": matcher_name, "changed": changed, "key": key})

    removal = []
    for label, _matcher_name in CONDITIONS:
        instances = base_counts.get(label, 0)
        key = f"drop-{label}"
        if instances:
            add_variant(key, {doc_id: drop_names(tree, {label}) for doc_id, tree in baseline_trees.items()})
        removal.append({"component": label, "instances": instances, "key": key})

    layers = []
    for layer, names in LAYERS.items():
        present = [name for name in names if base_counts.get(name)]
        key = f"layer-{layer}"
        add_variant(key, {doc_id: drop_names(tree, set(names)) for doc_id, tree in baseline_trees.items()})
        layers.append({"layer": layer, "present": present, "key": key})

    absorbed = []
    for label, parent, prop in ABSORBED:
        key = f"slot-{label}"
        trees = {doc_id: clear_slot(tree, parent, prop) for doc_id, tree in baseline_trees.items()}
        changed = json.dumps(trees, ensure_ascii=False) != json.dumps(baseline_trees, ensure_ascii=False)
        if changed:
            add_variant(key, trees)
        absorbed.append({"component": label, "parent": parent, "prop": prop, "changed": changed, "key": key})

    (OUT / "jobs.json").write_text(json.dumps(jobs, ensure_ascii=False, indent=2), encoding="utf-8")
    subprocess.run(["node", "scripts/ablate-render.mjs", str(OUT / "jobs.json")], cwd=ROOT, check=True)

    def load_measures(html_dir):
        measured = {}
        for doc in manifest:
            html = (html_dir / f"{doc['id']}.html").read_text(encoding="utf-8")
            measured[doc["id"]] = measure(html, doc["fileDir"])
        return measured

    baseline_measure = load_measures(variants["baseline"])
    baseline_failures = []
    for doc in manifest:
        html = (variants["baseline"] / f"{doc['id']}.html").read_text(encoding="utf-8")
        issues = fidelity_issues(html, doc)
        if issues:
            baseline_failures.append({"id": doc["id"], "issues": issues[:6]})
    if baseline_failures:
        raise SystemExit(f"baseline fidelity failed: {baseline_failures}")

    sub_rows = []
    for item in substitution:
        if not item["changed"]:
            sub_rows.append([item["component"], "无变化", "—", "该匹配器没有单独改写任何节点"])
            continue
        failures = []
        for doc in manifest:
            html = (variants[item["key"]] / f"{doc['id']}.html").read_text(encoding="utf-8")
            issues = fidelity_issues(html, doc)
            if issues:
                failures.append(f"{doc['id']}: {issues[0]}")
        if failures:
            sub_rows.append([item["component"], "回退原文", str(len(failures)), failures[0]])
        else:
            sub_rows.append([item["component"], "回退原文", "0", "17 个文档仍与原文一致"])

    drop_rows = []
    for item in removal:
        if not item["instances"]:
            drop_rows.append([item["component"], 0, 0, 0, 0, "只存在于父组件属性中，见属性槽消融"])
            continue
        current = load_measures(variants[item["key"]])
        lost = loss_against(baseline_measure, current, manifest)
        drop_rows.append(
            [
                item["component"],
                item["instances"],
                len(lost["pages"]),
                lost["elementLoss"],
                lost["tokenLoss"],
                lost["sample"] or "—",
            ]
        )

    layer_rows = []
    for item in layers:
        current = load_measures(variants[item["key"]])
        lost = loss_against(baseline_measure, current, manifest)
        layer_rows.append(
            [
                item["layer"],
                "、".join(item["present"]) or "—",
                len(lost["pages"]),
                lost["elementLoss"],
                lost["tokenLoss"],
            ]
        )

    slot_rows = []
    for item in absorbed:
        if not item["changed"]:
            slot_rows.append([item["component"], item["parent"], item["prop"], 0, 0, "—"])
            continue
        current = load_measures(variants[item["key"]])
        lost = loss_against(baseline_measure, current, manifest)
        slot_rows.append(
            [
                item["component"],
                item["parent"],
                item["prop"],
                len(lost["pages"]),
                lost["tokenLoss"],
                lost["sample"] or "—",
            ]
        )

    payload = {
        "documents": len(manifest),
        "baseline": "17 documents match the original HTML",
        "substitution": [
            {"component": row[0], "mode": row[1], "pagesDiffer": row[2], "note": row[3]} for row in sub_rows
        ],
        "removal": [
            {
                "component": row[0],
                "instances": row[1],
                "pages": row[2],
                "elementLoss": row[3],
                "tokenLoss": row[4],
                "sample": row[5],
            }
            for row in drop_rows
        ],
        "layers": [
            {"layer": row[0], "present": row[1], "pages": row[2], "elementLoss": row[3], "tokenLoss": row[4]}
            for row in layer_rows
        ],
        "slots": [
            {
                "component": row[0],
                "parent": row[1],
                "prop": row[2],
                "pages": row[3],
                "tokenLoss": row[4],
                "sample": row[5],
            }
            for row in slot_rows
        ],
    }
    DATA.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    parts = [
        "# 组件消融",
        "",
        "对照对象是 17 个 HTML 文档的拼装结果。完整拼装为基线，基线与原始正文一致。",
        "",
        "两组实验分开读：",
        "",
        "- 替换消融：一次关掉一个识别器，该区域退回原始标记。父组件如果必须调用这个识别器，也一并退回原文。结果应仍与原文一致，用来确认组件没有改写结构。",
        "- 去除消融：从拼装树里删掉该组件再渲染。损失的元素和词包含它内部的子组件，各行不能相加。",
        "",
        "词按空白切分，并先按对照规则合并空白。元素数按同一规则规范化之后计数。",
        "",
        "第一次替换消融里，关掉 TextArea 识别器后，通用节点把子节点放进 `<textarea>`。React 会把这个元素子节点打印成 `[object Object]`，8 个文档因此和原文不一致。`Node` 已改为与 TextArea 组件相同，把文本放进 `defaultValue`。下表是修正后的重跑。",
        "",
        "## 替换消融",
        "",
        md_table(["组件", "处理", "不一致页数", "结果"], sub_rows),
        "",
        "## 去除消融",
        "",
        md_table(["组件", "节点数", "影响页数", "减少元素", "减少词", "丢失词示例"], drop_rows),
        "",
        "## 分层去除",
        "",
        "每一层只删除该层自己的组件节点。被父组件收进属性的分子不在这一层的节点数里，见下一节。",
        "",
        md_table(["层", "实际删除", "影响页数", "减少元素", "减少词"], layer_rows),
        "",
        "## 属性槽消融",
        "",
        "Signal、Hero Stat、Workspace Card、以及页头里的徽标和面包屑，在识别时被写进父组件属性，树里没有独立节点。这里只清空对应属性。",
        "",
        md_table(["组件", "父组件", "属性", "影响页数", "减少词", "丢失词示例"], slot_rows),
        "",
        "重跑：`python3 scripts/ablation.py`。",
        "",
    ]
    REPORT.write_text("\n".join(parts), encoding="utf-8")
    print(f"wrote {REPORT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
