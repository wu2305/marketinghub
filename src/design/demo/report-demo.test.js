import { describe, expect, it } from "vitest";
import { CITY_INVEST } from "./report-fixtures.js";
import { generateCityInvestScenario } from "./report-demo.js";
import { selectionLabel, totalLabel } from "../report-logic.js";

describe("city-invest filter behavior", () => {
  it("uses the supplied baseline for the complete default filter set", () => {
    const filters = CITY_INVEST.defaultFilters;
    const scenario = generateCityInvestScenario(CITY_INVEST, {
      end: filters.end,
      channel: filters.channel,
      pilot: filters.pilot,
      city: [...filters.cities].reverse(),
      store: [...filters.stores].reverse(),
    });
    expect(scenario.isDefault).toBe(true);
    expect(scenario.trends).toEqual(CITY_INVEST.baseline);
    expect(scenario.kpi.ADT).toEqual({ uplift: 10, vari: 116, after: 0.4 });

    const changed = generateCityInvestScenario(CITY_INVEST, { ...filters, city: filters.cities.slice(1), store: filters.stores });
    expect(changed.isDefault).toBe(false);
  });

  it("labels city and store selection independently, including an empty city scope", () => {
    const { copy, options } = CITY_INVEST;
    expect(selectionLabel(options.cities, options.cities.length, copy, copy.total)).toBe("Total");
    expect(selectionLabel(CITY_INVEST.defaultFilters.stores, CITY_INVEST.defaultFilters.stores.length, copy)).toBe("All Stores");
    expect(totalLabel([], options.cities, copy)).toBe("(None)");
  });
});
