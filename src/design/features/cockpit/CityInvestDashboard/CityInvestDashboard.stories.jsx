import { CityInvestDashboard } from "./index.jsx";
import { CITY_INVEST } from "../../../demo/report-fixtures.js";
import { cityInvestScenarioSource } from "../../../demo/report-demo.js";
import { bi } from "../../../lib/story-helpers.js";

/* CityInvestDashboard arg data: the component never reads `baseline` — only the
   getScenario source built from it does. */
const { baseline: _baseline, ...CITY_INVEST_VIEW } = CITY_INVEST;

export default {
  title: "Features/Cockpit/Six-city invest analysis",
  component: CityInvestDashboard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("This component is the City Invest analysis on Marketing Cockpit. The user can change the end period, channel, pilot cities, and stores. Filter state stays inside the component. Set `defaultFilters` for the first values. After each change, the component calls `getScenario` with the filters. The canvas dims for a short time. All labels and data come from props. The function `onFiltersChange` runs after each change.", "这是 Marketing Cockpit 上的 City Invest 分析。用户可以改结束周期、渠道、试点城市和门店。筛选状态留在组件内部。用 `defaultFilters` 设置初始值。每次变化后，组件用这些筛选调用 `getScenario`。画布会短暂变淡。所有标签和数据都来自 props。每次变化都会调用 `onFiltersChange`。"),
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
