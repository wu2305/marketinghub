import "../../tokens.css";
import React from "react";
import { cx } from "../../cx.js";
import { Icon } from "../../icons.jsx";
import "./SkillMenu.css";


const SKILL_HOVER_CLOSE_MS = 120;

/**
 * The composer "+" menu: an Upload File shortcut plus the Analytical Model
 * picker with search, selection chip support and the two model-creation
 * entries. Mirrors assistant-skill-menu.js: hover previews the detail pane
 * without moving focus, click pins it open, keyboard focus moves into the
 * search field, and leaving the menu unpinned closes the detail after a
 * short delay. Escape or an outside click closes the whole menu.
 * @param {object} props
 * @param {object} props.config `{ attachAccept?, categories, searchPlaceholder, emptyLabel, items, historyLabel, manualLabel }`
 * @param {{ id?: string, type: string, title: string }} [props.selectedSkill]
 * @param {React.RefObject<HTMLElement>} [props.composerRef] composer input refocused after selection
 * @param {(event: { names: string[] }) => void} [props.onAttach]
 * @param {(event: { id?: string, type: string, title: string }) => void} [props.onSelectSkill]
 * @param {(event: { action: "history"|"manual" }) => void} [props.onAction]
 */
export function SkillMenu({ config, selectedSkill, composerRef, onAttach, onSelectSkill, onAction }) {
  const [open, setOpen] = React.useState(false);
  const [detail, setDetail] = React.useState(null);
  const [pinned, setPinned] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [focusNonce, setFocusNonce] = React.useState(0);
  const rootRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const hoverTimer = React.useRef(null);

  React.useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  React.useEffect(() => {
    if (focusNonce && searchRef.current) {
      searchRef.current.focus();
      searchRef.current.setSelectionRange(searchRef.current.value.length, searchRef.current.value.length);
    }
  }, [focusNonce, detail]);

  const closeMenu = React.useCallback(() => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setOpen(false);
    setDetail(null);
    setPinned(false);
    setQuery("");
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (event) => {
      if (!rootRef.current?.contains(event.target)) closeMenu();
    };
    const onDocKey = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    const doc = rootRef.current?.ownerDocument;
    doc?.addEventListener("click", onDocClick);
    doc?.addEventListener("keydown", onDocKey);
    return () => {
      doc?.removeEventListener("click", onDocClick);
      doc?.removeEventListener("keydown", onDocKey);
    };
  }, [open, closeMenu]);

  const collapseDetail = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setPinned(false);
    setDetail(null);
    setQuery("");
  };

  const openDetail = (focus) => {
    setDetail("model");
    setQuery("");
    if (focus) setFocusNonce((nonce) => nonce + 1);
  };

  const clickCategory = (category) => {
    if (category.id === "upload") {
      fileRef.current?.click();
      closeMenu();
      return;
    }
    if (detail === "model" && pinned) {
      collapseDetail();
      return;
    }
    openDetail(true);
    setPinned(true);
  };

  const hoverCategory = (category) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    if (category.id === detail || category.id === "upload") return;
    setPinned(false);
    setDetail("model");
    setQuery("");
  };

  const focusCategory = (category) => {
    if (category.id === "upload") return;
    if (detail === "model") setFocusNonce((nonce) => nonce + 1);
    else openDetail(true);
  };

  const scheduleDetailClose = () => {
    if (pinned) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      hoverTimer.current = null;
      collapseDetail();
    }, SKILL_HOVER_CLOSE_MS);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const items = (config.items || []).filter((item) => {
    const haystack = `${item.title} ${item.note}`.toLowerCase();
    return !normalizedQuery || haystack.includes(normalizedQuery);
  });

  return (
    <div className="mh-skillbox" ref={rootRef}>
      <button
        className="mh-assistant__skill"
        type="button"
        aria-label={config.triggerLabel || "Choose AI skill"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : setOpen(true))}
      >
        <Icon name="plus" />
      </button>
      <input
        ref={fileRef}
        className="mh-skillbox__file"
        type="file"
        multiple
        hidden
        accept={config.attachAccept}
        tabIndex={-1}
        onChange={(event) => {
          const names = Array.from(event.target.files || []).map((file) => file.name);
          if (names.length) onAttach?.({ names });
          event.target.value = "";
        }}
      />
      {open ? (
        <div
          className="mh-skill"
          role="menu"
          aria-label="AI skills"
          onMouseEnter={() => {
            window.clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
          }}
          onMouseLeave={scheduleDetailClose}
        >
          <div className="mh-skill__categories">
            {(config.categories || []).map((category) => (
              <button
                key={category.id}
                className={cx("mh-skill__category", detail === category.id && "is-active")}
                type="button"
                role="menuitem"
                onClick={() => clickCategory(category)}
                onMouseEnter={() => hoverCategory(category)}
                onFocus={() => focusCategory(category)}
              >
                <span className="mh-skill__category-main">
                  <span className="mh-skill__category-icon" aria-hidden="true">
                    <Icon name={category.icon} />
                  </span>
                  <span>{category.label}</span>
                </span>
                <span aria-hidden="true">›</span>
              </button>
            ))}
          </div>
          {detail === "model" ? (
            <div className="mh-skill__detail">
              <div className="mh-skill__search-row">
                <label className="mh-skill__search">
                  <Icon name="search" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    placeholder={config.searchPlaceholder}
                    aria-label={config.searchPlaceholder}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
              </div>
              <div className="mh-skill__list">
                {items.length ? (
                  items.map((item) => (
                    <button
                      key={item.id || item.title}
                      className={cx(
                        "mh-skill__option",
                        selectedSkill && selectedSkill.title === item.title && "is-selected",
                      )}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSelectSkill?.({ id: item.id, type: "Analytical Model", title: item.title });
                        closeMenu();
                        composerRef?.current?.focus();
                      }}
                    >
                      <span className="mh-skill__option-head">
                        <strong>{item.title}</strong>
                        <span className="mh-skill__pin" aria-hidden="true">
                          <Icon name="pin" />
                        </span>
                      </span>
                      <small>{item.note}</small>
                    </button>
                  ))
                ) : (
                  <div className="mh-skill__empty">{config.emptyLabel}</div>
                )}
              </div>
              <div className="mh-skill__footer">
                <button
                  className="mh-skill__action"
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onAction?.({ action: "history" });
                  }}
                >
                  <span className="mh-skill__action-label">
                    <Icon name="chat" />
                    <span>{config.historyLabel}</span>
                  </span>
                  <span aria-hidden="true">›</span>
                </button>
                <button
                  className="mh-skill__action"
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onAction?.({ action: "manual" });
                  }}
                >
                  <span className="mh-skill__action-label">
                    <Icon name="pen" />
                    <span>{config.manualLabel}</span>
                  </span>
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
