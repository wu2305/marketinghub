import { documents } from "./documents.js";
import { pageStory } from "./pageStory.jsx";
import { PortalDocument } from "./PortalDocument.jsx";

const byId = Object.fromEntries(documents.map((doc) => [doc.id, doc]));

export default {
  title: "Pages/Metric Dictionary",
  component: PortalDocument,
};

export const Metric_Dictionary_Metric_dictionary = pageStory(byId["Metric_Dictionary_Metric_dictionary"]);
