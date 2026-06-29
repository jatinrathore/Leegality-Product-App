import clsx from "clsx";
import { Search, Xmark } from "iconoir-react";
import type { ProductCategory } from "../api/resources/product/types";
import type { SortOption } from "../api/resources/product/types";
import { useState, useEffect } from "react";
import FilterSkeleton from "./skeletons/filter";
import { Button } from "./ui/button";
import type { Filters } from "../hooks/useProductFilters";

type Props = {
  open: boolean;
  onClose: () => void;
  categories: ProductCategory[];
  brands: string[];
  filters: Filters;
  onFilterChange: (updates: Partial<Filters>) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  isFiltersLoading: boolean;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
];

const AVAILABILITY_OPTIONS = ["In Stock", "Low Stock", "Out of Stock"];

const FilterSheet = ({
  open,
  onClose,
  categories,
  brands,
  filters,
  onFilterChange,
  onClearAll,
  activeFilterCount,
  isFiltersLoading,
}: Props) => {
  const [catSearch, setCatSearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [price, setPrice] = useState<{ min: string; max: string }>({
    min: filters.minPrice?.toString() ?? "",
    max: filters.maxPrice?.toString() ?? "",
  });

  useEffect(() => {
    setPrice({
      min: filters.minPrice?.toString() ?? "",
      max: filters.maxPrice?.toString() ?? "",
    });
  }, [filters.minPrice, filters.maxPrice]);

  const toggleCategory = (slug: string) => {
    const updated = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onFilterChange({ categories: updated });
  };

  const toggleBrand = (brand: string) => {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ brands: updated });
  };

  const toggleAvailability = (status: string) => {
    const updated = filters.availability.includes(status)
      ? filters.availability.filter((a) => a !== status)
      : [...filters.availability, status];
    onFilterChange({ availability: updated });
  };

  const applyPrice = () => {
    onFilterChange({
      minPrice: price.min ? Number(price.min) : undefined,
      maxPrice: price.max ? Number(price.max) : undefined,
    });
  };

  const filteredCats = categories.filter((c) =>
    c.name.toLowerCase().includes(catSearch.toLowerCase()),
  );
  const filteredBrands = brands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase()),
  );

  return (
    <aside
      aria-label="Filters panel"
      aria-hidden={!open}
      className={clsx(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden",
        open
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-4 pointer-events-none",
      )}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900 text-sm">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-semibold">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-gray-400 hover:text-gray-700 text-xs"
              >
                Clear all
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close filters"
            >
              <Xmark height={16} />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-6">
          {/* Sort */}
          <div>
            <label
              htmlFor="sort-select"
              className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
            >
              Sort by
            </label>
            <select
              id="sort-select"
              value={filters.sort}
              onChange={(e) =>
                onFilterChange({ sort: e.target.value as SortOption })
              }
              className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Availability
            </p>
            <div className="space-y-2">
              {AVAILABILITY_OPTIONS.map((status) => {
                const checked = filters.availability.includes(status);
                return (
                  <label
                    key={status}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={checked}
                      onChange={() => toggleAvailability(status)}
                      aria-checked={checked}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      {status}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Price Range
            </p>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Min"
                  value={price.min}
                  min={0}
                  onChange={(e) =>
                    setPrice((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-full h-9 pl-6 pr-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Max"
                  value={price.max}
                  min={0}
                  onChange={(e) =>
                    setPrice((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-full h-9 pl-6 pr-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={applyPrice}
              className="w-full"
            >
              Apply Price
            </Button>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Categories
              {filters.categories.length > 0 && (
                <span className="ml-1.5 text-indigo-600">
                  ({filters.categories.length})
                </span>
              )}
            </p>
            <div className="relative mb-2">
              <Search
                width={12}
                height={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search categories…"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                className="w-full h-8 pl-7 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {isFiltersLoading ? (
                <FilterSkeleton rows={6} />
              ) : filteredCats.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No categories found</p>
              ) : (
                filteredCats.map((cat) => {
                  const checked = filters.categories.includes(cat.slug);
                  return (
                    <label
                      key={cat.slug}
                      className="flex items-center gap-2.5 cursor-pointer group py-0.5"
                    >
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(cat.slug)}
                        aria-checked={checked}
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors capitalize truncate">
                        {cat.name}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Brands */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Brands
              {filters.brands.length > 0 && (
                <span className="ml-1.5 text-indigo-600">
                  ({filters.brands.length})
                </span>
              )}
            </p>
            <div className="relative mb-2">
              <Search
                width={12}
                height={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search brands…"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full h-8 pl-7 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
              {isFiltersLoading ? (
                <FilterSkeleton rows={8} />
              ) : filteredBrands.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No brands found</p>
              ) : (
                filteredBrands.map((brand) => {
                  const checked = filters.brands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className="flex items-center gap-2.5 cursor-pointer group py-0.5"
                    >
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={checked}
                        onChange={() => toggleBrand(brand)}
                        aria-checked={checked}
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors truncate">
                        {brand}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSheet;
