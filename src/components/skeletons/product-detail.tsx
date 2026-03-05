const ProductDetailSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="flex justify-center items-center">
            <div className="w-155 h-130 bg-gray-200 rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="h-6 w-2/3 bg-gray-200 rounded" />
            <div className="h-5 w-1/3 bg-gray-200 rounded" />

            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />

            <div className="border-t my-4" />

            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-4/5 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
