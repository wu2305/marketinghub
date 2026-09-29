/* WP5: the consumer-built Business Term workspace (examples/consumer) against
 * the original pages. Every Business Term scenario of P07 and P08 runs again
 * with its story side pointed at the consumer story, so the page a consumer
 * assembles from public exports is held to the same paired checks as our own
 * page stories. The consumer story opens on the library; form scenarios reach
 * the form by clicking through it, like a user. The last scenario is the one
 * our host could not show: Save lands the new draft in the library. */
import p07 from "./p07.mjs";
import p08 from "./p08.mjs";

const STORY = "examples-consumer-business-term--workspace";
const toForm = [{ click: ".mh-btview a:has-text('Add Business Term')" }, { wait: ".mh-kcreate[data-kc-type='Business Term']" }];
const toEditGmv = [
  { click: ".mh-btview [aria-label='Disable GMV (Gross Merchandise Value)']" },
  { wait: ".mh-confirm--warning" },
  { click: ".mh-confirm--warning button:has-text('Confirm Offline')" },
  { click: ".mh-btview [aria-label='Edit GMV (Gross Merchandise Value)']" },
  { wait: ".mh-kcreate[data-kc-mode='edit']" },
];
/* The P08 story side started on a dedicated story; here it starts from the library. */
const formSteps = { "p08-business-term": toForm, "p08-business-edit": toEditGmv, "p08-business-required": [...toForm, { click: ".mh-btform button:has-text('Save')" }] };

const reused = [
  ...p07.filter((scenario) => scenario.story?.id === "pages--interpreter-business-term"),
  ...p08.filter((scenario) => scenario.id in formSteps),
].map((scenario) => ({
  ...scenario,
  id: `consumer-${scenario.id}`,
  story: {
    ...scenario.story,
    id: STORY,
    actions: [...(formSteps[scenario.id] || []), ...(scenario.story.actions || [])],
  },
}));

export default [
  ...reused,
  {
    /* business-term-form.js:290-310 stores the draft and returns to the
       library, which lists it first with a Draft badge. */
    id: "consumer-business-term-saved-draft",
    original: {
      url: "/assets/pages/knowledge-create.html",
      actions: [
        { fill: ["input[name='title']", "Repeat Buyer"] },
        { fill: ["textarea[name='description']", "A customer with two or more paid orders in the period."] },
        { click: "button#saveBtn" },
        { wait: ".bt-term-card" },
        { waitMs: 800 },
      ],
      expect: [
        { sel: ".bt-term-card", count: 7 },
        { sel: ".bt-term-card:first-of-type h3", text: "Repeat Buyer" },
        { sel: ".bt-term-card:first-of-type .fm-draft-badge", text: "Draft" },
      ],
    },
    story: {
      id: STORY,
      actions: [
        ...toForm,
        { fill: ["input[name='title']", "Repeat Buyer"] },
        { fill: ["textarea[name='description']", "A customer with two or more paid orders in the period."] },
        { click: ".mh-btform button:has-text('Save')" },
        { wait: ".mh-btview" },
      ],
      expect: [
        { sel: ".mh-btview .mh-library-item", count: 7 },
        { sel: ".mh-btview .mh-library-item:first-of-type .mh-library-item__title", text: "Repeat Buyer" },
        { sel: ".mh-btview .mh-library-item:first-of-type .mh-library-item__draft", text: "Draft" },
      ],
    },
  },
];
