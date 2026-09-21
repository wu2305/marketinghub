import { documents } from "./documents.js";
import { pageStory } from "./pageStory.jsx";
import { PortalDocument } from "./PortalDocument.jsx";

const byId = Object.fromEntries(documents.map((doc) => [doc.id, doc]));

export default {
  title: "Pages/Governance",
  component: PortalDocument,
};

export const Governance_Scenario_library = pageStory(byId["Governance_Scenario_library"]);
export const Governance_Review_center = pageStory(byId["Governance_Review_center"]);
export const Governance_Feedback_and_quality = pageStory(byId["Governance_Feedback_and_quality"]);
export const Governance_Personal_memory = pageStory(byId["Governance_Personal_memory"]);
export const Governance_Scenario_detail_Channel_Performance_Analysis = pageStory(byId["Governance_Scenario_detail_Channel_Performance_Analysis"]);
export const Governance_Scenario_edit_Channel_Performance_Analysis = pageStory(byId["Governance_Scenario_edit_Channel_Performance_Analysis"]);
export const Governance_Scenario_detail_Campaign_Review_Reporting = pageStory(byId["Governance_Scenario_detail_Campaign_Review_Reporting"]);
export const Governance_Scenario_edit_Campaign_Review_Reporting = pageStory(byId["Governance_Scenario_edit_Campaign_Review_Reporting"]);
export const Governance_Scenario_detail_Channel_Exception_Watch = pageStory(byId["Governance_Scenario_detail_Channel_Exception_Watch"]);
export const Governance_Scenario_edit_Channel_Exception_Watch = pageStory(byId["Governance_Scenario_edit_Channel_Exception_Watch"]);
export const Governance_Scenario_detail_City_Comparison_Analysis = pageStory(byId["Governance_Scenario_detail_City_Comparison_Analysis"]);
export const Governance_Scenario_edit_City_Comparison_Analysis = pageStory(byId["Governance_Scenario_edit_City_Comparison_Analysis"]);
export const Governance_Scenario_detail_Campaign_Anomaly_Detection = pageStory(byId["Governance_Scenario_detail_Campaign_Anomaly_Detection"]);
export const Governance_Scenario_edit_Campaign_Anomaly_Detection = pageStory(byId["Governance_Scenario_edit_Campaign_Anomaly_Detection"]);
export const Governance_Scenario_detail_Customer_Funnel_Optimization = pageStory(byId["Governance_Scenario_detail_Customer_Funnel_Optimization"]);
export const Governance_Scenario_edit_Customer_Funnel_Optimization = pageStory(byId["Governance_Scenario_edit_Customer_Funnel_Optimization"]);
export const Governance_Scenario_detail_Campaign_ROI_Forecasting = pageStory(byId["Governance_Scenario_detail_Campaign_ROI_Forecasting"]);
export const Governance_Scenario_edit_Campaign_ROI_Forecasting = pageStory(byId["Governance_Scenario_edit_Campaign_ROI_Forecasting"]);
export const Governance_Scenario_detail_Audience_Insight_Generation = pageStory(byId["Governance_Scenario_detail_Audience_Insight_Generation"]);
export const Governance_Scenario_edit_Audience_Insight_Generation = pageStory(byId["Governance_Scenario_edit_Audience_Insight_Generation"]);
export const Governance_Scenario_detail_Competitive_Media_Analysis = pageStory(byId["Governance_Scenario_detail_Competitive_Media_Analysis"]);
export const Governance_Scenario_edit_Competitive_Media_Analysis = pageStory(byId["Governance_Scenario_edit_Competitive_Media_Analysis"]);
