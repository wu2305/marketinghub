import "../../../tokens.css";
import "./LiveOverview.css";


const DEFAULT_COPY = {
  performanceEyebrow: "PERFORMANCE",
  performanceTitle: "Current period versus baseline",
  performanceLegend: "Primary / comparison",
  priorityEyebrow: "PRIORITY",
  priorityTitle: "Leading views",
  priorityColumn: "Index",
};

/**
 * Generic live overview: KPI cards, primary/comparison bar chart, and the
 * "Leading views" rank list (first five chart rows, original chart order).
 * @param {object} props
 * @param {Array<[string, string, string]>} [props.metrics=[]] [name, value, delta]
 * @param {Array<[string, number, number]>} [props.chart=[]] [label, primary, comparison]
 * @param {string} [props.accent] project accent color for rank bars
 * @param {Partial<typeof DEFAULT_COPY>} [props.copy] card eyebrows, titles and column heads
 */
export function LiveOverview({ metrics = [], chart = [], accent, copy: copyProp }) {
  const copy = { ...DEFAULT_COPY, ...copyProp };
  return (
    <div className="mh-live-dashboard">
      <div className="mh-live-kpis">
        {metrics.map((metric) => (
          <article className="mh-live-kpi" key={metric[0]}>
            <span>{metric[0]}</span>
            <strong>{metric[1]}</strong>
            <small>{metric[2]}</small>
          </article>
        ))}
      </div>
      <div className="mh-live-grid">
        <section className="mh-live-card">
          <header className="mh-live-card__head">
            <div>
              <span>{copy.performanceEyebrow}</span>
              <h2>{copy.performanceTitle}</h2>
            </div>
            <span>{copy.performanceLegend}</span>
          </header>
          <div className="mh-live-chart">
            {chart.map((item) => (
              <div className="mh-live-chart__group" key={item[0]}>
                <i style={{ height: item[1] + "%" }} />
                <b style={{ height: item[2] + "%" }} />
                <span>{item[0]}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="mh-live-card">
          <header className="mh-live-card__head">
            <div>
              <span>{copy.priorityEyebrow}</span>
              <h2>{copy.priorityTitle}</h2>
            </div>
            <span>{copy.priorityColumn}</span>
          </header>
          <div className="mh-live-ranks">
            {chart.slice(0, 5).map((item, index) => (
              <div className="mh-live-rank" key={item[0]}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{item[0]}</strong>
                  <i style={{ width: item[1] + "%", background: accent }} />
                </div>
                <b>{item[1]}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
