import { Skeleton } from "../ui/skeleton";

const widths = ["w-3/5", "w-4/5", "w-2/3", "w-3/4", "w-1/2", "w-4/5", "w-3/5", "w-2/3"];

const FilterSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-2.5" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
          <Skeleton className={`h-3.5 ${widths[i % widths.length]}`} />
        </div>
      ))}
    </div>
  );
};

export default FilterSkeleton;
