const EmptyPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-gray-500">
      <p className="text-lg font-semibold">No products match your filters</p>
      <p className="text-sm text-center">
        Try adjusting or clearing some filters to discover more products.
      </p>
    </div>
  );
};

export default EmptyPage;
