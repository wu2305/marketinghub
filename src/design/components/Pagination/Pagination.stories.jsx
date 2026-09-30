import { Pagination, paginationVariants } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("Footer pagination row — total label, rows-per-page select and page controls. “numbered” mirrors `#businessPagination` / `renderPagination` (‹ 1 2 3 ›); “compact” mirrors `fm-pagination` in the Business Term / Scenario libraries (Previous / “page / total” / Next, always plural unit).", "底部分页行：总数文字、每页条数选择和翻页控件。\"numbered\" 对应 `#businessPagination` / `renderPagination`（‹ 1 2 3 ›）；\"compact\" 对应 Business Term / Scenario 库中的 `fm-pagination`（Previous / \"page / total\" / Next，单位始终用复数）。"),
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
    total: prop("number", { description: bi("Total item count.", "条目总数。") }),
    units: prop("[string, string]", { defaultValue: ["asset", "assets"], description: bi("Singular/plural labels for the total (compact always uses the plural).", "总数文字的单数/复数标签（compact 始终使用复数）。") }),
    page: prop("number", { defaultValue: 1, description: bi("Current page (clamped to range).", "当前页（会限制在有效范围内）。") }),
    pageSize: prop("number", { defaultValue: 10, description: bi("Rows per page.", "每页条数。"), control: "inline-radio", options: [10, 20, 50] }),
    pageSizes: prop("Array<number>", { defaultValue: [10, 20, 50], description: bi("Options in the rows-per-page select.", "每页条数选择框中的选项。") }),
    rowsLabel: prop("string", { defaultValue: "Rows per page", description: bi("Label on the page-size select.", "页大小选择框的标签。") }),
    variant: enumProp(paginationVariants, "numbered", bi("numbered = ‹ 1 2 3 › page buttons; compact = Previous / “p / total” / Next (fm-pagination).", "numbered = ‹ 1 2 3 › 页码按钮；compact = Previous / \"p / total\" / Next（fm-pagination）。")),
    previousLabel: prop("string", { defaultValue: "Previous", description: bi("Previous button label (compact only).", "上一页按钮文字（仅 compact）。") }),
    nextLabel: prop("string", { defaultValue: "Next", description: bi("Next button label (compact only).", "下一页按钮文字（仅 compact）。") }),
    onPage: callbackProp("onPage", "(event: { page: number }) => void", { page: 2 }, bi("Fired when a page button is clicked.", "点击页码按钮时触发。")),
    onPageSize: callbackProp(
      "onPageSize",
      "(event: { pageSize: number }) => void",
      { pageSize: 20 },
      bi("Fired when the rows-per-page select changes.", "每页条数选择变化时触发。"),
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
