import "../../../tokens.css";
import { Button } from "../../../components/Button/index.jsx";
import { FormField } from "../../../components/FormField/index.jsx";
import "./BusinessTermForm.css";


/**
 * Business Term create/edit form (Title, Term Type, Description, Synonyms).
 * `invalid` turns on required-field error styling; callers pass it after a
 * failed submit so empty required fields are marked.
 * @param {object} props
 * @param {string} [props.title=""]
 * @param {"Business Term"|"Global Synonym"} [props.kind="Business Term"]
 * @param {string} [props.description=""]
 * @param {string} [props.synonyms=""]
 * @param {boolean} [props.invalid=false]
 * @param {(event: { name: string, value: string }) => void} [props.onChange]
 * @param {() => void} [props.onCancel]
 * @param {(values: { title: string, kind: string, description: string, synonyms: string }) => void} [props.onSave]
 * @param {(values: { title: string, kind: string, description: string, synonyms: string }) => void} [props.onSubmit]
 */
export function BusinessTermForm({
  title = "",
  kind = "Business Term",
  description = "",
  synonyms = "",
  invalid = false,
  onChange,
  onCancel,
  onSave,
  onSubmit,
}) {
  const missing = (value) => invalid && !String(value).trim();
  return (
    <form
      className="mh-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.({ title, kind, description, synonyms });
      }}
    >
      <div className="mh-form__grid">
        <FormField label="Title" name="title" required invalid={missing(title)} value={title} placeholder="Enter the business term title." onChange={onChange} />
        <FormField
          label="Term Type"
          name="kind"
          control="select"
          required
          invalid={missing(kind)}
          value={kind}
          options={["Business Term", "Global Synonym"]}
          onChange={onChange}
        />
        <FormField
          className="mh-form__wide"
          label="Description"
          name="description"
          control="textarea"
          required
          invalid={missing(description)}
          value={description}
          placeholder="Explain the meaning, usage, and boundary of this term."
          onChange={onChange}
        />
        <FormField label="Synonyms" name="synonyms" value={synonyms} placeholder="Add aliases, separated by commas." onChange={onChange} />
      </div>
      <div className="mh-form__actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={() => onSave?.({ title, kind, description, synonyms })}>
          Save
        </Button>
        <Button variant="gold" type="submit">
          Submit
        </Button>
      </div>
      <p className="mh-form__note">Save keeps this term in Draft. Submit publishes it for AI use.</p>
    </form>
  );
}
