import "./tokens.css";
import { bi } from "./lib/story-helpers.js";

// Role tokens from handover/design-intent/foundations.md §3.
const colorGroups = [
  ["Text", ["text-strong", "text", "text-muted", "text-faint", "text-inverse", "text-inverse-muted"]],
  ["Surface", ["surface-page", "surface", "surface-subtle", "surface-muted", "surface-inverse", "scrim"]],
  ["Line", ["line-subtle", "line", "line-strong", "line-inverse"]],
  ["Accent", ["accent-soft", "accent", "accent-ink", "accent-wash", "accent-fill"]],
  ["Status", ["success", "warning", "danger", "info"]],
  ["Data", ["data-teal", "data-violet", "data-rose"]],
];
const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "display"];
const weights = ["light", "regular", "bold"];
const radii = ["sm", "md", "lg", "pill"];
const shadows = ["raised", "overlay", "modal"];
const spaces = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const label = { margin: "0 0 12px", fontSize: "var(--mh-font-size-xs)", fontWeight: "var(--mh-font-weight-bold)", letterSpacing: "0.08em", color: "var(--mh-text-faint)" };
const caption = { display: "block", marginTop: 6, fontSize: "var(--mh-font-size-sm)", color: "var(--mh-text-muted)" };
const page = { display: "grid", gap: 32, fontFamily: "var(--mh-font-sans)", color: "var(--mh-text)", background: "var(--mh-surface-page)", padding: 24 };

export default {
  title: "Foundations",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("These values are the colors, type, spaces, corner radii, and shadows for all components. Body text uses DIN 2014. Titles use BentonMod Display. The words \"Marketing Portal\" are an example of a product name. They are not the name of a token.", "这些是整个组件库共用的颜色、字体、间距、圆角和阴影。正文用 DIN 2014，大标题用 BentonMod Display。页面上的 \"Marketing Portal\" 只是示例里的产品名，不是某个 token 的名字。"),
      },
    },
  },
};

export const Tokens = {
  name: "Color and type",
  render: () => (
    <div style={page}>
      <div>
        <p style={label}>TYPE</p>
        <h1 style={{ margin: 0, fontFamily: "var(--mh-font-display)", fontStyle: "italic", fontWeight: 600, fontSize: "var(--mh-font-size-display)", color: "var(--mh-text-strong)" }}>
          Marketing Portal
        </h1>
        <p style={{ maxWidth: 480 }}>DIN 2014 for interface text. BentonMod Display for editorial titles.</p>
      </div>
      {colorGroups.map(([group, names]) => (
        <section key={group}>
          <p style={label}>{group.toUpperCase()}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {names.map((name) => (
              <div key={name} style={{ width: 132 }}>
                <div style={{ height: 56, borderRadius: "var(--mh-radius-md)", background: `var(--mh-${name})`, border: "1px solid var(--mh-line)" }} />
                <span style={caption}>--mh-{name}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

export const Scales = {
  name: "Type, shape, depth and space",
  render: () => (
    <div style={page}>
      <section>
        <p style={label}>FONT SIZE</p>
        {sizes.map((size) => (
          <p key={size} style={{ margin: "0 0 8px", fontSize: `var(--mh-font-size-${size})`, color: "var(--mh-text-strong)" }}>
            {size} — Governed knowledge
          </p>
        ))}
      </section>
      <section>
        <p style={label}>FONT WEIGHT</p>
        {weights.map((weight) => (
          <p key={weight} style={{ margin: "0 0 8px", fontSize: "var(--mh-font-size-xl)", fontWeight: `var(--mh-font-weight-${weight})` }}>
            {weight} — Governed knowledge
          </p>
        ))}
      </section>
      <section>
        <p style={label}>RADIUS AND SHADOW</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {radii.map((radius) => (
            <div key={radius}>
              <div style={{ width: 96, height: 56, background: "var(--mh-surface)", border: "1px solid var(--mh-line)", borderRadius: `var(--mh-radius-${radius})` }} />
              <span style={caption}>radius-{radius}</span>
            </div>
          ))}
          {shadows.map((shadow) => (
            <div key={shadow}>
              <div style={{ width: 96, height: 56, background: "var(--mh-surface)", borderRadius: "var(--mh-radius-md)", boxShadow: `var(--mh-shadow-${shadow})` }} />
              <span style={caption}>shadow-{shadow}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <p style={label}>SPACE</p>
        {spaces.map((step) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ width: 96, fontSize: "var(--mh-font-size-sm)" }}>space-{step}</span>
            <div style={{ height: 12, width: `var(--mh-space-${step})`, background: "var(--mh-accent)" }} />
          </div>
        ))}
      </section>
    </div>
  ),
};
