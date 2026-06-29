import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  NavArrowLeft,
  NavArrowRight,
  QrCode,
  Package,
  Truck,
  ShieldCheck,
  RefreshDouble,
  InfoCircle,
  NavArrowLeft as BreadArrow,
} from "iconoir-react";

import { API } from "../api";
import { APIQueries } from "../api/queries";
import StarRating from "../components/star-rating";
import ProductDetailSkeleton from "../components/skeletons/product-detail";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ShareQRModal } from "../components/share-qr-modal";
import {
  formatCurrency,
  getOriginalPrice,
  getAvailabilityStyle,
  getInitials,
  getAvatarColor,
  formatDate,
  copyToClipboard,
} from "../lib/utils";

import type { Product, Review } from "../api/resources/product/types";

/* ─── Rating Distribution ─── */
function getRatingDistribution(reviews: Review[]) {
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    const key = Math.round(r.rating);
    if (key >= 1 && key <= 5) dist[key]++;
  });
  return dist;
}

/* ─── Info Card ─── */
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
      <div className="text-indigo-400 mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-800 font-medium mt-0.5 leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─── Review Card ─── */
function ReviewCard({ review }: { review: Review }) {
  const initials = getInitials(review.reviewerName);
  const avatarColor = getAvatarColor(review.reviewerName);
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${avatarColor}`}
          title={review.reviewerEmail}
          aria-label={`Reviewer: ${review.reviewerName}`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">
              {review.reviewerName}
            </span>
            <span className="text-xs text-gray-400">{formatDate(review.date)}</span>
          </div>
          <div className="mt-1 mb-2">
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageIndex, setImageIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  const productQuery = useQuery<Product>({
    queryKey: APIQueries.products.detail(id!).queryKey,
    queryFn: () => API.product.detail({ urlParams: { id: id ?? "" } }),
    enabled: !!id,
  });

  const product = productQuery.data;

  const handleCopySku = useCallback(async (sku: string) => {
    await copyToClipboard(sku);
  }, []);

  if (productQuery.isLoading) return <ProductDetailSkeleton />;

  if (productQuery.isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <InfoCircle className="w-7 h-7 text-red-400" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">
            Product not found
          </p>
          <p className="text-sm text-gray-500 mt-1 max-w-xs">
            This product may have been removed or does not exist.
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate(-1)}
          iconLeft={<NavArrowLeft width={15} height={15} />}
        >
          Go back
        </Button>
      </div>
    );
  }

  const images =
    product.images?.length > 0 ? product.images : [product.thumbnail];
  const hasDiscount = product.discountPercentage > 0.5;
  const originalPrice = hasDiscount
    ? getOriginalPrice(product.price, product.discountPercentage)
    : null;
  const availStyle = getAvailabilityStyle(product.availabilityStatus);
  const ratingDist = product.reviews?.length
    ? getRatingDistribution(product.reviews)
    : null;
  const avgRating =
    product.reviews?.length
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : product.rating;

  const nextImage = () => setImageIndex((p) => (p + 1) % images.length);
  const prevImage = () =>
    setImageIndex((p) => (p - 1 + images.length) % images.length);

  const productUrl = window.location.href;

  return (
    <div className="min-h-screen bg-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-5 text-sm">
          <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            Products
          </Link>
          <BreadArrow width={12} height={12} className="text-gray-300" />
          <span className="text-gray-400 capitalize">{product.category}</span>
          <BreadArrow width={12} height={12} className="text-gray-300" />
          <span className="text-gray-700 font-medium truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm mb-5">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* ── Left: Image Gallery ── */}
            <div>
              <div className="relative aspect-square flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden border border-gray-100 mb-3">
                <img
                  src={images[imageIndex]}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain p-4 transition-opacity duration-200"
                  loading="eager"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <NavArrowLeft width={14} height={14} />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <NavArrowRight width={14} height={14} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-current={imageIndex === i ? "true" : undefined}
                      className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all bg-gray-50 ${
                        imageIndex === i
                          ? "border-indigo-500 ring-2 ring-indigo-100"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-contain p-1"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Product Info ── */}
            <div className="flex flex-col gap-4">
              {/* Top badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="accent" size="sm" className="capitalize">
                  {product.category}
                </Badge>
                {product.tags?.map((tag) => (
                  <Badge key={tag} variant="muted" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-snug">
                  {product.title}
                </h1>
                {product.brand && (
                  <p className="text-sm text-gray-500 mt-1">by {product.brand}</p>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${availStyle.text} ${availStyle.bg} ${availStyle.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${availStyle.dot}`} aria-hidden="true" />
                  {product.availabilityStatus}
                </span>
                {product.stock > 0 && (
                  <span className="text-xs text-gray-500">
                    {product.stock} units in stock
                  </span>
                )}
                {product.sku && (
                  <button
                    onClick={() => handleCopySku(product.sku)}
                    className="text-xs text-gray-400 hover:text-gray-600 font-mono transition-colors"
                    title="Copy SKU"
                  >
                    SKU: {product.sku}
                  </button>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatCurrency(originalPrice)}
                    </span>
                    <Badge variant="danger" size="md">
                      −{Math.round(product.discountPercentage)}% off
                    </Badge>
                  </>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} size="md" />
                <span className="text-sm font-semibold text-gray-800">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  ({product.reviews?.length ?? 0} reviews)
                </span>
              </div>

              <div className="border-t border-gray-100" />

              {/* Description */}
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-1.5">
                  About this product
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Info cards grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <InfoCard
                  icon={<Truck width={16} height={16} />}
                  label="Shipping"
                  value={product.shippingInformation}
                />
                <InfoCard
                  icon={<ShieldCheck width={16} height={16} />}
                  label="Warranty"
                  value={product.warrantyInformation}
                />
                <InfoCard
                  icon={<RefreshDouble width={16} height={16} />}
                  label="Returns"
                  value={product.returnPolicy}
                />
                <InfoCard
                  icon={<Package width={16} height={16} />}
                  label="Min. Order"
                  value={`${product.minimumOrderQuantity} unit${product.minimumOrderQuantity === 1 ? "" : "s"}`}
                />
              </div>

              {/* Share QR button */}
              <Button
                variant="primary"
                size="md"
                onClick={() => setShareOpen(true)}
                iconLeft={<QrCode width={15} height={15} />}
                className="self-start"
              >
                Share QR
              </Button>
            </div>
          </div>
        </div>

        {/* ── Specifications ── */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Specifications
            </h2>
            <dl className="space-y-3">
              {[
                { label: "SKU", value: product.sku },
                { label: "Barcode", value: product.meta?.barcode },
                {
                  label: "Weight",
                  value: product.weight ? `${product.weight}g` : undefined,
                },
                {
                  label: "Dimensions",
                  value: product.dimensions
                    ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
                    : undefined,
                },
                {
                  label: "Listed",
                  value: product.meta?.createdAt
                    ? formatDate(product.meta.createdAt)
                    : undefined,
                },
                {
                  label: "Last updated",
                  value: product.meta?.updatedAt
                    ? formatDate(product.meta.updatedAt)
                    : undefined,
                },
              ]
                .filter((row) => row.value)
                .map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <dt className="text-xs font-medium text-gray-400 shrink-0 pt-0.5">
                      {label}
                    </dt>
                    <dd className="text-sm text-gray-700 font-medium text-right break-all">
                      {value}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>

          {/* Share QR card preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">
                Share this product
              </h2>
              <p className="text-xs text-gray-400 max-w-[220px]">
                Generate a shareable QR card — download, print, or send the link.
              </p>
            </div>
            <div className="w-28 h-28 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <QrCode width={48} height={48} className="text-indigo-400" />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShareOpen(true)}
              iconLeft={<QrCode width={15} height={15} />}
            >
              Open Share Card
            </Button>
          </div>
        </div>

        {/* ── Reviews ── */}
        {product.reviews?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-5">
              Customer Reviews
            </h2>

            {/* Rating summary */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-gray-100">
              <div className="flex flex-col items-center justify-center gap-1 min-w-28">
                <span className="text-4xl font-bold text-gray-900">
                  {avgRating.toFixed(1)}
                </span>
                <StarRating rating={avgRating} size="md" />
                <span className="text-xs text-gray-400">
                  {product.reviews.length} reviews
                </span>
              </div>

              {ratingDist && (
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingDist[star] ?? 0;
                    const pct =
                      product.reviews.length > 0
                        ? (count / product.reviews.length) * 100
                        : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-4 text-right shrink-0">
                          {star}
                        </span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                            role="presentation"
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-6 text-right shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Review list */}
            <div className="space-y-3">
              {product.reviews.map((review, i) => (
                <ReviewCard key={i} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share QR Modal */}
      {shareOpen && (
        <ShareQRModal
          product={product}
          productUrl={productUrl}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
