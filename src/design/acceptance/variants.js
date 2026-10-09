/* Ways to change a story's inputs the way a designer or host would, each as a
   set of arg overrides: every Controls option, the other side of a boolean, text
   far longer than the demo copy, many more rows, and one disabled item at a time. */

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
const sameValue = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** One entry per Controls option of every enum arg, each tried once per story file. */
export function enumVariants(stories) {
  const seen = new Set();
  const variants = [];
  for (const story of stories) {
    for (const [arg, argType] of Object.entries(story.Story.argTypes || {})) {
      if (!Array.isArray(argType.options) || argType.control === false || argType.control?.disable) continue;
      for (const option of argType.options) {
        const key = `${story.file}|${arg}|${JSON.stringify(option)}`;
        if (seen.has(key) || sameValue(story.Story.args[arg], option)) continue;
        seen.add(key);
        variants.push({ story, label: `${arg}=${JSON.stringify(option)}`, overrides: { [arg]: option } });
      }
    }
  }
  return variants;
}

/** The other side of every boolean arg, once per story file. */
export function booleanVariants(stories) {
  const seen = new Set();
  const variants = [];
  for (const story of stories) {
    for (const [arg, value] of Object.entries(story.Story.args || {})) {
      const key = `${story.file}|${arg}`;
      if (typeof value !== "boolean" || seen.has(key)) continue;
      seen.add(key);
      variants.push({ story, label: `${arg}=${!value}`, overrides: { [arg]: !value } });
    }
  }
  return variants;
}

/* Keys whose strings are shown to people. Ids, hrefs, enum values and class
   names are left alone so the story keeps pointing at the same items. */
const TEXT_KEYS = /^(label|title|name|text|body|description|placeholder|summary|subtitle|eyebrow|heading|caption|note|message|content|lead|hint|query|prompt|question|answer)$/i;
const IDENTITY_KEYS = /(^|[a-z])(Id|Key|Href|Url)$|^(id|key|href|url|variant|tone|size|type|kind|status)$/;

export const LONG_WORDS = "Quarterly omnichannel attribution reconciliation across regional storefronts and partner marketplaces ".repeat(4).trim();
export const LONG_TOKEN = "SUPERCALIFRAGILISTICEXPIALIDOCIOUS_0123456789_ABCDEFGHIJKLMNOPQRSTUVWXYZ_acceptance";

function lengthen(value) {
  return `${value} ${LONG_WORDS} ${LONG_TOKEN}`;
}

function mapText(value, key = "") {
  if (typeof value === "string") return TEXT_KEYS.test(key) && !IDENTITY_KEYS.test(key) && value.trim() ? lengthen(value) : value;
  if (Array.isArray(value)) return value.map((item) => mapText(item, key));
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapText(v, k)]));
  return value;
}

/** Every displayed string far longer than the demo copy. Null when the story has none. */
export function longTextVariant(story) {
  const overrides = {};
  for (const [arg, value] of Object.entries(story.Story.args || {})) {
    if (typeof value === "function" || /^on[A-Z]/.test(arg)) continue;
    const argType = story.Story.argTypes?.[arg];
    const isText = typeof value === "string" && !argType?.options && (argType?.control?.type === "text" || (TEXT_KEYS.test(arg) && !IDENTITY_KEYS.test(arg)));
    const mapped = typeof value === "string" ? (isText && value.trim() ? lengthen(value) : value) : mapText(value, arg);
    if (!sameValue(mapped, value)) overrides[arg] = mapped;
  }
  return Object.keys(overrides).length ? { story, label: "long text", overrides } : null;
}

/* Copies keep their ids so lookups by id (routes, icons) still resolve; only the
   shown text changes, to tell the rows apart. */
const withSuffix = (item, n) => {
  if (!isPlainObject(item)) return item;
  if (typeof item.title === "string") return { ...item, title: `${item.title} (${n})` };
  if (typeof item.label === "string") return { ...item, label: `${item.label} (${n})` };
  return item;
};

/** Every array of objects stretched to 30 entries. Null when the story has none. */
export function manyItemsVariant(story) {
  const overrides = {};
  for (const [arg, value] of Object.entries(story.Story.args || {})) {
    if (Array.isArray(value) && value.length && value.every(isPlainObject)) {
      overrides[arg] = Array.from({ length: 30 }, (_, n) => (n < value.length ? value[n] : withSuffix(value[n % value.length], n)));
    }
  }
  return Object.keys(overrides).length ? { story, label: "30 items", overrides } : null;
}

/** For each short array of objects, one variant per item with that item disabled. */
export function disabledItemVariants(story) {
  const variants = [];
  for (const [arg, value] of Object.entries(story.Story.args || {})) {
    if (!Array.isArray(value) || value.length < 2 || value.length > 12 || !value.every(isPlainObject)) continue;
    value.forEach((item, index) => {
      if (item.disabled === true) return;
      const items = value.map((entry, at) => (at === index ? { ...entry, disabled: true } : entry));
      variants.push({ story, label: `${arg}[${index}] disabled`, overrides: { [arg]: items } });
    });
  }
  return variants;
}
