import clsx from "clsx";

type Props = {
  rating: number;
  size?: "sm" | "md" | "lg";
  showEmpty?: boolean;
};

const TOTAL = 5;

const sizeClasses = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const StarIcon = ({
  fill,
  className,
}: {
  fill: "full" | "half" | "empty";
  className?: string;
}) => {
  const id = `half-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {fill === "half" && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={
          fill === "full"
            ? "#f59e0b"
            : fill === "half"
              ? `url(#${id})`
              : "#e5e7eb"
        }
        stroke={fill === "empty" ? "#e5e7eb" : "none"}
        strokeWidth="0"
      />
    </svg>
  );
};

const StarRating = ({ rating, size = "md", showEmpty = true }: Props) => {
  const sizeClass = sizeClasses[size];
  const stars = Array.from({ length: TOTAL }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating);
    const half = !filled && i < rating && rating - i > 0.1;
    return filled ? "full" : half ? "half" : "empty";
  });

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {stars.map((fill, i) =>
        showEmpty || fill !== "empty" ? (
          <StarIcon
            key={i}
            fill={fill}
            className={clsx(sizeClass, "flex-shrink-0")}
          />
        ) : null,
      )}
    </div>
  );
};

export default StarRating;
