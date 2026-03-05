import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Search, ShoppingBag, Bell, User } from "iconoir-react";

import { API } from "../api";
import { APIQueries } from "../api/queries";

import type {
  Product,
  PaginatedResponse,
} from "../api/resources/product/types";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [search, setSearch] = useState("");

  const searchQuery = useQuery<PaginatedResponse<Product>>({
    queryKey: APIQueries.products.search(search).queryKey,
    queryFn: () =>
      API.product.search({
        params: {
          q: search,
          limit: 0,
        },
      }),
    enabled: search.trim().length > 1,
  });

  const products = searchQuery.data?.products ?? [];

  return (
    <nav className="w-full bg-slate-700 min-h-14 flex justify-between items-center px-4 sm:px-8 text-white flex-wrap gap-2 sm:gap-0">
      <div className="flex items-center">
        <Link
          to="/"
          className="flex items-center font-bold text-lg gap-2 shrink-0"
        >
          <ShoppingBag width={22} height={22} />
          <p className="hidden sm:block">ShopHub</p>
        </Link>
      </div>

      <div className="relative w-52 sm:w-105 lg:w-130">
        <Search
          width={18}
          height={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search products..."
          className="w-full h-9 pl-9 pr-3 rounded-md text-black outline-none bg-white"
        />

        {search.length > 1 && (
          <div className="absolute left-0 right-0 top-full mt-2 p-2 bg-white text-black rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
            {searchQuery.isLoading && (
              <div className="p-3 text-sm text-gray-500">Searching...</div>
            )}

            {!searchQuery.isLoading && products.length === 0 && (
              <div className="p-3 text-sm text-gray-500">No products found</div>
            )}

            {products.map((product) => (
              <Link to={`/product/${product.id}`}>
                <div
                  onClick={() => {
                    setSearch("");
                  }}
                  className="p-3 border-b last:border-none hover:bg-gray-100 cursor-pointer"
                >
                  <p className="text-sm font-semibold">{product.title}</p>

                  <p className="text-xs text-gray-500 line-clamp-1">
                    {product.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-5">
        <ShoppingBag
          width={22}
          height={22}
          className="cursor-pointer hidden sm:block"
        />
        <Bell
          width={22}
          height={22}
          className="cursor-pointer hidden sm:block"
        />
        <User width={22} height={22} className="cursor-pointer" />
      </div>
    </nav>
  );
};

export default NavBar;
