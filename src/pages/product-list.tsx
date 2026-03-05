import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { API } from "../api";
import { APIQueries } from "../api/queries";

import ProductCard from "../components/product-card";
import Pagination from "../components/pagination";
import ProductSkeleton from "../components/product-skeleton";
import EmptyPage from "../components/empty-page";
import FilterSheet from "../components/filter-sheet";

import clsx from "clsx";
import { Filter } from "iconoir-react";

const LIMIT = 10;

const ProductListPage = () => {
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const skip = (page - 1) * LIMIT;

  const productListQuery = useQuery({
    queryKey: APIQueries.products.list({ limit: LIMIT, skip }).queryKey,
    queryFn: () =>
      API.product.list({
        params: {
          limit: LIMIT,
          skip,
        },
      }),
    placeholderData: (prev) => prev,
  });

  const products = productListQuery.data?.products ?? [];
  const total = productListQuery.data?.total ?? 0;

  const totalPages = Math.ceil(total / LIMIT);

  const isLoading = productListQuery.isLoading && !productListQuery.data;
  const isEmpty = !isLoading && products.length === 0;

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
        <FilterSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} />

        <div>
          <button
            onClick={() => setFiltersOpen((prev) => !prev)}
            className="flex w-fit mb-4 items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:shadow transition-all duration-200 cursor-pointer"
          >
            <Filter width={18} height={18} />
            Filters
          </button>

          <div
            className={clsx(
              "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
              {
                "md:grid-cols-2! lg:grid-cols-3! xl:grid-cols-4!": filtersOpen,
                block: isEmpty,
              },
            )}
          >
            {isLoading &&
              Array.from({ length: LIMIT }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}

            {isEmpty && <EmptyPage />}

            {!isLoading &&
              products.length > 0 &&
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>

          <div className="flex justify-center m-8">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
