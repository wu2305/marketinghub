#!/usr/bin/env python3
"""Turn portal HTML documents into component trees that Storybook can render."""

import json
import posixpath
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "assembled" / "trees"
VOID = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "source",
    "track",
    "wbr",
}
URL_ATTRS = {"href", "src", "action", "poster"}


class DomParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {"tag": "#root", "attrs": {}, "children": []}
        self.stack = [self.root]
        self.errors = []

    def handle_starttag(self, tag, attrs):
        node = {"tag": tag, "attrs": dict(attrs), "children": []}
        self.stack[-1]["children"].append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        node = {"tag": tag, "attrs": dict(attrs), "children": []}
        self.stack[-1]["children"].append(node)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index]["tag"] == tag:
                del self.stack[index:]
                return
        self.errors.append(f"extra end tag </{tag}>")

    def handle_data(self, data):
        self.stack[-1]["children"].append(data)

    def handle_entityref(self, name):
        self.handle_data(self.unescape(f"&{name};"))

    def handle_charref(self, name):
        self.handle_data(self.unescape(f"&#{name};"))


def parse_html(text):
    parser = DomParser()
    parser.feed(text)
    parser.close()
    return parser.root, parser.errors


def classes(node):
    return set((node["attrs"].get("class") or "").split())


def significant(node):
    items = []
    for child in node["children"]:
        if isinstance(child, str):
            if child.strip():
                items.append(child)
        else:
            items.append(child)
    return items


def text_content(node):
    parts = []

    def walk(value):
        if isinstance(value, str):
            parts.append(value)
        else:
            for child in value["children"]:
                walk(child)

    walk(node)
    return re.sub(r"\s+", " ", "".join(parts)).strip()


def rewrite(url, file_dir):
    if url is None:
        return url
    if url.startswith(("#", "mailto:", "javascript:", "data:", "tel:")):
        return url
    base = url
    hashpart = ""
    query = ""
    if "#" in base:
        base, hashpart = base.split("#", 1)
        hashpart = "#" + hashpart
    if "?" in base:
        base, query = base.split("?", 1)
        query = "?" + query
    if base == "":
        return query + hashpart
    if base.startswith("//") or re.match(r"^[a-z][a-z0-9+.-]*:", base):
        return url
    if base.startswith("/"):
        joined = posixpath.normpath(base).lstrip("/")
    else:
        joined = posixpath.normpath(posixpath.join(file_dir, base))
    if joined.startswith("assets/"):
        return "/" + joined + query + hashpart
    if joined.endswith(".html"):
        return "/original/" + joined + query + hashpart
    return "/" + joined + query + hashpart


def rewrite_attrs(attrs, file_dir):
    copied = {}
    for key, value in attrs.items():
        if key in URL_ATTRS and value:
            copied[key] = rewrite(value, file_dir)
        else:
            copied[key] = "" if value is None else value
    return copied


def freeze(node, file_dir):
    if isinstance(node, str):
        return {"kind": "text", "value": node}
    return {
        "kind": "el",
        "tag": node["tag"],
        "attrs": rewrite_attrs(node["attrs"], file_dir),
        "children": [freeze(child, file_dir) for child in node["children"]],
    }


def transform(node, file_dir):
    if isinstance(node, str):
        return {"kind": "text", "value": node}
    for matcher in MATCHERS:
        hit = matcher(node, file_dir)
        if hit:
            return hit
    return {
        "kind": "el",
        "tag": node["tag"],
        "attrs": rewrite_attrs(node["attrs"], file_dir),
        "children": [transform(child, file_dir) for child in node["children"]],
    }


def only_attrs(node, allowed):
    return set(node["attrs"]) <= allowed


