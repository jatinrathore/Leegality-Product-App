import { createQueryKeys } from "@lukemorales/query-key-factory";
import type { APIFn, PaginatedAPIFn } from "../../utils";
import type { Product, ProductCategory, ProductFilters } from "./types";
import axios from "../../axios";

export const ProductQueryKey = createQueryKeys("products", {
  list: (filters?: ProductFilters) => ({
    queryKey: ["products-list", filters],
  }),

  detail: (id: number | string) => ({
    queryKey: ["product-detail", id],
  }),

  categories: () => ({
    queryKey: ["product-categories"],
  }),
});

type Resource = {
  list: PaginatedAPIFn<Product>;
  detail: APIFn<Product, { id: number | string }>;
  categories: APIFn<ProductCategory[]>;
};

export const ProductResource: Resource = {
  list: (config) => axios.get("/products", config).then((res) => res.data),

  detail: ({ urlParams, ...config }) =>
    axios.get(`/products/${urlParams?.id}`, config).then((res) => res.data),

  categories: (config) =>
    axios.get("/products/categories", config).then((res) => res.data),
};
