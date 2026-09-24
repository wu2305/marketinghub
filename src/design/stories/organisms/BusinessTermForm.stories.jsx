import { BusinessTermForm } from "../../organisms.jsx";
import { useSynced } from "../story-helpers.js";

export default {
  title: "Organisms/Business term form",
  component: BusinessTermForm,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Business Term create/edit form (Title, Term Type, Description, Synonyms). `invalid` turns on required-field error styling; callers pass it after a failed submit so empty required fields are marked.",
      },
    },
  },
  args: { title: "", kind: "Business Term", description: "", synonyms: "", invalid: false },
  argTypes: {
    kind: { control: "select", options: ["Business Term", "Global Synonym"] },
    onChange: { action: "onChange" },
    onCancel: { action: "onCancel" },
    onSave: { action: "onSave" },
    onSubmit: { action: "onSubmit" },
  },
  render: function BusinessTermFormStory(args) {
    const [title, setTitle] = useSynced(args.title);
    const [kind, setKind] = useSynced(args.kind);
    const [description, setDescription] = useSynced(args.description);
    const [synonyms, setSynonyms] = useSynced(args.synonyms);
    const setters = { title: setTitle, kind: setKind, description: setDescription, synonyms: setSynonyms };
    return (
      <BusinessTermForm
        {...args}
        title={title}
        kind={kind}
        description={description}
        synonyms={synonyms}
        onChange={(event) => {
          setters[event.name]?.(event.value);
          args.onChange?.(event);
        }}
      />
    );
  },
};

export const Default = {};
