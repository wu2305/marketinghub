import "../../tokens.css";
import React from "react";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { FormField } from "../../components/FormField/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Tabs } from "../../components/Tabs/index.jsx";
import { normalizeOptions } from "../../lib/options.js";
import { Icon } from "../../icons.jsx";
import { Shell } from "../../pages/Shell/index.jsx";
import "./MediaTrackingDetailPage.css";

export const mediaTrackingPeriods = ["daily", "weekly", "monthly", "spot"];


/**
 * Media Tracking Detail report page (media-tracking-detail.html): back link,
 * page head, Daily/Weekly/Monthly/Spot Info Mapping period tabs, a 15-field
 * filter grid, the dimension-notes paragraph, and a wide scrollable data
 * table. The assistant is the lite drawer variant (scope row, skill "+"
 * trigger, simple answer cards, "Recent Chats" popover).
 * @param {object} props
 * @param {string} [props.current] Nav id for aria-current. This page marks Self-Service Center. // 用于 aria-current 的导航 id。本页将 Self-Service Center 标为当前。
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {Array<object>} [props.navigation=[]] Header links. // 页头链接。
 * @param {{ backHref?: string, backLabel: string }} [props.toolbar={}] Back destination and visible label. // 返回目的地和可见文字。
 * @param {{ periodAria: string, filtersAria: string, tableAria: string }} props.labels Accessible names for page controls and regions. // 页面控件与区域的无障碍名称。
 * @param {{ eyebrow: string, title: string }} [props.head={}] Page heading copy. // 页面标题文案。
 * @param {Array<{ id: string, label: string }>} [props.periods=[]] Period tabs. Values are daily, weekly, monthly, and spot. // 周期标签。取值是 daily、weekly、monthly 和 spot。
 * @param {typeof mediaTrackingPeriods[number]} [props.period="monthly"] Active report period. // 当前报表周期。
 * @param {Array<{ name: string, label: string, required?: boolean, options?: Array<string|object>, placeholder?: string, defaultValue?: string }>} [props.filters=[]] Filter fields. // 筛选字段。
 * @param {Array<{ term: string, text: string }>} [props.notes=[]] Dimension notes under the filters. // 筛选下方的维度说明。
 * @param {{ title?: string, count?: string, columns?: Array<{ key: string, header: string }>, rows?: Array<object> }} [props.table={}] Report table. // 报表表格。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState} [props.assistant={}] Lite assistant copy, state, and callbacks. `skillMenu` and `selectedSkill` pass through. // 轻量助手的文案、状态和回调。`skillMenu` 和 `selectedSkill` 会透传。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model dialog props. The dialog shows when `skillFlow.step` is set. // 建模对话框的 props。设置了 `skillFlow.step` 时显示对话框。
 * @param {(target: { href: string, id?: string, label?: string }) => void} [props.onNavigate] The function runs when Back or a nav link opens another page. The result has `href`. // Back 或导航要打开另一页时，会调用这个函数。结果里有 `href`。
 * @param {(event: { id: string, label: string }) => void} [props.onPeriodChange] The function runs when the user selects a period tab. The result has `id` and `label`. // 用户选择周期标签时，会调用这个函数。结果里有 `id` 和 `label`。
 * @param {(event: { name: string, value: string }) => void} [props.onFilterChange] The function runs at each filter change. The result has `name` and `value`. // 每个筛选每次变化都会调用这个函数。结果里有 `name` 和 `value`。
 */
export function MediaTrackingDetailPage({
  current,
  logo,
  navigation = [],
  toolbar = {},
  labels,
  head = {},
  periods = [],
  period = "monthly",
  filters = [],
  notes = [],
  table = {},
  assistant = {},
  skillFlow,
  onNavigate,
  onPeriodChange,
  onFilterChange,
}) {
  return (
    <Shell tone="tracking">
      <Header logo={logo} items={navigation} current={current} highlightCurrent={false} onNavigate={onNavigate} />
      <main className="mh-tracking">
        <div className="mh-tracking__topbar">
          <a className="mh-tracking__back" href={toolbar.backHref || "#"} onClick={() => onNavigate?.({ href: toolbar.backHref })}>
            <Icon name="arrow-left" />
            <span>{toolbar.backLabel}</span>
          </a>
        </div>
        <header className="mh-tracking__head">
          <span className="mh-tracking__eyebrow">{head.eyebrow}</span>
          <h1>{head.title}</h1>
        </header>
        <Tabs label={labels.periodAria} items={periods} value={period} onChange={onPeriodChange} />
        <section className="mh-tracking__filters" aria-label={labels.filtersAria}>
          {filters.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              name={field.name}
              required={field.required}
              control="select"
              options={field.options || []}
              placeholder={field.placeholder}
              defaultValue={field.defaultValue ?? normalizeOptions(field.options)[0]?.value}
              onChange={onFilterChange}
            />
          ))}
        </section>
        <p className="mh-tracking__description">
          {notes.map((note, index) => (
            <React.Fragment key={note.term}>
              {index > 0 ? " " : null}
              <strong>{note.term}</strong>: {note.text}
            </React.Fragment>
          ))}
        </p>
        <section className="mh-tracking__table-wrap" aria-label={labels.tableAria}>
          <header className="mh-tracking__table-head">
            <h2>{table.title}</h2>
            <span className="mh-tracking__count">
              {table.count}
              <Icon name="chevron-down" />
            </span>
          </header>
          <div className="mh-tracking__scroll">
            <table className="mh-tracking__table">
              <thead>
                <tr>
                  {(table.columns || []).map((column) => (
                    <th key={column.key}>{column.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(table.rows || []).map((row, index) => (
                  <tr key={index}>
                    {(table.columns || []).map((column) => (
                      <td key={column.key}>{row[column.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <AssistantDock assistant={assistant} skillFlow={skillFlow} variant="lite" />
    </Shell>
  );
}
