'use client';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <p className="text-6xl mb-4">💳</p>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Error en el Checkout
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {error.message || 'Ocurrió un error al procesar tu compra.'}
      </p>
      <button
        onClick={reset}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
      >
        Reintentar
      </button>
    </div>
  );
}
