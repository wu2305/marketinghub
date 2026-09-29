import React from "react";
import { SKILL_LIBRARY, SKILL_LIBRARY_SHELL } from "./content/skill-library.js";
import { scenarioEditPreviewFor } from "./scenario-edit-demo.js";
import { useToast } from "./use-toast.js";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

const EMPTY_INITIAL = {};
const EMPTY_ANSWERS = [];
const FORM_KEYS = ["name", "purpose", "scope", "owner", "triggerWhen", "input", "logic", "output", "boundary"];
const blankForm = () => ({ ...Object.fromEntries(FORM_KEYS.map((key) => [key, ""])), question: "" });
const formFor = (skill) => ({ ...Object.fromEntries(FORM_KEYS.map((key) => [key, skill?.[key] || ""])), question: skill?.previewQuestion || "" });

/** Source search matches name, purpose and owner; status is an exact value filter. */
export function filterSkills(records, { search = "", status = "all" } = {}) {
  const needle = search.toLowerCase();
  return records.filter((skill) =>
    (status === "all" || skill.status === status) &&
    (!needle || [skill.name, skill.purpose, skill.owner].some((value) => value.toLowerCase().includes(needle))));
}

/** Private deterministic P15 flow, shared by page stories and the independent host.
 * @param {Record<string, any>} options
 */
