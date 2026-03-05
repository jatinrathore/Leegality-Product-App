const ProductSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="h-36 bg-gray-200 rounded mb-3" />

      <div className="border-t border-gray-200 my-3" />

      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />

      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />

      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  );
};

export default ProductSkeleton;
