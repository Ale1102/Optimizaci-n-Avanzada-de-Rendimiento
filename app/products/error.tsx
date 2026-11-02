'use client';

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <p className="text-6xl mb-4">⚠️</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Error al cargar productos
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {error.message || 'Ocurrió un error inesperado al cargar el catálogo.'}
        </p>
        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
