/**
 * R5(a) import-boundary guard. Parses every non-story, non-test module under
 * src/design and asserts the layering rules from handover/structural-review.md:
 *
 * - components/  may not import features/, pages/, demo/, content.js,
 *   report-logic.js or report-routes.js (they are the reusable leaf layer).
 * - features/<page>/ may not import a different features/<page>/ subtree,
 *   nor demo/ or content.js (per-page modules stay page-scoped; shared code
 *   belongs in components/ or lib/).
 * - pages/ may not import demo/ or content.js (pages receive data via props;
 *   only stories and hosts may pull fixture content).
 *
 * Existing violations must be fixed, or added to WHITELIST with a reason and
 * registered in handover/README.md §4. The whitelist is keyed
 * "importer:specifier-prefix" and every entry needs `reason`.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

// Acorn and its JSX extension parse the actual ESM export syntax.
// Parse exports instead of matching text: export-star and renamed re-exports
// must be resolved before the public demo surface can be compared.
const require = createRequire(import.meta.url);
const acorn = require("acorn");
const jsx = require("acorn-jsx");
const Parser = acorn.Parser.extend(jsx());

const ROOT = path.resolve(__dirname);
const SKIP = /(\.stories\.jsx|\.test\.jsx?|stories\.test\.jsx)$/;
const IMPORT_RE = /(?:import|export)\s[^"']*?from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']/g;

/** Explicitly allowed violations — each entry must say why and be registered
   in handover §4. Keep empty by default: fix the layering, don't whitelist. */
const WHITELIST = [
  // { file: "features/cockpit/CityInvestDashboard/index.jsx", specifier: "../../report-logic.js", reason: "..." },
];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jsx?|tsx?)$/.test(entry.name) && !SKIP.test(entry.name)) yield full;
  }
}

function importsOf(file) {
  const src = fs.readFileSync(file, "utf8");
  const specs = [];
  for (const match of src.matchAll(IMPORT_RE)) {
    const spec = match[1] || match[2] || match[3];
    if (spec && spec.startsWith(".")) specs.push(spec);
  }
  return specs;
}

/** Resolve a relative specifier to a path inside src/design, or null when it
   lands outside (bare packages and aliases are ignored by the rules). */
function resolveInside(file, spec) {
  const base = path.resolve(path.dirname(file), spec);
  const candidates = [base, `${base}.js`, `${base}.jsx`, path.join(base, "index.js"), path.join(base, "index.jsx")];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const rel = path.relative(ROOT, candidate);
      return rel.startsWith("..") ? null : rel;
    }
  }
  return null;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function whitelisted(file, spec) {
  const r = rel(file);
  return WHITELIST.some((entry) => r === entry.file && spec.startsWith(entry.specifier));
}

function violations() {
  const found = [];
  for (const file of walk(ROOT)) {
    const r = rel(file);
    const layer = r.split("/")[0];
    for (const spec of importsOf(file)) {
      if (whitelisted(file, spec)) continue;
      const target = resolveInside(file, spec);
      if (!target) continue;
      const t = target.split(path.sep).join("/");
      const tLayer = t.split("/")[0];
      const base = path.basename(t);
      if (layer === "components") {
        if (["features", "pages", "demo"].includes(tLayer) || ["content.js", "report-logic.js", "report-routes.js"].includes(base)) {
          found.push(`${r} -> ${spec} (${t})`);
        }
      } else if (layer === "features") {
        const owner = r.split("/")[1];
        const tOwner = t.split("/")[1];
        if ((tLayer === "features" && tOwner !== owner) || tLayer === "demo" || base === "content.js") {
          found.push(`${r} -> ${spec} (${t})`);
        }
      } else if (layer === "pages") {
        if (tLayer === "demo" || base === "content.js") {
          found.push(`${r} -> ${spec} (${t})`);
        }
      }
    }
  }
  return found;
}

describe("src/design import boundaries (R5a)", () => {
  it("components/features/pages only import across allowed layers", () => {
    expect(violations()).toEqual([]);
  });
});

/** Resolve the public name and original defining symbol of every ESM export.
 * A namespace is expanded into member identities so adding a symbol to
 * content.js cannot hide behind the existing `demoContent` export.
 */