def match_workspace_header(node, file_dir):
    if node["tag"] != "header" or classes(node) != {"workspace-header"}:
        return None
    kids = significant(node)
    if len(kids) != 2 or kids[0]["tag"] != "a" or kids[1]["tag"] != "nav":
        return None
    brand, nav = kids
    brand_kids = significant(brand)
    if len(brand_kids) != 1 or brand_kids[0]["tag"] != "img":
        return None
    items = []
    for link in significant(nav):
        if isinstance(link, str) or link["tag"] != "a":
            return None
        items.append({"href": rewrite(link["attrs"].get("href", ""), file_dir), "label": text_content(link)})
    image = brand_kids[0]
    return {
        "kind": "comp",
        "name": "WorkspaceHeader",
        "props": {
            "logoHref": rewrite(brand["attrs"].get("href", ""), file_dir),
            "logoLabel": brand["attrs"].get("aria-label", ""),
            "logoSrc": rewrite(image["attrs"].get("src", ""), file_dir),
            "logoAlt": image["attrs"].get("alt", ""),
            "navLabel": nav["attrs"].get("aria-label", ""),
            "items": items,
        },
    }


def match_site_header(node, file_dir):
    if node["tag"] != "header" or classes(node) != {"site-header"}:
        return None
    if not only_attrs(node, {"class"}):
        return None
    kids = significant(node)
    if len(kids) != 1 or kids[0]["tag"] != "nav" or "primary-nav" not in classes(kids[0]):
        return None
    nav = kids[0]
    if not only_attrs(nav, {"class", "aria-label"}):
        return None
    nav_kids = significant(nav)
    if len(nav_kids) != 2:
        return None
    brand, links = nav_kids
    if brand["tag"] != "a" or "brand-mark" not in classes(brand):
        return None
    if links["tag"] != "div" or classes(links) != {"nav-links"}:
        return None
    brand_kids = significant(brand)
    if len(brand_kids) != 1 or brand_kids[0]["tag"] != "img":
        return None
    image = brand_kids[0]
    items = []
    for link in significant(links):
        if isinstance(link, str) or link["tag"] != "a" or "nav-link" not in classes(link):
            return None
        items.append(
            {
                "href": rewrite(link["attrs"].get("href", ""), file_dir),
                "label": text_content(link),
                "className": link["attrs"].get("class", "nav-link"),
                "current": link["attrs"].get("aria-current") == "page",
            }
        )
    return {
        "kind": "comp",
        "name": "SiteHeader",
        "props": {
            "logoHref": rewrite(brand["attrs"].get("href", ""), file_dir),
            "logoSrc": rewrite(image["attrs"].get("src", ""), file_dir),
            "logoAlt": image["attrs"].get("alt", ""),
            "logoLabel": brand["attrs"].get("aria-label", ""),
            "navLabel": nav["attrs"].get("aria-label", ""),
            "items": items,
        },
    }


def match_signal(node, file_dir):
    if node["tag"] != "article" or classes(node) != {"home-signal"}:
        return None
    kids = significant(node)
    if len(kids) != 1 or classes(kids[0]) != {"home-signal-body"}:
        return None
    body = significant(kids[0])
    if len(body) != 3 or [body[0]["tag"], body[1]["tag"], body[2]["tag"]] != ["span", "strong", "small"]:
        return None
    return {
        "kind": "comp",
        "name": "Signal",
        "props": {
            "label": text_content(body[0]),
            "value": text_content(body[1]),
            "valueId": body[1]["attrs"].get("id", ""),
            "caption": text_content(body[2]),
        },
    }


def match_hero_stat(node, file_dir):
    if node["tag"] != "article" or classes(node) != {"knowledge-hero-stat"}:
        return None
    body = significant(node)
    if len(body) != 3 or [body[0]["tag"], body[1]["tag"], body[2]["tag"]] != ["span", "strong", "small"]:
        return None
    return {
        "kind": "comp",
        "name": "HeroStat",
        "props": {
            "label": text_content(body[0]),
            "value": text_content(body[1]),
            "caption": text_content(body[2]),
        },
    }


