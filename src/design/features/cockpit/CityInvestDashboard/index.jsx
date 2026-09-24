import "../../../tokens.css";
import React from "react";
import { cx } from "../../../cx.js";
import { fmtAfter, pickTicks, selectionLabel, storeOptionsFor, storeScopeSuffix, totalLabel } from "../../../report-logic.js";
import "./CityInvestDashboard.css";


/* -------------------------------------------------------------------------
 * City-invest analysis embed — the live report view rendered when a report
 * carries `embed: "city-invest"`. All data arrives via props; the seeded
 * scenario generator lives in demo/report-demo.js.
 * ---------------------------------------------------------------------- */

function ScFilterDropdown({ label, options, selected, multi = false, suffix = "", copy, open = false, onToggle, onChange }) {
  const name = React.useId();
  const text = multi ? selectionLabel(selected, options.length, copy) : selected[0];
  const pick = (option, checked) => {
    if (multi) {
      onChange?.(checked ? [...selected, option] : selected.filter((item) => item !== option));
    } else {
      onChange?.([option]);
    }
  };
  return (
    <div className="mh-sc-fitem">
      <span className="mh-sc-flabel">{label}</span>
      <span
        className={cx("mh-sc-fval", open && "is-open")}
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            onToggle?.();
          }
        }}
      >
        <span className="mh-sc-fval__txt">
          {text}
          {suffix ? " " + suffix : ""}
        </span>
        <span className="mh-sc-panel" role="listbox" onClick={(event) => event.stopPropagation()}>
          {multi ? (
            <span className="mh-sc-phead">
              <span className="mh-sc-phead__label">{copy.multiSelect}</span>
              <span>
                <button type="button" onClick={() => onChange?.(options.slice())}>
                  {copy.selectAll}
                </button>{" "}
                ·{" "}
                <button type="button" onClick={() => onChange?.([])}>
                  {copy.clear}
                </button>
              </span>
            </span>
          ) : null}
          {options.map((option) => (
            <label className="mh-sc-prow" key={option}>
              <input
                type={multi ? "checkbox" : "radio"}
                name={name}
                value={option}
                checked={selected.includes(option)}
                onChange={(event) => pick(option, event.target.checked)}
              />
              <span>{option}</span>
            </label>
          ))}
        </span>
      </span>
    </div>
  );
}

const SC_CHART_W = 440;
const SC_CHART_H = 150;
const SC_PAD_L = 42;
const SC_PAD_R = 16;
const SC_PAD_T = 10;
const SC_PAD_B = 30;