function publicExports(file, visiting = new Set()) {
  const absolute = path.resolve(file);
  if (visiting.has(absolute)) throw new Error(`Circular public re-export: ${absolute}`);
  visiting.add(absolute);
  const source = fs.readFileSync(absolute, "utf8");
  const ast = Parser.parse(source, { ecmaVersion: "latest", sourceType: "module" });
  const imports = new Map();
  const aliases = new Map();
  const unsupportedBindings = new Set();
  const result = new Map();
  const stars = [];
  const modulePath = rel(absolute);

  const targetFor = (specifier) => {
    if (!specifier.startsWith(".")) return null;
    const relative = resolveInside(absolute, specifier);
    if (!relative) throw new Error(`Unresolved public re-export: ${modulePath} -> ${specifier}`);
    return path.join(ROOT, relative);
  };
  const origin = (name) => new Set([`${modulePath}#${name}`]);
  const named = (node) => node.name ?? node.value;
  const exported = (node) => named(node.exported ?? node.local);
  const members = (target, prefix) => {
    const entries = new Map([[prefix, new Set([`${rel(target)}#*`])]]);
    for (const [name, identities] of publicExports(target, visiting)) {
      if (name !== "default") entries.set(`${prefix}.${name}`, identities);
    }
    return entries;
  };
  const fromTarget = (target, imported, publicName) => {
    if (!target) return new Map([[publicName, origin(publicName)]]);
    if (imported === "*") return members(target, publicName);
    const identities = publicExports(target, visiting).get(imported);
    if (!identities) throw new Error(`Missing public re-export: ${rel(target)}#${imported}`);
    return new Map([[publicName, identities]]);
  };
  const local = (name, seen = new Set()) => {
    if (seen.has(name)) throw new Error(`Circular export alias: ${modulePath}#${name}`);
    seen.add(name);
    if (unsupportedBindings.has(name)) throw new Error(`Unsupported destructured public export: ${modulePath}#${name}`);
    const imported = imports.get(name);
    if (imported) return fromTarget(imported.target, imported.name, name);
    const alias = aliases.get(name);
    if (alias?.type === "Identifier") {
      const entries = local(alias.name, seen);
      return new Map([...entries].map(([publicName, identities]) => [
        `${name}${publicName.slice(alias.name.length)}`, identities,
      ]));
    }
    if (alias?.type === "MemberExpression" && !alias.computed && alias.object.type === "Identifier") {
      const namespace = imports.get(alias.object.name);
      if (namespace?.name === "*") return fromTarget(namespace.target, named(alias.property), name);
    }
    return new Map([[name, origin(name)]]);
  };
  const add = (entries) => {
    for (const [name, identities] of entries) result.set(name, identities);
  };
  const declarationNames = (declaration) => {
    if (declaration.id) return [named(declaration.id)];
    if (declaration.declarations) return declaration.declarations.map(({ id }) => {
      if (id.type !== "Identifier") throw new Error(`Unsupported destructured public export: ${modulePath}`);
      return id.name;
    });
    return [];
  };
  const patternNames = (pattern) => {
    if (!pattern) return [];
    if (pattern.type === "Identifier") return [pattern.name];
    if (pattern.type === "RestElement" || pattern.type === "AssignmentPattern") return patternNames(pattern.argument ?? pattern.left);
    if (pattern.type === "ArrayPattern") return pattern.elements.flatMap(patternNames);
    if (pattern.type === "ObjectPattern") return pattern.properties.flatMap((property) => patternNames(property.value ?? property.argument));
    throw new Error(`Unsupported public binding pattern: ${modulePath} (${pattern.type})`);
  };

  // Gather all local bindings before resolving exports; declaration order is
  // irrelevant to ESM and `export { alias }` may precede the alias itself.
  for (const node of ast.body) {
    if (node.type === "ImportDeclaration") {
      const target = targetFor(node.source.value);
      for (const spec of node.specifiers) {
        const name = spec.type === "ImportNamespaceSpecifier" ? "*"
          : spec.type === "ImportDefaultSpecifier" ? "default" : named(spec.imported);
        imports.set(spec.local.name, { target, name });
      }
    }
    const declaration = node.type === "ExportNamedDeclaration" ? node.declaration : node;
    if (declaration?.type === "VariableDeclaration") {
      for (const { id, init } of declaration.declarations) {
        if (id.type === "Identifier" && init) aliases.set(id.name, init);
        else if (id.type !== "Identifier") for (const name of patternNames(id)) unsupportedBindings.add(name);
      }
    }
  }

  for (const node of ast.body) {
    if (node.type === "ExportAllDeclaration") {
      const target = targetFor(node.source.value);
      if (!target) continue;
      if (node.exported) add(members(target, named(node.exported)));
      else stars.push(target);
    } else if (node.type === "ExportNamedDeclaration") {
      if (node.source) {
        const target = targetFor(node.source.value);
        for (const spec of node.specifiers) add(fromTarget(target, named(spec.local), exported(spec)));
      } else if (node.declaration) {
        for (const name of declarationNames(node.declaration)) {
          add(local(name));
        }
      } else {
        for (const spec of node.specifiers) {
          const entries = local(named(spec.local));
          const publicName = exported(spec);
          for (const [name, identities] of entries) {
            result.set(name === named(spec.local) ? publicName : `${publicName}${name.slice(named(spec.local).length)}`, identities);
          }
        }
      }
    } else if (node.type === "ExportDefaultDeclaration") {
      const entries = node.declaration.type === "Identifier" ? local(node.declaration.name) : new Map([["default", origin("default")]]);
      for (const [name, identities] of entries) {
        const suffix = node.declaration.type === "Identifier" ? name.slice(node.declaration.name.length) : "";
        result.set(`default${suffix}`, identities);
      }
    }
  }
  for (const target of stars) {
    for (const [name, identities] of publicExports(target, visiting)) {
      if (name !== "default" && !result.has(name)) result.set(name, identities);
    }
  }
  visiting.delete(absolute);
  return result;
}

