import { Skeleton } from "../ui/skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-indigo-50 px-4 py-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Left — image */}
            <div>
              <Skeleton className="w-full aspect-square rounded-xl" />
              <div className="flex gap-2 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-16 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Right — info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <Skeleton className="h-8 w-4/5" />
              <Skeleton className="h-6 w-1/2" />

              {/* Price */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>

              {/* Rating */}
              <Skeleton className="h-5 w-36" />

              <Skeleton className="h-px w-full" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Info pills */}
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
