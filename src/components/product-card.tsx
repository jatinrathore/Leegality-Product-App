import { Link } from "react-router-dom";
import type { Product } from "../api/resources/product/types";
import StarRating from "./star-rating";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white shadow-md border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-36 w-full object-contain"
        />

        <div className="border-t border-gray-300 my-3" />

        <h3 className="text-sm font-bold">{product.title}</h3>

        <p className="text-sm text-gray-800 mt-1 font-semibold">
          ${product.price}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={product.rating} />

          <span className="text-gray-500 text-sm">
            ({product.rating.toFixed(1)})
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
