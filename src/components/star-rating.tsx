import { Star, StarSolid } from "iconoir-react";

type Props = {
  rating: number;
};

const StarRating = ({ rating }: Props) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.1;

  return (
    <div className="flex items-center gap-[2px]">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarSolid key={`full-${i}`} className="w-4 h-4 text-yellow-500" />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative w-4 h-4">
          <Star className="absolute w-4 h-4 text-yellow-500" />
          <div className="absolute overflow-hidden w-1/2">
            <StarSolid className="w-4 h-4 text-yellow-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StarRating;
