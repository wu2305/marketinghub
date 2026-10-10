/* The Report Copilot thread rules both consumer apps share: what a recommendation
 * answers, how a question lands in the chat, and which sources a report cites.
 * Pure data in, data out. Where the thread lives (and when it resets) is each
 * app's own business, so this file keeps no state. */
import type React from "react";
import type { MarketingCockpitPage } from "marketing-hub";

type Props = React.ComponentProps<typeof MarketingCockpitPage>;
export type Workspace = NonNullable<Props["workspace"]>;
export type Projects = NonNullable<Props["projects"]>;
export type Asset = NonNullable<Props["knowledge"]>[number];
export type Report = Projects[string]["reports"][number];
export type Answer = Workspace["answer"];
type ChatEntry = NonNullable<Workspace["chat"]>[number];

/** What one report's Copilot shows: the composer text, the open answer and the chat under it. */
export type Thread = { prompt: string; answer: Answer; chat: ChatEntry[] };
export const EMPTY_THREAD: Thread = { prompt: "", answer: null, chat: [] };

/** The knowledge a report cites, as source links (at most four, as in the original). */
export const sourcesFor = (report: Report | undefined, knowledge: Asset[], hrefFor: (type: string) => string) =>
  (report?.knowledgeIds ?? [])
    .map((id) => knowledge.find((asset) => asset.id === id))
    .filter((asset): asset is Asset => Boolean(asset))
    .slice(0, 4)
    .map((asset) => ({ id: asset.id, title: asset.title, href: hrefFor(asset.type) }));

/** Picking a recommendation opens its answer and clears any chat. */
export const answerThread = (prior: Thread, report: Report | undefined, index: number): Thread => {
  const item = report?.recommendations?.[index] ?? report?.recommendations?.[0];
  if (!item) return prior;
  return {
    ...prior,
    chat: [],
    answer: { kind: "answer", title: item.answerTitle ?? item.title, summary: item.summary, findings: (item.findings ?? []).map(([label, text]) => ({ label, text })) },
  };
};

/** A question over an open answer or chat appends below it; otherwise it starts a fresh thread. */
export const askThread = (prior: Thread, question: string, entry: ChatEntry): Thread => ({
  ...prior,
  prompt: "",
  chat: prior.answer || prior.chat.length ? [...prior.chat, entry] : [entry],
});

export const chatEntry = (question: string, report: Report | undefined, eyebrow: string, sources: ChatEntry["sources"]): ChatEntry => ({
  kind: "standard",
  question,
  summary: `From "${report?.title ?? "this report"}": ${eyebrow} answers use the sources listed below.`,
  sources,
});
