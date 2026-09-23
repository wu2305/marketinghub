import "./tokens.css";

const colors = [
  ["Ink", "var(--mh-ink)"],
  ["Copy", "var(--mh-copy)"],
  ["Muted", "var(--mh-muted)"],
  ["Line", "var(--mh-line)"],
  ["Gold", "var(--mh-gold)"],
  ["Green", "var(--mh-green)"],
  ["Blue", "var(--mh-blue)"],
  ["Red", "var(--mh-red)"],
];

export default { title: "Foundations", tags: ["autodocs"] };

export const Tokens = {
  name: "Color and type",
  render: () => (
    <div style={{ display: "grid", gap: 28, fontFamily: "var(--mh-font)" }}>
      <div>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>TYPE</p>
        <h1 style={{ margin: "8px 0 0", fontFamily: "var(--mh-display)", fontStyle: "italic", fontWeight: 600, fontSize: 56 }}>
          Marketing Portal
        </h1>
        <p style={{ maxWidth: 480, color: "var(--mh-copy)" }}>DIN 2014 for interface text. BentonMod Display for editorial titles.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 140px)", gap: 12 }}>
        {colors.map(([name, value]) => (
          <div key={name}>
            <div style={{ height: 64, borderRadius: 8, background: value, border: "1px solid var(--mh-line)" }} />
            <strong style={{ display: "block", marginTop: 8, fontSize: 12 }}>{name}</strong>
          </div>
        ))}
      </div>
    </div>
  ),
};
