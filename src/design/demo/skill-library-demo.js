import React from "react";
import { SKILL_LIBRARY, SKILL_LIBRARY_SHELL } from "./content/skill-library.js";
import { useToast } from "./use-toast.js";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

const EMPTY_INITIAL = {};
const EMPTY_ANSWERS = [];
const FORM_KEYS = ["name", "purpose", "scope", "owner", "triggerWhen", "input", "logic", "output", "boundary"];
const blankForm = () => Object.fromEntries(FORM_KEYS.map((key) => [key, ""]));
const formFor = (skill) => Object.fromEntries(FORM_KEYS.map((key) => [key, skill?.[key] || ""]));

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
export function useSkillLibraryDemo({ content = SKILL_LIBRARY, records = SKILL_LIBRARY.records, shell = SKILL_LIBRARY_SHELL, initial = EMPTY_INITIAL, hrefFor, onNavigate, onChange, onSelect, onOpen, onClick, onClearFilters, onSubmit, onCancel } = {}) {
  const [skills, setSkills] = React.useState(() => records.map((skill) => ({ ...skill })));
  const [search, setSearch] = React.useState(initial.search || "");
  const [status, setStatus] = React.useState(initial.status || "all");
  const [selectedId, setSelectedId] = React.useState(initial.selectedId || null);
  const [previewOpen, setPreviewOpen] = React.useState(Boolean(initial.previewOpen));
  const [mode, setMode] = React.useState(initial.mode || "list");
  /* Id of the skill whose delete the viewer is asked to confirm (D10). */
  const [deletingId, setDeletingId] = React.useState(initial.deletingId || null);
  const { toast, showToast } = useToast();
  const [form, setForm] = React.useState(() => initial.form ? { ...blankForm(), ...initial.form } : initial.mode === "edit" ? formFor(records.find((skill) => skill.id === initial.selectedId)) : blankForm());
  React.useEffect(() => { setSkills(records.map((skill) => ({ ...skill }))); }, [records]);
  React.useEffect(() => {
    setSearch(initial.search || ""); setStatus(initial.status || "all"); setSelectedId(initial.selectedId || null);
    setPreviewOpen(Boolean(initial.previewOpen)); setMode(initial.mode || "list"); setDeletingId(initial.deletingId || null);
    setForm(initial.form ? { ...blankForm(), ...initial.form } : initial.mode === "edit" ? formFor(records.find((skill) => skill.id === initial.selectedId)) : blankForm());
  }, [initial, records]);
  const selected = mode === "list" ? skills.find((skill) => skill.id === selectedId) || null : null;
  const items = filterSkills(skills, { search, status });
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
      onClick: () => { setSelectedId(null); setPreviewOpen(false); setForm(blankForm()); setMode("create"); onClick?.({ action: "create" }); },
    },
    detail: {
      skill: selected, previewOpen,
      onCancel: ({ reason }) => { setSelectedId(null); setPreviewOpen(false); onCancel?.({ reason }); },
      onChange: ({ value }) => { setPreviewOpen(value); onChange?.({ key: "previewOpen", value }); },
      onOpen: ({ id }) => { setForm(formFor(skills.find((skill) => skill.id === id))); setSelectedId(null); setMode("edit"); onOpen?.({ id, action: "edit" }); },
      onClick: ({ id, action }) => { if (action === "delete") setDeletingId(id); onClick?.({ id, action }); },
    },
    dialog: deleting ? {
      purpose: "danger", ...dialogCopy,
      onConfirm: () => { setSkills((current) => current.filter((skill) => skill.id !== deleting.id)); setSelectedId(null); setPreviewOpen(false); setDeletingId(null); showToast(content.labels.deletedToast); },
      onCancel: () => setDeletingId(null),
    } : null,
    toast,
    form: {
      mode, values: form,
      onChange: ({ key, value }) => { setForm((current) => ({ ...current, [key]: value })); onChange?.({ key, value }); },
      onSubmit: ({ values }) => { onSubmit?.({ values }); if (typeof window !== "undefined") window.alert(content.labels.submitted); setMode("list"); },
      onCancel: ({ reason }) => { setMode("list"); onCancel?.({ reason }); },
      onClick: ({ action, field }) => onClick?.({ action, field }),
    },
    assistant: workspace.assistant, skillFlow: workspace.skillFlow,
  };
}
