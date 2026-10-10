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
          bi("This component is a pagination row. It shows the total, a rows-per-page list, and page controls. `numbered` shows page buttons (‹ 1 2 3 ›). `compact` shows Previous, the current page and the total, and Next. `compact` always uses the plural unit.\n\n**When to use.** Use this component below any paged list. Choose `numbered` for page buttons, or `compact` for Previous and Next. The container owns the current page and slices the data. **Used in:** Principles, Business Term library, Scenario Reports, Report Context, Metric Dictionary, Analytical Model, and Email Reports.", "这个组件是分页行。它显示总数、每页条数列表和翻页控件。`numbered` 显示页码按钮（‹ 1 2 3 ›）。`compact` 显示 Previous、当前页与总页数、以及 Next。`compact` 始终使用复数单位。\n\n**何时使用。** 用在任何分页列表的下方。需要页码按钮时选 `numbered`，需要 Previous / Next 时选 `compact`。当前页与数据切片由容器负责。**使用位置：** Principles、Business Term library、Scenario Reports、Report Context、Metric Dictionary、Analytical Model 与 Email Reports。"),
      },
    },
  },
  args: {
    total: 35,
    units: ["asset", "assets"],
    page: 1,
    pageSize: 6,
    pageSizes: [6, 12, 24],
    rowsLabel: "Items per page",
    variant: "numbered",
    previousLabel: "Previous",
    nextLabel: "Next",
  },
  argTypes: {
    total: prop("number", { description: bi("Total item count.", "条目总数。") }),
    units: prop("[string, string]", { defaultValue: ["asset", "assets"], description: bi("Singular and plural labels for the total. `compact` always uses the plural.", "总数文字的单数和复数标签。`compact` 始终使用复数。") }),
    page: prop("number", { defaultValue: 1, description: bi("Current page. The value is kept inside the valid range.", "当前页。数值会限制在有效范围内。") }),
    pageSize: prop("number", { defaultValue: 6, description: bi("Items per page.", "每页条数。"), control: "inline-radio", options: [6, 12, 24] }),
    pageSizes: prop("Array<number>", { defaultValue: [6, 12, 24], description: bi("Options in the rows-per-page list.", "每页条数选择框中的选项。") }),
    rowsLabel: prop("string", { defaultValue: "Items per page", description: bi("Label on the page-size list.", "页大小选择框的标签。") }),
    variant: enumProp(paginationVariants, "numbered", bi("`numbered` shows page buttons (‹ 1 2 3 ›). `compact` shows Previous, the current page and the total, and Next.", "`numbered` 显示页码按钮（‹ 1 2 3 ›）。`compact` 显示 Previous、当前页与总页数、以及 Next。")),
    previousLabel: prop("string", { defaultValue: "Previous", description: bi("Previous button label. Use this with `compact`.", "上一页按钮文字。与 `compact` 一起使用。") }),
    nextLabel: prop("string", { defaultValue: "Next", description: bi("Next button label. Use this with `compact`.", "下一页按钮文字。与 `compact` 一起使用。") }),
    onPage: callbackProp("onPage", "(event: { page: number }) => void", { page: 2 }, bi("The function runs when the user selects a page. The result has `page`.", "用户选择某一页时会调用这个函数。结果里带有 `page`。")),
    onPageSize: callbackProp(
      "onPageSize",
      "(event: { pageSize: number }) => void",
      { pageSize: 20 },
      bi("The function runs when the user changes rows per page. The result has `pageSize`.", "用户改变每页条数时会调用这个函数。结果里带有 `pageSize`。"),
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
    pageSizes: [6, 12, 24],
    variant: "compact",
  },
};
