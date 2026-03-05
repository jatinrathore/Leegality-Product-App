import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { API } from "../api";
import { APIQueries } from "../api/queries";

import ProductCard from "../components/product-card";
import Pagination from "../components/pagination";
import ProductSkeleton from "../components/product-skeleton";
import EmptyPage from "../components/empty-page";
import clsx from "clsx";

const LIMIT = 10;

const ProductListPage = () => {
  const [page, setPage] = useState(1);

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
    <div className="bg-white flex flex-col justify-between min-h-[90vh] p-4 sm:p-8 pb-3">
      <div
        className={clsx(
          "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4",
          {
            "block!": isEmpty,
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

      <div className="flex justify-center mt-8">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ProductListPage;
