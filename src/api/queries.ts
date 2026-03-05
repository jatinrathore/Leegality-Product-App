import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { ProductQueryKey } from "./resources/product";

export const APIQueries = mergeQueryKeys(ProductQueryKey);
