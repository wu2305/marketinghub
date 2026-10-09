# Page recipes: adding a page to a customer demo

`examples/host/main.jsx` wires every page the repository builds (17, nine current and eight retired, see the
table) and is checked by `scripts/host-check.mjs`. A demo reuses that wiring. To add a page, copy the route function named below from `examples/demos/showcase/App.jsx` (already converted; or from `examples/host/main.jsx`, then convert it with this table) into the demo's `App.jsx`
and change these, everywhere they appear:

| in `examples/host/main.jsx` | in a demo |
|---|---|
| imports from `../../src/design/index.js` and `.../demo/index.js` | `from "marketing-hub"` and `from "marketing-hub/demo"` (same names) |
| `hostLogo` | `router.logo` |
| `hostNav()` | `router.navigation` |
| `hostHrefFor` | `router.hrefFor` |
| `navigateTarget`, `navigateHost` | `router.navigate` |
| `hostHref("x")` (for example a back link) | `router.hrefFor("x")` |
| `params.get("k")`, `params.has("k")` | `params.k`, `params.k !== undefined` (params is a plain object) |
| `mapDemoHref(...)` | delete the call; the demo router turns original-page links into routes itself |
| `CITY_INVEST`, `REPORT_PROJECTS` and other content constants | import from `marketing-hub/demo`; take customer-specific ones from `content.js` |

Get `router` with `const router = useRouter();` (imported from `../_kit/router.jsx`) as the first line of the
function. The route function receives `{ params }` (the query of the URL) when it has parameters.
`examples/demos/_template/App.jsx` has three finished examples.

| page id | page component | demo hook | route function in the host | URL params | status |
|---|---|---|---|---|---|
| `home` | `HomePage` | `useHomeDemo` | `HomeRoute` | | current |
| `cockpit` | `MarketingCockpitPage` | `useCockpitDemo` | `CockpitRoute` | `project`, `dashboard` (set: the live report opens; `view` is carried in the URL but not read) | current |
| `self-service` | `SelfServicePage` | `useSelfServiceDemo` | `SelfServiceRoute` | `tab` (`analysis`/`upload`) | current |
| `data-upload` | `DataUploadPage` | `useDataUploadDemo` | `DataUploadRoute` | | current |
| `media-tracking-detail` | `MediaTrackingDetailPage` | `useMediaTrackingDemo` | `MediaTrackingRoute` | | current |
| `campaign` | `CampaignPage` | `useCampaignDemo` | `CampaignRoute` | | current |
| `interpreter` | `AiInterpreterPage` | `useInterpreterDemo` | `InterpreterRoute` | `type`, `detail`, `notice` | current |
| `knowledge-create` | `KnowledgeCreatePage` | `useKnowledgeCreateDemo` | `KnowledgeCreateRoute` | `type`, `mode`, `id`, `copy` | current |
| `knowledge-view` | `KnowledgeViewPage` | `useKnowledgeViewDemo` | `KnowledgeViewRoute` | `id` | retired, no story |
| `metric-dictionary` | `MetricDictionaryPage` | `useMetricDictionaryDemo` | `MetricDictionaryRoute` | | retired, no story |
| `data-model` | `DataModelPage` | `useDataModelPageDemo` | `DataModelRoute` | see the route | current |
| `review-center` | `ReviewCenterPage` | `useReviewCenterDemo` | `ReviewCenterRoute` | | retired, no story |
| `feedback-quality` | `FeedbackQualityPage` | `useFeedbackQualityDemo` | `FeedbackQualityRoute` | | retired, no story |
| `personal-memory` | `PersonalMemoryPage` | `usePersonalMemoryDemo` | `PersonalMemoryRoute` | | retired, no story |
| `scenario-library` | `ScenarioLibraryPage` | `useSkillLibraryDemo` | `ScenarioLibraryRoute` | `notice` | retired, no story |
| `scenario-detail` | `ScenarioDetailPage` | `useScenarioDetailDemo` | `ScenarioDetailRoute` | `id` | retired, no story |
| `scenario-edit` | `ScenarioEditPage` | `useScenarioEditDemo` | `ScenarioEditRoute` | `id` | retired, no story |

The `knowledge-view` and `data-model` route functions also fix up the URL (`replaceState`). In a demo, pass the `id`
from `params` and skip the redirect code unless a link you include needs it.

The governance pages (`review-center`, `feedback-quality`, `personal-memory`, `scenario-library`, `scenario-detail`,
`scenario-edit`) are retired (no Storybook story, not part of the current product). If a brief still needs one, they carry their own secondary links to each other and to `interpreter`. Include the whole family, or accept that
those links show "This page is not part of this demo".

## Where to look things up

- What a page or component accepts and emits: its story in Storybook (`Pages` for the nine current pages; `Organisms`, `Features/...`:
  Controls and Actions), the JSDoc above the component in `src/design/**`, and the exports of
  `src/design/index.js`.
- What content looks like: the default constants in `src/design/content.js` and `src/design/demo/content/*.js`
  (all re-exported by `marketing-hub/demo`).
- A page built without the demo hooks, from its own state, using only public exports: `examples/consumer/` (Business
  Term, and a Cockpit with two independent assistants). Use this when a demo needs behaviour the hooks do not have.
