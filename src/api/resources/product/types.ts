export type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type Dimensions = {
  width: number;
  height: number;
  depth: number;
};

export type ProductMeta = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  category: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: "In Stock" | "Low Stock" | "Out of Stock";
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  thumbnail: string;
  images: string[];
  reviews: Review[];
};

export type ProductCategory = {
  slug: string;
  name: string;
  url: string;
};

export type PaginatedResponse<T> = {
  products: T[];
  total: number;
  skip: number;
  limit: number;
};

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "name-asc"
  | "name-desc";

export type ProductFilters = {
  limit?: number;
  skip?: number;
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
};
