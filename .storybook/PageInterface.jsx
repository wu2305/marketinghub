import { PureArgsTable } from "@storybook/blocks";

// React docgen omits required destructured props from these JavaScript pages.
// Read their existing public JSDoc instead of duplicating the API in each MDX.
function parameterRows(source, name) {
  const comment = [...source.matchAll(/\/\*\*([\s\S]*?)\*\//g)].find((match) =>
    new RegExp(`^\\s*export function\\s+${name}\\b`).test(source.slice(match.index + match[0].length)));
  if (!comment) throw new Error(`Missing public JSDoc for ${name}`);
  const text = comment[1].split("\n").map((line) => line.replace(/^\s*\* ?/, "")).join("\n");
  const rows = {};
  for (const entry of text.split(/(?=^@param\b)/m).filter((part) => part.startsWith("@param"))) {
    let rest = entry.slice(6).trim();
    let depth = 0;
    let end = -1;
    for (let i = 0; i < rest.length; i += 1) {
      if (rest[i] === "{") depth += 1;
      if (rest[i] === "}" && --depth === 0) { end = i; break; }
    }
    if (rest[0] !== "{" || end < 0) throw new Error(`Missing parameter type in ${name}: ${entry}`);
    const type = rest.slice(1, end);
    rest = rest.slice(end + 1).trim();
    const optional = rest.startsWith("[");
    end = rest.search(/\s/);
    if (optional) {
      depth = 0;
      for (let i = 0; i < rest.length; i += 1) {
        if (rest[i] === "[") depth += 1;
        if (rest[i] === "]" && --depth === 0) { end = i + 1; break; }
      }
    }
    if (end < 0) end = rest.length;
    const declaration = rest.slice(0, end).replace(/^\[|\]$/g, "");
    const separator = declaration.indexOf("=");
    const parameter = separator < 0 ? declaration : declaration.slice(0, separator);
    if (parameter === "props") continue;
    if (!parameter.startsWith("props.")) throw new Error(`Unexpected public parameter ${parameter} in ${name}`);
    const key = parameter.slice(6);
    rows[key] = {
      name: key,
      // " // " separates the English text from its Chinese (中文) translation.
      description: rest.slice(end).split(/\n@/)[0].trim().replace(/\s+/g, " ").replace(" // ", "\n\n"),
      type: { name: "other", value: type, required: !optional },
      table: { type: { summary: type }, ...(separator >= 0 ? { defaultValue: { summary: declaration.slice(separator + 1) } } : {}) },
    };
  }
  if (!Object.keys(rows).length) throw new Error(`No public parameters documented for ${name}`);
  return rows;
}

export function PageInterface({ source, name }) {
  return <PureArgsTable rows={parameterRows(source, name)} />;
}