function ScTrendChart({ name, data, endIdx, decimals = 0, periods, startIndex, copy, totalLabel }) {
  const chartRef = React.useRef(null);
  const tipRef = React.useRef(null);
  const [tipWidth, setTipWidth] = React.useState(0);
  const [hover, setHover] = React.useState(null);
  const s = Math.min(startIndex, endIdx);
  const labels = periods.slice(s, endIdx + 1);
  const t = data.t.slice(s, endIdx + 1);
  const n = data.n.slice(s, endIdx + 1);
  const all = t.concat(n);
  let min = Math.min(...all);
  let max = Math.max(...all);
  const span = max - min || 1;
  min -= span * 0.12;
  max += span * 0.12;
  const X = (i) => SC_PAD_L + (SC_CHART_W - SC_PAD_L - SC_PAD_R) * (i / (labels.length - 1));
  const Y = (v) => SC_PAD_T + (SC_CHART_H - SC_PAD_T - SC_PAD_B) * (1 - (v - min) / (max - min));
  const ticks = new Set(pickTicks(labels.length));
  const grid = [0, 1, 2, 3].map((g) => min + ((max - min) * g) / 3);
  const points = (arr) => arr.map((v, i) => X(i).toFixed(1) + "," + Y(v).toFixed(1)).join(" ");
  React.useEffect(() => {
    setHover(null);
  }, [data, endIdx]);
  /* A hover recorded against a previous `data`/`endIdx` is dropped at render
     time (the original destroys the tooltip DOM on rebuild), so no stale frame
     ever paints; `hi` also clamps as a belt-and-braces index guard. */
  const liveHover = hover && hover.data === data && hover.endIdx === endIdx ? hover : null;
  const hi = liveHover ? Math.min(liveHover.index, labels.length - 1) : 0;
  React.useLayoutEffect(() => {
    if (liveHover && tipRef.current) {
      const width = tipRef.current.offsetWidth;
      if (width !== tipWidth) setTipWidth(width);
    }
  }, [liveHover, tipWidth]);
  const onMove = (event) => {
    if (labels.length < 2) return;
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    if (!rect.width) return;
    const lx = (event.clientX - rect.left) * (SC_CHART_W / rect.width);
    let best = 0;
    let bd = Infinity;
    for (let i = 0; i < labels.length; i++) {
      const dx = Math.abs(X(i) - lx);
      if (dx < bd) {
        bd = dx;
        best = i;
      }
    }
    const host = chartRef.current?.getBoundingClientRect();
    setHover({
      index: best,
      x: event.clientX - (host?.left || 0) + 14,
      y: event.clientY - (host?.top || 0) + 10,
      hostWidth: host?.width || 0,
      data,
      endIdx,
    });
  };
  const tipLeft = liveHover && tipWidth && liveHover.x + tipWidth > liveHover.hostWidth ? liveHover.x - tipWidth - 28 : liveHover?.x;
  return (
    <div className="mh-sc-chart" ref={chartRef}>
      <div className="mh-sc-chart__head">
        <span className="mh-sc-chart__name">{name}</span>
        <span className="mh-sc-chart__legend">
          <span>
            <i style={{ background: "#333" }} />
            {totalLabel}
          </span>
          <span>
            <i style={{ background: "#c9a876" }} />
            {copy.nonInvestAvg}
          </span>
        </span>
      </div>
      <svg
        viewBox={`0 0 ${SC_CHART_W} ${SC_CHART_H}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <rect x="0" y="0" width={SC_CHART_W} height={SC_CHART_H} fill="transparent" pointerEvents="all" />
        {grid.map((val, g) => (
          <line key={g} x1={SC_PAD_L} y1={Y(val)} x2={SC_CHART_W - SC_PAD_R} y2={Y(val)} stroke="#eef0f3" strokeWidth="1" />
        ))}
        {grid.map((val, g) => (
          <text key={"y" + g} x={SC_PAD_L - 6} y={Y(val) + 3} textAnchor="end" fontSize="9" fill="#aab0b8">
            {val.toFixed(decimals)}
          </text>
        ))}
        {labels.map((cat, i) =>
          /* A single-period range makes X() a 0/0 division — the original emits
             NaN attributes the browser rejects (and logs console errors for);
             skip those elements so nothing NaN reaches the DOM. */
          ticks.has(i) && labels.length > 1 ? (
            <text key={cat} x={X(i)} y={SC_CHART_H - 12} textAnchor="middle" fontSize="8" fill="#aab0b8">
              {cat}
            </text>
          ) : null
        )}
        {labels.length > 1 ? (
          <React.Fragment>
            <polyline points={points(n)} fill="none" stroke="#c9a876" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={points(t)} fill="none" stroke="#333333" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
          </React.Fragment>
        ) : null}
        {liveHover ? (
          <g>
            <line
              x1={X(hi).toFixed(1)}
              y1={SC_PAD_T}
              x2={X(hi).toFixed(1)}
              y2={SC_CHART_H - SC_PAD_B}
              stroke="#9aa0a8"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
            <circle cx={X(hi).toFixed(1)} cy={Y(t[hi]).toFixed(1)} r="3.2" fill="#333" stroke="#fff" strokeWidth="1" />
            <circle cx={X(hi).toFixed(1)} cy={Y(n[hi]).toFixed(1)} r="3.2" fill="#c9a876" stroke="#fff" strokeWidth="1" />
          </g>
        ) : null}
      </svg>
      {liveHover ? (
        <div className="mh-sc-tip" ref={tipRef} style={{ left: tipLeft, top: liveHover.y }}>
          <b>{labels[hi]}</b>
          <br />
          <span>● {totalLabel}: {t[hi].toFixed(decimals)}</span>
          <br />
          <span>● {copy.nonInvest}: {n[hi].toFixed(decimals)}</span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * City-invest analysis embed. Filter state (end period, channel, pilot,
 * multi-select cities and cascading stores) stays local and uncontrolled —
 * seeded from `defaultFilters`, every change regenerates the scenario via
 * `getScenario(filters)` and briefly dims the canvas, matching
 * `initCityInvestDashboard`. All data and visible copy arrive via props.
 * @param {object} props
 * @param {object} props.copy every visible label (title, footnote, basePeriod,
 *   investStart, formula, trendHeading + filter/KPI/chart labels)
 * @param {string[]} props.periods period axis labels
 * @param {number} props.startIndex index of the invest-start period
 * @param {{ end: string[], channel: string[], pilot: string[], cities: string[], cityStores: Record<string, string[]> }} props.options
 * @param {Array<object>} props.kpis KPI meta rows (key/name/uplift/var/trend/baseAfter/fmt/dec)
 * @param {string[][]} props.kpiRows KPI key grid layout
 * @param {string[]} props.charts trend-chart order (baseline keys)
 * @param {object} props.defaultFilters initial filter values
 * @param {(filters: { end: string, channel: string, pilot: string, city: string[], store: string[] }) => object} props.getScenario deterministic scenario source
 * @param {(filters: { end: string, channel: string, pilot: string, cities: string[], stores: string[] }) => void} [props.onFiltersChange]
 */
export function CityInvestDashboard({ copy, periods, startIndex, options, kpis, kpiRows, charts, defaultFilters, getScenario, onFiltersChange }) {
  const [end, setEnd] = React.useState(defaultFilters.end);
  const [channel, setChannel] = React.useState(defaultFilters.channel);
  const [pilot, setPilot] = React.useState(defaultFilters.pilot);
  const [cities, setCities] = React.useState(defaultFilters.cities);
  const [stores, setStores] = React.useState(defaultFilters.stores);
  const [openFilter, setOpenFilter] = React.useState(null);
  const [dim, setDim] = React.useState(false);

  const storeOptions = storeOptionsFor(options.cityStores, cities);
  const total = totalLabel(cities, options.cities, copy);
  const scenario = React.useMemo(
    () => getScenario({ end, channel, pilot, city: cities, store: stores }),
    [getScenario, end, channel, pilot, cities, stores]
  );

  React.useEffect(() => {
    if (!openFilter) return undefined;
    const close = () => setOpenFilter(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openFilter]);

  React.useEffect(() => {
    if (!dim) return undefined;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setDim(false)));
    return () => cancelAnimationFrame(raf);
  }, [dim]);

  const commit = (patch) => {
    const next = {
      end: patch.end ?? end,
      channel: patch.channel ?? channel,
      pilot: patch.pilot ?? pilot,
      cities: patch.cities ?? cities,
      stores: patch.stores ?? stores,
    };
    setEnd(next.end);
    setChannel(next.channel);
    setPilot(next.pilot);
    setCities(next.cities);
    setStores(next.stores);
    setDim(true);
    onFiltersChange?.(next);
  };

  const toggleFilter = (key) => setOpenFilter((current) => (current === key ? null : key));

  return (
    <div className="mh-sixcity">
      <div className="mh-sc-canvas" style={{ opacity: dim ? 0.55 : 1 }}>
        <div className="mh-sc-titlebar">
          <p className="mh-sc-title">{copy.title}</p>
          <div className="mh-sc-footnotes">
            <p className="mh-sc-footnote">{copy.footnote}</p>
          </div>
        </div>
        <div className="mh-sc-filters">
          <div className="mh-sc-fitem">
            <span className="mh-sc-flabel">{copy.labelBasePeriod}</span>
            <span className="mh-sc-fstatic">{copy.basePeriod}</span>
          </div>
          <div className="mh-sc-fitem">
            <span className="mh-sc-flabel">{copy.labelInvestStart}</span>
            <span className="mh-sc-fstatic">{copy.investStart}</span>
          </div>
          <ScFilterDropdown
            label={copy.labelInvestEnd}
            options={options.end}
            selected={[end]}
            copy={copy}
            open={openFilter === "end"}
            onToggle={() => toggleFilter("end")}
            onChange={(value) => commit({ end: value[0] })}
          />
          <ScFilterDropdown
            label={copy.labelChannel}
            options={options.channel}
            selected={[channel]}
            copy={copy}
            open={openFilter === "channel"}
            onToggle={() => toggleFilter("channel")}
            onChange={(value) => commit({ channel: value[0] })}
          />
          <ScFilterDropdown
            label={copy.labelPilot}
            options={options.pilot}
            selected={[pilot]}
            copy={copy}
            open={openFilter === "pilot"}
            onToggle={() => toggleFilter("pilot")}
            onChange={(value) => commit({ pilot: value[0] })}
          />
          <ScFilterDropdown
            label={copy.labelCity}
            options={options.cities}
            selected={cities}
            multi
            copy={copy}
            open={openFilter === "city"}
            onToggle={() => toggleFilter("city")}
            onChange={(value) => commit({ cities: value, stores: storeOptionsFor(options.cityStores, value) })}
          />
          <ScFilterDropdown
            label={copy.labelStore}
            options={storeOptions}
            selected={stores.filter((store) => storeOptions.includes(store))}
            multi
            suffix={storeScopeSuffix(cities, copy)}
            copy={copy}
            open={openFilter === "store"}
            onToggle={() => toggleFilter("store")}
            onChange={(value) => commit({ stores: value })}
          />
        </div>
        {kpiRows.map((row, rowIndex) => (
          <div className="mh-sc-kpi-grid" key={rowIndex} style={rowIndex > 0 ? { marginTop: 10 } : undefined}>
            {row.map((key) => {
              const meta = kpis.find((item) => item.key === key);
              const value = scenario.kpi[key];
              if (meta.uplift === null) {
                return (
                  <div className="mh-sc-kpi is-plain" key={key}>
                    <div className="mh-sc-kpi__top">
                      <span className="mh-sc-kpi__name">{meta.name}</span>
                    </div>
                    <div className="mh-sc-kpi__uplift">{fmtAfter(meta, value.after)}</div>
                  </div>
                );
              }
              const up = value.uplift;
              return (
                <div className="mh-sc-kpi" key={key}>
                  <div className="mh-sc-kpi__top">
                    <span className="mh-sc-kpi__name">{meta.name}</span>
                  </div>
                  <div className="mh-sc-kpi__uplift-label">{copy.uplift}</div>
                  <div className={cx("mh-sc-kpi__uplift", up >= 0 ? "is-pos" : "is-neg")}>
                    {up > 0 ? "+" : ""}
                    {up}%<span className="mh-sc-kpi__arrow">{up >= 0 ? "▲" : "▼"}</span>
                  </div>
                  <div className="mh-sc-kpi__row2">
                    <span className="mh-sc-kpi__var">
                      {copy.varPct} {value.vari > 0 ? "+" : ""}
                      {value.vari}%
                    </span>
                    <span className="mh-sc-kpi__after">
                      {copy.after} <b>{fmtAfter(meta, value.after)}</b>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div className="mh-sc-kpi-legend">
          <span className="mh-sc-formula">{copy.formula}</span>
        </div>
        <div className="mh-sc-sec-title">{total} {copy.trendHeading}</div>
        <div className="mh-sc-chart-grid">
          {charts.map((name) => (
            <ScTrendChart
              key={name}
              name={name}
              data={scenario.trends[name]}
              endIdx={scenario.endIdx}
              decimals={name === "UPT" ? 2 : 0}
              periods={periods}
              startIndex={startIndex}
              copy={copy}
              totalLabel={total}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
