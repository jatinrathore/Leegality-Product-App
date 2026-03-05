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

  search: (query: string) => ({
    queryKey: ["products-search", query],
  }),
});

type Resource = {
  list: PaginatedAPIFn<Product>;
  detail: APIFn<Product, { id: string }>;
  categories: APIFn<ProductCategory[]>;
  search: PaginatedAPIFn<Product>;
};

export const ProductResource: Resource = {
  list: (config) => axios.get("/products", config).then((res) => res.data),

  detail: ({ urlParams, ...config }) =>
    axios.get(`/products/${urlParams?.id}`, config).then((res) => res.data),

  categories: (config) =>
    axios.get("/products/categories", config).then((res) => res.data),

  search: (config) =>
    axios.get("/products/search", config).then((res) => res.data),
};
