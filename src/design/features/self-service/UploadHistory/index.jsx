import "../../../tokens.css";
import { Modal } from "../../../components/Modal/index.jsx";
import { Icon } from "../../../icons.jsx";
import "./UploadHistory.css";


const DEFAULT_COPY = {
  fileColumn: "File Name",
  uploaderColumn: "Uploader",
  timeColumn: "Upload Time",
  actionColumn: "Action",
  preview: "Preview",
  download: "Download",
  previewLabel: (file) => `Preview ${file}`,
  downloadLabel: (file) => `Download ${file}`,
};

/**
 * Upload-history dialog: table of file/uploader/time rows with per-row
 * Preview and Download actions, or an empty-state message. Built on Modal.
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {string} [props.title="Upload History"]
 * @param {Array<{ id?: string, file: string, uploader: string, time: string }>} [props.rows=[]]
 * @param {string} [props.emptyMessage="No upload history yet for this module."]
 * @param {Partial<typeof DEFAULT_COPY>} [props.copy] column heads, action labels and the per-file accessible names `previewLabel(file)` and `downloadLabel(file)`
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onClose]
 * @param {(row: object) => void} [props.onPreview]
 * @param {(row: object) => void} [props.onDownload]
 */
export function UploadHistory({
  open = false,
  title = "Upload History",
  rows = [],
  emptyMessage = "No upload history yet for this module.",
  copy: copyProp,
  onClose,
  onPreview,
  onDownload,
}) {
  const copy = { ...DEFAULT_COPY, ...copyProp };
  return (
    <Modal open={open} title={title} className="mh-upload-history" variant="sheet" onClose={onClose}>
      <div className="mh-upload-history__body">
        {rows.length ? (
          <table className="mh-upload-history__table">
            <thead>
              <tr>
                <th scope="col">{copy.fileColumn}</th>
                <th scope="col">{copy.uploaderColumn}</th>
                <th scope="col">{copy.timeColumn}</th>
                <th scope="col">{copy.actionColumn}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id || index}>
                  <td>
                    <span className="mh-upload-history__file">
                      <Icon name="file" />
                      <span>{row.file}</span>
                    </span>
                  </td>
                  <td className="mh-upload-history__uploader">{row.uploader}</td>
                  <td className="mh-upload-history__time">{row.time}</td>
                  <td>
                    <span className="mh-upload-history__actions">
                      <button type="button" className="mh-upload-history__btn" aria-label={copy.previewLabel(row.file)} onClick={() => onPreview?.(row)}>
                        <Icon name="eye" />
                        <span>{copy.preview}</span>
                      </button>
                      <button type="button" className="mh-upload-history__btn" aria-label={copy.downloadLabel(row.file)} onClick={() => onDownload?.(row)}>
                        <Icon name="download" />
                        <span>{copy.download}</span>
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="mh-upload-history__empty">{emptyMessage}</div>
        )}
      </div>
    </Modal>
  );
}
