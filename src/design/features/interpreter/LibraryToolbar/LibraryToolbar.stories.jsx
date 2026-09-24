import { LibraryToolbar } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Organisms/Library toolbar",
  component: LibraryToolbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Toolbar above the knowledge list: per-type filters, search, create action.",
      },
    },
  },
  args: { typeId: "Business Term", query: "", filterValues: {} },
  argTypes: {
    typeId: { control: "select", options: INTERPRETER.types.map((type) => type.id) },
    onQueryChange: { action: "onQueryChange" },
    onFilterChange: { action: "onFilterChange" },
    onCreate: { action: "onCreate" },
  },
  render: function LibraryToolbarStory(args) {
    const type = INTERPRETER.types.find((item) => item.id === args.typeId);
    const [query, setQuery] = useSynced(args.query);
    const [filterValues, setFilterValues] = useSynced(args.filterValues);
    return (
      <LibraryToolbar
        filters={type?.statusFilters || []}
        filterValues={filterValues}
        query={query}
        createLabel={type?.manageable ? type.createLabel : undefined}
        onQueryChange={(event) => {
          setQuery(event.value);
          args.onQueryChange?.(event);
        }}
        onFilterChange={(event) => {
          setFilterValues((values) => ({ ...values, [event.id]: event.value }));
          args.onFilterChange?.(event);
        }}
        onCreate={args.onCreate}
      />
    );
  },
};

export const Default = {};