def match_section_heading(node, file_dir):
    if node["tag"] != "header" or classes(node) != {"home-section-heading"}:
        return None
    kids = significant(node)
    if len(kids) != 2 or kids[0]["tag"] != "div" or kids[1]["tag"] != "p":
        return None
    inner = significant(kids[0])
    if len(inner) != 2 or inner[0]["tag"] != "span" or inner[1]["tag"] != "h2":
        return None
    return {
        "kind": "comp",
        "name": "SectionHeading",
        "props": {
            "kicker": text_content(inner[0]),
            "title": text_content(inner[1]),
            "titleId": inner[1]["attrs"].get("id", ""),
            "description": text_content(kids[1]),
        },
    }


def match_workspace_card(node, file_dir):
    if node["tag"] != "article" or "workspace-card" not in classes(node):
        return None
    kids = significant(node)
    if len(kids) not in (2, 3):
        return None
    image_wrap, body = kids[0], kids[1]
    overlay = kids[2] if len(kids) == 3 else None
    if image_wrap["tag"] != "div" or classes(image_wrap) != {"workspace-card-image"}:
        return None
    image_kids = significant(image_wrap)
    if len(image_kids) != 1 or image_kids[0]["tag"] != "img":
        return None
    if body["tag"] != "div" or classes(body) != {"workspace-card-body"}:
        return None
    body_kids = significant(body)
    if not body_kids or body_kids[0]["tag"] != "header":
        return None
    heading = body_kids[0]
    heading_kids = significant(heading)
    if len(heading_kids) != 1:
        return None
    title_node = significant(heading_kids[0])
    if len(title_node) != 1 or title_node[0]["tag"] != "h3":
        return None
    description = ""
    links = []
    links_label = ""
    cursor = 1
    if cursor < len(body_kids) and body_kids[cursor]["tag"] == "p":
        description = text_content(body_kids[cursor])
        cursor += 1
    if cursor < len(body_kids) and body_kids[cursor]["tag"] == "div" and "workspace-links" in classes(body_kids[cursor]):
        link_wrap = body_kids[cursor]
        links_label = link_wrap["attrs"].get("aria-label", "")
        for link in significant(link_wrap):
            if link["tag"] != "a":
                return None
            link_kids = significant(link)
            if len(link_kids) != 3:
                return None
            icon, label, arrow = link_kids
            if icon["tag"] != "span" or "ws-link-icon" not in classes(icon):
                return None
            icon_kids = significant(icon)
            if len(icon_kids) != 1:
                return None
            links.append(
                {
                    "href": rewrite(link["attrs"].get("href", ""), file_dir),
                    "label": text_content(label),
                    "icon": freeze(icon_kids[0], file_dir),
                }
            )
        cursor += 1
    if cursor != len(body_kids):
        return None
    open_href = ""
    open_label = ""
    if overlay is not None:
        if overlay["tag"] != "a" or "workspace-card-link" not in classes(overlay):
            return None
        open_href = rewrite(overlay["attrs"].get("href", ""), file_dir)
        open_label = overlay["attrs"].get("aria-label", "")
    image = image_kids[0]
    return {
        "kind": "comp",
        "name": "WorkspaceCard",
        "props": {
            "className": node["attrs"].get("class", ""),
            "image": rewrite(image["attrs"].get("src", ""), file_dir),
            "imageAlt": image["attrs"].get("alt", ""),
            "title": text_content(title_node[0]),
            "description": description,
            "linksLabel": links_label,
            "links": links,
            "openHref": open_href,
            "openLabel": open_label,
        },
    }


def match_workspace_grid(node, file_dir):
    if node["tag"] != "div" or classes(node) != {"workspace-card-grid"}:
        return None
    cards = []
    for child in significant(node):
        if isinstance(child, str):
            return None
        card = match_workspace_card(child, file_dir)
        if not card:
            return None
        cards.append(card["props"])
    return {"kind": "comp", "name": "WorkspaceGrid", "props": {"cards": cards}}


