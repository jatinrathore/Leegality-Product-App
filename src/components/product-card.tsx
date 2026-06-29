import { Link } from "react-router-dom";
import type { Product } from "../api/resources/product/types";
import StarRating from "./star-rating";
import { Badge } from "./ui/badge";
import { formatCurrency, getOriginalPrice, getAvailabilityStyle } from "../lib/utils";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const hasDiscount = product.discountPercentage > 0.5;
  const originalPrice = hasDiscount
    ? getOriginalPrice(product.price, product.discountPercentage)
    : null;
  const availStyle = getAvailabilityStyle(product.availabilityStatus);
  const isLowStock =
    product.availabilityStatus === "Low Stock" ||
    (product.stock > 0 && product.stock <= 10);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-xl"
      aria-label={`${product.title}, ${formatCurrency(product.price)}`}
    >
      <article className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300">
        {/* Image container */}
        <div className="relative mb-3">
          <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-2 right-2">
              <Badge variant="danger" size="sm">
                −{Math.round(product.discountPercentage)}%
              </Badge>
            </div>
          )}
        </div>

        {/* Brand + category row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {product.brand ? (
            <span className="text-xs text-gray-400 font-medium truncate">
              {product.brand}
            </span>
          ) : (
            <span />
          )}
          <Badge variant="muted" size="sm" className="shrink-0">
            {product.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-auto">
          {product.title}
        </h3>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-base font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-xs text-gray-500">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">
            ({product.reviews?.length ?? 0})
          </span>
        </div>

        {/* Availability / stock */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${availStyle.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${availStyle.dot}`} aria-hidden="true" />
            {product.availabilityStatus ?? "In Stock"}
          </span>

          {isLowStock && product.stock > 0 && (
            <span className="text-xs text-amber-600 font-medium">
              {product.stock} left
            </span>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
