import { describe, expect, it } from "vitest";
import { loadStories, mountStory } from "./harness.jsx";
import { check } from "./invariants.js";
import { booleanVariants, disabledItemVariants, enumVariants, longTextVariant, manyItemsVariant } from "./variants.js";

/* Every story, in every state a designer or host can reach by changing its
   inputs: default, each Controls option, each boolean flipped, long text, many
   rows, and each item disabled in turn. Each state must render without a React
   or page error, emit plain-data callback payloads, and pass the invariants. */

const stories = loadStories();

/* Cloning rows repeats whatever id a component keys or labels by; those two
   reports are about the cloned data, not the component. */
const CLONE_ARTIFACT = /Encountered two children with the same key|is used more than once/;

const unique = (list) => [...new Set(list)];

function inspect(story, label, overrides) {
  const run = mountStory(story, overrides);
  try {
    const found = [...run.problems(), ...check(run.container.ownerDocument.body)];
    if (!run.errors.length && !run.container.ownerDocument.body.firstElementChild) {
      found.push({ rule: "empty", target: "page", detail: "story rendered nothing" });
    }
    return unique(found.filter((v) => !(label.endsWith("30 items") && CLONE_ARTIFACT.test(v.detail))).map((v) => `${label}: [${v.rule}] ${v.target} ${v.detail}`));
  } finally {
    run.stop();
  }
}

/* A page file holds many stories that differ only in which section or overlay
   is open; long text and many rows are tried on its first story, the item
   matrix on components and features only (a page's arrays are navigation and
   fixture data). */
const firstOfFile = (story) => stories.find((other) => other.file === story.file) === story;
const components = stories.filter((story) => !story.isPage);
const sized = stories.filter((story) => !story.isPage || firstOfFile(story));

const all = [
  ...stories.map((story) => ({ story, label: "default", overrides: {} })),
  ...enumVariants(stories),
  ...booleanVariants(stories),
  ...sized.map(longTextVariant).filter(Boolean),
  ...sized.map(manyItemsVariant).filter(Boolean),
  ...components.flatMap(disabledItemVariants),
];

const byFile = Map.groupBy(all, (variant) => variant.story.file);

describe("every story in every reachable input state", () => {
  for (const [file, variants] of byFile) {
    it(`${file} (${variants.length} states)`, () => {
      const found = variants.flatMap(({ story, label, overrides }) =>
        inspect(story, `${story.name} / ${label}`, overrides),
      );
      expect(unique(found)).toEqual([]);
    }, 60000);
  }
});
