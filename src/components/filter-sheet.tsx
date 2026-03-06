import clsx from "clsx";
import { Search, Xmark } from "iconoir-react";
import type { ProductCategory } from "../api/resources/product/types";
import { useEffect, useState } from "react";
import FilterSkeleton from "./skeletons/filter";

type Filters = {
  search: string;
  categories: string[];
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  page: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  categories: ProductCategory[];
  brands: string[];
  filters: Filters;
  onFilterChange: (updates: Partial<Filters>) => void;
  isFiltersLoading: boolean;
};

const FilterSheet = ({
  open,
  onClose,
  categories,
  brands,
  filters,
  onFilterChange,
  isFiltersLoading,
}: Props) => {
  const [price, setPrice] = useState<{ min: string; max: string }>({
    min: filters.minPrice?.toString() ?? "",
    max: filters.maxPrice?.toString() ?? "",
  });

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrice({
      min: filters.minPrice?.toString() ?? "",
      max: filters.maxPrice?.toString() ?? "",
    });
  }, [filters.minPrice, filters.maxPrice]);

  return (
    <div
      className={clsx(
        "bg-[#F3F3F4] rounded-lg p-5 h-fit sticky top-6 transition-all duration-300 min-h-screen z-10 flex flex-col gap-6",
        open
          ? "translate-x-0 opacity-100"
          : "-translate-x-80 opacity-0 pointer-events-none",
      )}
    >
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Filters</h2>

        <button
          onClick={onClose}
          className="cursor-pointer hover:bg-gray-200 p-0.5 rounded-md"
        >
          <Xmark height={20} />
        </button>
      </div>

      <div className="relative w-full">
        <Search
          width={18}
          height={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          disabled={isFiltersLoading}
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="disabled:bg-gray-300 h-9 w-full pl-9 pr-3 border border-gray-200 rounded-md text-black outline-none bg-white"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Categories</h3>

        <div className="max-h-40 overflow-y-auto pr-1">
          {isFiltersLoading ? (
            <FilterSkeleton rows={6} />
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.slug}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="cursor-pointer"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Price Range</h3>

        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="Min"
            disabled={isFiltersLoading}
            value={price.min}
            onChange={(e) =>
              setPrice((prev) => ({ ...prev, min: e.target.value }))
            }
            className="w-1/2 h-9 px-2 border border-gray-200 rounded-md bg-white disabled:bg-gray-300"
          />

          <input
            type="number"
            placeholder="Max"
            disabled={isFiltersLoading}
            value={price.max}
            onChange={(e) =>
              setPrice((prev) => ({ ...prev, max: e.target.value }))
            }
            className="w-1/2 h-9 px-2 border border-gray-200 rounded-md bg-white disabled:bg-gray-300"
          />
        </div>

        <button
          onClick={() =>
            onFilterChange({
              minPrice: price.min ? Number(price.min) : undefined,
              maxPrice: price.max ? Number(price.max) : undefined,
            })
          }
          disabled={isFiltersLoading}
          className="w-full bg-blue-500 text-white text-sm py-2 rounded hover:bg-blue-600 cursor-pointer disabled:bg-gray-400"
        >
          Apply
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Brands</h3>

        <div className="max-h-60 overflow-y-auto pr-1">
          {isFiltersLoading ? (
            <FilterSkeleton rows={8} />
          ) : (
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="cursor-pointer"
                  />
                  {brand}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSheet;
