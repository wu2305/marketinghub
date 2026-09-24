import "../../tokens.css";
import React from "react";
import { cx } from "../../cx.js";
import { Icon } from "../../icons.jsx";
import "./FileDropzone.css";


/**
 * Clickable / drag-and-drop file target. Clicking opens the native file
 * picker; dragover adds the `is-dragover` visual state; selecting or dropping
 * a file calls `onSelect` with the file name. `fileName` switches the hint to
 * the selected-file message.
 * @param {object} props
 * @param {string} [props.title="Click or drag a file to upload here"]
 * @param {string} [props.hint]
 * @param {string} [props.selectedPrefix="Selected:"]
 * @param {string} [props.fileName] selected file name shown in the hint
 * @param {string} [props.accept=".xlsx,.xls"]
 * @param {(file: { name: string }) => void} [props.onSelect]
 */
export function FileDropzone({
  title = "Click or drag a file to upload here",
  hint,
  selectedPrefix = "Selected:",
  fileName,
  accept = ".xlsx,.xls",
  onSelect,
}) {
  const inputRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  return (
    <div
      className={cx("mh-dropzone", dragging && "is-dragover")}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer?.files?.[0];
        if (file) onSelect?.({ name: file.name });
      }}
    >
      <input
        ref={inputRef}
        className="mh-dropzone__input"
        type="file"
        accept={accept}
        hidden
        aria-hidden="true"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect?.({ name: file.name });
        }}
      />
      <Icon name="file-upload" className="mh-dropzone__icon" />
      <p className="mh-dropzone__title">{title}</p>
      <p className="mh-dropzone__hint">{fileName ? `${selectedPrefix} ${fileName}` : hint}</p>
    </div>
  );
}
