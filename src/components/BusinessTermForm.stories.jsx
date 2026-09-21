import { BusinessTermForm } from "./BusinessTermForm.jsx";

export default {
  title: "Pages/Business Term Form",
  component: BusinessTermForm,
  parameters: {
    reference: "/original/assets/pages/knowledge-create.html?type=Business%20Term",
  },
};

export const Create = {};

export const EditGmv = {
  args: {
    initial: {
      id: "business-term-gmv",
      title: "GMV (Gross Merchandise Value)",
      kind: "Business Term",
      description: "Total value of merchandise sold through the platform before deductions, used as a primary revenue indicator.",
      synonyms: "Gross merchandise volume",
      scope: ["Commerce"],
    },
  },
};
