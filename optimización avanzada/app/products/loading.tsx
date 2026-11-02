export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="skeleton h-8 w-64 mb-2" />
        <div className="skeleton h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <div className="skeleton aspect-square" />
            <div className="p-4 space-y-3">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-6 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
