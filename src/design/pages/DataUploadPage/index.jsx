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
 * after 1500ms) and starts it only on a real form submission, not when
 * `submitting` is set from outside.
 * @param {object} props
 * @param {string} [props.current="self-service"] Active nav id. This page marks Self-Service Center. // 当前导航 id。本页将 Self-Service Center 标为当前。
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {Array<object>} [props.navigation=[]] Header links. // 页头链接。
 * @param {object} [props.hero={}] Header image area. // 头图区。
 * @param {{ backHref?: string, backLabel: string, importLabel: string }} [props.toolbar={}] Back destination and visible toolbar copy. // 返回目的地和工具栏上可见的文案。
 * @param {Array<{ name: string, label: string, placeholder: string }>} [props.fields=[]] Form fields. Each field has `name`, `label`, and `placeholder`. // 表单字段。每个字段有 `name`、`label` 和 `placeholder`。
 * @param {string} props.submitLabel Label on the idle submit button. // 空闲提交按钮上的文字。
 * @param {string} props.submittingLabel Label on the submit button while `submitting` is true. // `submitting` 为 true 时提交按钮上的文字。
 * @param {boolean} [props.submitting=false] Set true to show the submitted button state. The demo hook restores false only after a real form submission. // 设为 true 时显示已提交的按钮状态。demo hook 只在真实提交表单后才会恢复为 false。
 * @param {{ title: string, dropzoneTitle: string, dropzoneHint: string, selectedPrefix: string, accept: string, templateLabel: string, templateHref?: string, tipsTitle: string, tips: string[] }} [props.bulkImport={}] Template Import copy and file limits. // Template Import 的文案和文件限制。
 * @param {boolean} [props.bulkImportOpen=false] Set true to open Template Import. // 设为 true 时打开 Template Import。
 * @param {string} [props.selectedFile] Selected file name shown in the dropzone. // 显示在拖放区中的已选文件名。
 * @param {(target: { href: string, id?: string, params?: Record<string,string>, label?: string }) => void} [props.onNavigate] The function runs when Back opens Self-Service Center. The result has `href`. // 点击 Back 打开 Self-Service Center 时，会调用这个函数。结果里有 `href`。
 * @param {(target: { label: string }) => void} [props.onOpenImport] The function runs when the user opens Template Import. The result has `label`. // 用户打开 Template Import 时，会调用这个函数。结果里有 `label`。
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onCloseImport] The function runs when the user closes Template Import. The result has `reason`. // 用户关闭 Template Import 时，会调用这个函数。结果里有 `reason`。
 * @param {(file: { name: string }) => void} [props.onSelectFile] The function runs when the user picks a file. The result has `name`. // 用户选择文件时，会调用这个函数。结果里有 `name`。
 * @param {(target: { href: string }) => void} [props.onDownloadTemplate] The function runs when the user downloads the template. The result has `href`. // 用户下载模板时，会调用这个函数。结果里有 `href`。
 * @param {(event: { values: Object<string, string> }) => void} [props.onSubmitForm] The function runs when the user submits the form. The result has `values`. // 用户提交表单时，会调用这个函数。结果里有 `values`。
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
