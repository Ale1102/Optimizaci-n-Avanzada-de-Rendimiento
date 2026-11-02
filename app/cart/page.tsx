'use client';

import { useCart } from '@/components/CartProvider';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Agrega productos desde nuestro catálogo.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Ver Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Carrito de Compras ({totalItems} producto{totalItems !== 1 ? 's' : ''})
      </h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
          >
            {/* Image */}
            <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
              {item.product.image_url ? (
                <Image
                  src={item.product.image_url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl">📦</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.product.id}`}
                className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {item.product.name}
              </Link>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                ${item.product.price.toFixed(2)}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg transition"
              >
                −
              </button>
              <span className="px-3 py-1 font-medium text-gray-900 dark:text-white">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg transition"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-white">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.product.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition"
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Total:</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium text-center transition"
        >
          Proceder al Pago →
        </Link>
      </div>
    </div>
  );
}
