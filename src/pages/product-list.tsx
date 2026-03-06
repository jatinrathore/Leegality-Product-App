import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { API } from "../api";
import { APIQueries } from "../api/queries";

import ProductCard from "../components/product-card";
import Pagination from "../components/pagination";
import EmptyPage from "../components/empty-page";
import FilterSheet from "../components/filter-sheet";

import clsx from "clsx";
import { Filter } from "iconoir-react";

import type {
  Product,
  ProductCategory,
  PaginatedResponse,
} from "../api/resources/product/types";
import AppliedFilters from "../components/applied-filters";
import ProductCardSkeleton from "../components/skeletons/product-card";

const LIMIT = 10;

export type Filters = {
  search: string;
  categories: string[];
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  page: number;
};

const ProductListPage = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const productListQuery = useQuery<PaginatedResponse<Product>>({
    queryKey: APIQueries.products.list().queryKey,
    queryFn: () =>
      API.product.list({
        params: {
          limit: 0,
        },
      }),
    staleTime: 1000 * 60 * 60,
  });

  const categoriesQuery = useQuery<ProductCategory[]>({
    queryKey: APIQueries.products.categories().queryKey,
    queryFn: () => API.product.categories(),
    staleTime: 1000 * 60 * 60,
  });

  const allProducts = useMemo<Product[]>(() => {
    return productListQuery.data?.products ?? [];
  }, [productListQuery.data]);

  const categories: ProductCategory[] = categoriesQuery.data ?? [];

  const filters = useMemo<Filters>(() => {
    return {
      search: searchParams.get("search") ?? "",
      categories: searchParams.get("categories")?.split(",") ?? [],
      brands: searchParams.get("brands")?.split(",") ?? [],
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      page: Number(searchParams.get("page") ?? 1),
    };
  }, [searchParams]);

  const updateFilters = (updates: Partial<Filters>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    });

    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  const brands: string[] = useMemo(() => {
    const unique = new Set<string>();

    allProducts.forEach((p) => {
      if (p.brand) unique.add(p.brand);
    });

    return Array.from(unique);
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (
        filters.search &&
        !product.title.toLowerCase().includes(filters.search.toLowerCase())
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

      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [allProducts, filters]);

  const totalPages = Math.ceil(filteredProducts.length / LIMIT);

  const paginatedProducts = filteredProducts.slice(
    (filters.page - 1) * LIMIT,
    filters.page * LIMIT,
  );

  const isLoading = productListQuery.isLoading && !productListQuery.data;
  const isCategoriesLoading =
    categoriesQuery.isLoading && !categoriesQuery.data;

  const isEmpty = !isLoading && paginatedProducts.length === 0;

  return (
    <div className="bg-white p-4 lg:p-8 pb-3!">
      <div
        className={clsx(
          "grid transition-all duration-300",
          filtersOpen
            ? "md:grid-cols-[260px_1fr] gap-6"
            : "grid-cols-[0px_1fr]",
        )}
      >
        <FilterSheet
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          categories={categories}
          brands={brands}
          filters={filters}
          onFilterChange={updateFilters}
          isFiltersLoading={isLoading || isCategoriesLoading}
        />

        <div>
          <div className="flex sm:items-center mb-4 flex-col sm:flex-row items-start gap-4">
            <button
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:shadow transition-all duration-200 cursor-pointer"
            >
              <Filter width={18} height={18} />
              Filters
            </button>

            <AppliedFilters filters={filters} onFilterChange={updateFilters} />
          </div>

          <div className="flex flex-col justify-between h-[90%]">
            <div
              className={clsx(
                "grid items-stretch grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
                {
                  "md:grid-cols-2! lg:grid-cols-3! xl:grid-cols-4!":
                    filtersOpen,
                  "block!": isEmpty,
                },
              )}
            >
              {isLoading &&
                Array.from({ length: LIMIT }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              {isEmpty && <EmptyPage />}
              {!isLoading &&
                paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <div className="flex justify-center m-8">
              <Pagination
                page={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