def match_command_hero(node, file_dir):
    if node["tag"] != "section" or "home-command-center" not in classes(node):
        return None
    if not only_attrs(node, {"class", "aria-labelledby"}):
        return None
    kids = significant(node)
    if len(kids) != 2:
        return None
    hero, layout = kids
    if hero["tag"] != "div" or "home-command-hero" not in classes(hero):
        return None
    hero_kids = significant(hero)
    if len(hero_kids) != 2 or hero_kids[0]["tag"] != "img":
        return None
    if hero_kids[1]["tag"] != "div" or "home-command-hero-overlay" not in classes(hero_kids[1]):
        return None
    if not only_attrs(hero_kids[0], {"src", "alt"}):
        return None
    if layout["tag"] != "div" or classes(layout) != {"home-command-layout"}:
        return None
    layout_kids = significant(layout)
    if len(layout_kids) != 2:
        return None
    copy, metrics = layout_kids
    if copy["tag"] != "div" or classes(copy) != {"home-command-copy"}:
        return None
    copy_kids = significant(copy)
    eyebrow = ""
    index = 0
    if (
        index < len(copy_kids)
        and not isinstance(copy_kids[index], str)
        and copy_kids[index]["tag"] == "p"
        and "eyebrow" in classes(copy_kids[index])
    ):
        eyebrow = text_content(copy_kids[index])
        index += 1
    if index >= len(copy_kids) or copy_kids[index]["tag"] != "h1":
        return None
    title_node = copy_kids[index]
    index += 1
    if index >= len(copy_kids) or copy_kids[index]["tag"] != "p":
        return None
    description = text_content(copy_kids[index])
    index += 1
    accent = False
    if index < len(copy_kids):
        extra = copy_kids[index]
        if extra["tag"] == "span" and "knowledge-hero-accent" in classes(extra):
            accent = True
            index += 1
        else:
            return None
    if index != len(copy_kids):
        return None
    signals = None
    stats = None
    metrics_label = ""
    stats_label = ""
    if metrics["tag"] == "section" and "home-metrics" in classes(metrics):
        metrics_label = metrics["attrs"].get("aria-label", "")
        grid = significant(metrics)
        if len(grid) != 1 or "home-signal-grid" not in classes(grid[0]):
            return None
        signals = []
        for card in significant(grid[0]):
            matched = match_signal(card, file_dir)
            if not matched:
                return None
            signals.append(matched["props"])
    elif metrics["tag"] == "div" and "knowledge-hero-stats" in classes(metrics):
        stats_label = metrics["attrs"].get("aria-label", "")
        stats = []
        for card in significant(metrics):
            matched = match_hero_stat(card, file_dir)
            if not matched:
                return None
            stats.append(matched["props"])
    else:
        return None
    image = hero_kids[0]
    return {
        "kind": "comp",
        "name": "CommandHero",
        "props": {
            "className": node["attrs"].get("class", ""),
            "labelledBy": node["attrs"].get("aria-labelledby", ""),
            "image": rewrite(image["attrs"].get("src", ""), file_dir),
            "imageAlt": image["attrs"].get("alt", ""),
            "eyebrow": eyebrow,
            "title": text_content(title_node),
            "titleId": title_node["attrs"].get("id", ""),
            "description": description,
            "accent": accent,
            "metricsLabel": metrics_label,
            "statsLabel": stats_label,
            "signals": signals,
            "stats": stats,
        },
    }


def match_search_field(node, file_dir):
    if node["tag"] != "label":
        return None
    class_set = classes(node)
    if not ({"search-field", "fm-search-field", "report-search"} & class_set):
        return None
    kids = significant(node)
    label = ""
    icon = None
    field = None
    if len(kids) == 3 and kids[0]["tag"] == "span" and kids[1]["tag"] == "svg" and kids[2]["tag"] == "input":
        label = text_content(kids[0])
        icon = freeze(kids[1], file_dir)
        field = kids[2]
    elif len(kids) == 2 and kids[0]["tag"] == "svg" and kids[1]["tag"] == "input":
        icon = freeze(kids[0], file_dir)
        field = kids[1]
    elif len(kids) == 1 and kids[0]["tag"] == "input":
        field = kids[0]
    else:
        return None
    return {
        "kind": "comp",
        "name": "SearchField",
        "props": {
            "className": node["attrs"].get("class", ""),
            "label": label,
            "icon": icon,
            "input": rewrite_attrs(field["attrs"], file_dir),
        },
    }


