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
    copy: { control: false, description: bi("Visible labels for the title, filters, KPIs, and charts.", "标题、筛选、KPI 和图表上的可见标签。") },
    periods: { control: false, description: bi("Period axis labels.", "周期轴上的标签。") },
    options: { control: false, description: bi("Filter option lists for end period, channel, pilot, cities, and stores.", "结束周期、渠道、试点、城市和门店的筛选项。") },
    kpis: { control: false, description: bi("KPI meta rows.", "KPI 元数据行。") },
    kpiRows: { control: false, description: bi("KPI key grid layout.", "KPI 键的网格布局。") },
    charts: { control: false, description: bi("Trend chart order.", "趋势图顺序。") },
    endIndex: { control: false, description: bi("Period index map used by `getScenario`. The dashboard component does not read this prop.", "`getScenario` 使用的周期索引表。仪表板组件不读取这个 prop。") },
    defaultFilters: { control: false, description: bi("First filter values.", "初始筛选值。") },
    onFiltersChange: { action: "onFiltersChange", description: bi("The function runs after each filter change. The result has `end`, `channel`, `pilot`, `cities`, and `stores`.", "每次筛选变化后都会调用这个函数。结果里有 `end`、`channel`、`pilot`、`cities` 和 `stores`。") },
  },
  render: (args) => (
    <div style={{ minHeight: 640, background: "#f3f5f7", padding: "0 0 40px" }}>
      <CityInvestDashboard {...args} getScenario={cityInvestScenarioSource(CITY_INVEST)} onFiltersChange={args.onFiltersChange} />
    </div>
  ),
};

export const Default = {};
