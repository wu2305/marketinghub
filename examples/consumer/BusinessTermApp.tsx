/* A consumer-built Business Term workspace (Phase 3 WP5, item 1).
 *
 * It uses only the package entries: components and `governedActions` from
 * "marketing-hub", and copy/seed content (upper-case constants) from
 * "marketing-hub/demo". No demo hook or internal path: every piece of state
 * and every rule below is this app's own, which is the point. The screens and
 * the visible result of each action should match the demo's Business Term
 * library and create/edit form; the data rules underneath are this app's.
 */
import React from "react";
import { AiInterpreterPage, KnowledgeCreatePage, governanceMessages, governedActions, useGovernedFlow } from "marketing-hub";
import { INTERPRETER, KNOWLEDGE_CREATE, LOGO, NAV } from "marketing-hub/demo";

export type Term = {
  id: string;
  title: string;
  kind: string;
  description: string;
  synonyms: string[];
  scope: string[];
  creator: string;
  status: "Enable" | "Disable";
  stage?: "Draft" | "Published";
};

type FormValues = { title: string; kind: string; description: string; synonyms: string[]; scope: string[] };
type Answer = NonNullable<React.ComponentProps<typeof AiInterpreterPage>["assistant"]>["answers"] extends (infer A)[] | undefined ? A : never;
type Route = { page: "library"; type: string } | { page: "form"; mode: "create" | "edit"; id?: string };

/**
 * Everything this app shows that is not a record: page copy, form copy, the governance
 * messages and the assistant's canned answer. Swap the object to change the language;
 * `englishContent` is the demo's. See `localized/` for a second language.
 */
type Copy = Record<string, string | ((...args: any[]) => string)>;
/** The demo content plus the optional keys a translation sets (all fall back to English). */
type InterpreterContent = typeof INTERPRETER & {
  copy: { sidebar?: { brand?: string; ariaLabel?: string; manageLabel?: string }; header?: { navigationAriaLabel?: string; logoAriaLabel?: string } };
  assistant: { copy?: Copy; launcherLabel?: string; skillMenu: { menuLabel?: string } };
  businessTermLibrary: {
    strings: {
      libraryLabel?: string;
      listLabel?: string;
      paginationLabel?: string;
      sizeLabel?: (size: number) => string;
      pageLabel?: (position: { page: number; pages: number }) => string;
      allModelsLabel?: string;
      kindLabels?: Record<string, string>;
    };
  };
};
type KnowledgeCreateContent = typeof KNOWLEDGE_CREATE & {
  typeLabels?: Record<string, string>;
  labels: { navigationAria?: string; logoAria?: string };
  businessTerm: { labels: { kinds?: Record<string, string> } };
};

export type BusinessTermContent = {
  interpreter: InterpreterContent;
  knowledgeCreate: KnowledgeCreateContent;
  logo: typeof LOGO;
  navigation: typeof NAV;
  governance: typeof governanceMessages;
  ask: {
    banner: string;
    context: string;
    body: (count: number) => string;
    matchingLabel: string;
    noMatch: string;
    source: string;
  };
};

export const englishContent: BusinessTermContent = {
  interpreter: INTERPRETER,
  knowledgeCreate: KNOWLEDGE_CREATE,
  logo: LOGO,
  navigation: NAV,
  governance: governanceMessages,
  ask: {
    banner: "AI Response",
    context: "Context: Business Terms",
    body: (count) => `${count} business terms are in this workspace.`,
    matchingLabel: "Matching terms",
    noMatch: "None by title.",
    source: "Business Term library",
  },
};

const BLANK: FormValues = { title: "", kind: "Business Term", description: "", synonyms: [], scope: [] };
const TOAST_MS = 3000;

/** Seed terms from the demo content; any list of `Term`s works. */
export const seedTerms: Term[] = englishContent.interpreter.businessTermLibrary.records.map((record) => ({ ...record, status: record.status === "Disable" ? "Disable" : "Enable" }));

/** Links stay real `<a href>`s; this app routes on their callbacks, the hash is cosmetic. */
const hrefFor = (id: string, params: Record<string, string> = {}) => {
  const query = new URLSearchParams(params).toString();
  return `#${id}${query ? `?${query}` : ""}`;
};

/**
 * @param props.terms initial records (defaults to the demo seed)
 * @param props.currentUser who "owns" records for the edit/delete/disable rules
 * @param props.content the app's language: page and form copy, governance messages, assistant answer
 */
