import React from "react";

const colors = [
  ["--v4-bg", "Workspace"],
  ["--v4-surface", "Surface"],
  ["--v4-ink", "Ink"],
  ["--v4-copy", "Copy"],
  ["--v4-muted", "Muted"],
  ["--v4-line", "Line"],
  ["--v4-yellow", "Gold"],
  ["--v4-teal", "Teal"],
  ["--v4-blue", "Blue"],
  ["--v4-red", "Coach red"],
  ["--v4-green", "Green"],
  ["--gold", "Brand gold"],
];

export function Tokens() {
  return (
    <main className="experience-shell" style={{ padding: 48 }}>
      <header className="home-section-heading">
        <div>
          <span>FOUNDATIONS</span>
          <h2>Portal tokens</h2>
        </div>
        <p>Colors and type come from the existing foundation and theme stylesheets.</p>
      </header>
      <div className="home-signal-grid">
        {colors.map(([token, label]) => (
          <article className="home-signal" key={token}>
            <div className="home-signal-body">
              <span>{label}</span>
              <strong style={{ background: `var(${token})`, color: "transparent" }}>{token}</strong>
              <small>{token}</small>
            </div>
          </article>
        ))}
      </div>
      <section style={{ marginTop: 28 }}>
        <p className="eyebrow">DIN 2014</p>
        <h1 style={{ fontFamily: "var(--font-ui)", fontSize: 56, margin: "8px 0" }}>Marketing Portal</h1>
        <p style={{ fontFamily: "var(--font-copy)", fontSize: 22, maxWidth: 640 }}>
          Grey-white workspace, black and gold actions, and compact 6–8px control radius.
        </p>
      </section>
    </main>
  );
}
