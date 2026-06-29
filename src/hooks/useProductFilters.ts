import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { SortOption } from "../api/resources/product/types";

export type Filters = {
  search: string;
  categories: string[];
  brands: string[];
  availability: string[];
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;
  page: number;
};

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<Filters>(() => {
    return {
      search: searchParams.get("search") ?? "",
      categories: searchParams.get("categories")
        ? searchParams.get("categories")!.split(",").filter(Boolean)
        : [],
      brands: searchParams.get("brands")
        ? searchParams.get("brands")!.split(",").filter(Boolean)
        : [],
      availability: searchParams.get("availability")
        ? searchParams.get("availability")!.split(",").filter(Boolean)
        : [],
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      sort: (searchParams.get("sort") as SortOption) ?? "default",
      page: Number(searchParams.get("page") ?? 1),
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (updates: Partial<Filters>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === "" ||
          value === "default" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          params.delete(key);
        } else {
          params.set(
            key,
            Array.isArray(value) ? value.join(",") : String(value),
          );
        }
      });

      // Reset to page 1 on any filter change (except explicit page changes)
      if (!("page" in updates)) {
        params.set("page", "1");
      }

      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(page));
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length) count++;
    if (filters.brands.length) count++;
    if (filters.availability.length) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined)
      count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearAllFilters,
    handlePageChange,
    activeFilterCount,
  };
}