export function useSkillLibraryDemo({ content = SKILL_LIBRARY, records = SKILL_LIBRARY.records, shell = SKILL_LIBRARY_SHELL, initial = EMPTY_INITIAL, hrefFor, onNavigate, onChange, onSelect, onOpen, onClick, onClearFilters, onSubmit, onCancel, onAutoFill, onRunPreview, onSaveDraft, notice } = {}) {
  const [skills, setSkills] = React.useState(() => records.map((skill) => ({ ...skill })));
  const [search, setSearch] = React.useState(initial.search || "");
  const [status, setStatus] = React.useState(initial.status || "all");
  const [selectedId, setSelectedId] = React.useState(initial.selectedId || null);
  const [previewOpen, setPreviewOpen] = React.useState(Boolean(initial.previewOpen));
  const [mode, setMode] = React.useState(initial.mode || "list");
  /* Id of the skill whose delete the viewer is asked to confirm (D10). */
  const [deletingId, setDeletingId] = React.useState(initial.deletingId || null);
  const { toast, showToast } = useToast();
  const noticeText = notice === "submitted" ? content.labels.submittedToast : undefined;
  React.useEffect(() => { if (noticeText) showToast(noticeText); }, [noticeText, showToast]);
  /* Id of the record the open form saves into: the edited skill, or the draft a first Save Draft created. */
  const [formId, setFormId] = React.useState(initial.mode === "edit" ? initial.selectedId || null : null);
  const [preview, setPreview] = React.useState(initial.preview ?? null);
  const sequence = React.useRef(0);
  const [form, setForm] = React.useState(() => initial.form ? { ...blankForm(), ...initial.form } : initial.mode === "edit" ? formFor(records.find((skill) => skill.id === initial.selectedId)) : blankForm());
  React.useEffect(() => { setSkills(records.map((skill) => ({ ...skill }))); }, [records]);
  React.useEffect(() => {
    setSearch(initial.search || ""); setStatus(initial.status || "all"); setSelectedId(initial.selectedId || null);
    setPreviewOpen(Boolean(initial.previewOpen)); setMode(initial.mode || "list"); setDeletingId(initial.deletingId || null);
    setForm(initial.form ? { ...blankForm(), ...initial.form } : initial.mode === "edit" ? formFor(records.find((skill) => skill.id === initial.selectedId)) : blankForm());
    setFormId(initial.mode === "edit" ? initial.selectedId || null : null); setPreview(initial.preview ?? null);
  }, [initial, records]);
  const selected = mode === "list" ? skills.find((skill) => skill.id === selectedId) || null : null;
  const items = filterSkills(skills, { search, status });
  const persist = (status) => {
    const id = formId || `skill-draft-${++sequence.current}`;
    const fields = { name: form.name.trim() || content.labels.untitled, purpose: form.purpose, scope: form.scope, owner: form.owner, triggerWhen: form.triggerWhen, input: form.input, logic: form.logic, output: form.output, boundary: form.boundary, previewQuestion: form.question, status };
    setSkills((current) => current.some((skill) => skill.id === id) ? current.map((skill) => skill.id === id ? { ...skill, ...fields } : skill) : [{ ...content.draftDefaults, id, ...fields }, ...current]);
    setFormId(id);
    return id;
  };
  const deleting = skills.find((skill) => skill.id === deletingId) || null;
  const dialogCopy = content.labels.deleteDialog;
  const workspace = useWorkspaceAssistantDemo({ variant: "lite", initial, assistant: { ...shell.assistant, open: Boolean(initial.assistantOpen), prompt: initial.assistantPrompt || "", answers: initial.assistantAnswers || EMPTY_ANSWERS }, demo: { answerFor: shell.answerFor, modelFlow: shell.modelFlow, modelDraftFor: shell.modelDraftFor } });
  return {
    content, logo: shell.logo, navigation: shell.navigation, image: content.hero.image, hrefFor, onNavigate,
    library: {
      items, totalCount: skills.length, search, status,
      onChange: ({ value }) => { setSearch(value); onChange?.({ key: "search", value }); },
      onSelect: ({ value }) => { setStatus(value); onSelect?.({ value }); },
      onClear: (event) => { setSearch(""); setStatus("all"); onClearFilters?.(event); },
      onOpen: ({ id }) => { setSelectedId(id); setPreviewOpen(false); onOpen?.({ id }); },
      onClick: () => { setSelectedId(null); setPreviewOpen(false); setForm(blankForm()); setFormId(null); setPreview(null); setMode("create"); onClick?.({ action: "create" }); },
    },
    detail: {
      skill: selected, previewOpen,
      onCancel: ({ reason }) => { setSelectedId(null); setPreviewOpen(false); onCancel?.({ reason }); },
      onChange: ({ value }) => { setPreviewOpen(value); onChange?.({ key: "previewOpen", value }); },
      onOpen: ({ id }) => { setForm(formFor(skills.find((skill) => skill.id === id))); setFormId(id); setPreview(null); setSelectedId(null); setMode("edit"); onOpen?.({ id, action: "edit" }); },
      onClick: ({ id, action }) => { if (action === "delete") setDeletingId(id); onClick?.({ id, action }); },
    },
    dialog: deleting ? {
      purpose: "danger", ...dialogCopy,
      onConfirm: () => { setSkills((current) => current.filter((skill) => skill.id !== deleting.id)); setSelectedId(null); setPreviewOpen(false); setDeletingId(null); showToast(content.labels.deletedToast); },
      onCancel: () => setDeletingId(null),
    } : null,
    toast,
    form: {
      mode, values: form, preview,
      onChange: ({ key, value }) => { setForm((current) => ({ ...current, [key]: value })); onChange?.({ key, value }); },
      onSubmit: ({ values }) => { const id = persist("Under Review"); setMode("list"); showToast(content.labels.submittedToast); onSubmit?.({ id, status: "Under Review", values }); },
      onCancel: ({ reason }) => { setMode("list"); onCancel?.({ reason }); },
      onAutoFill: ({ field }) => { const text = content.labels.autoFillText?.[field]; if (text === undefined) return; setForm((current) => ({ ...current, [field]: text })); onAutoFill?.({ field }); },
      onRunPreview: ({ question }) => { const output = scenarioEditPreviewFor({ ...form, question }, content.labels); setPreview(output); onRunPreview?.({ question: question.trim(), output }); },
      /* Save keeps a Draft, Submit sends the skill to review (R4, A1); both upsert the row: the first save of a new form adds it, later saves and edits update it. Nothing is validated, an unnamed skill is titled "Untitled". */
      onSaveDraft: () => { const id = persist("Draft"); showToast(content.labels.draftSaved); onSaveDraft?.({ id, status: "Draft", values: { ...form } }); },
    },
    assistant: workspace.assistant, skillFlow: workspace.skillFlow,
  };
}
