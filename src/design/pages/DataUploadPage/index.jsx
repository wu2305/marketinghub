import "../../tokens.css";
import { Button } from "../../components/Button/index.jsx";
import { FileDropzone } from "../../components/FileDropzone/index.jsx";
import { FormField } from "../../components/FormField/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
import { Icon } from "../../icons.jsx";
import { Shell } from "../../pages/Shell/index.jsx";
import "./DataUploadPage.css";


/**
 * Data Upload entry page (data-upload.html): Self-Service hero shell, a
 * back/template-import toolbar, a carded multi-field form, and the Template
 * Import modal with a file dropzone and tips. Submit disables the button and
 * flashes `submittingLabel` — the demo hook owns the timer (original restores
 * after 1500ms).
 * @param {object} props
 * @param {string} [props.current="self-service"]
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {object} [props.hero={}] Hero props
 * @param {{ backHref?: string, backLabel: string, importLabel: string }} [props.toolbar={}] Back destination and visible toolbar copy.
 * @param {Array<{ name: string, label: string, placeholder: string }>} [props.fields=[]]
 * @param {string} props.submitLabel
 * @param {string} props.submittingLabel
 * @param {boolean} [props.submitting=false]
 * @param {{ title: string, dropzoneTitle: string, dropzoneHint: string, selectedPrefix: string, accept: string, templateLabel: string, templateHref?: string, tipsTitle: string, tips: string[] }} [props.bulkImport={}] modal copy and file constraints
 * @param {boolean} [props.bulkImportOpen=false]
 * @param {string} [props.selectedFile] file name shown in the dropzone hint
 * @param {(target: { href: string, id?: string, params?: Record<string,string>, label?: string }) => void} [props.onNavigate]
 * @param {(target: { label: string }) => void} [props.onOpenImport]
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onCloseImport]
 * @param {(file: { name: string }) => void} [props.onSelectFile]
 * @param {(target: { href: string }) => void} [props.onDownloadTemplate]
 * @param {(event: { values: Object<string, string> }) => void} [props.onSubmitForm]
 */
export function DataUploadPage({
  current = "self-service",
  logo,
  navigation = [],
  hero = {},
  toolbar = {},
  fields = [],
  submitLabel,
  submittingLabel,
  submitting = false,
  bulkImport = {},
  bulkImportOpen = false,
  selectedFile,
  onNavigate,
  onOpenImport,
  onCloseImport,
  onSelectFile,
  onDownloadTemplate,
  onSubmitForm,
}) {
  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} density="comfortable" onNavigate={onNavigate} />
      <div className="mh-page__offset" aria-hidden="true" />
      <Hero {...hero} height={260} variant="banner" scrim="none" />
      <main className="mh-upload">
        <div className="mh-upload__toolbar">
          <a className="mh-upload__back" href={toolbar.backHref || "#"} onClick={() => onNavigate?.({ href: toolbar.backHref || "#" })}>
            <Icon name="arrow-left" />
            <span>{toolbar.backLabel}</span>
          </a>
          <Button variant="secondary" icon="upload" onClick={onOpenImport}>
            {toolbar.importLabel}
          </Button>
        </div>
        <form
          className="mh-upload__form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const values = {};
            for (const [name, value] of data.entries()) values[name] = String(value).trim();
            onSubmitForm?.({ values });
          }}
        >
          <div className="mh-upload__card">
            <div className="mh-upload__grid">
              {fields.map((field) => (
                <FormField key={field.name} label={field.label} name={field.name} placeholder={field.placeholder} autoComplete="off" />
              ))}
            </div>
          </div>
          <Button variant="gold" size="lg" type="submit" disabled={submitting}>
            {submitting ? submittingLabel : submitLabel}
          </Button>
        </form>
      </main>
      <Modal open={bulkImportOpen} title={bulkImport.title} className="mh-bulk-import" variant="sheet" onClose={onCloseImport}>
        <div className="mh-bulk-import__body">
          <FileDropzone
            title={bulkImport.dropzoneTitle}
            hint={bulkImport.dropzoneHint}
            selectedPrefix={bulkImport.selectedPrefix}
            fileName={selectedFile}
            accept={bulkImport.accept}
            onSelect={onSelectFile}
          />
          <a className="mh-bulk-import__template" href={bulkImport.templateHref || "#"} download onClick={() => onDownloadTemplate?.({ href: bulkImport.templateHref || "#" })}>
            <Icon name="download" />
            <span>{bulkImport.templateLabel}</span>
          </a>
          <div className="mh-bulk-import__tips">
            <h4>{bulkImport.tipsTitle}</h4>
            <ul>
              {(bulkImport.tips || []).map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </Shell>
  );
}