def match_sidebar_item(node, file_dir):
    if node["tag"] != "a" or "sidebar-item" not in classes(node):
        return None
    kids = significant(node)
    if len(kids) not in (2, 3):
        return None
    icon, label = kids[0], kids[1]
    if icon["tag"] != "span" or "sidebar-icon" not in classes(icon):
        return None
    if label["tag"] != "span" or "sidebar-label" not in classes(label):
        return None
    icon_kids = significant(icon)
    if len(icon_kids) != 1:
        return None
    count = ""
    count_id = ""
    if len(kids) == 3:
        if kids[2]["tag"] != "strong" or "sidebar-count" not in classes(kids[2]):
            return None
        count = text_content(kids[2])
        count_id = kids[2]["attrs"].get("id", "")
    return {
        "kind": "comp",
        "name": "SidebarItem",
        "props": {
            "attrs": rewrite_attrs(node["attrs"], file_dir),
            "icon": freeze(icon_kids[0], file_dir),
            "label": text_content(label),
            "count": count,
            "countId": count_id,
        },
    }


def match_breadcrumb(node, file_dir):
    if node["tag"] != "div":
        return None
    class_set = classes(node)
    if not ({"v20-title-breadcrumb", "bt-breadcrumb", "fm-breadcrumb"} & class_set):
        return None
    items = []
    for child in significant(node):
        if isinstance(child, str):
            return None
        if child["tag"] == "span" and text_content(child) == "/":
            continue
        if child["tag"] == "a":
            items.append(
                {
                    "href": rewrite(child["attrs"].get("href", ""), file_dir),
                    "label": text_content(child),
                    "current": False,
                    "tag": "a",
                    "id": child["attrs"].get("id", ""),
                }
            )
        elif child["tag"] in {"b", "span"}:
            items.append(
                {
                    "href": "",
                    "label": text_content(child),
                    "current": True,
                    "tag": child["tag"],
                    "id": child["attrs"].get("id", ""),
                }
            )
        else:
            return None
    return {
        "kind": "comp",
        "name": "Breadcrumb",
        "props": {
            "className": node["attrs"].get("class", ""),
            "ariaLabel": node["attrs"].get("aria-label", ""),
            "items": items,
        },
    }


def match_status_badge(node, file_dir):
    if node["tag"] != "span":
        return None
    class_set = classes(node)
    if not ({"v20-status", "asset-status"} & class_set):
        return None
    if significant(node) and any(not isinstance(child, str) for child in significant(node)):
        return None
    return {
        "kind": "comp",
        "name": "StatusBadge",
        "props": {
            "className": node["attrs"].get("class", ""),
            "status": node["attrs"].get("data-status", ""),
            "text": text_content(node),
        },
    }


def match_add_button(node, file_dir):
    class_set = classes(node)
    if node["tag"] not in {"button", "a"}:
        return None
    if not ({"create-knowledge-btn", "knowledge-add-button"} & class_set):
        return None
    return {
        "kind": "comp",
        "name": "AddButton",
        "props": {
            "attrs": rewrite_attrs(node["attrs"], file_dir),
            "children": [freeze(child, file_dir) for child in node["children"]],
        },
    }


def match_ai_launcher(node, file_dir):
    if node["tag"] != "button" or "global-ai-launcher" not in classes(node):
        return None
    kids = significant(node)
    if len(kids) != 2:
        return None
    orb, label = kids
    if orb["tag"] != "span" or "global-ai-orb" not in classes(orb):
        return None
    if label["tag"] != "span" or "global-ai-label" not in classes(label):
        return None
    return {
        "kind": "comp",
        "name": "AiLauncher",
        "props": {
            "attrs": rewrite_attrs(node["attrs"], file_dir),
            "orb": text_content(orb),
            "label": text_content(label),
        },
    }


