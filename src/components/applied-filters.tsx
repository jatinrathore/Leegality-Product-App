import { Xmark } from "iconoir-react";
import clsx from "clsx";
import type { Filters } from "../pages/product-list";

type Props = {
  filters: Filters;
  onFilterChange: (updates: Partial<Filters>) => void;
};

const AppliedFilters = ({ filters, onFilterChange }: Props) => {
  const hasFilters =
    filters.search ||
    filters.categories.length ||
    filters.brands.length ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 ml-3">
      {filters.search && (
        <Chip
          label={`Search: ${filters.search}`}
          onRemove={() => onFilterChange({ search: "" })}
        />
      )}

      {filters.categories.length > 0 && (
        <Chip
          label={`Category : ${filters.categories.join(", ")}`}
          onRemove={() => onFilterChange({ categories: [] })}
        />
      )}

      {filters.brands.length > 0 && (
        <Chip
          label={`Brand : ${filters.brands.join(", ")}`}
          onRemove={() => onFilterChange({ brands: [] })}
        />
      )}

      {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
        <Chip
          label={`Price : ${filters.minPrice ?? 0} - ${filters.maxPrice ?? "∞"}`}
          onRemove={() =>
            onFilterChange({ minPrice: undefined, maxPrice: undefined })
          }
        />
      )}

      <button
        onClick={() =>
          onFilterChange({
            search: "",
            categories: [],
            brands: [],
            minPrice: undefined,
            maxPrice: undefined,
          })
        }
        className="text-sm text-blue-600 hover:underline cursor-pointer ml-1"
      >
        Clear All
      </button>
    </div>
  );
};

export default AppliedFilters;

const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 border border-gray-200 rounded-full",
      )}
    >
      {label}

      <button
        onClick={onRemove}
        className="hover:bg-gray-200 rounded-full p-0.5 mt-0.5"
      >
        <Xmark width={14} height={14} />
      </button>
    </div>
  );
};
