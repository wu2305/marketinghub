import React from "react";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

const EMPTY = [];
const INITIAL = {};
const AVATARS = { analysis: "purple", meeting: "gold", findings: "pink", reference: "teal" };

/** Local Personal Memory workflow shared by Storybook and a consuming host. */
export function usePersonalMemoryDemo(props) {
  const recordsInput = props.records || EMPTY;
  const initial = props.initial || INITIAL;
  const [records, setRecords] = React.useState(() => [...recordsInput]);
  const [category, setCategory] = React.useState(initial.category || "all");
  const [bannerOpen, setBannerOpen] = React.useState(initial.bannerOpen !== false);
  const [selectedId, setSelectedId] = React.useState(initial.selectedId || null);
  const [menuId, setMenuId] = React.useState(initial.menuId || null);
  const [editing, setEditing] = React.useState(Boolean(initial.editing));
  const [editDraft, setEditDraft] = React.useState(initial.editDraft || {});
  const [createOpen, setCreateOpen] = React.useState(Boolean(initial.createOpen));
  const [createDraft, setCreateDraft] = React.useState(initial.createDraft || { title: "", category: "analysis", description: "" });
  const [createErrors, setCreateErrors] = React.useState(initial.createErrors || {});
  const [deleteId, setDeleteId] = React.useState(initial.deleteId || null);
  const sequence = React.useRef(0);
  const mountedRecords = React.useRef(recordsInput);
  React.useEffect(() => { if (mountedRecords.current !== recordsInput) { mountedRecords.current = recordsInput; setRecords([...recordsInput]); } }, [recordsInput]);
  React.useEffect(() => {
    setCategory(initial.category || "all"); setBannerOpen(initial.bannerOpen !== false); setSelectedId(initial.selectedId || null); setMenuId(initial.menuId || null); setEditing(Boolean(initial.editing)); setEditDraft(initial.editDraft || {}); setCreateOpen(Boolean(initial.createOpen)); setCreateDraft(initial.createDraft || { title: "", category: "analysis", description: "" }); setCreateErrors(initial.createErrors || {}); setDeleteId(initial.deleteId || null);
  }, [initial]);
  const selected = records.find((item) => item.id === selectedId) || null;
  const deleteTarget = records.find((item) => item.id === deleteId) || null;
  const items = category === "all" ? records : records.filter((item) => item.category === category);
  const counts = Object.fromEntries(props.content.categories.map((option) => [option.value, option.value === "all" ? records.length : records.filter((item) => item.category === option.value).length]));
  const choose = ({ id }) => { if (!records.some((item) => item.id === id)) return; setSelectedId(id); setEditing(false); setMenuId(null); props.onSelectMemory?.({ id }); };
  const edit = ({ id }) => { const item = records.find((entry) => entry.id === id); if (!item) return; setSelectedId(id); setEditing(true); setEditDraft({ title: item.title, description: item.description }); setMenuId(null); props.onEditMemory?.({ id }); };
  const closeCreate = (event) => { setCreateOpen(false); props.onCloseCreate?.(event); };
  const workspace = useWorkspaceAssistantDemo({ variant: "lite", initial, assistant: { ...props.assistant, open: Boolean(initial.assistantOpen), prompt: initial.assistantPrompt || "", answers: initial.assistantAnswers || EMPTY, onOpen: props.onAssistantOpen, onClose: props.onAssistantClose, onSubmit: props.onAssistantSubmit, onNewSession: props.onAssistantNewSession, onSelectSkill: props.onAssistantSelectSkill, onClearSkill: props.onAssistantClearSkill, onSkillAction: props.onSkillAction, onAttach: props.onAssistantAttach, onMaximize: props.onAssistantMaximize, onHistory: props.onAssistantHistory }, demo: { answerFor: props.answerFor, modelFlow: props.modelFlow, modelDraftFor: props.modelDraftFor }, onFlowSave: props.onFlowSave, onFlowSubmit: props.onFlowSubmit });
  return {
    content: props.content, logo: props.logo, navigation: props.navigation, hrefFor: props.hrefFor, onNavigate: props.onNavigate,
    memory: { items, counts, category, bannerOpen, selected, menuId, editing, draft: editDraft,
      onCategoryChange: ({ value }) => { setCategory(value); setMenuId(null); props.onCategoryChange?.({ value }); },
      onCloseBanner: () => { setBannerOpen(false); props.onCloseBanner?.(); },
      onSelect: choose,
      onToggleMenu: ({ id }) => { setMenuId((value) => value === id ? null : id); props.onToggleMenu?.({ id }); },
      onCloseMenu: () => setMenuId(null),
      onEdit: edit,
      onDelete: ({ id }) => { if (!records.some((item) => item.id === id)) return; setDeleteId(id); setMenuId(null); props.onDeleteMemory?.({ id }); },
      onDraftChange: ({ field, value }) => setEditDraft((draft) => ({ ...draft, [field]: value })),
      onCancelEdit: () => { setEditing(false); props.onCancelEdit?.({ id: selectedId }); },
      onSaveEdit: ({ id, title, description }) => { const nextTitle = String(title || "").trim(); const nextDescription = String(description || "").trim(); if (!nextTitle || !nextDescription) return; setRecords((current) => current.map((item) => item.id === id ? { ...item, title: nextTitle, description: nextDescription, updated: props.content.labels.justNow } : item)); setEditing(false); props.onSaveEdit?.({ id, title: nextTitle, description: nextDescription }); },
      onShare: (event) => props.onShare?.(event),
    },
    create: { open: createOpen, draft: createDraft, errors: createErrors,
      onOpen: () => { setCreateDraft({ title: "", category: "analysis", description: "" }); setCreateErrors({}); setCreateOpen(true); props.onOpenCreate?.(); },
      onClose: closeCreate,
      onChange: ({ field, value }) => { setCreateDraft((draft) => ({ ...draft, [field]: value })); setCreateErrors((errors) => ({ ...errors, [field]: false })); },
      onAutoFill: () => props.onAutoFill?.(),
      onSave: () => { const title = createDraft.title.trim(); const description = createDraft.description.trim(); const errors = { title: !title, description: !description }; setCreateErrors(errors); if (errors.title || errors.description) return; const value = createDraft.category; const option = props.content.categories.find((item) => item.value === value); const nextSequence = ++sequence.current; const id = props.idFor?.({ sequence: nextSequence }) || `mem-created-${nextSequence}`; const item = { id, title, category: value, description, tags: [option?.tag || "Note"], relatedTags: [], source: props.content.labels.personalSource, updated: props.content.labels.justNow, used: props.content.labels.never, avatarColor: AVATARS[value] || "gold" }; setRecords((current) => [item, ...current]); setCreateOpen(false); setSelectedId(id); setEditing(false); props.onSaveMemory?.({ item }); },
    },
    deletion: { target: deleteTarget, onCancel: () => { setDeleteId(null); props.onCancelDelete?.({ id: deleteId }); }, onConfirm: () => { if (!deleteId) return; setRecords((current) => current.filter((item) => item.id !== deleteId)); if (selectedId === deleteId) { setSelectedId(null); setEditing(false); } const id = deleteId; setDeleteId(null); props.onConfirmDelete?.({ id }); } },
    ...workspace,
  };
}
