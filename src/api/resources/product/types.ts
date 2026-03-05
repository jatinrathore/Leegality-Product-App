export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

export type PaginatedResponse<T> = {
  products: T[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductFilters = {
  limit?: number;
  skip?: number;
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
};
