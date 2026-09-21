import { documents } from "./documents.js";
import { pageStory } from "./pageStory.jsx";
import { PortalDocument } from "./PortalDocument.jsx";

const byId = Object.fromEntries(documents.map((doc) => [doc.id, doc]));

export default {
  title: "Pages/Self-Service Center",
  component: PortalDocument,
};

export const Self_Service_Center_Flexible_analysis = pageStory(byId["Self_Service_Center_Flexible_analysis"]);
export const Self_Service_Center_Data_upload_tab = pageStory(byId["Self_Service_Center_Data_upload_tab"]);
export const Self_Service_Center_Data_upload = pageStory(byId["Self_Service_Center_Data_upload"]);
export const Self_Service_Center_Media_tracking_detail = pageStory(byId["Self_Service_Center_Media_tracking_detail"]);
