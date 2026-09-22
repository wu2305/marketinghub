import React from "react";
import manifest from "./manifest.json";
import { trees } from "./registry.js";
import { AssembledPage } from "./AssembledPage.jsx";
import { withPortalActions } from "./story-actions.jsx";

export default {
  title: "Assembled/Documents",
  decorators: [withPortalActions],
};

function documentStory(id) {
  const doc = manifest.find((item) => item.id === id);
  return {
    name: doc.title,
    parameters: { reference: doc.reference },
    render: () => <AssembledPage nodes={trees[id]} bodyClass={doc.bodyClass} />,
  };
}

export const Home = documentStory("home");
export const Reports = documentStory("reports");
export const Flexible = documentStory("flexible");
export const Knowledge = documentStory("knowledge");
export const KnowledgeCreate = documentStory("knowledge-create");
export const KnowledgeView = documentStory("knowledge-view");
export const DataModel = documentStory("data-model");
export const DataUpload = documentStory("data-upload");
export const MetricDictionary = documentStory("metric-dictionary");
export const Campaign = documentStory("campaign");
export const ScenarioLibrary = documentStory("scenario-library");
export const ScenarioDetail = documentStory("scenario-detail");
export const ScenarioEdit = documentStory("scenario-edit");
export const ReviewCenter = documentStory("review-center");
export const FeedbackQuality = documentStory("feedback-quality");
export const PersonalMemory = documentStory("personal-memory");
export const MediaTrackingDetail = documentStory("media-tracking-detail");
