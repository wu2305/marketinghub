import { describe, expect, it } from "vitest";
import { exerciseStory, shellOf } from "./exercises.jsx";
import { loadStories } from "./harness.jsx";

/* Every story, used the way a person uses it: each control activated twice in
   a row, then every surface it opens dismissed and opened again (see exercises.jsx).
   Page stories here, which are slower; components and features are in
   interactions.test.jsx so the two run side by side. A page file's first story
   is exercised through all its controls; its other stories are about the state
   they add, so they skip the controls the first story already covered. */

const stories = loadStories().filter((story) => story.isPage);
const firstOfFile = new Map();
for (const story of stories) if (!firstOfFile.has(story.file)) firstOfFile.set(story.file, story);
const shells = new Map();
const shellFor = (story) => {
  if (firstOfFile.get(story.file) === story) return new Set();
  if (!shells.has(story.file)) shells.set(story.file, shellOf(firstOfFile.get(story.file)));
  return shells.get(story.file);
};

describe("using every control, closing and reopening every surface", () => {
  for (const story of stories) {
    it(`${story.title} / ${story.name}  (${story.file})`, () => {
      expect(exerciseStory(story, shellFor(story))).toEqual([]);
    }, 60000);
  }
});
