import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API } from "../api";
import { APIQueries } from "../api/queries";

import StarRating from "../components/star-rating";

import { ArrowLeft, ArrowRight } from "iconoir-react";

import type { Product } from "../api/resources/product/types";
import ProductDetailSkeleton from "../components/skeletons/product-detail";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [imageIndex, setImageIndex] = useState(0);

  const productQuery = useQuery<Product>({
    queryKey: APIQueries.products.detail(id!).queryKey,
    queryFn: () => API.product.detail({ urlParams: { id: id || "" } }),
    enabled: !!id,
  });

  const product = productQuery.data;

  if (productQuery.isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-gray-600">
        <p className="text-xl font-semibold text-gray-800">Product not found</p>

        <p className="text-sm mt-2 max-w-sm">
          The product you're looking for might have been removed or does not
          exist.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 rounded-md bg-gray-800 text-white text-sm hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail];

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <button
              className="px-3 py-1 shadow shadow-gray-400 cursor-pointer rounded flex items-center gap-1 mb-9"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft height={16} /> Back
            </button>
            <div className="relative flex flex-col items-center">
              <div className="relative flex justify-center items-center w-full">
                <img
                  src={images[imageIndex]}
                  alt={product.title}
                  className="max-h-105 object-contain"
                />

                {images.length > 1 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-slate-100 cursor-pointer shadow p-1 md:p-2 rounded-full hover:bg-gray-200"
                  >
                    <ArrowLeft height={20} />
                  </button>
                )}

                {images.length > 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-slate-100 cursor-pointer shadow p-1 md:p-2 rounded-full hover:bg-gray-200"
                  >
                    <ArrowRight height={20} />
                  </button>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setImageIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        imageIndex === index
                          ? "bg-gray-800 scale-110"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{product.title}</h1>

            <div className="flex items-center gap-3 mt-3">
              <p className="text-xl font-bold">${product.price}</p>

              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} />
                <span className="text-sm text-gray-500">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-semibold text-gray-800">Brand:</span>{" "}
                {product.brand}
              </p>

              <p>
                <span className="font-semibold text-gray-800">Category:</span>{" "}
                {product.category}
              </p>
            </div>

            <div className="border-t my-6" />

            <div>
              <h2 className="font-semibold text-lg mb-2">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t my-6" />

            <div>
              <h2 className="font-semibold text-lg mb-3">Reviews</h2>

              {product.reviews?.length ? (
                <div className="space-y-4">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {review.reviewerName}
                        </span>

                        <StarRating rating={review.rating} />

                        <span className="text-gray-500">
                          ({review.rating.toFixed(1)})
                        </span>
                      </div>

                      <p className="text-gray-600 mt-1">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No reviews available for this product.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
