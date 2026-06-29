import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "../routes";
import ProductDetailSkeleton from "../components/skeletons/product-detail";

const ProductListPage = lazy(() => import("../pages/product-list"));
const ProductDetailPage = lazy(() => import("../pages/product-detail"));

const ListFallback = () => (
  <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto">
    <div className="h-7 w-32 bg-gray-200 rounded animate-shimmer mb-5" />
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 h-64 animate-shimmer" />
      ))}
    </div>
  </div>
);

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path={routes.products}
        element={
          <Suspense fallback={<ListFallback />}>
            <ProductListPage />
          </Suspense>
        }
      />
      <Route
        path={routes.productDetails}
        element={
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetailPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
