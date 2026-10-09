/* What makes this demo this customer's: their name, logo, wording and data.
 * Everything you do not override keeps the product's sample content.
 *
 * Content shapes are documented by the page stories in Storybook (Pages) and by
 * the constants in src/design/content.js; spread the default and change only
 * the fields you need. */
import { COCKPIT, HOME, LOGO } from "marketing-hub/demo";

export const brand = {
  title: "Marketing Hub: all pages",
  /* A customer logo: import an image file kept in this folder, for example
     `import logo from "./logo.png";` and use `{ src: logo, alt: "Acme" }`. */
  logo: { ...LOGO },
};

export const home = {
  ...HOME,
  hero: {
    ...HOME.hero,
    title: "Marketing Portal",
    description: "Your daily workspace for campaign planning, activation, optimization and knowledge, all in one place.",
  },
};

export const cockpit = { ...COCKPIT };