def match_suggestion(node, file_dir):
    if node["tag"] != "button" or "ask-suggestion" not in classes(node):
        return None
    return {
        "kind": "comp",
        "name": "Suggestion",
        "props": {
            "attrs": rewrite_attrs(node["attrs"], file_dir),
            "label": text_content(node),
        },
    }


def match_scope_option(node, file_dir):
    if node["tag"] != "button" or "scope-option" not in classes(node):
        return None
    return {
        "kind": "comp",
        "name": "ScopeOption",
        "props": {
            "attrs": rewrite_attrs(node["attrs"], file_dir),
            "label": text_content(node),
        },
    }


def wrapper(name, node, file_dir, allowed_tags):
    if node["tag"] not in allowed_tags:
        return None
    return {
        "kind": "comp",
        "name": name,
        "props": {
            "attrs": rewrite_attrs(node["attrs"], file_dir),
            "children": [transform(child, file_dir) for child in node["children"]],
        },
    }


def match_assistant(node, file_dir):
    if node["tag"] != "section" or "assistant-panel" not in classes(node):
        return None
    return wrapper("AssistantPanel", node, file_dir, {"section"})


def match_library_toolbar(node, file_dir):
    if node["tag"] != "header" or "library-toolbar" not in classes(node):
        return None
    return wrapper("LibraryToolbar", node, file_dir, {"header"})


def match_sidebar(node, file_dir):
    if node["tag"] != "aside" or "knowledge-sidebar" not in classes(node):
        return None
    kids = significant(node)
    if len(kids) != 1 or kids[0]["tag"] != "nav" or "sidebar-nav" not in classes(kids[0]):
        return None
    nav = kids[0]
    return {
        "kind": "comp",
        "name": "KnowledgeSidebar",
        "props": {
            "ariaLabel": node["attrs"].get("aria-label", ""),
            "navLabel": nav["attrs"].get("aria-label", ""),
            "children": [transform(child, file_dir) for child in nav["children"]],
        },
    }


def match_page_head(node, file_dir):
    if node["tag"] != "header" or classes(node) != {"v20-page-head"}:
        return None
    kids = significant(node)
    if len(kids) != 2 or kids[0]["tag"] != "div":
        return None
    status = match_status_badge(kids[1], file_dir)
    if not status:
        return None
    inner = significant(kids[0])
    if len(inner) != 4:
        return None
    crumb = match_breadcrumb(inner[0], file_dir)
    if not crumb or inner[1]["tag"] != "p" or "v20-eyebrow" not in classes(inner[1]):
        return None
    if inner[2]["tag"] != "h1" or inner[3]["tag"] != "p":
        return None
    return {
        "kind": "comp",
        "name": "PageHead",
        "props": {
            "breadcrumb": crumb["props"],
            "eyebrow": text_content(inner[1]),
            "title": text_content(inner[2]),
            "titleId": inner[2]["attrs"].get("id", ""),
            "description": text_content(inner[3]),
            "status": status["props"],
        },
    }


def match_button(node, file_dir):
    if node["tag"] != "button":
        return None
    return {
        "kind": "comp",
        "name": "Button",
        "props": {
            "attrs": rewrite_attrs(node["attrs"], file_dir),
            "children": [freeze(child, file_dir) for child in node["children"]],
        },
    }


def match_link(node, file_dir):
    if node["tag"] != "a":
        return None
    return {
        "kind": "comp",
        "name": "Link",
        "props": {
            "attrs": rewrite_attrs(node["attrs"], file_dir),
            "children": [freeze(child, file_dir) for child in node["children"]],
        },
    }


