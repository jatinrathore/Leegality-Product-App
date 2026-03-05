import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "iconoir-react";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  if (totalPages <= 0) return null;

  const visiblePages = 4;

  const startPage = Math.max(1, Math.min(page, totalPages - visiblePages + 1));

  const endPage = Math.min(startPage + visiblePages - 1, totalPages);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <button
        className="px-3 py-1 shadow shadow-gray-400 disabled:cursor-not-allowed cursor-pointer rounded disabled:opacity-50 flex items-center gap-1"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ArrowLeft height={16} /> Previous
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={clsx("px-3 py-1 shadow shadow-gray-400 rounded", {
            "bg-blue-500 text-white": page === pageNumber,
            "bg-white": page !== pageNumber,
          })}
        >
          {pageNumber}
        </button>
      ))}

      <button
        className="px-3 py-1 shadow shadow-gray-400 disabled:cursor-not-allowed cursor-pointer rounded disabled:opacity-50 flex items-center gap-1"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next <ArrowRight height={16} />
      </button>
    </div>
  );
};

export default Pagination;
