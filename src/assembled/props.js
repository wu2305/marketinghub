const BOOLEAN = new Set([
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
]);

const NAME = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  autocomplete: "autoComplete",
  contenteditable: "contentEditable",
  colspan: "colSpan",
  rowspan: "rowSpan",
  datetime: "dateTime",
  enctype: "encType",
  formaction: "formAction",
  novalidate: "noValidate",
  autoplay: "autoPlay",
  allowfullscreen: "allowFullScreen",
  formnovalidate: "formNoValidate",
  viewbox: "viewBox",
  preserveaspectratio: "preserveAspectRatio",
  crossorigin: "crossOrigin",
  spellcheck: "spellCheck",
  srcset: "srcSet",
  usemap: "useMap",
  frameborder: "frameBorder",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
};

function reactName(rawName) {
  if (NAME[rawName]) return NAME[rawName];
  if (rawName.startsWith("data-") || rawName.startsWith("aria-")) return rawName;
  if (rawName.includes("-")) return rawName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  return rawName;
}

export function toReactProps(attrs = {}) {
  const props = {};
  Object.entries(attrs).forEach(([rawName, rawValue]) => {
    const name = reactName(rawName);
    if (rawName === "style" && typeof rawValue === "string") {
      const style = {};
      rawValue.split(";").forEach((part) => {
        const index = part.indexOf(":");
        if (index === -1) return;
        const rawKey = part.slice(0, index).trim();
        if (!rawKey) return;
        const key = rawKey.startsWith("--")
          ? rawKey
          : rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        style[key] = part.slice(index + 1).trim();
      });
      props.style = style;
      return;
    }
    if (rawName === "contenteditable") {
      props.contentEditable = rawValue;
      props.suppressContentEditableWarning = true;
      return;
    }
    if (BOOLEAN.has(rawName)) {
      props[name] = true;
      return;
    }
    props[name] = rawValue;
  });
  return props;
}

export function textFrom(nodes) {
  if (!nodes) return "";
  return nodes
    .map((node) => {
      if (!node) return "";
      if (node.kind === "text") return node.value;
      if (node.children) return textFrom(node.children);
      if (node.kind === "comp" && node.props?.label) return node.props.label;
      return "";
    })
    .join("");
}
