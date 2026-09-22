#!/usr/bin/env python3
"""Compare rendered component pages with the original HTML documents."""

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from compose_portal import VOID, URL_ATTRS, body_of, parse_html, rewrite, strip_skipped

ROOT = Path(__file__).resolve().parents[1]
BOOLEAN = {
    "hidden",
    "disabled",
    "checked",
    "selected",
    "multiple",
    "readonly",
    "required",
    "open",
    "muted",
    "autoplay",
    "controls",
    "loop",
    "defer",
    "async",
    "default",
    "reversed",
    "novalidate",
    "allowfullscreen",
    "formnovalidate",
    "itemscope",
}


class FragmentParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {"tag": "#root", "attrs": {}, "children": []}
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = {"tag": tag, "attrs": dict(attrs), "children": []}
        self.stack[-1]["children"].append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1]["children"].append({"tag": tag, "attrs": dict(attrs), "children": []})

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index]["tag"] == tag:
                del self.stack[index:]
                return

    def handle_data(self, data):
        self.stack[-1]["children"].append(data)


def parse_fragment(text):
    parser = FragmentParser()
    parser.feed(text)
    parser.close()
    return parser.root["children"]


def style_value(value):
    pairs = []
    for part in (value or "").split(";"):
        if ":" not in part:
            continue
        key, raw = part.split(":", 1)
        pairs.append((key.strip().lower(), re.sub(r"\s+", " ", raw).strip()))
    return ";".join(f"{key}:{raw}" for key, raw in sorted(pairs))


def normalize(node, file_dir, rewrite_urls):
    if isinstance(node, str):
        text = re.sub(r"\s+", " ", node).strip()
        return {"kind": "text", "value": text} if text else None
    attrs = {}
    for key, value in node["attrs"].items():
        if value is None:
            value = ""
        if key in URL_ATTRS and value and rewrite_urls:
            value = rewrite(value, file_dir)
        if key in BOOLEAN:
            attrs[key] = "true"
        elif key == "class":
            attrs[key] = re.sub(r"\s+", " ", value).strip()
        elif key == "style":
            attrs[key] = style_value(value)
        else:
            attrs[key] = value
    children = []
    for child in node["children"]:
        item = normalize(child, file_dir, rewrite_urls)
        if item:
            if children and children[-1]["kind"] == "text" and item["kind"] == "text":
                children[-1]["value"] = re.sub(r"\s+", " ", f"{children[-1]['value']} {item['value']}").strip()
            else:
                children.append(item)
    return {"kind": "el", "tag": node["tag"], "attrs": attrs, "children": children}


def diff(left, right, path, issues):
    if len(issues) > 12:
        return
    if left["kind"] != right["kind"]:
        issues.append(f"{path} kind {left['kind']} != {right['kind']}")
        return
    if left["kind"] == "text":
        if left["value"] != right["value"]:
            issues.append(f"{path} text {left['value']!r} != {right['value']!r}")
        return
    if left["tag"] != right["tag"]:
        issues.append(f"{path} <{left['tag']}> != <{right['tag']}>")
        return
    left_keys = set(left["attrs"])
    right_keys = set(right["attrs"])
    for key in sorted(left_keys - right_keys):
        issues.append(f"{path} missing attr {key}={left['attrs'][key]!r}")
    for key in sorted(right_keys - left_keys):
        issues.append(f"{path} extra attr {key}={right['attrs'][key]!r}")
    for key in sorted(left_keys & right_keys):
        if left["attrs"][key] != right["attrs"][key]:
            issues.append(f"{path} @{key} {left['attrs'][key]!r} != {right['attrs'][key]!r}")
    if len(left["children"]) != len(right["children"]):
        issues.append(
            f"{path} children {len(left['children'])} != {len(right['children'])} "
            f"({summarize(left['children'])} != {summarize(right['children'])})"
        )
    for index, (child, other) in enumerate(zip(left["children"], right["children"])):
        diff(child, other, f"{path}/{left['tag']}[{index}]", issues)


def summarize(children):
    parts = []
    for child in children[:6]:
        if child["kind"] == "text":
            parts.append(child["value"][:24])
        else:
            parts.append(child["tag"])
    return ",".join(parts)


def assembled_children(rendered):
    nodes = parse_fragment(rendered)
    if len(nodes) == 1 and isinstance(nodes[0], dict) and nodes[0]["attrs"].get("data-assembled-root") == "true":
        return nodes[0]["children"]
    return nodes


def main():
    rendered_dir = Path(sys.argv[1])
    manifest = json.loads((ROOT / "src" / "assembled" / "manifest.json").read_text(encoding="utf-8"))
    failed = 0
    for doc in manifest:
        file_dir = "" if doc["id"] == "home" else "assets/pages"
        source = (ROOT / doc["source"]).read_text(encoding="utf-8")
        root, _errors = parse_html(source)
        body = strip_skipped(body_of(root))
        original = []
        for child in body["children"]:
            item = normalize(child, file_dir, True)
            if item:
                original.append(item)
        rendered_nodes = []
        for child in assembled_children((rendered_dir / f"{doc['id']}.html").read_text(encoding="utf-8")):
            item = normalize(child, file_dir, False)
            if item:
                rendered_nodes.append(item)
        issues = []
        if len(original) != len(rendered_nodes):
            issues.append(f"root children {len(original)} != {len(rendered_nodes)}")
        for index, (left, right) in enumerate(zip(original, rendered_nodes)):
            diff(left, right, f"[{index}]", issues)
        if issues:
            failed += 1
            print(f"\n{doc['id']}")
            for issue in issues[:12]:
                print(" ", issue)
        else:
            print(f"ok {doc['id']}")
    if failed:
        raise SystemExit(f"{failed} pages differ from the original HTML")


if __name__ == "__main__":
    main()