function protectedPublicExports() {
  const identities = [];
  for (const [publicName, origins] of publicExports(path.join(ROOT, "index.js"))) {
    for (const identity of origins) {
      const [modulePath] = identity.split("#");
      if (modulePath.startsWith("demo/") || modulePath === "content.js" || modulePath === "report-routes.js" || modulePath.endsWith("-fixtures.js")) {
        identities.push(`${publicName} <- ${identity}`);
      }
    }
  }
  return identities.sort();
}

// Temporary compatibility surface. M7 R5(b) will move these to `./demo`.
// This ratchet permits removals but makes every new public demo identity fail.
const ALLOWED_DEMO_EXPORTS = [
  "DATA_MODEL_DOMAINS <- demo/data-model-domains.js#DATA_MODEL_DOMAINS",
  "KNOWLEDGE_HREF <- report-routes.js#KNOWLEDGE_HREF",
  "REPORT_CATALOG_HREF <- report-routes.js#REPORT_CATALOG_HREF",
  "buildCopilotChatEntry <- demo/report-demo.js#buildCopilotChatEntry",
  "cityInvestScenarioSource <- demo/report-demo.js#cityInvestScenarioSource",
  "copilotProfile <- demo/report-demo.js#copilotProfile",
  "copilotSkillItems <- demo/report-demo.js#copilotSkillItems",
  "copilotSourceHref <- report-routes.js#copilotSourceHref",
  "copilotSources <- demo/report-demo.js#copilotSources",
  "dataModelFieldFormat <- demo/data-model-demo.js#dataModelFieldFormat",
  "demoContent <- content.js#*",
  "demoContent.ASSISTANT <- content.js#ASSISTANT",
  "demoContent.ASSISTANT_SKILL_MENU <- content.js#ASSISTANT_SKILL_MENU",
  "demoContent.CAMPAIGN <- content.js#CAMPAIGN",
  "demoContent.COCKPIT <- content.js#COCKPIT",
  "demoContent.COCKPIT_SKILL_MENU <- content.js#COCKPIT_SKILL_MENU",
  "demoContent.DATA_UPLOAD <- content.js#DATA_UPLOAD",
  "demoContent.HOME <- content.js#HOME",
  "demoContent.INTERPRETER <- content.js#INTERPRETER",
  "demoContent.LITE_ASSISTANT <- content.js#LITE_ASSISTANT",
  "demoContent.LOGO <- content.js#LOGO",
  "demoContent.MEDIA_TRACKING <- content.js#MEDIA_TRACKING",
  "demoContent.MODEL_FLOW <- content.js#MODEL_FLOW",
  "demoContent.NAV <- content.js#NAV",
  "demoContent.SELF_SERVICE <- content.js#SELF_SERVICE",
  "demoContent.buildAssistantAnswer <- content.js#buildAssistantAnswer",
  "demoContent.buildCampaignAnswer <- content.js#buildCampaignAnswer",
  "demoContent.buildHomeAssistantAnswer <- content.js#buildHomeAssistantAnswer",
  "demoContent.buildLiteAssistantAnswer <- content.js#buildLiteAssistantAnswer",
  "demoContent.buildModelDescription <- content.js#buildModelDescription",
  "demoContent.buildModelDraft <- content.js#buildModelDraft",
  "demoContent.buildModelLogic <- content.js#buildModelLogic",
  "demoContent.buildReportAssistantAnswer <- content.js#buildReportAssistantAnswer",
  "generateCityInvestScenario <- demo/report-demo.js#generateCityInvestScenario",
  "liveReportHref <- report-routes.js#liveReportHref",
  "normalizeFieldRecord <- demo/field-library-demo.js#normalizeFieldRecord",
  "normalizeScenarioRecord <- demo/scenario-demo.js#normalizeScenarioRecord",
  "projectCatalogHref <- report-routes.js#projectCatalogHref",
  "reportContextHref <- report-routes.js#reportContextHref",
  "resolveCopilotAnswer <- demo/report-demo.js#resolveCopilotAnswer",
  "useBusinessTermDemo <- demo/business-term-demo.js#useBusinessTermDemo",
  "useCockpitDemo <- demo/cockpit-demo.js#useCockpitDemo",
  "useDataModelDemo <- demo/data-model-demo.js#useDataModelDemo",
  "useFieldLibraryDemo <- demo/field-library-demo.js#useFieldLibraryDemo",
  "useHomeDemo <- demo/home-demo.js#useHomeDemo",
  "useInterpreterDemo <- demo/interpreter-demo.js#useInterpreterDemo",
  "useScenarioDemo <- demo/scenario-demo.js#useScenarioDemo",
];

describe("src/design public demo export surface (WP4)", () => {
  it("does not add demo, content, route, or fixture symbols to index.js", () => {
    const allowed = new Set(ALLOWED_DEMO_EXPORTS);
    expect(protectedPublicExports().filter((entry) => !allowed.has(entry))).toEqual([]);
  });
});
