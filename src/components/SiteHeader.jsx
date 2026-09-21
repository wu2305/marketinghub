import React from "react";
import { navItems } from "../data/catalog.js";

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
