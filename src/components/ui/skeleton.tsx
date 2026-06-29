import clsx from "clsx";

type SkeletonProps = {
  className?: string;
  width?: string;
  height?: string;
};

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={clsx("animate-shimmer rounded", className)}
      style={{ width, height }}
    />
  );
}
