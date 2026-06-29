import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Search, Xmark, ClockRotateRight } from "iconoir-react";

import { API } from "../api";
import { APIQueries } from "../api/queries";
import useDebounce from "../hooks/useDebounce";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { getHighlightSegments, truncate } from "../lib/utils";
import { Badge } from "./ui/badge";

import type { Product, PaginatedResponse } from "../api/resources/product/types";

const MAX_RECENT = 5;

const NavBar = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(inputValue, 300);

  const [recentSearches, setRecentSearches, clearRecentSearches] =
    useLocalStorage<string[]>("shophub-recent-searches", []);

  const isDropdownOpen =
    isFocused && (inputValue.length > 1 || recentSearches.length > 0);

  const searchQuery = useQuery<PaginatedResponse<Product>>({
    queryKey: APIQueries.products.search(debouncedSearch).queryKey,
    queryFn: () =>
      API.product.search({
        params: { q: debouncedSearch, limit: 7 },
      }),
    enabled: debouncedSearch.trim().length > 1,
    staleTime: 1000 * 60 * 5,
  });

  const products =
    debouncedSearch.length > 1 ? (searchQuery.data?.products ?? []) : [];

  const addRecentSearch = useCallback(
    (term: string) => {
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== term);
        return [term, ...filtered].slice(0, MAX_RECENT);
      });
    },
    [setRecentSearches],
  );

  const handleSelectProduct = useCallback(
    (product: Product) => {
      if (inputValue.trim()) addRecentSearch(inputValue.trim());
      setInputValue("");
      setIsFocused(false);
      navigate(`/product/${product.id}`);
    },
    [inputValue, addRecentSearch, navigate],
  );

  const handleSelectRecent = useCallback(
    (term: string) => {
      setInputValue(term);
      inputRef.current?.focus();
    },
    [],
  );

  const { activeIndex, setActiveIndex, handleKeyDown } = useKeyboardNav({
    itemCount: products.length,
    onSelect: (i) => handleSelectProduct(products[i]),
    onClose: () => setIsFocused(false),
    isOpen: isDropdownOpen,
  });

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showRecentSearches =
    isFocused && inputValue.length === 0 && recentSearches.length > 0;
  const showResults = inputValue.length > 1;
  const isSearchLoading =
    showResults && searchQuery.isFetching && !searchQuery.data;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <nav
        className="max-w-screen-xl mx-auto h-14 flex items-center gap-4 px-4 sm:px-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group"
          aria-label="ShopHub home"
        >
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-white"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zm1 0h10l2 4H5L7 2zm9 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm hidden sm:block tracking-tight">
            ShopHub
          </span>
        </Link>

        {/* Separator */}
        <div className="h-5 w-px bg-gray-200 shrink-0 hidden sm:block" aria-hidden="true" />

        {/* Search */}
        <div className="flex-1 relative max-w-xl" ref={dropdownRef}>
          <div
            className={`relative flex items-center rounded-lg border transition-all duration-200 bg-white ${
              isFocused
                ? "border-indigo-400 ring-2 ring-indigo-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Search
              width={15}
              height={15}
              className="absolute left-3 text-gray-400 flex-shrink-0 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id="global-search"
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search products…"
              autoComplete="off"
              role="combobox"
              aria-expanded={isDropdownOpen}
              aria-controls="search-listbox"
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0 ? `search-option-${activeIndex}` : undefined
              }
              className="w-full h-9 pl-9 pr-8 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue("");
                  inputRef.current?.focus();
                }}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded"
                aria-label="Clear search"
              >
                <Xmark width={14} height={14} />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div
              id="search-listbox"
              role="listbox"
              aria-label="Search results"
              className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50 animate-slide-down"
            >
              {/* Recent Searches */}
              {showRecentSearches && (
                <div>
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Recent
                    </p>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectRecent(term)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <ClockRotateRight
                        width={14}
                        height={14}
                        className="text-gray-400 shrink-0"
                      />
                      <span className="text-sm text-gray-700">{term}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Search loading */}
              {showResults && isSearchLoading && (
                <div className="px-4 py-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    Searching…
                  </div>
                </div>
              )}

              {/* No results */}
              {showResults &&
                !isSearchLoading &&
                products.length === 0 &&
                searchQuery.isFetched && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-medium text-gray-700">
                      No results for &ldquo;{inputValue}&rdquo;
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try a different search term
                    </p>
                  </div>
                )}

              {/* Results */}
              {showResults && !isSearchLoading && products.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Products
                    </p>
                  </div>
                  {products.map((product, index) => {
                    const segments = getHighlightSegments(
                      product.title,
                      inputValue,
                    );
                    return (
                      <div
                        id={`search-option-${index}`}
                        key={product.id}
                        role="option"
                        aria-selected={activeIndex === index}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => handleSelectProduct(product)}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                          activeIndex === index
                            ? "bg-indigo-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <img
                          src={product.thumbnail}
                          alt=""
                          className="w-10 h-10 object-contain rounded-lg border border-gray-100 bg-gray-50 shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium truncate">
                            {segments.map((seg, i) =>
                              seg.highlight ? (
                                <mark
                                  key={i}
                                  className="bg-yellow-100 text-yellow-800 font-semibold rounded-sm px-0.5"
                                >
                                  {seg.text}
                                </mark>
                              ) : (
                                <span key={i}>{seg.text}</span>
                              ),
                            )}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {truncate(product.description, 60)}
                          </p>
                        </div>
                        <Badge variant="muted" size="sm">
                          {product.category}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer */}
              {showResults && products.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-2.5">
                  <p className="text-xs text-gray-400 text-center">
                    Press{" "}
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-xs">
                      ↑↓
                    </kbd>{" "}
                    to navigate,{" "}
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-xs">
                      Enter
                    </kbd>{" "}
                    to select,{" "}
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-xs">
                      Esc
                    </kbd>{" "}
                    to close
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right section — avatar */}
        <div className="ml-auto shrink-0">
          <button
            className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 font-medium text-xs"
            aria-label="Account menu"
          >
            JD
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
