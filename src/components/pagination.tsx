import clsx from "clsx";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("…");
  pages.push(total);

  return pages;
}

const Pagination = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: Props) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
      {/* Results count */}
      <p className="text-sm text-gray-500 shrink-0">
        Showing{" "}
        <span className="font-medium text-gray-700">
          {from}–{to}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-700">{totalItems}</span> products
      </p>

      {/* Page controls */}
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <NavArrowLeft width={14} height={14} />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-sm text-gray-400"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={page === p ? "page" : undefined}
              className={clsx(
                "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                page === p
                  ? "bg-indigo-600 text-white border border-indigo-600"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <NavArrowRight width={14} height={14} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
