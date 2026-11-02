'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { useEffect, useRef } from 'react';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    // Limpia el carrito una sola vez al llegar a la confirmación.
    if (!cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
        <p className="text-6xl mb-6">✅</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          ¡Compra Exitosa!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Ver Mis Órdenes
          </Link>
          <Link
            href="/products"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
