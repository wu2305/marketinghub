import { documents } from "./documents.js";
import { pageStory } from "./pageStory.jsx";
import { PortalDocument } from "./PortalDocument.jsx";

const byId = Object.fromEntries(documents.map((doc) => [doc.id, doc]));

export default {
  title: "Pages/Home",
  component: PortalDocument,
};

export const Home_Home = pageStory(byId["Home_Home"]);
