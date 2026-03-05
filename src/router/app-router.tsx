import { Route, Routes } from "react-router-dom";
import ProductDetailPage from "../pages/product-detail";
import ProductListPage from "../pages/product-list";
import { routes } from "../routes";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={routes.products} element={<ProductListPage />} />
      <Route path={routes.productDetails} element={<ProductDetailPage />} />
    </Routes>
  );
}
