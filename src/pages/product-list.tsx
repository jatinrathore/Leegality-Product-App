import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterList } from "iconoir-react";

import { API } from "../api";
import { APIQueries } from "../api/queries";
import { useProductFilters } from "../hooks/useProductFilters";

import ProductCard from "../components/product-card";
import Pagination from "../components/pagination";
import EmptyState from "../components/empty-page";
import FilterSheet from "../components/filter-sheet";
import AppliedFilters from "../components/applied-filters";
import ProductCardSkeleton from "../components/skeletons/product-card";
import { Button } from "../components/ui/button";

import type {
  Product,
  ProductCategory,
  PaginatedResponse,
  SortOption,
} from "../api/resources/product/types";

const PAGE_SIZE = 12;

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const arr = [...products];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "rating-desc":
      return arr.sort((a, b) => b.rating - a.rating);
    case "name-asc":
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return arr.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return arr;
  }
}

const ProductListPage = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    filters,
    updateFilters,
    clearAllFilters,
    handlePageChange,
    activeFilterCount,
  } = useProductFilters();

  const productListQuery = useQuery<PaginatedResponse<Product>>({
    queryKey: APIQueries.products.list().queryKey,
    queryFn: () => API.product.list({ params: { limit: 0 } }),
  });

  const categoriesQuery = useQuery<ProductCategory[]>({
    queryKey: APIQueries.products.categories().queryKey,
    queryFn: () => API.product.categories(),
  });

  const allProducts = useMemo<Product[]>(
    () => productListQuery.data?.products ?? [],
    [productListQuery.data],
  );

  const categories: ProductCategory[] = categoriesQuery.data ?? [];

  const brands = useMemo<string[]>(() => {
    const unique = new Set<string>();
    allProducts.forEach((p) => {
      if (p.brand) unique.add(p.brand);
    });
    return Array.from(unique).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((product) => {
      if (
        filters.search &&
        !product.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.description?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }
      if (
        filters.brands.length > 0 &&
        !filters.brands.includes(product.brand)
      ) {
        return false;
      }
      if (
        filters.availability.length > 0 &&
        !filters.availability.includes(product.availabilityStatus)
      ) {
        return false;
      }
      if (
        filters.minPrice !== undefined &&
        product.price < filters.minPrice
      ) {
        return false;
      }
      if (
        filters.maxPrice !== undefined &&
        product.price > filters.maxPrice
      ) {
        return false;
      }
      return true;
    });

    result = sortProducts(result, filters.sort);
    return result;
  }, [allProducts, filters]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (filters.page - 1) * PAGE_SIZE,
        filters.page * PAGE_SIZE,
      ),
    [filteredProducts, filters.page],
  );

  const isLoading = productListQuery.isLoading;
  const isError = productListQuery.isError;
  const isCategoriesLoading = categoriesQuery.isLoading;
  const isEmpty = !isLoading && !isError && filteredProducts.length === 0;
  const hasActiveFilters = activeFilterCount > 0;

  const handleToggleFilters = useCallback(() => {
    setFiltersOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-indigo-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page header */}
        <div className="mb-3">
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          {!isLoading && (
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredProducts.length.toLocaleString()} products available
            </p>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleToggleFilters}
            aria-expanded={filtersOpen}
            aria-controls="filter-panel"
            iconLeft={<FilterList width={15} height={15} />}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white text-xs font-semibold">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <AppliedFilters
              filters={filters}
              onFilterChange={updateFilters}
              onClearAll={clearAllFilters}
            />
          )}
        </div>

        {/* Main layout */}
        <div
          className={`grid transition-all duration-300 ${
            filtersOpen
              ? "md:grid-cols-[260px_1fr] gap-5"
              : "grid-cols-[0px_1fr]"
          }`}
        >
          {/* Filter sidebar — always in DOM so CSS transition works */}
          <div
            id="filter-panel"
            className="overflow-hidden"
            aria-hidden={!filtersOpen}
          >
            <FilterSheet
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              categories={categories}
              brands={brands}
              filters={filters}
              onFilterChange={updateFilters}
              onClearAll={clearAllFilters}
              activeFilterCount={activeFilterCount}
              isFiltersLoading={isLoading || isCategoriesLoading}
            />
          </div>

          {/* Content area */}
          <div>
            {/* Error state */}
            {isError && (
              <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-800">
                    Failed to load products
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Check your connection and try again.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => productListQuery.refetch()}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Loading grid */}
            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {isEmpty && (
              <EmptyState
                isFiltered={hasActiveFilters}
                onClearFilters={hasActiveFilters ? clearAllFilters : undefined}
              />
            )}

            {/* Product grid */}
            {!isLoading && !isError && paginatedProducts.length > 0 && (
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 gap-4 ${
                  filtersOpen
                    ? "md:grid-cols-2 lg:grid-cols-3"
                    : "lg:grid-cols-4 xl:grid-cols-5"
                }`}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !isError && totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  page={filters.page}
                  totalPages={totalPages}
                  totalItems={filteredProducts.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
