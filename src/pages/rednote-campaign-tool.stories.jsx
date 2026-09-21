import { documents } from "./documents.js";
import { pageStory } from "./pageStory.jsx";
import { PortalDocument } from "./PortalDocument.jsx";

const byId = Object.fromEntries(documents.map((doc) => [doc.id, doc]));

export default {
  title: "Pages/RedNote Campaign Tool",
  component: PortalDocument,
};

export const RedNote_Campaign_Tool_Campaign_workspace = pageStory(byId["RedNote_Campaign_Tool_Campaign_workspace"]);
