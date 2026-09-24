import { Pagination, paginationVariants } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Footer pagination row — total label, rows-per-page select and page controls. “numbered” mirrors `#businessPagination` / `renderPagination` (‹ 1 2 3 ›); “compact” mirrors `fm-pagination` in the Business Term / Scenario libraries (Previous / “page / total” / Next, always plural unit).",
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
    variant: "numbered",
    previousLabel: "Previous",
    nextLabel: "Next",
  },
  argTypes: {
    total: prop("number", { description: "Total item count." }),
    units: prop("[string, string]", { defaultValue: ["asset", "assets"], description: "Singular/plural labels for the total (compact always uses the plural)." }),
    page: prop("number", { defaultValue: 1, description: "Current page (clamped to range)." }),
    pageSize: prop("number", { defaultValue: 10, description: "Rows per page.", control: "inline-radio", options: [10, 20, 50] }),
    pageSizes: prop("Array<number>", { defaultValue: [10, 20, 50], description: "Options in the rows-per-page select." }),
    rowsLabel: prop("string", { defaultValue: "Rows per page", description: "Label on the page-size select." }),
    variant: enumProp(paginationVariants, "numbered", "numbered = ‹ 1 2 3 › page buttons; compact = Previous / “p / total” / Next (fm-pagination)."),
    previousLabel: prop("string", { defaultValue: "Previous", description: "Previous button label (compact only)." }),
    nextLabel: prop("string", { defaultValue: "Next", description: "Next button label (compact only)." }),
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

export const Compact = {
  args: {
    total: 6,
    units: ["record", "records"],
    pageSizes: [5, 10, 20],
    variant: "compact",
  },
};
