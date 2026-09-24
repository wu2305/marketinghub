import { KnowledgeLibrary } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { recordMatchesFilter, uniqueFilterOptions } from "../../../cx.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Organisms/Knowledge library",
  component: KnowledgeLibrary,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Generic knowledge list (transition component for the eight type views). `type` drives the toolbar filters and the create entry; `manageable` types get the create button, read-only types do not.",
      },
    },
  },
  args: {
    typeId: "Scenario Reporting",
    query: "",
    filterValues: {},
  },
  argTypes: {
    typeId: { control: "select", options: INTERPRETER.types.map((type) => type.id) },
    onQueryChange: { action: "onQueryChange" },
    onFilterChange: { action: "onFilterChange" },
    onCreate: { action: "onCreate" },
    onSelect: { action: "onSelect" },
  },
  render: function KnowledgeLibraryStory(args) {
    const type = INTERPRETER.types.find((item) => item.id === args.typeId);
    const [query, setQuery] = useSynced(args.query);
    const [filterValues, setFilterValues] = useSynced(args.filterValues);
    const typeRecords = INTERPRETER.records.filter((record) => record.typeId === args.typeId);
    const filters = (type?.statusFilters || []).map((filter) => ({
      ...filter,
      options: filter.options || uniqueFilterOptions(typeRecords, filter.id),
    }));
    const rows = typeRecords.filter((record) => {
      const queryMatch = !query || `${record.title} ${record.summary}`.toLowerCase().includes(query.toLowerCase());
      const filterMatch = filters.every((filter) => {
        const selected = filterValues[filter.id];
        return !selected || recordMatchesFilter(record, filter, selected);
      });
      return queryMatch && filterMatch;
    });
    return (
      <KnowledgeLibrary
        type={{ ...type, statusFilters: filters }}
        query={query}
        filterValues={filterValues}
        rows={rows}
        onQueryChange={(event) => {
          setQuery(event.value);
          args.onQueryChange?.(event);
        }}
        onFilterChange={(event) => {
          setFilterValues((values) => ({ ...values, [event.id]: event.value }));
          args.onFilterChange?.(event);
        }}
        onCreate={args.onCreate}
        onSelect={args.onSelect}
      />
    );
  },
};

export const Default = {};