def match_input(node, file_dir):
    if node["tag"] != "input":
        return None
    return {"kind": "comp", "name": "TextInput", "props": {"attrs": rewrite_attrs(node["attrs"], file_dir)}}


def match_textarea(node, file_dir):
    if node["tag"] != "textarea":
        return None
    return {
        "kind": "comp",
        "name": "TextArea",
        "props": {
            "attrs": rewrite_attrs(node["attrs"], file_dir),
            "children": [freeze(child, file_dir) for child in node["children"]],
        },
    }


def match_select(node, file_dir):
    if node["tag"] != "select":
        return None
    return {
        "kind": "comp",
        "name": "Select",
        "props": {
            "attrs": rewrite_attrs(node["attrs"], file_dir),
            "children": [transform(child, file_dir) for child in node["children"]],
        },
    }


MATCHERS = [
    match_workspace_header,
    match_site_header,
    match_command_hero,
    match_workspace_grid,
    match_workspace_card,
    match_section_heading,
    match_assistant,
    match_library_toolbar,
    match_sidebar,
    match_page_head,
    match_ai_launcher,
    match_signal,
    match_hero_stat,
    match_search_field,
    match_sidebar_item,
    match_breadcrumb,
    match_status_badge,
    match_add_button,
    match_suggestion,
    match_scope_option,
    match_button,
    match_link,
    match_input,
    match_textarea,
    match_select,
]


def strip_skipped(node):
    if isinstance(node, str):
        return node
    node["children"] = [
        strip_skipped(child)
        for child in node["children"]
        if isinstance(child, str) or child["tag"] not in {"script", "noscript"}
    ]
    return node


def count_components(node, counts):
    if isinstance(node, dict) and node.get("kind") == "comp":
        counts[node["name"]] = counts.get(node["name"], 0) + 1
        for value in node["props"].values():
            if isinstance(value, list):
                for item in value:
                    count_components(item, counts)
            elif isinstance(value, dict):
                count_components(value, counts)
    elif isinstance(node, dict) and node.get("kind") == "el":
        for child in node["children"]:
            count_components(child, counts)


def body_of(root):
    for child in root["children"]:
        if isinstance(child, dict) and child["tag"] == "html":
            for item in child["children"]:
                if isinstance(item, dict) and item["tag"] == "body":
                    return item
    for child in root["children"]:
        if isinstance(child, dict) and child["tag"] == "body":
            return child
    raise SystemExit("body not found")


def documents():
    yield ("home", ROOT / "index.html", "")
    pages = ROOT / "assets" / "pages"
    for path in sorted(pages.glob("*.html")):
        yield (path.stem, path, "assets/pages")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for doc_id, path, file_dir in documents():
        root, errors = parse_html(path.read_text(encoding="utf-8"))
        if errors:
            print(f"{doc_id} parser notes: {errors[:6]}")
        body = strip_skipped(body_of(root))
        tree = [transform(child, file_dir) for child in body["children"]]
        target = OUT / f"{doc_id}.json"
        target.write_text(json.dumps(tree, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        counts = {}
        for node in tree:
            count_components(node, counts)
        reference = "/original/index.html" if doc_id == "home" else f"/original/assets/pages/{path.name}"
        manifest.append(
            {
                "id": doc_id,
                "title": path.stem.replace("-", " ").title() if doc_id != "home" else "Home",
                "bodyClass": body["attrs"].get("class", ""),
                "reference": reference,
                "source": str(path.relative_to(ROOT)),
                "components": counts,
            }
        )
        print(f"{doc_id}: {counts}")
    (ROOT / "src" / "assembled" / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    lines = ["/** Generated by scripts/compose_portal.py. */"]
    for item in manifest:
        lines.append(f'import {item["id"].replace("-", "_")} from "./trees/{item["id"]}.json";')
    lines.append("export const trees = {")
    for item in manifest:
        name = item["id"].replace("-", "_")
        lines.append(f'  "{item["id"]}": {name},')
    lines.append("};")
    (ROOT / "src" / "assembled" / "registry.js").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
