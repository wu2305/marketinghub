import { Pagination } from "../../molecules.jsx";
import { callbackProp, prop, useSynced } from "../story-helpers.js";

export default {
  title: "Molecules/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Footer pagination row — total label, rows-per-page select and ‹ 1 2 3 › buttons. Mirrors `#businessPagination` / `renderPagination` in the original.",
      },
    },
  },
  args: {
    total: 35,
    units: ["asset", "assets"],
    page: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50],
    rowsLabel: "Rows per page",
  },
  argTypes: {
    total: prop("number", { description: "Total item count." }),
    units: prop("[string, string]", { defaultValue: ["asset", "assets"], description: "Singular/plural labels for the total." }),
    page: prop("number", { defaultValue: 1, description: "Current page (clamped to range)." }),
    pageSize: prop("number", { defaultValue: 10, description: "Rows per page.", control: "inline-radio", options: [10, 20, 50] }),
    pageSizes: prop("Array<number>", { defaultValue: [10, 20, 50], description: "Options in the rows-per-page select." }),
    rowsLabel: prop("string", { defaultValue: "Rows per page", description: "Label on the page-size select." }),
    onPage: callbackProp("onPage", "(event: { page: number }) => void", { page: 2 }, "Fired when a page button is clicked."),
    onPageSize: callbackProp(
      "onPageSize",
      "(event: { pageSize: number }) => void",
      { pageSize: 20 },
      "Fired when the rows-per-page select changes.",
    ),
  },
  render: function PaginationStory(args) {
    const [page, setPage] = useSynced(args.page);
    const [pageSize, setPageSize] = useSynced(args.pageSize);
    return (
      <div style={{ maxWidth: 720 }}>
        <Pagination
          {...args}
          page={page}
          pageSize={pageSize}
          onPage={(event) => {
            setPage(event.page);
            args.onPage?.(event);
          }}
          onPageSize={(event) => {
            setPageSize(event.pageSize);
            setPage(1);
            args.onPageSize?.(event);
          }}
        />
      </div>
    );
  },
};

export const Default = {};
