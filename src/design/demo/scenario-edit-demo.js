import React from "react";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";

const EMPTY = [];
const INITIAL = {};
const REQUIRED = ["name", "purpose", "scope", "owner", "report"];

export function scenarioEditValuesFor(record, defaults) {
  if (!record) return { ...defaults };
  return {
    ...defaults,
    name: record.name || "",
    purpose: record.purpose || "",
    scope: record.scope || "",
    owner: record.owner || "",
    // The source has no report relationship on a scenario record.
    report: defaults.report,
    logic: record.logic || "",
    output: record.output || "",
    question: record.previewQuestion || "",
  };
}

export function scenarioEditPreviewFor(values, labels) {
  const question = String(values.question || "").trim();
  if (!question) return labels.previewEmpty;
  return `Generating preview for: "${question}"\n\n## Analysis Result\n\nBased on the linked report and uploaded reference materials, the AI would:\n\n1. **Read Materials**: Review the linked report and uploaded documents or screenshots\n2. **Validate Scope**: Check the analysis request, timing, and business coverage\n3. **Execute Logic**: ${values.logic || "Run analysis logic"}\n4. **Generate Output**: ${values.output || "Produce structured output"}\n\n---\n\n*This is a simulated preview. In production, this would execute the actual scenario against live data.*`;
}

/** Local, deterministic Skill Edit flow shared by its stories and consuming host. */
export function useScenarioEditDemo(props) {
  const initial = props.initial || INITIAL;
  const records = props.records || EMPTY;
  const record = records.find((item) => item.id === props.scenarioId) || null;
  const seed = React.useMemo(() => scenarioEditValuesFor(record, props.content.defaults), [record, props.content.defaults]);
  const [values, setValues] = React.useState(() => ({ ...seed, ...initial.values }));
  const [errors, setErrors] = React.useState(initial.errors || {});
  const [preview, setPreview] = React.useState(initial.preview || null);
  React.useEffect(() => { setValues({ ...seed, ...initial.values }); setErrors(initial.errors || {}); setPreview(initial.preview || null); }, [seed, initial]);

  const onChange = ({ field, value }) => { setValues((current) => ({ ...current, [field]: value })); props.onChange?.({ field, value }); };
  const onSubmit = ({ values: submittedValues }) => {
    const nextErrors = Object.fromEntries(REQUIRED.map((field) => [field, !String(submittedValues[field] || "").trim()]));
    setErrors(nextErrors);
    const firstInvalid = REQUIRED.find((field) => nextErrors[field]);
    if (firstInvalid) { props.onValidation?.({ firstInvalid, errors: nextErrors }); return; }
    const payload = { id: record?.id || null, values: { ...submittedValues } };
    props.onSubmit?.(payload);
    window.alert(props.content.labels.submitted);
    const href = props.hrefFor?.("scenario-library", {}) || "scenario-library.html";
    props.onNavigate?.({ id: "scenario-library", params: {}, href, label: props.content.labels.submitted });
  };
  const workspace = useWorkspaceAssistantDemo({
    variant: "lite", initial,
    assistant: { ...props.assistant, open: Boolean(initial.assistantOpen), prompt: initial.assistantPrompt || "", answers: initial.assistantAnswers || EMPTY,
      onOpen: props.onAssistantOpen, onClose: props.onAssistantClose, onSubmit: props.onAssistantSubmit,
      onNewSession: props.onAssistantNewSession, onSelectSkill: props.onAssistantSelectSkill,
      onClearSkill: props.onAssistantClearSkill, onSkillAction: props.onSkillAction,
      onAttach: props.onAssistantAttach, onMaximize: props.onAssistantMaximize, onHistory: props.onAssistantHistory },
    demo: { answerFor: props.answerFor, modelFlow: props.modelFlow, modelDraftFor: props.modelDraftFor },
    onFlowSave: props.onFlowSave, onFlowSubmit: props.onFlowSubmit,
  });
  return {
    content: props.content, logo: props.logo, navigation: props.navigation, hrefFor: props.hrefFor, onNavigate: props.onNavigate,
    form: { values, errors, preview, onChange, onSubmit,
      onRunPreview: ({ question }) => { const output = scenarioEditPreviewFor({ ...values, question }, props.content.labels); setPreview(output); props.onRunPreview?.({ question: question.trim(), output }); },
      onAutoFill: ({ field }) => props.onAutoFill?.({ field }),
      onSaveDraft: () => props.onSaveDraft?.({ values: { ...values } }),
      onSelectFiles: ({ files }) => props.onSelectFiles?.({ files }),
    },
    ...workspace,
  };
}
