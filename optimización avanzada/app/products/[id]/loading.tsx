export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="skeleton h-5 w-40 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="skeleton aspect-square rounded-xl" />
        <div className="space-y-6">
          <div className="skeleton h-8 w-3/4" />
          <div className="space-y-2">
            <div className="skeleton h-5 w-full" />
            <div className="skeleton h-5 w-full" />
            <div className="skeleton h-5 w-2/3" />
          </div>
          <div className="skeleton h-10 w-32" />
          <div className="skeleton h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
