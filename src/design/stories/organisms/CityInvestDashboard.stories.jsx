import { CityInvestDashboard } from "../../organisms.jsx";
import { CITY_INVEST } from "../../demo/report-fixtures.js";
import { cityInvestScenarioSource } from "../../demo/report-demo.js";

/* CityInvestDashboard arg data: the component never reads `baseline` — only the
   getScenario source built from it does. */
const { baseline: _baseline, ...CITY_INVEST_VIEW } = CITY_INVEST;

export default {
  title: "Organisms/Six-city invest analysis",
  component: CityInvestDashboard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "City-invest analysis embed. Filter state stays local and uncontrolled — seeded from `defaultFilters`, every change regenerates the scenario via `getScenario(filters)` and briefly dims the canvas, matching `initCityInvestDashboard`. All data and visible copy arrive via props.",
      },
    },
  },
  args: { ...CITY_INVEST_VIEW },
  argTypes: {
    copy: { control: false },
    periods: { control: false },
    options: { control: false },
    kpis: { control: false },
    kpiRows: { control: false },
    charts: { control: false },
    endIndex: { control: false },
    defaultFilters: { control: false },
    onFiltersChange: { action: "onFiltersChange" },
  },
  render: (args) => (
    <div style={{ minHeight: 640, background: "#f3f5f7", padding: "0 0 40px" }}>
      <CityInvestDashboard {...args} getScenario={cityInvestScenarioSource(CITY_INVEST)} onFiltersChange={args.onFiltersChange} />
    </div>
  ),
};

export const Default = {};
