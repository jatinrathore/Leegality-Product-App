import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductListPage from "../pages/product-list";
import ProductDetailPage from "../pages/product-detail";
import { routes } from "../routes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.products} element={<ProductListPage />} />
        <Route path={routes.productDetails} element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