export function BusinessTermApp({ terms = seedTerms, currentUser, content = englishContent }: { terms?: Term[]; currentUser?: string; content?: BusinessTermContent }) {
  const { interpreter, knowledgeCreate, ask: askCopy } = content;
  const library = interpreter.businessTermLibrary;
  const dialogs = library.strings.dialogs;
  const owner = currentUser ?? library.currentUser;
  const [records, setRecords] = React.useState<Term[]>(terms);
  const [route, setRoute] = React.useState<Route>({ page: "library", type: "Business Term" });
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Record<string, string[]>>({ status: [], creator: [] });
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);
  const [detailId, setDetailId] = React.useState<string | null>(null);
  const [values, setValues] = React.useState<FormValues>(BLANK);
  const [invalid, setInvalid] = React.useState<string[]>([]);
  const [toast, setToast] = React.useState("");
  const [pageToast, setPageToast] = React.useState("");
  const [assistant, setAssistant] = React.useState<{ open: boolean; prompt: string; answers: Answer[]; skill: { id?: string; type: string; title: string } | null }>({ open: false, prompt: "", answers: [], skill: null });
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const flash = (set: (message: string) => void, message: string) => {
    set(message);
    timers.current.push(setTimeout(() => set(""), TOAST_MS));
  };

  const find = (id: string) => records.find((record) => record.id === id);
  const update = (id: string, patch: Partial<Term>) => setRecords((all) => all.map((record) => (record.id === id ? { ...record, ...patch } : record)));
  const openForm = (mode: "create" | "edit", id?: string) => {
    const record = id ? find(id) : undefined;
    setValues(record ? { title: record.title, kind: record.kind, description: record.description, synonyms: record.synonyms, scope: record.scope } : BLANK);
    setInvalid([]);
    setDetailId(null);
    setRoute({ page: "form", mode, id });
  };
  const toLibrary = () => setRoute({ page: "library", type: "Business Term" });

  /* ---- form ---- */
  const persist = (submit: boolean) => {
    const missing = (["title", "description"] as const).filter((name) => !values[name].trim());
    if (missing.length) return setInvalid([...missing]);
    const editing = route.page === "form" && route.mode === "edit" ? route.id : undefined;
    const term: Term = {
      id: editing || `term-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      title: values.title.trim(),
      kind: values.kind,
      description: values.description.trim(),
      synonyms: values.synonyms,
      scope: values.kind === "Global Synonym" ? [] : values.scope,
      creator: editing ? find(editing)?.creator || owner : owner,
      status: submit ? "Enable" : "Disable",
      stage: submit ? "Published" : "Draft",
    };
    setRecords((all) => (editing ? all.map((record) => (record.id === editing ? term : record)) : [term, ...all]));
    toLibrary();
    if (submit) flash(setPageToast, knowledgeCreate.businessTerm.publishedNotice);
  };

  /* The blocked-reason / dialog / confirm / toast sequence is the package's `useGovernedFlow`;
   * what "disable", "delete" and "edit" do to this app's records stays here. */
  const flow = useGovernedFlow({
    find,
    copy: dialogs,
    tooltips: content.governance,
    onEdit: (record: Term) => openForm("edit", record.id),
    onDisable: (record: Term) => {
      update(record.id, { status: "Disable" });
      flash(setToast, dialogs.disabledToast);
      return { ...record, status: "Disable" };
    },
    onDelete: (record: Term) => {
      setRecords((all) => all.filter((item) => item.id !== record.id));
      setDetailId(null);
      flash(setToast, dialogs.deletedToast);
    },
  });

  if (route.page === "form") {
    return (
      <KnowledgeCreatePage
        content={knowledgeCreate}
        logo={{ ...content.logo, href: hrefFor("home") }}
        navigation={content.navigation.map((item) => ({ ...item, href: hrefFor(item.id) }))}
        type="Business Term"
        mode={route.mode}
        values={values}
        invalid={invalid}
        result={null}
        dialog={null}
        menu={null}
        hrefFor={hrefFor}
        onNavigate={({ id }) => { if (id === "interpreter") toLibrary(); }}
        onChange={({ name, value }) => {
          setValues((prior) => ({ ...prior, [name]: value }));
          setInvalid((prior) => prior.filter((item) => item !== name));
        }}
        onSave={() => persist(false)}
        onSubmit={() => persist(true)}
        onCancel={toLibrary}
      />
    );
  }

  /* ---- library ---- */
  const text = query.trim().toLowerCase();
  const visible = records
    .filter((record) => record.stage !== "Draft" || record.creator === owner)
    .filter((record) => !selected.status.length || selected.status.includes(record.status))
    .filter((record) => !selected.creator.length || selected.creator.includes(record.creator))
    .filter((record) => !text || [record.title, record.description, ...record.synonyms, ...record.scope, record.creator].some((field) => field.toLowerCase().includes(text)));
  const pages = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(page, pages);
  const withActions = (record: Term) => ({ ...record, actions: governedActions(record, { currentUser: owner }) });
  const detail = detailId ? find(detailId) : undefined;

  const facet = (id: "status" | "creator", label: string, allLabel: string, options: { id: string; label: string }[]) => ({ id, label, allLabel, options, selected: selected[id] });
  const view = {
    records: visible.slice((current - 1) * pageSize, current * pageSize).map(withActions),
    totals: { shown: visible.length, total: records.length },
    filters: [
      facet("status", library.strings.statusLabel, library.strings.statusAll, library.strings.statusOptions),
      facet("creator", library.strings.creatorLabel, library.strings.creatorAll, [...new Set(records.map((record) => record.creator))].map((creator) => ({ id: creator, label: creator }))),
    ],
    query,
    page: current,
    pageSize,
    pageSizes: library.pageSizes,
    strings: { ...library.strings, tooltips: content.governance },
    createHref: hrefFor("knowledge-create", { type: "Business Term" }),
    detail: detail ? withActions(detail) : null,
    dialog: flow.dialog,
    toast,
    onQueryChange: ({ value }: { value: string }) => { setQuery(value); setPage(1); },
    onFilterToggle: ({ id, value, checked }: { id: string; value: string; checked: boolean }) => {
      setSelected((prior) => ({ ...prior, [id]: checked ? [...prior[id], value] : prior[id].filter((item) => item !== value) }));
      setPage(1);
    },
    onClearFilters: () => { setQuery(""); setSelected({ status: [], creator: [] }); setPage(1); },
    onPage: ({ page: next }: { page: number }) => setPage(next),
    onPageSize: ({ pageSize: next }: { pageSize: number }) => { setPageSize(next); setPage(1); },
    onOpen: ({ id }: { id: string }) => setDetailId(id),
    onCloseDetail: () => setDetailId(null),
    onAction: flow.onAction,
    onDialogConfirm: flow.onDialogConfirm,
    onDialogCancel: flow.onDialogCancel,
    onCreate: () => openForm("create"),
  };

  /* The assistant is this app's too: any answer shape AssistantPanel renders will do. */
  const ask = (prompt: string) => {
    if (!prompt.trim()) return;
    const answer: Answer = {
      query: prompt,
      variant: "workspace",
      banner: askCopy.banner,
      context: askCopy.context,
      body: askCopy.body(records.length),
      findings: [{ label: askCopy.matchingLabel, detail: records.filter((record) => prompt.toLowerCase().includes(record.title.toLowerCase())).map((record) => record.title).join(", ") || askCopy.noMatch }],
      sources: [askCopy.source],
    };
    setAssistant((prior) => ({ ...prior, prompt: "", answers: [...prior.answers, answer] }));
  };
  const assistantProps = {
    ...interpreter.assistant,
    open: assistant.open,
    prompt: assistant.prompt,
    answers: assistant.answers,
    selectedSkill: assistant.skill || undefined,
    onOpen: () => setAssistant((prior) => ({ ...prior, open: true })),
    onClose: () => setAssistant((prior) => ({ ...prior, open: false })),
    onPromptChange: ({ value }: { value: string }) => setAssistant((prior) => ({ ...prior, prompt: value })),
    onSubmit: ({ prompt }: { prompt: string }) => ask(prompt),
    onSuggestion: ({ prompt }: { prompt: string }) => setAssistant((prior) => ({ ...prior, prompt })),
    onHistorySelect: ({ prompt }: { prompt: string }) => setAssistant((prior) => ({ ...prior, prompt })),
    onNewSession: () => setAssistant((prior) => ({ ...prior, prompt: "", answers: [], skill: null })),
    onSelectSkill: (skill: { id?: string; type: string; title: string }) => setAssistant((prior) => ({ ...prior, skill })),
    onClearSkill: () => setAssistant((prior) => ({ ...prior, skill: null })),
  };

  return (
    <AiInterpreterPage
      logo={content.logo}
      navigation={content.navigation}
      hrefFor={hrefFor}
      hero={interpreter.hero}
      overviewItem={interpreter.overview}
      sidebarTitle={interpreter.sidebarTitle}
      copy={interpreter.copy}
      types={interpreter.types}
      activeType={route.type}
      view={route.type === "Business Term" ? view : {}}
      toast={pageToast}
      assistant={assistantProps}
      onNavigate={({ id, params }) => { if (id === "interpreter") setRoute({ page: "library", type: params.type || "overview" }); }}
    />
  );
}
