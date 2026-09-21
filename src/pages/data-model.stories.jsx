import { documents } from "./documents.js";
import { pageStory } from "./pageStory.jsx";
import { PortalDocument } from "./PortalDocument.jsx";

const byId = Object.fromEntries(documents.map((doc) => [doc.id, doc]));

export default {
  title: "Pages/Data Model",
  component: PortalDocument,
};

export const Data_Model_Data_model = pageStory(byId["Data_Model_Data_model"]);
