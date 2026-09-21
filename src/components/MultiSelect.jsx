import React, { useEffect, useRef, useState } from "react";

export function MultiSelect({ label, options, value, onChange, id }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const toggle = (option) => {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  };

  return (
    <div className="v20-multi bt-multi" id={id} ref={rootRef}>
      <button
        type="button"
        className="v20-multi-display"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {value.length ? value.map((item) => <span key={item}>{item}</span>) : <em>Select one or more</em>}
      </button>
      <div className={`v20-multi-menu${open ? " open" : ""}`}>
        {options.map((option) => (
          <label key={option}>
            <input type="checkbox" value={option} checked={value.includes(option)} onChange={() => toggle(option)} />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
