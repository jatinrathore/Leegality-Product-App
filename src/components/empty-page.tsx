const EmptyPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-gray-500">
      <p className="text-lg font-semibold">No products found</p>
      <p className="text-sm">Try changing filters or come back later.</p>
    </div>
  );
};

export default EmptyPage;
