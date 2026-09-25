import React from "react";

/** Registered icon names — the values `Icon`'s `name` prop accepts. */
export const knowledgeActionIconPaths = {
  edit: "M12 20H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L12 14l-4 1 1-4 7.5-7.5z",
  delete: "M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5",
  disable: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M6 6l12 12",
};

export const iconNames = [
  "search",
  "plus",
  "home",
  "history",
  "expand",
  "spark",
  "layers",
  "thumb-up",
  "thumb-down",
  "file",
  "eye",
  "download",
  "upload",
  "file-upload",
  "chevron-down",
  "arrow-left",
  "copy",
  "chat",
  "pen",
  "pin",
  "spokes",
  "cart",
  "tag",
  "chart",
  "store",
  "trend",
  "bulb",
];

/**
 * Inline SVG icon (24×24, currentColor stroke). `path` renders raw SVG path
 * data and takes precedence over `name`; unknown names render nothing.
 * @param {object} props
 * @param {typeof iconNames[number]} [props.name] registered icon name
 * @param {string} [props.path] raw SVG path data for one-off icons
 * @param {string} [props.className]
 */
export function Icon({ name, path, className }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className,
  };
  if (path) {
    return (
      <svg {...common} strokeWidth="1.6">
        <path d={path} />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    );
  }
  if (name === "plus") {
    return (
      <svg {...common}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    );
  }
  if (name === "home") {
    return (
      <svg {...common}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10.5V20h13v-9.5" />
        <path d="M9.5 20v-6h5v6" />
      </svg>
    );
  }
  if (name === "history") {
    return (
      <svg {...common}>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  if (name === "expand") {
    return (
      <svg {...common}>
        <path d="M4 9V5a1 1 0 0 1 1-1h4" />
        <path d="M20 9V5a1 1 0 0 0-1-1h-4" />
        <path d="M4 15v4a1 1 0 0 0 1 1h4" />
        <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
      </svg>
    );
  }
  if (name === "spark") {
    return (
      <svg {...common}>
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      </svg>
    );
  }
  if (name === "layers") {
    return (
      <svg {...common}>
        <path d="M12 2 2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );
  }
  if (name === "thumb-up") {
    return (
      <svg {...common} strokeWidth="1.8">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    );
  }
  if (name === "thumb-down") {
    return (
      <svg {...common} strokeWidth="1.8">
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
      </svg>
    );
  }
  if (name === "file") {
    return (
      <svg {...common} strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  }
  if (name === "eye") {
    return (
      <svg {...common} strokeWidth="2">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (name === "download") {
    return (
      <svg {...common} strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    );
  }
  if (name === "upload") {
    return (
      <svg {...common} strokeWidth="1.8">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    );
  }
  if (name === "file-upload") {
    return (
      <svg {...common} strokeWidth="1.6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <polyline points="9 15 12 12 15 15" />
      </svg>
    );
  }
  if (name === "chevron-down") {
    return (
      <svg {...common} strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    );
  }
  if (name === "arrow-left") {
    return (
      <svg {...common} strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    );
  }
  if (name === "copy") {
    return (
      <svg {...common} strokeWidth="1.8">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    );
  }
  if (name === "chat") {
    return (
      <svg {...common}>
        <path d="M4 5.5h16v10H8l-4 3.5V5.5Z" />
        <path d="M8 9h8M8 12h6" />
      </svg>
    );
  }
  if (name === "pen") {
    return (
      <svg {...common}>
        <path d="M4 20h4l11-11-4-4L4 16v4Z" />
        <path d="M13.5 6.5l4 4" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg {...common} strokeWidth="2">
        <path d="M15 4l5 5" />
        <path d="M14 5l-7 7v4h4l7-7" />
        <path d="M9 15l-5 5" />
      </svg>
    );
  }
  if (name === "spokes") {
    return (
      <svg {...common}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
      </svg>
    );
  }
  if (name === "cart") {
    return (
      <svg {...common} strokeWidth="1.8">
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="17" cy="20" r="1.5" />
        <path d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6" />
      </svg>
    );
  }
  if (name === "tag") {
    return (
      <svg {...common} strokeWidth="1.8">
        <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </svg>
    );
  }
  if (name === "chart") {
    return (
      <svg {...common} strokeWidth="1.8">
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M22 20H2" />
      </svg>
    );
  }
  if (name === "store") {
    return (
      <svg {...common} strokeWidth="1.8">
        <path d="M4 10v10h16V10" />
        <path d="M3 6l1.5-3h15L21 6c0 1.7-1.3 3-3 3-1.1 0-2.1-.6-2.6-1.5C14.9 8.4 13.9 9 13 9s-1.9-.6-2.4-1.5C10.1 8.4 9.1 9 8 9 6.3 9 3 7.7 3 6Z" />
        <path d="M9 20v-5h6v5" />
      </svg>
    );
  }
  if (name === "trend") {
    return (
      <svg {...common} strokeWidth="1.8">
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </svg>
    );
  }
  if (name === "bulb") {
    return (
      <svg {...common} strokeWidth="1.8">
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2l.1.2h4.8l.1-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z" />
      </svg>
    );
  }
  return null;
}
