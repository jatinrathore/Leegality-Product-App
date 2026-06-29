import { Skeleton } from "../ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      {/* Image */}
      <Skeleton className="h-44 w-full rounded-lg" />

      {/* Brand + category */}
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Price + discount */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>

      {/* Rating */}
      <Skeleton className="h-4 w-24" />
    </div>
  );
};

export default ProductCardSkeleton;
