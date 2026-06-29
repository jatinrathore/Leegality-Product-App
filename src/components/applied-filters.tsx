import { Xmark } from "iconoir-react";
import type { Filters } from "../hooks/useProductFilters";

type Props = {
  filters: Filters;
  onFilterChange: (updates: Partial<Filters>) => void;
  onClearAll: () => void;
};

type ChipProps = {
  label: string;
  onRemove: () => void;
};

const Chip = ({ label, onRemove }: ChipProps) => (
  <span className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full transition-all hover:bg-indigo-100">
    {label}
    <button
      onClick={onRemove}
      className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-indigo-200 transition-colors"
      aria-label={`Remove ${label} filter`}
    >
      <Xmark width={10} height={10} />
    </button>
  </span>
);

const AppliedFilters = ({ filters, onFilterChange, onClearAll }: Props) => {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.search) {
    chips.push({
      label: `"${filters.search}"`,
      onRemove: () => onFilterChange({ search: "" }),
    });
  }

  filters.categories.forEach((cat) => {
    chips.push({
      label: cat.replace(/-/g, " "),
      onRemove: () =>
        onFilterChange({
          categories: filters.categories.filter((c) => c !== cat),
        }),
    });
  });

  filters.brands.forEach((brand) => {
    chips.push({
      label: brand,
      onRemove: () =>
        onFilterChange({ brands: filters.brands.filter((b) => b !== brand) }),
    });
  });

  filters.availability.forEach((status) => {
    chips.push({
      label: status,
      onRemove: () =>
        onFilterChange({
          availability: filters.availability.filter((a) => a !== status),
        }),
    });
  });

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const label = [
      filters.minPrice !== undefined ? `$${filters.minPrice}` : "$0",
      "–",
      filters.maxPrice !== undefined ? `$${filters.maxPrice}` : "∞",
    ].join(" ");
    chips.push({
      label,
      onRemove: () => onFilterChange({ minPrice: undefined, maxPrice: undefined }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Active filters"
    >
      {chips.map((chip, i) => (
        <Chip key={i} label={chip.label} onRemove={chip.onRemove} />
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors ml-1"
      >
        Clear all
      </button>
    </div>
  );
};

export default AppliedFilters;
