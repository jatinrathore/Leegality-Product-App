import { Button } from "./ui/button";

type Props = {
  onClearFilters?: () => void;
  isFiltered?: boolean;
};

const EmptyState = ({ onClearFilters, isFiltered = false }: Props) => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] w-full text-center px-4 py-12 animate-fade-in"
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {isFiltered ? (
            <>
              <path d="M3 4h18M7 12h10M11 20h2" />
              <path d="M18 18l3 3m0-3l-3 3" opacity={0.5} />
            </>
          ) : (
            <>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M11 8v3m0 3h.01" />
            </>
          )}
        </svg>
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-1.5">
        {isFiltered ? "No products match your filters" : "No products found"}
      </h3>

      <p className="text-sm text-gray-500 max-w-xs mb-6">
        {isFiltered
          ? "Try removing some filters or adjusting your search to find what you're looking for."
          : "Something went wrong. Try refreshing the page."}
      </p>

      {isFiltered && onClearFilters && (
        <Button variant="outline" size="md" onClick={onClearFilters}>
          Clear all filters
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
