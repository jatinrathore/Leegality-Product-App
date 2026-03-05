import type { AxiosRequestConfig } from "axios";

type ReturnType<T> = Promise<T>;

export type APIFn<TResponse, P = void> = P extends void
  ? (config?: AxiosRequestConfig) => ReturnType<TResponse>
  : (config: AxiosRequestConfig & { urlParams: P }) => ReturnType<TResponse>;

export type PaginatedAPIFn<TItem, P = void> = P extends void
  ? (config?: AxiosRequestConfig) => ReturnType<{
      products: TItem[];
      total: number;
      skip: number;
      limit: number;
    }>
  : (config: AxiosRequestConfig & { urlParams: P }) => ReturnType<{
      products: TItem[];
      total: number;
      skip: number;
      limit: number;
    }>;
