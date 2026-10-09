import { describe, expect, it } from "vitest";
import { exerciseStory } from "./exercises.jsx";
import { loadStories } from "./harness.jsx";

/* Every story, used the way a person uses it: each control activated twice in
   a row, then every surface it opens dismissed and opened again (see exercises.jsx).
   Components and features here; the page stories, which are slower, in
   interactions-pages.test.jsx so the two run side by side. */

const stories = loadStories().filter((story) => story.isPage === false);

describe("using every control, closing and reopening every surface", () => {
  for (const story of stories) {
    it(`${story.title} / ${story.name}  (${story.file})`, () => {
      expect(exerciseStory(story, undefined)).toEqual([]);
    }, 60000);
  }
});
