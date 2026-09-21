import React from "react";

const navItems = [
  { id: "home", label: "Home", href: "/original/index.html" },
  { id: "cockpit", label: "Marketing Cockpit", href: "/original/assets/pages/reports.html" },
  { id: "self", label: "Self-Service Center", href: "/original/assets/pages/flexible.html" },
  { id: "knowledge", label: "AI Interpreter", href: "/original/assets/pages/knowledge.html" },
  { id: "campaign", label: "RedNote Campaign Tool", href: "/original/assets/pages/campaign.html" },
];

export function SiteHeader({ current = "Home" }) {
  return (
    <header className="site-header">
      <nav className="primary-nav" aria-label="Marketing Portal navigation">
        <a href="/original/index.html" className="brand-mark" aria-label="Tapestry Marketing Portal home">
          <img src="/assets/images/tapestry-logo.png" alt="Tapestry" />
        </a>
        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="nav-link"
              aria-current={item.label === current ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
